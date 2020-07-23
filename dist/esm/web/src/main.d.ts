import AbstractDataModel from './contracts/datamodel';
import { ContextContract } from './contracts/context';
import { Data, Schema, DataMeta, ResultData } from './contracts/data';
import { ContextType } from './constants/context';
import { AggregationType } from './constants/aggregations';
import { DerivationParams } from './constants/miscellaneous';
import { FilteringModesType } from './constants/filtering-modes';
import { SortOrder } from './constants/sort';
import { AbstractWasmField } from './contexts/wasm/fields/field';
import { PropagationInfo } from './operations/propagation';
import Invalid from './data/invalid/invalid';
export default class DataModel extends AbstractDataModel {
    _context: ContextContract;
    _children: DataModel[];
    _parent?: DataModel;
    _derivations: DerivationParams[];
    _commonDerivation: DerivationParams | null;
    _id: string;
    _disposed?: boolean;
    _propagationInfo: PropagationInfo;
    _refCount: number;
    static _contextType: ContextType;
    static _defaults: Record<string, Function>;
    static setContext(context?: ContextType): void;
    constructor(formattedData: Data | DataModel);
    private setWasmContext;
    private setContextInfo;
    private sanitizeSchema;
    private cloneFromContext;
    static setInvalids(value: string[]): void;
    static unsetInvalids(value: string[]): void;
    static defaultInvalidValue(value?: string): string;
    static defaultAggregation(agg?: AggregationType): AggregationType;
    static get defaults(): Record<string, Function>;
    id(): string;
    getField(name: string): AbstractWasmField | undefined;
    getParent(): DataModel | undefined;
    getChildren(): Array<DataModel>;
    getDerivations(): Array<DerivationParams>;
    removeChild(dataModel: DataModel): void;
    detachParent(): DataModel;
    getData(): ResultData;
    getDataMeta(): DataMeta;
    getSchema(): Array<Schema>;
    clone(saveChild?: boolean): DataModel;
    sort(sortingDetails: [[string, SortOrder]]): DataModel;
    select(query: any, options?: {
        mode: FilteringModesType;
    }): DataModel | DataModel[];
    splitByRow(fields: string[]): DataModel[];
    project(fields: string[], options?: {
        mode: FilteringModesType;
    }): DataModel | DataModel[];
    groupBy(fields: string[], reducers?: {
        field: string;
        aggn: AggregationType;
    }[], options?: {}): DataModel;
    private disposeRecursive;
    getPropagationCriterias(): Map<string, any>;
    dispose(force?: boolean): DataModel;
    disposeResources(): DataModel;
    propagate(queries: any, info: any): DataModel;
    onPropagation(fn: Function): DataModel;
    unsubscribePropagationListeners(): DataModel;
    calculateVariable(fieldInfo: Schema, fields: string[], fn: (...params: (string | number | Invalid)[]) => string | number): DataModel;
    context(): ContextContract;
}