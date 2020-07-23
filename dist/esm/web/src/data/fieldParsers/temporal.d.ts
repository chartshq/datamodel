import { FieldContract } from './index';
import { FieldSubtype } from '../../constants/fields';
declare class TemporalParser implements FieldContract {
    _dtf: any;
    _type: FieldSubtype.TEMPORAL;
    get type(): FieldSubtype.TEMPORAL;
    /**
     * Parses a single value of a field and returns the millisecond value.
     *
     * @public
     * @param {string|number} val - The value of the field.
     * @return {number} Returns the millisecond value.
     */
    parse(val: string | number | null | undefined, format: string | Function): number;
}
export { TemporalParser };
