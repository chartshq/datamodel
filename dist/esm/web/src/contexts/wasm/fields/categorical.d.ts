import { AbstractWasmField } from './field';
import { CategoricalFieldWrapper, WasmDataModel } from '../utils';
import { Schema } from '../../../contracts/data';
import Invalid from '../../../data/invalid/invalid';
export default class Categorical extends AbstractWasmField {
    private _uniqueStrings;
    _wasmField?: CategoricalFieldWrapper;
    _cachedData: (string | Invalid)[];
    _cachedFormattedData: (string | Invalid)[];
    _cachedDomain: string[];
    constructor(schema: Schema, field?: CategoricalFieldWrapper);
    _setMeta(data: Array<string>): void;
    _getMeta(): Array<string>;
    domain(): string[];
    data(): (string | Invalid)[];
    formattedData(format?: Function): (string | Invalid)[];
    getRowsCount(): number;
    dispose(): void;
}
export declare const categoricalFieldCreator: (data: Array<number | string | undefined | null>, schema: Schema, dm?: WasmDataModel | undefined) => {
    field: Categorical;
    index: number;
};
