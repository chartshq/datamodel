import { DimensionSubtype } from 'picasso-util';
import Dimension from './dimension';
import { DateTimeFormatter } from '../utils';


/**
 * Represents datetime field subtype.
 *
 * @extends Dimension
 */
class DateTime extends Dimension {

    /**
     * Creates new DateTime field instance.
     *
     * @param {string} name - The name of the field.
     * @param {Array} data - An array containing the field data.
     * @param {Object} schema - The schema for the field.
     */
    constructor(name, data, schema) {
        super(name, data, schema);
        this.subtype = DimensionSubtype.TEMPORAL;
    }

    /**
     * Getter for subType value of the field.
     *
    * @return {string} Returns subType of the field.
    */
    subType() {
        return this.subtype;
    }

    /**
    * A hook which is called for every entry(cell) of the column.
    *
    * @param {*} val - The current entry present in the column while iteration.
    * @return {number} Returns the total timestamps in millisecond.
    */
    parse(val) {
        this._dtf = this._dtf || new DateTimeFormatter(this.schema.format || '');
        return this._dtf.getNativeDate(val).getTime();
    }
}

export default DateTime;
