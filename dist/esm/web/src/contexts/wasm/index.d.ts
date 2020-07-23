import { ContextContract } from '../../contracts/context';
import { Data, Schema, DataMeta, ResultData } from '../../contracts/data';
import { ContextType } from '../../constants/context';
import { AggregationType } from '../../constants/aggregations';
import { FilteringModesType } from '../../constants/filtering-modes';
import { SortOrder } from '../../constants/sort';
import { WasmDataModel } from './utils';
import { AbstractWasmField } from './fields/field';
import Invalid from '../../data/invalid/invalid';
export default class WasmContext implements ContextContract {
    _contextName: ContextType;
    _context?: WasmDataModel;
    _fieldOrder: Array<string>;
    _fieldMap: Map<string, {
        field: AbstractWasmField;
        index: number;
    }>;
    _dataMeta: DataMeta;
    constructor(rawData: Data | WasmContext, dataMeta?: DataMeta);
    private updateFieldMap;
    private createFields;
    private createField;
    private updateFields;
    private setContextInfo;
    private getClonedFieldMap;
    getField(name: string): AbstractWasmField | undefined;
    getData(startIndex?: number, endIndex?: number): ResultData;
    getSchema(): Array<Schema>;
    getDataMeta(): DataMeta;
    sort(sortingDetails: [[string, SortOrder]]): WasmContext;
    groupBy(fields: string[], reducers?: {
        field: string;
        aggn: AggregationType;
    }[], options?: {
        createId: boolean;
    }): WasmContext;
    select(query: any, options?: {
        mode: FilteringModesType;
    }): WasmContext | WasmContext[];
    project(fields: string[], options?: {
        mode: FilteringModesType;
    }): WasmContext | WasmContext[];
    splitByRow(fields: string[]): WasmContext[];
    clone(): WasmContext;
    dispose(removeFields: {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: string[];
        };
    }): void;
    addIdField(ids: number[]): WasmContext;
    calculateVariable(fieldInfo: Schema, fields: string[], fn: (...params: (string | number | Invalid)[]) => string | number): WasmContext;
    getMatchingIds(dm: WasmContext): number[];
    context(): WasmDataModel | undefined;
}
