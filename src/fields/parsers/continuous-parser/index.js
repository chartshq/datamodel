import FieldParser from '../field-parser';
import InvalidAwareTypes from '../../../invalid-aware-types';

/**
 * A FieldParser which parses the continuous values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */
export default class ContinuousParser extends FieldParser {
  /**
   * Parses a single value of a field and returns the number form.
   *
   * @public
   * @param {string|number} val - The value of the field.
   * @return {string} Returns the number value.
   */
    parse (val) {
        let result;
        // check if invalid date value
        if (!InvalidAwareTypes.isInvalid(val)) {
            let parsedVal = parseFloat(val, 10);
            result = Number.isNaN(parsedVal) ? InvalidAwareTypes.NA : parsedVal;
        } else {
            result = InvalidAwareTypes.getInvalidType(val);
        }
        return result;
    }
}
