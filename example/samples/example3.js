const DataModel = window.DataModel.default;
d3.json('./data/cars.json', (data) => {
    const data1 = [
        { profit: 10, sales: 20, city: 'a', type: 'aa' },
        { profit: 15, sales: 25, city: 'b', type: 'aa' },
        { profit: 15, sales: 25, city: 'c', type: 'aa' },
    ];
    const schema1 = [
        { name: 'profit', type: 'measure' },
        { name: 'sales', type: 'measure' },
        { name: 'city', type: 'dimension' },
        { name: 'type', type: 'dimension' },
    ];
    const data2 = [
        { population: 200, city: 'a', type: 'aa' },
        { population: 250, city: 'b', type: 'kk' },
        { population: 250, city: 'm', type: 'kk' },
    ];
    const schema2 = [
        { name: 'population', type: 'measure' },
        { name: 'city', type: 'dimension' },
        { name: 'type', type: 'dimension' },
    ];
    const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
    const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });


    const l = DataModel.Operators.leftOuterJoin(dataModel1, dataModel2, obj => obj.ModelA.city === obj.ModelB.city);
    const m = DataModel.Operators.rightOuterJoin(dataModel1, dataModel2, obj => obj.ModelA.city === obj.ModelB.city);
    const k = DataModel.Operators.fullOuterJoin(dataModel2, dataModel1, obj => obj.ModelA.city === obj.ModelB.city);
    l;
});

const data1 = [
    { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
    { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
    { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
    { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
    { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
    { profit: 18, sales: 25, first: 'White', second: 'walls' },
    { profit: 21, sales: 25, first: 'White', second: 'walls' },
    { profit: 18, sales: 25, first: 'White', second: 'walls' },
    { profit: 21, sales: 25, first: 'White', second: 'walls' },
    { profit: 21, sales: 25, first: 'White', second: 'walls' }
];
const schema1 = [
    { name: 'profit', type: 'measure' },
    { name: 'sales', type: 'measure' },
    { name: 'first', type: 'dimension' },
    { name: 'second', type: 'dimension' },
];
const dataModel = new DataModel(data1, schema1, 'Yo');
const buckets = {
    start: 0,
    end: [5, 11, 16, 20, 30]
};

const dm2 = dataModel.select(feild => feild.sales.value === 25);
const bin = dm2.bin('profit', { binSize: 3, name: 'sumField' }, x => x[0]);
let fieldData = bin.getFieldspace().fields.find(field => field.name === 'sumField').data;
let profitData = bin.getFieldspace().fields.find(field => field.name === 'profit').data;
