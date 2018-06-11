import crossProduct from './cross-product';
import { JOINS } from '../constants';
import union from './union';

export function leftOuterJoin(table1, table2, filterFn) {
    return crossProduct(table1, table2, filterFn, false, JOINS.LEFTOUTER);
}

export function rightOuterJoin(table1, table2, filterFn) {
    return crossProduct(table2, table1, filterFn, false, JOINS.RIGHTOUTER);
}

export function fullOuterJoin(table1, table2, filterFn) {
    return union(this.leftJoin(table1, table2, filterFn), this.rightJoin(table1, table2, filterFn));
}
