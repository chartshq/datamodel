/* global describe, it */

import { expect } from 'chai';
import DataModel from './index';

describe('Null/Empty/Invalid Values Representation', () => {
    const defaultInvalidAwareTypes = DataModel.InvalidAwareTypes.invalidAwareVals();

    it('should match the default configuration', () => {
        const defNullValuesMap = {
            invalid: DataModel.InvalidAwareTypes.NA,
            nil: DataModel.InvalidAwareTypes.NIL,
            null: DataModel.InvalidAwareTypes.NULL,
            undefined: DataModel.InvalidAwareTypes.NA
        };

        expect(defaultInvalidAwareTypes).to.eql(defNullValuesMap);
    });

    it('should be equal to the newly set configuration', () => {
        const data = [
            { name: null, birthday: '1995-07-05', roll: 2 },
            { name: undefined, birthday: '1996-08-04', roll: null },
        ];
        const schema = [
            { name: 'name', type: 'dimension' },
            { name: 'birthday', type: 'dimension', subtype: 'temporal', format: '%Y-%m-%d' },
            { name: 'roll', type: 'measure', defAggFn: 'avg' }
        ];
        const config = { undefined: DataModel.InvalidAwareTypes.NULL, };

        DataModel.configureInvalidAwareTypes(config);
        const dm = new DataModel(data, schema);
        const dmData = dm.getData().data;

        expect(dmData[0][0] instanceof DataModel.InvalidAwareTypes).to.be.true;
        expect(dmData[0][0]).to.eql(DataModel.InvalidAwareTypes.NULL);
        expect(dmData[1][0] instanceof DataModel.InvalidAwareTypes).to.be.true;
        expect(dmData[1][0]).to.eql(DataModel.InvalidAwareTypes.NULL);
        expect(dmData[1][2] instanceof DataModel.InvalidAwareTypes).to.be.true;
        expect(dmData[1][2]).to.eql(DataModel.InvalidAwareTypes.NULL);
        expect(dmData[1][2].value()).to.eql('null');
    });
});
