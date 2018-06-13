import { DataFormat, DimensionSubtype, FieldType, ProjectionMode, SelectionMode } from 'picasso-util';
import DataTable from './datatable';
import * as Operators from './operator';

DataTable.Operators = Operators;

export default DataTable;

export const TYPES = {
    DataFormat,
    DimensionSubtype,
    FieldType,
    SelectionMode,
    ProjectionMode
};
