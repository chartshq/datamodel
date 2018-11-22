/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import BinnedParser from './index';

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

        it('should return null for invalid formatted value', () => {
            expect(binParser.parse(null)).to.be.null;
            expect(binParser.parse(undefined)).to.be.null;
            expect(binParser.parse('abc')).to.be.null;
            expect(binParser.parse('10-12,13-22')).to.be.null;
            expect(binParser.parse('10-')).to.be.null;
        });
    });
});
