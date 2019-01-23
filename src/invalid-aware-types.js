/**
 * A parser to parser null, undefined, invalid and NIL values.
 *
 * @public
 * @class
 */
class InvalidAwareTypes {
    /**
     * Static method which gets/sets the invalid value registry.
     *
     * @public
     * @param {Object} config - The custom configuration supplied by user.
     * @return {Object} Returns the invalid values registry.
     */
    static invalidAwareVals (config) {
        if (!config) {
            return InvalidAwareTypes._invalidAwareValsMap;
        }
        return Object.assign(InvalidAwareTypes._invalidAwareValsMap, config);
    }

    /**
     * Initialize a new instance.
     *
     * @public
     * @param {string} value - The value of the invalid data type.
     */
    constructor (value) {
        this._value = value;
    }

    /**
     * Returns the current value of the instance.
     *
     * @public
     * @return {string} Returns the value of the invalid data type.
     */
    value () {
        return this._value;
    }

    /**
     * Returns the current value of the instance in string format.
     *
     * @public
     * @return {string} Returns the value of the invalid data type.
     */
    toString () {
        return String(this._value);
    }

    static isInvalid(val) {
        return (val instanceof InvalidAwareTypes) || !!InvalidAwareTypes.invalidAwareVals()[val];
    }

    static getInvalidType(val) {
        return val instanceof InvalidAwareTypes ? val : InvalidAwareTypes.invalidAwareVals()[val];
    }
}

/**
 * Enums for Invalid types.
 */
InvalidAwareTypes.NULL = new InvalidAwareTypes('null');
InvalidAwareTypes.NA = new InvalidAwareTypes('na');
InvalidAwareTypes.NIL = new InvalidAwareTypes('nil');

/**
 * Default Registry for mapping the invalid values.
 *
 * @private
 */
InvalidAwareTypes._invalidAwareValsMap = {
    invalid: InvalidAwareTypes.NA,
    nil: InvalidAwareTypes.NIL,
    null: InvalidAwareTypes.NULL,
    undefined: InvalidAwareTypes.NA
};

export default InvalidAwareTypes;
