/* global describe, it */

import { expect } from 'chai';
import { setNullValuesMap, getNullValuesMap } from './null-values';
import defaultNullValues from './default-null-values';
import { NullValuesRepr } from './enums';

describe('Null/Empty/Invalid Values Representation', () => {
    it('should match the default configuration', () => {
        const defNullValuesMap = {
            undefined: NullValuesRepr.NULL,
            null: NullValuesRepr.NULL,
            invalid: NullValuesRepr.NA
        };

        expect(defaultNullValues).to.eql(defNullValuesMap);
    });

    it('should be equal to the newly set configuration', () => {
        const customNullValuesConfig = { undefined: 'NA' };
        const newNullValuesMap = setNullValuesMap(customNullValuesConfig);
        const currentNullValues = getNullValuesMap();

        expect(newNullValuesMap).to.eql(currentNullValues);
    });
});
