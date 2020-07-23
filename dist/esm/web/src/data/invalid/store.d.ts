export default class InvalidStore {
    _defaultInvalids: Set<string>;
    constructor();
    setInvalids(invalidMap: string[]): void;
    getInvalids(): Set<string>;
    unsetInvalids(invalidMap: string[]): void;
    isInvalid(value: string): boolean;
}
