const DataModel = window.DataModel.default;

const data1 = [
    { performance: 'low', horsepower: 100, weight: 2 },
    { performance: 'high', horsepower: 400, weight: 1 },
    { performance: 'medium', horsepower: 20, weight: 1.5 },
    { performance: 'low', horsepower: 50, weight: 4 },
    { performance: 'medium', horsepower: 660, weight: 5 },
    { performance: 'decent', horsepower: 30, weight: 0.5 }
];
const schema1 = [
    { name: 'performance', type: 'dimension' },
    { name: 'horsepower', type: 'measure' },
    { name: 'weight', type: 'measure' }
];
const dm = new DataModel(data1, schema1, 'Yo');

function mean(...x) {
    const sum = x.reduce((a, n) => a + n, 0);
    return sum / x.length;
}

// const sortConfig = [
//     ['performance', ['horsepower', 'weight', (a, b) => {
//         const x = mean(...a.horsepower);
//         const y = mean(...b.horsepower);
//         return x - y;
//     }]],
//     ['horsepower', 'DESC']
// ];

const sortConfig = [
    ['performance', ['horsepower', 'weight', (a, b) => (mean(...a.horsepower) * mean(...a.weight)) - (mean(...b.horsepower) * mean(...b.weight))]],
    ['horsepowesr', 'DESC']
];

const sortedDm = dm.sort(sortConfig);

console.log(sortedDm.getData());

// horsepower
const dataSorted = [
    { performance: 'decent', horsepower: 30, weight: 0.5 },
    { performance: 'low', horsepower: 100, weight: 2 },,
    { performance: 'low', horsepower: 50, weight: 4 },
    { performance: 'medium', horsepower: 20, weight: 1.5 },
    { performance: 'medium', horsepower: 660, weight: 5 },
    { performance: 'high', horsepower: 400, weight: 1 },
];

const dataSorted2 = [
    { performance: 'decent', horsepower: 30, weight: 0.5 },
    { performance: 'low', horsepower: 100, weight: 2 },,
    { performance: 'low', horsepower: 50, weight: 4 },
    { performance: 'high', horsepower: 400, weight: 1 },
    { performance: 'medium', horsepower: 20, weight: 1.5 },
    { performance: 'medium', horsepower: 660, weight: 5 }
];
