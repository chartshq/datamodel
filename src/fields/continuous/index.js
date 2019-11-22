import { MeasureSubtype } from '../../enums';
import Measure from '../measure';
import ContinuousParser from '../parsers/continuous-parser';
import { calculateContinuousDomain } from '../helper';

/**
 * Represents continuous field subtype.
 *
 * @public
 * @class
 * @extends Measure
 */
export default class Continuous extends Measure {
    /**
     * Returns the subtype of the field.
     *
     * @public
     * @override
     * @return {string} Returns the subtype of the field.
     */
    subtype () {
        return MeasureSubtype.CONTINUOUS;
    }

    /**
     * Calculates the corresponding field domain.
     *
     * @public
     * @override
     * @return {Array} Returns the min and max values.
     */
    calculateDataDomain () {
        return calculateContinuousDomain(this.partialField.data, this.rowDiffset);
    }

    static parser() {
        return new ContinuousParser();
    }
}
