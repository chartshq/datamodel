/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { fnList } from './group-by-function';


describe('groupBy function tests', () => {
    it('sum test', () => {
        expect(fnList.sum([10, 12, 17])).to.equal(39);
    });
    it('sum test', () => {
        expect(fnList.sum([[10, 20], [12, 22], [27, 17]])).to.deep.equal([49, 59]);
    });
    it('mean test', () => {
        expect(fnList.mean([10, 12, 17])).to.equal(39 / 3);
    });
    it('mean test', () => {
        expect(fnList.mean([[10, 20], [12, 22], [27, 17]])).to.deep.equal([49 / 3, 59 / 3]);
    });
    it('min test', () => {
        expect(fnList.min([10, 12, 17])).to.equal(10);
    });
    it('min test', () => {
        expect(fnList.min([[10, 20], [12, 22], [27, 17]])).to.deep.equal([10, 17]);
    });
    it('max test', () => {
        expect(fnList.max([10, 12, 17])).to.equal(17);
    });
    it('max test', () => {
        expect(fnList.max([[10, 20], [12, 22], [27, 17]])).to.deep.equal([27, 22]);
    });
    it('firstValue test', () => {
        expect(fnList.firstValue([10, 12, 17])).to.equal(10);
    });
    it('firstValue test', () => {
        expect(fnList.firstValue([[10, 20], [12, 22], [27, 17]])).to.deep.equal([10, 20]);
    });
    it('lastValue test', () => {
        expect(fnList.lastValue([10, 12, 17])).to.equal(17);
    });
    it('lastValue test', () => {
        expect(fnList.lastValue([[10, 20], [12, 22], [27, 17]])).to.deep.equal([27, 17]);
    });
    it('count test', () => {
        expect(fnList.count([10, 12, 17])).to.equal(3);
    });
    it('count test', () => {
        expect(fnList.count([[10, 20], [12, 22], [27, 17]])).to.deep.equal([3, 3]);
    });
});
