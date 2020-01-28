import { FieldType, FilteringMode, DimensionSubtype, MeasureSubtype, DataFormat } from './enums';
import fieldStore from './field-store';
import Value from './value';
import {
    rowDiffsetIterator
} from './operator';
import { DM_DERIVATIVES, LOGICAL_OPERATORS, ROW_ID } from './constants';
import { createFields, createUnitFieldFromPartial } from './field-creator';
import defaultConfig from './default-config';
import { converterStore } from './converter';
import { fieldRegistry } from './fields';
import { extend2, detectDataFormat } from './utils';

/**
 * Prepares the selection data.
 */
function prepareSelectionData (fields, formattedData, rawData, i) {
    const resp = {};

    for (const [key, field] of fields.entries()) {
        resp[field.name()] = new Value(formattedData[key][i], rawData[key][i], field);
    }
    return resp;
}

export function prepareJoinData (fields) {
    const resp = {};

    for (const key in fields) {
        resp[key] = new Value(fields[key].formattedValue, fields[key].rawValue, key);
    }
    return resp;
}

export const updateFields = ([rowDiffset, colIdentifier], partialFieldspace, fieldStoreName) => {
    let collID = colIdentifier.length ? colIdentifier.split(',') : [];
    let partialFieldMap = partialFieldspace.fieldsObj();
    let newFields = collID.map(coll => createUnitFieldFromPartial(partialFieldMap[coll].partialField, rowDiffset));
    return fieldStore.createNamespace(newFields, fieldStoreName);
};

export const persistCurrentDerivation = (model, operation, config = {}, criteriaFn) => {
    if (operation === DM_DERIVATIVES.COMPOSE) {
        model._derivation.length = 0;
        model._derivation.push(...criteriaFn);
    } else {
        model._derivation.push({
            op: operation,
            meta: config,
            criteria: criteriaFn
        });
    }
};
export const persistAncestorDerivation = (sourceDm, newDm) => {
    newDm._ancestorDerivation.push(...sourceDm._ancestorDerivation, ...sourceDm._derivation);
};

export const persistDerivations = (sourceDm, model, operation, config = {}, criteriaFn) => {
    persistCurrentDerivation(model, operation, config, criteriaFn);
    persistAncestorDerivation(sourceDm, model);
};

const selectModeMap = {
    [FilteringMode.NORMAL]: {
        diffIndex: ['rowDiffset'],
        calcDiff: [true, false]
    },
    [FilteringMode.INVERSE]: {
        diffIndex: ['rejectRowDiffset'],
        calcDiff: [false, true]
    },
    [FilteringMode.ALL]: {
        diffIndex: ['rowDiffset', 'rejectRowDiffset'],
        calcDiff: [true, true]
    }
};

const generateRowDiffset = (rowDiffset, i, lastInsertedValue) => {
    if (lastInsertedValue !== -1 && i === (lastInsertedValue + 1)) {
        const li = rowDiffset.length - 1;

        rowDiffset[li] = `${rowDiffset[li].split('-')[0]}-${i}`;
    } else {
        rowDiffset.push(`${i}`);
    }
};

export const selectRowDiffsetIterator = (rowDiffset, checker, mode) => {
    let lastInsertedValueSel = -1;
    let lastInsertedValueRej = -1;
    const newRowDiffSet = [];
    const rejRowDiffSet = [];

    const [shouldSelect, shouldReject] = selectModeMap[mode].calcDiff;

    rowDiffsetIterator(rowDiffset, (i) => {
        const checkerResult = checker(i);
        checkerResult && shouldSelect && generateRowDiffset(newRowDiffSet, i, lastInsertedValueSel);
        !checkerResult && shouldReject && generateRowDiffset(rejRowDiffSet, i, lastInsertedValueRej);
    });
    return {
        rowDiffset: newRowDiffSet.join(','),
        rejectRowDiffset: rejRowDiffSet.join(',')
    };
};


export const rowSplitDiffsetIterator = (rowDiffset, checker, mode, dimensionArr, fieldStoreObj) => {
    let lastInsertedValue = {};
    const splitRowDiffset = {};
    const dimensionMap = {};

    rowDiffsetIterator(rowDiffset, (i) => {
        if (checker(i)) {
            let hash = '';

            let dimensionSet = { keys: {} };

            dimensionArr.forEach((_) => {
                const data = fieldStoreObj[_].partialField.data[i];
                hash = `${hash}-${data}`;
                dimensionSet.keys[_] = data;
            });

            if (splitRowDiffset[hash] === undefined) {
                splitRowDiffset[hash] = [];
                lastInsertedValue[hash] = -1;
                dimensionMap[hash] = dimensionSet;
            }

            generateRowDiffset(splitRowDiffset[hash], i, lastInsertedValue[hash]);
            lastInsertedValue[hash] = i;
        }
    });

    return {
        splitRowDiffset,
        dimensionMap
    };
};


export const selectHelper = (clonedDm, selectFn, config, sourceDm, iterator) => {
    let cachedStore = {};
    let cloneProvider = () => sourceDm.detachedRoot();
    const { mode } = config;
    const rowDiffset = clonedDm._rowDiffset;
    const cachedValueObjects = clonedDm._partialFieldspace._cachedValueObjects;

    const selectorHelperFn = index => selectFn(
        cachedValueObjects[index],
        index,
        cloneProvider,
        cachedStore
    );

    return iterator(rowDiffset, selectorHelperFn, mode);
};

export const cloneWithAllFields = (model) => {
    const clonedDm = model.clone(false);
    const partialFieldspace = model.getPartialFieldspace();
    clonedDm._colIdentifier = partialFieldspace.fields.map(f => f.name()).join(',');

    // flush out cached namespace values on addition of new fields
    partialFieldspace._cachedFieldsObj = null;
    partialFieldspace._cachedDimension = null;
    partialFieldspace._cachedMeasure = null;
    clonedDm.__calculateFieldspace().calculateFieldsConfig();

    return clonedDm;
};

const getKey = (arr, data, fn, rowId) => {
    let key = fn(arr, data, 0, rowId);

    for (let i = 1, len = arr.length; i < len; i++) {
        key = `${key},${fn(arr, data, i, rowId)}`;
    }
    return key;
};

const keyFn = (arr, fields, idx, rowId) => {
    const field = arr[idx];
    const val = field === ROW_ID ? rowId : fields[field].internalValue;
    return val;
};

const domainChecker = (val, domain) => {
    const domainArr = domain[0] instanceof Array ? domain : [domain];
    return domainArr.some(dom => val >= dom[0] && val <= dom[1]);
};

const boundsChecker = {
    [MeasureSubtype.CONTINUOUS]: domainChecker,
    [DimensionSubtype.TEMPORAL]: domainChecker
};

const isWithinDomain = (value, domain, fieldType) => boundsChecker[fieldType](value, domain);

export const filterPropagationModel = (model, propModels, config = {}) => {
    let fns = [];
    const operation = config.operation || LOGICAL_OPERATORS.AND;
    const { filterByDim = true, filterByMeasure = false, clone = true } = config;
    const clonedModel = clone ? cloneWithAllFields(model) : model;
    const modelFieldsConfig = clonedModel.getFieldsConfig();
    const uids = model.getPartialFieldspace().idField.data();

    if (!propModels.length) {
        fns = [() => false];
    } else {
        fns = propModels.map(propModel => (({ criteria = {} }) => {
            const { identifiers = [[], []], range } = criteria;
            let [fieldNames = [], values = []] = identifiers;
            const indices = fieldNames.reduce((map, name, i) => {
                map[name] = i;
                return map;
            }, {});
            fieldNames = fieldNames.filter(field => (field in modelFieldsConfig &&
                modelFieldsConfig[field].def.type === FieldType.DIMENSION) || field === ROW_ID);
            const dLen = fieldNames.length;
            const valuesMap = {};

            if (dLen) {
                for (let i = 1, len = identifiers.length; i < len; i++) {
                    const row = identifiers[i];
                    let key;
                    if (ROW_ID in indices) {
                        const ids = row[indices[ROW_ID]];
                        if (ids) {
                            ids.values().forEach((id) => {
                                key = `${fieldNames.map((field) => {
                                    const idx = indices[field];
                                    return field === ROW_ID ? id : row[idx];
                                })}`;
                                valuesMap[key] = 1;
                            });
                        }
                    } else {
                        key = `${fieldNames.map((field) => {
                            const idx = indices[field];
                            return row[idx];
                        })}`;
                        valuesMap[key] = 1;
                    }
                }
            }
            let rangeKeys = Object.keys(range || {}).filter(field => field in modelFieldsConfig);
            const hasData = values.length || rangeKeys.length;

            if (!filterByMeasure) {
                rangeKeys = rangeKeys.filter(field => modelFieldsConfig[field].def.type !== FieldType.MEASURE);
            }

            if (!filterByDim) {
                rangeKeys = rangeKeys.filter(field => modelFieldsConfig[field].def.type !== FieldType.DIMENSION);
            }

            return hasData ? (fields, i) => {
                let present = true;
                if (filterByDim) {
                    present = dLen ? valuesMap[getKey(fieldNames, fields, keyFn, uids[i])] : true;
                }

                return rangeKeys.every((field) => {
                    const val = fields[field].internalValue;
                    return isWithinDomain(val, range[field], modelFieldsConfig[field].def.subtype);
                }) && present;
            } : () => false;
        })(propModel));
    }

    let filteredModel;
    if (operation === LOGICAL_OPERATORS.AND) {
        filteredModel = clonedModel.select((fields, i) => fns.every(fn => fn(fields, i)), {
            saveChild: false
        });
    } else {
        filteredModel = clonedModel.select((fields, i) => fns.some(fn => fn(fields, i)), {
            saveChild: false
        });
    }

    return filteredModel;
};


export const splitWithSelect = (sourceDm, dimensionArr, reducerFn = val => val, config) => {
    const {
        saveChild,
    } = config;
    const fieldStoreObj = sourceDm.getFieldspace().fieldsObj();

    const {
        splitRowDiffset,
        dimensionMap
    } = selectHelper(
        sourceDm.clone(saveChild),
        reducerFn,
        config,
        sourceDm,
        (...params) => rowSplitDiffsetIterator(...params, dimensionArr, fieldStoreObj)
        );

    const clonedDMs = [];
    Object.keys(splitRowDiffset).sort().forEach((e) => {
        if (splitRowDiffset[e]) {
            const cloned = sourceDm.clone(saveChild);
            const derivation = dimensionMap[e];
            cloned._rowDiffset = splitRowDiffset[e].join(',');
            cloned.__calculateFieldspace().calculateFieldsConfig();

            const derivationFormula = fields => dimensionArr.every(_ => fields[_].internalValue === derivation.keys[_]);
            // Store reference to child model and selector function
            if (saveChild) {
                persistDerivations(sourceDm, cloned, DM_DERIVATIVES.SELECT, config, derivationFormula);
            }
            cloned._derivation[cloned._derivation.length - 1].meta = dimensionMap[e];

            clonedDMs.push(cloned);
        }
    });


    return clonedDMs;
};
export const addDiffsetToClonedDm = (clonedDm, rowDiffset, sourceDm, selectConfig, selectFn) => {
    clonedDm._rowDiffset = rowDiffset;
    clonedDm.__calculateFieldspace().calculateFieldsConfig();
    persistDerivations(
        sourceDm,
        clonedDm,
        DM_DERIVATIVES.SELECT,
         { config: selectConfig },
          selectFn
    );
};


export const cloneWithSelect = (sourceDm, selectFn, selectConfig, cloneConfig) => {
    let extraCloneDm = {};

    let { mode } = selectConfig;

    const cloned = sourceDm.clone(cloneConfig.saveChild);
    const setOfRowDiffsets = selectHelper(
        cloned,
        selectFn,
        selectConfig,
        sourceDm,
        selectRowDiffsetIterator
    );
    const diffIndex = selectModeMap[mode].diffIndex;

    addDiffsetToClonedDm(cloned, setOfRowDiffsets[diffIndex[0]], sourceDm, selectConfig, selectFn);

    if (diffIndex.length > 1) {
        extraCloneDm = sourceDm.clone(cloneConfig.saveChild);
        addDiffsetToClonedDm(extraCloneDm, setOfRowDiffsets[diffIndex[1]], sourceDm, selectConfig, selectFn);
        return [cloned, extraCloneDm];
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

    persistDerivations(
        sourceDm,
        cloned,
        DM_DERIVATIVES.PROJECT,
        { projField, config, actualProjField: projectionSet },
        null
    );

    return cloned;
};


export const splitWithProject = (sourceDm, projFieldSet, config, allFields) =>
    projFieldSet.map(projFields =>
        cloneWithProject(sourceDm, projFields, config, allFields));

export const sanitizeUnitSchema = (unitSchema) => {
    // Do deep clone of the unit schema as the user might change it later.
    unitSchema = extend2({}, unitSchema);
    if (!unitSchema.type) {
        unitSchema.type = FieldType.DIMENSION;
    }

    if (!unitSchema.subtype) {
        switch (unitSchema.type) {
        case FieldType.MEASURE:
            unitSchema.subtype = MeasureSubtype.CONTINUOUS;
            break;
        default:
        case FieldType.DIMENSION:
            unitSchema.subtype = DimensionSubtype.CATEGORICAL;
            break;
        }
    }

    return unitSchema;
};

export const validateUnitSchema = (unitSchema) => {
    const { type, subtype, name } = unitSchema;
    if (type === FieldType.DIMENSION || type === FieldType.MEASURE) {
        if (!fieldRegistry.has(subtype)) {
            throw new Error(`DataModel doesn't support measure field subtype ${subtype} used for ${name} field`);
        }
    } else {
        throw new Error(`DataModel doesn't support field type ${type} used for ${name} field`);
    }
};

export const sanitizeAndValidateSchema = schema => schema.map((unitSchema) => {
    unitSchema = sanitizeUnitSchema(unitSchema);
    validateUnitSchema(unitSchema);
    return unitSchema;
});

export const resolveFieldName = (schema, dataHeader) => {
    schema.forEach((unitSchema) => {
        const fieldNameAs = unitSchema.as;
        if (!fieldNameAs) { return; }

        const idx = dataHeader.indexOf(unitSchema.name);
        dataHeader[idx] = fieldNameAs;
        unitSchema.name = fieldNameAs;
        delete unitSchema.as;
    });
};

export const updateData = (relation, data, schema, options) => {
    schema = sanitizeAndValidateSchema(schema);
    options = Object.assign(Object.assign({}, defaultConfig), options);
    const converter = converterStore.get(options.dataFormat);


    if (!converter) {
        throw new Error(`No converter function found for ${options.dataFormat} format`);
    }

    let [header, formattedData] = converter.convert(data, schema, options);
    resolveFieldName(schema, header);

    const idIndex = schema.findIndex(field => field.subtype === DimensionSubtype.ID);
    let idData;

    if (idIndex !== -1) {
        idData = formattedData[idIndex] || [];
        formattedData = formattedData.filter((d, i) => i !== idIndex);
        header = header.filter((d, i) => i !== idIndex);
        schema = schema.filter(field => field.subtype !== DimensionSubtype.ID);
    } else {
        const rowLength = (formattedData[0] && formattedData[0].length) || 0;
        idData = new Array(rowLength).fill().map((d, i) => i);
    }

    const fieldArr = createFields(formattedData, schema, header);

    const idField = createFields([idData], [{
        name: ROW_ID,
        type: 'dimension',
        subtype: DimensionSubtype.ID
    }], [ROW_ID])[0];


    // This will create a new fieldStore with the fields
    const nameSpace = fieldStore.createNamespace(fieldArr, options.name, idField);
    relation._partialFieldspace = nameSpace;

    // If data is provided create the default colIdentifier and rowDiffset
    relation._rowDiffset = formattedData.length && formattedData[0].length ? `0-${formattedData[0].length - 1}` : '';

    // This stores the value objects which is passed to the filter method when selection operation is done.
    const valueObjects = [];
    const { fields } = nameSpace;
    const rawFieldsData = fields.map(field => field.data());
    const formattedFieldsData = fields.map(field => field.formattedData());
    const idFieldData = idField.data();
    rowDiffsetIterator(relation._rowDiffset, (i) => {
        valueObjects[i] = prepareSelectionData(fields, formattedFieldsData, rawFieldsData, i);
        valueObjects[i][ROW_ID] = new Value(idFieldData[i], idFieldData[i], idField);
    });
    nameSpace._cachedValueObjects = valueObjects;
    relation._colIdentifier = (schema.map(_ => _.name)).join();
    relation._dataFormat = options.dataFormat === DataFormat.AUTO ? detectDataFormat(data) : options.dataFormat;
    return relation;
};

export const fieldInSchema = (schema, field) => {
    let i = 0;

    for (; i < schema.length; ++i) {
        if (field === schema[i].name) {
            return {
                name: field,
                type: schema[i].subtype || schema[i].type,
                index: i,
            };
        }
    }
    return null;
};

export const getDerivationArguments = (derivation) => {
    let params = [];
    let operation;
    operation = derivation.op;
    switch (operation) {
    case DM_DERIVATIVES.SELECT:
        params = [derivation.criteria];
        break;
    case DM_DERIVATIVES.PROJECT:
        params = [derivation.meta.actualProjField];
        break;
    case DM_DERIVATIVES.SORT:
        params = [derivation.criteria];
        break;
    case DM_DERIVATIVES.GROUPBY:
        operation = 'groupBy';
        params = [derivation.meta.groupByString.split(','), derivation.criteria];
        break;
    default:
        operation = null;
    }

    return {
        operation,
        params
    };
};

const applyExistingOperationOnModel = (propModel, dataModel) => {
    const derivations = dataModel.getDerivations();
    let selectionModel = propModel;

    derivations.forEach((derivation) => {
        if (!derivation) {
            return;
        }

        const { operation, params } = getDerivationArguments(derivation);
        if (operation) {
            selectionModel = selectionModel[operation](...params, {
                saveChild: false
            });
        }
    });

    return selectionModel;
};

const getFilteredModel = (propModel, path) => {
    for (let i = 0, len = path.length; i < len; i++) {
        const model = path[i];
        propModel = applyExistingOperationOnModel(propModel, model);
    }
    return propModel;
};

const propagateIdentifiers = (dataModel, propModel, config = {}, propModelInf = {}) => {
    const excludeModels = propModelInf.excludeModels || [];
    const criterias = propModelInf.criteria;

    const propagate = excludeModels.length ? excludeModels.indexOf(dataModel) === -1 : true;

    propagate && dataModel.handlePropagation(propModel, config);

    const children = dataModel._children;
    children.forEach((child) => {
        const matchingCriteria = criterias.filter(val => val.groupedModel === child);
        let selectionModel = applyExistingOperationOnModel(propModel, child);

        if (matchingCriteria.length) {
            selectionModel = filterPropagationModel(selectionModel, matchingCriteria, {
                filterByDim: false,
                filterByMeasure: true,
                clone: false
            });
        }
        propagateIdentifiers(child, selectionModel, config, propModelInf);
    });
};

export const getRootGroupByModel = (model) => {
    while (model._parent && model._derivation.find(d => d.op !== DM_DERIVATIVES.GROUPBY)) {
        model = model._parent;
    }
    return model;
};

export const getRootDataModel = (model) => {
    while (model._parent) {
        model = model._parent;
    }
    return model;
};

export const getPathToRootModel = (model, path = []) => {
    while (model._parent) {
        path.push(model);
        model = model._parent;
    }
    return path;
};

export const propagateToAllDataModels = (identifiers, rootModels, propagationInf, config) => {
    let criteria;
    const { propagationNameSpace, propagateToSource } = propagationInf;
    const propagationSourceId = propagationInf.sourceId;
    const filterFn = (entry) => {
        const filter = config.filterFn || (() => true);
        return filter(entry, config);
    };

    const addGroupedModel = ({ config: conf, model }) => {
        const { criteria: crit } = conf;
        let groupedModel;

        if (crit !== null && crit.fields.some(d => d.type === FieldType.MEASURE)) {
            groupedModel = getRootGroupByModel(model);
        }
        return Object.assign({}, conf, {
            groupedModel
        });
    };

    let criterias = [];

    if (identifiers === null) {
        criterias = [{
            criteria: []
        }];
        criteria = [];
    } else {
        let actionCriterias = Object.values(propagationNameSpace.mutableActions);
        if (propagateToSource !== false) {
            actionCriterias = actionCriterias.filter(d => d.config.sourceId !== propagationSourceId);
        }

        const filteredCriteria = actionCriterias.filter(filterFn);

        const excludeModels = [];

        if (propagateToSource !== false) {
            const sourceActionCriterias = Object.values(propagationNameSpace.mutableActions);

            sourceActionCriterias.forEach((actionInf) => {
                const actionConf = actionInf.config;
                if (actionConf.applyOnSource === false && actionConf.action === config.action &&
                        actionConf.sourceId !== propagationSourceId) {
                    excludeModels.push(actionInf.model);
                    criteria = sourceActionCriterias.filter(d => d !== actionInf).map(addGroupedModel);
                    criteria.length && criterias.push({
                        criteria,
                        models: actionInf.model,
                        path: getPathToRootModel(actionInf.model)
                    });
                }
            });
        }


        criteria = [].concat(...[...filteredCriteria.map(addGroupedModel), {
            criteria: identifiers,
            groupedModel: identifiers !== null && identifiers.fields.some(d => d.type === FieldType.MEASURE) ?
                getRootGroupByModel(propagationInf.propagationSource) : null
        }]).filter(d => d !== null);
        criterias.push({
            criteria,
            excludeModels: [...excludeModels, ...config.excludeModels || []]
        });
    }

    const rootModel = rootModels.model;

    const propConfig = Object.assign({
        sourceIdentifiers: identifiers,
        propagationSourceId
    }, config);

    criterias.forEach((inf) => {
        const { criteria: crit } = inf;
        const propagationModel = filterPropagationModel(rootModel, crit, {
            filterByMeasure: !!crit.find(d => d.groupedModel === rootModel)
        });
        const path = inf.path;

        if (path) {
            const filteredModel = getFilteredModel(propagationModel, path.reverse());
            inf.models.handlePropagation(filteredModel, propConfig);
        } else {
            propagateIdentifiers(rootModel, propagationModel, propConfig, {
                excludeModels: inf.excludeModels,
                criteria: crit
            });
        }
    });
};

export const propagateImmutableActions = (propagationNameSpace, rootModel, propagationInf) => {
    const immutableActions = propagationNameSpace.immutableActions;

    for (const action in immutableActions) {
        const actionInf = immutableActions[action];
        const actionConf = actionInf.config;
        const propagationSourceId = propagationInf.config.sourceId;
        const filterImmutableAction = propagationInf.propConfig.filterImmutableAction ?
            propagationInf.propConfig.filterImmutableAction(actionConf, propagationInf.config) : true;
        if (actionConf.sourceId !== propagationSourceId && filterImmutableAction) {
            const criteriaModel = actionConf.criteria;
            propagateToAllDataModels(criteriaModel, {
                model: rootModel,
                groupByModel: getRootGroupByModel(actionInf.model)
            }, {
                propagationNameSpace,
                propagateToSource: false,
                sourceId: propagationSourceId,
                propagationSource: actionInf.model
            }, actionConf);
        }
    }
};

export const addToPropNamespace = (propagationNameSpace, config = {}, model) => {
    let sourceNamespace;
    const isMutableAction = config.isMutableAction;
    const criteria = config.criteria;
    const key = `${config.action}-${config.sourceId}`;

    if (isMutableAction) {
        sourceNamespace = propagationNameSpace.mutableActions;
    } else {
        sourceNamespace = propagationNameSpace.immutableActions;
    }

    if (criteria === null) {
        delete sourceNamespace[key];
    } else {
        sourceNamespace[key] = {
            model,
            config
        };
    }

    return this;
};


export const getNormalizedProFields = (projField, allFields, fieldConfig) => {
    const normalizedProjField = projField.reduce((acc, field) => {
        if (field.constructor.name === 'RegExp') {
            acc.push(...allFields.filter(fieldName => fieldName.search(field) !== -1));
        } else if (field in fieldConfig) {
            acc.push(field);
        }
        return acc;
    }, []);
    return Array.from(new Set(normalizedProjField)).map(field => field.trim());
};

/**
 * Get the numberFormatted value if numberFormat present,
 * else returns the supplied value.
 * @param {Object} field Field Instance
 * @param {Number|String} value
 * @return {Number|String}
 */
export const getNumberFormattedVal = (field, value) => {
    if (field.numberFormat) {
        return field.numberFormat()(value);
    }
    return value;
};
