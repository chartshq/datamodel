import { DataFormat, DimensionSubtype, FieldType, SelectionMode, ProjectionMode } from 'picasso-util';
import { leftOuterJoin, rightOuterJoin, fullOuterJoin } from './operator/outer-join';
import { naturalJoin } from './operator/natural-join';
import { compose, columnFilter, rowFilter, bin, groupby } from './operator/compose';
import DataTable from './datatable';

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
