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
    const dataModel = new DataModel(data1, schema1, 'Yo');
    const newDm = dataModel.calculateVariable({
        name: 'Song',
        type: 'dimension'
    }, ['first', 'second', (first, second) =>
        `${first} ${second}`
    ]);
});
