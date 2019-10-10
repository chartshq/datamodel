/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DataConverter from './dataConverter';

describe('#DataConverterModel', () => {
    it('should throw error', () => {
        expect(new DataConverter().convert).to.throw(Error, 'Convert method not implemented');
    });
});
