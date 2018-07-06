import rowDiffsetIterator from '../operator/row-diffset-iterator'
;

export default class Field {
    constructor(partialFeild, rowDiff) {
        this._ref = partialFeild;
        this._rowDiff = rowDiff;
    }

    sanitize () {
        return this._ref.sanitize();
    }

    parsed (val) {
        return this._ref.parsed(val);
    }

    domain() {
        let domain = [];
        rowDiffsetIterator(this.rowDiffset, (i) => {
            domain.push(this._ref.data[i]);
        });
        return domain;
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
