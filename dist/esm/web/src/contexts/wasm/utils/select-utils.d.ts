import { AbstractWasmField } from '../fields/field';
import { FieldSubtype } from '../../../constants/fields';
export declare const getRawValue: (subtype: FieldSubtype, value: string | number, format: string | Function) => string | number | undefined | null;
export declare const recursiveSanitizeQuery: (query: any, fieldMap: Map<string, {
    field: AbstractWasmField;
    index: number;
}>, return_query?: any) => any;
