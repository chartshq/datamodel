/* eslint-disable */

const DataTable = window.DataTable.default;
let dt;
d3.json('./data/cars.json', (data) => {
    const jsonData = data,
        schema = [{
            name: 'Name',
            type: 'dimension',
            
        }, {
            name: 'Miles_per_Gallon',
            type: 'measure',
            unit:'hello',
            defAggFn:'avg'
        }, {
            name: 'Cylinders',
            type: 'dimension'
        }, {
            name: 'Displacement',
            type: 'measure'
        }, {
            name: 'Horsepower',
            type: 'measure',
            defAggFn:'avg'
        }, {
            name: 'Weight_in_lbs',
            type: 'measure',
        }, {
            name: 'Acceleration',
            type: 'measure'
        }, {
            name: 'Year',
            type: 'dimension',
        }, {
            name: 'Origin',
            type: 'dimension'
        }];

    
//     dt = new DataTable(jsonData, schema)
//     DataTable.Reducers.defaultReducer('min');
//     let dt = 
//     const grouped = dt.groupBy(['Year']);
//     grouped = dt.groupBy(['Year'],{
//     },true,grouped);
//     //dt2 = dt.select(fields => fields.Horsepower.value < 150)
//     //dt33 = dt.select(fields => fields.Horsepower.value < 75,{},true,dt2)

//    // dt2 = dt.project(['Name','Year','Origin','Cylinders']);


//     // dt3 = dt.project(['Displacement','Acceleration'])

//     // dt4 = dt.calculatedMeasure({
//     //     name: 'Efficiency'
//     // }, ['Displacement', 'Acceleration'], (Displacement, Acceleration) => Displacement / Acceleration);

//     // dt4 = dt.calculatedMeasure({
//     //     name: 'UNEfficiency'
//     // }, ['Acceleration', 'Displacement'], (Acceleration, Displacement) => Acceleration / Displacement,true,dt4);

//     // dt1.dispose()
//      dt2.dispose()
//     // dt3.dispose()
//     // dt4.dispose()

// const data1 = [
//     { id: 1, profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
//     { id: 2, profit: 20, sales: 25, first: 'Hey', second: 'Wood' },
//     { id: 3, profit: 10, sales: 20, first: 'White', second: 'the sun' },
//     { id: 4, profit: 15, sales: 25, first: 'White', second: 'walls' },
// ];
// const data2 = [
//     { id: 1, netprofit: 10, netsales: 200, _first: 'Hello', _second: 'Jude' },
//     { id: 4, netprofit: 200, netsales: 250, _first: 'Bollo', _second: 'Wood' },

// ];

// const schema1 = [
//     {
//         name: 'id',
//         type: 'dimension'
//     },
//     {
//         name: 'profit',
//         type: 'measure',
//         defAggFn: 'avg'
//     },
//     {
//         name: 'sales',
//         type: 'measure'
//     },
//     {
//         name: 'first',
//         type: 'dimension'
//     },
//     {
//         name: 'second',
//         type: 'dimension'
//     },
// ];
// const schema2 = [
//     {
//         name: 'id',
//         type: 'dimension'
//     },
//     {
//         name: 'netprofit',
//         type: 'measure',
//         defAggFn: 'avg'
//     },
//     {
//         name: 'netsales',
//         type: 'measure'
//     },
//     {
//         name: '_first',
//         type: 'dimension'
//     },
//     {
//         name: '_second',
//         type: 'dimension'
//     },
// ];
// const data23 = new DataTable(data1, schema1,'TableA');

// const child = data23.createMeasure({
//     name: 'Efficiency'
// }, ['profit', 'sales'], (profit, sales) => profit / sales);
// child.getData()

const data1 = [
    { a: 10, aaa: 20, aaaa: 'd' },
    { a: 15, aaa: 25, aaaa: 'demo' },
    { a: 9, aaa: 35, aaaa: 'demo' },
    { a: 7, aaa: 15, aaaa: 'demo' },
    { a: 35, aaa: 5, aaaa: 'demo' },
    { a: 10, aaa: 10, aaaa: 'demoo' },
];
const schema2 = [
    { name: 'a', type: 'measure' },
    { name: 'aaa', type: 'measure' },
    { name: 'aaaa', type: 'dimension' },
];

const dataTable = new DataTable(data1, schema2);
const renameDataTable = dataTable.rename({ aaa: 'aaaRename' });
const expData = {
    schema: [
        { name: 'a', type: 'measure' },
        { name: 'aaaRename', type: 'measure' },
        { name: 'aaaa', type: 'dimension' },
    ],
    data: [
        [10, 20, 'd'],
        [15, 25, 'demo'],
        [9, 35, 'demo'],
        [7, 15, 'demo'],
        [35, 5, 'demo'],
        [10, 10, 'demoo'],
    ],
    uids: [0, 1, 2, 3, 4, 5]
};
});

