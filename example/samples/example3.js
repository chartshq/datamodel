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
        type: 'measure'
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
        roll: "abc"
    }
];

// const data = "name,birthday,roll\nRousan,1995-07-05,222\nSumant,1996-08-04,89\nAjay,1994-01-03,13";

const dm = new DataModel(data, schema);

const clonedDm = dm.clone();

const calDm = clonedDm.calculateVariable({name: "abc", type: "measure"}, [ idx => idx]);

// console.log(dm.groupBy(["name"]).serialize());
// console.log(dm.clone().groupBy(["name"]).serialize());
