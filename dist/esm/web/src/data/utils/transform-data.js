var __awaiter=this&&this.__awaiter||function(t,r,e,n){return new(e||(e=Promise))(function(a,o){function i(t){try{u(n.next(t))}catch(t){o(t)}}function c(t){try{u(n.throw(t))}catch(t){o(t)}}function u(t){var r;t.done?a(t.value):(r=t.value,r instanceof e?r:new e(function(t){t(r)})).then(i,c)}u((n=n.apply(t,r||[])).next())})},__generator=this&&this.__generator||function(t,r){var e,n,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function c(o){return function(c){return function(o){if(e)throw new TypeError("Generator is already executing.");for(;i;)try{if(e=1,n&&(a=2&o[0]?n.return:o[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,o[1])).done)return a;switch(n=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,n=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(a=(a=i.trys).length>0&&a[a.length-1])&&(6===o[0]||2===o[0])){i=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){i.label=o[1];break}if(6===o[0]&&i.label<a[1]){i.label=a[1],a=o;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(o);break}a[2]&&i.ops.pop(),i.trys.pop();continue}o=r.call(t,i)}catch(t){o=[6,t],n=0}finally{e=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,c])}}};import{transformDataOnWorker}from"../../worker/index";import{convertorStore}from"../defaultConverters";import{DataFormat}from"../../contracts/data";export var transformDataHelper=function(t){var r=t.data,e=t.schema,n=t.options,a=convertorStore.get(n.dataFormat);return a?a.convert(r,e,n):{data:[],schema:e}};var getTransformedData=function(t,r){var e=t.options;return r&&!1!==e.useWorker?transformDataOnWorker(t,r):new Promise(function(r,e){setTimeout(function(){try{r(transformDataHelper(t))}catch(t){e(t)}},0)})};export default function(t,r,e,n){return __awaiter(void 0,void 0,void 0,function(){var a;return __generator(this,function(o){switch(o.label){case 0:return a={dataFormat:DataFormat.AUTO},e=Object.assign(Object.assign({},a),e),[4,getTransformedData({data:t,schema:r,options:e},n)];case 1:return[2,o.sent()]}})})}