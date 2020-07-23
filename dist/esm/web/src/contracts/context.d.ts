import { ContextType } from '../constants/context';
import { DataMeta, ResultData, Schema } from './data';
import { SortOrder } from '../constants/sort';
import { AggregationType } from '../constants/aggregations';
import { FilteringModesType } from '../constants/filtering-modes';
import { AbstractWasmField } from '../contexts/wasm/fields/field';
import Invalid from '../data/invalid/invalid';
export interface ContextContract {
    _contextName: ContextType;
    getData(startIndex?: number, endIndex?: number): ResultData;
    getField(name: string): AbstractWasmField | undefined;
    getSchema(): Array<Schema>;
    sort(sortingDetails: [[string, SortOrder]]): ContextContract;
    groupBy(fields: string[], reducers: {
        field: string;
        aggn: AggregationType;
    }[], options?: any): ContextContract;
    select(query: any, options?: {
        mode: FilteringModesType;
    }): ContextContract | ContextContract[];
    splitByRow(fields: string[]): ContextContract[];
    project(fields: string[], options?: {
        mode: FilteringModesType;
    }): ContextContract | ContextContract[];
    clone(dataMeta: DataMeta): ContextContract;
    dispose(removeFields: {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: string[];
        };
    }): void;
    getDataMeta(): DataMeta;
    addIdField(ids: number[]): ContextContract;
    getMatchingIds(dm: ContextContract): number[];
    calculateVariable(fieldInfo: Schema, fields: string[], fn: (...params: (string | number | Invalid)[]) => string | number): ContextContract;
    context(): any;
}
