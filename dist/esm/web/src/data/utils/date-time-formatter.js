var __read=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,a,o=r.call(e),i=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)i.push(n.value)}catch(e){a={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(a)throw a.error}}return i},__spread=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(__read(arguments[t]));return e};function convertToNativeDate(e){return e instanceof Date?e:new Date(e)}function pad(e){return e<10?"0"+e:e}function DateTimeFormatter(e){this.format=e,this.dtParams=void 0,this.nativeDate=void 0}RegExp.escape=function(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},DateTimeFormatter.TOKEN_PREFIX="%",DateTimeFormatter.DATETIME_PARAM_SEQUENCE={YEAR:0,MONTH:1,DAY:2,HOUR:3,MINUTE:4,SECOND:5,MILLISECOND:6},DateTimeFormatter.defaultNumberParser=function(e){return function(t){var r;return isFinite(r=parseInt(t,10))?r:e}},DateTimeFormatter.defaultRangeParser=function(e,t){return function(r){var n,a;if(!r)return t;var o=r.toLowerCase();for(n=0,a=e.length;n<a;n++)if(e[n].toLowerCase()===o)return n;return void 0===n?t:null}},DateTimeFormatter.getTokenDefinitions=function(){var e={short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},t={short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]};return{H:{name:"H",index:3,extract:function(){return"(\\d+)"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){return convertToNativeDate(e).getHours().toString()}},l:{name:"l",index:3,extract:function(){return"(\\d+)"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){var t=convertToNativeDate(e).getHours()%12;return(0===t?12:t).toString()}},p:{name:"p",index:3,extract:function(){return"(AM|PM)"},parser:function(e){return e?e.toLowerCase():null},formatter:function(e){return convertToNativeDate(e).getHours()<12?"AM":"PM"}},P:{name:"P",index:3,extract:function(){return"(am|pm)"},parser:function(e){return e?e.toLowerCase():null},formatter:function(e){return convertToNativeDate(e).getHours()<12?"am":"pm"}},M:{name:"M",index:4,extract:function(){return"(\\d+)"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){return pad(convertToNativeDate(e).getMinutes())}},S:{name:"S",index:5,extract:function(){return"(\\d+)"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){return pad(convertToNativeDate(e).getSeconds())}},K:{name:"K",index:6,extract:function(){return"(\\d+)"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){return convertToNativeDate(e).getMilliseconds().toString()}},a:{name:"a",index:2,extract:function(){return"("+e.short.join("|")+")"},parser:DateTimeFormatter.defaultRangeParser(e.short),formatter:function(t){var r=convertToNativeDate(t).getDay();return e.short[r].toString()}},A:{name:"A",index:2,extract:function(){return"("+e.long.join("|")+")"},parser:DateTimeFormatter.defaultRangeParser(e.long),formatter:function(t){var r=convertToNativeDate(t).getDay();return e.long[r].toString()}},e:{name:"e",index:2,extract:function(){return"(\\d+) of ("+t.long.join("|")+")"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){return convertToNativeDate(e).getDate().toString()}},d:{name:"d",index:2,extract:function(){return"(\\d+)"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){return pad(convertToNativeDate(e).getDate())}},b:{name:"b",index:1,extract:function(){return"("+t.short.join("|")+")"},parser:DateTimeFormatter.defaultRangeParser(t.short),formatter:function(e){var r=convertToNativeDate(e).getMonth();return t.short[r].toString()}},B:{name:"B",index:1,extract:function(){return"("+t.long.join("|")+")"},parser:DateTimeFormatter.defaultRangeParser(t.long),formatter:function(e){var r=convertToNativeDate(e).getMonth();return t.long[r].toString()}},m:{name:"m",index:1,extract:function(){return"(\\d+)"},parser:function(e){return DateTimeFormatter.defaultNumberParser()(e)-1},formatter:function(e){return pad(convertToNativeDate(e).getMonth()+1)}},y:{name:"y",index:0,extract:function(){return"(\\d{2})"},parser:function(e){var t;if(e){var r=e.length;e=e.substring(r-2,r)}var n=DateTimeFormatter.defaultNumberParser()(e),a=new Date,o=Math.trunc(a.getFullYear()/100);return convertToNativeDate(t=""+o+n).getFullYear()>a.getFullYear()&&(t=""+(o-1)+n),convertToNativeDate(t).getFullYear()},formatter:function(e){var t,r=convertToNativeDate(e).getFullYear().toString();return r&&(t=r.length,r=r.substring(t-2,t)),r}},Y:{name:"Y",index:0,extract:function(){return"(\\d{4})"},parser:DateTimeFormatter.defaultNumberParser(),formatter:function(e){return convertToNativeDate(e).getFullYear().toString()}}}},DateTimeFormatter.getTokenFormalNames=function(){var e=DateTimeFormatter.getTokenDefinitions();return{HOUR:e.H,HOUR_12:e.l,AMPM_UPPERCASE:e.p,AMPM_LOWERCASE:e.P,MINUTE:e.M,SECOND:e.S,SHORT_DAY:e.a,LONG_DAY:e.A,DAY_OF_MONTH:e.e,DAY_OF_MONTH_CONSTANT_WIDTH:e.d,SHORT_MONTH:e.b,LONG_MONTH:e.B,MONTH_OF_YEAR:e.m,SHORT_YEAR:e.y,LONG_YEAR:e.Y}},DateTimeFormatter.tokenResolver=function(){var e=DateTimeFormatter.getTokenDefinitions(),t=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r,n,a=0,o=e.length;a<o;a++)r=e[a],e[a]&&(n=r);return n?n[0].parser(n[1]):null};return{YEAR:[e.y,e.Y,t],MONTH:[e.b,e.B,e.m,t],DAY:[e.a,e.A,e.d,t],HOUR:[e.H,e.l,e.p,e.P,function(e,t,r,n){var a,o,i,u;return t&&(o=r||n)?("pm"===o[0].parser(o[1])&&(i=!0),a=t):a=t||e,a?(u=a[0].parser(a[1]),i&&(u+=12),u):null}],MINUTE:[e.M,t],SECOND:[e.S,t],MILLISECOND:[e.K,t]}},DateTimeFormatter.findTokens=function(e){for(var t,r,n=DateTimeFormatter.TOKEN_PREFIX,a=DateTimeFormatter.getTokenDefinitions(),o=Object.keys(a),i=[];(t=e.indexOf(n,t+1))>=0;)r=e[t+1],-1!==o.indexOf(r)&&i.push({index:t,token:r});return i},DateTimeFormatter.formatAs=function(e,t){var r,n,a,o,i=convertToNativeDate(e),u=DateTimeFormatter.findTokens(t),m=DateTimeFormatter.getTokenDefinitions(),f=String(t),s=DateTimeFormatter.TOKEN_PREFIX;for(a=0,o=u.length;a<o;a++)n=m[r=u[a].token].formatter(i),f=f.replace(new RegExp(s+r,"g"),n);return f},DateTimeFormatter.prototype.parse=function(e,t){var r,n,a,o,i,u,m,f,s=DateTimeFormatter.tokenResolver(),c=this.extractTokenValue(e),l=DateTimeFormatter.DATETIME_PARAM_SEQUENCE,T=t&&t.noBreak,D=[],d=[],g=[];for(r in s)if({}.hasOwnProperty.call(s,r)){for(d.length=0,a=(n=s[r]).splice(n.length-1,1)[0],i=0,f=n.length;i<f;i++)void 0===(o=c[(u=n[i]).name])?d.push(null):d.push([u,o]);if(null==(m=a.apply(this,d))&&!T)break;D[l[r]]=m}return D.length&&this.checkIfOnlyYear(D.length)?g.unshift(D[0],0,1):g.unshift.apply(g,__spread(D)),g},DateTimeFormatter.prototype.extractTokenValue=function(e){var t,r,n,a,o,i,u,m=this.format,f=DateTimeFormatter.getTokenDefinitions(),s=DateTimeFormatter.TOKEN_PREFIX,c=DateTimeFormatter.findTokens(m),l={};o=String(m);var T=c.map(function(e){return e.token}),D=c.length;for(u=D-1;u>=0;u--)(n=c[u].index)+1!==o.length-1?(void 0===t&&(t=o.length),a=o.substring(n+2,t),o=o.substring(0,n+2)+RegExp.escape(a)+o.substring(t,o.length),t=n):t=n;for(u=0;u<D;u++)r=c[u],o=o.replace(s+r.token,f[r.token].extract());var d=(null==e?void 0:e.match(new RegExp(o)))||[];for(d.shift(),u=0,i=T.length;u<i;u++)l[T[u]]=d[u];return l},DateTimeFormatter.prototype.getNativeDate=function(e){var t=null,r=!this.format||"string"!=typeof this.format;if(Number.isFinite(e)&&r)t=new Date(e);else if(r)t=new Date(e);else{var n=this.dtParams=this.parse(e);n.length&&(this.nativeDate=new(Date.bind.apply(Date,__spread([void 0],n))),t=this.nativeDate)}return t},DateTimeFormatter.prototype.checkIfOnlyYear=function(e){return 1===e&&this.format.match(/y|Y/g).length};export{DateTimeFormatter as default};