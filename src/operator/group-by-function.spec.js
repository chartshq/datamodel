/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { fnList } from './group-by-function';
import InvalidAwareTypes from '../invalid-aware-types';


describe('groupBy function tests', () => {
    describe('#sum', () => {
        it('should return sum for 1D array', () => {
            expect(fnList.sum([10, 12, 17])).to.equal(39);
        });
        it('should return null for nested array', () => {
            expect(fnList.sum([[10, 12], [9, 16]])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for an empty Array', () => {
            expect(fnList.sum([])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for an empty input', () => {
            expect(fnList.sum()).eql(InvalidAwareTypes.NULL);
        });
        it('should filter out null and undefined values', () => {
            expect(fnList.sum([10, 12, 17, InvalidAwareTypes.NULL, InvalidAwareTypes.NULL])).to.equal(39);
        });
    });
    describe('#avg', () => {
        it('should return Average for 1D Array', () => {
            expect(fnList.avg([10, 12, 17])).to.equal(39 / 3);
        });
        it('should return null for nested array', () => {
            expect(fnList.avg([[10, 12], [9, 16]])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for an empty Array', () => {
            expect(fnList.avg([])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for an empty input', () => {
            expect(fnList.avg()).eql(InvalidAwareTypes.NULL);
        });
    });
    describe('#min', () => {
        it('should return min for 1D Array', () => {
            expect(fnList.min([10, 12, 17])).to.equal(10);
        });
        it('should return null for nested Array', () => {
            expect(fnList.min([[10, 12], [9, 16]])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for empty Array', () => {
            expect(fnList.min([])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for an empty input', () => {
            expect(fnList.min()).eql(InvalidAwareTypes.NULL);
        });
    });
    describe('#max', () => {
        it('should return max for 1D Array', () => {
            expect(fnList.max([10, 12, 17])).to.equal(17);
        });
        it('should return null for nested Array', () => {
            expect(fnList.max([[10, 12], [15, 17]])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for empty Array', () => {
            expect(fnList.max([])).eql(InvalidAwareTypes.NULL);
        });
        it('should return null for an empty input', () => {
            expect(fnList.max()).eql(InvalidAwareTypes.NULL);
        });
    });
    describe('#first', () => {
        it('should return first for 1D Array', () => {
            expect(fnList.first([10, 12, 17])).to.equal(10);
        });
    });
    describe('#last', () => {
        it('should return last for 1D Array', () => {
            expect(fnList.last([10, 12, 17])).to.equal(17);
        });
    });
    describe('#count', () => {
        it('should return count for 1D Array', () => {
            expect(fnList.count([10, 12, 17])).to.equal(3);
        });
        it('should return count for nested Array', () => {
            expect(fnList.count([[10, 12], [15, 17]])).to.equal(2);
        });
        it('should return count for empty Array', () => {
            expect(fnList.count([])).to.equal(0);
        });
        it('should return null for an empty input', () => {
            expect(fnList.count()).eql(InvalidAwareTypes.NULL);
        });
    });
    describe('#std', () => {
        it('should return standard deviation for 1D Array', () => {
            expect(Math.ceil(fnList.std([10, 12, 17]))).to.equal(Math.ceil(2.9));
        });
    });
});
