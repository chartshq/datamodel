import { defReducer, fnList } from './group-by-function';
import { extend2 } from '../../utils';
import rowDiffsetIterator from './row-diffset-iterator';
import DataTable from '../index';

/**
 * This function sanitize the user given field and return a common Array structure field
 * list
 * @param  {DataTable} dataTable the dataTable operating on
 * @param  {Array} fieldArr  user input of field Array
 * @return {Array}           arrays of field name
 */
function getFieldArr(dataTable, fieldArr) {
    const retArr = [];
    const fieldStore = dataTable.getNameSpace();
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
 * @param  {DataTable} dataTable     dataTable to worked on
 * @param  {Object|function} [reducers={}] reducer provided by the users
 * @return {Object}               object containing reducer function for every measure
 */
function getReducerObj(dataTable, reducers = {}) {
    const retObj = {};
    const pReducers = reducers;
    const fieldStore = dataTable.getNameSpace();
    const measures = fieldStore.getMeasure();
    let reducer = defReducer;
    if (typeof reducers === 'function') {
        reducer = reducers;
    }
    Object.entries(measures).forEach(([key]) => {
        if (typeof reducers[key] === 'string') {
            pReducers[key] = fnList[pReducers[key]] ? fnList[pReducers[key]] : reducer;
        }
        if (typeof reducers[key] !== 'function') {
            pReducers[key] = undefined;
        }
        retObj[key] = pReducers[key] || reducer;
    });
    return retObj;
}

/**
 * main function which perform the group-by operations which reduce the measures value is the
 * fields are common according to the reducer function provided
 * @param  {DataTable} dataTable the dataTable to worked
 * @param  {Array} fieldArr  fields according to which the groupby should be worked
 * @param  {Object|Function} reducers  reducers function
 * @return {DataTable}           new dataTable with the group by
 */
function groupBy(dataTable, fieldArr, reducers) {
    const sFieldArr = getFieldArr(dataTable, fieldArr);
    const reducerObj = getReducerObj(dataTable, reducers);
    const fieldStore = dataTable.getNameSpace();
    const fieldStoreObj = fieldStore.fieldsObj();
    const dbName = fieldStore.name;
    const dimensionArr = [];
    const measureArr = [];
    const schema = [];
    const hashMap = {};
    const data = [];
    // Prepare the schema
    Object.entries(fieldStoreObj).forEach(([key, value]) => {
        if (sFieldArr.indexOf(key) !== -1 || reducerObj[key]) {
            schema.push(extend2({}, value.schema));
            if (value.schema.type === 'measure') {
                measureArr.push(key);
            } else {
                dimensionArr.push(key);
            }
        }
    });
    // Prepare the data
    let rowCount = 0;
    rowDiffsetIterator(dataTable.rowDiffset, (i) => {
        let hash = '';
        dimensionArr.forEach((_) => {
            hash = `${hash}-${fieldStoreObj[_].data[i]}`;
        });
        if (hashMap[hash] === undefined) {
            hashMap[hash] = rowCount;
            data.push({});
            dimensionArr.forEach((_) => {
                data[rowCount][_] = fieldStoreObj[_].data[i];
            });
            measureArr.forEach((_) => {
                data[rowCount][_] = [fieldStoreObj[_].data[i]];
            });
            rowCount += 1;
        } else {
            measureArr.forEach((_) => {
                data[hashMap[hash]][_].push(fieldStoreObj[_].data[i]);
            });
        }
    });
    // reduction
    data.forEach((row) => {
        const tuple = row;
        measureArr.forEach((_) => {
            tuple[_] = reducerObj[_](row[_]);
        });
    });
    return new DataTable(data, schema, dbName);
}

export { groupBy, getFieldArr, getReducerObj };
