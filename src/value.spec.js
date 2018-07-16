/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import Value from './value';

describe('Value', () => {
    const fieldValue = 'India';
    const fieldName = 'Country';
    let value;

    beforeEach(() => {
        value = new Value(fieldValue, fieldName);
    });

    it('should hold primitive value of a field cell', () => {
        expect(value.value).to.equal(fieldValue);
        expect(value.field).to.equal(fieldName);
    });

    describe('#toString()', () => {
        it('should return human readable string of the field value', () => {
            expect(value.toString()).to.equal(String(fieldValue));
        });
    });

    describe('#valueOf()', () => {
        it('should return the field value', () => {
            expect(value.valueOf()).to.equal(fieldValue);
        });
    });
});
