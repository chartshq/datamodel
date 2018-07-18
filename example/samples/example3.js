/* eslint-disable */

const DataModel = window.DataModel.default;
let dm;
d3.json('./data/cars.json', (data) => {

    
    const data1 = [
        { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
        { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
        { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
        { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
        { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
        { profit: 18, sales: 25, first: 'White', second: 'walls' },
        { profit: 21, sales: 25, first: 'White', second: 'walls' },
        { profit: 18, sales: 25, first: 'White', second: 'walls' },
        { profit: 21, sales: 25, first: 'White', second: 'walls' }
    ];
    const schema1 = [
        { name: 'profit', type: 'measure' },
        { name: 'sales', type: 'measure' },
        { name: 'first', type: 'dimension' },
        { name: 'second', type: 'dimension' },
    ];
    const dataModel = new DataModel(data1, schema1, 'Yo');
    const buckets =  {
        start : 0,
        end : [5,11,16,20,30]
    }
    const bin = dataModel.bin('profit',{buckets })
    bin;
});
