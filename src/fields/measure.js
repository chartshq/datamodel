import Field from './field';
import { generateMeasureDomain } from '../utils';

/**
 * Represents measure field type.
 *
 * @extends Field
 */
class Measure extends Field {
    constructor(name, data, schema) {
        super(name, data, schema);
        this.fieldUnit = schema.unit;
        this.fieldScale = schema.scale;
        this.fieldNumberformat = schema.numberformat;
        this.fieldDefAggFn = schema.defAggFn;
    }
    getDomain() {
        return generateMeasureDomain(this.data);
    }

    /**
     * A hook which is called for every entry(cell) of the column.
     *
     * @todo Fix the null data e.g. NaN value.
     *
     * @param {*} val - The current entry present in the column while iteration.
     * @return {number | null} Returns the parsed number value of content of cell or null.
     */
    parse (val) {
        val = parseFloat(val, 10);
        return Number.isNaN(val) ? null : val;
    }

    /**
     * @returns {String} unit of fields
     */
    unit() {
        return this.fieldUnit;
    }
    /**
     * @returns {String} Scale of fields
     */
    scale() {
        return this.fieldScale;
    }
    /**
     * @returns {String} NumberFormat of fields
     */
    numberformat() {
        return this.fieldNumberformat;
    }
    /**
     * @returns {String} Agg Function of fields
     */
    defAggFn() {
        return this.fieldDefAggFn;
    }
}

export default Measure;
