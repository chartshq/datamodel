/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import FlatJSON from './flat-json';

describe('FlatJSON Converter', () => {
    let data;
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

    describe('#FlatJSON', () => {
        it('should parse the JSON data', () => {
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

            const parsedData = FlatJSON(data, schema);
            const expected = [['a', 'b', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should handle the empty JSON data', () => {
            data = [];
            const schema = [];

            const parsedData = FlatJSON(data, schema);
            const expected = [[], []];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should handle return empty JSON data when supplied schema is an empty array', () => {
            const schema = [];

            const parsedData = FlatJSON(data, schema);
            const expected = [[], []];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should throw error if schema is not an array', () => {
            const mockedparsedDataFn = () => FlatJSON(data, 'schema');

            expect(mockedparsedDataFn).to.throw('Schema missing or is in an unsupported format');
        });
    });
});
