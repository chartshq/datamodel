import { defReducer, fnList } from '../operator/group-by-function';

class ReducerStore {
    constructor() {
        this.store = new Map();
        this.store.set('defReducer', defReducer);

        Object.entries(fnList).forEach((key) => {
            this.store.set(key[0], key[1]);
        });
    }

    set defaultReducer(reducer) {
        if (typeof reducer === 'function') {
            this.store.set('defReducer', reducer);
        } else if (typeof reducer === 'string') {
            if (Object.keys(fnList).indexOf(reducer) !== -1) {
                this.store.set('defReducer', fnList[reducer]);
            }
        }
    }

    get defaultReducer() {
        return this.store.get('defReducer');
    }

    register(name, reducer) {
        if (typeof name === 'string' && typeof reducer === 'function') {
            this.store.set(name, reducer);
        }
    }

    unregister(name) {
        if (this.store.has(name)) {
            this.store.delete(name);
        }
    }
    _resolve(name) {
        return this.store.get(name);
    }
}

const REDUCER = (function() {
    let store = null;

    function getStore() {
        if (store === null) {
            store = new ReducerStore();
        }
        return store;
    }
    return getStore();
}());

export default REDUCER;
