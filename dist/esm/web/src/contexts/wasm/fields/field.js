var AbstractWasmField=function(){function t(t){this._schema=t}return t.prototype.name=function(){return this._schema.name},t.prototype.type=function(){return this._schema.type},t.prototype.schema=function(){return this._schema},t.prototype.displayName=function(){return this._schema.displayName||this._schema.name},t.prototype.subtype=function(){return this._schema.subtype},t}();export{AbstractWasmField};