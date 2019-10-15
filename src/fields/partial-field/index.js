/**
 * Stores the full data and the metadata of a field. It provides
 * a single source of data from which the future Field
 * instance can get a subset of it with a rowDiffset config.
 *
 * @class
 * @public
 */
export default class PartialField {
    /**
     * Initialize a new instance.
     *
     * @public
     * @param {string} name - The name of the field.
     * @param {Array} data - The data array.
     * @param {Object} schema - The schema object of the corresponding field.
     * @param {FieldParser} parser - The parser instance corresponding to that field.
     */
    constructor (name, data, schema, parser) {
        this.name = name;
        this.schema = schema;
        this.parser = parser;
        this.data = this._sanitize(data);
    }

    /**
     * Sanitizes the field data.
     *
     * @private
     * @param {Array} data - The actual input data.
     * @return {Array} Returns the sanitized data.
     */
    _sanitize (data) {
        return data.map(datum => this.parser.parse(datum, { format: this.schema.format }));
    }
}
