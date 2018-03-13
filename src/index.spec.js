/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DataTable from '..';

describe('DataTable functionality', () => {
    it('Clone functionality', () => {
        const data = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
            ],
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            ],
            dataTable = new DataTable(data, schema);
        let cloneRelation;

        dataTable.colIdentifier = '1-20';
        dataTable.rowDiffset = 'a, aaa, aaaa';
        cloneRelation = dataTable.clone();
        expect(cloneRelation instanceof DataTable).to.be.true;
        // Check clone dataTable have all the required attribute
        expect(cloneRelation.colIdentifier).to.equal('1-20');
        expect(cloneRelation.rowDiffset).to.equal('a, aaa, aaaa');
    });
    it('Projection functionality', () => {
        const data = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
            ],
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            ],
            dataTable = new DataTable(data, schema),
            projectedDataTable = dataTable.project('aaaa,a'),
            expData = {
                schema: [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
                ],
                data: [
                ['d', 10],
                ['demo', 15],
                ],
                uids: [0, 1]
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
            ],
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            ],
            dataTable = new DataTable(data, schema),
            projectedDataTable = (dataTable.project('aaaa,a')).select((fields, i) =>
        fields[0].data[i] <= 10 && fields[2].data[i] === 'demo'),
            expData = {
                schema: [
                { name: 'aaaa', type: 'dimension' },
                { name: 'a', type: 'measure' },
                ],
                data: [
                ['demo', 9],
                ['demo', 7],
                ],
                uids: [2, 3]
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
            ],
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            ],
            dataTable = new DataTable(data, schema),
            projectedDataTable = (dataTable.project('aaaa,a')).select((fields, i) =>
                fields[2].data[i] === 'demo'),
            // Check if repetation select works
            projectedDataTable1 = projectedDataTable.select((fields, i) =>
                fields[0].data[i] === 10);
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
            uids: [1, 2, 4, 5, 6, 7, 9]
        };
        // check project is not applied on the same DataTable
        expect(dataTable === projectedDataTable).to.be.false;
        expect(projectedDataTable.rowDiffset).to.equal('1-2,4-7,9');
        // Check The return data
        expect(projectedDataTable.getData()).to.deep.equal(expData);

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
            uids: [5, 6, 7, 9]
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
            ],
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            ],
            dataTable = new DataTable(data, schema),
            renameDataTable = dataTable.rename({ aaa: 'aaaRename' }),
            expData = {
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
                uids: [0, 1, 2, 3, 4, 5]
            };
        expect(renameDataTable.getData()).to.deep.equal(expData);
    });
    it('sort configuration and functionality', () => {
        const data = [
            { a: 10, aaa: 20 },
            { a: 15, aaa: 25 },
            { a: 9, aaa: 35 },
            { a: 7, aaa: 20 },
            { a: 35, aaa: 5 },
            { a: 10, aaa: 10 },
            ],
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            ],
            dataTable = new DataTable(data, schema),
            expData = {
                schema: [
                { name: 'a', type: 'measure' },
                { name: 'aaa', type: 'measure' },
                ],
                data: [
                [9, 35],
                [15, 25],
                [7, 20],
                [10, 20],
                [10, 10],
                [35, 5],
                ],
                uids: [2, 1, 3, 0, 5, 4]
            };
        dataTable.sort([
            ['aaa', 'desc'],
            ['a'],
        ]);
        expect(dataTable.sortingDetails).to.deep.equal([
            ['aaa', 'desc'],
            ['a', 'asc'],
        ]);
        expect(dataTable.getData()).to.deep.equal(expData);
    });
    it('sort for multi rows functionality', () => {
        const data = [
            { a: 2, aa: 1, aaa: 1 },
            { a: 2, aa: 6, aaa: 12 },
            { a: 1, aa: 15, aaa: 9 },
            { a: 1, aa: 15, aaa: 12 },
            { a: 1, aa: 6, aaa: 15 },
            { a: 2, aa: 1, aaa: 56 },
            { a: 2, aa: 1, aaa: 3 },
            { a: 1, aa: 15, aaa: 10 },
            { a: 2, aa: 6, aaa: 9 },
            { a: 1, aa: 6, aaa: 4 },
            ],
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aa', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            ],
            dataTable = new DataTable(data, schema),
            expData = {
                schema: [
                { name: 'a', type: 'measure' },
                { name: 'aa', type: 'measure' },
                { name: 'aaa', type: 'measure' },
                ],
                data: [
                [1, 15, 9],
                [1, 15, 10],
                [1, 15, 12],
                [1, 6, 4],
                [1, 6, 15],
                [2, 6, 9],
                [2, 6, 12],
                [2, 1, 1],
                [2, 1, 3],
                [2, 1, 56],
                ],
                uids: [2, 7, 3, 9, 4, 8, 1, 0, 6, 5]
            };
        dataTable.sort([
                ['a'],
                ['aa', 'desc'],
                ['aaa'],
        ]);
        expect(dataTable.getData()).to.deep.equal(expData);
    });
    it('sort for string data', () => {
        const data = [
            { Name: 'Shubham', Age: '22', Gender: 'Male', Location: 'Kolkata' },
            { Name: 'Teen', Age: '14', Gender: 'Female', Location: 'Kolkata' },
            { Name: 'Manoj', Age: '52', Gender: 'Male', Location: 'Kolkata' },
            { Name: 'Usha', Age: '49', Gender: 'Female', Location: 'Kolkata' },
            { Name: 'Akash', Age: '28', Gender: 'Male', Location: 'Kolkata' },
            { Name: 'Shyam', Age: '74', Gender: 'Male', Location: 'Kolkata' },
            { Name: 'Baby', Age: '3', Gender: 'Male', Location: 'Kolkata' },
            ],
            schema = [
            { name: 'Name', type: 'dimension' },
            { name: 'Age', type: 'measure' },
            { name: 'Gender', type: 'dimension' },
            { name: 'Location', type: 'dimension' },
            ],
            dataTable = new DataTable(data, schema),
            expData = {
                schema: [
                { name: 'Name', type: 'dimension' },
                { name: 'Age', type: 'measure' },
                { name: 'Gender', type: 'dimension' },
                { name: 'Location', type: 'dimension' },
                ],
                data: [
                ['Shubham', 22, 'Male', 'Kolkata'],
                ['Manoj', 52, 'Male', 'Kolkata'],
                ['Akash', 28, 'Male', 'Kolkata'],
                ['Shyam', 74, 'Male', 'Kolkata'],
                ['Baby', 3, 'Male', 'Kolkata'],
                ['Teen', 14, 'Female', 'Kolkata'],
                ['Usha', 49, 'Female', 'Kolkata'],
                ],
                uids: [0, 2, 4, 5, 6, 1, 3]
            };
        dataTable.sort([
            ['Gender', 'desc'],
        ]);
        expect(dataTable.getData()).to.deep.equal(expData);
    });
    it('join functionality', () => {
        const data1 = [
            { profit: 10, sales: 20, city: 'a' },
            { profit: 15, sales: 25, city: 'b' },
            ],
            schema1 = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            data2 = [
            { population: 200, city: 'a' },
            { population: 250, city: 'b' },
            ],
            schema2 = [
            { name: 'population', type: 'measure' },
            { name: 'city', type: 'dimension' },
            ],
            dataTable1 = new DataTable(data1, schema1, 'TableA'),
            dataTable2 = new DataTable(data2, schema2, 'TableB');
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
            uids: [0, 1, 2, 3]
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
                            uids: [0, 1]
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
            uids: [0, 1]
        });
    });
    it('difference and union functionality', () => {
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
            { profit: 10, sales: 20, city: 'a', state: 'aba' },
            { profit: 15, sales: 25, city: 'b', state: 'baa' },
            ],
            schema2 = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'city', type: 'dimension' },
            { name: 'state', type: 'dimension' },
            ],
            dataTable1 = (new DataTable(data1, schema1, 'TableA')).project('city,state'),
            dataTable2 = (new DataTable(data2, schema2, 'TableB')).project('city,state');
        expect(dataTable1.difference(dataTable2).getData()).to.deep.equal({
            schema: [
                { name: 'city', type: 'dimension' },
                { name: 'state', type: 'dimension' },
            ],
            data: [
                ['a', 'aa'],
                ['b', 'bb'],
            ],
            uids: [0, 1]
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
            uids: [0, 1, 2, 3, 4, 5]
        });
    });
});
