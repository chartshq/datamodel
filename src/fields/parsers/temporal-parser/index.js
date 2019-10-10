import { DateTimeFormatter } from '../../../utils';
import FieldParser from '../field-parser';
import InvalidAwareTypes from '../../../invalid-aware-types';

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
    // constructor (schema) {
    //     super();
    //     this.schema = schema;
    //     this._dtf = new DateTimeFormatter(format);
    // }

    /**
     * Parses a single value of a field and returns the millisecond value.
     *
     * @public
     * @param {string|number} val - The value of the field.
     * @return {number} Returns the millisecond value.
     */
    parse (val, { format }) {
        let result;
        // check if invalid date value
        if (!this._dtf) {
            this._dtf = new DateTimeFormatter(format);
        }
        if (!InvalidAwareTypes.isInvalid(val)) {
            let nativeDate = this._dtf.getNativeDate(val);
            result = nativeDate ? nativeDate.getTime() : InvalidAwareTypes.NA;
        } else {
            result = InvalidAwareTypes.getInvalidType(val);
        }
        return result;
    }
}
