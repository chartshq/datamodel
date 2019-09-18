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

        it('should parse data with only the fields present in schema', () => {
            let schema = [
                {
                    name: 'a',
                    type: 'measure',
                    subtype: 'continuous'
                }
            ];
            let parsedData = FlatJSON(data, schema);
            let expected = [['a'], [[1, 4, 7]]];
            expect(parsedData).to.deep.equal(expected);
        });

        it(`should parse data with only the fields present in schema
        but different order from data`, () => {
            const schema = [
                {
                    name: 'b',
                    type: 'measure',
                    subtype: 'continuous'
                },
                {
                    name: 'a',
                    type: 'measure',
                    subtype: 'continuous'
                }
            ];

            const parsedData = FlatJSON(data, schema);
            let expected = [['b', 'a'], [[2, 5, 8], [1, 4, 7]]];

            expect(parsedData).to.deep.equal(expected);
        });

        it('should parse data with extra fields in schema', () => {
            let schema = [
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
                    name: 'd',
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
            const expected = [['a', 'b', 'd', 'c'], [[1, 4, 7], [2, 5, 8], [undefined, undefined, undefined], [3, 6, 9]]];

            expect(parsedData).to.deep.equal(expected);
        });

        it(`should parse data with only the fields present in schema
            with extra fields from headers and shuffled order`, () => {
                let schema1 = [
                    {
                        name: 'd',
                        type: 'measure',
                        subtype: 'continuous'
                    }, {
                        name: 'a',
                        type: 'measure',
                        subtype: 'continuous'
                    }
                ];

                const parsedData = FlatJSON(data, schema1);
                const expected = [['d', 'a'], [[undefined, undefined, undefined], [1, 4, 7]]];

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
