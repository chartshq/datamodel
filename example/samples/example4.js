/* eslint-disable */
d3.csv('./data/cars.csv', (data) => {
    const jsonData = data,
        schema = [{
            name: 'Name',
            type: 'dimension'
        }, {
            name: 'Miles_per_Gallon',
            type: 'measure',
            unit : 'cm',
            scale: '1000',
            numberformat: '12-3-3',
            as: "MilesPerGallon"
        }, {
            name: 'Cylinders',
            type: 'dimension'
        }, {
            name: 'Displacement',
            type: 'measure'
        }, {
            name: 'Horsepower',
            type: 'measure'
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

    const rootData = new window.DataModel(jsonData, schema);
    const groupedDm = rootData.groupBy(['Origin', 'Cylinders']);
    const binnedDm = groupedDm.bin('MilesPerGallon', { binsCount: 10});
  });

// load('../../js/cars.csv')
//     .then((res) => {
//         dm = new DataModel(res.split('\n').map(line => line.split(',')), {}, { name: "myDataModel", dataFormat: 'DSVArr' });
//     });
