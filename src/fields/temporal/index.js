import { rowDiffsetIterator } from '../../operator/row-diffset-iterator';
import Dimension from '../dimension';
import { DateTimeFormatter } from '../../utils';

/**
 * Represents temporal field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */
export default class Temporal extends Dimension {
     /**
     * Initialize a new instance.
     *
     * @public
     * @param {PartialField} partialField - The partialField instance which holds the whole data.
     * @param {string} rowDiffset - The data subset definition.
     */
    constructor (partialField, rowDiffset) {
        super(partialField, rowDiffset);

        this._cachedMinDiff = null;
    }

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
            if (datum === null) {
                return;
            }

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
        if (this._cachedMinDiff) {
            return this._cachedMinDiff;
        }

        const sortedData = this.data().sort((a, b) => a - b);
        const arrLn = sortedData.length;
        let minDiff = Number.POSITIVE_INFINITY;
        let prevDatum;
        let nextDatum;
        let processedCount = 0;

        for (let i = 1; i < arrLn; i++) {
            prevDatum = sortedData[i - 1];
            nextDatum = sortedData[i];

            if (nextDatum === prevDatum) {
                continue;
            }

            minDiff = Math.min(minDiff, nextDatum - sortedData[i - 1]);
            processedCount++;
        }

        if (!processedCount) {
            minDiff = null;
        }
        this._cachedMinDiff = minDiff;

        return this._cachedMinDiff;
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

    /**
     * Returns the formatted version of the underlying field data.
     *
     * @public
     * @override
     * @return {Array} Returns the formatted data.
     */
    formattedData () {
        const data = [];
        rowDiffsetIterator(this.rowDiffset, (i) => {
            const datum = this.partialField.data[i];
            if (datum === null) {
                data.push(null);
            } else {
                data.push(DateTimeFormatter.formatAs(datum, this.format()));
            }
        });
        return data;
    }
}

