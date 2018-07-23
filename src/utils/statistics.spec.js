/* global describe, context,it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import Statistics from './statistics';

context('Statistics function test', () => {
    describe('#Sum', () => {
        it('should return sum for 1D array', () => {
            expect(Statistics.Sum([10, 12, 17])).to.equal(39);
        });
    });
    describe('#Sum', () => {
        it('should return sum for 2D Array', () => {
            expect(Statistics.Sum([[10, 20], [12, 22], [27, 17]])).to.deep.equal([49, 59]);
        });
    });
    describe('#Average', () => {
        it('should return Average for 1D Array', () => {
            expect(Statistics.Average([10, 12, 17])).to.equal(39 / 3);
        });
    });
    describe('#Average', () => {
        it('should return avg for 2D Array', () => {
            expect(Statistics.Average([[10, 20], [12, 22], [27, 17]])).to.deep.equal([49 / 3, 59 / 3]);
        });
    });
    describe('#Min', () => {
        it('should return min for 1D Array', () => {
            expect(Statistics.Min([10, 12, 17])).to.equal(10);
        });
    });
    describe('#Min', () => {
        it('should return min for 2D Array', () => {
            expect(Statistics.Min([[10, 20], [12, 22], [27, 17]])).to.deep.equal([10, 17]);
        });
    });
    describe('#Max', () => {
        it('should return max for 1D Array', () => {
            expect(Statistics.Max([10, 12, 17])).to.equal(17);
        });
    });
    describe('#Max', () => {
        it('should return max for 2D Array', () => {
            expect(Statistics.Max([[10, 20], [12, 22], [27, 17]])).to.deep.equal([27, 22]);
        });
    });
    describe('#First', () => {
        it('should return first for 1D Array', () => {
            expect(Statistics.First([10, 12, 17])).to.equal(10);
        });
    });
    describe('#First', () => {
        it('should return first for 2D Array', () => {
            expect(Statistics.First([[10, 20], [12, 22], [27, 17]])).to.deep.equal([10, 20]);
        });
    });
    describe('#last', () => {
        it('should return last for 1D Array', () => {
            expect(Statistics.Last([10, 12, 17])).to.equal(17);
        });
    });
    describe('#Last', () => {
        it('should return last for 2D Array', () => {
            expect(Statistics.Last([[10, 20], [12, 22], [27, 17]])).to.deep.equal([27, 17]);
        });
    });
    describe('#Count', () => {
        it('should return count for 1D Array', () => {
            expect(Statistics.Count([10, 12, 17])).to.equal(3);
        });
    });
    describe('#count', () => {
        it('should return count for 2D Array', () => {
            expect(Statistics.Count([[10, 20], [12, 22], [27, 17]])).to.deep.equal([3, 3]);
        });
    });
    describe('#SD', () => {
        it('should return standard deviation for 1D Array', () => {
            expect(Math.ceil(Statistics.SD([10, 12, 17]))).to.equal(Math.ceil(2.9));
        });
    });
});
