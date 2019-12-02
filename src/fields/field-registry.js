import Categorical from './categorical';
import Temporal from './temporal';
import Binned from './binned';
import Continuous from './continuous';
import { DimensionSubtype, MeasureSubtype } from '../enums';


class FieldTypeRegistry {
    constructor() {
        this._fieldType = new Map();
    }

    registerFieldType(subtype, dimension) {
        this._fieldType.set(subtype, dimension);
        return this;
    }

    has(type) {
        return this._fieldType.has(type);
    }

    get(type) {
        return this._fieldType.get(type);
    }
}

const registerDefaultFields = (store) => {
    store
                    .registerFieldType(DimensionSubtype.CATEGORICAL, Categorical)
                    .registerFieldType(DimensionSubtype.TEMPORAL, Temporal)
                    .registerFieldType(DimensionSubtype.BINNED, Binned)
                    .registerFieldType(MeasureSubtype.CONTINUOUS, Continuous);
};

const fieldRegistry = (function () {
    let store = null;
    function getStore () {
        store = new FieldTypeRegistry();
        registerDefaultFields(store);
        return store;
    }
    return store || getStore();
}());

export default fieldRegistry;

