/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { union } from './union';
import DataModel from '../index';
import { IdValue } from '../fields/parsers/id-parser';

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

describe('Testing union', () => {
    describe('#union', () => {
        it('should perform basic union', () => {
            const dataModel1 = (new DataModel(data1, schema1, { name: 'ModelA' })).project(['city', 'state']);
            const dataModel2 = (new DataModel(data2, schema2, { name: 'ModelB' })).project(['city', 'state']);
            const unionDataModel = union(dataModel1, dataModel2);
            expect(unionDataModel.getData()).to.deep.equal({
                schema: [
                { name: 'city', type: 'dimension', subtype: 'categorical' },
                { name: 'state', type: 'dimension', subtype: 'categorical' },
                ],
                data: [
                ['a', 'aa'],
                ['b', 'bb'],
                ['a', 'ab'],
                ['b', 'ba'],
                ],
                uids: [0, 1, 2, 3].map(id => new IdValue(id))
            });
        });
        it('should not perform union if fields are not same', () => {
            const dataModel1 = (new DataModel(data1, schema1, { name: 'ModelA' })).project(['city', 'state']);
            const dataModel2 = (new DataModel(data2, schema2, { name: 'ModelB' })).project(['city', 'profit']);
            const unionDataModel = union(dataModel1, dataModel2);
            expect(unionDataModel).to.equal(null);
        });
    });
});
