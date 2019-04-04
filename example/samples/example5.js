
fetch("/data/cars.json")
.then(resp => resp.json())
.then(data => {
    // const schema = [
    //     // {
    //     //   "name": "Ticket",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Organisation",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Name",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Email ID",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Country",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Medium",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Member",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Shared with Member",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Partner",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Partner Name",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Partner Email ID",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Product",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "New / Renewal",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Industry",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Trade Discount",
    //     //   "type": "measure"
    //     // },
    //     // {
    //     //   "name": "Reseller Discount",
    //     //   "type": "measure"
    //     // },
    //     {
    //         name: 'Qty',
    //         type: 'measure'
    //     },
    //     // {
    //     //   "name": "Price",
    //     //   "type": "measure"
    //     // },
    //     // {
    //     //   "name": "Gross Value",
    //     //   "type": "measure"
    //     // },
    //     // {
    //     //   "name": "Net Value",
    //     //   "type": "measure"
    //     // },
    //     // {
    //     //   "name": "PO Number",
    //     //   "type": "measure"
    //     // },
    //     {
    //         name: 'Date of Order',
    //         type: 'dimension',
    //         subtype: 'temporal',
    //         format: '%Y-%m-%d'
    //     },
    //     // {
    //     //   "name": "Month",
    //     //   "type": "dimension",
    //     //   "subtype": "temporal",
    //     //   "format": "%Y-%m-%d"
    //     // },
    //     // {
    //     //   "name": "Quarter",
    //     //   "type": "dimension"
    //     // },
    //     {
    //       "name": "Date of Payment",
    //       "type": "dimension",
    //       "subtype": "temporal",
    //       "format": "%Y-%m-%d"
    //     },
    //     // {
    //     //   "name": "Payment Mode",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Source/Ref No.",
    //     //   "type": "measure"
    //     // },
    //     // {
    //     //   "name": "Payment Due Date",
    //     //   "type": "dimension",
    //     //   "subtype": "temporal",
    //     //   "format": "%Y-%m-%d"
    //     // },
    //     // {
    //     //   "name": "Lead in Date",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //   "name": "Lead out Date",
    //     //   "type": "dimension"
    //     // },
    //     // {
    //     //     name: 'Days Taken',
    //     //     type: 'measure'
    //     // },
    //     // {
    //     //     name: 'Status',
    //     //     type: 'dimension'
    //     // }
    // ];
    
    // // DataModel.configureInvalidAwareTypes({
    // //     "": DataModel.InvalidAwareTypes.NULL,
    // // });
    // const dm = new DataModel(data, schema);
    // const dmData = dm.getData().data;
    // const selected = dm.select(fields => fields['Date of Payment'].value === DataModel.InvalidAwareTypes.NULL);
    
    // const compData = dm.groupBy(['name']).getData();

    const data1 = [
        { profit: 10, sales: 25, city: 'a', state: 'aa' },
        { profit: 15, sales: 20, city: 'b', state: 'bb' },
        { profit: 10, sales: 25, city: 'a', state: 'ab' },
        { profit: 15, sales: 20, city: 'b', state: 'ba' },
    ];
    const schema1 = [
        { name: 'profit', type: 'measure' },
        { name: 'sales', type: 'measure' },
        { name: 'city', type: 'dimension' },
        { name: 'state', type: 'dimension' },
    ];
    const dataModel = new DataModel(data1, schema1, { name: 'Yo' });

    kk = dataModel.project(['profit','sales'])

    mm = kk.sort(['sales'],{saveChild: true})
})

