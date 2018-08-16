import { defReducer, fnList } from '../operator';

/**
 *
 *
 * A page level source which stores, registers, unregisters reducers for all the datamodel instances. There is only one
 * reducer store available in a page. All the datamodel instances receive same instance of reducer store.
 *
 * @public
 */
class ReducerStore {
    constructor () {
        this.store = new Map();
        this.store.set('defReducer', defReducer);

        Object.entries(fnList).forEach((key) => {
            this.store.set(key[0], key[1]);
        });
    }

    /**
     * Changes the `defaultReducer` globally. For all the fields which does not have `defAggFn` mentioned in schema, the
     * value of `defaultReducer` is used for aggregation.
     *
     * @public
     *
     * @param {string} [reducer='sum'] name of the default reducer. It picks up the definition from store by doing name
     *      lookup. If no name is found then it takes `sum` as the default reducer.
     *
     * @return {ReducerStore} instance of the singleton store in page.
     */
    defaultReducer (...params) {
        if (params.length) {
            let reducer = params[0];
            if (typeof reducer === 'function') {
                this.store.set('defReducer', reducer);
            } else if (typeof reducer === 'string') {
                if (Object.keys(fnList).indexOf(reducer) !== -1) {
                    this.store.set('defReducer', fnList[reducer]);
                }
            }
            return this;
        }

        return this.store.get('defReducer');
    }

    /**
     *
     * Registers a {@link reducer}. A {@link reducer} has to be registered before it is used.
     *
     * @example
     *  // find the mean squared value of a given set
     *  const reducerStore = DataModel.Reducers();
     *
     *  reducers.register('meanSquared', (arr) => {
     *      const squaredVal = arr.map(item => item * item);
     *      let sum = 0;
     *      for (let i = 0, l = squaredVal.length; i < l; i++) {
     *          sum += squaredVal[i++];
     *      }
     *
     *      return sum;
     *  })
     *
     *  // datamodel (dm) is already prepared with cars.json
     *  const dm1 = dm.groupBy(['origin'], {
     *      accleration: 'meanSquared'
     *  });
     *
     * @public
     *
     * @param {string} name formal name for a reducer. If the given name already exists in store it is overridden by new
     *      definition.
     * @param {Function} reducer definition of {@link reducer} function.
     *
     * @return {Function} function for unregistering the reducer.
     */
    register (name, reducer) {
        if (typeof name === 'string' && typeof reducer === 'function') {
            this.store.set(name, reducer);
        }

        return () => { this.__unregister(name); };
    }

    __unregister (name) {
        if (this.store.has(name)) {
            this.store.delete(name);
        }
    }

    resolve (name) {
        if (name instanceof Function) {
            return name;
        }
        return this.store.get(name);
    }
}

const reducerStore = (function () {
    let store = null;

    function getStore () {
        if (store === null) {
            store = new ReducerStore();
        }
        return store;
    }
    return getStore();
}());

export default reducerStore;
