export function compose(...operations) {
    return function(dt) {
        let currentDT = dt;
        let frstChild;
        const derivations = [];
        operations.forEach((operation) => {
            currentDT = operation(currentDT);
            derivations.push(...currentDT._derivation);
            if (!frstChild) {
                frstChild = currentDT;
            }
        });

        currentDT.__addParent(dt, derivations);
        if (derivations.length > 1) {
            frstChild.dispose();
        }

        return currentDT;
    };
}


/**
 *
 * Operator Wrappers for :
 * select,project,bin,groupby
 */
export function bin(...args) {
    function action(dt) {
        return dt.bin(...args);
    }
    return action;
}

export function rowFilter(...args) {
    function action(dt) {
        return dt.select(...args);
    }
    return action;
}

export function columnFilter(...args) {
    function action(dt) {
        return dt.project(...args);
    }
    return action;
}

export function groupby(...args) {
    function action(dt) {
        return dt.groupBy(...args);
    }
    return action;
}

