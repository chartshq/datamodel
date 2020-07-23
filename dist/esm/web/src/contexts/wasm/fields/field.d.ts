import { Field } from '../../../contracts/field';
import { Schema } from '../../../contracts/data';
import { FieldType, FieldSubtype } from '../../../constants/fields';
import Invalid from '../../../data/invalid/invalid';
export declare abstract class AbstractWasmField implements Field {
    _schema: Schema;
    abstract _cachedDomain: string[] | number[];
    abstract _cachedData: (string | Invalid)[] | (number | Invalid)[];
    constructor(schema: Schema);
    name(): string;
    type(): FieldType;
    schema(): Schema;
    displayName(): string;
    subtype(): FieldSubtype;
    abstract domain(): (string | number)[];
    abstract data(): (string | Invalid)[] | (number | Invalid)[];
    abstract formattedData(format?: string | Function): (string | Invalid)[] | (number | Invalid)[];
    abstract getRowsCount(): number;
    abstract dispose(): void;
}
