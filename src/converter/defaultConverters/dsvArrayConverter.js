import DataConverter from "../model/dataConverter";
import DSVArr from '../utils/dsv-arr';
import DataFormat from '../../enums/data-format'

export default class DSVArrayConverter extends DataConverter{
    constructor(){
        super(DataFormat.DSV_ARR);
    }

    convert(data , schema , options){
        return DSVArr(data,schema,options);
    }
} 