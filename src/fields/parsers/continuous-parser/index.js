import FieldParser from '../field-parser';
import { getNullValuesMap } from '../../../null-values';

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
        const nullValuesMap = getNullValuesMap();
        const parsedVal = parseFloat(val, 10);

        if (Number.isNaN(parsedVal)) {
            return nullValuesMap[val] || nullValuesMap.invalid;
        }

        return parsedVal;
    }
}
