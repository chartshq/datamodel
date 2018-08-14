/**
 * @public
 * @module Field
 *
 * In relational table, a Field is a data structure for a single piece of data. Fields are organized into records,
 * which contain all the information within the table relevant to a specific entity.
 *
 * Each record consists of several fields; the fields of all records form the columns.
 * Examples of fields: name, gender, sex etc.
 *
 * In DataModel, each field can have multiple attributes which describes its data and behaviour.
 * A field can have two types of data: Measure and Dimension.
 *
 * A Dimension Field is the context on which a data is categorized and the measure is the numerical values that
 * quantify the data set.
 * In short a dimension is the lens through which you are looking at your measure data.
 *
 * Refer to {@link Schema} to get info about possible field attributes.
 */
