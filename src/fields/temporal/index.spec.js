/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { DimensionSubtype } from '../../enums';
import TemporalParser from '../parsers/temporal-parser';
import Temporal from './index';

describe('Temporal', () => {
    const schema = {
        name: 'Date',
        type: 'dimension',
        subtype: DimensionSubtype.TEMPORAL,
        format: '%Y-%m-%d',
        description: 'The is a test field',
        displayName: 'date'
    };
    const data = ['2017-03-01', '2017-03-02', '2017-03-03', '2018-01-06', '2019-11-07'];
    let temParser;
    let partField;
    let rowDiffset;
    let tempField;

    beforeEach(() => {
        temParser = new TemporalParser(schema);
        partField = new PartialField(schema.name, data, schema, temParser);
        rowDiffset = '1-2,4';
        tempField = new Temporal(partField, rowDiffset);
    });

    describe('#calculateDataDomain', () => {
        it('should return the field domain', () => {
            const expected = [1488393000000, 1488479400000, 1573065000000];
            expect(tempField.calculateDataDomain()).to.eql(expected);
        });
    });

    describe('#minimumConsecutiveDifference', () => {
        it('should return the minimum diff', () => {
            const expected = 86400000;
            expect(tempField.minimumConsecutiveDifference()).to.equal(expected);
        });

        it('should return null if there is only one data item', () => {
            temParser = new TemporalParser(schema);
            partField = new PartialField(schema.name, data, schema, temParser);
            rowDiffset = '2';
            tempField = new Temporal(partField, rowDiffset);
            expect(tempField.minimumConsecutiveDifference()).to.be.null;
        });
    });

    describe('#format', () => {
        it('should return the field datetime format', () => {
            expect(tempField.format()).to.equal(schema.format);
        });
    });
});
