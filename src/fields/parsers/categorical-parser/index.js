import FieldParser from '../field-parser';

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
        return (val === undefined || val === null) ? null : String(val).trim();
    }
}
