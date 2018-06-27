/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { dataBuilder } from './data-builder';
import createFields from '../create-fields';

describe('Checking dataBuilder', () => {
    it('Checking for normal case with row filter', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '0-2,4', 'profit,sales,city');
        const oriObj = {
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            data: [
                [10, 20, 'a'],
                [15, 25, 'b'],
                [7, 8, 'c'],
                [20, 77, 'e'],
            ],
            uids: [0, 1, 2, 4]
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for normal case with row filter and rowWise data', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '0-2,4', 'profit,sales,city', undefined, { rowWise: true });
        const oriObj = {
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            data: [
                [10, 15, 7, 20],
                [20, 25, 8, 77],
                ['a', 'b', 'c', 'e'],
            ],
            uids: [0, 1, 2, 4]
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for special case with blank data', () => {
        const data = [];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '', 'profit,sales,city');
        const oriObj = {
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            data: [],
            uids: []
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for special case with blank data and blank schema', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '', '');
        const oriObj = {
            schema: [],
            data: [],
            uids: []
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for normal case with column filter', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '0-2,4', 'sales,city');
        const oriObj = {
            schema: [
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            data: [
                [20, 'a'],
                [25, 'b'],
                [8, 'c'],
                [77, 'e'],
            ],
            uids: [0, 1, 2, 4]
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for all data', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '0-5', 'profit,sales,city');
        const oriObj = {
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            data: [
                [10, 20, 'a'],
                [15, 25, 'b'],
                [7, 8, 'c'],
                [9, 40, 'd'],
                [20, 77, 'e'],
                [35, 9, 'f'],
            ],
            uids: [0, 1, 2, 3, 4, 5]
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for no data', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '', 'profit,sales,city');
        const oriObj = {
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            data: [],
            uids: []
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for schama order changed', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '0-5', 'city,profit,sales');
        const oriObj = {
            schema: [
                { name: 'city', type: 'dimension' },
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
            ],
            data: [
                ['a', 10, 20],
                ['b', 15, 25],
                ['c', 7, 8],
                ['d', 9, 40],
                ['e', 20, 77],
                ['f', 35, 9],
            ],
            uids: [0, 1, 2, 3, 4, 5]
        };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking if order of rowDiffset is not right', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
        ];
        const schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        const expObj = dataBuilder(fieldsArr, '5-0', 'profit,sales,city');
        const oriObj = {
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            data: [],
            uids: []
        };
        expect(expObj).to.deep.equal(oriObj);
    });
});
