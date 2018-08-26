import DataModel from './datamodel';
import * as Operators from './operator';
import * as Stats from './stats';
import * as enums from './enums';
import { DateTimeFormatter } from './utils';
import pkg from '../package.json';

DataModel.Operators = Operators;
DataModel.Stats = Stats;
DataModel.version = pkg.version;
Object.assign(DataModel, enums);
DataModel.DateTimeFormatter = DateTimeFormatter;

export default DataModel;
