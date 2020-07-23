import { DataConverter, Schema, Data } from '../../contracts/data';
export default class JSONConverter implements DataConverter {
    _type: string;
    get type(): string;
    convert(data: {
        [type: string]: string | number;
    }[], schema: Schema[]): Data;
}
