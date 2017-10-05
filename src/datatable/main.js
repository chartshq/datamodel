import Relation from './relation';
import dataBuilder from './datatable-helper/data-builder';

/**
 * The main class
 * @extends Relation
 */
class DataTable extends Relation {
    /**
     * DataTable constructor
     * @param  {Array} args Arguments passed to create DataTable class
     */
    constructor(...args) {
        super(...args);
        // This will hold all the children DataTable
        this.child = [];
    }
    /**
     * This function will create a new DataTable with the required field to have
     * the clone of the DataTable.
     * @return {DataTable} The cloned DataTable.
     */
    clone() {
        const retDataTable = new DataTable();
        // Copy the required property
        retDataTable.colIdentifier = this.colIdentifier;
        retDataTable.rowDiffset = this.rowDiffset;

        return retDataTable;
    }

    /**
     * extends the clone functionality with the child parent relationship
     * @return {DataTable} The cloned DataTable
     */
    cloneAsChild() {
        const retDataTable = this.clone();
        this.child.push(retDataTable);
        retDataTable.parent = this;
        return retDataTable;
    }

    /**
     * If the DataTable is cloned one and don't have the columnNameSpace then look
     * to it's parent for the same
     * @return {Object} Field store
     */
    getNameSpace() {
        let child = this;
        if (this.columnNameSpace) { return this.columnNameSpace; }
        let nameSpace;
        while (child.parent) {
            if (child.parent.columnNameSpace) {
                nameSpace = child.parent.columnNameSpace;
                break;
            }
            child = child.parent;
        }
        return nameSpace;
    }

    // ============================== Accessable functionality ======================= //
    /**
     * This Function will give the data after the operation in the format of
     * multidimensional array with first row as schema
     * @return {Array} multidimensional array of the data
     */
    getData() {
        return dataBuilder.call(this, this.getNameSpace().fields, this.rowDiffset,
            this.colIdentifier);
    }

    /**
     * This helps to rename the column name of the DataTable this helps in joining two dataTable.
     * Also union and difference as these operations required to have same column name.
     * @param  {Object} schemaObj object having the name of the field to rename as key and the new
     * name as the value
     * @return {DataTable}           The cloned DataTable with the rename columns
     */
    rename(schemaObj) {
        const cloneDataTable = this.cloneAsChild();
        const schemaArr = cloneDataTable.colIdentifier.split(',');
        const fieldStore = this.getNameSpace().fields;
        Object.entries(schemaObj).forEach(([key, value]) => {
            if (schemaArr.indexOf(key) !== -1 && typeof value === 'string') {
                for (let i = 0; i <= fieldStore.length; i += 1) {
                    if (fieldStore[i].name === key) {
                        const renameField = fieldStore[i].clone(fieldStore[i].data);
                        renameField.name = value;
                        renameField.schema.name = value;
                        schemaArr[schemaArr.indexOf(key)] = value;
                        fieldStore.push(renameField);
                        break;
                    }
                }
            }
        });
        cloneDataTable.colIdentifier = schemaArr.join();
        return cloneDataTable;
    }

    /**
     * Set the projection of the DataTable. It actually create a clone DataTable
     * then it will apply the projection on the cloned DataTable.
     * @param {string} projString the string with column to be project seperated by comma.
     * @return {DataTable} newly created DataTable with the given projection.
     */
    project(projString) {
        const cloneDataTable = this.cloneAsChild();
        cloneDataTable.projectHelper(projString);
        return cloneDataTable;
    }

    /**
     * Set the selection of the cloned DataTable
     * @param  {functiona} selectFn The function which will be looped through all the data
     * if it return true the row will be there in the DataTable
     * @return {DataTable}          The cloned DataTable with the required selection;
     */
    select(selectFn) {
        const cloneDataTable = this.cloneAsChild();
        cloneDataTable.selectHelper(cloneDataTable.getNameSpace().fields, selectFn);
        return cloneDataTable;
    }
    // ============================== Accessable functionality ends ======================= //
}

export { DataTable as default };
