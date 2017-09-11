import { normalize } from './normalize';
import { createFields } from './create-fields';
import { fieldStore } from './field-store';
/**
 * Contains all the relational algebra part
 */
class Relation {
    /**
     * If passed any data this will create a field array and will create
     * a field store with these fields in global space which can be used
     * by other functions for calculations and other operations on data
     * @param  {string|json} data The tabuler data csv or json format
     */
    constructor(data) {
        if (data) {
            // This will create a generealise data structure consumable from
            // different type of data (different type of json or CSV)
            const normalizeData = normalize(data);
            // This will create array of fields possible from the data
            const fieldArr = createFields(normalizeData);
            // This will create a new fieldStore with the fields
            const nameSpace = fieldStore.createNameSpace(fieldArr);
            this.derivatives = nameSpace;
        }
    }
}

export { Relation as default };
