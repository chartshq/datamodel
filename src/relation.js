import { SelectionMode } from 'picasso-util';
import createFields from './create-fields';

import { rowDiffsetIterator } from './operator';
import defaultConfig from './default-config';
import * as converter from './converter';
import Value from './value';
import fieldStore from './field-store';

/**
 * Prepares the selection data.
 */
function prepareSelectionData(fields, i) {
    const resp = {};
    for (let field of fields) {
        resp[field.name] = new Value(field.data[i], field);
    }
    return resp;
}

/**
 * Provides the relation algebra logics.
 */
class Relation {

    /**
     * If passed any data this will create a field array and will create
     * a field store with these fields in global space which can be used
     * by other functions for calculations and other operations on data
     *
     * @param {Object | string | Relation} data - The input tabular data in csv or json format or
     * an existing Relation instance object.
     * @param {Array} schema - An array of data schema.
     * @param {string} [name] - The name of the DataModel instance, if not provided will assign a random name.
     * @param {Object} [options] - The optional options.
     */
    constructor(data, schema, name, options) {
        if (data instanceof Relation) {
            // parent datamodel was passed as part of source
            const source = data;
            // Copy the required property
            this.colIdentifier = source.colIdentifier;
            this.rowDiffset = source.rowDiffset;
            this.fieldMap = source.fieldMap;
        } else {
            if (!data) {
                throw new Error('Data not specified');
            }
            this._updateData(data, schema, name, options);
        }
    }

    _updateData (data, schema, name, options) {
        options = Object.assign(Object.assign({}, defaultConfig), options);
        const converterFn = converter[options.dataFormat];

        if (!(converterFn && typeof converterFn === 'function')) {
            throw new Error(`No converter function found for ${options.dataFormat} format`);
        }

        const [header, formattedData] = converterFn(data, options);
        const fieldArr = createFields(formattedData, schema, header);

        // This will create a new fieldStore with the fields
        const nameSpace = fieldStore.createNameSpace(fieldArr, name);
        this.nameSpace = nameSpace;
        // this.fieldMap = schema.reduce((acc, fieldDef, i) => {
        //     acc[fieldDef.name] = {
        //         index: i,
        //         def: fieldDef
        //     };
        //     return acc;
        // }, {});
        // If data is provided create the default colIdentifier and rowDiffset
        this.rowDiffset = `0-${formattedData[0] ? (formattedData[0].length - 1) : 0}`;
        this.colIdentifier = (schema.map(_ => _.name)).join();
        return this;
    }

    /**
     * Sets the projection to the DataModel instance only the projection string
     *
     * @param {string} projString - The projection to be applied.
     * @return {DataModel} Returns the current DataModel instance.
     */
    _projectHelper(projString) {
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
     * Sets the selection to the current DataModel instance.
     *
     * @param {Array} fields - The fields array.
     * @param {Function} selectFn - The filter function.
     * @param {Object} config - The mode configuration object.
     * @param {string} config.mode - The type of mode to use.
     * @return {string} Returns the Row diffset.
     */
    _selectHelper(fields, selectFn, config) {
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


    _isEmpty () {
        return !this.rowDiffset.length || !this.colIdentifier.length;
    }

}

export default Relation;
