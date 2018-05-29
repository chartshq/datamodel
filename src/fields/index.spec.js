/* global describe, it */
/* eslint-disable no-unused-expressions */
/* eslint no-undef: "off" */

import { expect } from 'chai';
import Measure from './measure';
import Field from './field';
import Categorical from './categorical';
import { DIM_SUBTYPE } from '../enums/index';

describe('Field Testing', () => {
    it('should clone a measure ', () => {
        const schema = {
            a: 1,
            b: 2,
        };
        const data = [10, 20, 30];
        const name = 'demoMeasure';
        const measure = new Measure(name, data, schema);
        const cloneMeasure = measure.clone();
        const newData = [15, 25, 35];
        const newCloneMeasure = measure.clone(newData);

        expect(cloneMeasure instanceof Measure).to.be.true;
        expect(cloneMeasure.data).to.deep.equal(data);
        expect(cloneMeasure.schema).to.deep.equal(schema);

        schema.a = 5;
        data[0] = 100;
        expect(cloneMeasure.schema.a).to.deep.equal(1);
        expect(cloneMeasure.data[0]).to.deep.equal(10);
        expect(newCloneMeasure.data).to.deep.equal(newData);
    });
    context('Testing new meta data for the fields', () => {
        let schema = [{
            name: 'Name',
            type: 'dimension'
        }, {
            name: 'Miles_per_Gallon',
            type: 'measure',
            unit: 'cm',
            scale: '1000',
            numberformat: '12-3-3',
            description: 'This is description'
        }, {
            name: 'Date',
            type: 'dimension',
            subtype: 'temporal'
        }];

        it('Test field object', () => {
            let dimField = new Field(schema[0].name, [], schema[0]);

            expect(dimField instanceof Field).to.be.true;
            expect(dimField.type()).to.deep.equal(schema[0].type);
            expect(dimField.schema).to.deep.equal(schema[0]);
        });

        it('Test Measure object', () => {
            let measureField = new Measure(schema[1].name, [], schema[1]);

            expect(measureField instanceof Measure).to.be.true;
            expect(measureField.type()).to.deep.equal(schema[1].type);
            expect(measureField.schema).to.deep.equal(schema[1]);
            expect(measureField.fieldName()).to.deep.equal(schema[1].name);
            expect(measureField.unit()).to.deep.equal(schema[1].unit);
            expect(measureField.scale()).to.deep.equal(schema[1].scale);
            expect(measureField.description()).to.deep.equal(schema[1].description);
            expect(measureField.numberformat()).to.deep.equal(schema[1].numberformat);
        });
        it('Test Dimension Object', () => {
            let dimField = new Categorical(schema[2].name, [], schema[2]);
            expect(dimField instanceof Categorical).to.be.true;
            expect(dimField.type()).to.deep.equal(schema[2].type);
            expect(dimField.subType()).to.deep.equal(DIM_SUBTYPE.CATEGORICAL);
        });
    });
});
