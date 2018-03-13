import normalize from './normalizer';
import createFields from './create-fields';
import fieldStore from './field-store';
import rowDiffsetIterator from './operator/row-diffset-iterator';
/**
 * Contains all the relational algebra part
 */
class Relation {
    /**
     * If passed any data this will create a field array and will create
     * a field store with these fields in global space which can be used
     * by other functions for calculations and other operations on data
     * @param  {string|json} data The tabuler data csv or json format
     * @param  {json} schema The details of the schema
     * @param  {string} name name of the DataTable if not provided will assign a random name
     */
    constructor(data, schema, name) {
        if (data) {
            // This will create a generealise data structure consumable from
            // different type of data (different type of json or CSV)
            const normalizeData = normalize(data, schema),
                // This will create array of fields possible from the data
                fieldArr = createFields(normalizeData, schema),
                // This will create a new fieldStore with the fields
                nameSpace = fieldStore.createNameSpace(fieldArr, name);
            this.columnNameSpace = nameSpace;
            this.fieldMap = schema.reduce((acc, fieldDef, i) => {
                acc[fieldDef.name] = {
                    index: i,
                    def: fieldDef
                };
                return acc;
            }, {});
            // If data is provided create the default colIdentifier and rowDiffset
            this.rowDiffset = `0-${normalizeData[0] ? (normalizeData[0].length - 1) : 0}`;
            this.colIdentifier = (schema.map(_ => _.name)).join();
        }
    }

    /**
     * Set the projection to the DataTable only the projection string
     * @param  {string} projString The projection to be applied
     * @return {instance}            Instance of the class (this).
     */
    projectHelper(projString) {
        /**
         * @todo need to have validation
         */
        this.colIdentifier = projString;
        return this;
    }

    /**
     * Set the selection to the DataTable
     * @param  {Array} fields   FieldStore fields array
     * @param  {Function} selectFn The filter function
     * @return {Instance}          Instance of the class (this)
     */
    selectHelper(fields, selectFn) {
        const newRowDiffSet = [];
        let lastInsertedValue = -1,
            // newRowDiffSet last index
            li;
        rowDiffsetIterator(this.rowDiffset, (i) => {
            if (selectFn(fields, i)) {
                // Check for if this value to be attached to the last diffset ie. 1-5 format
                if (lastInsertedValue !== -1 && i === (lastInsertedValue + 1)) {
                    li = newRowDiffSet.length - 1;
                    newRowDiffSet[li] = `${newRowDiffSet[li].split('-')[0]}-${i}`;
                } else {
                    newRowDiffSet.push(`${i}`);
                }
                lastInsertedValue = i;
            }
        });
        this.rowDiffset = newRowDiffSet.join(',');
        return this;
    }
}

export { Relation as default };
