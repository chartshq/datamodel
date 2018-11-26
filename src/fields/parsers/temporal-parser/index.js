import { DateTimeFormatter } from '../../../utils';
import FieldParser from '../field-parser';

/**
 * A FieldParser which parses the temporal values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */
export default class TemporalParser extends FieldParser {
    /**
     * Initialize a new instance.
     *
     * @public
     * @param {Object} schema - The schema object for the corresponding field.
     */
    constructor (schema) {
        super();
        this.schema = schema;
        this._dtf = null;
    }

    /**
     * Parses a single value of a field and returns the millisecond value.
     *
     * @public
     * @param {string|number} val - The value of the field.
     * @return {number} Returns the millisecond value.
     */
    parse (val) {
        if (val === null || val === undefined) {
            return null;
        }

        if (this.schema.format) {
            this._dtf = this._dtf || new DateTimeFormatter(this.schema.format);
            return this._dtf.getNativeDate(val).getTime();
        }

        // If format is not present which means the value is such that
        // it could be directly passed to Date constructor.
        return +new Date(val);
    }
}
