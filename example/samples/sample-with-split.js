/* eslint-disable */

const DataModel = window.DataModel;
let dm;

d3.json('./data/cars.json', (data) => {
    const jsonData = data,
        schema = [{
            name: 'Name',
            type: 'dimension'
        }, {
            name: 'Miles_per_Gallon',
            type: 'measure',
            unit : 'cm',
            scale: '1000',
            numberformat: '12-3-3'
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
    window.datamodel = new DataModel(jsonData, schema);

    window.dms = datamodel.splitByRow(['Origin', 'Cylinders']);
    console.log(window.dms)

    // const xDM = dm.select(window.dms[0].dataModel._derivation[0].criteria)
    // console.log(xDM.getData())
});
