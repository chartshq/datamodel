import { AbstractWasmField } from './field';
import { WasmDataModel, TemporalFieldWrapper } from '../utils';
import { Schema } from '../../../contracts/data';
import Invalid from '../../../data/invalid/invalid';
export default class Temporal extends AbstractWasmField {
    _wasmField?: TemporalFieldWrapper;
    _cachedDomain: number[];
    _cachedData: (number | Invalid)[];
    _cachedFormattedData: (string | Invalid)[] | (number | Invalid)[];
    constructor(schema: Schema, field?: TemporalFieldWrapper);
    domain(): number[];
    data(): (number | Invalid)[];
    formattedData(format?: Function | string): (string | Invalid)[] | (number | Invalid)[];
    getRowsCount(): number;
    dispose(): void;
    minimumConsecutiveDifference(): number;
}
export declare const temporalFieldCreator: (data: Array<number>, schema: Schema, dm?: WasmDataModel | undefined) => {
    field: Temporal;
    index: number;
};
