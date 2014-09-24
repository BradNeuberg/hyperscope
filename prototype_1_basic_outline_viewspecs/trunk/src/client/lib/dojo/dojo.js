/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above *//* This is a compiled version of Dojo, designed for deployment and not for development. If would like to modify or work with Dojo, please visit http://dojotoolkit.org for more information and to get the 'source' version of this file. */var dj_global=this;
function dj_undef(_1,_2){
if(!_2){
_2=dj_global;
}
return (typeof _2[_1]=="undefined");
}
if(dj_undef("djConfig")){
var djConfig={};
}
var dojo;
if(dj_undef("dojo")){
dojo={};
}
dojo.version={major:0,minor:1,patch:0,flag:"+",revision:Number("$Rev: 2212 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo.evalObjPath=function(_3,_4){
if(typeof _3!="string"){
return dj_global;
}
if(_3.indexOf(".")==-1){
if(dj_undef(_3,dj_global)){
dj_global[_3]={};
}
return dj_global[_3];
}
var _5=_3.split(/\./);
var _6=dj_global;
for(var i=0;i<_5.length;++i){
if(!_4){
_6=_6[_5[i]];
if((typeof _6=="undefined")||(!_6)){
return _6;
}
}else{
if(dj_undef(_5[i],_6)){
_6[_5[i]]={};
}
_6=_6[_5[i]];
}
}
return _6;
};
dojo.errorToString=function(_8){
return ((!dj_undef("message",_8))?_8.message:(dj_undef("description",_8)?_8:_8.description));
};
dojo.raise=function(_9,_a){
if(_a){
_9=_9+": "+dojo.errorToString(_a);
}
var he=dojo.hostenv;
if((!dj_undef("hostenv",dojo))&&(!dj_undef("println",dojo.hostenv))){
dojo.hostenv.println("FATAL: "+_9);
}
throw Error(_9);
};
dj_throw=dj_rethrow=function(m,e){
dojo.deprecated("dj_throw and dj_rethrow deprecated, use dojo.raise instead");
dojo.raise(m,e);
};
dojo.debug=function(){
if(!djConfig.isDebug){
return;
}
var _e=arguments;
if(dj_undef("println",dojo.hostenv)){
dojo.raise("dojo.debug not available (yet?)");
}
var _f=dj_global["jum"]&&!dj_global["jum"].isBrowser;
var s=[(_f?"":"DEBUG: ")];
for(var i=0;i<_e.length;++i){
if(!false&&_e[i] instanceof Error){
var msg="["+_e[i].name+": "+dojo.errorToString(_e[i])+(_e[i].fileName?", file: "+_e[i].fileName:"")+(_e[i].lineNumber?", line: "+_e[i].lineNumber:"")+"]";
}else{
var msg=_e[i];
}
s.push(msg);
}
if(_f){
jum.debug(s.join(" "));
}else{
dojo.hostenv.println(s.join(" "));
}
};
dojo.debugShallow=function(obj){
if(!djConfig.isDebug){
return;
}
dojo.debug("------------------------------------------------------------");
dojo.debug("Object: "+obj);
for(i in obj){
dojo.debug(i+": "+obj[i]);
}
dojo.debug("------------------------------------------------------------");
};
var dj_debug=dojo.debug;
function dj_eval(s){
return dj_global.eval?dj_global.eval(s):eval(s);
}
dj_unimplemented=dojo.unimplemented=function(_15,_16){
var _17="'"+_15+"' not implemented";
if((!dj_undef(_16))&&(_16)){
_17+=" "+_16;
}
dojo.raise(_17);
};
dj_deprecated=dojo.deprecated=function(_18,_19,_1a){
var _1b="DEPRECATED: "+_18;
if((!dj_undef(_19))&&(_19)){
_1b+=" "+_19;
}
if(!dj_undef(_1a)){
_1b+=" -- will be removed in version"+_1a;
}
dojo.debug(_1b);
};
dojo.inherits=function(_1c,_1d){
if(typeof _1d!="function"){
dojo.raise("superclass: "+_1d+" borken");
}
_1c.prototype=new _1d();
_1c.prototype.constructor=_1c;
_1c.superclass=_1d.prototype;
_1c["super"]=_1d.prototype;
};
dj_inherits=function(_1e,_1f){
dojo.deprecated("dj_inherits deprecated, use dojo.inherits instead");
dojo.inherits(_1e,_1f);
};
dojo.render=(function(){
function vscaffold(_20,_21){
var tmp={capable:false,support:{builtin:false,plugin:false},prefixes:_20};
for(var x in _21){
tmp[x]=false;
}
return tmp;
}
return {name:"",ver:dojo.version,os:{win:false,linux:false,osx:false},html:vscaffold(["html"],["ie","opera","khtml","safari","moz"]),svg:vscaffold(["svg"],["corel","adobe","batik"]),vml:vscaffold(["vml"],["ie"]),swf:vscaffold(["Swf","Flash","Mm"],["mm"]),swt:vscaffold(["Swt"],["ibm"])};
})();
dojo.hostenv=(function(){
var _24={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",iePreventClobber:false,ieClobberMinimal:true,preventBackButtonFix:true,searchIds:[],parseWidgets:true};
if(typeof djConfig=="undefined"){
djConfig=_24;
}else{
for(var _25 in _24){
if(typeof djConfig[_25]=="undefined"){
djConfig[_25]=_24[_25];
}
}
}
var djc=djConfig;
function _def(obj,_28,def){
return (dj_undef(_28,obj)?def:obj[_28]);
}
return {name_:"(unset)",version_:"(unset)",pkgFileName:"__package__",loading_modules_:{},loaded_modules_:{},addedToLoadingCount:[],removedFromLoadingCount:[],inFlightCount:0,modulePrefixes_:{dojo:{name:"dojo",value:"src"}},setModulePrefix:function(_2a,_2b){
this.modulePrefixes_[_2a]={name:_2a,value:_2b};
},getModulePrefix:function(_2c){
var mp=this.modulePrefixes_;
if((mp[_2c])&&(mp[_2c]["name"])){
return mp[_2c].value;
}
return _2c;
},getTextStack:[],loadUriStack:[],loadedUris:[],post_load_:false,modulesLoadedListeners:[],getName:function(){
return this.name_;
},getVersion:function(){
return this.version_;
},getText:function(uri){
dojo.unimplemented("getText","uri="+uri);
},getLibraryScriptUri:function(){
dojo.unimplemented("getLibraryScriptUri","");
}};
})();
dojo.hostenv.getBaseScriptUri=function(){
if(djConfig.baseScriptUri.length){
return djConfig.baseScriptUri;
}
var uri=new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
if(!uri){
dojo.raise("Nothing returned by getLibraryScriptUri(): "+uri);
}
var _30=uri.lastIndexOf("/");
djConfig.baseScriptUri=djConfig.baseRelativePath;
return djConfig.baseScriptUri;
};
dojo.hostenv.setBaseScriptUri=function(uri){
djConfig.baseScriptUri=uri;
};
dojo.hostenv.loadPath=function(_32,_33,cb){
if((_32.charAt(0)=="/")||(_32.match(/^\w+:/))){
dojo.raise("relpath '"+_32+"'; must be relative");
}
var uri=this.getBaseScriptUri()+_32;
try{
return ((!_33)?this.loadUri(uri,cb):this.loadUriAndCheck(uri,_33,cb));
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb){
if(dojo.hostenv.loadedUris[uri]){
return;
}
var _38=this.getText(uri,null,true);
if(_38==null){
return 0;
}
var _39=dj_eval(_38);
return 1;
};
dojo.hostenv.getDepsForEval=function(_3a){
if(!_3a){
_3a="";
}
var _3b=[];
var tmp;
var _3d=[/dojo.hostenv.loadModule\(.*?\)/mg,/dojo.hostenv.require\(.*?\)/mg,/dojo.require\(.*?\)/mg,/dojo.requireIf\([\w\w]*?\)/mg,/dojo.hostenv.conditionalLoadModule\([\w\W]*?\)/mg];
for(var i=0;i<_3d.length;i++){
tmp=_3a.match(_3d[i]);
if(tmp){
for(var x=0;x<tmp.length;x++){
_3b.push(tmp[x]);
}
}
}
return _3b;
};
dojo.hostenv.loadUriAndCheck=function(uri,_41,cb){
var ok=true;
try{
ok=this.loadUri(uri,cb);
}
catch(e){
dojo.debug("failed loading ",uri," with error: ",e);
}
return ((ok)&&(this.findModule(_41,false)))?true:false;
};
dojo.loaded=function(){
};
dojo.hostenv.loaded=function(){
this.post_load_=true;
var mll=this.modulesLoadedListeners;
for(var x=0;x<mll.length;x++){
mll[x]();
}
dojo.loaded();
};
dojo.addOnLoad=function(obj,_47){
if(arguments.length==1){
dojo.hostenv.modulesLoadedListeners.push(obj);
}else{
if(arguments.length>1){
dojo.hostenv.modulesLoadedListeners.push(function(){
obj[_47]();
});
}
}
};
dojo.hostenv.modulesLoaded=function(){
if(this.post_load_){
return;
}
if((this.loadUriStack.length==0)&&(this.getTextStack.length==0)){
if(this.inFlightCount>0){
dojo.debug("files still in flight!");
return;
}
if(typeof setTimeout=="object"){
setTimeout("dojo.hostenv.loaded();",0);
}else{
dojo.hostenv.loaded();
}
}
};
dojo.hostenv.moduleLoaded=function(_48){
var _49=dojo.evalObjPath((_48.split(".").slice(0,-1)).join("."));
this.loaded_modules_[(new String(_48)).toLowerCase()]=_49;
};
dojo.hostenv.loadModule=function(_4a,_4b,_4c){
var _4d=this.findModule(_4a,false);
if(_4d){
return _4d;
}
if(dj_undef(_4a,this.loading_modules_)){
this.addedToLoadingCount.push(_4a);
}
this.loading_modules_[_4a]=1;
var _4e=_4a.replace(/\./g,"/")+".js";
var _4f=_4a.split(".");
var _50=_4a.split(".");
for(var i=_4f.length-1;i>0;i--){
var _52=_4f.slice(0,i).join(".");
var _53=this.getModulePrefix(_52);
if(_53!=_52){
_4f.splice(0,i,_53);
break;
}
}
var _54=_4f[_4f.length-1];
if(_54=="*"){
_4a=(_50.slice(0,-1)).join(".");
while(_4f.length){
_4f.pop();
_4f.push(this.pkgFileName);
_4e=_4f.join("/")+".js";
if(_4e.charAt(0)=="/"){
_4e=_4e.slice(1);
}
ok=this.loadPath(_4e,((!_4c)?_4a:null));
if(ok){
break;
}
_4f.pop();
}
}else{
_4e=_4f.join("/")+".js";
_4a=_50.join(".");
var ok=this.loadPath(_4e,((!_4c)?_4a:null));
if((!ok)&&(!_4b)){
_4f.pop();
while(_4f.length){
_4e=_4f.join("/")+".js";
ok=this.loadPath(_4e,((!_4c)?_4a:null));
if(ok){
break;
}
_4f.pop();
_4e=_4f.join("/")+"/"+this.pkgFileName+".js";
if(_4e.charAt(0)=="/"){
_4e=_4e.slice(1);
}
ok=this.loadPath(_4e,((!_4c)?_4a:null));
if(ok){
break;
}
}
}
if((!ok)&&(!_4c)){
dojo.raise("Could not load '"+_4a+"'; last tried '"+_4e+"'");
}
}
if(!_4c){
_4d=this.findModule(_4a,false);
if(!_4d){
dojo.raise("symbol '"+_4a+"' is not defined after loading '"+_4e+"'");
}
}
return _4d;
};
dojo.hostenv.startPackage=function(_56){
var _57=_56.split(/\./);
if(_57[_57.length-1]=="*"){
_57.pop();
}
return dojo.evalObjPath(_57.join("."),true);
};
dojo.hostenv.findModule=function(_58,_59){
if(this.loaded_modules_[(new String(_58)).toLowerCase()]){
return this.loaded_modules_[_58];
}
var _5a=dojo.evalObjPath(_58);
if((typeof _5a!=="undefined")&&(_5a)){
return _5a;
}
if(_59){
dojo.raise("no loaded module named '"+_58+"'");
}
return null;
};
if(typeof window=="undefined"){
dojo.raise("no window object");
}
(function(){
if(djConfig.allowQueryConfig){
var _5b=document.location.toString();
var _5c=_5b.split("?",2);
if(_5c.length>1){
var _5d=_5c[1];
var _5e=_5d.split("&");
for(var x in _5e){
var sp=_5e[x].split("=");
if((sp[0].length>9)&&(sp[0].substr(0,9)=="djConfig.")){
var opt=sp[0].substr(9);
try{
djConfig[opt]=eval(sp[1]);
}
catch(e){
djConfig[opt]=sp[1];
}
}
}
}
}
if(((djConfig["baseScriptUri"]=="")||(djConfig["baseRelativePath"]==""))&&(document&&document.getElementsByTagName)){
var _62=document.getElementsByTagName("script");
var _63=/(__package__|dojo)\.js$/i;
for(var i=0;i<_62.length;i++){
var src=_62[i].getAttribute("src");
if(_63.test(src)){
var _66=src.replace(_63,"");
if(djConfig["baseScriptUri"]==""){
djConfig["baseScriptUri"]=_66;
}
if(djConfig["baseRelativePath"]==""){
djConfig["baseRelativePath"]=_66;
}
break;
}
}
}
var dr=dojo.render;
var drh=dojo.render.html;
var dua=drh.UA=navigator.userAgent;
var dav=drh.AV=navigator.appVersion;
var t=true;
var f=false;
drh.capable=t;
drh.support.builtin=t;
dr.ver=parseFloat(drh.AV);
dr.os.mac=dav.indexOf("Macintosh")>=0;
dr.os.win=dav.indexOf("Windows")>=0;
dr.os.linux=dav.indexOf("X11")>=0;
drh.opera=dua.indexOf("Opera")>=0;
drh.khtml=(dav.indexOf("Konqueror")>=0)||(dav.indexOf("Safari")>=0);
drh.safari=dav.indexOf("Safari")>=0;
var _6d=dua.indexOf("Gecko");
drh.mozilla=drh.moz=(_6d>=0)&&(!drh.khtml);
if(drh.mozilla){
drh.geckoVersion=dua.substring(_6d+6,_6d+14);
}
drh.ie=(document.all)&&(!drh.opera);
drh.ie50=drh.ie&&dav.indexOf("MSIE 5.0")>=0;
drh.ie55=drh.ie&&dav.indexOf("MSIE 5.5")>=0;
drh.ie60=drh.ie&&dav.indexOf("MSIE 6.0")>=0;
dr.vml.capable=drh.ie;
dr.svg.capable=f;
dr.svg.support.plugin=f;
dr.svg.support.builtin=f;
dr.svg.adobe=f;
if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("org.w3c.dom.svg","1.0")){
dr.svg.capable=t;
dr.svg.support.builtin=t;
dr.svg.support.plugin=f;
dr.svg.adobe=f;
}else{
if(navigator.mimeTypes&&navigator.mimeTypes.length>0){
var _6e=navigator.mimeTypes["image/svg+xml"]||navigator.mimeTypes["image/svg"]||navigator.mimeTypes["image/svg-xml"];
if(_6e){
dr.svg.adobe=_6e&&_6e.enabledPlugin&&_6e.enabledPlugin.description&&(_6e.enabledPlugin.description.indexOf("Adobe")>-1);
if(dr.svg.adobe){
dr.svg.capable=t;
dr.svg.support.plugin=t;
}
}
}else{
if(drh.ie&&dr.os.win){
var _6e=f;
try{
var _6f=new ActiveXObject("Adobe.SVGCtl");
_6e=t;
}
catch(e){
}
if(_6e){
dr.svg.capable=t;
dr.svg.support.plugin=t;
dr.svg.adobe=t;
}
}else{
dr.svg.capable=f;
dr.svg.support.plugin=f;
dr.svg.adobe=f;
}
}
}
})();
dojo.hostenv.startPackage("dojo.hostenv");
dojo.hostenv.name_="browser";
dojo.hostenv.searchIds=[];
var DJ_XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
dojo.hostenv.getXmlhttpObject=function(){
var _70=null;
var _71=null;
try{
_70=new XMLHttpRequest();
}
catch(e){
}
if(!_70){
for(var i=0;i<3;++i){
var _73=DJ_XMLHTTP_PROGIDS[i];
try{
_70=new ActiveXObject(_73);
}
catch(e){
_71=e;
}
if(_70){
DJ_XMLHTTP_PROGIDS=[_73];
break;
}
}
}
if(!_70){
return dojo.raise("XMLHTTP not available",_71);
}
return _70;
};
dojo.hostenv.getText=function(uri,_75,_76){
var _77=this.getXmlhttpObject();
if(_75){
_77.onreadystatechange=function(){
if((4==_77.readyState)&&(_77["status"])){
if(_77.status==200){
dojo.debug("LOADED URI: "+uri);
_75(_77.responseText);
}
}
};
}
_77.open("GET",uri,_75?true:false);
_77.send(null);
if(_75){
return null;
}
return _77.responseText;
};
function dj_last_script_src(){
var _78=window.document.getElementsByTagName("script");
if(_78.length<1){
dojo.raise("No script elements in window.document, so can't figure out my script src");
}
var _79=_78[_78.length-1];
var src=_79.src;
if(!src){
dojo.raise("Last script element (out of "+_78.length+") has no src");
}
return src;
}
if(!dojo.hostenv["library_script_uri_"]){
dojo.hostenv.library_script_uri_=dj_last_script_src();
}
dojo.hostenv.defaultDebugContainerId="dojoDebug";
dojo.hostenv.println=function(_7b){
try{
var _7c=document.getElementById(djConfig.debugContainerId?djConfig.debugContainerId:dojo.hostenv.defaultDebugContainerId);
if(!_7c){
_7c=document.getElementsByTagName("body")[0]||document.body;
}
var div=document.createElement("div");
div.appendChild(document.createTextNode(_7b));
_7c.appendChild(div);
}
catch(e){
try{
document.write("<div>"+_7b+"</div>");
}
catch(e2){
window.status=_7b;
}
}
};
function dj_addNodeEvtHdlr(_7e,_7f,fp,_81){
var _82=_7e["on"+_7f]||function(){
};
_7e["on"+_7f]=function(){
fp.apply(_7e,arguments);
_82.apply(_7e,arguments);
};
return true;
}
dj_addNodeEvtHdlr(window,"load",function(){
if(dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
dojo.hostenv.modulesLoaded();
});
dojo.hostenv.makeWidgets=function(){
if((djConfig.parseWidgets)||(djConfig.searchIds.length>0)){
if(dojo.evalObjPath("dojo.widget.Parse")){
try{
var _83=new dojo.xml.Parse();
var _84=djConfig.searchIds;
if(_84.length>0){
for(var x=0;x<_84.length;x++){
var _86=document.getElementById(_84[x]);
if(!_86){
continue;
}
var _87=_83.parseElement(_86,null,true);
dojo.widget.getParser().createComponents(_87);
}
}else{
if(djConfig.parseWidgets){
var _87=_83.parseElement(document.getElementsByTagName("body")[0]||document.body,null,true);
dojo.widget.getParser().createComponents(_87);
}
}
}
catch(e){
dojo.debug("auto-build-widgets error:",e);
}
}
}
};
dojo.hostenv.modulesLoadedListeners.push(function(){
if(!dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
});
try{
if(!window["djConfig"]||!window.djConfig["preventBackButtonFix"]){
document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"'></iframe>");
}
if(dojo.render.html.ie){
document.write("<style>v:*{ behavior:url(#default#VML); }</style>");
document.write("<xml:namespace ns=\"urn:schemas-microsoft-com:vml\" prefix=\"v\"/>");
}
}
catch(e){
}
dojo.hostenv.writeIncludes=function(){
};
dojo.hostenv.byId=dojo.byId=function(id,doc){
if(typeof id=="string"||id instanceof String){
if(!doc){
doc=document;
}
return doc.getElementById(id);
}
return id;
};
dojo.hostenv.byIdArray=dojo.byIdArray=function(){
var ids=[];
for(var i=0;i<arguments.length;i++){
if((arguments[i] instanceof Array)||(typeof arguments[i]=="array")){
for(var j=0;j<arguments[i].length;j++){
ids=ids.concat(dojo.hostenv.byIdArray(arguments[i][j]));
}
}else{
ids.push(dojo.hostenv.byId(arguments[i]));
}
}
return ids;
};
dojo.hostenv.conditionalLoadModule=function(_8d){
var _8e=_8d["common"]||[];
var _8f=(_8d[dojo.hostenv.name_])?_8e.concat(_8d[dojo.hostenv.name_]||[]):_8e.concat(_8d["default"]||[]);
for(var x=0;x<_8f.length;x++){
var _91=_8f[x];
if(_91.constructor==Array){
dojo.hostenv.loadModule.apply(dojo.hostenv,_91);
}else{
dojo.hostenv.loadModule(_91);
}
}
};
dojo.hostenv.require=dojo.hostenv.loadModule;
dojo.require=function(){
dojo.hostenv.loadModule.apply(dojo.hostenv,arguments);
};
dojo.requireIf=function(){
if((arguments[0]===true)||(arguments[0]=="common")||(dojo.render[arguments[0]].capable)){
var _92=[];
for(var i=1;i<arguments.length;i++){
_92.push(arguments[i]);
}
dojo.require.apply(dojo,_92);
}
};
dojo.conditionalRequire=dojo.requireIf;
dojo.kwCompoundRequire=function(){
dojo.hostenv.conditionalLoadModule.apply(dojo.hostenv,arguments);
};
dojo.hostenv.provide=dojo.hostenv.startPackage;
dojo.provide=function(){
return dojo.hostenv.startPackage.apply(dojo.hostenv,arguments);
};
dojo.profile={start:function(){
},end:function(){
},dump:function(){
}};
dojo.provide("dojo.lang");
dojo.provide("dojo.lang.Lang");
dojo.lang.mixin=function(obj,_95){
var _96=[];
for(var x in _95){
if(typeof _96[x]=="undefined"||_96[x]!=_95[x]){
obj[x]=_95[x];
}
}
return obj;
};
dojo.lang.extend=function(_98,_99){
this.mixin(_98.prototype,_99);
};
dojo.lang.extendPrototype=function(obj,_9b){
this.extend(obj.constructor,_9b);
};
dojo.lang.anonCtr=0;
dojo.lang.anon={};
dojo.lang.nameAnonFunc=function(_9c,_9d){
var nso=(_9d||dojo.lang.anon);
if((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"]==true)){
for(var x in nso){
if(nso[x]===_9c){
return x;
}
}
}
var ret="__"+dojo.lang.anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.lang.anonCtr++;
}
nso[ret]=_9c;
return ret;
};
dojo.lang.hitch=function(_a1,_a2){
if(dojo.lang.isString(_a2)){
var fcn=_a1[_a2];
}else{
var fcn=_a2;
}
return function(){
return fcn.apply(_a1,arguments);
};
};
dojo.lang.setTimeout=function(_a4,_a5){
var _a6=window,argsStart=2;
if(typeof _a5=="function"){
_a6=_a4;
_a4=_a5;
_a5=arguments[2];
argsStart++;
}
var _a7=[];
for(var i=argsStart;i<arguments.length;i++){
_a7.push(arguments[i]);
}
return setTimeout(function(){
_a4.apply(_a6,_a7);
},_a5);
};
dojo.lang.isObject=function(wh){
return typeof wh=="object"||dojo.lang.isArray(wh)||dojo.lang.isFunction(wh);
};
dojo.lang.isArray=function(wh){
return (wh instanceof Array||typeof wh=="array");
};
dojo.lang.isFunction=function(wh){
return (wh instanceof Function||typeof wh=="function");
};
dojo.lang.isString=function(wh){
return (wh instanceof String||typeof wh=="string");
};
dojo.lang.isAlien=function(wh){
return !dojo.lang.isFunction()&&/\{\s*\[native code\]\s*\}/.test(String(wh));
};
dojo.lang.isBoolean=function(wh){
return (wh instanceof Boolean||typeof wh=="boolean");
};
dojo.lang.isNumber=function(wh){
return (wh instanceof Number||typeof wh=="number");
};
dojo.lang.isUndefined=function(wh){
return ((wh==undefined)&&(typeof wh=="undefined"));
};
dojo.lang.whatAmI=function(wh){
try{
if(dojo.lang.isArray(wh)){
return "array";
}
if(dojo.lang.isFunction(wh)){
return "function";
}
if(dojo.lang.isString(wh)){
return "string";
}
if(dojo.lang.isNumber(wh)){
return "number";
}
if(dojo.lang.isBoolean(wh)){
return "boolean";
}
if(dojo.lang.isAlien(wh)){
return "alien";
}
if(dojo.lang.isUndefined(wh)){
return "undefined";
}
if(dojo.lang.isObject(wh)){
return "object";
}
}
catch(E){
}
return "unknown";
};
dojo.lang.find=function(arr,val,_b4){
if(!dojo.lang.isArray(arr)&&dojo.lang.isArray(val)){
var a=arr;
arr=val;
val=a;
}
var _b6=dojo.lang.isString(arr);
if(_b6){
arr=arr.split("");
}
if(_b4){
for(var i=0;i<arr.length;++i){
if(arr[i]===val){
return i;
}
}
}else{
for(var i=0;i<arr.length;++i){
if(arr[i]==val){
return i;
}
}
}
return -1;
};
dojo.lang.indexOf=dojo.lang.find;
dojo.lang.findLast=function(arr,val,_ba){
if(!dojo.lang.isArray(arr)&&dojo.lang.isArray(val)){
var a=arr;
arr=val;
val=a;
}
var _bc=dojo.lang.isString(arr);
if(_bc){
arr=arr.split("");
}
if(_ba){
for(var i=arr.length-1;i>=0;i--){
if(arr[i]===val){
return i;
}
}
}else{
for(var i=arr.length-1;i>=0;i--){
if(arr[i]==val){
return i;
}
}
}
return -1;
};
dojo.lang.lastIndexOf=dojo.lang.findLast;
dojo.lang.inArray=function(arr,val){
return dojo.lang.find(arr,val)>-1;
};
dojo.lang.getNameInObj=function(ns,_c1){
if(!ns){
ns=dj_global;
}
for(var x in ns){
if(ns[x]===_c1){
return new String(x);
}
}
return null;
};
dojo.lang.has=function(obj,_c4){
return (typeof obj[_c4]!=="undefined");
};
dojo.lang.isEmpty=function(obj){
if(dojo.lang.isObject(obj)){
var tmp={};
var _c7=0;
for(var x in obj){
if(obj[x]&&(!tmp[x])){
_c7++;
break;
}
}
return (_c7==0);
}else{
if(dojo.lang.isArray(obj)||dojo.lang.isString(obj)){
return obj.length==0;
}
}
};
dojo.lang.forEach=function(arr,_ca,_cb){
var _cc=dojo.lang.isString(arr);
if(_cc){
arr=arr.split("");
}
var il=arr.length;
for(var i=0;i<((_cb)?il:arr.length);i++){
if(_ca(arr[i],i,arr)=="break"){
break;
}
}
};
dojo.lang.map=function(arr,obj,_d1){
var _d2=dojo.lang.isString(arr);
if(_d2){
arr=arr.split("");
}
if(dojo.lang.isFunction(obj)&&(!_d1)){
_d1=obj;
obj=dj_global;
}else{
if(dojo.lang.isFunction(obj)&&_d1){
var _d3=obj;
obj=_d1;
_d1=_d3;
}
}
if(Array.map){
var _d4=Array.map(arr,_d1,obj);
}else{
var _d4=[];
for(var i=0;i<arr.length;++i){
_d4.push(_d1.call(obj,arr[i]));
}
}
if(_d2){
return _d4.join("");
}else{
return _d4;
}
};
dojo.lang.tryThese=function(){
for(var x=0;x<arguments.length;x++){
try{
if(typeof arguments[x]=="function"){
var ret=(arguments[x]());
if(ret){
return ret;
}
}
}
catch(e){
dojo.debug(e);
}
}
};
dojo.lang.delayThese=function(_d8,cb,_da,_db){
if(!_d8.length){
if(typeof _db=="function"){
_db();
}
return;
}
if((typeof _da=="undefined")&&(typeof cb=="number")){
_da=cb;
cb=function(){
};
}else{
if(!cb){
cb=function(){
};
if(!_da){
_da=0;
}
}
}
setTimeout(function(){
(_d8.shift())();
cb();
dojo.lang.delayThese(_d8,cb,_da,_db);
},_da);
};
dojo.lang.shallowCopy=function(obj){
var ret={},key;
for(key in obj){
if(dojo.lang.isUndefined(ret[key])){
ret[key]=obj[key];
}
}
return ret;
};
dojo.lang.every=function(arr,_df,_e0){
var _e1=dojo.lang.isString(arr);
if(_e1){
arr=arr.split("");
}
if(Array.every){
return Array.every(arr,_df,_e0);
}else{
if(!_e0){
if(arguments.length>=3){
throw new Error("thisObject doesn't exist!");
}
_e0=dj_global;
}
for(var i=0;i<arr.length;i++){
if(!_df.call(_e0,arr[i],i,arr)){
return false;
}
}
return true;
}
};
dojo.lang.some=function(arr,_e4,_e5){
var _e6=dojo.lang.isString(arr);
if(_e6){
arr=arr.split("");
}
if(Array.some){
return Array.some(arr,_e4,_e5);
}else{
if(!_e5){
if(arguments.length>=3){
throw new Error("thisObject doesn't exist!");
}
_e5=dj_global;
}
for(var i=0;i<arr.length;i++){
if(_e4.call(_e5,arr[i],i,arr)){
return true;
}
}
return false;
}
};
dojo.lang.filter=function(arr,_e9,_ea){
var _eb=dojo.lang.isString(arr);
if(_eb){
arr=arr.split("");
}
if(Array.filter){
var _ec=Array.filter(arr,_e9,_ea);
}else{
if(!_ea){
if(arguments.length>=3){
throw new Error("thisObject doesn't exist!");
}
_ea=dj_global;
}
var _ec=[];
for(var i=0;i<arr.length;i++){
if(_e9.call(_ea,arr[i],i,arr)){
_ec.push(arr[i]);
}
}
}
if(_eb){
return _ec.join("");
}else{
return _ec;
}
};
dojo.require("dojo.lang");
dojo.provide("dojo.event");
dojo.event=new function(){
this.canTimeout=dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);
this.nameAnonFunc=dojo.lang.nameAnonFunc;
this.createFunctionPair=function(obj,cb){
var ret=[];
if(typeof obj=="function"){
ret[1]=dojo.event.nameAnonFunc(obj,dj_global);
ret[0]=dj_global;
return ret;
}else{
if((typeof obj=="object")&&(typeof cb=="string")){
return [obj,cb];
}else{
if((typeof obj=="object")&&(typeof cb=="function")){
ret[1]=dojo.event.nameAnonFunc(cb,obj);
ret[0]=obj;
return ret;
}
}
}
return null;
};
this.matchSignature=function(_f1,_f2){
var end=Math.min(_f1.length,_f2.length);
for(var x=0;x<end;x++){
if(compareTypes){
if((typeof _f1[x]).toLowerCase()!=(typeof _f2[x])){
return false;
}
}else{
if((typeof _f1[x]).toLowerCase()!=_f2[x].toLowerCase()){
return false;
}
}
}
return true;
};
this.matchSignatureSets=function(_f5){
for(var x=1;x<arguments.length;x++){
if(this.matchSignature(_f5,arguments[x])){
return true;
}
}
return false;
};
function interpolateArgs(_f7){
var ao={srcObj:dj_global,srcFunc:null,adviceObj:dj_global,adviceFunc:null,aroundObj:null,aroundFunc:null,adviceType:(_f7.length>2)?_f7[0]:"after",precedence:"last",once:false,delay:null,rate:0,adviceMsg:false};
switch(_f7.length){
case 0:
return;
case 1:
return;
case 2:
ao.srcFunc=_f7[0];
ao.adviceFunc=_f7[1];
break;
case 3:
if((typeof _f7[0]=="object")&&(typeof _f7[1]=="string")&&(typeof _f7[2]=="string")){
ao.adviceType="after";
ao.srcObj=_f7[0];
ao.srcFunc=_f7[1];
ao.adviceFunc=_f7[2];
}else{
if((typeof _f7[1]=="string")&&(typeof _f7[2]=="string")){
ao.srcFunc=_f7[1];
ao.adviceFunc=_f7[2];
}else{
if((typeof _f7[0]=="object")&&(typeof _f7[1]=="string")&&(typeof _f7[2]=="function")){
ao.adviceType="after";
ao.srcObj=_f7[0];
ao.srcFunc=_f7[1];
var _f9=dojo.event.nameAnonFunc(_f7[2],ao.adviceObj);
ao.adviceObj[_f9]=_f7[2];
ao.adviceFunc=_f9;
}else{
if((typeof _f7[0]=="function")&&(typeof _f7[1]=="object")&&(typeof _f7[2]=="string")){
ao.adviceType="after";
ao.srcObj=dj_global;
var _f9=dojo.event.nameAnonFunc(_f7[0],ao.srcObj);
ao.srcObj[_f9]=_f7[0];
ao.srcFunc=_f9;
ao.adviceObj=_f7[1];
ao.adviceFunc=_f7[2];
}
}
}
}
break;
case 4:
if((typeof _f7[0]=="object")&&(typeof _f7[2]=="object")){
ao.adviceType="after";
ao.srcObj=_f7[0];
ao.srcFunc=_f7[1];
ao.adviceObj=_f7[2];
ao.adviceFunc=_f7[3];
}else{
if((typeof _f7[1]).toLowerCase()=="object"){
ao.srcObj=_f7[1];
ao.srcFunc=_f7[2];
ao.adviceObj=dj_global;
ao.adviceFunc=_f7[3];
}else{
if((typeof _f7[2]).toLowerCase()=="object"){
ao.srcObj=dj_global;
ao.srcFunc=_f7[1];
ao.adviceObj=_f7[2];
ao.adviceFunc=_f7[3];
}else{
ao.srcObj=ao.adviceObj=ao.aroundObj=dj_global;
ao.srcFunc=_f7[1];
ao.adviceFunc=_f7[2];
ao.aroundFunc=_f7[3];
}
}
}
break;
case 6:
ao.srcObj=_f7[1];
ao.srcFunc=_f7[2];
ao.adviceObj=_f7[3];
ao.adviceFunc=_f7[4];
ao.aroundFunc=_f7[5];
ao.aroundObj=dj_global;
break;
default:
ao.srcObj=_f7[1];
ao.srcFunc=_f7[2];
ao.adviceObj=_f7[3];
ao.adviceFunc=_f7[4];
ao.aroundObj=_f7[5];
ao.aroundFunc=_f7[6];
ao.once=_f7[7];
ao.delay=_f7[8];
ao.rate=_f7[9];
ao.adviceMsg=_f7[10];
break;
}
if((typeof ao.srcFunc).toLowerCase()!="string"){
ao.srcFunc=dojo.lang.getNameInObj(ao.srcObj,ao.srcFunc);
}
if((typeof ao.adviceFunc).toLowerCase()!="string"){
ao.adviceFunc=dojo.lang.getNameInObj(ao.adviceObj,ao.adviceFunc);
}
if((ao.aroundObj)&&((typeof ao.aroundFunc).toLowerCase()!="string")){
ao.aroundFunc=dojo.lang.getNameInObj(ao.aroundObj,ao.aroundFunc);
}
if(!ao.srcObj){
dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
}
if(!ao.adviceObj){
dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
}
return ao;
}
this.connect=function(){
var ao=interpolateArgs(arguments);
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
if(ao.adviceFunc){
var _fc=dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj,ao.adviceFunc);
}
mjp.kwAddAdvice(ao);
return mjp;
};
this.connectBefore=function(){
var _fd=["before"];
for(var i=0;i<arguments.length;i++){
_fd.push(arguments[i]);
}
return this.connect.apply(this,_fd);
};
this.connectAround=function(){
var _ff=["around"];
for(var i=0;i<arguments.length;i++){
_ff.push(arguments[i]);
}
return this.connect.apply(this,_ff);
};
this.kwConnectImpl_=function(_101,_102){
var fn=(_102)?"disconnect":"connect";
if(typeof _101["srcFunc"]=="function"){
_101.srcObj=_101["srcObj"]||dj_global;
var _104=dojo.event.nameAnonFunc(_101.srcFunc,_101.srcObj);
_101.srcFunc=_104;
}
if(typeof _101["adviceFunc"]=="function"){
_101.adviceObj=_101["adviceObj"]||dj_global;
var _104=dojo.event.nameAnonFunc(_101.adviceFunc,_101.adviceObj);
_101.adviceFunc=_104;
}
return dojo.event[fn]((_101["type"]||_101["adviceType"]||"after"),_101["srcObj"]||dj_global,_101["srcFunc"],_101["adviceObj"]||_101["targetObj"]||dj_global,_101["adviceFunc"]||_101["targetFunc"],_101["aroundObj"],_101["aroundFunc"],_101["once"],_101["delay"],_101["rate"],_101["adviceMsg"]||false);
};
this.kwConnect=function(_105){
return this.kwConnectImpl_(_105,false);
};
this.disconnect=function(){
var ao=interpolateArgs(arguments);
if(!ao.adviceFunc){
return;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
return mjp.removeAdvice(ao.adviceObj,ao.adviceFunc,ao.adviceType,ao.once);
};
this.kwDisconnect=function(_108){
return this.kwConnectImpl_(_108,true);
};
};
dojo.event.MethodInvocation=function(_109,obj,args){
this.jp_=_109;
this.object=obj;
this.args=[];
for(var x=0;x<args.length;x++){
this.args[x]=args[x];
}
this.around_index=-1;
};
dojo.event.MethodInvocation.prototype.proceed=function(){
this.around_index++;
if(this.around_index>=this.jp_.around.length){
return this.jp_.object[this.jp_.methodname].apply(this.jp_.object,this.args);
}else{
var ti=this.jp_.around[this.around_index];
var mobj=ti[0]||dj_global;
var meth=ti[1];
return mobj[meth].call(mobj,this);
}
};
dojo.event.MethodJoinPoint=function(obj,_111){
this.object=obj||dj_global;
this.methodname=_111;
this.methodfunc=this.object[_111];
this.before=[];
this.after=[];
this.around=[];
};
dojo.event.MethodJoinPoint.getForMethod=function(obj,_113){
if(!obj){
obj=dj_global;
}
if(!obj[_113]){
obj[_113]=function(){
};
}else{
if((!dojo.lang.isFunction(obj[_113]))&&(!dojo.lang.isAlien(obj[_113]))){
return null;
}
}
var _114=_113+"$joinpoint";
var _115=_113+"$joinpoint$method";
var _116=obj[_114];
if(!_116){
var _117=false;
if(dojo.event["browser"]){
if((obj["attachEvent"])||(obj["nodeType"])||(obj["addEventListener"])){
_117=true;
dojo.event.browser.addClobberNodeAttrs(obj,[_114,_115,_113]);
}
}
obj[_115]=obj[_113];
_116=obj[_114]=new dojo.event.MethodJoinPoint(obj,_115);
obj[_113]=function(){
var args=[];
if((_117)&&(!arguments.length)&&(window.event)){
args.push(dojo.event.browser.fixEvent(window.event));
}else{
for(var x=0;x<arguments.length;x++){
if((x==0)&&(_117)&&(dojo.event.browser.isEvent(arguments[x]))){
args.push(dojo.event.browser.fixEvent(arguments[x]));
}else{
args.push(arguments[x]);
}
}
}
return _116.run.apply(_116,args);
};
}
return _116;
};
dojo.event.MethodJoinPoint.prototype.unintercept=function(){
this.object[this.methodname]=this.methodfunc;
};
dojo.event.MethodJoinPoint.prototype.run=function(){
var obj=this.object||dj_global;
var args=arguments;
var _11c=[];
for(var x=0;x<args.length;x++){
_11c[x]=args[x];
}
var _11e=function(marr){
if(!marr){
dojo.debug("Null argument to unrollAdvice()");
return;
}
var _120=marr[0]||dj_global;
var _121=marr[1];
if(!_120[_121]){
throw new Error("function \""+_121+"\" does not exist on \""+_120+"\"");
}
var _122=marr[2]||dj_global;
var _123=marr[3];
var msg=marr[6];
var _125;
var to={args:[],jp_:this,object:obj,proceed:function(){
return _120[_121].apply(_120,to.args);
}};
to.args=_11c;
var _127=parseInt(marr[4]);
var _128=((!isNaN(_127))&&(marr[4]!==null)&&(typeof marr[4]!="undefined"));
if(marr[5]){
var rate=parseInt(marr[5]);
var cur=new Date();
var _12b=false;
if((marr["last"])&&((cur-marr.last)<=rate)){
if(dojo.event.canTimeout){
if(marr["delayTimer"]){
clearTimeout(marr.delayTimer);
}
var tod=parseInt(rate*2);
var mcpy=dojo.lang.shallowCopy(marr);
marr.delayTimer=setTimeout(function(){
mcpy[5]=0;
_11e(mcpy);
},tod);
}
return;
}else{
marr.last=cur;
}
}
if(_123){
_122[_123].call(_122,to);
}else{
if((_128)&&((dojo.render.html)||(dojo.render.svg))){
dj_global["setTimeout"](function(){
if(msg){
_120[_121].call(_120,to);
}else{
_120[_121].apply(_120,args);
}
},_127);
}else{
if(msg){
_120[_121].call(_120,to);
}else{
_120[_121].apply(_120,args);
}
}
}
};
if(this.before.length>0){
dojo.lang.forEach(this.before,_11e,true);
}
var _12e;
if(this.around.length>0){
var mi=new dojo.event.MethodInvocation(this,obj,args);
_12e=mi.proceed();
}else{
if(this.methodfunc){
_12e=this.object[this.methodname].apply(this.object,args);
}
}
if(this.after.length>0){
dojo.lang.forEach(this.after,_11e,true);
}
return (this.methodfunc)?_12e:null;
};
dojo.event.MethodJoinPoint.prototype.getArr=function(kind){
var arr=this.after;
if((typeof kind=="string")&&(kind.indexOf("before")!=-1)){
arr=this.before;
}else{
if(kind=="around"){
arr=this.around;
}
}
return arr;
};
dojo.event.MethodJoinPoint.prototype.kwAddAdvice=function(args){
this.addAdvice(args["adviceObj"],args["adviceFunc"],args["aroundObj"],args["aroundFunc"],args["adviceType"],args["precedence"],args["once"],args["delay"],args["rate"],args["adviceMsg"]);
};
dojo.event.MethodJoinPoint.prototype.addAdvice=function(_133,_134,_135,_136,_137,_138,once,_13a,rate,_13c){
var arr=this.getArr(_137);
if(!arr){
dojo.raise("bad this: "+this);
}
var ao=[_133,_134,_135,_136,_13a,rate,_13c];
if(once){
if(this.hasAdvice(_133,_134,_137,arr)>=0){
return;
}
}
if(_138=="first"){
arr.unshift(ao);
}else{
arr.push(ao);
}
};
dojo.event.MethodJoinPoint.prototype.hasAdvice=function(_13f,_140,_141,arr){
if(!arr){
arr=this.getArr(_141);
}
var ind=-1;
for(var x=0;x<arr.length;x++){
if((arr[x][0]==_13f)&&(arr[x][1]==_140)){
ind=x;
}
}
return ind;
};
dojo.event.MethodJoinPoint.prototype.removeAdvice=function(_145,_146,_147,once){
var arr=this.getArr(_147);
var ind=this.hasAdvice(_145,_146,_147,arr);
if(ind==-1){
return false;
}
while(ind!=-1){
arr.splice(ind,1);
if(once){
break;
}
ind=this.hasAdvice(_145,_146,_147,arr);
}
return true;
};
dojo.require("dojo.event");
dojo.provide("dojo.event.topic");
dojo.event.topic=new function(){
this.topics={};
this.getTopic=function(_14b){
if(!this.topics[_14b]){
this.topics[_14b]=new this.TopicImpl(_14b);
}
return this.topics[_14b];
};
this.registerPublisher=function(_14c,obj,_14e){
var _14c=this.getTopic(_14c);
_14c.registerPublisher(obj,_14e);
};
this.subscribe=function(_14f,obj,_151){
var _14f=this.getTopic(_14f);
_14f.subscribe(obj,_151);
};
this.unsubscribe=function(_152,obj,_154){
var _152=this.getTopic(_152);
_152.unsubscribe(obj,_154);
};
this.publish=function(_155,_156){
var _155=this.getTopic(_155);
var args=[];
if((arguments.length==2)&&(_156.length)&&(typeof _156!="string")){
args=_156;
}else{
var args=[];
for(var x=1;x<arguments.length;x++){
args.push(arguments[x]);
}
}
_155.sendMessage.apply(_155,args);
};
};
dojo.event.topic.TopicImpl=function(_159){
this.topicName=_159;
var self=this;
self.subscribe=function(_15b,_15c){
dojo.event.connect("before",self,"sendMessage",_15b,_15c);
};
self.unsubscribe=function(_15d,_15e){
dojo.event.disconnect("before",self,"sendMessage",_15d,_15e);
};
self.registerPublisher=function(_15f,_160){
dojo.event.connect(_15f,_160,self,"sendMessage");
};
self.sendMessage=function(_161){
};
};
dojo.provide("dojo.event.browser");
dojo.require("dojo.event");
dojo_ie_clobber=new function(){
this.clobberArr=["data","onload","onmousedown","onmouseup","onmouseover","onmouseout","onmousemove","onclick","ondblclick","onfocus","onblur","onkeypress","onkeydown","onkeyup","onsubmit","onreset","onselect","onchange","onselectstart","ondragstart","oncontextmenu"];
this.exclusions=[];
this.clobberList={};
this.clobberNodes=[];
this.addClobberAttr=function(type){
if(dojo.render.html.ie){
if(this.clobberList[type]!="set"){
this.clobberArr.push(type);
this.clobberList[type]="set";
}
}
};
this.addExclusionID=function(id){
this.exclusions.push(id);
};
if(dojo.render.html.ie){
for(var x=0;x<this.clobberArr.length;x++){
this.clobberList[this.clobberArr[x]]="set";
}
}
function nukeProp(node,prop){
try{
node[prop]=null;
}
catch(e){
}
try{
delete node[prop];
}
catch(e){
}
try{
node.removeAttribute(prop);
}
catch(e){
}
}
this.clobber=function(_167){
for(var x=0;x<this.exclusions.length;x++){
try{
var tn=document.getElementById(this.exclusions[x]);
tn.parentNode.removeChild(tn);
}
catch(e){
}
}
var na;
var tna;
if(_167){
tna=_167.getElementsByTagName("*");
na=[_167];
for(var x=0;x<tna.length;x++){
if(!djConfig.ieClobberMinimal){
na.push(tna[x]);
}else{
if(tna[x]["__doClobber__"]){
na.push(tna[x]);
}
}
}
}else{
try{
window.onload=null;
}
catch(e){
}
na=(this.clobberNodes.length)?this.clobberNodes:document.all;
}
tna=null;
var _16c={};
for(var i=na.length-1;i>=0;i=i-1){
var el=na[i];
if(djConfig.ieClobberMinimal){
if(el["__clobberAttrs__"]){
for(var j=0;j<el.__clobberAttrs__.length;j++){
nukeProp(el,el.__clobberAttrs__[j]);
}
nukeProp(el,"__clobberAttrs__");
nukeProp(el,"__doClobber__");
}
}else{
for(var p=this.clobberArr.length-1;p>=0;p=p-1){
var ta=this.clobberArr[p];
nukeProp(el,ta);
}
}
}
na=null;
};
};
if((dojo.render.html.ie)&&((!dojo.hostenv.ie_prevent_clobber_)||(djConfig.ieClobberMinimal))){
window.onunload=function(){
dojo_ie_clobber.clobber();
try{
if((dojo["widget"])&&(dojo.widget["manager"])){
dojo.widget.manager.destroyAll();
}
}
catch(e){
}
try{
window.onload=null;
}
catch(e){
}
try{
window.onunload=null;
}
catch(e){
}
dojo_ie_clobber.clobberNodes=[];
};
}
dojo.event.browser=new function(){
var _172=0;
this.clean=function(node){
if(dojo.render.html.ie){
dojo_ie_clobber.clobber(node);
}
};
this.addClobberAttr=function(type){
dojo_ie_clobber.addClobberAttr(type);
};
this.addClobberAttrs=function(){
for(var x=0;x<arguments.length;x++){
this.addClobberAttr(arguments[x]);
}
};
this.addClobberNode=function(node){
if(djConfig.ieClobberMinimal){
if(!node["__doClobber__"]){
node.__doClobber__=true;
dojo_ie_clobber.clobberNodes.push(node);
node.__clobberAttrs__=[];
}
}
};
this.addClobberNodeAttrs=function(node,_178){
this.addClobberNode(node);
if(djConfig.ieClobberMinimal){
for(var x=0;x<_178.length;x++){
node.__clobberAttrs__.push(_178[x]);
}
}else{
this.addClobberAttrs.apply(this,_178);
}
};
this.removeListener=function(node,_17b,fp,_17d){
if(!_17d){
var _17d=false;
}
_17b=_17b.toLowerCase();
if(_17b.substr(0,2)=="on"){
_17b=_17b.substr(2);
}
if(node.removeEventListener){
node.removeEventListener(_17b,fp,_17d);
}
};
this.addListener=function(node,_17f,fp,_181,_182){
if(!node){
return;
}
if(!_181){
var _181=false;
}
_17f=_17f.toLowerCase();
if(_17f.substr(0,2)!="on"){
_17f="on"+_17f;
}
if(!_182){
var _183=function(evt){
if(!evt){
evt=window.event;
}
var ret=fp(dojo.event.browser.fixEvent(evt));
if(_181){
dojo.event.browser.stopEvent(evt);
}
return ret;
};
}else{
_183=fp;
}
if(node.addEventListener){
node.addEventListener(_17f.substr(2),_183,_181);
return _183;
}else{
if(typeof node[_17f]=="function"){
var _186=node[_17f];
node[_17f]=function(e){
_186(e);
return _183(e);
};
}else{
node[_17f]=_183;
}
if(dojo.render.html.ie){
this.addClobberNodeAttrs(node,[_17f]);
}
return _183;
}
};
this.isEvent=function(obj){
return (typeof Event!="undefined")&&(obj.eventPhase);
};
this.currentEvent=null;
this.callListener=function(_189,_18a){
if(typeof _189!="function"){
dojo.raise("listener not a function: "+_189);
}
dojo.event.browser.currentEvent.currentTarget=_18a;
return _189.call(_18a,dojo.event.browser.currentEvent);
};
this.stopPropagation=function(){
dojo.event.browser.currentEvent.cancelBubble=true;
};
this.preventDefault=function(){
dojo.event.browser.currentEvent.returnValue=false;
};
this.keys={KEY_BACKSPACE:8,KEY_TAB:9,KEY_ENTER:13,KEY_SHIFT:16,KEY_CTRL:17,KEY_ALT:18,KEY_PAUSE:19,KEY_CAPS_LOCK:20,KEY_ESCAPE:27,KEY_SPACE:32,KEY_PAGE_UP:33,KEY_PAGE_DOWN:34,KEY_END:35,KEY_HOME:36,KEY_LEFT_ARROW:37,KEY_UP_ARROW:38,KEY_RIGHT_ARROW:39,KEY_DOWN_ARROW:40,KEY_INSERT:45,KEY_DELETE:46,KEY_LEFT_WINDOW:91,KEY_RIGHT_WINDOW:92,KEY_SELECT:93,KEY_F1:112,KEY_F2:113,KEY_F3:114,KEY_F4:115,KEY_F5:116,KEY_F6:117,KEY_F7:118,KEY_F8:119,KEY_F9:120,KEY_F10:121,KEY_F11:122,KEY_F12:123,KEY_NUM_LOCK:144,KEY_SCROLL_LOCK:145};
this.revKeys=[];
for(var key in this.keys){
this.revKeys[this.keys[key]]=key;
}
this.fixEvent=function(evt){
if((!evt)&&(window["event"])){
var evt=window.event;
}
if((evt["type"])&&(evt["type"].indexOf("key")==0)){
evt.keys=this.revKeys;
for(var key in this.keys){
evt[key]=this.keys[key];
}
if((dojo.render.html.ie)&&(evt["type"]=="keypress")){
evt.charCode=evt.keyCode;
}
}
if(dojo.render.html.ie){
if(!evt.target){
evt.target=evt.srcElement;
}
if(!evt.currentTarget){
evt.currentTarget=evt.srcElement;
}
if(!evt.layerX){
evt.layerX=evt.offsetX;
}
if(!evt.layerY){
evt.layerY=evt.offsetY;
}
if(evt.fromElement){
evt.relatedTarget=evt.fromElement;
}
if(evt.toElement){
evt.relatedTarget=evt.toElement;
}
this.currentEvent=evt;
evt.callListener=this.callListener;
evt.stopPropagation=this.stopPropagation;
evt.preventDefault=this.preventDefault;
}
return evt;
};
this.stopEvent=function(ev){
if(window.event){
ev.returnValue=false;
ev.cancelBubble=true;
}else{
ev.preventDefault();
ev.stopPropagation();
}
};
};
dojo.hostenv.conditionalLoadModule({common:["dojo.event","dojo.event.topic"],browser:["dojo.event.browser"]});
dojo.hostenv.moduleLoaded("dojo.event.*");
dojo.provide("dojo.string");
dojo.require("dojo.lang");
dojo.string.trim=function(str){
if(!dojo.lang.isString(str)){
return str;
}
if(!str.length){
return str;
}
return str.replace(/^\s*/,"").replace(/\s*$/,"");
};
dojo.string.paramString=function(str,_191,_192){
for(var name in _191){
var re=new RegExp("\\%\\{"+name+"\\}","g");
str=str.replace(re,_191[name]);
}
if(_192){
str=str.replace(/%\{([^\}\s]+)\}/g,"");
}
return str;
};
dojo.string.capitalize=function(str){
if(!dojo.lang.isString(str)){
return "";
}
if(arguments.length==0){
str=this;
}
var _196=str.split(" ");
var _197="";
var len=_196.length;
for(var i=0;i<len;i++){
var word=_196[i];
word=word.charAt(0).toUpperCase()+word.substring(1,word.length);
_197+=word;
if(i<len-1){
_197+=" ";
}
}
return new String(_197);
};
dojo.string.isBlank=function(str){
if(!dojo.lang.isString(str)){
return true;
}
return (dojo.string.trim(str).length==0);
};
dojo.string.encodeAscii=function(str){
if(!dojo.lang.isString(str)){
return str;
}
var ret="";
var _19e=escape(str);
var _19f,re=/%u([0-9A-F]{4})/i;
while((_19f=_19e.match(re))){
var num=Number("0x"+_19f[1]);
var _1a1=escape("&#"+num+";");
ret+=_19e.substring(0,_19f.index)+_1a1;
_19e=_19e.substring(_19f.index+_19f[0].length);
}
ret+=_19e.replace(/\+/g,"%2B");
return ret;
};
dojo.string.summary=function(str,len){
if(!len||str.length<=len){
return str;
}else{
return str.substring(0,len).replace(/\.+$/,"")+"...";
}
};
dojo.string.escape=function(type,str){
switch(type.toLowerCase()){
case "xml":
case "html":
return dojo.string.escapeXml(str);
case "sql":
return dojo.string.escapeSql(str);
case "regexp":
case "regex":
return dojo.string.escapeRegExp(str);
case "javascript":
case "js":
return dojo.string.escapeJavaScript(str);
default:
return str;
}
};
dojo.string.escapeXml=function(str){
return str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;").replace(/'/gm,"&#39;");
};
dojo.string.escapeSql=function(str){
return str.replace(/'/gm,"''");
};
dojo.string.escapeRegExp=function(str){
return str.replace(/\\/gm,"\\\\").replace(/([\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.escapeJavaScript=function(str){
return str.replace(/(["'\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.addToPrototype=function(){
for(var _1aa in dojo.string){
if(dojo.lang.isFunction(dojo.string[_1aa])){
var func=(function(){
var meth=_1aa;
switch(meth){
case "addToPrototype":
return null;
break;
case "escape":
return function(type){
return dojo.string.escape(type,this);
};
break;
default:
return function(){
var args=[this];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
dojo.debug(args);
return dojo.string[meth].apply(dojo.string,args);
};
}
})();
if(func){
String.prototype[_1aa]=func;
}
}
}
};
dojo.provide("dojo.io.IO");
dojo.require("dojo.string");
dojo.io.transports=[];
dojo.io.hdlrFuncNames=["load","error"];
dojo.io.Request=function(url,_1b1,_1b2,_1b3){
if((arguments.length==1)&&(arguments[0].constructor==Object)){
this.fromKwArgs(arguments[0]);
}else{
this.url=url;
if(arguments.length>=2){
this.mimetype=_1b1;
}
if(arguments.length>=3){
this.transport=_1b2;
}
if(arguments.length>=4){
this.changeUrl=_1b3;
}
}
};
dojo.lang.extend(dojo.io.Request,{url:"",mimetype:"text/plain",method:"GET",content:undefined,transport:undefined,changeUrl:undefined,formNode:undefined,sync:false,bindSuccess:false,useCache:false,load:function(type,data,evt){
},error:function(type,_1b8){
},fromKwArgs:function(_1b9){
if(_1b9["url"]){
_1b9.url=_1b9.url.toString();
}
if(!_1b9["method"]&&_1b9["formNode"]&&_1b9["formNode"].method){
_1b9.method=_1b9["formNode"].method;
}
if(!_1b9["handle"]&&_1b9["handler"]){
_1b9.handle=_1b9.handler;
}
if(!_1b9["load"]&&_1b9["loaded"]){
_1b9.load=_1b9.loaded;
}
if(!_1b9["changeUrl"]&&_1b9["changeURL"]){
_1b9.changeUrl=_1b9.changeURL;
}
if(!_1b9["encoding"]){
if(!dojo.lang.isUndefined(djConfig["bindEncoding"])){
_1b9.encoding=djConfig.bindEncoding;
}else{
_1b9.encoding="";
}
}
var _1ba=dojo.lang.isFunction;
for(var x=0;x<dojo.io.hdlrFuncNames.length;x++){
var fn=dojo.io.hdlrFuncNames[x];
if(_1ba(_1b9[fn])){
continue;
}
if(_1ba(_1b9["handle"])){
_1b9[fn]=_1b9.handle;
}
}
dojo.lang.mixin(this,_1b9);
}});
dojo.io.Error=function(msg,type,num){
this.message=msg;
this.type=type||"unknown";
this.number=num||0;
};
dojo.io.transports.addTransport=function(name){
this.push(name);
this[name]=dojo.io[name];
};
dojo.io.bind=function(_1c1){
if(!(_1c1 instanceof dojo.io.Request)){
try{
_1c1=new dojo.io.Request(_1c1);
}
catch(e){
dojo.debug(e);
}
}
var _1c2="";
if(_1c1["transport"]){
_1c2=_1c1["transport"];
if(!this[_1c2]){
return _1c1;
}
}else{
for(var x=0;x<dojo.io.transports.length;x++){
var tmp=dojo.io.transports[x];
if((this[tmp])&&(this[tmp].canHandle(_1c1))){
_1c2=tmp;
}
}
if(_1c2==""){
return _1c1;
}
}
this[_1c2].bind(_1c1);
_1c1.bindSuccess=true;
return _1c1;
};
dojo.io.argsFromMap=function(map,_1c6){
var _1c7=new Object();
var _1c8="";
var enc=/utf/i.test(_1c6||"")?encodeURIComponent:dojo.string.encodeAscii;
for(var x in map){
if(!_1c7[x]){
_1c8+=enc(x)+"="+enc(map[x])+"&";
}
}
return _1c8;
};
dojo.provide("dojo.dom");
dojo.require("dojo.lang");
dojo.dom.ELEMENT_NODE=1;
dojo.dom.ATTRIBUTE_NODE=2;
dojo.dom.TEXT_NODE=3;
dojo.dom.CDATA_SECTION_NODE=4;
dojo.dom.ENTITY_REFERENCE_NODE=5;
dojo.dom.ENTITY_NODE=6;
dojo.dom.PROCESSING_INSTRUCTION_NODE=7;
dojo.dom.COMMENT_NODE=8;
dojo.dom.DOCUMENT_NODE=9;
dojo.dom.DOCUMENT_TYPE_NODE=10;
dojo.dom.DOCUMENT_FRAGMENT_NODE=11;
dojo.dom.NOTATION_NODE=12;
dojo.dom.dojoml="http://www.dojotoolkit.org/2004/dojoml";
dojo.dom.xmlns={svg:"http://www.w3.org/2000/svg",smil:"http://www.w3.org/2001/SMIL20/",mml:"http://www.w3.org/1998/Math/MathML",cml:"http://www.xml-cml.org",xlink:"http://www.w3.org/1999/xlink",xhtml:"http://www.w3.org/1999/xhtml",xul:"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",xbl:"http://www.mozilla.org/xbl",fo:"http://www.w3.org/1999/XSL/Format",xsl:"http://www.w3.org/1999/XSL/Transform",xslt:"http://www.w3.org/1999/XSL/Transform",xi:"http://www.w3.org/2001/XInclude",xforms:"http://www.w3.org/2002/01/xforms",saxon:"http://icl.com/saxon",xalan:"http://xml.apache.org/xslt",xsd:"http://www.w3.org/2001/XMLSchema",dt:"http://www.w3.org/2001/XMLSchema-datatypes",xsi:"http://www.w3.org/2001/XMLSchema-instance",rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",rdfs:"http://www.w3.org/2000/01/rdf-schema#",dc:"http://purl.org/dc/elements/1.1/",dcq:"http://purl.org/dc/qualifiers/1.0","soap-env":"http://schemas.xmlsoap.org/soap/envelope/",wsdl:"http://schemas.xmlsoap.org/wsdl/",AdobeExtensions:"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"};
dojo.dom.isNode=dojo.lang.isDomNode=function(wh){
if(typeof Element!="undefined"){
return wh instanceof Element;
}else{
return !isNaN(wh.nodeType);
}
};
dojo.dom.getTagName=function(node){
var _1cd=node.tagName;
if(_1cd.substr(0,5).toLowerCase()!="dojo:"){
if(_1cd.substr(0,4).toLowerCase()=="dojo"){
return "dojo:"+_1cd.substring(4).toLowerCase();
}
var djt=node.getAttribute("dojoType")||node.getAttribute("dojotype");
if(djt){
return "dojo:"+djt.toLowerCase();
}
if((node.getAttributeNS)&&(node.getAttributeNS(this.dojoml,"type"))){
return "dojo:"+node.getAttributeNS(this.dojoml,"type").toLowerCase();
}
try{
djt=node.getAttribute("dojo:type");
}
catch(e){
}
if(djt){
return "dojo:"+djt.toLowerCase();
}
if((!dj_global["djConfig"])||(!djConfig["ignoreClassNames"])){
var _1cf=node.className||node.getAttribute("class");
if((_1cf)&&(_1cf.indexOf("dojo-")!=-1)){
var _1d0=_1cf.split(" ");
for(var x=0;x<_1d0.length;x++){
if((_1d0[x].length>5)&&(_1d0[x].indexOf("dojo-")>=0)){
return "dojo:"+_1d0[x].substr(5).toLowerCase();
}
}
}
}
}
return _1cd.toLowerCase();
};
dojo.dom.getUniqueId=function(){
do{
var id="dj_unique_"+(++arguments.callee._idIncrement);
}while(document.getElementById(id));
return id;
};
dojo.dom.getUniqueId._idIncrement=0;
dojo.dom.firstElement=dojo.dom.getFirstChildElement=function(_1d3){
var node=_1d3.firstChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.nextSibling;
}
return node;
};
dojo.dom.lastElement=dojo.dom.getLastChildElement=function(_1d5){
var node=_1d5.lastChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.previousSibling;
}
return node;
};
dojo.dom.nextElement=dojo.dom.getNextSiblingElement=function(node){
if(!node){
return null;
}
do{
node=node.nextSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
return node;
};
dojo.dom.prevElement=dojo.dom.getPreviousSiblingElement=function(node){
if(!node){
return null;
}
do{
node=node.previousSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
return node;
};
dojo.dom.moveChildren=function(_1d9,_1da,trim){
var _1dc=0;
if(trim){
while(_1d9.hasChildNodes()&&_1d9.firstChild.nodeType==dojo.dom.TEXT_NODE){
_1d9.removeChild(_1d9.firstChild);
}
while(_1d9.hasChildNodes()&&_1d9.lastChild.nodeType==dojo.dom.TEXT_NODE){
_1d9.removeChild(_1d9.lastChild);
}
}
while(_1d9.hasChildNodes()){
_1da.appendChild(_1d9.firstChild);
_1dc++;
}
return _1dc;
};
dojo.dom.copyChildren=function(_1dd,_1de,trim){
var _1e0=_1dd.cloneNode(true);
return this.moveChildren(_1e0,_1de,trim);
};
dojo.dom.removeChildren=function(node){
var _1e2=node.childNodes.length;
while(node.hasChildNodes()){
node.removeChild(node.firstChild);
}
return _1e2;
};
dojo.dom.replaceChildren=function(node,_1e4){
dojo.dom.removeChildren(node);
node.appendChild(_1e4);
};
dojo.dom.removeNode=function(node){
if(node&&node.parentNode){
return node.parentNode.removeChild(node);
}
};
dojo.dom.getAncestors=function(node,_1e7,_1e8){
var _1e9=[];
var _1ea=dojo.lang.isFunction(_1e7);
while(node){
if(!_1ea||_1e7(node)){
_1e9.push(node);
}
if(_1e8&&_1e9.length>0){
return _1e9[0];
}
node=node.parentNode;
}
if(_1e8){
return null;
}
return _1e9;
};
dojo.dom.getAncestorsByTag=function(node,tag,_1ed){
tag=tag.toLowerCase();
return dojo.dom.getAncestors(node,function(el){
return ((el.tagName)&&(el.tagName.toLowerCase()==tag));
},_1ed);
};
dojo.dom.getFirstAncestorByTag=function(node,tag){
return dojo.dom.getAncestorsByTag(node,tag,true);
};
dojo.dom.isDescendantOf=function(node,_1f2,_1f3){
if(_1f3&&node){
node=node.parentNode;
}
while(node){
if(node==_1f2){
return true;
}
node=node.parentNode;
}
return false;
};
dojo.dom.innerXML=function(node){
if(node.innerXML){
return node.innerXML;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(node);
}
}
};
dojo.dom.createDocumentFromText=function(str,_1f6){
if(!_1f6){
_1f6="text/xml";
}
if(typeof DOMParser!="undefined"){
var _1f7=new DOMParser();
return _1f7.parseFromString(str,_1f6);
}else{
if(typeof ActiveXObject!="undefined"){
var _1f8=new ActiveXObject("Microsoft.XMLDOM");
if(_1f8){
_1f8.async=false;
_1f8.loadXML(str);
return _1f8;
}else{
dojo.debug("toXml didn't work?");
}
}else{
if(document.createElement){
var tmp=document.createElement("xml");
tmp.innerHTML=str;
if(document.implementation&&document.implementation.createDocument){
var _1fa=document.implementation.createDocument("foo","",null);
for(var i=0;i<tmp.childNodes.length;i++){
_1fa.importNode(tmp.childNodes.item(i),true);
}
return _1fa;
}
return tmp.document&&tmp.document.firstChild?tmp.document.firstChild:tmp;
}
}
}
return null;
};
dojo.dom.insertBefore=function(node,ref,_1fe){
if(_1fe!=true&&(node===ref||node.nextSibling===ref)){
return false;
}
var _1ff=ref.parentNode;
_1ff.insertBefore(node,ref);
return true;
};
dojo.dom.insertAfter=function(node,ref,_202){
var pn=ref.parentNode;
if(ref==pn.lastChild){
if((_202!=true)&&(node===ref)){
return false;
}
pn.appendChild(node);
}else{
return this.insertBefore(node,ref.nextSibling,_202);
}
return true;
};
dojo.dom.insertAtPosition=function(node,ref,_206){
if((!node)||(!ref)||(!_206)){
return false;
}
switch(_206.toLowerCase()){
case "before":
return dojo.dom.insertBefore(node,ref);
case "after":
return dojo.dom.insertAfter(node,ref);
case "first":
if(ref.firstChild){
return dojo.dom.insertBefore(node,ref.firstChild);
}else{
ref.appendChild(node);
return true;
}
break;
default:
ref.appendChild(node);
return true;
}
};
dojo.dom.insertAtIndex=function(node,_208,_209){
var _20a=_208.childNodes;
if(!_20a.length){
_208.appendChild(node);
return true;
}
var _20b=null;
for(var i=0;i<_20a.length;i++){
var _20d=_20a.item(i)["getAttribute"]?parseInt(_20a.item(i).getAttribute("dojoinsertionindex")):-1;
if(_20d<_209){
_20b=_20a.item(i);
}
}
if(_20b){
return dojo.dom.insertAfter(node,_20b);
}else{
return dojo.dom.insertBefore(node,_20a.item(0));
}
};
dojo.dom.textContent=function(node,text){
if(text){
dojo.dom.replaceChildren(node,document.createTextNode(text));
return text;
}else{
var _210="";
if(node==null){
return _210;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
_210+=dojo.dom.textContent(node.childNodes[i]);
break;
case 3:
case 2:
case 4:
_210+=node.childNodes[i].nodeValue;
break;
default:
break;
}
}
return _210;
}
};
dojo.dom.collectionToArray=function(_212){
var _213=new Array(_212.length);
for(var i=0;i<_212.length;i++){
_213[i]=_212[i];
}
return _213;
};
dojo.provide("dojo.io.BrowserIO");
dojo.require("dojo.io");
dojo.require("dojo.lang");
dojo.require("dojo.dom");
try{
if((!djConfig.preventBackButtonFix)&&(!dojo.hostenv.post_load_)){
document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"'></iframe>");
}
}
catch(e){
}
dojo.io.checkChildrenForFile=function(node){
var _216=false;
var _217=node.getElementsByTagName("input");
dojo.lang.forEach(_217,function(_218){
if(_216){
return;
}
if(_218.getAttribute("type")=="file"){
_216=true;
}
});
return _216;
};
dojo.io.formHasFile=function(_219){
return dojo.io.checkChildrenForFile(_219);
};
dojo.io.encodeForm=function(_21a,_21b){
if((!_21a)||(!_21a.tagName)||(!_21a.tagName.toLowerCase()=="form")){
dojo.raise("Attempted to encode a non-form element.");
}
var enc=/utf/i.test(_21b||"")?encodeURIComponent:dojo.string.encodeAscii;
var _21d=[];
for(var i=0;i<_21a.elements.length;i++){
var elm=_21a.elements[i];
if(elm.disabled||elm.tagName.toLowerCase()=="fieldset"||!elm.name){
continue;
}
var name=enc(elm.name);
var type=elm.type.toLowerCase();
if(type=="select-multiple"){
for(var j=0;j<elm.options.length;j++){
if(elm.options[j].selected){
_21d.push(name+"="+enc(elm.options[j].value));
}
}
}else{
if(dojo.lang.inArray(type,["radio","checkbox"])){
if(elm.checked){
_21d.push(name+"="+enc(elm.value));
}
}else{
if(!dojo.lang.inArray(type,["file","submit","reset","button"])){
_21d.push(name+"="+enc(elm.value));
}
}
}
}
var _223=_21a.getElementsByTagName("input");
for(var i=0;i<_223.length;i++){
var _224=_223[i];
if(_224.type.toLowerCase()=="image"&&_224.form==_21a){
var name=enc(_224.name);
_21d.push(name+"="+enc(_224.value));
_21d.push(name+".x=0");
_21d.push(name+".y=0");
}
}
return _21d.join("&")+"&";
};
dojo.io.setIFrameSrc=function(_225,src,_227){
try{
var r=dojo.render.html;
if(!_227){
if(r.safari){
_225.location=src;
}else{
frames[_225.name].location=src;
}
}else{
var idoc;
if(r.ie){
idoc=_225.contentWindow.document;
}else{
if(r.moz){
idoc=_225.contentWindow;
}
}
idoc.location.replace(src);
}
}
catch(e){
dojo.debug(e);
dojo.debug("setIFrameSrc: "+e);
}
};
dojo.io.XMLHTTPTransport=new function(){
var _22a=this;
this.initialHref=window.location.href;
this.initialHash=window.location.hash;
this.moveForward=false;
var _22b={};
this.useCache=false;
this.historyStack=[];
this.forwardStack=[];
this.historyIframe=null;
this.bookmarkAnchor=null;
this.locationTimer=null;
function getCacheKey(url,_22d,_22e){
return url+"|"+_22d+"|"+_22e.toLowerCase();
}
function addToCache(url,_230,_231,http){
_22b[getCacheKey(url,_230,_231)]=http;
}
function getFromCache(url,_234,_235){
return _22b[getCacheKey(url,_234,_235)];
}
this.clearCache=function(){
_22b={};
};
function doLoad(_236,http,url,_239,_23a){
if((http.status==200)||(location.protocol=="file:"&&http.status==0)){
var ret;
if(_236.method.toLowerCase()=="head"){
var _23c=http.getAllResponseHeaders();
ret={};
ret.toString=function(){
return _23c;
};
var _23d=_23c.split(/[\r\n]+/g);
for(var i=0;i<_23d.length;i++){
var pair=_23d[i].match(/^([^:]+)\s*:\s*(.+)$/i);
if(pair){
ret[pair[1]]=pair[2];
}
}
}else{
if(_236.mimetype=="text/javascript"){
try{
ret=dj_eval(http.responseText);
}
catch(e){
dojo.debug(e);
ret=false;
}
}else{
if((_236.mimetype=="application/xml")||(_236.mimetype=="text/xml")){
ret=http.responseXML;
if(!ret||typeof ret=="string"){
ret=dojo.dom.createDocumentFromText(http.responseText);
}
}else{
ret=http.responseText;
}
}
}
if(_23a){
addToCache(url,_239,_236.method,http);
}
if(typeof _236.load=="function"){
_236.load("load",ret,http);
}
}else{
var _240=new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
if(typeof _236.error=="function"){
_236.error("error",_240,http);
}
}
}
function setHeaders(http,_242){
if(_242["headers"]){
for(var _243 in _242["headers"]){
if(_243.toLowerCase()=="content-type"&&!_242["contentType"]){
_242["contentType"]=_242["headers"][_243];
}else{
http.setRequestHeader(_243,_242["headers"][_243]);
}
}
}
}
this.addToHistory=function(args){
var _245=args["back"]||args["backButton"]||args["handle"];
var hash=null;
if(!this.historyIframe){
this.historyIframe=window.frames["djhistory"];
}
if(!this.bookmarkAnchor){
this.bookmarkAnchor=document.createElement("a");
(document.body||document.getElementsByTagName("body")[0]).appendChild(this.bookmarkAnchor);
this.bookmarkAnchor.style.display="none";
}
if((!args["changeUrl"])||(dojo.render.html.ie)){
var url=dojo.hostenv.getBaseScriptUri()+"iframe_history.html?"+(new Date()).getTime();
this.moveForward=true;
dojo.io.setIFrameSrc(this.historyIframe,url,false);
}
if(args["changeUrl"]){
hash="#"+((args["changeUrl"]!==true)?args["changeUrl"]:(new Date()).getTime());
setTimeout("window.location.href = '"+hash+"';",1);
this.bookmarkAnchor.href=hash;
if(dojo.render.html.ie){
var _248=_245;
var lh=null;
var hsl=this.historyStack.length-1;
if(hsl>=0){
while(!this.historyStack[hsl]["urlHash"]){
hsl--;
}
lh=this.historyStack[hsl]["urlHash"];
}
if(lh){
_245=function(){
if(window.location.hash!=""){
setTimeout("window.location.href = '"+lh+"';",1);
}
_248();
};
}
this.forwardStack=[];
var _24b=args["forward"]||args["forwardButton"];
var tfw=function(){
if(window.location.hash!=""){
window.location.href=hash;
}
if(_24b){
_24b();
}
};
if(args["forward"]){
args.forward=tfw;
}else{
if(args["forwardButton"]){
args.forwardButton=tfw;
}
}
}else{
if(dojo.render.html.moz){
if(!this.locationTimer){
this.locationTimer=setInterval("dojo.io.XMLHTTPTransport.checkLocation();",200);
}
}
}
}
this.historyStack.push({"url":url,"callback":_245,"kwArgs":args,"urlHash":hash});
};
this.checkLocation=function(){
var hsl=this.historyStack.length;
if((window.location.hash==this.initialHash)||(window.location.href==this.initialHref)&&(hsl==1)){
this.handleBackButton();
return;
}
if(this.forwardStack.length>0){
if(this.forwardStack[this.forwardStack.length-1].urlHash==window.location.hash){
this.handleForwardButton();
return;
}
}
if((hsl>=2)&&(this.historyStack[hsl-2])){
if(this.historyStack[hsl-2].urlHash==window.location.hash){
this.handleBackButton();
return;
}
}
};
this.iframeLoaded=function(evt,_24f){
var isp=_24f.href.split("?");
if(isp.length<2){
if(this.historyStack.length==1){
this.handleBackButton();
}
return;
}
var _251=isp[1];
if(this.moveForward){
this.moveForward=false;
return;
}
var last=this.historyStack.pop();
if(!last){
if(this.forwardStack.length>0){
var next=this.forwardStack[this.forwardStack.length-1];
if(_251==next.url.split("?")[1]){
this.handleForwardButton();
}
}
return;
}
this.historyStack.push(last);
if(this.historyStack.length>=2){
if(isp[1]==this.historyStack[this.historyStack.length-2].url.split("?")[1]){
this.handleBackButton();
}
}else{
this.handleBackButton();
}
};
this.handleBackButton=function(){
var last=this.historyStack.pop();
if(!last){
return;
}
if(last["callback"]){
last.callback();
}else{
if(last.kwArgs["backButton"]){
last.kwArgs["backButton"]();
}else{
if(last.kwArgs["back"]){
last.kwArgs["back"]();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("back");
}
}
}
}
this.forwardStack.push(last);
};
this.handleForwardButton=function(){
var last=this.forwardStack.pop();
if(!last){
return;
}
if(last.kwArgs["forward"]){
last.kwArgs.forward();
}else{
if(last.kwArgs["forwardButton"]){
last.kwArgs.forwardButton();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("forward");
}
}
}
this.historyStack.push(last);
};
this.inFlight=[];
this.inFlightTimer=null;
this.startWatchingInFlight=function(){
if(!this.inFlightTimer){
this.inFlightTimer=setInterval("dojo.io.XMLHTTPTransport.watchInFlight();",10);
}
};
this.watchInFlight=function(){
for(var x=this.inFlight.length-1;x>=0;x--){
var tif=this.inFlight[x];
if(!tif){
this.inFlight.splice(x,1);
continue;
}
if(4==tif.http.readyState){
this.inFlight.splice(x,1);
doLoad(tif.req,tif.http,tif.url,tif.query,tif.useCache);
if(this.inFlight.length==0){
clearInterval(this.inFlightTimer);
this.inFlightTimer=null;
}
}
}
};
var _258=dojo.hostenv.getXmlhttpObject()?true:false;
this.canHandle=function(_259){
return _258&&dojo.lang.inArray(_259["mimetype"],["text/plain","text/html","application/xml","text/xml","text/javascript"])&&dojo.lang.inArray(_259["method"].toLowerCase(),["post","get","head"])&&!(_259["formNode"]&&dojo.io.formHasFile(_259["formNode"]));
};
this.bind=function(_25a){
if(!_25a["url"]){
if(!_25a["formNode"]&&(_25a["backButton"]||_25a["back"]||_25a["changeUrl"]||_25a["watchForURL"])&&(!djConfig.preventBackButtonFix)){
this.addToHistory(_25a);
return true;
}
}
var url=_25a.url;
var _25c="";
if(_25a["formNode"]){
var ta=_25a.formNode.getAttribute("action");
if((ta)&&(!_25a["url"])){
url=ta;
}
var tp=_25a.formNode.getAttribute("method");
if((tp)&&(!_25a["method"])){
_25a.method=tp;
}
_25c+=dojo.io.encodeForm(_25a.formNode,_25a.encoding);
}
if(!_25a["method"]){
_25a.method="get";
}
if(_25a["content"]){
_25c+=dojo.io.argsFromMap(_25a.content,_25a.encoding);
}
if(_25a["postContent"]&&_25a.method.toLowerCase()=="post"){
_25c=_25a.postContent;
}
if(_25a["backButton"]||_25a["back"]||_25a["changeUrl"]){
this.addToHistory(_25a);
}
var _25f=_25a["sync"]?false:true;
var _260=_25a["useCache"]==true||(this.useCache==true&&_25a["useCache"]!=false);
if(_260){
var _261=getFromCache(url,_25c,_25a.method);
if(_261){
doLoad(_25a,_261,url,_25c,false);
return;
}
}
var http=dojo.hostenv.getXmlhttpObject();
var _263=false;
if(_25f){
this.inFlight.push({"req":_25a,"http":http,"url":url,"query":_25c,"useCache":_260});
this.startWatchingInFlight();
}
if(_25a.method.toLowerCase()=="post"){
http.open("POST",url,_25f);
setHeaders(http,_25a);
http.setRequestHeader("Content-Type",_25a["contentType"]||"application/x-www-form-urlencoded");
http.send(_25c);
}else{
var _264=url;
if(_25c!=""){
_264+=(url.indexOf("?")>-1?"&":"?")+_25c;
}
http.open(_25a.method.toUpperCase(),_264,_25f);
setHeaders(http,_25a);
http.send(null);
}
if(!_25f){
doLoad(_25a,http,url,_25c,_260);
}
_25a.abort=function(){
return http.abort();
};
return;
};
dojo.io.transports.addTransport("XMLHTTPTransport");
};
dojo.provide("dojo.io.cookie");
dojo.io.cookie.setCookie=function(name,_266,days,path,_269,_26a){
var _26b=-1;
if(typeof days=="number"&&days>=0){
var d=new Date();
d.setTime(d.getTime()+(days*24*60*60*1000));
_26b=d.toGMTString();
}
_266=escape(_266);
document.cookie=name+"="+_266+";"+(_26b!=-1?" expires="+_26b+";":"")+(path?"path="+path:"")+(_269?"; domain="+_269:"")+(_26a?"; secure":"");
};
dojo.io.cookie.set=dojo.io.cookie.setCookie;
dojo.io.cookie.getCookie=function(name){
var idx=document.cookie.indexOf(name+"=");
if(idx==-1){
return null;
}
value=document.cookie.substring(idx+name.length+1);
var end=value.indexOf(";");
if(end==-1){
end=value.length;
}
value=value.substring(0,end);
value=unescape(value);
return value;
};
dojo.io.cookie.get=dojo.io.cookie.getCookie;
dojo.io.cookie.deleteCookie=function(name){
dojo.io.cookie.setCookie(name,"-",0);
};
dojo.io.cookie.setObjectCookie=function(name,obj,days,path,_275,_276,_277){
if(arguments.length==5){
_277=_275;
}
var _278=[],cookie,value="";
if(!_277){
cookie=dojo.io.cookie.getObjectCookie(name);
}
if(days>=0){
if(!cookie){
cookie={};
}
for(var prop in obj){
if(prop==null){
delete cookie[prop];
}else{
if(typeof obj[prop]=="string"||typeof obj[prop]=="number"){
cookie[prop]=obj[prop];
}
}
}
prop=null;
for(var prop in cookie){
_278.push(escape(prop)+"="+escape(cookie[prop]));
}
value=_278.join("&");
}
dojo.io.cookie.setCookie(name,value,days,path);
};
dojo.io.cookie.getObjectCookie=function(name){
var _27b=null,cookie=dojo.io.cookie.getCookie(name);
if(cookie){
_27b={};
var _27c=cookie.split("&");
for(var i=0;i<_27c.length;i++){
var pair=_27c[i].split("=");
var _27f=pair[1];
if(isNaN(_27f)){
_27f=unescape(pair[1]);
}
_27b[unescape(pair[0])]=_27f;
}
}
return _27b;
};
dojo.io.cookie.isSupported=function(){
if(typeof navigator.cookieEnabled!="boolean"){
dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__","CookiesAllowed",90,null);
var _280=dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
navigator.cookieEnabled=(_280=="CookiesAllowed");
if(navigator.cookieEnabled){
this.deleteCookie("__TestingYourBrowserForCookieSupport__");
}
}
return navigator.cookieEnabled;
};
if(!dojo.io.cookies){
dojo.io.cookies=dojo.io.cookie;
}
dojo.hostenv.conditionalLoadModule({common:["dojo.io",false,false],rhino:["dojo.io.RhinoIO",false,false],browser:[["dojo.io.BrowserIO",false,false],["dojo.io.cookie",false,false]]});
dojo.hostenv.moduleLoaded("dojo.io.*");
dojo.provide("dojo.xml.Parse");
dojo.require("dojo.dom");
dojo.xml.Parse=function(){
this.parseFragment=function(_281){
var _282={};
var _283=dojo.dom.getTagName(_281);
_282[_283]=new Array(_281.tagName);
var _284=this.parseAttributes(_281);
for(var attr in _284){
if(!_282[attr]){
_282[attr]=[];
}
_282[attr][_282[attr].length]=_284[attr];
}
var _286=_281.childNodes;
for(var _287 in _286){
switch(_286[_287].nodeType){
case dojo.dom.ELEMENT_NODE:
_282[_283].push(this.parseElement(_286[_287]));
break;
case dojo.dom.TEXT_NODE:
if(_286.length==1){
if(!_282[_281.tagName]){
_282[_283]=[];
}
_282[_283].push({value:_286[0].nodeValue});
}
break;
}
}
return _282;
};
this.parseElement=function(node,_289,_28a,_28b){
var _28c={};
var _28d=dojo.dom.getTagName(node);
_28c[_28d]=[];
if((!_28a)||(_28d.substr(0,4).toLowerCase()=="dojo")){
var _28e=this.parseAttributes(node);
for(var attr in _28e){
if((!_28c[_28d][attr])||(typeof _28c[_28d][attr]!="array")){
_28c[_28d][attr]=[];
}
_28c[_28d][attr].push(_28e[attr]);
}
_28c[_28d].nodeRef=node;
_28c.tagName=_28d;
_28c.index=_28b||0;
}
var _290=0;
for(var i=0;i<node.childNodes.length;i++){
var tcn=node.childNodes.item(i);
switch(tcn.nodeType){
case dojo.dom.ELEMENT_NODE:
_290++;
var ctn=dojo.dom.getTagName(tcn);
if(!_28c[ctn]){
_28c[ctn]=[];
}
_28c[ctn].push(this.parseElement(tcn,true,_28a,_290));
if((tcn.childNodes.length==1)&&(tcn.childNodes.item(0).nodeType==dojo.dom.TEXT_NODE)){
_28c[ctn][_28c[ctn].length-1].value=tcn.childNodes.item(0).nodeValue;
}
break;
case dojo.dom.TEXT_NODE:
if(node.childNodes.length==1){
_28c[_28d].push({value:node.childNodes.item(0).nodeValue});
}
break;
default:
break;
}
}
return _28c;
};
this.parseAttributes=function(node){
var _295={};
var atts=node.attributes;
for(var i=0;i<atts.length;i++){
var _298=atts.item(i);
if((dojo.render.html.capable)&&(dojo.render.html.ie)){
if(!_298){
continue;
}
if((typeof _298=="object")&&(typeof _298.nodeValue=="undefined")||(_298.nodeValue==null)||(_298.nodeValue=="")){
continue;
}
}
_295[_298.nodeName]={value:_298.nodeValue};
}
return _295;
};
};
dojo.provide("dojo.math");
dojo.math.degToRad=function(x){
return (x*Math.PI)/180;
};
dojo.math.radToDeg=function(x){
return (x*180)/Math.PI;
};
dojo.math.factorial=function(n){
if(n<1){
return 0;
}
var _29c=1;
for(var i=1;i<=n;i++){
_29c*=i;
}
return _29c;
};
dojo.math.permutations=function(n,k){
if(n==0||k==0){
return 1;
}
return (dojo.math.factorial(n)/dojo.math.factorial(n-k));
};
dojo.math.combinations=function(n,r){
if(n==0||r==0){
return 1;
}
return (dojo.math.factorial(n)/(dojo.math.factorial(n-r)*dojo.math.factorial(r)));
};
dojo.math.bernstein=function(t,n,i){
return (dojo.math.combinations(n,i)*Math.pow(t,i)*Math.pow(1-t,n-i));
};
dojo.math.gaussianRandom=function(){
var k=2;
do{
var i=2*Math.random()-1;
var j=2*Math.random()-1;
k=i*i+j*j;
}while(k>=1);
k=Math.sqrt((-2*Math.log(k))/k);
return i*k;
};
dojo.math.mean=function(){
var _2a8=dojo.lang.isArray(arguments[0])?arguments[0]:arguments;
var mean=0;
for(var i=0;i<_2a8.length;i++){
mean+=_2a8[i];
}
return mean/_2a8.length;
};
dojo.math.round=function(_2ab,_2ac){
if(!_2ac){
var _2ad=1;
}else{
var _2ad=Math.pow(10,_2ac);
}
return Math.round(_2ab*_2ad)/_2ad;
};
dojo.math.sd=function(){
var _2ae=dojo.lang.isArray(arguments[0])?arguments[0]:arguments;
return Math.sqrt(dojo.math.variance(_2ae));
};
dojo.math.variance=function(){
var _2af=dojo.lang.isArray(arguments[0])?arguments[0]:arguments;
var mean=0,squares=0;
for(var i=0;i<_2af.length;i++){
mean+=_2af[i];
squares+=Math.pow(_2af[i],2);
}
return (squares/_2af.length)-Math.pow(mean/_2af.length,2);
};
dojo.provide("dojo.graphics.color");
dojo.require("dojo.lang");
dojo.require("dojo.math");
dojo.graphics.color.Color=function(r,g,b,a){
if(dojo.lang.isArray(r)){
this.r=r[0];
this.g=r[1];
this.b=r[2];
this.a=r[3]||1;
}else{
if(dojo.lang.isString(r)){
var rgb=dojo.graphics.color.extractRGB(r);
this.r=rgb[0];
this.g=rgb[1];
this.b=rgb[2];
this.a=g||1;
}else{
if(r instanceof dojo.graphics.color.Color){
this.r=r.r;
this.b=r.b;
this.g=r.g;
this.a=r.a;
}else{
this.r=r;
this.g=g;
this.b=b;
this.a=a;
}
}
}
};
dojo.graphics.color.Color.prototype.toRgb=function(_2b7){
if(_2b7){
return this.toRgba();
}else{
return [this.r,this.g,this.b];
}
};
dojo.graphics.color.Color.prototype.toRgba=function(){
return [this.r,this.g,this.b,this.a];
};
dojo.graphics.color.Color.prototype.toHex=function(){
return dojo.graphics.color.rgb2hex(this.toRgb());
};
dojo.graphics.color.Color.prototype.toCss=function(){
return "rgb("+this.toRgb().join()+")";
};
dojo.graphics.color.Color.prototype.toString=function(){
return this.toHex();
};
dojo.graphics.color.Color.prototype.toHsv=function(){
return dojo.graphics.color.rgb2hsv(this.toRgb());
};
dojo.graphics.color.Color.prototype.toHsl=function(){
return dojo.graphics.color.rgb2hsl(this.toRgb());
};
dojo.graphics.color.Color.prototype.blend=function(_2b8,_2b9){
return dojo.graphics.color.blend(this.toRgb(),new Color(_2b8).toRgb(),_2b9);
};
dojo.graphics.color.named={white:[255,255,255],black:[0,0,0],red:[255,0,0],green:[0,255,0],blue:[0,0,255],navy:[0,0,128],gray:[128,128,128],silver:[192,192,192]};
dojo.graphics.color.blend=function(a,b,_2bc){
if(typeof a=="string"){
return dojo.graphics.color.blendHex(a,b,_2bc);
}
if(!_2bc){
_2bc=0;
}else{
if(_2bc>1){
_2bc=1;
}else{
if(_2bc<-1){
_2bc=-1;
}
}
}
var c=new Array(3);
for(var i=0;i<3;i++){
var half=Math.abs(a[i]-b[i])/2;
c[i]=Math.floor(Math.min(a[i],b[i])+half+(half*_2bc));
}
return c;
};
dojo.graphics.color.blendHex=function(a,b,_2c2){
return dojo.graphics.color.rgb2hex(dojo.graphics.color.blend(dojo.graphics.color.hex2rgb(a),dojo.graphics.color.hex2rgb(b),_2c2));
};
dojo.graphics.color.extractRGB=function(_2c3){
var hex="0123456789abcdef";
_2c3=_2c3.toLowerCase();
if(_2c3.indexOf("rgb")==0){
var _2c5=_2c3.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
var ret=_2c5.splice(1,3);
return ret;
}else{
var _2c7=dojo.graphics.color.hex2rgb(_2c3);
if(_2c7){
return _2c7;
}else{
return dojo.graphics.color.named[_2c3]||[255,255,255];
}
}
};
dojo.graphics.color.hex2rgb=function(hex){
var _2c9="0123456789ABCDEF";
var rgb=new Array(3);
if(hex.indexOf("#")==0){
hex=hex.substring(1);
}
hex=hex.toUpperCase();
if(hex.replace(new RegExp("["+_2c9+"]","g"),"")!=""){
return null;
}
if(hex.length==3){
rgb[0]=hex.charAt(0)+hex.charAt(0);
rgb[1]=hex.charAt(1)+hex.charAt(1);
rgb[2]=hex.charAt(2)+hex.charAt(2);
}else{
rgb[0]=hex.substring(0,2);
rgb[1]=hex.substring(2,4);
rgb[2]=hex.substring(4);
}
for(var i=0;i<rgb.length;i++){
rgb[i]=_2c9.indexOf(rgb[i].charAt(0))*16+_2c9.indexOf(rgb[i].charAt(1));
}
return rgb;
};
dojo.graphics.color.rgb2hex=function(r,g,b){
if(dojo.lang.isArray(r)){
g=r[1]||"00";
b=r[2]||"00";
r=r[0]||"00";
}
r="00"+r.toString(16);
g="00"+g.toString(16);
b="00"+b.toString(16);
return ["#",r.substr(-2,2),g.substr(-2,2),b.substr(-2,2)].join("");
};
dojo.graphics.color.rgb2hsv=function(r,g,b){
if(dojo.lang.isArray(r)){
b=r[2]||0;
g=r[1]||0;
r=r[0]||0;
}
var h=null;
var s=null;
var v=null;
var min=Math.min(r,g,b);
v=Math.max(r,g,b);
var _2d6=v-min;
s=(v==0)?0:_2d6/v;
if(s==0){
h=0;
}else{
if(r==v){
h=60*(g-b)/_2d6;
}else{
if(g==v){
h=120+60*(b-r)/_2d6;
}else{
if(b==v){
h=240+60*(r-g)/_2d6;
}
}
}
if(h<0){
h+=360;
}
}
h=(h==0)?360:Math.ceil((h/360)*255);
s=Math.ceil(s*255);
return [h,s,v];
};
dojo.graphics.color.hsv2rgb=function(h,s,v){
if(dojo.lang.isArray(h)){
v=h[2]||0;
s=h[1]||0;
h=h[0]||0;
}
h=(h/255)*360;
if(h==360){
h=0;
}
s=s/255;
v=v/255;
var r=null;
var g=null;
var b=null;
if(s==0){
r=v;
g=v;
b=v;
}else{
var _2dd=h/60;
var i=Math.floor(_2dd);
var f=_2dd-i;
var p=v*(1-s);
var q=v*(1-(s*f));
var t=v*(1-(s*(1-f)));
switch(i){
case 0:
r=v;
g=t;
b=p;
break;
case 1:
r=q;
g=v;
b=p;
break;
case 2:
r=p;
g=v;
b=t;
break;
case 3:
r=p;
g=q;
b=v;
break;
case 4:
r=t;
g=p;
b=v;
break;
case 5:
r=v;
g=p;
b=q;
break;
}
}
r=Math.ceil(r*255);
g=Math.ceil(g*255);
b=Math.ceil(b*255);
return [r,g,b];
};
dojo.graphics.color.rgb2hsl=function(r,g,b){
if(dojo.lang.isArray(r)){
b=r[2]||0;
g=r[1]||0;
r=r[0]||0;
}
r/=255;
g/=255;
b/=255;
var h=null;
var s=null;
var l=null;
var min=Math.min(r,g,b);
var max=Math.max(r,g,b);
var _2eb=max-min;
l=(min+max)/2;
s=0;
if((l>0)&&(l<1)){
s=_2eb/((l<0.5)?(2*l):(2-2*l));
}
h=0;
if(_2eb>0){
if((max==r)&&(max!=g)){
h+=(g-b)/_2eb;
}
if((max==g)&&(max!=b)){
h+=(2+(b-r)/_2eb);
}
if((max==b)&&(max!=r)){
h+=(4+(r-g)/_2eb);
}
h*=60;
}
h=(h==0)?360:Math.ceil((h/360)*255);
s=Math.ceil(s*255);
l=Math.ceil(l*255);
return [h,s,l];
};
dojo.graphics.color.hsl2rgb=function(h,s,l){
if(dojo.lang.isArray(h)){
l=h[2]||0;
s=h[1]||0;
h=h[0]||0;
}
h=(h/255)*360;
if(h==360){
h=0;
}
s=s/255;
l=l/255;
while(h<0){
h+=360;
}
while(h>360){
h-=360;
}
if(h<120){
r=(120-h)/60;
g=h/60;
b=0;
}else{
if(h<240){
r=0;
g=(240-h)/60;
b=(h-120)/60;
}else{
r=(h-240)/60;
g=0;
b=(360-h)/60;
}
}
r=Math.min(r,1);
g=Math.min(g,1);
b=Math.min(b,1);
r=2*s*r+(1-s);
g=2*s*g+(1-s);
b=2*s*b+(1-s);
if(l<0.5){
r=l*r;
g=l*g;
b=l*b;
}else{
r=(1-l)*r+2*l-1;
g=(1-l)*g+2*l-1;
b=(1-l)*b+2*l-1;
}
r=Math.ceil(r*255);
g=Math.ceil(g*255);
b=Math.ceil(b*255);
return [r,g,b];
};
dojo.provide("dojo.uri.Uri");
dojo.uri=new function(){
this.joinPath=function(){
var arr=[];
for(var i=0;i<arguments.length;i++){
arr.push(arguments[i]);
}
return arr.join("/").replace(/\/{2,}/g,"/").replace(/((https*|ftps*):)/i,"$1/");
};
this.dojoUri=function(uri){
return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(),uri);
};
this.Uri=function(){
var uri=arguments[0];
for(var i=1;i<arguments.length;i++){
if(!arguments[i]){
continue;
}
var _2f4=new dojo.uri.Uri(arguments[i].toString());
var _2f5=new dojo.uri.Uri(uri.toString());
if(_2f4.path==""&&_2f4.scheme==null&&_2f4.authority==null&&_2f4.query==null){
if(_2f4.fragment!=null){
_2f5.fragment=_2f4.fragment;
}
_2f4=_2f5;
}else{
if(_2f4.scheme==null){
_2f4.scheme=_2f5.scheme;
if(_2f4.authority==null){
_2f4.authority=_2f5.authority;
if(_2f4.path.charAt(0)!="/"){
var path=_2f5.path.substring(0,_2f5.path.lastIndexOf("/")+1)+_2f4.path;
var segs=path.split("/");
for(var j=0;j<segs.length;j++){
if(segs[j]=="."){
if(j==segs.length-1){
segs[j]="";
}else{
segs.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&segs[0]=="")&&segs[j]==".."&&segs[j-1]!=".."){
if(j==segs.length-1){
segs.splice(j,1);
segs[j-1]="";
}else{
segs.splice(j-1,2);
j-=2;
}
}
}
}
_2f4.path=segs.join("/");
}
}
}
}
uri="";
if(_2f4.scheme!=null){
uri+=_2f4.scheme+":";
}
if(_2f4.authority!=null){
uri+="//"+_2f4.authority;
}
uri+=_2f4.path;
if(_2f4.query!=null){
uri+="?"+_2f4.query;
}
if(_2f4.fragment!=null){
uri+="#"+_2f4.fragment;
}
}
this.uri=uri.toString();
var _2f9="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
var r=this.uri.match(new RegExp(_2f9));
this.scheme=r[2]||(r[1]?"":null);
this.authority=r[4]||(r[3]?"":null);
this.path=r[5];
this.query=r[7]||(r[6]?"":null);
this.fragment=r[9]||(r[8]?"":null);
if(this.authority!=null){
_2f9="^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
r=this.authority.match(new RegExp(_2f9));
this.user=r[3]||null;
this.password=r[4]||null;
this.host=r[5];
this.port=r[7]||null;
}
this.toString=function(){
return this.uri;
};
};
};
dojo.provide("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.uri.Uri");
dojo.require("dojo.graphics.color");
dojo.style.boxSizing={marginBox:"margin-box",borderBox:"border-box",paddingBox:"padding-box",contentBox:"content-box"};
dojo.style.getBoxSizing=function(node){
if(dojo.render.html.ie||dojo.render.html.opera){
var cm=document["compatMode"];
if(cm=="BackCompat"||cm=="QuirksMode"){
return dojo.style.boxSizing.borderBox;
}else{
return dojo.style.boxSizing.contentBox;
}
}else{
if(arguments.length==0){
node=document.documentElement;
}
var _2fd=dojo.style.getStyle(node,"-moz-box-sizing");
if(!_2fd){
_2fd=dojo.style.getStyle(node,"box-sizing");
}
return (_2fd?_2fd:dojo.style.boxSizing.contentBox);
}
};
dojo.style.isBorderBox=function(node){
return (dojo.style.getBoxSizing(node)==dojo.style.boxSizing.borderBox);
};
dojo.style.getUnitValue=function(_2ff,_300,_301){
var _302={value:0,units:"px"};
var s=dojo.style.getComputedStyle(_2ff,_300);
if(s==""||(s=="auto"&&_301)){
return _302;
}
if(dojo.lang.isUndefined(s)){
_302.value=NaN;
}else{
var _304=s.match(/([\d.]+)([a-z%]*)/i);
if(!_304){
_302.value=NaN;
}else{
_302.value=Number(_304[1]);
_302.units=_304[2].toLowerCase();
}
}
return _302;
};
dojo.style.getPixelValue=function(_305,_306,_307){
var _308=dojo.style.getUnitValue(_305,_306,_307);
if(isNaN(_308.value)||(_308.value&&_308.units!="px")){
return NaN;
}
return _308.value;
};
dojo.style.getNumericStyle=dojo.style.getPixelValue;
dojo.style.isPositionAbsolute=function(node){
return (dojo.style.getComputedStyle(node,"position")=="absolute");
};
dojo.style.getMarginWidth=function(node){
var _30b=dojo.style.isPositionAbsolute(node);
var left=dojo.style.getPixelValue(node,"margin-left",_30b);
var _30d=dojo.style.getPixelValue(node,"margin-right",_30b);
return left+_30d;
};
dojo.style.getBorderWidth=function(node){
var left=(dojo.style.getStyle(node,"border-left-style")=="none"?0:dojo.style.getPixelValue(node,"border-left-width"));
var _310=(dojo.style.getStyle(node,"border-right-style")=="none"?0:dojo.style.getPixelValue(node,"border-right-width"));
return left+_310;
};
dojo.style.getPaddingWidth=function(node){
var left=dojo.style.getPixelValue(node,"padding-left",true);
var _313=dojo.style.getPixelValue(node,"padding-right",true);
return left+_313;
};
dojo.style.getContentWidth=function(node){
return node.offsetWidth-dojo.style.getPaddingWidth(node)-dojo.style.getBorderWidth(node);
};
dojo.style.getInnerWidth=function(node){
return node.offsetWidth;
};
dojo.style.getOuterWidth=function(node){
return dojo.style.getInnerWidth(node)+dojo.style.getMarginWidth(node);
};
dojo.style.setOuterWidth=function(node,_318){
if(!dojo.style.isBorderBox(node)){
_318-=dojo.style.getPaddingWidth(node)+dojo.style.getBorderWidth(node);
}
_318-=dojo.style.getMarginWidth(node);
if(!isNaN(_318)&&_318>0){
node.style.width=_318+"px";
return true;
}else{
return false;
}
};
dojo.style.getContentBoxWidth=dojo.style.getContentWidth;
dojo.style.getBorderBoxWidth=dojo.style.getInnerWidth;
dojo.style.getMarginBoxWidth=dojo.style.getOuterWidth;
dojo.style.setMarginBoxWidth=dojo.style.setOuterWidth;
dojo.style.getMarginHeight=function(node){
var _31a=dojo.style.isPositionAbsolute(node);
var top=dojo.style.getPixelValue(node,"margin-top",_31a);
var _31c=dojo.style.getPixelValue(node,"margin-bottom",_31a);
return top+_31c;
};
dojo.style.getBorderHeight=function(node){
var top=(dojo.style.getStyle(node,"border-top-style")=="none"?0:dojo.style.getPixelValue(node,"border-top-width"));
var _31f=(dojo.style.getStyle(node,"border-bottom-style")=="none"?0:dojo.style.getPixelValue(node,"border-bottom-width"));
return top+_31f;
};
dojo.style.getPaddingHeight=function(node){
var top=dojo.style.getPixelValue(node,"padding-top",true);
var _322=dojo.style.getPixelValue(node,"padding-bottom",true);
return top+_322;
};
dojo.style.getContentHeight=function(node){
return node.offsetHeight-dojo.style.getPaddingHeight(node)-dojo.style.getBorderHeight(node);
};
dojo.style.getInnerHeight=function(node){
return node.offsetHeight;
};
dojo.style.getOuterHeight=function(node){
return dojo.style.getInnerHeight(node)+dojo.style.getMarginHeight(node);
};
dojo.style.setOuterHeight=function(node,_327){
if(!dojo.style.isBorderBox(node)){
_327-=dojo.style.getPaddingHeight(node)+dojo.style.getBorderHeight(node);
}
_327-=dojo.style.getMarginHeight(node);
if(!isNaN(_327)&&_327>0){
node.style.height=_327+"px";
return true;
}else{
return false;
}
};
dojo.style.setContentWidth=function(node,_329){
if(dojo.style.isBorderBox(node)){
_329+=dojo.style.getPaddingWidth(node)+dojo.style.getBorderWidth(node);
}
if(!isNaN(_329)&&_329>0){
node.style.width=_329+"px";
return true;
}else{
return false;
}
};
dojo.style.setContentHeight=function(node,_32b){
if(dojo.style.isBorderBox(node)){
_32b+=dojo.style.getPaddingHeight(node)+dojo.style.getBorderHeight(node);
}
if(!isNaN(_32b)&&_32b>0){
node.style.height=_32b+"px";
return true;
}else{
return false;
}
};
dojo.style.getContentBoxHeight=dojo.style.getContentHeight;
dojo.style.getBorderBoxHeight=dojo.style.getInnerHeight;
dojo.style.getMarginBoxHeight=dojo.style.getOuterHeight;
dojo.style.setMarginBoxHeight=dojo.style.setOuterHeight;
dojo.style.getTotalOffset=function(node,type,_32e){
var _32f=(type=="top")?"offsetTop":"offsetLeft";
var _330=(type=="top")?"scrollTop":"scrollLeft";
var alt=(type=="top")?"y":"x";
var ret=0;
if(node["offsetParent"]){
if(_32e){
ret-=dojo.style.sumAncestorProperties(node,_330);
}
do{
ret+=node[_32f];
node=node.offsetParent;
}while(node!=document.getElementsByTagName("body")[0].parentNode&&node!=null);
}else{
if(node[alt]){
ret+=node[alt];
}
}
return ret;
};
dojo.style.sumAncestorProperties=function(node,prop){
if(!node){
return 0;
}
var _335=0;
while(node){
var val=node[prop];
if(val){
_335+=val-0;
}
node=node.parentNode;
}
return _335;
};
dojo.style.totalOffsetLeft=function(node,_338){
return dojo.style.getTotalOffset(node,"left",_338);
};
dojo.style.getAbsoluteX=dojo.style.totalOffsetLeft;
dojo.style.totalOffsetTop=function(node,_33a){
return dojo.style.getTotalOffset(node,"top",_33a);
};
dojo.style.getAbsoluteY=dojo.style.totalOffsetTop;
dojo.style.getAbsolutePosition=function(node,_33c){
var _33d=[dojo.style.getAbsoluteX(node,_33c),dojo.style.getAbsoluteY(node,_33c)];
_33d.x=_33d[0];
_33d.y=_33d[1];
return _33d;
};
dojo.style.styleSheet=null;
dojo.style.insertCssRule=function(_33e,_33f,_340){
if(!dojo.style.styleSheet){
if(document.createStyleSheet){
dojo.style.styleSheet=document.createStyleSheet();
}else{
if(document.styleSheets[0]){
dojo.style.styleSheet=document.styleSheets[0];
}else{
return null;
}
}
}
if(arguments.length<3){
if(dojo.style.styleSheet.cssRules){
_340=dojo.style.styleSheet.cssRules.length;
}else{
if(dojo.style.styleSheet.rules){
_340=dojo.style.styleSheet.rules.length;
}else{
return null;
}
}
}
if(dojo.style.styleSheet.insertRule){
var rule=_33e+" { "+_33f+" }";
return dojo.style.styleSheet.insertRule(rule,_340);
}else{
if(dojo.style.styleSheet.addRule){
return dojo.style.styleSheet.addRule(_33e,_33f,_340);
}else{
return null;
}
}
};
dojo.style.removeCssRule=function(_342){
if(!dojo.style.styleSheet){
dojo.debug("no stylesheet defined for removing rules");
return false;
}
if(dojo.render.html.ie){
if(!_342){
_342=dojo.style.styleSheet.rules.length;
dojo.style.styleSheet.removeRule(_342);
}
}else{
if(document.styleSheets[0]){
if(!_342){
_342=dojo.style.styleSheet.cssRules.length;
}
dojo.style.styleSheet.deleteRule(_342);
}
}
return true;
};
dojo.style.insertCssFile=function(URI,doc,_345){
if(!URI){
return;
}
if(!doc){
doc=document;
}
if(doc.baseURI){
URI=new dojo.uri.Uri(doc.baseURI,URI);
}
if(_345&&doc.styleSheets){
var loc=location.href.split("#")[0].substring(0,location.href.indexOf(location.pathname));
for(var i=0;i<doc.styleSheets.length;i++){
if(doc.styleSheets[i].href&&URI.toString()==new dojo.uri.Uri(doc.styleSheets[i].href.toString())){
return;
}
}
}
var file=doc.createElement("link");
file.setAttribute("type","text/css");
file.setAttribute("rel","stylesheet");
file.setAttribute("href",URI);
var head=doc.getElementsByTagName("head")[0];
if(head){
head.appendChild(file);
}
};
dojo.style.getBackgroundColor=function(node){
var _34b;
do{
_34b=dojo.style.getStyle(node,"background-color");
if(_34b.toLowerCase()=="rgba(0, 0, 0, 0)"){
_34b="transparent";
}
if(node==document.getElementsByTagName("body")[0]){
node=null;
break;
}
node=node.parentNode;
}while(node&&dojo.lang.inArray(_34b,["transparent",""]));
if(_34b=="transparent"){
_34b=[255,255,255,0];
}else{
_34b=dojo.graphics.color.extractRGB(_34b);
}
return _34b;
};
dojo.style.getComputedStyle=function(_34c,_34d,_34e){
var _34f=_34e;
if(_34c.style.getPropertyValue){
_34f=_34c.style.getPropertyValue(_34d);
}
if(!_34f){
if(document.defaultView){
_34f=document.defaultView.getComputedStyle(_34c,"").getPropertyValue(_34d);
}else{
if(_34c.currentStyle){
_34f=_34c.currentStyle[dojo.style.toCamelCase(_34d)];
}
}
}
return _34f;
};
dojo.style.getStyle=function(_350,_351){
var _352=dojo.style.toCamelCase(_351);
var _353=_350.style[_352];
return (_353?_353:dojo.style.getComputedStyle(_350,_351,_353));
};
dojo.style.toCamelCase=function(_354){
var arr=_354.split("-"),cc=arr[0];
for(var i=1;i<arr.length;i++){
cc+=arr[i].charAt(0).toUpperCase()+arr[i].substring(1);
}
return cc;
};
dojo.style.toSelectorCase=function(_357){
return _357.replace(/([A-Z])/g,"-$1").toLowerCase();
};
dojo.style.setOpacity=function setOpacity(node,_359,_35a){
var h=dojo.render.html;
if(!_35a){
if(_359>=1){
if(h.ie){
dojo.style.clearOpacity(node);
return;
}else{
_359=0.999999;
}
}else{
if(_359<0){
_359=0;
}
}
}
if(h.ie){
if(node.nodeName.toLowerCase()=="tr"){
var tds=node.getElementsByTagName("td");
for(var x=0;x<tds.length;x++){
tds[x].style.filter="Alpha(Opacity="+_359*100+")";
}
}
node.style.filter="Alpha(Opacity="+_359*100+")";
}else{
if(h.moz){
node.style.opacity=_359;
node.style.MozOpacity=_359;
}else{
if(h.safari){
node.style.opacity=_359;
node.style.KhtmlOpacity=_359;
}else{
node.style.opacity=_359;
}
}
}
};
dojo.style.getOpacity=function getOpacity(node){
if(dojo.render.html.ie){
var opac=(node.filters&&node.filters.alpha&&typeof node.filters.alpha.opacity=="number"?node.filters.alpha.opacity:100)/100;
}else{
var opac=node.style.opacity||node.style.MozOpacity||node.style.KhtmlOpacity||1;
}
return opac>=0.999999?1:Number(opac);
};
dojo.style.clearOpacity=function clearOpacity(node){
var h=dojo.render.html;
if(h.ie){
if(node.filters&&node.filters.alpha){
node.style.filter="";
}
}else{
if(h.moz){
node.style.opacity=1;
node.style.MozOpacity=1;
}else{
if(h.safari){
node.style.opacity=1;
node.style.KhtmlOpacity=1;
}else{
node.style.opacity=1;
}
}
}
};
dojo.provide("dojo.xml.domUtil");
dojo.require("dojo.graphics.color");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dj_deprecated("dojo.xml.domUtil is deprecated, use dojo.dom instead");
dojo.xml.domUtil=new function(){
this.nodeTypes={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
this.dojoml="http://www.dojotoolkit.org/2004/dojoml";
this.idIncrement=0;
this.getTagName=function(){
return dojo.dom.getTagName.apply(dojo.dom,arguments);
};
this.getUniqueId=function(){
return dojo.dom.getUniqueId.apply(dojo.dom,arguments);
};
this.getFirstChildTag=function(){
return dojo.dom.getFirstChildElement.apply(dojo.dom,arguments);
};
this.getLastChildTag=function(){
return dojo.dom.getLastChildElement.apply(dojo.dom,arguments);
};
this.getNextSiblingTag=function(){
return dojo.dom.getNextSiblingElement.apply(dojo.dom,arguments);
};
this.getPreviousSiblingTag=function(){
return dojo.dom.getPreviousSiblingElement.apply(dojo.dom,arguments);
};
this.forEachChildTag=function(node,_363){
var _364=this.getFirstChildTag(node);
while(_364){
if(_363(_364)=="break"){
break;
}
_364=this.getNextSiblingTag(_364);
}
};
this.moveChildren=function(){
return dojo.dom.moveChildren.apply(dojo.dom,arguments);
};
this.copyChildren=function(){
return dojo.dom.copyChildren.apply(dojo.dom,arguments);
};
this.clearChildren=function(){
return dojo.dom.removeChildren.apply(dojo.dom,arguments);
};
this.replaceChildren=function(){
return dojo.dom.replaceChildren.apply(dojo.dom,arguments);
};
this.getStyle=function(){
return dojo.style.getStyle.apply(dojo.style,arguments);
};
this.toCamelCase=function(){
return dojo.style.toCamelCase.apply(dojo.style,arguments);
};
this.toSelectorCase=function(){
return dojo.style.toSelectorCase.apply(dojo.style,arguments);
};
this.getAncestors=function(){
return dojo.dom.getAncestors.apply(dojo.dom,arguments);
};
this.isChildOf=function(){
return dojo.dom.isDescendantOf.apply(dojo.dom,arguments);
};
this.createDocumentFromText=function(){
return dojo.dom.createDocumentFromText.apply(dojo.dom,arguments);
};
if(dojo.render.html.capable||dojo.render.svg.capable){
this.createNodesFromText=function(txt,wrap){
return dojo.dom.createNodesFromText.apply(dojo.dom,arguments);
};
}
this.extractRGB=function(_367){
return dojo.graphics.color.extractRGB(_367);
};
this.hex2rgb=function(hex){
return dojo.graphics.color.hex2rgb(hex);
};
this.rgb2hex=function(r,g,b){
return dojo.graphics.color.rgb2hex(r,g,b);
};
this.insertBefore=function(){
return dojo.dom.insertBefore.apply(dojo.dom,arguments);
};
this.before=this.insertBefore;
this.insertAfter=function(){
return dojo.dom.insertAfter.apply(dojo.dom,arguments);
};
this.after=this.insertAfter;
this.insert=function(){
return dojo.dom.insertAtPosition.apply(dojo.dom,arguments);
};
this.insertAtIndex=function(){
return dojo.dom.insertAtIndex.apply(dojo.dom,arguments);
};
this.textContent=function(){
return dojo.dom.textContent.apply(dojo.dom,arguments);
};
this.renderedTextContent=function(){
return dojo.dom.renderedTextContent.apply(dojo.dom,arguments);
};
this.remove=function(node){
return dojo.dom.removeNode.apply(dojo.dom,arguments);
};
};
dojo.provide("dojo.html");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.require("dojo.string");
dojo.lang.mixin(dojo.html,dojo.dom);
dojo.lang.mixin(dojo.html,dojo.style);
dojo.html.clearSelection=function(){
try{
if(window.getSelection){
window.getSelection().removeAllRanges();
}else{
if(document.selection&&document.selection.clear){
document.selection.clear();
}
}
}
catch(e){
dojo.debug(e);
}
};
dojo.html.disableSelection=function(_36d){
if(arguments.length==0){
_36d=dojo.html.body();
}
if(dojo.render.html.mozilla){
_36d.style.MozUserSelect="none";
}else{
if(dojo.render.html.safari){
_36d.style.KhtmlUserSelect="none";
}else{
if(dojo.render.html.ie){
_36d.unselectable="on";
}
}
}
};
dojo.html.enableSelection=function(_36e){
if(arguments.length==0){
_36e=dojo.html.body();
}
if(dojo.render.html.mozilla){
_36e.style.MozUserSelect="";
}else{
if(dojo.render.html.safari){
_36e.style.KhtmlUserSelect="";
}else{
if(dojo.render.html.ie){
_36e.unselectable="off";
}
}
}
};
dojo.html.selectElement=function(_36f){
if(document.selection&&dojo.html.body().createTextRange){
var _370=dojo.html.body().createTextRange();
_370.moveToElementText(_36f);
_370.select();
}else{
if(window.getSelection){
var _371=window.getSelection();
if(_371.selectAllChildren){
_371.selectAllChildren(_36f);
}
}
}
};
dojo.html.isSelectionCollapsed=function(){
if(document.selection){
return document.selection.createRange().text=="";
}else{
if(window.getSelection){
var _372=window.getSelection();
if(dojo.lang.isString(_372)){
return _372=="";
}else{
return _372.isCollapsed;
}
}
}
};
dojo.html.getEventTarget=function(evt){
if((window["event"])&&(window.event["srcElement"])){
return window.event.srcElement;
}else{
if((evt)&&(evt.target)){
return evt.target;
}
}
};
dojo.html.getScrollTop=function(){
return document.documentElement.scrollTop||dojo.html.body().scrollTop||0;
};
dojo.html.getScrollLeft=function(){
return document.documentElement.scrollLeft||dojo.html.body().scrollLeft||0;
};
dojo.html.getDocumentWidth=function(){
dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
return dojo.html.getViewportWidth();
};
dojo.html.getDocumentHeight=function(){
dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
return dojo.html.getViewportHeight();
};
dojo.html.getDocumentSize=function(){
dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
return dojo.html.getViewportSize();
};
dojo.html.getViewportWidth=function(){
var w=0;
if(window.innerWidth){
w=window.innerWidth;
}
if(document.documentElement&&document.documentElement.clientWidth){
var w2=document.documentElement.clientWidth;
if(!w||w2&&w2<w){
w=w2;
}
return w;
}
if(document.body){
return document.body.clientWidth;
}
return 0;
};
dojo.html.getViewportHeight=function(){
if(window.innerHeight){
return window.innerHeight;
}
if(document.documentElement&&document.documentElement.clientHeight){
return document.documentElement.clientHeight;
}
if(document.body){
return document.body.clientHeight;
}
return 0;
};
dojo.html.getViewportSize=function(){
return [dojo.html.getViewportWidth(),dojo.html.getViewportHeight()];
};
dojo.html.getScrollOffset=function(){
if(window.pageYOffset){
return [window.pageXOffset,window.pageYOffset];
}
if(document.documentElement&&document.documentElement.scrollTop){
return [document.documentElement.scrollLeft,document.documentElement.scrollTop];
}
if(document.body){
return [document.body.scrollLeft,document.body.scrollTop];
}
return [0,0];
};
dojo.html.getParentOfType=function(node,type){
var _378=node;
type=type.toLowerCase();
while(_378.nodeName.toLowerCase()!=type){
if((!_378)||(_378==(document["body"]||document["documentElement"]))){
return null;
}
_378=_378.parentNode;
}
return _378;
};
dojo.html.getAttribute=function(node,attr){
if((!node)||(!node.getAttribute)){
return null;
}
var ta=typeof attr=="string"?attr:new String(attr);
var v=node.getAttribute(ta.toUpperCase());
if((v)&&(typeof v=="string")&&(v!="")){
return v;
}
if(v&&typeof v=="object"&&v.value){
return v.value;
}
if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
return (node.getAttributeNode(ta)).value;
}else{
if(node.getAttribute(ta)){
return node.getAttribute(ta);
}else{
if(node.getAttribute(ta.toLowerCase())){
return node.getAttribute(ta.toLowerCase());
}
}
}
return null;
};
dojo.html.hasAttribute=function(node,attr){
var v=dojo.html.getAttribute(node,attr);
return v?true:false;
};
dojo.html.getClass=function(node){
if(node.className){
return node.className;
}else{
if(dojo.html.hasAttribute(node,"class")){
return dojo.html.getAttribute(node,"class");
}
}
return "";
};
dojo.html.hasClass=function(node,_382){
var _383=dojo.html.getClass(node).split(/\s+/g);
for(var x=0;x<_383.length;x++){
if(_382==_383[x]){
return true;
}
}
return false;
};
dojo.html.prependClass=function(node,_386){
if(!node){
return null;
}
if(dojo.html.hasAttribute(node,"class")||node.className){
_386+=" "+(node.className||dojo.html.getAttribute(node,"class"));
}
return dojo.html.setClass(node,_386);
};
dojo.html.addClass=function(node,_388){
if(!node){
throw new Error("addClass: node does not exist");
}
if(dojo.html.hasClass(node,_388)){
return false;
}
if(dojo.html.hasAttribute(node,"class")||node.className){
_388=(node.className||dojo.html.getAttribute(node,"class"))+" "+_388;
}
return dojo.html.setClass(node,_388);
};
dojo.html.setClass=function(node,_38a){
if(!node){
return false;
}
var cs=new String(_38a);
try{
if(typeof node.className=="string"){
node.className=cs;
}else{
if(node.setAttribute){
node.setAttribute("class",_38a);
node.className=cs;
}else{
return false;
}
}
}
catch(e){
dojo.debug("__util__.setClass() failed",e);
}
return true;
};
dojo.html.removeClass=function(node,_38d,_38e){
if(!node){
return false;
}
var _38d=dojo.string.trim(new String(_38d));
try{
var cs=String(node.className).split(" ");
var nca=[];
if(_38e){
for(var i=0;i<cs.length;i++){
if(cs[i].indexOf(_38d)==-1){
nca.push(cs[i]);
}
}
}else{
for(var i=0;i<cs.length;i++){
if(cs[i]!=_38d){
nca.push(cs[i]);
}
}
}
node.className=nca.join(" ");
}
catch(e){
dojo.debug("__util__.removeClass() failed",e);
}
return true;
};
dojo.html.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
dojo.html.getElementsByClass=function(_392,_393,_394,_395){
if(!_393){
_393=document;
}
var _396=_392.split(/\s+/g);
var _397=[];
if(_395!=1&&_395!=2){
_395=0;
}
var _398=new RegExp("(\\s|^)(("+_396.join(")|(")+"))(\\s|$)");
if(false&&document.evaluate){
var _399="//"+(_394||"*")+"[contains(";
if(_395!=dojo.html.classMatchType.ContainsAny){
_399+="concat(' ',@class,' '), ' "+_396.join(" ') and contains(concat(' ',@class,' '), ' ")+" ')]";
}else{
_399+="concat(' ',@class,' '), ' "+_396.join(" ')) or contains(concat(' ',@class,' '), ' ")+" ')]";
}
var _39a=document.evaluate(_399,_393,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
outer:
for(var node=null,i=0;node=_39a.snapshotItem(i);i++){
if(_395!=dojo.html.classMatchType.IsOnly){
_397.push(node);
}else{
if(!dojo.html.getClass(node)){
continue outer;
}
var _39c=dojo.html.getClass(node).split(/\s+/g);
for(var j=0;j<_39c.length;j++){
if(!_39c[j].match(_398)){
continue outer;
}
}
_397.push(node);
}
}
}else{
if(!_394){
_394="*";
}
var _39e=_393.getElementsByTagName(_394);
outer:
for(var i=0;i<_39e.length;i++){
var node=_39e[i];
if(!dojo.html.getClass(node)){
continue outer;
}
var _39c=dojo.html.getClass(node).split(/\s+/g);
var _3a0=0;
for(var j=0;j<_39c.length;j++){
if(_398.test(_39c[j])){
if(_395==dojo.html.classMatchType.ContainsAny){
_397.push(node);
continue outer;
}else{
_3a0++;
}
}else{
if(_395==dojo.html.classMatchType.IsOnly){
continue outer;
}
}
}
if(_3a0==_396.length){
if(_395==dojo.html.classMatchType.IsOnly&&_3a0==_39c.length){
_397.push(node);
}else{
if(_395==dojo.html.classMatchType.ContainsAll){
_397.push(node);
}
}
}
}
}
return _397;
};
dojo.html.gravity=function(node,e){
var _3a3=e.pageX||e.clientX+dojo.html.body().scrollLeft;
var _3a4=e.pageY||e.clientY+dojo.html.body().scrollTop;
with(dojo.html){
var _3a5=getAbsoluteX(node)+(getInnerWidth(node)/2);
var _3a6=getAbsoluteY(node)+(getInnerHeight(node)/2);
}
with(dojo.html.gravity){
return ((_3a3<_3a5?WEST:EAST)|(_3a4<_3a6?NORTH:SOUTH));
}
};
dojo.html.gravity.NORTH=1;
dojo.html.gravity.SOUTH=1<<1;
dojo.html.gravity.EAST=1<<2;
dojo.html.gravity.WEST=1<<3;
dojo.html.overElement=function(_3a7,e){
var _3a9=e.pageX||e.clientX+dojo.html.body().scrollLeft;
var _3aa=e.pageY||e.clientY+dojo.html.body().scrollTop;
with(dojo.html){
var top=getAbsoluteY(_3a7);
var _3ac=top+getInnerHeight(_3a7);
var left=getAbsoluteX(_3a7);
var _3ae=left+getInnerWidth(_3a7);
}
return (_3a9>=left&&_3a9<=_3ae&&_3aa>=top&&_3aa<=_3ac);
};
dojo.html.renderedTextContent=function(node){
var _3b0="";
if(node==null){
return _3b0;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
switch(dojo.style.getStyle(node.childNodes[i],"display")){
case "block":
case "list-item":
case "run-in":
case "table":
case "table-row-group":
case "table-header-group":
case "table-footer-group":
case "table-row":
case "table-column-group":
case "table-column":
case "table-cell":
case "table-caption":
_3b0+="\n";
_3b0+=dojo.html.renderedTextContent(node.childNodes[i]);
_3b0+="\n";
break;
case "none":
break;
default:
_3b0+=dojo.html.renderedTextContent(node.childNodes[i]);
break;
}
break;
case 3:
case 2:
case 4:
var text=node.childNodes[i].nodeValue;
switch(dojo.style.getStyle(node,"text-transform")){
case "capitalize":
text=dojo.string.capitalize(text);
break;
case "uppercase":
text=text.toUpperCase();
break;
case "lowercase":
text=text.toLowerCase();
break;
default:
break;
}
switch(dojo.style.getStyle(node,"text-transform")){
case "nowrap":
break;
case "pre-wrap":
break;
case "pre-line":
break;
case "pre":
break;
default:
text=text.replace(/\s+/," ");
if(/\s$/.test(_3b0)){
text.replace(/^\s/,"");
}
break;
}
_3b0+=text;
break;
default:
break;
}
}
return _3b0;
};
dojo.html.setActiveStyleSheet=function(_3b3){
var i,a,main;
for(i=0;(a=document.getElementsByTagName("link")[i]);i++){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")){
a.disabled=true;
if(a.getAttribute("title")==_3b3){
a.disabled=false;
}
}
}
};
dojo.html.getActiveStyleSheet=function(){
var i,a;
for(i=0;(a=document.getElementsByTagName("link")[i]);i++){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")&&!a.disabled){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.getPreferredStyleSheet=function(){
var i,a;
for(i=0;(a=document.getElementsByTagName("link")[i]);i++){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("rel").indexOf("alt")==-1&&a.getAttribute("title")){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.body=function(){
return document.body||document.getElementsByTagName("body")[0];
};
dojo.html.createNodesFromText=function(txt,wrap){
var tn=document.createElement("div");
tn.style.visibility="hidden";
document.body.appendChild(tn);
tn.innerHTML=txt;
tn.normalize();
if(wrap){
var ret=[];
var fc=tn.firstChild;
ret[0]=((fc.nodeValue==" ")||(fc.nodeValue=="\t"))?fc.nextSibling:fc;
document.body.removeChild(tn);
return ret;
}
var _3bc=[];
for(var x=0;x<tn.childNodes.length;x++){
_3bc.push(tn.childNodes[x].cloneNode(true));
}
tn.style.display="none";
document.body.removeChild(tn);
return _3bc;
};
if(!dojo.evalObjPath("dojo.dom.createNodesFromText")){
dojo.dom.createNodesFromText=function(){
dojo.deprecated("dojo.dom.createNodesFromText","use dojo.html.createNodesFromText instead");
return dojo.html.createNodesFromText.apply(dojo.html,arguments);
};
}
dojo.html.getAncestorsByTag=function(node,tag,_3c0){
tag=tag.toLowerCase();
return dojo.dom.getAncestors(node,function(el){
return el.tagName&&(el.tagName.toLowerCase()==tag);
},_3c0);
};
dojo.html.getFirstAncestorByTag=function(node,tag){
return dojo.html.getAncestorsByTag(node,tag,true);
};
dojo.provide("dojo.xml.htmlUtil");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dj_deprecated("dojo.xml.htmlUtil is deprecated, use dojo.html instead");
dojo.xml.htmlUtil=new function(){
this.styleSheet=dojo.style.styleSheet;
this._clobberSelection=function(){
return dojo.html.clearSelection.apply(dojo.html,arguments);
};
this.disableSelect=function(){
return dojo.html.disableSelection.apply(dojo.html,arguments);
};
this.enableSelect=function(){
return dojo.html.enableSelection.apply(dojo.html,arguments);
};
this.getInnerWidth=function(){
return dojo.style.getInnerWidth.apply(dojo.style,arguments);
};
this.getOuterWidth=function(node){
dj_unimplemented("dojo.xml.htmlUtil.getOuterWidth");
};
this.getInnerHeight=function(){
return dojo.style.getInnerHeight.apply(dojo.style,arguments);
};
this.getOuterHeight=function(node){
dj_unimplemented("dojo.xml.htmlUtil.getOuterHeight");
};
this.getTotalOffset=function(){
return dojo.style.getTotalOffset.apply(dojo.style,arguments);
};
this.totalOffsetLeft=function(){
return dojo.style.totalOffsetLeft.apply(dojo.style,arguments);
};
this.getAbsoluteX=this.totalOffsetLeft;
this.totalOffsetTop=function(){
return dojo.style.totalOffsetTop.apply(dojo.style,arguments);
};
this.getAbsoluteY=this.totalOffsetTop;
this.getEventTarget=function(){
return dojo.html.getEventTarget.apply(dojo.html,arguments);
};
this.getScrollTop=function(){
return dojo.html.getScrollTop.apply(dojo.html,arguments);
};
this.getScrollLeft=function(){
return dojo.html.getScrollLeft.apply(dojo.html,arguments);
};
this.evtTgt=this.getEventTarget;
this.getParentOfType=function(){
return dojo.html.getParentOfType.apply(dojo.html,arguments);
};
this.getAttribute=function(){
return dojo.html.getAttribute.apply(dojo.html,arguments);
};
this.getAttr=function(node,attr){
dj_deprecated("dojo.xml.htmlUtil.getAttr is deprecated, use dojo.xml.htmlUtil.getAttribute instead");
return dojo.xml.htmlUtil.getAttribute(node,attr);
};
this.hasAttribute=function(){
return dojo.html.hasAttribute.apply(dojo.html,arguments);
};
this.hasAttr=function(node,attr){
dj_deprecated("dojo.xml.htmlUtil.hasAttr is deprecated, use dojo.xml.htmlUtil.hasAttribute instead");
return dojo.xml.htmlUtil.hasAttribute(node,attr);
};
this.getClass=function(){
return dojo.html.getClass.apply(dojo.html,arguments);
};
this.hasClass=function(){
return dojo.html.hasClass.apply(dojo.html,arguments);
};
this.prependClass=function(){
return dojo.html.prependClass.apply(dojo.html,arguments);
};
this.addClass=function(){
return dojo.html.addClass.apply(dojo.html,arguments);
};
this.setClass=function(){
return dojo.html.setClass.apply(dojo.html,arguments);
};
this.removeClass=function(){
return dojo.html.removeClass.apply(dojo.html,arguments);
};
this.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
this.getElementsByClass=function(){
return dojo.html.getElementsByClass.apply(dojo.html,arguments);
};
this.getElementsByClassName=this.getElementsByClass;
this.setOpacity=function(){
return dojo.style.setOpacity.apply(dojo.style,arguments);
};
this.getOpacity=function(){
return dojo.style.getOpacity.apply(dojo.style,arguments);
};
this.clearOpacity=function(){
return dojo.style.clearOpacity.apply(dojo.style,arguments);
};
this.gravity=function(){
return dojo.html.gravity.apply(dojo.html,arguments);
};
this.gravity.NORTH=1;
this.gravity.SOUTH=1<<1;
this.gravity.EAST=1<<2;
this.gravity.WEST=1<<3;
this.overElement=function(){
return dojo.html.overElement.apply(dojo.html,arguments);
};
this.insertCssRule=function(){
return dojo.style.insertCssRule.apply(dojo.style,arguments);
};
this.insertCSSRule=function(_3ca,_3cb,_3cc){
dj_deprecated("dojo.xml.htmlUtil.insertCSSRule is deprecated, use dojo.xml.htmlUtil.insertCssRule instead");
return dojo.xml.htmlUtil.insertCssRule(_3ca,_3cb,_3cc);
};
this.removeCssRule=function(){
return dojo.style.removeCssRule.apply(dojo.style,arguments);
};
this.removeCSSRule=function(_3cd){
dj_deprecated("dojo.xml.htmlUtil.removeCSSRule is deprecated, use dojo.xml.htmlUtil.removeCssRule instead");
return dojo.xml.htmlUtil.removeCssRule(_3cd);
};
this.insertCssFile=function(){
return dojo.style.insertCssFile.apply(dojo.style,arguments);
};
this.insertCSSFile=function(URI,doc,_3d0){
dj_deprecated("dojo.xml.htmlUtil.insertCSSFile is deprecated, use dojo.xml.htmlUtil.insertCssFile instead");
return dojo.xml.htmlUtil.insertCssFile(URI,doc,_3d0);
};
this.getBackgroundColor=function(){
return dojo.style.getBackgroundColor.apply(dojo.style,arguments);
};
this.getUniqueId=function(){
return dojo.dom.getUniqueId();
};
this.getStyle=function(){
return dojo.style.getStyle.apply(dojo.style,arguments);
};
};
dojo.require("dojo.xml.Parse");
dojo.hostenv.conditionalLoadModule({common:["dojo.xml.domUtil"],browser:["dojo.xml.htmlUtil"],svg:["dojo.xml.svgUtil"]});
dojo.hostenv.moduleLoaded("dojo.xml.*");
dojo.provide("dojo.widget.Manager");
dojo.require("dojo.lang");
dojo.require("dojo.event");
dojo.widget.manager=new function(){
this.widgets=[];
this.widgetIds=[];
this.topWidgets=[];
var _3d1={};
var _3d2=[];
this.getUniqueId=function(_3d3){
return _3d3+"_"+(_3d1[_3d3]!=undefined?++_3d1[_3d3]:_3d1[_3d3]=0);
};
this.add=function(_3d4){
dojo.profile.start("dojo.widget.manager.add");
this.widgets.push(_3d4);
if(_3d4.widgetId==""){
if(_3d4["id"]){
_3d4.widgetId=_3d4["id"];
}else{
if(_3d4.extraArgs["id"]){
_3d4.widgetId=_3d4.extraArgs["id"];
}else{
_3d4.widgetId=this.getUniqueId(_3d4.widgetType);
}
}
}
if(this.widgetIds[_3d4.widgetId]){
dojo.debug("widget ID collision on ID: "+_3d4.widgetId);
}
this.widgetIds[_3d4.widgetId]=_3d4;
dojo.profile.end("dojo.widget.manager.add");
};
this.destroyAll=function(){
for(var x=this.widgets.length-1;x>=0;x--){
try{
this.widgets[x].destroy(true);
delete this.widgets[x];
}
catch(e){
}
}
};
this.remove=function(_3d6){
var tw=this.widgets[_3d6].widgetId;
delete this.widgetIds[tw];
this.widgets.splice(_3d6,1);
};
this.removeById=function(id){
for(var i=0;i<this.widgets.length;i++){
if(this.widgets[i].widgetId==id){
this.remove(i);
break;
}
}
};
this.getWidgetById=function(id){
return this.widgetIds[id];
};
this.getWidgetsByType=function(type){
var lt=type.toLowerCase();
var ret=[];
dojo.lang.forEach(this.widgets,function(x){
if(x.widgetType.toLowerCase()==lt){
ret.push(x);
}
});
return ret;
};
this.getWidgetsOfType=function(id){
dj_deprecated("getWidgetsOfType is depecrecated, use getWidgetsByType");
return dojo.widget.manager.getWidgetsByType(id);
};
this.getWidgetsByFilter=function(_3e0){
var ret=[];
dojo.lang.forEach(this.widgets,function(x){
if(_3e0(x)){
ret.push(x);
}
});
return ret;
};
this.getAllWidgets=function(){
return this.widgets.concat();
};
this.byId=this.getWidgetById;
this.byType=this.getWidgetsByType;
this.byFilter=this.getWidgetsByFilter;
var _3e3={};
var _3e4=["dojo.widget","dojo.webui.widgets"];
for(var i=0;i<_3e4.length;i++){
_3e4[_3e4[i]]=true;
}
this.registerWidgetPackage=function(_3e6){
if(!_3e4[_3e6]){
_3e4[_3e6]=true;
_3e4.push(_3e6);
}
};
this.getWidgetPackageList=function(){
return dojo.lang.map(_3e4,function(elt){
return (elt!==true?elt:undefined);
});
};
this.getImplementation=function(_3e8,_3e9,_3ea){
var impl=this.getImplementationName(_3e8);
if(impl){
var ret=new impl(_3e9);
return ret;
}
};
this.getImplementationName=function(_3ed){
var _3ee=_3ed.toLowerCase();
var impl=_3e3[_3ee];
if(impl){
return impl;
}
if(!_3d2.length){
for(var _3f0 in dojo.render){
if(dojo.render[_3f0]["capable"]===true){
var _3f1=dojo.render[_3f0].prefixes;
for(var i=0;i<_3f1.length;i++){
_3d2.push(_3f1[i].toLowerCase());
}
}
}
_3d2.push("");
}
for(var i=0;i<_3e4.length;i++){
var _3f3=dojo.evalObjPath(_3e4[i]);
if(!_3f3){
continue;
}
for(var j=0;j<_3d2.length;j++){
if(!_3f3[_3d2[j]]){
continue;
}
for(var _3f5 in _3f3[_3d2[j]]){
if(_3f5.toLowerCase()!=_3ee){
continue;
}
_3e3[_3ee]=_3f3[_3d2[j]][_3f5];
return _3e3[_3ee];
}
}
for(var j=0;j<_3d2.length;j++){
for(var _3f5 in _3f3){
if(_3f5.toLowerCase()!=(_3d2[j]+_3ee)){
continue;
}
_3e3[_3ee]=_3f3[_3f5];
return _3e3[_3ee];
}
}
}
throw new Error("Could not locate \""+_3ed+"\" class");
};
this.onResized=function(){
for(var i=0;i<this.topWidgets.length;i++){
var _3f7=this.topWidgets[i];
if(_3f7.onResized){
_3f7.onResized();
}
}
};
if(typeof window!="undefined"){
dojo.addOnLoad(this,"onResized");
dojo.event.connect(window,"onresize",this,"onResized");
}
};
dojo.widget.getUniqueId=function(){
return dojo.widget.manager.getUniqueId.apply(dojo.widget.manager,arguments);
};
dojo.widget.addWidget=function(){
return dojo.widget.manager.add.apply(dojo.widget.manager,arguments);
};
dojo.widget.destroyAllWidgets=function(){
return dojo.widget.manager.destroyAll.apply(dojo.widget.manager,arguments);
};
dojo.widget.removeWidget=function(){
return dojo.widget.manager.remove.apply(dojo.widget.manager,arguments);
};
dojo.widget.removeWidgetById=function(){
return dojo.widget.manager.removeById.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetById=function(){
return dojo.widget.manager.getWidgetById.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetsByType=function(){
return dojo.widget.manager.getWidgetsByType.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetsByFilter=function(){
return dojo.widget.manager.getWidgetsByFilter.apply(dojo.widget.manager,arguments);
};
dojo.widget.byId=function(){
return dojo.widget.manager.getWidgetById.apply(dojo.widget.manager,arguments);
};
dojo.widget.byType=function(){
return dojo.widget.manager.getWidgetsByType.apply(dojo.widget.manager,arguments);
};
dojo.widget.byFilter=function(){
return dojo.widget.manager.getWidgetsByFilter.apply(dojo.widget.manager,arguments);
};
dojo.widget.all=function(){
return dojo.widget.manager.getAllWidgets.apply(dojo.widget.manager,arguments);
};
dojo.widget.registerWidgetPackage=function(){
return dojo.widget.manager.registerWidgetPackage.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetImplementation=function(){
return dojo.widget.manager.getImplementation.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetImplementationName=function(){
return dojo.widget.manager.getImplementationName.apply(dojo.widget.manager,arguments);
};
dojo.widget.widgets=dojo.widget.manager.widgets;
dojo.widget.widgetIds=dojo.widget.manager.widgetIds;
dojo.widget.root=dojo.widget.manager.root;
dojo.provide("dojo.widget.Parse");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.string");
dojo.require("dojo.dom");
dojo.widget.Parse=function(_3f8){
this.propertySetsList=[];
this.fragment=_3f8;
this.createComponents=function(_3f9,_3fa){
var _3fb=dojo.widget.tags;
var _3fc=[];
for(var item in _3f9){
var _3fe=false;
try{
if(_3f9[item]&&(_3f9[item]["tagName"])&&(_3f9[item]!=_3f9["nodeRef"])){
var tn=new String(_3f9[item]["tagName"]);
var tna=tn.split(";");
for(var x=0;x<tna.length;x++){
var ltn=dojo.string.trim(tna[x]).toLowerCase();
if(_3fb[ltn]){
_3fe=true;
_3f9[item].tagName=ltn;
_3fc.push(_3fb[ltn](_3f9[item],this,_3fa,_3f9[item]["index"]));
}else{
if(ltn.substr(0,5)=="dojo:"){
dojo.debug("no tag handler registed for type: ",ltn);
}
}
}
}
}
catch(e){
dojo.debug(e);
}
if((!_3fe)&&(typeof _3f9[item]=="object")&&(_3f9[item]!=_3f9.nodeRef)&&(_3f9[item]!=_3f9["tagName"])){
_3fc.push(this.createComponents(_3f9[item],_3fa));
}
}
return _3fc;
};
this.parsePropertySets=function(_403){
return [];
var _404=[];
for(var item in _403){
if((_403[item]["tagName"]=="dojo:propertyset")){
_404.push(_403[item]);
}
}
this.propertySetsList.push(_404);
return _404;
};
this.parseProperties=function(_406){
var _407={};
for(var item in _406){
if((_406[item]==_406["tagName"])||(_406[item]==_406.nodeRef)){
}else{
if((_406[item]["tagName"])&&(dojo.widget.tags[_406[item].tagName.toLowerCase()])){
}else{
if((_406[item][0])&&(_406[item][0].value!="")){
try{
if(item.toLowerCase()=="dataprovider"){
var _409=this;
this.getDataProvider(_409,_406[item][0].value);
_407.dataProvider=this.dataProvider;
}
_407[item]=_406[item][0].value;
var _40a=this.parseProperties(_406[item]);
for(var _40b in _40a){
_407[_40b]=_40a[_40b];
}
}
catch(e){
dj_debug(e);
}
}
}
}
}
return _407;
};
this.getDataProvider=function(_40c,_40d){
dojo.io.bind({url:_40d,load:function(type,_40f){
if(type=="load"){
_40c.dataProvider=_40f;
}
},mimetype:"text/javascript",sync:true});
};
this.getPropertySetById=function(_410){
for(var x=0;x<this.propertySetsList.length;x++){
if(_410==this.propertySetsList[x]["id"][0].value){
return this.propertySetsList[x];
}
}
return "";
};
this.getPropertySetsByType=function(_412){
var _413=[];
for(var x=0;x<this.propertySetsList.length;x++){
var cpl=this.propertySetsList[x];
var cpcc=cpl["componentClass"]||cpl["componentType"]||null;
if((cpcc)&&(propertySetId==cpcc[0].value)){
_413.push(cpl);
}
}
return _413;
};
this.getPropertySets=function(_417){
var ppl="dojo:propertyproviderlist";
var _419=[];
var _41a=_417["tagName"];
if(_417[ppl]){
var _41b=_417[ppl].value.split(" ");
for(propertySetId in _41b){
if((propertySetId.indexOf("..")==-1)&&(propertySetId.indexOf("://")==-1)){
var _41c=this.getPropertySetById(propertySetId);
if(_41c!=""){
_419.push(_41c);
}
}else{
}
}
}
return (this.getPropertySetsByType(_41a)).concat(_419);
};
this.createComponentFromScript=function(_41d,_41e,_41f,_420){
var frag={};
var _422="dojo:"+_41e.toLowerCase();
frag[_422]={};
var bo={};
_41f.dojotype=_41e;
for(var prop in _41f){
if(typeof bo[prop]=="undefined"){
frag[_422][prop]=[{value:_41f[prop]}];
}
}
frag[_422].nodeRef=_41d;
frag.tagName=_422;
var _425=[frag];
if(_420){
_425[0].fastMixIn=true;
}
return this.createComponents(_425);
};
};
dojo.widget._parser_collection={"dojo":new dojo.widget.Parse()};
dojo.widget.getParser=function(name){
if(!name){
name="dojo";
}
if(!this._parser_collection[name]){
this._parser_collection[name]=new dojo.widget.Parse();
}
return this._parser_collection[name];
};
dojo.widget.fromScript=function(name,_428,_429,_42a){
if((typeof name!="string")&&(typeof _428=="string")){
return dojo.widget._oldFromScript(name,_428,_429);
}
_428=_428||{};
var _42b=false;
var tn=null;
var h=dojo.render.html.capable;
if(h){
tn=document.createElement("span");
}
if(!_429){
_42b=true;
_429=tn;
if(h){
dojo.html.body().appendChild(_429);
}
}else{
if(_42a){
dojo.dom.insertAtPosition(tn,_429,_42a);
}else{
tn=_429;
}
}
var _42e=dojo.widget._oldFromScript(tn,name,_428);
if(!_42e[0]||typeof _42e[0].widgetType=="undefined"){
throw new Error("Creation of \""+name+"\" widget fromScript failed.");
}
if(_42b){
if(_42e[0].domNode.parentNode){
_42e[0].domNode.parentNode.removeChild(_42e[0].domNode);
}
}
return _42e[0];
};
dojo.widget._oldFromScript=function(_42f,name,_431){
var ln=name.toLowerCase();
var tn="dojo:"+ln;
_431[tn]={dojotype:[{value:ln}],nodeRef:_42f,fastMixIn:true};
var ret=dojo.widget.getParser().createComponentFromScript(_42f,name,_431,true);
return ret;
};
dojo.provide("dojo.widget.Widget");
dojo.provide("dojo.widget.tags");
dojo.require("dojo.lang");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.event.*");
dojo.require("dojo.string");
dojo.widget.Widget=function(){
this.children=[];
this.rightClickItems=[];
this.extraArgs={};
};
dojo.lang.extend(dojo.widget.Widget,{parent:null,isTopLevel:false,isModal:false,isEnabled:true,isHidden:false,isContainer:false,widgetId:"",widgetType:"Widget",toString:function(){
return "[Widget "+this.widgetType+", "+(this.widgetId||"NO ID")+"]";
},enable:function(){
this.isEnabled=true;
},disable:function(){
this.isEnabled=false;
},hide:function(){
this.isHidden=true;
},show:function(){
this.isHidden=false;
},create:function(args,_436,_437){
this.satisfyPropertySets(args,_436,_437);
this.mixInProperties(args,_436,_437);
dojo.widget.manager.add(this);
this.buildRendering(args,_436,_437);
this.initialize(args,_436,_437);
this.postInitialize(args,_436,_437);
this.postCreate(args,_436,_437);
return this;
},destroy:function(_438){
this.uninitialize();
this.destroyRendering(_438);
dojo.widget.manager.removeById(this.widgetId);
},destroyChildren:function(_439){
_439=(!_439)?function(){
return true;
}:_439;
for(var x=0;x<this.children.length;x++){
var tc=this.children[x];
if((tc)&&(_439(tc))){
tc.destroy();
}
}
},destroyChildrenOfType:function(type){
type=type.toLowerCase();
this.destroyChildren(function(item){
if(item.widgetType.toLowerCase()==type){
return true;
}else{
return false;
}
});
},getChildrenOfType:function(type,_43f){
var ret=[];
type=type.toLowerCase();
for(var x=0;x<this.children.length;x++){
if(this.children[x].widgetType.toLowerCase()==type){
ret.push(this.children[x]);
}
if(_43f){
ret=ret.concat(this.children[x].getChildrenOfType(type,_43f));
}
}
return ret;
},satisfyPropertySets:function(args){
return args;
},mixInProperties:function(args,frag){
if((args["fastMixIn"])||(frag["fastMixIn"])){
for(var x in args){
this[x]=args[x];
}
return;
}
var _446;
var _447=dojo.widget.lcArgsCache[this.widgetType];
if(_447==null){
_447={};
for(var y in this){
_447[((new String(y)).toLowerCase())]=y;
}
dojo.widget.lcArgsCache[this.widgetType]=_447;
}
var _449={};
for(var x in args){
if(!this[x]){
var y=_447[(new String(x)).toLowerCase()];
if(y){
args[y]=args[x];
x=y;
}
}
if(_449[x]){
continue;
}
_449[x]=true;
if((typeof this[x])!=(typeof _446)){
if(typeof args[x]!="string"){
this[x]=args[x];
}else{
if(dojo.lang.isString(this[x])){
this[x]=args[x];
}else{
if(dojo.lang.isNumber(this[x])){
this[x]=new Number(args[x]);
}else{
if(dojo.lang.isBoolean(this[x])){
this[x]=(args[x].toLowerCase()=="false")?false:true;
}else{
if(dojo.lang.isFunction(this[x])){
var tn=dojo.event.nameAnonFunc(new Function(args[x]),this);
dojo.event.connect(this,x,this,tn);
}else{
if(dojo.lang.isArray(this[x])){
this[x]=args[x].split(";");
}else{
if(this[x] instanceof Date){
this[x]=new Date(Number(args[x]));
}else{
if(typeof this[x]=="object"){
var _44b=args[x].split(";");
for(var y=0;y<_44b.length;y++){
var si=_44b[y].indexOf(":");
if((si!=-1)&&(_44b[y].length>si)){
this[x][dojo.string.trim(_44b[y].substr(0,si))]=_44b[y].substr(si+1);
}
}
}else{
this[x]=args[x];
}
}
}
}
}
}
}
}
}else{
this.extraArgs[x]=args[x];
}
}
},initialize:function(args,frag){
return false;
},postInitialize:function(args,frag){
return false;
},postCreate:function(args,frag){
return false;
},uninitialize:function(){
return false;
},buildRendering:function(){
dj_unimplemented("dojo.widget.Widget.buildRendering");
return false;
},destroyRendering:function(){
dj_unimplemented("dojo.widget.Widget.destroyRendering");
return false;
},cleanUp:function(){
dj_unimplemented("dojo.widget.Widget.cleanUp");
return false;
},addedTo:function(_453){
},addChild:function(_454){
dj_unimplemented("dojo.widget.Widget.addChild");
return false;
},addChildAtIndex:function(_455,_456){
dj_unimplemented("dojo.widget.Widget.addChildAtIndex");
return false;
},removeChild:function(_457){
dj_unimplemented("dojo.widget.Widget.removeChild");
return false;
},removeChildAtIndex:function(_458){
dj_unimplemented("dojo.widget.Widget.removeChildAtIndex");
return false;
},resize:function(_459,_45a){
this.setWidth(_459);
this.setHeight(_45a);
},setWidth:function(_45b){
if((typeof _45b=="string")&&(_45b.substr(-1)=="%")){
this.setPercentageWidth(_45b);
}else{
this.setNativeWidth(_45b);
}
},setHeight:function(_45c){
if((typeof _45c=="string")&&(_45c.substr(-1)=="%")){
this.setPercentageHeight(_45c);
}else{
this.setNativeHeight(_45c);
}
},setPercentageHeight:function(_45d){
return false;
},setNativeHeight:function(_45e){
return false;
},setPercentageWidth:function(_45f){
return false;
},setNativeWidth:function(_460){
return false;
}});
dojo.widget.lcArgsCache={};
dojo.widget.tags={};
dojo.widget.tags.addParseTreeHandler=function(type){
var _462=type.toLowerCase();
this[_462]=function(_463,_464,_465,_466){
return dojo.widget.buildWidgetFromParseTree(_462,_463,_464,_465,_466);
};
};
dojo.widget.tags.addParseTreeHandler("dojo:widget");
dojo.widget.tags["dojo:propertyset"]=function(_467,_468,_469){
var _46a=_468.parseProperties(_467["dojo:propertyset"]);
};
dojo.widget.tags["dojo:connect"]=function(_46b,_46c,_46d){
var _46e=_46c.parseProperties(_46b["dojo:connect"]);
};
dojo.widget.buildWidgetFromParseTree=function(type,frag,_471,_472,_473){
var _474={};
var _475=type.split(":");
_475=(_475.length==2)?_475[1]:type;
var _474=_471.parseProperties(frag["dojo:"+_475]);
var _476=dojo.widget.manager.getImplementation(_475);
if(!_476){
throw new Error("cannot find \""+_475+"\" widget");
}else{
if(!_476.create){
throw new Error("\""+_475+"\" widget object does not appear to implement *Widget");
}
}
_474["dojoinsertionindex"]=_473;
var ret=_476.create(_474,frag,_472);
return ret;
};
dojo.provide("dojo.widget.Button");
dojo.require("dojo.widget.Widget");
dojo.requireIf("html","dojo.widget.html.Button");
dojo.widget.tags.addParseTreeHandler("dojo:button");
dojo.widget.Button=function(){
dojo.widget.Widget.call(this);
this.widgetType="Button";
this.isContainer=true;
};
dojo.inherits(dojo.widget.Button,dojo.widget.Widget);

