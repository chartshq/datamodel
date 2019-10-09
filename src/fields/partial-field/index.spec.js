/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from './index';
import { DimensionSubtype } from '../../enums';
import TemporalParser from '../parsers/temporal-parser';

describe('PartialField', () => {
    const schema = {
        name: 'Date',
        type: 'dimension',
        subtype: DimensionSubtype.TEMPORAL,
        format: '%Y-%m-%d',
        description: 'The is a test field'
    };
    const data = ['2017-03-01', '2017-03-02', '2017-03-03'];
    let partField;
    let temParser;

    beforeEach(() => {
        temParser = new TemporalParser();
        partField = new PartialField(schema.name, data, schema, temParser);
    });

    describe('#constructor', () => {
        it('should have essential attributes', () => {
            expect(partField.name).to.equal(schema.name);
            expect(partField.schema).to.eql(schema);
            expect(partField.parser).to.equal(temParser);
        });

        it('should sanitize the input data before use', () => {
            const expected = data.map(d => temParser.parse(d,{ format:schema.format }));
            expect(partField.data).to.eql(expected);
        });
    });
});
