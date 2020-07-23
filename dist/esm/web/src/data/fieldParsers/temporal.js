import DateTimeFormatter from"../utils/date-time-formatter";import{FieldSubtype}from"../../constants/fields";import{DEFAULT}from"../../constants/miscellaneous";var TemporalParser=function(){function t(){this._type=FieldSubtype.TEMPORAL}return Object.defineProperty(t.prototype,"type",{get:function(){return this._type},enumerable:!1,configurable:!0}),t.prototype.parse=function(t,e){var r=DEFAULT;if(this._dtf={},t){var i=t;e&&"string"==typeof e?(i=String(t),r=e,this._dtf&&this._dtf[r]||(this._dtf[r]=new DateTimeFormatter(r))):(i=Number(t),this._dtf&&this._dtf.default||(this._dtf.default=new DateTimeFormatter));var a=this._dtf[r].getNativeDate(i);return a?a.getTime():NaN}return NaN},t}();export{TemporalParser};