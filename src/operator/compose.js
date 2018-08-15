
/**
 * @public
 *
 * Compose is a operator that enables you to run multiple operations on a DataModel all at once.
 * The resulting DataModel will be the result of all the operation provided. The operations provided
 * will be executed in a serial manner ie. result of one operation will be the input for the next
 * operations.
 *
 * Suported operations in compose are
 * - select
 * - project
 * - groupBy
 * - bin
 * - compose
 *
 * @example
 * const data = [
 *   { id: 1, netprofit: 100, netsales: 200, _first: 'Hello', _second: 'Jude' },
 *   { id: 4, netprofit: 200, netsales: 250, _first: 'Bollo', _second: 'Wood' },
 * ];
 * const schema = [
 *   { name: 'id', type: 'dimension' },
 *   { name: 'netprofit', type: 'measure',defAggFn: 'avg' },
 *   { name: 'netsales', type: 'measure' },
 *   { name: '_first', type: 'dimension' },
 *   { name: '_second', type: 'dimension'},
 *   ];
 *
 * let composedFn = compose(
 *    select(fields => fields.netprofit.value <= 15),
 *    project(['netprofit', 'netsales']));
 *
 * const dataModel = new DataModel(data1, schema1);
 *
 * let composedDm = composedFn(dataModel);
 *
 * The composed DataModel will contain the result which might me obtained if the two
 * operations were run seperately on datamodel.
 *
 * @param {Array.<Operations>} operations : An array of operation that will be applied on the
 * datatable.
 *
 * @returns {DataModel}
 */
export const compose = (...operations) =>
    (dm) => {
        let currentDM = dm;
        let frstChild;
        const derivations = [];
        operations.forEach((operation) => {
            currentDM = operation(currentDM);
            derivations.push(...currentDM._derivation);
            if (!frstChild) {
                frstChild = currentDM;
            }
        });

        currentDM.addParent(dm, derivations);
        if (derivations.length > 1) {
            frstChild.dispose();
        }

        return currentDM;
    };

/**
 *
 * @public
 *
 * This is compose bin operator.It performs the binning operation
 *
 * @param {args} : See {@link DataModel} and [DataModel's bin function ]{@link DataModel#bin}.
 *
 */
export const bin = (...args) => dm => dm.bin(...args);


/**
 *
 * @public
 *
 * This is compose select operator.It performs the select operation
 *
 * @param {args} : See {@link DataModel} and [DataModel's select function ]{@link DataModel#select}.
 *
 */
export const select = (...args) => dm => dm.select(...args);


/**
 *
 * @public
 *
 * This is compose project operator.It performs the project operations
 *
 * @param {args} : See {@link DataModel} and [DataModel's project function ]{@link DataModel#project}.
 *
 */
export const project = (...args) => dm => dm.project(...args);


/**
 *
 * @public
 *
 * This is compose groupBy operator.It performs the groupBy operations
 *
 * @param {args} : See {@link DataModel} and [DataModel's groupBy function ]{@link DataModel#groupBy}.
 *
 */
export const groupBy = (...args) => dm => dm.groupBy(...args);
