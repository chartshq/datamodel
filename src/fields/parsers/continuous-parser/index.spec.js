/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import ContinuousParser from './index';
import DataModel from '../../../';

describe('ContinuousParser', () => {
    let contParser;

    beforeEach(() => {
        contParser = new ContinuousParser();
    });

    describe('#parse', () => {
        it('should parse the number value', () => {
            const val = 123;
            expect(contParser.parse(val)).to.equal(val);
        });

        it('should parse stringified number value', () => {
            expect(contParser.parse('1234')).to.equal(1234);
            expect(contParser.parse('1234.33')).to.equal(1234.33);
            expect(contParser.parse('1234abc')).to.equal(1234);
            expect(contParser.parse('1234.33abc')).to.equal(1234.33);
        });

        it('should return default invalid type when value is not number convertible', () => {
            expect(contParser.parse('abc1234')).to.eql(DataModel.InvalidAwareTypes.NA);
            expect(contParser.parse('abcd')).to.eql(DataModel.InvalidAwareTypes.NA);
            expect(contParser.parse(null)).to.eql(DataModel.InvalidAwareTypes.NULL);
            expect((contParser.parse(null)) instanceof DataModel.InvalidAwareTypes).to.be.true;
            expect(contParser.parse(undefined)).to.eql(DataModel.InvalidAwareTypes.NA);
        });
    });
});
