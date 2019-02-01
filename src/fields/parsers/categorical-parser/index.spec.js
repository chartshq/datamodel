/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import CategoricalParser from './index';
import DataModel from '../../../';

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

        it('should not touch the empty string value', () => {
            expect(catParser.parse('')).to.equal('');
            expect(catParser.parse('   ')).to.equal('');
        });

        it('should parse invalid values to their default invalid types', () => {
            expect(catParser.parse(undefined)).to.equal(DataModel.InvalidAwareTypes.NA);
            expect(catParser.parse(null)).to.equal(DataModel.InvalidAwareTypes.NULL);
        });
    });
});
