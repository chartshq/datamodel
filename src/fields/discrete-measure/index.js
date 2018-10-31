import { rowDiffsetIterator } from '../../operator/row-diffset-iterator';
import Measure from '../measure';

/**
 * Represents discrete measure field subtype.
 *
 * @public
 * @class
 * @extends Measure
 */
export default class DiscreteMeasure extends Measure {
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

   /**
     * The bins config provided while creating the field instance.
     *
     * @public
     * @return {Array} Returns the bins array config.
     */
    get bins() {
        return this.partialField.schema.bins;
    }
}
