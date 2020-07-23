/**
*/
export function main_js(): void;
/**
* @param {DataModel} dm
* @param {number} spliting_field
* @param {number} _color_field
* @param {number} measure_field
* @param {number} sort
* @returns {StackData}
*/
export function stack_by(dm: DataModel, spliting_field: number, _color_field: number, measure_field: number, sort: number): StackData;
/**
*/
export class CategoricalDomainMeta {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @param {number} arg0
    */
    set data_ptr(arg: number);
    /**
    * @returns {number}
    */
    get data_ptr(): number;
    /**
    * @param {number} arg0
    */
    set data_len(arg: number);
    /**
    * @returns {number}
    */
    get data_len(): number;
}
/**
*/
export class CategoricalFieldWrapper {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {string}
    */
    get_name(): string;
    /**
    * @returns {number}
    */
    get_data_indices(): number;
    /**
    * @returns {number}
    */
    get_data_info(): number;
    /**
    * @returns {number}
    */
    get_rows_count(): number;
    /**
    * @param {number} row_index
    * @returns {number}
    */
    get_value_at_index(row_index: number): number;
    /**
    * @returns {CategoricalDomainMeta}
    */
    get_domain(): CategoricalDomainMeta;
}
/**
*/
export class ContinuousFieldWrapper {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {string}
    */
    get_name(): string;
    /**
    * @returns {number}
    */
    get_data_ptr(): number;
    /**
    * @returns {number}
    */
    get_data_indices(): number;
    /**
    * @returns {number}
    */
    get_data_info(): number;
    /**
    * @returns {number}
    */
    get_rows_count(): number;
    /**
    * @param {number} row_index
    * @returns {number}
    */
    get_value_at_index(row_index: number): number;
    /**
    * @returns {Float64Array}
    */
    get_domain(): Float64Array;
}
/**
*/
export class DataModel {
    static __wrap(ptr: any): any;
    /**
    * Public API to create new DataModel Instance
    * @param {DataModelMeta} meta
    */
    constructor(meta: DataModelMeta);
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {DataModel}
    */
    clone(): DataModel;
    /**
    * @param {any} schema
    * @param {any} data
    * @returns {number}
    */
    add_field(schema: any, data: any): number;
    /**
    * @param {number} index
    * @returns {CategoricalFieldWrapper}
    */
    get_categorical_field(index: number): CategoricalFieldWrapper;
    /**
    * @param {number} index
    * @returns {ContinuousFieldWrapper}
    */
    get_continuous_field(index: number): ContinuousFieldWrapper;
    /**
    * @param {number} index
    * @returns {TemporalFieldWrapper}
    */
    get_temporal_field(index: number): TemporalFieldWrapper;
    /**
    * @param {number} index
    * @returns {IdFieldWrapper}
    */
    get_id_field(index: number): IdFieldWrapper;
    /**
    * @param {any} obj
    * @param {number} mode
    * @returns {ProjectDataModel}
    */
    select(obj: any, mode: number): ProjectDataModel;
    /**
    * @param {any} details
    * @returns {DataModel}
    */
    sort(details: any): DataModel;
    /**
    * @param {any} details
    * @returns {ProjectDataModel}
    */
    project(details: any): ProjectDataModel;
    /**
    * @param {any} details
    * @param {any} options
    * @returns {DataModel}
    */
    group_by(details: any, options: any): DataModel;
    /**
    * @param {any} options
    * @returns {SplitDataModel}
    */
    split_by_row(options: any): SplitDataModel;
    /**
    * @param {any} fields
    */
    dispose(fields: any): void;
    /**
    * @returns {number}
    */
    row_count(): number;
    /**
    * @returns {number}
    */
    column_count(): number;
    /**
    * @returns {Int32Array}
    */
    get_eligible_rows(): Int32Array;
    /**
    * @returns {number}
    */
    get_partial_column_count(): number;
    /**
    * @returns {number}
    */
    get_partial_row_count(): number;
    /**
    * @param {DataModel} dm2
    * @returns {Uint32Array}
    */
    get_matching_ids(dm2: DataModel): Uint32Array;
}
/**
*/
export class DataModelMeta {
    static __wrap(ptr: any): any;
    /**
    * @param {number} rows
    * @param {number} columns
    */
    constructor(rows: number, columns: number);
    free(): void;
    ptr: number | undefined;
    /**
    * @param {number} arg0
    */
    set rows(arg: number);
    /**
    * @returns {number}
    */
    get rows(): number;
    /**
    * @param {number} arg0
    */
    set columns(arg: number);
    /**
    * @returns {number}
    */
    get columns(): number;
}
/**
*/
export class IdFieldWrapper {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {string}
    */
    get_name(): string;
    /**
    * @returns {number}
    */
    get_data_ptr(): number;
    /**
    * @returns {number}
    */
    get_data_indices(): number;
    /**
    * @returns {number}
    */
    get_data_info(): number;
    /**
    * @returns {number}
    */
    get_rows_count(): number;
    /**
    * @param {number} row_index
    * @returns {number}
    */
    get_value_at_index(row_index: number): number;
}
/**
*/
export class ProjectDataModel {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {DataModel | undefined}
    */
    get_filtered_dm(): DataModel | undefined;
    /**
    * @returns {DataModel | undefined}
    */
    get_unfiltered_dm(): DataModel | undefined;
}
/**
*/
export class SplitDataModel {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {DataModel}
    */
    get_dm(): DataModel;
    /**
    * @returns {number}
    */
    get_count(): number;
}
/**
*/
export class StackData {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {number}
    */
    get_y_0(): number;
    /**
    * @returns {number}
    */
    get_y_1(): number;
    /**
    * @returns {number}
    */
    get_id(): number;
    /**
    */
    free_data(): void;
}
/**
*/
export class TemporalFieldWrapper {
    static __wrap(ptr: any): any;
    free(): void;
    ptr: number | undefined;
    /**
    * @returns {string}
    */
    get_name(): string;
    /**
    * @returns {number}
    */
    get_data_ptr(): number;
    /**
    * @returns {number}
    */
    get_data_indices(): number;
    /**
    * @returns {number}
    */
    get_data_info(): number;
    /**
    * @returns {number}
    */
    get_rows_count(): number;
    /**
    * @param {number} row_index
    * @returns {number}
    */
    get_value_at_index(row_index: number): number;
    /**
    * @returns {number}
    */
    min_consecutive_diff(): number;
    /**
    * @returns {Float64Array}
    */
    get_domain(): Float64Array;
}
export function __wbindgen_json_serialize(arg0: any, arg1: any): void;
export function __wbindgen_object_drop_ref(arg0: any): void;
export function __wbindgen_throw(arg0: any, arg1: any): never;
