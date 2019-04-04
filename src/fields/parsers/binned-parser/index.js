import FieldParser from '../field-parser';
import InvalidAwareTypes from '../../../invalid-aware-types';

/**
 * A FieldParser which parses the binned values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */
export default class BinnedParser extends FieldParser {
  /**
   * Parses a single binned value of a field and returns the sanitized value.
   *
   * @public
   * @param {string} val - The value of the field.
   * @return {string} Returns the sanitized value.
   */
    parse (val) {
        const regex = /^\s*([+-]?\d+(?:\.\d+)?)\s*-\s*([+-]?\d+(?:\.\d+)?)\s*$/;
        val = String(val);
        let result;
        // check if invalid date value
        if (!InvalidAwareTypes.isInvalid(val)) {
            let matched = val.match(regex);
            result = matched ? `${Number.parseFloat(matched[1])}-${Number.parseFloat(matched[2])}`
                             : InvalidAwareTypes.NA;
        } else {
            result = InvalidAwareTypes.getInvalidType(val);
        }
        return result;
    }
}
