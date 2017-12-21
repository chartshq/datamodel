/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { getFieldArr, getReducerObj, groupBy } from './group-by';
import DataTable from '../index';
import { defReducer, fnList } from './group-by-function';

const data1 = [
    { profit: 10, sales: 20, city: 'a', state: 'aa' },
    { profit: 15, sales: 25, city: 'b', state: 'bb' },
    { profit: 10, sales: 20, city: 'a', state: 'ab' },
    { profit: 15, sales: 25, city: 'b', state: 'ba' },
    ],
    schema1 = [
    { name: 'city', type: 'dimension' },
    { name: 'state', type: 'dimension' },
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    ];

describe('groupBy tests', () => {
    it('getFieldArr basic', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA'));
        expect(getFieldArr(dataTable1, ['city', 'state'])).to.deep.equal(['city', 'state']);
    });
    it('getFieldArr if no fields provided', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA'));
        expect(getFieldArr(dataTable1)).to.deep.equal(['city', 'state']);
    });
    it('getFieldArr if wrong fields provided', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA'));
        expect(getFieldArr(dataTable1, ['city', 'state', 'abc', 'profit'])).to
                        .deep.equal(['city', 'state']);
    });
    it('getReducerObj basic', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA'));
        expect(getReducerObj(dataTable1)).to.deep.equal({
            profit: defReducer,
            sales: defReducer,
        });
    });
    it('getReducerObj spl case no function provide', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA'));
        expect(getReducerObj(dataTable1, {})).to.deep.equal({
            profit: defReducer,
            sales: defReducer,
        });
    });
    it('getReducerObj when function is provided', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA'));
        /**
         * sample function
         * @return {number} 0
         */
        function abc() { return 0; }
        expect(getReducerObj(dataTable1, {
            profit: 'sum',
            sales: abc,
        })).to.deep.equal({
            profit: fnList.sum,
            sales: abc,
        });
    });
    it('groupby functionality', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA')),
            reqData = {
                schema: [
                { name: 'city', type: 'dimension' },
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                ],
                data: [
                ['a', 20, 40],
                ['b', 30, 50],
                ],
            },
            compData = groupBy(dataTable1, ['city']).getData();
        expect(compData).to.deep.equal(reqData);
    });
});
