import { rowDiffsetIterator } from '../../operator/row-diffset-iterator';
import { MeasureSubtype } from '../../enums';
import Measure from '../measure';

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
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;

        // here don't use this.data() as the iteration will be
        // occurred two times on same data.
        rowDiffsetIterator(this.rowDiffset, (i) => {
            const datum = this.partialField.data[i];
            if (datum < min) {
                min = datum;
            }
            if (datum > max) {
                max = datum;
            }
        });

        return [min, max];
    }
}
