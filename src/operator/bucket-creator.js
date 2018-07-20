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
export function createBinnedFieldData (fielddata, rowDiffset, reducerFunc, config) {
    let { buckets, numOfBins, binSize } = config;
    let dataStore = [];
    let binnedData = [];
    rowDiffsetIterator(rowDiffset, (i) => {
        dataStore.push({
            data: fielddata[i],
            index: i
        });
    });

    if (buckets) {
        let prevEndpoint = -Infinity;
        buckets.end.forEach((endPoint, i) => {
            let tempStore = dataStore.filter(datum => datum.data > prevEndpoint && datum.data <= endPoint);
            let dataVals = tempStore.map(datum => datum.data);
            if ((buckets.start || buckets.start === 0) && i === 0) {
                dataVals.push(buckets.start);
            }
            let binVal = reducerFunc(dataVals);
            tempStore.forEach((datum) => { binnedData[datum.index] = binVal; });
            prevEndpoint = endPoint;
        });
    }
    else {
        binSize = binSize || Math.floor(dataStore.length / numOfBins);
        let len = 0;
        while (len < dataStore.length) {
            let tempStore = [];
            for (let i = len; i < (len + binSize); i++) {
                if (!dataStore[i]) break;
                tempStore.push(dataStore[i].data);
            }
            let binVal = reducerFunc(tempStore);
            for (let i = len; i < (len + binSize); i++) {
                if (!dataStore[i]) break;
                binnedData[dataStore[i].index] = binVal;
            }
            len += binSize;
        }
    }
    return binnedData;
}
