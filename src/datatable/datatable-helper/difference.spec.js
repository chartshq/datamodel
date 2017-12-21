/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import difference from './difference';
import DataTable from '../index';

const data1 = [
    { profit: 10, sales: 20, city: 'a', state: 'aa' },
    { profit: 15, sales: 25, city: 'b', state: 'bb' },
    { profit: 10, sales: 20, city: 'a', state: 'ab' },
    { profit: 15, sales: 25, city: 'b', state: 'ba' },
    ],
    schema1 = [
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    { name: 'city', type: 'dimension' },
    { name: 'state', type: 'dimension' },
    ],
    data2 = [
    { profit: 10, sales: 20, city: 'a', state: 'ab' },
    { profit: 15, sales: 25, city: 'b', state: 'ba' },
    { profit: 10, sales: 20, city: 'a', state: 'ala' },
    { profit: 15, sales: 25, city: 'b', state: 'baa' },
    ],
    schema2 = [
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    { name: 'city', type: 'dimension' },
    { name: 'state', type: 'dimension' },
    ];

describe('Checking difference', () => {
    it('Basic difference test cases', () => {
        const dataTable1 = (new DataTable(data1, schema1, 'TableA')).project('city,state'),
            dataTable2 = (new DataTable(data2, schema2, 'TableB')).project('city,state'),
            differenceDataTable = difference(dataTable1, dataTable2);
        expect(differenceDataTable.getData()).to.deep.equal({
            schema: [
                { name: 'city', type: 'dimension' },
                { name: 'state', type: 'dimension' },
            ],
            data: [
                ['a', 'aa'],
                ['b', 'bb'],
            ],
        });
    });
});