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
DataModel.version = pkg.version;

export default DataModel;
