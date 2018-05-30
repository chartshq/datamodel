
/* eslint-disable */

const DataTable = window.DataTable.default;
let dt;
d3.json('./data/cars.json', (data) => {
    const jsonData = data,
        schema = [{
            name: 'Name',
            type: 'dimension'
        }, {
            name: 'Miles_per_Gallon',
            type: 'measure'
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

    
    dt = new DataTable(jsonData, schema)
    dt1 = dt.groupBy([ 'Origin'], {
        Acceleration: null
    });
    console.log(dt.getData())
    console.log(dt1.getData())
    DataTable.Reducers.register('mySum',(num)=>{return num +2})
});