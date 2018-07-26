const DataModel = window.DataModel.default;
d3.json('./data/cars.json', (data) => {
    const data1 = [
        { profit: 10, sales: 20, city: 'a' },
        { profit: 15, sales: 25, city: 'b' },
    ];
    const schema1 = [
        { name: 'profit', type: 'measure' },
        { name: 'sales', type: 'measure' },
        { name: 'city', type: 'dimension' },
    ];
    const data2 = [
        { population: 200, city: 'a' },
        { population: 250, city: 'b' },
    ];
    const schema2 = [
        { name: 'population', type: 'measure' },
        { name: 'city', type: 'dimension' },
    ];
    const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
    const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

    const c = dataModel1.join(dataModel2);
    c;
});
