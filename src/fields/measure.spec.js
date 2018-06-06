/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { FieldType } from 'picasso-util';
import Measure from './measure';

describe('Measure Field Type', () => {
    const schema = {
        name: 'Miles_per_Gallon',
        type: FieldType.MEASURE,
        unit: 'cm',
        scale: '1000',
        numberformat: '12-3-3',
        description: 'This is description',
        defAggFn: () => {}
    };
    const data = [1, 3, 4, 78];
    let field;

    beforeEach(() => {
        field = new Measure(schema.name, data, schema);
    });

    it('should implement getter methods', () => {
        expect(field.unit()).to.equal(schema.unit);
        expect(field.scale()).to.equal(schema.scale);
        expect(field.numberformat()).to.equal(schema.numberformat);
        expect(field.defAggFn()).to.equal(schema.defAggFn);
    });

    describe('#prototype.domain()', () => {
        it('should return measure domain', () => {
            const domain = field.domain();
            expect(domain).to.deep.equal([1, 78]);
        });
    });

    describe('#prototype.parse()', () => {
        it('should return number for parsable field value', () => {
            expect(field.parse('123')).to.equal(123);
        });

        it('should return null for non-parsable field value', () => {
            expect(field.parse('not-a-number')).to.null;
            expect(field.parse(NaN)).to.null;
        });
    });
});
