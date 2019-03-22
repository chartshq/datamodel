/* eslint-disable */

d3.json('../data/cars.json', (data) => {
    let jsonData = data;
    const schema = [{
        name: 'Name',
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
        defAggFn: "avg",
        as: "roll2"
    }
];

const data = [
    {
        name: 'Rousan',
        birthday: '1995-07-05',
        roll: 2
    },
    {
        name: 'Miles_per_Gallon',
        type: 'measure'
    },

    {
        name: 'Displacement',
        type: 'measure'
    },
    {
        name: 'Horsepower',
        type: 'measure'
    },
    {
        name: 'Weight_in_lbs',
        type: 'measure'
    },
    {
        name: 'Acceleration',
        type: 'measure'
    },
    {
        name: 'Origin',
        type: 'dimension'
    },
    {
        name: 'Akash',
        birthday: '1994-01-03',
        roll: 120
    },
    {
        name: 'Rousan',
        birthday: '1995-07-06',
        roll: 93
    }
];


const dm = new DataModel(data, schema);
const dm2 = dm.project(["name", "roll"]);
// const schema = [
//     { name: 'Name', type: 'dimension' },
//     { name: 'HorsePower', type: 'measure' },
//     { name: 'Origin', type: 'dimension' }
// ];
// const data = [
//     { Name: 'chevrolet chevelle malibu', Horsepower: 130, Origin: 'USA' },
//     { Name: 'citroen ds-21 pallas', Horsepower: 115, Origin: 'Europe' },
//     { Name: 'datsun pl510', Horsepower: 88, Origin: 'Japan' },
//     { Name: 'amc rebel sst', Horsepower: 150, Origin: 'USA' },
// ];
// const dt = new DataModel(schema, data);

// const dt2 = dt.select(fields => fields.Origin.value === 'USA');

// const selectedDm = dm.select(fields => fields.roll.value > 10 || fields.roll.value < 0);



// debugger;

// const groupedDm = dm.groupBy(["name"], {
//     roll: (vals, cloneProvider, store) => {
//         if (!store.clonedDm) {
//             store.clonedDm = cloneProvider();
//         }
//         if (!store.avgRoll) {
//             store.avgRoll = store.clonedDm.groupBy([""], { roll: "avg" }).getData().data[0][0];
//         }

//         return DataModel.Stats.avg(vals) - store.avgRoll;
//     }
// });
// const calDm = dm.calculateVariable({
//     name: "abc",
//     type: "measure"
// }, ["roll", (roll, i, cloneProvider, store) => {
//     if (!store.clonedDm) {
//         store.clonedDm = cloneProvider();
//     }
//     if (!store.avgRoll) {
//         store.avgRoll = store.clonedDm.groupBy([""], {roll: "avg"}).getData().data[0][0];
//     }

//     return store.avgRoll - roll;
// }]);

// const DataModel = window.DataModel;

// const data1 = [
//     { profit: 10, sales: 20, city: 'a' },
//     { profit: 15, sales: 25, city: 'b' },
// ];
// const schema1 = [
//     { name: 'profit', type: 'measure' },
//     { name: 'sales', type: 'measure' },
//     { name: 'city', type: 'dimension' },
// ];
// const data2 = [
//     { population: 200, city: 'a' },
//     { population: 250, city: 'b' },
// ];
// const schema2 = [
//     { name: 'population', type: 'measure' },
//     { name: 'city', type: 'dimension' },
// ];
// const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
// const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

    let rootData = new DataModel(jsonData, schema);
    let dm = rootData.project(["Origin", "Acceleration"]);
    let dm5 = DataModel.Operators.compose(
        DataModel.Operators.groupBy(["Origin"]),
        DataModel.Operators.select(f => f.Acceleration.value > 1000)
    )(dm);
});

