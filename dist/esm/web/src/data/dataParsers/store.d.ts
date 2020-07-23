import { FieldContract } from '../fieldParsers';
declare class DataParserStore {
    store: Map<string, FieldContract>;
    constructor();
    private _getDefaultParsers;
    /**
     * Sets the given parsers in the store and returns the store
     * @param  {Array<FieldContract>} parsers : contains array of parsers instance
     * @return {Map<string, FieldContract>}
     */
    parsers(parsers: FieldContract[]): Map<string, FieldContract>;
    /**
     * Registers a parsers
     * @param {DataConverter} parser : parser Instance
     */
    register(parser: FieldContract): DataParserStore;
    /**
     * Removes a parser from store
     * @param {FieldContract} parser : parser Instance
     */
    unregister(parser: FieldContract): DataParserStore;
    get(name: string | undefined): FieldContract | null | undefined;
}
declare const dataParserStore: DataParserStore;
export default dataParserStore;
