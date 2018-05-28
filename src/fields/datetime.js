import Dimension from './dimension';
import { DateTimeFormatter } from '../utils';
import { DIM_SUBTYPE } from '../enums/index';

/**
* The Field for storing datetime data.
* @extends Field
*/
class DateTime extends Dimension {
    constructor(name, data, schema) {
        super(name, data, schema);
        this.subtype = DIM_SUBTYPE.TEMPORAL;
    }
    /**
    * @returns {String} SubType of field
    */
    subType() {
        return this.subtype;
    }
    /**
    * This funciton is called once for every entries of the column. The parse is called with raw data in cell and its
    * parse's responsibility to return the correct parsed value.
    *
    * @param {string | Date | number} val date entries present in a column
    *
    * @return {integer} the ms from the native date
    */
    parse (val) {
        this._dtf = this._dtf || new DateTimeFormatter(this.schema.format || '');
        return this._dtf.getNativeDate(val).getTime();
    }
}

export { DateTime as default };
