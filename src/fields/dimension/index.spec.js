/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { DimensionSubtype } from '../../enums';
import CategoricalParser from '../parsers/categorical-parser';
import Dimension from './index';

describe('Dimension', () => {
    const schema = {
        name: 'Origin',
        type: 'dimension',
        subtype: DimensionSubtype.CATEGORICAL
    };
    const data = ['India', 'US', 'Canada', 'India', 'US'];
    let catParser;
    let partField;
    let rowDiffset;
    let dimField;

    beforeEach(() => {
        catParser = new CategoricalParser();
        partField = new PartialField(schema.name, data, schema, catParser);
        rowDiffset = '0-4';
        dimField = new Dimension(partField, rowDiffset);
    });

    describe('#calculateDataDomain', () => {
        it('should be abstract, not be implemented', () => {
            expect(dimField.calculateDataDomain).to.throw(Error, 'Not yet implemented');
        });
    });


    describe('#domain', () => {
        it('should return the field domain and cache the domain', () => {
            dimField.calculateDataDomain = function() {
                return [...new Set(this.data())];
            };

            const expected = ['India', 'US', 'Canada'];
            expect(dimField.domain()).to.eql(expected);
            expect(dimField._cachedDomain).to.eql(expected);
        });

        it('should return the cached domain if it exists', () => {
            const mockedDomain = ['India', 'US', 'Canada'];
            dimField._cachedDomain = mockedDomain;

            expect(dimField.domain()).to.eql(mockedDomain);
        });
    });

    describe('#formattedData', () => {
        it('should return the formatted data', () => {
            const expected = ['India', 'US', 'Canada', 'India', 'US'];
            expect(dimField.formattedData()).to.eql(expected);
        });
    });
});
