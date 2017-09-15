/**
 * This function actually create the data array that will be exported
 * @param  {Object} fieldStore    The FieldStore where field Array
 * @param  {string} rowDiffset    details of which row to be include eg. '0-2,4,6'
 * @param  {string} colIdentifier details of which column to be include eg 'date,sales,profit'
 * @return {Array}               The final multidimensional array
 */
function dataBuilder(fieldStore, rowDiffset, colIdentifier) {
    const retArr = [];
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
    // initialize the multidimensional array
    retArr[0] = [];
    // insert the first schema row
    tmpDataArr.forEach((field) => {
        /**
         * @todo need to implement extend2 otherwise user can overwrite
         */
        retArr[0].push(field.schema);
    });
    // =============== row filter takes place here ================= //
    const rowDiffArr = rowDiffset.split(',');
    rowDiffArr.forEach((diffStr) => {
        const diffStsArr = diffStr.split('-');
        const start = +(diffStsArr[0]);
        const end = +(diffStsArr[1] || diffStsArr[0]);
        // insert the data
        if (end >= start) {
            for (let i = start; i <= end; i += 1) {
                retArr.push(new Array(tmpDataArr.length));
                tmpDataArr.forEach((field, ii) => {
                    retArr[retArr.length - 1][ii] = field.data[i];
                });
            }
        }
    });
    // =============== row filter takes place here end ================= //
    return retArr;
}

export { dataBuilder as default };
