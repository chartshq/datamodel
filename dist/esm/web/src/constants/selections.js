export var ComparisonOperatorsType;!function(e){e.EQUAL="eq",e.NOT_EQUAL="neq",e.GREATER_THAN="gt",e.LESS_THAN="lt",e.GREATER_THAN_EQUAL="gte",e.LESS_THAN_EQUAL="lte",e.IN="in",e.NIN="nin",e.EQUAL_TO="eq",e.NOT_EQUAL_TO="neq"}(ComparisonOperatorsType||(ComparisonOperatorsType={}));export var LogicalOperatorsType;!function(e){e.AND="and",e.OR="or"}(LogicalOperatorsType||(LogicalOperatorsType={}));export var _selectionOperatorResolver=function(e){var r={eq:1,neq:2,gt:3,lt:4,gte:5,lte:6,in:9,nin:10,and:7,or:8}[e];return void 0!==r?r:-1};