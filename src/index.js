import { DataFormat, DimensionSubtype, FieldType, ProjectionMode, SelectionMode } from 'picasso-util';
import DataModel from './datamodel';
import * as Operators from './operator';

DataModel.Operators = Operators;

export default DataModel;

export const TYPES = {
    DataFormat,
    DimensionSubtype,
    FieldType,
    SelectionMode,
    ProjectionMode
};
