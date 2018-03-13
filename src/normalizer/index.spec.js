/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import normalize from '.';

describe('Normalize', () => {
    it('valid Data ', () => {
        const svgStr = '10, 20, d \n 15, 25, demo',
            schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            ],
            retArr = [
            [10, 15],
            [20, 25],
            ['d', 'demo'],
            ];
        expect(normalize(svgStr, schema)).to.deep.equal(retArr);
    });
});
