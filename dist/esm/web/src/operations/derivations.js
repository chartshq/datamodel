import DataModel from"../main";import{ComparisonOperatorsType,LogicalOperatorsType}from"../constants/selections";var createQuery=function(e,r){return{operator:ComparisonOperatorsType.EQUAL,value:e===DataModel.defaultInvalidValue()?void 0:e,field:r}};export var createSelectQuery=function(e,r){var o={},a=r.length;if(1===a){var t=e.getField(r[0]);o=t?createQuery(t.domain()[0],r[0]):{}}else a>1&&(o.conditions=[],r.forEach(function(r,a){var t=e.getField(r);t&&(o.operator=LogicalOperatorsType.AND,o.conditions[a]=createQuery(t.domain()[0],r))}));return o};