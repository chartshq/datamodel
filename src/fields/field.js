import { extend2 } from '../utils';
/**
 * This is the base class of all the field type all the common functionality and data will be in this class
 */
class Field {
    /**
     * Field constructor. Abstract class for all the fields.
     *
     * @param  {string} name Name or identifier of the field
     * @param  {Array} data The data array
     * @param  {json} schema Details of the data type and other related information
     * @param  {string} description Description of the field
     */
    constructor(name, data, schema) {
        this.name = name;
        this.data = data || [];
        this.schema = schema;
        this.description = schema.description;
        this.type = schema.type;
        this.sanitize();
    }

    /**
     * Parses values for the field.
     *
     * @return {Field} instance of the current field instance
     */
    sanitize () {
        this.data = this.data.map(d => this.parsed(this.parse(d)));
        return this;
    }

    /**
     * Hook which enbales post parsing setup.
     *
     * @param {Object} val parsed value
     * @return {Object} parsed value itself
     */
    parsed (val) {
        return val;
    }

    domain() {

    }

    /**
     * @abstract
     *
     * Parse implementation has to be provided by child classes.
     * @param {Object} value value of the cell
     */
    parse () {
        throw new Error('Funciton not implemented. ');
    }

    /**
     * create a fresh new copy of the field type, if data is provided the data will not be copied. Data copy is
     * expensive so if optimization required pass the reference of the parent field.
     *
     * @param  {Array} data data array if provided data will not be cloned
     *
     * @return {Object} copy Field type
     */
    clone(data) {
        const newField = new this.constructor(this.name, (data || extend2([], this.data)),
            extend2({}, this.schema));
        return newField;
    }

    /**
     * @return {string} Name of the field
     */
    getName() {
        return this.name;
    }

     /**
     * @return {string} Type of the field
     */
    getType() {
        return this.type;
    }

    /**
     * Sets name of the fields
     * @param {string} Name of the field
     */
    setType(type) {
        this.type = type;
    }

    /**
     * @return {description} Name of the field
     */
    getDescription() {
        return this.description;
    }

    /**
     * Sets name of the fields
     * @param {string} Name of the field
     */
    setName(name) {
        this.name = name;
    }

    /**
     * @param {String} Description of the field
     */
    setDescription(description) {
        this.description = description;
    }
}

export { Field as default };
