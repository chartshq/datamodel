/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { isArray, isObject, isString } from './index';

describe('Checking utils functions', () => {
    it('isArray ', () => {
        expect(isArray([])).to.be.true;
        expect(isArray('')).to.be.false;
        expect(isArray({})).to.be.false;
        expect(isArray(() => {})).to.be.false;
    });
    it('isObject ', () => {
        expect(isObject([])).to.be.true;
        expect(isObject('')).to.be.false;
        expect(isObject({})).to.be.true;
        expect(isObject(() => {})).to.be.true;
    });
    it('isString ', () => {
        expect(isString([])).to.be.false;
        expect(isString('')).to.be.true;
        expect(isString({})).to.be.false;
        expect(isString(() => {})).to.be.false;
    });
});
