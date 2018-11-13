const DataModel = window.DataModel;

const schema = [
    {
        name: 'name',
        type: 'dimension'
    },
    {
        name: 'birthday',
        type: 'dimension',
        subtype: 'temporal',
        format: '%Y-%m-%d'
    },
    {
        name: 'roll',
        type: 'measure',
        defAggFn: "avg"
    }
];

const data = [
    {
        name: 'Rousan',
        birthday: '1995-07-05',
        roll: 2
    },
    {
        name: 'Sumant',
        birthday: '1996-08-04',
        roll: 89
    },
    {
        name: 'Ajay',
        birthday: '1994-01-03',
        roll: 31
    },
    {
        name: 'Sushant',
        birthday: '1994-01-03',
        roll: 99
    },
    {
        name: 'Samim',
        birthday: '1994-01-03',
        roll: 12
    },
    {
        name: 'Akash',
        birthday: '1994-01-03',
        roll: 20
    }
];

const dm = new DataModel(data, schema);
const selecDm = dm.select((fields, i, cloneProvider, store) => {
    if (!store.clonedDM) {
        store.clonedDM = cloneProvider();
    }
    if (!store.avgRoll) {
        store.avgRoll = store.clonedDM.groupBy([""], {roll: "avg"}).getData().data[0][0];
    }

    console.log(store.avgRoll);

    return fields.roll.value > store.avgRoll;

}, { mode: DataModel.FilteringMode.NORMAL });
debugger;