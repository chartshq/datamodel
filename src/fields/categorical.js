import Dimension from './dimension';

import { getUniqueValues } from '../utils/domain-generator';

/**
 * The Field for categorical entries.
 * @extends Field
 */
class Categorical extends Dimension {
    getDomain() {
        return getUniqueValues(this.data);
    }
}

export { Categorical as default };
