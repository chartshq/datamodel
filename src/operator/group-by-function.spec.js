/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { fnList } from './group-by-function';


describe('groupBy function tests', () => {
    describe('#sum', () => {
        it('should return sum for 1D array', () => {
            expect(fnList.sum([10, 12, 17])).to.equal(39);
        });
    });
    describe('#avg', () => {
        it('should return Average for 1D Array', () => {
            expect(fnList.avg([10, 12, 17])).to.equal(39 / 3);
        });
    });
    describe('#min', () => {
        it('should return min for 1D Array', () => {
            expect(fnList.min([10, 12, 17])).to.equal(10);
        });
    });
    describe('#max', () => {
        it('should return max for 1D Array', () => {
            expect(fnList.max([10, 12, 17])).to.equal(17);
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
    });
    describe('#std', () => {
        it('should return standard deviation for 1D Array', () => {
            expect(Math.ceil(fnList.std([10, 12, 17]))).to.equal(Math.ceil(2.9));
        });
    });
});
