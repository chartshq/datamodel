var __extends=this&&this.__extends||function(){var t=function(e,a){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])})(e,a)};return function(e,a){function i(){this.constructor=e}t(e,a),e.prototype=null===a?Object.create(a):(i.prototype=a.prototype,new i)}}();import{AbstractWasmField}from"./field";import{sanitizeNumbers,saveIndecesToMemory,saveNumbersToMemory,getIndecesFromMemory,getWasmSchema}from"./utils";import Invalid from"../../../data/invalid/invalid";var Continuous=function(t){function e(e,a){var i=t.call(this,e)||this;return i._cachedData=[],i._cachedDomain=[],i._wasmField=a,i._cachedFormattedData=[],i}return __extends(e,t),e.prototype.domain=function(){if(this._wasmField){var t=this._wasmField.get_domain();t.length&&(this._cachedDomain=[t[0],t[1]])}return this._cachedDomain},e.prototype.data=function(){var t=this;if(0===this._cachedData.length&&this._wasmField){var e=getIndecesFromMemory(this._wasmField.get_data_info(),this._wasmField.get_rows_count()).map(function(e){var a=t._wasmField.get_value_at_index(e);return Number.isFinite(a)?a:new Invalid(NaN)});this._cachedData=e}return this._cachedData},e.prototype.formattedData=function(t){if(0===this._cachedFormattedData.length||t){var e=this.data(),a=t||this._schema.format,i=[];this._cachedFormattedData=e,a instanceof Function&&(e.forEach(function(t){var e;e=t instanceof Invalid?t:a(t),i.push(e)}),this._cachedFormattedData=i)}return this._cachedFormattedData},e.prototype.getRowsCount=function(){return this._wasmField?this._wasmField.get_rows_count():0},e.prototype.dispose=function(){this._cachedDomain=[],this._cachedData=[],this._cachedFormattedData=[],this._wasmField&&this._wasmField.free()},e}(AbstractWasmField);export default Continuous;export var continuousFieldCreator=function(t,e,a){var i=sanitizeNumbers(t),o=i.indices,n=i.values,r=void 0,s=Number.MAX_VALUE;return a&&(s=a.add_field(getWasmSchema(e),[]),r=a.get_continuous_field(s),saveIndecesToMemory(r.get_data_indices(),o),saveNumbersToMemory(r.get_data_ptr(),n)),{field:new Continuous(e,r),index:s}};