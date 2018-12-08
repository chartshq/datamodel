schema = [
    {
        name: 'name',
        type: 'dimension'
    },
    {
        name: 'birthday',
        type: 'dimension',
        subtype: 'temporal',
        format: '%Y-%m-%d'
    },
    {
        name: 'roll',
        type: 'measure',
        defAggFn: "avg"
    },
    {
        name: 'origin',
        type: 'dimension'
    },
];

data = [
    {
        name: 'swati',
        birthday: null,
        roll: 'nil',
        origin: 'india'
    },
    {
        name: 'ujjal',
        birthday: undefined,
        roll: undefined,
        origin: 'india'
    },
    {
        name: 'rousan',
        birthday: '1996-08-04',
        roll: null,
        origin: 'inasd'
    },
    {
        name: 'adarsh',
        birthday: '1996-08-04',
        roll: 'adarsh',
        origin: 'india'
    },
    {
        name: 'sanjay',
        birthday: '1991-08-04',
        roll: 34,
        origin: 'inia'
    },
];

DataModel.configureInvalidAwareTypes({
    "invalid": DataModel.InvalidAwareTypes.NULL,
});
dm = new DataModel(data, schema);
dmData = dm.getData().data;
selected = dm.select(fields => fields.roll.value === DataModel.InvalidAwareTypes.NULL);

compData = dm.groupBy(['name']).getData();
