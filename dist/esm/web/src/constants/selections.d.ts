export declare enum ComparisonOperatorsType {
    EQUAL = "eq",
    NOT_EQUAL = "neq",
    GREATER_THAN = "gt",
    LESS_THAN = "lt",
    GREATER_THAN_EQUAL = "gte",
    LESS_THAN_EQUAL = "lte",
    IN = "in",
    NIN = "nin",
    EQUAL_TO = "eq",
    NOT_EQUAL_TO = "neq"
}
export declare enum LogicalOperatorsType {
    AND = "and",
    OR = "or"
}
export declare const _selectionOperatorResolver: (op: ComparisonOperatorsType | LogicalOperatorsType) => number;
