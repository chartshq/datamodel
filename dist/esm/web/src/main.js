var __extends=this&&this.__extends||function(){var t=function(e,o){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(e,o)};return function(e,o){function n(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(n.prototype=o.prototype,new n)}}(),__read=this&&this.__read||function(t,e){var o="function"==typeof Symbol&&t[Symbol.iterator];if(!o)return t;var n,r,i=o.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(t){r={error:t}}finally{try{n&&!n.done&&(o=i.return)&&o.call(i)}finally{if(r)throw r.error}}return a},__spread=this&&this.__spread||function(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(__read(arguments[e]));return t};import AbstractDataModel from"./contracts/datamodel";import{ContextType}from"./constants/context";import WasmContext from"./contexts/wasm";import{AggregationType}from"./constants/aggregations";import{Operations}from"./constants/miscellaneous";import{FilteringModesType}from"./constants/filtering-modes";import{_defaultSubtype}from"./constants/fields";import{DEFAULT_INVALID_VALUE}from"./constants/invalid-data";import{disposeStrategies}from"./operations/dispose";import{propagateIdentifiers,getRootModel,getQueryDataModels,getPropagationTargetMap,disposeZeroRefDms,updateRefCount}from"./operations/propagation";import{createSelectQuery}from"./operations/derivations";import InvalidStore from"./data/invalid/store";var defaults=function(){var t=AggregationType.SUM,e=new InvalidStore,o=DEFAULT_INVALID_VALUE;return{setDefaultAggregation:function(e){t=e},getDefaultAggregation:function(){return t},setInvalids:function(t){e.setInvalids(t)},unsetInvalids:function(t){e.unsetInvalids(t)},getInvalidStore:function(){return e},setDefaultInvalidValue:function(t){o=t},getDefaultInvalidValue:function(){return o}}},id=function(){var t=0;return function(){return t++}}(),DataModel=function(t){function e(o){var n=t.call(this)||this;if(n._children=[],n._derivations=[],o instanceof e)n._context=o._context,n._derivations=__spread(o._derivations),n._commonDerivation=null;else{var r=o.data,i=o.schema,a=n.sanitizeSchema(i);switch(e._contextType){case ContextType.WASM:n._context=n.setWasmContext({data:r,schema:a},{rows:r[0].length,columns:a.length});break;default:n._context=n.setWasmContext({data:r,schema:a},{rows:r[0].length,columns:a.length})}n._commonDerivation=null}return n._id=id(),n._propagationInfo={listeners:[],propagationCriterias:new Map},n._refCount=1,n}return __extends(e,t),e.setContext=function(t){void 0===t&&(t=ContextType.WASM),e._contextType=t},e.prototype.setWasmContext=function(t,e){return new WasmContext(t,e)},e.prototype.setContextInfo=function(t){this._context=t},e.prototype.sanitizeSchema=function(t){var o=e.defaultAggregation();return t.map(function(t){var e=t.format,n=void 0===e?function(t){return t}:e;return{name:t.name,type:t.type,subtype:t.subtype||_defaultSubtype(t.type),defAggFn:t.defAggFn||o,format:n,displayName:t.displayName||t.name}})},e.prototype.cloneFromContext=function(t){var e=this;if(Array.isArray(t)){var o=[];return t.forEach(function(t){var n=e.clone();n.setContextInfo(t),n._derivations=[],o.push(n)}),o}var n=this.clone();return n._derivations=[],n.setContextInfo(t),n},e.setInvalids=function(t){t&&e.defaults.setInvalids(t)},e.unsetInvalids=function(t){t&&e.defaults.unsetInvalids(t)},e.defaultInvalidValue=function(t){return t&&e.defaults.setDefaultInvalidValue(t),e.defaults.getDefaultInvalidValue()},e.defaultAggregation=function(t){return t&&e.defaults.setDefaultAggregation(t),e.defaults.getDefaultAggregation()},Object.defineProperty(e,"defaults",{get:function(){return e._defaults||(e._defaults=defaults()),e._defaults},enumerable:!1,configurable:!0}),e.prototype.id=function(){return this._id},e.prototype.getField=function(t){return this._context.getField(t)},e.prototype.getParent=function(){return this._parent},e.prototype.getChildren=function(){return __spread(this._children)},e.prototype.getDerivations=function(){return __spread(this._derivations)},e.prototype.removeChild=function(t){var e=this._children.findIndex(function(e){return e===t});e>-1&&this._children.splice(e,1)},e.prototype.detachParent=function(){return this._parent=void 0,this},e.prototype.getData=function(){return this._context.getData()},e.prototype.getDataMeta=function(){return this._context.getDataMeta()},e.prototype.getSchema=function(){return this._context.getSchema()},e.prototype.clone=function(t){void 0===t&&(t=!0);var o=new e(this);return t&&(updateRefCount(this,!0),this._children.push(o),o._parent=this),o},e.prototype.sort=function(t){var e=this._context.sort(t),o=this.cloneFromContext(e);return o._derivations.push({operation:Operations.SORT,params:t}),o},e.prototype.select=function(t,e){var o=(e||{}).mode,n=void 0===o?FilteringModesType.NORMAL:o,r=this._context.select(t,{mode:n}),i=this.cloneFromContext(r);return i instanceof Array?(i[0]._derivations.push({operation:Operations.SELECT,params:{query:t,options:{mode:FilteringModesType.NORMAL}}}),i[1]._derivations.push({operation:Operations.SELECT,params:{query:t,options:{mode:FilteringModesType.INVERSE}}})):i._derivations.push({operation:Operations.SELECT,params:{query:t,options:{mode:n}}}),i},e.prototype.splitByRow=function(t){var e=this._context.splitByRow(t),o=this.cloneFromContext(e);return o.map(function(e){var o=createSelectQuery(e,t);return e._commonDerivation={operation:Operations.SPLIT,params:{fields:t}},e._derivations.push({operation:Operations.SELECT,params:{query:o,options:{mode:FilteringModesType.NORMAL}}})}),o},e.prototype.project=function(t,e){var o=(e||{}).mode,n=void 0===o?FilteringModesType.NORMAL:o,r=this._context.project(t,{mode:n}),i=this.cloneFromContext(r);return i instanceof Array?(i[0]._derivations.push({operation:Operations.PROJECT,params:{fields:t,options:{mode:FilteringModesType.NORMAL}}}),i[1]._derivations.push({operation:Operations.PROJECT,params:{fields:t,options:{mode:FilteringModesType.INVERSE}}})):i._derivations.push({operation:Operations.PROJECT,params:{fields:t,options:e}}),i},e.prototype.groupBy=function(t,e,o){void 0===e&&(e=[]),void 0===o&&(o={});var n=this._context.groupBy(t,e,o),r=this.cloneFromContext(n);return r._derivations.push({operation:Operations.GROUPBY,params:{fields:t,reducers:e}}),r},e.prototype.disposeRecursive=function(t){(void 0===t&&(t=!0),this._refCount=Math.max(this._refCount-1,0),0===this._refCount||t)&&(this.disposeResources(),this.getChildren().forEach(function(e){e.disposeRecursive(t)}))},e.prototype.getPropagationCriterias=function(){return this._propagationInfo.propagationCriterias},e.prototype.dispose=function(t){if(void 0===t&&(t=!0),!this._disposed){var e=this.getParent();this.disposeRecursive(t),updateRefCount(e,!1),disposeZeroRefDms(e)}return this},e.prototype.disposeResources=function(){var t;if(this._disposed)return this;var e=this._derivations[this._derivations.length-1];if(e){var o=e.operation;this._context.dispose(disposeStrategies[o](e.params))}else this._context.dispose({disposeFields:!0,disposePartialFields:{dispose:!1,values:[]}});return null===(t=this._parent)||void 0===t||t.removeChild(this),this.detachParent(),this._disposed=!0,this},e.prototype.propagate=function(t,e){var o=getRootModel(this),n=t.map(function(t){return t.criteria}).filter(function(t){return null!==t}),r=n.length?{operator:e.queryOperator||"and",conditions:n}:null,i=getQueryDataModels(t,this),a=new Map;getPropagationTargetMap(o,e.targetDms,e.exclude,a);var s=[];return propagateIdentifiers(o,{query:r,info:e,targetMap:a,nonPropagationDms:s},i),s.forEach(function(t){t&&t.dispose(!1)}),this},e.prototype.onPropagation=function(t){return this._propagationInfo.listeners.push(t),this},e.prototype.unsubscribePropagationListeners=function(){return this._propagationInfo.listeners=[],this},e.prototype.calculateVariable=function(t,e,o){var n=this._context.calculateVariable(this.sanitizeSchema([t])[0],e,o),r=this.cloneFromContext(n);return r._derivations.push({operation:Operations.CALCULATE,params:{fieldInfo:t,fields:e,fn:o}}),r},e.prototype.context=function(){return this._context},e._contextType=ContextType.WASM,e}(AbstractDataModel);export default DataModel;