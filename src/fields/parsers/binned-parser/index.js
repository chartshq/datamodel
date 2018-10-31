import FieldParser from '../field-parser';

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
        if (val === null || val === undefined) {
            return null;
        }

        const regex = /^\s*(\d+)\s*-\s*(\d+)\s*$/;
        val = String(val);

        const matched = val.match(regex);
        if (!matched) {
            return null;
        }

        return `${matched[1]}-${matched[2]}`;
    }
}
