/* eslint-disable */

const DataModel = window.DataModel.default;
let dm;
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

    
//     dm = new DataModel(jsonData, schema)
//     DataModel.Reducers.defaultReducer('min');
//     let dm = 
//     const grouped = dm.groupBy(['Year']);
//     grouped = dm.groupBy(['Year'],{
//     },true,grouped);
//     //dm2 = dm.select(fields => fields.Horsepower.value < 150)
//     //dm33 = dm.select(fields => fields.Horsepower.value < 75,{},true,dm2)

//    // dm2 = dm.project(['Name','Year','Origin','Cylinders']);


//     // dm3 = dm.project(['Displacement','Acceleration'])

//     // dm4 = dm.calculatedMeasure({
//     //     name: 'Efficiency'
//     // }, ['Displacement', 'Acceleration'], (Displacement, Acceleration) => Displacement / Acceleration);

//     // dm4 = dm.calculatedMeasure({
//     //     name: 'UNEfficiency'
//     // }, ['Acceleration', 'Displacement'], (Acceleration, Displacement) => Acceleration / Displacement,true,dm4);

//     // dm1.dispose()
//      dm2.dispose()
//     // dm3.dispose()
//     // dm4.dispose()

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
    { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
    { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
    { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
    { profit: 15, sales: 25, first: 'White', second: 'walls' },
];
const schema1 = [
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    { name: 'first', type: 'dimension' },
    { name: 'second', type: 'dimension' },
];
const data23 = new DataModel(data1, schema1,'ModelA');
const data24 = new DataModel(data2, schema2,'ModelB');
const data23c = new DataModel(data1, schema1,'ModelA');
let composedFn = DataModel.Operators.compose(
    DataModel.Operators.rowFilter(fields => fields.profit.value <= 15),
    DataModel.Operators.columnFilter(['profit', 'sales'])
);

let normalDm = data23.select(fields => fields.profit.value <= 15);
normalDm = normalDm.project(['profit', 'sales']);

let composedDm = composedFn(data23c);
composedDm
});
