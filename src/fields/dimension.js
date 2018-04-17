import Field from './field';

/**
 * The Field for storing dimensional data
 * @extends Field
 */
class Dimension extends Field {
    /**
     * This funciton is called once for every entries of the column. The parse is called with raw data in cell and its
     * parse's responsibility to return the correct parsed value.
     *
     * @param {Object} val entries present in a column
     *
     * @return {integer} the string representation of the value
     */
    parse (val) {
        const value = (val !== undefined && val !== null) ? val.toString() : '';
        return value.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Hooks if any set up needs to be done post parsing. For dimension it saves the cardinality of the dimensional
     * values.
     *
     * @param {string} val parsed value for dimension
     * @return {string} same val which was passed
     */
    parsed (val) {
        this._unique = this._unique || {};
        const unique = this._unique;
        if (val in unique) {
            unique[val]++;
        } else {
            unique[val] = 1;
        }
        return val;
    }
}

export { Dimension as default };
