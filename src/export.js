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
import { DateTimeFormatter } from './utils';
import { DataFormat, FilteringMode, DM_DERIVATIVES } from './constants';
import InvalidAwareTypes from './invalid-aware-types';
import pkg from '../package.json';

const Operators = {
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

const version = pkg.version;
Object.assign(DataModel, {
    Operators,
    Stats,
    DM_DERIVATIVES,
    DateTimeFormatter,
    DataFormat,
    FilteringMode,
    InvalidAwareTypes,
    version
}, enums);

export default DataModel;
