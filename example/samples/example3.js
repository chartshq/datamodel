const DataModel = window.DataModel.default;
d3.json('./data/cars.json', (data) => {
    const data1 = [
        { age: 30, job: 'management', marital: 'married' },
        { age: 59, job: 'blue-collar', marital: 'married' },
        { age: 35, job: 'management', marital: 'single' },
        { age: 57, job: 'self-employed', marital: 'married' },
        { age: 28, job: 'blue-collar', marital: 'married' },
    ];
    const schema = [
        { name: 'age', type: 'measure' },
        { name: 'job', type: 'dimension' },
        { name: 'marital', type: 'dimension' }
    ];
    const dataModel = new DataModel(data1, schema);
    const selectedDm = dataModel.select(fields => fields.age.value < 40);
    selectedDm.getFieldspace().fields[0].domain();
});

