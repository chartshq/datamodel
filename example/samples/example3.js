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
    let k = dataModel1.join(dataModel2, (dmFields1, dmFields2) => dmFields1.city.value === dmFields2.city.value);
    k;

    // const data1 = [
    //     { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
    //     { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
    //     { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
    //     { profit: 15, sales: 25, first: 'White', second: 'walls' },
    // ];
    // const schema1 = [
    //     { name: 'profit', type: 'measure' },
    //     { name: 'sales', type: 'measure' },
    //     { name: 'first', type: 'dimension' },
    //     { name: 'second', type: 'dimension' },
    // ];


    // const dataModel = new DataModel(data1, schema1, { name: 'Yo' });
    // const grouped = dataModel.groupBy(['first']);
    // grouped;
});
