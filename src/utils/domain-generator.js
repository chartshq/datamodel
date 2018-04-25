export const getUniqueValues = data => [...new Set(data)];

const generateCategoryDomain = data => getUniqueValues(data);
const generateMeasureDomain = (data) => {
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

export const generateDomain = (fieldInstance) => {
    if (fieldInstance.constructor.name === 'Categorical') {
        return generateCategoryDomain(fieldInstance.data);
    } else if (fieldInstance.constructor.name === 'Measure') {
        return generateMeasureDomain(fieldInstance.data);
    } return [];
};
