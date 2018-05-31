import Relation from './relation';
import dataBuilder from './operator/data-builder';
import crossProduct from './operator/cross-product';
import naturalJoinFilter from './operator/natural-join-filter-function';
import union from './operator/union';
import difference from './operator/difference';
import rowDiffsetIterator from './operator/row-diffset-iterator';
import { groupBy } from './operator/group-by';
import { createBuckets } from './operator/bucket-creator';
import {
    selectIterator,
    projectIterator,
    groupByIterator,
    calculatedMeasureIterator,
} from './operator/child-iterator';
import {
    FieldType,
    SelectionMode,
    ProjectionMode
 } from './enums';

import { PROPOGATION, ROW_ID } from './constants';

import { Measure, Dimension } from './fields';

import reducerStore from './utils/reducer';

/**
 * The main class
 * @extends Relation
 */
class DataTable extends Relation {
    /**
     * DataTable constructor
     * @param  {Array} args Arguments passed to create DataTable class
     */
    constructor (...args) {
        super(...args);
        // This will hold all the children DataTable
        this.child = [];
        // array to hold all the grouped children
        this.groupedChildren = {};
        this.selectedChildren = [];
        this.projectedChildren = {};
        this.calculatedMeasureChildren = [];
        // callback to call on propogation
        this._onPropogation = [];
        this.sortingDetails = {
            column: [],
            type: [],
        };
    }
    /**
     * This function will create a new DataTable with the required field to have
     * the clone of the DataTable.
     * @return {DataTable} The cloned DataTable.
     */
    clone() {
        return new DataTable(this);
    }

    /**
     * extends the clone functionality with the child parent relationship
     * @return {DataTable} The cloned DataTable
     */
    cloneAsChild(saveChild = true) {
        const retDataTable = this.clone();
        if (saveChild) {
            this.child.push(retDataTable);
        }
        retDataTable.parent = this;
        return retDataTable;
    }

    /**
     * If the DataTable is cloned one and don't have the columnNameSpace then look
     * to it's parent for the same
     * @return {Object} Field store
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
    getSchema() {
        return this.getNameSpace().fields.map(d => d.schema);
    }

    // ============================== Accessable functionality ======================= //
    /**
     * This Function will give the data after the operation in the format of
     * multidimensional array with first row as schema
     * @param {boolean} rowWise this define how the data need to be returned row wise or column wise
     * @return {Array} multidimensional array of the data
     */
    getData(rowWise = false) {
        return dataBuilder.call(this, this.getNameSpace().fields, this.rowDiffset,
            this.colIdentifier, this.sortingDetails, { rowWise });
    }

    /**
     * This returns the data with the uids
     */
    getDataWithUids () {
        return dataBuilder.call(this, this.getNameSpace().fields, this.rowDiffset,
            this.colIdentifier, this.sortingDetails, {
                addUid: true
            });
    }
    /**
     * This helps to rename the column name of the DataTable this helps in joining two dataTable.
     * Also union and difference as these operations required to have same column name.
     * @param  {Object} schemaObj object having the name of the field to rename as key and the new
     * name as the value
     * @return {DataTable}           The cloned DataTable with the rename columns
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
     * Say there are two dataTablw tableA with 4 column 5 rows and tableB with 3 column 6 row
     * so the new DataTable tableA X tableB will have 7(4 + 3) rows and 30(5 * 6) columns (if no
     * filter function is provided).
     *
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
     * @param  {DataTable} joinWith the DataTable with whome this DataTable will be joined
     * @return {DataTable}          The new joind DataTable
     */
    naturalJoin(joinWith) {
        return crossProduct(this, joinWith, naturalJoinFilter(this, joinWith), true);
    }

    /**
     * This function handles the union operation of the relational algebra.
     * It can be termed as vertical joining of all the unique tuples from both the dataTable.
     * The requirement is both the DataTable should have same column name and order
     * @param  {DataTable} unionWith The DataTable with which this table will be united
     * @return {DataTable}           The new DataTable with the vertical joining
     */
    union(unionWith) {
        return union(this, unionWith);
    }

    /**
     * This function handles the difference operation of the relational algebra.
     * It can be termed as vertical joining of all the tuples those are not in the second DataTable.
     * The requirement is both the DataTable should have same column name and order
     * @param  {DataTable} differenceWith The DataTable with which this table will be united
     * @return {DataTable}           The new DataTable with the vertical joining
     */
    difference(differenceWith) {
        return difference(this, differenceWith);
    }

    /**
     * Set the projection of the DataTable. It actually create a clone DataTable
     * then it will apply the projection on the cloned DataTable.
     * @param {Array.<string | Regexp>} projField column name or regular expression.
     * @return {DataTable} newly created DataTable with the given projection.
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
        cloneDataTable.projectHelper(normalizedProjField.join(','));
        if (saveChild) {
            this.projectedChildren[normalizedProjField.join(',')] = cloneDataTable;
        }
        return cloneDataTable;
    }

    /**
     * Set the selection of the cloned DataTable
     * If an existing datatable is passed in the last argument, then it mutates the existing datatable
     * instead of cloning a new datatable.
     * @param  {functiona} selectFn The function which will be looped through all the data
     * if it return true the row will be there in the DataTable
     * @param {Object} config The mode configuration.
     * @param {string} config.mode The mode of selection.
     * @param {string} saveChild Whether to save the clonedatatable in children
     * @param {DataTable} existingDataTable existing data table instance
     * @return {DataTable} The cloned DataTable with the required selection
     */
    select(selectFn, config = {}, saveChild = true, existingDataTable) {
        let cloneDataTable;
        let newDataTable;
        let rowDiffset;
        // handle ALL selection mode
        if (config.mode === SelectionMode.ALL) {
            // do anormal selection
            const firstClone = this.cloneAsChild();
            rowDiffset = firstClone.selectHelper(firstClone.getNameSpace().fields, selectFn, {});
            firstClone.rowDiffset = rowDiffset;
            // do an inverse selection
            const rejectClone = this.cloneAsChild();
            rowDiffset = rejectClone.selectHelper(rejectClone.getNameSpace().fields, selectFn, {
                mode: SelectionMode.INVERSE,
            });
            rejectClone.rowDiffset = rowDiffset;
            // return an array with both selections
            return [firstClone, rejectClone];
        }
        let child;
        if (existingDataTable instanceof DataTable) {
            child = this.selectedChildren.find(obj => obj.table === existingDataTable);
        }
        if (child) {
            newDataTable = existingDataTable;
            rowDiffset = this.selectHelper(this.getNameSpace().fields, selectFn, config);
            existingDataTable.mutate('rowDiffset', rowDiffset);
            child.selectionFunction = selectFn;
        }
        else {
            cloneDataTable = this.cloneAsChild(saveChild);
            rowDiffset = cloneDataTable.selectHelper(cloneDataTable.getNameSpace().fields, selectFn, config);
            cloneDataTable.rowDiffset = rowDiffset;
            newDataTable = cloneDataTable;
        }

        // store reference to chld table and selector function
        if (saveChild && !child) {
            this.selectedChildren.push({
                table: cloneDataTable,
                selectionFunction: selectFn
            });
        }

        return newDataTable;
    }

    /**
     * Mutates a property of the datatable with a new value
     * @param {string} key Property of the datatable
     * @param {string} value Value of the property
     * @return {DataTable} Instance of the datatable
     */
    mutate (key, value) {
        this[key] = value;
        selectIterator(this, (table, fn) => {
            this.select(fn, {}, false, table);
        });

        projectIterator(this, (table) => {
            table.mutate(key, value);
        });

        calculatedMeasureIterator(this, (table, params) => {
            table[key] = value;
            this.calculatedMeasure(...[...params, false, table]);
        });

        groupByIterator(this, (table, params) => {
            this.groupBy(...[params.groupByString.split(','), params.reducer], false, table);
        });
        return this;
    }

    /**
     * This function will perform group-by on the data table according to the fields
     * and reducers provided.
     *
     * fields can be skipped in that case all field will be taken into consideration.
     * reducres single function defination can be given or object for each field, If nothing
     * is provided sum will be the default reducer.
     * @param  {Array} fieldsArr array containing the name of the columns
     * @param  {Object|Function|string} reducers  reducer function
     * @param {string} saveChild Whether to save the child or not
     * @param {DataTable} existingDataTable Existing datatable instance
     * @return {DataTable} new DataTable with the required operations
     */
    groupBy(fieldsArr, reducers = {}, saveChild = true, existingDataTable) {
        const values = Object.values(reducers);
        const names = values.map(value => (value instanceof Function ? value.name : value));
        const reducerString = reducers ? `${Object.keys(reducers)}-${names}` : null;
        const groupByString = `${fieldsArr.join()}`;
        const key = `${groupByString}-${reducerString}`;
        const groupedChildren = this.groupedChildren;
        let present = false;
        if (existingDataTable instanceof DataTable) {
            for (let groupByKey in groupedChildren) {
                if ({}.hasOwnProperty.call(groupedChildren, key)) {
                    let child = groupedChildren[groupByKey];
                    if (child === existingDataTable) {
                        present = true;
                        child.reducer = reducers;
                        child.groupByString = groupByString;
                        break;
                    }
                }
            }
        }
        let params = [this, fieldsArr, reducers];
        if (present) {
            params.push(existingDataTable);
        }
        const newDatatable = groupBy(...params);
        if (saveChild && !present) {
            const temp = {};
            temp.child = newDatatable;
            temp.reducer = reducers;
            temp.groupByString = groupByString;
            groupedChildren[key] = temp;
        }
        if (present) {
            existingDataTable.mutate('rowDiffset', existingDataTable.rowDiffset);
        }
        newDatatable.parent = this;
        return newDatatable;
    }

    /**
     * Returns index and field details in an object where key is the field name.
     * @return {Object} field definitions
     */
    getFieldMap () {
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
        return new this.constructor([header].concat(struct.data), struct.schema, null, { dataformat: 'CSVArr' });
    }

    /**
     * This function is used to create a calculated measure in the datatable.
     *
     * @param {Object} config The input config.
     * @param {string} config.name The name of the field.
     * @param {Array<string>} fields Array of fields to take as input.
     * @param {Function} callback Callback supplied to calculate the property.
     * @return {DataTable} New instance of datatable.
     * @memberof DataTable
     */
    calculatedMeasure(config, fields, callback, saveChild = true, existingDataTable) {
        const {
            name,
        } = config;
        let clone;
        let existingChild = this.calculatedMeasureChildren.find(dt => dt === existingDataTable);
        // get the fields present in datatable
        const fieldMap = this.getFieldMap();
        if (fieldMap[name] && !existingChild) {
            throw new Error(`${name} field already exists in table.`);
        }
        // validate that the supplied fields are present in datatable
        // and are measures
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
            const computedValue = callback(...fieldsData);
            computedValues[i] = computedValue;
        });
        // create a field in datatable to store this field
        const nameSpaceEntry = new Measure(name, computedValues, {
            name,
            type: FieldType.MEASURE,
        });
        // push this to the child datatables field store
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
        // update the field map of child datatable
        const childFieldMap = clone.getFieldMap();
        childFieldMap[name] = {
            index: namespaceFields.length - 1,
            def: {
                name,
                type: FieldType.MEASURE,
            },
        };
        if (saveChild && !existingChild) {
            this.calculatedMeasureChildren.push({
                table: clone,
                params: [config, fields, callback]
            });
        }

        return clone;
    }

    /**
     * This method is used to generate new dimensions from existing
     * dimensions by using the supllied callback.
     *
     * @param {Array<Object>} dimArray Array of objects with the names of new dimensions to create.
     * @param {Array<string>} dependents Array of the dimensions to use to create new dimensions.
     * @param {Function} callback callback to execute to create new dimensions.
     * @param {Object} config Object wth configuration options.
     * @param {string} config.removeDependentDimensions Flag to indicate whether dependent dimensions should be removed.
     * @return {DataTable} The new datatable instance.
     * @memberof DataTable
     */
    generateDimensions(dimArray, dependents, callback, config = {}) {
        // get the fields present in datatable
        const fieldMap = this.getFieldMap();
        // validate that the supplied fields are present in datatable
        // and are measures
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
        // create new fields in the datatable
        dimArray.forEach((dimObj, dIdx) => {
            const { name } = dimObj;
            const dimensionData = computedValues.map(dataArray => dataArray[dIdx]);
            // create a field in datatable to store this field
            const nameSpaceEntry = new Dimension(name, dimensionData, {
                name,
                type: FieldType.DIMENSION,
            });
            // push this to the child datatables field store
            namespaceFields.push(nameSpaceEntry);
            // update the field map of child datatable
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
     * This method is used to create a dimension by converting
     * existing dimensions.
     *
     * @param {Array.<string>} sourceFields The names of the source fields.
     * @param {string} category The name of the new category.
     * @param {string} valueName the name of the measure.
     * @param {Function} callback callback used to calculate new names of source fields.
     * @return {DataTable} A new datatable instance.
     * @memberof DataTable
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
     * This method is used to assemble a Datatable instance from
     * the propagated identifiers.
     *
     * @private
     * @param {Array} identifiers Array of dimensions that were interacted upon
     * @return {DataTable} DataTable assembled from identfiers.
     * @memberof DataTable
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
     * This method is used to filter this DataTable instance
     * and only return those fields that appear in the propagation table
     * or only those ROW_ID's that appear in the prop table.
     *
     * @private
     * @param {DataTable} propTable The propagation datatable instance.
     * @return {Datatbale} Filtered prpgation table.
     * @memberof DataTable
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
                filteredTable = this.select((fields) => {
                    let include = true;
                    schema.forEach((propField, idx) => {
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
     * This method is used to propogate changes across all connected
     *
     * @param {Array} identifiers list of identifiers that were interacted with.
     * @param {Object} payload Interaction specific details.
     * @memberof DataTable
     */
    propagate(identifiers, payload, source) {
        let propTable = identifiers;
        if (!(propTable instanceof DataTable)) {
            propTable = this._assembleTableFromIdentifiers(identifiers);
        }
        // function to propogate datatble to target datatable
        const forwardPropagation = (targetDT, propogationData) => {
            targetDT.handlePropogation({
                payload,
                data: propogationData,
            });
            targetDT.propagate(propogationData, payload, this);
        };
        // propogate to children created by SELECT operation
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
        // propogate to children created by GROUPBY operation
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
     * to crosstab group where propagation of is won't
     * work so we propagate the selected range of the fields
     * instead.
     *
     * @private
     * @param {Object} rangeObj Object with fieldnames and corresponsding selected ranges.
     * @param {Object} payload Object with interation related fields.
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
            dataTable.handlePropogation({
                payload,
                data: propagationTable,
            });
            dataTable.propagateInterpolatedValues(isParent ?
                rangeObj : propagationTable, payload, this);
        };
        // propogate to children created by SELECT operation
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
        // propogate to children created by GROUPBY operation
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
     * This method is used to associate a callback with an
     * event name
     *
     * @param {string} eventName The name of the event.
     * @param {Function} callback The callback to invoke.
     * @return {DataTable} This instance.
     * @memberof DataTable
     */
    on(eventName, callback) {
        switch (eventName) {
        case PROPOGATION:
            this._onPropogation.push(callback);
            break;
        default:
            break;
        }
        return this;
    }

    unsubscribe (eventName) {
        switch (eventName) {
        case PROPOGATION:
            this._onPropogation = [];
            break;
        default:
            break;
        }
        return this;
    }
    /**
     * This method is used to invoke the method associated with
     * prpogation.
     *
     * @private
     * @param {Object} payload The interaction payload.
     * @param {DataTable} identifiers The propogated DataTable.
     * @memberof DataTable
     */
    handlePropogation(payload, identifiers) {
        let propListeners = this._onPropogation;
        propListeners.forEach(fn => fn.call(this, payload, identifiers));
    }

    /**
     * This method is used bin a measure based on provided
     * buckets or based on calculated buckets created from configuration.
     *
     * @param {string} measureName The name of the measure to bin.
     * @param {Object} config The binning configuration.
     * @param {Array} config.buckets The array of buckets.
     * @param {number} config.binSize The size of a bin.
     * @param {number} config.numOfBins The number of bins to create.
     * @param {string} binnedFieldName the name of the new field.
     * @return {DataTable} The cloned datatable.
     * @memberof DataTable
     */
    bin(measureName, config, binnedFieldName) {
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
        // push this to the child datatables field store
        namespaceFields.push(nameSpaceEntry);
        // update the field map of child datatable
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
        return clone;
    }

    static get Reducers() {
        return reducerStore;
    }
    // ============================== Accessable functionality ends ======================= //
}

export { DataTable as default };
