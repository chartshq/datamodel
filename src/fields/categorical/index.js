import { rowDiffsetIterator } from '../../operator/row-diffset-iterator';
import { DimensionSubtype } from '../../enums';
import Dimension from '../dimension';

/**
 * Represents categorical field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */
export default class Categorical extends Dimension {
    /**
     * The subtype of the field.
     *
     * @public
     * @override
     * @return {string} Returns the subtype of the field.
     */
    get subtype () {
        return DimensionSubtype.CATEGORICAL;
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
}
