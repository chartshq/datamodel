const data = [
    { age: 30, job: 'management', marital: 'married' },
    { age: 59, job: 'blue-collar', marital: 'married' },
    { age: 35, job: 'management', marital: 'single' },
    { age: 57, job: 'self-employed', marital: 'married' },
    { age: 28, job: 'blue-collar', marital: 'married' },
    { age: 30, job: 'blue-collar', marital: 'single' },
];
const schema = [
    { name: 'age', type: 'measure' },
    { name: 'job', type: 'dimension' },
    { name: 'marital', type: 'dimension' }
];
const rootDm = new DataModel(data, schema);

const dm = rootDm.select(fields => fields.age.value > 30);
const sortedDm = dm.sort([['age', 'ASC']]);