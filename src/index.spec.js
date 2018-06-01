/* global describe, it,context */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DataTable from '..';

describe('#Datatable', () => {
    it('should clone successfully', () => {
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
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const dataTable = new DataTable(data, schema);
        const projectedDataTable = dataTable.project(['aaaa', 'a']);
        const expData = {
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
    it('tests inverted projection', () => {
        const yodata = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
        ];
        const yoschema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const yodataTable = new DataTable(yodata, yoschema);
        const invProjectedDataTable = yodataTable.project(['aaaa', 'a'], {
            mode: 'exclude'
        });
        const expected = {
            data: [
                [20],
                [25]
            ],
            schema: [
                {
                    name: 'aaa',
                    type: 'measure'
                }
            ],
            uids: [0, 1]
        };
        expect(expected).to.deep.equal(invProjectedDataTable.getData());
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
        const projectedDataTable = (dataTable.project(['aaaa', 'a'])).select(fields =>
            fields.a.value <= 10 && fields.aaaa.value === 'demo');
        const expData = {
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
    it('tests selection modes', () => {
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
        const dataTable = new DataTable(data1, schema1, 'Yo');
        const selected = dataTable.select(fields => fields.profit.value === 10).getData();
        const rejected = dataTable.select(fields => fields.profit.value === 10, {
            mode: 'inverse'
        }).getData();
        const teenTitansUnite = dataTable.select(fields => fields.profit.value === 10, {
            mode: 'all'
        });
        expect(selected).to.deep.equal({
            schema: schema1,
            data: [
                [10, 20, 'a', 'aa'],
                [10, 20, 'a', 'ab']
            ],
            uids: [0, 2]
        });
        expect(rejected).to.deep.equal({
            schema: schema1,
            data: [
                [15, 25, 'b', 'bb'],
                [15, 25, 'b', 'ba']
            ],
            uids: [1, 3]
        });
        expect(teenTitansUnite[0].getData()).to.deep.equal({
            schema: schema1,
            data: [
                [10, 20, 'a', 'aa'],
                [10, 20, 'a', 'ab']
            ],
            uids: [0, 2]
        });
        expect(teenTitansUnite[1].getData()).to.deep.equal({
            schema: schema1,
            data: [
                [15, 25, 'b', 'bb'],
                [15, 25, 'b', 'ba']
            ],
            uids: [1, 3]
        });
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
        const projectedDataTable = (dataTable.project(['aaaa', 'a'])).select(fields =>
                fields.aaaa.value === 'demo');
            // Check if repetation select works
        const projectedDataTable1 = projectedDataTable.select(fields =>
                fields.a.value === 10);
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
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
        ];
        const dataTable = new DataTable(data, schema);
        const expData = {
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
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aa', type: 'measure' },
            { name: 'aaa', type: 'measure' },
        ];
        const dataTable = new DataTable(data, schema);
        const expData = {
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
        ];
        const schema = [
            { name: 'Name', type: 'dimension' },
            { name: 'Age', type: 'measure' },
            { name: 'Gender', type: 'dimension' },
            { name: 'Location', type: 'dimension' },
        ];
        const dataTable = new DataTable(data, schema);
        const expData = {
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
        const dataTable1 = (new DataTable(data1, schema1, 'TableA')).project(['city', 'state']);
        const dataTable2 = (new DataTable(data2, schema2, 'TableB')).project(['city', 'state']);

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
    it('tests creating a computed measure', () => {
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
        const dataTable = new DataTable(data1, schema1, 'Yo');
        const next = dataTable.project(['profit', 'sales']).select(f => +f.profit > 10);
        const child = next.calculatedMeasure({
            name: 'Efficiency'
        }, ['profit', 'sales'], (profit, sales) => profit / sales);
        const childData = child.getData().data;
        const efficiency = childData[0][childData[0].length - 1];
        expect(
            efficiency
        ).to.equal(0.6);
        expect(
            () => {
                next.calculatedMeasure({
                    name: 'Efficiency'
                }, ['profit', 'sales'], (profit, sales) => profit / sales);
            }
        ).to.throw('Efficiency field already exists in table.');
    });
    it('tests generating new dimensions', () => {
        const data1 = [
            { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
            { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
            { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
            { profit: 15, sales: 25, first: 'White', second: 'walls' },
        ];
        const schema1 = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'first', type: 'dimension' },
            { name: 'second', type: 'dimension' },
        ];
        const dataTable = new DataTable(data1, schema1, 'Yo');
        const newDt = dataTable.generateDimensions([{
            name: 'Song'
        }, {
            name: 'InvertedSong'
        }], ['first', 'second'], (first, second) => [
            `${first} ${second}`,
            `${second} ${first}`
        ]);
        const songData = newDt.project(['Song']).getData().data;
        const invSongData = newDt.project(['InvertedSong']).getData().data;
        expect(
            songData.length === 4 &&
            invSongData.length === 4
        ).to.be.true;
        // test removing dependents
        const exDt = dataTable.generateDimensions([{
            name: 'Song'
        }, {
            name: 'InvertedSong'
        }], ['first', 'second'], (first, second) => [
            `${first} ${second}`,
            `${second} ${first}`
        ], {
            removeDependentDimensions: true
        });
        const fieldMap = exDt.getFieldMap();
        expect(
            !(fieldMap.first && fieldMap.second)
        ).to.be.true;
    });
    it('tests datatable propogation', () => {
        const data1 = [
            { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
            { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
            { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
            { profit: 15, sales: 25, first: 'White', second: 'walls' },
        ];
        const schema1 = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'first', type: 'dimension' },
            { name: 'second', type: 'dimension' },
        ];
        let projetionFlag = false;
        let selectionFlag = false;
        let groupByFlag = false;
        const dataTable = new DataTable(data1, schema1, 'Yo');
        const projected = dataTable.project(['profit']);
        const selected = dataTable.select(fields => fields.profit.valueOf() > 10);
        const grouped = dataTable.groupBy(['first']);
        // setup listeners
        projected.on('propogation', () => {
            projetionFlag = true;
        });
        selected.on('propogation', () => {
            selectionFlag = true;
        });
        grouped.on('propogation', () => {
            groupByFlag = true;
        });

        const identifiers = [
            ['first', 'second'],
            ['Hey', 'Jude']
        ];
        dataTable.propagate(identifiers, {
            action: 'reaction'
        });
        expect(
            projetionFlag && selectionFlag && groupByFlag
        ).to.be.true;
    });
    it('tests interpolated propagation', () => {
        const data1 = [
            { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
            { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
            { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
            { profit: 15, sales: 25, first: 'White', second: 'walls' },
        ];
        const schema1 = [
            { name: 'profit', type: 'measure' },
            { name: 'sales', type: 'measure' },
            { name: 'first', type: 'dimension' },
            { name: 'second', type: 'dimension' },
        ];
        let inProjetionFlag = false;
        let inSelectionFlag = false;
        let inGroupByFlag = false;
        const dataTable = new DataTable(data1, schema1, 'Yo');
        const projected = dataTable.project(['profit']);
        const selected = dataTable.select(fields => fields.profit.value > 10);
        const grouped = dataTable.groupBy(['sales']);
         // interpolated propagation handlers
        projected.on('propogation', () => {
            inProjetionFlag = true;
        });
        selected.on('propogation', () => {
            inSelectionFlag = true;
        });
        grouped.on('propogation', () => {
            inGroupByFlag = true;
        });
        dataTable.propagateInterpolatedValues({
            profit: [2, 12],
            sales: [18, 30]
        }, {
            action: 'reaction'
        });
        expect(
            inProjetionFlag && inSelectionFlag && inGroupByFlag
        ).to.be.true;
    });
    it('tests create dimensions from function', () => {
        const dataLicious = [
            {
                year: '2010',
                Import_yo: 4000,
                Export_dude: 3000
            },
            {
                year: '2011',
                Import_yo: 4000,
                Export_dude: 7000
            },
            {
                year: '2012',
                Import_yo: 3000,
                Export_dude: 5000
            }
        ];
        const dSchema = [
            {
                name: 'year',
                type: 'dimension'
            },
            {
                name: 'Import_yo',
                type: 'measure'
            },
            {
                name: 'Export_dude',
                type: 'measure'
            }
        ];
        const dataInstance = new DataTable(dataLicious, dSchema);
        const almostPivoted = dataInstance.createDimensionFrom(
            ['Import_yo', 'Export_dude'],
            'type',
            'values',
             values => values.split('_')[0]
            );
        const { schema, data } = almostPivoted.getData();
        expect(schema).to.deep.equal([
            {
                name: 'year',
                type: 'dimension',
            },
            {
                name: 'type',
                type: 'dimension'
            },
            {
                name: 'values',
                type: 'measure'
            }
        ]);
        expect(data.length).to.equal(6);
    });
    it('tests datatable binning', () => {
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
        const buckets = [
            { end: 1, label: 'useless' },
            { start: 1, end: 4, label: 'failure' },
            { start: 4, end: 6, label: 'firstclass' },
            { start: 6, end: 10, label: 'decent' }
        ];

        let binnedDT = toBinDatatable.bin('marks', {
            buckets,
        }, 'rating1');
        let binnedDTnum = toBinDatatable.bin('marks', {
            numOfBins: 4
        }, 'rating2');
        let binnedDTSize = toBinDatatable.bin('marks', {
            binSize: 4,
        });
        expect(
            binnedDT.getData().schema
        ).to.deep.equal([{
            name: 'marks',
            type: 'measure',
        }, {
            name: 'rating1',
            type: 'dimension'
        }]);
        expect(
            binnedDTnum.getData().schema
        ).to.deep.equal([{
            name: 'marks',
            type: 'measure',
        }, {
            name: 'rating2',
            type: 'dimension'
        }]);
        expect(
            binnedDTSize.getData().schema
        ).to.deep.equal([{
            name: 'marks',
            type: 'measure',
        }, {
            name: 'marks_binned',
            type: 'dimension'
        }]);
    });
    context('Test Default aggregation function', () => {
        const data1 = [
            { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
            { profit: 20, sales: 25, first: 'Hey', second: 'Wood' },
            { profit: 10, sales: 20, first: 'White', second: 'the sun' },
            { profit: 15, sales: 25, first: 'White', second: 'walls' },
        ];
        const schema1 = [
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
        const dataTable = new DataTable(data1, schema1);
        it('Setting default Aggre fcn for profit', () => {
            const grouped = dataTable.groupBy(['first']);
            const childData = grouped.getData().data;
            expect(childData[0][0]).to.equal(15);
        });
        it('Default Aggre fcn for sales should be sum', () => {
            const grouped = dataTable.groupBy(['first']);
            const childData = grouped.getData().data;
            expect(childData[0][1]).to.equal(45);
        });
        it('Default Aggre fcn for sales should be min', () => {
            DataTable.Reducers.defaultReducer('min');
            const grouped = dataTable.groupBy(['first']);
            const childData = grouped.getData().data;
            expect(childData[0][1]).to.equal(20);
        });
        it('Default Aggre fcn for profit should be avg after setting default Reducer', () => {
            DataTable.Reducers.defaultReducer('min');
            const grouped = dataTable.groupBy(['first']);
            const childData = grouped.getData().data;
            expect(childData[0][1]).to.equal(20);
        });
        it('function provided in group by should overide default', () => {
            DataTable.Reducers.defaultReducer('min');
            const grouped = dataTable.groupBy(['first'], {
                sales: 'sum'
            });
            const childData = grouped.getData().data;
            expect(childData[0][1]).to.equal(45);
        });
        it('Should Register a global aggregation', () => {
            DataTable.Reducers.register('mySum', (arr) => {
                const isNestedArray = arr[0] instanceof Array;
                let sum = arr.reduce((carry, a) => {
                    if (isNestedArray) {
                        return carry.map((x, i) => x + a[i]);
                    }
                    return carry + a;
                }, isNestedArray ? Array(...Array(arr[0].length)).map(() => 0) : 0);
                return sum * 100;
            });
            const grouped = dataTable.groupBy(['first'], {
                sales: 'mySum'
            });
            const childData = grouped.getData().data;
            expect(childData[0][1]).to.equal(4500);
        });
        it('Should reset default fnc', () => {
            DataTable.Reducers.defaultReducer('sum');
            expect(DataTable.Reducers.defaultReducer()).to.equal(DataTable.Reducers.resolve('sum'));
        });
    });
});
