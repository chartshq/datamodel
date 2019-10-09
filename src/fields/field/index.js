import { rowDiffsetIterator } from '../../operator/row-diffset-iterator';
import PartialField from '../partial-field'
import FieldParser from '../parsers/field-parser';

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
    /**
     * Initialize a new instance.
     *
     * @public
     * @param {PartialField} partialField - The partialField instance which holds the whole data.
     * @param {string} rowDiffset - The data subset definition.
     */
    constructor (partialField, rowDiffset) {
        this.partialField = partialField;
        this.rowDiffset = rowDiffset;
    }

    static parser(){
        throw new Error("Not yet implemented")
    }

    /**
     * Generates the field type specific domain.
     *
     * @public
     * @abstract
     */
    domain () {
        throw new Error('Not yet implemented');
    }

    /**
     * Returns the the field schema.
     *
     * @public
     * @return {string} Returns the field schema.
     */
    schema () {
        return this.partialField.schema;
    }

    /**
     * Returns the name of the field.
     *
     * @public
     * @return {string} Returns the name of the field.
     */
    name () {
        return this.partialField.name;
    }

    /**
     * Returns the type of the field.
     *
     * @public
     * @return {string} Returns the type of the field.
     */
    type () {
        return this.partialField.schema.type;
    }

    /**
     * Returns the subtype of the field.
     *
     * @public
     * @return {string} Returns the subtype of the field.
     */
    subtype () {
        return this.partialField.schema.subtype;
    }

    /**
     * Returns the description of the field.
     *
     * @public
     * @return {string} Returns the description of the field.
     */
    description () {
        return this.partialField.schema.description;
    }

    /**
     * Returns the display name of the field.
     *
     * @public
     * @return {string} Returns the display name of the field.
     */
    displayName () {
        return this.partialField.schema.displayName || this.partialField.schema.name;
    }

    /**
     * Returns the data associated with the field.
     *
     * @public
     * @return {Array} Returns the data.
     */
    data () {
        const data = [];
        rowDiffsetIterator(this.rowDiffset, (i) => {
            data.push(this.partialField.data[i]);
        });
        return data;
    }

    /**
     * Returns the formatted version of the underlying field data.
     *
     * @public
     * @abstract
     */
    formattedData () {
        throw new Error('Not yet implemented');
    }

    static get BUILDER(){
        const builder = {
            _params : {},
            _context : this,
            fieldName : function(name) {
                this._params.name = name;
                return this;
            },
            schema : function(schema){
                this._params.schema = schema;
                return this;
            },
            data : function(data){
                this._params.data = data;
                return this;
            },
            parser : function(parser){
                this._params.parser = parser;
                return this;
            },
            partialField : function(partialField){
                this._params.partialField = partialField
                return this;
            },
            rowDiffset : function(rowDiffset){
                this._params.rowDiffset = rowDiffset
                return this;
            },
            build : function(){
                let partialField = null;
                if(this._params.partialField instanceof PartialField){
                    partialField = this._params.partialField
                }else if(this._params.schema && this.params.data && this.params.parser instanceof FieldParser){
                    partialField = new PartialField(this._params.schema.name,this.params.data,this.params.schema,this.params.parser)
                }
                else {
                    throw new Error("Invalid Field parameters")
                }
                return new this._context(partialField,this._params.rowDiffset);
            }
        }
        return builder;
    }
}
