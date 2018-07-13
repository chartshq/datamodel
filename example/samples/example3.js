/* eslint-disable */

const DataModel = window.DataModel.default;
let dm;
d3.json('./data/cars.json', (data) => {

    
        const data1 = [
            { a: 10, aaa: 20, aaaa: 'd' },
            { a: 15, aaa: 25, aaaa: 'demo' },
        ];
        const schema = [
            { name: 'a', type: 'measure' },
            { name: 'aaa', type: 'measure' },
            { name: 'aaaa', type: 'dimension' },
        ];
        const dataModel = new DataModel(data1, schema);

        let cloneRelation

        dataModel.colIdentifier = '1-20';
        dataModel.rowDiffset = 'a, aaa, aaaa';
        cloneRelation = dataModel.clone();
});
