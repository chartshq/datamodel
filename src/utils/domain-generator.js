export const getUniqueValues = data => [...new Set(data)];

export const generateMeasureDomain = (data) => {
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;
    data.forEach((d) => {
        if (d < min) {
            min = d;
        }
        if (d > max) {
            max = d;
        }
    });
    return [min, max];
};
