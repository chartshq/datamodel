/* global describe, it ,context */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DataModel from './index';
import { FilteringMode } from '../../picasso-util/src/enums';

describe('DataModel', () => {
    describe('#clone', () => {
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
            const dataModel = new DataModel(data, schema);

            let cloneRelation;
            cloneRelation = dataModel.clone();
            expect(cloneRelation instanceof DataModel).to.be.true;
            // Check clone datamodel have all the required attribute
            expect(cloneRelation._colIdentifier).to.equal(dataModel._colIdentifier);
            expect(cloneRelation._rowDiffset).to.equal(dataModel._rowDiffset);
        });
    });

    describe('#getData', () => {
        it('should retrieves the data correctly', () => {
            const schema = [
                { name: 'name', type: 'dimension' },
                { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' }
            ];

            const data = [
                { name: 'Rousan', birthday: '1995-07-05', roll: 12 },
                { name: 'Sumant', birthday: '1996-08-04', roll: 89 },
                { name: 'Akash', birthday: '1994-01-03', roll: 33 }
            ];
            const dataModel = new DataModel(data, schema);

            let generatedData = dataModel.getData({
                order: 'row'
            });
            let expected = {
                data: [
                    ['Rousan', 804882600000],
                    ['Sumant', 839097000000],
                    ['Akash', 757535400000]
                ],
                schema: [
                    { name: 'name', type: 'dimension' },
                    { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' }
                ],
                uids: [0, 1, 2]
            };
            expect(generatedData).to.deep.equal(expected);

            generatedData = dataModel.getData({
                order: 'column'
            });
            expected = {
                data: [
                    ['Rousan', 'Sumant', 'Akash'],
                    [804882600000, 839097000000, 757535400000]
                ],
                schema: [
                    { name: 'name', type: 'dimension' },
                    { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' }
                ],
                uids: [0, 1, 2]
            };
            expect(generatedData).to.deep.equal(expected);

            generatedData = dataModel.getData({
                order: 'row',
                formatter: {
                    name: val => val.toUpperCase(),
                    birthday: (val) => {
                        const dm = new Date(val);
                        return `${dm.getFullYear()}-${dm.getMonth() + 1}-${dm.getDay()}`;
                    }
                }
            });
            expected = {
                schema: [
                    { name: 'name', type: 'dimension' },
                    { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' }
                ],
                data: [
                    ['ROUSAN', '1995-7-3'],
                    ['SUMANT', '1996-8-0'],
                    ['AKASH', '1994-1-1']
                ],
                uids: [0, 1, 2]
            };
            expect(generatedData).to.deep.equal(expected);

            generatedData = dataModel.getData({
                order: 'column',
                formatter: {
                    name: val => val.toUpperCase(),
                    birthday: (val) => {
                        const dm = new Date(val);
                        return `${dm.getFullYear()}-${dm.getMonth() + 1}-${dm.getDay()}`;
                    }
                }
            });
            expected = {
                schema: [
                    { name: 'name', type: 'dimension' },
                    { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' }
                ],
                data: [
                    ['ROUSAN', 'SUMANT', 'AKASH'],
                    ['1995-7-3', '1996-8-0', '1994-1-1']
                ],
                uids: [0, 1, 2]
            };
            expect(generatedData).to.deep.equal(expected);
        });
    });

    describe('#project', () => {
        it('should project the fields correctly', () => {
            const data = [
                { a: 10, aaa: 20, aaaa: 'd' },
                { a: 15, aaa: 25, aaaa: 'demo' },
            ];
            const schema = [
                { name: 'a', type: 'measure' },
                { name: 'aaa', type: 'measure' },
                { name: 'aaaa', type: 'dimension' },
            ];
            const dataModel = new DataModel(data, schema);
            const projectedDataModel = dataModel.project(['aaaa', 'a']);
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
            expect(dataModel === projectedDataModel).to.be.false;
            expect(projectedDataModel.getData()).to.deep.equal(expData);
        });

        it('should do inverted projections', () => {
            const yodata = [
                { a: 10, aaa: 20, aaaa: 'd' },
                { a: 15, aaa: 25, aaaa: 'demo' },
            ];
            const yoschema = [
                { name: 'a', type: 'measure' },
                { name: 'aaa', type: 'measure' },
                { name: 'aaaa', type: 'dimension' },
            ];
            const yodataModel = new DataModel(yodata, yoschema);
            const invProjectedDataModel = yodataModel.project(['aaaa', 'a'], {
                mode: FilteringMode.INVERSE
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
            expect(expected).to.deep.equal(invProjectedDataModel.getData());
        });

        it('should project fields when filtering mode is all', () => {
            const yodata = [
                { a: 10, aaa: 20, aaaa: 'd' },
                { a: 15, aaa: 25, aaaa: 'demo' },
            ];
            const yoschema = [
                { name: 'a', type: 'measure' },
                { name: 'aaa', type: 'measure' },
                { name: 'aaaa', type: 'dimension' },
            ];
            const yodataModel = new DataModel(yodata, yoschema);
            const dataModels = yodataModel.project(['aaaa'], {
                mode: FilteringMode.ALL
            });
            const projectedModel = {
                data: [
                    ['d'],
                    ['demo']
                ],
                schema: [
                    {
                        name: 'aaaa',
                        type: 'dimension'
                    }
                ],
                uids: [0, 1]
            };
            const rejectionModel = {
                data: [
                    [10, 20],
                    [15, 25]
                ],
                schema: [
                    {
                        name: 'a',
                        type: 'measure'
                    },
                    {
                        name: 'aaa',
                        type: 'measure'
                    }
                ],
                uids: [0, 1]
            };
            expect(projectedModel).to.deep.equal(dataModels[0].getData());
            expect(rejectionModel).to.deep.equal(dataModels[1].getData());
        });
    });


    describe('#select', () => {
        it('should perform selection', () => {
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
            const dataModel = new DataModel(data, schema);
            const projectedDataModel = (dataModel.project(['aaaa', 'a'])).select(fields =>
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
            // check project is not applied on the same DataModel
            expect(dataModel === projectedDataModel).to.be.false;
            expect(projectedDataModel._rowDiffset).to.equal('2-3');
            // Check The return data
            expect(projectedDataModel.getData()).to.deep.equal(expData);
        });

        it('should perform selection properly with modes', () => {
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
            const dataModel = new DataModel(data1, schema1, 'Yo');
            const selected = dataModel.select(fields => fields.profit.value === 10).getData();
            const rejected = dataModel.select(fields => fields.profit.value === 10, {
                mode: 'inverse'
            }).getData();
            const teenTitansUnite = dataModel.select(fields => fields.profit.value === 10, {
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

        it('should perform selection functionality in extreme condition', () => {
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
            const dataModel = new DataModel(data, schema);
            const projectedDataModel = (dataModel.project(['aaaa', 'a'])).select(fields =>
                fields.aaaa.value === 'demo');
            // Check if repetition select works
            const projectedDataModel1 = projectedDataModel.select(fields =>
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
            // check project is not applied on the same DataModel
            expect(dataModel === projectedDataModel).to.be.false;
            expect(projectedDataModel._rowDiffset).to.equal('1-2,4-7,9');
            // Check The return data
            expect(projectedDataModel.getData()).to.deep.equal(expData);

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
            expect(projectedDataModel1._rowDiffset).to.equal('5-7,9');
            // Check The return data
            expect(projectedDataModel1.getData()).to.deep.equal(expData);
        });
    });

    describe('#sort', () => {
        it('should perform sorting properly', () => {
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
            const dataModel = new DataModel(data, schema);
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
            dataModel.sort([
                ['aaa', 'desc'],
                ['a'],
            ]);
            expect(dataModel._sortingDetails).to.deep.equal([
                ['aaa', 'desc'],
                ['a', 'asc'],
            ]);
            expect(dataModel.getData()).to.deep.equal(expData);
        });

        it('should perform multi sort properly', () => {
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
            const dataModel = new DataModel(data, schema);
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
            dataModel.sort([
                ['a'],
                ['aa', 'desc'],
                ['aaa'],
            ]);
            expect(dataModel.getData()).to.deep.equal(expData);
        });

        it('should perform sort with string data', () => {
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
            const dataModel = new DataModel(data, schema);
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
            dataModel.sort([
                ['Gender', 'desc'],
            ]);
            expect(dataModel.getData()).to.deep.equal(expData);
        });
    });

    describe('#join', () => {
        it('should perform join properly', () => {
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
            const dataModel1 = new DataModel(data1, schema1, 'ModelA');
            const dataModel2 = new DataModel(data2, schema2, 'ModelB');

            expect((dataModel1.join(dataModel2)).getData()).to.deep.equal({
                schema: [
                    { name: 'profit', type: 'measure' },
                    { name: 'sales', type: 'measure' },
                    { name: 'ModelA.city', type: 'dimension' },
                    { name: 'population', type: 'measure' },
                    { name: 'ModelB.city', type: 'dimension' },
                ],
                data: [
                    [10, 20, 'a', 200, 'a'],
                    [10, 20, 'a', 250, 'b'],
                    [15, 25, 'b', 200, 'a'],
                    [15, 25, 'b', 250, 'b'],
                ],
                uids: [0, 1, 2, 3]
            });
            expect((dataModel1.join(dataModel2, obj => obj.ModelA.city === obj.ModelB.city))
                            .getData()).to.deep.equal({
                                schema: [
                                    { name: 'profit', type: 'measure' },
                                    { name: 'sales', type: 'measure' },
                                    { name: 'ModelA.city', type: 'dimension' },
                                    { name: 'population', type: 'measure' },
                                    { name: 'ModelB.city', type: 'dimension' },
                                ],
                                data: [
                                    [10, 20, 'a', 200, 'a'],
                                    [15, 25, 'b', 250, 'b'],
                                ],
                                uids: [0, 1]
                            });
            expect((dataModel1.naturalJoin(dataModel2)).getData()).to.deep.equal({
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

    describe('#difference & #union', () => {
        it('should perform the difference and union properly', () => {
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
            const dataModel1 = (new DataModel(data1, schema1, 'ModelA')).project(['city', 'state']);
            const dataModel2 = (new DataModel(data2, schema2, 'ModelB')).project(['city', 'state']);

            expect(dataModel1.difference(dataModel2).getData()).to.deep.equal({
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
            expect(dataModel1.union(dataModel2).getData()).to.deep.equal({
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

    describe('#caclulatedVariable', () => {
        it('should create a calculated measure', () => {
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
            const dataModel = new DataModel(data1, schema1, 'Yo');

            const next = dataModel.project(['profit', 'sales']).select(f => +f.profit > 10);
            const child = next.calculateVariable({
                name: 'Efficiency',
                type: 'measure'
            }, ['profit', 'sales', (profit, sales) => profit / sales]);

            const childData = child.getData().data;
            const efficiency = childData[0][childData[0].length - 1];
            expect(
                efficiency
            ).to.equal(0.6);

            expect(
                () => {
                    child.calculateVariable({
                        name: 'Efficiency'
                    }, ['profit', 'sales', (profit, sales) => profit / sales]);
                }
            ).to.throw('Efficiency field already exists in model.');
        });

        it('should create a calculated dimension', () => {
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
            const dataModel = new DataModel(data1, schema1, 'Yo');
            const newDm = dataModel.calculateVariable({
                name: 'Song',
                type: 'dimension'
            }, ['first', 'second', (first, second) =>
                `${first} ${second}`
            ]);
            const songData = newDm.project(['Song']);
            expect(
                songData.getData().data[0][0]
            ).to.equal('Hey Jude');
        });

        it('should return correct value from the callback funciton', () => {
            const data = [
                { a: 10, aaa: 20, aaaa: 'd' },
                { a: 15, aaa: 25, aaaa: 'demo' },
            ];
            const schema = [
                { name: 'a', type: 'measure' },
                { name: 'aaa', type: 'measure' },
                { name: 'aaaa', type: 'dimension' },
            ];
            const dataModel = new DataModel(data, schema);

            let callback2 = function (a, aaa, ...arg) {
                return a + aaa + arg[0];
            };
            const child = dataModel.calculateVariable({
                name: 'bbbb',
                type: 'measure'
            }, ['a', 'aaa', callback2]);

            const childData = child.getData().data;
            const efficiency = childData[1][childData[1].length - 1];
            expect(efficiency).to.equal(41);
        });
    });

    describe('#propagate', () => {
        it('should propagate variables through out the dag', () => {
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
            const dataModel = new DataModel(data1, schema1, 'Yo');
            const projected = dataModel.project(['profit']);
            const selected = dataModel.select(fields => fields.profit.valueOf() > 10);
            const grouped = dataModel.groupBy(['first']);
            // setup listeners
            projected.on('propagation', () => {
                projetionFlag = true;
            });
            selected.on('propagation', () => {
                selectionFlag = true;
            });
            grouped.on('propagation', () => {
                groupByFlag = true;
            });

            const identifiers = [
                ['first', 'second'],
                ['Hey', 'Jude']
            ];
            dataModel.propagate(identifiers, {
                action: 'reaction'
            });
            expect(
                projetionFlag && selectionFlag && groupByFlag
            ).to.be.true;
        });

        it('should do an interpolated propagation', () => {
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
            const dataModel = new DataModel(data1, schema1, 'Yo');
            const projected = dataModel.project(['profit']);
            const selected = dataModel.select(fields => fields.profit.value > 10);
            const grouped = dataModel.groupBy(['sales']);
            // interpolated propagation handlers
            projected.on('propagation', () => {
                inProjetionFlag = true;
            });
            selected.on('propagation', () => {
                inSelectionFlag = true;
            });
            grouped.on('propagation', () => {
                inGroupByFlag = true;
            });
            dataModel.propagateInterpolatedValues({
                profit: [2, 12],
                sales: [18, 30]
            }, {
                action: 'reaction'
            });
            expect(
                inProjetionFlag && inSelectionFlag && inGroupByFlag
            ).to.be.true;
        });
    });


    describe('#bin', () => {
        it('should bin the data when buckets are given', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dataModel = new DataModel(data1, schema1, 'Yo');

            const buckets = {
                start: 0,
                end: [5, 11, 16, 20, 30]
            };
            const bin = dataModel.bin('profit', { buckets, name: 'sumField' });
            let fieldData = bin.getFieldspace().fields.find(field => field.name === 'sumField').data;
            let expectedData = ['20', '45', '45', '45', '20', '36', '42', '36', '42'];
            expect(fieldData).to.deep.equal(expectedData);
        });
        it('should bin data when num of bins given', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dataModel = new DataModel(data1, schema1, 'Yo');
            const bin = dataModel.bin('profit', { numOfBins: 2, name: 'sumField' });
            let fieldData = bin.getFieldspace().fields.find(field => field.name === 'sumField').data;
            let expData = ['65', '65', '65', '65', '65', '99', '99', '99', '99', '99'];
            expect(fieldData).to.deep.equal(expData);
        });
        it('should bin data when binSize is given', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dataModel = new DataModel(data1, schema1, 'Yo');
            const bin = dataModel.bin('profit', { binSize: 5, name: 'sumField' });
            let fieldData = bin.getFieldspace().fields.find(field => field.name === 'sumField').data;
            let expData = ['65', '65', '65', '65', '65', '99', '99', '99', '99', '99'];
            expect(expData).to.deep.equal(fieldData);
        });
        // it('should return correct bins when binned after a selct operation', () => {
        //     const data1 = [
        //         { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
        //         { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
        //         { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
        //         { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
        //         { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
        //         { profit: 18, sales: 25, first: 'White', second: 'walls' },
        //         { profit: 21, sales: 25, first: 'White', second: 'walls' },
        //         { profit: 18, sales: 25, first: 'White', second: 'walls' },
        //         { profit: 21, sales: 25, first: 'White', second: 'walls' },
        //         { profit: 21, sales: 25, first: 'White', second: 'walls' }
        //     ];
        //     const schema1 = [
        //         { name: 'profit', type: 'measure' },
        //         { name: 'sales', type: 'measure' },
        //         { name: 'first', type: 'dimension' },
        //         { name: 'second', type: 'dimension' },
        //     ];
        //     const dataModel = new DataModel(data1, schema1, 'Yo');

        //     const dm2 = dataModel.select(feild => feild.sales.value === 25);
        //     const bin = dm2.bin('profit', { binSize: 3, name: 'sumField' }, x => x[0]);
        //     let fieldData = bin.getFieldspace().fields.find(field => field.name === 'sumField').data;
        //     let profitData = bin.getFieldspace().fields.find(field => field.name === 'profit').data;
        //     expect(fieldData).to.deep.equal(profitData);
        // });
    });

    context('Aggregation function context', () => {
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
        const dataModel = new DataModel(data1, schema1);

        describe('#groupBy', () => {
            it('should group properly if def aggregation function is first', () => {
                const grouped = dataModel.groupBy(['first']);
                const childData = grouped.getData().data;
                expect(childData[0][0]).to.equal(15);
            });
            it('should group properly if def aggregation function is sum', () => {
                const grouped = dataModel.groupBy(['first']);
                const childData = grouped.getData().data;
                expect(childData[0][1]).to.equal(45);
            });
            it('should group properly if def aggregation function is min', () => {
                DataModel.Reducers.defaultReducer('min');
                const grouped = dataModel.groupBy(['first']);
                const childData = grouped.getData().data;
                expect(childData[0][1]).to.equal(20);
            });
            it('should group properly if def aggregation function is changed from first to min', () => {
                DataModel.Reducers.defaultReducer('min');
                const grouped = dataModel.groupBy(['first']);
                const childData = grouped.getData().data;
                expect(childData[0][1]).to.equal(20);
            });
            it('should group properly if def aggregation function is changed from min to first', () => {
                DataModel.Reducers.defaultReducer('min');
                const grouped = dataModel.groupBy(['first'], {
                    sales: 'sum'
                });
                const childData = grouped.getData().data;
                expect(childData[0][1]).to.equal(45);
            });
            it('should Register a global aggregation', () => {
                DataModel.Reducers.register('mySum', (arr) => {
                    const isNestedArray = arr[0] instanceof Array;
                    let sum = arr.reduce((carry, a) => {
                        if (isNestedArray) {
                            return carry.map((x, i) => x + a[i]);
                        }
                        return carry + a;
                    }, isNestedArray ? Array(...Array(arr[0].length)).map(() => 0) : 0);
                    return sum * 100;
                });
                const grouped = dataModel.groupBy(['first'], {
                    sales: 'mySum'
                });
                const childData = grouped.getData().data;
                expect(childData[0][1]).to.equal(4500);
            });
            it('should reset default fnc', () => {
                DataModel.Reducers.defaultReducer('sum');
                expect(DataModel.Reducers.defaultReducer()).to.equal(DataModel.Reducers.resolve('sum'));
            });
        });
    });


    context('Checking api for updating parent child relationship', () => {
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
        const dataModel = new DataModel(data1, schema1);
        describe('#dispose', () => {
            it('Should remove child on calling dispose', () => {
                let dm2 = dataModel.select(fields => fields.profit.value < 150);
                expect(dataModel._children.length).to.equal(1);
                dm2.dispose();
                expect(dataModel._children.length).to.equal(0);
            });
        });

        describe('#addParent', () => {
            it('Adding parent should save criteria in parent', () => {
                let dm2 = dataModel.select(fields => fields.profit.value < 150);
                let dm3 = dm2.groupBy(['sales'], {
                    profit: null
                });
                let dm4 = dm3.project(['sales']);
                let data = dm4.getData();
                let projFields = ['first'];
                let projectConfig = {};
                let normalizedprojFields = [];
                let criteriaQueue = [
                    {
                        op: 'select',
                        meta: '',
                        criteria: fields => fields.profit.value < 150
                    },
                    {
                        op: 'project',
                        meta: { projFields, projectConfig, normalizedprojFields },
                        criteria: null
                    }
                ];
                dm3.dispose();
                dm4.addParent(dm2, criteriaQueue);
                expect(dm2._children.length).to.equal(1);
                expect(dm2._children[0].getData()).to.deep.equal(data);
                expect(dm4._parent).to.equal(dm2);
            });
        });
    });
});
