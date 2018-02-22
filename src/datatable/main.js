import Relation from './relation';
import dataBuilder from './datatable-helper/data-builder';
import crossProduct from './datatable-helper/cross-product';
import naturalJoinFilter from './datatable-helper/natural-join-filter-function';
import union from './datatable-helper/union';
import difference from './datatable-helper/difference';
import { groupBy } from './datatable-helper/group-by';

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
        this.sortingDetails = {
            column: [],
            type: [],
        };
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
        let child = this,
            nameSpace;
        if (this.columnNameSpace) { return this.columnNameSpace; }
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
     * @param {boolean} rowWise this define how the data need to be returned row wise or column wise
     * @return {Array} multidimensional array of the data
     */
    getData(rowWise = false) {
        return dataBuilder.call(this, this.getNameSpace().fields, this.rowDiffset,
            this.colIdentifier, this.sortingDetails, { rowWise });
    }

    /**
     * This returns the data with the uids
     */
    getDataWithUids () {
        return dataBuilder.call(this, this.getNameSpace().fields, this.rowDiffset,
            this.colIdentifier, this.sortingDetails, {
                addUid: true
            });
    }
    /**
     * This helps to rename the column name of the DataTable this helps in joining two dataTable.
     * Also union and difference as these operations required to have same column name.
     * @param  {Object} schemaObj object having the name of the field to rename as key and the new
     * name as the value
     * @return {DataTable}           The cloned DataTable with the rename columns
     */
    rename(schemaObj) {
        const cloneDataTable = this.cloneAsChild(),
            schemaArr = cloneDataTable.colIdentifier.split(','),
            fieldStore = this.getNameSpace().fields;
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
     * this reflect the cross-product of the relational algebra or can be called as theta join.
     * It take another DataTable instance and create new DataTable with the cross-product data and
     * filter the data according to the filter function provided.
     * Say there are two dataTablw tableA with 4 column 5 rows and tableB with 3 column 6 row
     * so the new DataTable tableA X tableB will have 7(4 + 3) rows and 30(5 * 6) columns (if no
     * filter function is provided).
     *
     * @param  {DataTable} joinWith The DataTable to be joined with this DataTable
     * @param  {Function} filterFn Function that will filter the result of the crossProduct
     * DataTable
     * @return {DataTable}          the new DataTable created by joining
     */
    join(joinWith, filterFn) {
        return crossProduct(this, joinWith, filterFn);
    }

    /**
     * This can join two DataTable to form a new DataTable which meet the requirement of
     * natural join.
     * it's not possible to pass a filter function as the filter function is decided according to
     * the definition of natural join
     * @param  {DataTable} joinWith the DataTable with whome this DataTable will be joined
     * @return {DataTable}          The new joind DataTable
     */
    naturalJoin(joinWith) {
        return crossProduct(this, joinWith, naturalJoinFilter(this, joinWith), true);
    }

    /**
     * This function handles the union operation of the relational algebra.
     * It can be termed as vertical joining of all the unique tuples from both the dataTable.
     * The requirement is both the DataTable should have same column name and order
     * @param  {DataTable} unionWith The DataTable with which this table will be united
     * @return {DataTable}           The new DataTable with the vertical joining
     */
    union(unionWith) {
        return union(this, unionWith);
    }

    /**
     * This function handles the difference operation of the relational algebra.
     * It can be termed as vertical joining of all the tuples those are not in the second DataTable.
     * The requirement is both the DataTable should have same column name and order
     * @param  {DataTable} differenceWith The DataTable with which this table will be united
     * @return {DataTable}           The new DataTable with the vertical joining
     */
    difference(differenceWith) {
        return difference(this, differenceWith);
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

    /**
     * This function will perform group-by on the data table according to the fields
     * and reducers provided.
     *
     * fields can be skipped in that case all field will be taken into consideration.
     * reducres single function defination can be given or object for each field, If nothing
     * is provided sum will be the default reducer.
     * @param  {Array} fieldsArr array containing the name of the columns
     * @param  {Object|Function|string} reducers  reducer function
     * @return {DataTable}           new DataTable with the required operations
     */
    groupBy(fieldsArr, reducers) {
        return groupBy(this, fieldsArr, reducers);
    }

    /**
     * Returns index and field details in an object where key is the field name.
     * @return {Object} field definitions
     */
    getFieldMap () {
        return this.fieldMap;
    }

    /**
     * It helps to define the sorting order of the returned data.
     * This is similar to the orderBy functionality of the database
     * you have to pass the array of array [['columnName', 'sortType(asc|desc)']] and the
     * function getData will give the data accordingly
     *
     * Please note no new DataTable will be created from this call, as this function overwrite the
     * previous sorting config
     * @param  {Array} sortList The array of all the column that need to be sorted
     * @return {DataTable}            it's own instance
     */
    sort(sortList) {
        sortList.forEach((row) => {
            const currRow = row;
            currRow[1] = row[1] === 'desc' ? 'desc' : 'asc';
        });
        this.sortingDetails = sortList;
        return this;
    }
    // ============================== Accessable functionality ends ======================= //
}

export { DataTable as default };
