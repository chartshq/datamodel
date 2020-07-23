var _a;import{_selectionOperatorResolver}from"../../../constants/selections";import{FieldSubtype}from"../../../constants/fields";import{RESERVED_INVALID_VALUE}from"../../../constants/invalid-data";import dataParserStore from"../../../data/dataParsers/store";import{isValidString}from"../fields/utils";var subtypeParserRegister=((_a={})[FieldSubtype.TEMPORAL]=function(e,r){var t=e;if("number"!=typeof e){var i=dataParserStore.get(FieldSubtype.TEMPORAL);t=i?i.parse(e,r):e}return t},_a[FieldSubtype.CATEGORICAL]=function(e,r){var t=dataParserStore.get(FieldSubtype.CATEGORICAL),i=t?t.parse(e,r):e;return isValidString(i)?i:RESERVED_INVALID_VALUE},_a[FieldSubtype.CONTINUOUS]=function(e,r){var t=dataParserStore.get(FieldSubtype.CONTINUOUS);return null==t?void 0:t.parse(e,r)},_a);export var getRawValue=function(e,r,t){var i=subtypeParserRegister[e];return i?i(r,t):r};export var recursiveSanitizeQuery=function(e,r,t){void 0===t&&(t={});var i=e.conditions,o=e.operator;if(i&&o&&i.length>0){t.conditions=[];for(var a=0;a<i.length;a++){var n=t.conditions[a]={},s=recursiveSanitizeQuery(i[a],r,n);s.operator?n=s:t.conditions.pop()}if(t.operator=_selectionOperatorResolver(o),-1===t.operator)t={};else if(1===t.conditions.length)t=t.conditions[0]?t.conditions[0]:{};else{var d=[];for(var a in t.conditions)t.conditions[a]&&d.push(t.conditions[a]);t.conditions=d,1===t.conditions.length&&(t=t.conditions[0])}}else if(e.field){var l=e.field,u=e.value,p=r.get(l||{});if(p&&null!=p.index){var c=p.index,v=p.field;t.field=c;var f=v.schema(),S=f.subtype,R=void 0===S?FieldSubtype.CATEGORICAL:S,g=f.format,y=getRawValue(R,u,void 0===g?function(e){return e}:g);t.value=y,t.operator=_selectionOperatorResolver(o),-1==t.operator&&(t={})}}return t};