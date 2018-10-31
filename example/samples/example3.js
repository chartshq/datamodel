// const DataModel = window.DataModel;

// const schema = [
//     {
//         name: 'name',
//         type: 'dimension'
//     },
//     {
//         name: 'birthday',
//         type: 'dimension',
//         subtype: 'temporal',
//         format: '%Y-%m-%d'
//     },
//     {
//         name: 'roll',
//         type: 'measure'
//     }
// ];

// const data = [
//     {
//         name: 'Rousan',
//         birthday: '1995-07-05',
//         roll: 12
//     },
//     {
//         name: 'Sumant',
//         birthday: '1996-08-04',
//         roll: 89
//     },
//     {
//         name: 'Ajay',
//         birthday: '1994-01-03',
//         roll: 33
//     },
//     {
//         name: 'Sushant',
//         birthday: '1994-01-03',
//         roll: 33
//     },
//     {
//         name: 'Samim',
//         birthday: '1994-01-03',
//         roll: 33
//     },
//     {
//         name: 'Akash',
//         birthday: '1994-01-03',
//         roll: 33
//     }
// ];
// debugger;
// const dm = new DataModel(data, schema);
// const dmData = dm.getData();
// console.log(dm);


// const data1 = [
//     { profit: 10, sales: 20, city: 'a' },
//     { profit: 15, sales: 25, city: 'b' },
// ];
// const schema1 = [
//     { name: 'profit', type: 'measure' },
//     { name: 'sales', type: 'measure' },
//     { name: 'city', type: 'dimension' },
// ];
// const data2 = [
//     { population: 200, city: 'a' },
//     { population: 250, city: 'b' },
// ];
// const schema2 = [
//     { name: 'population', type: 'measure' },
//     { name: 'city', type: 'dimension' },
// ];
// const dataModel1 = new DataModel(data1, schema1, { name: 'ModelA' });
// const dmData1 = dataModel1.getData();

// const dataModel2 = new DataModel(data2, schema2, { name: 'ModelB' });

// debugger;
// const joined = dataModel1.join(dataModel2);
// const dmData = joined.getData();

// const data1 = [
//     { profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
//     { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
//     { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
//     { profit: 15, sales: 25, first: 'Norwegian', second: 'Wood' },
//     { profit: 10, sales: 20, first: 'Here comes', second: 'the sun' },
//     { profit: 18, sales: 25, first: 'White', second: 'walls' },
//     { profit: 21, sales: 25, first: 'White', second: 'walls' },
//     { profit: 18, sales: 25, first: 'White', second: 'walls' },
//     { profit: 21, sales: 25, first: 'White', second: 'walls' }
// ];
// const schema1 = [
//     { name: 'profit', type: 'measure' },
//     { name: 'sales', type: 'measure' },
//     { name: 'first', type: 'dimension' },
//     { name: 'second', type: 'dimension' },
// ];
// const dataModel = new DataModel(data1, schema1, { name: 'Yo' });

// const buckets = {
//     start: 0,
//     stops: [5, 11, 16, 20, 30]
// };
// debugger;
// const bin = dataModel.bin('profit', { buckets, name: 'sumField' });
// let fieldData = bin.getFieldspace().fields.find(field => field.name === 'sumField').data;
// let expectedData = ['5-11', '11-16', '11-16', '11-16', '5-11', '16-20', '20-30', '16-20', '20-30'];



let expectedResult = {
    schema: [
        {
            name: 'ModelA.id',
            type: 'dimension'
        },
        {
            name: 'profit',
            type: 'measure',
            defAggFn: 'avg'
        },
        {
            name: 'sales',
            type: 'measure'
        },
        {
            name: 'first',
            type: 'dimension'
        },
        {
            name: 'second',
            type: 'dimension'
        },
        {
            name: 'ModelB.id',
            type: 'dimension'
        },
        {
            name: 'netprofit',
            type: 'measure',
            defAggFn: 'avg'
        },
        {
            name: 'netsales',
            type: 'measure'
        },
        {
            name: '_first',
            type: 'dimension'
        },
        {
            name: '_second',
            type: 'dimension'
        }
    ],
    data: [
        [
            '1',
            10,
            20,
            'Hey',
            'Jude',
            '1',
            10,
            200,
            'Hello',
            'Jude'
        ],
        [
            '2',
            20,
            25,
            'Hey',
            'Wood',
            '',
            null,
            null,
            '',
            ''
        ],
        [
            '3',
            10,
            20,
            'White',
            'the sun',
            '',
            null,
            null,
            '',
            ''
        ],
        [
            '4',
            15,
            25,
            'White',
            'walls',
            '4',
            200,
            250,
            'Bollo',
            'Wood'
        ]
    ],
    uids: [
        0,
        1,
        2,
        3
    ]
};
expect(leftOuterJoin(data23, data24,
    (dmFields1, dmFields2) => dmFields1.id.value === dmFields2.id.value).getData())
                .to.deep.equal(expectedResult);