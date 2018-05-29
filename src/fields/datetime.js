import Dimension from './dimension';
import { DateTimeFormatter } from '../utils';

/**
 * The Field for storing datetime data.
 * @extends Dimension
 */
class DateTime extends Dimension {
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

export default DateTime;
