import { rowDiffsetIterator } from '../../operator/row-diffset-iterator';
import Dimension from '../dimension';
import { DateTimeFormatter } from '../../utils';
import InvalidAwareTypes from '../../invalid-aware-types';

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

        const sortedData = this.data().filter(item => !(item instanceof InvalidAwareTypes)).sort((a, b) => a - b);
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
     * Returns the formatted version of the underlying field data
     * If data is of type invalid or has missing format use the raw value
     * @public
     * @override
     * @return {Array} Returns the formatted data.
     */
    formattedData () {
        const data = [];
        const dataFormat = this.format();

        rowDiffsetIterator(this.rowDiffset, (i) => {
            const datum = this.partialField.data[i];
            // If value is of invalid type or format is missing
            if (InvalidAwareTypes.isInvalid(datum) || (!dataFormat && Number.isFinite(datum))) {
                // Use the invalid map value or the raw value
                const parsedDatum = InvalidAwareTypes.getInvalidType(datum) || datum;
                data.push(parsedDatum);
            } else {
                data.push(DateTimeFormatter.formatAs(datum, dataFormat));
            }
        });
        return data;
    }
}

