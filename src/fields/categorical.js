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
     /**
     * @return {string} Name of the field
     */
    fieldName() {
        return super.fieldName();
    }

     /**
     * @return {string} Type of the field
     */
    type() {
        return super.type();
    }

    /**
     * @return {description} Name of the field
     */
    description() {
        return super.description();
    }
}

export { Categorical as default };
