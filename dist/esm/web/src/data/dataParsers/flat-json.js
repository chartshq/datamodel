var __read=this&&this.__read||function(r,t){var a="function"==typeof Symbol&&r[Symbol.iterator];if(!a)return r;var e,o,n=a.call(r),i=[];try{for(;(void 0===t||t-- >0)&&!(e=n.next()).done;)i.push(e.value)}catch(r){o={error:r}}finally{try{e&&!e.done&&(a=n.return)&&a.call(n)}finally{if(o)throw o.error}}return i},__spread=this&&this.__spread||function(){for(var r=[],t=0;t<arguments.length;t++)r=r.concat(__read(arguments[t]));return r};import{columnMajor}from"../utils/index";import{FieldSubtype,FieldType}from"../../constants/fields";import dataParserStore from"./store";function FlatJSON(r,t){if(!Array.isArray(t))throw new Error("Schema missing or is in an unsupported format");var a,e={},o=0,n=[[]],i=columnMajor(n);return r.forEach(function(r){var n=[];t.forEach(function(t){var i=t.name,l=t.type,u=t.format,d=void 0===u?function(r){return r}:u,f=t.subtype,s=void 0===f?FieldSubtype.CATEGORICAL:f;l===FieldType.MEASURE&&(s=FieldSubtype.CONTINUOUS);var p=dataParserStore.get(s);i in e?a=e[i]:(e[i]=o++,a=o-1);var c=p?p.parse(r[i],d):r[i];n[a]=c}),i.apply(void 0,__spread(n))}),{data:n,schema:t}}export default FlatJSON;