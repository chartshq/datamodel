/* eslint-disable default-case */
import { DT_DERIVATIVES } from '../constants';

/**
 * iterate the children and call the callback for each
 *
 * @param {DataTable} datatable
 * @param {function} callback
 * @param {OPERATION TYPEs} operation
 */
function childIterator(datatable, callback, operation) {
    const children = datatable.children;
    children.forEach((child) => {
        if (child._derivation
            && child._derivation.length === 1) {
            switch (operation) {
            case DT_DERIVATIVES.SELECT:
                if (child._derivation[0].op === DT_DERIVATIVES.SELECT) {
                    callback(child, child._derivation[0].criteria);
                }
                break;
            case DT_DERIVATIVES.PROJECT:
                if (child._derivation[0].op === DT_DERIVATIVES.PROJECT) {
                    callback(child, child._derivation[0].meta.projString);
                }
                break;
            case DT_DERIVATIVES.GROUPBY:
                if (child._derivation[0].op === DT_DERIVATIVES.GROUPBY) {
                    callback(child,
                        { groupByString: child._derivation[0].meta.groupByString,
                            reducer: child._derivation[0].criteria });
                }
                break;
            case DT_DERIVATIVES.CAL_MEASURE:
                if (child._derivation[0].op === DT_DERIVATIVES.CAL_MEASURE) {
                    let params = {
                        config: child._derivation[0].meta.config,
                        fields: child._derivation[0].meta.fields,
                        callback: child._derivation[0].criteria
                    };
                    callback(child, params);
                }
                break;
            }
        }
    });
}

/**
 * Invokes a callback for every child created by a selection operation on a DataTable.
 *
 * @param {DataTable} datatable - The input DataTable instance.
 * @param {Function} callback - The callback to be invoked on each child. The parameters
 * provided to the callback are the child DataTable instance and the selection
 * function used to create it.
 */
export function selectIterator(datatable, callback) {
    childIterator(datatable, callback, DT_DERIVATIVES.SELECT);
}

/**
 * Invokes a callback for every measure child of a DataTable.
 *
 * @param {DataTable} datatable - The input DataTable instance.
 * @param {Function} callback - The callback to be invoked on each measure child. The parameters
 * provided to the callback are the child DataTable instance and the child params.
 */
export function calculatedMeasureIterator(datatable, callback) {
    childIterator(datatable, callback, DT_DERIVATIVES.CAL_MEASURE);
}

/**
 * Invokes a callback for every projected child of a DataTable.
 *
 * @param {DataTable} datatable - The input DataTable instance.
 * @param {Function} callback - The callback to be invoked on each projected child. The parameters
 * provided to the callback are the child DataTable instance and the
 * projection string.
 */
export function projectIterator(datatable, callback) {
    childIterator(datatable, callback, DT_DERIVATIVES.PROJECT);
}

/**
 * Invokes a callback over the children created by a groupBy
 * operation on a DataTable.
 *
 * @param {DataTable} datatable - The input DataTable instance.
 * @param {Function} callback - The callback to be invoked. The parameters
 * provided to the callback are the child DataTable instance and the groupBy string used to create it.
 */
export function groupByIterator(datatable, callback) {
    childIterator(datatable, callback, DT_DERIVATIVES.GROUPBY);
}

