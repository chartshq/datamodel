import Field from './field';
/**
 * The Field for storing measure/numeric data
 * @extends Field
 */
class Measure extends Field {
    /**
     * This funciton is called once for every entries of the column. The parse is called with raw data in cell and its
     * parse's responsibility to return the correct parsed value.
     *
     * @param {Object} val entries present in a column
     *
     * @return {integer | null} integer value of content of cell, otherwise null
     */
    parse (val) {
        val = parseFloat(val, 10);
        /* eslint-disable no-self-compare */
        if (val !== val) {
        /* eslint-enable no-self-compare */
            return null;
        }
        return val;
    }
}

export { Measure as default };
