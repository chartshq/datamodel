import { FieldParser } from '..';
/**
 * Wrapper around row identifier value. Row id value contains the unique id of each row which
 * remains same across all datamodels of same source.
 */
export class IdValue {
    constructor (val) {
        const valArr = val instanceof Array ? val.map(Number) : [Number(val)];
        this._val = new Set(valArr);
        this._hash = valArr[0];
        this._valArr = valArr;
        return this;
    }

    toString () {
        return this._hash;
    }

    values () {
        return this._valArr;
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
   * @return {string} Returns the instance of id value.
   */
    parse (val) {
        const result = val instanceof IdValue ? new IdValue(val.values()) : new IdValue(val);
        return result;
    }
}
