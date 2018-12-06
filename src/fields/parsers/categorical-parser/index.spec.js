/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import CategoricalParser from './index';
import { getNullValuesMap } from '../../../null-values';

describe('CategoricalParser', () => {
    let catParser;
    let nullValuesMap;

    beforeEach(() => {
        catParser = new CategoricalParser();
        nullValuesMap = getNullValuesMap();
    });

    describe('#parse', () => {
        it('should return stringified and trimmed form of the field value', () => {
            expect(catParser.parse('India')).to.equal('India');
            expect(catParser.parse(1234)).to.equal('1234');
            expect(catParser.parse(' India   ')).to.equal('India');
        });

        it('should not touch the undefined, null or empty string value', () => {
            expect(catParser.parse(undefined)).to.equal(nullValuesMap.undefined);
            expect(catParser.parse(null)).to.equal(nullValuesMap.null);
            expect(catParser.parse('')).to.equal('');
            expect(catParser.parse('   ')).to.equal('');
        });
    });
});
