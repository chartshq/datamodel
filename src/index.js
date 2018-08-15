import DataModel from './datamodel';
import * as Operators from './operator';
import * as Stats from './stats';
import pkg from '../package.json';
import { DataFormat, FilteringMode } from './constants';

DataModel.Operators = Operators;
DataModel.Stats = Stats;
DataModel.DataFormat = DataFormat;
DataModel.FilteringMode = FilteringMode;
DataModel.version = pkg.version;

export default DataModel;
