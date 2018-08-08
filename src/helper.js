import { FieldType, FilteringMode } from 'picasso-util';
import Field from './fields/field';
import fieldStore from './field-store';
import Value from './value';
import {
    rowDiffsetIterator,
    groupByIterator,
    projectIterator,
    selectIterator
} from './operator';
import { DM_DERIVATIVES, ROW_ID } from './constants';
import createFields from './field-creator';
import defaultConfig from './default-config';
import * as converter from './converter';

/**
 * Prepares the selection data.
 */
function prepareSelectionData (fields, i) {
    const resp = {};
    for (let field of fields) {
        resp[field.name] = new Value(field.data[i], field);
    }
    return resp;
}

export const updateFields = ([rowDiffset, colIdentifier], partialFieldspace, fieldStoreName) => {
    let collID = colIdentifier.length ? colIdentifier.split(',') : [];
    let partialFieldMap = partialFieldspace.fieldsObj();
    let newFields = collID.map(coll => new Field(partialFieldMap[coll], rowDiffset));
    return fieldStore.createNamespace(newFields, fieldStoreName);
};

export const persistDerivation = (model, operation, config = {}, criteriaFn) => {
    let derivative;
    if (operation !== DM_DERIVATIVES.COMPOSE) {
        derivative = {
            op: operation,
            meta: config,
            criteria: criteriaFn
        };
        model._derivation.push(derivative);
    }
    else {
        derivative = [...criteriaFn];
        model._derivation.length = 0;
        model._derivation.push(...derivative);
    }
};

export const selectHelper = (rowDiffset, fields, selectFn, config) => {
    const newRowDiffSet = [];
    let lastInsertedValue = -1;
    let { mode } = config;
    let li;
    let checker = index => selectFn(prepareSelectionData(fields, index), index);
    if (mode === FilteringMode.INVERSE) {
        checker = index => !selectFn(prepareSelectionData(fields, index));
    }
    rowDiffsetIterator(rowDiffset, (i) => {
        if (checker(i)) {
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
};

export const assembleModelFromIdentifiers = (model, identifiers) => {
    let schema = [];
    let data;
    let fieldMap = model.getFieldsConfig();
    if (identifiers.length) {
        let fields = identifiers[0];
        let len = fields.length;
        for (let i = 0; i < len; i++) {
            let field = fields[i];
            let fieldObj;
            if (field === ROW_ID) {
                fieldObj = {
                    name: field,
                    type: FieldType.DIMENSION
                };
            }
            else {
                fieldObj = fieldMap[field] && Object.assign({}, fieldMap[field].def);
            }
            if (fieldObj) {
                schema.push(Object.assign(fieldObj));
            }
        }
        // format the data
        // @TODO: no documentation on how CSV_ARR data format works.
        data = [];
        const header = identifiers[0];
        for (let i = 1; i < identifiers.length; i += 1) {
            const vals = identifiers[i];
            const temp = {};
            vals.forEach((fieldVal, cIdx) => {
                temp[header[cIdx]] = fieldVal;
            });
            data.push(temp);
        }
    }
    else {
        data = [];
        schema = [];
    }
    return new model.constructor(data, schema);
};

export const filterPropagationModel = (model, propModel) => {
    const { data, schema } = propModel.getData();
    let filteredModel;
    if (schema.length) {
        if (schema[0].name === ROW_ID) {
            // iterate over data and create occurence map
            const occMap = {};
            data.forEach((val) => {
                occMap[val[0]] = true;
            });
            filteredModel = model.select((fields, rIdx) => occMap[rIdx], {
                saveChild: false
            });
        } else {
            let fieldMap = model.getFieldsConfig();
            let filteredSchema = schema.filter(d => d.name in fieldMap && d.type === FieldType.DIMENSION);
            filteredModel = model.select((fields) => {
                let include = true;
                filteredSchema.forEach((propField, idx) => {
                    let index = data.findIndex(d => d[idx] === fields[propField.name].valueOf());
                    include = include && index !== -1;
                });
                return include;
            }, {
                saveChild: false
            });
        }
    }
    else {
        filteredModel = propModel;
    }

    return filteredModel;
};

export const cloneWithSelect = (sourceDm, selectFn, selectConfig, cloneConfig) => {
    const cloned = sourceDm.clone(cloneConfig.saveChild);
    const rowDiffset = selectHelper(
        cloned._rowDiffset,
        cloned.getPartialFieldspace().fields,
        selectFn,
        selectConfig
    );
    cloned._rowDiffset = rowDiffset;
    cloned.__calculateFieldspace().calculateFieldsConfig();
    // Store reference to child model and selector function
    if (cloneConfig.saveChild) {
        persistDerivation(cloned, DM_DERIVATIVES.SELECT, { config: selectConfig }, selectFn);
    }

    return cloned;
};

export const cloneWithProject = (sourceDm, projField, config, allFields) => {
    const cloned = sourceDm.clone(config.saveChild);
    let projectionSet = projField;
    if (config.mode === FilteringMode.INVERSE) {
        projectionSet = allFields.filter(fieldName => projField.indexOf(fieldName) === -1);
    }
    // cloned._colIdentifier = sourceDm._colIdentifier.split(',')
    //                         .filter(coll => projectionSet.indexOf(coll) !== -1).join();
    cloned._colIdentifier = projectionSet.join(',');
    cloned.__calculateFieldspace().calculateFieldsConfig();
    // Store reference to child model and projection fields
    if (config.saveChild) {
        persistDerivation(
            cloned,
            DM_DERIVATIVES.PROJECT,
            { projField, config, actualProjField: projectionSet },
            null
        );
    }

    return cloned;
};

export const updateData = (relation, data, schema, options) => {
    options = Object.assign(Object.assign({}, defaultConfig), options);
    const converterFn = converter[options.dataFormat];

    if (!(converterFn && typeof converterFn === 'function')) {
        throw new Error(`No converter function found for ${options.dataFormat} format`);
    }

    const [header, formattedData] = converterFn(data, options);
    const fieldArr = createFields(formattedData, schema, header);

    // This will create a new fieldStore with the fields
    const nameSpace = fieldStore.createNamespace(fieldArr, options.name);
    relation._partialFieldspace = nameSpace;
    // If data is provided create the default colIdentifier and rowDiffset
    relation._rowDiffset = formattedData.length && formattedData[0].length ? `0-${formattedData[0].length - 1}` : '';
    relation._colIdentifier = (schema.map(_ => _.name)).join();
    return relation;
};

export const fieldInSchema = (schema, field) => {
    let i = 0;

    for (; i < schema.length; ++i) {
        if (field === schema[i].name) {
            return {
                type: schema[i].subtype || schema[i].type,
                index: i
            };
        }
    }
    return null;
};

export const propagateIdentifiers = (dataModel, identifiers, config = {}, source) => {
    let propModel = identifiers;
    let payload = config.payload;
    let sourceIdentifiers = config.sourceIdentifiers;
    let grouped = config.grouped;

    source = source || dataModel;
    if (sourceIdentifiers === undefined) {
        config.sourceIdentifiers = sourceIdentifiers = propModel;
    }

    // create the filtered model
    const filteredModel = filterPropagationModel(dataModel, propModel);
    // function to propagate to target the DataModel instance.
    const forwardPropagation = (targetDM, propagationData, group) => {
        targetDM.handlePropagation({
            payload,
            data: propagationData,
            sourceIdentifiers
        });
        propagateIdentifiers(targetDM, propagationData, {
            payload,
            sourceIdentifiers,
            grouped: group
        }, dataModel);
    };
    // propagate to children created by SELECT operation
    selectIterator(dataModel, (targetDM, criteria) => {
        if (targetDM !== source) {
            let selectedModel = propModel;
            if (grouped) {
                selectedModel = !propModel._isEmpty() && propModel.select(criteria);
            }
            forwardPropagation(targetDM, selectedModel, grouped);
        }
    });
    // propagate to children created by PROJECT operation
    projectIterator(dataModel, (targetDM) => {
        if (targetDM !== source) {
            // pass al the props cause it won't make a difference
            forwardPropagation(targetDM, propModel, grouped);
        }
    });
    // propagate to children created by groupBy operation
    groupByIterator(dataModel, (targetDM, conf) => {
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
    if (dataModel._parent && source !== dataModel._parent) {
        forwardPropagation(dataModel._parent, propModel, grouped);
    }
};

export const propagateRange = (dataModel, propModel, config = {}, source) => {
    let payload = config.payload;
    let sourceIdentifiers = config.sourceIdentifiers;

    source = source || dataModel;
    if (sourceIdentifiers === undefined) {
        config.sourceIdentifiers = sourceIdentifiers = propModel;
    }

    const forward = (targetDM, propagationModel, isParent) => {
        targetDM.handlePropagation({
            payload,
            data: propagationModel,
            sourceIdentifiers
        });
        propagateRange(targetDM, isParent ? propModel : propagationModel, {
            payload,
            sourceIdentifiers
        }, dataModel);
    };

    // propagate to children created by SELECT operation
    selectIterator(dataModel, (targetDM, fn) => {
        if (targetDM !== source) {
            let selectModel;
            selectModel = propModel.select(fn, {
                saveChild: false
            });
            forward(targetDM, selectModel);
        }
    });
    // propagate to children created by PROJECT operation
    projectIterator(dataModel, (targetDM, actualProjField) => {
        if (targetDM !== source) {
            let projectModel = propModel.project(actualProjField, {
                saveChild: false
            });
            forward(targetDM, projectModel);
        }
    });

    // propagate to children created by GROUPBY operation
    groupByIterator(dataModel, (targetDM) => {
        if (targetDM !== source) {
            forward(targetDM, propModel);
        }
    });

    // propagate to parent if parent is not source
    if (dataModel._parent && source !== dataModel._parent) {
        forward(dataModel._parent, propModel);
    }
};
