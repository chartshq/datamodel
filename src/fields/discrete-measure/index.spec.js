/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { FieldType, MeasureSubtype } from '../../enums';
import DiscreteMeasureParser from '../parsers/discrete-measure-parser';
import DiscreteMeasure from './index';

describe('DiscreteMeasure', () => {
    const schema = {
        name: 'Age',
        type: FieldType.MEASURE,
        subtype: MeasureSubtype.DISCRETE,
        bins: {
            range: [],
            mid: []
        }
    };
    const data = [18, 26, 12, 33, 56, 45, 26, 19, 18];
    let disParser;
    let partField;
    let rowDiffset;
    let disField;

    beforeEach(() => {
        disParser = new DiscreteMeasureParser();
        partField = new PartialField(schema.name, data, schema, disParser);
        rowDiffset = '0-8';
        disField = new DiscreteMeasure(partField, rowDiffset);
    });

    describe('#calculateDataDomain', () => {
        it('should return the field domain', () => {
            const expected = ['12', '56'];
            expect(disField.calculateDataDomain()).to.eql(expected);
        });
    });

    describe('#bins', () => {
        it('should return the field bins config', () => {
            expect(disField.bins).to.equal(schema.bins);
        });
    });
});
