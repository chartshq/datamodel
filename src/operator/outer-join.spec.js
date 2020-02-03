/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { fullOuterJoin, leftOuterJoin, rightOuterJoin } from './outer-join';
import DataModel from '../index'
;
import InvalidAwareTypes from '../invalid-aware-types';
import { IdValue } from '../fields/parsers/id-parser';

describe('Testing Outer Join', () => {
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
    ];
    const schema2 = [
        {
            name: 'id',
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
        },
    ];
    const data23 = new DataModel(data1, schema1, { name: 'ModelA' });
    const data24 = new DataModel(data2, schema2, { name: 'ModelB' });
    describe('#leftOuterJoin', () => {
        it('should return left join', () => {
            let expectedResult = {
                schema: [
                    {
                        name: 'ModelA.id',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'profit',
                        type: 'measure',
                        subtype: 'continuous',
                        defAggFn: 'avg'
                    },
                    {
                        name: 'sales',
                        type: 'measure',
                        subtype: 'continuous',
                    },
                    {
                        name: 'first',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'second',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'ModelB.id',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'netprofit',
                        type: 'measure',
                        subtype: 'continuous',
                        defAggFn: 'avg'
                    },
                    {
                        name: 'netsales',
                        type: 'measure',
                        subtype: 'continuous',
                    },
                    {
                        name: '_first',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: '_second',
                        type: 'dimension',
                        subtype: 'categorical'
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
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL
                    ],
                    [
                        '3',
                        10,
                        20,
                        'White',
                        'the sun',
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL
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
                ].map(id => new IdValue(id))
            };
            expect(leftOuterJoin(data23, data24,
                (dmFields1, dmFields2) => dmFields1.id.value === dmFields2.id.value).getData())
                            .to.deep.equal(expectedResult);
        });
    });
    describe('#rightOuterJoin', () => {
        it('should return right join', () => {
            let expectedResult = {
                schema: [
                    {
                        name: 'ModelB.id',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'netprofit',
                        type: 'measure',
                        subtype: 'continuous',
                        defAggFn: 'avg'
                    },
                    {
                        name: 'netsales',
                        type: 'measure',
                        subtype: 'continuous',
                    },
                    {
                        name: '_first',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: '_second',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'ModelA.id',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'profit',
                        type: 'measure',
                        subtype: 'continuous',
                        defAggFn: 'avg'
                    },
                    {
                        name: 'sales',
                        type: 'measure',
                        subtype: 'continuous',
                    },
                    {
                        name: 'first',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'second',
                        type: 'dimension',
                        subtype: 'categorical'
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
                ].map(id => new IdValue(id))
            };
            expect(rightOuterJoin(data23, data24,
                (dmFields1, dmFields2) => dmFields1.id.value === dmFields2.id.value).getData())
                            .to.deep.equal(expectedResult);
        });
    });

    describe('#fullOuterJoin', () => {
        it('should return full join', () => {
            let expectedResult = {
                schema: [
                    {
                        name: 'ModelA.id',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'profit',
                        type: 'measure',
                        subtype: 'continuous',
                        defAggFn: 'avg'
                    },
                    {
                        name: 'sales',
                        type: 'measure',
                        subtype: 'continuous',
                    },
                    {
                        name: 'first',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'second',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'ModelB.id',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: 'netprofit',
                        type: 'measure',
                        subtype: 'continuous',
                        defAggFn: 'avg'
                    },
                    {
                        name: 'netsales',
                        type: 'measure',
                        subtype: 'continuous',
                    },
                    {
                        name: '_first',
                        type: 'dimension',
                        subtype: 'categorical'
                    },
                    {
                        name: '_second',
                        type: 'dimension',
                        subtype: 'categorical'
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
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL
                    ],
                    [
                        '3',
                        10,
                        20,
                        'White',
                        'the sun',
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL,
                        InvalidAwareTypes.NULL
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
                ].map(id => new IdValue(id))
            };

            expect(fullOuterJoin(data23, data24,
                (dmFields1, dmFields2) => dmFields1.id.value === dmFields2.id.value).getData())
                            .to.deep.equal(expectedResult);
        });
    });
});
