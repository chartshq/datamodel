/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import mergeSort from './merge-sort';


describe('merge sort test', () => {
    it('special cases', () => {
        const randArr = [],
            sortedArr = [];
        mergeSort(randArr);
        expect(randArr).to.deep.equal(sortedArr);
    });
    it('string cases', () => {
        const randArr = [818, 942, 540, 519, 494, 888, 395, 279, 323, 393, 284, 930, 616, 85, 901,
                938, 3, 583, 660, 48, 112, 281, 487, 543, 822, 930, 266, 889, 94, 768, 19, 324, 643,
                212, 439, 389, 448, 748, 588, 822, 391, 368, 51, 763, 382, 726, 513, 731, 690, 244],
            sortedArr = [112, 19, 212, 244, 266, 279, 281, 284, 3, 323, 324, 368, 382, 389, 391,
                393, 395, 439, 448, 48, 487, 494, 51, 513, 519, 540, 543, 583, 588, 616, 643, 660, 690,
                726, 731, 748, 763, 768, 818, 822, 822, 85, 888, 889, 901, 930, 930, 938, 94, 942];
        mergeSort(randArr);
        expect(randArr).to.deep.equal(sortedArr);
    });
    it('number cases', () => {
        const randArr = [818, 942, 540, 519, 494, 888, 395, 279, 323, 393, 284, 930, 616, 85, 901,
                938, 3, 583, 660, 48, 112, 281, 487, 543, 822, 930, 266, 889, 94, 768, 19, 324, 643,
                212, 439, 389, 448, 748, 588, 822, 391, 368, 51, 763, 382, 726, 513, 731, 690, 244],
            sortedArr = [3, 19, 48, 51, 85, 94, 112, 212, 244, 266, 279, 281, 284, 323, 324, 368,
                382, 389, 391, 393, 395, 439, 448, 487, 494, 513, 519, 540, 543, 583, 588, 616, 643,
                660, 690, 726, 731, 748, 763, 768, 818, 822, 822, 888, 889, 901, 930, 930, 938, 942];
        mergeSort(randArr, (a, b) => a - b);
        expect(randArr).to.deep.equal(sortedArr);
    });
    it('number with negative cases', () => {
        const randArr = [34, 21, 0, 5, -1],
            sortedArr = [-1, 0, 5, 21, 34];
        mergeSort(randArr, (a, b) => a - b);
        expect(randArr).to.deep.equal(sortedArr);
    });
    it('number with decending cases', () => {
        const randArr = [34, 21, 0, 5, -1],
            sortedArr = [34, 21, 5, 0, -1];
        mergeSort(randArr, (a, b) => b - a);
        expect(randArr).to.deep.equal(sortedArr);
    });
    it('testing the stability', () => {
        const randArr = [
            [1, 1],
            [11, 6],
            [10, 2],
            [10, 3],
            [10, 4],
            [10, 5],
            ],
            sortedArr = [
            [1, 1],
            [10, 2],
            [10, 3],
            [10, 4],
            [10, 5],
            [11, 6],
            ];
        mergeSort(randArr, (a, b) => a[1] - b[1]);
        mergeSort(randArr, (a, b) => a[0] - b[0]);
        expect(randArr).to.deep.equal(sortedArr);
    });
});
