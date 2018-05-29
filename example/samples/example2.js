d3.csv('./data/cars.csv', (data) => {
    console.log(JSON.stringify(data, null, 2));
});
