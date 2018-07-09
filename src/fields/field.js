import { rowDiffsetIterator } from '../operator/row-diffset-iterator'
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
        let data = [];
        let domain = null;
        rowDiffsetIterator(this._rowDiff, (i) => {
            data.push(this._ref.data[i]);
        });

        if (this._ref.fieldType === 'dimension') {
            domain = [...new Set(data)];
        } else {
            let minD = Math.min.apply(null, data);
            let maxD = Math.max.apply(null, data);
            domain = [minD, maxD];
        }

        return domain;
    }

    parse () {
        return this._ref.parse();
    }


    clone(datas) {
        return this._ref.clone(datas);
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

    get name() {
        return this._ref.name;
    }

    set name(name) {
        throw new Error('Not yet implemented!');
    }

    get schema() {
        return this._ref.schema;
    }

    set schema(schema) {
        throw new Error('Not yet implemented!');
    }

    get data() {
        return this._ref.data;
    }

    set data(schema) {
        throw new Error('Not yet implemented!');
    }
}
