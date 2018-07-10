/* eslint-disable */

const DataModel = window.DataModel.default;
let dm;
d3.json('./data/cars.json', (data) => {

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
