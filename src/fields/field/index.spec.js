/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { DimensionSubtype } from '../../enums';
import TemporalParser from '../parsers/temporal-parser';
import Field from './index';

describe('Field', () => {
    const schema = {
        name: 'Date',
        type: 'dimension',
        subtype: DimensionSubtype.TEMPORAL,
        format: '%Y-%m-%d',
        description: 'The is a test field',
        displayName: 'date'
    };
    const data = ['2017-03-01', '2017-03-02', '2017-03-03', '2018-01-06', '2019-11-07'];
    let temParser;
    let partField;
    let rowDiffset;
    let field;

    beforeEach(() => {
        temParser = new TemporalParser(schema);
        partField = new PartialField(schema.name, data, schema, temParser);
        rowDiffset = '1-2,4';
        field = new Field(partField, rowDiffset);
    });

    describe('#constructor', () => {
        it('should have essential attributes', () => {
            expect(field.partialField).to.equal(partField);
            expect(field.rowDiffset).to.equal(rowDiffset);
        });
    });

    describe('#domain', () => {
        it('should be abstract, not be implemented', () => {
            expect(field.domain).to.throw(Error, 'Not yet implemented');
        });
    });


    describe('#schema', () => {
        it('should return the field schema', () => {
            expect(field.schema()).to.eql(schema);
        });
    });

    describe('#name', () => {
        it('should return the field name', () => {
            expect(field.name()).to.equal(schema.name);
        });
    });

    describe('#type', () => {
        it('should return the field type', () => {
            expect(field.type()).to.equal(schema.type);
        });
    });

    describe('#subtype', () => {
        it('should return the field subtype', () => {
            expect(field.subtype()).to.equal(schema.subtype);
        });
    });

    describe('#description', () => {
        it('should return the field description', () => {
            expect(field.description()).to.equal(schema.description);
        });
    });

    describe('#displayName', () => {
        it('should return the field displayName', () => {
            expect(field.displayName()).to.equal(schema.displayName);
        });

        it('should return the field name, if displayName is not present', () => {
            const newSchema = Object.assign(schema, { displayName: undefined });
            temParser = new TemporalParser(newSchema);
            partField = new PartialField(newSchema.name, data, newSchema, temParser);
            rowDiffset = '1-2,4';
            field = new Field(partField, rowDiffset);

            expect(field.displayName()).to.equal(newSchema.name);
        });
    });

    describe('#data', () => {
        it('should return the associated data', () => {
            const expected = [1488393000000, 1488479400000, 1573065000000];
            expect(field.data()).to.eql(expected);
        });
    });
});
