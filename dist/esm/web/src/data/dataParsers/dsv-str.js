import{dsvFormat as d3Dsv}from"d3-dsv";import DSVArr from"./dsv-arr";function DSVStr(r,a,t){if((t=Object.assign({},{firstRowHeader:!0,fieldSeparator:","},t)).fieldSeparator){var e=d3Dsv(t.fieldSeparator);return DSVArr(e.parseRows(r),a,t)}return{schema:[],data:[]}}export default DSVStr;