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
    it.skip('Selection functionality', () => {
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
        const expData = [
            [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
            ],
            ['demo', 9],
            ['demo', 7],
        ];
        // check project is not applied on the same DataTable
        expect(dataTable === projectedDataTable).to.be.false;
        // Check The return data
        expect(projectedDataTable.getData()).to.deep.equal(expData);
    });
});
