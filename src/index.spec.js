/* global beforeEach, describe, it, context */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { FilteringMode, DataFormat } from './enums';
import DataModel from './index';
import pkg from '../package.json';

function avg(...nums) {
    return nums.reduce((acc, next) => acc + next, 0) / nums.length;
}

describe('DataModel', () => {
    describe('#version', () => {
        it('should be same to the version value specified in package.json file', () => {
            expect(DataModel.version).to.equal(pkg.version);
        });
    });

    describe('#clone', () => {
        it('should make a new copy of the current DataModel instance', () => {
            const data = [
                { age: 30, job: 'unemployed', marital: 'married' },
                { age: 33, job: 'services', marital: 'married' },
                { age: 35, job: 'management', marital: 'single' }
            ];
            const schema = [
                { name: 'age', type: 'measure' },
                { name: 'job', type: 'dimension' },
                { name: 'marital', type: 'dimension' },
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

    context('Test for empty DataModel', () => {
        let data = [];
        let schema = [];
        let edm = new DataModel(data, schema);
        it('should return empty data array', () => {
            expect(edm.getData().data).to.deep.equal([]);
        });
        it('should return have empty fields array', () => {
            expect(edm.getFieldspace().fields.length).to.equal(0);
        });
        it('should have zero columns', () => {
            expect(edm._colIdentifier).to.equal('');
        });
        it('should have empty rowDiffset', () => {
            expect(edm._rowDiffset).to.equal('');
        });
    });

    context('Test for a failing data format type', () => {
        let mockedDm = () => new DataModel([], [], { dataFormat: 'erroneous-data-type' });

        it('should throw no coverter function found error', () => {
            expect(mockedDm).to.throw('No converter function found for erroneous-data-type format');
        });
    });

    describe('#getData', () => {
        it('should return the data in the specified format', () => {
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
                    { name: 'name', type: 'dimension', subtype: 'categorical' },
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
                    { name: 'name', type: 'dimension', subtype: 'categorical' },
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
                    { name: 'name', type: 'dimension', subtype: 'categorical' },
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
                    { name: 'name', type: 'dimension', subtype: 'categorical' },
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

        it('should return sorted data according to the specified config', () => {
            const data = [
                { performance: 'low', horsepower: 100, weight: 2 },
                { performance: 'high', horsepower: 400, weight: 1 },
                { performance: 'medium', horsepower: 20, weight: 1.5 },
                { performance: 'decent', horsepower: 30, weight: 0.5 }
            ];
            const schema = [
                { name: 'performance', type: 'dimension', subtype: 'categorical' },
                { name: 'horsepower', type: 'measure', subtype: 'continuous' },
                { name: 'weight', type: 'measure', subtype: 'continuous' }
            ];

            const dm = new DataModel(data, schema);
            const expected = {
                schema: [
                    {
                        name: 'performance',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'horsepower',
                        type: 'measure',
                        subtype: 'continuous'
                    },
                    {
                        name: 'weight',
                        type: 'measure',
                        subtype: 'continuous'
                    }
                ],
                data: [
                    ['medium', 20, 1.5],
                    ['decent', 30, 0.5],
                    ['low', 100, 2],
                    ['high', 400, 1]
                ],
                uids: [2, 3, 0, 1]
            };

            expect(dm.getData({
                sort: [['horsepower', 'asc']]
            })).to.deep.equal(expected);
        });

        it('should add a column named uid if withUid is true', () => {
            const schema = [
                { name: 'name', type: 'dimension' },
                { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' }
            ];

            const data = [
                { name: 'Rousan', birthday: '1995-07-05' },
                { name: 'Sumant', birthday: '1996-08-04' },
                { name: 'Akash', birthday: '1994-01-03' }
            ];
            const dataModel = new DataModel(data, schema);
            const expected = {
                data: [
                  ['Rousan', 804882600000, 0],
                  ['Sumant', 839097000000, 1],
                  ['Akash', 757535400000, 2]
                ],
                schema: [
                    { name: 'name', type: 'dimension', subtype: 'categorical' },
                    { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' },
                    { name: 'uid', type: 'identifier' }
                ],
                uids: [0, 1, 2]
            };

            expect(dataModel.getData({ withUid: true })).to.deep.equal(expected);
        });
    });

    describe('#project', () => {
        const data = [
            { age: 30, education: 'tertiary', job: 'management', marital: 'married' },
            { age: 59, education: 'secondary', job: 'blue-collar', marital: 'married' },
            { age: 35, education: 'tertiary', job: 'management', marital: 'single' }
        ];
        const schema = [
            { name: 'age', type: 'measure' },
            { name: 'education', type: 'dimension' },
            { name: 'job', type: 'dimension' },
            { name: 'marital', type: 'dimension' }
        ];

        it('should make projection with the input fields', () => {
            const dataModel = new DataModel(data, schema);
            const projectedDataModel = dataModel.project(['age', 'job']);
            const expected = {
                data: [
                    [30, 'management'],
                    [59, 'blue-collar'],
                    [35, 'management']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                ],
                uids: [0, 1, 2]
            };
            expect(dataModel === projectedDataModel).to.be.false;
            expect(projectedDataModel.getData()).to.deep.equal(expected);
        });

        it('should make inverted projections', () => {
            const dataModel = new DataModel(data, schema);
            const invProjectedDataModel = dataModel.project(['age', 'job'], {
                mode: FilteringMode.INVERSE
            });
            const expected = {
                data: [
                    ['tertiary', 'married'],
                    ['secondary', 'married'],
                    ['tertiary', 'single']
                ],
                schema: [
                    { name: 'education', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 1, 2]
            };
            expect(expected).to.deep.equal(invProjectedDataModel.getData());
        });

        it('should make normal and inverse projection both when mode is ALL', () => {
            const datamodel = new DataModel(data, schema);
            const dataModels = datamodel.project(['age', 'job'], {
                mode: FilteringMode.ALL
            });

            const projectedModel = {
                data: [
                    [30, 'management'],
                    [59, 'blue-collar'],
                    [35, 'management']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                ],
                uids: [0, 1, 2]
            };
            const rejectionModel = {
                data: [
                    ['tertiary', 'married'],
                    ['secondary', 'married'],
                    ['tertiary', 'single']
                ],
                schema: [
                    { name: 'education', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 1, 2]
            };

            expect(projectedModel).to.deep.equal(dataModels[0].getData());
            expect(rejectionModel).to.deep.equal(dataModels[1].getData());
        });

        it('should maintain the order of column names given in project params', () => {
            const datamodel = new DataModel(data, schema);
            const dataModels = datamodel.project(['job', 'age', 'marital', 'education']);
            const expColumnOrder = 'job,age,marital,education';
            expect(dataModels._colIdentifier).to.equal(expColumnOrder);
        });

        it('should maintain the order of column names in fieldConfig and schema', () => {
            const datamodel = new DataModel(data, schema);
            const dataModels = datamodel.project(['job', 'age', 'marital', 'education']);
            const shecma = dataModels.getData().schema.map((scheme, i) => ({ name: scheme.name, index: i }));
            const fieldMap = dataModels.getFieldsConfig();
            shecma.forEach((sch) => {
                expect(sch.index).to.equal(fieldMap[sch.name].index);
            });
        });

        it('should make projection by matching fields with the input regexp', () => {
            const dataModel = new DataModel(data, schema);
            const projectedDataModel = dataModel.project([/o/g, /age/g]);
            const expected = {
                schema: [
                    { name: 'education', type: 'dimension', subtype: 'categorical' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'age', type: 'measure', subtype: 'continuous' }
                ],
                data: [
                    ['tertiary', 'management', 30],
                    ['secondary', 'blue-collar', 59],
                    ['tertiary', 'management', 35]
                ],
                uids: [0, 1, 2]
            };

            expect(dataModel === projectedDataModel).to.be.false;
            expect(projectedDataModel.getData()).to.deep.equal(expected);
        });
    });


    describe('#select', () => {
        const data = [
            { age: 30, job: 'management', marital: 'married' },
            { age: 59, job: 'blue-collar', marital: 'married' },
            { age: 35, job: 'management', marital: 'single' },
            { age: 57, job: 'self-employed', marital: 'married' },
            { age: 28, job: 'blue-collar', marital: 'married' },
        ];
        const schema = [
            { name: 'age', type: 'measure' },
            { name: 'job', type: 'dimension' },
            { name: 'marital', type: 'dimension' }
        ];

        it('should perform normal selection', () => {
            const dataModel = new DataModel(data, schema);
            const selectedDm = dataModel.select(fields => fields.age.value < 40);
            const expData = {
                data: [
                    [30, 'management', 'married'],
                    [35, 'management', 'single'],
                    [28, 'blue-collar', 'married']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 2, 4]
            };

            // check project is not applied on the same DataModel
            expect(dataModel === selectedDm).to.be.false;
            expect(selectedDm._rowDiffset).to.equal('0,2,4');
            // Check The return data
            expect(selectedDm.getData()).to.deep.equal(expData);
        });

        it('should perform selection with the specified modes', () => {
            const dataModel = new DataModel(data, schema);
            const selected = dataModel.select(fields => fields.marital.value === 'married').getData();
            const rejected = dataModel.select(fields => fields.marital.value === 'married', {
                mode: FilteringMode.INVERSE
            }).getData();
            const selectionAll = dataModel.select(fields => fields.marital.value === 'married', {
                mode: FilteringMode.ALL
            });

            expect(selected).to.deep.equal({
                data: [
                    [30, 'management', 'married'],
                    [59, 'blue-collar', 'married'],
                    [57, 'self-employed', 'married'],
                    [28, 'blue-collar', 'married']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 1, 3, 4]
            });
            expect(rejected).to.deep.equal({
                data: [
                    [35, 'management', 'single']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [2]
            });
            expect(selectionAll[0].getData()).to.deep.equal(selected);
            expect(selectionAll[1].getData()).to.deep.equal(rejected);
        });

        it('should perform selection functionality in extreme condition', () => {
            const dataModel = new DataModel(data, schema);
            const selectedDm = dataModel.project(['age', 'job']).select(fields =>
                fields.job.value === 'management');
            // Check if repetition select works
            const selectedDm2 = selectedDm.select(fields =>
                fields.marital.value === 'single');
            let expData = {
                data: [
                    [30, 'management'],
                    [35, 'management']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                ],
                uids: [0, 2]
            };
            // check project is not applied on the same DataModel
            expect(dataModel === selectedDm).to.be.false;
            expect(selectedDm._rowDiffset).to.equal('0,2');
            // Check The return data
            expect(selectedDm.getData()).to.deep.equal(expData);

            expData = {
                data: [
                    [35, 'management']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                ],
                uids: [2]
            };
            expect(selectedDm2._rowDiffset).to.equal('2');
            // Check The return data
            expect(selectedDm2.getData()).to.deep.equal(expData);
        });

        it('should perform selection and field domain should return only selected data', () => {
            const dataModel = new DataModel(data, schema);
            const selectedDm = dataModel.select(fields => fields.age.value < 40);
            const expData = {
                data: [
                    [30, 'management', 'married'],
                    [35, 'management', 'single'],
                    [28, 'blue-collar', 'married']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 2, 4]
            };

            // check project is not applied on the same DataModel
            expect(dataModel === selectedDm).to.be.false;
            expect(selectedDm._rowDiffset).to.equal('0,2,4');
            // Check The return data
            expect(selectedDm.getData()).to.deep.equal(expData);
            expect(selectedDm.getFieldspace().fields[0].domain()).to.deep.equal([28, 35]);
        });

        it('should provide appropriate arguments to the predicate function', () => {
            const dataModel = new DataModel(data, schema);

            let selectedDm = dataModel.select((fields, i, cloneProvider, store) => {
                if (!store.clonedDm) {
                    store.clonedDm = cloneProvider();
                }
                if (!store.avgAge) {
                    store.avgAge = store.clonedDm.groupBy([''], { age: 'avg' }).getData().data[0][0];
                }

                return fields.age.value > store.avgAge;
            });
            let expData = {
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                data: [
                    [59, 'blue-collar', 'married'],
                    [57, 'self-employed', 'married']
                ],
                uids: [1, 3]
            };

            expect(selectedDm.getData()).to.eql(expData);

            selectedDm = dataModel.select((fields, i) => i < 2);
            expData = {
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                data: [
                    [30, 'management', 'married'],
                    [59, 'blue-collar', 'married']
                ],
                uids: [0, 1]
            };

            expect(selectedDm.getData()).to.eql(expData);
        });
    });

    describe('#sort', () => {
        it('should perform sorting properly', () => {
            const data = [
                { age: 30, job: 'management', marital: 'married' },
                { age: 59, job: 'blue-collar', marital: 'married' },
                { age: 35, job: 'management', marital: 'single' },
                { age: 57, job: 'self-employed', marital: 'married' }
            ];
            const schema = [
                { name: 'age', type: 'measure' },
                { name: 'job', type: 'dimension' },
                { name: 'marital', type: 'dimension' }
            ];
            const dataModel = new DataModel(data, schema);

            const sortedDm = dataModel.sort([
                ['age', 'desc']
            ]);
            const expData = {
                data: [
                    [59, 'blue-collar', 'married'],
                    [57, 'self-employed', 'married'],
                    [35, 'management', 'single'],
                    [30, 'management', 'married']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 1, 2, 3]
            };

            expect(sortedDm).not.to.equal(dataModel);
            expect(sortedDm._sortingDetails).to.deep.equal([
                ['age', 'desc']
            ]);
            expect(sortedDm.getData()).to.deep.equal(expData);
        });

        it('should perform multi sort properly', () => {
            const data = [
                { age: 30, job: 'management', marital: 'married' },
                { age: 59, job: 'blue-collar', marital: 'married' },
                { age: 35, job: 'management', marital: 'single' },
                { age: 57, job: 'self-employed', marital: 'married' },
                { age: 28, job: 'blue-collar', marital: 'married' },
                { age: 30, job: 'blue-collar', marital: 'single' },
            ];
            const schema = [
                { name: 'age', type: 'measure' },
                { name: 'job', type: 'dimension' },
                { name: 'marital', type: 'dimension' }
            ];
            const dataModel = new DataModel(data, schema);

            const sortedDm = dataModel.sort([
                ['age', 'desc'],
                ['job'],
            ]);
            const expData = {
                data: [
                    [59, 'blue-collar', 'married'],
                    [57, 'self-employed', 'married'],
                    [35, 'management', 'single'],
                    [30, 'blue-collar', 'single'],
                    [30, 'management', 'married'],
                    [28, 'blue-collar', 'married']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 1, 2, 3, 4, 5]
            };
            expect(sortedDm._sortingDetails).to.deep.equal([
                ['age', 'desc'],
                ['job'],
            ]);
            expect(sortedDm.getData()).to.deep.equal(expData);
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

            const sortedDm = dataModel.sort([
                ['Gender', 'desc'],
            ]);
            const expData = {
                schema: [
                    { name: 'Name', type: 'dimension', subtype: 'categorical' },
                    { name: 'Age', type: 'measure', subtype: 'continuous' },
                    { name: 'Gender', type: 'dimension', subtype: 'categorical' },
                    { name: 'Location', type: 'dimension', subtype: 'categorical' },
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
                uids: [0, 1, 2, 3, 4, 5, 6]
            };
            expect(sortedDm.getData()).to.deep.equal(expData);
        });

        it('should perform sort with sorting function', () => {
            const data = [
                { age: 30, job: 'management', marital: 'married' },
                { age: 59, job: 'blue-collar', marital: 'married' },
                { age: 35, job: 'management', marital: 'single' },
                { age: 57, job: 'self-employed', marital: 'married' },
                { age: 28, job: 'blue-collar', marital: 'married' },
                { age: 30, job: 'blue-collar', marital: 'single' },
            ];
            const schema = [
                { name: 'age', type: 'measure' },
                { name: 'job', type: 'dimension' },
                { name: 'marital', type: 'dimension' }
            ];
            const dataModel = new DataModel(data, schema);

            const sortedDm = dataModel.sort([
                ['age', (a, b) => b - a],
                ['job'],
            ]);
            const expData = {
                data: [
                    [59, 'blue-collar', 'married'],
                    [57, 'self-employed', 'married'],
                    [35, 'management', 'single'],
                    [30, 'blue-collar', 'single'],
                    [30, 'management', 'married'],
                    [28, 'blue-collar', 'married']
                ],
                schema: [
                    { name: 'age', type: 'measure', subtype: 'continuous' },
                    { name: 'job', type: 'dimension', subtype: 'categorical' },
                    { name: 'marital', type: 'dimension', subtype: 'categorical' }
                ],
                uids: [0, 1, 2, 3, 4, 5]
            };
            expect(sortedDm.getData()).to.deep.equal(expData);
        });

        it('should perform sort by another field', () => {
            const data = [
                { performance: 'low', horsepower: 100, weight: 2 },
                { performance: 'high', horsepower: 400, weight: 1 },
                { performance: 'medium', horsepower: 20, weight: 1.5 },
                { performance: 'low', horsepower: 50, weight: 4 },
                { performance: 'medium', horsepower: 660, weight: 5 },
                { performance: 'decent', horsepower: 30, weight: 0.5 }
            ];
            const schema = [
                { name: 'performance', type: 'dimension' },
                { name: 'horsepower', type: 'measure' },
                { name: 'weight', type: 'measure' }
            ];
            const dataModel = new DataModel(data, schema);

            let sortingDetails = [
                ['performance', ['horsepower', (a, b) => avg(...a.horsepower) - avg(...b.horsepower)]],
                ['horsepower', 'asc']
            ];
            let sortedDm = dataModel.sort(sortingDetails);
            let expected = {
                schema: [
                    { name: 'performance', type: 'dimension', subtype: 'categorical' },
                    { name: 'horsepower', type: 'measure', subtype: 'continuous' },
                    { name: 'weight', type: 'measure', subtype: 'continuous' }
                ],
                data: [
                    ['decent', 30, 0.5],
                    ['low', 50, 4],
                    ['low', 100, 2],
                    ['medium', 20, 1.5],
                    ['medium', 660, 5],
                    ['high', 400, 1]
                ],
                uids: [0, 1, 2, 3, 4, 5]
            };
            expect(sortedDm.getData()).to.deep.equal(expected);

            sortingDetails = [
                ['performance', ['horsepower', 'weight',
                    (a, b) => (avg(...a.horsepower) * avg(...a.weight)) - (avg(...b.horsepower) * avg(...b.weight))]],
                ['horsepower', 'desc']
            ];
            sortedDm = dataModel.sort(sortingDetails);
            expected = {
                schema: [
                    { name: 'performance', type: 'dimension', subtype: 'categorical' },
                    { name: 'horsepower', type: 'measure', subtype: 'continuous' },
                    { name: 'weight', type: 'measure', subtype: 'continuous' }
                ],
                data: [
                    ['decent', 30, 0.5],
                    ['low', 100, 2],
                    ['low', 50, 4],
                    ['high', 400, 1],
                    ['medium', 660, 5],
                    ['medium', 20, 1.5]
                ],
                uids: [0, 1, 2, 3, 4, 5]
            };
            expect(sortedDm.getData()).to.deep.equal(expected);
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
            const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
            const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

            expect((dataModel1.join(dataModel2)).getData()).to.deep.equal({
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'ModelA.city', type: 'dimension', subtype: 'categorical' },
                    { name: 'population', type: 'measure', subtype: 'continuous' },
                    { name: 'ModelB.city', type: 'dimension', subtype: 'categorical' },
                ],
                data: [
                    [10, 20, 'a', 200, 'a'],
                    [10, 20, 'a', 250, 'b'],
                    [15, 25, 'b', 200, 'a'],
                    [15, 25, 'b', 250, 'b'],
                ],
                uids: [0, 1, 2, 3]
            });
            expect((dataModel1.join(dataModel2,
                (dmFields1, dmFields2) => dmFields1.city.value === dmFields2.city.value)).getData()).to.deep.equal({
                    schema: [
                        { name: 'profit', type: 'measure', subtype: 'continuous' },
                        { name: 'sales', type: 'measure', subtype: 'continuous' },
                        { name: 'ModelA.city', type: 'dimension', subtype: 'categorical' },
                        { name: 'population', type: 'measure', subtype: 'continuous' },
                        { name: 'ModelB.city', type: 'dimension', subtype: 'categorical' },
                    ],
                    data: [
                        [10, 20, 'a', 200, 'a'],
                        [15, 25, 'b', 250, 'b'],
                    ],
                    uids: [0, 1]
                });
            expect((dataModel1.naturalJoin(dataModel2)).getData()).to.deep.equal({
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'city', type: 'dimension', subtype: 'categorical' },
                    { name: 'population', type: 'measure', subtype: 'continuous' },
                ],
                data: [
                    [10, 20, 'a', 200],
                    [15, 25, 'b', 250],
                ],
                uids: [0, 1]
            });
        });

        it('should perform natural join correctly', () => {
            const data1 = [
                { profit: 10, sales: 20, city: 'a', type: 'aa' },
                { profit: 15, sales: 25, city: 'b', type: 'aa' },
                { profit: 15, sales: 25, city: 'c', type: 'aa' },
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
                { name: 'type', type: 'dimension' },
            ];
            const data2 = [
                { population: 200, city: 'a', type: 'aa' },
                { population: 250, city: 'b', type: 'aa' },
            ];
            const schema2 = [
                { name: 'population', type: 'measure' },
                { name: 'city', type: 'dimension' },
                { name: 'type', type: 'dimension' },
            ];
            const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
            const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

            const k = dataModel1.naturalJoin(dataModel2);
            expect(k.getData()).to.deep.equal({
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'city', type: 'dimension', subtype: 'categorical' },
                    { name: 'type', type: 'dimension', subtype: 'categorical' },
                    { name: 'population', type: 'measure', subtype: 'continuous' },
                ],
                data: [
                    [10, 20, 'a', 'aa', 200],
                    [15, 25, 'b', 'aa', 250]
                ],
                uids: [0, 1]
            });
        });

        it('should perform natural join correctly #1', () => {
            const data1 = [
                { profit: 10, sales: 20, city: 'a', type: 'aa' },
                { profit: 15, sales: 25, city: 'b', type: 'aa' },
                { profit: 15, sales: 25, city: 'c', type: 'aa' },
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'city', type: 'dimension' },
                { name: 'type', type: 'dimension' },
            ];
            const data2 = [
                { population: 200, city: 'a', type: 'aa' },
                { population: 250, city: 'b', type: 'kk' },
            ];
            const schema2 = [
                { name: 'population', type: 'measure' },
                { name: 'city', type: 'dimension' },
                { name: 'type', type: 'dimension' },
            ];
            const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
            const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

            const k = dataModel1.naturalJoin(dataModel2);
            expect(k.getData()).to.deep.equal({
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'city', type: 'dimension', subtype: 'categorical' },
                    { name: 'type', type: 'dimension', subtype: 'categorical' },
                    { name: 'population', type: 'measure', subtype: 'continuous' },
                ],
                data: [
                    [10, 20, 'a', 'aa', 200]
                ],
                uids: [0]
            });
        });

        it('should provide appropriate arguments to the predicate function', () => {
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
                { name: 'city', type: 'dimension' }
            ];
            const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
            const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

            const joinedDm = dataModel1.join(dataModel2, (fields1, fields2, cloneProvider1, cloneProvider2, store) => {
                if (!store.clonedDm1) {
                    store.clonedDm1 = cloneProvider1();
                }
                if (!store.clonedDm2) {
                    store.clonedDm2 = cloneProvider2();
                }
                if (!store.avgPopulation) {
                    store.avgPopulation = store.clonedDm2.groupBy([''], { population: 'avg' }).getData().data[0][0];
                }

                return (fields1.profit.value * fields1.sales.value) > store.avgPopulation;
            });

            const expected = {
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'ModelA.city', type: 'dimension', subtype: 'categorical' },
                    { name: 'population', type: 'measure', subtype: 'continuous' },
                    { name: 'ModelB.city', type: 'dimension', subtype: 'categorical' }
                ],
                data: [
                    [15, 25, 'b', 200, 'a'],
                    [15, 25, 'b', 250, 'b']
                ],
                uids: [0, 1]
            };
            expect(joinedDm.getData()).to.eql(expected);
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
            const dataModel1 = (new DataModel(data1, schema1, { name: 'ModelA' })).project(['city', 'state']);
            const dataModel2 = (new DataModel(data2, schema2, { name: 'ModelB' })).project(['city', 'state']);

            expect(dataModel1.difference(dataModel2).getData()).to.deep.equal({
                schema: [
                    { name: 'city', type: 'dimension', subtype: 'categorical' },
                    { name: 'state', type: 'dimension', subtype: 'categorical' },
                ],
                data: [
                    ['a', 'aa'],
                    ['b', 'bb'],
                ],
                uids: [0, 1]
            });
            expect(dataModel1.union(dataModel2).getData()).to.deep.equal({
                schema: [
                    { name: 'city', type: 'dimension', subtype: 'categorical' },
                    { name: 'state', type: 'dimension', subtype: 'categorical' },
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

    describe('#calculateVariable', () => {
        it('should create a calculated field with empty dependency fields', () => {
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
            const dataModel = new DataModel(data1, schema1);
            const newDm = dataModel.calculateVariable({
                name: 'Song',
                type: 'dimension'
            }, [i => i]);

            const songData = newDm.groupBy(['Song']);
            const expected = {
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'Song', type: 'dimension', subtype: 'categorical' }
                ],
                data: [
                    [10, 20, '0'],
                    [15, 25, '1'],
                    [10, 20, '2'],
                    [15, 25, '3']
                ],
                uids: [0, 1, 2, 3]
            };

            expect(
                songData.getData()
            ).to.eql(expected);
        });

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
            const dataModel = new DataModel(data1, schema1);

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
            ).to.throw('Efficiency field already exists in datamodel');
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
            const dataModel = new DataModel(data1, schema1);
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

        it('should return correct value from the callback function', () => {
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

        it('should provide appropriate arguments to the predicate function', () => {
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
            const dm = new DataModel(data1, schema1);

            let calculatedDm = dm.calculateVariable({
                name: 'avgProfitOffset',
                type: 'measure'
            }, ['profit', (profit, i, cloneProvider, store) => {
                if (!store.clonedDm) {
                    store.clonedDm = cloneProvider();
                }
                if (!store.avgProfit) {
                    store.avgProfit = store.clonedDm.groupBy([''], { profit: 'avg' }).getData().data[0][0];
                }

                return store.avgProfit - profit;
            }]);

            let expected = {
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'city', type: 'dimension', subtype: 'categorical' },
                    { name: 'state', type: 'dimension', subtype: 'categorical' },
                    { name: 'avgProfitOffset', type: 'measure', subtype: 'continuous' }
                ],
                data: [
                    [10, 20, 'a', 'aa', 2.5],
                    [15, 25, 'b', 'bb', -2.5],
                    [10, 20, 'a', 'ab', 2.5],
                    [15, 25, 'b', 'ba', -2.5]
                ],
                uids: [0, 1, 2, 3]
            };

            expect(calculatedDm.getData()).to.eql(expected);

            calculatedDm = dm.calculateVariable({
                name: 'profitIndex',
                type: 'measure'
            }, ['profit', (profit, i) => profit * i]);

            expected = {
                schema: [
                    { name: 'profit', type: 'measure', subtype: 'continuous' },
                    { name: 'sales', type: 'measure', subtype: 'continuous' },
                    { name: 'city', type: 'dimension', subtype: 'categorical' },
                    { name: 'state', type: 'dimension', subtype: 'categorical' },
                    { name: 'profitIndex', type: 'measure', subtype: 'continuous' }
                ],
                data: [
                    [10, 20, 'a', 'aa', 0],
                    [15, 25, 'b', 'bb', 15],
                    [10, 20, 'a', 'ab', 20],
                    [15, 25, 'b', 'ba', 45]
                ],
                uids: [0, 1, 2, 3]
            };

            expect(calculatedDm.getData()).to.eql(expected);
        });

        it('should throw an error if invalid column name passed in function to resolve value of new variable', () => {
            const data = [
                {
                    name: 'Rousan',
                    birthday: '1995-07-05',
                    roll: 2
                },
                {
                    name: 'Sumant',
                    birthday: '1996-08-04',
                    roll: 89
                }
            ];
            const schema = [
                {
                    name: 'name',
                    type: 'dimension'
                },
                {
                    name: 'birthday',
                    type: 'dimension',
                    subtype: 'temporal',
                    format: '%Y-%m-%d'
                },
                {
                    name: 'roll',
                    type: 'measure',
                    defAggFn: 'avg'
                }
            ];
            const dataModel = new DataModel(data, schema);
            const mockedFn = () =>
                dataModel.calculateVariable({
                    name: 'age',
                    type: 'measure'
                }, ['country', c => c]);

            expect(mockedFn).to.throw('country is not a valid column name');
        });
    });

    describe('#propagate', () => {
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
        const propModel = new DataModel([{
            first: 'Hey',
            second: 'Jude'
        }], [{
            name: 'first',
            type: 'dimension'
        }, {
            name: 'second',
            type: 'dimension'
        }]);
        const propModel1 = new DataModel([{
            first: 'Hey',
            second: 'Jude',
            count: 100
        }], [{
            name: 'first',
            type: 'dimension'
        }, {
            name: 'second',
            type: 'dimension'
        }, {
            name: 'count',
            type: 'measure'
        }]);

        it('should propagate variables through out the dag', () => {
            let projetionFlag = false;
            let selectionFlag = false;
            let groupByFlag = false;
            const dataModel = new DataModel(data1, schema1);
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

            dataModel.propagate(propModel, {
                action: 'reaction'
            }, true);

            // unsubscribe callbacks for propagation event
            projected.unsubscribe('propagation');

            expect(
                projetionFlag && selectionFlag && groupByFlag
            ).to.be.true;
        });

        it('should make a mutable action and propagate variables through the dag', () => {
            let projectionFlag = false;
            let selectionFlag = false;
            let groupByFlag = false;
            const dataModel = new DataModel(data1, schema1);
            const projected = dataModel.project(['profit']);
            const selected = dataModel.select(fields => fields.profit.valueOf() > 10);
            const grouped = dataModel.groupBy(['first']);
            // setup listeners
            projected.on('propagation', () => {
                projectionFlag = true;
            });
            selected.on('propagation', () => {
                selectionFlag = true;
            });
            grouped.on('propagation', () => {
                groupByFlag = true;
            });

            dataModel.propagate(propModel, {
                action: 'reaction',
                isMutableAction: true,
                propagateInterpolatedValues: true,
                sourceId: 'canvas-1',
                payload: {
                    persistant: true,
                },
                applyOnSource: true,
                criteria: {
                    first: ['White'],
                    sales: 25
                }
            }, true);

            // unsubscribe callbacks for propagation event
            projected.unsubscribe('propagation');

            expect(
                projectionFlag && selectionFlag && groupByFlag
            ).to.be.true;
        });

        it('should find the parent datamodel instance and apply propagation on it', () => {
            let projectionFlag = false;
            let selectionFlag = false;
            let groupByFlag = false;
            const dataModel = new DataModel(data1, schema1);
            const projected = dataModel.project(['profit']);
            const selected = dataModel.select(fields => fields.profit.valueOf() > 10);
            const grouped = dataModel.groupBy(['first']);
            // setup listeners
            projected.on('propagation', () => {
                projectionFlag = true;
            });
            selected.on('propagation', () => {
                selectionFlag = true;
            });
            grouped.on('propagation', () => {
                groupByFlag = true;
            });

            selected.propagate(propModel1, {
                isMutableAction: false, criteria: null
            }, true);

            // unsubscribe callbacks for propagation event
            projected.unsubscribe('propagation');

            expect(
                projectionFlag && selectionFlag && groupByFlag
            ).to.be.true;
        });

        it('should make the action immutable and propagate variables through the dag', () => {
            let projectionFlag = false;
            let selectionFlag = false;
            let groupByFlag = false;
            const dataModel = new DataModel(data1, schema1);
            const projected = dataModel.project(['profit']);
            const selected = dataModel.select(fields => fields.profit.valueOf() > 10);
            const grouped = dataModel.groupBy(['first']);
            // setup listeners
            projected.on('propagation', () => {
                projectionFlag = true;
            });
            selected.on('propagation', () => {
                selectionFlag = true;
            });
            grouped.on('propagation', () => {
                groupByFlag = true;
            });

            dataModel.propagate(propModel1, {
                action: 'reaction',
                propagateInterpolatedValues: true,
                sourceId: 'canvas-1',
                payload: {
                    persistant: true,
                },
                applyOnSource: false,
                criteria: {
                    second: ['White'],
                    first: 'Hey'
                }
            }, true);

            dataModel.propagate(propModel1, {
                action: 'reaction',
                isMutableAction: true,
                propagateInterpolatedValues: true,
                sourceId: 'canvas-12',
                payload: {
                    persistant: true,
                },
                applyOnSource: false,
                criteria: {
                    count: 200
                },
            }, true);

            // unsubscribe callbacks for propagation event
            projected.unsubscribe('propagation');

            expect(
                projectionFlag && selectionFlag && groupByFlag
            ).to.be.true;
        });

        it('should filterPropagationModel if field is of type measure and exists in the schema', () => {
            let projectionFlag = false;
            let selectionFlag = false;
            let groupByFlag = false;
            const dataModel = new DataModel(data1, schema1);
            const projected = dataModel.project(['profit']);
            const selected = dataModel.select(fields => fields.profit.valueOf() > 10);
            const grouped = dataModel.groupBy(['first']);
            // setup listeners
            projected.on('propagation', () => {
                projectionFlag = true;
            });
            selected.on('propagation', () => {
                selectionFlag = true;
            });
            grouped.on('propagation', () => {
                groupByFlag = true;
            });

            dataModel.propagate(propModel1, {
                action: 'reaction',
                isMutableAction: true,
                propagateInterpolatedValues: true,
                sourceId: 'canvas-1',
                payload: {
                    persistant: true,
                },
                applyOnSource: false,
                criteria: {
                    count: 100
                },
            }, true);

            // unsubscribe callbacks for propagation event
            projected.unsubscribe('propagation');

            expect(
                projectionFlag && selectionFlag && groupByFlag
            ).to.be.true;
        });

        it('should not propagate values if null is passed as an identifier', () => {
            let projectionFlag = false;
            let selectionFlag = false;
            let groupByFlag = false;
            const dataModel = new DataModel(data1, schema1);
            const projected = dataModel.project(['profit']);
            const selected = dataModel.select(fields => fields.profit.valueOf() > 10);
            const grouped = dataModel.groupBy(['first']);
            // setup listeners
            projected.on('propagation', () => {
                projectionFlag = true;
            });
            selected.on('propagation', () => {
                selectionFlag = true;
            });
            grouped.on('propagation', () => {
                groupByFlag = true;
            });

            dataModel.propagate(null, { action: 'reaction' }, true);

            expect(
                projectionFlag && selectionFlag && groupByFlag
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
            const dm = new DataModel(data1, schema1);

            let binnedDm = dm.bin('profit', { buckets: [0, 5, 11, 16, 20, 30], name: 'sumField' });
            let newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField');
            let expectedData = ['5-11', '11-16', '11-16', '11-16', '5-11', '16-20', '20-30', '16-20', '20-30'];
            expect(newField.data()).to.deep.equal(expectedData);
            expect(newField.bins()).to.deep.equal([0, 5, 11, 16, 20, 30]);

            binnedDm = dm.bin('profit', { buckets: [11, 16, 20], name: 'sumField1' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField1');
            expectedData = ['10-11', '11-16', '11-16', '11-16', '10-11', '16-20', '20-22', '16-20', '20-22'];
            expect(newField.data()).to.deep.equal(expectedData);
            expect(newField.bins()).to.deep.equal([10, 11, 16, 20, 22]);
        });

        it('should bin the data when data has the same value as bucket\'s start or end', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dm = new DataModel(data1, schema1);

            let binnedDm = dm.bin('profit', { buckets: [10, 13, 16, 20, 30], name: 'sumField' });
            let newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField');
            let expectedData = ['10-13', '13-16', '10-13', '16-20', '20-30'];
            expect(newField.data()).to.deep.equal(expectedData);
            expect(newField.bins()).to.deep.equal([10, 13, 16, 20, 30]);

            binnedDm = dm.bin('profit', { buckets: [1, 13, 16, 20, 21], name: 'sumField1' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField1');
            expectedData = ['1-13', '13-16', '1-13', '16-20', '21-22'];
            expect(newField.data()).to.deep.equal(expectedData);
            expect(newField.bins()).to.deep.equal([1, 13, 16, 20, 21, 22]);
        });

        it('should bin data when binsCount is given', () => {
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
            const dm = new DataModel(data1, schema1);

            let binnedDm = dm.bin('profit', { binsCount: 2, name: 'sumField' });
            let newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField');
            let expData = ['10-16', '10-16', '10-16', '10-16', '10-16', '16-22', '16-22', '16-22', '16-22', '16-22'];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal([10, 16, 22]);

            binnedDm = dm.bin('profit', { binsCount: 2, start: 0, name: 'sumField1' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField1');
            expData = ['0-11', '11-22', '11-22', '11-22', '0-11', '11-22', '11-22', '11-22', '11-22', '11-22'];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal([0, 11, 22]);

            binnedDm = dm.bin('profit', { binsCount: 2, start: 15, name: 'sumField2' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField2');
            expData = ['10-16', '10-16', '10-16', '10-16', '10-16', '16-22', '16-22', '16-22', '16-22', '16-22'];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal([10, 16, 22]);
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
            const dm = new DataModel(data1, schema1);

            let binnedDm = dm.bin('profit', { binSize: 5, start: 1, end: 100, name: 'sumField' });
            let newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField');
            let expData = ['6-11', '11-16', '11-16', '11-16', '6-11', '16-21', '21-26', '16-21', '21-26', '21-26'];
            let expBins = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91, 96, 101];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal(expBins);

            binnedDm = dm.bin('profit', { binSize: 5, name: 'sumField1' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField1');
            expData = ['10-15', '15-20', '15-20', '15-20', '10-15', '15-20', '20-25', '15-20', '20-25', '20-25'];
            expBins = [10, 15, 20, 25];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal(expBins);

            binnedDm = dm.bin('profit', { binSize: 5, start: 12, end: 89, name: 'sumField2' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField2');
            expData = ['10-15', '15-20', '15-20', '15-20', '10-15', '15-20', '20-25', '15-20', '20-25', '20-25'];
            expBins = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal(expBins);
        });

        it('should bin data when negative values are present', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
                { profit: -18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: -21, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: -14, sales: 25, first: 'White', second: 'walls' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dm = new DataModel(data1, schema1);

            let binnedDm = dm.bin('profit', { buckets: [0, 6, 12, 20], name: 'sumField' });
            let newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField');
            let expData = ['6-12', '12-20', '12-20', '12-20', '6-12', '-21-0', '20-22', '12-20', '-21-0', '20-22',
                '-21-0'];
            let expBins = [-21, 0, 6, 12, 20, 22];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal(expBins);

            binnedDm = dm.bin('profit', { binsCount: 5, start: 1, name: 'sumField1' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField1');
            expData = ['6-15', '15-24', '15-24', '15-24', '6-15', '-21--12', '15-24', '15-24', '-21--12', '15-24',
                '-21--12'];
            expBins = [-21, -12, -3, 6, 15, 24];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal(expBins);

            binnedDm = dm.bin('profit', { binSize: 10, start: -1, end: 30, name: 'sumField2' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField2');
            expData = ['9-19', '9-19', '9-19', '9-19', '9-19', '-21--11', '19-29', '9-19', '-21--11', '19-29',
                '-21--11'];
            expBins = [-21, -11, -1, 9, 19, 29, 39];
            expect(newField.data()).to.deep.equal(expData);
            expect(newField.bins()).to.deep.equal(expBins);
        });

        it('should handle the null data values', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
                { profit: 18, sales: 25, first: 'White', second: 'walls' },
                { profit: 21, sales: 25, first: 'White', second: 'walls' },
                { profit: null, sales: 25, first: 'White', second: 'walls' },
                { profit: 12, sales: 20, first: 'Here comes', second: 'the sun' },
                { profit: null, sales: 25, first: 'Norwegian', second: 'Wood' },
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dm = new DataModel(data1, schema1);

            let binnedDm = dm.bin('profit', { buckets: [0, 5, 11, 16, 20, 30], name: 'sumField' });
            let newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField');
            let expectedData = ['5-11', '11-16', '11-16', '5-11', '16-20', '20-30', null, '11-16', null];
            expect(newField.data()).to.deep.equal(expectedData);
            expect(newField.bins()).to.deep.equal([0, 5, 11, 16, 20, 30]);

            binnedDm = dm.bin('profit', { buckets: [11, 16, 20], name: 'sumField1' });
            newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'sumField1');
            expectedData = ['10-11', '11-16', '11-16', '10-11', '16-20', '20-22', null, '11-16', null];
            expect(newField.data()).to.deep.equal(expectedData);
            expect(newField.bins()).to.deep.equal([10, 11, 16, 20, 22]);
        });

        it('should throw an error if the binned field already exists', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dataModel = new DataModel(data1, schema1, { name: 'ModelA' });
            const mockedBinErr = () => dataModel.bin('profit', { binSize: 10, name: 'sales' });

            expect(mockedBinErr).to.throw('Field sales already exists');
        });

        it('should throw an error if the source field to create a binned field does not exists', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dataModel = new DataModel(data1, schema1, { name: 'ModelA' });
            const mockedBinErr = () => dataModel.bin('name', { binSize: 10, name: 'cost' });

            expect(mockedBinErr).to.throw("Field name doesn't exist");
        });

        it('should assign a name to the binned field if not passed in config', () => {
            const data1 = [
                { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
                { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' }
            ];
            const schema1 = [
                { name: 'profit', type: 'measure' },
                { name: 'sales', type: 'measure' },
                { name: 'first', type: 'dimension' },
                { name: 'second', type: 'dimension' },
            ];
            const dataModel = new DataModel(data1, schema1, { name: 'ModelA' });
            const binnedDm = dataModel.bin('profit', { binSize: 10 });

            let newField = binnedDm.getFieldspace().fields.find(field => field.name() === 'profit_binned');

            expect(newField.partialField.name).to.equal('profit_binned');
        });
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
                expect(childData[0][1]).to.equal(45);
            });

            it('should group properly if def aggregation function is changed from first to min', () => {
                DataModel.Reducers.defaultReducer('min');
                const grouped = dataModel.groupBy(['first']);
                const childData = grouped.getData().data;
                expect(childData[0][1]).to.equal(45);
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

            it('should provide appropriate arguments to the aggregation function', () => {
                const dm = new DataModel(data1, schema1);
                const groupedDm = dm.groupBy(['first'], {
                    profit: (vals, cloneProvider, store) => {
                        if (!store.clonedDm) {
                            store.clonedDm = cloneProvider();
                        }
                        if (!store.avgProfit) {
                            store.avgProfit = store.clonedDm.groupBy([''], { profit: 'avg' }).getData().data[0][0];
                        }

                        return DataModel.Stats.avg(vals) - store.avgProfit;
                    }
                });

                const expected = {
                    schema: [
                        { name: 'profit', type: 'measure', defAggFn: 'avg', subtype: 'continuous' },
                        { name: 'sales', type: 'measure', subtype: 'continuous' },
                        { name: 'first', type: 'dimension', subtype: 'categorical' }
                    ],
                    data: [
                        [1.25, 45, 'Hey'],
                        [-1.25, 45, 'White']
                    ],
                    uids: [0, 1]
                };

                expect(groupedDm.getData()).to.eql(expected);
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

    context('Statistics function test', () => {
        describe('#sum', () => {
            it('should return sum for 1D array', () => {
                expect(DataModel.Stats.sum([10, 12, 17])).to.equal(39);
            });
        });
        describe('#svg', () => {
            it('should return average for 1D Array', () => {
                expect(DataModel.Stats.avg([10, 12, 17])).to.equal(39 / 3);
            });
        });
    });

    describe('#detachedRoot', () => {
        const schema = [
            {
                name: 'name',
                type: 'dimension'
            },
            {
                name: 'birthday',
                type: 'dimension',
                subtype: 'temporal',
                format: '%Y-%m-%d'
            },
            {
                name: 'roll',
                type: 'measure'
            }
        ];

        const data = [
            {
                name: 'Rousan',
                birthday: '1995-07-05',
                roll: 2
            },
            {
                name: 'Sumant',
                birthday: '1996-08-04',
                roll: 89
            },
            {
                name: 'Ajay',
                birthday: '1994-01-03',
                roll: 31
            },
            {
                name: 'Sushant',
                birthday: '1994-01-03',
                roll: 99
            },
            {
                name: 'Samim',
                birthday: '1994-01-03',
                roll: 12
            },
            {
                name: 'Akash',
                birthday: '1994-01-03',
                roll: 20
            }
        ];

        let dm;

        beforeEach(() => {
            dm = new DataModel(data, schema);
        });

        it('should return a DataModel with different namespace', () => {
            const actualPartialFieldspace = dm.getPartialFieldspace();
            const detachedPartialFieldspace = dm.detachedRoot().getPartialFieldspace();

            expect(actualPartialFieldspace.name).not.to.equal(detachedPartialFieldspace.name);
        });

        it('should return a DataModel with same data', () => {
            expect(dm.getData()).to.eql(dm.detachedRoot().getData());
        });
    });

    describe('#serialize', () => {
        const schema = [
            {
                name: 'name',
                type: 'dimension'
            },
            {
                name: 'birthday',
                type: 'dimension',
                subtype: 'temporal',
                format: '%Y-%m-%d'
            },
            {
                name: 'roll',
                type: 'measure'
            }
        ];

        const data = [
            {
                name: 'Rousan',
                birthday: '1995-07-05',
                roll: 2
            },
            {
                name: 'Sumant',
                birthday: '1996-08-04',
                roll: 89
            },
            {
                name: 'Ajay',
                birthday: '1994-01-03',
                roll: 31
            },
            {
                name: 'Sushant',
                birthday: '1994-01-03',
                roll: 99
            },
            {
                name: 'Samim',
                birthday: '1994-01-03',
                roll: 12
            },
            {
                name: 'Akash',
                birthday: '1994-01-03',
                roll: 20
            }
        ];

        let dm;

        beforeEach(() => {
            dm = new DataModel(data, schema);
        });

        it('should return json data for FlatJSON data type', () => {
            const expected = [
                { name: 'Rousan', birthday: '1995-07-05', roll: 2 },
                { name: 'Sumant', birthday: '1996-08-04', roll: 89 },
                { name: 'Ajay', birthday: '1994-01-03', roll: 31 },
                { name: 'Sushant', birthday: '1994-01-03', roll: 99 },
                { name: 'Samim', birthday: '1994-01-03', roll: 12 },
                { name: 'Akash', birthday: '1994-01-03', roll: 20 }
            ];

            expect(dm.serialize(DataFormat.FLAT_JSON)).to.eql(expected);
        });

        it('should return dsv string for DSVStr data type', () => {
            let expected = [
                'name,birthday,roll',
                'Rousan,1995-07-05,2',
                'Sumant,1996-08-04,89',
                'Ajay,1994-01-03,31',
                'Sushant,1994-01-03,99',
                'Samim,1994-01-03,12',
                'Akash,1994-01-03,20'
            ].join('\n');

            expect(dm.serialize(DataFormat.DSV_STR)).to.eql(expected);

            expected = [
                'name\tbirthday\troll',
                'Rousan\t1995-07-05\t2',
                'Sumant\t1996-08-04\t89',
                'Ajay\t1994-01-03\t31',
                'Sushant\t1994-01-03\t99',
                'Samim\t1994-01-03\t12',
                'Akash\t1994-01-03\t20'
            ].join('\n');

            expect(dm.serialize(DataFormat.DSV_STR, { fieldSeparator: '\t' })).to.eql(expected);
        });

        it('should return dsv array for DSVArr data type', () => {
            const expected = [
                ['name', 'birthday', 'roll'],
                ['Rousan', '1995-07-05', 2],
                ['Sumant', '1996-08-04', 89],
                ['Ajay', '1994-01-03', 31],
                ['Sushant', '1994-01-03', 99],
                ['Samim', '1994-01-03', 12],
                ['Akash', '1994-01-03', 20]
            ];

            expect(dm.serialize(DataFormat.DSV_ARR)).to.eql(expected);
        });

        it('should return data in input data format if type is not specified', () => {
            const mockedSchema = [
                {
                    name: 'name',
                    type: 'dimension'
                },
                {
                    name: 'birthday',
                    type: 'dimension',
                    subtype: 'temporal',
                    format: '%Y-%m-%d'
                },
                {
                    name: 'roll',
                    type: 'measure'
                }
            ];
            const mockedData = 'name,birthday,roll\nRousan,1995-07-05,2\nSumant,1996-08-04,89\nAjay,1994-01-03,31';
            dm = new DataModel(mockedData, mockedSchema, { dataFormat: DataFormat.DSV_STR });

            const expected = [
                'name,birthday,roll',
                'Rousan,1995-07-05,2',
                'Sumant,1996-08-04,89',
                'Ajay,1994-01-03,31'
            ].join('\n');

            expect(dm.serialize()).to.eql(expected);
        });

        it('should throw an error if data type is not supported', () => {
            const mockedFn = () => dm.serialize('erroneous-data-type');
            expect(mockedFn).to.throw('Data type erroneous-data-type is not supported');
        });
    });

    describe('#getName', () => {
        const dataModel = new DataModel([], [], { name: 'ModelA' });

        it('should return user-defined name of the datamodel instance', () => {
            expect(dataModel.getName()).to.equal('ModelA');
        });
    });

    describe('#isEmpty', () => {
        const data = [
            { age: 30, job: 'unemployed', marital: 'married' },
            { age: 33, job: 'services', marital: 'married' },
            { age: 35, job: 'management', marital: 'single' }
        ];
        const schema = [
            { name: 'age', type: 'measure' },
            { name: 'job', type: 'dimension' },
            { name: 'marital', type: 'dimension' },
        ];
        const dataModel = new DataModel([], []);
        const dataModel1 = new DataModel(data, schema);

        it('should return true if datamodel instance has no data', () => {
            expect(dataModel.isEmpty()).to.be.true;
        });
        it('should return false if datamodel instance has data', () => {
            expect(dataModel1.isEmpty()).to.be.false;
        });
    });
});
