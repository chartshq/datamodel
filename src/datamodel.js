/* eslint-disable default-case */

import { FieldType } from 'muze-utils';
import { persistDerivation, propagateIdentifiers, propagateRange, assembleModelFromIdentifiers } from './helper';
import { DM_DERIVATIVES, PROPAGATION } from './constants';
import {
    dataBuilder,
    rowDiffsetIterator,
    groupBy
} from './operator';
import { createBinnedFieldData } from './operator/bucket-creator';
import Relation from './relation';
import reducerStore from './utils/reducer-store';
import createFields from './field-creator';

/** @public
 *
 * DataModel is an in-browser representation of tabular data. It supports relaiton algebra operators as well as generic
 * data processing opearators.
 * {@link Relation} is the base class which defines all the relational algebra opreators. DataModel gives definition of
 * generic data processing operators which are not relational algebra complient.
 *
 * @class
 * @extends Relation
 */
class DataModel extends Relation {

    /** @public
     *
     * Creates a new DataModel instance by providing data and schema. Data could be of the form of
     * - Flat JSON
     * - DSV String
     * - 2D Array
     *
     * By default DataModel finds suitable adapter to serialize the data. DataModel also expects a schema for
     * identifying the variables.
     *
     * Learn more about schema here.
     *
     * @example
     * const data = loadData('cars.csv');
     * const schema = [
     *      { name: 'Name', type: 'dimension' },
     *      { name: 'Miles_per_Gallon', type: 'measure', unit : 'cm', scale: '1000', numberformat: '12-3-3' },
     *      { name: 'Cylinders', type: 'dimension' },
     *      { name: 'Displacement', type: 'measure' },
     *      { name: 'Horsepower', type: 'measure' },
     *      { name: 'Weight_in_lbs', type: 'measure' },
     *      { name: 'Acceleration', type: 'measure' },
     *      { name: 'Year', type: 'dimension' },
     *      { name: 'Origin', type: 'dimension' }
     * ];
     * const dm = new DataModel(data, schema, { name: 'Cars' });
     * table(dm);
     *
     * @param {Array.<Object> | string | Array.<Array>} data in the above mentioned format
     * @param {Array.<Schema>} schema defination of the variables. The order of the variables in data and order of the
     *      variables in schema has to be same
     * @param {object} options - optional arguments
     * @param {string} options.name - name of the datamodel instance. If no name is given an auto generated name is
     *      assigned to the instance.
     */
    constructor (...args) {
        super(...args);

        this._onPropagation = [];
        this._sortingDetails = [];
    }

    /** @public
     *
     * Reducers are simple functions which reduces an array of value to a representative value.
     * Like an array of numbers `[10, 20, 5, 15]` can be reduced to 12.5 if a average / mean reducer funciton is
     * applied. All the fields in datamodel (variables in data) needs a reducer to handle aggregation.
     *
     * @return {ReducerStore} singleton instance of {@link ReducerStore}.
     */
    static get Reducers () {
        return reducerStore;
    }

    /** @public
     *
     * Returns the data attached to an instance in JSON format.
     *
     * @example
     * // DataModel instance is already prepared and assigned to dm variable
     *  const data = dm.getData({
     *      order: 'column',
     *      formatter: {
     *          origin: (val) => val === 'European Union' ? 'EU' : val;
     *      }
     *  });
     *  console.log(data);
     *
     *
     * @param {Object} [options] Options to control how the raw data is to be returned.
     * @param {string} [options.order='row'] Defines if data is retieved in row order or column order. Possible values
     *      are `'rows'` and `'columns'`
     * @param {object} [options.formatter=null] Formats the output data. This expects an object, where the keys are
     *      the name of the variable needs to be formatted. The formatter is a function in the form of
     *      ```
     *          function (value, rowId, schema) => { ... }
     *      ```
     *      Know more about {@link Fomatter}.
     *
     * @return {Array} Returns a multidimensional array of the data.
     */
    getData (options) {
        const defOptions = {
            order: 'row',
            formatter: null,
            withUid: false,
            sort: []
        };
        options = Object.assign({}, defOptions, options);

        const dataGenerated = dataBuilder.call(
            this,
            this.getPartialFieldspace().fields,
            this._rowDiffset,
            this._colIdentifier,
            options.sort,
            {
                columnWise: options.order === 'column',
                addUid: !!options.withUid
            }
        );

        if (!options.formatter) {
            return dataGenerated;
        }

        const { formatter } = options;
        const { data, schema, uids } = dataGenerated;
        const fieldNames = schema.map((e => e.name));
        const fmtFieldNames = Object.keys(formatter);
        const fmtFieldIdx = fmtFieldNames.reduce((acc, next) => {
            const idx = fieldNames.indexOf(next);
            if (idx !== -1) {
                acc.push([idx, formatter[next]]);
            }
            return acc;
        }, []);

        if (options.order === 'column') {
            fmtFieldIdx.forEach((elem) => {
                const fIdx = elem[0];
                const fmtFn = elem[1];

                data[fIdx].forEach((datum, datumIdx) => {
                    data[fIdx][datumIdx] = fmtFn.call(
                        undefined,
                        datum,
                        uids[datumIdx],
                        schema[fIdx]
                    );
                });
            });
        } else {
            data.forEach((datum, datumIdx) => {
                fmtFieldIdx.forEach((elem) => {
                    const fIdx = elem[0];
                    const fmtFn = elem[1];

                    datum[fIdx] = fmtFn.call(
                        undefined,
                        datum[fIdx],
                        uids[datumIdx],
                        schema[fIdx]
                    );
                });
            });
        }

        return dataGenerated;
    }

    /** @public
     *
     * Groupby groups the data by using dimensions and reducing measures. It expects a list of dimensions using which it
     * projects the datamodel and perform aggregations to reduce the duplicate tuple to one.
     *
     * @example
     * const groupedDM = dm.groupBy(['Year'] );
     * console.log(groupedDm);
     *
     * @param {Array.<string>} fieldsArr - Array containing the name of fields
     * @param {Object} [reducers={}] - A map whose key is the variable name and value is the name of the reducer. If its
     *      not passed, or any variable is ommitted, default aggregation function is used from the schema of the
     *      variable.
     *
     * @return {DataModel} Returns a new DataModel after performing the groupby.
     */
    groupBy (fieldsArr, reducers = {}, config = { saveChild: true }) {
        const groupByString = `${fieldsArr.join()}`;
        let params = [this, fieldsArr, reducers];
        const newDataModel = groupBy(...params);

        if (config.saveChild) {
            this._children.push(newDataModel);
            persistDerivation(
                newDataModel,
                DM_DERIVATIVES.GROUPBY,
                { fieldsArr, groupByString, defaultReducer: reducerStore.defaultReducer() },
                reducers
            );
        }

        newDataModel._parent = this;
        return newDataModel;
    }

    /**
     * It helps to define the sorting order of the returned data.
     * This is similar to the orderBy functionality of the database
     * you have to pass the array of array [['columnName', 'sortType(asc|desc)']] and the
     * function getData will give the data accordingly.
     *
     * @public
     * @param {Array} sortingDetails - An array containing the sorting details with column names;
     * @return {DataModel} Returns a new sorted instance of DataModel.
     */
    sort (sortingDetails) {
        const rawData = this.getData({
            order: 'row',
            sort: sortingDetails
        });
        const header = rawData.schema.map(field => field.name);
        const dataInCSVArr = [header].concat(rawData.data);

        const sortedDm = new this.constructor(dataInCSVArr, rawData.schema, null, { dataFormat: 'DSVArr' });
        sortedDm._sortingDetails = sortingDetails;
        return sortedDm;
    }

    addField (field) {
        this._colIdentifier += `,${field.fieldName()}`;
        this._partialFieldspace.fields.push(field);
        this.__calculateFieldspace().calculateFieldsConfig();
        return this;
    }

     /**
     * @public
     *
     * This method helps to create a new Dimension or Measure.To create either of them one
     * just need to give the schema of the new field and also pass the dependent fields names
     * along with a reducer function. The reducer function is a operator which operates on the dependent
     * fields to give out te value of the new fields.
     *
     * Following are the examples:
     *
     * Create a new Dimension
     * @example
     * const data1 = [
     *    { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
     *    { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
     *    { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
     *    { profit: 15, sales: 25, first: 'White', second: 'walls' },
     * ];
     * const schema1 = [
     *    { name: 'profit', type: 'measure' },
     *    { name: 'sales', type: 'measure' },
     *    { name: 'first', type: 'dimension' },
     *    { name: 'second', type: 'dimension' },
     * ];
     * const dataModel = new DataModel(data1, schema1, 'Yo');
     * const newDm = dataModel.calculateVariable(
     *    {
     *     name: 'Song',
     *     type: 'dimension'
     *    }, ['first', 'second', (first, second) =>
     *      `${first} ${second}`
     *   ]);
     * Here we create a new dimension named 'Songs' whose value will contain
     * the result of reducer given.
     *
     * Create a new Measure
     * @example
     * const data1 = [
     *    { profit: 10, sales: 20, city: 'a', state: 'aa' },
     *    { profit: 15, sales: 25, city: 'b', state: 'bb' },
     *    { profit: 10, sales: 20, city: 'a', state: 'ab' },
     *    { profit: 15, sales: 25, city: 'b', state: 'ba' },
     * ];
     * const schema1 = [
     *    { name: 'profit', type: 'measure' },
     *    { name: 'sales', type: 'measure' },
     *    { name: 'city', type: 'dimension' },
     *    { name: 'state', type: 'dimension' },
     *  ];
     * const dataModel = new DataModel(data1, schema1, 'Yo');
     * const child = dataModel.calculateVariable(
     *     {
     *       name: 'Efficiency',
     *       type: 'measure'
     *     }, ['profit', 'sales', (profit, sales) => profit / sales]);
     *
     * Here we create a new Measure named 'Efficiency'
     *
     * @param {Object} varConfig: Provides the schema for new variable
     * @param {String} varConfig.name: New variable name,
     * @param {String} varConfig.type: Type of variable to be created => 'measure | dimension',
     * @param {String} varConfig.subype: Subtype of the variable
     * @param {Array} dependency : Provides the dependents fields on which the new variable depends and a
     * the reducer which produce the value of the field ['dep-var-1', 'dep-var-2', 'dep-var-3',
     *                                                      ([var1, var2, var3], rowIndex, dm) => {}]
     * the last element will be a reducer which will generate the new variable from given variable
     * @param {Object} config : Additional costomization for the resultant DataModel
     * @param {Boolean} config.saveChild : Indicates whether resultant dataModel will linked to its parent
     * @param {Boolean} config.removeDependentDimensions : Indicates whether dependent fields
     *                                                          needs to be removed.saveChild
     *
     * @return {DataModel} returns a datamodel with the new field.
     */
    calculateVariable (schema, dependency, config = { saveChild: true }) {
        const fieldsConfig = this.getFieldsConfig();
        const depVars = dependency.slice(0, dependency.length - 1);
        const retrieveFn = dependency[dependency.length - 1];

        if (fieldsConfig[schema.name]) {
            throw new Error(`${schema.name} field already exists in model.`);
        }
        const depFieldIndices = depVars.map((field) => {
            const fieldSpec = fieldsConfig[field];
            if (!fieldSpec) {
                // @todo dont throw error here, use warning in production mode
                throw new Error(`${field} is not a valid column name.`);
            }
            return fieldSpec.index;
        });

        let clone = this.clone();

        const fs = clone.getFieldspace().fields;
        const suppliedFields = depFieldIndices.map(idx => fs[idx]);

        const computedValues = [];
        rowDiffsetIterator(clone._rowDiffset, (i) => {
            const fieldsData = suppliedFields.map(field => field.data[i]);
            computedValues[i] = retrieveFn(...fieldsData, i, fs);
        });
        const [field] = createFields([computedValues], [schema], [schema.name]);
        clone.addField(field);

        if (config.saveChild) {
            persistDerivation(clone, DM_DERIVATIVES.CAL_VAR, { config: schema, fields: depVars }, retrieveFn);
        }

        return clone;
    }

    /**
     * Propagates changes across all the connected DataModel instances.
     *
     * @public
     * @param {Array} identifiers - A list of identifiers that were interacted with.
     * @param {Object} payload - The interaction specific details.
     *
     * @return {DataModel} DataModel instance.
     */
    propagate (identifiers, payload) {
        let propModel = identifiers;
        if (!(identifiers && identifiers instanceof DataModel)) {
            propModel = assembleModelFromIdentifiers(this, identifiers);
        }

        propagateIdentifiers(this, propModel, {
            grouped: false,
            payload
        });
        return this;
    }

    /**
     * This is a very special method that only applies
     * to cross-tab group where propagation of is won't
     * work so we propagate the selected range of the fields
     * instead.
     *
     * @todo Need to check whether it is private or public API.
     *
     * @private
     * @param {Object} rangeObj Object with field names and corresponding selected ranges.
     * @param {Object} payload Object with insertion related fields.
     *
     * @return {DataModel} DataModel instance.
     * @memberof DataModel
     */
    propagateInterpolatedValues (rangeObj, payload) {
        propagateRange(this, rangeObj, {
            payload,
            grouped: false
        });
        return this;
    }

    /**
     * Associates a callback with an event name.
     *
     * @public
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback to invoke.
     * @return {DataModel} Returns this current DataModel instance itself.
     */
    on (eventName, callback) {
        switch (eventName) {
        case PROPAGATION:
            this._onPropagation.push(callback);
            break;
        }
        return this;
    }

    /**
     * Unsubscribes the callbacks for the provided event name.
     *
     * @public
     * @param {string} eventName - The name of the event to unsubscribe.
     * @return {DataModel} Returns the current DataModel instance itself.
     */
    unsubscribe (eventName) {
        switch (eventName) {
        case PROPAGATION:
            this._onPropagation = [];
            break;

        }
        return this;
    }

    /**
     * This method is used to invoke the method associated with
     * propagation.
     *
     * @todo Fix whether this method would be public or not.
     *
     * @private
     * @param {Object} payload The interaction payload.
     * @param {DataModel} identifiers The propagated DataModel.
     * @memberof DataModel
     */
    handlePropagation (payload) {
        let propListeners = this._onPropagation;
        propListeners.forEach(fn => fn.call(this, payload));
    }

    /**
     * @public
     *
     * Perfoms binning on a measure field based on a binning configuration. This method does not aggregate the number of
     * rows present in DataModel instance. When this operator is applied, it creates a new field with a special kind of
     * measure DiscreteMeasure where it places the binned value for a given row.
     *
     * The binning configuration is defined by
     * - providing custom bucket configuration
     * - providing bin number
     * - providing bin size
     *
     * When custom buckets are provided as part of binning configuration
     * @example
     *  const data = [
     *      { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
     *      { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' }]
     *  const schema1 = [
     *      { name: 'profit', type: 'measure' },
     *      { name: 'sales', type: 'measure' },
     *      { name: 'first', type: 'dimension' },
     *      { name: 'second', type: 'dimension' },
     *  ];
     *  const dataModel = new DataModel(data1, schema1, 'Yo');
     *  const buckets = {
     *      start: 10
     *      stops: [11, 16, 20, 30]
     *  };
     *  const config = { buckets, name: 'sumField' }
     *  const binDM = dataModel.bin('profit', config);\
     *
     * When binCount is defined as part of binning configuration
     * @example
     *  const data = [
     *      { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
     *      { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' }]
     *  const schema1 = [
     *      { name: 'profit', type: 'measure' },
     *      { name: 'sales', type: 'measure' },
     *      { name: 'first', type: 'dimension' },
     *      { name: 'second', type: 'dimension' },
     *  ];
     *  const dataModel = new DataModel(data1, schema1, 'Yo');
     *  const config = { binCount: 2, name: 'sumField' }
     *  const binDM = dataModel.bin('profit', config);
     *
     * When binSize is defined as part of binning configuration
     * @example
     *  const data = [
     *      { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
     *      { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' }]
     *  const schema1 = [
     *      { name: 'profit', type: 'measure' },
     *      { name: 'sales', type: 'measure' },
     *      { name: 'first', type: 'dimension' },
     *      { name: 'second', type: 'dimension' },
     *  ];
     *  const dataModel = new DataModel(data1, schema1, 'Yo');
     *  const config = { binSize: 2, name: 'sumField' }
     *  const binDM = dataModel.bin('profit', config);
     *
     * @param {String} measureName : Name of measure which will be used to create bin
     * @param {Object} config : Config required for bucket creation
     * @param {Object} config.bucketObj : Provides custom buckets definition to perform binning
     * @param {Array.<Number>} config.bucketObj.stops : Defination of bucket ranges. The first number of array is
     *      inclusive and the second number of array is exclusive.
     * @param {Number} [config.bucketObj.startAt] : Force the start of the bin. If not mentioned, the start of the bin
     *      is the first number in the stops
     * @param {Number} config.binSize : Bucket size for each bin
     * @param {Number} config.binCount : no of bins which will be created
     * @param {String} config.binFieldName : name of the new binned field to be created
     *
     * @returns {DataModel} new DataModel instance with the newly created bin.
     */
    bin (measureName, config = { }) {
        const clone = this.clone();
        const binFieldName = config.name || `${measureName}_binned`;
        if (this.getFieldsConfig()[binFieldName] || !this.getFieldsConfig()[measureName]) {
            throw new Error(`Field ${measureName} already exists.`);
        }
        const field = this._partialFieldspace.fields.find(currfield => currfield.name === measureName);
        const dataSet = createBinnedFieldData(field, this._rowDiffset, config);
        const binField = createFields([dataSet.data], [
            {
                name: binFieldName,
                type: FieldType.MEASURE,
                subtype: 'discrete', // @todo : DimensionSubtype
                bins: {
                    range: dataSet.range,
                    mid: dataSet.mid
                }
            }], [binFieldName])[0];
        clone.addField(binField);
        persistDerivation(clone, DM_DERIVATIVES.BIN, { measureName, config, binFieldName }, null);
        return clone;
    }
}

export default DataModel;
