// /* eslint-disable */

const schema = [
    { name: "a", type: "measure" },
    { name: "b", type: "measure" },
    { name: "c", type: "measure" }
];

const data = [
    { a: 1, b: 2, c: 1 },
    { a: 2, b: 1, c: 2 },
    { a: 3, b: 2, c: 1 },
    { a: 1, b: 1, c: 3 },
    { a: 3, b: 1, c: 1 },
    { a: 2, b: 2, c: 1 },
    { a: 1, b: 2, c: 2 },
    { a: 2, b: 3, c: 2 },
    { a: 3, b: 2, c: 3 }
];

const dm = new DataModel(data, schema);
const dm2 = dm.sort([
    ["a", null],
    ["b", null],
    ["c", "desc"]
]);

console.log(dm.getData());
console.log(dm2.getData());

// const makeMap = (cols, data) => {
//     if (cols.length === 0) { return data; }
    
//     const targetCol = cols[0];
//     const map = new Map();

//     data.reduce((acc, currRow) => {
//         const fVal = currRow[targetCol];
//         if (acc.has(fVal)) {
//             acc.get(fVal).push(currRow);
//         } else {
//             acc.set(fVal, [currRow]);
//         }
//         return acc;
//     }, map);

//     for (let [key, val] of map) {
//         const nMap = makeMap(cols.slice(1), val);
//         map.set(key, nMap);
//     }

//     return map;
// }

// const reArrangeSortedArray = (cols, map, origData) => {
//     return origData.map((row) => {
//         let i = 0;
//         let nextMap = map;

//         while(!Array.isArray(nextMap)) {
//             nextMap = nextMap.get(row[cols[i++]]);
//         }

//         return nextMap.shift();
//     });
// }


// const groupMap = makeMap(["a"], data);
// // console.log(groupMap);

// console.log(data);
// console.log(reArrangeSortedArray(["a"], groupMap, data));


// ["a", "asc"],
// ["b", null],
// ["c", "desc"]

// data.sort((row1, row2) => {
//     let r, v1, v2;

//     v1 = row1.a;
//     v2 = row2.a;
//     r = v1 - v2;

//     if (r === 0) {
//         v1 = row1.b;
//         v2 = row2.b;
//         r = v1 - v2;
//         if (r === 0) {
//             return row2.c - row1.c;
//         }
//         return r;
//     }
//     return 0;
// });


// debugger;

// const dm = new DataModel(data, schema);
// const dm2 = dm.sort([
//     ["a", "asc"],
//     ["a", null],
//     ["c", "desc"]
// ]);

// const data = [
//     { age: 30, job: 'management', marital: 'married' },
//     { age: 59, job: 'blue-collar', marital: 'married' },
//     { age: 35, job: 'management', marital: 'single' },
//     { age: 57, job: 'self-employed', marital: 'married' },
//     { age: 28, job: 'blue-collar', marital: 'married' },
//     { age: 30, job: 'blue-collar', marital: 'single' },
// ];
// const schema = [
//     { name: 'age', type: 'measure' },
//     { name: 'job', type: 'dimension' },
//     { name: 'marital', type: 'dimension' }
// ];

// const dm = new DataModel(data, schema);
// const dm2 = dm.sort([
//     ["age", null],
//     ["job", "asc"]
// ]);

// debugger;

// // const schema = [
// //     { name: "a", type: "dimension" },
// //     { name: "b", type: "dimension" },
// // ]

// // const data = [
// //     { a: 1, b: "USA" },
// //     { a: 2, b: "USA" },
// //     { a: 1, b: "JAPAN" },
// //     { a: 2, b: "AFR" },
// //     { a: 1, b: "EUR" },
// //     { a: 1, b: "INDIA" },
// //     { a: 2, b: "USA" },
// //     { a: 2, b: "CHINA" },
// //     { a: 1, b: "USA" },
// //     { a: 2, b: "USA" },
// // ];

// // data.sort((row1, row2) => {
// //     let v1, v2, r;

// //     v1 = row1.a;
// //     v2 = row2.a;
// //     r = v1 - v2;

// //     if (r === 0) {
// //         v1 = row1.b;
// //         v2 = row2.b;
// //         if (v1 < v2) {
// //             r = -1;
// //         } else if (v1 > v2) {
// //             r = 1;
// //         } else {
// //             r = 0;
// //         }
// //     }
// //     return r;
// // });

// // debugger;

// // const dm = new DataModel(data, schema);
// // const dm2 = dm.sort([
// //     ["a", () => 0],
// //     ["b", "asc"]
// // ]);

// // debugger;