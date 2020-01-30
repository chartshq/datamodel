/* global describe, it */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import DataModel from '../index'
;
import { naturalJoin } from './natural-join';
import { IdValue } from '../fields/parsers/id-parser';

describe('Test Natural Join', () => {
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

    describe('#naturalJoin', () => {
        it('should return a naturally joined datamodel', () => {
            let expectedResult = {
                schema: [
                    {
                        name: 'id',
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
                        10,
                        200,
                        'Hello',
                        'Jude'
                    ],
                    [
                        '4',
                        15,
                        25,
                        'White',
                        'walls',
                        200,
                        250,
                        'Bollo',
                        'Wood'
                    ]
                ],
                uids: [
                    0,
                    1
                ].map(id => new IdValue(id))
            };
            expect(naturalJoin(data23, data24, obj => obj.ModelA.id === obj.ModelB.id).getData())
                            .to.deep.equal(expectedResult);
        });
    });
});
