/**
 * @public
 * @module VariableResolver
 * @type FormatSpec
 *
 * A format of specifying resolve criterial of a new variable from existing variable. The variables could be Measure or
 * Dimension.
 * The format for resolver is intuitive. It needs all the existing variable which is dependency of the new variable
 * listed adjacently followed by the resolving function in a single array.
 *
 * The resolver function gets called for each row of data model passing the {@link Value} of dependent variables as
 * parameter
 * ```
 *  ['horsepower', 'acceleration', (horsepower, acceleration) => {
 *      return acceleration / horsepower
 *  }]
 * ```
 */
