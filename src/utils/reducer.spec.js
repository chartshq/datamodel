/* global describe, it ,context */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import REDUCER from './reducer';
import { defReducer, fnList } from '../operator/group-by-function';

describe('Checking Reducer Functionality', () => {
    context('validate Reducer Object', () => {
        it('check if default reducer is function', () => {
            expect(typeof REDUCER.defaultReducer).to.equal('function');
        });
        it('check if default reducer is sum', () => {
            expect(REDUCER.defaultReducer).to.equal(defReducer);
        });
        it('check if default reducer is updates', () => {
            REDUCER.defaultReducer = fnList.min;
            expect(REDUCER.defaultReducer).to.equal(fnList.min);
        });
        it('check if reducer resolving is correct', () => {
            REDUCER.defaultReducer = fnList.min;
            expect(REDUCER._resolve('min')).to.equal(fnList.min);
        });
        it('check if reducer register a function correctly', () => {
            let sum2 = function() {
                return 3 + 6;
            };
            REDUCER.register('mySum', sum2);
            expect(REDUCER._resolve('mySum')).to.equal(sum2);
        });
        it('check if reducer un-register a function correctly', () => {
            REDUCER.unregister('mySum');
            expect(REDUCER._resolve('mySum')).to.equal(undefined);
        });
    });
});
