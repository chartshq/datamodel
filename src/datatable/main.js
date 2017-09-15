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

    // ============================== Accessable functionality ======================= //
    /**
     * This Function will give the data after the operation in the format of
     * multidimensional array with first row as schema
     * @return {Array} multidimensional array of the data
     */
    getData() {
        return dataBuilder(this.columnNameSpace, this.rowDiffset, this.colIdentifier);
    }
    // ============================== Accessable functionality ends ======================= //
}

export { DataTable as default };
