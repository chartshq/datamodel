/**
 * A format of specifying the filter function for various join operation.
 * The format is similiar to the ANSI SQL join conditions as follows:
 *
 * ( join_instance ) =>
 *          join_instance.{name of first DM}.{ field name} { condition } join_instance.{name of first DM}.{ field name}
 *
 * for example
 * ```
 * obj => obj.[newdm.getName()].Origin === obj.[anotherNewDm.getName()].Origin).getData())
 * ```
 * Above we wrote a function which will recieve a join object containing reference of both
 * dataModels from where we refer each dataModels by its name ( using datamodel.getName()),then
 * we specify the field on which the conditional operator will be applied
 * then we give condition operator and the same is done in RHS for the another field of another
 * datamodel.
 *
 * @public
 */
