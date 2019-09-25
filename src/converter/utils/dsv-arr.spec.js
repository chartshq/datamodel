/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DSVArr from './dsv-arr';

describe('DSVArr Converter', () => {
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
    describe('#DSVArr', () => {
        let data;
        beforeEach(() => {
            data = [
                ['a', 'b', 'c'],
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ];
        });
        describe('header is present', () => {
            it('should parse data with default options', () => {
                const parsedData = DSVArr(data, schema);
                const expected = [['a', 'b', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];
                expect(parsedData).to.deep.equal(expected);
            });

            it('should parse data with given options', () => {
                const option = {
                    firstRowHeader: true
                };

                const parsedData = DSVArr(data, schema, option);
                const expected = [['a', 'b', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];
                expect(parsedData).to.deep.equal(expected);
            });

            it('should parse data with only the fields present in schema', () => {
                schema = [
                    {
                        name: 'a',
                        type: 'measure',
                        subtype: 'continuous'
                    }
                ];
                let parsedData = DSVArr(data, schema);
                let expected = [['a'], [[1, 4, 7]]];
                expect(parsedData).to.deep.equal(expected);
            });

            it(`should parse data with only the fields present in schema
            but different order from data`, () => {
                schema = [
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
                let parsedData = DSVArr(data, schema);
                let expected = [['b', 'a'], [[2, 5, 8], [1, 4, 7]]];
                expect(parsedData).to.deep.equal(expected);
            });

            it('should parse data with extra fields in schema', () => {
                let schema1 = [
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

                const parsedData = DSVArr(data, schema1);
                const expected = [['a', 'b', 'd', 'c'], [[1, 4, 7], [2, 5, 8],
                [undefined, undefined, undefined], [3, 6, 9]]];
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

                const parsedData = DSVArr(data, schema1);
                const expected = [['d', 'a'], [[undefined, undefined, undefined], [1, 4, 7]]];
                expect(parsedData).to.deep.equal(expected);
            });

            it('should parse data with no fields in schema', () => {
                let schema1 = [];

                const parsedData = DSVArr(data, schema1);
                const expected = [[], []];
                expect(parsedData).to.deep.equal(expected);
            });

            it('should throw error if schema is not an array', () => {
                const mockedparsedDataFn = () => DSVArr(data, 'schema');

                expect(mockedparsedDataFn).to.throw('Schema missing or is in an unsupported format');
            });
        });
        describe('header is not present', () => {
            beforeEach(() => {
                data = [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ];
            });
            it('should parse data without header names', () => {
                const option = {
                    firstRowHeader: false
                };

                const parsedData = DSVArr(data, schema, option);
                const expected = [['a', 'b', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]];

                expect(parsedData).to.deep.equal(expected);
            });

            it('should parse data with only the fields present in schema', () => {
                const option = {
                    firstRowHeader: false
                };
                schema = [
                    {
                        name: 'a',
                        type: 'measure',
                        subtype: 'continuous'
                    }
                ];
                let parsedData = DSVArr(data, schema, option);
                let expected = [['a'], [[1, 4, 7]]];
                expect(parsedData).to.deep.equal(expected);
            });

            it('should parse data with extra fields in schema', () => {
                const schema1 = [
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
                const option = {
                    firstRowHeader: false
                };

                const parsedData = DSVArr(data, schema1, option);
                const expected = [['a', 'b', 'd', 'c'], [[1, 4, 7], [2, 5, 8], [3, 6, 9],
                [undefined, undefined, undefined]]];

                expect(parsedData).to.eql(expected);
            });

            it('should parse data with no fields in schema', () => {
                const schema1 = [];
                const option = {
                    firstRowHeader: false
                };

                const parsedData = DSVArr(data, schema1, option);
                const expected = [[], []];

                expect(parsedData).to.deep.equal(expected);
            });

            it('should throw error if schema is not an array', () => {
                const option = {
                    firstRowHeader: false
                };
                const mockedparsedDataFn = () => DSVArr(data, 'schema', option);

                expect(mockedparsedDataFn).to.throw('Schema missing or is in an unsupported format');
            });
        });
    });
});
