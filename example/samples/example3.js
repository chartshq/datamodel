/* eslint-disable */

const DataModel = window.DataModel.default;
let dm;
d3.json('./data/cars.json', (data) => {
    const data1 = [
        { profit: 10, sales: 20, city: 'a',type:"aa" },
        { profit: 15, sales: 25, city: 'b',type:"aa" },
        { profit: 15, sales: 25, city: 'c',type:"aa" },
    ];
    const schema1 = [
        { name: 'profit', type: 'measure' },
        { name: 'sales', type: 'measure' },
        { name: 'city', type: 'dimension' },
        { name: 'type', type: 'dimension' },
    ];
    const data2 = [
        { population: 200, city: 'a',type:"aa" },
        { population: 250, city: 'b',type:"kk" },
    ];
    const schema2 = [
        { name: 'population', type: 'measure' },
        { name: 'city', type: 'dimension' },
        { name: 'type', type: 'dimension' },
    ];
    const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
    const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

    const k = dataModel1.naturalJoin(dataModel2)
    k;
});
