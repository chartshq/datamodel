/**
 * Interface for all data converters
 */
export default class DataConverter {
    constructor(type) {
        this._type = type;
    }

    get type() {
        return this._type;
    }

    convert() {
        throw new Error('Convert method not implemented.');
    }

}
