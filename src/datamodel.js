/* eslint-disable default-case */

import { FieldType, ProjectionMode, SelectionMode, DimensionSubtype } from 'picasso-util';
import { DM_DERIVATIVES, PROPAGATION, ROW_ID } from './constants';
import { Categorical, Measure, DateTime } from './fields';
import { createBuckets,
    crossProduct,
    dataBuilder,
    difference,
    naturalJoinFilter,
    rowDiffsetIterator,
    union,
    groupBy,
    calculatedMeasureIterator,
    groupByIterator,
    projectIterator,
    selectIterator } from './operator';
import Relation from './relation';
import reducerStore from './utils/reducer';
import Field from './fields/field';
import fieldStore from './field-store';


/**
 * A model which has been built on the concept of relational algebra.
 *
 * @extends Relation
 */
class DataModel extends Relation {

    /**
     * Creates a new DataModel instance.
     *
     * @param {Array} args - The arguments which is passed directly to the parent class.
     */
    constructor(...args) {
        super(...args);
        // The callback to call on propagation
        // new Implementation
        this.children = []; // contains all immediate children
        this._derivation = []; // specify rules by which this data model is created
        this._onPropagation = [];
        this.sortingDetails = {
            column: [],
            type: [],
        };
        this._updateFields();
    }

    /**
     * Creates a clone from the current DataModel instance.
     *
     * @public
     * @return {DataModel} - Returns the newly cloned DataModel instance.
     */
    clone() {
        return new DataModel(this);
    }

    /**
     * Creates a clone  from the current DataModel instance with
     * child parent relationship.
     *
     * @public
     * @param {boolean} [saveChild=true] - Whether the cloned instance would be recorded
     * in the parent instance.
     * @return {DataModel} - Returns the newly cloned DataModel instance.
     */
    cloneAsChild(saveChild = true) {
        const retDataModel = this.clone();
        if (saveChild) {
            this.children.push(retDataModel);
        }
        retDataModel.parent = this;
        return retDataModel;
    }

    /**
     * Returns the nameSpace for the current DataModel instance.
     * If the nameSpace is not found, it looks to its parent DataModel.
     *
     * @public
     * @return {Object} - Returns the nameSpace.
     */
    getFieldSpace() {
        return this.fieldSpace;
    }

    getNameSpace() {
        let child = this;
        let nameSpace;
        if (this._nameSpace) { return this._nameSpace; }
        while (child.parent) {
            if (child.parent._nameSpace) {
                nameSpace = child.parent._nameSpace;
                break;
            }
            child = child.parent;
        }
        return nameSpace;
    }

    /**
     * Returns the schema details for all fields.
     *
     * @public
     * @return {Array} Returns an array of field schema.
     */
    getSchema() {
        return this.getFieldSpace().fields.map(d => d.schema);
    }

    /**
     * Returns the data after operation in the format of
     * multidimensional array according to the given option value.
     *
     * @public
     * @param {Object} [options] - Define how the data need to be returned.
     * @param {Object} [options.order='row'] - Define the order of the data: row or column.
     * @param {Object} [options.formatter=null] - An object map containing field specific formatter function.
     * @param {Object} [options.withUid=false] - Whether the data uids will be included or not.
     * @return {Array} Returns a multidimensional array of the data.
     * @example
     *
     * // Return data with formatted date value.
     * const options = {
     *  order: 'row',
     *  formatter: {
     *      birthday: (val, rowId, schema) => {
     *          return yourCustomFormatter(val, "%Y-%m-%d");
     *      }
     *  }
     * }
     *
     *  const dm = new DataModel(data, schema);
     *  const dataFormatted = dm.getData(options);
     */
    getData(options) {
        const defOptions = {
            order: 'row',
            formatter: null,
            withUid: false
        };
        options = Object.assign({}, defOptions, options);

        const dataGenerated = dataBuilder.call(
            this,
            this.getNameSpace().fields,
            this.rowDiffset,
            this.colIdentifier,
            this.sortingDetails,
            {
                columnWise: options.order === 'column',
                addUid: !!options.withUid
            }
        );

        if (!options.formatter) {
            return dataGenerated;
        }

        const { formatter } = options;
        const { data, schema, uids } = dataGenerated;
        const fieldNames = schema.map((e => e.name));
        const fmtFieldNames = Object.keys(formatter);
        const fmtFieldIdx = fmtFieldNames.reduce((acc, next) => {
            const idx = fieldNames.indexOf(next);
            if (idx !== -1) {
                acc.push([idx, formatter[next]]);
            }
            return acc;
        }, []);

        if (options.order === 'column') {
            fmtFieldIdx.forEach((elem) => {
                const fIdx = elem[0];
                const fmtFn = elem[1];

                data[fIdx].forEach((datum, datumIdx) => {
                    data[fIdx][datumIdx] = fmtFn.call(
                        undefined,
                        datum,
                        uids[datumIdx],
                        schema[fIdx]
                    );
                });
            });
        } else {
            data.forEach((datum, datumIdx) => {
                fmtFieldIdx.forEach((elem) => {
                    const fIdx = elem[0];
                    const fmtFn = elem[1];

                    datum[fIdx] = fmtFn.call(
                        undefined,
                        datum[fIdx],
                        uids[datumIdx],
                        schema[fIdx]
                    );
                });
            });
        }

        return dataGenerated;
    }

    /**
     * Performs the rename operation to the column names of the DataModel instance.
     *
     * @public
     * @param {Object} schemaObj - The object having the name of the field to rename
     * as key and the new name as the value.
     * @return {DataModel} Returns a new DataModel instance with the renamed columns.
     */
    rename(schemaObj) {
        const cloneDataModel = this.cloneAsChild();
        const schemaArr = cloneDataModel.colIdentifier.split(',');
        const _fieldStore = this.getNameSpace().fields;

        Object.entries(schemaObj).forEach(([key, value]) => {
            if (schemaArr.indexOf(key) !== -1 && typeof value === 'string') {
                for (let i = 0; i <= _fieldStore.length; i += 1) {
                    if (_fieldStore[i].name === key) {
                        const renameField = _fieldStore[i].clone(_fieldStore[i].data);
                        renameField.name = value;
                        renameField.schema.name = value;
                        schemaArr[schemaArr.indexOf(key)] = value;
                        _fieldStore.push(renameField);
                        break;
                    }
                }
            }
        });
        cloneDataModel.colIdentifier = schemaArr.join();
        this._updateFields();
        return cloneDataModel;
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
    join(joinWith, filterFn) {
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
    naturalJoin(joinWith) {
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
    union(unionWith) {
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
    difference(differenceWith) {
        return difference(this, differenceWith);
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
    project(projField, config = {}, saveChild = true) {
        const allFields = Object.keys(this.getFieldMap());
        const { mode } = config;
        let normalizedProjField = projField.reduce((acc, field) => {
            if (field.constructor.name === 'RegExp') {
                acc.push(...allFields.filter(fieldName => fieldName.search(field) !== -1));
            } else if (field in this.getFieldMap()) {
                // If the field is string and it really exists
                acc.push(field);
            }
            return acc;
        }, []);
        normalizedProjField = Array.from(new Set(normalizedProjField)).map(field => field.trim());
        if (mode === ProjectionMode.EXCLUDE) {
            const rejectionSet = allFields.filter(fieldName => normalizedProjField.indexOf(fieldName) === -1);
            normalizedProjField = rejectionSet;
        }
        let cloneDataModel;
        cloneDataModel = this.cloneAsChild(saveChild);
        cloneDataModel._projectHelper(normalizedProjField.join(','));
        if (saveChild) {
            this.__persistDerivation(cloneDataModel, DM_DERIVATIVES.PROJECT,
                { projField, config, projString: normalizedProjField.join(',') }, null);
        }

        return cloneDataModel;
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
    select(selectFn, config = {}, saveChild = true, existingDataModel) {
        let cloneDataModel;
        let newDataModel;
        let rowDiffset;

        // handle ALL selection mode
        if (config.mode === SelectionMode.ALL) {
            // Do a normal selection
            const firstClone = this.cloneAsChild();
            rowDiffset = firstClone._selectHelper(firstClone.getNameSpace().fields, selectFn, {});
            firstClone.rowDiffset = rowDiffset;
            // Do an inverse selection
            const rejectClone = this.cloneAsChild();
            rowDiffset = rejectClone._selectHelper(rejectClone.getNameSpace().fields, selectFn, {
                mode: SelectionMode.INVERSE,
            });
            rejectClone.rowDiffset = rowDiffset;
            // Return an array with both selections
            return [firstClone, rejectClone];
        }
        let child;

        if (existingDataModel instanceof DataModel) {
            child = this.children.find(childElm => childElm._derivation
                             && childElm._derivation.length === 1
                             && childElm._derivation[0].op === DM_DERIVATIVES.SELECT
                             && childElm === existingDataModel);
        }
        if (child) {
            newDataModel = existingDataModel;
            rowDiffset = this._selectHelper(this.getNameSpace().fields, selectFn, config);
            existingDataModel.mutate('rowDiffset', rowDiffset);
            child._derivation[0].criteria = selectFn;
        }
        else {
            cloneDataModel = this.cloneAsChild(saveChild);
            rowDiffset = cloneDataModel._selectHelper(cloneDataModel.getNameSpace().fields, selectFn, config);
            cloneDataModel.rowDiffset = rowDiffset;
            newDataModel = cloneDataModel;
        }

        // Store reference to child model and selector function
        if (saveChild && !child) {
            this.__persistDerivation(newDataModel, DM_DERIVATIVES.SELECT, { config }, selectFn);
        }

        return newDataModel;
    }

    /**
     * Mutates a property of the current DataModel instance with a new value.
     *
     * @public
     * @param {string} key - The property name to be changed.
     * @param {string} value - The new value of the property.
     * @return {DataModel} Returns the current DataModel instance itself.
     */
    mutate(key, value) {
        this[key] = value;
        selectIterator(this, (model, fn) => {
            this.select(fn, {}, false, model);
        });

        projectIterator(this, (model) => {
            model.mutate(key, value);
        });

        calculatedMeasureIterator(this, (table, params) => {
            table[key] = value;
            this.__createMeasure(...[...params, false, table]);
        });

        groupByIterator(this, (model, params) => {
            this.groupBy(...[params.groupByString.split(','), params.reducer], false, model);
        });
        return this;
    }

    /**
     * Performs group-by operation on the current DataModel instance according to
     * the fields and reducers provided.
     * The fields can be skipped in that case all field will be taken into consideration.
     * The reducer can also be given, If nothing is provided sum will be the default reducer.
     *
     * @public
     * @param {Array} fieldsArr - An array containing the name of the columns.
     * @param {Object | Function | string} [reducers={}] - The reducer function.
     * @param {string} [saveChild=true] - Whether the child to save  or not.
     * @param {DataModel} [existingDataModel] - An optional existing DataModel instance.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    groupBy(fieldsArr, reducers = {}, saveChild = true, existingDataModel) {
        const groupByString = `${fieldsArr.join()}`;
        let present = false;
        if (existingDataModel instanceof DataModel) {
            let child = this.children.find(childElm => childElm._derivation
                                            && childElm._derivation.length === 1
                                            && childElm._derivation[0].op === DM_DERIVATIVES.GROUPBY
                                            && childElm._derivation[0].meta.groupByString === groupByString
                                            && childElm === existingDataModel);
            if (child) {
                present = true;
                child._derivation[0].meta.fieldsArr = fieldsArr;
                child._derivation[0].meta.groupByString = groupByString;
                child._derivation[0].meta.defaultReducer = reducerStore.defaultReducer();
                child._derivation[0].criteria = reducers;
            }
        }
        let params = [this, fieldsArr, reducers];
        if (present) {
            params.push(existingDataModel);
        }
        const newDataModel = groupBy(...params);
        if (saveChild && !present) {
            this.children.push(newDataModel);
            this.__persistDerivation(newDataModel, DM_DERIVATIVES.GROUPBY,
                { fieldsArr, groupByString, defaultReducer: reducerStore.defaultReducer() }, reducers);
        }
        if (present) {
            existingDataModel.mutate('rowDiffset', existingDataModel.rowDiffset);
        }

        newDataModel.parent = this;
        return newDataModel;
    }

    /**
     * Returns index and field details in an object where key is the field name.
     *
     * @public
     * @return {Object} - Returns the field definitions.
     */
    getFieldMap() {
        this.fieldMap = this.getFieldData().reduce((acc, fieldDef, i) => {
            acc[fieldDef.name] = {
                index: i,
                def: { name: fieldDef._ref.name, type: fieldDef._ref.fieldType }
            };
            return acc;
        }, {});
        return this.fieldMap;
    }

    /**
     * It helps to define the sorting order of the returned data.
     * This is similar to the orderBy functionality of the database
     * you have to pass the array of array [['columnName', 'sortType(asc|desc)']] and the
     * function getData will give the data accordingly
     *
     * Please note no new DataModel will be created from this call, as this function overwrite the
     * previous sorting config
     *
     * @todo Fix whether a new DataModel instance is returned or not.
     *
     * @public
     * @param  {Array} sortList The array of all the column that need to be sorted
     * @return {DataModel}            it's own instance
     */
    sort(sortList) {
        sortList.forEach((row) => {
            const currRow = row;
            currRow[1] = row[1] === 'desc' ? 'desc' : 'asc';
        });
        this.sortingDetails = sortList;
        const struct = this.getData();
        // append header
        const header = struct.schema.map(field => field.name);
        return new this.constructor([header].concat(struct.data), struct.schema, null, { dataFormat: 'CSVArr' });
    }

    /**
     *
     * @param {Object} varConfig :{
     *  name: 'new-var',
     *  type: 'measure | dimension',
     *  subype: 'temporal | ...',
     *  all the variable what schema gets
     *  }}
     *  @param {Array} paramConfig : ['dep-var-1', 'dep-var-2', 'dep-var-3', ([var1, var2, var3], rowIndex, dm) => {}]
     * @param {Object} config : { saveChild : true | false , removeDependentDimensions : true|false}
     */
    calculateVariable(varConfig, paramConfig, config = {}, existingDataModel) {
        if (varConfig.type === FieldType.DIMENSION) {
            return this.__createDimensions(varConfig,
                paramConfig.slice(0, paramConfig.length - 1),
                paramConfig[paramConfig.length - 1], config);
        }

        return this.__createMeasure(varConfig,
                paramConfig.slice(0, paramConfig.length - 1),
                paramConfig[paramConfig.length - 1],
                config.saveChild, existingDataModel);
    }

    /**
     * Creates a calculated measure from the current DataModel instance.
     *
     * @public
     * @param {Object} config - The config.
     * @param {string} config.name - The name of the field.
     * @param {Array<string>} fields - An array of fields to take as input.
     * @param {Function} callback - A callback supplied to calculate the property.
     * @param {boolean} [saveChild=true] - Whether the child to save  or not.
     * @param {DataModel} [existingDataModel] - An optional DataModel instance.
     * @return {DataModel} - Returns a new DataModel instance.
     */
    __createMeasure(config, fields, callback, saveChild = true, existingDataModel) {
        const {
            name,
            unit,
            scale,
            numberformat,
            defAggFn,
        } = config;
        let clone;
        let existingChild = this.children.find(childElm => childElm._derivation
                                                && childElm._derivation.length === 1
                                                && childElm._derivation[0].op === DM_DERIVATIVES.CAL_MEASURE
                                                && childElm === existingDataModel);

        // Get the fields present
        const fieldMap = this.getFieldMap();
        if (fieldMap[name] && !existingChild) {
            throw new Error(`${name} field already exists in model.`);
        }
        // Validate that the supplied fields are present
        // and measures
        const fieldIndices = fields.map((field) => {
            const fieldSpec = fieldMap[field];
            if (!fieldSpec) {
                throw new Error(`${field} is not a valid column name.`);
            }
            // if (fieldSpec.def.type !== FieldType.MEASURE) {
            //     throw new Error(`${field} is not a ${FieldType.MEASURE}.`);
            // }
            return fieldSpec.index;
        });
        if (existingChild) {
            clone = existingDataModel;
        }
        else {
            clone = this.cloneAsChild(saveChild);
        }
        const namespaceFields = clone.getNameSpace().fields;
        const suppliedFields = fieldIndices.map(idx => namespaceFields[idx]);
        // array of computed data values
        const computedValues = [];
        // iterate over data based on row diffset
        rowDiffsetIterator(clone.rowDiffset, (i) => {
            // get the data corresponding to supplied fields
            const fieldsData = suppliedFields.map(field => field.data[i]);
            // get the computed value based on user supplied callback
            const computedValue = callback(...fieldsData, i, namespaceFields);
            computedValues[i] = computedValue;
        });
        // create a field to store this field
        // @todo give other schema also
        const partialField = new Measure(name, computedValues, {
            name,
            type: FieldType.MEASURE,
            unit,
            scale,
            numberformat,
            defAggFn
        });

        // const nameSpaceEntry = new Field(partialField, this.rowDiffset);
        // push this to the child DataModel instance field store
        let index = namespaceFields.findIndex(d => d.name === name);
        if (index !== -1 && existingChild) {
            namespaceFields[index] = partialField;
            existingChild.params = [config, fields, callback];
            existingDataModel.mutate('rowDiffset', existingDataModel.rowDiffset);
        }
        else {
            namespaceFields.push(partialField);
            // update the column identifier
            clone.colIdentifier += `,${name}`;
        }
        // update the field map of child DataModel instance
        const childFieldMap = clone.getFieldMap();
        childFieldMap[name] = {
            index: namespaceFields.length - 1,
            def: {
                name,
                type: FieldType.MEASURE,
            },
        };
        if (existingChild) {
            existingDataModel._derivation[0].meta.config = config;
            existingDataModel._derivation[0].meta.fields = fields;
            existingDataModel._derivation[0].criteria = callback;
        }
        if (saveChild && !existingChild) {
            this.__persistDerivation(clone, DM_DERIVATIVES.CAL_MEASURE, { config, fields }, callback);
        }

        return clone;
    }

    /**
     * Generates new dimensions from existing dimensions by using the supplied callback.
     *
     * @public
     * @param {Array<Object>} dimArray - An array of objects with the names of new dimensions to create.
     * @param {Array<string>} dependents - An array of the dimensions to use to create new dimensions.
     * @param {Function} callback - The callback to execute to create new dimensions.
     * @param {Object} config - An object wth configuration options.
     * @param {string} config.removeDependentDimensions - The flag to indicate whether dependent
     * dimensions should be removed.
     * @return {DataModel} Returns the new DataModel instance.
     */
    __createDimensions(dimObj, dependents, callback, config = {}) {
        // get the fields present
        const fieldMap = this.getFieldMap();
        // validate that the supplied fields are present
        // and measures
        const depIndices = dependents.map((field) => {
            const fieldSpec = fieldMap[field];
            if (!fieldSpec) {
                throw new Error(`${field} is not a valid column name.`);
            }
            // if (fieldSpec.def.type !== FieldType.DIMENSION) {
            //     throw new Error(`${field} is not a ${FieldType.DIMENSION}.`);
            // }
            return fieldSpec.index;
        });
        const clone = this.cloneAsChild();
        const namespaceFields = clone.getNameSpace().fields;
        const suppliedFields = depIndices.map(idx => namespaceFields[idx]);
        // array of computed data values
        const computedValues = [];
        // iterate over data based on row diffset
        rowDiffsetIterator(clone.rowDiffset, (i) => {
            // get the data corresponding to supplied fields
            const fieldsData = suppliedFields.map(field => field.data[i]);
            // get the computed value based on user supplied callback
            const computedValue = callback(...fieldsData);
            computedValues[i] = computedValue;
        });
        // create new fields
        const { name } = dimObj;
        const dimensionData = computedValues;
            // create a field to store this field
        let partialField;
        if (dimObj.subtype === DimensionSubtype.TEMPORAL) {
            partialField = new DateTime(name, dimensionData, {
                name,
                type: FieldType.DIMENSION,
            });
        }
        else {
            partialField = new Categorical(name, dimensionData, {
                name,
                type: FieldType.DIMENSION,
            });
        }

        // const nameSpaceEntry = new Field(partialField, this.rowDiffset);
            // push this to the child DataModel instance field store
        namespaceFields.push(partialField);
            // update the field map of child DataModel instance
        const childFieldMap = clone.getFieldMap();
        childFieldMap[name] = {
            index: namespaceFields.length - 1,
            def: {
                name,
                type: FieldType.DIMENSION,
            },
        };
            // update the column identifier
        clone.colIdentifier += `,${name}`;

        if (config.removeDependentDimensions) {
            return clone.project(dependents, {
                mode: ProjectionMode.EXCLUDE,
            });
        }
        return clone;
    }

    /**
     * Assembles a DataModel instance from the propagated identifiers.
     *
     * @private
     * @param {Array} identifiers - An array of dimensions that were interacted upon.
     * @return {DataModel} Returns a DataModel assembled from identifiers.
     */
    _assembleModelFromIdentifiers(identifiers) {
        let schema = [];
        let data;
        let fieldMap = this.getFieldMap();
        if (identifiers.length) {
            let fields = identifiers[0];
            let len = fields.length;
            for (let i = 0; i < len; i++) {
                let field = fields[i];
                let fieldObj;
                if (field === ROW_ID) {
                    fieldObj = {
                        name: field,
                        type: FieldType.DIMENSION
                    };
                }
                else {
                    fieldObj = fieldMap[field] && Object.assign({}, fieldMap[field].def);
                }
                if (fieldObj) {
                    schema.push(Object.assign(fieldObj));
                }
            }
            // format the data
            // @TODO: no documentation on how CSV_ARR data format works.
            data = [];
            const header = identifiers[0];
            for (let i = 1; i < identifiers.length; i += 1) {
                const vals = identifiers[i];
                const temp = {};
                vals.forEach((fieldVal, cIdx) => {
                    temp[header[cIdx]] = fieldVal;
                });
                data.push(temp);
            }
        }
        else {
            data = [];
            schema = [];
        }
        return new DataModel(data, schema);
    }

    /**
     * Filters the current DataModel instance and only return those fields
     * that appear in the propagation model or only those ROW_ID's
     * that appear in the prop model.
     *
     * @private
     * @param {DataModel} propModel - The propagation datamodel instance.
     * @return {DataModel} Returns the filtered propagation model.
     */
    _filterPropagationModel(propModel) {
        const { data, schema } = propModel.getData();
        let filteredModel;
        if (schema.length) {
            if (schema[0].name === ROW_ID) {
                // iterate over data and create occurence map
                const occMap = {};
                data.forEach((val) => {
                    occMap[val[0]] = true;
                });
                filteredModel = this.select((fields, rIdx) => occMap[rIdx], {}, false);
            } else {
                let fieldMap = this.getFieldMap();
                let filteredSchema = schema.filter(d => d.name in fieldMap && d.type === FieldType.DIMENSION);
                filteredModel = this.select((fields) => {
                    let include = true;
                    filteredSchema.forEach((propField, idx) => {
                        let index = data.findIndex(d => d[idx] === fields[propField.name].valueOf());
                        include = include && index !== -1;
                    });
                    return include;
                }, {}, false);
            }
        }
        else {
            filteredModel = propModel;
        }

        return filteredModel;
    }

    /**
     * Propagates changes across all the connected DataModel instances.
     *
     * @public
     * @param {Array} identifiers - A list of identifiers that were interacted with.
     * @param {Object} payload - The interaction specific details.
     * @param {DataModel} source - The source DataModel instance.
     */
    propagate(identifiers, payload, source, grouped = false) {
        let propModel = identifiers;
        if (!(propModel instanceof DataModel)) {
            propModel = this._assembleModelFromIdentifiers(identifiers);
        }

        // create the filtered model
        const filteredModel = this._filterPropagationModel(propModel);
        // function to propagate to target the DataModel instance.
        const forwardPropagation = (targetDM, propagationData, group) => {
            targetDM.handlePropagation({
                payload,
                data: propagationData,
            });
            targetDM.propagate(propagationData, payload, this, group);
        };
        // propagate to children created by SELECT operation
        selectIterator(this, (targetDM, criteria) => {
            if (targetDM !== source) {
                let selectedModel = propModel;
                if (grouped) {
                    selectedModel = !propModel._isEmpty() && propModel.select(criteria);
                }
                forwardPropagation(targetDM, selectedModel);
            }
        });
        // propagate to children created by PROJECT operation
        projectIterator(this, (targetDM) => {
            if (targetDM !== source) {
                // pass al the props cause it won't make a difference
                forwardPropagation(targetDM, propModel, grouped);
            }
        });
        // propagate to children created by groupBy operation
        groupByIterator(this, (targetDM, conf) => {
            if (targetDM !== source) {
                const {
                    reducer,
                    groupByString,
                } = conf;
                // group the filtered model based on groupBy string of target
                const groupedPropModel = filteredModel.groupBy(groupByString.split(','), reducer, false);
                forwardPropagation(targetDM, groupedPropModel, true);
            }
        });
        // propagate to parent if parent is not source
        if (this.parent && source !== this.parent) {
            forwardPropagation(this.parent, propModel, grouped);
        }
    }

    /**
     * This is a very special method that only applies
     * to cross-tab group where propagation of is won't
     * work so we propagate the selected range of the fields
     * instead.
     *
     * @todo Need to check whether it is private or public API.
     *
     * @private
     * @param {Object} rangeObj Object with field names and corresponding selected ranges.
     * @param {Object} payload Object with insertion related fields.
     * @memberof DataModel
     */
    propagateInterpolatedValues(rangeObj, payload, fromSource) {
        const source = fromSource || this;
        let propModel = rangeObj;
        if (!(propModel instanceof DataModel)) {
            const measures = Object.keys(rangeObj);
            propModel = this.select((fields) => {
                let include = true;
                measures.forEach((fieldName) => {
                    const domain = rangeObj[fieldName];
                    include = include && fields[fieldName] >= domain[0];
                    include = include && fields[fieldName] <= domain[1];
                });
                return include;
            }, {}, false);
        }
        const forward = (dataModel, propagationModel, isParent) => {
            dataModel.handlePropagation({
                payload,
                data: propagationModel,
            });
            dataModel.propagateInterpolatedValues(isParent ?
                rangeObj : propagationModel, payload, this);
        };
        // propagate to children created by SELECT operation
        selectIterator(this, (targetDM, fn) => {
            if (targetDM !== source) {
                let selectModel;
                selectModel = propModel.select(fn, {}, false);
                forward(targetDM, selectModel);
            }
        });
        // propagate to children created by PROJECT operation
        projectIterator(this, (targetDM, projString) => {
            if (targetDM !== source) {
                let projectModel;
                projectModel = propModel.project(projString.split(','), {}, false);
                forward(targetDM, projectModel);
            }
        });
        // propagate to children created by GROUPBY operation
        groupByIterator(this, (targetDM) => {
            if (targetDM !== source) {
                forward(targetDM, propModel);
            }
        });
        // propagate to parent if parent is not source
        if (this.parent && source !== this.parent) {
            forward(this.parent, propModel, true);
        }
    }

    /**
     * Associates a callback with an event name.
     *
     * @public
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback to invoke.
     * @return {DataModel} Returns this current DataModel instance itself.
     */
    on(eventName, callback) {
        switch (eventName) {
        case PROPAGATION:
            this._onPropagation.push(callback);
            break;
        }
        return this;
    }

    /**
     * Unsubscribes the callbacks for the provided event name.
     *
     * @public
     * @param {string} eventName - The name of the event to unsubscribe.
     * @return {DataModel} Returns the current DataModel instance itself.
     */
    unsubscribe(eventName) {
        switch (eventName) {
        case PROPAGATION:
            this._onPropagation = [];
            break;

        }
        return this;
    }

    /**
     * This method is used to invoke the method associated with
     * propagation.
     *
     * @todo Fix whether this method would be public or not.
     *
     * @private
     * @param {Object} payload The interaction payload.
     * @param {DataModel} identifiers The propagated DataModel.
     * @memberof DataModel
     */
    handlePropagation(payload, identifiers) {
        let propListeners = this._onPropagation;
        propListeners.forEach(fn => fn.call(this, payload, identifiers));
    }

    /**
     * Creates a bin based on provided buckets or based on
     * calculated buckets created from configuration.
     *
     * @public
     * @param {string} measureName - The name of the measure to bin.
     * @param {Object} config - The binning configuration.
     * @param {Array} config.buckets - The array of buckets.
     * @param {number} config.binSize - The size of a bin.
     * @param {number} config.numOfBins - The number of bins to create.
     * @param {string} binnedFieldName - The name of the new field.
     * @return {DataModel} Returns the new DataModel instance.
     */
    createBin(measureName, config, binnedFieldName) {
        const clone = this.cloneAsChild();
        const namespaceFields = clone.getNameSpace().fields;
        const fieldMap = this.getFieldMap();
        binnedFieldName = binnedFieldName || `${measureName}_binned`;
        if (fieldMap[binnedFieldName]) {
            throw new Error(`Field ${measureName} already exists.`);
        }
        if (!fieldMap[measureName]) {
            throw new Error(`Field ${measureName} does not exist.`);
        }
        // get the data for field to be binned
        const fieldIndex = this.getFieldMap()[measureName].index;
        const fieldData = this.getNameSpace().fields[fieldIndex].data;
        // get the buckets
        const buckets = config.buckets || createBuckets(fieldData, config);
        const startVals = buckets.map(item => item.start || 0);
        startVals.push(buckets[buckets.length - 1].end);
        const getLabel = (value, start, end) => {
            if (end - start === 1) {
                return buckets[start].label;
            }
            const midIdx = start + Math.ceil((end - start) / 2);
            const midVal = startVals[midIdx];
            if (value === midVal) {
                return buckets[midIdx].label;
            }
            if (value > midVal) {
                return getLabel(value, midIdx, end);
            }
            return getLabel(value, start, midIdx);
        };
        const labelData = [];
        // iterate over field data and assign label
        rowDiffsetIterator(this.rowDiffset, (i) => {
            const value = fieldData[i];
            const label = getLabel(value, 0, startVals.length - 1);
            labelData.push(label);
        });
        const partialField = new Categorical(binnedFieldName, labelData, {
            name: binnedFieldName,
            type: FieldType.DIMENSION,
        });

       // const nameSpaceEntry = new Field(partialField, this.rowDiffset);
        // push this to the child DataModel instance field store
        namespaceFields.push(partialField);
        // update the field map of child DataModel instance
        const childFieldMap = clone.getFieldMap();
        childFieldMap[binnedFieldName] = {
            index: namespaceFields.length - 1,
            def: {
                name: binnedFieldName,
                type: FieldType.DIMENSION,
            },
        };
        // update the column identifier
        clone.colIdentifier += `,${binnedFieldName}`;

        this.__persistDerivation(clone, DM_DERIVATIVES.BIN, { measureName, config, binnedFieldName }, null);

        return clone;
    }

    static get Reducers() {
        return reducerStore;
    }

    /**
     * break the link between its parent and itself
     */
    dispose() {
        this.parent.__removeChild(this);
        this.parent = null;
    }
    /**
     *
     * @param {DataModel} child : Delegates the parent to remove this child
     */
    __removeChild(child) {
        // remove from child list
        let idx = this.children.findIndex(sibling => sibling === child);
        idx !== -1 ? this.children.splice(idx, 1) : true;
    }
    /**
     *
     * @param { DataModel } parent datamodel instance which will act as its parent of this.
     * @param { Queue } criteriaQueue Queue contains in-between operation meta-data
     */
    __addParent(parent, criteriaQueue = []) {
        this._nameSpace = this._nameSpace === undefined ?
                                        this.parent.getNameSpace() : this._nameSpace;
        this.__persistDerivation(this, DM_DERIVATIVES.COMPOSE, null, criteriaQueue);
        this.parent = parent;
        parent.children.push(this);
    }

    /**
     *
     * @param {DataModel} model :Child model derived from operation
     * @param {String} operation : Type of operation used
     * @param {Object} config : Contains metaData used in this operation
     * @param {Function} criteriaFn : Function which having used to do the derivation
     */
    __persistDerivation(model, operation, config = {}, criteriaFn) {
        let derivative;
        if (operation !== DM_DERIVATIVES.COMPOSE) {
            derivative = {
                op: operation,
                meta: config,
                criteria: criteriaFn
            };
            model._derivation.push(derivative);
        }
        else {
            derivative = [...criteriaFn];
            model._derivation.length = 0;
            model._derivation.push(...derivative);
        }
    }

    _updateFields() {
        let newFields = [];

        let collID = this.colIdentifier.split(',');
        this.getNameSpace().fields.forEach((field) => {
            if (collID.indexOf(field.name) !== -1) {
                let newField = new Field(field, this.rowDiffset);
                newFields.push(newField);
            }
        });

        this.fieldSpace = fieldStore.createNameSpace(newFields, this.getNameSpace().name);
        this.fields = this.fieldSpace.fields;

        return this.fields;
    }

    getFieldData() {
        return this._updateFields();
    }
}

export default DataModel;
