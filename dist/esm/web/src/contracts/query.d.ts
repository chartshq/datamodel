import { ComparisonOperatorsType, LogicalOperatorsType } from '../constants/selections';
export interface Condition {
    value: number | string;
    field: string | number;
    operator: ComparisonOperatorsType;
}
export interface BlockConditions {
    conditions: Condition[];
    operator: LogicalOperatorsType;
}
export declare type Query = Condition | BlockConditions;
