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
            ],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '0-2,4', 'profit,sales,city'),
            oriObj = {
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
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for normal case with row filteration and rowWise data', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
            ],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '0-2,4', 'profit,sales,city',
            undefined, { rowWise: true }),
            oriObj = {
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
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for special case with blank data', () => {
        const data = [],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '', 'profit,sales,city'),
            oriObj = {
                schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
                ],
                data: [],
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for special case with blank data and blank schema', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
            ],
            schema = [],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '', ''),
            oriObj = {
                schema: [],
                data: [],
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for normal case with column filteration', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
            ],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '0-2,4', 'sales,city'),
            oriObj = {
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
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for all data', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
            ],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '0-5', 'profit,sales,city'),
            oriObj = {
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
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for no data', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
            ],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '', 'profit,sales,city'),
            oriObj = {
                schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
                ],
                data: [],
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking for schama order changed', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
            ],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '0-5', 'city,profit,sales'),
            oriObj = {
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
            };
        expect(expObj).to.deep.equal(oriObj);
    });
    it('Checking if order of rowDiffset is not right', () => {
        const data = [
            [10, 15, 7, 9, 20, 35],
            [20, 25, 8, 40, 77, 9],
            ['a', 'b', 'c', 'd', 'e', 'f'],
            ],
            schema = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            fieldsArr = createFields(data, schema),
            expObj = dataBuilder(fieldsArr, '5-0', 'profit,sales,city'),
            oriObj = {
                schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
                ],
                data: [],
            };
        expect(expObj).to.deep.equal(oriObj);
    });
});
