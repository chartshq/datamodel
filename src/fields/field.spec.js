/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { FieldType } from 'picasso-util';
import Field from './field';
import PartialField from './partial-field'
;

describe('Field Type', () => {
    const schema = {
        name: 'Miles_per_Gallon',
        type: FieldType.MEASURE,
        description: 'This is description'
    };
    // Use empty data array to mock field.parse() method
    const data = [];
    let field2;

    beforeEach(() => {
        let partialfield = new PartialField(schema.name, data, schema);
        field2 = new Field(partialfield, null);
    });

    it('hello should hold data and schema references', () => {
        // expect(field2.data).to.deep.equal(data);
        expect(field2.schema).to.deep.equal(schema);
    });

    it('should implement getter methods', () => {
        expect(field2.fieldName()).to.equal(schema.name);
        expect(field2.type()).to.equal(schema.type);
        expect(field2.description()).to.equal(schema.description);
    });

    describe('#prototype.clone()', () => {
        it('should clone current instance with new data', () => {
            const newData = [];
            const cloned = field2.clone(newData);

            expect(cloned.data).to.deep.equal(newData);
            expect(cloned.schema).to.deep.equal(field2.schema);

            expect(cloned.fieldName()).to.equal(field2.fieldName());
            expect(cloned.type()).to.equal(field2.type());
            expect(cloned.description()).to.equal(field2.description());
        });

        it('should clone current instance without new data', () => {
            const cloned = field2.clone();

            expect(cloned.data).to.deep.equal(field2.data);
            expect(cloned.schema).to.deep.equal(field2.schema);

            expect(cloned.fieldName()).to.equal(field2.fieldName());
            expect(cloned.type()).to.equal(field2.type());
            expect(cloned.description()).to.equal(field2.description());
        });
    });
});
