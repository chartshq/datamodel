/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import createFields from './create-fields';
import { Measure, Dimension, DateTime } from './fields';

describe('Checking createFields', () => {
    it('Checking for right Field type', () => {
        const data = [
            [new Date(2012, 0), new Date(2012, 1)],
            [20, 25],
            ['d', 'demo'],
        ];
        const schema = [
            { name: 'a', type: 'datetime', format: '%Y-%m' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const fieldsArr = createFields(data, schema);
        expect(fieldsArr[0] instanceof DateTime).to.be.true;
        expect(fieldsArr[1] instanceof Measure).to.be.true;
        expect(fieldsArr[2] instanceof Dimension).to.be.true;
    });
});
