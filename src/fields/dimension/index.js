import Field from '../field';

/**
 * Represents dimension field type.
 *
 * @public
 * @class
 * @extends Field
 */
export default class Dimension extends Field {
    /**
     * Returns the domain for the dimension field.
     *
     * @override
     * @public
     * @return {any} Returns the calculated domain.
     */
    domain () {
        if (!this._cachedDomain) {
            this._cachedDomain = this.calculateDataDomain();
        }
        return this._cachedDomain;
    }

    /**
     * Calculates the corresponding field domain.
     *
     * @public
     * @abstract
     */
    calculateDataDomain () {
        throw new Error('Not yet implemented');
    }
}
