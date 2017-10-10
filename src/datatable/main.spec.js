/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DataTable from './main';

describe('DataTable functionality', () => {
    it('Clone functionality', () => {
        const data = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const dataTable = new DataTable(data, schema);
        dataTable.colIdentifier = '1-20';
        dataTable.rowDiffset = 'a, aaa, aaaa';
        const cloneRelation = dataTable.clone();
        expect(cloneRelation instanceof DataTable).to.be.true;
        // Check clone dataTable have all the required attribute
        expect(cloneRelation.colIdentifier).to.equal('1-20');
        expect(cloneRelation.rowDiffset).to.equal('a, aaa, aaaa');
    });
    it('Projection functionality', () => {
        const data = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const dataTable = new DataTable(data, schema);
        const projectedDataTable = dataTable.project('aaaa,a');
        const expData = {
            schema: [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
            ],
            data: [
                ['d', 10],
                ['demo', 15],
            ],
        };
        // check project is not applied on the same DataTable
        expect(dataTable === projectedDataTable).to.be.false;
        // Check The return data
        expect(projectedDataTable.getData()).to.deep.equal(expData);
    });
    it('Selection functionality', () => {
        const data = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
            { a: 9, aaa: 35, aaaa: 'demo' },
            { a: 7, aaa: 15, aaaa: 'demo' },
            { a: 35, aaa: 5, aaaa: 'demo' },
            { a: 10, aaa: 10, aaaa: 'demoo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const dataTable = new DataTable(data, schema);
        const projectedDataTable = (dataTable.project('aaaa,a')).select((fields, i) =>
        fields[0].data[i] <= 10 && fields[2].data[i] === 'demo');
        const expData = {
            schema: [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
            ],
            data: [
                ['demo', 9],
                ['demo', 7],
            ],
        };
        // check project is not applied on the same DataTable
        expect(dataTable === projectedDataTable).to.be.false;
        expect(projectedDataTable.rowDiffset).to.equal('2-3');
        // Check The return data
        expect(projectedDataTable.getData()).to.deep.equal(expData);
    });
    it('Selection functionality extreme', () => {
        const data = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
            { a: 9, aaa: 35, aaaa: 'demo' },
            { a: 7, aaa: 15, aaaa: 'demoo' },
            { a: 35, aaa: 5, aaaa: 'demo' },
            { a: 10, aaa: 10, aaaa: 'demo' },
            { a: 10, aaa: 5, aaaa: 'demo' },
            { a: 10, aaa: 10, aaaa: 'demo' },
            { a: 10, aaa: 10, aaaa: 'demoo' },
            { a: 10, aaa: 10, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const dataTable = new DataTable(data, schema);
        const projectedDataTable = (dataTable.project('aaaa,a')).select((fields, i) =>
        fields[2].data[i] === 'demo');
        let expData = {
            schema: [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
            ],
            data: [
                ['demo', 15],
                ['demo', 9],
                ['demo', 35],
                ['demo', 10],
                ['demo', 10],
                ['demo', 10],
                ['demo', 10],
            ],
        };
        // check project is not applied on the same DataTable
        expect(dataTable === projectedDataTable).to.be.false;
        expect(projectedDataTable.rowDiffset).to.equal('1-2,4-7,9');
        // Check The return data
        expect(projectedDataTable.getData()).to.deep.equal(expData);

        // Check if repetation select works
        const projectedDataTable1 = projectedDataTable.select((fields, i) =>
        fields[0].data[i] === 10);
        expData = {
            schema: [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
            ],
            data: [
                ['demo', 10],
                ['demo', 10],
                ['demo', 10],
                ['demo', 10],
            ],
        };
        expect(projectedDataTable1.rowDiffset).to.equal('5-7,9');
        // Check The return data
        expect(projectedDataTable1.getData()).to.deep.equal(expData);
    });
    it('Rename functionality', () => {
        const data = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
            { a: 9, aaa: 35, aaaa: 'demo' },
            { a: 7, aaa: 15, aaaa: 'demo' },
            { a: 35, aaa: 5, aaaa: 'demo' },
            { a: 10, aaa: 10, aaaa: 'demoo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const dataTable = new DataTable(data, schema);
        const renameDataTable = dataTable.rename({ aaa: 'aaaRename' });
        const expData = {
            schema: [
                { name: 'a', type: 'measure' },
                { name: 'aaaRename', type: 'measure' },
                { name: 'aaaa', type: 'dimension' },
            ],
            data: [
                [10, 20, 'd'],
                [15, 25, 'demo'],
                [9, 35, 'demo'],
                [7, 15, 'demo'],
                [35, 5, 'demo'],
                [10, 10, 'demoo'],
            ],
        };
        expect(renameDataTable.getData()).to.deep.equal(expData);
    });
    it('join functionality', () => {
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
        const dataTable1 = new DataTable(data1, schema1, 'TableA');
        const dataTable2 = new DataTable(data2, schema2, 'TableB');
        expect((dataTable1.join(dataTable2)).getData()).to.deep.equal({
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
        });
        expect((dataTable1.join(dataTable2, obj => obj.TableA.city === obj.TableB.city))
        .getData()).to.deep.equal({
            schema: [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'TableA.city', type: 'dimension' },
                { name: 'population', type: 'measure' },
                { name: 'TableB.city', type: 'dimension' },
            ],
            data: [
                [10, 20, 'a', 200, 'a'],
                [15, 25, 'b', 250, 'b'],
            ],
        });
        expect((dataTable1.naturalJoin(dataTable2)).getData()).to.deep.equal({
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
        });
    });
    it('difference and union functionality', () => {
        const data1 = [
            { profit: 10, sales: 20, city: 'a', state: 'aa' },
            { profit: 15, sales: 25, city: 'b', state: 'bb' },
            { profit: 10, sales: 20, city: 'a', state: 'ab' },
            { profit: 15, sales: 25, city: 'b', state: 'ba' },
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
            { profit: 10, sales: 20, city: 'a', state: 'aba' },
            { profit: 15, sales: 25, city: 'b', state: 'baa' },
        ];
        const schema2 = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            { name: 'state', type: 'dimension' },
        ];
        const dataTable1 = (new DataTable(data1, schema1, 'TableA')).project('city,state');
        const dataTable2 = (new DataTable(data2, schema2, 'TableB')).project('city,state');
        expect(dataTable1.difference(dataTable2).getData()).to.deep.equal({
            schema: [
                { name: 'city', type: 'dimension' },
                { name: 'state', type: 'dimension' },
            ],
            data: [
                ['a', 'aa'],
                ['b', 'bb'],
            ],
        });
        expect(dataTable1.union(dataTable2).getData()).to.deep.equal({
            schema: [
                { name: 'city', type: 'dimension' },
                { name: 'state', type: 'dimension' },
            ],
            data: [
                ['a', 'aa'],
                ['b', 'bb'],
                ['a', 'ab'],
                ['b', 'ba'],
                ['a', 'aba'],
                ['b', 'baa'],
            ],
        });
    });
});
