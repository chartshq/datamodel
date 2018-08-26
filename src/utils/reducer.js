/**
 * Reducer is just a simple function which takes an array of real numbers and returns a representative number by
 * reducing the array. A reducer can only be applied on a measure.
 *
 * DataModel provided reducers which can be used out of the box
 *  <table>
 *      <tr>
 *          <th>Reducer Name</th>
 *          <th>Description</th>
 *      </tr>
 *      <tr>
 *          <td>sum</td>
 *          <td>returns the sum of all the number</td>
 *      </tr>
 *      <tr>
 *          <td>avg</td>
 *          <td>returns the avg of all the number</td>
 *      </tr>
 *      <tr>
 *          <td>min</td>
 *          <td>returns the minimum of all the number</td>
 *      </tr>
 *      <tr>
 *          <td>max</td>
 *          <td>returns the maximum of all the number</td>
 *      </tr>
 *      <tr>
 *          <td>first</td>
 *          <td>returns the first number</td>
 *      </tr>
 *      <tr>
 *          <td>last</td>
 *          <td>returns the last number</td>
 *      </tr>
 *      <tr>
 *          <td>count</td>
 *          <td>returns number of elements in the array</td>
 *      </tr>
 *      <tr>
 *          <td>variance</td>
 *          <td>returns the variance of the numbers from the mean</td>
 *      </tr>
 *      <tr>
 *          <td>std</td>
 *          <td>returns the standard deviation of the numbers</td>
 *      </tr>
 *  </table>
 *
 * @example
 * // An function to calculate mean squared value of an array.
 * function (arr) {
 *      const squaredVal = arr.map(item => item * item);
 *      let sum = 0;
 *      for (let i = 0, l = squaredVal.length; i < l; i++) {
 *          sum += squaredVal[i];
 *      }
 *
 *      return sum;
 *  }
 *
 * @public
 * @namespace DataModel
 *
 * @param {Array.<Number>} arr array of numbers which needs to be reduced to a single number.
 * @return {Number} single representative number
 *
 */
