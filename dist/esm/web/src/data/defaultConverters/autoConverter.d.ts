import { DataConverter, Schema, LoadDataOptions, RawData, Data } from '../../contracts/data';
export default class AutoDataConverter implements DataConverter {
    _type: string;
    get type(): string;
    convert(data: RawData, schema: Schema[], options: LoadDataOptions): Data;
}
