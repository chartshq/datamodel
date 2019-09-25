import DataConverter from "../model/dataConverter";
import DSVStr from "../utils/dsv-str";
import DataFormat from '../../enums/data-format'

export default class DSVStringConverter extends DataConverter{
    constructor(){
        super(DataFormat.DSV_STR)
    }

    convert(data , schema , options){
        return DSVStr(data,schema,options);
    }
} 