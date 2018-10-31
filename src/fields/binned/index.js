import Dimension from '../dimension';

/**
 * Represents binned field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */
export default class Binned extends Dimension {
    /**
     * Calculates the corresponding field domain.
     *
     * @public
     * @override
     * @return {Array} Returns the last and first values of bins config array.
     */
    calculateDataDomain () {
        const binsArr = this.partialField.schema.bins;
        return [binsArr[0], binsArr[binsArr.length - 1]];
    }

    /**
     * The bins config provided while creating the field instance.
     *
     * @public
     * @return {Array} Returns the bins array config.
     */
    get bins () {
        return this.partialField.schema.bins;
    }
}
