import defaultNullValues from './default-null-values';

/**
 * Clone the default configuration into a new object
 */
let nullValuesMap = Object.assign({}, defaultNullValues);

/**
 * Sets the value of representing undefined/null/invalid values
 *
 * @param {Object} [config] - Configuration to control how null, undefined and non-parsable values will
 * be represented in DataModel.
 * @param {string} [config.undefined] - Define how an undefined value will be represented.
 * @param {string} [config.null] - Define how a null value will be represented.
 * @param {string} [config.invalid] - Define how a non-parsable value will be represented.
 * @return {Object} Returns the mapping of the modified configuration.
 */
export const setNullValuesMap = (config) => {
    nullValuesMap = Object.assign(nullValuesMap, config);
    return nullValuesMap;
};

/**
 * Gets the value of the current undefined/null/invalid values representation.
 *
 * @return {Object} Returns the current configuration.
 */
export const getNullValuesMap = () => nullValuesMap;
