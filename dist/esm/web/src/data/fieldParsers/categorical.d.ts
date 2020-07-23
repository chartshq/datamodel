import { FieldContract } from './index';
import { FieldSubtype } from '../../constants/fields';
declare class CategoricalParser implements FieldContract {
    _type: FieldSubtype.CATEGORICAL;
    get type(): FieldSubtype.CATEGORICAL;
    /**
     * Parses a single value to string if not already in string format
     *
     * @public
     * @param {string|number} val - The value of the field.
     * @return {string} Returns the string representation of the value.
     */
    parse(val: number | string | null | undefined): string | null | undefined | number;
}
export { CategoricalParser };
