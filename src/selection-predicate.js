/**
 * A simple predicate which decides if a row is selected for a given condition or not. If this predicate returns true
 * the current row is labeled as a member of selection set. Similarly if returns false, the current row is labeled as
 * a memeber of rejection set.
 * 
 * Note: This funciton does not directly decides whether the row should be present in the final resultant DataModel.
 * Based on selection set and rejection set which predicate function helps to decide, MODE determine which row should
 * be present in the final DataModel.
 * 
 * @public
 * @module SelecitonPredicate
 * 
 * @param {object} rowInf Particular row information presented as object.
 *      When rows are iterated by a operator, all the fields {@link Value | value} present in a row, are combined in a 
 *      object. The key of the object is name of field and value is {@link Value | value} of field for that current row.
 *      A typical value of a row is represented by
 * 
 *      ```
 *      {
 *          origin: Value,
 *          horsepower: Value
 *          ... 
 *      } 
 *      ```
 *
 * @param {Number} rowIndex Index of current iteration of row
 */