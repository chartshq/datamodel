/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import Value from './value';

describe('Value', () => {
    const fieldValue = 'India';
    const fieldName = 'Country';
    const rawDate = 31516200000;
    const formattedDate = '1970-01-01';
    const anotherFieldName = 'Ranking';
    let value;
    let anotherValue;

    beforeEach(() => {
        value = new Value(fieldValue, fieldValue, fieldName);
        anotherValue = new Value(formattedDate, rawDate, anotherFieldName);
    });

    it('should hold primitive value of a field cell', () => {
        expect(value.value).to.equal(fieldValue);
        expect(value.formattedValue).to.equal(fieldValue);
        expect(value.internalValue).to.equal(fieldValue);
        expect(value.field).to.equal(fieldName);

        expect(anotherValue.value).to.equal(formattedDate);
        expect(anotherValue.formattedValue).to.equal(formattedDate);
        expect(anotherValue.internalValue).to.equal(rawDate);
        expect(anotherValue.field).to.equal(anotherFieldName);
    });

    describe('#toString', () => {
        it('should return human readable string of the field value', () => {
            expect(value.toString()).to.equal(String(fieldValue));
            expect(anotherValue.toString()).to.equal(String(formattedDate));
        });
    });

    describe('#valueOf', () => {
        it('should return the field value', () => {
            expect(value.valueOf()).to.equal(fieldValue);
            expect(anotherValue.valueOf()).to.equal(formattedDate);
        });
    });
});
