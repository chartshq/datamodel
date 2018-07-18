import { SelectionMode, ProjectionMode } from 'picasso-util';
import { persistDerivation, updateFields, selectHelper, normalizedMutationTarget } from './helper';
import {
    crossProduct,
    difference,
    naturalJoinFilter,
    union,
    calculatedMeasureIterator,
    groupByIterator,
    projectIterator,
    selectIterator
} from './operator';
import { DM_DERIVATIVES } from './constants';
import createFields from './field-creator';
import defaultConfig from './default-config';
import * as converter from './converter';
import fieldStore from './field-store';

/**
 * Provides the relation algebra logics.
 */
class Relation {

    /**
     * If passed any data this will create a field array and will create
     * a field store with these fields in global space which can be used
     * by other functions for calculations and other operations on data
     *
     * @param {Object | string | Relation} data - The input tabular data in csv or json format or
     * an existing Relation instance object.
     * @param {Array} schema - An array of data schema.
     * @param {string} [name] - The name of the DataModel instance, if not provided will assign a random name.
     * @param {Object} [options] - The optional options.
     */
    constructor(data, schema, name, options) {
        this._parent = null;
        this._derivation = [];
        this._children = [];

        if (data instanceof Relation) {
            // parent datamodel was passed as part of source
            const source = data;

            this._colIdentifier = source._colIdentifier;
            this._rowDiffset = source._rowDiffset;
            this._parent = source;
            this._partialFieldspace = this._parent._partialFieldspace;
            this._fieldspace = source._fieldspace;

            this.calculateFieldspace().calculateFieldsConfig();
        } else {
            if (!data) {
                throw new Error('Data not specified');
            }

            this._updateData(data, schema, name, options);
            this.calculateFieldspace().calculateFieldsConfig();
        }
    }

    /**
     * Returns the schema details for all fields.
     *
     * @public
     * @return {Array} Returns an array of field schema.
     */
    getSchema () {
        return this.getFieldspace().fields.map(d => d.schema);
    }

    getFieldspace () {
        return this._fieldspace;
    }

    calculateFieldspace () {
        this._fieldspace = updateFields([this._rowDiffset, this._colIdentifier], this.getPartialFieldspace());
        return this;
    }

    getPartialFieldspace () {
        return this._partialFieldspace;
    }

    _updateData (data, schema, name, options) {
        options = Object.assign(Object.assign({}, defaultConfig), options);
        const converterFn = converter[options.dataFormat];

        if (!(converterFn && typeof converterFn === 'function')) {
            throw new Error(`No converter function found for ${options.dataFormat} format`);
        }

        const [header, formattedData] = converterFn(data, options);
        const fieldArr = createFields(formattedData, schema, header);

        // This will create a new fieldStore with the fields
        const nameSpace = fieldStore.createNamespace(fieldArr, name);
        this._partialFieldspace = nameSpace;
        // If data is provided create the default colIdentifier and rowDiffset
        this._rowDiffset = `0-${formattedData[0] ? (formattedData[0].length - 1) : 0}`;
        this._colIdentifier = (schema.map(_ => _.name)).join();
        return this;
    }

    /**
     * this reflect the cross-product of the relational algebra or can be called as theta join.
     * It take another DataModel instance and create new DataModel with the cross-product data and
     * filter the data according to the filter function provided.
     * Say there are two dataModel modelA with 4 column 5 rows and modelB with 3 column 6 row
     * so the new DataModel modelA X modelB will have 7(4 + 3) rows and 30(5 * 6) columns (if no
     * filter function is provided).
     *
     * @todo Make this API user-friendly.
     *
     * @public
     * @param  {DataModel} joinWith The DataModel to be joined with this DataModel
     * @param  {Function} filterFn Function that will filter the result of the crossProduct
     * DataModel
     * @return {DataModel}          the new DataModel created by joining
     */
    join (joinWith, filterFn) {
        return crossProduct(this, joinWith, filterFn);
    }

    /**
     * This can join two DataModel to form a new DataModel which meet the requirement of
     * natural join.
     * it's not possible to pass a filter function as the filter function is decided according to
     * the definition of natural join
     *
     * @todo Make this API user-friendly.
     *
     * @public
     * @param  {DataModel} joinWith the DataModel with whom this DataModel will be joined
     * @return {DataModel}          The new joined DataModel
     */
    naturalJoin (joinWith) {
        return crossProduct(this, joinWith, naturalJoinFilter(this, joinWith), true);
    }

    /**
     * Performs union operation of the relational algebra.
     * It can be termed as vertical joining of all the unique tuples
     * from both the DataModel instances. The requirement is both
     * the DataModel instances should have same column name and order.
     *
     * @public
     * @param {DataModel} unionWith - Another DataModel instance to which union
     * operation is performed.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    union (unionWith) {
        return union(this, unionWith);
    }

    /**
     * Performs difference operation of the relational algebra.
     * It can be termed as vertical joining of all the tuples
     * those are not in the second DataModel. The requirement
     * is both the DataModel instances should have same column name and order.
     *
     * @public
     * @param {DataModel} differenceWith - Another DataModel instance to which difference
     * operation is performed.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    difference (differenceWith) {
        return difference(this, differenceWith);
    }

    /**
     * Performs selection operation of the relational algebra.
     * If an existing DataModel instance is passed in the last argument,
     * then it mutates the that DataModel instead of cloning a new one.
     *
     * @public
     * @param {Function} selectFn - The function which will be looped through all the data
     * if it return true the row will be there in the DataModel.
     * @param {Object} [config={}] - The mode configuration.
     * @param {string} config.mode - The mode of the selection.
     * @param {string} [saveChild=true] - It is used while cloning.
     * @param {DataModel} [existingDataModel] - An optional existing DataModel instance.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    select (selectFn, config = { saveChild: true, mutationTarget: null }) {
        let clonedDM;
        let respDM;
        let rowDiffset;
        let selectClone;
        let rejectClone;

        if (config.mode === SelectionMode.ALL) {
            selectClone = this.clone();
            rowDiffset = selectHelper(selectClone._rowDiffset, selectClone.getPartialFieldspace().fields, selectFn, {});
            selectClone._rowDiffset = rowDiffset;

            rejectClone = this.clone();
            rowDiffset = selectHelper(rejectClone._rowDiffset, rejectClone.getPartialFieldspace().fields, selectFn, {
                mode: SelectionMode.INVERSE,
            });
            rejectClone._rowDiffset = rowDiffset;
            // Return an array with both selections
            return [selectClone, rejectClone];
        }

        let target = normalizedMutationTarget(this, config.mutationTarget, DM_DERIVATIVES.SELECT);

        if (target) {
            rowDiffset = selectHelper(this._rowDiffset, this.getPartialFieldspace().fields, selectFn, config);
            config.mutationTarget.__mutate('rowDiffset', rowDiffset);
            target._derivation[0].criteria = selectFn;
            respDM = target;
        } else {
            clonedDM = this.clone(config.saveChild);
            rowDiffset = selectHelper(clonedDM._rowDiffset, clonedDM.getPartialFieldspace().fields, selectFn, config);
            clonedDM._rowDiffset = rowDiffset;
            respDM = clonedDM;
        }

        // Store reference to child model and selector function
        if (config.saveChild && !target) {
            persistDerivation(respDM, DM_DERIVATIVES.SELECT, { config }, selectFn);
        }

        return respDM;
    }

    /**
     * Sets the selection to the current DataModel instance.
     *
     * @param {Array} fields - The fields array.
     * @param {Function} selectFn - The filter function.
     * @param {Object} config - The mode configuration object.
     * @param {string} config.mode - The type of mode to use.
     * @return {string} Returns the Row diffset.
     */


    _isEmpty () {
        return !this.rowDiffset.length || !this.colIdentifier.length;
    }

    /**
     * Creates a clone  from the current DataModel instance with child parent relationship.
     *
     * @public
     * @param {boolean} [saveChild=true] - Whether the cloned instance would be recorded
     * in the parent instance.
     * @return {DataModel} - Returns the newly cloned DataModel instance.
     */
    clone (saveChild = true) {
        const retDataModel = new this.constructor(this);
        if (saveChild) {
            this._children.push(retDataModel);
        }
        return retDataModel;
    }

    /**
     * Performs projection operation on the current DataModel instance.
     *
     * @public
     * @param {Array.<string | Regexp>} projField - An array of column names in string or regular expression.
     * @param {Object} [config={}] - An optional config.
     * @param {boolean} [saveChild=true] - It is used while cloning.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    project (projField, config = { saveChild: true }) {
        const fieldConfig = this.getFieldsConfig();
        const allFields = Object.keys(fieldConfig);
        const { mode } = config;

        let normalizedProjField = projField.reduce((acc, field) => {
            if (field.constructor.name === 'RegExp') {
                acc.push(...allFields.filter(fieldName => fieldName.search(field) !== -1));
            } else if (field in fieldConfig) {
                acc.push(field);
            }
            return acc;
        }, []);
        normalizedProjField = Array.from(new Set(normalizedProjField)).map(field => field.trim());
        if (mode === ProjectionMode.EXCLUDE) {
            const rejectionSet = allFields.filter(fieldName => normalizedProjField.indexOf(fieldName) === -1);
            normalizedProjField = rejectionSet;
        }

        const clone = this.clone(config.saveChild);
        // const projString = normalizedProjField.join(',');
        // const presentField = allFields.filter(field =>
        //     projString.search(new RegExp(`^${field}\\,|\\,${field}\\,|\\,${field}$|^${field}$`, 'i')) !== -1);
        // clone._colIdentifier = presentField.join(',');
        clone._colIdentifier = normalizedProjField.join(',');

        clone.calculateFieldspace().calculateFieldsConfig();

        if (config.saveChild) {
            persistDerivation(
                clone,
                DM_DERIVATIVES.PROJECT,
                { projField, config, projString: normalizedProjField.join(',') },
                null
            );
        }

        return clone;
    }

    /**
     * Returns index and field details in an object where key is the field name.
     *
     * @public
     * @return {Object} - Returns the field definitions.
     */
    getFieldsConfig () {
        return this._fieldConfig;
    }

    calculateFieldsConfig () {
        this._fieldConfig = this._fieldspace.fields.reduce((acc, fieldDef, i) => {
            acc[fieldDef.name] = {
                index: i,
                def: { name: fieldDef._ref.name, type: fieldDef._ref.fieldType }
            };
            return acc;
        }, {});
        return this;
    }


    /*
     * Mutates a property of the current DataModel instance with a new value.
     *
     * @public
     * @param {string} key - The property name to be changed.
     * @param {string} value - The new value of the property.
     * @return {DataModel} Returns the current DataModel instance itself.
     */
    __mutate (key, value) {
        const nKey = `_${key}`;
        this[nKey] = value;
        selectIterator(this, (model, fn) => {
            this.select(fn, { saveChild: false, mutationTarget: model });
        });

        projectIterator(this, (model) => {
            model.__mutate(key, value);
        });

        calculatedMeasureIterator(this, (model, params) => {
            model[key] = value;
            this.__createMeasure(...[...params, false, model]);
        });

        groupByIterator(this, (model, params) => {
            this.groupBy(...[params.groupByString.split(','), params.reducer], false, model);
        });

        this.calculateFieldspace().calculateFieldsConfig();
        return this;
    }

    /**
     * break the link between its parent and itself
     */
    dispose() {
        this._parent.removeChild(this);
        this._parent = null;
    }

    /**
     *
     * @param {DataModel} child : Delegates the parent to remove this child
     */
    removeChild(child) {
        // remove from child list
        let idx = this._children.findIndex(sibling => sibling === child);
        idx !== -1 ? this._children.splice(idx, 1) : true;
    }
    /**
     *
     * @param { DataModel } parent datamodel instance which will act as its parent of this.
     * @param { Queue } criteriaQueue Queue contains in-between operation meta-data
     */
    addParent(parent, criteriaQueue = []) {
        persistDerivation(this, DM_DERIVATIVES.COMPOSE, null, criteriaQueue);
        this._parent = parent;
        parent._children.push(this);
    }
}

export default Relation;
