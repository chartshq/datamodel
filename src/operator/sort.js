import { DimensionSubtype, MeasureSubtype } from '../enums';
import { mergeSort } from './merge-sort';
import { fieldInSchema } from '../helper';
import { isCallable, isArray } from '../utils';

/**
 * Generates the sorting functions to sort the data of a DataModel instance
 * according to the input data type.
 *
 * @param {string} dataType - The data type e.g. 'measure', 'datetime' etc.
 * @param {string} sortType - The sorting order i.e. 'asc' or 'desc'.
 * @return {Function} Returns the the sorting function.
 */
function getSortFn (dataType, sortType) {
    let retFunc;

    switch (dataType) {
    case MeasureSubtype.CONTINUOUS:
    case DimensionSubtype.TEMPORAL:
        if (sortType === 'asc') {
            retFunc = (a, b) => a - b;
        } else {
            retFunc = (a, b) => b - a;
        }
        break;
    default:
        if (sortType === 'asc') {
            retFunc = (a, b) => {
                a = `${a}`;
                b = `${b}`;
                if (a === b) {
                    return 0;
                }
                return a > b ? 1 : -1;
            };
        } else {
            retFunc = (a, b) => {
                a = `${a}`;
                b = `${b}`;
                if (a === b) {
                    return 0;
                }
                return a > b ? -1 : 1;
            };
        }
    }

    return retFunc;
}

/**
 * Resolves the actual sorting function based on sorting string value.
 *
 * @param {Object} fDetails - The target field info.
 * @param {string} strSortOrder - The sort order value.
 * @return {Function} Returns the sorting function.
 */
function resolveStrSortOrder (fDetails, strSortOrder) {
    const sortOrder = String(strSortOrder).toLowerCase() === 'desc' ? 'desc' : 'asc';
    return getSortFn(fDetails.type, sortOrder);
}

/**
 * Groups the data according to the specified target field.
 *
 * @param {Array} data - The input data array.
 * @param {number} fieldIndex - The target field index within schema array.
 * @return {Array} Returns an array containing the grouped data.
 */
function groupData (data, fieldIndex) {
    const hashMap = new Map();
    const groupedData = [];

    data.forEach((datum) => {
        const fieldVal = datum[fieldIndex];
        if (hashMap.has(fieldVal)) {
            groupedData[hashMap.get(fieldVal)][1].push(datum);
        } else {
            groupedData.push([fieldVal, [datum]]);
            hashMap.set(fieldVal, groupedData.length - 1);
        }
    });

    return groupedData;
}

/**
 * Creates the argument value used for sorting function when sort is done
 * with another fields.
 *
 * @param {Array} groupedDatum - The grouped datum for a single dimension field value.
 * @param {Array} targetFields - An array of the sorting fields.
 * @param {Array} targetFieldDetails - An array of the sorting field details in schema.
 * @return {Object} Returns an object containing the value of sorting fields and the target field name.
 */
function createSortingFnArg (groupedDatum, targetFields, targetFieldDetails) {
    const arg = {
        label: groupedDatum[0]
    };

    targetFields.reduce((acc, next, idx) => {
        acc[next] = groupedDatum[1].map(datum => datum[targetFieldDetails[idx].index]);
        return acc;
    }, arg);

    return arg;
}

/**
 * Sorts the data by applying the standard sorting mechanism.
 *
 * @param {Array} data - The input data array.
 * @param {Array} schema - The data schema.
 * @param {Array} sortingDetails - An array containing the sorting configs.
 */
function applyStandardSort (data, schema, sortingDetails) {
    let fieldName;
    let sortMeta;
    let fDetails;
    let i = sortingDetails.length - 1;

    for (; i >= 0; i--) {
        fieldName = sortingDetails[i][0];
        sortMeta = sortingDetails[i][1];
        fDetails = fieldInSchema(schema, fieldName);

        if (!fDetails) {
            // eslint-disable-next-line no-continue
            continue;
        }

        if (isCallable(sortMeta)) {
            // eslint-disable-next-line no-loop-func
            mergeSort(data, (a, b) => sortMeta(a[fDetails.index], b[fDetails.index]));
        } else if (isArray(sortMeta)) {
            const groupedData = groupData(data, fDetails.index);
            const sortingFn = sortMeta[sortMeta.length - 1];
            const targetFields = sortMeta.slice(0, sortMeta.length - 1);
            const targetFieldDetails = targetFields.map(f => fieldInSchema(schema, f));

            groupedData.forEach((groupedDatum) => {
                groupedDatum.push(createSortingFnArg(groupedDatum, targetFields, targetFieldDetails));
            });

            mergeSort(groupedData, (a, b) => {
                const m = a[2];
                const n = b[2];
                return sortingFn(m, n);
            });

            // Empty the array
            data.length = 0;
            groupedData.forEach((datum) => {
                data.push(...datum[1]);
            });
        } else {
            const sortFn = resolveStrSortOrder(fDetails, sortMeta);
            // eslint-disable-next-line no-loop-func
            mergeSort(data, (a, b) => sortFn(a[fDetails.index], b[fDetails.index]));
        }
    }
}

/**
 * Creates a map based on grouping.
 *
 * @param {Array} depColumns - The dependency columns' info.
 * @param {Array} data - The input data.
 * @param {Array} schema - The data schema.
 * @param {Array} sortingDetails - The sorting details for standard sorting.
 * @return {Map} Returns a map.
 */
const makeGroupMapAndSort = (depColumns, data, schema, sortingDetails) => {
    if (depColumns.length === 0) { return data; }

    const targetCol = depColumns[0];
    const map = new Map();

    data.reduce((acc, currRow) => {
        const fVal = currRow[targetCol.index];
        if (acc.has(fVal)) {
            acc.get(fVal).push(currRow);
        } else {
            acc.set(fVal, [currRow]);
        }
        return acc;
    }, map);

    for (let [key, val] of map) {
        const nMap = makeGroupMapAndSort(depColumns.slice(1), val, schema, sortingDetails);
        map.set(key, nMap);
        if (Array.isArray(nMap)) {
            applyStandardSort(nMap, schema, sortingDetails);
        }
    }

    return map;
};

/**
 * Sorts the data by retaining the position/order of a particular field.
 *
 * @param {Array} data - The input data array.
 * @param {Array} schema - The data schema.
 * @param {Array} sortingDetails - An array containing the sorting configs.
 * @param {Array} depColumns - The dependency column list.
 * @return {Array} Returns the sorted data.
 */
function applyGroupSort (data, schema, sortingDetails, depColumns) {
    sortingDetails = sortingDetails.filter((detail) => {
        if (detail[1] === null) {
            depColumns.push(detail[0]);
            return false;
        }
        return true;
    });
    if (sortingDetails.length === 0) { return data; }

    depColumns = depColumns.map(c => fieldInSchema(schema, c));

    const sortedGroupMap = makeGroupMapAndSort(depColumns, data, schema, sortingDetails);
    return data.map((row) => {
        let i = 0;
        let nextMap = sortedGroupMap;

        while (!Array.isArray(nextMap)) {
            nextMap = nextMap.get(row[depColumns[i++].index]);
        }

        return nextMap.shift();
    });
}

/**
 * Sorts the data.
 *
 * @param {Object} dataObj - An object containing the data and schema.
 * @param {Array} sortingDetails - An array containing the sorting configs.
 */
export function sortData (dataObj, sortingDetails) {
    let { schema, data } = dataObj;

    sortingDetails = sortingDetails.filter(sDetial => !!fieldInSchema(schema, sDetial[0]));
    if (sortingDetails.length === 0) { return; }

    let groupSortingIdx = sortingDetails.findIndex(sDetial => sDetial[1] === null);
    groupSortingIdx = groupSortingIdx !== -1 ? groupSortingIdx : sortingDetails.length;

    const standardSortingDetails = sortingDetails.slice(0, groupSortingIdx);
    const groupSortingDetails = sortingDetails.slice(groupSortingIdx);

    applyStandardSort(data, schema, standardSortingDetails);
    data = applyGroupSort(data, schema, groupSortingDetails, standardSortingDetails.map(detail => detail[0]));

    dataObj.uids = data.map(row => row.pop());
    dataObj.data = data;
}
