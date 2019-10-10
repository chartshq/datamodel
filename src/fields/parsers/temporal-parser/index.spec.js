/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import TemporalParser from './index';
import { DimensionSubtype } from '../../../enums';
import { DateTimeFormatter } from '../../../utils';
import DataModel from '../../../';

describe('TemporalParser', () => {
    const schema = {
        name: 'Date',
        type: 'dimension',
        subtype: DimensionSubtype.TEMPORAL,
        format: '%Y-%m-%d'
    };
    let temParser;

    beforeEach(() => {
        temParser = new TemporalParser();
    });

    describe('#parse', () => {
        it('should return milliseconds for the formatted value', () => {
            const dateStr = '2017-03-01';
            const expectedTs = new DateTimeFormatter(schema.format).getNativeDate(dateStr).getTime();
            expect(temParser.parse(dateStr, { format: schema.format })).to.equal(expectedTs);
        });

        it('should bypass to Date API when format is not present', () => {
            const val = 1540629018697;
            temParser = new TemporalParser();
            expect(temParser.parse(val, { format: undefined })).to.equal(+new Date(val));
        });

        it('should return default invalid type for invalid value', () => {
            expect(temParser.parse(null, { format: schema.format })).to.eql(DataModel.InvalidAwareTypes.NULL);
            expect(temParser.parse(undefined, { format: schema.format })).to.equal(DataModel.InvalidAwareTypes.NA);
            expect(temParser.parse('abcd', { format: schema.format })).to.equal(DataModel.InvalidAwareTypes.NA);
        });
        it('should return valid date for edge case', () => {
            expect(temParser.parse('', { format: schema.format })).to.equal(DataModel.InvalidAwareTypes.NA);

            temParser = new TemporalParser();
            expect(temParser.parse('1998', { format: '%Y' })).to.equal(new Date(1998, 0, 1).getTime());

            temParser = new TemporalParser();
            expect(temParser.parse('98', { format: '%y' })).to.equal(new Date(1998, 0, 1).getTime());

            expect(temParser.parse('abcd', { format: '%y' })).to.equal(DataModel.InvalidAwareTypes.NA);
        });
    });
});
