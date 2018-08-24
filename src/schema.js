/**
 * Schema is used to describe a variable present in data. Definition of schema is different for
 * {@link link_to_dimension_concept |dimensions and measures}.
 *
 * Following properties are available on the schema object both for measure and dimension.
 * - `name`: name of the variable. The variable must exist in the data. Its the only mandatory property in schema.
 * - `type`: type of the variable. The options are `'measure'` and `'dimension'`. Default is `'dimension'`.
 * - `description`: additional explanation about the variable
 *
 * For a dimension the following fields are available on schema object
 * - `subtype`: specifies what kind of dimension it is. Currently the options are `'categorical'` and `'datetime'`.
 *      Default is `'categorical'`
 * - `format`: if the the subtype of dimension is `'datetime'` then `format` is used to parse the date format. Read more
 *      about {@link DateFormat}.
 *
 * For a measure the following fields are available on schema object
 * - `defAggFn`: reducer function to be used when variable is aggregated. Learn more about {@link Reducer}.
 * - `unit`: unit of the measures in string
 * - `numberformat`: a function which returns the formatted value of a variable, this is only for output purpose.
 *
 * For a data
 * ```
 * Name,Miles_per_Gallon,Cylinders,Displacement,Horsepower,Weight_in_lbs,Acceleration,Year,Origin
 * chevrolet chevelle malibu,18,8,307,130,3504,12,1970,USA
 * buick skylark 320,15,8,350,165,3693,11.5,1970,USA
 * plymouth satellite,18,8,318,150,3436,11,1970,USA
 * ```
 * The schema would be something like
 * @example
 *  const schema = [
 *      { name: 'Name', type: 'dimension' },
 *      { name: 'Miles_per_Gallon', type: 'measure', numberFormat: (val) => `${val} miles / gallon` },
 *      { name: 'Cylinder', type: 'dimension' },
 *      { name: 'Displacement', type: 'measure', defAggFn: 'max' },
 *      { name: 'HorsePower', type: 'measure', defAggFn: 'max' },
 *      { name: 'Weight_in_lbs', type: 'measure', defAggFn: 'avg',  },
 *      { name: 'Acceleration', type: 'measure', defAggFn: 'avg' },
 *      { name: 'Year', type: 'dimension', subtype: 'datetime', format: '%Y' },
 *      { name: 'Origin' }
 *  ]
 *
 * @public
 * @namespace DataModel
 */
