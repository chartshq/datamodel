import{transformDataHelper}from"../data/utils/transform-data";var ctx=self,postResponse=function(a,t){var r;r=t instanceof Error?{error:t.message||String(t),data:null}:{error:null,data:t},ctx.postMessage({reqId:a,data:r})},onTransformData=function(a,t){try{postResponse(a,transformDataHelper(t))}catch(t){postResponse(a,t)}};ctx.addEventListener("message",function(a){var t=a.data,r=t.reqId,s=t.type,e=t.data;switch(s){case"transform-data":onTransformData(r,e)}});