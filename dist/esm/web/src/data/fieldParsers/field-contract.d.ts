import { FieldSubtype } from '../../constants/fields';
interface FieldContract {
    _type: FieldSubtype;
    parse(val: string | number | undefined | null, format: string | Function): string | number | null | undefined;
}
export { FieldContract };
