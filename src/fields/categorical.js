import { DimensionSubtype } from 'picasso-util';
import Dimension from './dimension';

/**
 * Represents categorical field subtype.
 *
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
