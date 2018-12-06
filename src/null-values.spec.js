/* global describe, it */

import { expect } from 'chai';
import { setNullValuesMap, getNullValuesMap } from './null-values';

describe('Null/Empty/Invalid Values Representation', () => {
    const customNullValuesConfig = { undefined: 'NA' };
    const newNullValuesMap = setNullValuesMap(customNullValuesConfig);
    const modifiedCurrentNullValues = getNullValuesMap();

    it('should be equal to the newly set configuration', () => {
        expect(newNullValuesMap).to.eql(modifiedCurrentNullValues);
    });
});
