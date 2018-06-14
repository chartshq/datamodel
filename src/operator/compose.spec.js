/* global describe, it */
/* eslint-disable no-unused-expressions,no-unused-vars */
import { expect } from 'chai';
import DataTable from '../datatable';
import { compose, columnFilter, rowFilter, groupby, bin } from './compose';

describe('Testing compose functionlity', () => {
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

    it('Should returm same data when composed with only one function', () => {
        const dataTable = new DataTable(data1, schema1);
        const dataTable2 = new DataTable(data1, schema1);
        let composedFn = compose(
            rowFilter(fields => fields.profit.value <= 15),

        );
        let normalDt = dataTable.select(fields => fields.profit.value <= 15);
        let composedDt = composedFn(dataTable2);
        expect(normalDt.getData()).to.deep.equal(composedDt.getData());
    });
    it('Should returm same data when composed with select and project function', () => {
        const dataTable = new DataTable(data1, schema1);
        const dataTable2 = new DataTable(data1, schema1);
        let composedFn = compose(
            rowFilter(fields => fields.profit.value <= 15),
            columnFilter(['profit', 'sales'])
        );

        let normalDt = dataTable.select(fields => fields.profit.value <= 15);
        normalDt = normalDt.project(['profit', 'sales']);
        let composedDt = composedFn(dataTable2);
        expect(normalDt.getData()).to.deep.equal(composedDt.getData());
    });
    it('Should returm same data when composed with select and project and groupby function', () => {
        const dataTable = new DataTable(data1, schema1);
        const dataTable2 = new DataTable(data1, schema1);
        let composedFn = compose(
            rowFilter(fields => fields.profit.value <= 15),
            columnFilter(['profit', 'sales']),
            groupby(['profit'])
        );

        let normalDt = dataTable.select(fields => fields.profit.value <= 15);
        normalDt = normalDt.project(['profit', 'sales']);
        normalDt = normalDt.groupBy(['profit']);
        let composedDt = composedFn(dataTable2);
        // debugger;
        expect(normalDt.getData()).to.deep.equal(composedDt.getData());
    });
    it('Should compose bin', () => {
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
        const toBinDatatable = new DataTable(toBinData, toBinSchema);
        const toBinDatatable2 = new DataTable(toBinData, toBinSchema);
        const buckets = [
            { end: 1, label: 'useless' },
            { start: 1, end: 4, label: 'failure' },
            { start: 4, end: 6, label: 'firstclass' },
            { start: 6, end: 10, label: 'decent' }
        ];

        let binnedDT = toBinDatatable.createBin('marks', {
            buckets,
        }, 'rating1');

        let composedFn = compose(
           bin('marks', {
               buckets,
           }, 'rating1'),

        );

        let composedDt = composedFn(toBinDatatable2);
        expect(binnedDT.getData()).to.deep.equal(composedDt.getData());
    });
    it('Should compose bin and select', () => {
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
        const toBinDatatable = new DataTable(toBinData, toBinSchema);
        const toBinDatatable2 = new DataTable(toBinData, toBinSchema);
        const buckets = [
            { end: 1, label: 'useless' },
            { start: 1, end: 4, label: 'failure' },
            { start: 4, end: 6, label: 'firstclass' },
            { start: 6, end: 10, label: 'decent' }
        ];

        let binnedDT = toBinDatatable.createBin('marks', {
            buckets,
        }, 'rating1');
        let selectedBin = binnedDT.select(fields => fields.rating1.value === 'failure');
        let composedFn = compose(
           bin('marks', {
               buckets,
           }, 'rating1'),
           rowFilter(fields => fields.rating1.value === 'failure')
        );
        let composedDt = composedFn(toBinDatatable2);
        expect(selectedBin.getData()).to.deep.equal(composedDt.getData());
    });
});
