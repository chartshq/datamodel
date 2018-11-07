/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import PartialField from '../partial-field';
import { FieldType, MeasureSubtype } from '../../enums';
import ContinuousParser from '../parsers/continuous-parser';
import Continuous from './index';

describe('Continuous', () => {
    const schema = {
        name: 'Age',
        type: FieldType.MEASURE,
        subtype: MeasureSubtype.CONTINUOUS
    };
    const data = [18, 26, 12, 33, 56, 45, 26, 19, 18];
    let contParser;
    let partField;
    let rowDiffset;
    let contField;

    beforeEach(() => {
        contParser = new ContinuousParser();
        partField = new PartialField(schema.name, data, schema, contParser);
        rowDiffset = '0-8';
        contField = new Continuous(partField, rowDiffset);
    });

    describe('#subtype', () => {
        it('should return the correct subtype', () => {
            expect(contField.subtype()).to.equal(schema.subtype);
        });
    });

    describe('#calculateDataDomain', () => {
        it('should return the field domain', () => {
            const expected = [12, 56];
            expect(contField.calculateDataDomain()).to.eql(expected);
        });
    });
});
