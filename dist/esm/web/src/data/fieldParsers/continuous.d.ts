import { FieldContract } from './index';
import { FieldSubtype } from '../../constants/fields';
declare class ContinuousParser implements FieldContract {
    _type: FieldSubtype.CONTINUOUS;
    get type(): FieldSubtype.CONTINUOUS;
    parse(val: number | string | null | undefined): number;
}
export { ContinuousParser };
