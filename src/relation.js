import { FilteringMode, getUniqueId } from 'muze-utils';
import { persistDerivation, updateFields, cloneWithSelect, cloneWithProject, updateData } from './helper';
import { crossProduct, difference, naturalJoinFilter, union } from './operator';
import { DM_DERIVATIVES } from './constants';

/**
 * Relation class exposes its purpose from its nomenclature. It provides the definitions of basic operators of 
 * relational algebra like selection, projection, union, difference etc.
 *
 * It is extended by {@link DataModel} to inherit the functionalities of relational algebra concept.
 *
 * @public
 */
class Relation {

    /**
     *
     * Creates a new Relation instance by providing underlying data and schema.
     *
     * @private
     * @param {Object | string | Relation} data - The input tabular data in dsv or json format or
     * an existing Relation instance object.
     * @param {Array} schema - An array of data schema.
     * @param {Object} [options] - The optional options.
     */
    constructor (...params) {
        let source;

        this._parent = null;
        this._derivation = [];
        this._children = [];

        if (params.length === 1 && ((source = params[0]) instanceof Relation)) {
            // parent datamodel was passed as part of source
            this._colIdentifier = source._colIdentifier;
            this._rowDiffset = source._rowDiffset;
            this._parent = source;
            this._partialFieldspace = this._parent._partialFieldspace;
            this._fieldStoreName = getUniqueId();
            this.__calculateFieldspace().calculateFieldsConfig();
        } else {
            updateData(this, ...params);
            this._fieldStoreName = this._partialFieldspace.name;
            this.__calculateFieldspace().calculateFieldsConfig();
        }
    }

    /**
     * Retrieves the {@link Schema | schema} details for every {@link Field | field} as an array.
     *
     * @public
     *
     * @return {Array.<Schema>} Array of fields schema.
     *      ```
     *      [
     *          { name: 'Name', type: 'dimension' },
     *          { name: 'Miles_per_Gallon', type: 'measure', numberFormat: (val) => `${val} miles / gallon` },
     *          { name: 'Cylinder', type: 'dimension' },
     *          { name: 'Displacement', type: 'measure', defAggFn: 'max' },
     *          { name: 'HorsePower', type: 'measure', defAggFn: 'max' },
     *          { name: 'Weight_in_lbs', type: 'measure', defAggFn: 'avg',  },
     *          { name: 'Acceleration', type: 'measure', defAggFn: 'avg' },
     *          { name: 'Year', type: 'dimension', subtype: 'datetime', format: '%Y' },
     *          { name: 'Origin' }
     *      ]
     *      ```
     */
    getSchema () {
        return this.getFieldspace().fields.map(d => d.schema);
    }

    /**
     * Returns the name of the {@link DataModel} instance. If no name was specified during {@link DataModel}
     * initialization, then it returns a auto-generated name.
     *
     * @public
     *
     * @return {string} Name of the DataModel instance.
     */
    getName() {
        return this._fieldStoreName;
    }

    getFieldspace () {
        return this._fieldspace;
    }

    __calculateFieldspace () {
        this._fieldspace = updateFields([this._rowDiffset, this._colIdentifier],
             this.getPartialFieldspace(), this._fieldStoreName);
        return this;
    }

    getPartialFieldspace () {
        return this._partialFieldspace;
    }

    /**
     * @public
     *
     * Performs the cross-product between two {@link DataModel} instances and returns a new {@link DataModel} instance
     * containing the results. This operation is also called theta join.
     *
     * Refer to the following link for more info about join operation:
     * <Here_put_a_good_resource_link_on_join>
     *
     * It takes an optional function which filters the generated result rows. The argument of this filter function
     * is an object containing the row data of the both datamodel instance in the current iteration state.
     *
     * @example
     * const data1 = [
     *   { profit: 10, sales: 20, city: 'a' },
     *   { profit: 15, sales: 25, city: 'b' },
     * ];
     * const schema1 = [
     *   { name: 'profit', type: 'measure' },
     *   { name: 'sales', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const data2 = [
     *   { population: 200, city: 'a' },
     *   { population: 250, city: 'b' },
     * ];
     * const schema2 = [
     *   { name: 'population', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
     * const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });
     *
     * // without filter function
     * console.log(dataModel1.join(dataModel2).getData());
     *
     * // with filter function
     * console.log(dataModel1.join(dataModel2, obj => obj.ModelA.city === obj.ModelB.city).getData());
     *
     * @param {DataModel} joinWith - The DataModel to be joined with the current instance DataModel.
     * @param {Function} filterFn - The predicate function that will filter the result of the crossProduct.
     *       
     * @return {DataModel} Returns the new DataModel created after joining.
     */
    join (joinWith, filterFn) {
        return crossProduct(this, joinWith, filterFn);
    }

    /**
     * @public
     *
     * Performs the natural join operations of the relational algebra between two {@link DataModel} instances and returns
     * a new {@link DataModel} containing the resultant data.
     *
     * Natural join is a special kind of cross-product join, where a filter function is performed for the common
     * columns between two {@link DataModel} on the resultant cross-product rows.
     * Refer to the following link for more info about naturalJoin:
     * <Here_put_a_good_resource_link_on_natural_join>
     *
     * @example
     * const data1 = [
     *   { profit: 10, sales: 20, city: 'a' },
     *   { profit: 15, sales: 25, city: 'b' },
     * ];
     * const schema1 = [
     *   { name: 'profit', type: 'measure' },
     *   { name: 'sales', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const data2 = [
     *   { population: 200, city: 'a' },
     *   { population: 250, city: 'b' },
     * ];
     * const schema2 = [
     *   { name: 'population', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
     * const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });
     *
     * console.log(dataModel1.naturalJoin(dataModel2).getData());
     *
     * @param {DataModel} joinWith - The DataModel with whom this DataModel will be joined.
     * @return {DataModel} Returns the new DataModel created after joining.
     */
    naturalJoin (joinWith) {
        return crossProduct(this, joinWith, naturalJoinFilter(this, joinWith), true);
    }

    /**
     * @public
     *
     * Performs the union operation of the relational algebra between two {@link DataModel} instances and returns
     * a new {@link DataModel} containing the resultant data.
     * This operation can be termed as vertical joining of all the unique tuples from both the DataModel instances.
     * The requirement is both the {@link DataModel} instances should have same column names and order.
     *
     * Refer to the following link for more info about union operator:
     * <Here_put_a_good_resource_link_on_union>
     *
     * @example
     * const data1 = [
     *   { profit: 10, sales: 20, city: 'a' },
     *   { profit: 15, sales: 25, city: 'b' },
     * ];
     * const schema1 = [
     *   { name: 'profit', type: 'measure' },
     *   { name: 'sales', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const data2 = [
     *   { population: 200, city: 'a' },
     *   { population: 250, city: 'b' },
     * ];
     * const schema2 = [
     *   { name: 'population', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
     * const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });
     *
     * console.log(dataModel1.union(dataModel2).getData());
     *
     * @param {DataModel} unionWith - Another DataModel instance to which union
     * operation is performed.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    union (unionWith) {
        return union(this, unionWith);
    }

    /**
     * @public
     *
     * Performs the difference operation of the relational algebra between two {@link DataModel} instances and returns
     * a new {@link DataModel} containing the resultant data.
     * This operation can be termed as vertical joining of all the tuples those are not in the second {@link DataModel} instance.
     * The requirement is both the {@link DataModel} instances should have same column names and order.
     *
     * Refer to the following link for more info about difference operator:
     * <Here_put_a_good_resource_link_on_difference>
     *
     * @example
     * const data1 = [
     *    { profit: 10, sales: 20, city: 'a' },
     *    { profit: 15, sales: 25, city: 'b' },
     *  ];
     * const schema1 = [
     *   { name: 'profit', type: 'measure' },
     *   { name: 'sales', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const data2 = [
     *   { population: 200, city: 'a' },
     *   { population: 250, city: 'b' },
     * ];
     * const schema2 = [
     *   { name: 'population', type: 'measure' },
     *   { name: 'city', type: 'dimension' },
     * ];
     * const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
     * const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });
     *
     * console.log(dataModel1.difference(dataModel2).getData());
     *
     * @param {DataModel} differenceWith - Another DataModel instance to which difference
     * operation is performed.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    difference (differenceWith) {
        return difference(this, differenceWith);
    }

    /**
     * @public
     *
     * Performs the selection operation of the relational algebra on the current {@link DataModel} instance according to
     * the specified selection function and returns a new {@link DataModel} instance containing the selected rows.
     *
     * The selection operation can be performed on three modes:
     *  * NORMAL: In this mode, only the selected rows will be returned.
     *  * INVERSE: In this mode, only the non-selected rows i.e. inverted rows will be returned.
     *  * ALL: In this mode, both the selected rows and the inverted rows will be returned.
     *
     * Refer to the following link for more info about select operator:
     * <Here_put_a_good_resource_link_on_select>
     *
     * The selection function is called for every rows with an object as argument containing each column data for the
     * current iteration row.
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(schema, data);
     *
     * // with selection mode NORMAL:
     * const normDt = dt.select(fields => fields.Origin.value === "USA")
     * console.log(normDt.getData());
     *
     * // with selection mode INVERSE:
     * const inverDt = dt.select(fields => fields.Origin.value === "USA", { mode: DataModel.FilteringMode.INVERSE })
     * console.log(inverDt.getData());
     *
     * // with selection mode ALL:
     * const dtArr = dt.select(fields => fields.Origin.value === "USA", { mode: DataModel.FilteringMode.ALL })
     * // print the selected parts
     * console.log(dtArr[0].getData());
     * // print the inverted parts
     * console.log(dtArr[1].getData());
     *
     * @param {Function} selectFn - The function which will be looped through all the data,
     * if it returns true, the row will be selected.
     * @param {Object} [config] - The configuration object.
     * @param {string} [config.mode=FilteringMode.NORMAL] - The mode of the selection.
     * @param {string} [saveChild=true] - It is used while cloning.
     * @return {DataModel} Returns the new DataModel instance(s) after operation.
     */
    select (selectFn, config) {
        const defConfig = {
            mode: FilteringMode.NORMAL,
            saveChild: true
        };
        config = Object.assign({}, defConfig, config);

        const cloneConfig = { saveChild: config.saveChild };
        let oDm;

        if (config.mode === FilteringMode.ALL) {
            const selectDm = cloneWithSelect(
                this,
                selectFn,
                { mode: FilteringMode.NORMAL },
                cloneConfig
            );
            const rejectDm = cloneWithSelect(
                this,
                selectFn,
                { mode: FilteringMode.INVERSE },
                cloneConfig
            );
            oDm = [selectDm, rejectDm];
        } else {
            oDm = cloneWithSelect(
                this,
                selectFn,
                config,
                cloneConfig
            );
        }

        return oDm;
    }

    /**
     * @public
     *
     * Returns whether the current {@link DataModel} instance has no data.
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     * const data = [];
     *
     * const dt = new DataModel(schema, data);
     * console.log(dt.isEmpty());
     *
     * @return {Boolean} Returns true if the datamodel has no data, otherwise returns false.
     */
    isEmpty () {
        return !this._rowDiffset.length || !this._colIdentifier.length;
    }

    /**
     *
     * Creates a clone from the current DataModel instance with child parent relationship.
     *
     * @private
     * @param {boolean} [saveChild=true] - Whether the cloned instance would be recorded
     * in the parent instance.
     * @return {DataModel} - Returns the newly cloned DataModel instance.
     */
    clone (saveChild = true) {
        const retDataModel = new this.constructor(this);
        if (saveChild) {
            this._children.push(retDataModel);
        }
        return retDataModel;
    }

    /**

     *
     * @public
     *
     * Performs the projection operation of the relational algebra on the current {@link DataModel} instance.
     * It extracts the data for the specified column names from current {@link DataModel} and returns a new
     * {@link DataModel} containing those filtered columns and corresponding data.
     *
     * The projection operation can be performed on three modes:
     *  * NORMAL: In this mode, it extracts the data for the input column names.
     *  * INVERSE: In this mode, it extracts the data for those column names which are not listed in the input array.
     *  * ALL: In this mode, it extracts data for the both groups of column names.
     *
     * Refer to the following link for more info about projection operation:
     * <Here_put_a_good_resource_link_on_projection>
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(schema, data);
     *
     * // with projection mode NORMAL:
     * const normDt = dt.project(["Name", "HorsePower"]);
     * console.log(normDt.getData());
     *
     * // with projection mode INVERSE:
     * const inverDt = dt.project(["Name", "HorsePower"], { mode: DataModel.FilteringMode.INVERSE })
     * console.log(inverDt.getData());
     *
     * // with selection mode ALL:
     * const dtArr = dt.project(["Name", "HorsePower"], { mode: DataModel.FilteringMode.ALL })
     * // print the normal parts
     * console.log(dtArr[0].getData());
     * // print the inverted parts
     * console.log(dtArr[1].getData());
     *
     * @param {Array.<string | Regexp>} projField - An array of column names in string or regular expression.
     * @param {Object} [config] - An optional config.
     * @param {string} [config.mode=FilteringMode.NORMAL] - The mode of the projection.
     * @param {string} [saveChild=true] - It is used while cloning.
     * @return {DataModel} Returns the new DataModel instance after operation.
     */
    project (projField, config) {
        const defConfig = {
            mode: FilteringMode.NORMAL,
            saveChild: true
        };
        config = Object.assign({}, defConfig, config);
        const fieldConfig = this.getFieldsConfig();
        const allFields = Object.keys(fieldConfig);
        const { mode } = config;

        let normalizedProjField = projField.reduce((acc, field) => {
            if (field.constructor.name === 'RegExp') {
                acc.push(...allFields.filter(fieldName => fieldName.search(field) !== -1));
            } else if (field in fieldConfig) {
                acc.push(field);
            }
            return acc;
        }, []);

        normalizedProjField = Array.from(new Set(normalizedProjField)).map(field => field.trim());
        let dataModel;

        if (mode === FilteringMode.ALL) {
            let projectionClone = cloneWithProject(this, normalizedProjField, {
                mode: FilteringMode.NORMAL,
                saveChild: config.saveChild
            }, allFields);
            let rejectionClone = cloneWithProject(this, normalizedProjField, {
                mode: FilteringMode.INVERSE,
                saveChild: config.saveChild
            }, allFields);
            dataModel = [projectionClone, rejectionClone];
        }
        else {
            let projectionClone = cloneWithProject(this, normalizedProjField, config, allFields);
            dataModel = projectionClone;
        }

        return dataModel;
    }

    /**
     * Returns index and field details in an object where key is the field name.
     *
     * @private
     * @return {Object} - Returns the field definitions.
     */
    getFieldsConfig () {
        return this._fieldConfig;
    }

    calculateFieldsConfig () {
        this._fieldConfig = this._fieldspace.fields.reduce((acc, fieldDef, i) => {
            acc[fieldDef.name] = {
                index: i,
                def: { name: fieldDef._ref.name, type: fieldDef._ref.fieldType, subtype: fieldDef._ref.subType() }
            };
            return acc;
        }, {});
        return this;
    }


    /**
     * @public
     *
     * Frees up the resources associated with the current {@link DataModel} instance and breaks the link between its
     * parent and itself.
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(schema, data);
     *
     * const dt2 = dt.select(fields => fields.Origin.value === "USA")
     * dt2.dispose();
     *
     */
    dispose () {
        this._parent.removeChild(this);
        this._parent = null;
    }

    /**
     * @public
     *
     * Removes the specified child {@link DataModel} from the child list of the current {@link DataModel} instance.
     *
     * @example
     * const schema = [
     *    { name: 'Name', type: 'dimension' },
     *    { name: 'HorsePower', type: 'measure' },
     *    { name: "Origin", type: 'dimension' }
     * ];
     *
     * const data = [
     *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
     *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
     *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
     *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
     * ]
     *
     * const dt = new DataModel(schema, data);
     *
     * const dt2 = dt.select(fields => fields.Origin.value === "USA")
     * dt.removeChild(dt2);
     *
     * @param {DataModel} child - Delegates the parent to remove this child.
     */
    removeChild (child) {
        let idx = this._children.findIndex(sibling => sibling === child);
        idx !== -1 ? this._children.splice(idx, 1) : true;
    }

    /**
     * Adds the specified {@link DataModel} as a parent for the current {@link DataModel} instance.
     *
     * The optional criteriaQueue is an array containing the history of transaction performed on parent {@link DataModel}
     * to get the current one.
     *
     * @param {DataModel} parent - The datamodel instance which will act as parent.
     * @param {Array} criteriaQueue - Queue contains in-between operation meta-data.
     */
    addParent (parent, criteriaQueue = []) {
        persistDerivation(this, DM_DERIVATIVES.COMPOSE, null, criteriaQueue);
        this._parent = parent;
        parent._children.push(this);
    }
}

export default Relation;
