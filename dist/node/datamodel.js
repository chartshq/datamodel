!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.DataModel=n():e.DataModel=n()}(global,(function(){return function(e){var n={},t={0:0},r={};var o={5:function(){return{"./datamodel_wasm.js":{__wbindgen_json_serialize:function(e,t){return n[4].exports.c(e,t)},__wbindgen_object_drop_ref:function(e){return n[4].exports.d(e)},__wbindgen_throw:function(e,t){return n[4].exports.e(e,t)}}}}};function u(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,u),r.l=!0,r.exports}return u.e=function(n){var i=[];if(0!==t[n]){var a=require("./"+n+".datamodel.js"),f=a.modules,c=a.ids;for(var l in f)e[l]=f[l];for(var s=0;s<c.length;s++)t[c[s]]=0}return({2:[5]}[n]||[]).forEach((function(e){var n=r[e];if(n)i.push(n);else{var t,a=o[e](),f=new Promise((function(n,t){var{readFile:r}=require("fs"),{join:o}=require("path");try{r(o(__dirname,{5:"7b529fce78f4419ae92f"}[e]+".module.wasm"),(function(e,r){if(e)return t(e);n({arrayBuffer:()=>Promise.resolve(r)})}))}catch(e){t(e)}}));if(a instanceof Promise){var c=f.then((function(e){return e.arrayBuffer()}));t=Promise.all([c.then((function(e){return WebAssembly.compile(e)})),a]).then((function(e){return WebAssembly.instantiate(e[0],e[1])}))}else{t=(c=f.then((function(e){return e.arrayBuffer()}))).then((function(e){return WebAssembly.instantiate(e,a)}))}i.push(r[e]=t.then((function(n){return u.w[e]=(n.instance||n).exports})))}})),Promise.all(i)},u.m=e,u.c=n,u.d=function(e,n,t){u.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},u.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,n){if(1&n&&(e=u(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(u.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)u.d(t,r,function(n){return e[n]}.bind(null,r));return t},u.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return u.d(n,"a",n),n},u.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},u.p="",u.oe=function(e){process.nextTick((function(){throw e}))},u.w={},u(u.s=0)}([function(e,n,t){"use strict";t.r(n);var r=function(e,n,t,r){return new(t||(t=Promise))((function(o,u){function i(e){try{f(r.next(e))}catch(e){u(e)}}function a(e){try{f(r.throw(e))}catch(e){u(e)}}function f(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,a)}f((r=r.apply(e,n||[])).next())}))},o=function(e,n){var t,r,o,u,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return u={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function a(u){return function(a){return function(u){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&u[0]?r.return:u[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,u[1])).done)return o;switch(r=0,o&&(u=[2&u[0],o.value]),u[0]){case 0:case 1:o=u;break;case 4:return i.label++,{value:u[1],done:!1};case 5:i.label++,r=u[1],u=[0];continue;case 7:u=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==u[0]&&2!==u[0])){i=0;continue}if(3===u[0]&&(!o||u[1]>o[0]&&u[1]<o[3])){i.label=u[1];break}if(6===u[0]&&i.label<o[1]){i.label=o[1],o=u;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(u);break}o[2]&&i.ops.pop(),i.trys.pop();continue}u=n.call(e,i)}catch(e){u=[6,e],r=0}finally{t=o=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,a])}}},u={onReady:function(){return r(void 0,void 0,void 0,(function(){return o(this,(function(e){switch(e.label){case 0:return"undefined"!=typeof window&&""===t.p&&(t.p=function(){var e,n,t=/(^|[\/\\])(datamodel\.js)([\?#].*)?$/gi,r=window.document.getElementsByTagName("script"),o=r.length;for(n=0;n<o;n+=1)if(null!=(e=r[n].getAttribute("src"))&&null!==e.match(t))return e.replace(t,"$1");return""}()),[4,Promise.all([t.e(1),t.e(2)]).then(t.bind(null,3))];case 1:return[2,e.sent().default]}}))}))}};n.default=u},function(e,n){e.exports=require("util")},function(e,n){e.exports=require("crypto")}]).default}));