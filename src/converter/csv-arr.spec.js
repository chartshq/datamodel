/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import CSVArr from './csv-arr';

describe('CSVArr Converter', () => {
    describe('#CSVArr', () => {
        it('should parse the CSV array data with header names', () => {
            const data = [
            ['a', 'b', 'c'],
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            ];
            const option = {
                firstRowHeader: true
            };

            const parsedData = CSVArr(data, option);
            const expected = [['a', 'b', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the CSV array data without header names', () => {
            const data = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];
            const option = {
                firstRowHeader: false
            };

            const parsedData = CSVArr(data, option);
            const expected = [[], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the CSV array data with default options', () => {
            // With header names
            let data = [
                ['a', 'b', 'c'],
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];
            let parsedData = CSVArr(data);
            let expected = [['a', 'b', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];
            expect(parsedData).to.deep.equal(expected);

            // Without header names
            data = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];
            parsedData = CSVArr(data);
            expected = [[1, 2, 3], [[4, 7], [5, 8], [6, 9]]];
            expect(parsedData).to.deep.equal(expected);
        });
    });
});
