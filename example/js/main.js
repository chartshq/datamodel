/* eslint-disable */

const DataTable = datatable.default;
let dt;

d3.json('../../js/cars.json', (data) => {
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
    dt = new DataTable(jsonData, schema);
    dts = dt.select((data) => {
        return data.Acceleration.value >= 15;
    });
    console.log(dts.getData());
});

function load (url) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = function() {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('File didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function() {
            reject(Error('There was a network error.'));
        };
        request.send();
    });
  }


// load('../../js/cars.csv')
//     .then((res) => {
//         dt = new DataTable(res.split('\n').map(line => line.split(',')), {}, 'mytable', { dataformat: 'CSVArr' });
//     });
