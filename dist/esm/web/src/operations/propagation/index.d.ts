import DataModel from '../../export';
export declare const updateRefCount: (dm: DataModel | undefined, increment: boolean) => void;
export declare const disposeZeroRefDms: (dm: DataModel | undefined) => void;
export interface PropagationInfo {
    listeners: Array<Function>;
    propagationCriterias: Map<string, any>;
}
export declare const getRootModel: (dm: DataModel) => DataModel;
export declare const getQueryDataModels: (queries: any, rootDm: DataModel) => any;
export declare const propagateIdentifiers: (dm: DataModel, config: any, queryDms: any, propagationModel?: DataModel | undefined) => void;
export declare const getPropagationTargetMap: (dm: DataModel, models?: Set<unknown>, exclude?: boolean, map?: Map<any, any>) => boolean;
