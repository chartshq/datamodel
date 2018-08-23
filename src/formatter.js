/**
 * Formatter function is used to format data when DataModel is deserialized. This function is called for every row of
 * the data model with the value, rowId and schema. This function is expected to return a single value for each row of a
 * variable. This formatter function is only used for output purpose.
 *
 * @example
 *  const dateFormatter = (dateInMS) => {
 *      const d = new Date(dateInMS);
 *      return [d.getFullYear(), d.getMonth(), d.getDay()].join('-')
 *  };
 *
 *  const data = dm.getData({
 *      formatter: {
 *          shippingDate: dateFormatter
 *      }
 *  });
 *
 *  console.log(data);
 *
 * @param {any} value value of the variable needs to be formatted for a particular row
 * @param {Number} rowId row id of the row being iterated
 * @param {Schema} schema schema of the variable
 *
 * @return {any} formatted values
 */
