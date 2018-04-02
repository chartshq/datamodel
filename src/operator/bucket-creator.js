/**
 * This file exports a funtion taht is used to create bins for
 * a particular measure.
 */

/**
 * This function is used to create bins from the
 * data and supplied config.
 *
 * @export
 * @param {Array} data Array of data.
 * @param {Object} config The config.
 * @param {number} config.binSize The size of the bin.
 * @param {number} config.numOfBins The number of bins to create.
 * @return {Array} array of objects with bin sizes.
 */
export function createBuckets(data, config) {
    const {
        binSize,
        numOfBins,
    } = config;
    let min = data[0];
    let max = data[0];
    data.forEach((val) => {
        min = val < min ? val : min;
        max = val > max ? val : max;
    });
    min = config.origin || min;
    const bins = [];
    if (binSize) {
        const count = ((max - min) / binSize).toFixed();
        for (let i = 0; i < count; i += 1) {
            const start = min + (i * binSize);
            const end = min + ((i + 1) * binSize);
            bins.push({
                start,
                end,
                label: `${start}-${end}`,
            });
        }
        return bins;
    }
    const count = numOfBins;
    const size = ((max - min) / numOfBins).toFixed();
    for (let i = 0; i < count; i += 1) {
        const start = min + (i * size);
        const end = min + ((i + 1) * size);
        bins.push({
            start,
            end,
            label: `${start}-${end}`,
        });
    }
    return bins;
}
