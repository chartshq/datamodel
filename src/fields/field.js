export default class Field {
    constructor(partialFeild) {
        this._ref = partialFeild;
    }

    sanitize () {
        return this._ref.sanitize();
    }

    parsed (val) {
        return this._ref.parsed(val);
    }

    domain() {
        throw new Error('Not yet implemented!');
    }

    parse () {
        return this._ref.parse();
    }


    clone(data) {
        return this._ref.clone(data);
    }

    fieldName() {
        return this._ref.fieldName();
    }

    type() {
        return this._ref.type();
    }

    description() {
        return this._ref.description();
    }
    __columnIDs(collids) {
        this._collID = collids;
    }
    __rowDiffSet(rowDiffSet) {
        this._rowDiff = rowDiffSet;
    }
}
