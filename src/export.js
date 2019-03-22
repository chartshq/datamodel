import DataModel from './datamodel';
import {
  compose,
  bin,
  select,
  project,
  groupby as groupBy,
  calculateVariable,
  sort,
  crossProduct,
  difference,
  naturalJoin,
  leftOuterJoin,
  rightOuterJoin,
  fullOuterJoin,
  union
} from './operator';
import * as Stats from './stats';
import * as enums from './enums';
import { DM_DERIVATIVES } from './constants';
import { DateTimeFormatter } from './utils';
import { DataFormat, FilteringMode } from './constants';
import InvalidAwareTypes from './invalid-aware-types';
import pkg from '../package.json';

DataModel.Operators = {
    compose,
    bin,
    select,
    project,
    groupBy,
    calculateVariable,
    sort,
    crossProduct,
    difference,
    naturalJoin,
    leftOuterJoin,
    rightOuterJoin,
    fullOuterJoin,
    union
};
DataModel.Stats = Stats;
Object.assign(DataModel, enums, { DM_DERIVATIVES });
DataModel.DateTimeFormatter = DateTimeFormatter;
DataModel.DataFormat = DataFormat;
DataModel.FilteringMode = FilteringMode;
DataModel.InvalidAwareTypes = InvalidAwareTypes;
DataModel.version = pkg.version;

export default DataModel;
