import { rowDiffsetIterator } from './row-diffset-iterator';
/**
 * Creates bin f from the data and the supplied config.
 *
 * @param {Array} data - The input data.
 * @param {Object} config - The config object.
 * @param {number} config.binSize - The size of the bin.
 * @param {number} config.numOfBins - The number of bins to be created.
 * @return {Array} Returns an array of created bins.
 */
export function createBinnedFieldData (field, rowDiffset, reducerFunc, config) {
    let { buckets, numOfBins, binSize, start } = config;
    let dataStore = [];
    let binnedData = [];
    let [min, max] = field.domain();
    rowDiffsetIterator(rowDiffset, (i) => {
        dataStore.push({
            data: field.data[i],
            index: i
        });
    });

    if (!buckets) {
        max += 1;
        binSize = binSize || (max - min) / numOfBins;
        let end = [];
        let extraBinELm = (max - min) % binSize;
        if (!numOfBins && extraBinELm !== 0) {
            max = max + binSize - extraBinELm;
        }
        let binEnd = min + binSize;
        while (binEnd <= max) {
            end.push(binEnd);
            binEnd += binSize;
        }
        start = start || min;
        buckets = { start, end };
    }
    let prevEndpoint = buckets.start || min;
    buckets.end.forEach((endPoint) => {
        let tempStore = dataStore.filter(datum => datum.data >= prevEndpoint && datum.data < endPoint);
        tempStore.forEach((datum) => { binnedData[datum.index] = `${prevEndpoint} - ${endPoint}`; });
        prevEndpoint = endPoint;
    });

    // create a bin for values less than start
    dataStore.filter(datum => datum.data < buckets.start)
                    .forEach((datum) => { binnedData[datum.index] = `< -${buckets.start}`; });

    // create a bin for values more than end
    dataStore.filter(datum => datum.data >= buckets.end[buckets.end.length - 1])
                    .forEach((datum) => { binnedData[datum.index] = `> - ${buckets.end[buckets.end.length - 1]}`; });

    return binnedData;
}
