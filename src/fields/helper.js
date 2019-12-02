import { rowDiffsetIterator } from '../operator/row-diffset-iterator';
import InvalidAwareTypes from '../invalid-aware-types';

export const calculateContinuousDomain = (data, rowDiffset) => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    // here don't use this.data() as the iteration will be occurred two times on same data.
    rowDiffsetIterator(rowDiffset, (i) => {
        const datum = data[i];
        if (datum instanceof InvalidAwareTypes) {
            return;
        }

        if (datum < min) {
            min = datum;
        }
        if (datum > max) {
            max = datum;
        }
    });

    return [min, max];
};
