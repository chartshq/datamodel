/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import BinnedParser from './index';
import DataModel from '../../../';

describe('BinnedParser', () => {
    let binParser;

    beforeEach(() => {
        binParser = new BinnedParser();
    });

    describe('#parse', () => {
        it('should return the sanitized value', () => {
            expect(binParser.parse('10-11')).to.equal('10-11');
            expect(binParser.parse(' 10-11 ')).to.equal('10-11');
            expect(binParser.parse('10 - 11')).to.equal('10-11');
            expect(binParser.parse('5-6')).to.equal('5-6');
            expect(binParser.parse('+5-6')).to.equal('5-6');
        });

        it('should handle negative or floating-point values', () => {
            expect(binParser.parse('-10-11')).to.equal('-10-11');
            expect(binParser.parse(' -10 -11 ')).to.equal('-10-11');
            expect(binParser.parse(' 10.11 - 11 ')).to.equal('10.11-11');
            expect(binParser.parse(' -10.11 - 11.333 ')).to.equal('-10.11-11.333');
            expect(binParser.parse(' -10.11 - -11.567 ')).to.equal('-10.11--11.567');
            expect(binParser.parse(' -1.11 - -1.567 ')).to.equal('-1.11--1.567');
            expect(binParser.parse(' +1.11 - -1.567 ')).to.equal('1.11--1.567');
        });

        it('should return appropriate type for an invalid formatted value', () => {
            expect(binParser.parse(null)).to.equal(DataModel.InvalidAwareTypes.NULL);
            expect(binParser.parse(undefined)).to.equal(DataModel.InvalidAwareTypes.NA);
            expect(binParser.parse('abc')).to.equal(DataModel.InvalidAwareTypes.NA);
            expect(binParser.parse('nil')).to.equal(DataModel.InvalidAwareTypes.NIL);
            expect(binParser.parse('10-')).to.equal(DataModel.InvalidAwareTypes.NA);
        });
    });
});
