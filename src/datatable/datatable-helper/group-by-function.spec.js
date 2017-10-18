/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { fnList } from './group-by-function';


describe('groupBy function tests', () => {
    it('sum test', () => {
        expect(fnList.sum([10, 12, 17])).to.equal(39);
    });
});
