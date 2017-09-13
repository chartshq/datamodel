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
        const retArr = {
            schema,
            data: [[10, 20, 'd'], [15, 25, 'demo']],
        };
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
        const retArr = {
            schema,
            data: [[10, 20, 'd', ''], [15, 25, 'demo', '']],
        };
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
    it('valid extra Data row', () => {
        const svgStr = '10, 20, d \n 15, 25, demo';
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
        ];
        const retArr = {
            schema,
            data: [[10, 20], [15, 25]],
        };
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
    it('blank Data ', () => {
        const svgStr = '';
        const schema = [];
        const retArr = {
            schema,
            data: [[]],
        };
        expect(parseCSV(svgStr, schema)).to.deep.equal(retArr);
    });
});
