import AbstractDataModel from './datamodel';
import { SortOrder } from '../constants/sort';
export interface DataWranglingOperations {
    stackBy(dm: AbstractDataModel, splitingfield: string, colorFieldName: string, measureField: string, sortOrder: SortOrder): {
        y0: number[];
        y1: number[];
        id: number[];
    };
}
