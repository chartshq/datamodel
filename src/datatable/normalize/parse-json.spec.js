/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import parseJSON from './parse-json';

describe('Checking parseJSON', () => {
    it('valid Data ', () => {
        const jsonData = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const retArr = [
            [10, 15],
            [20, 25],
            ['d', 'demo'],
        ];
        expect(parseJSON(jsonData, schema)).to.deep.equal(retArr);
    });
    it('valid Data with date', () => {
        const jsonData = [
            { a: '2012-1', aaa: 20, aaaa: 'd' },
            { a: '2012-2', aaa: 25, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'datetime', format: '%Y-%m' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const retArr = [
            [(new Date(2012, 0)).getTime(), (new Date(2012, 1)).getTime()],
            [20, 25],
            ['d', 'demo'],
        ];
        expect(parseJSON(jsonData, schema)).to.deep.equal(retArr);
    });
    it('valid extra schema Data ', () => {
        const jsonData = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            { name: 'aaaaa', type: 'dimension' },
        ];
        const retArr = [
            [10, 15],
            [20, 25],
            ['d', 'demo'],
            ['', ''],
        ];
        expect(parseJSON(jsonData, schema)).to.deep.equal(retArr);
    });
    it('valid extra Data row', () => {
        const jsonData = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
        ];
        const retArr = [
            [10, 15],
            [20, 25],
        ];
        expect(parseJSON(jsonData, schema)).to.deep.equal(retArr);
    });
    it('blank Data ', () => {
        const jsonData = [];
        const schema = [];
        const retArr = [];
        expect(parseJSON(jsonData, schema)).to.deep.equal(retArr);
    });
});
