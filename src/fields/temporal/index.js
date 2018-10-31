import { rowDiffsetIterator } from '../../operator/row-diffset-iterator';
import Dimension from '../dimension';

/**
 * Represents temporal field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */
export default class Temporal extends Dimension {
     /**
     * Calculates the corresponding field domain.
     *
     * @public
     * @override
     * @return {Array} Returns the unique values.
     */
    calculateDataDomain () {
        const hash = new Set();
        const domain = [];

        // here don't use this.data() as the iteration will be
        // occurred two times on same data.
        rowDiffsetIterator(this.rowDiffset, (i) => {
            const datum = this.partialField.data[i];
            if (!hash.has(datum)) {
                hash.add(datum);
                domain.push(datum);
            }
        });

        return domain;
    }


    /**
     * Calculates the minimum consecutive difference from the associated field data.
     *
     * @public
     * @return {number} Returns the minimum consecutive diff in milliseconds.
     */
    minimumConsecutiveDifference () {
        let currIdx = 0;
        let prevDatum;
        let minDiff = Number.POSITIVE_INFINITY;

        // here don't use this.data() as the iteration will be
        // occurred two times on same data.
        rowDiffsetIterator(this.rowDiffset, (i) => {
            const datum = this.partialField.data[i];
            if (!currIdx++) {
                prevDatum = datum;
                return;
            }

            minDiff = Math.min(minDiff, datum - prevDatum);
            prevDatum = datum;
        });

        if (currIdx <= 1) {
            return null;
        }

        return minDiff;
    }

    /**
     * Returns the format specified in the input schema while creating field.
     *
     * @public
     * @return {string} Returns the datetime format.
     */
    format () {
        return this.partialField.schema.format;
    }
}

