/* global describe, it ,context */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import REDUCER from './reducer-store';
import { defReducer, fnList } from '../operator';

describe('Testing Reducer Functionality', () => {
    context('validate Reducer Object', () => {
        describe('#defaultReducer', () => {
            it('should return a function type as default reducer type', () => {
                expect(typeof REDUCER.defaultReducer).to.equal('function');
            });

            it('should return default reducer as sum', () => {
                expect(REDUCER.defaultReducer()).to.equal(defReducer);
            });

            it('should return updated reducer object', () => {
                REDUCER.defaultReducer(fnList.min);
                expect(REDUCER.defaultReducer()).to.equal(fnList.min);

                REDUCER.defaultReducer('max');
                expect(REDUCER.defaultReducer()).to.equal(fnList.max);
            });

            it('should throw error when input reducer does not exist', () => {
                const fakeReducerName = 'random-one';
                const mockedFn = () => { REDUCER.defaultReducer(fakeReducerName); };
                expect(mockedFn).to.throw(`Reducer ${fakeReducerName} not found in registry`);
            });
        });

        describe('#resolve', () => {
            it('should resolve correct reducer function', () => {
                REDUCER.defaultReducer(fnList.min);
                expect(REDUCER.resolve('min')).to.equal(fnList.min);

                expect(REDUCER.resolve(fnList.max)).to.equal(fnList.max);
            });
        });
        let sum2 = function() {
            return 3 + 6;
        };
        let mysum = REDUCER.register('mySum', sum2);
        describe('#register', () => {
            it('check if reducer register a function correctly', () => {
                REDUCER.register('mySum', sum2);
                expect(REDUCER.resolve('mySum')).to.equal(sum2);
            });

            it('check if reducer un-register a function correctly', () => {
                mysum();
                expect(REDUCER.resolve('mySum')).to.equal(undefined);
            });

            it('should be throw error when invalid reducer is passed', () => {
                const mockedFn = () => {
                    REDUCER.register('mySum', 'not-a-function-type');
                };
                expect(mockedFn).to.throw('Reducer should be a function');
            });
        });
    });
});
