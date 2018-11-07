/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import FieldParser from './index';

describe('FieldParser', () => {
    let fieldParser;

    beforeEach(() => {
        fieldParser = new FieldParser();
    });

    describe('#parse', () => {
        it('should be abstract, not be implemented', () => {
            expect(fieldParser.parse).to.throw(Error, 'Not yet implemented');
        });
    });
});
