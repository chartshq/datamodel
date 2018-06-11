/**
 * Contains constants values.
 *
 * @module constants
 */

export const PROPOGATION = 'propogation';
export const ROW_ID = '__id__';
export const DT_DERIVATIVES = {
    SELECT: 'select',
    PROJECT: 'project',
    GROUPBY: 'group',
    COMPOSE: 'compose',
    CAL_MEASURE: 'calculatedMeasure',
    CAL_DIMENSION: 'generatedDimention'
};

export const JOINS = {
    CROSS: 'cross',
    LEFTOUTER: 'leftOuter',
    RIGHTOUTER: 'rightOuter',
    NATURAL: 'natural',
    FULLOUTER: 'fullOuter'
};
