/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { union } from './union';
import DataTable from '../index';

const data1 = [
    { profit: 10, sales: 20, city: 'a', state: 'aa' },
    { profit: 15, sales: 25, city: 'b', state: 'bb' },
];
const schema1 = [
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    { name: 'city', type: 'dimension' },
    { name: 'state', type: 'dimension' },
];
const data2 = [
    { profit: 10, sales: 20, city: 'a', state: 'ab' },
    { profit: 15, sales: 25, city: 'b', state: 'ba' },
];
const schema2 = [
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    { name: 'city', type: 'dimension' },
    { name: 'state', type: 'dimension' },
];

describe('Checking union', () => {
    it('Basic union test cases', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA')).project(['city', 'state']);
        const dataTable2 = (new DataTable(data2, schema2, 'TableB')).project(['city', 'state']);
        const unionDataTable = union(dataTable1, dataTable2);
        expect(unionDataTable.getData()).to.deep.equal({
            schema: [
                { name: 'city', type: 'dimension' },
                { name: 'state', type: 'dimension' },
            ],
            data: [
                ['a', 'aa'],
                ['b', 'bb'],
                ['a', 'ab'],
                ['b', 'ba'],
            ],
            uids: [0, 1, 2, 3]
        });
    });
    it('union if fields are not same', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA')).project(['city', 'state']);
        const dataTable2 = (new DataTable(data2, schema2, 'TableB')).project(['city', 'profit']);
        const unionDataTable = union(dataTable1, dataTable2);
        expect(unionDataTable.getData()).to.deep.equal(dataTable1.getData());
    });
});
