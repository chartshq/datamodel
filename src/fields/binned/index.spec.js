/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { DimensionSubtype } from '../../enums';
import BinnedParser from '../parsers/binned-parser';
import Binned from './index';

describe('Binned', () => {
    const schema = {
        name: 'Origin',
        type: 'dimension',
        subtype: DimensionSubtype.BINNED,
        bins: [10, 20, 30, 45]
    };
    const data = ['10-20', '20-30', '10-20', '30-45', '20-30'];
    let binParser;
    let partField;
    let rowDiffset;
    let binField;

    beforeEach(() => {
        binParser = new BinnedParser();
        partField = new PartialField(schema.name, data, schema, binParser);
        rowDiffset = '0-4';
        binField = new Binned(partField, rowDiffset);
    });

    describe('#calculateDataDomain', () => {
        it('should return the field domain', () => {
            const expected = [10, 45];
            expect(binField.calculateDataDomain()).to.eql(expected);
        });
    });

    describe('#bins', () => {
        it('should return the bins config array', () => {
            expect(binField.bins).to.eql(schema.bins);
        });
    });
});
