/**
 * The event name for data propagation.
 */
export const PROPAGATION = 'propagation';

/**
 * The name of the unique row id column in DataModel.
 */
export const ROW_ID = '__id__';

/**
 * The enums for operation names performed on DataModel.
 */
export const DM_DERIVATIVES = {
    SELECT: 'select',
    PROJECT: 'project',
    GROUPBY: 'group',
    COMPOSE: 'compose',
    CAL_MEASURE: 'calculatedMeasure',
    CAL_DIMENSION: 'generatedDimension',
    BIN: 'bin'
};

export const JOINS = {
    CROSS: 'cross',
    LEFTOUTER: 'leftOuter',
    RIGHTOUTER: 'rightOuter',
    NATURAL: 'natural',
    FULLOUTER: 'fullOuter'
};
