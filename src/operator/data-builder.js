import rowDiffsetIterator from './row-diffset-iterator';
import mergeSort from './merge-sort';

/**
 * This will give the function required to sort the data of the dataTable according to the
 * type of data and sorting type
 * @param  {string} dataType data type measure|time|dimension
 * @param  {string} sortType asc|desc
 * @param  {integer} index    the index of the data table according to which the table will be
 * sorted
 * @return {Function}          the valid function
 */
function getSortFn(dataType, sortType, index) {
    let retFunc;
    switch (dataType) {
    case 'measure':
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
 * This function actually create the data array that will be exported
 * @param  {Object} fieldStore    The FieldStore where field Array
 * @param  {string} rowDiffset    details of which row to be include eg. '0-2,4,6'
 * @param  {string} colIdentifier details of which column to be include eg 'date,sales,profit'
 * @param  {Object} sortingDetails object containin sorting details of the dataTable
 * @param  {Object} options other option required to create the type of data required
 * @return {Object}               The Object containing multidimensional array and the
 * relative schema
 */
function dataBuilder(fieldStore, rowDiffset, colIdentifier, sortingDetails, options = {}) {
    const retObj = {
        schema: [],
        data: [],
        uids: []
    };
    const addUid = options.addUid;
    const reqSorting = sortingDetails && sortingDetails.length > 0;
    // this will store the fields according to the colIdentifier provided
    const tmpDataArr = [];
    // =============== column filter takes place here ================= //
    // Store the fields according to the colIdentifier
    const colIArr = colIdentifier.split(',');
    colIArr.forEach((colName) => {
        for (let i = 0; i < fieldStore.length; i += 1) {
            if (fieldStore[i].name === colName) {
                tmpDataArr.push(fieldStore[i]);
                break;
            }
        }
    });

    // =============== column filter takes place here end ================= //
    // // insert the schema to the schema object
    tmpDataArr.forEach((field) => {
        /**
         * @todo need to implement extend2 otherwise user can overwrite
         */
        retObj.schema.push(field.schema);
    });

    if (addUid) {
        retObj.schema.push({
            name: 'uid',
            type: 'identifier'
        });
    }

    // =============== row filter takes place here ================= //
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
        // Create an array of unique identifiers for each row
        retObj.uids.push(i);
        // if sorting needed then there is the need to expose the index mapping from the old index
        // to its new index
        if (reqSorting) { retObj.data[insertInd].push(i); }
    });
    // handles the sort functionality
    if (reqSorting) {
        // When data will be sorted uids will get changed.
        retObj.uids = [];
        for (let i = sortingDetails.length - 1; i >= 0; i -= 1) {
            retObj.schema.forEach((schema, ii) => {
                if (sortingDetails[i][0] === schema.name) {
                    mergeSort(retObj.data, getSortFn(schema.type, sortingDetails[i][1], ii));
                }
            });
        }
        // generating the mapping of the old index to its new index
        retObj.data.forEach((value) => {
            retObj.uids.push(value.pop());
        });
    }
    // =============== row filter takes place here end ================= //

    // normally the data is created column wise but there is some situation where data is
    // required row wise of the accomodate the feature this is needed
    if (options.rowWise) {
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

export { dataBuilder as default };
