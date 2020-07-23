import { Operations } from '../constants/miscellaneous';
export declare const disposeStrategies: {
    select: (_val: Record<string, any>) => {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: never[];
        };
    };
    project: (_val: Record<string, any>) => {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: never[];
        };
    };
    groupBy: (_val: Record<string, any>) => {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: never[];
        };
    };
    sort: (_val: Record<string, any>) => {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: never[];
        };
    };
    split: (_val: Record<string, any>) => {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: never[];
        };
    };
    calculate_variable: (val: Record<string, any>) => {
        disposeFields: boolean;
        disposePartialFields: {
            dispose: boolean;
            values: any[];
        };
    };
};
