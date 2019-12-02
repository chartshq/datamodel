/* global describe, it ,beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import JSONConverter from './jsonConverter';

describe('JSON Converter', () => {
    let data;
    let converter = new JSONConverter();
    beforeEach(() => {
        data = [
            {
                a: 1,
                b: 2,
                c: 3
            },
            {
                a: 4,
                b: 5,
                c: 6
            },
            {
                a: 7,
                b: 8,
                c: 9
            }
        ];
    });

    describe('#JSON', () => {
        it('should convert to JSON data', () => {
            const schema = [
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

            const parsedData = converter.convert(data, schema);
            const expected = [['a', 'b', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];

            expect(parsedData).to.deep.equal(expected);
        });
    });
});
