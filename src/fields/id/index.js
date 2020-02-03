import { DimensionSubtype } from '../../enums';
import IdParser from '../parsers/id-parser';
import Categorical from '../categorical';

/**
 * Represents id field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */
export default class ID extends Categorical {
    /**
     * Returns the subtype of the field.
     *
     * @public
     * @override
     * @return {string} Returns the subtype of the field.
     */
    subtype () {
        return DimensionSubtype.ID;
    }

    static parser () {
        return new IdParser();
    }
}
