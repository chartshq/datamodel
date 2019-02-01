/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { Categorical, Temporal, Binned, Continuous } from './fields';
import { createFields, createUnitFieldFromPartial } from './field-creator';
import { MeasureSubtype, DimensionSubtype } from './enums';

describe('Creating Field', () => {
    describe('#createUnitFieldFromPartial', () => {
        it('should return an array of correct field instances', () => {
            let mockedPartialField = {
                schema: { name: 'Country' }
            };
            let mockedRowDiffset = '1-2';
            expect(createUnitFieldFromPartial(mockedPartialField, mockedRowDiffset) instanceof Categorical).to.be.true;

            mockedPartialField.schema = { name: 'Country', type: 'dimension', subtype: DimensionSubtype.CATEGORICAL };
            expect(createUnitFieldFromPartial(mockedPartialField, mockedRowDiffset) instanceof Categorical).to.be.true;

            mockedPartialField.schema = { name: 'Country', type: 'dimension', subtype: DimensionSubtype.TEMPORAL };
            expect(createUnitFieldFromPartial(mockedPartialField, mockedRowDiffset) instanceof Temporal).to.be.true;

            mockedPartialField.schema = { name: 'Country', type: 'dimension', subtype: DimensionSubtype.BINNED };
            expect(createUnitFieldFromPartial(mockedPartialField, mockedRowDiffset) instanceof Binned).to.be.true;

            mockedPartialField.schema = { name: 'Country', type: 'dimension' };
            expect(createUnitFieldFromPartial(mockedPartialField, mockedRowDiffset) instanceof Categorical).to.be.true;

            mockedPartialField.schema = { name: 'Country', type: 'measure' };
            expect(createUnitFieldFromPartial(mockedPartialField, mockedRowDiffset) instanceof Continuous).to.be.true;

            mockedPartialField.schema = { name: 'Country', type: 'measure', subtype: MeasureSubtype.CONTINUOUS };
            expect(createUnitFieldFromPartial(mockedPartialField, mockedRowDiffset) instanceof Continuous).to.be.true;
        });
    });

    describe('#createFields', () => {
        it('should return an array of correct field instances', () => {
            const data = [
                ['India', 'China'],
                ['John', 'Smith'],
                ['2018-01-01', '2018-01-01'],
                ['10-20', '20-30'],
                [2000000, 4800000],
                [56000, 100000]
            ];
            const schema = [
                { name: 'Country', type: 'dimension' },
                { name: 'Name', type: 'dimension', subtype: DimensionSubtype.CATEGORICAL },
                { name: 'Date', type: 'dimension', subtype: DimensionSubtype.TEMPORAL, format: '%Y-%m-%d' },
                { name: 'Age', type: 'dimension', subtype: DimensionSubtype.BINNED, bins: [10, 20, 30, 45] },
                { name: 'Job', type: 'measure' },
                { name: 'Salary', type: 'measure', subtype: MeasureSubtype.CONTINUOUS }
            ];
            const headers = ['Country', 'Name', 'Date', 'Age', 'Job', 'Salary'];
            const fieldsArr = createFields(data, schema, headers);

            expect(fieldsArr.length === 6).to.be.true;
            expect(fieldsArr[0] instanceof Categorical).to.be.true;
            expect(fieldsArr[1] instanceof Categorical).to.be.true;
            expect(fieldsArr[2] instanceof Temporal).to.be.true;
            expect(fieldsArr[3] instanceof Binned).to.be.true;
            expect(fieldsArr[4] instanceof Continuous).to.be.true;
            expect(fieldsArr[5] instanceof Continuous).to.be.true;
        });

        it('should return categorical dimension field when type is not specified', () => {
            const data = [
                ['India', 'China'],
                [99000, 100000]
            ];
            const schema = [
                { name: 'Country' },
                { name: 'Salary', type: 'measure', subtype: MeasureSubtype.CONTINUOUS }
            ];
            const headers = ['Country', 'Salary'];
            const fieldsArr = createFields(data, schema, headers);

            expect(fieldsArr[0] instanceof Categorical).to.be.true;
        });
    });
});

