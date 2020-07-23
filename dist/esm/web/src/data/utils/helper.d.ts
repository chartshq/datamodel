import { RawData } from '../../contracts/data';
/**
 * Checks whether the value is an array.
 *
 * @param  {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is an array otherwise returns false.
 */
export declare function isArray(val: RawData | string[] | number[]): boolean;
/**
 * Checks whether the value is an object.
 *
 * @param  {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is an object otherwise returns false.
 */
export declare function isObject(val: RawData | string[] | number[]): boolean;
/**
 * Checks whether the value is a string value.
 *
 * @param  {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is a string value otherwise returns false.
 */
export declare function isString(val: RawData | string[] | number[]): boolean;
/**
 * Checks whether the value is callable.
 *
 * @param {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is callable otherwise returns false.
 */
export declare function isCallable(val: RawData | string[] | number[]): boolean;
/**
 * Returns the unique values from the input array.
 *
 * @param {Array} data - The input array.
 * @return {Array} Returns a new array of unique values.
 */
export declare function uniqueValues(data: number[]): number[];
export declare const getUniqueId: () => string;
/**
 * Checks Whether two arrays have same content.
 *
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The 2nd array.
 * @return {boolean} Returns whether two array have same content.
 */
export declare function isArrEqual(arr1: number[] | string[], arr2: number[] | string[]): boolean;
/**
 * It is the default number format function for the measure field type.
 *
 * @param {any} val - The input value.
 * @return {number} Returns a number value.
 */
export declare function formatNumber(val: number): number;
/**
 * Returns the detected data format.
 *
 * @param {any} data - The input data to be tested.
 * @return {string} Returns the data format name.
 */
export declare const detectDataFormat: (data: any) => string | null;
