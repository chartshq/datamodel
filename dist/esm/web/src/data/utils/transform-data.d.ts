import { LoadDataParams, RawData, Data, Schema, LoadDataOptions } from '../../contracts/data';
import { Tasker } from '../../contracts/tasker';
/**
 * Transform the input data and schema into sanitized array format
 * @param {Object} rawData
 * @param {Object} data object
 * @param {Object} schema schema object
 * @param {Object} options
 */
export declare const transformDataHelper: (rawData: LoadDataParams) => Data;
declare const _default: (data: RawData, schema: Schema[], options: LoadDataOptions, taskerPool?: Tasker[] | undefined) => Promise<Data>;
export default _default;
