/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import converterStore from './dataConverterStore';
import DataConverter from '../converter/model/dataConverter';

describe('#DataConverterStore', () => {
    it('should register and unregister converter', () => {
        class JSONConverter2 extends DataConverter {
            constructor() {
                super('json2');
            }

            convert() {
                return '';
            }
        }

        const converter = new JSONConverter2();
        converterStore.register(converter);
        expect(converterStore.get('json2')).to.not.null;

        converterStore.unregister(converter);
        expect(converterStore.get('json2')).to.null;
    });

    it('should not register invalid Coverter', () => {
        expect(converterStore.register(() => {})).to.null;
    });
});
