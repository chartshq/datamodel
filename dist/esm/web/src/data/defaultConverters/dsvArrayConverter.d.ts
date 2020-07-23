import { DataConverter, Schema, LoadDataOptions, Data } from '../../contracts/data';
export default class DSVArrayConverter implements DataConverter {
    _type: string;
    get type(): string;
    convert(data: (string[] | number[])[], schema: Schema[], options: LoadDataOptions): Data;
}
