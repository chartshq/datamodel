import DataModel from './datamodel';
import {
   compose,
   bin,
   select,
   project,
   groupby,
   calculateVariable,
   sort,
   crossProduct,
   difference,
   naturalJoin,
   leftOuterJoin,
   rightOuterJoin,
   fullOuterJoin,
   union } from './operator';
import * as Stats from './stats';
import pkg from '../package.json';
import { DataFormat, FilteringMode } from './constants';

DataModel.Operators = { compose,
    bin,
    select,
    project,
    groupby,
    calculateVariable,
    sort,
    crossProduct,
    difference,
    naturalJoin,
    leftOuterJoin,
    rightOuterJoin,
    fullOuterJoin,
    union };
DataModel.Stats = Stats;
DataModel.DataFormat = DataFormat;
DataModel.FilteringMode = FilteringMode;
DataModel.version = pkg.version;

export default DataModel;
