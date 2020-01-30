import { extend2 } from '../utils';
import { rowDiffsetIterator } from './row-diffset-iterator';
import DataModel from '../export';
import reducerStore from '../utils/reducer-store';
import { defaultReducerName } from './group-by-function';
import { FieldType, DimensionSubtype } from '../enums';
import { ROW_ID } from '../constants';

/**
 * This function sanitize the user given field and return a common Array structure field
 * list
 * @param  {DataModel} dataModel the dataModel operating on
 * @param  {Array} fieldArr  user input of field Array
 * @return {Array}           arrays of field name
 */
function getFieldArr (dataModel, fieldArr) {
    const retArr = [];
    const fieldStore = dataModel.getFieldspace();
    const dimensions = fieldStore.getDimension();

    Object.entries(dimensions).forEach(([key]) => {
        if (fieldArr && fieldArr.length) {
            if (fieldArr.indexOf(key) !== -1) {
                retArr.push(key);
            }
        } else {
            retArr.push(key);
        }
    });

    return retArr;
}

/**
 * This sanitize the reducer provide by the user and create a common type of object.
 * user can give function Also
 * @param  {DataModel} dataModel     dataModel to worked on
 * @param  {Object|function} [reducers={}] reducer provided by the users
 * @return {Object}               object containing reducer function for every measure
 */
function getReducerObj (dataModel, reducers = {}) {
    const retObj = {};
    const fieldStore = dataModel.getFieldspace();
    const measures = fieldStore.getMeasure();
    const defReducer = reducerStore.defaultReducer();

    Object.keys(measures).forEach((measureName) => {
        if (typeof reducers[measureName] !== 'string') {
            reducers[measureName] = measures[measureName].defAggFn();
        }
        const reducerFn = reducerStore.resolve(reducers[measureName]);
        if (reducerFn) {
            retObj[measureName] = reducerFn;
        } else {
            retObj[measureName] = defReducer;
            reducers[measureName] = defaultReducerName;
        }
    });
    return retObj;
}

/**
 * main function which perform the group-by operations which reduce the measures value is the
 * fields are common according to the reducer function provided
 * @param  {DataModel} dataModel the dataModel to worked
 * @param  {Array} fieldArr  fields according to which the groupby should be worked
 * @param  {Object|Function} reducers  reducers function
 * @param {DataModel} existingDataModel Existing datamodel instance
 * @return {DataModel} new dataModel with the group by
 */
function groupBy (dataModel, fieldArr, reducers) {
    const sFieldArr = getFieldArr(dataModel, fieldArr);
    const reducerObj = getReducerObj(dataModel, reducers);
    const fieldStore = dataModel.getFieldspace();
    const idData = dataModel.getPartialFieldspace().idField.data();
    const fieldStoreObj = fieldStore.fieldsObj();
    const dbName = fieldStore.name;
    const dimensionArr = [];
    const measureArr = [];
    const schema = [];
    const hashMap = {};
    const data = [];
    let newDataModel;

    // Prepare the schema
    Object.entries(fieldStoreObj).forEach(([key, value]) => {
        if (sFieldArr.indexOf(key) !== -1 || reducerObj[key]) {
            schema.push(extend2({}, value.schema()));

            switch (value.schema().type) {
            case FieldType.MEASURE:
                measureArr.push(key);
                break;
            default:
            case FieldType.DIMENSION:
                dimensionArr.push(key);
            }
        }
    });
    // Prepare the data
    let rowCount = 0;
    const idMap = [];
    rowDiffsetIterator(dataModel._rowDiffset, (i) => {
        let hash = '';
        dimensionArr.forEach((_) => {
            hash = `${hash}-${fieldStoreObj[_].partialField.data[i]}`;
        });
        if (hashMap[hash] === undefined) {
            hashMap[hash] = rowCount;
            data.push({});
            idMap.push([]);
            dimensionArr.forEach((_) => {
                data[rowCount][_] = fieldStoreObj[_].partialField.data[i];
            });
            measureArr.forEach((_) => {
                data[rowCount][_] = [fieldStoreObj[_].partialField.data[i]];
            });
            idMap[rowCount] = [`${idData[i]}`];
            rowCount += 1;
        } else {
            measureArr.forEach((_) => {
                data[hashMap[hash]][_].push(fieldStoreObj[_].partialField.data[i]);
            });
            idMap[hashMap[hash]].push(`${idData[i]}`);
        }
    });

    // reduction
    let cachedStore = {};
    let cloneProvider = () => dataModel.detachedRoot();
    data.forEach((row, i) => {
        const tuple = row;
        measureArr.forEach((_) => {
            tuple[_] = reducerObj[_](row[_], cloneProvider, cachedStore);
        });
        tuple[ROW_ID] = idMap[i];
    });

    schema.push({
        name: ROW_ID,
        type: FieldType.DIMENSION,
        subtype: DimensionSubtype.ID
    });

    newDataModel = new DataModel(data, schema, { name: dbName });
    return newDataModel;
}

export { groupBy, getFieldArr, getReducerObj };
