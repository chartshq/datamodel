/**
 * Generates domain for measure field.
 *
 * @param {Array} data - The array of data.
 * @return {Array} The measure domain.
 */
export default function generateMeasureDomain(data) {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    data.forEach((d) => {
        if (d < min) {
            min = d;
        }
        if (d > max) {
            max = d;
        }
    });

    return [min, max];
}
