/* global describe, it */
/* eslint-disable no-unused-expressions,no-unused-vars */
import { expect } from 'chai';
import DataModel from '../datamodel';
import { compose, columnFilter, rowFilter, groupby, bin } from './compose';

describe('Testing compose functionality', () => {
    const data1 = [
        { id: 1, profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
        { id: 2, profit: 20, sales: 25, first: 'Hey', second: 'Wood' },
        { id: 3, profit: 10, sales: 20, first: 'White', second: 'the sun' },
        { id: 4, profit: 15, sales: 25, first: 'White', second: 'walls' },
    ];
    const data2 = [
        { id: 1, netprofit: 100, netsales: 200, _first: 'Hello', _second: 'Jude' },
        { id: 4, netprofit: 200, netsales: 250, _first: 'Bollo', _second: 'Wood' },

    ];

    const schema1 = [
        {
            name: 'id',
            type: 'dimention'
        },
        {
            name: 'profit',
            type: 'measure',
            defAggFn: 'avg'
        },
        {
            name: 'sales',
            type: 'measure'
        },
        {
            name: 'first',
            type: 'dimension'
        },
        {
            name: 'second',
            type: 'dimension'
        },
    ];
    const schema2 = [
        {
            name: 'id',
            type: 'dimention'
        },
        {
            name: 'netprofit',
            type: 'measure',
            defAggFn: 'avg'
        },
        {
            name: 'netsales',
            type: 'measure'
        },
        {
            name: '_first',
            type: 'dimension'
        },
        {
            name: '_second',
            type: 'dimension'
        },
    ];
    describe('#compose()', () => {
        it('should returm same data when composed with only one function', () => {
            const dataModel = new DataModel(data1, schema1);
            const dataModel2 = new DataModel(data1, schema1);
            let composedFn = compose(
            rowFilter(fields => fields.profit.value <= 15),

        );
            let normalDm = dataModel.select(fields => fields.profit.value <= 15);
            let composedDm = composedFn(dataModel2);
            expect(normalDm.getData()).to.deep.equal(composedDm.getData());
        });
        it('should returm same data when composed with select and project function', () => {
            const dataModel = new DataModel(data1, schema1);
            const dataModel2 = new DataModel(data1, schema1);
            let composedFn = compose(
            rowFilter(fields => fields.profit.value <= 15),
            columnFilter(['profit', 'sales'])
        );

            let normalDm = dataModel.select(fields => fields.profit.value <= 15);
            normalDm = normalDm.project(['profit', 'sales']);
            let composedDm = composedFn(dataModel2);
            expect(normalDm.getData()).to.deep.equal(composedDm.getData());
        });
        it('should returm same data when composed with select and project and groupby function', () => {
            const dataModel = new DataModel(data1, schema1);
            const dataModel2 = new DataModel(data1, schema1);
            let composedFn = compose(
            rowFilter(fields => fields.profit.value <= 15),
            columnFilter(['profit', 'sales']),
            groupby(['profit'])
        );

            let normalDm = dataModel.select(fields => fields.profit.value <= 15);
            normalDm = normalDm.project(['profit', 'sales']);
            normalDm = normalDm.groupBy(['profit']);
            let composedDm = composedFn(dataModel2);
        // debugger;
            expect(normalDm.getData()).to.deep.equal(composedDm.getData());
        });
        it('should compose bin', () => {
            const toBinData = [{
                marks: 1,
            }, {
                marks: 2,
            }, {
                marks: 3,
            }, {
                marks: 4,
            }, {
                marks: 5,
            }, {
                marks: 9,
            }];
            const toBinSchema = [{
                name: 'marks',
                type: 'measure'
            }];
            const toBinDataModel = new DataModel(toBinData, toBinSchema);
            const toBinDataModel2 = new DataModel(toBinData, toBinSchema);
            const buckets = [
            { end: 1, label: 'useless' },
            { start: 1, end: 4, label: 'failure' },
            { start: 4, end: 6, label: 'firstclass' },
            { start: 6, end: 10, label: 'decent' }
            ];

            let binnedDM = toBinDataModel.createBin('marks', {
                buckets,
            }, 'rating1');

            let composedFn = compose(
           bin('marks', {
               buckets,
           }, 'rating1'),

        );

            let composedDm = composedFn(toBinDataModel2);
            expect(binnedDM.getData()).to.deep.equal(composedDm.getData());
        });
        it('should compose bin and select', () => {
            const toBinData = [{
                marks: 1,
            }, {
                marks: 2,
            }, {
                marks: 3,
            }, {
                marks: 4,
            }, {
                marks: 5,
            }, {
                marks: 9,
            }];
            const toBinSchema = [{
                name: 'marks',
                type: 'measure'
            }];
            const toBinDataModel = new DataModel(toBinData, toBinSchema);
            const toBinDataModel2 = new DataModel(toBinData, toBinSchema);
            const buckets = [
            { end: 1, label: 'useless' },
            { start: 1, end: 4, label: 'failure' },
            { start: 4, end: 6, label: 'firstclass' },
            { start: 6, end: 10, label: 'decent' }
            ];

            let binnedDM = toBinDataModel.createBin('marks', {
                buckets,
            }, 'rating1');
            let selectedBin = binnedDM.select(fields => fields.rating1.value === 'failure');
            let composedFn = compose(
           bin('marks', {
               buckets,
           }, 'rating1'),
           rowFilter(fields => fields.rating1.value === 'failure')
        );
            let composedDm = composedFn(toBinDataModel2);
            expect(selectedBin.getData()).to.deep.equal(composedDm.getData());
        });
    });
});
