/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { DimensionSubtype } from 'picasso-util';
import { DateTimeFormatter } from '../utils';
import DateTime from './datetime';

describe('DateTime Field Type', () => {
    const schema = {
        name: 'Date',
        type: 'dimension',
        subtype: DimensionSubtype.TEMPORAL,
        format: '%Y-%m-%d'
    };
    const data = ['2017-03-01', '2017-03-02', '2017-03-03'];
    let field;

    beforeEach(() => {
        field = new DateTime(schema.name, data, schema);
    });

    it('should implement getter methods', () => {
        expect(field.subType()).to.equal(schema.subtype);
    });

    describe('#prototype.parse()', () => {
        it('should return parsed timestamp', () => {
            const dateStr = '2017-03-01';

            let ts = field.parse(dateStr);
            let expectedTs = new DateTimeFormatter(schema.format).getNativeDate(dateStr).getTime();
            expect(ts).to.equal(expectedTs);

            const dtf = new DateTimeFormatter(schema.format);
            field._dtf = dtf;
            ts = field.parse(dateStr);
            expectedTs = dtf.getNativeDate(dateStr).getTime();
            expect(ts).to.equal(expectedTs);

            field._dtf = undefined;
            field.schema = Object.assign({}, schema, { format: undefined });
            /** Mocked version of field.parse() method */
            const mockedParseFn = () => {
                field.parse(dateStr);
            };
            expect(mockedParseFn).not.throw(Error);
        });
    });
});
