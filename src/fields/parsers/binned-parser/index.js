import FieldParser from '../field-parser';
import { getNullValuesMap } from '../../../null-values';

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
        const nullValuesMap = getNullValuesMap();

        if (val === null || val === undefined) {
            return nullValuesMap[val];
        }

        const regex = /^\s*([+-]?\d+(?:\.\d+)?)\s*-\s*([+-]?\d+(?:\.\d+)?)\s*$/;
        val = String(val);

        const matched = val.match(regex);
        if (!matched) {
            return nullValuesMap.invalid;
        }

        return `${Number.parseFloat(matched[1])}-${Number.parseFloat(matched[2])}`;
    }
}
