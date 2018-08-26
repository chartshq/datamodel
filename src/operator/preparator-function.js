/**
 * All the functional operators of DataModel works in similar way. They accepts arguments which are specific for a
 * operator and returns a function. This function is called PreparatorFunction. This function expects a DataModel
 * instance, performs the oprerator(s) on the instance and return an resultant DataModel instance.
 *
 * ```
 *  const project = DataModel.operators.project;
 *  const fn = project(['horsepower', 'miles_per_gallon']); // fn <- preparator function
 *  fn(dm);
 * ```
 *
 * @public
 * @module PreparatorFunction
 * @namespace DataModel
 *
 * @param {DataModel} target Instance of DataModel on which operator has to be applied
 *
 * @return {DataModel} Resultant instance of DataModel
 */
