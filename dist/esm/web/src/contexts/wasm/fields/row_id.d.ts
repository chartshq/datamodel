import { AbstractWasmField } from './field';
import { IdFieldWrapper, WasmDataModel } from '../utils';
import { Schema } from '../../../contracts/data';
export default class RowId extends AbstractWasmField {
    _wasmField?: IdFieldWrapper;
    _cachedDomain: number[];
    _cachedData: number[];
    constructor(schema: Schema, field?: IdFieldWrapper);
    displayName(): string;
    domain(): number[];
    formattedData(): number[];
    data(): number[];
    getRowsCount(): number;
    getValueAtIndex(index: number): number | null;
    dispose(): void;
}
export declare const idFieldCreator: (data: Array<number>, schema: Schema, dm?: WasmDataModel | undefined) => {
    field: RowId;
    index: number;
};
export declare const getIdFieldSchema: () => Schema;
