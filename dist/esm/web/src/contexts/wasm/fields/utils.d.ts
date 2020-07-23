import { Schema } from '../../../contracts/data';
export declare const saveIndecesToMemory: (pointer: number, data: Array<number>) => void;
export declare const saveNumbersToMemory: (pointer: number, data: Array<number>) => void;
export declare const sanitizeNumbers: (data?: Array<number | string | null | undefined>) => Record<string, number[]>;
export declare const getIndecesFromMemory: (dataPtr: number, rowsCount: number) => Array<number>;
export declare const getNumbersArrayFromMemory: (dataPtr: number, rowsCount: number) => Array<number>;
export declare const isValidString: (val: undefined | null | string | number) => boolean;
export declare const sanitizeStrings: (data?: Array<number | string | undefined | null>) => {
    uniqueStrings: string[];
    indices: number[];
};
export declare const getWasmSchema: (schema: Schema) => {
    name: string;
    type: number;
    subtype: number;
    aggregation_function: number;
};
