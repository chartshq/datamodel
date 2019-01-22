
fetch("/data/cars.json")
.then(resp => resp.json())
.then(data => {
    schema = [
        // {
        //   "name": "Ticket",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Organisation",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Name",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Email ID",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Country",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Medium",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Member",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Shared with Member",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Partner",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Partner Name",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Partner Email ID",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Product",
        //   "type": "dimension"
        // },
        // {
        //   "name": "New / Renewal",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Industry",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Trade Discount",
        //   "type": "measure"
        // },
        // {
        //   "name": "Reseller Discount",
        //   "type": "measure"
        // },
        {
            name: 'Qty',
            type: 'measure'
        },
        // {
        //   "name": "Price",
        //   "type": "measure"
        // },
        // {
        //   "name": "Gross Value",
        //   "type": "measure"
        // },
        // {
        //   "name": "Net Value",
        //   "type": "measure"
        // },
        // {
        //   "name": "PO Number",
        //   "type": "measure"
        // },
        {
            name: 'Date of Order',
            type: 'dimension',
            subtype: 'temporal',
            format: '%Y-%m-%d'
        },
        // {
        //   "name": "Month",
        //   "type": "dimension",
        //   "subtype": "temporal",
        //   "format": "%Y-%m-%d"
        // },
        // {
        //   "name": "Quarter",
        //   "type": "dimension"
        // },
        {
          "name": "Date of Payment",
          "type": "dimension",
          "subtype": "temporal",
          "format": "%Y-%m-%d"
        },
        // {
        //   "name": "Payment Mode",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Source/Ref No.",
        //   "type": "measure"
        // },
        // {
        //   "name": "Payment Due Date",
        //   "type": "dimension",
        //   "subtype": "temporal",
        //   "format": "%Y-%m-%d"
        // },
        // {
        //   "name": "Lead in Date",
        //   "type": "dimension"
        // },
        // {
        //   "name": "Lead out Date",
        //   "type": "dimension"
        // },
        // {
        //     name: 'Days Taken',
        //     type: 'measure'
        // },
        // {
        //     name: 'Status',
        //     type: 'dimension'
        // }
    ];
    
    DataModel.configureInvalidAwareTypes({
        "": DataModel.InvalidAwareTypes.NULL,
    });
    dm = new DataModel(data, schema);
    dmData = dm.getData().data;
    selected = dm.select(fields => fields['Date of Payment'].value === DataModel.InvalidAwareTypes.NULL);
    
    compData = dm.groupBy(['name']).getData();
})

