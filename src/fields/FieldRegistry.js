export { default as Field } from './field';
export { default as Categorical } from './categorical';
export { default as Temporal } from './temporal';
export { default as Binned } from './binned';
export { default as Continuous } from './continuous';

class FieldTypeRegistry{
    constructor(){
        this._measures = new Map();
        this._dimensions =  new Map();
    }

    registerMeasure(subtype,measure){
        this._measures.set(subtype,measure);
        return this;
    }

    registerDimension(subtype,dimension){
        this._dimensions.set(subtype,dimension);
        return this;
    }
}

export const fieldRegistry = (function () {
    let store = null;

    function getStore () {
        if (store === null) {
            store = new FieldTypeRegistry();
        }
        return store;
    }
    return getStore();
}());


