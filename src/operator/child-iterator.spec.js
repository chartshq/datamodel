/* global describe, it */
/* eslint-disable no-unused-expressions,no-unused-vars */

import { expect } from 'chai';
import { calculatedMeasureIterator } from './child-iterator';
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

describe('Testing Child Iterator', () => {
    let dt = new DataTable(data1, schema1);
    let createdCallBack = (profit, sales) => profit / sales;
    let hasSameChild = false;
    let hasSameFunction = false;
    const child = dt.calculateVariable({
        name: 'Efficiency'
    }, ['profit', 'sales', createdCallBack]);

    let callback = function(table, params) {
        if (dt.children.find(childElm => childElm === table)) {
            hasSameChild = true;
        }
        if (params.callback === createdCallBack) {
            hasSameFunction = true;
        }
    };
    it('Should return expected child and its callback', () => {
        calculatedMeasureIterator(dt, callback);
        expect(hasSameChild).to.equal(true);
        expect(hasSameFunction).to.equal(true);
    });
});
