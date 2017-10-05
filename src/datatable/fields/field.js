import { extend2 } from '../../utils';
/**
 * This is the base class of all the field type all the common functionality
 * and data will be in this class
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

    /**
     * create a fresh new copy of the field type, if data is provided the data will not be copied.
     * data copy is expensive so if optimization required pass the reference of the parent field.
     * @param  {Array} data data array if provided data will not be cloned
     * @return {Object}      copy Field type
     */
    clone(data) {
        const newField = new this.constructor(this.name, (data || extend2([], this.data)),
            extend2({}, this.schema));
        return newField;
    }
}

export { Field as default };
