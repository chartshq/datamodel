import { DataConverter } from '../../contracts/data';
declare class DataConverterStore {
    store: Map<string, DataConverter>;
    constructor();
    private _getDefaultConverters;
    /**
     * Sets the given converters in the store and returns the store
     * @param  {Array<DataConverter>} converters : contains array of converter instance
     * @return { Map<String,DataConverter> }
     */
    converters(converters: DataConverter[]): Map<string, DataConverter>;
    /**
     * Registers a Converter of type DataConverter
     * @param {DataConverter} converter : converter Instance
     * @returns self
     */
    register(converter: DataConverter): this | null;
    /**
     * Removes a converter from store
     * @param {DataConverter} converter : converter Instance
     * @returns self
     */
    unregister(converter: DataConverter): this;
    get(name: string | undefined): DataConverter | null | undefined;
}
declare const converterStore: DataConverterStore;
export default converterStore;
