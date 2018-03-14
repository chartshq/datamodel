/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import Measure from './measure';

describe('Clone', () => {
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
});
