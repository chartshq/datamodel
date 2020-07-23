export declare enum FieldType {
    MEASURE = "measure",
    DIMENSION = "dimension"
}
export declare enum FieldSubtype {
    CATEGORICAL = "categorical",
    TEMPORAL = "temporal",
    BINNED = "binned",
    CONTINUOUS = "continuous",
    ROWID = "__id"
}
export declare const ROW_ID = "__id__";
export declare const _fieldTypeResolver: (fieldType: FieldType) => number;
export declare const _fieldSubtypeResolver: (fieldSubType: FieldSubtype) => number;
export declare const _defaultSubtype: (fieldType: FieldType) => FieldSubtype;
