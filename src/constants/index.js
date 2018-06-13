/**
 * The event name for data propagation.
 */
export const PROPAGATION = 'propagation';

/**
 * The name of the unique row id column in DataTable.
 */
export const ROW_ID = '__id__';

/**
 * The enums for operation names performed on DataTable.
 */
export const DT_DERIVATIVES = {
    SELECT: 'select',
    PROJECT: 'project',
    GROUPBY: 'group',
    COMPOSE: 'compose',
    CAL_MEASURE: 'calculatedMeasure',
    CAL_DIMENSION: 'generatedDimention',
    BIN: 'bin'
};

export const JOINS = {
    CROSS: 'cross',
    LEFTOUTER: 'leftOuter',
    RIGHTOUTER: 'rightOuter',
    NATURAL: 'natural',
    FULLOUTER: 'fullOuter'
};
