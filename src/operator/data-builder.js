import { rowDiffsetIterator } from './row-diffset-iterator';
import { sortData } from './sort';
import { FieldType, DimensionSubtype } from '../enums';
import { ROW_ID } from '../constants';

/**
 * Builds the actual data array.
 *
 * @param {Array} fieldStore - An array of field.
 * @param {string} rowDiffset - A string consisting of which rows to be included eg. '0-2,4,6';
 * @param {string} colIdentifier - A string consisting of the details of which column
 * to be included eg 'date,sales,profit';
 * @param {Object} sortingDetails - An object containing the sorting details of the DataModel instance.
 * @param {Object} options - The options required to create the type of the data.
 * @return {Object} Returns an object containing the multidimensional array and the relative schema.
 */
export function dataBuilder ({ fields: fieldStore, idField }, rowDiffset, colIdentifier, sortingDetails, options) {
    const idData = idField.data();

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
            const name = fieldStore[i].name();
            if (name === colName) {
                tmpDataArr.push(fieldStore[i]);
                break;
            }
        }
    });

    // Inserts the schema to the schema object
    tmpDataArr.forEach((field) => {
        /** @todo Need to use extend2 here otherwise user can overwrite the schema. */
        retObj.schema.push(field.schema());
    });

    if (addUid) {
        retObj.schema.push({
            name: ROW_ID,
            type: FieldType.DIMENSION,
            subtype: DimensionSubtype.ID
        });
    }

    rowDiffsetIterator(rowDiffset, (i) => {
        retObj.data.push([]);
        const insertInd = retObj.data.length - 1;
        let start = 0;
        tmpDataArr.forEach((field, ii) => {
            retObj.data[insertInd][ii + start] = field.partialField.data[i];
        });
        if (addUid) {
            retObj.data[insertInd][tmpDataArr.length] = idData[i];
        }
        // Creates an array of unique identifiers for each row
        retObj.uids.push(idData[i]);

        // If sorting needed then there is the need to expose the index
        // mapping from the old index to its new index
        if (reqSorting) { retObj.data[insertInd].push(idData[i]); }
    });

    // Handles the sort functionality
    if (reqSorting) {
        sortData(retObj, sortingDetails);
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
