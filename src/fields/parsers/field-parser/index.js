/**
 * A interface to represent a parser which is responsible to parse the field.
 *
 * @public
 * @interface
 */
export default class FieldParser {
    /**
     * Parses a single value of a field and return the sanitized form.
     *
     * @public
     * @abstract
     */
    parse () {
        throw new Error('Not yet implemented');
    }
}
