const data = [
    {
      "xvalue": -19800000,
      "xvalue0": 63052200000,
      "xdim": -19800000,
      "yvalue": undefined,
    },
    {
      "xvalue": 63052200000,
      "xvalue0": 126210600000,
      "xdim": 63052200000
    },
    {
      "xvalue": 126210600000,
      "xvalue0": 189282600000,
      "xdim": 126210600000
    },
    {
      "xvalue": 189282600000,
      "xvalue0": 252441000000,
      "xdim": 189282600000
    },
    {
      "xvalue": 252441000000,
      "xvalue0": 315513000000,
      "xdim": 252441000000
    },
    {
      "xvalue": 315513000000,
      "xvalue0": 378671400000,
      "xdim": 315513000000
    },
    {
      "xvalue": 378671400000,
      "xdim": 378671400000
    }
  ]

const schema = [
    {
      "name": "yvalue",
      "type": "measure"
    },
    {
      "name": "xvalue",
      "type": "measure"
    },
    {
      "name": "yvalue0",
      "type": "measure"
    },
    {
      "name": "xvalue0",
      "type": "measure"
    },
    {
      "name": "xdim",
      "type": "dimension",
      "subtype": "temporal"
    },
    {
      "name": "ydim",
      "type": "dimension",
      "subtype": "temporal"
    }
  ]

window.a = new DataModel(data, schema);

const jsonData1 = [
    {
      "yvalue": 0,
      "yvalue0": 50,
      "ydim": 0
    },
    {
      "yvalue": 50,
      "yvalue0": 100,
      "ydim": 50
    },
    {
      "yvalue": 100,
      "yvalue0": 150,
      "ydim": 100
    },
    {
      "yvalue": 150,
      "yvalue0": 200,
      "ydim": 150
    },
    {
      "yvalue": 200,
      "yvalue0": 250,
      "ydim": 200
    },
    {
      "yvalue": 250,
      "yvalue0": 300,
      "ydim": 250
    },
    {
      "yvalue": 300,
      "yvalue0": 350,
      "ydim": 300
    },
    {
      "yvalue": 350,
      "yvalue0": 400,
      "ydim": 350
    },
    {
      "yvalue": 400,
      "yvalue0": 450,
      "ydim": 400
    },
    {
      "yvalue": 450,
      "ydim": 450
    }
  ];

const schema1 = [
    {
      "name": "yvalue",
      "type": "measure"
    },
    {
      "name": "xvalue",
      "type": "measure"
    },
    {
      "name": "yvalue0",
      "type": "measure"
    },
    {
      "name": "xvalue0",
      "type": "measure"
    },
    {
      "name": "xdim",
      "type": "dimension",
      "subtype": "categorical"
    },
    {
      "name": "ydim",
      "type": "dimension",
      "subtype": "categorical"
    }
  ];

  window.b = new DataModel(jsonData1, schema1);