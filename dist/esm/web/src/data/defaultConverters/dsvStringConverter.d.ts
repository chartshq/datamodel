import { DataConverter, Schema, LoadDataOptions, Data } from '../../contracts/data';
export default class DSVStringConverter implements DataConverter {
    _type: string;
    get type(): string;
    convert(data: string, schema: Schema[], options: LoadDataOptions): Data;
}
