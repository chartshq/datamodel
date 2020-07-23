import { Schema } from './data';
import Invalid from '../data/invalid/invalid';
export interface Field {
    name(): string;
    type(): string;
    subtype(): string | undefined;
    domain(): (string | number | null)[];
    schema(): Schema;
    displayName(): string;
    data(): (string | Invalid)[] | (number | Invalid)[];
    formattedData(format?: string | Function): (string | Invalid)[] | (number | Invalid)[];
}
