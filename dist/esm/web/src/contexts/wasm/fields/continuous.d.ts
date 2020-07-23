import { AbstractWasmField } from './field';
import { ContinuousFieldWrapper, WasmDataModel } from '../utils';
import { Schema } from '../../../contracts/data';
import Invalid from '../../../data/invalid/invalid';
export default class Continuous extends AbstractWasmField {
    _wasmField?: ContinuousFieldWrapper;
    _cachedData: (number | Invalid)[];
    _cachedDomain: number[];
    _cachedFormattedData: (string | Invalid)[] | (number | Invalid)[];
    constructor(schema: Schema, field?: ContinuousFieldWrapper);
    domain(): number[];
    data(): (number | Invalid)[];
    formattedData(format?: Function): (number | Invalid)[] | (string | Invalid)[];
    getRowsCount(): number;
    dispose(): void;
}
export declare const continuousFieldCreator: (data: Array<string | null | undefined | number>, schema: Schema, dm?: WasmDataModel | undefined) => {
    field: Continuous;
    index: number;
};
