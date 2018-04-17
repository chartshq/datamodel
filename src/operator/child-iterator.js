/**
 * This file exports functions that are used to iterate over
 * different types of children of a datatable.
 */

/**
 *  This function invokes a callback for every child created by a selection
 * operation on the datatable.
 * The parameters provided to the callback are the child DataTable and the selection
 * function used to create it.
 *
 * @export
 * @param {DataTable} datatable Instance of adatatable.
 * @param {Function} callback The callback to invoke on each child.
 */
export function selectIterator(datatable, callback) {
    const selectedChildren = datatable.selectedChildren;
    selectedChildren.forEach((item) => {
        const {
            table,
            selectionFunction,
        } = item;
        callback(table, selectionFunction);
    });
}

/**
 * This function is used to invoke a callback on each of the projected
 * children of a daatable.
 * The arguments provided to the callback are the child datatable and the
 * pojection string.
 *
 * @export
 * @param {DataTable} datatable The parent Datatable.
 * @param {Function} callback The callback to invoke.
 */
export function projectIterator(datatable, callback) {
    const projectedChildren = datatable.projectedChildren;
    Object.keys(projectedChildren).forEach((projString) => {
        const targetDT = projectedChildren[projString];
        callback(targetDT, callback);
    });
}

/**
 * This function invokes the supplied calbback over the children created by a groupBy
 * operation on the datatable.
 * The arguments supplied to the callback are the child datatable instance and
 * the groupby string used to create it.
 *
 * @export
 * @param {DataTable} datatable The parent datatble.
 * @param {Function} callback The callback to invoke.
 */
export function groupByIterator(datatable, callback) {
    const groupByChildren = datatable.groupedChildren;
    Object.keys(groupByChildren).forEach((groupByString) => {
        const tableReducerMap = groupByChildren[groupByString];
        const targetDT = tableReducerMap.child;
        const reducer = tableReducerMap.reducer;
        callback(targetDT, {
            groupByString,
            reducer,
        });
    });
}
