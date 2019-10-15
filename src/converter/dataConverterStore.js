import DataConverter from './model/dataConverter';
import { DSVStringConverter, DSVArrayConverter, JSONConverter, AutoDataConverter } from './defaultConverters';

class DataConverterStore {
    constructor() {
        this.store = new Map();
        this.converters(this._getDefaultConverters());
    }

    _getDefaultConverters() {
        return [
            new DSVStringConverter(),
            new DSVArrayConverter(),
            new JSONConverter(),
            new AutoDataConverter()
        ];
    }

    /**
     * Sets the given converters in the store and returns the store
     * @param  {Array<DataConverter>} converters : contains array of converter instance
     * @return { Map<String,DataConverter> }
     */
    converters(converters = []) {
        converters.forEach(converter => this.store.set(converter.type, converter));
        return this.store;
    }

    /**
     * Registers a Converter of type DataConverter
     * @param {DataConverter} converter : converter Instance
     * @returns self
     */
    register(converter) {
        if (converter instanceof DataConverter) {
            this.store.set(converter.type, converter);
            return this;
        }
        return null;
    }

    /**
     * Rempves a converter from store
     * @param {DataConverter} converter : converter Instance
     * @returns self
     */

    unregister(converter) {
        this.store.delete(converter.type);
        return this;
    }

    get(name) {
        if (this.store.has(name)) {
            return this.store.get(name);
        }
        return null;
    }

}

const converterStore = (function () {
    let store = null;

    function getStore () {
        store = new DataConverterStore();
        return store;
    }
    return store || getStore();
}());

export default converterStore;
