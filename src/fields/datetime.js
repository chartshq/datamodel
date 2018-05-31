import Dimension from './dimension';
import { DateTimeFormatter } from '../utils';

/**
 * Represents datetime field subtype.
 *
 * @extends Dimension
 */
class DateTime extends Dimension {

    /**
     * A hook which is called for every entry(cell) of the column.
     *
     * @param {*} val - The current entry present in the column while iteration.
     * @return {number} Returns the total timestamps in millisecond.
     */
    parse (val) {
        this._dtf = this._dtf || new DateTimeFormatter(this.schema.format || '');
        return this._dtf.getNativeDate(val).getTime();
    }
}

export default DateTime;
