import Dimension from './dimension';
import { DimensionSubtype } from '../enums';

/**
 * The Field for categorical entries.
 * @extends Dimension
 */
class Categorical extends Dimension {
    constructor(name, data, schema) {
        super(name, data, schema);
        this.subtype = DimensionSubtype.CATEGORICAL;
    }
/**
 * @returns {String} SubType of field
 */
    subType() {
        return this.subtype;
    }
}

export default Categorical;
