import { AggregationType } from '../constants/aggregations';
import { ComparisonOperatorsType, LogicalOperatorsType } from '../constants/selections';
import { FilteringModesType } from '../constants/filtering-modes';
import { SortOrder } from '../constants/sort';
import { Data, Schema, LoadDataOptions, RawData, ResultData, DataMeta } from './data';
import { AbstractWasmField } from '../contexts/wasm/fields/field';
import DateTimeFormatter from '../data/utils/date-time-formatter';
import { FieldType, FieldSubtype } from '../constants/fields';
import { Operations } from '../constants/miscellaneous';
import Invalid from '../data/invalid/invalid';
import { ContextContract } from './context';
declare abstract class AbstractDataModel {
    static AggregationFunctions: typeof AggregationType;
    static ComparisonOperators: typeof ComparisonOperatorsType;
    static FilteringModes: typeof FilteringModesType;
    static LogicalOperators: typeof LogicalOperatorsType;
    static DateTimeFormatter: typeof DateTimeFormatter;
    static FieldType: typeof FieldType;
    static FieldSubtype: typeof FieldSubtype;
    static DerivationOperations: typeof Operations;
    static SortOrder: typeof SortOrder;
    static Invalid: typeof Invalid;
    static DataWranglers: import("./dataWranglers").DataWranglingOperations;
    private static _taskerPool;
    static loadData(data: RawData, schema: Schema[], options: LoadDataOptions): Promise<Data>;
    static defaultAggregation: (agg?: AggregationType) => AggregationType;
    abstract getParent(): AbstractDataModel | undefined;
    abstract detachParent(): AbstractDataModel | undefined;
    abstract getChildren(): Array<AbstractDataModel>;
    abstract removeChild(datamodel: AbstractDataModel): void;
    abstract getData(): ResultData;
    abstract getDataMeta(): DataMeta;
    abstract getSchema(): Array<Schema>;
    abstract getField(name: string): AbstractWasmField | undefined;
    abstract clone(): AbstractDataModel;
    abstract sort(sortingDetails: [[string, SortOrder]]): AbstractDataModel;
    abstract select(query: any, options?: {
        mode: FilteringModesType;
    }): AbstractDataModel | AbstractDataModel[];
    abstract splitByRow(fields: string[]): AbstractDataModel[];
    abstract project(fields: string[], options?: {
        mode: FilteringModesType;
    }): AbstractDataModel | AbstractDataModel[];
    abstract groupBy(fields: string[], reducers: {
        field: string;
        aggn: AggregationType;
    }[], options?: {}): AbstractDataModel;
    abstract dispose(): void;
    abstract calculateVariable(fieldInfo: Schema, fields: string[], fn: (...params: (string | number | Invalid)[]) => string | number): AbstractDataModel;
    abstract context(): ContextContract;
}
export default AbstractDataModel;
