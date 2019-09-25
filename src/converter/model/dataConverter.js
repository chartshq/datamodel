/**
 * Interface for all data converters
 */
export default class DataConverter{
    constructor(type){
        this._type = type;
    }

    get type(){
        return this._type;
    }

    convert(data,schema,options){
        throw new Error("Convert method not implemented.")
    }

}