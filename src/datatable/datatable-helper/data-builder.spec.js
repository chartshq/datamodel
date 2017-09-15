/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import dataBuilder from './data-builder';
import createFields from '../create-fields';

describe('Checking dataBuilder', () => {
    it('Checking for normal case with row filteration', () => {
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
        const expArr = dataBuilder(fieldsArr, '0-2,4', 'profit,sales,city');
        const oriArr = [
            [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            [10, 20, 'a'],
            [15, 25, 'b'],
            [7, 8, 'c'],
            [20, 77, 'e'],
        ];
        expect(expArr).to.deep.equal(oriArr);
    });
    it('Checking for normal case with column filteration', () => {
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
        const expArr = dataBuilder(fieldsArr, '0-2,4', 'sales,city');
        const oriArr = [
            [
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            [20, 'a'],
            [25, 'b'],
            [8, 'c'],
            [77, 'e'],
        ];
        expect(expArr).to.deep.equal(oriArr);
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
        const expArr = dataBuilder(fieldsArr, '0-5', 'profit,sales,city');
        const oriArr = [
            [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            [10, 20, 'a'],
            [15, 25, 'b'],
            [7, 8, 'c'],
            [9, 40, 'd'],
            [20, 77, 'e'],
            [35, 9, 'f'],
        ];
        expect(expArr).to.deep.equal(oriArr);
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
        const expArr = dataBuilder(fieldsArr, '', 'profit,sales,city');
        const oriArr = [
            [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
            [10, 20, 'a'],
        ];
        expect(expArr).to.deep.equal(oriArr);
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
        const expArr = dataBuilder(fieldsArr, '0-5', 'city,profit,sales');
        const oriArr = [
            [
                { name: 'city', type: 'dimension' },
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
            ],
            ['a', 10, 20],
            ['b', 15, 25],
            ['c', 7, 8],
            ['d', 9, 40],
            ['e', 20, 77],
            ['f', 35, 9],
        ];
        expect(expArr).to.deep.equal(oriArr);
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
        const expArr = dataBuilder(fieldsArr, '5-0', 'profit,sales,city');
        const oriArr = [
            [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
            ],
        ];
        expect(expArr).to.deep.equal(oriArr);
    });
});
