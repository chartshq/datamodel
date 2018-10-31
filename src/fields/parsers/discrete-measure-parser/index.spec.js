/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DiscreteMeasureParser from './index';

describe('DiscreteMeasureParser', () => {
    let disParser;

    beforeEach(() => {
        disParser = new DiscreteMeasureParser();
    });

    describe('#parse', () => {
        it('should return stringified and trimmed form of the field value', () => {
            expect(disParser.parse('India')).to.equal('India');
            expect(disParser.parse(1234)).to.equal('1234');
            expect(disParser.parse(' India   ')).to.equal('India');
        });

        it('should not touch the undefined, null or empty string value', () => {
            expect(disParser.parse(undefined)).to.be.null;
            expect(disParser.parse(null)).to.be.null;
            expect(disParser.parse('')).to.equal('');
            expect(disParser.parse('   ')).to.equal('');
        });
    });
});
