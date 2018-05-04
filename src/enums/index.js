/**
 * Data Format defines the format of the source data. Based on the format of the data the adapter is loaded.
 */
export const DATA_FORMAT = {
    FLAT_JSON: 'flatJSON',
    CSV_STR: 'CSVStr',
    CSV_ARR: 'CSVArr'
};

/**
 * Field type defines the high level field based on which visuals are controled. Measure in a high level is numeric
 * field and Dimension in a high level are string fields.
 */
export const FIELD_TYPE = {
    MEASURE: 'measure',
    DIMENSION: 'dimension'
};

/**
 * Field subtype defines the sub type of the Dimensional Field.
 */
export const DIM_SUBTYPE = {
    CATEGORICAL: 'categorical',
    TEMPORAL: 'temporal',
    GEO: 'geo'
};

export const SELECTION_MODE = {
    SELECTION: 'selection',
    INVERSE: 'inverse',
    ALL: 'all'
};

export const PROJECTION_MODE = {
    INCLUDE: 'include',
    EXCLUDE: 'exclude',
};

export const PROPOGATION = 'propogation';

export const ROW_ID = '__id__';

export const EMPTYFN = () => {};
