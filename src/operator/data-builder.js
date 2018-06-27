import { rowDiffsetIterator } from './row-diffset-iterator';
import { mergeSort } from './merge-sort';

/**
 * Generates the sorting functions to sort the data of a DataTable instance
 * according to the input data type.
 *
 * @param {string} dataType - The data type e.g. 'measure', 'datetime' etc.
 * @param {string} sortType - The sorting order i.e. 'asc' or 'desc'.
 * @param {integer} index - The index of the data which will be sorted.
 * @return {Function} Returns the the sorting function.
 */
function getSortFn(dataType, sortType, index) {
    let retFunc;
    switch (dataType) {
    case 'measure':
    case 'temporal':
        if (sortType === 'desc') {
            retFunc = (a, b) => b[index] - a[index];
        } else {
            retFunc = (a, b) => a[index] - b[index];
        }
        break;
    default:
        retFunc = (a, b) => {
            const a1 = `${a[index]}`;
            const b1 = `${b[index]}`;
            if (a1 < b1) {
                return sortType === 'desc' ? 1 : -1;
            }
            if (a1 > b1) {
                return sortType === 'desc' ? -1 : 1;
            }
            return 0;
        };
    }
    return retFunc;
}

/**
 * Builds the actual data array.
 *
 * @param {Array} fieldStore - An array of field.
 * @param {string} rowDiffset - A string consisting of which rows to be included eg. '0-2,4,6';
 * @param {string} colIdentifier - A string consisting of the details of which column
 * to be included eg 'date,sales,profit';
 * @param {Object} sortingDetails - An object containing the sorting details of the DataTable instance.
 * @param {Object} options - The options required to create the type of the data.
 * @return {Object} Returns an object containing the multidimensional array and the relative schema.
 */
export function dataBuilder(fieldStore, rowDiffset, colIdentifier, sortingDetails, options) {
    const defOptions = {
        addUid: false,
        columnWise: false
    };
    options = Object.assign({}, defOptions, options);

    const retObj = {
        schema: [],
        data: [],
        uids: []
    };
    const addUid = options.addUid;
    const reqSorting = sortingDetails && sortingDetails.length > 0;
    // It stores the fields according to the colIdentifier argument
    const tmpDataArr = [];
    // Stores the fields according to the colIdentifier argument
    const colIArr = colIdentifier.split(',');

    colIArr.forEach((colName) => {
        for (let i = 0; i < fieldStore.length; i += 1) {
            if (fieldStore[i].name === colName) {
                tmpDataArr.push(fieldStore[i]);
                break;
            }
        }
    });

    // Inserts the schema to the schema object
    tmpDataArr.forEach((field) => {
        /** @todo Need to use extend2 here otherwise user can overwrite the schema. */
        retObj.schema.push(field.schema);
    });

    if (addUid) {
        retObj.schema.push({
            name: 'uid',
            type: 'identifier'
        });
    }

    rowDiffsetIterator(rowDiffset, (i) => {
        retObj.data.push([]);
        const insertInd = retObj.data.length - 1;
        let start = 0;
        tmpDataArr.forEach((field, ii) => {
            retObj.data[insertInd][ii + start] = field.data[i];
        });
        if (addUid) {
            retObj.data[insertInd][tmpDataArr.length] = i;
        }
        // Creates an array of unique identifiers for each row
        retObj.uids.push(i);

        // If sorting needed then there is the need to expose the index
        // mapping from the old index to its new index
        if (reqSorting) { retObj.data[insertInd].push(i); }
    });

    // Handles the sort functionality
    if (reqSorting) {
        // When data will be sorted uids will get changed
        retObj.uids = [];
        for (let i = sortingDetails.length - 1; i >= 0; i -= 1) {
            retObj.schema.forEach((schema, ii) => {
                if (sortingDetails[i][0] === schema.name) {
                    let type = schema.subtype || schema.type;
                    mergeSort(retObj.data, getSortFn(type, sortingDetails[i][1], ii));
                }
            });
        }
        // Creating the mapping of old index to its new index
        retObj.data.forEach((value) => {
            retObj.uids.push(value.pop());
        });
    }

    if (options.columnWise) {
        const tmpData = Array(...Array(retObj.schema.length)).map(() => []);
        retObj.data.forEach((tuple) => {
            tuple.forEach((data, i) => {
                tmpData[i].push(data);
            });
        });
        retObj.data = tmpData;
    }

    return retObj;
}
