/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import ContinuousParser from './index';
import { getNullValuesMap } from '../../../null-values';

describe('ContinuousParser', () => {
    let contParser;
    let nullValuesMap;

    beforeEach(() => {
        contParser = new ContinuousParser();
        nullValuesMap = getNullValuesMap();
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

        it('should return null when value is not number convertible', () => {
            expect(contParser.parse('abc1234')).to.equal(nullValuesMap.invalid);
            expect(contParser.parse('abcd')).to.equal(nullValuesMap.invalid);
        });
    });
});
