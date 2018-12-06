import FieldParser from '../field-parser';
import { getNullValuesMap } from '../../../null-values';

/**
 * A FieldParser which parses the categorical values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */
export default class CategoricalParser extends FieldParser {
  /**
   * Parses a single value of a field and returns the stringified form.
   *
   * @public
   * @param {string|number} val - The value of the field.
   * @return {string} Returns the stringified value.
   */
    parse (val) {
        const nullValuesMap = getNullValuesMap();

        return (val === undefined || val === null) ? nullValuesMap[val] : String(val).trim();
    }
}
