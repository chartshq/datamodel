/* eslint-disable */

d3.json('./data/cars.json', (data) => {
    const schema = [
        {
            "name": "Name",
            "type": "dimension"
        },
        {
            "name": "Maker",
            "type": "dimension"
        },
        {
            "name": "Miles_per_Gallon",
            "type": "measure",
            "defAggFn": "avg"
        },
        {
            "name": "Displacement",
            "type": "measure",
            "subtype": "continuous",
            "defAggFn": "max"
        },
        {
            "name": "Horsepower",
            "type": "measure",
            "defAggFn": "avg"
        },
        {
            "name": "Weight_in_lbs",
            "type": "measure",
            "defAggFn": "min"
        },
        {
            "name": "Acceleration",
            "type": "measure",
            "defAggFn": "avg"
        },
        {
            "name": "Origin",
            "type": "dimension"
        },
        {
            "name": "Cylinders",
            "type": "dimension"
        },
        {
            "name": "Year",
            "type": "dimension",
            "subtype": "temporal",
            "format": "%Y-%m-%d"
        }
    ];

    const dm = new DataModel(data, schema);
    window.selectedDateParsed = dm.select(fields => {
        console.log(fields.Year.parsedValue);
        return fields.Year.parsedValue === '1970-01-01';
    });
    window.selectedDateRaw = dm.select(fields => fields.Year.value === -19800000);
});