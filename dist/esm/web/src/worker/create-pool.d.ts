import { Tasker } from '../contracts/tasker';
declare function createTaskerPool(WebWorker: {
    new (): Worker;
}): Tasker[] | undefined;
export { createTaskerPool };
