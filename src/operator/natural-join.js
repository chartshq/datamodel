import { crossProduct } from './cross-product';
import { naturalJoinFilter } from './natural-join-filter-function';

export function naturalJoin(table1, table2) {
    return crossProduct(table1, table2, naturalJoinFilter(table1, table2), true);
}
