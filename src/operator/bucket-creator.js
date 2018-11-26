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

const findBucketRange = (bucketRanges, value) => {
    let leftIdx = 0;
    let rightIdx = bucketRanges.length - 1;
    let midIdx;
    let range;

    // Here use binary search as the bucketRanges is a sorted array
    while (leftIdx <= rightIdx) {
        midIdx = leftIdx + Math.floor((rightIdx - leftIdx) / 2);
        range = bucketRanges[midIdx];

        if (value >= range.start && value < range.end) {
            return range;
        } else if (value >= range.end) {
            leftIdx = midIdx + 1;
        } else if (value < range.start) {
            rightIdx = midIdx - 1;
        }
    }

    return null;
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
    if (buckets[buckets.length - 1] <= dMax) {
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
        if (datum === null) {
            binnedData.push(null);
            return;
        }

        const range = findBucketRange(bucketRanges, datum);
        binnedData.push(`${range.start}-${range.end}`);
    });

    return { binnedData, bins: buckets };
}
