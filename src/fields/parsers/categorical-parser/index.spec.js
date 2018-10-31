/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import CategoricalParser from './index';

describe('CategoricalParser', () => {
    let catParser;

    beforeEach(() => {
        catParser = new CategoricalParser();
    });

    describe('#parse', () => {
        it('should return stringified and trimmed form of the field value', () => {
            expect(catParser.parse('India')).to.equal('India');
            expect(catParser.parse(1234)).to.equal('1234');
            expect(catParser.parse(' India   ')).to.equal('India');
        });

        it('should not touch the undefined, null or empty string value', () => {
            expect(catParser.parse(undefined)).to.be.null;
            expect(catParser.parse(null)).to.be.null;
            expect(catParser.parse('')).to.equal('');
            expect(catParser.parse('   ')).to.equal('');
        });
    });
});
