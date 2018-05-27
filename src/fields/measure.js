import Field from './field';
import { generateMeasureDomain } from '../utils/domain-generator';
/**
 * The Field for storing measure/numeric data
 * @extends Field
 */
class Measure extends Field {
    constructor(name, data, schema) {
        super(name, data, schema);
        this.unit = schema.unit;
        this.scale = schema.scale;
        this.numberformat = schema.numberformat;
        this.defAggFn = schema.defAggFn;
    }
    getDomain() {
        return generateMeasureDomain(this.data);
    }
    /**
     * This funciton is called once for every entries of the column. The parse is called with raw data in cell and its
     * parse's responsibility to return the correct parsed value.
     *
     * @param {Object} val entries present in a column
     *
     * @return {integer | null} integer value of content of cell, otherwise null
     */
    parse (val) {
        val = parseFloat(val, 10);
        /* eslint-disable no-self-compare */
        if (val !== val) {
        /* eslint-enable no-self-compare */
            return null;
        }
        return val;
    }

    /**
     * @returns {String} unit of fields
     */
    getUnit() {
        return this.unit;
    }
    /**
     * @returns {String} Scale of fields
     */
    getScale() {
        return this.getScale;
    }
    /**
     * @returns {String} NumberFormat of fields
     */
    getNumberformat() {
        return this.numberformat;
    }
    /**
     * @returns {String} Agg Function of fields
     */
    getdefAggFn() {
        return this.defAggFn;
    }

    /**
     * @param {String} unit of fields
     */
    setUnit(unit) {
        this.unit = unit;
    }
    /**
     * @param {String} Scale of fields
     */
    setScale(scale) {
        this.scale = scale;
    }
    /**
     * @param {String} NumberFormat of fields
     */
    setNumberformat(numberformat) {
        this.numberformat = numberformat;
    }
    /**
     * @returns {String} Agg Function of fields
     */
    setdefAggFn(defAggFn) {
        this.defAggFn = defAggFn;
    }
}

export { Measure as default };
