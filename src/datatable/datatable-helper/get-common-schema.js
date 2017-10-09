/**
 * Helper function that return an Array of common schema from both the fieldStore
 * @param  {FieldStore} fs1 first FieldStore
 * @param  {FieldStore} fs2 second FieldStore
 * @return {Array}     array containing the common name
 */
function getCommonSchema(fs1, fs2) {
    const retArr = [];
    const fs1Arr = [];
    fs1.fields.forEach((field) => {
        fs1Arr.push(field.schema.name);
    });
    fs2.fields.forEach((field) => {
        if (fs1Arr.indexOf(field.schema.name) !== -1) {
            retArr.push(field.schema.name);
        }
    });
    return retArr;
}

export { getCommonSchema as default };
