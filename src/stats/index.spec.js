/* global describe, context,it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import * as Stats from './index';

context('statistics function tests', () => {
    describe('#sum', () => {
        it('should return sum for 1D array', () => {
            expect(Stats.sum([10, 12, 17])).to.equal(39);
        });
    });

    describe('#avg', () => {
        it('should return average for 1D Array', () => {
            expect(Stats.avg([10, 12, 17])).to.equal(39 / 3);
        });
    });

    describe('#min', () => {
        it('should return min for 1D Array', () => {
            expect(Stats.min([10, 12, 17])).to.equal(10);
        });
    });

    describe('#max', () => {
        it('should return max for 1D Array', () => {
            expect(Stats.max([10, 12, 17])).to.equal(17);
        });
    });

    describe('#first', () => {
        it('should return first for 1D Array', () => {
            expect(Stats.first([10, 12, 17])).to.equal(10);
        });
    });

    describe('#last', () => {
        it('should return last for 1D Array', () => {
            expect(Stats.last([10, 12, 17])).to.equal(17);
        });
    });

    describe('#count', () => {
        it('should return count for 1D Array', () => {
            expect(Stats.count([10, 12, 17])).to.equal(3);
        });
    });

    describe('#sd', () => {
        it('should return standard deviation for 1D Array', () => {
            expect(Math.ceil(Stats.sd([10, 12, 17]))).to.equal(Math.ceil(2.9));
        });
    });
});
