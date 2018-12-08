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
        let invalidValMap = InvalidAwareTypes.invalidAwareVals();

        if (val === null || val === undefined) {
            return invalidValMap[val];
        }

        const parsedVal = parseFloat(val, 10);

        if (Number.isNaN(parsedVal)) {
            const invalidVal = (val === 'nil') ? val : 'invalid';
            return invalidValMap[invalidVal];
        }
        return parsedVal;
    }
}
