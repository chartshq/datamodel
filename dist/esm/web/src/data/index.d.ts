import { LoadDataParams, Data } from '../contracts/data';
import { Tasker } from '../contracts/tasker';
export declare const getFormattedData: (rawData: LoadDataParams, taskerPool?: Tasker[] | undefined) => Promise<Data>;
