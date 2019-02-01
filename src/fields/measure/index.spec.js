/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { defaultReducerName } from '../../operator/group-by-function';
import { formatNumber } from '../../utils';
import { FieldType, MeasureSubtype } from '../../enums';
import ContinuousParser from '../parsers/continuous-parser';
import Measure from './index';

describe('Measure', () => {
    const schema = {
        name: 'Age',
        type: FieldType.MEASURE,
        subtype: MeasureSubtype.CONTINUOUS,
        defAggFn: 'max',
        numberFormat: Number,
        unit: '$',
    };
    const data = [18, 26, 12, 33, 56, 45, 26, 19, 18];
    let contParser;
    let partField;
    let rowDiffset;
    let measField;

    beforeEach(() => {
        contParser = new ContinuousParser();
        partField = new PartialField(schema.name, data, schema, contParser);
        rowDiffset = '0-8';
        measField = new Measure(partField, rowDiffset);
    });

    describe('#domain', () => {
        it('should return the field domain and cache the domain', () => {
            measField.calculateDataDomain = function() {
                return [Math.min(...this.data()), Math.max(...this.data())];
            };

            const expected = [12, 56];
            expect(measField.domain()).to.eql(expected);
            expect(measField._cachedDomain).to.eql(expected);
        });

        it('should return the cached domain if it exists', () => {
            const mockedDomain = [34, 79];
            measField._cachedDomain = mockedDomain;

            expect(measField.domain()).to.eql(mockedDomain);
        });
    });

    describe('#unit', () => {
        it('should return the field unit', () => {
            expect(measField.unit()).to.equal(schema.unit);
        });
    });

    describe('#defAggFn', () => {
        it('should return the field aggregation function name', () => {
            expect(measField.defAggFn()).to.equal(schema.defAggFn);
        });

        it('should return the default aggregation function, if it is not given', () => {
            const newSchema = Object.assign(schema, { defAggFn: undefined });
            contParser = new ContinuousParser();
            partField = new PartialField(newSchema.name, data, newSchema, contParser);
            rowDiffset = '0-8';
            measField = new Measure(partField, rowDiffset);
            expect(measField.defAggFn()).to.equal(defaultReducerName);
        });
    });

    describe('#numberFormat', () => {
        it('should return the field numberFormat function', () => {
            expect(measField.numberFormat()).to.equal(schema.numberFormat);
        });

        it('should return the default numberFormat function, if it is not given', () => {
            const newSchema = Object.assign(schema, { numberFormat: undefined });
            contParser = new ContinuousParser();
            partField = new PartialField(newSchema.name, data, newSchema, contParser);
            rowDiffset = '0-8';
            measField = new Measure(partField, rowDiffset);
            expect(measField.numberFormat()).to.equal(formatNumber);
        });
    });

    describe('#calculateDataDomain', () => {
        it('should be abstract, not be implemented', () => {
            expect(measField.calculateDataDomain).to.throw(Error, 'Not yet implemented');
        });
    });

    describe('#formattedData', () => {
        it('should return the formatted data', () => {
            const expected = [18, 26, 12, 33, 56, 45, 26, 19, 18];
            expect(measField.formattedData()).to.eql(expected);
        });
    });
});
