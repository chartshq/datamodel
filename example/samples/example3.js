/* eslint-disable */

const DataTable = window.DataTable.default;
let dt;
d3.json('./data/cars.json', (data) => {
    const jsonData = data,
        schema = [{
            name: 'Name',
            type: 'dimension',
            
        }, {
            name: 'Miles_per_Gallon',
            type: 'measure',
            unit:'hello',
            defAggFn:'avg'
        }, {
            name: 'Cylinders',
            type: 'dimension'
        }, {
            name: 'Displacement',
            type: 'measure'
        }, {
            name: 'Horsepower',
            type: 'measure',
            defAggFn:'avg'
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
    DataTable.Reducers.defaultReducer('min');
    dt1 = dt.groupBy([ 'Origin'], {
        Acceleration: null
    });
    console.log(dt.getData())
    console.log(dt1.getData())
    
    DataTable.Reducers.register('mySum', (arr) => {
        const isNestedArray = arr[0] instanceof Array;
        let sum = arr.reduce((carry, a) => {
            if (isNestedArray) {
                return carry.map((x, i) => x + a[i]);
            }
            return carry + a;
        }, isNestedArray ? Array(...Array(arr[0].length)).map(() => 0) : 0);
        return sum * 100;
    });
});