/* eslint-disable default-case */
import { FieldType, ProjectionMode, SelectionMode } from 'picasso-util';
import { DT_DERIVATIVES, PROPAGATION, ROW_ID } from './constants';
import { Dimension, Measure } from './fields';
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


/**
 * The data model which has been built on the concept of relational algebra.
 *
 * @extends Relation
 */
class DataTable extends Relation {

    /**
     * Creates a new DataTable instance.
     *
     * @param {Array} args - The arguments which is passed directly to the parent class.
     */
    constructor(...args) {
        super(...args);
        // The callback to call on propagation
        // new Implementation
        this.children = []; // contains all immediate children
        this._derivation = []; // specify rules by which this data table is created
        this._onPropagation = [];
        this.sortingDetails = {
            column: [],
            type: [],
        };
    }

    /**
     * Creates a clone from the current DataTable instance.
     *
     * @public
     * @return {DataTable} - Returns the newly cloned DataTable instance.
     */
    clone() {
        return new DataTable(this);
    }

    /**
     * Creates a clone  from the current DataTable instance with
     * child parent relationship.
     *
     * @public
     * @param {boolean} [saveChild=true] - Whether the cloned instance would be recorded
     * in the parent instance.
     * @return {DataTable} - Returns the newly cloned DataTable instance.
     */
    cloneAsChild(saveChild = true) {
        const retDataTable = this.clone();
        if (saveChild) {
            this.children.push(retDataTable);
        }
        retDataTable.parent = this;
        return retDataTable;
    }

    /**
     * Returns the columnNameSpace for the current DataTable instance.
     * If the columnNameSpace is not found, it looks to its parent DataTable.
     *
     * @public
     * @return {Object} - Returns the columnNameSpace.
     */
    getNameSpace() {
        let child = this;
        let nameSpace;
        if (this.columnNameSpace) { return this.columnNameSpace; }
        while (child.parent) {
            if (child.parent.columnNameSpace) {
                nameSpace = child.parent.columnNameSpace;
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
        return this.getNameSpace().fields.map(d => d.schema);
    }

    /**
     * Returns the data after operation in the format of
     * multidimensional array according to the given option value.
     *
     * @public
     * @param {Object} [options] - Define how the data need to be returned.
     * @param {Object} [options.order='row'] - Define the order of the data: row or column.
     * @param {Object} [options.formatter=null] - An object map containing field specific formatter function.
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
     *  const dt = new DataTable(data, schema);
     *  const dataFormatted = dt.getData(options);
     */
    getData(options) {
        const defOptions = {
            order: 'row',
            formatter: null,
        };
        options = Object.assign({}, defOptions, options);

        const dataGenerated = dataBuilder.call(
            this,
            this.getNameSpace().fields,
            this.rowDiffset,
            this.colIdentifier,
            this.sortingDetails,
            {
                columnWise: options.order === 'column'
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
     * Returns the data with the uids.
     *
     * @public
     * @return {Array} Returns a multidimensional array of the data.
     */
    getDataWithUids() {
        return dataBuilder.call(
            this,
            this.getNameSpace().fields,
            this.rowDiffset,
            this.colIdentifier,
            this.sortingDetails,
            {
                addUid: true
            }
        );
    }

    /**
     * Performs the rename operation to the column names of the DataTable instance.
     *
     * @public
     * @param {Object} schemaObj - The object having the name of the field to rename
     * as key and the new name as the value.
     * @return {DataTable} Returns a new DataTable instance with the renamed columns.
     */
    rename(schemaObj) {
        const cloneDataTable = this.cloneAsChild();
        const schemaArr = cloneDataTable.colIdentifier.split(',');
        const fieldStore = this.getNameSpace().fields;

        Object.entries(schemaObj).forEach(([key, value]) => {
            if (schemaArr.indexOf(key) !== -1 && typeof value === 'string') {
                for (let i = 0; i <= fieldStore.length; i += 1) {
                    if (fieldStore[i].name === key) {
                        const renameField = fieldStore[i].clone(fieldStore[i].data);
                        renameField.name = value;
                        renameField.schema.name = value;
                        schemaArr[schemaArr.indexOf(key)] = value;
                        fieldStore.push(renameField);
                        break;
                    }
                }
            }
        });
        cloneDataTable.colIdentifier = schemaArr.join();

        return cloneDataTable;
    }

    /**
     * this reflect the cross-product of the relational algebra or can be called as theta join.
     * It take another DataTable instance and create new DataTable with the cross-product data and
     * filter the data according to the filter function provided.
     * Say there are two dataTable tableA with 4 column 5 rows and tableB with 3 column 6 row
     * so the new DataTable tableA X tableB will have 7(4 + 3) rows and 30(5 * 6) columns (if no
     * filter function is provided).
     *
     * @todo Make this API user-friendly.
     *
     * @public
     * @param  {DataTable} joinWith The DataTable to be joined with this DataTable
     * @param  {Function} filterFn Function that will filter the result of the crossProduct
     * DataTable
     * @return {DataTable}          the new DataTable created by joining
     */
    join(joinWith, filterFn) {
        return crossProduct(this, joinWith, filterFn);
    }

    /**
     * This can join two DataTable to form a new DataTable which meet the requirement of
     * natural join.
     * it's not possible to pass a filter function as the filter function is decided according to
     * the definition of natural join
     *
     * @todo Make this API user-friendly.
     *
     * @public
     * @param  {DataTable} joinWith the DataTable with whom this DataTable will be joined
     * @return {DataTable}          The new joined DataTable
     */
    naturalJoin(joinWith) {
        return crossProduct(this, joinWith, naturalJoinFilter(this, joinWith), true);
    }

    /**
     * Performs union operation of the relational algebra.
     * It can be termed as vertical joining of all the unique tuples
     * from both the DataTable instances. The requirement is both
     * the DataTable instances should have same column name and order.
     *
     * @public
     * @param {DataTable} unionWith - Another DataTable instance to which union
     * operation is performed.
     * @return {DataTable} Returns the new DataTable instance after operation.
     */
    union(unionWith) {
        return union(this, unionWith);
    }

    /**
     * Performs difference operation of the relational algebra.
     * It can be termed as vertical joining of all the tuples
     * those are not in the second DataTable. The requirement
     * is both the DataTable instances should have same column name and order.
     *
     * @public
     * @param {DataTable} differenceWith - Another DataTable instance to which difference
     * operation is performed.
     * @return {DataTable} Returns the new DataTable instance after operation.
     */
    difference(differenceWith) {
        return difference(this, differenceWith);
    }

    /**
     * Performs projection operation on the current DataTable instance.
     *
     * @public
     * @param {Array.<string | Regexp>} projField - An array of column names in string or regular expression.
     * @param {Object} [config={}] - An optional config.
     * @param {boolean} [saveChild=true] - It is used while cloning.
     * @return {DataTable} Returns the new DataTable instance after operation.
     */
    project(projField, config = {}, saveChild = true) {
        const allFields = Object.keys(this.fieldMap);
        const { mode } = config;
        let normalizedProjField = projField.reduce((acc, field) => {
            if (field.constructor.name === 'RegExp') {
                acc.push(...allFields.filter(fieldName => fieldName.search(field) !== -1));
            } else if (field in this.fieldMap) {
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
        let cloneDataTable;
        cloneDataTable = this.cloneAsChild(saveChild);
        cloneDataTable._projectHelper(normalizedProjField.join(','));
        if (saveChild) {
            this.__persistDerivation(cloneDataTable, DT_DERIVATIVES.PROJECT,
                { projField, config, projString: normalizedProjField.join(',') }, null);
        }

        return cloneDataTable;
    }

    /**
     * Performs selection operation of the relational algebra.
     * If an existing DataTable instance is passed in the last argument,
     * then it mutates the that DataTable instead of cloning a new one.
     *
     * @public
     * @param {Function} selectFn - The function which will be looped through all the data
     * if it return true the row will be there in the DataTable.
     * @param {Object} [config={}] - The mode configuration.
     * @param {string} config.mode - The mode of the selection.
     * @param {string} [saveChild=true] - It is used while cloning.
     * @param {DataTable} [existingDataTable] - An optional existing DataTable instance.
     * @return {DataTable} Returns the new DataTable instance after operation.
     */
    select(selectFn, config = {}, saveChild = true, existingDataTable) {
        let cloneDataTable;
        let newDataTable;
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

        if (existingDataTable instanceof DataTable) {
            child = this.children.find(childElm => childElm._derivation
                             && childElm._derivation.length === 1
                             && childElm._derivation[0].op === DT_DERIVATIVES.SELECT
                             && childElm === existingDataTable);
        }
        if (child) {
            newDataTable = existingDataTable;
            rowDiffset = this._selectHelper(this.getNameSpace().fields, selectFn, config);
            existingDataTable.mutate('rowDiffset', rowDiffset);
            child._derivation[0].criteria = selectFn;
        }
        else {
            cloneDataTable = this.cloneAsChild(saveChild);
            rowDiffset = cloneDataTable._selectHelper(cloneDataTable.getNameSpace().fields, selectFn, config);
            cloneDataTable.rowDiffset = rowDiffset;
            newDataTable = cloneDataTable;
        }

        // Store reference to child table and selector function
        if (saveChild && !child) {
            this.__persistDerivation(newDataTable, DT_DERIVATIVES.SELECT, { config }, selectFn);
        }

        return newDataTable;
    }

    /**
     * Mutates a property of the current DataTable instance with a new value.
     *
     * @public
     * @param {string} key - The property name to be changed.
     * @param {string} value - The new value of the property.
     * @return {DataTable} Returns the current DataTable instance itself.
     */
    mutate(key, value) {
        this[key] = value;
        selectIterator(this, (table, fn) => {
            this.select(fn, {}, false, table);
        });

        projectIterator(this, (table) => {
            table.mutate(key, value);
        });

        calculatedMeasureIterator(this, (table, params) => {
            table[key] = value;
            this.createMeasure(...[...params, false, table]);
        });

        groupByIterator(this, (table, params) => {
            this.groupBy(...[params.groupByString.split(','), params.reducer], false, table);
        });
        return this;
    }

    /**
     * Performs group-by operation on the current DataTable instance according to
     * the fields and reducers provided.
     * The fields can be skipped in that case all field will be taken into consideration.
     * The reducer can also be given, If nothing is provided sum will be the default reducer.
     *
     * @public
     * @param {Array} fieldsArr - An array containing the name of the columns.
     * @param {Object | Function | string} [reducers={}] - The reducer function.
     * @param {string} [saveChild=true] - Whether the child to save  or not.
     * @param {DataTable} [existingDataTable] - An optional existing DataTable instance.
     * @return {DataTable} Returns the new DataTable instance after operation.
     */
    groupBy(fieldsArr, reducers = {}, saveChild = true, existingDataTable) {
        const groupByString = `${fieldsArr.join()}`;
        let present = false;
        if (existingDataTable instanceof DataTable) {
            let child = this.children.find(childElm => childElm._derivation
                                            && childElm._derivation.length === 1
                                            && childElm._derivation[0].op === DT_DERIVATIVES.GROUPBY
                                            && childElm._derivation[0].meta.groupByString === groupByString
                                            && childElm === existingDataTable);
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
            params.push(existingDataTable);
        }
        const newDatatable = groupBy(...params);
        if (saveChild && !present) {
            this.children.push(newDatatable);
            this.__persistDerivation(newDatatable, DT_DERIVATIVES.GROUPBY,
                { fieldsArr, groupByString, defaultReducer: reducerStore.defaultReducer() }, reducers);
        }
        if (present) {
            existingDataTable.mutate('rowDiffset', existingDataTable.rowDiffset);
        }

        newDatatable.parent = this;
        return newDatatable;
    }

    /**
     * Returns index and field details in an object where key is the field name.
     *
     * @public
     * @return {Object} - Returns the field definitions.
     */
    getFieldMap() {
        return this.fieldMap;
    }

    /**
     * It helps to define the sorting order of the returned data.
     * This is similar to the orderBy functionality of the database
     * you have to pass the array of array [['columnName', 'sortType(asc|desc)']] and the
     * function getData will give the data accordingly
     *
     * Please note no new DataTable will be created from this call, as this function overwrite the
     * previous sorting config
     *
     * @todo Fix whether a new DataTable instance is returned or not.
     *
     * @public
     * @param  {Array} sortList The array of all the column that need to be sorted
     * @return {DataTable}            it's own instance
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
     * Creates a calculated measure from the current DataTable instance.
     *
     * @public
     * @param {Object} config - The config.
     * @param {string} config.name - The name of the field.
     * @param {Array<string>} fields - An array of fields to take as input.
     * @param {Function} callback - A callback supplied to calculate the property.
     * @param {boolean} [saveChild=true] - Whether the child to save  or not.
     * @param {DataTable} [existingDataTable] - An optional DataTable instance.
     * @return {DataTable} - Returns a new DataTable instance.
     */
    createMeasure(config, fields, callback, saveChild = true, existingDataTable) {
        const {
            name,
        } = config;
        let clone;
        let existingChild = this.children.find(childElm => childElm._derivation
                                                && childElm._derivation.length === 1
                                                && childElm._derivation[0].op === DT_DERIVATIVES.CAL_MEASURE
                                                && childElm === existingDataTable);

        // Get the fields present
        const fieldMap = this.getFieldMap();
        if (fieldMap[name] && !existingChild) {
            throw new Error(`${name} field already exists in table.`);
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
            clone = existingDataTable;
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
        const nameSpaceEntry = new Measure(name, computedValues, {
            name,
            type: FieldType.MEASURE,
        });
        // push this to the child DataTable instance field store
        let index = namespaceFields.findIndex(d => d.name === name);
        if (index !== -1 && existingChild) {
            namespaceFields[index] = nameSpaceEntry;
            existingChild.params = [config, fields, callback];
            existingDataTable.mutate('rowDiffset', existingDataTable.rowDiffset);
        }
        else {
            namespaceFields.push(nameSpaceEntry);
            // update the column identifier
            clone.colIdentifier += `,${name}`;
        }
        // update the field map of child DataTable instance
        const childFieldMap = clone.getFieldMap();
        childFieldMap[name] = {
            index: namespaceFields.length - 1,
            def: {
                name,
                type: FieldType.MEASURE,
            },
        };
        if (existingChild) {
            existingDataTable._derivation[0].meta.config = config;
            existingDataTable._derivation[0].meta.fields = fields;
            existingDataTable._derivation[0].criteria = callback;
        }
        if (saveChild && !existingChild) {
            this.__persistDerivation(clone, DT_DERIVATIVES.CAL_MEASURE, { config, fields }, callback);
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
     * @return {DataTable} Returns the new DataTable instance.
     */
    createDimensions(dimArray, dependents, callback, config = {}) {
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
        dimArray.forEach((dimObj, dIdx) => {
            const { name } = dimObj;
            const dimensionData = computedValues.map(dataArray => dataArray[dIdx]);
            // create a field to store this field
            const nameSpaceEntry = new Dimension(name, dimensionData, {
                name,
                type: FieldType.DIMENSION,
            });
            // push this to the child DataTable instance field store
            namespaceFields.push(nameSpaceEntry);
            // update the field map of child DataTable instance
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
        });
        if (config.removeDependentDimensions) {
            return clone.project(dependents, {
                mode: ProjectionMode.EXCLUDE,
            });
        }
        return clone;
    }

    /**
     * Creates a dimension by converting existing dimensions.
     *
     * @public
     * @param {Array.<string>} sourceFields - The names of the source fields.
     * @param {string} category - The name of the new category.
     * @param {string} valueName - The name of the measure.
     * @param {Function} callback - The callback used to calculate new names of source fields.
     * @return {DataTable} Returns a new DataTable instance.
     * @TODO: Remove method as no one uses it or if aware what it does
     */
    createDimensionFrom(sourceFields, category, valueName, callback) {
        const fieldMap = this.getFieldMap();
        const newNames = sourceFields.map(callback);
        // create a data table with all the fields except sourceFields
        const excluded = this.project(sourceFields, {
            mode: ProjectionMode.EXCLUDE,
        });
        // get the new field indices
        const fieldIndices = sourceFields.map(name => fieldMap[name].index);
        const projectedFields = excluded.getNameSpace().fields;
        const existingFields = this.getNameSpace().fields;
        const oldNames = excluded.colIdentifier.split(',');
        const newData = [];
        rowDiffsetIterator(excluded.rowDiffset, (i) => {
            const temp = {};
            oldNames.forEach((name, nIdx) => {
                temp[name] = projectedFields[nIdx].data[i];
            });
            // add the new fields
            const newTuples = fieldIndices.map((fieldsIndex, idx) => {
                const addedTuple = {};
                addedTuple[category] = newNames[idx];
                addedTuple[valueName] = existingFields[fieldsIndex].data[i];
                return addedTuple;
            });
            const newDataTuples = newTuples.map((tuple) => {
                const finalTuple = {};
                Object.entries(temp).forEach((entry) => {
                    finalTuple[entry[0]] = entry[1];
                });
                Object.entries(tuple).forEach((secEntry) => {
                    finalTuple[secEntry[0]] = secEntry[1];
                });
                return finalTuple;
            });
            newData.push(...newDataTuples);
        });
        // create a new data table with this data
        const schema = Object.keys(newData[0]).map((fieldName) => {
            if (fieldMap[fieldName]) {
                return {
                    name: fieldName,
                    type: fieldMap[fieldName].def.type
                };
            }
            if (fieldName === category) {
                return {
                    name: fieldName,
                    type: FieldType.DIMENSION,
                };
            }
            return {
                name: fieldName,
                type: FieldType.MEASURE,
            };
        });
        return new DataTable(newData, schema);
    }

    /**
     * Assembles a Datatable instance from the propagated identifiers.
     *
     * @private
     * @param {Array} identifiers - An array of dimensions that were interacted upon.
     * @return {DataTable} Returns a DataTable assembled from identifiers.
     */
    _assembleTableFromIdentifiers(identifiers) {
        let schema;
        let data;
        if (identifiers.length) {
            schema = identifiers[0].map(val => ({
                name: val,
                type: FieldType.DIMENSION,
            }));
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
        return new DataTable(data, schema);
    }

    /**
     * Filters the current DataTable instance and only return those fields
     * that appear in the propagation table or only those ROW_ID's
     * that appear in the prop table.
     *
     * @private
     * @param {DataTable} propTable - The propagation datatable instance.
     * @return {DataTable} Returns the filtered propagation table.
     */
    _filterPropagationTable(propTable) {
        const { data, schema } = propTable.getData();
        let filteredTable;
        if (schema.length) {
            if (schema[0].name === ROW_ID) {
                // iterate over data and create occurence map
                const occMap = {};
                data.forEach((val) => {
                    occMap[val[0]] = true;
                });
                filteredTable = this.select((fields, rIdx) => occMap[rIdx], {}, false);
            } else {
                let fieldMap = this.fieldMap;
                let filteredSchema = schema.filter(d => d.name in fieldMap);
                filteredTable = this.select((fields) => {
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
            filteredTable = propTable;
        }

        return filteredTable;
    }

    /**
     * Propagates changes across all the connected DataTable instances.
     *
     * @public
     * @param {Array} identifiers - A list of identifiers that were interacted with.
     * @param {Object} payload - The interaction specific details.
     * @param {DataTable} source - The source DataTable instance.
     */
    propagate(identifiers, payload, source) {
        let propTable = identifiers;
        if (!(propTable instanceof DataTable)) {
            propTable = this._assembleTableFromIdentifiers(identifiers);
        }
        // function to propagate to target the DataTable instance.
        const forwardPropagation = (targetDT, propagationData) => {
            targetDT.handlePropagation({
                payload,
                data: propagationData,
            });
            targetDT.propagate(propagationData, payload, this);
        };
        // propagate to children created by SELECT operation
        selectIterator(this, (targetDT) => {
            if (targetDT !== source) {
                forwardPropagation(targetDT, propTable);
            }
        });
        // propagate to children created by PROJECT operation
        projectIterator(this, (targetDT) => {
            if (targetDT !== source) {
                // pass al the props cause it won't make a difference
                forwardPropagation(targetDT, propTable);
            }
        });
        // create the filtered table
        const filteredTable = this._filterPropagationTable(propTable);
        // propagate to children created by groupBy operation
        groupByIterator(this, (targetDT, conf) => {
            if (targetDT !== source) {
                const {
                    reducer,
                    groupByString,
                } = conf;
                // group the filtered table based on groupBy string of target
                const groupedPropTable = filteredTable.groupBy(groupByString.split(','), reducer, false);
                forwardPropagation(targetDT, groupedPropTable);
            }
        });
        // propagate to parent if parent is not source
        if (this.parent && source !== this.parent) {
            forwardPropagation(this.parent, propTable);
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
     * @memberof DataTable
     */
    propagateInterpolatedValues(rangeObj, payload, fromSource) {
        const source = fromSource || this;
        let propTable = rangeObj;
        if (!(propTable instanceof DataTable)) {
            const measures = Object.keys(rangeObj);
            propTable = this.select((fields) => {
                let include = true;
                measures.forEach((fieldName) => {
                    const domain = rangeObj[fieldName];
                    include = include && fields[fieldName] >= domain[0];
                    include = include && fields[fieldName] <= domain[1];
                });
                return include;
            }, {}, false);
        }
        const forward = (dataTable, propagationTable, isParent) => {
            dataTable.handlePropagation({
                payload,
                data: propagationTable,
            });
            dataTable.propagateInterpolatedValues(isParent ?
                rangeObj : propagationTable, payload, this);
        };
        // propagate to children created by SELECT operation
        selectIterator(this, (targetDT, fn) => {
            if (targetDT !== source) {
                let selectTable;
                selectTable = propTable.select(fn, {}, false);
                forward(targetDT, selectTable);
            }
        });
        // propagate to children created by PROJECT operation
        projectIterator(this, (targetDT, projString) => {
            if (targetDT !== source) {
                let projectTable;
                projectTable = propTable.project(projString.split(','), {}, false);
                forward(targetDT, projectTable);
            }
        });
        // propagate to children created by GROUPBY operation
        groupByIterator(this, (targetDT) => {
            if (targetDT !== source) {
                forward(targetDT, propTable);
            }
        });
        // propagate to parent if parent is not source
        if (this.parent && source !== this.parent) {
            forward(this.parent, propTable, true);
        }
    }

    /**
     * Associates a callback with an event name.
     *
     * @public
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback to invoke.
     * @return {DataTable} Returns this current DataTable instance itself.
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
     * @return {DataTable} Returns the current DataTable instance itself.
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
     * @param {DataTable} identifiers The propagated DataTable.
     * @memberof DataTable
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
     * @return {DataTable} Returns the new DataTable instance.
     */
    createBin(measureName, config, binnedFieldName) {
        const clone = this.cloneAsChild();
        const namespaceFields = clone.getNameSpace().fields;
        const fieldMap = this.fieldMap;
        binnedFieldName = binnedFieldName || `${measureName}_binned`;
        if (fieldMap[binnedFieldName]) {
            throw new Error(`Field ${measureName} already exists.`);
        }
        if (!fieldMap[measureName]) {
            throw new Error(`Field ${measureName} does not exist.`);
        }
        // get the data for field to be binned
        const fieldIndex = this.fieldMap[measureName].index;
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
        const nameSpaceEntry = new Dimension(binnedFieldName, labelData, {
            name: binnedFieldName,
            type: FieldType.DIMENSION,
        });
        // push this to the child DataTable instance field store
        namespaceFields.push(nameSpaceEntry);
        // update the field map of child DataTable instance
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

        this.__persistDerivation(clone, DT_DERIVATIVES.BIN, { measureName, config, binnedFieldName }, null);

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
     * @param {DataTable} child : Delegates the parent to remove this child
     */
    __removeChild(child) {
        // remove from child list
        let idx = this.children.findIndex(sibling => sibling === child);
        idx !== -1 ? this.children.splice(idx, 1) : true;
    }
    /**
     *
     * @param { DataTable } parent datatable instance which will act as its parent of this.
     * @param { Queue } criteriaQueue Queue contains in-between operation meta-data
     */
    __addParent(parent, criteriaQueue = []) {
        this.columnNameSpace = this.columnNameSpace === undefined ? this.parent.getNameSpace() : this.columnNameSpace;
        this.__persistDerivation(this, DT_DERIVATIVES.COMPOSE, null, criteriaQueue);
        this.parent = parent;
        parent.children.push(this);
    }

    /**
     *
     * @param {DataTable} table :Child table derived from operation
     * @param {String} operation : Type of operation used
     * @param {Object} config : Contains metaData used in this operation
     * @param {Function} criteriaFn : Function which having used to do the derivation
     */
    __persistDerivation(table, operation, config = {}, criteriaFn) {
        let derivative;
        if (operation !== DT_DERIVATIVES.COMPOSE) {
            derivative = {
                op: operation,
                meta: config,
                criteria: criteriaFn
            };
            table._derivation.push(derivative);
        }
        else {
            derivative = [...criteriaFn];
            table._derivation.length = 0;
            table._derivation.push(...derivative);
        }
    }
}

export default DataTable;
