import Field from './field';
import { generateMeasureDomain } from '../utils';

/**
 * Represents measure field type.
 *
 * @extends Field
 */
class Measure extends Field {

    /**
     * Returns the domain for the measure field.
     *
     * @override
     * @return {Array} Returns min and max values from measure values.
     */
    domain() {
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
}

export default Measure;
