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
        const expData = [
            [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
            ],
            ['d', 10],
            ['demo', 15],
        ];
        // check project is not applied on the same DataTable
        expect(dataTable === projectedDataTable).to.be.false;
        // Check The return data
        expect(projectedDataTable.getData()).to.deep.equal(expData);
    });
});
