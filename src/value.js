/**
 * The wrapper class on top of the primitive value of a field.
 *
 * @todo Need to have support for StringValue, NumberValue, DateTimeValue
 * and GeoValue. These types should expose predicate API mostly.
 */
class Value {

  /**
   * Creates new Value instance.
   *
   * @param {*} val - the primitive value from the field cell.
   * @param {string | Field} field - The field from which the value belongs.
   */
    constructor (value, rawValue, field) {
        const numberFormatFn = field.numberFormat && field.numberFormat();

        Object.defineProperties(this, {
            _value: {
                enumerable: false,
                configurable: false,
                writable: false,
                value
            },
            _formattedValue: {
                enumerable: false,
                configurable: false,
                writable: false,
                value: numberFormatFn ? numberFormatFn(value) : value
            },
            _internalValue: {
                enumerable: false,
                configurable: false,
                writable: false,
                value: rawValue
            }
        });

        this.field = field;
    }

  /**
   * Returns the field value.
   *
   * @return {*} Returns the current value.
   */
    get value () {
        return this._value;
    }

    /**
     * Returns the parsed value of field
     */
    get formattedValue () {
        return this._formattedValue;
    }

    /**
     * Returns the internal value of field
     */
    get internalValue () {
        return this._internalValue;
    }

  /**
   * Converts to human readable string.
   *
   * @override
   * @return {string} Returns a human readable string of the field value.
   *
   */
    toString () {
        return String(this.value);
    }

  /**
   * Returns the value of the field.
   *
   * @override
   * @return {*} Returns the field value.
   */
    valueOf () {
        return this.value;
    }
}

export default Value;
