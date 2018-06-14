/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import crossProduct from './cross-product';
import DataTable from '../index';

const data1 = [
    { profit: 10, sales: 20, city: 'a' },
    { profit: 15, sales: 25, city: 'b' },
];
const schema1 = [
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    { name: 'city', type: 'dimension' },
];
const data2 = [
    { population: 200, city: 'a' },
    { population: 250, city: 'b' },
];
const schema2 = [
    { name: 'population', type: 'measure' },
    { name: 'city', type: 'dimension' },
];

describe('Checking crossProduct', () => {
    it('default crossProduct', () => {
        const dataTable1 = new DataTable(data1, schema1, 'TableA');
        const dataTable2 = new DataTable(data2, schema2, 'TableB');
        const crossDataTable = crossProduct(dataTable1, dataTable2);
        expect(crossDataTable.getData()).to.deep.equal({
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'TableA.city', type: 'dimension' },
                { name: 'population', type: 'measure' },
                { name: 'TableB.city', type: 'dimension' },
            ],
            data: [
                [10, 20, 'a', 200, 'a'],
                [10, 20, 'a', 250, 'b'],
                [15, 25, 'b', 200, 'a'],
                [15, 25, 'b', 250, 'b'],
            ],
            uids: [0, 1, 2, 3]
        });
    });
    it('crossProduct with filterFn', () => {
        const dataTable1 = new DataTable(data1, schema1, 'TableA');
        const dataTable2 = new DataTable(data2, schema2, 'TableB');
        const crossDataTable = crossProduct(dataTable1, dataTable2, obj => obj.TableA.city === obj.TableB.city, true);

        expect(crossDataTable.getData()).to.deep.equal({
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
                { name: 'population', type: 'measure' },
            ],
            data: [
                [10, 20, 'a', 200],
                [15, 25, 'b', 250],
            ],
            uids: [0, 1]
        });
    });
});
