import { DimensionSubtype } from 'muze-utils';
import { rowDiffsetIterator } from '../operator/row-diffset-iterator';

/**
 * In {@link DataModel}, every tabular data consists of column, a column is stored as field.
 * Field contains all the data for a given column in an array.
 *
 * Each record consists of several fields; the fields of all records form the columns.
 * Examples of fields: name, gender, sex etc.
 *
 * In DataModel, each field can have multiple attributes which describes its data and behaviour.
 * A field can have two types of data: Measure and Dimension.
 *
 * A Dimension Field is the context on which a data is categorized and the measure is the numerical values that
 * quantify the data set.
 * In short a dimension is the lens through which you are looking at your measure data.
 *
 * Refer to {@link Schema} to get info about possible field attributes.
 * 
 * @public
 * @class
 */
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
        data = this.getData();
        if (this._ref.fieldType === 'dimension' && this._ref.subType() !== DimensionSubtype.TEMPORAL) {
            domain = [...new Set(data)];
        } else {
            let minD = Math.min.apply(null, data);
            let maxD = Math.max.apply(null, data);
            domain = [minD, maxD];
        }

        return domain;
    }

    parse (val) {
        return this._ref.parse(val);
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

    get name() {
        return this._ref.name;
    }

    // set name(name) {
    //     this._ref.name = name;
    // }

    get schema() {
        return this._ref.schema;
    }

    // set schema(schema) {
    //     this._ref.schema = schema;
    // }

    get data() {
        return this._ref.data;
    }

    // set data(schema) {
    //     throw new Error('Not yet implemented!');
    // }

    subType() {
        return this._ref.subType();
    }

    getMinDiff () {
        return this._ref.getMinDiff();
    }

    /**
     * Getter for unit value of the field.
     *
     * @return {string} Returns unit of the field.
     */
    unit() {
        return this._ref.unit();
    }

    /**
     * Getter for scale value of the field.
     *
     * @return {string} Returns scale of the field.
     */
    scale() {
        return this._ref.scale();
    }

    /**
     * Getter for number format value of the field.
     *
     * @return {string} Returns number format of the field.
     */
    numberformat() {
        return this._ref.numberformat();
    }

    /**
     * Getter for aggregation function of the field.
     *
     * @return {Function} Returns aggregation function of the field.
     */
    defAggFn() {
        return this._ref.defAggFn();
    }

    getData() {
        let data = [];
        rowDiffsetIterator(this._rowDiff, (i) => {
            data.push(this._ref.data[i]);
        });
        return data;
    }

    bins() {
        return this._ref.bins();
    }
}
