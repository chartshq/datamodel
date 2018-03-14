/**
 * default sort function works same like default javascript sort
 * @param  {*} a first value
 * @param  {*} b second value
 * @return {number}   -1|1|0 according to the condition
 */
function defSortFn(a, b) {
    const a1 = `${a}`;
    const b1 = `${b}`;
    if (a1 < b1) {
        return -1;
    }
    if (a1 > b1) {
        return 1;
    }
    return 0;
}

/**
 * create the sorted arrar from the two alternate part of the array
 * @param  {Array} arr    array which need to be merged
 * @param  {number} lo     starting point of the first array
 * @param  {number} mid    ending point of the first array
 * @param  {number} hi     ending point of the second array
 * @param  {Function} sortFn The function according to which the array will be changed
 */
function merge(arr, lo, mid, hi, sortFn) {
    const mainArr = arr;
    const auxArr = [];
    for (let i = lo; i <= hi; i += 1) {
        auxArr[i] = mainArr[i];
    }
    let a = lo;
    let b = mid + 1;

    for (let i = lo; i <= hi; i += 1) {
        if (a > mid) {
            mainArr[i] = auxArr[b];
            b += 1;
        } else if (b > hi) {
            mainArr[i] = auxArr[a];
            a += 1;
        } else if (sortFn(auxArr[a], auxArr[b]) <= 0) {
            mainArr[i] = auxArr[a];
            a += 1;
        } else {
            mainArr[i] = auxArr[b];
            b += 1;
        }
    }
}

/**
 * Helper function of merge sort which will be called recursively to do the sorting
 * @param  {Array} arr    the array which need to be sorted
 * @param  {number} lo     starting point of the array need to be sorted
 * @param  {number} hi     ending point of the array need to be sorted
 * @param  {Function} sortFn function according to which the sorting will be happened
 * @return {Array}        same array with sorted
 */
function sort(arr, lo, hi, sortFn) {
    // base case
    if (hi === lo) { return arr; }
    const mid = lo + Math.floor((hi - lo) / 2);
    sort(arr, lo, mid, sortFn);
    sort(arr, mid + 1, hi, sortFn);
    merge(arr, lo, mid, hi, sortFn);
    return arr;
}

/**
 * Implementation of merge sort. Its required by dataTable to have stable sorting, as it is not
 * sure what sorting algorithm used by browsers is stable or not.
 * @param  {Array} arr    array which need to be sorted
 * @param  {Function} sortFn sorting function which decide sorting ascending or decending.
 * @return {Array}        the same input array in sorted order
 */
function mergeSort(arr, sortFn = defSortFn) {
    if (arr.length > 1) { sort(arr, 0, arr.length - 1, sortFn); }
    return arr;
}

export { mergeSort as default };
