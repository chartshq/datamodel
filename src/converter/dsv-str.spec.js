/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DSVStr from './dsv-str';

describe('DSVStr Converter', () => {
    let schema;
    beforeEach(() => {
        schema = [
            {
                name: 'a',
                type: 'measure',
                subtype: 'continuous'
            },
            {
                name: 'b',
                type: 'measure',
                subtype: 'continuous'
            },
            {
                name: 'c',
                type: 'measure',
                subtype: 'continuous'
            }
        ];
    });
    describe('#DSVStr', () => {
        it('should parse the DSV string data with header names', () => {
            const data = 'a,b,c\n1,2,3\n4,5,6\n7,8,9';
            const option = {
                firstRowHeader: true,
                fieldSeparator: ','
            };

            const parsedData = DSVStr(data, schema, option);
            const expected = [['a', 'b', 'c'], [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the DSV string data without header names', () => {
            const data = '1,2,3\n4,5,6\n7,8,9';
            const option = {
                firstRowHeader: false,
                fieldSeparator: ','
            };

            const parsedData = DSVStr(data, [], option);
            const expected = [[], []];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the DSV string data with custom options', () => {
            const data = 'a|b|c\n1|2|3\n4|5|6\n7|8|9';
            const option = {
                firstRowHeader: true,
                fieldSeparator: '|'
            };

            const parsedData = DSVStr(data, schema, option);
            const expected = [['a', 'b', 'c'], [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse the DSV string data with default options', () => {
            // With header names
            let data = 'a,b,c\n1,2,3\n4,5,6\n7,8,9';
            let parsedData = DSVStr(data, schema);
            let expected = [['a', 'b', 'c'], [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]];
            expect(parsedData).to.deep.equal(expected);

            // Without header names
            data = '1,2,3\n4,5,6\n7,8,9';
            const mockedFn = () => DSVStr(data);

            expect(mockedFn).to.throw('Schema missing or is in an unsupported format');
        });
    });
});
