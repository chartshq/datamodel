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
        temParser = new TemporalParser(schema);
    });

    describe('#parse', () => {
        it('should return milliseconds for the formatted value', () => {
            const dateStr = '2017-03-01';
            const expectedTs = new DateTimeFormatter(schema.format).getNativeDate(dateStr).getTime();
            expect(temParser.parse(dateStr)).to.equal(expectedTs);
        });

        it('should bypass to Date API when format is not present', () => {
            const val = 1540629018697;
            temParser = new TemporalParser(Object.assign({}, schema, { format: undefined }));
            expect(temParser.parse(val)).to.equal(+new Date(val));
        });

        it('should return current timestamp for invalid formatted date value', () => {
            const dateStr = 'invalid format';
            expect(temParser.parse(dateStr)).to.equal(Date.now());
        });

        it('should return default invalid type for invalid value', () => {
            expect(temParser.parse(null)).to.eql(DataModel.InvalidAwareTypes.NULL);
            expect(temParser.parse(undefined)).to.equal(DataModel.InvalidAwareTypes.NA);
        });
    });
});
