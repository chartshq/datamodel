const dataUrl = 'https://raw.githubusercontent.com/ranajitbanerjee/ranajitbanerjee.github.io/master/coffee.csv';
let schema1 = [
    {
    "name": "Market",
    "type": "dimension"
    }
];

let schema2 = [
    {
    "name": "Market",
    "type": "dimension"
    },
    {
    "name": "Product",
    "type": "dimension"
    },
    {
    "name": "Product Type",
    "type": "dimension"
    },
    {
    "name": "Revenue",
    "type": "measure"
    },
    {
    "name": "Expense",
    "type": "measure"
    },
    {
    "name": "Profit",
    "type": "measure"
    },
    {
        "name": "Order Count2",
        "type": "measure"
    },
    {
        "name": "Order Count3",
        "type": "measure"
    },
    {
        "name": "Order Count4",
        "type": "measure"
    },
    {
    "name": "Order Count",
    "type": "measure"
    },
    ];

fetch('./data/coffee.csv')
  .then(function(response) {
    return response.text();
  })
  .then(function(myCsv) {
    // const option = {
    //     firstRowHeader: false
    // };
    const dm = new DataModel(myCsv, schema2);
  });
