import { Tasker } from '../contracts/tasker';
declare const initializePoolExecutor: (taskers: Tasker[]) => (data: unknown) => Promise<unknown>;
export { initializePoolExecutor };
