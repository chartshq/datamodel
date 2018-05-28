import createFields from './create-fields';
import fieldStore from './field-store';
import rowDiffsetIterator from './operator/row-diffset-iterator';
import defaultConfig from './defalult-config';
import * as converter from './converter';
import { SelectionMode } from './enums';

/*
 * @todo the value cell is the most basic class. We would have support for StringValue, NumberValue, DateTimeValue
 * and GeoValue. This types exposes API (predicate mostly) for specific types
 */

/**
 * Each privitive value of a fild is exporsed as Value. This is a wrapper on top of the primitive value for easy
 * operations.
 *
 * @class
 */
class Value {
    /**
     * @param {object} val primitive value from the cell
     * @param {Field} field field from which the value belongs
     */
    constructor (val, field) {
        Object.defineProperty(this, '_value', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: val
        });

        this.field = field;
    }

    /**
     * @setter
     * This does not set any value as the value is immutable for a cell.
     */
    set value (val) {
        /* dont let the outside setter set the value */
        return this;
    }

    /**
     * @getter
     */
    get value () {
        return this._value;
    }

    /**
     * @override
     */
    toString () {
        return this.value;
    }

    /**
     * @override
     */
    valueOf () {
        return this.value;
    }
}

const prepareSelectionData = (fields, i) => {
    const resp = {};
    for (let field of fields) {
        resp[field.name] = new Value(field.data[i], field);
    }

    return resp;
};

/**
 * Contains all the relational algebra part
 */
class Relation {
    /**
     * If passed any data this will create a field array and will create
     * a field store with these fields in global space which can be used
     * by other functions for calculations and other operations on data
     * @param  {string|json} data The tabuler data csv or json format
     * @param  {json} schema The details of the schema
     * @param  {string} name name of the DataTable if not provided will assign a random name
     * @param {object} options optional options for parsing and formatting
     */
    constructor(data, schema, name, options) {
        if (data instanceof Relation) {
            // parent datatable was passed as part of source
            const source = data;
            // Copy the required property
            this.colIdentifier = source.colIdentifier;
            this.rowDiffset = source.rowDiffset;
            this.fieldMap = source.fieldMap;
            return this;
        }

        if (!data) {
            throw new Error('No data found.');
        }

        this.updateData(data, schema, name, options);
        return this;
    }

    updateData (data, schema, name, options) {
        options = Object.assign(Object.assign({}, this.constructor.defaultConfig()), options);
        const converterFn = converter[options.dataformat];

        if (!(converterFn && typeof converterFn === 'function')) {
            throw new Error(`No converter function found for ${options.dataformat} format`);
        }

        const [header, formattedData] = converterFn(data, options);
        const fieldArr = createFields(formattedData, schema, header);

        // This will create a new fieldStore with the fields
        const nameSpace = fieldStore.createNameSpace(fieldArr, name);
        this.columnNameSpace = nameSpace;
        this.fieldMap = schema.reduce((acc, fieldDef, i) => {
            acc[fieldDef.name] = {
                index: i,
                def: fieldDef
            };
            return acc;
        }, {});
        // If data is provided create the default colIdentifier and rowDiffset
        this.rowDiffset = `0-${formattedData[0] ? (formattedData[0].length - 1) : 0}`;
        this.colIdentifier = (schema.map(_ => _.name)).join();
        return this;
    }

    static defaultConfig () {
        return defaultConfig;
    }

    /**
     * Set the projection to the DataTable only the projection string
     * @param  {string} projString The projection to be applied
     * @return {instance}            Instance of the class (this).
     */
    projectHelper(projString) {
        let presentField = Object.keys(this.fieldMap);
        this.colIdentifier = projString;

        presentField = presentField.filter(field =>
            projString.search(new RegExp(`^${field}\\,|\\,${field}\\,|\\,${field}$|^${field}$`, 'i')) !== -1);

        this.fieldMap = presentField.reduce((acc, val) => {
            acc[val] = this.fieldMap[val];
            return acc;
        }, {});
        return this;
    }

    /**
     * Set the selection to the DataTable
     * @param  {Array} fields   FieldStore fields array
     * @param  {Function} selectFn The filter function
     * @param {Object} config The mode configuration.
     * @param {string} config.mode The type of mode to use.
     * @return {string} Row diffset
     */
    selectHelper(fields, selectFn, config) {
        const newRowDiffSet = [];
        let lastInsertedValue = -1;
        let { mode } = config;
            // newRowDiffSet last index
        let li;
        let checker = index => selectFn(prepareSelectionData(fields, index), index);
        if (mode === SelectionMode.INVERSE) {
            checker = index => !selectFn(prepareSelectionData(fields, index));
        }
        rowDiffsetIterator(this.rowDiffset, (i) => {
            if (checker(i)) {
                // Check for if this value to be attached to the last diffset ie. 1-5 format
                if (lastInsertedValue !== -1 && i === (lastInsertedValue + 1)) {
                    li = newRowDiffSet.length - 1;
                    newRowDiffSet[li] = `${newRowDiffSet[li].split('-')[0]}-${i}`;
                } else {
                    newRowDiffSet.push(`${i}`);
                }
                lastInsertedValue = i;
            }
        });
        return newRowDiffSet.join(',');
    }


    isEmpty () {
        return !this.rowDiffset.length;
    }
}

export { Relation as default };
