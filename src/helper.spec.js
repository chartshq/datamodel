/* global describe, it */

import { expect } from 'chai';
import DataModel from './index';
import { getRootGroupByModel, getRootDataModel, getPathToRootModel } from './helper';

describe('getRootGroupByModel', () => {
    const data = [
      { age: 30, job: 'unemployed', marital: 'married' },
      { age: 10, job: 'services', marital: 'married' },
      { age: 22, job: 'self-employed', marital: 'single' }
    ];
    const schema = [
      { name: 'age', type: 'measure' },
      { name: 'job', type: 'dimension' },
      { name: 'marital', type: 'dimension' },
    ];

    it('should return nearest groupBy DataModel', () => {
        const dm = new DataModel(data, schema);
        const dm1 = dm.groupBy(['job', 'marital']);
        const dm2 = dm1.select(fields => fields.age.value > 15);
        const dm3 = dm2.project(['age', 'job', 'marital']);

        expect(getRootGroupByModel(dm3)).to.be.equal(dm1);
    });
});

describe('getRootDataModel', () => {
    const data = [
      { age: 30, job: 'unemployed', marital: 'married' },
      { age: 10, job: 'services', marital: 'married' },
      { age: 22, job: 'self-employed', marital: 'single' }
    ];
    const schema = [
      { name: 'age', type: 'measure' },
      { name: 'job', type: 'dimension' },
      { name: 'marital', type: 'dimension' },
    ];

    it('should return root DataModel', () => {
        const dm = new DataModel(data, schema);
        const dm1 = dm.groupBy(['job', 'marital']);
        const dm2 = dm1.select(fields => fields.age.value > 15);
        const dm3 = dm2.project(['age', 'job', 'marital']);

        expect(getRootDataModel(dm3)).to.be.equal(dm);
    });
});


describe('getPathToRootModel', () => {
    const data = [
      { age: 30, job: 'unemployed', marital: 'married' },
      { age: 10, job: 'services', marital: 'married' },
      { age: 22, job: 'self-employed', marital: 'single' }
    ];
    const schema = [
      { name: 'age', type: 'measure' },
      { name: 'job', type: 'dimension' },
      { name: 'marital', type: 'dimension' },
    ];

    it('should return root DataModel', () => {
        const dm = new DataModel(data, schema);
        const dm1 = dm.groupBy(['job', 'marital']);
        const dm2 = dm1.select(fields => fields.age.value > 15);
        const dm3 = dm2.project(['age', 'job', 'marital']);
        const paths = getPathToRootModel(dm3);

        expect(paths.length).to.be.equal(3);
        expect(paths[0]).to.be.equal(dm3);
        expect(paths[1]).to.be.equal(dm2);
        expect(paths[2]).to.be.equal(dm1);
    });
});
