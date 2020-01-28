import { FieldParser } from '..';

export class IdValue {
    constructor (val, hash) {
        this._val = new Set(val instanceof Array ? val.map(Number) : [Number(val)]);
        this._hash = hash || this._val.values().next().value;
        return this;
    }

    toString () {
        return this._hash;
    }

    values () {
        return [...this._val];
    }
}

/**
 * A FieldParser which parses the id values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */
export default class IdParser extends FieldParser {
  /**
   * Parses a single value of a field and returns the stringified form.
   *
   * @public
   * @param {string|number} val - The value of the field.
   * @return {string} Returns the stringified value.
   */
    parse (val) {
        const result = val instanceof IdValue ? new IdValue(val.values()) : new IdValue(val);
        return result;
    }
}
