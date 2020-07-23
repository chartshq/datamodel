import { LoadDataParams, Data } from '../contracts/data';
import { Tasker } from '../contracts/tasker';
export declare const transformDataOnWorker: (data: LoadDataParams, taskerPool: Tasker[]) => Promise<Data>;
