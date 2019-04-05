import { FieldType, FilteringMode, DimensionSubtype, MeasureSubtype, DataFormat } from './enums';
import fieldStore from './field-store';
import Value from './value';
import {
    rowDiffsetIterator
} from './operator';
import { DM_DERIVATIVES, LOGICAL_OPERATORS } from './constants';
import { createFields, createUnitFieldFromPartial } from './field-creator';
import defaultConfig from './default-config';
import * as converter from './converter';
import { extend2, detectDataFormat } from './utils';

/**
 * Prepares the selection data.
 */
function prepareSelectionData (fields, i) {
    const resp = {};
    for (let field of fields) {
        resp[field.name()] = new Value(field.partialField.data[i], field);
    }
    return resp;
}

export function prepareJoinData (fields) {
    const resp = {};
    Object.keys(fields).forEach((key) => { resp[key] = new Value(fields[key], key); });
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

const generateRowDiffset = (rowDiffset, i, lastInsertedValue) => {
    if (lastInsertedValue !== -1 && i === (lastInsertedValue + 1)) {
        const li = rowDiffset.length - 1;
        rowDiffset[li] = `${rowDiffset[li].split('-')[0]}-${i}`;
    } else {
        rowDiffset.push(`${i}`);
    }
};

export const selectHelper = (rowDiffset, fields, selectFn, config, sourceDm) => {
    let newRowDiffSet = [];
    const rejRowDiffSet = [];
    let lastInsertedValue = -1;
    let lastInsertedValueRej = -1;
    let { mode } = config;
    let cachedStore = {};
    let cloneProvider = () => sourceDm.detachedRoot();
    const selectorHelperFn = index => selectFn(
        fields[index],
        index,
        cloneProvider,
        cachedStore
    );

    const checker = mode === FilteringMode.INVERSE ? index => !selectorHelperFn(index) :
        index => selectorHelperFn(index);

    const passFn = (i) => {
        if (checker(i)) {
            generateRowDiffset(newRowDiffSet, i, lastInsertedValue);
            lastInsertedValue = i;
            return true;
        }
        return false;
    };

    if (mode === FilteringMode.ALL) {
        rowDiffsetIterator(rowDiffset, (i) => {
            if (!passFn(i)) {
                generateRowDiffset(rejRowDiffSet, i, lastInsertedValueRej);
                lastInsertedValueRej = i;
            }
        });
        return [newRowDiffSet.join(','), rejRowDiffSet.join(',')];
    }

    rowDiffsetIterator(rowDiffset, passFn);
    return [newRowDiffSet.join(',')];
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

const getKey = (arr, data, fn) => {
    let key = fn(arr, data, 0);
    for (let i = 1, len = arr.length; i < len; i++) {
        key = `${key},${fn(arr, data, i)}`;
    }
    return key;
};

export const filterPropagationModel = (model, propModels, config = {}) => {
    let fns = [];
    const operation = config.operation || LOGICAL_OPERATORS.AND;
    const filterByMeasure = config.filterByMeasure || false;
    const modelFieldsConfig = model.getFieldsConfig();

    if (!propModels.length) {
        fns = [() => false];
    } else {
        fns = propModels.map(propModel => ((dataModel) => {
            let keyFn;
            const dataObj = dataModel.getData();
            const fieldsConfig = dataModel.getFieldsConfig();
            const dimensions = Object.keys(dataModel.getFieldspace().getDimension())
                .filter(d => d in modelFieldsConfig);
            const indices = dimensions.map(d =>
                fieldsConfig[d].index);
            const measures = Object.keys(dataModel.getFieldspace().getMeasure())
                .filter(d => d in modelFieldsConfig);
            const fieldsSpace = dataModel.getFieldspace().fieldsObj();
            const data = dataObj.data;
            const domain = measures.reduce((acc, v) => {
                acc[v] = fieldsSpace[v].domain();
                return acc;
            }, {});
            const valuesMap = {};

            keyFn = (arr, row, idx) => row[arr[idx]];
            data.forEach((row) => {
                const key = getKey(indices, row, keyFn);
                valuesMap[key] = 1;
            });
            keyFn = (arr, fields, idx) => fields[arr[idx]].value;
            return data.length ? (fields) => {
                const key = getKey(dimensions, fields, keyFn);
                if (filterByMeasure) {
                    return measures.every(field => fields[field].value >= domain[field][0] &&
                        fields[field].value <= domain[field][1]) && valuesMap[key];
                }
                return valuesMap[key];
            } : () => false;
        })(propModel));
    }

    let filteredModel;
    if (operation === LOGICAL_OPERATORS.AND) {
        filteredModel = cloneWithAllFields(model).select(fields => fns.every(fn => fn(fields)), {
            saveChild: false
        });
    } else {
        filteredModel = cloneWithAllFields(model).select(fields => fns.some(fn => fn(fields)), {
            saveChild: false
        });
    }

    return filteredModel;
};

export const cloneWithSelect = (sourceDm, selectFn, selectConfig, cloneConfig) => {
    const cloned = sourceDm.clone(cloneConfig.saveChild);
    const [rowDiffset, rejRowDiffSet] = selectHelper(
        cloned._rowDiffset,
        cloned.getPartialFieldspace()._cachedValueObjects,
        selectFn,
        selectConfig,
        sourceDm
    );
    cloned._rowDiffset = rowDiffset;
    cloned.__calculateFieldspace().calculateFieldsConfig();
    let oDm = cloned;
    if (selectConfig.mode === FilteringMode.ALL) {
        const rejCloned = sourceDm.clone(cloneConfig.saveChild);
        rejCloned._rowDiffset = rejRowDiffSet;
        rejCloned.__calculateFieldspace().calculateFieldsConfig();
        persistDerivations(
            sourceDm,
            rejCloned,
            DM_DERIVATIVES.SELECT,
             { config: selectConfig },
              selectFn
        );
        oDm = [cloned, rejCloned];
    }
    persistDerivations(
        sourceDm,
        cloned,
        DM_DERIVATIVES.SELECT,
         { config: selectConfig },
          selectFn
    );

    return oDm;
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
    const supportedMeasureSubTypes = [MeasureSubtype.CONTINUOUS];
    const supportedDimSubTypes = [
        DimensionSubtype.CATEGORICAL,
        DimensionSubtype.BINNED,
        DimensionSubtype.TEMPORAL,
        DimensionSubtype.GEO
    ];
    const { type, subtype, name } = unitSchema;

    switch (type) {
    case FieldType.DIMENSION:
        if (supportedDimSubTypes.indexOf(subtype) === -1) {
            throw new Error(`DataModel doesn't support dimension field subtype ${subtype} used for ${name} field`);
        }
        break;
    case FieldType.MEASURE:
        if (supportedMeasureSubTypes.indexOf(subtype) === -1) {
            throw new Error(`DataModel doesn't support measure field subtype ${subtype} used for ${name} field`);
        }
        break;
    default:
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
    const converterFn = converter[options.dataFormat];

    if (!(converterFn && typeof converterFn === 'function')) {
        throw new Error(`No converter function found for ${options.dataFormat} format`);
    }

    const [header, formattedData] = converterFn(data, options);
    resolveFieldName(schema, header);
    const fieldArr = createFields(formattedData, schema, header);

    // This will create a new fieldStore with the fields
    const nameSpace = fieldStore.createNamespace(fieldArr, options.name);
    relation._partialFieldspace = nameSpace;

    // If data is provided create the default colIdentifier and rowDiffset
    relation._rowDiffset = formattedData.length && formattedData[0].length ? `0-${formattedData[0].length - 1}` : '';

    // This stores the value objects which is passed to the filter method when selection operation is done.
    const valueObjects = [];
    rowDiffsetIterator(relation._rowDiffset, (i) => {
        valueObjects[i] = prepareSelectionData(nameSpace.fields, i);
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
                type: schema[i].subtype || schema[i].type,
                index: i
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
    const nonTraversingModel = propModelInf.nonTraversingModel;
    const excludeModels = propModelInf.excludeModels || [];

    if (dataModel === nonTraversingModel) {
        return;
    }

    const propagate = excludeModels.length ? excludeModels.indexOf(dataModel) === -1 : true;

    propagate && dataModel.handlePropagation(propModel, config);

    const children = dataModel._children;
    children.forEach((child) => {
        const selectionModel = applyExistingOperationOnModel(propModel, child);
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
    let propModel;
    const { propagationNameSpace, propagateToSource } = propagationInf;
    const propagationSourceId = propagationInf.sourceId;
    const propagateInterpolatedValues = config.propagateInterpolatedValues;
    const filterFn = (entry) => {
        const filter = config.filterFn || (() => true);
        return filter(entry, config);
    };

    let criterias = [];

    if (identifiers === null && config.persistent !== true) {
        criterias = [{
            criteria: []
        }];
    } else {
        let actionCriterias = Object.values(propagationNameSpace.mutableActions);
        if (propagateToSource !== false) {
            actionCriterias = actionCriterias.filter(d => d.config.sourceId !== propagationSourceId);
        }

        const filteredCriteria = actionCriterias.filter(filterFn).map(action => action.config.criteria);

        const excludeModels = [];

        if (propagateToSource !== false) {
            const sourceActionCriterias = Object.values(propagationNameSpace.mutableActions);

            sourceActionCriterias.forEach((actionInf) => {
                const actionConf = actionInf.config;
                if (actionConf.applyOnSource === false && actionConf.action === config.action &&
                        actionConf.sourceId !== propagationSourceId) {
                    excludeModels.push(actionInf.model);
                    criteria = sourceActionCriterias.filter(d => d !== actionInf).map(d => d.config.criteria);
                    criteria.length && criterias.push({
                        criteria,
                        models: actionInf.model,
                        path: getPathToRootModel(actionInf.model)
                    });
                }
            });
        }


        criteria = [].concat(...[...filteredCriteria, identifiers]).filter(d => d !== null);
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

    const rootGroupByModel = rootModels.groupByModel;
    if (propagateInterpolatedValues && rootGroupByModel) {
        propModel = filterPropagationModel(rootGroupByModel, criteria, {
            filterByMeasure: propagateInterpolatedValues
        });
        propagateIdentifiers(rootGroupByModel, propModel, propConfig);
    }

    criterias.forEach((inf) => {
        const propagationModel = filterPropagationModel(rootModel, inf.criteria);
        const path = inf.path;

        if (path) {
            const filteredModel = getFilteredModel(propagationModel, path.reverse());
            inf.models.handlePropagation(filteredModel, propConfig);
        } else {
            propagateIdentifiers(rootModel, propagationModel, propConfig, {
                excludeModels: inf.excludeModels,
                nonTraversingModel: propagateInterpolatedValues && rootGroupByModel
            });
        }
    });
};

export const propagateImmutableActions = (propagationNameSpace, rootModels, propagationInf) => {
    const immutableActions = propagationNameSpace.immutableActions;

    for (const action in immutableActions) {
        const actionInf = immutableActions[action];
        const actionConf = actionInf.config;
        const propagationSourceId = propagationInf.config.sourceId;
        const filterImmutableAction = propagationInf.propConfig.filterImmutableAction ?
            propagationInf.propConfig.filterImmutableAction(actionConf, propagationInf.config) : true;
        if (actionConf.sourceId !== propagationSourceId && filterImmutableAction) {
            const criteriaModel = actionConf.criteria;
            propagateToAllDataModels(criteriaModel, rootModels, {
                propagationNameSpace,
                propagateToSource: false,
                sourceId: propagationSourceId
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
