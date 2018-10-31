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
    domain() {
        if (!this._cachedDomain) {
            this._cachedDomain = this.calculateDataDomain();
        }
        return this._cachedDomain;
    }

  /**
   * The unit of the measure field.
   *
   * @public
   * @return {string} Returns unit of the field.
   */
    get unit() {
        return this.partialField.schema.unit;
    }

  /**
   * The aggregation function name of the measure field.
   *
   * @public
   * @return {string} Returns aggregation function name of the field.
   */
    get defAggFn() {
        return this.partialField.schema.defAggFn || defaultReducerName;
    }

  /**
   * The number format of the measure field.
   *
   * @public
   * @return {Function} Returns number format of the field.
   */
    get numberFormat() {
        const { numberFormat } = this.partialField.schema;
        return numberFormat instanceof Function ? numberFormat : formatNumber;
    }

  /**
   * Calculates the corresponding field domain.
   *
   * @public
   * @abstract
   */
    calculateDataDomain() {
        throw new Error('Not yet implemented');
    }
}
