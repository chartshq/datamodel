import { FilteringMode } from './enums';
import { getUniqueId } from './utils';
import { updateFields, cloneWithSelect, cloneWithProject, updateData } from './helper';
import { crossProduct, difference, naturalJoinFilter, union } from './operator';

/**
 * Relation provides the definitions of basic operators of relational algebra like *selection*, *projection*, *union*,
 * *difference* etc.
 *
 * It is extended by {@link DataModel} to inherit the functionalities of relational algebra concept.
 *
 * @class
 * @public
 * @module Relation
 * @namespace DataModel
 */
class Relation {

    /**
     * Creates a new Relation instance by providing underlying data and schema.
     *
     * @private
     *
     * @param {Object | string | Relation} data - The input tabular data in dsv or json format or
     * an existing Relation instance object.
     * @param {Array} schema - An array of data schema.
     * @param {Object} [options] - The optional options.
     */
    constructor (...params) {
        let source;

        this._parent = null;
        this._derivation = [];
        this._ancestorDerivation = [];
        this._children = [];

        if (params.length === 1 && ((source = params[0]) instanceof Relation)) {
            // parent datamodel was passed as part of source
            this._colIdentifier = source._colIdentifier;
            this._rowDiffset = source._rowDiffset;
            this._dataFormat = source._dataFormat;
            this._parent = source;
            this._partialFieldspace = this._parent._partialFieldspace;
            this._fieldStoreName = getUniqueId();
            this.__calculateFieldspace().calculateFieldsConfig();
        } else {
            updateData(this, ...params);
            this._fieldStoreName = this._partialFieldspace.name;
            this.__calculateFieldspace().calculateFieldsConfig();
            this._propagationNameSpace = {
                mutableActions: {},
                immutableActions: {}
            };
        }
    }

    /**
     * Retrieves the {@link Schema | schema} details for every {@link Field | field} as an array.
     *
     * @public
     *
     * @return {Array.<Schema>} Array of fields schema.
     *      ```
     *      [
     *          { name: 'Name', type: 'dimension' },
     *          { name: 'Miles_per_Gallon', type: 'measure', numberFormat: (val) => `${val} miles / gallon` },
     *          { name: 'Cylinder', type: 'dimension' },
     *          { name: 'Displacement', type: 'measure', defAggFn: 'max' },
     *          { name: 'HorsePower', type: 'measure', defAggFn: 'max' },
     *          { name: 'Weight_in_lbs', type: 'measure', defAggFn: 'avg',  },
     *          { name: 'Acceleration', type: 'measure', defAggFn: 'avg' },
     *          { name: 'Year', type: 'dimension', subtype: 'datetime', format: '%Y' },
     *          { name: 'Origin' }
     *      ]
     *      ```
     */
    getSchema () {
        return this.getFieldspace().fields.map(d => d.schema());
    }

    /**
     * Returns the name of the {@link DataModel} instance. If no name was specified during {@link DataModel}
     * initialization, then it returns a auto-generated name.
     *
     * @public
     *
     * @return {string} Name of the DataModel instance.
     */
    getName() {
        return this._fieldStoreName;
    }

    getFieldspace () {
        return this._fieldspace;
    }

    __calculateFieldspace () {
        this._fieldspace = updateFields([this._rowDiffset, this._colIdentifier],
             this.getPartialFieldspace(), this._fieldStoreName);
        return this;
    }

    getPartialFieldspace () {
        return this._partialFieldspace;
    }

    /**
     * Performs {@link link_of_cross_product | cross-product} between two {@link DataModel} instances and returns a
     * new {@link DataModel} instance containing the results. This operation is also called theta join.
     *
     * Cross product takes two set and create one set where each value of one set is paired with each value of another
     * set.
     *
     * This method takes an optional predicate which filters the generated result rows. If the predicate returns true
     * the combined row is included in the resulatant table.
     *
     * @example
     *  let originDM = dm.project(['Origin','Origin_Formal_Name']);
     *  let carsDM = dm.project(['Name','Miles_per_Gallon','Origin'])
     *
     *  console.log(carsDM.join(originDM)));
     *
     *  console.log(carsDM.join(originDM,
     *      obj => obj.[originDM.getName()].Origin === obj.[carsDM.getName()].Origin));
     *
     * @text
     * This is chained version of `join` operator. `join` can also be used as
     * {@link link_to_join_op | functional operator}.
     *
     * @public
     *
     * @param {DataModel} joinWith - The DataModel to be joined with the current instance DataModel.
     * @param {SelectionPredicate} filterFn - The predicate function that will filter the result of the crossProduct.
     *
     * @return {DataModel} New DataModel instance created after joining.
     */
    join (joinWith, filterFn) {
        return crossProduct(this, joinWith, filterFn);
    }

    /**
     * {@link natural_join | Natural join} is a special kind of cross-product join where filtering of rows are performed
     * internally by resolving common fields are from both table and the rows with common value are included.
     *
     * @example
     *  let originDM = dm.project(['Origin','Origin_Formal_Name']);
     *  let carsDM = dm.project(['Name','Miles_per_Gallon','Origin'])
     *
     *  console.log(carsDM.naturalJoin(originDM));
     *
     * @text
     * This is chained version of `naturalJoin` operator. `naturalJoin` can also be used as
     * {@link link_to_join_op | functional operator}.
     *
     * @public
     *
     * @param {DataModel} joinWith - The DataModel with which the current instance of DataModel on which the method is
     *      called will be joined.
     * @return {DataModel} New DataModel instance created after joining.
     */
    naturalJoin (joinWith) {
        return crossProduct(this, joinWith, naturalJoinFilter(this, joinWith), true);
    }

    /**
     * {@link link_to_union | Union} operation can be termed as vertical stacking of all rows from both the DataModel
     * instances, provided that both of the {@link DataModel} instances should have same column names.
     *
     * @example
     * console.log(EuropeanMakerDM.union(USAMakerDM));
     *
     * @text
     * This is chained version of `naturalJoin` operator. `naturalJoin` can also be used as
     * {@link link_to_join_op | functional operator}.
     *
     * @public
     *
     * @param {DataModel} unionWith - DataModel instance for which union has to be applied with the instance on which
     *      the method is called
     *
     * @return {DataModel} New DataModel instance with the result of the operation
     */
    union (unionWith) {
        return union(this, unionWith);
    }

    /**
     * {@link link_to_difference | Difference } operation only include rows which are present in the datamodel on which
     * it was called but not on the one passed as argument.
     *
     * @example
     * console.log(highPowerDM.difference(highExpensiveDM));
     *
     * @text
     * This is chained version of `naturalJoin` operator. `naturalJoin` can also be used as
     * {@link link_to_join_op | functional operator}.
     *
     * @public
     *
     * @param {DataModel} differenceWith - DataModel instance for which difference has to be applied with the instance
     *      on which the method is called
     * @return {DataModel} New DataModel instance with the result of the operation
     */
    difference (differenceWith) {
        return difference(this, differenceWith);
    }

    /**
     * {@link link_to_selection | Selection} is a row filtering operation. It expects a predicate and an optional mode
     * which control which all rows should be included in the resultant DataModel instance.
     *
     * {@link SelectionPredicate} is a function which returns a boolean value. For selection operation the selection
     * function is called for each row of DataModel instance with the current row passed as argument.
     *
     * After executing {@link SelectionPredicate} the rows are labeled as either an entry of selection set or an entry
     * of rejection set.
     *
     * {@link FilteringMode} operates on the selection and rejection set to determine which one would reflect in the
     * resultant datamodel.
     *
     * @warning
     * Selection and rejection set is only a logical idea for concept explanation purpose.
     *
     * @example
     *  // with selection mode NORMAL:
     *  const normDt = dt.select(fields => fields.Origin.value === "USA")
     *  console.log(normDt));
     *
     * // with selection mode INVERSE:
     * const inverDt = dt.select(fields => fields.Origin.value === "USA", { mode: DataModel.FilteringMode.INVERSE })
     * console.log(inverDt);
     *
     * // with selection mode ALL:
     * const dtArr = dt.select(fields => fields.Origin.value === "USA", { mode: DataModel.FilteringMode.ALL })
     * // print the selected parts
     * console.log(dtArr[0]);
     * // print the inverted parts
     * console.log(dtArr[1]);
     *
     * @text
     * This is chained version of `select` operator. `select` can also be used as
     * {@link link_to_join_op | functional operator}.
     *
     * @public
     *
     * @param {Function} selectFn - The predicate function which is called for each row with the current row.
     * ```
     *  function (row, i, cloneProvider, store)  { ... }
     * ```
     * @param {Object} config - The configuration object to control the inclusion exclusion of a row in resultant
     * DataModel instance.
     * @param {FilteringMode} [config.mode=FilteringMode.NORMAL] - The mode of the selection.
     * @return {DataModel} Returns the new DataModel instance(s) after operation.
     */
    select (selectFn, config) {
        const defConfig = {
            mode: FilteringMode.NORMAL,
            saveChild: true
        };
        config = Object.assign({}, defConfig, config);

        const cloneConfig = { saveChild: config.saveChild };
        let oDm;

        if (config.mode === FilteringMode.ALL) {
            const selectDm = cloneWithSelect(
                this,
                selectFn,
                { mode: FilteringMode.NORMAL },
                cloneConfig
            );
            const rejectDm = cloneWithSelect(
                this,
                selectFn,
                { mode: FilteringMode.INVERSE },
                cloneConfig
            );
            oDm = [selectDm, rejectDm];
        } else {
            oDm = cloneWithSelect(
                this,
                selectFn,
                config,
                cloneConfig
            );
        }

        return oDm;
    }

    /**
     * Retrieves a boolean value if the current {@link DataModel} instance has data.
     *
     * @example
     * const schema = [
     *    { name: 'CarName', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     * const data = [];
     *
     * const dt = new DataModel(data, schema);
     * console.log(dt.isEmpty());
     *
     * @public
     *
     * @return {Boolean} True if the datamodel has no data, otherwise false.
     */
    isEmpty () {
        return !this._rowDiffset.length || !this._colIdentifier.length;
    }

    /**
     * Creates a clone from the current DataModel instance with child parent relationship.
     *
     * @private
     * @param {boolean} [saveChild=true] - Whether the cloned instance would be recorded in the parent instance.
     * @return {DataModel} - Returns the newly cloned DataModel instance.
     */
    clone (saveChild = true) {
        const clonedDm = new this.constructor(this);
        if (saveChild) {
            clonedDm.setParent(this);
        } else {
            clonedDm.setParent(null);
        }
        return clonedDm;
    }

    /**
     * {@link Projection} is filter column (field) operation. It expects list of fields' name and either include those
     * or exclude those based on {@link FilteringMode} on the resultant variable.
     *
     * Projection expects array of fields name based on which it creates the selection and rejection set. All the field
     * whose name is present in array goes in selection set and rest of the fields goes in rejection set.
     *
     * {@link FilteringMode} operates on the selection and rejection set to determine which one would reflect in the
     * resulatant datamodel.
     *
     * @warning
     * Selection and rejection set is only a logical idea for concept explanation purpose.
     *
     * @example
     *  const dm = new DataModel(data, schema);
     *
     *  // with projection mode NORMAL:
     *  const normDt = dt.project(["Name", "HorsePower"]);
     *  console.log(normDt.getData());
     *
     *  // with projection mode INVERSE:
     *  const inverDt = dt.project(["Name", "HorsePower"], { mode: DataModel.FilteringMode.INVERSE })
     *  console.log(inverDt.getData());
     *
     *  // with selection mode ALL:
     *  const dtArr = dt.project(["Name", "HorsePower"], { mode: DataModel.FilteringMode.ALL })
     *  // print the normal parts
     *  console.log(dtArr[0].getData());
     *  // print the inverted parts
     *  console.log(dtArr[1].getData());
     *
     * @text
     * This is chained version of `select` operator. `select` can also be used as
     * {@link link_to_join_op | functional operator}.
     *
     * @public
     *
     * @param {Array.<string | Regexp>} projField - An array of column names in string or regular expression.
     * @param {Object} [config] - An optional config to control the creation of new DataModel
     * @param {FilteringMode} [config.mode=FilteringMode.NORMAL] - Mode of the projection
     *
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    project (projField, config) {
        const defConfig = {
            mode: FilteringMode.NORMAL,
            saveChild: true
        };
        config = Object.assign({}, defConfig, config);
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
        let dataModel;

        if (mode === FilteringMode.ALL) {
            let projectionClone = cloneWithProject(this, normalizedProjField, {
                mode: FilteringMode.NORMAL,
                saveChild: config.saveChild
            }, allFields);
            let rejectionClone = cloneWithProject(this, normalizedProjField, {
                mode: FilteringMode.INVERSE,
                saveChild: config.saveChild
            }, allFields);
            dataModel = [projectionClone, rejectionClone];
        } else {
            let projectionClone = cloneWithProject(this, normalizedProjField, config, allFields);
            dataModel = projectionClone;
        }

        return dataModel;
    }

    getFieldsConfig () {
        return this._fieldConfig;
    }

    calculateFieldsConfig () {
        this._fieldConfig = this._fieldspace.fields.reduce((acc, fieldDef, i) => {
            acc[fieldDef.name()] = {
                index: i,
                def: { name: fieldDef.name(), type: fieldDef.type(), subtype: fieldDef.subtype() }
            };
            return acc;
        }, {});
        return this;
    }


    /**
     * Frees up the resources associated with the current DataModel instance and breaks all the links instance has in
     * the DAG.
     *
     * @public
     */
    dispose () {
        this._parent && this._parent.removeChild(this);
        this._parent = null;
        this._children.forEach((child) => {
            child._parent = null;
        });
        this._children = [];
    }

    /**
     * Removes the specified child {@link DataModel} from the child list of the current {@link DataModel} instance.
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(data, schema);
     *
     * const dt2 = dt.select(fields => fields.Origin.value === "USA")
     * dt.removeChild(dt2);
     *
     * @private
     *
     * @param {DataModel} child - Delegates the parent to remove this child.
     */
    removeChild (child) {
        let idx = this._children.findIndex(sibling => sibling === child);
        idx !== -1 ? this._children.splice(idx, 1) : true;
    }

    /**
     * Sets the specified {@link DataModel} as a parent for the current {@link DataModel} instance.
     *
     * @param {DataModel} parent - The datamodel instance which will act as parent.
     */
    setParent (parent) {
        this._parent && this._parent.removeChild(this);
        this._parent = parent;
        parent && parent._children.push(this);
    }

    /**
     * Returns the parent {@link DataModel} instance.
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(data, schema);
     *
     * const dt2 = dt.select(fields => fields.Origin.value === "USA");
     * const parentDm = dt2.getParent();
     *
     * @return {DataModel} Returns the parent DataModel instance.
     */
    getParent () {
        return this._parent;
    }

    /**
     * Returns the immediate child {@link DataModel} instances.
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(data, schema);
     *
     * const childDm1 = dt.select(fields => fields.Origin.value === "USA");
     * const childDm2 = dt.select(fields => fields.Origin.value === "Japan");
     * const childDm3 = dt.groupBy(["Origin"]);
     *
     * @return {DataModel[]} Returns the immediate child DataModel instances.
     */
    getChildren () {
        return this._children;
    }

    /**
     * Returns the in-between operation meta data while creating the current {@link DataModel} instance.
     *
     * @example
     * const schema = [
     *   { name: 'Name', type: 'dimension' },
     *   { name: 'HorsePower', type: 'measure' },
     *   { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *   { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *   { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *   { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *   { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(data, schema);
     * const dt2 = dt.select(fields => fields.Origin.value === "USA");
     * const dt3 = dt2.groupBy(["Origin"]);
     * const derivations = dt3.getDerivations();
     *
     * @return {Any[]} Returns the derivation meta data.
     */
    getDerivations () {
        return this._derivation;
    }

    /**
     * Returns the in-between operation meta data happened from root {@link DataModel} to current instance.
     *
     * @example
     * const schema = [
     *   { name: 'Name', type: 'dimension' },
     *   { name: 'HorsePower', type: 'measure' },
     *   { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *   { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *   { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *   { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *   { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(data, schema);
     * const dt2 = dt.select(fields => fields.Origin.value === "USA");
     * const dt3 = dt2.groupBy(["Origin"]);
     * const ancDerivations = dt3.getAncestorDerivations();
     *
     * @return {Any[]} Returns the previous derivation meta data.
     */
    getAncestorDerivations () {
        return this._ancestorDerivation;
    }
}

export default Relation;
