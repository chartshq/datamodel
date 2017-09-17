import rowDiffsetIterator from './row-diffset-iterator';

/**
 * This function actually create the data array that will be exported
 * @param  {Object} fieldStore    The FieldStore where field Array
 * @param  {string} rowDiffset    details of which row to be include eg. '0-2,4,6'
 * @param  {string} colIdentifier details of which column to be include eg 'date,sales,profit'
 * @return {Object}               The Object containing multidimensional array and the
 * relative schema
 */
function dataBuilder(fieldStore, rowDiffset, colIdentifier) {
    const retObj = {
        schema: [],
        data: [],
    };
    // this will store the fields according to the colIdentifier provided
    const tmpDataArr = [];

    // =============== column filter takes place here ================= //
    // Store the fields according to the colIdentifier
    const colIArr = colIdentifier.split(',');
    colIArr.forEach((colName) => {
        for (let i = 0; i <= fieldStore.length; i += 1) {
            if (fieldStore[i].name === colName) {
                tmpDataArr.push(fieldStore[i]);
                break;
            }
        }
    });
    // =============== column filter takes place here end ================= //
    // insert the schema to the schema object
    tmpDataArr.forEach((field) => {
        /**
         * @todo need to implement extend2 otherwise user can overwrite
         */
        retObj.schema.push(field.schema);
    });
    // =============== row filter takes place here ================= //
    rowDiffsetIterator(rowDiffset, (i) => {
        retObj.data.push(new Array(tmpDataArr.length));
        tmpDataArr.forEach((field, ii) => {
            retObj.data[retObj.data.length - 1][ii] = field.data[i];
        });
    });
    // =============== row filter takes place here end ================= //
    return retObj;
}

export { dataBuilder as default };
