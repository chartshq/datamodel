/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import createFields from './create-fields';
import { Measure, Categorical, DateTime } from './fields';

describe('#createFields', () => {
    it('should return the correct field type', () => {
        const data = [
            [new Date(2012, 0), new Date(2012, 1)],
            [20, 25],
            ['d', 'demo'],
            [{}, {}]
        ];
        const schema = [
            { name: 'a', type: 'dimension', subtype: 'temporal', format: '%Y-%m' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
            { name: 'aaaaa' },
        ];
        const headers = ['a', 'aaa', 'aaaa', 'aaaaa'];
        const fieldsArr = createFields(data, schema, headers);

        expect(fieldsArr[0] instanceof DateTime).to.be.true;
        expect(fieldsArr[1] instanceof Measure).to.be.true;
        expect(fieldsArr[2] instanceof Categorical).to.be.true;
        expect(fieldsArr[3] instanceof Categorical).to.be.true;
    });
});
