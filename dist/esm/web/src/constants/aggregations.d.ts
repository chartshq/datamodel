export declare enum AggregationType {
    SUM = "sum",
    AVG = "avg",
    MIN = "min",
    MAX = "max",
    FIRST = "first",
    LAST = "last",
    COUNT = "count",
    STD = "std"
}
export declare const _aggregationResolver: (agg: AggregationType) => number;
