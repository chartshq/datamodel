/* eslint-disable default-case */

import { FieldType } from 'muze-util';
import { persistDerivation, assembleModelFromIdentifiers, filterPropagationModel } from './helper';
import { DM_DERIVATIVES, PROPAGATION } from './constants';
import {
    dataBuilder,
    rowDiffsetIterator,
    groupBy,
    groupByIterator,
    projectIterator,
    selectIterator,
} from './operator';
import { createBinnedFieldData } from './operator/bucket-creator';
import Relation from './relation';
import reducerStore from './utils/reducer';
import createFields from './field-creator';

/**
 * A model which has been built on the concept of relational algebra.
 *
 * @extends Relation
 */
class DataModel extends Relation {

    /**
     * Creates a new DataModel instance.
     *
     * @param {Array} args - The arguments which is passed directly to the parent class.
     */
    constructor (...args) {
        super(...args);

        this._onPropagation = [];
        this._sortingDetails = [];
    }

    static get Reducers () {
        return reducerStore;
    }

    /**
     * Returns the data after operation in the format of
     * multidimensional array according to the given option value.
     *
     * @public
     * @param {Object} [options] - Define how the data need to be returned.
     * @param {Object} [options.order='row'] - Define the order of the data: row or column.
     * @param {Object} [options.formatter=null] - An object map containing field specific formatter function.
     * @param {Object} [options.withUid=false] - Whether the data uids will be included or not.
     * @param {Object} [options.sort=[]] - The sorting details to sort the data.
     * @return {Array} Returns a multidimensional array of the data.
     * @example
     *
     * // Return data with formatted date value.
     * const options = {
     *  order: 'row',
     *  formatter: {
     *      birthday: (val, rowId, schema) => {
     *          return yourCustomFormatter(val, "%Y-%m-%d");
     *      }
     *  }
     * }
     *
     *  const dm = new DataModel(data, schema);
     *  const dataFormatted = dm.getData(options);
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

    /**
     * Performs group-by operation on the current DataModel instance according to
     * the fields and reducers provided.
     * The fields can be skipped in that case all field will be taken into consideration.
     * The reducer can also be given, If nothing is provided sum will be the default reducer.
     *
     * @public
     * @param {Array} fieldsArr - An array containing the name of the columns.
     * @param {Object | Function | string} [reducers={}] - The reducer function.
     * @param {string} [saveChild=true] - Whether the child to save  or not.
     * @param {DataModel} [existingDataModel] - An optional existing DataModel instance.
     * @return {DataModel} Returns the new DataModel instance after operation.
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
     *
     * @param {Object} varConfig :{
     *  name: 'new-var',
     *  type: 'measure | dimension',
     *  subype: 'temporal | ...',
     *  all the variable what schema gets
     *  }}
     *  @param {Array} paramConfig : ['dep-var-1', 'dep-var-2', 'dep-var-3', ([var1, var2, var3], rowIndex, dm) => {}]
     * @param {Object} config : { saveChild : true | false , removeDependentDimensions : true|false}
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
     * @param {DataModel} source - The source DataModel instance.
     */
    propagate (identifiers, payload, source, grouped = false, sourceIdentifiers) {
        let propModel = identifiers;
        if (!(propModel instanceof DataModel)) {
            propModel = assembleModelFromIdentifiers(this, identifiers);
        }

        if (sourceIdentifiers === undefined) {
            sourceIdentifiers = propModel;
        }

        // create the filtered model
        const filteredModel = filterPropagationModel(this, propModel);
        // function to propagate to target the DataModel instance.
        const forwardPropagation = (targetDM, propagationData, group) => {
            targetDM.handlePropagation({
                payload,
                data: propagationData,
                sourceIdentifiers
            });
            targetDM.propagate(propagationData, payload, this, group, sourceIdentifiers);
        };
        // propagate to children created by SELECT operation
        selectIterator(this, (targetDM, criteria) => {
            if (targetDM !== source) {
                let selectedModel = propModel;
                if (grouped) {
                    selectedModel = !propModel._isEmpty() && propModel.select(criteria);
                }
                forwardPropagation(targetDM, selectedModel);
            }
        });
        // propagate to children created by PROJECT operation
        projectIterator(this, (targetDM) => {
            if (targetDM !== source) {
                // pass al the props cause it won't make a difference
                forwardPropagation(targetDM, propModel, grouped);
            }
        });
        // propagate to children created by groupBy operation
        groupByIterator(this, (targetDM, conf) => {
            if (targetDM !== source) {
                const {
                    reducer,
                    groupByString,
                } = conf;
                // group the filtered model based on groupBy string of target
                const groupedPropModel = filteredModel.groupBy(groupByString.split(','), reducer, {
                    saveChild: false
                });
                forwardPropagation(targetDM, groupedPropModel, true);
            }
        });
        // propagate to parent if parent is not source
        if (this._parent && source !== this._parent) {
            forwardPropagation(this._parent, propModel, grouped);
        }
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
     * @memberof DataModel
     */
    propagateInterpolatedValues (rangeObj, payload, fromSource, sourceIdentifiers) {
        const source = fromSource || this;
        let propModel = rangeObj;
        if (!(propModel instanceof DataModel)) {
            const measures = Object.keys(rangeObj);
            propModel = this.select((fields) => {
                let include = true;
                measures.forEach((fieldName) => {
                    const domain = rangeObj[fieldName];
                    include = include && fields[fieldName] >= domain[0];
                    include = include && fields[fieldName] <= domain[1];
                });
                return include;
            }, {
                saveChild: false
            });
        }
        if (sourceIdentifiers === undefined) {
            sourceIdentifiers = propModel;
        }
        const forward = (dataModel, propagationModel, isParent) => {
            dataModel.handlePropagation({
                payload,
                data: propagationModel,
                sourceIdentifiers
            });
            dataModel.propagateInterpolatedValues(isParent ?
                rangeObj : propagationModel, payload, this, sourceIdentifiers);
        };
        // propagate to children created by SELECT operation
        selectIterator(this, (targetDM, fn) => {
            if (targetDM !== source) {
                let selectModel;
                selectModel = propModel.select(fn, {
                    saveChild: false
                });
                forward(targetDM, selectModel);
            }
        });
        // propagate to children created by PROJECT operation
        projectIterator(this, (targetDM, actualProjField) => {
            if (targetDM !== source) {
                let projectModel = propModel.project(actualProjField, {
                    saveChild: false
                });
                forward(targetDM, projectModel);
            }
        });
        // propagate to children created by GROUPBY operation
        groupByIterator(this, (targetDM) => {
            if (targetDM !== source) {
                forward(targetDM, propModel);
            }
        });
        // propagate to parent if parent is not source
        if (this._parent && source !== this._parent) {
            forward(this._parent, propModel, true);
        }
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
    handlePropagation (payload, identifiers) {
        let propListeners = this._onPropagation;
        propListeners.forEach(fn => fn.call(this, payload, identifiers));
    }

    /**
     @param {String} measureName : name of measure which will be used to create bin
     @param {Object} config : bucketObj : {} || binSize : number || noOfBins : number || binFieldName : string
     @param {Function | FunctionName} reducer : binning reducer
     */
    bin (measureName, config = { }, reducer) {
        const clone = this.clone();
        const binFieldName = config.name || `${measureName}_binned`;
        if (this.getFieldsConfig()[binFieldName] || !this.getFieldsConfig()[measureName]) {
            throw new Error(`Field ${measureName} already exists.`);
        }
        const field = this._partialFieldspace.fields.find(currfield => currfield.name === measureName);
        const reducerFunc = reducerStore.resolve(reducer || field.defAggFn()) || reducerStore.defaultReducer();
        const data = createBinnedFieldData(field.data, this._rowDiffset, reducerFunc, config);
        const binField = createFields([data], [
            {
                name: binFieldName,
                type: FieldType.DIMENSION
            }], [binFieldName])[0];
        clone.addField(binField);
        persistDerivation(clone, DM_DERIVATIVES.BIN, { measureName, config, binFieldName }, null);
        return clone;
    }
}

export default DataModel;
