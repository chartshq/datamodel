// const DataModel = window.DataModel.default;
const columnMajor = (store) => {
    let i = 0;
    return (...fields) => {
        fields.forEach((val, fieldIndex) => {
            if (!(store[fieldIndex] instanceof Array)) {
                store[fieldIndex] = Array.from({ length: i });
            }
            store[fieldIndex].push(val);
        });
        i++;
    };
};


function FlatJSON222 (arr, schema) {
    if (!Array.isArray(schema)) {
        throw new Error('Schema missing or is in an unsupported format');
    }

    const header = {};
    let i = 0;
    let insertionIndex;
    const columns = [];
    const push = columnMajor(columns);
    const schemaFieldsName = schema.map(unitSchema => unitSchema.name);

    arr.forEach((item) => {
        const fields = [];
        schemaFieldsName.forEach((unitSchema) => {
            if (unitSchema in header) {
                insertionIndex = header[unitSchema];
            } else {
                header[unitSchema] = i++;
                insertionIndex = i - 1;
            }
            fields[insertionIndex] = item[unitSchema];
        });
        push(...fields);
    });

    return [Object.keys(header), columns];
}

class JSONConverter2 extends DataModel.DataConverter{
    constructor(){
        super("json2")
    }

    convert(data , schema , options){
        console.log("this is json2")
        return FlatJSON222(data,schema,options);
    }
} 

DataModel.Converters.register(new JSONConverter2());

const schema = [
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
        type: 'measure'
    }
];

const data = [
    {
        name: 'Rousan',
        birthday: '1995-07-05',
        roll: 12
    },
    {
        name: 'Sumant',
        birthday: '1996-08-04',
        roll: 89
    },
    {
        name: 'Ajay',
        birthday: '1994-01-03',
        roll: 33
    },
    {
        name: 'Sushant',
        birthday: '1994-01-03',
        roll: 33
    },
    {
        name: 'Samim',
        birthday: '1994-01-03',
        roll: 33
    },
    {
        name: 'Akash',
        birthday: '1994-01-03',
        roll: 33
    }
];

const dm = new DataModel(data, schema,{ dataFormat:"json2" });

console.log(dm.getData());
