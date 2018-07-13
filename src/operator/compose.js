export function compose(...operations) {
    return function(dm) {
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

        currentDM.__addParent(dm, derivations);
        if (derivations.length > 1) {
            frstChild.dispose();
        }

        return currentDM;
    };
}


/**
 *
 * Operator Wrappers for :
 * select,project,bin,groupby
 */
export function bin(...args) {
    function action(dm) {
        return dm.createBin(...args);
    }
    return action;
}

export function rowFilter(...args) {
    function action(dm) {
        return dm.select(...args);
    }
    return action;
}

export function columnFilter(...args) {
    function action(dm) {
        return dm.project(...args);
    }
    return action;
}

export function groupby(...args) {
    function action(dm) {
        return dm.groupBy(...args);
    }
    return action;
}

