/* global describe, it ,context */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import REDUCER from './reducer';
import { defReducer, fnList } from '../operator';

describe('Checking Reducer Functionality', () => {
    context('validate Reducer Object', () => {
        it('check if default reducer is function', () => {
            expect(typeof REDUCER.defaultReducer).to.equal('function');
        });
        it('check if default reducer is sum', () => {
            expect(REDUCER.defaultReducer()).to.equal(defReducer);
        });
        it('check if default reducer is update', () => {
            REDUCER.defaultReducer(fnList.min);
            expect(REDUCER.defaultReducer()).to.equal(fnList.min);
        });
        it('check if reducer resolving is correct', () => {
            REDUCER.defaultReducer(fnList.min);
            expect(REDUCER.resolve('min')).to.equal(fnList.min);
        });
        let sum2 = function() {
            return 3 + 6;
        };
        let mysum = REDUCER.register('mySum', sum2);
        it('check if reducer register a function correctly', () => {
            REDUCER.register('mySum', sum2);
            expect(REDUCER.resolve('mySum')).to.equal(sum2);
        });
        it('check if reducer un-register a function correctly', () => {
            mysum();
            expect(REDUCER.resolve('mySum')).to.equal(undefined);
        });
    });
});
