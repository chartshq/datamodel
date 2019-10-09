import  Categorical  from './categorical';
import  Temporal  from './temporal';
import  Binned  from './binned';
import  Continuous  from './continuous';
import { DimensionSubtype ,MeasureSubtype} from '../enums'


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

const registerDefaultFields  = (store) => {
    store
    .registerDimension(DimensionSubtype.CATEGORICAL,Categorical)
    .registerDimension(DimensionSubtype.TEMPORAL,Temporal)
    .registerDimension(DimensionSubtype.BINNED,Binned)
    .registerMeasure(MeasureSubtype.CONTINUOUS,Continuous)
}

const fieldRegistry = (function () {
    let store = null;

    function getStore () {
        if (store === null) {
            store = new FieldTypeRegistry();
            registerDefaultFields(store);
        }
        return store;
    }
    return getStore();
}());

export default fieldRegistry;



