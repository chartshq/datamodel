import { formatNumber } from '../../utils';
import { defaultReducerName } from '../../operator/group-by-function';
import Field from '../field';

/**
 * Represents measure field type.
 *
 * @public
 * @class
 * @extends Field
 */
export default class Measure extends Field {
  /**
   * Returns the domain for the measure field.
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
   * Returns the unit of the measure field.
   *
   * @public
   * @return {string} Returns unit of the field.
   */
    unit () {
        return this.partialField.schema.unit;
    }

  /**
   * Returns the aggregation function name of the measure field.
   *
   * @public
   * @return {string} Returns aggregation function name of the field.
   */
    defAggFn () {
        return this.partialField.schema.defAggFn || defaultReducerName;
    }

  /**
   * Returns the number format of the measure field.
   *
   * @public
   * @return {Function} Returns number format of the field.
   */
    numberFormat () {
        const { numberFormat } = this.partialField.schema;
        return numberFormat instanceof Function ? numberFormat : formatNumber;
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

    /**
     * Returns the formatted version of the underlying field data.
     *
     * @public
     * @override
     * @return {Array} Returns the formatted data.
     */
    formattedData () {
        return this.data();
    }
}
