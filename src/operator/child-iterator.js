/**
 * Invokes a callback for every child created by a selection operation on a datatable.
 *
 * @param {DataTable} datatable - The input datatable instance.
 * @param {Function} callback - The callback to be invoked on each child. The parameters
 * provided to the callback are the child datatable instance and the selection
 * function used to create it.
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
 * Invokes a callback for every measure child of a datatable.
 *
 * @param {DataTable} datatable - The input datatable instance.
 * @param {Function} callback - The callback to be invoked on each measure child. The parameters
 * provided to the callback are the child datatable instance and the child params.
 */
export function calculatedMeasureIterator(datatable, callback) {
    const calculatedMeasureChildren = datatable.calculatedMeasureChildren;
    calculatedMeasureChildren.forEach((item) => {
        const {
            table,
            params,
        } = item;
        callback(table, params);
    });
}

/**
 * Invokes a callback for every projected child of a datatable.
 *
 * @param {DataTable} datatable - The input datatable instance.
 * @param {Function} callback - The callback to be invoked on each projected child. The parameters
 * provided to the callback are the child datatable instance and the
 * projection string.
 */
export function projectIterator(datatable, callback) {
    const projectedChildren = datatable.projectedChildren;
    Object.keys(projectedChildren).forEach((projString) => {
        const targetDT = projectedChildren[projString];
        callback(targetDT, projString);
    });
}

/**
 * Invokes a callback over the children created by a groupBy
 * operation on a datatable.
 *
 * @param {DataTable} datatable - The input datatable instance.
 * @param {Function} callback - The callback to be invoked. The parameters
 * provided to the callback are the child datatable instance and the groupBy string used to create it.
 */
export function groupByIterator(datatable, callback) {
    const groupByChildren = datatable.groupedChildren;
    Object.keys(groupByChildren).forEach((key) => {
        const tableReducerMap = groupByChildren[key];
        const targetDT = tableReducerMap.child;
        const reducer = tableReducerMap.reducer;
        const groupByString = tableReducerMap.groupByString;
        callback(targetDT, {
            groupByString,
            reducer,
        });
    });
}
