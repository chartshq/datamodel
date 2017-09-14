/**
 * This is the base class of all the field type all the common functionality
 * and data will be in this class
 * @type {[type]}
 */
class Field {
    /**
     * Field constructor
     * @param  {string} name   Name or identifier of the field
     * @param  {Array} data   The data array
     * @param  {json} schema details of the data type and other related information
     */
    constructor(name, data, schema) {
        this.name = name;
        this.data = data;
        this.schema = schema;
    }
}

export { Field as default };
