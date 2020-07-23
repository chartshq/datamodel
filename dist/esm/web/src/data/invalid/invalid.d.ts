/**
 * A parser to parser null, undefined, invalid and NIL values.
 *
 * @public
 * @class
 */
declare class Invalid {
    _value: string | number;
    /**
     * Initialize a new instance.
     *
     * @public
     * @param {string} value - The value of the invalid data type.
     */
    constructor(value: string | number);
    /**
     * Returns the current value of the instance.
     *
     * @public
     * @return {string} Returns the value of the invalid data type.
     */
    value(): string | number;
    /**
     * Returns the current value of the instance in string format.
     *
     * @public
     * @return {string} Returns the value of the invalid data type.
     */
    toString(): string | number;
}
export default Invalid;
