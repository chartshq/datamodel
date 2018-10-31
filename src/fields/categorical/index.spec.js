/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { DimensionSubtype } from '../../enums';
import CategoricalParser from '../parsers/categorical-parser';
import Categorical from './index';

describe('Categorical', () => {
    const schema = {
        name: 'Origin',
        type: 'dimension',
        subtype: DimensionSubtype.CATEGORICAL
    };
    const data = ['India', 'US', 'Canada', 'India', 'US'];
    let catParser;
    let partField;
    let rowDiffset;
    let catField;

    beforeEach(() => {
        catParser = new CategoricalParser();
        partField = new PartialField(schema.name, data, schema, catParser);
        rowDiffset = '0-4';
        catField = new Categorical(partField, rowDiffset);
    });

    describe('#subtype', () => {
        it('should return the correct subtype', () => {
            expect(catField.subtype).to.equal(schema.subtype);
        });
    });

    describe('#calculateDataDomain', () => {
        it('should return the field domain', () => {
            const expected = ['India', 'US', 'Canada'];
            expect(catField.calculateDataDomain()).to.eql(expected);
        });
    });
});
