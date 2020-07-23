export declare enum Operations {
    SELECT = "select",
    GROUPBY = "groupBy",
    PROJECT = "project",
    SPLIT = "split",
    SORT = "sort",
    CALCULATE = "calculate_variable"
}
export declare const DEFAULT = "default";
export interface DerivationParams {
    operation: Operations;
    params: Record<string, any>;
}
