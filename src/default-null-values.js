import { NullValuesRepr } from './enums';

/**
 * Default configuration to represent undefined, null and
 * non-parsable (invalid) values
 */
const defaultNullValues = {
    undefined: NullValuesRepr.NULL,
    null: NullValuesRepr.NULL,
    invalid: NullValuesRepr.NA
};

export default defaultNullValues;
