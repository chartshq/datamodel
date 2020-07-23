import{Operations}from"../../constants/miscellaneous";import{FieldType}from"../../constants/fields";var handlePropagation=function(e,r,t,a){var n=a._propagationInfo.listeners;return t&&n.forEach(function(t){t(e,r)}),!t||!n.length};export var updateRefCount=function(e,r){for(;e;)e._refCount=Math.max(e._refCount+(r?1:-1),0),e=null==e?void 0:e.getParent()};export var disposeZeroRefDms=function(e){for(;e;){var r=null==e?void 0:e.getParent();!e._refCount&&e.disposeResources(),e=r}};export var getRootModel=function(e){for(;e;){var r=null==e?void 0:e.getParent();if(!r)break;e=r}return e};export var getQueryDataModels=function(e,r){var t=new Map;return e.forEach(function(e){for(var a=e.dm,n=void 0===a?r:a,o=e.criteria,i=e.fields,d=n,s=i.slice(),f=i.some(function(e){var r;return(null===(r=n.getField(e))||void 0===r?void 0:r.type())===FieldType.MEASURE}),l=function(){var e=null==d?void 0:d.getParent(),r=d.getDerivations();if(r.length){var a=r[0].operation===Operations.GROUPBY&&f,n=s.filter(function(r){return e.getField(r)});if(a)return t.set(null==d?void 0:d.id(),o),"break";n.length<s.length&&(s=n,t.set(null==d?void 0:d.id(),o))}d=e};d;){if("break"===l())break}}),t};var applyDerivation=function(e,r){var t,a=r.getDerivations()[0],n=a.operation,o=a.params,i=void 0===o?[]:o;switch(n){case Operations.SELECT:t=e.select(i.query);break;case Operations.GROUPBY:var d=(t=e.groupBy(i.fields,i.reducers,{createId:!1}))._context.getMatchingIds(r._context);t._context.addIdField(d);break;case Operations.PROJECT:t=e.project(i.fields);break;case Operations.SORT:t=e.sort(i);break;case Operations.CALCULATE:t=e.calculateVariable(i.fieldInfo,i.fields,i.fn)}return t};export var propagateIdentifiers=function(e,r,t,a){var n=r.info,o=r.query,i=r.targetMap,d=r.nonPropagationDms,s=n.targetDms,f=void 0===s?new Set:s,l=n.payload,p=n.exclude,u=void 0===p||p;if(!1!==i.get(e.id())){var v=a;if(o){var c=e.id();!t.get(c)&&v||(v=e.select(o),e.removeChild(v),v.detachParent())}var g=f.has(e.id());handlePropagation(v,l,u?!g:g,e)&&d.push(v),e.getChildren().filter(function(e){return!1!==i.get(e.id())}).forEach(function(e){var a;v&&(a=applyDerivation(v,e)),propagateIdentifiers(e,r,t,a)})}};export var getPropagationTargetMap=function(e,r,t,a){void 0===r&&(r=new Set),void 0===t&&(t=!0),void 0===a&&(a=new Map);var n=e.getChildren(),o=!1;n.forEach(function(e){var n=getPropagationTargetMap(e,r,t,a);o=o||n});var i=r.has(e.id());return o=o||(t?!i:i),a.set(e.id(),o),o};