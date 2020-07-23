import { FieldType, FieldSubtype } from '../constants/fields';
import { AggregationType } from '../constants/aggregations';
import Invalid from '../data/invalid/invalid';
export interface Schema {
    name: string;
    type: FieldType;
    subtype?: FieldSubtype;
    defAggFn?: AggregationType;
    format?: string | Function;
    displayName?: string;
}
/**
 * This will act as the data input during datamodel intialization.
 */
export interface Data {
    schema: Array<Schema>;
    data: Array<(string | undefined | null)[] | number[]>;
}
/**
 * This will act as the data input during datamodel intialization.
 */
export interface ResultData {
    schema: Array<Schema>;
    data: (string | number | Invalid)[][];
}
export interface DataMeta {
    rows: number;
    columns: number;
}
export declare enum DataFormat {
    FLAT_JSON = "FlatJSON",
    DSV_STR = "DSVStr",
    DSV_ARR = "DSVArr",
    AUTO = "Auto"
}
export interface LoadDataOptions {
    name?: string;
    dataFormat?: DataFormat;
    firstRowHeader?: boolean;
    fieldSeparator?: string;
    useWorker?: boolean;
}
export declare type RawData = object[] | JSON | string | [string[] | number[]];
export interface LoadDataParams {
    data: RawData;
    schema: Schema[];
    options: LoadDataOptions;
}
export interface DataConverter {
    _type: string;
    convert(data: object | string, schema: Schema[], options: LoadDataOptions): Data;
}
