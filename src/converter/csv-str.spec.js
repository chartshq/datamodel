/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import CSVStr from './csv-str';

describe('CSVStr Converter', () => {
    describe('#CSVArr()', () => {
        it('should parse the CSV string data with header names', () => {
            const data = 'a,b,c\n1,2,3\n4,5,6\n7,8,9';
            const option = {
                firstRowHeader: true,
                fieldSeparator: ',',
                lineSeparator: '\n'
            };

            const parsedData = CSVStr(data, option);
            const expected = [['a', 'b', 'c'], [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the CSV string data without header names', () => {
            const data = '1,2,3\n4,5,6\n7,8,9';
            const option = {
                firstRowHeader: false,
                fieldSeparator: ',',
                lineSeparator: '\n'
            };

            const parsedData = CSVStr(data, option);
            const expected = [[], [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the CSV string data with custom options', () => {
            const data = 'a.b.c 1.2.3 4.5.6 7.8.9';
            const option = {
                firstRowHeader: true,
                fieldSeparator: '.',
                lineSeparator: ' '
            };

            const parsedData = CSVStr(data, option);
            const expected = [['a', 'b', 'c'], [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the CSV string data with default options', () => {
        // With header names
            let data = 'a,b,c\n1,2,3\n4,5,6\n7,8,9';
            let parsedData = CSVStr(data);
            let expected = [['a', 'b', 'c'], [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]];
            expect(parsedData).to.deep.equal(expected);

        // Without header names
            data = '1,2,3\n4,5,6\n7,8,9';
            parsedData = CSVStr(data);
            expected = [['1', '2', '3'], [['4', '7'], ['5', '8'], ['6', '9']]];
            expect(parsedData).to.deep.equal(expected);
        });
    });
});
