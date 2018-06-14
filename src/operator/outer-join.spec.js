/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { fullOuterJoin, leftOuterJoin, rightOuterJoin } from './outer-join';
import DataTable from '../datatable'
;

describe('Testing various Outer Join', () => {
    const data1 = [
        { id: 1, profit: 10, sales: 20, first: 'Hey', second: 'Jude' },
        { id: 2, profit: 20, sales: 25, first: 'Hey', second: 'Wood' },
        { id: 3, profit: 10, sales: 20, first: 'White', second: 'the sun' },
        { id: 4, profit: 15, sales: 25, first: 'White', second: 'walls' },
    ];
    const data2 = [
        { id: 1, netprofit: 10, netsales: 200, _first: 'Hello', _second: 'Jude' },
        { id: 4, netprofit: 200, netsales: 250, _first: 'Bollo', _second: 'Wood' },

    ];

    const schema1 = [
        {
            name: 'id',
            type: 'dimention'
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
    ];
    const schema2 = [
        {
            name: 'id',
            type: 'dimention'
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
        },
    ];
    const data23 = new DataTable(data1, schema1, 'TableA');
    const data24 = new DataTable(data2, schema2, 'TableB');

    it('Should return left join', () => {
        let expectedResult = {
            schema: [
                {
                    name: 'TableA.id',
                    type: 'dimention'
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
                    name: 'TableB.id',
                    type: 'dimention'
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
        expect(leftOuterJoin(data23, data24, obj => obj.TableA.id === obj.TableB.id).getData())
                        .to.deep.equal(expectedResult);
    });
    it('Should return right join', () => {
        let expectedResult = {
            schema: [
                {
                    name: 'TableB.id',
                    type: 'dimention'
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
                },
                {
                    name: 'TableA.id',
                    type: 'dimention'
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
                }
            ],
            data: [
                [
                    '1',
                    10,
                    200,
                    'Hello',
                    'Jude',
                    '1',
                    10,
                    20,
                    'Hey',
                    'Jude'
                ],
                [
                    '4',
                    200,
                    250,
                    'Bollo',
                    'Wood',
                    '4',
                    15,
                    25,
                    'White',
                    'walls'
                ]
            ],
            uids: [
                0,
                1
            ]
        };
        expect(rightOuterJoin(data23, data24, obj => obj.TableA.id === obj.TableB.id).getData())
                        .to.deep.equal(expectedResult);
    });
    it('Should return full join', () => {
        let expectedResult = {
            schema: [
                {
                    name: 'TableA.id',
                    type: 'dimention'
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
                    name: 'TableB.id',
                    type: 'dimention'
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

        expect(fullOuterJoin(data23, data24, obj => obj.TableA.id === obj.TableB.id).getData())
                        .to.deep.equal(expectedResult);
    });
});
