import { rowDiffsetIterator } from './row-diffset-iterator';

const generateBuckets = (binSize, start, end) => {
    const buckets = [];
    let next = start;

    while (next < end) {
        buckets.push(next);
        next += binSize;
    }
    buckets.push(next);

    return buckets;
};

 /**
  * Creates the bin data from input measure field and supplied configs.
  *
  * @param {Measure} measureField - The Measure field instance.
  * @param {string} rowDiffset - The datamodel rowDiffset values.
  * @param {Object} config - The config object.
  * @return {Object} Returns the binned data and the corresponding bins.
  */
export function createBinnedFieldData (measureField, rowDiffset, config) {
    let { buckets, binsCount, binSize, start, end } = config;
    const [dMin, dMax] = measureField.domain();

    if (!buckets) {
        start = (start !== 0 && (!start || start > dMin)) ? dMin : start;
        end = (end !== 0 && (!end || end < dMax)) ? (dMax + 1) : end;

        if (binsCount) {
            binSize = Math.ceil(Math.abs(end - start) / binsCount);
        }

        buckets = generateBuckets(binSize, start, end);
    }

    if (buckets[0] > dMin) {
        buckets.unshift(dMin);
    }
    if (buckets[buckets.length - 1] < dMax) {
        buckets.push(dMax + 1);
    }

    const bucketRanges = [];
    for (let i = 0; i < buckets.length - 1; i++) {
        bucketRanges.push({
            start: buckets[i],
            end: buckets[i + 1]
        });
    }

    const binnedData = [];
    rowDiffsetIterator(rowDiffset, (i) => {
        const datum = measureField.partialField.data[i];
        const range = bucketRanges.find(r => datum >= r.start && datum < r.end);
        binnedData.push(`${range.start}-${range.end}`);
    });

    return { binnedData, bins: buckets };
}
