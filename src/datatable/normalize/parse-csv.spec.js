/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import parseCSV from './parse-csv';

describe('Checking parseCSV', () => {
    it('valid Data ', () => {
        const svgStr = '10, 20, d \n 15, 25, demo';
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
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
    it('valid Data with date', () => {
        const svgStr = '2012-1, 20, d \n 2012-2, 25, demo';
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
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
    it('valid extra schema Data ', () => {
        const svgStr = '10, 20, d \n 15, 25, demo';
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
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
    it('valid extra Data row', () => {
        const svgStr = '10, 20, d \n 15, 25, demo';
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
        ];
        const retArr = [
            [10, 15],
            [20, 25],
        ];
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
    it('blank Data ', () => {
        const svgStr = '';
        const schema = [];
        const retArr = [];
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
});
