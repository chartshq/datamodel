import Dimension from './dimension';
import { DIM_SUBTYPE } from '../enums/index';

/**
 * The Field for categorical entries.
 * @extends Field
 */
class Categorical extends Dimension {
    constructor(name, data, schema) {
        super(name, data, schema);
        this.subtype = DIM_SUBTYPE.CATEGORICAL;
    }
/**
 * @returns {String} SubType of field
 */
    subType() {
        return this.subtype;
    }
}

export { Categorical as default };
