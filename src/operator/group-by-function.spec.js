/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { fnList } from './group-by-function';


describe('groupBy function tests', () => {
    describe('#sum', () => {
        it('should return sum for 1D array', () => {
            expect(fnList.sum([10, 12, 17])).to.equal(39);
        });
        it('should return NaN for nested array', () => {
            expect(fnList.sum([[10, 12], [9, 16]])).to.be.NaN;
        });
        it('should return null for an empty Array', () => {
            expect(fnList.sum([])).to.equal(null);
        });
    });
    describe('#avg', () => {
        it('should return Average for 1D Array', () => {
            expect(fnList.avg([10, 12, 17])).to.equal(39 / 3);
        });
        it('should return NaN for nested array', () => {
            expect(fnList.avg([[10, 12], [9, 16]])).to.be.NaN;
        });
        it('should return null for an empty Array', () => {
            expect(fnList.avg([])).to.equal(null);
        });
    });
    describe('#min', () => {
        it('should return min for 1D Array', () => {
            expect(fnList.min([10, 12, 17])).to.equal(10);
        });
        it('should return NaN for nested Array', () => {
            expect(fnList.min([[10, 12], [9, 16]])).to.be.NaN;
        });
        it('should return null for empty Array', () => {
            expect(fnList.min([])).to.equal(null);
        });
    });
    describe('#max', () => {
        it('should return max for 1D Array', () => {
            expect(fnList.max([10, 12, 17])).to.equal(17);
        });
        it('should return NaN for nested Array', () => {
            expect(fnList.max([[10, 12], [15, 17]])).to.be.NaN;
        });
        it('should return null for empty Array', () => {
            expect(fnList.max([])).to.equal(null);
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
    });
    describe('#std', () => {
        it('should return standard deviation for 1D Array', () => {
            expect(Math.ceil(fnList.std([10, 12, 17]))).to.equal(Math.ceil(2.9));
        });
    });
});
