import { DataFormat, DimensionSubtype, FieldType, ProjectionMode, SelectionMode } from 'picasso-util';
import DataTable from './datatable';
import { bin,
     columnFilter,
     compose,
     fullOuterJoin,
     groupby,
     leftOuterJoin,
     naturalJoin,
     rightOuterJoin,
     rowFilter } from './operator';

DataTable.Operators = {
    leftOuterJoin,
    rightOuterJoin,
    fullOuterJoin,
    naturalJoin,
    compose,
    columnFilter,
    rowFilter,
    bin,
    groupby
};

export default DataTable;

export const TYPES = {
    DataFormat,
    DimensionSubtype,
    FieldType,
    SelectionMode,
    ProjectionMode
};
