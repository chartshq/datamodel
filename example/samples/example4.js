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
            "defAggFn": "avg",
            "numberFormat": (val) => `$${val}`
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
    const selectedDateParsed = dm.select(fields => {
        return fields.Year.value === '1970-01-01';
    });

    const selectedDateRaw = dm.select(fields => fields.Year.internalValue === -19800000);
    const newField = dm.calculateVariable({
        name: 'newField',
        type: 'measure'
    }, ['Horsepower', 'Weight_in_lbs', (hp, weight) => hp / weight ]);
});