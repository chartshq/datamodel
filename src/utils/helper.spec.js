/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { isArray, isObject, isCallable, isString, uniqueValues, isArrEqual, detectDataFormat } from './helper';
import { DataFormat } from '../enums';

describe('Utils', () => {
    describe('#isArray', () => {
        it('should return true for array value', () => {
            expect(isArray([])).to.be.true;
            expect(isArray([1, 2])).to.be.true;
        });

        it('should return false for non-array values', () => {
            expect(isArray(8)).to.be.false;
            expect(isArray(undefined)).to.be.false;
        });
    });

    describe('#isObject', () => {
        it('should return true for object value', () => {
            expect(isObject({})).to.be.true;
            expect(isObject([1, 2])).to.be.true;
            expect(isObject(() => {})).to.be.true;
        });

        it('should return false for non-object values', () => {
            expect(isObject(8)).to.be.false;
            expect(isObject(undefined)).to.be.false;
        });
    });

    describe('#isCallable', () => {
        it('should return true for function value', () => {
            expect(isCallable(() => {})).to.be.true;
            expect(isCallable(Object)).to.be.true;
        });

        it('should return false for non-function values', () => {
            expect(isCallable(8)).to.be.false;
            expect(isCallable(undefined)).to.be.false;
        });
    });

    describe('#isString', () => {
        it('should return true for string value', () => {
            expect(isString('abc')).to.be.true;
        });

        it('should return false for non-string values', () => {
            expect(isString(8)).to.be.false;
            expect(isString(Object)).to.be.false;
        });
    });

    describe('#uniqueValues', () => {
        it('should return unique values from input array', () => {
            expect(uniqueValues([1, 2, 1, 3]).sort()).to.deep.equal([1, 2, 3]);
            expect(uniqueValues([])).to.deep.equal([]);
        });
    });

    describe('#isArrEqual', () => {
        it('should return true for two arrays with same content', () => {
            expect(isArrEqual([1, 2, 3], [1, 2, 3])).to.be.true;
            expect(isArrEqual([], [])).to.be.true;
        });

        it('should return false for two arrays with different content', () => {
            expect(isArrEqual([1, 2, 3], [1, 3, 2])).to.be.false;
            expect(isArrEqual([1], [2])).to.be.false;
            expect(isArrEqual([1, 2], [2])).to.be.false;
        });

        it('should use strict equality operator for non-array values', () => {
            expect(isArrEqual([1, 2, 3], undefined)).to.be.false;
            expect(isArrEqual({}, {})).to.be.false;
            expect(isArrEqual(2, 2)).to.be.true;
            expect(isArrEqual(undefined, undefined)).to.be.true;
        });
    });

    describe('#detectDataFormat', () => {
        it('should return the correct data format for the input data', () => {
            let data = 'a,b,c\n1,2,3\na,b,c';
            expect(detectDataFormat(data)).is.equal(DataFormat.DSV_STR);

            data = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 44, c: 222 }];
            expect(detectDataFormat(data)).is.equal(DataFormat.FLAT_JSON);

            data = [];
            expect(detectDataFormat(data)).is.equal(DataFormat.FLAT_JSON);

            data = [['a', 'b', 'c'], [1, 2, 3], [44, 55, 66]];
            expect(detectDataFormat(data)).is.equal(DataFormat.DSV_ARR);
        });

        it('should return null for invalid formatted data', () => {
            let data = {};
            expect(detectDataFormat(data)).is.null;

            data = 222;
            expect(detectDataFormat(data)).is.null;
        });
    });
});
