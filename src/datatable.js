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
    FIELD_TYPE,
    SELECTION_MODE,
    PROJECTION_MODE,
    PROPOGATION,
 } from './enums';
import { Measure, Dimension } from './fields';

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
        // callback to call on propogation
        this._onPropogation = () => {};
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
    cloneAsChild() {
        const retDataTable = this.clone();
        this.child.push(retDataTable);
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
    project(projField, config = {}) {
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
        if (mode === PROJECTION_MODE.EXCLUDE) {
            const rejectionSet = allFields.filter(fieldName => normalizedProjField.indexOf(fieldName) === -1);
            normalizedProjField = rejectionSet;
        }
        const cloneDataTable = this.cloneAsChild();
        cloneDataTable.projectHelper(normalizedProjField.join(','));
        return cloneDataTable;
    }

    /**
     * Set the selection of the cloned DataTable
     * @param  {functiona} selectFn The function which will be looped through all the data
     * if it return true the row will be there in the DataTable
     * @param {Object} config The mode configuration.
     * @param {string} config.mode The mode of selection.
     * @return {DataTable} The cloned DataTable with the required selection;
     */
    select(selectFn, config = {}) {
        // handle ALL selection mode
        if (config.mode === SELECTION_MODE.ALL) {
            // do anormal selection
            const firstClone = this.cloneAsChild();
            firstClone.selectHelper(firstClone.getNameSpace().fields, selectFn, {});
            // do an inverse selection
            const rejectClone = this.cloneAsChild();
            rejectClone.selectHelper(rejectClone.getNameSpace().fields, selectFn, {
                mode: SELECTION_MODE.INVERSE,
            });
            // return an array with both selections
            return [firstClone, rejectClone];
        }
        const cloneDataTable = this.cloneAsChild();
        cloneDataTable.selectHelper(cloneDataTable.getNameSpace().fields, selectFn, config);
        return cloneDataTable;
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
     * @return {DataTable}           new DataTable with the required operations
     */
    groupBy(fieldsArr, reducers) {
        const newDatatable = groupBy(this, fieldsArr, reducers);
        this.groupedChildren[fieldsArr.join()] = newDatatable;
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
        return this;
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
    calculatedMeasure(config, fields, callback) {
        const {
            name,
        } = config;
        // get the fields present in datatable
        const fieldMap = this.getFieldMap();
        // validate that the supplied fields are present in datatable
        // and are measures
        const fieldIndices = fields.map((field) => {
            const fieldSpec = fieldMap[field];
            if (!fieldSpec) {
                throw new Error(`${field} is not a valid column name.`);
            }
            if (fieldSpec.def.type !== FIELD_TYPE.MEASURE) {
                throw new Error(`${field} is not a ${FIELD_TYPE.MEASURE}.`);
            }
            return fieldSpec.index;
        });
        const clone = this.cloneAsChild();
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
            type: FIELD_TYPE.MEASURE,
        });
        // push this to the child datatables field store
        namespaceFields.push(nameSpaceEntry);
        // update the field map of child datatable
        const childFieldMap = clone.getFieldMap();
        childFieldMap[name] = {
            index: namespaceFields.length - 1,
            def: {
                name,
                type: FIELD_TYPE.MEASURE,
            },
        };
        // update the column identifier
        clone.colIdentifier += `,${name}`;
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
            if (fieldSpec.def.type !== FIELD_TYPE.DIMENSION) {
                throw new Error(`${field} is not a ${FIELD_TYPE.DIMENSION}.`);
            }
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
                type: FIELD_TYPE.DIMENSION,
            });
            // push this to the child datatables field store
            namespaceFields.push(nameSpaceEntry);
            // update the field map of child datatable
            const childFieldMap = clone.getFieldMap();
            childFieldMap[name] = {
                index: namespaceFields.length - 1,
                def: {
                    name,
                    type: FIELD_TYPE.DIMENSION,
                },
            };
            // update the column identifier
            clone.colIdentifier += `,${name}`;
        });
        if (config.removeDependentDimensions) {
            return clone.project(dependents, {
                mode: PROJECTION_MODE.EXCLUDE,
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
            mode: PROJECTION_MODE.EXCLUDE,
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
                    type: FIELD_TYPE.DIMENSION,
                };
            }
            return {
                name: fieldName,
                type: FIELD_TYPE.MEASURE,
            };
        });
        return new DataTable(newData, schema);
    }

    /**
     * This method is used to propogate changes across all connected
     *
     * @param {Object} payload Interaction specific details.
     * @param {Array} identifiers list of identifiers that were interacted with.
     * @memberof DataTable
     */
    propagate(identifiers, payload, fromSource) {
        let propTable = identifiers;
        if (!(propTable instanceof DataTable)) {
            const schema = identifiers[0].map(val => ({
                name: val,
                type: FIELD_TYPE.DIMENSION,
            }));
            // format the data
            // @TODO: no documentation on how CSV_ARR data format works.
            const data = [];
            const header = identifiers[0];
            for (let i = 0; i < identifiers.length; i += 1) {
                const vals = identifiers[i];
                const temp = {};
                vals.forEach((fieldVal, cIdx) => {
                    temp[header[cIdx]] = fieldVal;
                });
                data.push(temp);
            }
            propTable = new DataTable(data, schema);
        }
        // source won't be defined the first time around
        const source = fromSource || this;
        const forward = (dataTable) => {
            dataTable.handlePropogation({
                payload,
                data: propTable,
            });
            dataTable.propagate(propTable, payload, this);
        };
        // propogate event to parent
        if (this.parent && source !== this.parent) {
            forward(this.parent);
        }
        // handle children
        this.child.forEach((cDt) => {
            if (cDt !== source) {
                forward(cDt);
            }
        });
        // handle grouped childen
        Object.keys(this.groupedChildren).forEach((groupString) => {
            const joinedDT = this.join(propTable);
            const projectionParams = groupString.split(',');
            const groupedDT = joinedDT.project(projectionParams);
            const target = this.groupedChildren[groupString];
            if (target !== source) {
                target.handlePropogation({
                    payload,
                    data: groupedDT,
                });
                target.propagate(groupedDT, payload, this);
            }
        });
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
            this._onPropogation = callback;
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
     * @param {Object} payload The interaction payload.
     * @param {Array} identifiers The list of identifiers.
     * @memberof DataTable
     */
    handlePropogation(payload, identifiers) {
        this._onPropogation(payload, identifiers);
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
        // const fieldMap = this.fieldMap;
        // if (fieldMap[binnedFieldName]) {
        //     throw new Error(`Field ${measureName} already exists.`);
        // }
        // if (!fieldMap[measureName]) {
        //     throw new Error(`Field ${measureName} does not exist.`);
        // }
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
        const clone = this.cloneAsChild();
        const namespaceFields = clone.getNameSpace().fields;
        const nameSpaceEntry = new Dimension(binnedFieldName, labelData, {
            name: binnedFieldName,
            type: FIELD_TYPE.DIMENSION,
        });
        // push this to the child datatables field store
        namespaceFields.push(nameSpaceEntry);
        // update the field map of child datatable
        const childFieldMap = clone.getFieldMap();
        childFieldMap[binnedFieldName] = {
            index: namespaceFields.length - 1,
            def: {
                name: binnedFieldName,
                type: FIELD_TYPE.DIMENSION,
            },
        };
        // update the column identifier
        clone.colIdentifier += `,${binnedFieldName}`;
        return clone;
    }

    // ============================== Accessable functionality ends ======================= //
}

export { DataTable as default };
