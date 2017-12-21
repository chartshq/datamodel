/**
 * This will iterate through the diffSet Array and call the callback with the current
 * index
 * @param {string}   rowDiffset the row diffset string eg. '0-4,6,10-13'
 * @param {Function} callback   function to be called with every index
 */
function rowDiffsetIterator(rowDiffset, callback) {
    // Checking if the diffset is empty don't do anything.
    if (rowDiffset.length > 0) {
        const rowDiffArr = rowDiffset.split(',');
        rowDiffArr.forEach((diffStr) => {
            const diffStsArr = diffStr.split('-'),
                start = +(diffStsArr[0]),
                end = +(diffStsArr[1] || diffStsArr[0]);
            if (end >= start) {
                for (let i = start; i <= end; i += 1) {
                    callback(i);
                }
            }
        });
    }
}

export { rowDiffsetIterator as default };
