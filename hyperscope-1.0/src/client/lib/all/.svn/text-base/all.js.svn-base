/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(typeof dojo=="undefined"){
var dj_global=this;
function dj_undef(_1,_2){
if(_2==null){
_2=dj_global;
}
return (typeof _2[_1]=="undefined");
}
if(dj_undef("djConfig")){
var djConfig={};
}
if(dj_undef("dojo")){
var dojo={};
}
dojo.version={major:0,minor:0,patch:0,flag:"dev",revision:Number("$Rev: 4342 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo.evalProp=function(_3,_4,_5){
return (_4&&!dj_undef(_3,_4)?_4[_3]:(_5?(_4[_3]={}):undefined));
};
dojo.parseObjPath=function(_6,_7,_8){
var _9=(_7!=null?_7:dj_global);
var _a=_6.split(".");
var _b=_a.pop();
for(var i=0,l=_a.length;i<l&&_9;i++){
_9=dojo.evalProp(_a[i],_9,_8);
}
return {obj:_9,prop:_b};
};
dojo.evalObjPath=function(_d,_e){
if(typeof _d!="string"){
return dj_global;
}
if(_d.indexOf(".")==-1){
return dojo.evalProp(_d,dj_global,_e);
}
var _f=dojo.parseObjPath(_d,dj_global,_e);
if(_f){
return dojo.evalProp(_f.prop,_f.obj,_e);
}
return null;
};
dojo.errorToString=function(_10){
if(!dj_undef("message",_10)){
return _10.message;
}else{
if(!dj_undef("description",_10)){
return _10.description;
}else{
return _10;
}
}
};
dojo.raise=function(_11,_12){
if(_12){
_11=_11+": "+dojo.errorToString(_12);
}
try{
dojo.hostenv.println("FATAL: "+_11);
}
catch(e){
}
throw Error(_11);
};
dojo.debug=function(){
};
dojo.debugShallow=function(obj){
};
dojo.profile={start:function(){
},end:function(){
},stop:function(){
},dump:function(){
}};
function dj_eval(_14){
return dj_global.eval?dj_global.eval(_14):eval(_14);
}
dojo.unimplemented=function(_15,_16){
var _17="'"+_15+"' not implemented";
if(_16!=null){
_17+=" "+_16;
}
dojo.raise(_17);
};
dojo.deprecated=function(_18,_19,_1a){
var _1b="DEPRECATED: "+_18;
if(_19){
_1b+=" "+_19;
}
if(_1a){
_1b+=" -- will be removed in version: "+_1a;
}
dojo.debug(_1b);
};
dojo.inherits=function(_1c,_1d){
if(typeof _1d!="function"){
dojo.raise("dojo.inherits: superclass argument ["+_1d+"] must be a function (subclass: ["+_1c+"']");
}
_1c.prototype=new _1d();
_1c.prototype.constructor=_1c;
_1c.superclass=_1d.prototype;
_1c["super"]=_1d.prototype;
};
dojo.render=(function(){
function vscaffold(_1e,_1f){
var tmp={capable:false,support:{builtin:false,plugin:false},prefixes:_1e};
for(var _21 in _1f){
tmp[_21]=false;
}
return tmp;
}
return {name:"",ver:dojo.version,os:{win:false,linux:false,osx:false},html:vscaffold(["html"],["ie","opera","khtml","safari","moz"]),svg:vscaffold(["svg"],["corel","adobe","batik"]),vml:vscaffold(["vml"],["ie"]),swf:vscaffold(["Swf","Flash","Mm"],["mm"]),swt:vscaffold(["Swt"],["ibm"])};
})();
dojo.hostenv=(function(){
var _22={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",iePreventClobber:false,ieClobberMinimal:true,preventBackButtonFix:true,searchIds:[],parseWidgets:true};
if(typeof djConfig=="undefined"){
djConfig=_22;
}else{
for(var _23 in _22){
if(typeof djConfig[_23]=="undefined"){
djConfig[_23]=_22[_23];
}
}
}
return {name_:"(unset)",version_:"(unset)",getName:function(){
return this.name_;
},getVersion:function(){
return this.version_;
},getText:function(uri){
dojo.unimplemented("getText","uri="+uri);
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
var _26=uri.lastIndexOf("/");
djConfig.baseScriptUri=djConfig.baseRelativePath;
return djConfig.baseScriptUri;
};
(function(){
var _27={pkgFileName:"__package__",loading_modules_:{},loaded_modules_:{},addedToLoadingCount:[],removedFromLoadingCount:[],inFlightCount:0,modulePrefixes_:{dojo:{name:"dojo",value:"src"}},setModulePrefix:function(_28,_29){
this.modulePrefixes_[_28]={name:_28,value:_29};
},getModulePrefix:function(_2a){
var mp=this.modulePrefixes_;
if((mp[_2a])&&(mp[_2a]["name"])){
return mp[_2a].value;
}
return _2a;
},getTextStack:[],loadUriStack:[],loadedUris:[],post_load_:false,modulesLoadedListeners:[],unloadListeners:[],loadNotifying:false};
for(var _2c in _27){
dojo.hostenv[_2c]=_27[_2c];
}
})();
dojo.hostenv.loadPath=function(_2d,_2e,cb){
var uri;
if((_2d.charAt(0)=="/")||(_2d.match(/^\w+:/))){
uri=_2d;
}else{
uri=this.getBaseScriptUri()+_2d;
}
if(djConfig.cacheBust&&dojo.render.html.capable){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return ((!_2e)?this.loadUri(uri,cb):this.loadUriAndCheck(uri,_2e,cb));
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb){
if(this.loadedUris[uri]){
return 1;
}
var _33=this.getText(uri,null,true);
if(_33==null){
return 0;
}
this.loadedUris[uri]=true;
if(cb){
_33="("+_33+")";
}
var _34=dj_eval(_33);
if(cb){
cb(_34);
}
return 1;
};
dojo.hostenv.loadUriAndCheck=function(uri,_36,cb){
var ok=true;
try{
ok=this.loadUri(uri,cb);
}
catch(e){
dojo.debug("failed loading ",uri," with error: ",e);
}
return ((ok)&&(this.findModule(_36,false)))?true:false;
};
dojo.loaded=function(){
};
dojo.unloaded=function(){
};
dojo.hostenv.loaded=function(){
this.loadNotifying=true;
this.post_load_=true;
var mll=this.modulesLoadedListeners;
for(var x=0;x<mll.length;x++){
mll[x]();
}
this.modulesLoadedListeners=[];
this.loadNotifying=false;
dojo.loaded();
};
dojo.hostenv.unloaded=function(){
var mll=this.unloadListeners;
while(mll.length){
(mll.pop())();
}
dojo.unloaded();
};
dojo.addOnLoad=function(obj,_3d){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.modulesLoadedListeners.push(obj);
}else{
if(arguments.length>1){
dh.modulesLoadedListeners.push(function(){
obj[_3d]();
});
}
}
if(dh.post_load_&&dh.inFlightCount==0&&!dh.loadNotifying){
dh.callLoaded();
}
};
dojo.addOnUnload=function(obj,_40){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.unloadListeners.push(obj);
}else{
if(arguments.length>1){
dh.unloadListeners.push(function(){
obj[_40]();
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
dojo.hostenv.callLoaded();
}
};
dojo.hostenv.callLoaded=function(){
if(typeof setTimeout=="object"){
setTimeout("dojo.hostenv.loaded();",0);
}else{
dojo.hostenv.loaded();
}
};
dojo.hostenv.getModuleSymbols=function(_42){
var _43=_42.split(".");
for(var i=_43.length-1;i>0;i--){
var _45=_43.slice(0,i).join(".");
var _46=this.getModulePrefix(_45);
if(_46!=_45){
_43.splice(0,i,_46);
break;
}
}
return _43;
};
dojo.hostenv._global_omit_module_check=false;
dojo.hostenv.loadModule=function(_47,_48,_49){
if(!_47){
return;
}
_49=this._global_omit_module_check||_49;
var _4a=this.findModule(_47,false);
if(_4a){
return _4a;
}
if(dj_undef(_47,this.loading_modules_)){
this.addedToLoadingCount.push(_47);
}
this.loading_modules_[_47]=1;
var _4b=_47.replace(/\./g,"/")+".js";
var _4c=this.getModuleSymbols(_47);
var _4d=((_4c[0].charAt(0)!="/")&&(!_4c[0].match(/^\w+:/)));
var _4e=_4c[_4c.length-1];
var _4f=_47.split(".");
if(_4e=="*"){
_47=(_4f.slice(0,-1)).join(".");
while(_4c.length){
_4c.pop();
_4c.push(this.pkgFileName);
_4b=_4c.join("/")+".js";
if(_4d&&(_4b.charAt(0)=="/")){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,((!_49)?_47:null));
if(ok){
break;
}
_4c.pop();
}
}else{
_4b=_4c.join("/")+".js";
_47=_4f.join(".");
var ok=this.loadPath(_4b,((!_49)?_47:null));
if((!ok)&&(!_48)){
_4c.pop();
while(_4c.length){
_4b=_4c.join("/")+".js";
ok=this.loadPath(_4b,((!_49)?_47:null));
if(ok){
break;
}
_4c.pop();
_4b=_4c.join("/")+"/"+this.pkgFileName+".js";
if(_4d&&(_4b.charAt(0)=="/")){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,((!_49)?_47:null));
if(ok){
break;
}
}
}
if((!ok)&&(!_49)){
dojo.raise("Could not load '"+_47+"'; last tried '"+_4b+"'");
}
}
if(!_49&&!this["isXDomain"]){
_4a=this.findModule(_47,false);
if(!_4a){
dojo.raise("symbol '"+_47+"' is not defined after loading '"+_4b+"'");
}
}
return _4a;
};
dojo.hostenv.startPackage=function(_51){
var _52=dojo.evalObjPath((_51.split(".").slice(0,-1)).join("."));
this.loaded_modules_[(new String(_51)).toLowerCase()]=_52;
var _53=_51.split(/\./);
if(_53[_53.length-1]=="*"){
_53.pop();
}
return dojo.evalObjPath(_53.join("."),true);
};
dojo.hostenv.findModule=function(_54,_55){
var lmn=(new String(_54)).toLowerCase();
if(this.loaded_modules_[lmn]){
return this.loaded_modules_[lmn];
}
var _57=dojo.evalObjPath(_54);
if((_54)&&(typeof _57!="undefined")&&(_57)){
this.loaded_modules_[lmn]=_57;
return _57;
}
if(_55){
dojo.raise("no loaded module named '"+_54+"'");
}
return null;
};
dojo.kwCompoundRequire=function(_58){
var _59=_58["common"]||[];
var _5a=(_58[dojo.hostenv.name_])?_59.concat(_58[dojo.hostenv.name_]||[]):_59.concat(_58["default"]||[]);
for(var x=0;x<_5a.length;x++){
var _5c=_5a[x];
if(_5c.constructor==Array){
dojo.hostenv.loadModule.apply(dojo.hostenv,_5c);
}else{
dojo.hostenv.loadModule(_5c);
}
}
};
dojo.require=function(){
dojo.hostenv.loadModule.apply(dojo.hostenv,arguments);
};
dojo.requireIf=function(){
if((arguments[0]===true)||(arguments[0]=="common")||(arguments[0]&&dojo.render[arguments[0]].capable)){
var _5d=[];
for(var i=1;i<arguments.length;i++){
_5d.push(arguments[i]);
}
dojo.require.apply(dojo,_5d);
}
};
dojo.requireAfterIf=dojo.requireIf;
dojo.provide=function(){
return dojo.hostenv.startPackage.apply(dojo.hostenv,arguments);
};
dojo.setModulePrefix=function(_5f,_60){
return dojo.hostenv.setModulePrefix(_5f,_60);
};
dojo.exists=function(obj,_62){
var p=_62.split(".");
for(var i=0;i<p.length;i++){
if(!(obj[p[i]])){
return false;
}
obj=obj[p[i]];
}
return true;
};
}
if(typeof window=="undefined"){
dojo.raise("no window object");
}
(function(){
if(djConfig.allowQueryConfig){
var _65=document.location.toString();
var _66=_65.split("?",2);
if(_66.length>1){
var _67=_66[1];
var _68=_67.split("&");
for(var x in _68){
var sp=_68[x].split("=");
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
var _6c=document.getElementsByTagName("script");
var _6d=/(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
for(var i=0;i<_6c.length;i++){
var src=_6c[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_6d);
if(m){
var _71=src.substring(0,m.index);
if(src.indexOf("bootstrap1")>-1){
_71+="../";
}
if(!this["djConfig"]){
djConfig={};
}
if(djConfig["baseScriptUri"]==""){
djConfig["baseScriptUri"]=_71;
}
if(djConfig["baseRelativePath"]==""){
djConfig["baseRelativePath"]=_71;
}
break;
}
}
}
var dr=dojo.render;
var drh=dojo.render.html;
var drs=dojo.render.svg;
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
var _79=dua.indexOf("Gecko");
drh.mozilla=drh.moz=(_79>=0)&&(!drh.khtml);
if(drh.mozilla){
drh.geckoVersion=dua.substring(_79+6,_79+14);
}
drh.ie=(document.all)&&(!drh.opera);
drh.ie50=drh.ie&&dav.indexOf("MSIE 5.0")>=0;
drh.ie55=drh.ie&&dav.indexOf("MSIE 5.5")>=0;
drh.ie60=drh.ie&&dav.indexOf("MSIE 6.0")>=0;
drh.ie70=drh.ie&&dav.indexOf("MSIE 7.0")>=0;
dojo.locale=(drh.ie?navigator.userLanguage:navigator.language).toLowerCase();
dr.vml.capable=drh.ie;
drs.capable=f;
drs.support.plugin=f;
drs.support.builtin=f;
if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("org.w3c.dom.svg","1.0")){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
})();
dojo.hostenv.startPackage("dojo.hostenv");
dojo.render.name=dojo.hostenv.name_="browser";
dojo.hostenv.searchIds=[];
dojo.hostenv._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
dojo.hostenv.getXmlhttpObject=function(){
var _7a=null;
var _7b=null;
try{
_7a=new XMLHttpRequest();
}
catch(e){
}
if(!_7a){
for(var i=0;i<3;++i){
var _7d=dojo.hostenv._XMLHTTP_PROGIDS[i];
try{
_7a=new ActiveXObject(_7d);
}
catch(e){
_7b=e;
}
if(_7a){
dojo.hostenv._XMLHTTP_PROGIDS=[_7d];
break;
}
}
}
if(!_7a){
return dojo.raise("XMLHTTP not available",_7b);
}
return _7a;
};
dojo.hostenv.getText=function(uri,_7f,_80){
var _81=this.getXmlhttpObject();
if(_7f){
_81.onreadystatechange=function(){
if(4==_81.readyState){
if((!_81["status"])||((200<=_81.status)&&(300>_81.status))){
_7f(_81.responseText);
}
}
};
}
_81.open("GET",uri,_7f?true:false);
try{
_81.send(null);
if(_7f){
return null;
}
if((_81["status"])&&((200>_81.status)||(300<=_81.status))){
throw Error("Unable to load "+uri+" status:"+_81.status);
}
}
catch(e){
if((_80)&&(!_7f)){
return null;
}else{
throw e;
}
}
return _81.responseText;
};
dojo.hostenv.defaultDebugContainerId="dojoDebug";
dojo.hostenv._println_buffer=[];
dojo.hostenv._println_safe=false;
dojo.hostenv.println=function(_82){
if(!dojo.hostenv._println_safe){
dojo.hostenv._println_buffer.push(_82);
}else{
try{
var _83=document.getElementById(djConfig.debugContainerId?djConfig.debugContainerId:dojo.hostenv.defaultDebugContainerId);
if(!_83){
_83=document.getElementsByTagName("body")[0]||document.body;
}
var div=document.createElement("div");
div.appendChild(document.createTextNode(_82));
_83.appendChild(div);
}
catch(e){
try{
document.write("<div>"+_82+"</div>");
}
catch(e2){
window.status=_82;
}
}
}
};
dojo.addOnLoad(function(){
dojo.hostenv._println_safe=true;
while(dojo.hostenv._println_buffer.length>0){
dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
}
});
function dj_addNodeEvtHdlr(_85,_86,fp,_88){
var _89=_85["on"+_86]||function(){
};
_85["on"+_86]=function(){
fp.apply(_85,arguments);
_89.apply(_85,arguments);
};
return true;
}
dj_addNodeEvtHdlr(window,"load",function(){
if(arguments.callee.initialized){
return;
}
arguments.callee.initialized=true;
var _8a=function(){
if(dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
};
if(dojo.hostenv.inFlightCount==0){
_8a();
dojo.hostenv.modulesLoaded();
}else{
dojo.addOnLoad(_8a);
}
});
dj_addNodeEvtHdlr(window,"unload",function(){
dojo.hostenv.unloaded();
});
dojo.hostenv.makeWidgets=function(){
var _8b=[];
if(djConfig.searchIds&&djConfig.searchIds.length>0){
_8b=_8b.concat(djConfig.searchIds);
}
if(dojo.hostenv.searchIds&&dojo.hostenv.searchIds.length>0){
_8b=_8b.concat(dojo.hostenv.searchIds);
}
if((djConfig.parseWidgets)||(_8b.length>0)){
if(dojo.evalObjPath("dojo.widget.Parse")){
var _8c=new dojo.xml.Parse();
if(_8b.length>0){
for(var x=0;x<_8b.length;x++){
var _8e=document.getElementById(_8b[x]);
if(!_8e){
continue;
}
var _8f=_8c.parseElement(_8e,null,true);
dojo.widget.getParser().createComponents(_8f);
}
}else{
if(djConfig.parseWidgets){
var _8f=_8c.parseElement(document.getElementsByTagName("body")[0]||document.body,null,true);
dojo.widget.getParser().createComponents(_8f);
}
}
}
}
};
dojo.addOnLoad(function(){
if(!dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
});
try{
if(dojo.render.html.ie){
document.write("<style>v:*{ behavior:url(#default#VML); }</style>");
document.write("<xml:namespace ns=\"urn:schemas-microsoft-com:vml\" prefix=\"v\"/>");
}
}
catch(e){
}
dojo.hostenv.writeIncludes=function(){
};
dojo.byId=function(id,doc){
if(id&&(typeof id=="string"||id instanceof String)){
if(!doc){
doc=document;
}
return doc.getElementById(id);
}
return id;
};
(function(){
if(typeof dj_usingBootstrap!="undefined"){
return;
}
var _92=false;
var _93=false;
var _94=false;
if((typeof this["load"]=="function")&&((typeof this["Packages"]=="function")||(typeof this["Packages"]=="object"))){
_92=true;
}else{
if(typeof this["load"]=="function"){
_93=true;
}else{
if(window.widget){
_94=true;
}
}
}
var _95=[];
if((this["djConfig"])&&((djConfig["isDebug"])||(djConfig["debugAtAllCosts"]))){
_95.push("debug.js");
}
if((this["djConfig"])&&(djConfig["debugAtAllCosts"])&&(!_92)&&(!_94)){
_95.push("browser_debug.js");
}
if((this["djConfig"])&&(djConfig["compat"])){
_95.push("compat/"+djConfig["compat"]+".js");
}
var _96=djConfig["baseScriptUri"];
if((this["djConfig"])&&(djConfig["baseLoaderUri"])){
_96=djConfig["baseLoaderUri"];
}
for(var x=0;x<_95.length;x++){
var _98=_96+"src/"+_95[x];
if(_92||_93){
load(_98);
}else{
try{
document.write("<scr"+"ipt type='text/javascript' src='"+_98+"'></scr"+"ipt>");
}
catch(e){
var _99=document.createElement("script");
_99.src=_98;
document.getElementsByTagName("head")[0].appendChild(_99);
}
}
}
})();
dojo.fallback_locale="en";
dojo.normalizeLocale=function(_9a){
return _9a?_9a.toLowerCase():dojo.locale;
};
dojo.requireLocalization=function(_9b,_9c,_9d){
dojo.debug("EXPERIMENTAL: dojo.requireLocalization");
var _9e=dojo.hostenv.getModuleSymbols(_9b);
var _9f=_9e.concat("nls").join("/");
_9d=dojo.normalizeLocale(_9d);
var _a0=_9d.split("-");
var _a1=[];
for(var i=_a0.length;i>0;i--){
_a1.push(_a0.slice(0,i).join("-"));
}
if(_a1[_a1.length-1]!=dojo.fallback_locale){
_a1.push(dojo.fallback_locale);
}
var _a3=[_9b,"_nls",_9c].join(".");
var _a4=dojo.hostenv.startPackage(_a3);
dojo.hostenv.loaded_modules_[_a3]=_a4;
var _a5=false;
for(var i=_a1.length-1;i>=0;i--){
var loc=_a1[i];
var pkg=[_a3,loc].join(".");
var _a8=false;
if(!dojo.hostenv.findModule(pkg)){
dojo.hostenv.loaded_modules_[pkg]=null;
var _a9=[_9f,loc,_9c].join("/")+".js";
_a8=dojo.hostenv.loadPath(_a9,null,function(_aa){
_a4[loc]=_aa;
if(_a5){
for(var x in _a5){
if(!_a4[loc][x]){
_a4[loc][x]=_a5[x];
}
}
}
});
}else{
_a8=true;
}
if(_a8&&_a4[loc]){
_a5=_a4[loc];
}
}
};
dojo.provide("dojo.lang.common");
dojo.require("dojo.lang");
dojo.lang._mixin=function(obj,_ad){
var _ae={};
for(var x in _ad){
if(typeof _ae[x]=="undefined"||_ae[x]!=_ad[x]){
obj[x]=_ad[x];
}
}
if(dojo.render.html.ie&&dojo.lang.isFunction(_ad["toString"])&&_ad["toString"]!=obj["toString"]){
obj.toString=_ad.toString;
}
return obj;
};
dojo.lang.mixin=function(obj,_b1){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(obj,arguments[i]);
}
return obj;
};
dojo.lang.extend=function(_b3,_b4){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(_b3.prototype,arguments[i]);
}
return _b3;
};
dojo.lang.find=function(arr,val,_b8,_b9){
if(!dojo.lang.isArrayLike(arr)&&dojo.lang.isArrayLike(val)){
var a=arr;
arr=val;
val=a;
}
var _bb=dojo.lang.isString(arr);
if(_bb){
arr=arr.split("");
}
if(_b9){
var _bc=-1;
var i=arr.length-1;
var end=-1;
}else{
var _bc=1;
var i=0;
var end=arr.length;
}
if(_b8){
while(i!=end){
if(arr[i]===val){
return i;
}
i+=_bc;
}
}else{
while(i!=end){
if(arr[i]==val){
return i;
}
i+=_bc;
}
}
return -1;
};
dojo.lang.indexOf=dojo.lang.find;
dojo.lang.findLast=function(arr,val,_c1){
return dojo.lang.find(arr,val,_c1,true);
};
dojo.lang.lastIndexOf=dojo.lang.findLast;
dojo.lang.inArray=function(arr,val){
return dojo.lang.find(arr,val)>-1;
};
dojo.lang.isObject=function(wh){
if(typeof wh=="undefined"){
return false;
}
return (typeof wh=="object"||wh===null||dojo.lang.isArray(wh)||dojo.lang.isFunction(wh));
};
dojo.lang.isArray=function(wh){
return (wh instanceof Array||typeof wh=="array");
};
dojo.lang.isArrayLike=function(wh){
if(dojo.lang.isString(wh)){
return false;
}
if(dojo.lang.isFunction(wh)){
return false;
}
if(dojo.lang.isArray(wh)){
return true;
}
if(typeof wh!="undefined"&&wh&&dojo.lang.isNumber(wh.length)&&isFinite(wh.length)){
return true;
}
return false;
};
dojo.lang.isFunction=function(wh){
if(!wh){
return false;
}
return (wh instanceof Function||typeof wh=="function");
};
dojo.lang.isString=function(wh){
return (wh instanceof String||typeof wh=="string");
};
dojo.lang.isAlien=function(wh){
if(!wh){
return false;
}
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
dojo.provide("dojo.lang.func");
dojo.require("dojo.lang.common");
dojo.lang.hitch=function(_cd,_ce){
if(dojo.lang.isString(_ce)){
var fcn=_cd[_ce];
}else{
var fcn=_ce;
}
return function(){
return fcn.apply(_cd,arguments);
};
};
dojo.lang.anonCtr=0;
dojo.lang.anon={};
dojo.lang.nameAnonFunc=function(_d0,_d1,_d2){
var nso=(_d1||dojo.lang.anon);
if((_d2)||((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"]==true))){
for(var x in nso){
if(nso[x]===_d0){
return x;
}
}
}
var ret="__"+dojo.lang.anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.lang.anonCtr++;
}
nso[ret]=_d0;
return ret;
};
dojo.lang.forward=function(_d6){
return function(){
return this[_d6].apply(this,arguments);
};
};
dojo.lang.curry=function(ns,_d8){
var _d9=[];
ns=ns||dj_global;
if(dojo.lang.isString(_d8)){
_d8=ns[_d8];
}
for(var x=2;x<arguments.length;x++){
_d9.push(arguments[x]);
}
var _db=(_d8["__preJoinArity"]||_d8.length)-_d9.length;
function gather(_dc,_dd,_de){
var _df=_de;
var _e0=_dd.slice(0);
for(var x=0;x<_dc.length;x++){
_e0.push(_dc[x]);
}
_de=_de-_dc.length;
if(_de<=0){
var res=_d8.apply(ns,_e0);
_de=_df;
return res;
}else{
return function(){
return gather(arguments,_e0,_de);
};
}
}
return gather([],_d9,_db);
};
dojo.lang.curryArguments=function(ns,_e4,_e5,_e6){
var _e7=[];
var x=_e6||0;
for(x=_e6;x<_e5.length;x++){
_e7.push(_e5[x]);
}
return dojo.lang.curry.apply(dojo.lang,[ns,_e4].concat(_e7));
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
dojo.lang.delayThese=function(_eb,cb,_ed,_ee){
if(!_eb.length){
if(typeof _ee=="function"){
_ee();
}
return;
}
if((typeof _ed=="undefined")&&(typeof cb=="number")){
_ed=cb;
cb=function(){
};
}else{
if(!cb){
cb=function(){
};
if(!_ed){
_ed=0;
}
}
}
setTimeout(function(){
(_eb.shift())();
cb();
dojo.lang.delayThese(_eb,cb,_ed,_ee);
},_ed);
};
dojo.provide("dojo.lang.array");
dojo.require("dojo.lang.common");
dojo.lang.has=function(obj,_f0){
try{
return (typeof obj[_f0]!="undefined");
}
catch(e){
return false;
}
};
dojo.lang.isEmpty=function(obj){
if(dojo.lang.isObject(obj)){
var tmp={};
var _f3=0;
for(var x in obj){
if(obj[x]&&(!tmp[x])){
_f3++;
break;
}
}
return (_f3==0);
}else{
if(dojo.lang.isArrayLike(obj)||dojo.lang.isString(obj)){
return obj.length==0;
}
}
};
dojo.lang.map=function(arr,obj,_f7){
var _f8=dojo.lang.isString(arr);
if(_f8){
arr=arr.split("");
}
if(dojo.lang.isFunction(obj)&&(!_f7)){
_f7=obj;
obj=dj_global;
}else{
if(dojo.lang.isFunction(obj)&&_f7){
var _f9=obj;
obj=_f7;
_f7=_f9;
}
}
if(Array.map){
var _fa=Array.map(arr,_f7,obj);
}else{
var _fa=[];
for(var i=0;i<arr.length;++i){
_fa.push(_f7.call(obj,arr[i]));
}
}
if(_f8){
return _fa.join("");
}else{
return _fa;
}
};
dojo.lang.forEach=function(_fc,_fd,_fe){
if(dojo.lang.isString(_fc)){
_fc=_fc.split("");
}
if(Array.forEach){
Array.forEach(_fc,_fd,_fe);
}else{
if(!_fe){
_fe=dj_global;
}
for(var i=0,l=_fc.length;i<l;i++){
_fd.call(_fe,_fc[i],i,_fc);
}
}
};
dojo.lang._everyOrSome=function(_100,arr,_102,_103){
if(dojo.lang.isString(arr)){
arr=arr.split("");
}
if(Array.every){
return Array[(_100)?"every":"some"](arr,_102,_103);
}else{
if(!_103){
_103=dj_global;
}
for(var i=0,l=arr.length;i<l;i++){
var _105=_102.call(_103,arr[i],i,arr);
if((_100)&&(!_105)){
return false;
}else{
if((!_100)&&(_105)){
return true;
}
}
}
return (_100)?true:false;
}
};
dojo.lang.every=function(arr,_107,_108){
return this._everyOrSome(true,arr,_107,_108);
};
dojo.lang.some=function(arr,_10a,_10b){
return this._everyOrSome(false,arr,_10a,_10b);
};
dojo.lang.filter=function(arr,_10d,_10e){
var _10f=dojo.lang.isString(arr);
if(_10f){
arr=arr.split("");
}
if(Array.filter){
var _110=Array.filter(arr,_10d,_10e);
}else{
if(!_10e){
if(arguments.length>=3){
dojo.raise("thisObject doesn't exist!");
}
_10e=dj_global;
}
var _110=[];
for(var i=0;i<arr.length;i++){
if(_10d.call(_10e,arr[i],i,arr)){
_110.push(arr[i]);
}
}
}
if(_10f){
return _110.join("");
}else{
return _110;
}
};
dojo.lang.unnest=function(){
var out=[];
for(var i=0;i<arguments.length;i++){
if(dojo.lang.isArrayLike(arguments[i])){
var add=dojo.lang.unnest.apply(this,arguments[i]);
out=out.concat(add);
}else{
out.push(arguments[i]);
}
}
return out;
};
dojo.lang.toArray=function(_115,_116){
var _117=[];
for(var i=_116||0;i<_115.length;i++){
_117.push(_115[i]);
}
return _117;
};
dojo.provide("dojo.dom");
dojo.require("dojo.lang.array");
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
dojo.dom.isNode=function(wh){
if(typeof Element=="object"){
try{
return wh instanceof Element;
}
catch(E){
}
}else{
return wh&&!isNaN(wh.nodeType);
}
};
dojo.dom.getTagName=function(node){
dojo.deprecated("dojo.dom.getTagName","use node.tagName instead","0.4");
var _11b=node.tagName;
if(_11b.substr(0,5).toLowerCase()!="dojo:"){
if(_11b.substr(0,4).toLowerCase()=="dojo"){
return "dojo:"+_11b.substring(4).toLowerCase();
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
var _11d=node.className||node.getAttribute("class");
if((_11d)&&(_11d.indexOf)&&(_11d.indexOf("dojo-")!=-1)){
var _11e=_11d.split(" ");
for(var x=0;x<_11e.length;x++){
if((_11e[x].length>5)&&(_11e[x].indexOf("dojo-")>=0)){
return "dojo:"+_11e[x].substr(5).toLowerCase();
}
}
}
}
}
return _11b.toLowerCase();
};
dojo.dom.getUniqueId=function(){
do{
var id="dj_unique_"+(++arguments.callee._idIncrement);
}while(document.getElementById(id));
return id;
};
dojo.dom.getUniqueId._idIncrement=0;
dojo.dom.firstElement=dojo.dom.getFirstChildElement=function(_121,_122){
var node=_121.firstChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.nextSibling;
}
if(_122&&node&&node.tagName&&node.tagName.toLowerCase()!=_122.toLowerCase()){
node=dojo.dom.nextElement(node,_122);
}
return node;
};
dojo.dom.lastElement=dojo.dom.getLastChildElement=function(_124,_125){
var node=_124.lastChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.previousSibling;
}
if(_125&&node&&node.tagName&&node.tagName.toLowerCase()!=_125.toLowerCase()){
node=dojo.dom.prevElement(node,_125);
}
return node;
};
dojo.dom.nextElement=dojo.dom.getNextSiblingElement=function(node,_128){
if(!node){
return null;
}
do{
node=node.nextSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_128&&_128.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.nextElement(node,_128);
}
return node;
};
dojo.dom.prevElement=dojo.dom.getPreviousSiblingElement=function(node,_12a){
if(!node){
return null;
}
if(_12a){
_12a=_12a.toLowerCase();
}
do{
node=node.previousSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_12a&&_12a.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.prevElement(node,_12a);
}
return node;
};
dojo.dom.moveChildren=function(_12b,_12c,trim){
var _12e=0;
if(trim){
while(_12b.hasChildNodes()&&_12b.firstChild.nodeType==dojo.dom.TEXT_NODE){
_12b.removeChild(_12b.firstChild);
}
while(_12b.hasChildNodes()&&_12b.lastChild.nodeType==dojo.dom.TEXT_NODE){
_12b.removeChild(_12b.lastChild);
}
}
while(_12b.hasChildNodes()){
_12c.appendChild(_12b.firstChild);
_12e++;
}
return _12e;
};
dojo.dom.copyChildren=function(_12f,_130,trim){
var _132=_12f.cloneNode(true);
return this.moveChildren(_132,_130,trim);
};
dojo.dom.removeChildren=function(node){
var _134=node.childNodes.length;
while(node.hasChildNodes()){
node.removeChild(node.firstChild);
}
return _134;
};
dojo.dom.replaceChildren=function(node,_136){
dojo.dom.removeChildren(node);
node.appendChild(_136);
};
dojo.dom.removeNode=function(node){
if(node&&node.parentNode){
return node.parentNode.removeChild(node);
}
};
dojo.dom.getAncestors=function(node,_139,_13a){
var _13b=[];
var _13c=dojo.lang.isFunction(_139);
while(node){
if(!_13c||_139(node)){
_13b.push(node);
}
if(_13a&&_13b.length>0){
return _13b[0];
}
node=node.parentNode;
}
if(_13a){
return null;
}
return _13b;
};
dojo.dom.getAncestorsByTag=function(node,tag,_13f){
tag=tag.toLowerCase();
return dojo.dom.getAncestors(node,function(el){
return ((el.tagName)&&(el.tagName.toLowerCase()==tag));
},_13f);
};
dojo.dom.getFirstAncestorByTag=function(node,tag){
return dojo.dom.getAncestorsByTag(node,tag,true);
};
dojo.dom.isDescendantOf=function(node,_144,_145){
if(_145&&node){
node=node.parentNode;
}
while(node){
if(node==_144){
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
if(node.xml){
return node.xml;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(node);
}
}
}
};
dojo.dom.createDocument=function(){
var doc=null;
if(!dj_undef("ActiveXObject")){
var _148=["MSXML2","Microsoft","MSXML","MSXML3"];
for(var i=0;i<_148.length;i++){
try{
doc=new ActiveXObject(_148[i]+".XMLDOM");
}
catch(e){
}
if(doc){
break;
}
}
}else{
if((document.implementation)&&(document.implementation.createDocument)){
doc=document.implementation.createDocument("","",null);
}
}
return doc;
};
dojo.dom.createDocumentFromText=function(str,_14b){
if(!_14b){
_14b="text/xml";
}
if(!dj_undef("DOMParser")){
var _14c=new DOMParser();
return _14c.parseFromString(str,_14b);
}else{
if(!dj_undef("ActiveXObject")){
var _14d=dojo.dom.createDocument();
if(_14d){
_14d.async=false;
_14d.loadXML(str);
return _14d;
}else{
dojo.debug("toXml didn't work?");
}
}else{
if(document.createElement){
var tmp=document.createElement("xml");
tmp.innerHTML=str;
if(document.implementation&&document.implementation.createDocument){
var _14f=document.implementation.createDocument("foo","",null);
for(var i=0;i<tmp.childNodes.length;i++){
_14f.importNode(tmp.childNodes.item(i),true);
}
return _14f;
}
return ((tmp.document)&&(tmp.document.firstChild?tmp.document.firstChild:tmp));
}
}
}
return null;
};
dojo.dom.prependChild=function(node,_152){
if(_152.firstChild){
_152.insertBefore(node,_152.firstChild);
}else{
_152.appendChild(node);
}
return true;
};
dojo.dom.insertBefore=function(node,ref,_155){
if(_155!=true&&(node===ref||node.nextSibling===ref)){
return false;
}
var _156=ref.parentNode;
_156.insertBefore(node,ref);
return true;
};
dojo.dom.insertAfter=function(node,ref,_159){
var pn=ref.parentNode;
if(ref==pn.lastChild){
if((_159!=true)&&(node===ref)){
return false;
}
pn.appendChild(node);
}else{
return this.insertBefore(node,ref.nextSibling,_159);
}
return true;
};
dojo.dom.insertAtPosition=function(node,ref,_15d){
if((!node)||(!ref)||(!_15d)){
return false;
}
switch(_15d.toLowerCase()){
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
dojo.dom.insertAtIndex=function(node,_15f,_160){
var _161=_15f.childNodes;
if(!_161.length){
_15f.appendChild(node);
return true;
}
var _162=null;
for(var i=0;i<_161.length;i++){
var _164=_161.item(i)["getAttribute"]?parseInt(_161.item(i).getAttribute("dojoinsertionindex")):-1;
if(_164<_160){
_162=_161.item(i);
}
}
if(_162){
return dojo.dom.insertAfter(node,_162);
}else{
return dojo.dom.insertBefore(node,_161.item(0));
}
};
dojo.dom.textContent=function(node,text){
if(text){
dojo.dom.replaceChildren(node,document.createTextNode(text));
return text;
}else{
var _167="";
if(node==null){
return _167;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
_167+=dojo.dom.textContent(node.childNodes[i]);
break;
case 3:
case 2:
case 4:
_167+=node.childNodes[i].nodeValue;
break;
default:
break;
}
}
return _167;
}
};
dojo.dom.collectionToArray=function(_169){
dojo.deprecated("dojo.dom.collectionToArray","use dojo.lang.toArray instead","0.4");
return dojo.lang.toArray(_169);
};
dojo.dom.hasParent=function(node){
return node&&node.parentNode&&dojo.dom.isNode(node.parentNode);
};
dojo.dom.isTag=function(node){
if(node&&node.tagName){
var arr=dojo.lang.toArray(arguments,1);
return arr[dojo.lang.find(node.tagName,arr)]||"";
}
return "";
};
dojo.provide("dojo.graphics.color");
dojo.require("dojo.lang.array");
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
dojo.graphics.color.Color.fromArray=function(arr){
return new dojo.graphics.color.Color(arr[0],arr[1],arr[2],arr[3]);
};
dojo.lang.extend(dojo.graphics.color.Color,{toRgb:function(_173){
if(_173){
return this.toRgba();
}else{
return [this.r,this.g,this.b];
}
},toRgba:function(){
return [this.r,this.g,this.b,this.a];
},toHex:function(){
return dojo.graphics.color.rgb2hex(this.toRgb());
},toCss:function(){
return "rgb("+this.toRgb().join()+")";
},toString:function(){
return this.toHex();
},blend:function(_174,_175){
return dojo.graphics.color.blend(this.toRgb(),new dojo.graphics.color.Color(_174).toRgb(),_175);
}});
dojo.graphics.color.named={white:[255,255,255],black:[0,0,0],red:[255,0,0],green:[0,255,0],blue:[0,0,255],navy:[0,0,128],gray:[128,128,128],silver:[192,192,192]};
dojo.graphics.color.blend=function(a,b,_178){
if(typeof a=="string"){
return dojo.graphics.color.blendHex(a,b,_178);
}
if(!_178){
_178=0;
}else{
if(_178>1){
_178=1;
}else{
if(_178<-1){
_178=-1;
}
}
}
var c=new Array(3);
for(var i=0;i<3;i++){
var half=Math.abs(a[i]-b[i])/2;
c[i]=Math.floor(Math.min(a[i],b[i])+half+(half*_178));
}
return c;
};
dojo.graphics.color.blendHex=function(a,b,_17e){
return dojo.graphics.color.rgb2hex(dojo.graphics.color.blend(dojo.graphics.color.hex2rgb(a),dojo.graphics.color.hex2rgb(b),_17e));
};
dojo.graphics.color.extractRGB=function(_17f){
var hex="0123456789abcdef";
_17f=_17f.toLowerCase();
if(_17f.indexOf("rgb")==0){
var _181=_17f.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
var ret=_181.splice(1,3);
return ret;
}else{
var _183=dojo.graphics.color.hex2rgb(_17f);
if(_183){
return _183;
}else{
return dojo.graphics.color.named[_17f]||[255,255,255];
}
}
};
dojo.graphics.color.hex2rgb=function(hex){
var _185="0123456789ABCDEF";
var rgb=new Array(3);
if(hex.indexOf("#")==0){
hex=hex.substring(1);
}
hex=hex.toUpperCase();
if(hex.replace(new RegExp("["+_185+"]","g"),"")!=""){
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
rgb[i]=_185.indexOf(rgb[i].charAt(0))*16+_185.indexOf(rgb[i].charAt(1));
}
return rgb;
};
dojo.graphics.color.rgb2hex=function(r,g,b){
if(dojo.lang.isArray(r)){
g=r[1]||0;
b=r[2]||0;
r=r[0]||0;
}
var ret=dojo.lang.map([r,g,b],function(x){
x=new Number(x);
var s=x.toString(16);
while(s.length<2){
s="0"+s;
}
return s;
});
ret.unshift("#");
return ret.join("");
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
var _193=new dojo.uri.Uri(arguments[i].toString());
var _194=new dojo.uri.Uri(uri.toString());
if(_193.path==""&&_193.scheme==null&&_193.authority==null&&_193.query==null){
if(_193.fragment!=null){
_194.fragment=_193.fragment;
}
_193=_194;
}else{
if(_193.scheme==null){
_193.scheme=_194.scheme;
if(_193.authority==null){
_193.authority=_194.authority;
if(_193.path.charAt(0)!="/"){
var path=_194.path.substring(0,_194.path.lastIndexOf("/")+1)+_193.path;
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
_193.path=segs.join("/");
}
}
}
}
uri="";
if(_193.scheme!=null){
uri+=_193.scheme+":";
}
if(_193.authority!=null){
uri+="//"+_193.authority;
}
uri+=_193.path;
if(_193.query!=null){
uri+="?"+_193.query;
}
if(_193.fragment!=null){
uri+="#"+_193.fragment;
}
}
this.uri=uri.toString();
var _198="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
var r=this.uri.match(new RegExp(_198));
this.scheme=r[2]||(r[1]?"":null);
this.authority=r[4]||(r[3]?"":null);
this.path=r[5];
this.query=r[7]||(r[6]?"":null);
this.fragment=r[9]||(r[8]?"":null);
if(this.authority!=null){
_198="^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
r=this.authority.match(new RegExp(_198));
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
dojo.require("dojo.graphics.color");
dojo.require("dojo.uri.Uri");
dojo.require("dojo.lang.common");
(function(){
var h=dojo.render.html;
var ds=dojo.style;
var db=document["body"]||document["documentElement"];
ds.boxSizing={MARGIN_BOX:"margin-box",BORDER_BOX:"border-box",PADDING_BOX:"padding-box",CONTENT_BOX:"content-box"};
var bs=ds.boxSizing;
ds.getBoxSizing=function(node){
if((h.ie)||(h.opera)){
var cm=document["compatMode"];
if((cm=="BackCompat")||(cm=="QuirksMode")){
return bs.BORDER_BOX;
}else{
return bs.CONTENT_BOX;
}
}else{
if(arguments.length==0){
node=document.documentElement;
}
var _1a0=ds.getStyle(node,"-moz-box-sizing");
if(!_1a0){
_1a0=ds.getStyle(node,"box-sizing");
}
return (_1a0?_1a0:bs.CONTENT_BOX);
}
};
ds.isBorderBox=function(node){
return (ds.getBoxSizing(node)==bs.BORDER_BOX);
};
ds.getUnitValue=function(node,_1a3,_1a4){
var s=ds.getComputedStyle(node,_1a3);
if((!s)||((s=="auto")&&(_1a4))){
return {value:0,units:"px"};
}
if(dojo.lang.isUndefined(s)){
return ds.getUnitValue.bad;
}
var _1a6=s.match(/(\-?[\d.]+)([a-z%]*)/i);
if(!_1a6){
return ds.getUnitValue.bad;
}
return {value:Number(_1a6[1]),units:_1a6[2].toLowerCase()};
};
ds.getUnitValue.bad={value:NaN,units:""};
ds.getPixelValue=function(node,_1a8,_1a9){
var _1aa=ds.getUnitValue(node,_1a8,_1a9);
if(isNaN(_1aa.value)){
return 0;
}
if((_1aa.value)&&(_1aa.units!="px")){
return NaN;
}
return _1aa.value;
};
ds.getNumericStyle=function(){
dojo.deprecated("dojo.(style|html).getNumericStyle","in favor of dojo.(style|html).getPixelValue","0.4");
return ds.getPixelValue.apply(this,arguments);
};
ds.setPositivePixelValue=function(node,_1ac,_1ad){
if(isNaN(_1ad)){
return false;
}
node.style[_1ac]=Math.max(0,_1ad)+"px";
return true;
};
ds._sumPixelValues=function(node,_1af,_1b0){
var _1b1=0;
for(var x=0;x<_1af.length;x++){
_1b1+=ds.getPixelValue(node,_1af[x],_1b0);
}
return _1b1;
};
ds.isPositionAbsolute=function(node){
return (ds.getComputedStyle(node,"position")=="absolute");
};
ds.getBorderExtent=function(node,side){
return (ds.getStyle(node,"border-"+side+"-style")=="none"?0:ds.getPixelValue(node,"border-"+side+"-width"));
};
ds.getMarginWidth=function(node){
return ds._sumPixelValues(node,["margin-left","margin-right"],ds.isPositionAbsolute(node));
};
ds.getBorderWidth=function(node){
return ds.getBorderExtent(node,"left")+ds.getBorderExtent(node,"right");
};
ds.getPaddingWidth=function(node){
return ds._sumPixelValues(node,["padding-left","padding-right"],true);
};
ds.getPadBorderWidth=function(node){
return ds.getPaddingWidth(node)+ds.getBorderWidth(node);
};
ds.getContentBoxWidth=function(node){
node=dojo.byId(node);
return node.offsetWidth-ds.getPadBorderWidth(node);
};
ds.getBorderBoxWidth=function(node){
node=dojo.byId(node);
return node.offsetWidth;
};
ds.getMarginBoxWidth=function(node){
return ds.getInnerWidth(node)+ds.getMarginWidth(node);
};
ds.setContentBoxWidth=function(node,_1be){
node=dojo.byId(node);
if(ds.isBorderBox(node)){
_1be+=ds.getPadBorderWidth(node);
}
return ds.setPositivePixelValue(node,"width",_1be);
};
ds.setMarginBoxWidth=function(node,_1c0){
node=dojo.byId(node);
if(!ds.isBorderBox(node)){
_1c0-=ds.getPadBorderWidth(node);
}
_1c0-=ds.getMarginWidth(node);
return ds.setPositivePixelValue(node,"width",_1c0);
};
ds.getContentWidth=ds.getContentBoxWidth;
ds.getInnerWidth=ds.getBorderBoxWidth;
ds.getOuterWidth=ds.getMarginBoxWidth;
ds.setContentWidth=ds.setContentBoxWidth;
ds.setOuterWidth=ds.setMarginBoxWidth;
ds.getMarginHeight=function(node){
return ds._sumPixelValues(node,["margin-top","margin-bottom"],ds.isPositionAbsolute(node));
};
ds.getBorderHeight=function(node){
return ds.getBorderExtent(node,"top")+ds.getBorderExtent(node,"bottom");
};
ds.getPaddingHeight=function(node){
return ds._sumPixelValues(node,["padding-top","padding-bottom"],true);
};
ds.getPadBorderHeight=function(node){
return ds.getPaddingHeight(node)+ds.getBorderHeight(node);
};
ds.getContentBoxHeight=function(node){
node=dojo.byId(node);
return node.offsetHeight-ds.getPadBorderHeight(node);
};
ds.getBorderBoxHeight=function(node){
node=dojo.byId(node);
return node.offsetHeight;
};
ds.getMarginBoxHeight=function(node){
return ds.getInnerHeight(node)+ds.getMarginHeight(node);
};
ds.setContentBoxHeight=function(node,_1c9){
node=dojo.byId(node);
if(ds.isBorderBox(node)){
_1c9+=ds.getPadBorderHeight(node);
}
return ds.setPositivePixelValue(node,"height",_1c9);
};
ds.setMarginBoxHeight=function(node,_1cb){
node=dojo.byId(node);
if(!ds.isBorderBox(node)){
_1cb-=ds.getPadBorderHeight(node);
}
_1cb-=ds.getMarginHeight(node);
return ds.setPositivePixelValue(node,"height",_1cb);
};
ds.getContentHeight=ds.getContentBoxHeight;
ds.getInnerHeight=ds.getBorderBoxHeight;
ds.getOuterHeight=ds.getMarginBoxHeight;
ds.setContentHeight=ds.setContentBoxHeight;
ds.setOuterHeight=ds.setMarginBoxHeight;
ds.getAbsolutePosition=ds.abs=function(node,_1cd){
node=dojo.byId(node);
var ret=[];
ret.x=ret.y=0;
var st=dojo.html.getScrollTop();
var sl=dojo.html.getScrollLeft();
if(h.ie){
with(node.getBoundingClientRect()){
ret.x=left-2;
ret.y=top-2;
}
}else{
if(document.getBoxObjectFor){
var bo=document.getBoxObjectFor(node);
ret.x=bo.x-ds.sumAncestorProperties(node,"scrollLeft");
ret.y=bo.y-ds.sumAncestorProperties(node,"scrollTop");
}else{
if(node["offsetParent"]){
var _1d2;
if((h.safari)&&(node.style.getPropertyValue("position")=="absolute")&&(node.parentNode==db)){
_1d2=db;
}else{
_1d2=db.parentNode;
}
if(node.parentNode!=db){
var nd=node;
if(window.opera){
nd=db;
}
ret.x-=ds.sumAncestorProperties(nd,"scrollLeft");
ret.y-=ds.sumAncestorProperties(nd,"scrollTop");
}
do{
var n=node["offsetLeft"];
ret.x+=isNaN(n)?0:n;
var m=node["offsetTop"];
ret.y+=isNaN(m)?0:m;
node=node.offsetParent;
}while((node!=_1d2)&&(node!=null));
}else{
if(node["x"]&&node["y"]){
ret.x+=isNaN(node.x)?0:node.x;
ret.y+=isNaN(node.y)?0:node.y;
}
}
}
}
if(_1cd){
ret.y+=st;
ret.x+=sl;
}
ret[0]=ret.x;
ret[1]=ret.y;
return ret;
};
ds.sumAncestorProperties=function(node,prop){
node=dojo.byId(node);
if(!node){
return 0;
}
var _1d8=0;
while(node){
var val=node[prop];
if(val){
_1d8+=val-0;
if(node==document.body){
break;
}
}
node=node.parentNode;
}
return _1d8;
};
ds.getTotalOffset=function(node,type,_1dc){
return ds.abs(node,_1dc)[(type=="top")?"y":"x"];
};
ds.getAbsoluteX=ds.totalOffsetLeft=function(node,_1de){
return ds.getTotalOffset(node,"left",_1de);
};
ds.getAbsoluteY=ds.totalOffsetTop=function(node,_1e0){
return ds.getTotalOffset(node,"top",_1e0);
};
ds.styleSheet=null;
ds.insertCssRule=function(_1e1,_1e2,_1e3){
if(!ds.styleSheet){
if(document.createStyleSheet){
ds.styleSheet=document.createStyleSheet();
}else{
if(document.styleSheets[0]){
ds.styleSheet=document.styleSheets[0];
}else{
return null;
}
}
}
if(arguments.length<3){
if(ds.styleSheet.cssRules){
_1e3=ds.styleSheet.cssRules.length;
}else{
if(ds.styleSheet.rules){
_1e3=ds.styleSheet.rules.length;
}else{
return null;
}
}
}
if(ds.styleSheet.insertRule){
var rule=_1e1+" { "+_1e2+" }";
return ds.styleSheet.insertRule(rule,_1e3);
}else{
if(ds.styleSheet.addRule){
return ds.styleSheet.addRule(_1e1,_1e2,_1e3);
}else{
return null;
}
}
};
ds.removeCssRule=function(_1e5){
if(!ds.styleSheet){
dojo.debug("no stylesheet defined for removing rules");
return false;
}
if(h.ie){
if(!_1e5){
_1e5=ds.styleSheet.rules.length;
ds.styleSheet.removeRule(_1e5);
}
}else{
if(document.styleSheets[0]){
if(!_1e5){
_1e5=ds.styleSheet.cssRules.length;
}
ds.styleSheet.deleteRule(_1e5);
}
}
return true;
};
ds.insertCssFile=function(URI,doc,_1e8){
if(!URI){
return;
}
if(!doc){
doc=document;
}
var _1e9=dojo.hostenv.getText(URI);
_1e9=ds.fixPathsInCssText(_1e9,URI);
if(_1e8){
var _1ea=doc.getElementsByTagName("style");
var _1eb="";
for(var i=0;i<_1ea.length;i++){
_1eb=(_1ea[i].styleSheet&&_1ea[i].styleSheet.cssText)?_1ea[i].styleSheet.cssText:_1ea[i].innerHTML;
if(_1e9==_1eb){
return;
}
}
}
var _1ed=ds.insertCssText(_1e9);
if(_1ed&&djConfig.isDebug){
_1ed.setAttribute("dbgHref",URI);
}
return _1ed;
};
ds.insertCssText=function(_1ee,doc,URI){
if(!_1ee){
return;
}
if(!doc){
doc=document;
}
if(URI){
_1ee=ds.fixPathsInCssText(_1ee,URI);
}
var _1f1=doc.createElement("style");
_1f1.setAttribute("type","text/css");
var head=doc.getElementsByTagName("head")[0];
if(!head){
dojo.debug("No head tag in document, aborting styles");
return;
}else{
head.appendChild(_1f1);
}
if(_1f1.styleSheet){
_1f1.styleSheet.cssText=_1ee;
}else{
var _1f3=doc.createTextNode(_1ee);
_1f1.appendChild(_1f3);
}
return _1f1;
};
ds.fixPathsInCssText=function(_1f4,URI){
if(!_1f4||!URI){
return;
}
var pos=0;
var str="";
var url="";
while(pos!=-1){
pos=0;
url="";
pos=_1f4.indexOf("url(",pos);
if(pos<0){
break;
}
str+=_1f4.slice(0,pos+4);
_1f4=_1f4.substring(pos+4,_1f4.length);
url+=_1f4.match(/^[\t\s\w()\/.\\'"-:#=&?]*\)/)[0];
_1f4=_1f4.substring(url.length-1,_1f4.length);
url=url.replace(/^[\s\t]*(['"]?)([\w()\/.\\'"-:#=&?]*)\1[\s\t]*?\)/,"$2");
if(url.search(/(file|https?|ftps?):\/\//)==-1){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=url;
}
return str+_1f4;
};
ds.getBackgroundColor=function(node){
node=dojo.byId(node);
var _1fa;
do{
_1fa=ds.getStyle(node,"background-color");
if(_1fa.toLowerCase()=="rgba(0, 0, 0, 0)"){
_1fa="transparent";
}
if(node==document.getElementsByTagName("body")[0]){
node=null;
break;
}
node=node.parentNode;
}while(node&&dojo.lang.inArray(_1fa,["transparent",""]));
if(_1fa=="transparent"){
_1fa=[255,255,255,0];
}else{
_1fa=dojo.graphics.color.extractRGB(_1fa);
}
return _1fa;
};
ds.getComputedStyle=function(node,_1fc,_1fd){
node=dojo.byId(node);
var _1fc=ds.toSelectorCase(_1fc);
var _1fe=ds.toCamelCase(_1fc);
if(!node||!node.style){
return _1fd;
}else{
if(document.defaultView){
try{
var cs=document.defaultView.getComputedStyle(node,"");
if(cs){
return cs.getPropertyValue(_1fc);
}
}
catch(e){
if(node.style.getPropertyValue){
return node.style.getPropertyValue(_1fc);
}else{
return _1fd;
}
}
}else{
if(node.currentStyle){
return node.currentStyle[_1fe];
}
}
}
if(node.style.getPropertyValue){
return node.style.getPropertyValue(_1fc);
}else{
return _1fd;
}
};
ds.getStyleProperty=function(node,_201){
node=dojo.byId(node);
return (node&&node.style?node.style[ds.toCamelCase(_201)]:undefined);
};
ds.getStyle=function(node,_203){
var _204=ds.getStyleProperty(node,_203);
return (_204?_204:ds.getComputedStyle(node,_203));
};
ds.setStyle=function(node,_206,_207){
node=dojo.byId(node);
if(node&&node.style){
var _208=ds.toCamelCase(_206);
node.style[_208]=_207;
}
};
ds.toCamelCase=function(_209){
var arr=_209.split("-"),cc=arr[0];
for(var i=1;i<arr.length;i++){
cc+=arr[i].charAt(0).toUpperCase()+arr[i].substring(1);
}
return cc;
};
ds.toSelectorCase=function(_20c){
return _20c.replace(/([A-Z])/g,"-$1").toLowerCase();
};
ds.setOpacity=function setOpacity(node,_20e,_20f){
node=dojo.byId(node);
if(!_20f){
if(_20e>=1){
if(h.ie){
ds.clearOpacity(node);
return;
}else{
_20e=0.999999;
}
}else{
if(_20e<0){
_20e=0;
}
}
}
if(h.ie){
if(node.nodeName.toLowerCase()=="tr"){
var tds=node.getElementsByTagName("td");
for(var x=0;x<tds.length;x++){
tds[x].style.filter="Alpha(Opacity="+_20e*100+")";
}
}
node.style.filter="Alpha(Opacity="+_20e*100+")";
}else{
if(h.moz){
node.style.opacity=_20e;
node.style.MozOpacity=_20e;
}else{
if(h.safari){
node.style.opacity=_20e;
node.style.KhtmlOpacity=_20e;
}else{
node.style.opacity=_20e;
}
}
}
};
ds.getOpacity=function getOpacity(node){
node=dojo.byId(node);
if(h.ie){
var opac=(node.filters&&node.filters.alpha&&typeof node.filters.alpha.opacity=="number"?node.filters.alpha.opacity:100)/100;
}else{
var opac=node.style.opacity||node.style.MozOpacity||node.style.KhtmlOpacity||1;
}
return opac>=0.999999?1:Number(opac);
};
ds.clearOpacity=function clearOpacity(node){
node=dojo.byId(node);
var ns=node.style;
if(h.ie){
try{
if(node.filters&&node.filters.alpha){
ns.filter="";
}
}
catch(e){
}
}else{
if(h.moz){
ns.opacity=1;
ns.MozOpacity=1;
}else{
if(h.safari){
ns.opacity=1;
ns.KhtmlOpacity=1;
}else{
ns.opacity=1;
}
}
}
};
ds.setStyleAttributes=function(node,_217){
var _218={"opacity":dojo.style.setOpacity,"content-height":dojo.style.setContentHeight,"content-width":dojo.style.setContentWidth,"outer-height":dojo.style.setOuterHeight,"outer-width":dojo.style.setOuterWidth};
var _219=_217.replace(/(;)?\s*$/,"").split(";");
for(var i=0;i<_219.length;i++){
var _21b=_219[i].split(":");
var name=_21b[0].replace(/\s*$/,"").replace(/^\s*/,"").toLowerCase();
var _21d=_21b[1].replace(/\s*$/,"").replace(/^\s*/,"");
if(dojo.lang.has(_218,name)){
_218[name](node,_21d);
}else{
node.style[dojo.style.toCamelCase(name)]=_21d;
}
}
};
ds._toggle=function(node,_21f,_220){
node=dojo.byId(node);
_220(node,!_21f(node));
return _21f(node);
};
ds.show=function(node){
node=dojo.byId(node);
if(ds.getStyleProperty(node,"display")=="none"){
ds.setStyle(node,"display",(node.dojoDisplayCache||""));
node.dojoDisplayCache=undefined;
}
};
ds.hide=function(node){
node=dojo.byId(node);
if(typeof node["dojoDisplayCache"]=="undefined"){
var d=ds.getStyleProperty(node,"display");
if(d!="none"){
node.dojoDisplayCache=d;
}
}
ds.setStyle(node,"display","none");
};
ds.setShowing=function(node,_225){
ds[(_225?"show":"hide")](node);
};
ds.isShowing=function(node){
return (ds.getStyleProperty(node,"display")!="none");
};
ds.toggleShowing=function(node){
return ds._toggle(node,ds.isShowing,ds.setShowing);
};
ds.displayMap={tr:"",td:"",th:"",img:"inline",span:"inline",input:"inline",button:"inline"};
ds.suggestDisplayByTagName=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
var tag=node.tagName.toLowerCase();
return (tag in ds.displayMap?ds.displayMap[tag]:"block");
}
};
ds.setDisplay=function(node,_22b){
ds.setStyle(node,"display",(dojo.lang.isString(_22b)?_22b:(_22b?ds.suggestDisplayByTagName(node):"none")));
};
ds.isDisplayed=function(node){
return (ds.getComputedStyle(node,"display")!="none");
};
ds.toggleDisplay=function(node){
return ds._toggle(node,ds.isDisplayed,ds.setDisplay);
};
ds.setVisibility=function(node,_22f){
ds.setStyle(node,"visibility",(dojo.lang.isString(_22f)?_22f:(_22f?"visible":"hidden")));
};
ds.isVisible=function(node){
return (ds.getComputedStyle(node,"visibility")!="hidden");
};
ds.toggleVisibility=function(node){
return ds._toggle(node,ds.isVisible,ds.setVisibility);
};
ds.toCoordinateArray=function(_232,_233){
if(dojo.lang.isArray(_232)){
while(_232.length<4){
_232.push(0);
}
while(_232.length>4){
_232.pop();
}
var ret=_232;
}else{
var node=dojo.byId(_232);
var pos=ds.getAbsolutePosition(node,_233);
var ret=[pos.x,pos.y,ds.getBorderBoxWidth(node),ds.getBorderBoxHeight(node)];
}
ret.x=ret[0];
ret.y=ret[1];
ret.w=ret[2];
ret.h=ret[3];
return ret;
};
})();
dojo.provide("dojo.string.common");
dojo.require("dojo.string");
dojo.string.trim=function(str,wh){
if(!str.replace){
return str;
}
if(!str.length){
return str;
}
var re=(wh>0)?(/^\s+/):(wh<0)?(/\s+$/):(/^\s+|\s+$/g);
return str.replace(re,"");
};
dojo.string.trimStart=function(str){
return dojo.string.trim(str,1);
};
dojo.string.trimEnd=function(str){
return dojo.string.trim(str,-1);
};
dojo.string.repeat=function(str,_23d,_23e){
var out="";
for(var i=0;i<_23d;i++){
out+=str;
if(_23e&&i<_23d-1){
out+=_23e;
}
}
return out;
};
dojo.string.pad=function(str,len,c,dir){
var out=String(str);
if(!c){
c="0";
}
if(!dir){
dir=1;
}
while(out.length<len){
if(dir>0){
out=c+out;
}else{
out+=c;
}
}
return out;
};
dojo.string.padLeft=function(str,len,c){
return dojo.string.pad(str,len,c,1);
};
dojo.string.padRight=function(str,len,c){
return dojo.string.pad(str,len,c,-1);
};
dojo.provide("dojo.string");
dojo.require("dojo.string.common");
dojo.provide("dojo.html");
dojo.require("dojo.lang.func");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.require("dojo.string");
dojo.lang.mixin(dojo.html,dojo.dom);
dojo.lang.mixin(dojo.html,dojo.style);
dojo.html.clearSelection=function(){
try{
if(window["getSelection"]){
if(dojo.render.html.safari){
window.getSelection().collapse();
}else{
window.getSelection().removeAllRanges();
}
}else{
if(document.selection){
if(document.selection.empty){
document.selection.empty();
}else{
if(document.selection.clear){
document.selection.clear();
}
}
}
}
return true;
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.html.disableSelection=function(_24c){
_24c=dojo.byId(_24c)||document.body;
var h=dojo.render.html;
if(h.mozilla){
_24c.style.MozUserSelect="none";
}else{
if(h.safari){
_24c.style.KhtmlUserSelect="none";
}else{
if(h.ie){
_24c.unselectable="on";
}else{
return false;
}
}
}
return true;
};
dojo.html.enableSelection=function(_24e){
_24e=dojo.byId(_24e)||document.body;
var h=dojo.render.html;
if(h.mozilla){
_24e.style.MozUserSelect="";
}else{
if(h.safari){
_24e.style.KhtmlUserSelect="";
}else{
if(h.ie){
_24e.unselectable="off";
}else{
return false;
}
}
}
return true;
};
dojo.html.selectElement=function(_250){
_250=dojo.byId(_250);
if(document.selection&&document.body.createTextRange){
var _251=document.body.createTextRange();
_251.moveToElementText(_250);
_251.select();
}else{
if(window["getSelection"]){
var _252=window.getSelection();
if(_252["selectAllChildren"]){
_252.selectAllChildren(_250);
}
}
}
};
dojo.html.selectInputText=function(_253){
_253=dojo.byId(_253);
if(document.selection&&document.body.createTextRange){
var _254=_253.createTextRange();
_254.moveStart("character",0);
_254.moveEnd("character",_253.value.length);
_254.select();
}else{
if(window["getSelection"]){
var _255=window.getSelection();
_253.setSelectionRange(0,_253.value.length);
}
}
_253.focus();
};
dojo.html.isSelectionCollapsed=function(){
if(document["selection"]){
return document.selection.createRange().text=="";
}else{
if(window["getSelection"]){
var _256=window.getSelection();
if(dojo.lang.isString(_256)){
return _256=="";
}else{
return _256.isCollapsed;
}
}
}
};
dojo.html.getEventTarget=function(evt){
if(!evt){
evt=window.event||{};
}
var t=(evt.srcElement?evt.srcElement:(evt.target?evt.target:null));
while((t)&&(t.nodeType!=1)){
t=t.parentNode;
}
return t;
};
dojo.html.getDocumentWidth=function(){
dojo.deprecated("dojo.html.getDocument*","replaced by dojo.html.getViewport*","0.4");
return dojo.html.getViewportWidth();
};
dojo.html.getDocumentHeight=function(){
dojo.deprecated("dojo.html.getDocument*","replaced by dojo.html.getViewport*","0.4");
return dojo.html.getViewportHeight();
};
dojo.html.getDocumentSize=function(){
dojo.deprecated("dojo.html.getDocument*","replaced of dojo.html.getViewport*","0.4");
return dojo.html.getViewportSize();
};
dojo.html.getViewportWidth=function(){
var w=0;
if(window.innerWidth){
w=window.innerWidth;
}
if(dojo.exists(document,"documentElement.clientWidth")){
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
if(dojo.exists(document,"documentElement.clientHeight")){
return document.documentElement.clientHeight;
}
if(document.body){
return document.body.clientHeight;
}
return 0;
};
dojo.html.getViewportSize=function(){
var ret=[dojo.html.getViewportWidth(),dojo.html.getViewportHeight()];
ret.w=ret[0];
ret.h=ret[1];
return ret;
};
dojo.html.getScrollTop=function(){
return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
};
dojo.html.getScrollLeft=function(){
return window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;
};
dojo.html.getScrollOffset=function(){
var off=[dojo.html.getScrollLeft(),dojo.html.getScrollTop()];
off.x=off[0];
off.y=off[1];
return off;
};
dojo.html.getParentOfType=function(node,type){
dojo.deprecated("dojo.html.getParentOfType","replaced by dojo.html.getParentByType*","0.4");
return dojo.html.getParentByType(node,type);
};
dojo.html.getParentByType=function(node,type){
var _261=dojo.byId(node);
type=type.toLowerCase();
while((_261)&&(_261.nodeName.toLowerCase()!=type)){
if(_261==(document["body"]||document["documentElement"])){
return null;
}
_261=_261.parentNode;
}
return _261;
};
dojo.html.getAttribute=function(node,attr){
node=dojo.byId(node);
if((!node)||(!node.getAttribute)){
return null;
}
var ta=typeof attr=="string"?attr:new String(attr);
var v=node.getAttribute(ta.toUpperCase());
if((v)&&(typeof v=="string")&&(v!="")){
return v;
}
if(v&&v.value){
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
node=dojo.byId(node);
return dojo.html.getAttribute(node,attr)?true:false;
};
dojo.html.getClass=function(node){
node=dojo.byId(node);
if(!node){
return "";
}
var cs="";
if(node.className){
cs=node.className;
}else{
if(dojo.html.hasAttribute(node,"class")){
cs=dojo.html.getAttribute(node,"class");
}
}
return dojo.string.trim(cs);
};
dojo.html.getClasses=function(node){
var c=dojo.html.getClass(node);
return (c=="")?[]:c.split(/\s+/g);
};
dojo.html.hasClass=function(node,_26d){
return dojo.lang.inArray(dojo.html.getClasses(node),_26d);
};
dojo.html.prependClass=function(node,_26f){
_26f+=" "+dojo.html.getClass(node);
return dojo.html.setClass(node,_26f);
};
dojo.html.addClass=function(node,_271){
if(dojo.html.hasClass(node,_271)){
return false;
}
_271=dojo.string.trim(dojo.html.getClass(node)+" "+_271);
return dojo.html.setClass(node,_271);
};
dojo.html.setClass=function(node,_273){
node=dojo.byId(node);
var cs=new String(_273);
try{
if(typeof node.className=="string"){
node.className=cs;
}else{
if(node.setAttribute){
node.setAttribute("class",_273);
node.className=cs;
}else{
return false;
}
}
}
catch(e){
dojo.debug("dojo.html.setClass() failed",e);
}
return true;
};
dojo.html.removeClass=function(node,_276,_277){
var _276=dojo.string.trim(new String(_276));
try{
var cs=dojo.html.getClasses(node);
var nca=[];
if(_277){
for(var i=0;i<cs.length;i++){
if(cs[i].indexOf(_276)==-1){
nca.push(cs[i]);
}
}
}else{
for(var i=0;i<cs.length;i++){
if(cs[i]!=_276){
nca.push(cs[i]);
}
}
}
dojo.html.setClass(node,nca.join(" "));
}
catch(e){
dojo.debug("dojo.html.removeClass() failed",e);
}
return true;
};
dojo.html.replaceClass=function(node,_27c,_27d){
dojo.html.removeClass(node,_27d);
dojo.html.addClass(node,_27c);
};
dojo.html.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
dojo.html.getElementsByClass=function(_27e,_27f,_280,_281,_282){
_27f=dojo.byId(_27f)||document;
var _283=_27e.split(/\s+/g);
var _284=[];
if(_281!=1&&_281!=2){
_281=0;
}
var _285=new RegExp("(\\s|^)(("+_283.join(")|(")+"))(\\s|$)");
var _286=[];
if(!_282&&document.evaluate){
var _287="//"+(_280||"*")+"[contains(";
if(_281!=dojo.html.classMatchType.ContainsAny){
_287+="concat(' ',@class,' '), ' "+_283.join(" ') and contains(concat(' ',@class,' '), ' ")+" ')]";
}else{
_287+="concat(' ',@class,' '), ' "+_283.join(" ')) or contains(concat(' ',@class,' '), ' ")+" ')]";
}
var _288=document.evaluate(_287,_27f,null,XPathResult.ANY_TYPE,null);
var _289=_288.iterateNext();
while(_289){
try{
_286.push(_289);
_289=_288.iterateNext();
}
catch(e){
break;
}
}
return _286;
}else{
if(!_280){
_280="*";
}
_286=_27f.getElementsByTagName(_280);
var node,i=0;
outer:
while(node=_286[i++]){
var _28b=dojo.html.getClasses(node);
if(_28b.length==0){
continue outer;
}
var _28c=0;
for(var j=0;j<_28b.length;j++){
if(_285.test(_28b[j])){
if(_281==dojo.html.classMatchType.ContainsAny){
_284.push(node);
continue outer;
}else{
_28c++;
}
}else{
if(_281==dojo.html.classMatchType.IsOnly){
continue outer;
}
}
}
if(_28c==_283.length){
if((_281==dojo.html.classMatchType.IsOnly)&&(_28c==_28b.length)){
_284.push(node);
}else{
if(_281==dojo.html.classMatchType.ContainsAll){
_284.push(node);
}
}
}
}
return _284;
}
};
dojo.html.getElementsByClassName=dojo.html.getElementsByClass;
dojo.html.getCursorPosition=function(e){
e=e||window.event;
var _28f={x:0,y:0};
if(e.pageX||e.pageY){
_28f.x=e.pageX;
_28f.y=e.pageY;
}else{
var de=document.documentElement;
var db=document.body;
_28f.x=e.clientX+((de||db)["scrollLeft"])-((de||db)["clientLeft"]);
_28f.y=e.clientY+((de||db)["scrollTop"])-((de||db)["clientTop"]);
}
return _28f;
};
dojo.html.overElement=function(_292,e){
_292=dojo.byId(_292);
var _294=dojo.html.getCursorPosition(e);
with(dojo.html){
var top=getAbsoluteY(_292,true);
var _296=top+getInnerHeight(_292);
var left=getAbsoluteX(_292,true);
var _298=left+getInnerWidth(_292);
}
return (_294.x>=left&&_294.x<=_298&&_294.y>=top&&_294.y<=_296);
};
dojo.html.setActiveStyleSheet=function(_299){
var i=0,a,els=document.getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")){
a.disabled=true;
if(a.getAttribute("title")==_299){
a.disabled=false;
}
}
}
};
dojo.html.getActiveStyleSheet=function(){
var i=0,a,els=document.getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")&&!a.disabled){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.getPreferredStyleSheet=function(){
var i=0,a,els=document.getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("rel").indexOf("alt")==-1&&a.getAttribute("title")){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.body=function(){
return document.body||document.getElementsByTagName("body")[0];
};
dojo.html.isTag=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
var arr=dojo.lang.map(dojo.lang.toArray(arguments,1),function(a){
return String(a).toLowerCase();
});
return arr[dojo.lang.find(node.tagName.toLowerCase(),arr)]||"";
}
return "";
};
dojo.html.copyStyle=function(_2a0,_2a1){
if(dojo.lang.isUndefined(_2a1.style.cssText)){
_2a0.setAttribute("style",_2a1.getAttribute("style"));
}else{
_2a0.style.cssText=_2a1.style.cssText;
}
dojo.html.addClass(_2a0,dojo.html.getClass(_2a1));
};
dojo.html._callExtrasDeprecated=function(_2a2,args){
var _2a4="dojo.html.extras";
dojo.deprecated("dojo.html."+_2a2,"moved to "+_2a4,"0.4");
dojo["require"](_2a4);
return dojo.html[_2a2].apply(dojo.html,args);
};
dojo.html.createNodesFromText=function(){
return dojo.html._callExtrasDeprecated("createNodesFromText",arguments);
};
dojo.html.gravity=function(){
return dojo.html._callExtrasDeprecated("gravity",arguments);
};
dojo.html.placeOnScreen=function(){
return dojo.html._callExtrasDeprecated("placeOnScreen",arguments);
};
dojo.html.placeOnScreenPoint=function(){
return dojo.html._callExtrasDeprecated("placeOnScreenPoint",arguments);
};
dojo.html.renderedTextContent=function(){
return dojo.html._callExtrasDeprecated("renderedTextContent",arguments);
};
dojo.html.BackgroundIframe=function(){
return dojo.html._callExtrasDeprecated("BackgroundIframe",arguments);
};
dojo.provide("dojo.lfx.Animation");
dojo.provide("dojo.lfx.Line");
dojo.require("dojo.lang.func");
dojo.lfx.Line=function(_2a5,end){
this.start=_2a5;
this.end=end;
if(dojo.lang.isArray(_2a5)){
var diff=[];
dojo.lang.forEach(this.start,function(s,i){
diff[i]=this.end[i]-s;
},this);
this.getValue=function(n){
var res=[];
dojo.lang.forEach(this.start,function(s,i){
res[i]=(diff[i]*n)+s;
},this);
return res;
};
}else{
var diff=end-_2a5;
this.getValue=function(n){
return (diff*n)+this.start;
};
}
};
dojo.lfx.easeIn=function(n){
return Math.pow(n,3);
};
dojo.lfx.easeOut=function(n){
return (1-Math.pow(1-n,3));
};
dojo.lfx.easeInOut=function(n){
return ((3*Math.pow(n,2))-(2*Math.pow(n,3)));
};
dojo.lfx.IAnimation=function(){
};
dojo.lang.extend(dojo.lfx.IAnimation,{curve:null,duration:1000,easing:null,repeatCount:0,rate:25,handler:null,beforeBegin:null,onBegin:null,onAnimate:null,onEnd:null,onPlay:null,onPause:null,onStop:null,play:null,pause:null,stop:null,fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,(args||[]));
}
},_active:false,_paused:false});
dojo.lfx.Animation=function(_2b4,_2b5,_2b6,_2b7,_2b8,rate){
dojo.lfx.IAnimation.call(this);
if(dojo.lang.isNumber(_2b4)||(!_2b4&&_2b5.getValue)){
rate=_2b8;
_2b8=_2b7;
_2b7=_2b6;
_2b6=_2b5;
_2b5=_2b4;
_2b4=null;
}else{
if(_2b4.getValue||dojo.lang.isArray(_2b4)){
rate=_2b7;
_2b8=_2b6;
_2b7=_2b5;
_2b6=_2b4;
_2b5=null;
_2b4=null;
}
}
if(dojo.lang.isArray(_2b6)){
this.curve=new dojo.lfx.Line(_2b6[0],_2b6[1]);
}else{
this.curve=_2b6;
}
if(_2b5!=null&&_2b5>0){
this.duration=_2b5;
}
if(_2b8){
this.repeatCount=_2b8;
}
if(rate){
this.rate=rate;
}
if(_2b4){
this.handler=_2b4.handler;
this.beforeBegin=_2b4.beforeBegin;
this.onBegin=_2b4.onBegin;
this.onEnd=_2b4.onEnd;
this.onPlay=_2b4.onPlay;
this.onPause=_2b4.onPause;
this.onStop=_2b4.onStop;
this.onAnimate=_2b4.onAnimate;
}
if(_2b7&&dojo.lang.isFunction(_2b7)){
this.easing=_2b7;
}
};
dojo.inherits(dojo.lfx.Animation,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Animation,{_startTime:null,_endTime:null,_timer:null,_percent:0,_startRepeatCount:0,play:function(_2ba,_2bb){
if(_2bb){
clearTimeout(this._timer);
this._active=false;
this._paused=false;
this._percent=0;
}else{
if(this._active&&!this._paused){
return this;
}
}
this.fire("handler",["beforeBegin"]);
this.fire("beforeBegin");
if(_2ba>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_2bb);
}),_2ba);
return this;
}
this._startTime=new Date().valueOf();
if(this._paused){
this._startTime-=(this.duration*this._percent/100);
}
this._endTime=this._startTime+this.duration;
this._active=true;
this._paused=false;
var step=this._percent/100;
var _2bd=this.curve.getValue(step);
if(this._percent==0){
if(!this._startRepeatCount){
this._startRepeatCount=this.repeatCount;
}
this.fire("handler",["begin",_2bd]);
this.fire("onBegin",[_2bd]);
}
this.fire("handler",["play",_2bd]);
this.fire("onPlay",[_2bd]);
this._cycle();
return this;
},pause:function(){
clearTimeout(this._timer);
if(!this._active){
return this;
}
this._paused=true;
var _2be=this.curve.getValue(this._percent/100);
this.fire("handler",["pause",_2be]);
this.fire("onPause",[_2be]);
return this;
},gotoPercent:function(pct,_2c0){
clearTimeout(this._timer);
this._active=true;
this._paused=true;
this._percent=pct;
if(_2c0){
this.play();
}
},stop:function(_2c1){
clearTimeout(this._timer);
var step=this._percent/100;
if(_2c1){
step=1;
}
var _2c3=this.curve.getValue(step);
this.fire("handler",["stop",_2c3]);
this.fire("onStop",[_2c3]);
this._active=false;
this._paused=false;
return this;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}else{
return "stopped";
}
},_cycle:function(){
clearTimeout(this._timer);
if(this._active){
var curr=new Date().valueOf();
var step=(curr-this._startTime)/(this._endTime-this._startTime);
if(step>=1){
step=1;
this._percent=100;
}else{
this._percent=step*100;
}
if((this.easing)&&(dojo.lang.isFunction(this.easing))){
step=this.easing(step);
}
var _2c6=this.curve.getValue(step);
this.fire("handler",["animate",_2c6]);
this.fire("onAnimate",[_2c6]);
if(step<1){
this._timer=setTimeout(dojo.lang.hitch(this,"_cycle"),this.rate);
}else{
this._active=false;
this.fire("handler",["end"]);
this.fire("onEnd");
if(this.repeatCount>0){
this.repeatCount--;
this.play(null,true);
}else{
if(this.repeatCount==-1){
this.play(null,true);
}else{
if(this._startRepeatCount){
this.repeatCount=this._startRepeatCount;
this._startRepeatCount=0;
}
}
}
}
}
return this;
}});
dojo.lfx.Combine=function(){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._animsEnded=0;
var _2c7=arguments;
if(_2c7.length==1&&(dojo.lang.isArray(_2c7[0])||dojo.lang.isArrayLike(_2c7[0]))){
_2c7=_2c7[0];
}
var _2c8=this;
dojo.lang.forEach(_2c7,function(anim){
_2c8._anims.push(anim);
var _2ca=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_2ca();
_2c8._onAnimsEnded();
};
});
};
dojo.inherits(dojo.lfx.Combine,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Combine,{_animsEnded:0,play:function(_2cb,_2cc){
if(!this._anims.length){
return this;
}
this.fire("beforeBegin");
if(_2cb>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_2cc);
}),_2cb);
return this;
}
if(_2cc||this._anims[0].percent==0){
this.fire("onBegin");
}
this.fire("onPlay");
this._animsCall("play",null,_2cc);
return this;
},pause:function(){
this.fire("onPause");
this._animsCall("pause");
return this;
},stop:function(_2cd){
this.fire("onStop");
this._animsCall("stop",_2cd);
return this;
},_onAnimsEnded:function(){
this._animsEnded++;
if(this._animsEnded>=this._anims.length){
this.fire("onEnd");
}
return this;
},_animsCall:function(_2ce){
var args=[];
if(arguments.length>1){
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
}
var _2d1=this;
dojo.lang.forEach(this._anims,function(anim){
anim[_2ce](args);
},_2d1);
return this;
}});
dojo.lfx.Chain=function(){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._currAnim=-1;
var _2d3=arguments;
if(_2d3.length==1&&(dojo.lang.isArray(_2d3[0])||dojo.lang.isArrayLike(_2d3[0]))){
_2d3=_2d3[0];
}
var _2d4=this;
dojo.lang.forEach(_2d3,function(anim,i,_2d7){
_2d4._anims.push(anim);
var _2d8=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
if(i<_2d7.length-1){
anim.onEnd=function(){
_2d8();
_2d4._playNext();
};
}else{
anim.onEnd=function(){
_2d8();
_2d4.fire("onEnd");
};
}
},_2d4);
};
dojo.inherits(dojo.lfx.Chain,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Chain,{_currAnim:-1,play:function(_2d9,_2da){
if(!this._anims.length){
return this;
}
if(_2da||!this._anims[this._currAnim]){
this._currAnim=0;
}
var _2db=this._anims[this._currAnim];
this.fire("beforeBegin");
if(_2d9>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_2da);
}),_2d9);
return this;
}
if(_2db){
if(this._currAnim==0){
this.fire("handler",["begin",this._currAnim]);
this.fire("onBegin",[this._currAnim]);
}
this.fire("onPlay",[this._currAnim]);
_2db.play(null,_2da);
}
return this;
},pause:function(){
if(this._anims[this._currAnim]){
this._anims[this._currAnim].pause();
this.fire("onPause",[this._currAnim]);
}
return this;
},playPause:function(){
if(this._anims.length==0){
return this;
}
if(this._currAnim==-1){
this._currAnim=0;
}
var _2dc=this._anims[this._currAnim];
if(_2dc){
if(!_2dc._active||_2dc._paused){
this.play();
}else{
this.pause();
}
}
return this;
},stop:function(){
var _2dd=this._anims[this._currAnim];
if(_2dd){
_2dd.stop();
this.fire("onStop",[this._currAnim]);
}
return _2dd;
},_playNext:function(){
if(this._currAnim==-1||this._anims.length==0){
return this;
}
this._currAnim++;
if(this._anims[this._currAnim]){
this._anims[this._currAnim].play(null,true);
}
return this;
}});
dojo.lfx.combine=function(){
var _2de=arguments;
if(dojo.lang.isArray(arguments[0])){
_2de=arguments[0];
}
return new dojo.lfx.Combine(_2de);
};
dojo.lfx.chain=function(){
var _2df=arguments;
if(dojo.lang.isArray(arguments[0])){
_2df=arguments[0];
}
return new dojo.lfx.Chain(_2df);
};
dojo.provide("dojo.lfx.html");
dojo.require("dojo.lfx.Animation");
dojo.require("dojo.html");
dojo.lfx.html._byId=function(_2e0){
if(!_2e0){
return [];
}
if(dojo.lang.isArray(_2e0)){
if(!_2e0.alreadyChecked){
var n=[];
dojo.lang.forEach(_2e0,function(node){
n.push(dojo.byId(node));
});
n.alreadyChecked=true;
return n;
}else{
return _2e0;
}
}else{
var n=[];
n.push(dojo.byId(_2e0));
n.alreadyChecked=true;
return n;
}
};
dojo.lfx.html.propertyAnimation=function(_2e3,_2e4,_2e5,_2e6){
_2e3=dojo.lfx.html._byId(_2e3);
if(_2e3.length==1){
dojo.lang.forEach(_2e4,function(prop){
if(typeof prop["start"]=="undefined"){
if(prop.property!="opacity"){
prop.start=parseInt(dojo.style.getComputedStyle(_2e3[0],prop.property));
}else{
prop.start=dojo.style.getOpacity(_2e3[0]);
}
}
});
}
var _2e8=function(_2e9){
var _2ea=new Array(_2e9.length);
for(var i=0;i<_2e9.length;i++){
_2ea[i]=Math.round(_2e9[i]);
}
return _2ea;
};
var _2ec=function(n,_2ee){
n=dojo.byId(n);
if(!n||!n.style){
return;
}
for(var s in _2ee){
if(s=="opacity"){
dojo.style.setOpacity(n,_2ee[s]);
}else{
n.style[s]=_2ee[s];
}
}
};
var _2f0=function(_2f1){
this._properties=_2f1;
this.diffs=new Array(_2f1.length);
dojo.lang.forEach(_2f1,function(prop,i){
if(dojo.lang.isArray(prop.start)){
this.diffs[i]=null;
}else{
if(prop.start instanceof dojo.graphics.color.Color){
prop.startRgb=prop.start.toRgb();
prop.endRgb=prop.end.toRgb();
}else{
this.diffs[i]=prop.end-prop.start;
}
}
},this);
this.getValue=function(n){
var ret={};
dojo.lang.forEach(this._properties,function(prop,i){
var _2f8=null;
if(dojo.lang.isArray(prop.start)){
}else{
if(prop.start instanceof dojo.graphics.color.Color){
_2f8=(prop.units||"rgb")+"(";
for(var j=0;j<prop.startRgb.length;j++){
_2f8+=Math.round(((prop.endRgb[j]-prop.startRgb[j])*n)+prop.startRgb[j])+(j<prop.startRgb.length-1?",":"");
}
_2f8+=")";
}else{
_2f8=((this.diffs[i])*n)+prop.start+(prop.property!="opacity"?prop.units||"px":"");
}
}
ret[dojo.style.toCamelCase(prop.property)]=_2f8;
},this);
return ret;
};
};
var anim=new dojo.lfx.Animation({onAnimate:function(_2fb){
dojo.lang.forEach(_2e3,function(node){
_2ec(node,_2fb);
});
}},_2e5,new _2f0(_2e4),_2e6);
return anim;
};
dojo.lfx.html._makeFadeable=function(_2fd){
var _2fe=function(node){
if(dojo.render.html.ie){
if((node.style.zoom.length==0)&&(dojo.style.getStyle(node,"zoom")=="normal")){
node.style.zoom="1";
}
if((node.style.width.length==0)&&(dojo.style.getStyle(node,"width")=="auto")){
node.style.width="auto";
}
}
};
if(dojo.lang.isArrayLike(_2fd)){
dojo.lang.forEach(_2fd,_2fe);
}else{
_2fe(_2fd);
}
};
dojo.lfx.html.fadeIn=function(_300,_301,_302,_303){
_300=dojo.lfx.html._byId(_300);
dojo.lfx.html._makeFadeable(_300);
var anim=dojo.lfx.propertyAnimation(_300,[{property:"opacity",start:dojo.style.getOpacity(_300[0]),end:1}],_301,_302);
if(_303){
var _305=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_305();
_303(_300,anim);
};
}
return anim;
};
dojo.lfx.html.fadeOut=function(_306,_307,_308,_309){
_306=dojo.lfx.html._byId(_306);
dojo.lfx.html._makeFadeable(_306);
var anim=dojo.lfx.propertyAnimation(_306,[{property:"opacity",start:dojo.style.getOpacity(_306[0]),end:0}],_307,_308);
if(_309){
var _30b=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_30b();
_309(_306,anim);
};
}
return anim;
};
dojo.lfx.html.fadeShow=function(_30c,_30d,_30e,_30f){
var anim=dojo.lfx.html.fadeIn(_30c,_30d,_30e,_30f);
var _311=(anim["beforeBegin"])?dojo.lang.hitch(anim,"beforeBegin"):function(){
};
anim.beforeBegin=function(){
_311();
if(dojo.lang.isArrayLike(_30c)){
dojo.lang.forEach(_30c,dojo.style.show);
}else{
dojo.style.show(_30c);
}
};
return anim;
};
dojo.lfx.html.fadeHide=function(_312,_313,_314,_315){
var anim=dojo.lfx.html.fadeOut(_312,_313,_314,function(){
if(dojo.lang.isArrayLike(_312)){
dojo.lang.forEach(_312,dojo.style.hide);
}else{
dojo.style.hide(_312);
}
if(_315){
_315(_312,anim);
}
});
return anim;
};
dojo.lfx.html.wipeIn=function(_317,_318,_319,_31a){
_317=dojo.lfx.html._byId(_317);
var _31b=[];
dojo.lang.forEach(_317,function(node){
var _31d=dojo.style.getStyle(node,"overflow");
if(_31d=="visible"){
node.style.overflow="hidden";
}
node.style.height="0px";
dojo.style.show(node);
var anim=dojo.lfx.propertyAnimation(node,[{property:"height",start:0,end:node.scrollHeight}],_318,_319);
var _31f=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_31f();
node.style.overflow=_31d;
node.style.height="auto";
if(_31a){
_31a(node,anim);
}
};
_31b.push(anim);
});
if(_317.length>1){
return dojo.lfx.combine(_31b);
}else{
return _31b[0];
}
};
dojo.lfx.html.wipeOut=function(_320,_321,_322,_323){
_320=dojo.lfx.html._byId(_320);
var _324=[];
dojo.lang.forEach(_320,function(node){
var _326=dojo.style.getStyle(node,"overflow");
if(_326=="visible"){
node.style.overflow="hidden";
}
dojo.style.show(node);
var anim=dojo.lfx.propertyAnimation(node,[{property:"height",start:dojo.style.getContentBoxHeight(node),end:0}],_321,_322);
var _328=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_328();
dojo.style.hide(node);
node.style.overflow=_326;
if(_323){
_323(node,anim);
}
};
_324.push(anim);
});
if(_320.length>1){
return dojo.lfx.combine(_324);
}else{
return _324[0];
}
};
dojo.lfx.html.slideTo=function(_329,_32a,_32b,_32c,_32d){
_329=dojo.lfx.html._byId(_329);
var _32e=[];
dojo.lang.forEach(_329,function(node){
var top=null;
var left=null;
var init=(function(){
var _333=node;
return function(){
top=_333.offsetTop;
left=_333.offsetLeft;
if(!dojo.style.isPositionAbsolute(_333)){
var ret=dojo.style.abs(_333,true);
dojo.style.setStyleAttributes(_333,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,[{property:"top",start:top,end:_32a[0]},{property:"left",start:left,end:_32a[1]}],_32b,_32c);
var _336=(anim["beforeBegin"])?dojo.lang.hitch(anim,"beforeBegin"):function(){
};
anim.beforeBegin=function(){
_336();
init();
};
if(_32d){
var _337=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_337();
_32d(_329,anim);
};
}
_32e.push(anim);
});
if(_329.length>1){
return dojo.lfx.combine(_32e);
}else{
return _32e[0];
}
};
dojo.lfx.html.slideBy=function(_338,_339,_33a,_33b,_33c){
_338=dojo.lfx.html._byId(_338);
var _33d=[];
dojo.lang.forEach(_338,function(node){
var top=null;
var left=null;
var init=(function(){
var _342=node;
return function(){
top=node.offsetTop;
left=node.offsetLeft;
if(!dojo.style.isPositionAbsolute(_342)){
var ret=dojo.style.abs(_342);
dojo.style.setStyleAttributes(_342,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,[{property:"top",start:top,end:top+_339[0]},{property:"left",start:left,end:left+_339[1]}],_33a,_33b);
var _345=(anim["beforeBegin"])?dojo.lang.hitch(anim,"beforeBegin"):function(){
};
anim.beforeBegin=function(){
_345();
init();
};
if(_33c){
var _346=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_346();
_33c(_338,anim);
};
}
_33d.push(anim);
});
if(_338.length>1){
return dojo.lfx.combine(_33d);
}else{
return _33d[0];
}
};
dojo.lfx.html.explode=function(_347,_348,_349,_34a,_34b){
_347=dojo.byId(_347);
_348=dojo.byId(_348);
var _34c=dojo.style.toCoordinateArray(_347,true);
var _34d=document.createElement("div");
dojo.html.copyStyle(_34d,_348);
with(_34d.style){
position="absolute";
display="none";
}
document.body.appendChild(_34d);
with(_348.style){
visibility="hidden";
display="block";
}
var _34e=dojo.style.toCoordinateArray(_348,true);
with(_348.style){
display="none";
visibility="visible";
}
var anim=new dojo.lfx.propertyAnimation(_34d,[{property:"height",start:_34c[3],end:_34e[3]},{property:"width",start:_34c[2],end:_34e[2]},{property:"top",start:_34c[1],end:_34e[1]},{property:"left",start:_34c[0],end:_34e[0]},{property:"opacity",start:0.3,end:1}],_349,_34a);
anim.beforeBegin=function(){
dojo.style.setDisplay(_34d,"block");
};
anim.onEnd=function(){
dojo.style.setDisplay(_348,"block");
_34d.parentNode.removeChild(_34d);
};
if(_34b){
var _350=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_350();
_34b(_348,anim);
};
}
return anim;
};
dojo.lfx.html.implode=function(_351,end,_353,_354,_355){
_351=dojo.byId(_351);
end=dojo.byId(end);
var _356=dojo.style.toCoordinateArray(_351,true);
var _357=dojo.style.toCoordinateArray(end,true);
var _358=document.createElement("div");
dojo.html.copyStyle(_358,_351);
dojo.style.setOpacity(_358,0.3);
with(_358.style){
position="absolute";
display="none";
}
document.body.appendChild(_358);
var anim=new dojo.lfx.propertyAnimation(_358,[{property:"height",start:_356[3],end:_357[3]},{property:"width",start:_356[2],end:_357[2]},{property:"top",start:_356[1],end:_357[1]},{property:"left",start:_356[0],end:_357[0]},{property:"opacity",start:1,end:0.3}],_353,_354);
anim.beforeBegin=function(){
dojo.style.hide(_351);
dojo.style.show(_358);
};
anim.onEnd=function(){
_358.parentNode.removeChild(_358);
};
if(_355){
var _35a=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_35a();
_355(_351,anim);
};
}
return anim;
};
dojo.lfx.html.highlight=function(_35b,_35c,_35d,_35e,_35f){
_35b=dojo.lfx.html._byId(_35b);
var _360=[];
dojo.lang.forEach(_35b,function(node){
var _362=dojo.style.getBackgroundColor(node);
var bg=dojo.style.getStyle(node,"background-color").toLowerCase();
var _364=dojo.style.getStyle(node,"background-image");
var _365=(bg=="transparent"||bg=="rgba(0, 0, 0, 0)");
while(_362.length>3){
_362.pop();
}
var rgb=new dojo.graphics.color.Color(_35c);
var _367=new dojo.graphics.color.Color(_362);
var anim=dojo.lfx.propertyAnimation(node,[{property:"background-color",start:rgb,end:_367}],_35d,_35e);
var _369=(anim["beforeBegin"])?dojo.lang.hitch(anim,"beforeBegin"):function(){
};
anim.beforeBegin=function(){
_369();
if(_364){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+rgb.toRgb().join(",")+")";
};
var _36a=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_36a();
if(_364){
node.style.backgroundImage=_364;
}
if(_365){
node.style.backgroundColor="transparent";
}
if(_35f){
_35f(node,anim);
}
};
_360.push(anim);
});
if(_35b.length>1){
return dojo.lfx.combine(_360);
}else{
return _360[0];
}
};
dojo.lfx.html.unhighlight=function(_36b,_36c,_36d,_36e,_36f){
_36b=dojo.lfx.html._byId(_36b);
var _370=[];
dojo.lang.forEach(_36b,function(node){
var _372=new dojo.graphics.color.Color(dojo.style.getBackgroundColor(node));
var rgb=new dojo.graphics.color.Color(_36c);
var _374=dojo.style.getStyle(node,"background-image");
var anim=dojo.lfx.propertyAnimation(node,[{property:"background-color",start:_372,end:rgb}],_36d,_36e);
var _376=(anim["beforeBegin"])?dojo.lang.hitch(anim,"beforeBegin"):function(){
};
anim.beforeBegin=function(){
_376();
if(_374){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+_372.toRgb().join(",")+")";
};
var _377=(anim["onEnd"])?dojo.lang.hitch(anim,"onEnd"):function(){
};
anim.onEnd=function(){
_377();
if(_36f){
_36f(node,anim);
}
};
_370.push(anim);
});
if(_36b.length>1){
return dojo.lfx.combine(_370);
}else{
return _370[0];
}
};
dojo.lang.mixin(dojo.lfx,dojo.lfx.html);
dojo.kwCompoundRequire({browser:["dojo.lfx.html"],dashboard:["dojo.lfx.html"]});
dojo.provide("dojo.lfx.*");
dojo.provide("dojo.lang.extras");
dojo.require("dojo.lang.common");
dojo.lang.setTimeout=function(func,_379){
var _37a=window,argsStart=2;
if(!dojo.lang.isFunction(func)){
_37a=func;
func=_379;
_379=arguments[2];
argsStart++;
}
if(dojo.lang.isString(func)){
func=_37a[func];
}
var args=[];
for(var i=argsStart;i<arguments.length;i++){
args.push(arguments[i]);
}
return setTimeout(function(){
func.apply(_37a,args);
},_379);
};
dojo.lang.getNameInObj=function(ns,item){
if(!ns){
ns=dj_global;
}
for(var x in ns){
if(ns[x]===item){
return new String(x);
}
}
return null;
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
dojo.lang.firstValued=function(){
for(var i=0;i<arguments.length;i++){
if(typeof arguments[i]!="undefined"){
return arguments[i];
}
}
return undefined;
};
dojo.lang.getObjPathValue=function(_383,_384,_385){
with(dojo.parseObjPath(_383,_384,_385)){
return dojo.evalProp(prop,obj,_385);
}
};
dojo.lang.setObjPathValue=function(_386,_387,_388,_389){
if(arguments.length<4){
_389=true;
}
with(dojo.parseObjPath(_386,_388,_389)){
if(obj&&(_389||(prop in obj))){
obj[prop]=_387;
}
}
};
dojo.provide("dojo.event");
dojo.require("dojo.lang.array");
dojo.require("dojo.lang.extras");
dojo.require("dojo.lang.func");
dojo.event=new function(){
this.canTimeout=dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);
function interpolateArgs(args,_38b){
var dl=dojo.lang;
var ao={srcObj:dj_global,srcFunc:null,adviceObj:dj_global,adviceFunc:null,aroundObj:null,aroundFunc:null,adviceType:(args.length>2)?args[0]:"after",precedence:"last",once:false,delay:null,rate:0,adviceMsg:false};
switch(args.length){
case 0:
return;
case 1:
return;
case 2:
ao.srcFunc=args[0];
ao.adviceFunc=args[1];
break;
case 3:
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
var _38e=dl.nameAnonFunc(args[2],ao.adviceObj,_38b);
ao.adviceFunc=_38e;
}else{
if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=dj_global;
var _38e=dl.nameAnonFunc(args[0],ao.srcObj,_38b);
ao.srcFunc=_38e;
ao.adviceObj=args[1];
ao.adviceFunc=args[2];
}
}
}
}
break;
case 4:
if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
var _38e=dl.nameAnonFunc(args[1],dj_global,_38b);
ao.srcFunc=_38e;
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))&&(dl.isFunction(args[3]))){
ao.srcObj=args[1];
ao.srcFunc=args[2];
var _38e=dl.nameAnonFunc(args[3],dj_global,_38b);
ao.adviceObj=dj_global;
ao.adviceFunc=_38e;
}else{
if(dl.isObject(args[1])){
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=dj_global;
ao.adviceFunc=args[3];
}else{
if(dl.isObject(args[2])){
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
ao.srcObj=ao.adviceObj=ao.aroundObj=dj_global;
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
ao.aroundFunc=args[3];
}
}
}
}
}
}
break;
case 6:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundFunc=args[5];
ao.aroundObj=dj_global;
break;
default:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundObj=args[5];
ao.aroundFunc=args[6];
ao.once=args[7];
ao.delay=args[8];
ao.rate=args[9];
ao.adviceMsg=args[10];
break;
}
if(dl.isFunction(ao.aroundFunc)){
var _38e=dl.nameAnonFunc(ao.aroundFunc,ao.aroundObj,_38b);
ao.aroundFunc=_38e;
}
if(dl.isFunction(ao.srcFunc)){
ao.srcFunc=dl.getNameInObj(ao.srcObj,ao.srcFunc);
}
if(dl.isFunction(ao.adviceFunc)){
ao.adviceFunc=dl.getNameInObj(ao.adviceObj,ao.adviceFunc);
}
if((ao.aroundObj)&&(dl.isFunction(ao.aroundFunc))){
ao.aroundFunc=dl.getNameInObj(ao.aroundObj,ao.aroundFunc);
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
if(arguments.length==1){
var ao=arguments[0];
}else{
var ao=interpolateArgs(arguments,true);
}
if(dojo.lang.isArray(ao.srcObj)&&ao.srcObj!=""){
var _390={};
for(var x in ao){
_390[x]=ao[x];
}
var mjps=[];
dojo.lang.forEach(ao.srcObj,function(src){
if((dojo.render.html.capable)&&(dojo.lang.isString(src))){
src=dojo.byId(src);
}
_390.srcObj=src;
mjps.push(dojo.event.connect.call(dojo.event,_390));
});
return mjps;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
if(ao.adviceFunc){
var mjp2=dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj,ao.adviceFunc);
}
mjp.kwAddAdvice(ao);
return mjp;
};
this.log=function(a1,a2){
var _398;
if((arguments.length==1)&&(typeof a1=="object")){
_398=a1;
}else{
_398={srcObj:a1,srcFunc:a2};
}
_398.adviceFunc=function(){
var _399=[];
for(var x=0;x<arguments.length;x++){
_399.push(arguments[x]);
}
dojo.debug("("+_398.srcObj+")."+_398.srcFunc,":",_399.join(", "));
};
this.kwConnect(_398);
};
this.connectBefore=function(){
var args=["before"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectAround=function(){
var args=["around"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectOnce=function(){
var ao=interpolateArgs(arguments,true);
ao.once=true;
return this.connect(ao);
};
this._kwConnectImpl=function(_3a0,_3a1){
var fn=(_3a1)?"disconnect":"connect";
if(typeof _3a0["srcFunc"]=="function"){
_3a0.srcObj=_3a0["srcObj"]||dj_global;
var _3a3=dojo.lang.nameAnonFunc(_3a0.srcFunc,_3a0.srcObj,true);
_3a0.srcFunc=_3a3;
}
if(typeof _3a0["adviceFunc"]=="function"){
_3a0.adviceObj=_3a0["adviceObj"]||dj_global;
var _3a3=dojo.lang.nameAnonFunc(_3a0.adviceFunc,_3a0.adviceObj,true);
_3a0.adviceFunc=_3a3;
}
return dojo.event[fn]((_3a0["type"]||_3a0["adviceType"]||"after"),_3a0["srcObj"]||dj_global,_3a0["srcFunc"],_3a0["adviceObj"]||_3a0["targetObj"]||dj_global,_3a0["adviceFunc"]||_3a0["targetFunc"],_3a0["aroundObj"],_3a0["aroundFunc"],_3a0["once"],_3a0["delay"],_3a0["rate"],_3a0["adviceMsg"]||false);
};
this.kwConnect=function(_3a4){
return this._kwConnectImpl(_3a4,false);
};
this.disconnect=function(){
var ao=interpolateArgs(arguments,true);
if(!ao.adviceFunc){
return;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
return mjp.removeAdvice(ao.adviceObj,ao.adviceFunc,ao.adviceType,ao.once);
};
this.kwDisconnect=function(_3a7){
return this._kwConnectImpl(_3a7,true);
};
};
dojo.event.MethodInvocation=function(_3a8,obj,args){
this.jp_=_3a8;
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
dojo.event.MethodJoinPoint=function(obj,_3b0){
this.object=obj||dj_global;
this.methodname=_3b0;
this.methodfunc=this.object[_3b0];
this.before=[];
this.after=[];
this.around=[];
};
dojo.event.MethodJoinPoint.getForMethod=function(obj,_3b2){
if(!obj){
obj=dj_global;
}
if(!obj[_3b2]){
obj[_3b2]=function(){
};
if(!obj[_3b2]){
dojo.raise("Cannot set do-nothing method on that object "+_3b2);
}
}else{
if((!dojo.lang.isFunction(obj[_3b2]))&&(!dojo.lang.isAlien(obj[_3b2]))){
return null;
}
}
var _3b3=_3b2+"$joinpoint";
var _3b4=_3b2+"$joinpoint$method";
var _3b5=obj[_3b3];
if(!_3b5){
var _3b6=false;
if(dojo.event["browser"]){
if((obj["attachEvent"])||(obj["nodeType"])||(obj["addEventListener"])){
_3b6=true;
dojo.event.browser.addClobberNodeAttrs(obj,[_3b3,_3b4,_3b2]);
}
}
var _3b7=obj[_3b2].length;
obj[_3b4]=obj[_3b2];
_3b5=obj[_3b3]=new dojo.event.MethodJoinPoint(obj,_3b4);
obj[_3b2]=function(){
var args=[];
if((_3b6)&&(!arguments.length)){
var evt=null;
try{
if(obj.ownerDocument){
evt=obj.ownerDocument.parentWindow.event;
}else{
if(obj.documentElement){
evt=obj.documentElement.ownerDocument.parentWindow.event;
}else{
evt=window.event;
}
}
}
catch(e){
evt=window.event;
}
if(evt){
args.push(dojo.event.browser.fixEvent(evt,this));
}
}else{
for(var x=0;x<arguments.length;x++){
if((x==0)&&(_3b6)&&(dojo.event.browser.isEvent(arguments[x]))){
args.push(dojo.event.browser.fixEvent(arguments[x],this));
}else{
args.push(arguments[x]);
}
}
}
return _3b5.run.apply(_3b5,args);
};
obj[_3b2].__preJoinArity=_3b7;
}
return _3b5;
};
dojo.lang.extend(dojo.event.MethodJoinPoint,{unintercept:function(){
this.object[this.methodname]=this.methodfunc;
this.before=[];
this.after=[];
this.around=[];
},disconnect:dojo.lang.forward("unintercept"),run:function(){
var obj=this.object||dj_global;
var args=arguments;
var _3bd=[];
for(var x=0;x<args.length;x++){
_3bd[x]=args[x];
}
var _3bf=function(marr){
if(!marr){
dojo.debug("Null argument to unrollAdvice()");
return;
}
var _3c1=marr[0]||dj_global;
var _3c2=marr[1];
if(!_3c1[_3c2]){
dojo.raise("function \""+_3c2+"\" does not exist on \""+_3c1+"\"");
}
var _3c3=marr[2]||dj_global;
var _3c4=marr[3];
var msg=marr[6];
var _3c6;
var to={args:[],jp_:this,object:obj,proceed:function(){
return _3c1[_3c2].apply(_3c1,to.args);
}};
to.args=_3bd;
var _3c8=parseInt(marr[4]);
var _3c9=((!isNaN(_3c8))&&(marr[4]!==null)&&(typeof marr[4]!="undefined"));
if(marr[5]){
var rate=parseInt(marr[5]);
var cur=new Date();
var _3cc=false;
if((marr["last"])&&((cur-marr.last)<=rate)){
if(dojo.event.canTimeout){
if(marr["delayTimer"]){
clearTimeout(marr.delayTimer);
}
var tod=parseInt(rate*2);
var mcpy=dojo.lang.shallowCopy(marr);
marr.delayTimer=setTimeout(function(){
mcpy[5]=0;
_3bf(mcpy);
},tod);
}
return;
}else{
marr.last=cur;
}
}
if(_3c4){
_3c3[_3c4].call(_3c3,to);
}else{
if((_3c9)&&((dojo.render.html)||(dojo.render.svg))){
dj_global["setTimeout"](function(){
if(msg){
_3c1[_3c2].call(_3c1,to);
}else{
_3c1[_3c2].apply(_3c1,args);
}
},_3c8);
}else{
if(msg){
_3c1[_3c2].call(_3c1,to);
}else{
_3c1[_3c2].apply(_3c1,args);
}
}
}
};
if(this.before.length>0){
dojo.lang.forEach(this.before,_3bf);
}
var _3cf;
if(this.around.length>0){
var mi=new dojo.event.MethodInvocation(this,obj,args);
_3cf=mi.proceed();
}else{
if(this.methodfunc){
_3cf=this.object[this.methodname].apply(this.object,args);
}
}
if(this.after.length>0){
dojo.lang.forEach(this.after,_3bf);
}
return (this.methodfunc)?_3cf:null;
},getArr:function(kind){
var arr=this.after;
if((typeof kind=="string")&&(kind.indexOf("before")!=-1)){
arr=this.before;
}else{
if(kind=="around"){
arr=this.around;
}
}
return arr;
},kwAddAdvice:function(args){
this.addAdvice(args["adviceObj"],args["adviceFunc"],args["aroundObj"],args["aroundFunc"],args["adviceType"],args["precedence"],args["once"],args["delay"],args["rate"],args["adviceMsg"]);
},addAdvice:function(_3d4,_3d5,_3d6,_3d7,_3d8,_3d9,once,_3db,rate,_3dd){
var arr=this.getArr(_3d8);
if(!arr){
dojo.raise("bad this: "+this);
}
var ao=[_3d4,_3d5,_3d6,_3d7,_3db,rate,_3dd];
if(once){
if(this.hasAdvice(_3d4,_3d5,_3d8,arr)>=0){
return;
}
}
if(_3d9=="first"){
arr.unshift(ao);
}else{
arr.push(ao);
}
},hasAdvice:function(_3e0,_3e1,_3e2,arr){
if(!arr){
arr=this.getArr(_3e2);
}
var ind=-1;
for(var x=0;x<arr.length;x++){
var aao=(typeof _3e1=="object")?(new String(_3e1)).toString():_3e1;
var a1o=(typeof arr[x][1]=="object")?(new String(arr[x][1])).toString():arr[x][1];
if((arr[x][0]==_3e0)&&(a1o==aao)){
ind=x;
}
}
return ind;
},removeAdvice:function(_3e8,_3e9,_3ea,once){
var arr=this.getArr(_3ea);
var ind=this.hasAdvice(_3e8,_3e9,_3ea,arr);
if(ind==-1){
return false;
}
while(ind!=-1){
arr.splice(ind,1);
if(once){
break;
}
ind=this.hasAdvice(_3e8,_3e9,_3ea,arr);
}
return true;
}});
dojo.require("dojo.event");
dojo.provide("dojo.event.topic");
dojo.event.topic=new function(){
this.topics={};
this.getTopic=function(_3ee){
if(!this.topics[_3ee]){
this.topics[_3ee]=new this.TopicImpl(_3ee);
}
return this.topics[_3ee];
};
this.registerPublisher=function(_3ef,obj,_3f1){
var _3ef=this.getTopic(_3ef);
_3ef.registerPublisher(obj,_3f1);
};
this.subscribe=function(_3f2,obj,_3f4){
var _3f2=this.getTopic(_3f2);
_3f2.subscribe(obj,_3f4);
};
this.unsubscribe=function(_3f5,obj,_3f7){
var _3f5=this.getTopic(_3f5);
_3f5.unsubscribe(obj,_3f7);
};
this.destroy=function(_3f8){
this.getTopic(_3f8).destroy();
delete this.topics[_3f8];
};
this.publishApply=function(_3f9,args){
var _3f9=this.getTopic(_3f9);
_3f9.sendMessage.apply(_3f9,args);
};
this.publish=function(_3fb,_3fc){
var _3fb=this.getTopic(_3fb);
var args=[];
for(var x=1;x<arguments.length;x++){
args.push(arguments[x]);
}
_3fb.sendMessage.apply(_3fb,args);
};
};
dojo.event.topic.TopicImpl=function(_3ff){
this.topicName=_3ff;
this.subscribe=function(_400,_401){
var tf=_401||_400;
var to=(!_401)?dj_global:_400;
dojo.event.kwConnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this.unsubscribe=function(_404,_405){
var tf=(!_405)?_404:_405;
var to=(!_405)?null:_404;
dojo.event.kwDisconnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this.destroy=function(){
dojo.event.MethodJoinPoint.getForMethod(this,"sendMessage").disconnect();
};
this.registerPublisher=function(_408,_409){
dojo.event.connect(_408,_409,this,"sendMessage");
};
this.sendMessage=function(_40a){
};
};
dojo.provide("dojo.event.browser");
dojo.require("dojo.event");
dojo._ie_clobber=new function(){
this.clobberNodes=[];
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
this.clobber=function(_40d){
var na;
var tna;
if(_40d){
tna=_40d.all||_40d.getElementsByTagName("*");
na=[_40d];
for(var x=0;x<tna.length;x++){
if(tna[x]["__doClobber__"]){
na.push(tna[x]);
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
var _411={};
for(var i=na.length-1;i>=0;i=i-1){
var el=na[i];
if(el["__clobberAttrs__"]){
for(var j=0;j<el.__clobberAttrs__.length;j++){
nukeProp(el,el.__clobberAttrs__[j]);
}
nukeProp(el,"__clobberAttrs__");
nukeProp(el,"__doClobber__");
}
}
na=null;
};
};
if(dojo.render.html.ie){
dojo.addOnUnload(function(){
dojo._ie_clobber.clobber();
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
dojo._ie_clobber.clobberNodes=[];
});
}
dojo.event.browser=new function(){
var _415=0;
this.clean=function(node){
if(dojo.render.html.ie){
dojo._ie_clobber.clobber(node);
}
};
this.addClobberNode=function(node){
if(!dojo.render.html.ie){
return;
}
if(!node["__doClobber__"]){
node.__doClobber__=true;
dojo._ie_clobber.clobberNodes.push(node);
node.__clobberAttrs__=[];
}
};
this.addClobberNodeAttrs=function(node,_419){
if(!dojo.render.html.ie){
return;
}
this.addClobberNode(node);
for(var x=0;x<_419.length;x++){
node.__clobberAttrs__.push(_419[x]);
}
};
this.removeListener=function(node,_41c,fp,_41e){
if(!_41e){
var _41e=false;
}
_41c=_41c.toLowerCase();
if(_41c.substr(0,2)=="on"){
_41c=_41c.substr(2);
}
if(node.removeEventListener){
node.removeEventListener(_41c,fp,_41e);
}
};
this.addListener=function(node,_420,fp,_422,_423){
if(!node){
return;
}
if(!_422){
var _422=false;
}
_420=_420.toLowerCase();
if(_420.substr(0,2)!="on"){
_420="on"+_420;
}
if(!_423){
var _424=function(evt){
if(!evt){
evt=window.event;
}
var ret=fp(dojo.event.browser.fixEvent(evt,this));
if(_422){
dojo.event.browser.stopEvent(evt);
}
return ret;
};
}else{
_424=fp;
}
if(node.addEventListener){
node.addEventListener(_420.substr(2),_424,_422);
return _424;
}else{
if(typeof node[_420]=="function"){
var _427=node[_420];
node[_420]=function(e){
_427(e);
return _424(e);
};
}else{
node[_420]=_424;
}
if(dojo.render.html.ie){
this.addClobberNodeAttrs(node,[_420]);
}
return _424;
}
};
this.isEvent=function(obj){
return (typeof obj!="undefined")&&(typeof Event!="undefined")&&(obj.eventPhase);
};
this.currentEvent=null;
this.callListener=function(_42a,_42b){
if(typeof _42a!="function"){
dojo.raise("listener not a function: "+_42a);
}
dojo.event.browser.currentEvent.currentTarget=_42b;
return _42a.call(_42b,dojo.event.browser.currentEvent);
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
this.fixEvent=function(evt,_42e){
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
evt.currentTarget=(_42e?_42e:evt.srcElement);
}
if(!evt.layerX){
evt.layerX=evt.offsetX;
}
if(!evt.layerY){
evt.layerY=evt.offsetY;
}
var _430=((dojo.render.html.ie55)||(document["compatMode"]=="BackCompat"))?document.body:document.documentElement;
if(!evt.pageX){
evt.pageX=evt.clientX+(_430.scrollLeft||0);
}
if(!evt.pageY){
evt.pageY=evt.clientY+(_430.scrollTop||0);
}
if(evt.type=="mouseover"){
evt.relatedTarget=evt.fromElement;
}
if(evt.type=="mouseout"){
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
dojo.kwCompoundRequire({common:["dojo.event","dojo.event.topic"],browser:["dojo.event.browser"],dashboard:["dojo.event.browser"]});
dojo.provide("dojo.event.*");
dojo.provide("dojo.io.IO");
dojo.require("dojo.string");
dojo.require("dojo.lang.extras");
dojo.io.transports=[];
dojo.io.hdlrFuncNames=["load","error","timeout"];
dojo.io.Request=function(url,_433,_434,_435){
if((arguments.length==1)&&(arguments[0].constructor==Object)){
this.fromKwArgs(arguments[0]);
}else{
this.url=url;
if(_433){
this.mimetype=_433;
}
if(_434){
this.transport=_434;
}
if(arguments.length>=4){
this.changeUrl=_435;
}
}
};
dojo.lang.extend(dojo.io.Request,{url:"",mimetype:"text/plain",method:"GET",content:undefined,transport:undefined,changeUrl:undefined,formNode:undefined,sync:false,bindSuccess:false,useCache:false,preventCache:false,load:function(type,data,evt){
},error:function(type,_43a){
},timeout:function(type){
},handle:function(){
},timeoutSeconds:0,abort:function(){
},fromKwArgs:function(_43c){
if(_43c["url"]){
_43c.url=_43c.url.toString();
}
if(_43c["formNode"]){
_43c.formNode=dojo.byId(_43c.formNode);
}
if(!_43c["method"]&&_43c["formNode"]&&_43c["formNode"].method){
_43c.method=_43c["formNode"].method;
}
if(!_43c["handle"]&&_43c["handler"]){
_43c.handle=_43c.handler;
}
if(!_43c["load"]&&_43c["loaded"]){
_43c.load=_43c.loaded;
}
if(!_43c["changeUrl"]&&_43c["changeURL"]){
_43c.changeUrl=_43c.changeURL;
}
_43c.encoding=dojo.lang.firstValued(_43c["encoding"],djConfig["bindEncoding"],"");
_43c.sendTransport=dojo.lang.firstValued(_43c["sendTransport"],djConfig["ioSendTransport"],false);
var _43d=dojo.lang.isFunction;
for(var x=0;x<dojo.io.hdlrFuncNames.length;x++){
var fn=dojo.io.hdlrFuncNames[x];
if(_43d(_43c[fn])){
continue;
}
if(_43d(_43c["handle"])){
_43c[fn]=_43c.handle;
}
}
dojo.lang.mixin(this,_43c);
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
dojo.io.bind=function(_444){
if(!(_444 instanceof dojo.io.Request)){
try{
_444=new dojo.io.Request(_444);
}
catch(e){
dojo.debug(e);
}
}
var _445="";
if(_444["transport"]){
_445=_444["transport"];
if(!this[_445]){
return _444;
}
}else{
for(var x=0;x<dojo.io.transports.length;x++){
var tmp=dojo.io.transports[x];
if((this[tmp])&&(this[tmp].canHandle(_444))){
_445=tmp;
}
}
if(_445==""){
return _444;
}
}
this[_445].bind(_444);
_444.bindSuccess=true;
return _444;
};
dojo.io.queueBind=function(_448){
if(!(_448 instanceof dojo.io.Request)){
try{
_448=new dojo.io.Request(_448);
}
catch(e){
dojo.debug(e);
}
}
var _449=_448.load;
_448.load=function(){
dojo.io._queueBindInFlight=false;
var ret=_449.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
var _44b=_448.error;
_448.error=function(){
dojo.io._queueBindInFlight=false;
var ret=_44b.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
dojo.io._bindQueue.push(_448);
dojo.io._dispatchNextQueueBind();
return _448;
};
dojo.io._dispatchNextQueueBind=function(){
if(!dojo.io._queueBindInFlight){
dojo.io._queueBindInFlight=true;
if(dojo.io._bindQueue.length>0){
dojo.io.bind(dojo.io._bindQueue.shift());
}else{
dojo.io._queueBindInFlight=false;
}
}
};
dojo.io._bindQueue=[];
dojo.io._queueBindInFlight=false;
dojo.io.argsFromMap=function(map,_44e,last){
var enc=/utf/i.test(_44e||"")?encodeURIComponent:dojo.string.encodeAscii;
var _451=[];
var _452=new Object();
for(var name in map){
var _454=function(elt){
var val=enc(name)+"="+enc(elt);
_451[(last==name)?"push":"unshift"](val);
};
if(!_452[name]){
var _457=map[name];
if(dojo.lang.isArray(_457)){
dojo.lang.forEach(_457,_454);
}else{
_454(_457);
}
}
}
return _451.join("&");
};
dojo.io.setIFrameSrc=function(_458,src,_45a){
try{
var r=dojo.render.html;
if(!_45a){
if(r.safari){
_458.location=src;
}else{
frames[_458.name].location=src;
}
}else{
var idoc;
if(r.ie){
idoc=_458.contentWindow.document;
}else{
if(r.safari){
idoc=_458.document;
}else{
idoc=_458.contentWindow;
}
}
if(!idoc){
_458.location=src;
return;
}else{
idoc.location.replace(src);
}
}
}
catch(e){
dojo.debug(e);
dojo.debug("setIFrameSrc: "+e);
}
};
dojo.provide("dojo.string.extras");
dojo.require("dojo.string.common");
dojo.require("dojo.lang");
dojo.string.substituteParams=function(_45d,hash){
var map=(typeof hash=="object")?hash:dojo.lang.toArray(arguments,1);
return _45d.replace(/\%\{(\w+)\}/g,function(_460,key){
return map[key]||dojo.raise("Substitution not found: "+key);
});
};
dojo.string.paramString=function(str,_463,_464){
dojo.deprecated("dojo.string.paramString","use dojo.string.substituteParams instead","0.4");
for(var name in _463){
var re=new RegExp("\\%\\{"+name+"\\}","g");
str=str.replace(re,_463[name]);
}
if(_464){
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
var _468=str.split(" ");
for(var i=0;i<_468.length;i++){
_468[i]=_468[i].charAt(0).toUpperCase()+_468[i].substring(1);
}
return _468.join(" ");
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
var _46d=escape(str);
var _46e,re=/%u([0-9A-F]{4})/i;
while((_46e=_46d.match(re))){
var num=Number("0x"+_46e[1]);
var _470=escape("&#"+num+";");
ret+=_46d.substring(0,_46e.index)+_470;
_46d=_46d.substring(_46e.index+_46e[0].length);
}
ret+=_46d.replace(/\+/g,"%2B");
return ret;
};
dojo.string.escape=function(type,str){
var args=dojo.lang.toArray(arguments,1);
switch(type.toLowerCase()){
case "xml":
case "html":
case "xhtml":
return dojo.string.escapeXml.apply(this,args);
case "sql":
return dojo.string.escapeSql.apply(this,args);
case "regexp":
case "regex":
return dojo.string.escapeRegExp.apply(this,args);
case "javascript":
case "jscript":
case "js":
return dojo.string.escapeJavaScript.apply(this,args);
case "ascii":
return dojo.string.encodeAscii.apply(this,args);
default:
return str;
}
};
dojo.string.escapeXml=function(str,_475){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_475){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
dojo.string.escapeSql=function(str){
return str.replace(/'/gm,"''");
};
dojo.string.escapeRegExp=function(str){
return str.replace(/\\/gm,"\\\\").replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm,"\\$1");
};
dojo.string.escapeJavaScript=function(str){
return str.replace(/(["'\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.escapeString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.string.summary=function(str,len){
if(!len||str.length<=len){
return str;
}else{
return str.substring(0,len).replace(/\.+$/,"")+"...";
}
};
dojo.string.endsWith=function(str,end,_47e){
if(_47e){
str=str.toLowerCase();
end=end.toLowerCase();
}
if((str.length-end.length)<0){
return false;
}
return str.lastIndexOf(end)==str.length-end.length;
};
dojo.string.endsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.endsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.startsWith=function(str,_482,_483){
if(_483){
str=str.toLowerCase();
_482=_482.toLowerCase();
}
return str.indexOf(_482)==0;
};
dojo.string.startsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.startsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.has=function(str){
for(var i=1;i<arguments.length;i++){
if(str.indexOf(arguments[i])>-1){
return true;
}
}
return false;
};
dojo.string.normalizeNewlines=function(text,_489){
if(_489=="\n"){
text=text.replace(/\r\n/g,"\n");
text=text.replace(/\r/g,"\n");
}else{
if(_489=="\r"){
text=text.replace(/\r\n/g,"\r");
text=text.replace(/\n/g,"\r");
}else{
text=text.replace(/([^\r])\n/g,"$1\r\n");
text=text.replace(/\r([^\n])/g,"\r\n$1");
}
}
return text;
};
dojo.string.splitEscaped=function(str,_48b){
var _48c=[];
for(var i=0,prevcomma=0;i<str.length;i++){
if(str.charAt(i)=="\\"){
i++;
continue;
}
if(str.charAt(i)==_48b){
_48c.push(str.substring(prevcomma,i));
prevcomma=i+1;
}
}
_48c.push(str.substr(prevcomma));
return _48c;
};
dojo.provide("dojo.undo.browser");
dojo.require("dojo.io");
try{
if((!djConfig["preventBackButtonFix"])&&(!dojo.hostenv.post_load_)){
document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"'></iframe>");
}
}
catch(e){
}
if(dojo.render.html.opera){
dojo.debug("Opera is not supported with dojo.undo.browser, so back/forward detection will not work.");
}
dojo.undo.browser={initialHref:window.location.href,initialHash:window.location.hash,moveForward:false,historyStack:[],forwardStack:[],historyIframe:null,bookmarkAnchor:null,locationTimer:null,setInitialState:function(args){
this.initialState={"url":this.initialHref,"kwArgs":args,"urlHash":this.initialHash};
},addToHistory:function(args){
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
this.changingUrl=true;
hash="#"+((args["changeUrl"]!==true)?args["changeUrl"]:(new Date()).getTime());
setTimeout("window.location.href = '"+hash+"'; dojo.undo.browser.changingUrl = false;",1);
this.bookmarkAnchor.href=hash;
if(dojo.render.html.ie){
var _492=args["back"]||args["backButton"]||args["handle"];
var tcb=function(_494){
if(window.location.hash!=""){
setTimeout("window.location.href = '"+hash+"';",1);
}
_492.apply(this,[_494]);
};
if(args["back"]){
args.back=tcb;
}else{
if(args["backButton"]){
args.backButton=tcb;
}else{
if(args["handle"]){
args.handle=tcb;
}
}
}
this.forwardStack=[];
var _495=args["forward"]||args["forwardButton"]||args["handle"];
var tfw=function(_497){
if(window.location.hash!=""){
window.location.href=hash;
}
if(_495){
_495.apply(this,[_497]);
}
};
if(args["forward"]){
args.forward=tfw;
}else{
if(args["forwardButton"]){
args.forwardButton=tfw;
}else{
if(args["handle"]){
args.handle=tfw;
}
}
}
}else{
if(dojo.render.html.moz){
if(!this.locationTimer){
this.locationTimer=setInterval("dojo.undo.browser.checkLocation();",200);
}
}
}
}
this.historyStack.push({"url":url,"kwArgs":args,"urlHash":hash});
},checkLocation:function(){
if(!this.changingUrl){
var hsl=this.historyStack.length;
if((window.location.hash==this.initialHash||window.location.href==this.initialHref)&&(hsl==1)){
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
}
},iframeLoaded:function(evt,_49a){
if(!dojo.render.html.opera){
var _49b=this._getUrlQuery(_49a.href);
if(_49b==null){
if(this.historyStack.length==1){
this.handleBackButton();
}
return;
}
if(this.moveForward){
this.moveForward=false;
return;
}
if(this.historyStack.length>=2&&_49b==this._getUrlQuery(this.historyStack[this.historyStack.length-2].url)){
this.handleBackButton();
}else{
if(this.forwardStack.length>0&&_49b==this._getUrlQuery(this.forwardStack[this.forwardStack.length-1].url)){
this.handleForwardButton();
}
}
}
},handleBackButton:function(){
var _49c=this.historyStack.pop();
if(!_49c){
return;
}
var last=this.historyStack[this.historyStack.length-1];
if(!last&&this.historyStack.length==0){
last=this.initialState;
}
if(last){
if(last.kwArgs["back"]){
last.kwArgs["back"]();
}else{
if(last.kwArgs["backButton"]){
last.kwArgs["backButton"]();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("back");
}
}
}
}
this.forwardStack.push(_49c);
},handleForwardButton:function(){
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
},_getUrlQuery:function(url){
var _4a0=url.split("?");
if(_4a0.length<2){
return null;
}else{
return _4a0[1];
}
}};
dojo.provide("dojo.io.BrowserIO");
dojo.require("dojo.io");
dojo.require("dojo.lang.array");
dojo.require("dojo.lang.func");
dojo.require("dojo.string.extras");
dojo.require("dojo.dom");
dojo.require("dojo.undo.browser");
dojo.io.checkChildrenForFile=function(node){
var _4a2=false;
var _4a3=node.getElementsByTagName("input");
dojo.lang.forEach(_4a3,function(_4a4){
if(_4a2){
return;
}
if(_4a4.getAttribute("type")=="file"){
_4a2=true;
}
});
return _4a2;
};
dojo.io.formHasFile=function(_4a5){
return dojo.io.checkChildrenForFile(_4a5);
};
dojo.io.updateNode=function(node,_4a7){
node=dojo.byId(node);
var args=_4a7;
if(dojo.lang.isString(_4a7)){
args={url:_4a7};
}
args.mimetype="text/html";
args.load=function(t,d,e){
while(node.firstChild){
if(dojo["event"]){
try{
dojo.event.browser.clean(node.firstChild);
}
catch(e){
}
}
node.removeChild(node.firstChild);
}
node.innerHTML=d;
};
dojo.io.bind(args);
};
dojo.io.formFilter=function(node){
var type=(node.type||"").toLowerCase();
return !node.disabled&&node.name&&!dojo.lang.inArray(type,["file","submit","image","reset","button"]);
};
dojo.io.encodeForm=function(_4ae,_4af,_4b0){
if((!_4ae)||(!_4ae.tagName)||(!_4ae.tagName.toLowerCase()=="form")){
dojo.raise("Attempted to encode a non-form element.");
}
if(!_4b0){
_4b0=dojo.io.formFilter;
}
var enc=/utf/i.test(_4af||"")?encodeURIComponent:dojo.string.encodeAscii;
var _4b2=[];
for(var i=0;i<_4ae.elements.length;i++){
var elm=_4ae.elements[i];
if(!elm||elm.tagName.toLowerCase()=="fieldset"||!_4b0(elm)){
continue;
}
var name=enc(elm.name);
var type=elm.type.toLowerCase();
if(type=="select-multiple"){
for(var j=0;j<elm.options.length;j++){
if(elm.options[j].selected){
_4b2.push(name+"="+enc(elm.options[j].value));
}
}
}else{
if(dojo.lang.inArray(type,["radio","checkbox"])){
if(elm.checked){
_4b2.push(name+"="+enc(elm.value));
}
}else{
_4b2.push(name+"="+enc(elm.value));
}
}
}
var _4b8=_4ae.getElementsByTagName("input");
for(var i=0;i<_4b8.length;i++){
var _4b9=_4b8[i];
if(_4b9.type.toLowerCase()=="image"&&_4b9.form==_4ae&&_4b0(_4b9)){
var name=enc(_4b9.name);
_4b2.push(name+"="+enc(_4b9.value));
_4b2.push(name+".x=0");
_4b2.push(name+".y=0");
}
}
return _4b2.join("&")+"&";
};
dojo.io.FormBind=function(args){
this.bindArgs={};
if(args&&args.formNode){
this.init(args);
}else{
if(args){
this.init({formNode:args});
}
}
};
dojo.lang.extend(dojo.io.FormBind,{form:null,bindArgs:null,clickedButton:null,init:function(args){
var form=dojo.byId(args.formNode);
if(!form||!form.tagName||form.tagName.toLowerCase()!="form"){
throw new Error("FormBind: Couldn't apply, invalid form");
}else{
if(this.form==form){
return;
}else{
if(this.form){
throw new Error("FormBind: Already applied to a form");
}
}
}
dojo.lang.mixin(this.bindArgs,args);
this.form=form;
this.connect(form,"onsubmit","submit");
for(var i=0;i<form.elements.length;i++){
var node=form.elements[i];
if(node&&node.type&&dojo.lang.inArray(node.type.toLowerCase(),["submit","button"])){
this.connect(node,"onclick","click");
}
}
var _4bf=form.getElementsByTagName("input");
for(var i=0;i<_4bf.length;i++){
var _4c0=_4bf[i];
if(_4c0.type.toLowerCase()=="image"&&_4c0.form==form){
this.connect(_4c0,"onclick","click");
}
}
},onSubmit:function(form){
return true;
},submit:function(e){
e.preventDefault();
if(this.onSubmit(this.form)){
dojo.io.bind(dojo.lang.mixin(this.bindArgs,{formFilter:dojo.lang.hitch(this,"formFilter")}));
}
},click:function(e){
var node=e.currentTarget;
if(node.disabled){
return;
}
this.clickedButton=node;
},formFilter:function(node){
var type=(node.type||"").toLowerCase();
var _4c7=false;
if(node.disabled||!node.name){
_4c7=false;
}else{
if(dojo.lang.inArray(type,["submit","button","image"])){
if(!this.clickedButton){
this.clickedButton=node;
}
_4c7=node==this.clickedButton;
}else{
_4c7=!dojo.lang.inArray(type,["file","submit","reset","button"]);
}
}
return _4c7;
},connect:function(_4c8,_4c9,_4ca){
if(dojo.evalObjPath("dojo.event.connect")){
dojo.event.connect(_4c8,_4c9,this,_4ca);
}else{
var fcn=dojo.lang.hitch(this,_4ca);
_4c8[_4c9]=function(e){
if(!e){
e=window.event;
}
if(!e.currentTarget){
e.currentTarget=e.srcElement;
}
if(!e.preventDefault){
e.preventDefault=function(){
window.event.returnValue=false;
};
}
fcn(e);
};
}
}});
dojo.io.XMLHTTPTransport=new function(){
var _4cd=this;
var _4ce={};
this.useCache=false;
this.preventCache=false;
function getCacheKey(url,_4d0,_4d1){
return url+"|"+_4d0+"|"+_4d1.toLowerCase();
}
function addToCache(url,_4d3,_4d4,http){
_4ce[getCacheKey(url,_4d3,_4d4)]=http;
}
function getFromCache(url,_4d7,_4d8){
return _4ce[getCacheKey(url,_4d7,_4d8)];
}
this.clearCache=function(){
_4ce={};
};
function doLoad(_4d9,http,url,_4dc,_4dd){
if(((http.status>=200)&&(http.status<300))||(http.status==304)||(location.protocol=="file:"&&(http.status==0||http.status==undefined))||(location.protocol=="chrome:"&&(http.status==0||http.status==undefined))){
var ret;
if(_4d9.method.toLowerCase()=="head"){
var _4df=http.getAllResponseHeaders();
ret={};
ret.toString=function(){
return _4df;
};
var _4e0=_4df.split(/[\r\n]+/g);
for(var i=0;i<_4e0.length;i++){
var pair=_4e0[i].match(/^([^:]+)\s*:\s*(.+)$/i);
if(pair){
ret[pair[1]]=pair[2];
}
}
}else{
if(_4d9.mimetype=="text/javascript"){
try{
ret=dj_eval(http.responseText);
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=null;
}
}else{
if(_4d9.mimetype=="text/json"){
try{
ret=dj_eval("("+http.responseText+")");
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=false;
}
}else{
if((_4d9.mimetype=="application/xml")||(_4d9.mimetype=="text/xml")){
ret=http.responseXML;
if(!ret||typeof ret=="string"||!http.getResponseHeader("Content-Type")){
ret=dojo.dom.createDocumentFromText(http.responseText);
}
}else{
ret=http.responseText;
}
}
}
}
if(_4dd){
addToCache(url,_4dc,_4d9.method,http);
}
_4d9[(typeof _4d9.load=="function")?"load":"handle"]("load",ret,http,_4d9);
}else{
var _4e3=new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
_4d9[(typeof _4d9.error=="function")?"error":"handle"]("error",_4e3,http,_4d9);
}
}
function setHeaders(http,_4e5){
if(_4e5["headers"]){
for(var _4e6 in _4e5["headers"]){
if(_4e6.toLowerCase()=="content-type"&&!_4e5["contentType"]){
_4e5["contentType"]=_4e5["headers"][_4e6];
}else{
http.setRequestHeader(_4e6,_4e5["headers"][_4e6]);
}
}
}
}
this.inFlight=[];
this.inFlightTimer=null;
this.startWatchingInFlight=function(){
if(!this.inFlightTimer){
this.inFlightTimer=setInterval("dojo.io.XMLHTTPTransport.watchInFlight();",10);
}
};
this.watchInFlight=function(){
var now=null;
for(var x=this.inFlight.length-1;x>=0;x--){
var tif=this.inFlight[x];
if(!tif){
this.inFlight.splice(x,1);
continue;
}
if(4==tif.http.readyState){
this.inFlight.splice(x,1);
doLoad(tif.req,tif.http,tif.url,tif.query,tif.useCache);
}else{
if(tif.startTime){
if(!now){
now=(new Date()).getTime();
}
if(tif.startTime+(tif.req.timeoutSeconds*1000)<now){
if(typeof tif.http.abort=="function"){
tif.http.abort();
}
this.inFlight.splice(x,1);
tif.req[(typeof tif.req.timeout=="function")?"timeout":"handle"]("timeout",null,tif.http,tif.req);
}
}
}
}
if(this.inFlight.length==0){
clearInterval(this.inFlightTimer);
this.inFlightTimer=null;
}
};
var _4ea=dojo.hostenv.getXmlhttpObject()?true:false;
this.canHandle=function(_4eb){
return _4ea&&dojo.lang.inArray((_4eb["mimetype"].toLowerCase()||""),["text/plain","text/html","application/xml","text/xml","text/javascript","text/json"])&&!(_4eb["formNode"]&&dojo.io.formHasFile(_4eb["formNode"]));
};
this.multipartBoundary="45309FFF-BD65-4d50-99C9-36986896A96F";
this.bind=function(_4ec){
if(!_4ec["url"]){
if(!_4ec["formNode"]&&(_4ec["backButton"]||_4ec["back"]||_4ec["changeUrl"]||_4ec["watchForURL"])&&(!djConfig.preventBackButtonFix)){
dojo.deprecated("Using dojo.io.XMLHTTPTransport.bind() to add to browser history without doing an IO request","Use dojo.undo.browser.addToHistory() instead.","0.4");
dojo.undo.browser.addToHistory(_4ec);
return true;
}
}
var url=_4ec.url;
var _4ee="";
if(_4ec["formNode"]){
var ta=_4ec.formNode.getAttribute("action");
if((ta)&&(!_4ec["url"])){
url=ta;
}
var tp=_4ec.formNode.getAttribute("method");
if((tp)&&(!_4ec["method"])){
_4ec.method=tp;
}
_4ee+=dojo.io.encodeForm(_4ec.formNode,_4ec.encoding,_4ec["formFilter"]);
}
if(url.indexOf("#")>-1){
dojo.debug("Warning: dojo.io.bind: stripping hash values from url:",url);
url=url.split("#")[0];
}
if(_4ec["file"]){
_4ec.method="post";
}
if(!_4ec["method"]){
_4ec.method="get";
}
if(_4ec.method.toLowerCase()=="get"){
_4ec.multipart=false;
}else{
if(_4ec["file"]){
_4ec.multipart=true;
}else{
if(!_4ec["multipart"]){
_4ec.multipart=false;
}
}
}
if(_4ec["backButton"]||_4ec["back"]||_4ec["changeUrl"]){
dojo.undo.browser.addToHistory(_4ec);
}
var _4f1=_4ec["content"]||{};
if(_4ec.sendTransport){
_4f1["dojo.transport"]="xmlhttp";
}
do{
if(_4ec.postContent){
_4ee=_4ec.postContent;
break;
}
if(_4f1){
_4ee+=dojo.io.argsFromMap(_4f1,_4ec.encoding);
}
if(_4ec.method.toLowerCase()=="get"||!_4ec.multipart){
break;
}
var t=[];
if(_4ee.length){
var q=_4ee.split("&");
for(var i=0;i<q.length;++i){
if(q[i].length){
var p=q[i].split("=");
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+p[0]+"\"","",p[1]);
}
}
}
if(_4ec.file){
if(dojo.lang.isArray(_4ec.file)){
for(var i=0;i<_4ec.file.length;++i){
var o=_4ec.file[i];
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}else{
var o=_4ec.file;
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}
if(t.length){
t.push("--"+this.multipartBoundary+"--","");
_4ee=t.join("\r\n");
}
}while(false);
var _4f7=_4ec["sync"]?false:true;
var _4f8=_4ec["preventCache"]||(this.preventCache==true&&_4ec["preventCache"]!=false);
var _4f9=_4ec["useCache"]==true||(this.useCache==true&&_4ec["useCache"]!=false);
if(!_4f8&&_4f9){
var _4fa=getFromCache(url,_4ee,_4ec.method);
if(_4fa){
doLoad(_4ec,_4fa,url,_4ee,false);
return;
}
}
var http=dojo.hostenv.getXmlhttpObject(_4ec);
var _4fc=false;
if(_4f7){
var _4fd=this.inFlight.push({"req":_4ec,"http":http,"url":url,"query":_4ee,"useCache":_4f9,"startTime":_4ec.timeoutSeconds?(new Date()).getTime():0});
this.startWatchingInFlight();
}
if(_4ec.method.toLowerCase()=="post"){
http.open("POST",url,_4f7);
setHeaders(http,_4ec);
http.setRequestHeader("Content-Type",_4ec.multipart?("multipart/form-data; boundary="+this.multipartBoundary):(_4ec.contentType||"application/x-www-form-urlencoded"));
try{
http.send(_4ee);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_4ec,{status:404},url,_4ee,_4f9);
}
}else{
var _4fe=url;
if(_4ee!=""){
_4fe+=(_4fe.indexOf("?")>-1?"&":"?")+_4ee;
}
if(_4f8){
_4fe+=(dojo.string.endsWithAny(_4fe,"?","&")?"":(_4fe.indexOf("?")>-1?"&":"?"))+"dojo.preventCache="+new Date().valueOf();
}
http.open(_4ec.method.toUpperCase(),_4fe,_4f7);
setHeaders(http,_4ec);
try{
http.send(null);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_4ec,{status:404},url,_4ee,_4f9);
}
}
if(!_4f7){
doLoad(_4ec,http,url,_4ee,_4f9);
}
_4ec.abort=function(){
return http.abort();
};
return;
};
dojo.io.transports.addTransport("XMLHTTPTransport");
};
dojo.provide("dojo.io.cookie");
dojo.io.cookie.setCookie=function(name,_500,days,path,_503,_504){
var _505=-1;
if(typeof days=="number"&&days>=0){
var d=new Date();
d.setTime(d.getTime()+(days*24*60*60*1000));
_505=d.toGMTString();
}
_500=escape(_500);
document.cookie=name+"="+_500+";"+(_505!=-1?" expires="+_505+";":"")+(path?"path="+path:"")+(_503?"; domain="+_503:"")+(_504?"; secure":"");
};
dojo.io.cookie.set=dojo.io.cookie.setCookie;
dojo.io.cookie.getCookie=function(name){
var idx=document.cookie.lastIndexOf(name+"=");
if(idx==-1){
return null;
}
var _509=document.cookie.substring(idx+name.length+1);
var end=_509.indexOf(";");
if(end==-1){
end=_509.length;
}
_509=_509.substring(0,end);
_509=unescape(_509);
return _509;
};
dojo.io.cookie.get=dojo.io.cookie.getCookie;
dojo.io.cookie.deleteCookie=function(name){
dojo.io.cookie.setCookie(name,"-",0);
};
dojo.io.cookie.setObjectCookie=function(name,obj,days,path,_510,_511,_512){
if(arguments.length==5){
_512=_510;
_510=null;
_511=null;
}
var _513=[],cookie,value="";
if(!_512){
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
_513.push(escape(prop)+"="+escape(cookie[prop]));
}
value=_513.join("&");
}
dojo.io.cookie.setCookie(name,value,days,path,_510,_511);
};
dojo.io.cookie.getObjectCookie=function(name){
var _516=null,cookie=dojo.io.cookie.getCookie(name);
if(cookie){
_516={};
var _517=cookie.split("&");
for(var i=0;i<_517.length;i++){
var pair=_517[i].split("=");
var _51a=pair[1];
if(isNaN(_51a)){
_51a=unescape(pair[1]);
}
_516[unescape(pair[0])]=_51a;
}
}
return _516;
};
dojo.io.cookie.isSupported=function(){
if(typeof navigator.cookieEnabled!="boolean"){
dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__","CookiesAllowed",90,null);
var _51b=dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
navigator.cookieEnabled=(_51b=="CookiesAllowed");
if(navigator.cookieEnabled){
this.deleteCookie("__TestingYourBrowserForCookieSupport__");
}
}
return navigator.cookieEnabled;
};
if(!dojo.io.cookies){
dojo.io.cookies=dojo.io.cookie;
}
dojo.kwCompoundRequire({common:["dojo.io"],rhino:["dojo.io.RhinoIO"],browser:["dojo.io.BrowserIO","dojo.io.cookie"],dashboard:["dojo.io.BrowserIO","dojo.io.cookie"]});
dojo.provide("dojo.io.*");
dojo.provide("dojo.string.Builder");
dojo.require("dojo.string");
dojo.string.Builder=function(str){
this.arrConcat=(dojo.render.html.capable&&dojo.render.html["ie"]);
var a=[];
var b=str||"";
var _51f=this.length=b.length;
if(this.arrConcat){
if(b.length>0){
a.push(b);
}
b="";
}
this.toString=this.valueOf=function(){
return (this.arrConcat)?a.join(""):b;
};
this.append=function(s){
if(this.arrConcat){
a.push(s);
}else{
b+=s;
}
_51f+=s.length;
this.length=_51f;
return this;
};
this.clear=function(){
a=[];
b="";
_51f=this.length=0;
return this;
};
this.remove=function(f,l){
var s="";
if(this.arrConcat){
b=a.join("");
}
a=[];
if(f>0){
s=b.substring(0,(f-1));
}
b=s+b.substring(f+l);
_51f=this.length=b.length;
if(this.arrConcat){
a.push(b);
b="";
}
return this;
};
this.replace=function(o,n){
if(this.arrConcat){
b=a.join("");
}
a=[];
b=b.replace(o,n);
_51f=this.length=b.length;
if(this.arrConcat){
a.push(b);
b="";
}
return this;
};
this.insert=function(idx,s){
if(this.arrConcat){
b=a.join("");
}
a=[];
if(idx==0){
b=s+b;
}else{
var t=b.split("");
t.splice(idx,0,s);
b=t.join("");
}
_51f=this.length=b.length;
if(this.arrConcat){
a.push(b);
b="";
}
return this;
};
};
dojo.kwCompoundRequire({common:["dojo.string","dojo.string.common","dojo.string.extras","dojo.string.Builder"]});
dojo.provide("dojo.string.*");
dojo.provide("dojo.xml.Parse");
dojo.require("dojo.dom");
dojo.xml.Parse=function(){
function getDojoTagName(node){
var _52a=node.tagName;
if(_52a.substr(0,5).toLowerCase()!="dojo:"){
if(_52a.substr(0,4).toLowerCase()=="dojo"){
return "dojo:"+_52a.substring(4).toLowerCase();
}
var djt=node.getAttribute("dojoType")||node.getAttribute("dojotype");
if(djt){
return "dojo:"+djt.toLowerCase();
}
if(node.getAttributeNS&&node.getAttributeNS(dojo.dom.dojoml,"type")){
return "dojo:"+node.getAttributeNS(dojo.dom.dojoml,"type").toLowerCase();
}
try{
djt=node.getAttribute("dojo:type");
}
catch(e){
}
if(djt){
return "dojo:"+djt.toLowerCase();
}
if(!dj_global["djConfig"]||!djConfig["ignoreClassNames"]){
var _52c=node.className||node.getAttribute("class");
if(_52c&&_52c.indexOf&&_52c.indexOf("dojo-")!=-1){
var _52d=_52c.split(" ");
for(var x=0;x<_52d.length;x++){
if(_52d[x].length>5&&_52d[x].indexOf("dojo-")>=0){
return "dojo:"+_52d[x].substr(5).toLowerCase();
}
}
}
}
}
return _52a.toLowerCase();
}
this.parseElement=function(node,_530,_531,_532){
if(node.getAttribute("parseWidgets")=="false"){
return {};
}
var _533={};
var _534=getDojoTagName(node);
_533[_534]=[];
if((!_531)||(_534.substr(0,4).toLowerCase()=="dojo")){
var _535=parseAttributes(node);
for(var attr in _535){
if((!_533[_534][attr])||(typeof _533[_534][attr]!="array")){
_533[_534][attr]=[];
}
_533[_534][attr].push(_535[attr]);
}
_533[_534].nodeRef=node;
_533.tagName=_534;
_533.index=_532||0;
}
var _537=0;
var tcn,i=0,nodes=node.childNodes;
while(tcn=nodes[i++]){
switch(tcn.nodeType){
case dojo.dom.ELEMENT_NODE:
_537++;
var ctn=getDojoTagName(tcn);
if(!_533[ctn]){
_533[ctn]=[];
}
_533[ctn].push(this.parseElement(tcn,true,_531,_537));
if((tcn.childNodes.length==1)&&(tcn.childNodes.item(0).nodeType==dojo.dom.TEXT_NODE)){
_533[ctn][_533[ctn].length-1].value=tcn.childNodes.item(0).nodeValue;
}
break;
case dojo.dom.TEXT_NODE:
if(node.childNodes.length==1){
_533[_534].push({value:node.childNodes.item(0).nodeValue});
}
break;
default:
break;
}
}
return _533;
};
function parseAttributes(node){
var _53b={};
var atts=node.attributes;
var _53d,i=0;
while(_53d=atts[i++]){
if((dojo.render.html.capable)&&(dojo.render.html.ie)){
if(!_53d){
continue;
}
if((typeof _53d=="object")&&(typeof _53d.nodeValue=="undefined")||(_53d.nodeValue==null)||(_53d.nodeValue=="")){
continue;
}
}
var nn=(_53d.nodeName.indexOf("dojo:")==-1)?_53d.nodeName:_53d.nodeName.split("dojo:")[1];
_53b[nn]={value:_53d.nodeValue};
}
return _53b;
}
};
dojo.provide("dojo.xml.domUtil");
dojo.require("dojo.graphics.color");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.deprecated("dojo.xml.domUtil","use dojo.dom instead","0.4");
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
this.forEachChildTag=function(node,_540){
var _541=this.getFirstChildTag(node);
while(_541){
if(_540(_541)=="break"){
break;
}
_541=this.getNextSiblingTag(_541);
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
this.extractRGB=function(_544){
return dojo.graphics.color.extractRGB(_544);
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
dojo.provide("dojo.xml.htmlUtil");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.deprecated("dojo.xml.htmlUtil","use dojo.html instead","0.4");
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
dojo.unimplemented("dojo.xml.htmlUtil.getOuterWidth");
};
this.getInnerHeight=function(){
return dojo.style.getInnerHeight.apply(dojo.style,arguments);
};
this.getOuterHeight=function(node){
dojo.unimplemented("dojo.xml.htmlUtil.getOuterHeight");
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
dojo.deprecated("dojo.xml.htmlUtil.getAttr","use dojo.xml.htmlUtil.getAttribute instead","0.4");
return dojo.xml.htmlUtil.getAttribute(node,attr);
};
this.hasAttribute=function(){
return dojo.html.hasAttribute.apply(dojo.html,arguments);
};
this.hasAttr=function(node,attr){
dojo.deprecated("dojo.xml.htmlUtil.hasAttr","use dojo.xml.htmlUtil.hasAttribute instead","0.4");
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
this.insertCSSRule=function(_550,_551,_552){
dojo.deprecated("dojo.xml.htmlUtil.insertCSSRule","use dojo.style.insertCssRule instead","0.4");
return dojo.xml.htmlUtil.insertCssRule(_550,_551,_552);
};
this.removeCssRule=function(){
return dojo.style.removeCssRule.apply(dojo.style,arguments);
};
this.removeCSSRule=function(_553){
dojo.deprecated("dojo.xml.htmlUtil.removeCSSRule","use dojo.xml.htmlUtil.removeCssRule instead","0.4");
return dojo.xml.htmlUtil.removeCssRule(_553);
};
this.insertCssFile=function(){
return dojo.style.insertCssFile.apply(dojo.style,arguments);
};
this.insertCSSFile=function(URI,doc,_556){
dojo.deprecated("dojo.xml.htmlUtil.insertCSSFile","use dojo.xml.htmlUtil.insertCssFile instead","0.4");
return dojo.xml.htmlUtil.insertCssFile(URI,doc,_556);
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
dojo.kwCompoundRequire({common:["dojo.xml.domUtil"],browser:["dojo.xml.htmlUtil"],dashboard:["dojo.xml.htmlUtil"],svg:["dojo.xml.svgUtil"]});
dojo.provide("dojo.xml.*");
dojo.require("dojo.lang");
dojo.provide("dojo.dnd.DragSource");
dojo.provide("dojo.dnd.DropTarget");
dojo.provide("dojo.dnd.DragObject");
dojo.provide("dojo.dnd.DragAndDrop");
dojo.dnd.DragSource=function(){
var dm=dojo.dnd.dragManager;
if(dm["registerDragSource"]){
dm.registerDragSource(this);
}
};
dojo.lang.extend(dojo.dnd.DragSource,{type:"",onDragEnd:function(){
},onDragStart:function(){
},onSelected:function(){
},unregister:function(){
dojo.dnd.dragManager.unregisterDragSource(this);
},reregister:function(){
dojo.dnd.dragManager.registerDragSource(this);
}});
dojo.dnd.DragObject=function(){
var dm=dojo.dnd.dragManager;
if(dm["registerDragObject"]){
dm.registerDragObject(this);
}
};
dojo.lang.extend(dojo.dnd.DragObject,{type:"",onDragStart:function(){
},onDragMove:function(){
},onDragOver:function(){
},onDragOut:function(){
},onDragEnd:function(){
},onDragLeave:this.onDragOut,onDragEnter:this.onDragOver,ondragout:this.onDragOut,ondragover:this.onDragOver});
dojo.dnd.DropTarget=function(){
if(this.constructor==dojo.dnd.DropTarget){
return;
}
this.acceptedTypes=[];
dojo.dnd.dragManager.registerDropTarget(this);
};
dojo.lang.extend(dojo.dnd.DropTarget,{acceptsType:function(type){
if(!dojo.lang.inArray(this.acceptedTypes,"*")){
if(!dojo.lang.inArray(this.acceptedTypes,type)){
return false;
}
}
return true;
},accepts:function(_55a){
if(!dojo.lang.inArray(this.acceptedTypes,"*")){
for(var i=0;i<_55a.length;i++){
if(!dojo.lang.inArray(this.acceptedTypes,_55a[i].type)){
return false;
}
}
}
return true;
},onDragOver:function(){
},onDragOut:function(){
},onDragMove:function(){
},onDropStart:function(){
},onDrop:function(){
},onDropEnd:function(){
}});
dojo.dnd.DragEvent=function(){
this.dragSource=null;
this.dragObject=null;
this.target=null;
this.eventStatus="success";
};
dojo.dnd.DragManager=function(){
};
dojo.lang.extend(dojo.dnd.DragManager,{selectedSources:[],dragObjects:[],dragSources:[],registerDragSource:function(){
},dropTargets:[],registerDropTarget:function(){
},lastDragTarget:null,currentDragTarget:null,onKeyDown:function(){
},onMouseOut:function(){
},onMouseMove:function(){
},onMouseUp:function(){
}});
dojo.provide("dojo.dnd.HtmlDragManager");
dojo.require("dojo.dnd.DragAndDrop");
dojo.require("dojo.event.*");
dojo.require("dojo.lang.array");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.dnd.HtmlDragManager=function(){
};
dojo.inherits(dojo.dnd.HtmlDragManager,dojo.dnd.DragManager);
dojo.lang.extend(dojo.dnd.HtmlDragManager,{disabled:false,nestedTargets:false,mouseDownTimer:null,dsCounter:0,dsPrefix:"dojoDragSource",dropTargetDimensions:[],currentDropTarget:null,previousDropTarget:null,_dragTriggered:false,selectedSources:[],dragObjects:[],currentX:null,currentY:null,lastX:null,lastY:null,mouseDownX:null,mouseDownY:null,threshold:7,dropAcceptable:false,cancelEvent:function(e){
e.stopPropagation();
e.preventDefault();
},registerDragSource:function(ds){
if(ds["domNode"]){
var dp=this.dsPrefix;
var _55f=dp+"Idx_"+(this.dsCounter++);
ds.dragSourceId=_55f;
this.dragSources[_55f]=ds;
ds.domNode.setAttribute(dp,_55f);
if(dojo.render.html.ie){
dojo.event.connect(ds.domNode,"ondragstart",this.cancelEvent);
}
}
},unregisterDragSource:function(ds){
if(ds["domNode"]){
var dp=this.dsPrefix;
var _562=ds.dragSourceId;
delete ds.dragSourceId;
delete this.dragSources[_562];
ds.domNode.setAttribute(dp,null);
}
if(dojo.render.html.ie){
dojo.event.disconnect(ds.domNode,"ondragstart",this.cancelEvent);
}
},registerDropTarget:function(dt){
this.dropTargets.push(dt);
},unregisterDropTarget:function(dt){
var _565=dojo.lang.find(this.dropTargets,dt,true);
if(_565>=0){
this.dropTargets.splice(_565,1);
}
},getDragSource:function(e){
var tn=e.target;
if(tn===document.body){
return;
}
var ta=dojo.html.getAttribute(tn,this.dsPrefix);
while((!ta)&&(tn)){
tn=tn.parentNode;
if((!tn)||(tn===document.body)){
return;
}
ta=dojo.html.getAttribute(tn,this.dsPrefix);
}
return this.dragSources[ta];
},onKeyDown:function(e){
},onMouseDown:function(e){
if(this.disabled){
return;
}
if(dojo.render.html.ie){
if(e.button!=1){
return;
}
}else{
if(e.which!=1){
return;
}
}
var _56b=e.target.nodeType==dojo.dom.TEXT_NODE?e.target.parentNode:e.target;
if(dojo.html.isTag(_56b,"button","textarea","input","select","option")){
return;
}
var ds=this.getDragSource(e);
if(!ds){
return;
}
if(!dojo.lang.inArray(this.selectedSources,ds)){
this.selectedSources.push(ds);
ds.onSelected();
}
this.mouseDownX=e.pageX;
this.mouseDownY=e.pageY;
e.preventDefault();
dojo.event.connect(document,"onmousemove",this,"onMouseMove");
},onMouseUp:function(e,_56e){
if(this.selectedSources.length==0){
return;
}
this.mouseDownX=null;
this.mouseDownY=null;
this._dragTriggered=false;
e.dragSource=this.dragSource;
if((!e.shiftKey)&&(!e.ctrlKey)){
if(this.currentDropTarget){
this.currentDropTarget.onDropStart();
}
dojo.lang.forEach(this.dragObjects,function(_56f){
var ret=null;
if(!_56f){
return;
}
if(this.currentDropTarget){
e.dragObject=_56f;
var ce=this.currentDropTarget.domNode.childNodes;
if(ce.length>0){
e.dropTarget=ce[0];
while(e.dropTarget==_56f.domNode){
e.dropTarget=e.dropTarget.nextSibling;
}
}else{
e.dropTarget=this.currentDropTarget.domNode;
}
if(this.dropAcceptable){
ret=this.currentDropTarget.onDrop(e);
}else{
this.currentDropTarget.onDragOut(e);
}
}
e.dragStatus=this.dropAcceptable&&ret?"dropSuccess":"dropFailure";
dojo.lang.delayThese([function(){
try{
_56f.dragSource.onDragEnd(e);
}
catch(err){
var _572={};
for(var i in e){
if(i=="type"){
_572.type="mouseup";
continue;
}
_572[i]=e[i];
}
_56f.dragSource.onDragEnd(_572);
}
},function(){
_56f.onDragEnd(e);
}]);
},this);
this.selectedSources=[];
this.dragObjects=[];
this.dragSource=null;
if(this.currentDropTarget){
this.currentDropTarget.onDropEnd();
}
}
dojo.event.disconnect(document,"onmousemove",this,"onMouseMove");
this.currentDropTarget=null;
},onScroll:function(){
for(var i=0;i<this.dragObjects.length;i++){
if(this.dragObjects[i].updateDragOffset){
this.dragObjects[i].updateDragOffset();
}
}
this.cacheTargetLocations();
},_dragStartDistance:function(x,y){
if((!this.mouseDownX)||(!this.mouseDownX)){
return;
}
var dx=Math.abs(x-this.mouseDownX);
var dx2=dx*dx;
var dy=Math.abs(y-this.mouseDownY);
var dy2=dy*dy;
return parseInt(Math.sqrt(dx2+dy2),10);
},cacheTargetLocations:function(){
this.dropTargetDimensions=[];
dojo.lang.forEach(this.dropTargets,function(_57b){
var tn=_57b.domNode;
if(!tn){
return;
}
var ttx=dojo.style.getAbsoluteX(tn,true);
var tty=dojo.style.getAbsoluteY(tn,true);
this.dropTargetDimensions.push([[ttx,tty],[ttx+dojo.style.getInnerWidth(tn),tty+dojo.style.getInnerHeight(tn)],_57b]);
},this);
},onMouseMove:function(e){
if((dojo.render.html.ie)&&(e.button!=1)){
this.currentDropTarget=null;
this.onMouseUp(e,true);
return;
}
if((this.selectedSources.length)&&(!this.dragObjects.length)){
var dx;
var dy;
if(!this._dragTriggered){
this._dragTriggered=(this._dragStartDistance(e.pageX,e.pageY)>this.threshold);
if(!this._dragTriggered){
return;
}
dx=e.pageX-this.mouseDownX;
dy=e.pageY-this.mouseDownY;
}
this.dragSource=this.selectedSources[0];
dojo.lang.forEach(this.selectedSources,function(_582){
if(!_582){
return;
}
var tdo=_582.onDragStart(e);
if(tdo){
tdo.onDragStart(e);
tdo.dragOffset.top+=dy;
tdo.dragOffset.left+=dx;
tdo.dragSource=_582;
this.dragObjects.push(tdo);
}
},this);
this.previousDropTarget=null;
this.cacheTargetLocations();
}
dojo.lang.forEach(this.dragObjects,function(_584){
if(_584){
_584.onDragMove(e);
}
});
if(this.currentDropTarget){
var c=dojo.style.toCoordinateArray(this.currentDropTarget.domNode,true);
var dtp=[[c[0],c[1]],[c[0]+c[2],c[1]+c[3]]];
}
if((!this.nestedTargets)&&(dtp)&&(this.isInsideBox(e,dtp))){
if(this.dropAcceptable){
this.currentDropTarget.onDragMove(e,this.dragObjects);
}
}else{
var _587=this.findBestTarget(e);
if(_587.target===null){
if(this.currentDropTarget){
this.currentDropTarget.onDragOut(e);
this.previousDropTarget=this.currentDropTarget;
this.currentDropTarget=null;
}
this.dropAcceptable=false;
return;
}
if(this.currentDropTarget!==_587.target){
if(this.currentDropTarget){
this.previousDropTarget=this.currentDropTarget;
this.currentDropTarget.onDragOut(e);
}
this.currentDropTarget=_587.target;
e.dragObjects=this.dragObjects;
this.dropAcceptable=this.currentDropTarget.onDragOver(e);
}else{
if(this.dropAcceptable){
this.currentDropTarget.onDragMove(e,this.dragObjects);
}
}
}
},findBestTarget:function(e){
var _589=this;
var _58a=new Object();
_58a.target=null;
_58a.points=null;
dojo.lang.every(this.dropTargetDimensions,function(_58b){
if(!_589.isInsideBox(e,_58b)){
return true;
}
_58a.target=_58b[2];
_58a.points=_58b;
return Boolean(_589.nestedTargets);
});
return _58a;
},isInsideBox:function(e,_58d){
if((e.pageX>_58d[0][0])&&(e.pageX<_58d[1][0])&&(e.pageY>_58d[0][1])&&(e.pageY<_58d[1][1])){
return true;
}
return false;
},onMouseOver:function(e){
},onMouseOut:function(e){
}});
dojo.dnd.dragManager=new dojo.dnd.HtmlDragManager();
(function(){
var d=document;
var dm=dojo.dnd.dragManager;
dojo.event.connect(d,"onkeydown",dm,"onKeyDown");
dojo.event.connect(d,"onmouseover",dm,"onMouseOver");
dojo.event.connect(d,"onmouseout",dm,"onMouseOut");
dojo.event.connect(d,"onmousedown",dm,"onMouseDown");
dojo.event.connect(d,"onmouseup",dm,"onMouseUp");
dojo.event.connect(window,"onscroll",dm,"onScroll");
})();
dojo.require("dojo.html");
dojo.provide("dojo.html.extras");
dojo.require("dojo.string.extras");
dojo.html.gravity=function(node,e){
node=dojo.byId(node);
var _594=dojo.html.getCursorPosition(e);
with(dojo.html){
var _595=getAbsoluteX(node,true)+(getInnerWidth(node)/2);
var _596=getAbsoluteY(node,true)+(getInnerHeight(node)/2);
}
with(dojo.html.gravity){
return ((_594.x<_595?WEST:EAST)|(_594.y<_596?NORTH:SOUTH));
}
};
dojo.html.gravity.NORTH=1;
dojo.html.gravity.SOUTH=1<<1;
dojo.html.gravity.EAST=1<<2;
dojo.html.gravity.WEST=1<<3;
dojo.html.renderedTextContent=function(node){
node=dojo.byId(node);
var _598="";
if(node==null){
return _598;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
var _59a="unknown";
try{
_59a=dojo.style.getStyle(node.childNodes[i],"display");
}
catch(E){
}
switch(_59a){
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
_598+="\n";
_598+=dojo.html.renderedTextContent(node.childNodes[i]);
_598+="\n";
break;
case "none":
break;
default:
if(node.childNodes[i].tagName&&node.childNodes[i].tagName.toLowerCase()=="br"){
_598+="\n";
}else{
_598+=dojo.html.renderedTextContent(node.childNodes[i]);
}
break;
}
break;
case 3:
case 2:
case 4:
var text=node.childNodes[i].nodeValue;
var _59c="unknown";
try{
_59c=dojo.style.getStyle(node,"text-transform");
}
catch(E){
}
switch(_59c){
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
switch(_59c){
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
if(/\s$/.test(_598)){
text.replace(/^\s/,"");
}
break;
}
_598+=text;
break;
default:
break;
}
}
return _598;
};
dojo.html.createNodesFromText=function(txt,trim){
if(trim){
txt=dojo.string.trim(txt);
}
var tn=document.createElement("div");
tn.style.visibility="hidden";
document.body.appendChild(tn);
var _5a0="none";
if((/^<t[dh][\s\r\n>]/i).test(dojo.string.trimStart(txt))){
txt="<table><tbody><tr>"+txt+"</tr></tbody></table>";
_5a0="cell";
}else{
if((/^<tr[\s\r\n>]/i).test(dojo.string.trimStart(txt))){
txt="<table><tbody>"+txt+"</tbody></table>";
_5a0="row";
}else{
if((/^<(thead|tbody|tfoot)[\s\r\n>]/i).test(dojo.string.trimStart(txt))){
txt="<table>"+txt+"</table>";
_5a0="section";
}
}
}
tn.innerHTML=txt;
if(tn["normalize"]){
tn.normalize();
}
var _5a1=null;
switch(_5a0){
case "cell":
_5a1=tn.getElementsByTagName("tr")[0];
break;
case "row":
_5a1=tn.getElementsByTagName("tbody")[0];
break;
case "section":
_5a1=tn.getElementsByTagName("table")[0];
break;
default:
_5a1=tn;
break;
}
var _5a2=[];
for(var x=0;x<_5a1.childNodes.length;x++){
_5a2.push(_5a1.childNodes[x].cloneNode(true));
}
tn.style.display="none";
document.body.removeChild(tn);
return _5a2;
};
dojo.html.placeOnScreen=function(node,_5a5,_5a6,_5a7,_5a8){
if(dojo.lang.isArray(_5a5)){
_5a8=_5a7;
_5a7=_5a6;
_5a6=_5a5[1];
_5a5=_5a5[0];
}
if(!isNaN(_5a7)){
_5a7=[Number(_5a7),Number(_5a7)];
}else{
if(!dojo.lang.isArray(_5a7)){
_5a7=[0,0];
}
}
var _5a9=dojo.html.getScrollOffset();
var view=dojo.html.getViewportSize();
node=dojo.byId(node);
var w=node.offsetWidth+_5a7[0];
var h=node.offsetHeight+_5a7[1];
if(_5a8){
_5a5-=_5a9.x;
_5a6-=_5a9.y;
}
var x=_5a5+w;
if(x>view.w){
x=view.w-w;
}else{
x=_5a5;
}
x=Math.max(_5a7[0],x)+_5a9.x;
var y=_5a6+h;
if(y>view.h){
y=view.h-h;
}else{
y=_5a6;
}
y=Math.max(_5a7[1],y)+_5a9.y;
node.style.left=x+"px";
node.style.top=y+"px";
var ret=[x,y];
ret.x=x;
ret.y=y;
return ret;
};
dojo.html.placeOnScreenPoint=function(node,_5b1,_5b2,_5b3,_5b4){
if(dojo.lang.isArray(_5b1)){
_5b4=_5b3;
_5b3=_5b2;
_5b2=_5b1[1];
_5b1=_5b1[0];
}
if(!isNaN(_5b3)){
_5b3=[Number(_5b3),Number(_5b3)];
}else{
if(!dojo.lang.isArray(_5b3)){
_5b3=[0,0];
}
}
var _5b5=dojo.html.getScrollOffset();
var view=dojo.html.getViewportSize();
node=dojo.byId(node);
var _5b7=node.style.display;
node.style.display="";
var w=dojo.style.getInnerWidth(node);
var h=dojo.style.getInnerHeight(node);
node.style.display=_5b7;
if(_5b4){
_5b1-=_5b5.x;
_5b2-=_5b5.y;
}
var x=-1,y=-1;
if((_5b1+_5b3[0])+w<=view.w&&(_5b2+_5b3[1])+h<=view.h){
x=(_5b1+_5b3[0]);
y=(_5b2+_5b3[1]);
}
if((x<0||y<0)&&(_5b1-_5b3[0])<=view.w&&(_5b2+_5b3[1])+h<=view.h){
x=(_5b1-_5b3[0])-w;
y=(_5b2+_5b3[1]);
}
if((x<0||y<0)&&(_5b1+_5b3[0])+w<=view.w&&(_5b2-_5b3[1])<=view.h){
x=(_5b1+_5b3[0]);
y=(_5b2-_5b3[1])-h;
}
if((x<0||y<0)&&(_5b1-_5b3[0])<=view.w&&(_5b2-_5b3[1])<=view.h){
x=(_5b1-_5b3[0])-w;
y=(_5b2-_5b3[1])-h;
}
if(x<0||y<0||(x+w>view.w)||(y+h>view.h)){
return dojo.html.placeOnScreen(node,_5b1,_5b2,_5b3,_5b4);
}
x+=_5b5.x;
y+=_5b5.y;
node.style.left=x+"px";
node.style.top=y+"px";
var ret=[x,y];
ret.x=x;
ret.y=y;
return ret;
};
dojo.html.BackgroundIframe=function(node){
if(dojo.render.html.ie55||dojo.render.html.ie60){
var html="<iframe "+"style='position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"+"z-index: -1; filter:Alpha(Opacity=\"0\");' "+">";
this.iframe=document.createElement(html);
if(node){
node.appendChild(this.iframe);
this.domNode=node;
}else{
document.body.appendChild(this.iframe);
this.iframe.style.display="none";
}
}
};
dojo.lang.extend(dojo.html.BackgroundIframe,{iframe:null,onResized:function(){
if(this.iframe&&this.domNode&&this.domNode.parentElement){
var w=dojo.style.getOuterWidth(this.domNode);
var h=dojo.style.getOuterHeight(this.domNode);
if(w==0||h==0){
dojo.lang.setTimeout(this,this.onResized,50);
return;
}
var s=this.iframe.style;
s.width=w+"px";
s.height=h+"px";
}
},size:function(node){
if(!this.iframe){
return;
}
var _5c2=dojo.style.toCoordinateArray(node,true);
var s=this.iframe.style;
s.width=_5c2.w+"px";
s.height=_5c2.h+"px";
s.left=_5c2.x+"px";
s.top=_5c2.y+"px";
},setZIndex:function(node){
if(!this.iframe){
return;
}
if(dojo.dom.isNode(node)){
this.iframe.style.zIndex=dojo.html.getStyle(node,"z-index")-1;
}else{
if(!isNaN(node)){
this.iframe.style.zIndex=node;
}
}
},show:function(){
if(!this.iframe){
return;
}
this.iframe.style.display="block";
},hide:function(){
if(!this.ie){
return;
}
var s=this.iframe.style;
s.display="none";
},remove:function(){
dojo.dom.removeNode(this.iframe);
}});
dojo.provide("dojo.dnd.HtmlDragAndDrop");
dojo.provide("dojo.dnd.HtmlDragSource");
dojo.provide("dojo.dnd.HtmlDropTarget");
dojo.provide("dojo.dnd.HtmlDragObject");
dojo.require("dojo.dnd.HtmlDragManager");
dojo.require("dojo.dnd.DragAndDrop");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.require("dojo.html");
dojo.require("dojo.html.extras");
dojo.require("dojo.lang.extras");
dojo.require("dojo.lfx.*");
dojo.require("dojo.event");
dojo.dnd.HtmlDragSource=function(node,type){
node=dojo.byId(node);
this.dragObjects=[];
this.constrainToContainer=false;
if(node){
this.domNode=node;
this.dragObject=node;
dojo.dnd.DragSource.call(this);
this.type=(type)||(this.domNode.nodeName.toLowerCase());
}
};
dojo.inherits(dojo.dnd.HtmlDragSource,dojo.dnd.DragSource);
dojo.lang.extend(dojo.dnd.HtmlDragSource,{dragClass:"",onDragStart:function(){
var _5c8=new dojo.dnd.HtmlDragObject(this.dragObject,this.type);
if(this.dragClass){
_5c8.dragClass=this.dragClass;
}
if(this.constrainToContainer){
_5c8.constrainTo(this.constrainingContainer||this.domNode.parentNode);
}
return _5c8;
},setDragHandle:function(node){
node=dojo.byId(node);
dojo.dnd.dragManager.unregisterDragSource(this);
this.domNode=node;
dojo.dnd.dragManager.registerDragSource(this);
},setDragTarget:function(node){
this.dragObject=node;
},constrainTo:function(_5cb){
this.constrainToContainer=true;
if(_5cb){
this.constrainingContainer=_5cb;
}
},onSelected:function(){
for(var i=0;i<this.dragObjects.length;i++){
dojo.dnd.dragManager.selectedSources.push(new dojo.dnd.HtmlDragSource(this.dragObjects[i]));
}
},addDragObjects:function(el){
for(var i=0;i<arguments.length;i++){
this.dragObjects.push(arguments[i]);
}
}});
dojo.dnd.HtmlDragObject=function(node,type){
this.domNode=dojo.byId(node);
this.type=type;
this.constrainToContainer=false;
this.dragSource=null;
};
dojo.inherits(dojo.dnd.HtmlDragObject,dojo.dnd.DragObject);
dojo.lang.extend(dojo.dnd.HtmlDragObject,{dragClass:"",opacity:0.5,createIframe:true,disableX:false,disableY:false,createDragNode:function(){
var node=this.domNode.cloneNode(true);
if(this.dragClass){
dojo.html.addClass(node,this.dragClass);
}
if(this.opacity<1){
dojo.style.setOpacity(node,this.opacity);
}
if(node.tagName.toLowerCase()=="tr"){
var doc=this.domNode.ownerDocument;
var _5d3=doc.createElement("table");
var _5d4=doc.createElement("tbody");
_5d4.appendChild(node);
_5d3.appendChild(_5d4);
var _5d5=this.domNode.childNodes;
var _5d6=node.childNodes;
for(var i=0;i<_5d5.length;i++){
if((_5d6[i])&&(_5d6[i].style)){
_5d6[i].style.width=dojo.style.getContentWidth(_5d5[i])+"px";
}
}
node=_5d3;
}
if((dojo.render.html.ie55||dojo.render.html.ie60)&&this.createIframe){
with(node.style){
top="0px";
left="0px";
}
var _5d8=document.createElement("div");
_5d8.appendChild(node);
this.bgIframe=new dojo.html.BackgroundIframe(_5d8);
_5d8.appendChild(this.bgIframe.iframe);
node=_5d8;
}
node.style.zIndex=999;
return node;
},onDragStart:function(e){
dojo.html.clearSelection();
this.scrollOffset=dojo.html.getScrollOffset();
this.dragStartPosition=dojo.style.getAbsolutePosition(this.domNode,true);
this.dragOffset={y:this.dragStartPosition.y-e.pageY,x:this.dragStartPosition.x-e.pageX};
this.dragClone=this.createDragNode();
this.containingBlockPosition=this.domNode.offsetParent?dojo.style.getAbsolutePosition(this.domNode.offsetParent):{x:0,y:0};
if(this.constrainToContainer){
this.constraints=this.getConstraints();
}
with(this.dragClone.style){
position="absolute";
top=this.dragOffset.y+e.pageY+"px";
left=this.dragOffset.x+e.pageX+"px";
}
document.body.appendChild(this.dragClone);
dojo.event.topic.publish("dragStart",{source:this});
},getConstraints:function(){
if(this.constrainingContainer.nodeName.toLowerCase()=="body"){
var _5da=dojo.html.getViewportWidth();
var _5db=dojo.html.getViewportHeight();
var x=0;
var y=0;
}else{
_5da=dojo.style.getContentWidth(this.constrainingContainer);
_5db=dojo.style.getContentHeight(this.constrainingContainer);
x=this.containingBlockPosition.x+dojo.style.getPixelValue(this.constrainingContainer,"padding-left",true)+dojo.style.getBorderExtent(this.constrainingContainer,"left");
y=this.containingBlockPosition.y+dojo.style.getPixelValue(this.constrainingContainer,"padding-top",true)+dojo.style.getBorderExtent(this.constrainingContainer,"top");
}
return {minX:x,minY:y,maxX:x+_5da-dojo.style.getOuterWidth(this.domNode),maxY:y+_5db-dojo.style.getOuterHeight(this.domNode)};
},updateDragOffset:function(){
var _5de=dojo.html.getScrollOffset();
if(_5de.y!=this.scrollOffset.y){
var diff=_5de.y-this.scrollOffset.y;
this.dragOffset.y+=diff;
this.scrollOffset.y=_5de.y;
}
if(_5de.x!=this.scrollOffset.x){
var diff=_5de.x-this.scrollOffset.x;
this.dragOffset.x+=diff;
this.scrollOffset.x=_5de.x;
}
},onDragMove:function(e){
this.updateDragOffset();
var x=this.dragOffset.x+e.pageX;
var y=this.dragOffset.y+e.pageY;
if(this.constrainToContainer){
if(x<this.constraints.minX){
x=this.constraints.minX;
}
if(y<this.constraints.minY){
y=this.constraints.minY;
}
if(x>this.constraints.maxX){
x=this.constraints.maxX;
}
if(y>this.constraints.maxY){
y=this.constraints.maxY;
}
}
this.setAbsolutePosition(x,y);
dojo.event.topic.publish("dragMove",{source:this});
},setAbsolutePosition:function(x,y){
if(!this.disableY){
this.dragClone.style.top=y+"px";
}
if(!this.disableX){
this.dragClone.style.left=x+"px";
}
},onDragEnd:function(e){
switch(e.dragStatus){
case "dropSuccess":
dojo.dom.removeNode(this.dragClone);
this.dragClone=null;
break;
case "dropFailure":
var _5e6=dojo.style.getAbsolutePosition(this.dragClone,true);
var _5e7=[this.dragStartPosition.x+1,this.dragStartPosition.y+1];
var line=new dojo.lfx.Line(_5e6,_5e7);
var anim=new dojo.lfx.Animation(500,line,dojo.lfx.easeOut);
var _5ea=this;
dojo.event.connect(anim,"onAnimate",function(e){
_5ea.dragClone.style.left=e[0]+"px";
_5ea.dragClone.style.top=e[1]+"px";
});
dojo.event.connect(anim,"onEnd",function(e){
dojo.lang.setTimeout(function(){
dojo.dom.removeNode(_5ea.dragClone);
_5ea.dragClone=null;
},200);
});
anim.play();
break;
}
dojo.event.connect(this.domNode,"onclick",this,"squelchOnClick");
dojo.event.topic.publish("dragEnd",{source:this});
},squelchOnClick:function(e){
e.preventDefault();
dojo.event.disconnect(this.domNode,"onclick",this,"squelchOnClick");
},constrainTo:function(_5ee){
this.constrainToContainer=true;
if(_5ee){
this.constrainingContainer=_5ee;
}else{
this.constrainingContainer=this.domNode.parentNode;
}
}});
dojo.dnd.HtmlDropTarget=function(node,_5f0){
if(arguments.length==0){
return;
}
this.domNode=dojo.byId(node);
dojo.dnd.DropTarget.call(this);
if(_5f0&&dojo.lang.isString(_5f0)){
_5f0=[_5f0];
}
this.acceptedTypes=_5f0||[];
};
dojo.inherits(dojo.dnd.HtmlDropTarget,dojo.dnd.DropTarget);
dojo.lang.extend(dojo.dnd.HtmlDropTarget,{onDragOver:function(e){
if(!this.accepts(e.dragObjects)){
return false;
}
this.childBoxes=[];
for(var i=0,child;i<this.domNode.childNodes.length;i++){
child=this.domNode.childNodes[i];
if(child.nodeType!=dojo.dom.ELEMENT_NODE){
continue;
}
var pos=dojo.style.getAbsolutePosition(child,true);
var _5f4=dojo.style.getInnerHeight(child);
var _5f5=dojo.style.getInnerWidth(child);
this.childBoxes.push({top:pos.y,bottom:pos.y+_5f4,left:pos.x,right:pos.x+_5f5,node:child});
}
return true;
},_getNodeUnderMouse:function(e){
for(var i=0,child;i<this.childBoxes.length;i++){
with(this.childBoxes[i]){
if(e.pageX>=left&&e.pageX<=right&&e.pageY>=top&&e.pageY<=bottom){
return i;
}
}
}
return -1;
},createDropIndicator:function(){
this.dropIndicator=document.createElement("div");
with(this.dropIndicator.style){
position="absolute";
zIndex=999;
borderTopWidth="1px";
borderTopColor="black";
borderTopStyle="solid";
width=dojo.style.getInnerWidth(this.domNode)+"px";
left=dojo.style.getAbsoluteX(this.domNode,true)+"px";
}
},onDragMove:function(e,_5f9){
var i=this._getNodeUnderMouse(e);
if(!this.dropIndicator){
this.createDropIndicator();
}
if(i<0){
if(this.childBoxes.length){
var _5fb=(dojo.html.gravity(this.childBoxes[0].node,e)&dojo.html.gravity.NORTH);
}else{
var _5fb=true;
}
}else{
var _5fc=this.childBoxes[i];
var _5fb=(dojo.html.gravity(_5fc.node,e)&dojo.html.gravity.NORTH);
}
this.placeIndicator(e,_5f9,i,_5fb);
if(!dojo.html.hasParent(this.dropIndicator)){
document.body.appendChild(this.dropIndicator);
}
},placeIndicator:function(e,_5fe,_5ff,_600){
with(this.dropIndicator.style){
if(_5ff<0){
if(this.childBoxes.length){
top=(_600?this.childBoxes[0].top:this.childBoxes[this.childBoxes.length-1].bottom)+"px";
}else{
top=dojo.style.getAbsoluteY(this.domNode,true)+"px";
}
}else{
var _601=this.childBoxes[_5ff];
top=(_600?_601.top:_601.bottom)+"px";
}
}
},onDragOut:function(e){
if(this.dropIndicator){
dojo.dom.removeNode(this.dropIndicator);
delete this.dropIndicator;
}
},onDrop:function(e){
this.onDragOut(e);
var i=this._getNodeUnderMouse(e);
if(i<0){
if(this.childBoxes.length){
if(dojo.html.gravity(this.childBoxes[0].node,e)&dojo.html.gravity.NORTH){
return this.insert(e,this.childBoxes[0].node,"before");
}else{
return this.insert(e,this.childBoxes[this.childBoxes.length-1].node,"after");
}
}
return this.insert(e,this.domNode,"append");
}
var _605=this.childBoxes[i];
if(dojo.html.gravity(_605.node,e)&dojo.html.gravity.NORTH){
return this.insert(e,_605.node,"before");
}else{
return this.insert(e,_605.node,"after");
}
},insert:function(e,_607,_608){
var node=e.dragObject.domNode;
if(_608=="before"){
return dojo.html.insertBefore(node,_607);
}else{
if(_608=="after"){
return dojo.html.insertAfter(node,_607);
}else{
if(_608=="append"){
_607.appendChild(node);
return true;
}
}
}
return false;
}});
dojo.kwCompoundRequire({common:["dojo.dnd.DragAndDrop"],browser:["dojo.dnd.HtmlDragAndDrop"],dashboard:["dojo.dnd.HtmlDragAndDrop"]});
dojo.provide("dojo.dnd.*");
dojo.provide("dojo.lang.declare");
dojo.require("dojo.lang.common");
dojo.require("dojo.lang.extras");
dojo.lang.declare=function(_60a,_60b,init,_60d){
if((dojo.lang.isFunction(_60d))||((!_60d)&&(!dojo.lang.isFunction(init)))){
var temp=_60d;
_60d=init;
init=temp;
}
var _60f=[];
if(dojo.lang.isArray(_60b)){
_60f=_60b;
_60b=_60f.shift();
}
if(!init){
init=dojo.evalObjPath(_60a,false);
if((init)&&(!dojo.lang.isFunction(init))){
init=null;
}
}
var ctor=dojo.lang.declare._makeConstructor();
var scp=(_60b?_60b.prototype:null);
if(scp){
scp.prototyping=true;
ctor.prototype=new _60b();
scp.prototyping=false;
}
ctor.superclass=scp;
ctor.mixins=_60f;
for(var i=0,l=_60f.length;i<l;i++){
dojo.lang.extend(ctor,_60f[i].prototype);
}
ctor.prototype.initializer=null;
ctor.prototype.declaredClass=_60a;
if(dojo.lang.isArray(_60d)){
dojo.lang.extend.apply(dojo.lang,[ctor].concat(_60d));
}else{
dojo.lang.extend(ctor,(_60d)||{});
}
dojo.lang.extend(ctor,dojo.lang.declare.base);
ctor.prototype.constructor=ctor;
ctor.prototype.initializer=(ctor.prototype.initializer)||(init)||(function(){
});
dojo.lang.setObjPathValue(_60a,ctor,null,true);
};
dojo.lang.declare._makeConstructor=function(){
return function(){
var self=this._getPropContext();
var s=self.constructor.superclass;
if((s)&&(s.constructor)){
if(s.constructor==arguments.callee){
this.inherited("constructor",arguments);
}else{
this._inherited(s,"constructor",arguments);
}
}
var m=(self.constructor.mixins)||([]);
for(var i=0,l=m.length;i<l;i++){
(((m[i].prototype)&&(m[i].prototype.initializer))||(m[i])).apply(this,arguments);
}
if((!this.prototyping)&&(self.initializer)){
self.initializer.apply(this,arguments);
}
};
};
dojo.lang.declare.base={_getPropContext:function(){
return (this.___proto||this);
},_inherited:function(_617,_618,args){
var _61a=this.___proto;
this.___proto=_617;
var _61b=_617[_618].apply(this,(args||[]));
this.___proto=_61a;
return _61b;
},inheritedFrom:function(ctor,prop,args){
var p=((ctor)&&(ctor.prototype)&&(ctor.prototype[prop]));
return (dojo.lang.isFunction(p)?p.apply(this,(args||[])):p);
},inherited:function(prop,args){
var p=this._getPropContext();
do{
if((!p.constructor)||(!p.constructor.superclass)){
return;
}
p=p.constructor.superclass;
}while(!(prop in p));
return (dojo.lang.isFunction(p[prop])?this._inherited(p,prop,args):p[prop]);
}};
dojo.declare=dojo.lang.declare;
dojo.provide("dojo.widget.Manager");
dojo.require("dojo.lang.array");
dojo.require("dojo.lang.func");
dojo.require("dojo.event.*");
dojo.widget.manager=new function(){
this.widgets=[];
this.widgetIds=[];
this.topWidgets={};
var _623={};
var _624=[];
this.getUniqueId=function(_625){
return _625+"_"+(_623[_625]!=undefined?++_623[_625]:_623[_625]=0);
};
this.add=function(_626){
dojo.profile.start("dojo.widget.manager.add");
this.widgets.push(_626);
if(!_626.extraArgs["id"]){
_626.extraArgs["id"]=_626.extraArgs["ID"];
}
if(_626.widgetId==""){
if(_626["id"]){
_626.widgetId=_626["id"];
}else{
if(_626.extraArgs["id"]){
_626.widgetId=_626.extraArgs["id"];
}else{
_626.widgetId=this.getUniqueId(_626.widgetType);
}
}
}
if(this.widgetIds[_626.widgetId]){
dojo.debug("widget ID collision on ID: "+_626.widgetId);
}
this.widgetIds[_626.widgetId]=_626;
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
this.remove=function(_628){
var tw=this.widgets[_628].widgetId;
delete this.widgetIds[tw];
this.widgets.splice(_628,1);
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
dojo.deprecated("getWidgetsOfType","use getWidgetsByType","0.4");
return dojo.widget.manager.getWidgetsByType(id);
};
this.getWidgetsByFilter=function(_632,_633){
var ret=[];
dojo.lang.every(this.widgets,function(x){
if(_632(x)){
ret.push(x);
if(_633){
return false;
}
}
return true;
});
return (_633?ret[0]:ret);
};
this.getAllWidgets=function(){
return this.widgets.concat();
};
this.getWidgetByNode=function(node){
var w=this.getAllWidgets();
for(var i=0;i<w.length;i++){
if(w[i].domNode==node){
return w[i];
}
}
return null;
};
this.byId=this.getWidgetById;
this.byType=this.getWidgetsByType;
this.byFilter=this.getWidgetsByFilter;
this.byNode=this.getWidgetByNode;
var _639={};
var _63a=["dojo.widget"];
for(var i=0;i<_63a.length;i++){
_63a[_63a[i]]=true;
}
this.registerWidgetPackage=function(_63c){
if(!_63a[_63c]){
_63a[_63c]=true;
_63a.push(_63c);
}
};
this.getWidgetPackageList=function(){
return dojo.lang.map(_63a,function(elt){
return (elt!==true?elt:undefined);
});
};
this.getImplementation=function(_63e,_63f,_640){
var impl=this.getImplementationName(_63e);
if(impl){
var ret=new impl(_63f);
return ret;
}
};
this.getImplementationName=function(_643){
var _644=_643.toLowerCase();
var impl=_639[_644];
if(impl){
return impl;
}
if(!_624.length){
for(var _646 in dojo.render){
if(dojo.render[_646]["capable"]===true){
var _647=dojo.render[_646].prefixes;
for(var i=0;i<_647.length;i++){
_624.push(_647[i].toLowerCase());
}
}
}
_624.push("");
}
for(var i=0;i<_63a.length;i++){
var _649=dojo.evalObjPath(_63a[i]);
if(!_649){
continue;
}
for(var j=0;j<_624.length;j++){
if(!_649[_624[j]]){
continue;
}
for(var _64b in _649[_624[j]]){
if(_64b.toLowerCase()!=_644){
continue;
}
_639[_644]=_649[_624[j]][_64b];
return _639[_644];
}
}
for(var j=0;j<_624.length;j++){
for(var _64b in _649){
if(_64b.toLowerCase()!=(_624[j]+_644)){
continue;
}
_639[_644]=_649[_64b];
return _639[_644];
}
}
}
throw new Error("Could not locate \""+_643+"\" class");
};
this.resizing=false;
this.onWindowResized=function(){
if(this.resizing){
return;
}
try{
this.resizing=true;
for(var id in this.topWidgets){
var _64d=this.topWidgets[id];
if(_64d.checkSize){
_64d.checkSize();
}
}
}
catch(e){
}
finally{
this.resizing=false;
}
};
if(typeof window!="undefined"){
dojo.addOnLoad(this,"onWindowResized");
dojo.event.connect(window,"onresize",this,"onWindowResized");
}
};
(function(){
var dw=dojo.widget;
var dwm=dw.manager;
var h=dojo.lang.curry(dojo.lang,"hitch",dwm);
var g=function(_652,_653){
dw[(_653||_652)]=h(_652);
};
g("add","addWidget");
g("destroyAll","destroyAllWidgets");
g("remove","removeWidget");
g("removeById","removeWidgetById");
g("getWidgetById");
g("getWidgetById","byId");
g("getWidgetsByType");
g("getWidgetsByFilter");
g("getWidgetsByType","byType");
g("getWidgetsByFilter","byFilter");
g("getWidgetByNode","byNode");
dw.all=function(n){
var _655=dwm.getAllWidgets.apply(dwm,arguments);
if(arguments.length>0){
return _655[n];
}
return _655;
};
g("registerWidgetPackage");
g("getImplementation","getWidgetImplementation");
g("getImplementationName","getWidgetImplementationName");
dw.widgets=dwm.widgets;
dw.widgetIds=dwm.widgetIds;
dw.root=dwm.root;
})();
dojo.provide("dojo.widget.Widget");
dojo.provide("dojo.widget.tags");
dojo.require("dojo.lang.func");
dojo.require("dojo.lang.array");
dojo.require("dojo.lang.extras");
dojo.require("dojo.lang.declare");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.event.*");
dojo.declare("dojo.widget.Widget",null,{initializer:function(){
this.children=[];
this.extraArgs={};
},parent:null,isTopLevel:false,isModal:false,isEnabled:true,isHidden:false,isContainer:false,widgetId:"",widgetType:"Widget",toString:function(){
return "[Widget "+this.widgetType+", "+(this.widgetId||"NO ID")+"]";
},repr:function(){
return this.toString();
},enable:function(){
this.isEnabled=true;
},disable:function(){
this.isEnabled=false;
},hide:function(){
this.isHidden=true;
},show:function(){
this.isHidden=false;
},onResized:function(){
this.notifyChildrenOfResize();
},notifyChildrenOfResize:function(){
for(var i=0;i<this.children.length;i++){
var _657=this.children[i];
if(_657.onResized){
_657.onResized();
}
}
},create:function(args,_659,_65a){
this.satisfyPropertySets(args,_659,_65a);
this.mixInProperties(args,_659,_65a);
this.postMixInProperties(args,_659,_65a);
dojo.widget.manager.add(this);
this.buildRendering(args,_659,_65a);
this.initialize(args,_659,_65a);
this.postInitialize(args,_659,_65a);
this.postCreate(args,_659,_65a);
return this;
},destroy:function(_65b){
this.destroyChildren();
this.uninitialize();
this.destroyRendering(_65b);
dojo.widget.manager.removeById(this.widgetId);
},destroyChildren:function(){
while(this.children.length>0){
var tc=this.children[0];
this.removeChild(tc);
tc.destroy();
}
},getChildrenOfType:function(type,_65e){
var ret=[];
var _660=dojo.lang.isFunction(type);
if(!_660){
type=type.toLowerCase();
}
for(var x=0;x<this.children.length;x++){
if(_660){
if(this.children[x] instanceof type){
ret.push(this.children[x]);
}
}else{
if(this.children[x].widgetType.toLowerCase()==type){
ret.push(this.children[x]);
}
}
if(_65e){
ret=ret.concat(this.children[x].getChildrenOfType(type,_65e));
}
}
return ret;
},getDescendants:function(){
var _662=[];
var _663=[this];
var elem;
while(elem=_663.pop()){
_662.push(elem);
dojo.lang.forEach(elem.children,function(elem){
_663.push(elem);
});
}
return _662;
},satisfyPropertySets:function(args){
return args;
},mixInProperties:function(args,frag){
if((args["fastMixIn"])||(frag["fastMixIn"])){
for(var x in args){
this[x]=args[x];
}
return;
}
var _66a;
var _66b=dojo.widget.lcArgsCache[this.widgetType];
if(_66b==null){
_66b={};
for(var y in this){
_66b[((new String(y)).toLowerCase())]=y;
}
dojo.widget.lcArgsCache[this.widgetType]=_66b;
}
var _66d={};
for(var x in args){
if(!this[x]){
var y=_66b[(new String(x)).toLowerCase()];
if(y){
args[y]=args[x];
x=y;
}
}
if(_66d[x]){
continue;
}
_66d[x]=true;
if((typeof this[x])!=(typeof _66a)){
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
if(args[x].search(/[^\w\.]+/i)==-1){
this[x]=dojo.evalObjPath(args[x],false);
}else{
var tn=dojo.lang.nameAnonFunc(new Function(args[x]),this);
dojo.event.connect(this,x,this,tn);
}
}else{
if(dojo.lang.isArray(this[x])){
this[x]=args[x].split(";");
}else{
if(this[x] instanceof Date){
this[x]=new Date(Number(args[x]));
}else{
if(typeof this[x]=="object"){
if(this[x] instanceof dojo.uri.Uri){
this[x]=args[x];
}else{
var _66f=args[x].split(";");
for(var y=0;y<_66f.length;y++){
var si=_66f[y].indexOf(":");
if((si!=-1)&&(_66f[y].length>si)){
this[x][_66f[y].substr(0,si).replace(/^\s+|\s+$/g,"")]=_66f[y].substr(si+1);
}
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
this.extraArgs[x.toLowerCase()]=args[x];
}
}
},postMixInProperties:function(){
},initialize:function(args,frag){
return false;
},postInitialize:function(args,frag){
return false;
},postCreate:function(args,frag){
return false;
},uninitialize:function(){
return false;
},buildRendering:function(){
dojo.unimplemented("dojo.widget.Widget.buildRendering, on "+this.toString()+", ");
return false;
},destroyRendering:function(){
dojo.unimplemented("dojo.widget.Widget.destroyRendering");
return false;
},cleanUp:function(){
dojo.unimplemented("dojo.widget.Widget.cleanUp");
return false;
},addedTo:function(_677){
},addChild:function(_678){
dojo.unimplemented("dojo.widget.Widget.addChild");
return false;
},removeChild:function(_679){
for(var x=0;x<this.children.length;x++){
if(this.children[x]===_679){
this.children.splice(x,1);
break;
}
}
return _679;
},resize:function(_67b,_67c){
this.setWidth(_67b);
this.setHeight(_67c);
},setWidth:function(_67d){
if((typeof _67d=="string")&&(_67d.substr(-1)=="%")){
this.setPercentageWidth(_67d);
}else{
this.setNativeWidth(_67d);
}
},setHeight:function(_67e){
if((typeof _67e=="string")&&(_67e.substr(-1)=="%")){
this.setPercentageHeight(_67e);
}else{
this.setNativeHeight(_67e);
}
},setPercentageHeight:function(_67f){
return false;
},setNativeHeight:function(_680){
return false;
},setPercentageWidth:function(_681){
return false;
},setNativeWidth:function(_682){
return false;
},getPreviousSibling:function(){
var idx=this.getParentIndex();
if(idx<=0){
return null;
}
return this.getSiblings()[idx-1];
},getSiblings:function(){
return this.parent.children;
},getParentIndex:function(){
return dojo.lang.indexOf(this.getSiblings(),this,true);
},getNextSibling:function(){
var idx=this.getParentIndex();
if(idx==this.getSiblings().length-1){
return null;
}
if(idx<0){
return null;
}
return this.getSiblings()[idx+1];
}});
dojo.widget.lcArgsCache={};
dojo.widget.tags={};
dojo.widget.tags.addParseTreeHandler=function(type){
var _686=type.toLowerCase();
this[_686]=function(_687,_688,_689,_68a,_68b){
return dojo.widget.buildWidgetFromParseTree(_686,_687,_688,_689,_68a,_68b);
};
};
dojo.widget.tags.addParseTreeHandler("dojo:widget");
dojo.widget.tags["dojo:propertyset"]=function(_68c,_68d,_68e){
var _68f=_68d.parseProperties(_68c["dojo:propertyset"]);
};
dojo.widget.tags["dojo:connect"]=function(_690,_691,_692){
var _693=_691.parseProperties(_690["dojo:connect"]);
};
dojo.widget.buildWidgetFromParseTree=function(type,frag,_696,_697,_698,_699){
var _69a=type.split(":");
_69a=(_69a.length==2)?_69a[1]:type;
var _69b=_699||_696.parseProperties(frag["dojo:"+_69a]);
var _69c=dojo.widget.manager.getImplementation(_69a);
if(!_69c){
throw new Error("cannot find \""+_69a+"\" widget");
}else{
if(!_69c.create){
throw new Error("\""+_69a+"\" widget object does not appear to implement *Widget");
}
}
_69b["dojoinsertionindex"]=_698;
var ret=_69c.create(_69b,frag,_697);
return ret;
};
dojo.widget.defineWidget=function(_69e,_69f,_6a0,init,_6a2){
if(dojo.lang.isString(arguments[3])){
dojo.widget._defineWidget(arguments[0],arguments[3],arguments[1],arguments[4],arguments[2]);
}else{
var args=[arguments[0]],p=3;
if(dojo.lang.isString(arguments[1])){
args.push(arguments[1],arguments[2]);
}else{
args.push("",arguments[1]);
p=2;
}
if(dojo.lang.isFunction(arguments[p])){
args.push(arguments[p],arguments[p+1]);
}else{
args.push(null,arguments[p]);
}
dojo.widget._defineWidget.apply(this,args);
}
};
dojo.widget.defineWidget.renderers="html|svg|vml";
dojo.widget._defineWidget=function(_6a4,_6a5,_6a6,init,_6a8){
var _6a9=_6a4.split(".");
var type=_6a9.pop();
var regx="\\.("+(_6a5?_6a5+"|":"")+dojo.widget.defineWidget.renderers+")\\.";
var r=_6a4.search(new RegExp(regx));
_6a9=(r<0?_6a9.join("."):_6a4.substr(0,r));
dojo.widget.manager.registerWidgetPackage(_6a9);
dojo.widget.tags.addParseTreeHandler("dojo:"+type.toLowerCase());
_6a8=(_6a8)||{};
_6a8.widgetType=type;
if((!init)&&(_6a8["classConstructor"])){
init=_6a8.classConstructor;
delete _6a8.classConstructor;
}
dojo.declare(_6a4,_6a6,init,_6a8);
};
dojo.provide("dojo.widget.Parse");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.dom");
dojo.widget.Parse=function(_6ad){
this.propertySetsList=[];
this.fragment=_6ad;
this.createComponents=function(frag,_6af){
var _6b0=[];
var _6b1=false;
try{
if((frag)&&(frag["tagName"])&&(frag!=frag["nodeRef"])){
var _6b2=dojo.widget.tags;
var tna=String(frag["tagName"]).split(";");
for(var x=0;x<tna.length;x++){
var ltn=(tna[x].replace(/^\s+|\s+$/g,"")).toLowerCase();
if(_6b2[ltn]){
_6b1=true;
frag.tagName=ltn;
var ret=_6b2[ltn](frag,this,_6af,frag["index"]);
_6b0.push(ret);
}else{
if((dojo.lang.isString(ltn))&&(ltn.substr(0,5)=="dojo:")){
dojo.debug("no tag handler registed for type: ",ltn);
}
}
}
}
}
catch(e){
dojo.debug("dojo.widget.Parse: error:",e);
}
if(!_6b1){
_6b0=_6b0.concat(this.createSubComponents(frag,_6af));
}
return _6b0;
};
this.createSubComponents=function(_6b7,_6b8){
var frag,comps=[];
for(var item in _6b7){
frag=_6b7[item];
if((frag)&&(typeof frag=="object")&&(frag!=_6b7.nodeRef)&&(frag!=_6b7["tagName"])){
comps=comps.concat(this.createComponents(frag,_6b8));
}
}
return comps;
};
this.parsePropertySets=function(_6bb){
return [];
var _6bc=[];
for(var item in _6bb){
if((_6bb[item]["tagName"]=="dojo:propertyset")){
_6bc.push(_6bb[item]);
}
}
this.propertySetsList.push(_6bc);
return _6bc;
};
this.parseProperties=function(_6be){
var _6bf={};
for(var item in _6be){
if((_6be[item]==_6be["tagName"])||(_6be[item]==_6be.nodeRef)){
}else{
if((_6be[item]["tagName"])&&(dojo.widget.tags[_6be[item].tagName.toLowerCase()])){
}else{
if((_6be[item][0])&&(_6be[item][0].value!="")&&(_6be[item][0].value!=null)){
try{
if(item.toLowerCase()=="dataprovider"){
var _6c1=this;
this.getDataProvider(_6c1,_6be[item][0].value);
_6bf.dataProvider=this.dataProvider;
}
_6bf[item]=_6be[item][0].value;
var _6c2=this.parseProperties(_6be[item]);
for(var _6c3 in _6c2){
_6bf[_6c3]=_6c2[_6c3];
}
}
catch(e){
dojo.debug(e);
}
}
}
}
}
return _6bf;
};
this.getDataProvider=function(_6c4,_6c5){
dojo.io.bind({url:_6c5,load:function(type,_6c7){
if(type=="load"){
_6c4.dataProvider=_6c7;
}
},mimetype:"text/javascript",sync:true});
};
this.getPropertySetById=function(_6c8){
for(var x=0;x<this.propertySetsList.length;x++){
if(_6c8==this.propertySetsList[x]["id"][0].value){
return this.propertySetsList[x];
}
}
return "";
};
this.getPropertySetsByType=function(_6ca){
var _6cb=[];
for(var x=0;x<this.propertySetsList.length;x++){
var cpl=this.propertySetsList[x];
var cpcc=cpl["componentClass"]||cpl["componentType"]||null;
if((cpcc)&&(propertySetId==cpcc[0].value)){
_6cb.push(cpl);
}
}
return _6cb;
};
this.getPropertySets=function(_6cf){
var ppl="dojo:propertyproviderlist";
var _6d1=[];
var _6d2=_6cf["tagName"];
if(_6cf[ppl]){
var _6d3=_6cf[ppl].value.split(" ");
for(var _6d4 in _6d3){
if((_6d4.indexOf("..")==-1)&&(_6d4.indexOf("://")==-1)){
var _6d5=this.getPropertySetById(_6d4);
if(_6d5!=""){
_6d1.push(_6d5);
}
}else{
}
}
}
return (this.getPropertySetsByType(_6d2)).concat(_6d1);
};
this.createComponentFromScript=function(_6d6,_6d7,_6d8){
var ltn="dojo:"+_6d7.toLowerCase();
if(dojo.widget.tags[ltn]){
_6d8.fastMixIn=true;
return [dojo.widget.tags[ltn](_6d8,this,null,null,_6d8)];
}else{
if(ltn.substr(0,5)=="dojo:"){
dojo.debug("no tag handler registed for type: ",ltn);
}
}
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
dojo.widget.createWidget=function(name,_6dc,_6dd,_6de){
var _6df=name.toLowerCase();
var _6e0="dojo:"+_6df;
var _6e1=(dojo.byId(name)&&(!dojo.widget.tags[_6e0]));
if((arguments.length==1)&&((typeof name!="string")||(_6e1))){
var xp=new dojo.xml.Parse();
var tn=(_6e1)?dojo.byId(name):name;
return dojo.widget.getParser().createComponents(xp.parseElement(tn,null,true))[0];
}
function fromScript(_6e4,name,_6e6){
_6e6[_6e0]={dojotype:[{value:_6df}],nodeRef:_6e4,fastMixIn:true};
return dojo.widget.getParser().createComponentFromScript(_6e4,name,_6e6,true);
}
if(typeof name!="string"&&typeof _6dc=="string"){
dojo.deprecated("dojo.widget.createWidget","argument order is now of the form "+"dojo.widget.createWidget(NAME, [PROPERTIES, [REFERENCENODE, [POSITION]]])","0.4");
return fromScript(name,_6dc,_6dd);
}
_6dc=_6dc||{};
var _6e7=false;
var tn=null;
var h=dojo.render.html.capable;
if(h){
tn=document.createElement("span");
}
if(!_6dd){
_6e7=true;
_6dd=tn;
if(h){
document.body.appendChild(_6dd);
}
}else{
if(_6de){
dojo.dom.insertAtPosition(tn,_6dd,_6de);
}else{
tn=_6dd;
}
}
var _6e9=fromScript(tn,name,_6dc);
if(!_6e9||!_6e9[0]||typeof _6e9[0].widgetType=="undefined"){
throw new Error("createWidget: Creation of \""+name+"\" widget failed.");
}
if(_6e7){
if(_6e9[0].domNode.parentNode){
_6e9[0].domNode.parentNode.removeChild(_6e9[0].domNode);
}
}
return _6e9[0];
};
dojo.widget.fromScript=function(name,_6eb,_6ec,_6ed){
dojo.deprecated("dojo.widget.fromScript"," use "+"dojo.widget.createWidget instead","0.4");
return dojo.widget.createWidget(name,_6eb,_6ec,_6ed);
};
dojo.kwCompoundRequire({common:["dojo.uri.Uri",false,false]});
dojo.provide("dojo.uri.*");
dojo.provide("dojo.widget.DomWidget");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.Widget");
dojo.require("dojo.dom");
dojo.require("dojo.xml.Parse");
dojo.require("dojo.uri.*");
dojo.require("dojo.lang.func");
dojo.require("dojo.lang.extras");
dojo.widget._cssFiles={};
dojo.widget._cssStrings={};
dojo.widget._templateCache={};
dojo.widget.defaultStrings={dojoRoot:dojo.hostenv.getBaseScriptUri(),baseScriptUri:dojo.hostenv.getBaseScriptUri()};
dojo.widget.buildFromTemplate=function(){
dojo.lang.forward("fillFromTemplateCache");
};
dojo.widget.fillFromTemplateCache=function(obj,_6ef,_6f0,_6f1,_6f2){
var _6f3=_6ef||obj.templatePath;
var _6f4=_6f0||obj.templateCssPath;
if(_6f3&&!(_6f3 instanceof dojo.uri.Uri)){
_6f3=dojo.uri.dojoUri(_6f3);
dojo.deprecated("templatePath should be of type dojo.uri.Uri",null,"0.4");
}
if(_6f4&&!(_6f4 instanceof dojo.uri.Uri)){
_6f4=dojo.uri.dojoUri(_6f4);
dojo.deprecated("templateCssPath should be of type dojo.uri.Uri",null,"0.4");
}
var _6f5=dojo.widget._templateCache;
if(!obj["widgetType"]){
do{
var _6f6="__dummyTemplate__"+dojo.widget._templateCache.dummyCount++;
}while(_6f5[_6f6]);
obj.widgetType=_6f6;
}
var wt=obj.widgetType;
if(_6f4&&!dojo.widget._cssFiles[_6f4.toString()]){
if((!obj.templateCssString)&&(_6f4)){
obj.templateCssString=dojo.hostenv.getText(_6f4);
obj.templateCssPath=null;
}
if((obj["templateCssString"])&&(!obj.templateCssString["loaded"])){
dojo.style.insertCssText(obj.templateCssString,null,_6f4);
if(!obj.templateCssString){
obj.templateCssString="";
}
obj.templateCssString.loaded=true;
}
dojo.widget._cssFiles[_6f4.toString()]=true;
}
var ts=_6f5[wt];
if(!ts){
_6f5[wt]={"string":null,"node":null};
if(_6f2){
ts={};
}else{
ts=_6f5[wt];
}
}
if((!obj.templateString)&&(!_6f2)){
obj.templateString=_6f1||ts["string"];
}
if((!obj.templateNode)&&(!_6f2)){
obj.templateNode=ts["node"];
}
if((!obj.templateNode)&&(!obj.templateString)&&(_6f3)){
var _6f9=dojo.hostenv.getText(_6f3);
if(_6f9){
_6f9=_6f9.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,"");
var _6fa=_6f9.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_6fa){
_6f9=_6fa[1];
}
}else{
_6f9="";
}
obj.templateString=_6f9;
if(!_6f2){
_6f5[wt]["string"]=_6f9;
}
}
if((!ts["string"])&&(!_6f2)){
ts.string=obj.templateString;
}
};
dojo.widget._templateCache.dummyCount=0;
dojo.widget.attachProperties=["dojoAttachPoint","id"];
dojo.widget.eventAttachProperty="dojoAttachEvent";
dojo.widget.onBuildProperty="dojoOnBuild";
dojo.widget.waiNames=["waiRole","waiState"];
dojo.widget.wai={waiRole:{name:"waiRole",namespace:"http://www.w3.org/TR/xhtml2",alias:"x2",prefix:"wairole:",nsName:"role"},waiState:{name:"waiState",namespace:"http://www.w3.org/2005/07/aaa",alias:"aaa",prefix:"",nsName:"state"},setAttr:function(node,attr,_6fd){
if(dojo.render.html.ie){
node.setAttribute(this[attr].alias+":"+this[attr].nsName,this[attr].prefix+_6fd);
}else{
node.setAttributeNS(this[attr].namespace,this[attr].nsName,this[attr].prefix+_6fd);
}
}};
dojo.widget.attachTemplateNodes=function(_6fe,_6ff,_700){
var _701=dojo.dom.ELEMENT_NODE;
function trim(str){
return str.replace(/^\s+|\s+$/g,"");
}
if(!_6fe){
_6fe=_6ff.domNode;
}
if(_6fe.nodeType!=_701){
return;
}
var _703=_6fe.all||_6fe.getElementsByTagName("*");
var _704=_6ff;
for(var x=-1;x<_703.length;x++){
var _706=(x==-1)?_6fe:_703[x];
var _707=[];
for(var y=0;y<this.attachProperties.length;y++){
var _709=_706.getAttribute(this.attachProperties[y]);
if(_709){
_707=_709.split(";");
for(var z=0;z<_707.length;z++){
if(dojo.lang.isArray(_6ff[_707[z]])){
_6ff[_707[z]].push(_706);
}else{
_6ff[_707[z]]=_706;
}
}
break;
}
}
var _70b=_706.getAttribute(this.templateProperty);
if(_70b){
_6ff[_70b]=_706;
}
dojo.lang.forEach(dojo.widget.waiNames,function(name){
var wai=dojo.widget.wai[name];
var val=_706.getAttribute(wai.name);
if(val){
dojo.widget.wai.setAttr(_706,wai.name,val);
}
},this);
var _70f=_706.getAttribute(this.eventAttachProperty);
if(_70f){
var evts=_70f.split(";");
for(var y=0;y<evts.length;y++){
if((!evts[y])||(!evts[y].length)){
continue;
}
var _711=null;
var tevt=trim(evts[y]);
if(evts[y].indexOf(":")>=0){
var _713=tevt.split(":");
tevt=trim(_713[0]);
_711=trim(_713[1]);
}
if(!_711){
_711=tevt;
}
var tf=function(){
var ntf=new String(_711);
return function(evt){
if(_704[ntf]){
_704[ntf](dojo.event.browser.fixEvent(evt,this));
}
};
}();
dojo.event.browser.addListener(_706,tevt,tf,false,true);
}
}
for(var y=0;y<_700.length;y++){
var _717=_706.getAttribute(_700[y]);
if((_717)&&(_717.length)){
var _711=null;
var _718=_700[y].substr(4);
_711=trim(_717);
var _719=[_711];
if(_711.indexOf(";")>=0){
_719=dojo.lang.map(_711.split(";"),trim);
}
for(var z=0;z<_719.length;z++){
if(!_719[z].length){
continue;
}
var tf=function(){
var ntf=new String(_719[z]);
return function(evt){
if(_704[ntf]){
_704[ntf](dojo.event.browser.fixEvent(evt,this));
}
};
}();
dojo.event.browser.addListener(_706,_718,tf,false,true);
}
}
}
var _71c=_706.getAttribute(this.onBuildProperty);
if(_71c){
eval("var node = baseNode; var widget = targetObj; "+_71c);
}
}
};
dojo.widget.getDojoEventsFromStr=function(str){
var re=/(dojoOn([a-z]+)(\s?))=/gi;
var evts=str?str.match(re)||[]:[];
var ret=[];
var lem={};
for(var x=0;x<evts.length;x++){
if(evts[x].legth<1){
continue;
}
var cm=evts[x].replace(/\s/,"");
cm=(cm.slice(0,cm.length-1));
if(!lem[cm]){
lem[cm]=true;
ret.push(cm);
}
}
return ret;
};
dojo.declare("dojo.widget.DomWidget",dojo.widget.Widget,{initializer:function(){
if((arguments.length>0)&&(typeof arguments[0]=="object")){
this.create(arguments[0]);
}
},templateNode:null,templateString:null,templateCssString:null,preventClobber:false,domNode:null,containerNode:null,addChild:function(_724,_725,pos,ref,_728){
if(!this.isContainer){
dojo.debug("dojo.widget.DomWidget.addChild() attempted on non-container widget");
return null;
}else{
this.addWidgetAsDirectChild(_724,_725,pos,ref,_728);
this.registerChild(_724,_728);
}
return _724;
},addWidgetAsDirectChild:function(_729,_72a,pos,ref,_72d){
if((!this.containerNode)&&(!_72a)){
this.containerNode=this.domNode;
}
var cn=(_72a)?_72a:this.containerNode;
if(!pos){
pos="after";
}
if(!ref){
if(!cn){
cn=document.body;
}
ref=cn.lastChild;
}
if(!_72d){
_72d=0;
}
_729.domNode.setAttribute("dojoinsertionindex",_72d);
if(!ref){
cn.appendChild(_729.domNode);
}else{
if(pos=="insertAtIndex"){
dojo.dom.insertAtIndex(_729.domNode,ref.parentNode,_72d);
}else{
if((pos=="after")&&(ref===cn.lastChild)){
cn.appendChild(_729.domNode);
}else{
dojo.dom.insertAtPosition(_729.domNode,cn,pos);
}
}
}
},registerChild:function(_72f,_730){
_72f.dojoInsertionIndex=_730;
var idx=-1;
for(var i=0;i<this.children.length;i++){
if(this.children[i].dojoInsertionIndex<_730){
idx=i;
}
}
this.children.splice(idx+1,0,_72f);
_72f.parent=this;
_72f.addedTo(this);
delete dojo.widget.manager.topWidgets[_72f.widgetId];
},removeChild:function(_733){
dojo.dom.removeNode(_733.domNode);
return dojo.widget.DomWidget.superclass.removeChild.call(this,_733);
},getFragNodeRef:function(frag){
if(!frag||!frag["dojo:"+this.widgetType.toLowerCase()]){
dojo.raise("Error: no frag for widget type "+this.widgetType+", id "+this.widgetId+" (maybe a widget has set it's type incorrectly)");
}
return (frag?frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"]:null);
},postInitialize:function(args,frag,_737){
var _738=this.getFragNodeRef(frag);
if(_737&&(_737.snarfChildDomOutput||!_738)){
_737.addWidgetAsDirectChild(this,"","insertAtIndex","",args["dojoinsertionindex"],_738);
}else{
if(_738){
if(this.domNode&&(this.domNode!==_738)){
var _739=_738.parentNode.replaceChild(this.domNode,_738);
}
}
}
if(_737){
_737.registerChild(this,args.dojoinsertionindex);
}else{
dojo.widget.manager.topWidgets[this.widgetId]=this;
}
if(this.isContainer){
var _73a=dojo.widget.getParser();
_73a.createSubComponents(frag,this);
}
},buildRendering:function(args,frag){
var ts=dojo.widget._templateCache[this.widgetType];
if((!this.preventClobber)&&((this.templatePath)||(this.templateNode)||((this["templateString"])&&(this.templateString.length))||((typeof ts!="undefined")&&((ts["string"])||(ts["node"]))))){
this.buildFromTemplate(args,frag);
}else{
this.domNode=this.getFragNodeRef(frag);
}
this.fillInTemplate(args,frag);
},buildFromTemplate:function(args,frag){
var _740=false;
if(args["templatecsspath"]){
args["templateCssPath"]=args["templatecsspath"];
}
if(args["templatepath"]){
_740=true;
args["templatePath"]=args["templatepath"];
}
dojo.widget.fillFromTemplateCache(this,args["templatePath"],args["templateCssPath"],null,_740);
var ts=dojo.widget._templateCache[this.widgetType];
if((ts)&&(!_740)){
if(!this.templateString.length){
this.templateString=ts["string"];
}
if(!this.templateNode){
this.templateNode=ts["node"];
}
}
var _742=false;
var node=null;
var tstr=this.templateString;
if((!this.templateNode)&&(this.templateString)){
_742=this.templateString.match(/\$\{([^\}]+)\}/g);
if(_742){
var hash=this.strings||{};
for(var key in dojo.widget.defaultStrings){
if(dojo.lang.isUndefined(hash[key])){
hash[key]=dojo.widget.defaultStrings[key];
}
}
for(var i=0;i<_742.length;i++){
var key=_742[i];
key=key.substring(2,key.length-1);
var kval=(key.substring(0,5)=="this.")?dojo.lang.getObjPathValue(key.substring(5),this):hash[key];
var _749;
if((kval)||(dojo.lang.isString(kval))){
_749=(dojo.lang.isFunction(kval))?kval.call(this,key,this.templateString):kval;
tstr=tstr.replace(_742[i],_749);
}
}
}else{
this.templateNode=this.createNodesFromText(this.templateString,true)[0];
if(!_740){
ts.node=this.templateNode;
}
}
}
if((!this.templateNode)&&(!_742)){
dojo.debug("weren't able to create template!");
return false;
}else{
if(!_742){
node=this.templateNode.cloneNode(true);
if(!node){
return false;
}
}else{
node=this.createNodesFromText(tstr,true)[0];
}
}
this.domNode=node;
this.attachTemplateNodes(this.domNode,this);
if(this.isContainer&&this.containerNode){
var src=this.getFragNodeRef(frag);
if(src){
dojo.dom.moveChildren(src,this.containerNode);
}
}
},attachTemplateNodes:function(_74b,_74c){
if(!_74c){
_74c=this;
}
return dojo.widget.attachTemplateNodes(_74b,_74c,dojo.widget.getDojoEventsFromStr(this.templateString));
},fillInTemplate:function(){
},destroyRendering:function(){
try{
delete this.domNode;
}
catch(e){
}
},cleanUp:function(){
},getContainerHeight:function(){
dojo.unimplemented("dojo.widget.DomWidget.getContainerHeight");
},getContainerWidth:function(){
dojo.unimplemented("dojo.widget.DomWidget.getContainerWidth");
},createNodesFromText:function(){
dojo.unimplemented("dojo.widget.DomWidget.createNodesFromText");
}});
dojo.provide("dojo.lfx.toggle");
dojo.require("dojo.lfx.*");
dojo.lfx.toggle.plain={show:function(node,_74e,_74f,_750){
dojo.style.show(node);
if(dojo.lang.isFunction(_750)){
_750();
}
},hide:function(node,_752,_753,_754){
dojo.style.hide(node);
if(dojo.lang.isFunction(_754)){
_754();
}
}};
dojo.lfx.toggle.fade={show:function(node,_756,_757,_758){
dojo.lfx.fadeShow(node,_756,_757,_758).play();
},hide:function(node,_75a,_75b,_75c){
dojo.lfx.fadeHide(node,_75a,_75b,_75c).play();
}};
dojo.lfx.toggle.wipe={show:function(node,_75e,_75f,_760){
dojo.lfx.wipeIn(node,_75e,_75f,_760).play();
},hide:function(node,_762,_763,_764){
dojo.lfx.wipeOut(node,_762,_763,_764).play();
}};
dojo.lfx.toggle.explode={show:function(node,_766,_767,_768,_769){
dojo.lfx.explode(_769||[0,0,0,0],node,_766,_767,_768).play();
},hide:function(node,_76b,_76c,_76d,_76e){
dojo.lfx.implode(node,_76e||[0,0,0,0],_76b,_76c,_76d).play();
}};
dojo.provide("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.html");
dojo.require("dojo.html.extras");
dojo.require("dojo.lang.extras");
dojo.require("dojo.lang.func");
dojo.require("dojo.lfx.toggle");
dojo.declare("dojo.widget.HtmlWidget",dojo.widget.DomWidget,{widgetType:"HtmlWidget",templateCssPath:null,templatePath:null,toggle:"plain",toggleDuration:150,animationInProgress:false,initialize:function(args,frag){
},postMixInProperties:function(args,frag){
this.toggleObj=dojo.lfx.toggle[this.toggle.toLowerCase()]||dojo.lfx.toggle.plain;
},getContainerHeight:function(){
dojo.unimplemented("dojo.widget.HtmlWidget.getContainerHeight");
},getContainerWidth:function(){
return this.parent.domNode.offsetWidth;
},setNativeHeight:function(_773){
var ch=this.getContainerHeight();
},createNodesFromText:function(txt,wrap){
return dojo.html.createNodesFromText(txt,wrap);
},destroyRendering:function(_777){
try{
if(!_777){
dojo.event.browser.clean(this.domNode);
}
this.domNode.parentNode.removeChild(this.domNode);
delete this.domNode;
}
catch(e){
}
},isShowing:function(){
return dojo.style.isShowing(this.domNode);
},toggleShowing:function(){
if(this.isHidden){
this.show();
}else{
this.hide();
}
},show:function(){
this.animationInProgress=true;
this.isHidden=false;
this.toggleObj.show(this.domNode,this.toggleDuration,null,dojo.lang.hitch(this,this.onShow),this.explodeSrc);
},onShow:function(){
this.animationInProgress=false;
this.checkSize();
},hide:function(){
this.animationInProgress=true;
this.isHidden=true;
this.toggleObj.hide(this.domNode,this.toggleDuration,null,dojo.lang.hitch(this,this.onHide),this.explodeSrc);
},onHide:function(){
this.animationInProgress=false;
},_isResized:function(w,h){
if(!this.isShowing()){
return false;
}
w=w||dojo.style.getOuterWidth(this.domNode);
h=h||dojo.style.getOuterHeight(this.domNode);
if(this.width==w&&this.height==h){
return false;
}
this.width=w;
this.height=h;
return true;
},checkSize:function(){
if(!this._isResized()){
return;
}
this.onResized();
},resizeTo:function(w,h){
if(!this._isResized(w,h)){
return;
}
dojo.style.setOuterWidth(this.domNode,w);
dojo.style.setOuterHeight(this.domNode,h);
this.onResized();
},resizeSoon:function(){
if(this.isShowing()){
dojo.lang.setTimeout(this,this.onResized,0);
}
},onResized:function(){
dojo.lang.forEach(this.children,function(_77c){
_77c.checkSize();
});
}});
dojo.kwCompoundRequire({common:["dojo.xml.Parse","dojo.widget.Widget","dojo.widget.Parse","dojo.widget.Manager"],browser:["dojo.widget.DomWidget","dojo.widget.HtmlWidget"],dashboard:["dojo.widget.DomWidget","dojo.widget.HtmlWidget"],svg:["dojo.widget.SvgWidget"],rhino:["dojo.widget.SwtWidget"]});
dojo.provide("dojo.widget.*");
dojo.provide("dojo.html.shadow");
dojo.require("dojo.lang");
dojo.require("dojo.uri");
dojo.html.shadow=function(node){
this.init(node);
};
dojo.lang.extend(dojo.html.shadow,{shadowPng:dojo.uri.dojoUri("/hyperscope/src/client/images/shadow"),shadowThickness:8,shadowOffset:15,init:function(node){
this.node=node;
this.pieces={};
var x1=-1*this.shadowThickness;
var y0=this.shadowOffset;
var y1=this.shadowOffset+this.shadowThickness;
this._makePiece("tl","top",y0,"left",x1);
this._makePiece("l","top",y1,"left",x1,"scale");
this._makePiece("tr","top",y0,"left",0);
this._makePiece("r","top",y1,"left",0,"scale");
this._makePiece("bl","top",0,"left",x1);
this._makePiece("b","top",0,"left",0,"crop");
this._makePiece("br","top",0,"left",0);
},_makePiece:function(name,_783,_784,_785,_786,_787){
var img;
var url=this.shadowPng+name.toUpperCase()+".png";
if(dojo.render.html.ie){
img=document.createElement("div");
img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+url+"'"+(_787?", sizingMethod='"+_787+"'":"")+")";
}else{
img=document.createElement("img");
img.src=url;
}
img.style.position="absolute";
img.style[_783]=_784+"px";
img.style[_785]=_786+"px";
img.style.width=this.shadowThickness+"px";
img.style.height=this.shadowThickness+"px";
this.pieces[name]=img;
this.node.appendChild(img);
},size:function(_78a,_78b){
var _78c=_78b-(this.shadowOffset+this.shadowThickness+1);
with(this.pieces){
l.style.height=_78c+"px";
r.style.height=_78c+"px";
b.style.width=(_78a-1)+"px";
bl.style.top=(_78b-1)+"px";
b.style.top=(_78b-1)+"px";
br.style.top=(_78b-1)+"px";
tr.style.left=(_78a-1)+"px";
r.style.left=(_78a-1)+"px";
br.style.left=(_78a-1)+"px";
}
}});
dojo.provide("dojo.html.layout");
dojo.require("dojo.lang");
dojo.require("dojo.string");
dojo.require("dojo.style");
dojo.require("dojo.html");
dojo.html.layout=function(_78d,_78e,_78f){
dojo.html.addClass(_78d,"dojoLayoutContainer");
_78e=dojo.lang.filter(_78e,function(_790,idx){
_790.idx=idx;
return dojo.lang.inArray(["top","bottom","left","right","client","flood"],_790.layoutAlign);
});
if(_78f&&_78f!="none"){
var rank=function(_793){
switch(_793.layoutAlign){
case "flood":
return 1;
case "left":
case "right":
return (_78f=="left-right")?2:3;
case "top":
case "bottom":
return (_78f=="left-right")?3:2;
default:
return 4;
}
};
_78e.sort(function(a,b){
return (rank(a)-rank(b))||(a.idx-b.idx);
});
}
var f={top:dojo.style.getPixelValue(_78d,"padding-top",true),left:dojo.style.getPixelValue(_78d,"padding-left",true),height:dojo.style.getContentHeight(_78d),width:dojo.style.getContentWidth(_78d)};
dojo.lang.forEach(_78e,function(_797){
var elm=_797.domNode;
var pos=_797.layoutAlign;
with(elm.style){
left=f.left+"px";
top=f.top+"px";
bottom="auto";
right="auto";
}
dojo.html.addClass(elm,"dojoAlign"+dojo.string.capitalize(pos));
if((pos=="top")||(pos=="bottom")){
dojo.style.setOuterWidth(elm,f.width);
var h=dojo.style.getOuterHeight(elm);
f.height-=h;
if(pos=="top"){
f.top+=h;
}else{
elm.style.top=f.top+f.height+"px";
}
}else{
if(pos=="left"||pos=="right"){
dojo.style.setOuterHeight(elm,f.height);
var w=dojo.style.getOuterWidth(elm);
f.width-=w;
if(pos=="left"){
f.left+=w;
}else{
elm.style.left=f.left+f.width+"px";
}
}else{
if(pos=="flood"||pos=="client"){
dojo.style.setOuterWidth(elm,f.width);
dojo.style.setOuterHeight(elm,f.height);
}
}
}
if(_797.onResized){
_797.onResized();
}
});
};
dojo.style.insertCssText(".dojoLayoutContainer{ position: relative; display: block; }\n"+"body .dojoAlignTop, body .dojoAlignBottom, body .dojoAlignLeft, body .dojoAlignRight { position: absolute; overflow: hidden; }\n"+"body .dojoAlignClient { position: absolute }\n"+".dojoAlignClient { overflow: auto; }\n");
dojo.provide("dojo.widget.ContentPane");
dojo.provide("dojo.widget.html.ContentPane");
dojo.require("dojo.widget.*");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.ContentPane");
dojo.require("dojo.string");
dojo.require("dojo.string.extras");
dojo.require("dojo.style");
dojo.widget.html.ContentPane=function(){
this._onLoadStack=[];
this._onUnLoadStack=[];
dojo.widget.HtmlWidget.call(this);
};
dojo.inherits(dojo.widget.html.ContentPane,dojo.widget.HtmlWidget);
dojo.lang.extend(dojo.widget.html.ContentPane,{widgetType:"ContentPane",isContainer:true,adjustPaths:true,href:"",extractContent:true,parseContent:true,cacheContent:true,preload:false,refreshOnShow:false,handler:"",executeScripts:false,scriptScope:null,_remoteStyles:null,_callOnUnLoad:false,postCreate:function(args,frag,_79e){
if(this.handler!=""){
this.setHandler(this.handler);
}
if(this.isShowing()||this.preload){
this.loadContents();
}
},show:function(){
if(this.refreshOnShow){
this.refresh();
}else{
this.loadContents();
}
dojo.widget.html.ContentPane.superclass.show.call(this);
},refresh:function(){
this.isLoaded=false;
this.loadContents();
},loadContents:function(){
if(this.isLoaded){
return;
}
this.isLoaded=true;
if(dojo.lang.isFunction(this.handler)){
this._runHandler();
}else{
if(this.href!=""){
this._downloadExternalContent(this.href,this.cacheContent);
}
}
},setUrl:function(url){
this.href=url;
this.isLoaded=false;
if(this.preload||this.isShowing()){
this.loadContents();
}
},_downloadExternalContent:function(url,_7a1){
this._handleDefaults("Loading...","onDownloadStart");
var self=this;
dojo.io.bind({url:url,useCache:_7a1,preventCache:!_7a1,mimetype:"text/html",handler:function(type,data,e){
if(type=="load"){
self.onDownloadEnd.call(self,url,data);
}else{
self._handleDefaults.call(self,"Error loading '"+url+"' ("+e.status+" "+e.statusText+")","onDownloadError");
self.onLoad();
}
}});
},onLoad:function(e){
this._runStack("_onLoadStack");
},onUnLoad:function(e){
this._runStack("_onUnLoadStack");
this.scriptScope=null;
},_runStack:function(_7a8){
var st=this[_7a8];
var err="";
for(var i=0;i<st.length;i++){
try{
st[i].call(this.scriptScope);
}
catch(e){
err+="\n"+st[i]+" failed: "+e.description;
}
}
this[_7a8]=[];
if(err.length){
var name=(_7a8=="_onLoadStack")?"addOnLoad":"addOnUnLoad";
this._handleDefaults(name+" failure\n "+err,"onExecError",true);
}
},addOnLoad:function(obj,func){
this._pushOnStack(this._onLoadStack,obj,func);
},addOnUnLoad:function(obj,func){
this._pushOnStack(this._onUnLoadStack,obj,func);
},_pushOnStack:function(_7b1,obj,func){
if(typeof func=="undefined"){
_7b1.push(obj);
}else{
_7b1.push(function(){
obj[func]();
});
}
},destroy:function(){
this.onUnLoad();
dojo.widget.html.ContentPane.superclass.destroy.call(this);
},onExecError:function(e){
},onContentError:function(e){
},onDownloadError:function(e){
},onDownloadStart:function(e){
},onDownloadEnd:function(url,data){
data=this.splitAndFixPaths(data,url);
this.setContent(data);
},_handleDefaults:function(e,_7bb,_7bc){
if(!_7bb){
_7bb="onContentError";
}
if(dojo.lang.isString(e)){
e={"text":e,"toString":function(){
return this.text;
}};
}
if(typeof e.returnValue!="boolean"){
e.returnValue=true;
}
if(typeof e.preventDefault!="function"){
e.preventDefault=function(){
this.returnValue=false;
};
}
this[_7bb](e);
if(e.returnValue){
if(_7bc){
alert(e.toString());
}else{
if(this._callOnUnLoad){
this.onUnLoad();
}
this._callOnUnLoad=false;
this._setContent(e.toString());
}
}
},splitAndFixPaths:function(s,url){
if(!url){
url="./";
}
if(!s){
return "";
}
var _7bf=[];
var _7c0=[];
var _7c1=[];
var _7c2=[];
var _7c3=[];
var _7c4=[];
var _7c5=[];
while(_7c5){
_7c5=s.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
if(!_7c5){
break;
}
_7bf.push(_7c5[1]);
s=s.replace(/<title[^>]*>[\s\S]*?<\/title>/i,"");
}
var _7c5=[];
while(_7c5){
_7c5=s.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
if(!_7c5){
break;
}
_7c2.push(dojo.style.fixPathsInCssText(_7c5[1],url));
s=s.replace(/<style[^>]*?>[\s\S]*?<\/style>/i,"");
}
var pos=0;
var pos2=0;
var stop=0;
var str="";
var _7ca="";
var attr=[];
var fix="";
var _7cd="";
var tag="";
var _7cf="";
while(pos>-1){
pos=s.search(/<[a-z][a-z0-9]*[^>]*\s(?:(?:src|href|style)=[^>])+[^>]*>/i);
if(pos==-1){
break;
}
str+=s.substring(0,pos);
s=s.substring(pos,s.length);
tag=s.match(/^<[a-z][a-z0-9]*[^>]*>/i)[0];
s=s.substring(tag.length,s.length);
pos2=0;
_7cd="";
fix="";
_7cf="";
var _7d0=0;
while(pos2!=-1){
_7cd+=tag.substring(0,pos2)+fix;
tag=tag.substring(pos2+_7d0,tag.length);
attr=tag.match(/ (src|href|style)=(['"]?)([\w()\[\]\/.,\\'"-:;#=&?\s@]+?)\2/i);
if(!attr){
break;
}
switch(attr[1].toLowerCase()){
case "src":
case "href":
if(attr[3].search(/^(?:[#]|(?:(?:https?|ftps?|file|javascript|mailto|news):))/)==-1){
_7ca=(new dojo.uri.Uri(url,attr[3]).toString());
}else{
pos2=pos2+attr[3].length;
continue;
}
break;
case "style":
_7ca=dojo.style.fixPathsInCssText(attr[3],url);
break;
default:
pos2=pos2+attr[3].length;
continue;
}
_7cf=" "+attr[1]+"="+attr[2]+attr[3]+attr[2];
_7d0=_7cf.length;
fix=" "+attr[1]+"="+attr[2]+_7ca+attr[2];
pos2=tag.search(new RegExp(dojo.string.escapeRegExp(_7cf)));
}
str+=_7cd+tag;
pos=0;
}
s=str+s;
_7c5=[];
var tmp=[];
while(_7c5){
_7c5=s.match(/<script([^>]*)>([\s\S]*?)<\/script>/i);
if(!_7c5){
break;
}
if(_7c5[1]){
attr=_7c5[1].match(/src=(['"]?)([^"']*)\1/i);
if(attr){
var tmp=attr[2].search(/.*(\bdojo\b(?:\.uncompressed)?\.js)$/);
if(tmp>-1){
dojo.debug("Security note! inhibit:"+attr[2]+" from  beeing loaded again.");
}else{
_7c3.push(attr[2]);
}
}
}
if(_7c5[2]){
var sc=_7c5[2].replace(/(?:var )?\bdjConfig\b(?:[\s]*=[\s]*\{[^}]+\}|\.[\w]*[\s]*=[\s]*[^;\n]*)?;?|dojo\.hostenv\.writeIncludes\(\s*\);?/g,"");
if(!sc){
continue;
}
tmp=[];
while(tmp&&_7c4.length<100){
tmp=sc.match(/dojo\.(?:(?:require(?:After)?(?:If)?)|(?:widget\.(?:manager\.)?registerWidgetPackage)|(?:(?:hostenv\.)?setModulePrefix))\((['"]).*?\1\)\s*;?/);
if(!tmp){
break;
}
_7c4.push(tmp[0]);
sc=sc.replace(tmp[0],"");
}
_7c0.push(sc);
}
s=s.replace(/<script[^>]*>[\s\S]*?<\/script>/i,"");
}
if(this.executeScripts){
var _7cf=/(<[a-zA-Z][a-zA-Z0-9]*\s[^>]*\S=(['"])[^>]*[^\.\]])scriptScope([^>]*>)/;
var pos=0;
var str="";
_7c5=[];
var cit="";
while(pos>-1){
pos=s.search(_7cf);
if(pos>-1){
cit=((RegExp.$2=="'")?"\"":"'");
str+=s.substring(0,pos);
s=s.substr(pos).replace(_7cf,"$1dojo.widget.byId("+cit+this.widgetId+cit+").scriptScope$3");
}
}
s=str+s;
}
_7c5=[];
while(_7c5){
_7c5=s.match(/<link ([^>]*rel=['"]?stylesheet['"]?[^>]*)>/i);
if(!_7c5){
break;
}
attr=_7c5[1].match(/href=(['"]?)([^'">]*)\1/i);
if(attr){
_7c1.push(attr[2]);
}
s=s.replace(new RegExp(_7c5[0]),"");
}
return {"xml":s,"styles":_7c2,"linkStyles":_7c1,"titles":_7bf,"requires":_7c4,"scripts":_7c0,"remoteScripts":_7c3,"url":url};
},_setContent:function(xml){
this.destroyChildren();
if(this._remoteStyles){
for(var i=0;i<this._remoteStyles.length;i++){
if(this._remoteStyles[i]&&this._remoteStyles.parentNode){
this._remoteStyles[i].parentNode.removeChild(this._remoteStyles[i]);
}
}
this._remoteStyles=null;
}
var node=this.containerNode||this.domNode;
try{
if(typeof xml!="string"){
node.innerHTML="";
node.appendChild(xml);
}else{
node.innerHTML=xml;
}
}
catch(e){
e="Could'nt load content:"+e;
this._handleDefaults(e,"onContentError");
}
},setContent:function(data){
if(this._callOnUnLoad){
this.onUnLoad();
}
this._callOnUnLoad=true;
if(!data||dojo.dom.isNode(data)){
this._setContent(data);
this.onResized();
this.onLoad();
}else{
if((!data.xml)&&(this.adjustPaths)){
data=this.splitAndFixPaths(data);
}
if(this.extractContent){
var _7d8=data.xml.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_7d8){
data.xml=_7d8[1];
}
}
for(var i=0;i<data.styles.length;i++){
if(i==0){
this._remoteStyles=[];
}
this._remoteStyles.push(dojo.style.insertCssText(data.styles[i]));
}
for(var i=0;i<data.linkStyles.length;i++){
if(i==0){
this._remoteStyles=[];
}
this._remoteStyles.push(dojo.style.insertCssFile(data.linkStyles[i]));
}
this._setContent(data.xml);
if(this.parseContent){
for(var i=0;i<data.requires.length;i++){
try{
eval(data.requires[i]);
}
catch(e){
this._handleDefaults(e,"onContentError",true);
}
}
}
var _7da=this;
function asyncParse(){
if(_7da.executeScripts){
_7da._executeScripts(data);
}
if(_7da.parseContent){
var node=_7da.containerNode||_7da.domNode;
var _7dc=new dojo.xml.Parse();
var frag=_7dc.parseElement(node,null,true);
dojo.widget.getParser().createSubComponents(frag,_7da);
}
_7da.onResized();
_7da.onLoad();
}
if(dojo.hostenv.isXDomain&&data.requires.length){
dojo.addOnLoad(asyncParse);
}else{
asyncParse();
}
}
},setHandler:function(_7de){
var fcn=dojo.lang.isFunction(_7de)?_7de:window[_7de];
if(!dojo.lang.isFunction(fcn)){
this._handleDefaults("Unable to set handler, '"+_7de+"' not a function.","onExecError",true);
return;
}
this.handler=function(){
return fcn.apply(this,arguments);
};
},_runHandler:function(){
if(dojo.lang.isFunction(this.handler)){
this.handler(this,this.domNode);
return false;
}
return true;
},_executeScripts:function(data){
var self=this;
for(var i=0;i<data.remoteScripts.length;i++){
dojo.io.bind({"url":data.remoteScripts[i],"useCash":this.cacheContent,"load":function(type,_7e4){
dojo.lang.hitch(self,data.scripts.push(_7e4));
},"error":function(type,_7e6){
self._handleDefaults.call(self,type+" downloading remote script","onExecError",true);
},"mimetype":"text/plain","sync":true});
}
var _7e7="";
for(var i=0;i<data.scripts.length;i++){
_7e7+=data.scripts[i];
}
try{
this.scriptScope=null;
this.scriptScope=new (new Function("_container_",_7e7+"; return this;"))(self);
}
catch(e){
this._handleDefaults("Error running scripts from content:\n"+e,"onExecError",true);
}
}});
dojo.widget.tags.addParseTreeHandler("dojo:ContentPane");
dojo.provide("dojo.dnd.HtmlDragMove");
dojo.provide("dojo.dnd.HtmlDragMoveSource");
dojo.provide("dojo.dnd.HtmlDragMoveObject");
dojo.require("dojo.dnd.*");
dojo.dnd.HtmlDragMoveSource=function(node,type){
dojo.dnd.HtmlDragSource.call(this,node,type);
};
dojo.inherits(dojo.dnd.HtmlDragMoveSource,dojo.dnd.HtmlDragSource);
dojo.lang.extend(dojo.dnd.HtmlDragMoveSource,{onDragStart:function(){
var _7ea=new dojo.dnd.HtmlDragMoveObject(this.dragObject,this.type);
if(this.constrainToContainer){
_7ea.constrainTo(this.constrainingContainer);
}
return _7ea;
},onSelected:function(){
for(var i=0;i<this.dragObjects.length;i++){
dojo.dnd.dragManager.selectedSources.push(new dojo.dnd.HtmlDragMoveSource(this.dragObjects[i]));
}
}});
dojo.dnd.HtmlDragMoveObject=function(node,type){
dojo.dnd.HtmlDragObject.call(this,node,type);
};
dojo.inherits(dojo.dnd.HtmlDragMoveObject,dojo.dnd.HtmlDragObject);
dojo.lang.extend(dojo.dnd.HtmlDragMoveObject,{onDragEnd:function(e){
dojo.event.connect(this.domNode,"onclick",this,"squelchOnClick");
},onDragStart:function(e){
dojo.html.clearSelection();
this.dragClone=this.domNode;
this.scrollOffset=dojo.html.getScrollOffset();
this.dragStartPosition=dojo.style.getAbsolutePosition(this.domNode,true);
this.dragOffset={y:this.dragStartPosition.y-e.pageY,x:this.dragStartPosition.x-e.pageX};
this.containingBlockPosition=this.domNode.offsetParent?dojo.style.getAbsolutePosition(this.domNode.offsetParent,true):{x:0,y:0};
this.dragClone.style.position="absolute";
if(this.constrainToContainer){
this.constraints=this.getConstraints();
}
},setAbsolutePosition:function(x,y){
if(!this.disableY){
this.domNode.style.top=(y-this.containingBlockPosition.y)+"px";
}
if(!this.disableX){
this.domNode.style.left=(x-this.containingBlockPosition.x)+"px";
}
}});
dojo.provide("dojo.widget.ResizeHandle");
dojo.provide("dojo.widget.html.ResizeHandle");
dojo.require("dojo.widget.*");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.event");
dojo.widget.html.ResizeHandle=function(){
dojo.widget.HtmlWidget.call(this);
};
dojo.inherits(dojo.widget.html.ResizeHandle,dojo.widget.HtmlWidget);
dojo.lang.extend(dojo.widget.html.ResizeHandle,{widgetType:"ResizeHandle",isSizing:false,startPoint:null,startSize:null,minSize:null,targetElmId:"",templateCssString:".dojoHtmlResizeHandle {\n	float: right;\n	position: absolute;\n	right: 2px;\n	bottom: 2px;\n	width: 13px;\n	height: 13px;\n	z-index: 20;\n	cursor: nw-resize;\n	background-image: url(grabCorner.gif);\n	line-height: 0px;\n}",templateCssPath:dojo.uri.dojoUri("src/widget/templates/HtmlResizeHandle.css"),templateString:"<div class=\"dojoHtmlResizeHandle\"><div></div></div>",postCreate:function(){
dojo.event.connect(this.domNode,"onmousedown",this,"beginSizing");
},beginSizing:function(e){
if(this.isSizing){
return false;
}
this.targetWidget=dojo.widget.byId(this.targetElmId);
this.targetDomNode=this.targetWidget?this.targetWidget.domNode:dojo.byId(this.targetElmId);
if(!this.targetDomNode){
return;
}
this.isSizing=true;
this.startPoint={"x":e.clientX,"y":e.clientY};
this.startSize={"w":dojo.style.getOuterWidth(this.targetDomNode),"h":dojo.style.getOuterHeight(this.targetDomNode)};
dojo.event.kwConnect({srcObj:document.body,srcFunc:"onmousemove",targetObj:this,targetFunc:"changeSizing",rate:25});
dojo.event.connect(document.body,"onmouseup",this,"endSizing");
e.preventDefault();
},changeSizing:function(e){
try{
if(!e.clientX||!e.clientY){
return;
}
}
catch(e){
return;
}
var dx=this.startPoint.x-e.clientX;
var dy=this.startPoint.y-e.clientY;
var newW=this.startSize.w-dx;
var newH=this.startSize.h-dy;
if(this.minSize){
if(newW<this.minSize.w){
newW=dojo.style.getOuterWidth(this.targetDomNode);
}
if(newH<this.minSize.h){
newH=dojo.style.getOuterHeight(this.targetDomNode);
}
}
if(this.targetWidget){
this.targetWidget.resizeTo(newW,newH);
}else{
dojo.style.setOuterWidth(this.targetDomNode,newW);
dojo.style.setOuterHeight(this.targetDomNode,newH);
}
e.preventDefault();
},endSizing:function(e){
dojo.event.disconnect(document.body,"onmousemove",this,"changeSizing");
dojo.event.disconnect(document.body,"onmouseup",this,"endSizing");
this.isSizing=false;
}});
dojo.widget.tags.addParseTreeHandler("dojo:ResizeHandle");
dojo.provide("dojo.widget.FloatingPane");
dojo.provide("dojo.widget.html.FloatingPane");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.html");
dojo.require("dojo.html.shadow");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.html.layout");
dojo.require("dojo.widget.ContentPane");
dojo.require("dojo.dnd.HtmlDragMove");
dojo.require("dojo.dnd.HtmlDragMoveSource");
dojo.require("dojo.dnd.HtmlDragMoveObject");
dojo.require("dojo.widget.ResizeHandle");
dojo.widget.html.FloatingPane=function(){
dojo.widget.html.ContentPane.call(this);
};
dojo.inherits(dojo.widget.html.FloatingPane,dojo.widget.html.ContentPane);
dojo.lang.extend(dojo.widget.html.FloatingPane,{widgetType:"FloatingPane",title:"",iconSrc:"",hasShadow:false,constrainToContainer:false,taskBarId:"",resizable:true,titleBarDisplay:"fancy",windowState:"normal",displayCloseAction:false,displayMinimizeAction:false,displayMaximizeAction:false,maxTaskBarConnectAttempts:5,taskBarConnectAttempts:0,templateString:"<div id=\"${this.widgetId}\" class=\"dojoFloatingPane\">\n	<div dojoAttachPoint=\"titleBar\" class=\"dojoFloatingPaneTitleBar\"  dojoAttachEvent=\"onMouseDown\" style=\"display:none\">\n	  	<img dojoAttachPoint=\"titleBarIcon\"  class=\"dojoFloatingPaneTitleBarIcon\">\n		<div dojoAttachPoint=\"closeAction\" dojoAttachEvent=\"onClick:closeWindow\"\n   	  		class=\"dojoFloatingPaneCloseIcon\"></div>\n		<div dojoAttachPoint=\"restoreAction\" dojoAttachEvent=\"onClick:restoreWindow\"\n   	  		class=\"dojoFloatingPaneRestoreIcon\"></div>\n		<div dojoAttachPoint=\"maximizeAction\" dojoAttachEvent=\"onClick:maximizeWindow\"\n   	  		class=\"dojoFloatingPaneMaximizeIcon\"></div>\n		<div dojoAttachPoint=\"minimizeAction\" dojoAttachEvent=\"onClick:minimizeWindow\"\n   	  		class=\"dojoFloatingPaneMinimizeIcon\"></div>\n	  	<div dojoAttachPoint=\"titleBarText\" class=\"dojoFloatingPaneTitleText\">${this.title}</div>\n	</div>\n\n	<div id=\"${this.widgetId}_container\" dojoAttachPoint=\"containerNode\" class=\"dojoFloatingPaneClient\"></div>\n\n	<div dojoAttachPoint=\"resizeBar\" class=\"dojoFloatingPaneResizebar\" style=\"display:none\"></div>\n</div>",templateCssString:"\n/********** Outer Window ***************/\n\n.dojoFloatingPane {\n	/* essential css */\n	position: absolute;\n	overflow: visible;		/* so drop shadow is displayed */\n	z-index: 10;\n\n	/* styling css */\n	border: 1px solid;\n	border-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\n	background-color: ThreeDFace;\n}\n\n\n/********** Title Bar ****************/\n\n.dojoFloatingPaneTitleBar {\n	vertical-align: top;\n	margin: 2px 2px 2px 2px;\n	z-index: 10;\n	background-color: #7596c6;\n	cursor: default;\n	overflow: hidden;\n	border-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\n	vertical-align: middle;\n}\n\n.dojoFloatingPaneTitleText {\n	float: left;\n	padding: 2px 4px 2px 2px;\n	white-space: nowrap;\n	color: CaptionText;\n	font: small-caption;\n}\n\n.dojoTitleBarIcon {\n	float: left;\n	height: 22px;\n	width: 22px;\n	vertical-align: middle;\n	margin-right: 5px;\n	margin-left: 5px;\n}\n\n.dojoFloatingPaneActions{\n	float: right;\n	position: absolute;\n	right: 2px;\n	top: 2px;\n	vertical-align: middle;\n}\n\n\n.dojoFloatingPaneActionItem {\n	vertical-align: middle;\n	margin-right: 1px;\n	height: 22px;\n	width: 22px;\n}\n\n\n.dojoFloatingPaneTitleBarIcon {\n	/* essential css */\n	float: left;\n\n	/* styling css */\n	margin-left: 2px;\n	margin-right: 4px;\n	height: 22px;\n}\n\n/* minimize/maximize icons are specified by CSS only */\n.dojoFloatingPaneMinimizeIcon,\n.dojoFloatingPaneMaximizeIcon,\n.dojoFloatingPaneRestoreIcon,\n.dojoFloatingPaneCloseIcon {\n	vertical-align: middle;\n	height: 22px;\n	width: 22px;\n	float: right;\n}\n.dojoFloatingPaneMinimizeIcon {\n	background-image: url(images/floatingPaneMinimize.gif);\n}\n.dojoFloatingPaneMaximizeIcon {\n	background-image: url(images/floatingPaneMaximize.gif);\n}\n.dojoFloatingPaneRestoreIcon {\n	background-image: url(images/floatingPaneRestore.gif);\n}\n.dojoFloatingPaneCloseIcon {\n	background-image: url(/hyperscope/src/client/images/floatingPaneClose.gif);\n}\n\n/* bar at bottom of window that holds resize handle */\n.dojoFloatingPaneResizebar {\n	z-index: 10;\n	height: 13px;\n	background-color: ThreeDFace;\n}\n\n/************* Client Area ***************/\n\n.dojoFloatingPaneClient {\n	position: relative;\n	z-index: 10;\n	border: 1px solid;\n	border-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;\n	margin: 2px;\n	background-color: ThreeDFace;\n	padding: 8px;\n	font-family: Verdana, Helvetica, Garamond, sans-serif;\n	font-size: 12px;\n	overflow: auto;\n}\n\n",templateCssPath:dojo.uri.dojoUri("src/widget/templates/HtmlFloatingPane.css"),drag:null,fillInTemplate:function(args,frag){
var _7fb=this.getFragNodeRef(frag);
dojo.html.copyStyle(this.domNode,_7fb);
document.body.appendChild(this.domNode);
if(!this.isShowing()){
this.windowState="minimized";
}
if(this.iconSrc==""){
dojo.dom.removeNode(this.titleBarIcon);
}else{
this.titleBarIcon.src=this.iconSrc.toString();
}
if(this.titleBarDisplay!="none"){
this.titleBar.style.display="";
dojo.html.disableSelection(this.titleBar);
this.titleBarIcon.style.display=(this.iconSrc==""?"none":"");
this.minimizeAction.style.display=(this.displayMinimizeAction?"":"none");
this.maximizeAction.style.display=(this.displayMaximizeAction&&this.windowState!="maximized"?"":"none");
this.restoreAction.style.display=(this.displayMaximizeAction&&this.windowState=="maximized"?"":"none");
this.closeAction.style.display=(this.displayCloseAction?"":"none");
this.drag=new dojo.dnd.HtmlDragMoveSource(this.domNode);
if(this.constrainToContainer){
this.drag.constrainTo();
}
this.drag.setDragHandle(this.titleBar);
var self=this;
dojo.event.topic.subscribe("dragMove",function(info){
if(info.source.domNode==self.domNode){
dojo.event.topic.publish("floatingPaneMove",{source:self});
}
});
}
if(this.resizable){
this.resizeBar.style.display="";
var rh=dojo.widget.createWidget("ResizeHandle",{targetElmId:this.widgetId,id:this.widgetId+"_resize"});
this.resizeBar.appendChild(rh.domNode);
}
if(this.hasShadow){
this.shadow=new dojo.html.shadow(this.domNode);
}
this.bgIframe=new dojo.html.BackgroundIframe(this.domNode);
if(this.taskBarId){
this.taskBarSetup();
}
if(dojo.hostenv.post_load_){
this.setInitialWindowState();
}else{
dojo.addOnLoad(this,"setInitialWindowState");
}
document.body.removeChild(this.domNode);
dojo.widget.html.FloatingPane.superclass.fillInTemplate.call(this,args,frag);
},postCreate:function(){
if(this.isShowing()){
this.width=-1;
this.resizeTo(dojo.style.getOuterWidth(this.domNode),dojo.style.getOuterHeight(this.domNode));
}
},maximizeWindow:function(evt){
this.previous={width:dojo.style.getOuterWidth(this.domNode)||this.width,height:dojo.style.getOuterHeight(this.domNode)||this.height,left:this.domNode.style.left,top:this.domNode.style.top,bottom:this.domNode.style.bottom,right:this.domNode.style.right};
this.domNode.style.left=dojo.style.getPixelValue(this.domNode.parentNode,"padding-left",true)+"px";
this.domNode.style.top=dojo.style.getPixelValue(this.domNode.parentNode,"padding-top",true)+"px";
if((this.domNode.parentNode.nodeName.toLowerCase()=="body")){
this.resizeTo(dojo.html.getViewportWidth()-dojo.style.getPaddingWidth(document.body),dojo.html.getViewportHeight()-dojo.style.getPaddingHeight(document.body));
}else{
this.resizeTo(dojo.style.getContentWidth(this.domNode.parentNode),dojo.style.getContentHeight(this.domNode.parentNode));
}
this.maximizeAction.style.display="none";
this.restoreAction.style.display="";
this.windowState="maximized";
},minimizeWindow:function(evt){
this.hide();
this.windowState="minimized";
},restoreWindow:function(evt){
if(this.windowState=="minimized"){
this.show();
}else{
for(var attr in this.previous){
this.domNode.style[attr]=this.previous[attr];
}
this.resizeTo(this.previous.width,this.previous.height);
this.previous=null;
this.restoreAction.style.display="none";
this.maximizeAction.style.display=this.displayMaximizeAction?"":"none";
}
this.windowState="normal";
},closeWindow:function(evt){
dojo.dom.removeNode(this.domNode);
this.destroy();
},onMouseDown:function(evt){
this.bringToTop();
},bringToTop:function(){
var _805=dojo.widget.manager.getWidgetsByType(this.widgetType);
var _806=[];
for(var x=0;x<_805.length;x++){
if(this.widgetId!=_805[x].widgetId){
_806.push(_805[x]);
}
}
_806.sort(function(a,b){
return a.domNode.style.zIndex-b.domNode.style.zIndex;
});
_806.push(this);
var _80a=100;
for(x=0;x<_806.length;x++){
_806[x].domNode.style.zIndex=_80a+x;
}
},setInitialWindowState:function(){
if(this.windowState=="maximized"){
this.maximizeWindow();
this.show();
return;
}
if(this.windowState=="normal"){
this.show();
return;
}
if(this.windowState=="minimized"){
this.hide();
return;
}
this.windowState="minimized";
},taskBarSetup:function(){
var _80b=dojo.widget.getWidgetById(this.taskBarId);
if(!_80b){
if(this.taskBarConnectAttempts<this.maxTaskBarConnectAttempts){
dojo.lang.setTimeout(this,this.taskBarSetup,50);
this.taskBarConnectAttempts++;
}else{
dojo.debug("Unable to connect to the taskBar");
}
return;
}
_80b.addChild(this);
},show:function(){
dojo.widget.html.FloatingPane.superclass.show.apply(this,arguments);
this.bringToTop();
},onShow:function(){
dojo.widget.html.FloatingPane.superclass.onShow.call(this);
this.resizeTo(dojo.style.getOuterWidth(this.domNode),dojo.style.getOuterHeight(this.domNode));
},resizeTo:function(w,h){
dojo.style.setOuterWidth(this.domNode,w);
dojo.style.setOuterHeight(this.domNode,h);
dojo.html.layout(this.domNode,[{domNode:this.titleBar,layoutAlign:"top"},{domNode:this.resizeBar,layoutAlign:"bottom"},{domNode:this.containerNode,layoutAlign:"client"}]);
dojo.html.layout(this.containerNode,this.children,"top-bottom");
this.bgIframe.onResized();
if(this.shadow){
this.shadow.size(w,h);
}
this.onResized();
},checkSize:function(){
}});
dojo.widget.tags.addParseTreeHandler("dojo:FloatingPane");
dojo.provide("sarissa.core");
function Sarissa(){
}
Sarissa.PARSED_OK="Document contains no parsing errors";
Sarissa.PARSED_EMPTY="Document is empty";
Sarissa.PARSED_UNKNOWN_ERROR="Not well-formed or other error";
var _sarissa_iNsCounter=0;
var _SARISSA_IEPREFIX4XSLPARAM="";
var _SARISSA_HAS_DOM_IMPLEMENTATION=document.implementation&&true;
var _SARISSA_HAS_DOM_CREATE_DOCUMENT=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.createDocument;
var _SARISSA_HAS_DOM_FEATURE=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.hasFeature;
var _SARISSA_IS_MOZ=_SARISSA_HAS_DOM_CREATE_DOCUMENT&&_SARISSA_HAS_DOM_FEATURE;
var _SARISSA_IS_SAFARI=(navigator.userAgent&&navigator.vendor&&(navigator.userAgent.toLowerCase().indexOf("applewebkit")!=-1||navigator.vendor.indexOf("Apple")!=-1));
var _SARISSA_IS_IE=document.all&&window.ActiveXObject&&navigator.userAgent.toLowerCase().indexOf("msie")>-1&&navigator.userAgent.toLowerCase().indexOf("opera")==-1;
if(window&&(!window.Node||!window.Node.ELEMENT_NODE)){
window.Node={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
}
if(_SARISSA_IS_IE){
_SARISSA_IEPREFIX4XSLPARAM="xsl:";
var _SARISSA_DOM_PROGID="";
var _SARISSA_XMLHTTP_PROGID="";
var _SARISSA_DOM_XMLWRITER="";
Sarissa.pickRecentProgID=function(_80e){
var _80f=false;
for(var i=0;i<_80e.length&&!_80f;i++){
try{
var oDoc=new ActiveXObject(_80e[i]);
o2Store=_80e[i];
_80f=true;
}
catch(objException){
}
}
if(!_80f){
throw "Could not retreive a valid progID of Class: "+_80e[_80e.length-1]+". (original exception: "+e+")";
}
_80e=null;
return o2Store;
};
_SARISSA_DOM_PROGID=null;
_SARISSA_THREADEDDOM_PROGID=null;
_SARISSA_XSLTEMPLATE_PROGID=null;
_SARISSA_XMLHTTP_PROGID=null;
if(!window.XMLHttpRequest){
XMLHttpRequest=function(){
if(!_SARISSA_XMLHTTP_PROGID){
_SARISSA_XMLHTTP_PROGID=Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"]);
}
return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
};
}
Sarissa.getDomDocument=function(sUri,_813){
if(!_SARISSA_DOM_PROGID){
_SARISSA_DOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.DOMDocument.5.0","Msxml2.DOMDocument.4.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"]);
}
var oDoc=new ActiveXObject(_SARISSA_DOM_PROGID);
if(_813){
var _815="";
if(sUri){
if(_813.indexOf(":")>1){
_815=_813.substring(0,_813.indexOf(":"));
_813=_813.substring(_813.indexOf(":")+1);
}else{
_815="a"+(_sarissa_iNsCounter++);
}
}
if(sUri){
oDoc.loadXML("<"+_815+":"+_813+" xmlns:"+_815+"=\""+sUri+"\""+" />");
}else{
oDoc.loadXML("<"+_813+" />");
}
}
return oDoc;
};
Sarissa.getParseErrorText=function(oDoc){
var _817=Sarissa.PARSED_OK;
if(oDoc.parseError.errorCode!=0){
_817="XML Parsing Error: "+oDoc.parseError.reason+"\nLocation: "+oDoc.parseError.url+"\nLine Number "+oDoc.parseError.line+", Column "+oDoc.parseError.linepos+":\n"+oDoc.parseError.srcText+"\n";
for(var i=0;i<oDoc.parseError.linepos;i++){
_817+="-";
}
_817+="^\n";
}else{
if(oDoc.documentElement==null){
_817=Sarissa.PARSED_EMPTY;
}
}
return _817;
};
Sarissa.setXpathNamespaces=function(oDoc,_81a){
oDoc.setProperty("SelectionLanguage","XPath");
oDoc.setProperty("SelectionNamespaces",_81a);
};
XSLTProcessor=function(){
if(!_SARISSA_XSLTEMPLATE_PROGID){
_SARISSA_XSLTEMPLATE_PROGID=Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.5.0","Msxml2.XSLTemplate.4.0","MSXML2.XSLTemplate.3.0"]);
}
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(_81b){
if(!_SARISSA_THREADEDDOM_PROGID){
_SARISSA_THREADEDDOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.FreeThreadedDOMDocument.5.0","MSXML2.FreeThreadedDOMDocument.4.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
_SARISSA_DOM_XMLWRITER=Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.5.0","Msxml2.MXXMLWriter.4.0","Msxml2.MXXMLWriter.3.0","MSXML2.MXXMLWriter","MSXML.MXXMLWriter","Microsoft.XMLDOM"]);
}
var _81c=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
if(_81b.url){
_81c.async=false;
_81c.load(_81b.url);
}else{
_81c.loadXML(_81b.xml);
}
this.template.stylesheet=_81c;
this.processor=this.template.createProcessor();
this.paramsSet=new Array();
};
XSLTProcessor.prototype.transformToDocument=function(_81d){
this.processor.input=_81d;
var _81e=new ActiveXObject(_SARISSA_DOM_XMLWRITER);
this.processor.output=_81e;
this.processor.transform();
var oDoc=new ActiveXObject(_SARISSA_DOM_PROGID);
oDoc.loadXML(_81e.output+"");
return oDoc;
};
XSLTProcessor.prototype.setParameter=function(_820,name,_822){
if(_820){
this.processor.addParameter(name,_822,_820);
}else{
this.processor.addParameter(name,_822);
}
if(!this.paramsSet[""+_820]){
this.paramsSet[""+_820]=new Array();
}
this.paramsSet[""+_820][name]=_822;
};
XSLTProcessor.prototype.getParameter=function(_823,name){
_823=_823||"";
if(this.paramsSet[_823]&&this.paramsSet[_823][name]){
return this.paramsSet[_823][name];
}else{
return null;
}
};
}else{
if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(oDoc){
Sarissa.__setReadyState__(oDoc,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(oDoc,_827){
oDoc.readyState=_827;
oDoc.readystate=_827;
if(oDoc.onreadystatechange!=null&&typeof oDoc.onreadystatechange=="function"){
oDoc.onreadystatechange();
}
};
Sarissa.getDomDocument=function(sUri,_829){
var oDoc=document.implementation.createDocument(sUri?sUri:null,_829?_829:null,null);
if(!oDoc.onreadystatechange){
oDoc.onreadystatechange=null;
}
if(!oDoc.readyState){
oDoc.readyState=0;
}
oDoc.addEventListener("load",_sarissa_XMLDocument_onload,false);
return oDoc;
};
if(window.XMLDocument){
}else{
if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("LS","3.0")){
Sarissa.getDomDocument=function(sUri,_82c){
var oDoc=document.implementation.createDocument(sUri?sUri:null,_82c?_82c:null,null);
return oDoc;
};
}else{
Sarissa.getDomDocument=function(sUri,_82f){
var oDoc=document.implementation.createDocument(sUri?sUri:null,_82f?_82f:null,null);
if(oDoc&&(sUri||_82f)&&!oDoc.documentElement){
oDoc.appendChild(oDoc.createElementNS(sUri,_82f));
}
return oDoc;
};
}
}
}
}
if(!window.DOMParser){
if(_SARISSA_IS_SAFARI){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(sXml,_832){
var _833=new XMLHttpRequest();
_833.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(sXml),false);
_833.send(null);
return _833.responseXML;
};
}else{
if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&Sarissa.getDomDocument(null,"bar").xml){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(sXml,_835){
var doc=Sarissa.getDomDocument();
doc.loadXML(sXml);
return doc;
};
}
}
}else{
if(_SARISSA_IS_MOZ){
DOMParser.prototype.__parseFromString=DOMParser.prototype.parseFromString;
DOMParser.prototype.parseFromString=function(sXml,_838){
var _839=document.createElement("iframe");
_839.setAttribute("src","about:blank");
_839.style.position="absolute";
_839.style.top="-1000px";
_839.style.left="-1000px";
var body=document.body;
if(body==null||typeof body=="undefined"){
body=document.getElementsByTagName("body")[0];
}
if(body==null||typeof body=="undefined"){
var msg="Sarissa programming error: You must wait for the page "+"to fully load before using DOMParser.parseFromString "+"to fix Mozilla bug 323612; set an onload handler.";
throw msg;
}
body.appendChild(_839);
var doc=_839.contentDocument;
doc.__Sarissa_domXml__=sXml;
doc.location.href="javascript:(function(){"+" document.__Sarissa_domXml__ = new DOMParser().parseFromString(document.__Sarissa_domXml__, \"text/xml\"); "+"})()";
var _83d=doc.__Sarissa_domXml__;
_839.parentNode.removeChild(_839);
for(var i in XMLDocument.prototype){
try{
if(typeof _83d[i]=="undefined"){
_83d[i]=XMLDocument.prototype[i];
}
}
catch(e){
}
}
return _83d;
};
}
}
if(!window.document.importNode&&_SARISSA_IS_IE){
try{
window.document.importNode=function(_83f,_840){
var _841=document.createElement("div");
if(_840){
_841.innerHTML=new XMLSerializer().serializeToString(_83f);
}else{
_841.innerHTML=new XMLSerializer().serializeToString(_83f.cloneNode(false));
}
return _841.getElementsByTagName("*")[0];
};
}
catch(e){
}
}
if(!window.Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(oDoc){
var _843=Sarissa.PARSED_OK;
if(!oDoc.documentElement){
_843=Sarissa.PARSED_EMPTY;
}else{
if(oDoc.documentElement.tagName=="parsererror"){
_843=oDoc.documentElement.firstChild.data;
_843+="\n"+oDoc.documentElement.firstChild.nextSibling.firstChild.data;
}else{
if(oDoc.getElementsByTagName("parsererror").length>0){
var _844=oDoc.getElementsByTagName("parsererror")[0];
_843=Sarissa.getText(_844,true)+"\n";
}else{
if(oDoc.parseError&&oDoc.parseError.errorCode!=0){
_843=Sarissa.PARSED_UNKNOWN_ERROR;
}
}
}
}
return _843;
};
}
Sarissa.getText=function(_845,deep){
var s="";
var _848=_845.childNodes;
for(var i=0;i<_848.length;i++){
var node=_848[i];
var _84b=node.nodeType;
if(_84b==Node.TEXT_NODE||_84b==Node.CDATA_SECTION_NODE){
s+=node.data;
}else{
if(deep==true&&(_84b==Node.ELEMENT_NODE||_84b==Node.DOCUMENT_NODE||_84b==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(node,true);
}
}
}
return s;
};
if(!window.XMLSerializer&&Sarissa.getDomDocument&&Sarissa.getDomDocument("","foo",null).xml){
XMLSerializer=function(){
};
XMLSerializer.prototype.serializeToString=function(_84c){
return _84c.xml;
};
}
Sarissa.stripTags=function(s){
return s.replace(/<[^>]+>/g,"");
};
Sarissa.clearChildNodes=function(_84e){
while(_84e.firstChild){
_84e.removeChild(_84e.firstChild);
}
};
Sarissa.copyChildNodes=function(_84f,_850,_851){
if((!_84f)||(!_850)){
throw "Both source and destination nodes must be provided";
}
if(!_851){
Sarissa.clearChildNodes(_850);
}
var _852=_850.nodeType==Node.DOCUMENT_NODE?_850:_850.ownerDocument;
var _853=_84f.childNodes;
if(_852.importNode){
for(var i=0;i<_853.length;i++){
_850.appendChild(_852.importNode(_853[i],true));
}
}else{
for(var i=0;i<_853.length;i++){
_850.appendChild(_853[i].cloneNode(true));
}
}
};
Sarissa.moveChildNodes=function(_855,_856,_857){
if((!_855)||(!_856)){
throw "Both source and destination nodes must be provided";
}
if(!_857){
Sarissa.clearChildNodes(_856);
}
var _858=_855.childNodes;
if(_855.ownerDocument==_856.ownerDocument){
while(_855.firstChild){
_856.appendChild(_855.firstChild);
}
}else{
var _859=_856.nodeType==Node.DOCUMENT_NODE?_856:_856.ownerDocument;
if(_859.importNode){
for(var i=0;i<_858.length;i++){
_856.appendChild(_859.importNode(_858[i],true));
}
}else{
for(var i=0;i<_858.length;i++){
_856.appendChild(_858[i].cloneNode(true));
}
}
Sarissa.clearChildNodes(_855);
}
};
Sarissa.xmlize=function(_85b,_85c,_85d){
_85d=_85d?_85d:"";
var s=_85d+"<"+_85c+">";
var _85f=false;
if(!(_85b instanceof Object)||_85b instanceof Number||_85b instanceof String||_85b instanceof Boolean||_85b instanceof Date){
s+=Sarissa.escape(""+_85b);
_85f=true;
}else{
s+="\n";
var _860="";
var _861=_85b instanceof Array;
for(var name in _85b){
s+=Sarissa.xmlize(_85b[name],(_861?"array-item key=\""+name+"\"":name),_85d+"   ");
}
s+=_85d;
}
return s+=(_85c.indexOf(" ")!=-1?"</array-item>\n":"</"+_85c+">\n");
};
Sarissa.escape=function(sXml){
return sXml.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
};
Sarissa.unescape=function(sXml){
return sXml.replace(/&apos;/g,"'").replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
};
dojo.provide("sarissa.xpath");
if(_SARISSA_HAS_DOM_FEATURE&&document.implementation.hasFeature("XPath","3.0")){
function SarissaNodeList(i){
this.length=i;
}
SarissaNodeList.prototype=new Array(0);
SarissaNodeList.prototype.constructor=Array;
SarissaNodeList.prototype.item=function(i){
return (i<0||i>=this.length)?null:this[i];
};
SarissaNodeList.prototype.expr="";
XMLDocument.prototype.setProperty=function(x,y){
};
Sarissa.setXpathNamespaces=function(oDoc,_86a){
oDoc._sarissa_useCustomResolver=true;
var _86b=_86a.indexOf(" ")>-1?_86a.split(" "):new Array(_86a);
oDoc._sarissa_xpathNamespaces=new Array(_86b.length);
for(var i=0;i<_86b.length;i++){
var ns=_86b[i];
var _86e=ns.indexOf(":");
var _86f=ns.indexOf("=");
if(_86e==5&&_86f>_86e+2){
var _870=ns.substring(_86e+1,_86f);
var uri=ns.substring(_86f+2,ns.length-1);
oDoc._sarissa_xpathNamespaces[_870]=uri;
}else{
throw "Bad format on namespace declaration(s) given";
}
}
};
XMLDocument.prototype._sarissa_useCustomResolver=false;
XMLDocument.prototype._sarissa_xpathNamespaces=new Array();
XMLDocument.prototype.selectNodes=function(_872,_873){
var _874=this;
var _875=this._sarissa_useCustomResolver?function(_876){
var s=_874._sarissa_xpathNamespaces[_876];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_876+"'";
}
}:this.createNSResolver(this.documentElement);
var _878=this.evaluate(_872,(_873?_873:this),_875,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _879=new SarissaNodeList(_878.snapshotLength);
_879.expr=_872;
for(var i=0;i<_879.length;i++){
_879[i]=_878.snapshotItem(i);
}
return _879;
};
Element.prototype.selectNodes=function(_87b){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_87b,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_87d,_87e){
var ctx=_87e?_87e:null;
_87d="("+_87d+")[1]";
var _880=this.selectNodes(_87d,ctx);
if(_880.length>0){
return _880.item(0);
}else{
return null;
}
};
Element.prototype.selectSingleNode=function(_881){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_881,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
Sarissa.IS_ENABLED_SELECT_NODES=true;
}
dojo.provide("hs.exception");
hs.exception.Jump=function(_883,doc,_885){
this.message=_883;
this.doc=doc;
this.address=_885;
};
dojo.lang.extend(hs.exception.Jump,{message:null,doc:null,address:null,toString:function(){
return this.message;
}});
hs.exception.Filter=function(_886,doc,_888){
this.message=_886;
this.doc=doc;
this.address=_888;
};
dojo.lang.extend(hs.exception.Filter,{message:null,doc:null,address:null,toString:function(){
return this.message;
}});
hs.exception.InvalidAddress=function(_889,doc,_88b){
if(dojo.lang.isUndefined(doc)){
doc=null;
}
if(dojo.lang.isUndefined(_88b)){
_88b=null;
}
this.message=_889;
this.doc=doc;
this.address=_88b;
};
dojo.lang.extend(hs.exception.InvalidAddress,{message:null,doc:null,address:null,toString:function(){
return this.message;
}});
hs.exception.Render=function(_88c,doc,_88e){
this.message=_88c;
this.doc=doc;
this.address=_88e;
};
dojo.lang.extend(hs.exception.Render,{message:null,doc:null,address:null,toString:function(){
return this.message;
}});
dojo.provide("hs.filter");
dojo.require("dojo.dom");
dojo.require("dojo.string.*");
hs.filter.Filter={apply:function(doc,_890,_891){
dojo.raise("abstract interface method; please implement");
},isAsync:function(){
false;
}};
hs.filter.Normalizer=function(){
};
dojo.lang.mixin(hs.filter.Normalizer.prototype,hs.filter.Filter);
dojo.lang.extend(hs.filter.Normalizer,{_nodeCounter:0,apply:function(doc){
var dom=doc.dom;
var body=dom.selectNodes("/opml/body");
if(body==null||body.length==0){
throw new hs.exception.filter("Invalid OPML document, no outline nodes");
}
body=body[0];
var root=dom.selectNodes("/opml")[0];
dojo.dom.setAttributeNS(root,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":fake","false");
var _896;
if(dojo.dom.firstElement(body)==dojo.dom.lastElement(body)){
_896=0;
}else{
_896=1;
}
var _897=dojo.dom.firstElement(body);
this._applyMetadata(_896,_897,null);
doc._nodeCounter=this._nodeCounter;
},_applyMetadata:function(_898,_899,_89a){
if(_899==null||dojo.lang.isUndefined(_899)){
return;
}
var _89b=_899;
var _89c=1;
while(_89b!=null&&dojo.lang.isUndefined(_89b)==false){
this._nodeCounter++;
var _89d;
if(_898==0){
_89d="0";
}else{
_89d=new hs.address.NodeNumber.toNodeNumber(_89a,_89c);
_89d=_89d.number;
}
dojo.dom.setAttributeNS(_89b,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":level",_898);
dojo.dom.setAttributeNS(_89b,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number",_89d);
dojo.dom.setAttributeNS(_89b,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter",this._nodeCounter);
this._applyMetadata(_898+1,dojo.dom.firstElement(_89b),_89d);
_89b=dojo.dom.nextElement(_89b);
_89c++;
}
}});
hs.filter.CurrentViewspecs=function(_89e,_89f,_8a0){
if(dojo.lang.isUndefined(_8a0)){
_8a0=true;
}
if(_89f==null||dojo.lang.isUndefined(_89f)){
throw new hs.exception.Filter("Programming error: "+"no document for "+"hs.filter.CurrentViewspecs");
}
if(_89e==null||dojo.lang.isUndefined(_89e)){
_89e="";
}else{
if(dojo.lang.isString(_89e)&&dojo.string.trim(_89e)==""){
_89e="";
}else{
if(dojo.lang.isArray(_89e)&&_89e.length==0){
_89e="";
}
}
}
this._docCtxt=_89f;
if(dojo.lang.isString(_89e)){
var _8a1=new Array();
for(var i=0;i<_89e.length;i++){
var _8a3=_89e.charAt(i);
var view=new hs.address.Viewspec(_8a3);
_8a1.push(view);
}
_89e=_8a1;
}
if(_8a0==true){
for(var i=hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.length-1;i>=0;i--){
var _8a3=hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.charAt(i);
var view=new hs.address.Viewspec(_8a3);
_89e.splice(0,0,view);
}
}
this._lineClippping=hs.filter.ViewspecConstants.DEFAULT_LINE_CLIPPING;
this._levelClippping=hs.filter.ViewspecConstants.DEFAULT_LEVEL_CLIPPING;
for(var i=0;i<_89e.length;i++){
this.add(_89e[i]);
}
};
dojo.lang.mixin(hs.filter.CurrentViewspecs.prototype,hs.filter.Filter);
dojo.lang.extend(hs.filter.CurrentViewspecs,{_levelClipping:null,_lineClipping:null,_structureClippingType:null,_showBlankLines:null,_showNodeAddressing:null,_showNodeLabels:null,_showFrozenNodes:null,_showNodeSignatures:null,_showLevelClippingToContext:null,_nodeAddressingPlacement:null,_nodeAddressingType:null,_contentFilterType:null,_runSequenceGenerators:null,_docCtxt:null,apply:function(doc){
var xslt=doc.getRenderXSLT();
var _8a7=this.getLineClipping();
if(_8a7==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
_8a7="none";
}
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"lineClipping",_8a7);
var _8a8=this.getLevelClipping();
if(_8a8==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
_8a8="none";
}else{
if(_8a8==0){
_8a8="0";
}
}
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"levelClipping",_8a8);
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"show-node-labels",new Boolean(this.showNodeLabels()).toString());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"show-blank-lines",new Boolean(this.showBlankLines()).toString());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"show-node-addressing",new Boolean(this.showNodeAddressing()).toString());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"node-addressing-placement",this.getNodeAddressingPlacement());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"show-node-signatures",new Boolean(this.showNodeSignatures()).toString());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"show-frozen-nodes",new Boolean(this.showFrozenNodes()).toString());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"node-addressing-type",this.getNodeAddressingType());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"structure-clipping",this.getStructuralClippingType());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"content-filtering-type",this.getContentFilterType());
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"level-indenting-type",this.getLevelIndentingType());
if(this.getStructuralClippingType()==hs.filter.ViewspecConstants.PLEX_ONLY){
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"plex-parent-number",this._getPlexParentNumber(doc));
}
},toString:function(){
var _8a9=new String();
_8a9=this._writeLevelAndLineClipping(_8a9);
_8a9=this._writeStructuralClipping(_8a9);
_8a9=this._writeContentFiltering(_8a9);
_8a9=this._writeNodeMetadata(_8a9);
_8a9=this._writeNodeAppearance(_8a9);
_8a9=this._writeSequenceGenerators(_8a9);
_8a9=this._filterDefaultViewspecs(_8a9);
return _8a9;
},add:function(view){
if(view==null||dojo.lang.isUndefined(view)){
throw new hs.exception.Filter("Programming error: "+"null viewspec given to "+"hs.filter.CurrentViewspecs");
}
if(dojo.lang.isString(view)&&dojo.string.trim(view)==""){
throw new hs.exception.Filter("Programming error: "+"empty viewspec given to "+"hs.filter.CurrentViewspecs");
}
view=view.toString();
if(view.length>1){
throw new hs.exception.Filter("Programming error: "+"multiple viewspecs not allowed "+"in call to CurrentViewspecs.add(): "+view);
}
switch(view){
case "a":
if(this._levelClipping>0){
this._levelClipping--;
}
break;
case "b":
if(this._levelClipping<hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
this._levelClipping++;
}
break;
case "c":
this._levelClipping=hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
break;
case "d":
this._levelClipping=1;
break;
case "e":
var _8ab=this._docCtxt.nodeCtxt;
var _8ac=_8ab.level;
this._levelClipping=_8ac;
break;
case "f":
break;
case "g":
this._structuralClippingType=hs.filter.ViewspecConstants.BRANCH_ONLY;
break;
case "h":
this._structuralClippingType=hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING;
break;
case "i":
this._contentFilterType=hs.filter.ViewspecConstants.FILTER_ALL;
break;
case "j":
this._contentFilterType=hs.filter.ViewspecConstants.NO_FILTERING;
break;
case "k":
this._contentFilterType=hs.filter.ViewspecConstants.NEXT_FILTERED_NODE;
break;
case "l":
this._structuralClippingType=hs.filter.ViewspecConstants.PLEX_ONLY;
break;
case "m":
this._showNodeAddressing=true;
break;
case "n":
this._showNodeAddressing=false;
break;
case "o":
this._showFrozenNodes=true;
break;
case "p":
this._showFrozenNodes=false;
break;
case "q":
if(this._lineClipping>1){
this._lineClipping--;
}
break;
case "r":
if(this._lineClipping<hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this._lineClipping++;
}
break;
case "s":
this._lineClipping=hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
break;
case "t":
this._lineClipping=1;
break;
case "u":
break;
case "v":
break;
case "w":
this._lineClipping=hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
this._levelClipping=hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
break;
case "x":
this._lineClipping=1;
this._levelClipping=1;
break;
case "y":
this._showBlankLines=true;
break;
case "z":
this._showBlankLines=false;
break;
case "A":
this._levelIndentingType=hs.filter.ViewspecConstants.INDENT_ON;
break;
case "B":
this._levelIndentingType=hs.filter.ViewspecConstants.INDENT_OFF;
break;
case "C":
this._showNodeLabels=true;
break;
case "D":
this._showNodeLabels=false;
break;
case "E":
break;
case "F":
break;
case "G":
this._nodeAddressingPlacement=hs.filter.ViewspecConstants.RIGHT;
break;
case "H":
this._nodeAddressingPlacement=hs.filter.ViewspecConstants.LEFT;
break;
case "I":
this._nodeAddressingType=hs.filter.ViewspecConstants.SHOW_NODE_ID;
break;
case "J":
this._nodeAddressingType=hs.filter.ViewspecConstants.SHOW_NODE_NUMBER;
break;
case "K":
this._showNodeSignatures=true;
break;
case "L":
this._showNodeSignatures=false;
break;
case "O":
this._runSequenceGenerators=true;
break;
case "P":
this._runSequenceGenerators=false;
break;
case "Q":
this._levelIndentingType=hs.filter.ViewspecConstants.INDENT_TO_CONTENT;
break;
default:
throw new hs.exception.Filter("? "+view);
}
},getLevelClipping:function(){
return this._levelClipping;
},getLineClipping:function(){
return this._lineClipping;
},getStructuralClippingType:function(){
return this._structuralClippingType;
},showBlankLines:function(){
return this._showBlankLines;
},showNodeAddressing:function(){
return this._showNodeAddressing;
},getNodeAddressingPlacement:function(){
return this._nodeAddressingPlacement;
},getNodeAddressingType:function(){
return this._nodeAddressingType;
},showNodeLabels:function(){
return this._showNodeLabels;
},getContentFilterType:function(){
return this._contentFilterType;
},getLevelIndentingType:function(){
return this._levelIndentingType;
},showFrozenNodes:function(){
return this._showFrozenNodes;
},showNodeSignatures:function(){
return this._showNodeSignatures;
},runSequenceGenerators:function(){
return this._runSequenceGenerators;
},_writeLevelAndLineClipping:function(_8ad){
if(this._lineClipping==1&&this._levelClipping==1){
_8ad+="x";
}else{
if(this._lineClipping==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING&&this._levelClipping==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
_8ad+="w";
}else{
_8ad=this._writeLineClipping(_8ad);
_8ad=this._writeLevelClipping(_8ad);
}
}
return _8ad;
},_writeLineClipping:function(_8ae){
if(this._lineClipping==1){
_8ae+="t";
}else{
if(this._lineClipping==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
_8ae+="s";
}else{
var _8af=hs.filter.ViewspecConstants.MAX_LINE_CLIPPING-this._lineClipping;
if(_8af<=this._lineClipping){
_8ae+="s";
for(var i=_8af;i>0;i--){
_8ae+="q";
}
}else{
_8ae+="t";
for(var i=2;i<=this._lineClipping;i++){
_8ae+="r";
}
}
}
}
return _8ae;
},_writeLevelClipping:function(_8b1){
var _8b2=this._docCtxt.nodeCtxt.level;
if(this._levelClipping==1){
_8b1+="d";
}else{
if(this._levelClipping==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
_8b1+="c";
}else{
if(this._levelClipping==0){
_8b1+="da";
}else{
if(this._levelClipping>=(hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING-20)){
_8b1+="c";
var _8b3=hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING-this._levelClipping;
for(var i=_8b3;i>0;i--){
_8b1+="a";
}
}else{
if(_8b2!=0&&this._levelClipping>=_8b2){
_8b1+="e";
var _8b5=this._levelClipping-_8b2;
for(var i=1;i<=_8b5;i++){
_8b1+="b";
}
}else{
if(_8b2!=0&&this._levelClipping<_8b2){
var _8b6=_8b2-this._levelClipping;
if(_8b6>=this._levelClipping){
_8b1+="d";
for(var i=2;i<=this._levelClipping;i++){
_8b1+="b";
}
}else{
_8b1+="e";
for(var i=1;i<=_8b6;i++){
_8b1+="a";
}
}
}else{
if(_8b2==0){
_8b1+="da";
for(var i=1;i<=this._levelClipping;i++){
_8b1+="b";
}
}
}
}
}
}
}
}
return _8b1;
},_writeStructuralClipping:function(_8b7){
switch(this.getStructuralClippingType()){
case hs.filter.ViewspecConstants.BRANCH_ONLY:
_8b7+="g";
break;
case hs.filter.ViewspecConstants.PLEX_ONLY:
_8b7+="l";
break;
case hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING:
_8b7+="h";
break;
}
return _8b7;
},_writeContentFiltering:function(_8b8){
switch(this.getContentFilterType()){
case hs.filter.ViewspecConstants.NO_FILTERING:
_8b8+="j";
break;
case hs.filter.ViewspecConstants.FILTER_ALL:
_8b8+="i";
break;
case hs.filter.ViewspecConstants.NEXT_FILTERED_NODE:
_8b8+="k";
break;
}
return _8b8;
},_writeNodeMetadata:function(_8b9){
if(this.showNodeAddressing()==true){
_8b9+="m";
}else{
_8b9+="n";
}
if(this.showNodeLabels()==true){
_8b9+="C";
}else{
_8b9+="D";
}
if(this.showNodeSignatures()==true){
_8b9+="K";
}else{
_8b9+="L";
}
switch(this.getNodeAddressingPlacement()){
case hs.filter.ViewspecConstants.RIGHT:
_8b9+="G";
break;
case hs.filter.ViewspecConstants.LEFT:
_8b9+="H";
break;
}
switch(this.getNodeAddressingType()){
case hs.filter.ViewspecConstants.SHOW_NODE_ID:
_8b9+="I";
break;
case hs.filter.ViewspecConstants.SHOW_NODE_NUMBER:
_8b9+="J";
break;
}
return _8b9;
},_writeNodeAppearance:function(_8ba){
if(this.showFrozenNodes()==true){
_8ba+="o";
}else{
_8ba+="p";
}
if(this.showBlankLines()==true){
_8ba+="y";
}else{
_8ba+="z";
}
switch(this.getLevelIndentingType()){
case hs.filter.ViewspecConstants.INDENT_ON:
_8ba+="A";
break;
case hs.filter.ViewspecConstants.INDENT_OFF:
_8ba+="B";
break;
case hs.filter.ViewspecConstants.INDENT_TO_CONTENT:
_8ba+="Q";
break;
}
return _8ba;
},_writeSequenceGenerators:function(_8bb){
if(this.runSequenceGenerators()==true){
_8bb+="O";
}else{
_8bb+="P";
}
return _8bb;
},_filterDefaultViewspecs:function(_8bc){
for(var i=0;i<hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.length;i++){
var _8be=hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.charAt(i);
_8bc=_8bc.replace(_8be,"");
}
return _8bc;
},_getPlexParentNumber:function(doc){
var _8c0=doc.nodeCtxt.getParent();
if(_8c0==null){
return hs.filter.ViewspecConstants.NO_PLEX_PARENT;
}else{
return _8c0.number;
}
}});
hs.filter.ViewspecConstants={DEFAULT_VIEWSPECS:"hjnpuxyACHJLP",MAX_LEVEL_CLIPPING:63,MAX_LINE_CLIPPING:63,DEFAULT_LEVEL_CLIPPING:1,DEFAULT_LINE_CLIPPING:1,LEFT:"left",RIGHT:"right",SHOW_NODE_ID:"id",SHOW_NODE_NUMBER:"number",BRANCH_ONLY:"branch",PLEX_ONLY:"plex",NO_STRUCTURAL_CLIPPING:"none",NO_FILTERING:"none",FILTER_ALL:"all",NEXT_FILTERED_NODE:"next_node",INDENT_ON:"on",INDENT_OFF:"off",INDENT_TO_CONTENT:"to_context_node",NO_PLEX_PARENT:"none"};
hs.filter.Transcluder=function(_8c1){
this._parentAddress=_8c1;
};
dojo.lang.mixin(hs.filter.Transcluder.prototype,hs.filter.Filter);
hs.filter.Transcluder.INCLUDE_NODE="node";
hs.filter.Transcluder.INCLUDE_BRANCH="branch";
hs.filter.Transcluder.INCLUDE_PLEX="plex";
dojo.lang.extend(hs.filter.Transcluder,{metadataDirty:false,_totalInclusions:null,_finishedInclusions:0,_readyHandler:null,apply:function(doc,_8c3){
this._readyHandler=_8c3;
var _8c4=doc.dom.selectNodes("//outline[@type = 'include']");
if(_8c4==null||_8c4.length==0){
this._readyHandler.call(null,doc,null);
}
this._totalInclusions=_8c4.length;
for(var i=0;i<_8c4.length;i++){
var _8c6=new hs.model.Node(_8c4.item(i),doc);
this._executeInclude(_8c6,doc);
}
},isAsync:function(){
true;
},_executeInclude:function(_8c7,doc){
var url=_8c7.domNode.getAttribute("url");
var _8ca=_8c7.domNode.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX+":include-type");
if(_8ca==null||typeof _8ca=="undefined"||dojo.string.trim(_8ca)==""){
_8ca=hs.filter.Transcluder.INCLUDE_NODE;
}
var self=this;
var _8cc=function(_8cd,_8ce,_8cf){
self._finishedInclusions++;
if(_8cf!=null&&typeof _8cf!="undefined"){
_8c7.domNode.setAttribute("text","Include failed for url "+url+", error: "+_8cf.toString());
dojo.dom.setAttributeNS(_8c7.domNode,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":include-failed","yes");
}else{
self._importNodes(doc,_8ce,_8ca,_8c7,url);
}
if(self._finishedInclusions>=self._totalInclusions){
self._readyHandler.call(null,doc,null);
}
};
var addr;
try{
addr=new hs.address.Address(url);
}
catch(exp){
_8cc(null,null,exp);
return;
}
addr.resolve(_8cc,false,doc,true,this._parentAddress);
},_importNodes:function(_8d1,_8d2,_8d3,_8d4,url){
if(_8d3==hs.filter.Transcluder.INCLUDE_NODE){
this._includeSingleNode(_8d1,_8d2,_8d3,_8d4,url);
}else{
if(_8d3==hs.filter.Transcluder.INCLUDE_BRANCH){
this._includeBranch(_8d1,_8d2,_8d3,_8d4,url);
}else{
if(_8d3==hs.filter.Transcluder.INCLUDE_PLEX){
this._includePlex(_8d1,_8d2,_8d3,_8d4,url);
}
}
}
},_includeSingleNode:function(_8d6,_8d7,_8d8,_8d9,url){
var _8db=_8d7.nodeCtxt.domNode;
_8db=_8db.cloneNode(false);
dojo.dom.setAttributeNS(_8db,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":level",_8d9.level);
dojo.dom.setAttributeNS(_8db,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number",_8d9.number);
this._setIncluded(_8db,url,hs.filter.Transcluder.INCLUDE_NODE);
var _8dc=_8d9.domNode.parentNode;
var _8dd=_8d9.domNode;
_8dc.replaceChild(_8db,_8dd);
},_includeBranch:function(_8de,_8df,_8e0,_8e1,url){
var _8e3=_8df.nodeCtxt.domNode;
this._setIncluded(_8e3,url,hs.filter.Transcluder.INCLUDE_BRANCH);
_8e3=_8e3.cloneNode(true);
var _8e4=_8e1.domNode.parentNode;
var _8e5=_8e1.domNode;
_8e4.replaceChild(_8e3,_8e5);
this.metadataDirty=true;
},_includePlex:function(_8e6,_8e7,_8e8,_8e9,url){
var _8eb=_8e7.nodeCtxt.domNode;
var _8ec=_8eb;
while(_8ec.previousSibling!=null){
_8ec=_8ec.previousSibling;
}
while(_8ec.nextSibling!=null&&_8ec.nodeType!=dojo.dom.ELEMENT_NODE){
_8ec=_8ec.nextSibling;
}
_8eb=_8ec;
var _8ed=_8e9.domNode;
while(_8eb!=null){
if(_8eb.nodeType==dojo.dom.ELEMENT_NODE){
this._setIncluded(_8eb,url,hs.filter.Transcluder.INCLUDE_PLEX);
var _8ee=_8eb.cloneNode(true);
dojo.dom.insertAfter(_8ee,_8ed);
_8ed=_8ee;
}
_8eb=_8eb.nextSibling;
}
dojo.dom.removeNode(_8e9.domNode);
this.metadataDirty=true;
},_setIncluded:function(_8ef,url,_8f1){
var _8f2=new Array();
_8f2.push(_8ef);
while(_8f2.length>0){
var _8f3=_8f2.pop();
dojo.dom.setAttributeNS(_8f3,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":included","yes");
dojo.dom.setAttributeNS(_8f3,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":included-from",url);
dojo.dom.setAttributeNS(_8f3,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":included-type",_8f1);
_8f3.removeAttribute(hs.model.Document.HS_NAMESPACE_PREFIX+":nid");
var _8f4=_8f3.childNodes;
for(var i=_8f4.length;i>=0;i--){
if(_8f4[i]&&_8f4[i].nodeType==dojo.dom.ELEMENT_NODE){
_8f2.push(_8f4[i]);
}
}
}
}});
dojo.provide("hs.util");
dojo.require("dojo.string.*");
dojo.require("dojo.io.*");
dojo.require("dojo.dom");
dojo.require("sarissa.core");
hs.util.AddressSerializer=function(_8f6){
this.addr=_8f6;
};
dojo.lang.extend(hs.util.AddressSerializer,{addr:null,serialize:function(){
var s=new String();
var _8f8=this.addr.fileInfo;
s+=_8f8.toString();
if(this.addr.nodeAddresses.length>0||this.addr.viewspecs.length>0||this.addr.contentFilter!=null){
s+="#";
}
var _8f9=this.addr.nodeAddresses;
var _8fa=null;
for(var i=0;i<_8f9.length;i++){
var _8fc=_8f9[i];
var _8fd=true;
if(_8fa==null){
_8fd=false;
}
if(_8fa!=null){
if(_8fa.isPieceType("hs.address.Relative")||_8fa.isPieceType("hs.address.IndirectLink")){
if(_8fc.isPieceType("hs.address.Relative")||_8fc.isPieceType("hs.address.IndirectLink")){
_8fd=false;
}
}
if(_8fa.isPieceType("hs.address.StringPosition")==true&&_8fc.isPieceType("hs.address.StringPosition")){
_8fd=false;
}
}
if(_8fd==true){
s+=" ";
}
if(_8fc.isPieceType("hs.address.Relative")||_8fc.isPieceType("hs.address.IndirectLink")){
if(_8fa==null||(_8fa.isPieceType("hs.address.Relative")==false&&_8fa.isPieceType("hs.address.IndirectLink")==false)){
s+=".";
}
s+=_8fc.toString();
}else{
if(_8fc.isPieceType("hs.address.Marker")){
s+="@"+_8fc.toString();
}else{
if(_8fc.isPieceType("hs.address.NodeLabel")){
switch(_8fc.type){
case hs.address.NodeLabel.BRANCH_SEARCH:
s+="!";
break;
case hs.address.NodeLabel.MOVE_TO_NEXT:
s+="*";
break;
case hs.address.NodeLabel.EXTERNAL:
s+="$";
break;
}
s+=_8fc.toString();
}else{
if(_8fc.isPieceType("hs.address.NodeNumber")){
if(_8fc.isOffset){
s+="!";
}
s+=_8fc.toString();
}else{
s+=_8fc.toString();
}
}
}
}
_8fa=_8fc;
}
var _8fe=this.addr.viewspecs;
if(_8fe.length>0){
s+=":";
}
for(var i=0;i<_8fe.length;i++){
var v=_8fe[i];
s+=v.toString();
}
var _900=this.addr.contentFilter;
if(_900!=null){
s+=";"+_900.toString()+";";
}
return s;
}});
hs.util.AddressTokenizer=function(url){
this._url=url;
this._parse(url);
};
dojo.lang.extend(hs.util.AddressTokenizer,{_pieces:new Array(),_url:null,_nodeTypes:[{regexp:/^\s*(0\d+)/,parseFunc:"_parseNodeID"},{regexp:/^\s*((?:0(?![0-9]+))|(?:\!?[1-9]+[a-z0-9]*))/i,parseFunc:"_parseNodeNumber"},{regexp:/^\s*((?:\!|\*|\$)?[a-z]+[a-z0-9_\-]*)/i,parseFunc:"_parseNodeLabel"},{regexp:/^\s*(\@[a-z]+[a-z0-9_\-]*)/i,parseFunc:"_parseMarker"},{regexp:/^\s*(\.[1-9]?[0-9nbudoelhtspcrf]?[0-9nbudoelhtspcrf]*)/,parseFunc:"_parseRelativeAndIndirect"},{regexp:/^\s*((?:\"|\/)(?:\\\"|\\\/|\\\:|\\\;|[^\"\/])*(?:\"|\/)[a-z]*)/i,parseFunc:"_parseStringSearch"},{regexp:/^\s*((?:\+|\-)[1-9]?[0-9wcvilef]?[\+\-0-9wcvilef]*)/,parseFunc:"_parseStringPosition"}],hasNext:function(){
return (this._pieces.length>0);
},next:function(){
if(this.hasNext()){
return this._pieces.shift();
}else{
return null;
}
},_parse:function(url){
var _903=new hs.address.FileInfo(url);
this._pieces.push(_903);
var _904=this._getAnchor(url);
if(_904==null){
return;
}
var _905=this._getNodeAddressStr(_904);
if(_905!=null&&_905!=""){
var _906=_904.indexOf(_905);
_906=_906+_905.length;
_904=_904.substring(_906);
}
var _907=this._getViewspecsStr(_904);
if(_907!=null&&_907!=""){
var _906=_904.indexOf(_907);
_906=_906+_907.length;
_904=_904.substring(_906);
}
var _908=this._getContentFilterStr(_904);
this._parseNodeAddress(_905);
this._parseViewspecs(_907);
this._parseContentFilter(_908);
},_getAnchor:function(url){
if(dojo.lang.isUndefined(url)||url==null||url.indexOf("#")==-1){
return null;
}
var m=url.match(/[^#]*#(.*)/);
if(m==null||m[1]==null||m[1]==""){
return;
}
var _90b=m[1];
_90b=decodeURIComponent(_90b);
return _90b;
},_getNodeAddressStr:function(_90c){
var _90d=_90c.match(/^((?:\\\;|\\\:|[^\;\:])*)/);
var _90e=new String();
if(_90d!=null&&_90d.length==2){
_90e=_90d[1];
}
return _90e;
},_getViewspecsStr:function(_90f){
var end=null;
for(var i=0;i<_90f.length;i++){
if(_90f.charAt(i)==";"){
end=i;
break;
}
}
if(end==null){
end=_90f.length;
}
var _912=_90f.substring(0,end);
return _912;
},_getContentFilterStr:function(_913){
var _914=_913.match(/\s*(\;\s*(?:\\\;|[^\;])*\s*\;)\s*$/);
var _915=new String();
if(_914!=null&&_914.length==2){
_915=_914[1];
}
return _915;
},_parseNodeAddress:function(_916){
_916=dojo.string.trim(_916);
if(_916==""){
return;
}
var _917=null;
while(_916.length!=0){
var _918=null;
for(var i=0;i<this._nodeTypes.length;i++){
var _91a=this._nodeTypes[i];
if(_91a.regexp.test(_916)==true){
_918=_91a;
break;
}
}
if(_918==null){
throw new hs.exception.InvalidAddress("? "+_916);
}
var m=_916.match(_918.regexp);
if(m==null||dojo.lang.isUndefined(m)||m.length==1){
throw new hs.exception.InvalidAddress("? "+_916);
}
var _91c=m[1];
_91c=_91c.replace(/\\/g,"\\\\");
_91c=_91c.replace(/\'/g,"\\'");
var _91d="this."+_918.parseFunc+"('"+_91c+"')";
eval(_91d);
_916=_916.replace(_918.regexp,"");
}
},_parseViewspecs:function(str){
str=dojo.string.trim(str);
if(str==""){
return;
}
str=str.substring(1);
var _91f=/^\s*([a-zA-Q])/;
while(str.length!=0){
var _920=str.match(_91f);
if(_920==null||dojo.lang.isUndefined(_920)||_920.length==1||_920[1]==""||_920[1]==null){
throw new hs.exception.InvalidAddress("? "+str);
}
var _921=_920[1];
var p=new hs.address.Viewspec(_921);
this._pieces.push(p);
str=str.replace(_91f,"");
}
},_parseContentFilter:function(str){
str=dojo.string.trim(str);
if(str==""){
return;
}
if(str.charAt(0)!=";"&&str.charAt(str.length-1)!=";"){
throw new hs.exception.InvalidAddress("? "+str);
}
str=str.substring(1);
str=str.substring(0,str.length-1);
if(str.charAt(0)!="\""&&str.charAt(0)!="/"){
throw new hs.exception.InvalidAddress("? "+str);
}
if(/\"|\/|[a-z]$/i.test(str)==false){
throw new hs.exception.InvalidAddress("? "+str);
}
var p=new hs.address.ContentFilter(str);
this._pieces.push(p);
},_parseNodeID:function(str){
str=dojo.string.trim(str);
var p=new hs.address.NodeID(str);
this._pieces.push(p);
},_parseNodeNumber:function(str){
str=dojo.string.trim(str);
var _928=false;
if(dojo.string.startsWith(str,"!")){
str=str.substring(1);
_928=true;
}
var p=new hs.address.NodeNumber(str,_928);
this._pieces.push(p);
},_parseNodeLabel:function(str){
str=dojo.string.trim(str);
var _92b;
if(dojo.string.startsWith(str,"!")){
_92b=hs.address.NodeLabel.BRANCH_SEARCH;
str=str.substring(1);
}else{
if(dojo.string.startsWith(str,"*")){
_92b=hs.address.NodeLabel.MOVE_TO_NEXT;
str=str.substring(1);
}else{
if(dojo.string.startsWith(str,"$")){
_92b=hs.address.NodeLabel.EXTERNAL;
str=str.substring(1);
}else{
_92b=hs.address.NodeLabel.START_AT_FIRST;
}
}
}
var p=new hs.address.NodeLabel(str,_92b);
this._pieces.push(p);
},_parseMarker:function(str){
str=dojo.string.trim(str);
str=str.substring(1);
var p=new hs.address.Marker(str);
this._pieces.push(p);
},_parseRelativeAndIndirect:function(str){
str=dojo.string.trim(str);
str=str.substring(1);
var _930=/^(\d*)([nbudoehtspcrl]f?)/;
while(str.length!=0){
var _931=str.match(_930);
if(_931==null||dojo.lang.isUndefined(_931)||_931.length==1||_931[2]==""||_931[2]==null){
throw new hs.exception.InvalidAddress("? "+str);
}
var _932=_931[2];
var _933=_931[1];
if(_933==""||_933==null||dojo.lang.isUndefined(_933)){
_933=1;
}
_933=new Number(_933).valueOf();
if(_933==Number.NaN||_933==0){
throw new hs.exception.InvalidAddress("? "+str);
}
var p;
if(_932=="l"){
p=new hs.address.IndirectLink(_933);
}else{
p=new hs.address.Relative(_932,_933);
}
this._pieces.push(p);
str=str.replace(_930,"");
}
},_parseStringSearch:function(str){
str=dojo.string.trim(str);
var p=new hs.address.StringSearch(str);
this._pieces.push(p);
},_parseStringPosition:function(str){
str=dojo.string.trim(str);
if(dojo.string.startsWith(str,"+")==false&&dojo.string.startsWith(str,"-")==false){
throw new hs.exception.InvalidAddress("? "+str);
}
var _938=/^((?:\+|\-))(\d*)([wcvilef])/;
while(str.length!=0){
var _939=str.match(_938);
if(_939==null||dojo.lang.isUndefined(_939)||_939.length==1||_939[1]==""||_939[1]==null||_939[3]==""||_939[3]==null){
throw new hs.exception.InvalidAddress("? "+str);
}
var sign=_939[1];
var _93b=_939[3];
var _93c=_939[2];
if(_93c==""||_93c==null||dojo.lang.isUndefined(_93c)){
_93c=1;
}
_93c=new Number(_93c).valueOf();
if(_93c==Number.NaN||_93c==0){
throw new hs.exception.InvalidAddress("? "+str);
}
if(sign=="-"){
_93c=_93c*-1;
}
var p=new hs.address.StringPosition(_93b,_93c);
this._pieces.push(p);
str=str.replace(_938,"");
}
}});
hs.util.XMLFetcher=function(){
};
hs.util.XMLFetcher.PROXY_URL="/hyperscope/trunk/hyperscope/src/server/proxy.php?url=";
hs.util.XMLFetcher._cache=new Object();
dojo.lang.extend(hs.util.XMLFetcher,{_handler:null,_addr:null,_url:null,_finished:false,_fromCache:false,load:function(addr,_93f){
this._handler=_93f;
if(this._finished==true){
throw new hs.exception.InvalidAddress("Programming error: "+"You must create a new XMLFetcher for "+"each file loaded");
}
if(addr==null||dojo.lang.isUndefined(addr)){
throw new hs.exception.InvalidAddress("Invalid address given to load: "+addr.toString());
}
if(dojo.lang.isUndefined(addr.resolve)){
addr=new hs.address.Address(addr);
}
if(addr.isRelative()==true){
throw new hs.exception.InvalidAddress("Addresses must be expanded before "+"calling XMLFetcher: "+addr.toString());
}
this._addr=addr;
var url=addr.fileInfo.toString();
this._url=url;
if(this._inCache(url)){
var doc=this._getFromCache(url);
this._loaded(null,doc,null);
}else{
this._loadFile(url);
}
},_loadFile:function(url){
if(this._isSameHost(url)==false){
url=hs.util.XMLFetcher.PROXY_URL+url;
}
var _943={url:url,sync:djConfig.testing,mimetype:"text/plain",error:dojo.lang.hitch(this,this._error),load:dojo.lang.hitch(this,this._loaded)};
dojo.io.bind(_943);
},_isSameHost:function(url){
var _945=window.location.href;
_945=new hs.address.FileInfo(_945);
var _946=new hs.address.FileInfo(url);
if(_945.scheme!=_946.scheme){
return false;
}
if(_945.port!=_946.port){
return false;
}
if(_945.host!=_946.host){
return false;
}
return true;
},_loaded:function(type,data,evt){
this._finished=true;
var exp=null;
if(data==null||dojo.lang.isUndefined(data)){
exp=new hs.exception.InvalidAddress("No data returned for address: "+this._addr.toString());
}
if(this._fromCache==false){
var _94b=data;
try{
data=this._toXML(data);
}
catch(e){
exp=e;
}
}
if(exp==null){
data=this._turnOnXPath(data);
}
if(exp==null){
try{
var _94c=data.selectNodes("/opml");
if(_94c==null||dojo.lang.isUndefined(_94c)||_94c.length==0){
exp=new hs.exception.InvalidAddress("Return results are not OPML for address: "+this._addr.toString());
}
}
catch(e){
exp=new hs.exception.InvalidAddress("Return results are not OPML for address: "+this._addr.toString()+", exception: "+e);
}
}
if(exp==null&&this._fromCache==false){
this._cacheXML(this._url,_94b);
}
this._handler.call(null,this._addr,data,exp);
},_error:function(type,_94e){
this._finished=true;
var _94f=_94e.message;
if(_94f.indexOf("XMLHttpTransport Error:")!=-1){
_94f=_94f.replace(/XMLHttpTransport Error:/,"");
}
var exp=new hs.exception.InvalidAddress("The following error occurred for "+this._addr.toString()+": "+_94f);
this._handler.call(null,this._addr,null,exp);
},_turnOnXPath:function(dom){
dom.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(dom,hs.model.Document.HS_NAMESPACE+" "+hs.model.Document.HS_INTERNAL_NAMESPACE);
return dom;
},_cacheXML:function(url,_953){
hs.util.XMLFetcher._cache[url]=_953;
},_getFromCache:function(url){
var _955=hs.util.XMLFetcher._cache[url];
var dom=this._toXML(_955);
this._fromCache=true;
return dom;
},_inCache:function(url){
return (hs.util.XMLFetcher._cache[url]!=null&&dojo.lang.isUndefined(hs.util.XMLFetcher._cache[url])!=null);
},_toXML:function(_958){
var _959=new DOMParser();
var dom=_959.parseFromString(_958,"text/xml");
if(Sarissa.getParseErrorText(dom)==Sarissa.PARSED_OK){
return dom;
}else{
throw new hs.exception.InvalidAddress("The OPML document at "+this._addr.toString()+" "+"is invalid: "+Sarissa.getParseErrorText(dom));
}
}});
hs.util.NodeWalker=function(_95b,_95c){
if(_95b==null||dojo.lang.isUndefined(_95b)){
throw new hs.exception.Filter("No context given to hs.util.NodeWalker");
}
if(dojo.lang.isUndefined(_95c)){
_95c=true;
}
this._doc=_95b.doc;
var _95d;
if(_95c){
_95d="//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number = '"+_95b.number+"']"+"//descendant-or-self::outline"+" | "+"//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number = '"+_95b.number+"']"+"/following::outline";
}else{
_95d="//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number = '"+_95b.number+"']"+"//descendant::outline"+" | "+"//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number = '"+_95b.number+"']"+"/following::outline";
}
var _95e=this._doc.dom.selectNodes(_95d);
if(_95e==null||_95e.length==0){
throw new hs.exception.Jump("Could not create NodeWalker starting from: "+_95b.number,this._doc,this._doc.address);
}
this._domNodes=_95e;
};
dojo.lang.extend(hs.util.NodeWalker,{_domNodes:null,_index:0,_doc:null,hasNext:function(){
if(this._index>=this._domNodes.length){
return false;
}else{
return true;
}
},next:function(){
if(this.hasNext()==false){
throw new hs.exception.Filter("No more nodes to walk");
}
var _95f=this._domNodes.item(this._index);
this._index++;
var node=new hs.model.Node(_95f,this._doc);
return node;
}});
hs.util.NodeNumberTokenizer=function(_961){
if(_961==null||dojo.lang.isUndefined(_961)||_961=="0"){
throw new hs.exception.InvalidAddress("Invalid node number: "+_961);
}
var _962;
var _963;
while(_961!=""){
if(/^[0-9]+/i.test(_961)){
_962=_961.match(/^([0-9]+)/i);
_961=_961.replace(/^[0-9]+/i,"");
_962=_962[1];
_962=new Number(_962).valueOf();
this._numbers.push(_962);
}else{
if(/^[A-Z]+/i.test(_961)){
_962=_961.match(/^([A-Z]+)/i);
_961=_961.replace(/^[A-Z]+/i,"");
_962=_962[1];
var _964=new Array();
for(var i=0;i<_962.length;i++){
var _966=_962.charCodeAt(i);
var _967=_966-65;
_964.push((_967%10)+1);
}
var i=1;
var _968=0;
while(_964.length!=0){
var _967=_964.pop();
_967=_967*i;
_968+=_967;
i=i*10;
}
this._numbers.push(_968);
}else{
dojo.raise("Programming exception in hs.util.NodeNumberTokenizer: "+_961);
}
}
}
};
dojo.lang.extend(hs.util.NodeNumberTokenizer,{_numbers:new Array(),hasNext:function(){
return (this._numbers.length>0);
},next:function(){
if(this.hasNext()==false){
throw new hs.exception.InvalidAddress("No more pieces: "+this._numbers);
}
return this._numbers.shift();
}});
hs.util.XSLTLoader=function(_969,_96a){
this._loadedHandler=_96a;
this._files=_969;
};
dojo.lang.extend(hs.util.XSLTLoader,{_xslt:new Object(),_files:null,_filesLoaded:0,_loadedHandler:null,load:function(){
if(typeof Sarissa=="undefined"){
this._waitForSarissa();
}else{
this._loadFiles();
}
},getXSLT:function(name){
var xslt=this._xslt[name];
if(xslt==null||dojo.lang.isUndefined(xslt)){
return null;
}
return xslt;
},_loadFiles:function(){
for(var i=0;i<this._files.length;i++){
this._load(this._files[i].name,this._files[i].url);
}
},_getDocRoot:function(){
var url=window.location.href;
var _96f=null,hasFilename=false;
for(var i=url.length;i--;i>=0){
if(url.charAt(i)=="/"){
if(hasFilename){
_96f=i+1;
}
break;
}else{
if(url.charAt(i)=="."){
hasFilename=true;
}
}
}
if(hasFilename){
url=url.substring(0,_96f);
}
return url;
},_load:function(name,url){
if(/[^:]*:/.test(url)==false&&url.charAt(0)!="/"){
url=this._getDocRoot()+url;
}
var self=this;
var _974={url:url,sync:djConfig.testing,mimetype:"text/plain",error:function(type,_976){
var _977=_976.message;
if(_977.indexOf("XMLHttpTransport Error:")!=-1){
_977=_977.replace(/XMLHttpTransport Error:/,"");
}
var exp=new hs.exception.InvalidAddress("The following error occurred for "+url+": "+_977);
self._loadedHandler.call(null,false,exp);
},load:function(type,data,evt){
var _97c=new XSLTProcessor();
var _97d=Sarissa.getDomDocument();
_97d=(new DOMParser()).parseFromString(data,"text/xml");
_97c.importStylesheet(_97d);
self._xslt[name]=_97c;
self._filesLoaded++;
if(self._filesLoaded>=self._files.length){
self._loadedHandler.call(null,true,null);
}
}};
dojo.io.bind(_974);
},_waitForSarissa:function(){
var self=this;
var _97f=window.setInterval(function(){
if(typeof Sarissa!="undefined"){
window.clearInterval(_97f);
self._loadFiles();
}
},20);
}});
if(typeof dojo.dom.setAttributeNS=="undefined"){
dojo.dom.setAttributeNS=function(elem,_981,_982,_983){
if(elem==null||dojo.lang.isUndefined(elem)){
dojo.raise("No element given to dojo.dom.setAttributeNS");
}
if(dojo.lang.isUndefined(elem.setAttributeNS)==false){
elem.setAttributeNS(_981,_982,_983);
}else{
var _984=elem.ownerDocument;
var _985=_984.createNode(2,_982,_981);
_985.nodeValue=_983;
elem.setAttributeNode(_985);
}
};
}
dojo.provide("hs.address");
dojo.require("dojo.uri.*");
dojo.require("dojo.string.*");
hs.address.Address=function(url){
this.nodeAddresses=new Array();
this.viewspecs=new Array();
var tk=new hs.util.AddressTokenizer(url);
while(tk.hasNext()){
var p=tk.next();
if(p.isPieceType("hs.address.FileInfo")){
this.fileInfo=p;
}else{
if(p.isPieceType("hs.address.NodeAddress")){
this.nodeAddresses.push(p);
}else{
if(p.isPieceType("hs.address.Viewspec")){
this.viewspecs.push(p);
}else{
if(p.isPieceType("hs.address.ContentFilter")){
this.contentFilter=p;
}
}
}
}
}
};
dojo.lang.extend(hs.address.Address,{fileInfo:null,nodeAddresses:null,viewspecs:null,contentFilter:null,_handler:null,_replacePage:null,_relativeTo:null,_inclusion:false,_includer:null,_inclusionParentAddress:null,_halted:false,resolve:function(_989,_98a,_98b,_98c,_98d){
this._handler=_989;
this._replacePage=_98a;
if(dojo.lang.isUndefined(_98b)){
_98b=null;
}
this._relativeTo=_98b;
if(dojo.lang.isUndefined(_98c)){
_98c=false;
_98d=this;
}
this._inclusion=_98c;
this._inclusionParentAddress=_98d;
if(_98b==null&&this.isRelative()){
throw new hs.exception.InvalidAddress("Programming error: relative address given to "+"hs.address.Address.resolve() when relativeTo "+"is null; our address="+this.toString());
}
if(_98b!=null){
var _98e=this._getDisplayedAddress();
var _98f=this._isSameFile(_98e,_98b);
hs.profile.start("expandall");
var _990=this._expandAll(_98b,_98f);
hs.profile.end("expandall");
if(_98a==true&&_98f==false){
this._changeDisplayedAddress(_990);
if(djConfig.testing==false){
return;
}
}
_990=this._copyInitialState(_990);
this._load(_990);
}else{
var _991=this.clone();
_991.fileInfo.consolidateRelativeDots();
_991=this._copyInitialState(_991);
this._load(_991);
}
},toString:function(){
var s=new hs.util.AddressSerializer(this);
return s.serialize();
},equals:function(addr){
if(addr==null||dojo.lang.isUndefined(addr)){
return false;
}
if(dojo.lang.isString(addr)){
addr=new hs.address.Address(addr);
}
var _994=addr.toString();
var _995=this.toString();
return (_994==_995);
},isRelative:function(){
return this.fileInfo.isRelative();
},clone:function(){
var a=new hs.address.Address(this.toString());
return a;
},replaceResolution:function(_997,doc){
this._halted=true;
_997.resolve(this._handler,this._replacePage,doc,this._inclusion,this._inclusionParentAddress);
},_isSameFile:function(_999,_99a){
if(dojo.lang.isUndefined(_999.resolve)==true){
_999=new hs.address.Address(_999);
}
_99a=_99a.address.fileInfo;
var f1=_999.fileInfo.expand(_99a);
var f2=this.fileInfo.expand(_99a);
return (f1.equals(f2));
},_expandFileInfo:function(_99d){
if(_99d==null&&this.fileInfo.isRelative()==false){
throw new hs.exception.InvalidAddress("No document to expand "+"relative address against: "+this.toString());
}
var _99e=this.fileInfo.expand(_99d.address.fileInfo);
var _99f=this.clone();
_99f.fileInfo=_99e;
return _99f;
},_expandNodeAddress:function(doc){
var addr=this.clone();
if(this.nodeAddresses.length>0){
var p=this.nodeAddresses[0];
if(p.isPieceType("hs.address.NodeNumber")==true&&p.isOffset==true){
return addr;
}
if(p.isPieceType("hs.address.NodeID")==true){
return addr;
}
}
var _9a3="0";
if(doc.nodeCtxt!=null&&dojo.lang.isUndefined(doc.nodeCtxt)==false){
_9a3=doc.nodeCtxt.number;
}
var _9a4=new hs.address.NodeNumber(_9a3,false);
addr.nodeAddresses=[_9a4].concat(addr.nodeAddresses);
return addr;
},_expandViewspecs:function(_9a5){
var addr=this.clone();
if(_9a5.currentViewspecs==null){
return addr;
}
var _9a7=_9a5.currentViewspecs.toString();
var _9a8=new Array();
for(var i=0;i<_9a7.length;i++){
var _9aa=new hs.address.Viewspec(_9a7.charAt(i));
_9a8.push(_9aa);
}
addr.viewspecs=_9a8.concat(addr.viewspecs);
return addr;
},_expandContentFilter:function(_9ab){
var addr=this.clone();
if(_9ab.address.contentFilter!=null&&addr.contentFilter==null){
var _9ad=_9ab.address.contentFilter.clone();
addr.contentFilter=_9ad;
}
return addr;
},_expandAll:function(_9ae,_9af){
var _9b0=this._expandFileInfo(_9ae);
if(_9af==false){
return _9b0;
}
_9b0=_9b0._expandNodeAddress(_9ae);
_9b0=_9b0._expandViewspecs(_9ae);
_9b0=_9b0._expandContentFilter(_9ae);
return _9b0;
},_copyInitialState:function(addr){
addr._replacePage=this._replacePage;
addr._relativeTo=this._relativeTo;
addr._inclusion=this._inclusion;
addr._inclusionParentAddress=this._inclusionParentAddress;
addr._handler=this._handler;
return addr;
},_getDisplayedAddress:function(){
var _9b2=window.location.href;
if(djConfig.testing==true){
_9b2=hs.model.testingCurrentURL;
}
var _9b3=new hs.address.Address(_9b2);
return _9b3;
},_changeDisplayedAddress:function(addr){
if(djConfig.testing==true){
hs.model.testingCurrentURL=addr.toString();
}else{
window.location.href=addr.toString();
}
},_load:function(addr){
if(addr==null||dojo.lang.isUndefined(addr)){
addr=this;
}
hs.profile.start("_load");
var _9b6=dojo.lang.hitch(this,this._loadHandler);
var _9b7=new hs.util.XMLFetcher();
_9b7.load(addr,_9b6);
hs.profile.end("_load");
},_loadHandler:function(_9b8,dom,_9ba){
try{
if(_9ba!=null&&dojo.lang.isUndefined(_9ba)==false){
this._handler.call(null,this,null,_9ba);
return;
}
hs.profile.start("loadHandler");
var doc=new hs.model.Document(_9b8,dom);
doc=this._applyNodeAddressing(_9b8,doc);
if(_9b8._halted==true){
_9b8._halted=false;
return;
}
doc=this._applyViewspecs(_9b8,doc);
if(doc.currentViewspecs.runSequenceGenerators()==true||this._inclusion==true){
if(this._inclusion==false||_9b8.fileInfo.equals(this._inclusionParentAddress.fileInfo)==false){
this._includer=new hs.filter.Transcluder(_9b8);
var self=this;
this._includer.apply(doc,dojo.lang.hitch(this,function(doc,_9be){
self._transclusionDone(_9b8,doc,_9be);
}));
return;
}
}
doc=this._executeContentFilter(_9b8,doc);
doc=this._minimizeAddress(doc);
hs.profile.end("loadHandler");
this._doneResolving(doc,_9ba);
}
catch(exp){
this._handler.call(null,this,null,exp);
}
},_applyNodeAddressing:function(_9bf,doc){
for(var i=0;i<_9bf.nodeAddresses.length;i++){
var p=_9bf.nodeAddresses[i];
p.apply(doc,null,_9bf);
if(_9bf._halted==true){
break;
}
}
return doc;
},_applyViewspecs:function(_9c3,doc){
for(var i=0;i<_9c3.viewspecs.length;i++){
var v=_9c3.viewspecs[i];
doc.currentViewspecs.add(v);
}
return doc;
},_doneResolving:function(doc,_9c8){
this._handler.call(null,this,doc,_9c8);
},_executeContentFilter:function(_9c9,doc){
if(_9c9.contentFilter!=null){
_9c9.contentFilter.apply(doc);
}
return doc;
},_minimizeAddress:function(doc){
var _9cc=doc.toURL();
doc.address=new hs.address.Address(_9cc);
return doc;
},_transclusionDone:function(_9cd,doc,_9cf){
if(_9cf!=null&&dojo.lang.isUndefined(_9cf)==false){
this._handler.call(null,this,doc,_9cf);
return;
}
if(this._includer.metadataDirty==true){
doc.normalize();
}
doc=this._executeContentFilter(_9cd,doc);
doc=this._minimizeAddress(doc);
hs.profile.end("loadHandler");
this._doneResolving(doc,_9cf);
}});
hs.address.Piece=function(){
};
dojo.lang.extend(hs.address.Piece,{toString:function(){
dojo.raise("Abstract method");
},isPieceType:function(_9d0){
dojo.raise("Abstract method");
}});
hs.address.FileInfo=function(url){
this._parse(url);
};
dojo.inherits(hs.address.FileInfo,hs.address.Piece);
dojo.lang.extend(hs.address.FileInfo,{scheme:null,host:null,port:null,path:null,query:null,hasFullPath:function(){
if(this.host!=null){
return true;
}
if(dojo.string.startsWith(this.path,"/")){
return true;
}
if(dojo.string.startsWith(this.path,"\\")){
return true;
}
return false;
},expand:function(_9d2){
var f=this.clone();
_9d2=_9d2.clone();
if(this.isRelative()==false){
f.consolidateRelativeDots();
return f;
}
if(_9d2.isRelative()){
throw new hs.exception.InvalidAddress("Programming error: hs.address.FileInfo.expand() "+"was passed a relative path to expand against");
}
if(f._hasFile()==false&&dojo.string.endsWith(f.path,"/")==false){
f.path+="/";
}
if(_9d2._hasFile()==false&&dojo.string.endsWith(_9d2.path,"/")==false){
_9d2.path+="/";
}
if(f.path=="./"){
f.path="";
}
if(dojo.string.startsWith(f.path,"/")){
_9d2.path=f.path;
}else{
if(f._hasFile()&&_9d2._hasFile()){
_9d2.path=_9d2._getDirectoryPath();
f.path=_9d2.path+f.path;
}else{
if(f.path!=""&&f._hasFile()==false&&_9d2._hasFile()){
_9d2.path=_9d2._getDirectoryPath();
f.path=_9d2.path+f.path;
}else{
f.path=_9d2.path+f.path;
}
}
}
if(f.query!=null&&_9d2.query!=null){
_9d2.query=f.query;
}
f.scheme=_9d2.scheme;
f.port=_9d2.port;
f.host=_9d2.host;
f.query=_9d2.query;
if(dojo.string.endsWith(f.path,"/./")){
f.path=f.path.replace(/(\/\.\/)$/,"/");
}
f.consolidateRelativeDots();
return f;
},equals:function(f){
if(f==null||dojo.lang.isUndefined(f)){
return false;
}
if(f.scheme==this.scheme&&f.port==this.port&&f.host==this.host&&f.query==this.query&&f.path==this.path){
return true;
}else{
return false;
}
},toString:function(){
var s=new String();
if(this.scheme!=null&&this.host!=null){
s+=this.scheme+"://";
}
if(this.host!=null){
s+=this.host;
}
if(this.host!=null&&this.port!=80){
s+=":"+this.port;
}
if(this.path!=null){
s+=this.path;
}
if(this.query!=null){
s+=this.query;
}
return s;
},clone:function(){
var f=new hs.address.FileInfo(this.toString());
f.scheme=this.scheme;
f.host=this.host;
f.port=this.port;
f.path=this.path;
f.query=this.query;
return f;
},isPieceType:function(_9d7){
if(_9d7=="hs.address.FileInfo"){
return true;
}else{
return false;
}
},isRelative:function(){
if(this.scheme==null||this.host==null||this.path==null){
return true;
}else{
return false;
}
},consolidateRelativeDots:function(){
if(this.isRelative()==true||this.path==null||dojo.string.startsWith(this.path,"/")==false||this.path=="/"){
return;
}
var _9d8=this.path.match(/([^\/]*)/g);
_9d8.shift();
var _9d9=new Array();
for(var i=0;i<_9d8.length;i++){
if(_9d8[i]!=".."&&_9d8[i]!="."&&_9d8[i]!=""){
_9d9.push(_9d8[i]);
}else{
if(_9d8[i]==".."&&_9d9.length!=0){
_9d9.pop();
}else{
if(_9d8[i]=="."||_9d8[i]==".."||_9d8[i]==""){
}
}
}
}
var _9db="/"+_9d9.join("/");
if(this._hasFile()==false&&dojo.string.endsWith(_9db,"/")==false){
_9db=_9db+"/";
}
this.path=_9db;
},_hasFile:function(){
if(this.path!=null&&dojo.string.endsWith(this.path,"/")){
return false;
}
var _9dc=/((?:[^\.\/]*\.[^\.\/]+)+)$/;
return _9dc.test(this.path);
},_getFile:function(){
if(this._hasFile()==false){
return null;
}
var _9dd=/((?:[^\.\/]*\.[^\.\/]+)*)$/;
return this.path.match(_9dd)[1];
},_getDirectoryPath:function(){
var _9de=this._getFile();
var _9df=this.path.indexOf(_9de);
var _9e0=this.path.substring(0,_9df);
if(dojo.string.endsWith(_9e0,"/")==false){
_9e0+="/";
}
return _9e0;
},_startsWithDomain:function(str){
if(str==null||dojo.string.startsWith(str,"/")||dojo.string.startsWith(str,".")||dojo.string.trim(str)==""||/^[^\?\:#]*:\/\//.test(str)==true){
return false;
}
var _9e2=/^([^\/\:]*)/;
var _9e3=null;
if(_9e2.test(str)==true){
_9e2=str.match(_9e2)[1];
if(str.indexOf(".")==-1){
_9e3=null;
}else{
if(/[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/.test(_9e2)==true){
_9e3=_9e2;
}else{
if(_9e2=="localhost"){
_9e3="localhost";
}else{
if(/\.[a-z][a-z]$/i.test(_9e2)==true){
_9e3=str;
}
var tld=[/\.example$/i,/\.invalid$/i,/\.test$/i,/\.arpa$/i,/\.aero$/i,/\.biz$/i,/\.com$/i,/\.coop$/i,/\.edu$/i,/\.gov$/i,/\.info$/i,/\.int$/i,/\.mil$/i,/\.mobi$/i,/\.museum$/i,/\.name$/i,/\.net$/i,/\.org$/i,/\.pro$/i,/\.travel$/i,/\.asia$/i,/\.post$/i,/\.tel$/i,/\.geo$/i];
for(var i=0;i<tld.length;i++){
if(tld[i].test(_9e2)==true){
_9e3=_9e2;
break;
}
}
}
}
}
}
if(_9e3==null){
return false;
}else{
return true;
}
},_parse:function(url){
if(url==null||dojo.lang.isUndefined(url)){
throw new hs.exception.InvalidAddress("Programming error, "+"Invalid address: "+url);
}
url=dojo.string.trim(url);
if(url==""){
url="./";
}
url=url.replace(/(#.*)/,"");
url=url.replace(/%20/," ");
if(/^[^\?\:#]*:\/\/$/.test(url)){
throw new hs.exception.InvalidAddress("? "+url);
}
if(/^[^\?\:#]*:/.test(url)||this._startsWithDomain(url)){
this._parseFullUrl(url);
}else{
this._parsePartialUrl(url);
}
if(this.path!=null&&/\/{2,}/.test(this.path)){
throw new hs.exception.InvalidAddress("? "+url);
}
if(this.query!=null&&url.split("?").length>2){
throw new hs.exception.InvalidAddress("? "+url);
}
if(this._hasFile()==false&&dojo.string.endsWith(this.path,"/")==false){
this.path+="/";
}
},_parseFullUrl:function(url){
var _9e8=url;
if(this._startsWithDomain(url)){
url="http://"+url;
}
url=new dojo.uri.Uri(url);
this.scheme=url.scheme;
if(dojo.lang.isUndefined(this.scheme)||this.scheme==null){
this.scheme="http";
}
if(this.scheme!="http"&&this.scheme!="https"){
throw new hs.exception.InvalidAddress("? "+url);
}
this.port=url.port;
if(dojo.lang.isUndefined(this.port)||this.port==null){
this.port=80;
}
if(this.port!=null){
this.port=new Number(this.port).valueOf();
}
this.host=url.host;
if(dojo.lang.isUndefined(this.host)){
this.host=null;
}
this.path=url.path;
if(dojo.lang.isUndefined(this.path)){
this.path=null;
}
if(this.path!=null&&dojo.string.trim(this.path)==""){
this.path=null;
}
if(this.path=="/./"){
this.path="/";
}
this.query=url.query;
if(dojo.lang.isUndefined(this.query)){
this.query=null;
}
if(this.query!=null){
this.query=dojo.string.trim(this.query);
if(this.query==""){
this.query=null;
}
}
if(this.query!=null&&dojo.string.startsWith(this.query,"?")==false){
this.query="?"+this.query;
}
if(this.host!=null&&this.path==null){
this.path="/";
}
},_parsePartialUrl:function(url){
var m=url.match(/^([^\?#]*)(\??[^#]*)#?.*$/);
if(m[1]!=null&&!dojo.lang.isUndefined(m[1])&&dojo.string.trim(m[1])!=""){
this.path=m[1];
}
if(m[2]!=null&&!dojo.lang.isUndefined(m[2])&&dojo.string.trim(m[2])!=""){
this.query=m[2];
}
if(this.path==null){
this.path="./";
}
if(this.path==".."){
this.path="../";
}
if(this.path=="."){
this.path="./";
}
this.scheme="http";
this.port=80;
}});
hs.address.NodeAddress=function(){
};
dojo.inherits(hs.address.NodeAddress,hs.address.Piece);
dojo.lang.mixin(hs.address.NodeAddress.prototype,hs.filter.Filter);
dojo.lang.extend(hs.address.NodeAddress,{});
hs.address.Viewspec=function(_9eb){
if(_9eb==null||dojo.lang.isUndefined(_9eb)||/^[A-Za-z]$/.test(_9eb)==false){
throw new hs.exception.InvalidAddress("? "+_9eb);
}
this.letter=_9eb;
};
dojo.inherits(hs.address.Viewspec,hs.address.Piece);
dojo.lang.extend(hs.address.Viewspec,{letter:null,isPieceType:function(_9ec){
if(_9ec=="hs.address.Viewspec"){
return true;
}else{
return false;
}
},toString:function(){
return this.letter;
}});
hs.address.ContentFilter=function(_9ed){
if(_9ed==null||dojo.lang.isUndefined(_9ed)||/(?:^\"(?:\\\"|[^\"])*\"$)|(?:^\/(?:\\\/|[^\/])*\/[a-z]*$)/i.test(_9ed)==false){
throw new hs.exception.InvalidAddress("? "+_9ed);
}
if(dojo.string.trim(_9ed)=="\"\""||_9ed=="//"){
throw new hs.exception.InvalidAddress("? "+_9ed);
}
this.search=_9ed;
};
dojo.inherits(hs.address.ContentFilter,hs.address.Piece);
dojo.lang.mixin(hs.address.ContentFilter.prototype,hs.filter.Filter);
dojo.lang.extend(hs.address.ContentFilter,{search:null,toString:function(){
return this.search;
},apply:function(doc){
var _9ef=this.search;
if(dojo.string.startsWith(_9ef,"\"")==true){
_9ef=_9ef.substring(1);
_9ef=_9ef.substring(0,_9ef.length-1);
_9ef=this._escapeData(_9ef);
regExp=new RegExp("(?:^|[ ])"+_9ef+"(?:$|[ ])");
this._doContentFilter(regExp,doc,this.search);
}else{
var _9f0=eval(_9ef);
this._doContentFilter(_9f0,doc,this.search);
}
},isPieceType:function(_9f1){
if(_9f1=="hs.address.ContentFilter"){
return true;
}else{
return false;
}
},clone:function(){
var _9f2=new hs.address.ContentFilter(this.search);
return _9f2;
},_escapeData:function(data){
data=data.replace(/\\/g,"\\\\");
data=data.replace(/\[/g,"\\[");
data=data.replace(/\]/g,"\\]");
data=data.replace(/\"/g,"\\\"");
data=data.replace(/\'/g,"\\'");
data=data.replace(/\^/g,"\\^");
data=data.replace(/\*/g,"\\*");
data=data.replace(/\+/g,"\\+");
data=data.replace(/\-/g,"\\-");
data=data.replace(/\?/g,"\\?");
data=data.replace(/\|/g,"\\|");
data=data.replace(/\./g,"\\.");
data=data.replace(/\{/g,"\\{");
data=data.replace(/\}/g,"\\}");
data=data.replace(/\,/g,"\\,");
data=data.replace(/\(/g,"\\(");
data=data.replace(/\)/g,"\\)");
data=data.replace(/\:/g,"\\:");
data=data.replace(/\;/g,"\\;");
data=data.replace(/\$/g,"\\$");
data=data.replace(/\=/g,"\\=");
data=data.replace(/\!/g,"\\!");
return data;
},_doContentFilter:function(_9f4,doc,_9f6){
var _9f7;
var _9f8;
var _9f9=doc.currentViewspecs.getContentFilterType();
if(_9f9==hs.filter.ViewspecConstants.FILTER_ALL){
var _9fa=doc.getOriginDomNode();
if(_9fa==null){
throw new hs.exception.Jump("No origin node in document",doc,doc.address);
}
_9f7=new hs.model.Node(_9fa,doc);
_9f8=true;
}else{
if(_9f9==hs.filter.ViewspecConstants.NEXT_FILTERED_NODE){
_9f7=doc.nodeCtxt;
_9f8=false;
}else{
return;
}
}
var _9fb=new hs.util.NodeWalker(_9f7,_9f8);
var _9fc=false;
var _9fd=new Array();
while(_9fb.hasNext()){
var node=_9fb.next();
if(node.test(_9f4)){
_9fc=true;
dojo.dom.setAttributeNS(node.domNode,hs.model.Document.HS_INTERNAL_NAMESPACE_URI,hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":passes-content-filter","yes");
_9fd[_9fd.length]=node;
_9fd["_"+node.number]=node;
}
}
if(_9fc==false){
throw new hs.exception.InvalidAddress("? "+_9f6,doc,doc.address);
}
var _9ff=doc.nodeCtxt.number;
if(typeof _9fd["_"+_9ff]=="undefined"){
var _a00=doc.nodeCtxt.nodeCounter;
var _a01=_9fd[0];
var _a02=_9fd[_9fd.length-1];
var _a03=null;
if(_a00<=_a01.nodeCounter){
_a03=_a01;
}else{
if(_a00>=_a02.nodeCounter){
_a03=_a02;
}else{
_a03=_a01;
}
}
doc.nodeCtxt=_a03;
}
}});
hs.address.NodeNumber=function(_a04,_a05){
if(_a05==null||dojo.lang.isUndefined(_a05)){
_a05=false;
}
this.isOffset=_a05;
if(_a04==null||dojo.lang.isUndefined(_a04)||/^[0-9]+(?:[a-z0-9]*)$/i.test(_a04)==false){
throw new hs.exception.InvalidAddress("? "+_a04);
}
if(dojo.string.startsWith(_a04,"0")&&_a04!="0"){
throw new hs.exception.InvalidAddress("? "+_a04);
}
this.number=_a04.toUpperCase();
};
dojo.inherits(hs.address.NodeNumber,hs.address.NodeAddress);
hs.address.NodeNumber.toNodeNumber=function(_a06,_a07){
if(_a06==null||_a06=="0"){
_a07=new Number(_a07).toString();
return new hs.address.NodeNumber(_a07);
}else{
_a06=_a06.toUpperCase();
if(/[0-9]$/.test(_a06)==true){
var _a08=new Array();
_a07=_a07-1;
while(_a07>=26){
_a08.push(_a07%26);
_a07=_a07/26;
_a07--;
}
var _a09=_a07+65;
var word=String.fromCharCode(_a09);
while(_a08.length!=0){
_a09=_a08.pop();
_a09=_a09+65;
_a09=String.fromCharCode(_a09);
word+=_a09;
}
return new hs.address.NodeNumber(_a06+word);
}else{
return new hs.address.NodeNumber(_a06+_a07);
}
}
};
dojo.lang.extend(hs.address.NodeNumber,{number:null,isOffset:false,apply:function(doc){
if(this.isOffset==false){
doc.jumpNumber(this.number);
}else{
doc.nodeCtxt.jumpOffset(this.number);
}
},isPieceType:function(_a0c){
if(_a0c=="hs.address.NodeAddress"||_a0c=="hs.address.NodeNumber"){
return true;
}else{
return false;
}
},toString:function(){
return this.number;
}});
hs.address.NodeID=function(id){
if(id==null||dojo.lang.isUndefined(id)||/^0[0-9]+$/.test(id)==false){
throw new hs.exception.InvalidAddress("? "+id);
}
this.id=id;
};
dojo.inherits(hs.address.NodeID,hs.address.NodeAddress);
dojo.lang.extend(hs.address.NodeID,{id:null,apply:function(doc){
doc.jumpId(this.id);
},isPieceType:function(_a0f){
if(_a0f=="hs.address.NodeAddress"||_a0f=="hs.address.NodeID"){
return true;
}else{
return false;
}
},toString:function(){
return this.id;
}});
hs.address.NodeLabel=function(_a10,type){
if(_a10==null||dojo.lang.isUndefined(_a10)||/^[A-Z]+[A-Z0-9_\-\@\']*$/i.test(_a10)==false){
throw new hs.exception.InvalidAddress("? "+_a10);
}
this.label=_a10;
if(dojo.lang.isUndefined(type)||type==null){
type=hs.address.NodeLabel.START_AT_FIRST;
}
this.type=type;
};
hs.address.NodeLabel.START_AT_FIRST="start_at_first";
hs.address.NodeLabel.BRANCH_SEARCH="!";
hs.address.NodeLabel.MOVE_TO_NEXT="*";
hs.address.NodeLabel.EXTERNAL="$";
dojo.inherits(hs.address.NodeLabel,hs.address.NodeAddress);
dojo.lang.extend(hs.address.NodeLabel,{label:null,type:null,apply:function(doc){
switch(this.type){
case hs.address.NodeLabel.BRANCH_SEARCH:
doc.nodeCtxt.jumpBranchSearch(this.label);
break;
case hs.address.NodeLabel.START_AT_FIRST:
doc.jumpLabel(this.label,hs.commands.JumpConstants.FIRST);
break;
case hs.address.NodeLabel.MOVE_TO_NEXT:
doc.jumpLabel(this.label,hs.commands.JumpConstants.NEXT);
break;
case hs.address.NodeLabel.EXTERNAL:
doc.jumpExternal(this.label);
break;
}
},isPieceType:function(_a13){
if(_a13=="hs.address.NodeAddress"||_a13=="hs.address.NodeLabel"){
return true;
}else{
return false;
}
},toString:function(){
return this.label;
}});
hs.address.Marker=function(name){
if(name==null||dojo.lang.isUndefined(name)||/^[A-Za-z]+[A-Za-z0-9_\-]*$/.test(name)==false){
throw new hs.exception.InvalidAddress("? "+name);
}
this.name=name;
};
dojo.inherits(hs.address.Marker,hs.address.NodeAddress);
dojo.lang.extend(hs.address.Marker,{name:null,apply:function(doc){
doc.jumpMarker(this.name);
},isPieceType:function(_a16){
if(_a16=="hs.address.NodeAddress"||_a16=="hs.address.Marker"){
return true;
}else{
return false;
}
},toString:function(){
return this.name;
}});
hs.address.Relative=function(type,_a18){
if(type==null||dojo.lang.isUndefined(type)){
throw new hs.exception.InvalidAddress("? "+type);
}
switch(type){
case hs.address.Relative.NODE_NEXT:
break;
case hs.address.Relative.NODE_BACK:
break;
case hs.address.Relative.NODE_UP:
break;
case hs.address.Relative.NODE_DOWN:
break;
case hs.address.Relative.ORIGIN:
break;
case hs.address.Relative.BRANCH_END:
break;
case hs.address.Relative.PLEX_HEAD:
break;
case hs.address.Relative.PLEX_TAIL:
break;
case hs.address.Relative.NODE_SUCCESSOR:
break;
case hs.address.Relative.NODE_PREDECESSOR:
break;
case hs.address.Relative.CONTENT_SEARCH:
break;
case hs.address.Relative.RETURN_NODE:
break;
case hs.address.Relative.RETURN_FILE:
break;
default:
throw new hs.exception.InvalidAddress("? "+type);
}
this.type=type;
if(dojo.lang.isUndefined(_a18)||_a18==null){
_a18=1;
}
if(_a18<=0){
throw new hs.exception.InvalidAddress("? "+_a18);
}
this.offset=_a18;
};
dojo.inherits(hs.address.Relative,hs.address.NodeAddress);
hs.address.Relative.NODE_NEXT="n";
hs.address.Relative.NODE_BACK="b";
hs.address.Relative.NODE_UP="u";
hs.address.Relative.NODE_DOWN="d";
hs.address.Relative.ORIGIN="o";
hs.address.Relative.BRANCH_END="e";
hs.address.Relative.PLEX_HEAD="h";
hs.address.Relative.PLEX_TAIL="t";
hs.address.Relative.NODE_SUCCESSOR="s";
hs.address.Relative.NODE_PREDECESSOR="p";
hs.address.Relative.CONTENT_SEARCH="c";
hs.address.Relative.RETURN_NODE="r";
hs.address.Relative.RETURN_FILE="rf";
dojo.lang.extend(hs.address.Relative,{type:null,offset:1,apply:function(doc){
switch(this.type){
case hs.address.Relative.NODE_NEXT:
doc.nodeCtxt.jumpNext(this.offset);
break;
case hs.address.Relative.NODE_BACK:
doc.nodeCtxt.jumpBack(this.offset);
break;
case hs.address.Relative.NODE_UP:
doc.nodeCtxt.jumpUp(this.offset);
break;
case hs.address.Relative.NODE_DOWN:
doc.nodeCtxt.jumpDown(this.offset);
break;
case hs.address.Relative.ORIGIN:
doc.jumpOrigin();
break;
case hs.address.Relative.BRANCH_END:
doc.nodeCtxt.jumpBranchEnd();
break;
case hs.address.Relative.PLEX_HEAD:
doc.nodeCtxt.jumpPlexHead();
break;
case hs.address.Relative.PLEX_TAIL:
doc.nodeCtxt.jumpPlexTail();
break;
case hs.address.Relative.NODE_SUCCESSOR:
doc.nodeCtxt.jumpSuccessor(this.offset);
break;
case hs.address.Relative.NODE_PREDECESSOR:
doc.nodeCtxt.jumpPredecessor(this.offset);
break;
case hs.address.Relative.CONTENT_SEARCH:
dojo.raise("content search relative address (.c) not implemented");
break;
case hs.address.Relative.RETURN_NODE:
dojo.raise("return node (.r) not implemented");
break;
case hs.address.Relative.RETURN_FILE:
dojo.raise("return file (.rf) not implemented");
break;
}
},isPieceType:function(_a1a){
if(_a1a=="hs.address.NodeAddress"||_a1a=="hs.address.Relative"){
return true;
}else{
return false;
}
},toString:function(){
if(this.offset==1){
return this.type;
}else{
return this.offset+this.type;
}
}});
hs.address.IndirectLink=function(_a1b){
if(dojo.lang.isUndefined(_a1b)||_a1b==null){
_a1b=1;
}
if(_a1b<=0){
throw new hs.exception.InvalidAddress("? "+_a1b);
}
this.offset=_a1b;
};
dojo.inherits(hs.address.IndirectLink,hs.address.NodeAddress);
dojo.lang.extend(hs.address.IndirectLink,{offset:1,apply:function(doc,_a1d,_a1e){
var ctxt=doc.nodeCtxt;
var _a20=ctxt.cursor;
var link=null;
try{
link=_a20.getLink(this.offset);
}
catch(exp){
debug(exp);
throw new hs.exception.Filter("No indirect link for "+ctxt.number);
}
var _a22=this._mergeLinks(link,_a1e);
_a1e.replaceResolution(_a22,doc);
},isPieceType:function(_a23){
if(_a23=="hs.address.NodeAddress"||_a23=="hs.address.IndirectLink"){
return true;
}else{
return false;
}
},toString:function(){
if(this.offset==1){
return "l";
}else{
return this.offset+"l";
}
},_mergeLinks:function(link,_a25){
var _a26=new hs.address.Address(link);
for(var i=0;i<_a25.viewspecs.length;i++){
_a26.viewspecs[_a26.viewspecs.length]=_a25.viewspecs[i];
}
var _a28=new Array();
var _a29=false;
for(var i=0;i<_a25.nodeAddresses.length;i++){
var p=_a25.nodeAddresses[i];
if(_a29==true){
_a28[_a28.length]=p;
continue;
}
if(p.isPieceType("hs.address.IndirectLink")==true){
_a29=true;
}
}
for(var i=0;i<_a28.length;i++){
_a26.nodeAddresses[_a26.nodeAddresses.length]=_a28[i];
}
return _a26;
}});
hs.address.StringSearch=function(_a2b){
if(_a2b==null||dojo.lang.isUndefined(_a2b)||/(?:^\"(?:\\\"|[^\"])*\"$)|(?:^\/(?:\\\/|[^\/])*\/[a-z]*$)/i.test(_a2b)==false){
throw new hs.exception.InvalidAddress("? "+_a2b);
}
this.search=_a2b;
};
dojo.inherits(hs.address.StringSearch,hs.address.NodeAddress);
dojo.lang.extend(hs.address.StringSearch,{search:null,toRegularExpression:function(){
},apply:function(doc){
var _a2d=eval(this.search);
doc.jumpContent(_a2d,hs.commands.JumpConstants.NEXT);
},isPieceType:function(_a2e){
if(_a2e=="hs.address.NodeAddress"||_a2e=="hs.address.StringSearch"){
return true;
}else{
return false;
}
},toString:function(){
return this.search;
}});
hs.address.StringPosition=function(type,_a30){
if(type==null||dojo.lang.isUndefined(type)){
throw new hs.exception.InvalidAddress("? "+type);
}
switch(type){
case hs.address.StringPosition.LAST_CHAR:
break;
case hs.address.StringPosition.FIRST_CHAR:
break;
case hs.address.StringPosition.CHARACTER:
break;
case hs.address.StringPosition.WORD:
break;
case hs.address.StringPosition.VISIBLE:
break;
case hs.address.StringPosition.INVISIBLE:
break;
default:
throw new hs.exception.InvalidAddress("? "+type);
}
this.type=type;
if(dojo.lang.isUndefined(_a30)||_a30==null){
_a30=1;
}
if(_a30==0){
throw new hs.exception.InvalidAddress("? "+_a30);
}
if(type==hs.address.StringPosition.LAST_CHAR||type==hs.address.StringPosition.FIRST_CHAR){
_a30=1;
}
this.offset=_a30;
};
dojo.inherits(hs.address.StringPosition,hs.address.NodeAddress);
hs.address.StringPosition.LAST_CHAR="e";
hs.address.StringPosition.FIRST_CHAR="f";
hs.address.StringPosition.CHARACTER="c";
hs.address.StringPosition.WORD="w";
hs.address.StringPosition.VISIBLE="v";
hs.address.StringPosition.INVISIBLE="i";
dojo.lang.extend(hs.address.StringPosition,{type:null,offset:1,apply:function(doc){
dojo.raise("string positioning not implemented");
},isPieceType:function(_a32){
if(_a32=="hs.address.NodeAddress"||_a32=="hs.address.StringPosition"){
return true;
}else{
return false;
}
},toString:function(){
if(this.offset==1){
return "+"+this.type;
}else{
var sign="";
if(this.offset>0){
sign="+";
}
return sign+this.offset+this.type;
}
}});
dojo.provide("hs.model");
dojo.require("hs.util");
dojo.require("dojo.io.*");
dojo.require("dojo.string.*");
dojo.require("dojo.dom");
dojo.require("dojo.event.*");
dojo.require("sarissa.core");
dojo.require("sarissa.xpath");
if(dojo.lang.isUndefined(djConfig.testing)){
djConfig.testing=false;
}
hs.model.testingCurrentURL=window.location.href;
hs.model.addOnLoad=function(_a34){
hs.model._loadHandler=_a34;
if(hs.model._isLoaded==true){
hs.model._loaded();
}
};
hs.model._loaded=function(){
hs.model._isLoaded=true;
if(dojo.lang.isUndefined(hs.model._loadHandler)==false){
hs.model._loadHandler.call(null);
}
};
hs.model.Node=function(_a35,doc){
this.domNode=_a35;
this.doc=doc;
this.number=_a35.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number");
this.level=_a35.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":level");
this.level=new Number(this.level).valueOf();
this.nodeCounter=_a35.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter");
this.nodecounter=new Number(this.nodeCounter).valueOf();
this.id=_a35.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX+":nid");
this.label=_a35.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX+":label");
this.data=_a35.getAttribute("text");
this.cursor=new hs.model.NodeCursor(this);
};
dojo.lang.extend(hs.model.Node,{doc:null,number:null,id:null,level:null,cursor:null,domNode:null,data:null,nodeCounter:null,jumpUp:function(_a37){
_a37=this._handleOffset(_a37);
var _a38=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number = '"+this.number+"']"+"/ancestor::outline");
if(_a38==null||_a38.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
if(_a37>_a38.length){
_a37=0;
}else{
_a37=_a38.length-_a37;
}
var _a39=_a38.item(_a37);
_a39=new hs.model.Node(_a39,this.doc);
this.doc.nodeCtxt=_a39;
return _a39;
},jumpDown:function(_a3a){
_a3a=this._handleOffset(_a3a);
var _a3b=dojo.dom.firstElement(this.domNode);
var _a3c=1;
while(_a3b!=null&&_a3c<_a3a){
_a3b=dojo.dom.firstElement(_a3b);
_a3c++;
}
var _a3d;
if(_a3b!=null){
_a3d=new hs.model.Node(_a3b,this.doc);
}else{
_a3d=this;
}
this.doc.nodeCtxt=_a3d;
return _a3d;
},jumpBack:function(_a3e){
_a3e=this._handleOffset(_a3e);
var _a3f=this.nodeCounter-_a3e;
if(_a3f<=0){
_a3f=0;
}
var _a40=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter = '"+_a3f+"']");
if(_a40==null||_a40.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a41=_a40.item(0);
_a41=new hs.model.Node(_a41,this.doc);
this.doc.nodeCtxt=_a41;
return _a41;
},jumpNext:function(_a42){
_a42=this._handleOffset(_a42);
var _a43=new Number(this.nodeCounter).valueOf()+_a42;
if(_a43>this.doc._nodeCounter){
_a43=this.doc._nodeCounter;
}
var _a44=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter = '"+_a43+"']");
if(_a44==null||_a44.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a45=_a44.item(0);
_a45=new hs.model.Node(_a45,this.doc);
this.doc.nodeCtxt=_a45;
return _a45;
},jumpBranchEnd:function(){
if(this.domNode.childNodes.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a46=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter = '"+this.nodeCounter+"']"+"/descendant::outline");
if(_a46==null||_a46.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a47=_a46.item(_a46.length-1);
_a47=new hs.model.Node(_a47,this.doc);
this.doc.nodeCtxt=_a47;
return _a47;
},jumpPlexHead:function(){
var _a48=this._getPredecessorDomNodes();
if(_a48.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a49=_a48.item(0);
var _a4a=new hs.model.Node(_a49,this.doc);
this.doc.nodeCtxt=_a4a;
return this.doc.nodeCtxt;
},jumpPlexTail:function(){
var _a4b=this._getSuccessorDomNodes();
if(_a4b.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a4c=_a4b.item(_a4b.length-1);
var _a4d=new hs.model.Node(_a4c,this.doc);
this.doc.nodeCtxt=_a4d;
return this.doc.nodeCtxt;
},jumpSuccessor:function(_a4e){
_a4e=this._handleOffset(_a4e);
var _a4f=this._getSuccessorDomNodes();
if(_a4f.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a50;
if(_a4f.length<_a4e){
_a50=_a4f.item(_a4f.length-1);
}else{
_a50=_a4f.item(_a4e-1);
}
var _a51=new hs.model.Node(_a50,this.doc);
this.doc.nodeCtxt=_a51;
return this.doc.nodeCtxt;
},jumpPredecessor:function(_a52){
_a52=this._handleOffset(_a52);
var _a53=this._getPredecessorDomNodes();
if(_a53.length==0){
this.doc.nodeCtxt=this;
return this.doc.nodeCtxt;
}
var _a54;
if(_a53.length<_a52){
_a54=_a53.item(0);
}else{
_a54=_a53.item(_a53.length-_a52);
}
var _a55=new hs.model.Node(_a54,this.doc);
this.doc.nodeCtxt=_a55;
return this.doc.nodeCtxt;
},jumpBranchSearch:function(_a56){
_a56=new hs.address.NodeLabel(_a56).label;
var _a57=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter = '"+this.nodeCounter+"']"+"/descendant::outline["+"@"+hs.model.Document.HS_NAMESPACE_PREFIX+":label = '"+_a56+"']");
if(_a57==null||_a57.length==0){
throw new hs.exception.Jump("? "+_a56,this.doc,this.doc.address);
}
var _a58=_a57.item(0);
_a58=new hs.model.Node(_a58,this.doc);
this.doc.nodeCtxt=_a58;
return _a58;
},jumpOffset:function(_a59){
_a59=new hs.address.NodeNumber(_a59).number;
var tk=new hs.util.NodeNumberTokenizer(_a59);
var _a5b=this;
while(tk.hasNext()){
var _a5c=tk.next();
var _a5d=_a5b.getChildNodes();
if(_a5d.length<_a5c){
throw new hs.exception.Jump("? "+_a59,this.doc.address,this.doc);
}
var _a5e=_a5d[_a5c-1];
_a5b=_a5e;
}
this.doc.nodeCtxt=_a5b;
return this.doc.nodeCtxt;
},jumpExternal:function(_a5f){
dojo.raise("jumping to an external label not implemented");
},test:function(_a60){
var _a61;
if(dojo.lang.isUndefined(_a60.test)==false){
_a61=_a60.test(this.data);
}else{
_a61=(this.data.indexOf(_a60)!=-1);
}
return _a61;
},getChildNodes:function(){
var _a62=new Array();
var _a63=dojo.dom.firstElement(this.domNode);
while(_a63!=null){
var node=new hs.model.Node(_a63,this.doc);
_a62.push(node);
_a63=dojo.dom.nextElement(_a63);
}
return _a62;
},getParent:function(){
var _a65=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number = '"+this.number+"']"+"/parent::outline");
if(_a65==null||_a65.length==0){
return null;
}
var _a66=_a65.item(0);
_a66=new hs.model.Node(_a66,this.doc);
return _a66;
},_handleOffset:function(_a67){
if(dojo.lang.isUndefined(_a67)){
_a67=1;
}
_a67=new Number(_a67).valueOf();
if(_a67<=0){
throw new hs.exception.Jump("? "+_a67,this.doc,this.doc.address);
}
return _a67;
},_getPredecessorDomNodes:function(){
var _a68="";
var _a69=this.domNode.parentNode;
if(_a69!=null){
_a68=_a69.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number");
}
if(_a68=="0"||_a68==null){
_a68="";
}
var _a6a=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter = '"+this.nodeCounter+"']"+"/preceding::outline["+"starts-with("+"@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number, '"+_a68+"') "+"and @"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":level = '"+this.level+"'"+"]");
if(_a6a==null||dojo.lang.isUndefined(_a6a)){
return new Array();
}else{
return _a6a;
}
},_getSuccessorDomNodes:function(){
var _a6b="";
var _a6c=this.domNode.parentNode;
if(_a6c!=null){
_a6b=_a6c.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number");
}
if(_a6b=="0"||_a6b==null){
_a6b="";
}
var _a6d=this.doc.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":node-counter = '"+this.nodeCounter+"']"+"/following::outline["+"starts-with("+"@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number, '"+_a6b+"') "+"and @"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":level = '"+this.level+"'"+"]");
if(_a6d==null||dojo.lang.isUndefined(_a6d)){
return new Array();
}else{
return _a6d;
}
}});
hs.model.Document=function(_a6e,dom){
this.address=_a6e;
this.dom=dom;
this.origDom=dom;
if(this.dom!=null&&dojo.lang.isUndefined(dom)==false){
this.normalize();
this.jumpOrigin();
this.currentViewspecs=new hs.filter.CurrentViewspecs(null,this);
}
};
hs.model.Document.DEFAULT_FILE_EXTENSION="opml";
hs.model.Document.HS_NAMESPACE_PREFIX="hs";
hs.model.Document.HS_NAMESPACE_URI="http://www.hyperscope.org/hyperscope/opml/public/2006/05/09";
hs.model.Document.HS_NAMESPACE="xmlns:"+hs.model.Document.HS_NAMESPACE_PREFIX+"='"+hs.model.Document.HS_NAMESPACE_URI+"'";
hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX="hs-internal";
hs.model.Document.HS_INTERNAL_NAMESPACE_URI="http://www.hyperscope.org/hyperscope/opml/private/2006/05/09";
hs.model.Document.HS_INTERNAL_NAMESPACE="xmlns:"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+"='"+hs.model.Document.HS_INTERNAL_NAMESPACE_URI+"'";
hs.model.Document._RENDER_XSLT_NAME="render";
hs.model.Document._RENDER_XSLT_URL=djConfig.baseRelativePath+"../hs/xslt/render.xsl";
hs.model.Document._RENDER_XSLT_CONTENT="<?xml version=\"1.0\"?><xsl:stylesheet version=\"1.0\"                xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"                xmlns:hs=\"http://www.hyperscope.org/hyperscope/opml/public/2006/05/09\"                xmlns:hs-internal=\"http://www.hyperscope.org/hyperscope/opml/private/2006/05/09\">               <xsl:output     method=\"html\"    indent=\"yes\"/>        <xsl:param name=\"hs-internal:context-node-number\"/>      <xsl:param name=\"hs-internal:plex-parent-number\"/>      <xsl:param name=\"hs-internal:lineClipping\"/>      <xsl:param name=\"hs-internal:levelClipping\"/>      <xsl:param name=\"hs-internal:show-node-labels\"/>      <xsl:param name=\"hs-internal:show-blank-lines\"/>      <xsl:param name=\"hs-internal:show-node-addressing\"/>      <xsl:param name=\"hs-internal:node-addressing-placement\"/>      <xsl:param name=\"hs-internal:show-node-signatures\"/>      <xsl:param name=\"hs-internal:show-frozen-nodes\"/>      <xsl:param name=\"hs-internal:node-addressing-type\"/>      <xsl:param name=\"hs-internal:structure-clipping\"/>      <xsl:param name=\"hs-internal:content-filtering-type\"/>      <xsl:param name=\"hs-internal:level-indenting-type\"/>    <xsl:template match=\"/\">        <xsl:variable name=\"node-spacing-class\">      <xsl:if test=\"$hs-internal:show-blank-lines = 'true'\">space-nodes</xsl:if>    </xsl:variable>        <div id=\"hyperScopeDocument\" class=\"{$node-spacing-class}\">                <xsl:choose>        <xsl:when test=\"$hs-internal:structure-clipping = 'none'\">          <xsl:apply-templates             select=\"//outline\"/>        </xsl:when>                <xsl:when test=\"$hs-internal:structure-clipping = 'branch'\">          <xsl:apply-templates             select=\"//outline[@hs-internal:number = $hs-internal:context-node-number]/descendant-or-self::outline\"/>        </xsl:when>                <xsl:when test=\"$hs-internal:structure-clipping = 'plex'\">          <xsl:choose>            <xsl:when test=\"$hs-internal:plex-parent-number = 'none'\">              <xsl:apply-templates select=\"//outline\"/>            </xsl:when>                        <xsl:otherwise>              <xsl:apply-templates               select=\"//outline[@hs-internal:number = $hs-internal:plex-parent-number]/descendant::outline\"/>            </xsl:otherwise>          </xsl:choose>        </xsl:when>      </xsl:choose>    </div>  </xsl:template>    <xsl:template name=\"draw-hyperscope-node\">    <xsl:param name=\"level\"/>    <xsl:param name=\"number\"/>    <xsl:param name=\"nid\"/>    <xsl:param name=\"nodeCounter\"/>    <xsl:param name=\"data\"/>    <xsl:param name=\"included\"/>    <xsl:param name=\"includeFailed\"/>    <xsl:param name=\"includedFrom\"/>    <xsl:param name=\"includedType\"/>    <xsl:param name=\"passesContentFilter\"/>            <xsl:variable name=\"indentAmount\">      <xsl:choose>        <xsl:when test=\"$hs-internal:level-indenting-type = 'on'\">          <xsl:value-of select=\"$level * 2\"/>        </xsl:when>        <xsl:when test=\"$hs-internal:level-indenting-type = 'off'\">          0        </xsl:when>      </xsl:choose>    </xsl:variable>            <xsl:variable name=\"includedClass\">      <xsl:if test=\"$included = 'yes'\">        included-node      </xsl:if>    </xsl:variable>    <xsl:variable name=\"includeFailedClass\">      <xsl:if test=\"$includeFailed = 'yes'\">        include-failed      </xsl:if>    </xsl:variable>            <xsl:variable name=\"linkTitle\">      <xsl:if test=\"$included = 'yes'\">Included <xsl:value-of select=\"$includedType\"/> from <xsl:value-of select=\"$includedFrom\"/></xsl:if>    </xsl:variable>            <tr   class=\"node-row {$includedClass} {$includeFailedClass}\"         hs-internal:node-counter=\"{$nodeCounter}\"        hs-internal:number=\"{$number}\"        hs-internal:passes-content-filter=\"{$passesContentFilter}\">              <td class=\"quick-buttons\" valign=\"middle\">        <img src=\"/hyperscope/src/client/images/arrow_up.png\" class=\"quick-button quick-zoom-out\" />        <img src=\"/hyperscope/src/client/images/arrow_down.png\" class=\"quick-button quick-zoom-in\" />        <img src=\"/hyperscope/src/client/images/lines.png\" class=\"quick-button quick-lines\" />      </td>            <td class=\"node-data\">                <div  id=\"number{$number}\"             class=\"node-data-content\"            style=\"margin-left: {$indentAmount}em;\">                                <xsl:choose>            <xsl:when test=\"$hs-internal:show-node-addressing = 'true'                    and $hs-internal:node-addressing-placement = 'left'\">              <xsl:choose>                <xsl:when test=\"$hs-internal:node-addressing-type = 'id'\">                  <a   class=\"node-address\"                     title=\"{$linkTitle}\"                    href=\"#{$nid}\">                    (<xsl:value-of select=\"$nid\"/>)                  </a>                </xsl:when>                <xsl:when test=\"$hs-internal:node-addressing-type = 'number'\">                  <a   class=\"node-address\"                     title=\"{$linkTitle}\"                    href=\"#{$number}\">                    (<xsl:value-of select=\"$number\"/>)                  </a>                </xsl:when>              </xsl:choose>            </xsl:when>                        <xsl:otherwise>                            <a href=\"#\" style=\"display: none;\">&#160;</a>            </xsl:otherwise>          </xsl:choose>                                      <span class=\"output-holder\">            <xsl:value-of disable-output-escaping=\"yes\" select=\"$data\"/>          </span>        </div>      </td>          <td class=\"node-addressing-column\">                <xsl:choose>          <xsl:when test=\"$hs-internal:show-node-addressing = 'true'                  and $hs-internal:node-addressing-placement = 'right'\">            <xsl:choose>              <xsl:when test=\"$hs-internal:node-addressing-type = 'id'\">                <a   class=\"node-address\"                   title=\"{$linkTitle}\"                  href=\"#{$nid}\">                  (<xsl:value-of select=\"$nid\"/>)                </a>              </xsl:when>              <xsl:when test=\"$hs-internal:node-addressing-type = 'number'\">                <a   class=\"node-address\"                   title=\"{$linkTitle}\"                  href=\"#{$number}\">                  (<xsl:value-of select=\"$number\"/>)                </a>              </xsl:when>            </xsl:choose>          </xsl:when>                    <xsl:when test=\"$hs-internal:show-node-addressing = 'false'                  or $hs-internal:node-addressing-placement = 'left'\">                        &#160;          </xsl:when>        </xsl:choose>      </td>    </tr>  </xsl:template>    <xsl:template match=\"outline\">        <xsl:if test=\"@hs-internal:level = $hs-internal:levelClipping            or @hs-internal:level &lt; $hs-internal:levelClipping            or $hs-internal:levelClipping = 'none'            or @hs-internal:number = $hs-internal:context-node-number\">      <xsl:call-template name=\"draw-hyperscope-node\">        <xsl:with-param name=\"level\"><xsl:value-of select=\"@hs-internal:level\"/></xsl:with-param>        <xsl:with-param name=\"number\"><xsl:value-of select=\"@hs-internal:number\"/></xsl:with-param>        <xsl:with-param name=\"nid\"><xsl:value-of select=\"@hs:nid\"/></xsl:with-param>        <xsl:with-param name=\"nodeCounter\"><xsl:value-of select=\"@hs-internal:node-counter\"/></xsl:with-param>        <xsl:with-param name=\"data\"><xsl:value-of select=\"@text\"/></xsl:with-param>        <xsl:with-param name=\"included\"><xsl:value-of select=\"@hs-internal:included\"/></xsl:with-param>        <xsl:with-param name=\"includeFailed\"><xsl:value-of select=\"@hs-internal:include-failed\"/></xsl:with-param>        <xsl:with-param name=\"includedFrom\"><xsl:value-of select=\"@hs-internal:included-from\"/></xsl:with-param>        <xsl:with-param name=\"includedType\"><xsl:value-of select=\"@hs-internal:included-type\"/></xsl:with-param>        <xsl:with-param name=\"passesContentFilter\"><xsl:value-of select=\"@hs-internal:passes-content-filter\"/></xsl:with-param>      </xsl:call-template>    </xsl:if>      </xsl:template></xsl:stylesheet>";
hs.model.Document._initializeXSLT=function(){
dojo.event.connect(dojo,"loaded",function(){
if(hs.model.Document._RENDER_XSLT_CONTENT!=null){
var data=hs.model.Document._RENDER_XSLT_CONTENT;
var _a71=new XSLTProcessor();
var _a72=Sarissa.getDomDocument();
_a72=(new DOMParser()).parseFromString(data,"text/xml");
_a71.importStylesheet(_a72);
hs.model.Document._renderXslt=_a71;
hs.model._loaded();
}else{
var _a73=new Array();
_a73.push({name:hs.model.Document._RENDER_XSLT_NAME,url:hs.model.Document._RENDER_XSLT_URL});
var _a74=new hs.util.XSLTLoader(_a73,function(_a75,_a76){
if(_a75==false){
throw _a76;
}
hs.model.Document._renderXslt=_a74.getXSLT(hs.model.Document._RENDER_XSLT_NAME);
hs.model._loaded();
});
_a74.load();
}
});
};
hs.model.Document._initializeXSLT();
dojo.lang.extend(hs.model.Document,{address:null,dom:null,origDom:null,nodeCtxt:null,currentViewspecs:null,renderedHtml:null,renderedHtmlDom:null,normalize:function(){
var n=new hs.filter.Normalizer();
n.apply(this);
},jumpOrigin:function(){
var _a78=this.getOriginDomNode();
if(_a78==null){
throw new hs.exception.Jump("No origin node in document",this,this.address);
}
var _a79=new hs.model.Node(_a78,this);
this.nodeCtxt=_a79;
return _a79;
},jumpNumber:function(_a7a){
_a7a=new hs.address.NodeNumber(_a7a).number;
var _a7b=this.dom.selectNodes("//outline[@"+hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number = '"+_a7a+"']");
if(_a7b==null||_a7b.length==0){
throw new hs.exception.Jump("? "+_a7a,this,this.address);
}
_a7b=_a7b.item(0);
var _a7c=new hs.model.Node(_a7b,this);
this.nodeCtxt=_a7c;
return _a7c;
},jumpId:function(id){
id=new hs.address.NodeID(id).id;
var _a7e=this.dom.selectNodes("//outline[@"+hs.model.Document.HS_NAMESPACE_PREFIX+":nid = '"+id+"']");
if(_a7e==null||_a7e.length==0){
throw new hs.exception.Jump("? "+id,this,this.address);
}
_a7e=_a7e.item(0);
var _a7f=new hs.model.Node(_a7e,this);
this.nodeCtxt=_a7f;
return _a7f;
},jumpMarker:function(_a80){
_a80=new hs.address.Marker(_a80).name;
var _a81=new hs.util.NodeWalker(this.nodeCtxt);
var _a82=new RegExp("<s*a[ ]+name=s*[\"']"+_a80+"[\"']s*>s*<s*/s*as*>","im");
var _a83=null;
while(_a81.hasNext()){
var node=_a81.next();
if(node.test(_a82)){
_a83=node;
break;
}
}
if(_a83==null){
throw new hs.exception.InvalidAddress("? "+_a80,this,this.address);
}
this.nodeCtxt=_a83;
return this.nodeCtxt;
},jumpLabel:function(_a85,_a86){
_a85=new hs.address.NodeLabel(_a85).label;
var _a87;
if(_a86==hs.commands.JumpConstants.FIRST){
var _a88=this.getOriginDomNode();
if(_a88==null){
throw new hs.exception.Jump("No origin node in document",this,this.address);
}
_a87=new hs.model.Node(_a88,this);
includeCtxt=true;
}else{
if(_a86==hs.commands.JumpConstants.NEXT){
_a87=this.nodeCtxt;
includeCtxt=false;
}else{
throw new hs.exception.Jump("Unknown jump type given to jumpLabel: "+_a86,this,this.address);
}
}
var _a89=new hs.util.NodeWalker(_a87,includeCtxt);
var _a8a=null;
var _a8b=new RegExp("^"+this._escapeData(_a85)+"$","i");
while(_a89.hasNext()){
var node=_a89.next();
if(_a8b.test(node.label)){
_a8a=node;
break;
}
}
if(_a8a==null){
throw new hs.exception.InvalidAddress("? "+_a85,this,this.address);
}
this.nodeCtxt=_a8a;
return this.nodeCtxt;
},jumpWord:function(word,_a8e){
var _a8f=this._escapeData(word);
var _a90=new RegExp("(?:^|[ ])"+_a8f+"(?:$|[ ])");
return this._doSearch(word,_a90,_a8e);
},jumpContent:function(_a91,_a92){
return this._doSearch(_a91,_a91,_a92);
},render:function(){
hs.profile.start("render");
var xslt=this.getRenderXSLT();
xslt.setParameter(hs.model.Document.HS_INTERNAL_NAMESPACE_URI,"context-node-number",this.nodeCtxt.number);
this.currentViewspecs.apply(this);
hs.profile.start("render_xslt");
this.renderedHtmlDom=xslt.transformToDocument(this.dom);
hs.profile.end("render_xslt");
hs.profile.start("innerXML");
hs.profile.end("innerXML");
hs.profile.end("render");
return this.renderedHtml;
},toURL:function(){
var _a94=this.address.clone();
_a94.nodeAddresses=new Array();
if(this.nodeCtxt.number!="0"){
if(this.nodeCtxt.id!=null){
var _a95=new hs.address.NodeID(this.nodeCtxt.id);
_a94.nodeAddresses.push(_a95);
}else{
var _a96=new hs.address.NodeNumber(this.nodeCtxt.number,false);
_a94.nodeAddresses.push(_a96);
}
}
var _a97=this.currentViewspecs.toString();
_a94.viewspecs=new Array();
for(var i=0;i<_a97.length;i++){
var v=new hs.address.Viewspec(_a97.charAt(i));
_a94.viewspecs.push(v);
}
return _a94.toString();
},getRenderXSLT:function(){
return hs.model.Document._renderXslt;
},getOriginDomNode:function(){
var _a9a=this.dom.selectNodes("/opml/body/outline[position() = 1]");
if(_a9a==null||_a9a.length==0){
return null;
}
_a9a=_a9a.item(0);
return _a9a;
},_escapeData:function(data){
data=data.replace(/\\/g,"\\\\");
data=data.replace(/\[/g,"\\[");
data=data.replace(/\]/g,"\\]");
data=data.replace(/\"/g,"\\\"");
data=data.replace(/\'/g,"\\'");
data=data.replace(/\^/g,"\\^");
data=data.replace(/\*/g,"\\*");
data=data.replace(/\+/g,"\\+");
data=data.replace(/\-/g,"\\-");
data=data.replace(/\?/g,"\\?");
data=data.replace(/\|/g,"\\|");
data=data.replace(/\./g,"\\.");
data=data.replace(/\{/g,"\\{");
data=data.replace(/\}/g,"\\}");
data=data.replace(/\,/g,"\\,");
data=data.replace(/\(/g,"\\(");
data=data.replace(/\)/g,"\\)");
data=data.replace(/\:/g,"\\:");
data=data.replace(/\;/g,"\\;");
data=data.replace(/\$/g,"\\$");
data=data.replace(/\=/g,"\\=");
data=data.replace(/\!/g,"\\!");
return data;
},_doSearch:function(_a9c,_a9d,_a9e){
if(_a9c==null||dojo.lang.isUndefined(_a9c)||dojo.string.trim(_a9c)==""){
throw new hs.exception.Jump("? "+_a9c,this,this.address);
}
var _a9f;
var _aa0;
if(_a9e==hs.commands.JumpConstants.FIRST){
var _aa1=this.getOriginDomNode();
if(_aa1==null){
throw new hs.exception.Jump("No origin node in document",this,this.address);
}
_a9f=new hs.model.Node(_aa1,this);
_aa0=true;
}else{
if(_a9e==hs.commands.JumpConstants.NEXT){
_a9f=this.nodeCtxt;
_aa0=false;
}else{
throw new hs.exception.Jump("Unknown jump type: "+_a9e,this,this.address);
}
}
var _aa2=new hs.util.NodeWalker(_a9f,_aa0);
var _aa3=null;
while(_aa2.hasNext()){
var node=_aa2.next();
if(node.test(_a9d)){
_aa3=node;
break;
}
}
if(_aa3==null){
throw new hs.exception.InvalidAddress("? "+_a9c,this,this.address);
}
this.nodeCtxt=_aa3;
return this.nodeCtxt;
}});
hs.model.NodeCursor=function(node){
this._node=node;
};
dojo.lang.extend(hs.model.NodeCursor,{position:0,_hsNode:null,toEnd:function(){
dojo.raise("string positioning to end not implemented");
},toBeginning:function(){
dojo.raise("string positioning to beginning not implemented");
},jumpWords:function(_aa6){
dojo.raise("string positioning to a word not implemented");
},jumpCharacters:function(_aa7){
dojo.raise("string positioning to a character not implemented");
},jumpVisible:function(_aa8){
dojo.raise("string positioning to a visible not implemented");
},jumpInvisible:function(_aa9){
dojo.raise("string positioning to an invisible not implemented");
},jumpLink:function(_aaa){
dojo.raise("string positioning to a link not implemented");
},getCharacter:function(){
dojo.raise("string positioning to a character not implemented");
},getRest:function(){
dojo.raise("string positioning not implemented");
},getWord:function(){
dojo.raise("string positioning not implemented");
},getLink:function(_aab){
var _aac=/<\s*a\s*href\s*=\s*(?:\"|\')([^\'\"]*)(?:\"|\')\s*>/igm;
var _aad=null;
RegExp.lastIndex=0;
_aac.lastIndex=0;
for(var i=0;i<_aab;i++){
_aad=_aac.exec(this._node.data);
}
if(_aad==null||_aad.length!=2){
throw new hs.exception.InvalidAddress("Can not jump to link: "+_aab);
}
var link=_aad[1];
return link;
},getAnchor:function(){
dojo.raise("string positioning to an anchor not implemented");
}});
dojo.provide("hs.commands");
hs.commands={jumpItem:function(_ab0,_ab1,_ab2,_ab3){
if(_ab3!=null&&typeof _ab3!="undefined"){
var url="#:"+_ab3;
var _ab5=new hs.address.Address(url);
var _ab6=_ab5.viewspecs;
for(var i=0;i<_ab6.length;i++){
_ab1.viewspecs[_ab1.viewspecs.length]=_ab6[i];
}
}
var _ab8=function(_ab9,doc,_abb){
if(_abb!=null&&dojo.lang.isUndefined(_abb)==false){
_ab0.call(null,_ab9,doc,_abb);
return;
}
doc.render();
_ab0.call(null,_ab9,doc,_abb);
};
_ab1.resolve(_ab8,true,_ab2);
},jumpFile:function(_abc,_abd,_abe,_abf,_ac0){
var url;
if(dojo.string.startsWith(_abf,"./")||dojo.string.startsWith(_abf,"../")||dojo.string.startsWith(_abf,"/")){
url=_abf;
}else{
url="./"+_abf;
}
if(_ac0!=null&&dojo.string.trim(_ac0)!=""){
url+="#:"+_ac0;
}
var _ac2=new hs.address.Address(url);
hs.commands.jumpItem(_abc,_ac2,_abe);
},jumpOrigin:function(_ac3,_ac4,_ac5,_ac6){
hs.commands._jumpRelative(hs.address.Relative.ORIGIN,_ac3,_ac4,_ac5,_ac6);
},jumpEndBranch:function(_ac7,_ac8,_ac9,_aca){
hs.commands._jumpRelative(hs.address.Relative.BRANCH_END,_ac7,_ac8,_ac9,_aca);
},jumpEndPlex:function(_acb,_acc,_acd){
dojo.raise("jumping to the end of a plex with command bar not implemented");
},jumpNext:function(_ace,_acf,_ad0,_ad1){
hs.commands._jumpRelative(hs.address.Relative.NODE_NEXT,_ace,_acf,_ad0,_ad1);
},jumpBack:function(_ad2,_ad3,_ad4,_ad5){
hs.commands._jumpRelative(hs.address.Relative.NODE_BACK,_ad2,_ad3,_ad4,_ad5);
},jumpSuccessor:function(_ad6,_ad7,_ad8,_ad9){
hs.commands._jumpRelative(hs.address.Relative.NODE_SUCCESSOR,_ad6,_ad7,_ad8,_ad9);
},jumpPredecessor:function(_ada,_adb,_adc,_add){
hs.commands._jumpRelative(hs.address.Relative.NODE_PREDECESSOR,_ada,_adb,_adc,_add);
},jumpUp:function(_ade,_adf,_ae0,_ae1){
hs.commands._jumpRelative(hs.address.Relative.NODE_UP,_ade,_adf,_ae0,_ae1);
},jumpDown:function(_ae2,_ae3,_ae4,_ae5){
hs.commands._jumpRelative(hs.address.Relative.NODE_DOWN,_ae2,_ae3,_ae4,_ae5);
},jumpHead:function(_ae6,_ae7,_ae8,_ae9){
hs.commands._jumpRelative(hs.address.Relative.PLEX_HEAD,_ae6,_ae7,_ae8,_ae9);
},jumpTail:function(_aea,_aeb,_aec,_aed){
hs.commands._jumpRelative(hs.address.Relative.PLEX_TAIL,_aea,_aeb,_aec,_aed);
},jumpLink:function(_aee,_aef,_af0,_af1){
if(typeof _af1!="undefined"&&_af1!=null){
_aef=new hs.address.Address(_af1);
}
hs.commands.jumpItem(_aee,_aef,_af0);
},jumpLabel:function(_af2,_af3,_af4,_af5,_af6,_af7){
var url="#";
if(_af7==hs.commands.JumpConstants.FIRST){
url+=_af5;
}else{
if(_af7==hs.commands.JumpConstants.NEXT){
url+="*"+_af5;
}
}
if(_af6!=null&&typeof _af6!="undefined"){
url+=":"+_af6;
}
_af3=new hs.address.Address(url);
hs.commands.jumpItem(_af2,_af3,_af4,null);
},jumpContent:function(_af9,_afa,_afb,_afc,_afd,_afe){
if(_afb==null||typeof _afb=="undefined"){
throw new hs.exception.Jump("Programming error: "+"You must provide "+"'relativeTo' to "+"hs.commands.jumpWord");
}
var doc=_afb;
doc.jumpContent(_afc,_afe);
_afa=new hs.address.Address("./");
hs.commands.jumpItem(_af9,_afa,_afb,_afd);
},jumpWord:function(_b00,_b01,_b02,_b03,_b04,_b05){
if(_b02==null||typeof _b02=="undefined"){
throw new hs.exception.Jump("Programming error: "+"You must provide "+"'relativeTo' to "+"hs.commands.jumpWord");
}
var doc=_b02;
doc.jumpWord(_b03,_b05);
_b01=new hs.address.Address("./");
hs.commands.jumpItem(_b00,_b01,_b02,_b04);
},setViewspecs:function(_b07,_b08,_b09,_b0a){
var url="#:"+_b0a;
_b08=new hs.address.Address(url);
hs.commands.jumpItem(_b07,_b08,_b09);
},resetViewspecs:function(_b0c,_b0d,_b0e){
var url="#:"+hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS;
_b0d=new hs.address.Address(url);
hs.commands.jumpItem(_b0c,_b0d,_b0e);
},_jumpRelative:function(_b10,_b11,_b12,_b13,_b14){
var _b15=new hs.address.Relative(_b10);
_b12.nodeAddresses[_b12.nodeAddresses.length]=_b15;
if(_b14!=null&&typeof _b14!="undefined"){
var _b16="#:"+_b14;
var _b17=new hs.address.Address(_b16);
var _b18=_b17.viewspecs;
for(var i=0;i<_b18.length;i++){
_b12.viewspecs[_b12.viewspecs.length]=_b18[i];
}
}
hs.commands.jumpItem(_b11,_b12,_b13);
}};
hs.commands.JumpConstants={FIRST:"first",NEXT:"next",LAST:"last",ANY:"any",EXTERNAL:"external"};
dojo.provide("hs.profile");
hs.profile=new function(){
var _b1a={};
var pns=[];
this.start=function(name){
if(!_b1a[name]){
_b1a[name]={iters:0,total:0};
pns[pns.length]=name;
}else{
if(_b1a[name]["start"]){
this.end(name);
}
}
_b1a[name].end=null;
_b1a[name].start=new Date();
};
this.end=function(name){
var ed=new Date();
if((_b1a[name])&&(_b1a[name]["start"])){
with(_b1a[name]){
end=ed;
total+=(end-start);
start=null;
iters++;
}
}else{
return true;
}
};
this.stop=this.end;
this.dump=function(_b1f){
var tbl=document.createElement("table");
with(tbl.style){
border="1px solid black";
borderCollapse="collapse";
}
var hdr=tbl.createTHead();
var _b22=hdr.insertRow(0);
var cols=["Identifier","Calls","Total","Avg"];
for(var x=0;x<cols.length;x++){
var ntd=_b22.insertCell(x);
with(ntd.style){
backgroundColor="#225d94";
color="white";
borderBottom="1px solid black";
borderRight="1px solid black";
fontFamily="tahoma";
fontWeight="bolder";
paddingLeft=paddingRight="5px";
}
ntd.appendChild(document.createTextNode(cols[x]));
}
for(var x=0;x<pns.length;x++){
var prf=_b1a[pns[x]];
this.end(pns[x]);
if(prf.iters>0){
var _b27=tbl.insertRow(true);
var vals=[pns[x],prf.iters,prf.total,parseInt(prf.total/prf.iters)];
for(var y=0;y<vals.length;y++){
var cc=_b27.insertCell(y);
cc.appendChild(document.createTextNode(vals[y]));
with(cc.style){
borderBottom="1px solid gray";
paddingLeft=paddingRight="5px";
if(x%2){
backgroundColor="#e1f1ff";
}
if(y>0){
textAlign="right";
borderRight="1px solid gray";
}else{
borderRight="1px solid black";
}
}
}
}
}
if(_b1f){
var ne=document.createElement("div");
ne.id="profileOutputTable";
with(ne.style){
fontFamily="Courier New, monospace";
fontSize="12px";
lineHeight="16px";
borderTop="1px solid black";
padding="10px";
}
if(document.getElementById("profileOutputTable")){
document.body.replaceChild(ne,document.getElementById("profileOutputTable"));
}else{
document.body.appendChild(ne);
}
ne.appendChild(tbl);
}
return tbl;
};
};
dojo.kwCompoundRequire({common:["dojo.html","dojo.html.extras","dojo.html.shadow"]});
dojo.provide("dojo.html.*");
dojo.provide("hs.ui");
dojo.require("hs.profile");
dojo.require("hs.model");
dojo.require("dojo.event.*");
dojo.require("dojo.uri");
dojo.require("dojo.html.*");
dojo.require("dojo.style");
dojo.require("dojo.lfx.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.FloatingPane");
hs.ui={markingMode:false,currentHyDoc:null,currentRenderedDoc:null,commandBar:null,_addr:null,_reportDocTime:true,_pageLoadRecoveryTimes:0,initialize:function(){
hs.ui._initializeDebugging();
if(djConfig.profiling==true){
hs.ui._initializeProfiling();
}
hs.ui._initializeWidgets();
var _b2c=dojo.byId("docWindow");
hs.ui.currentRenderedDoc=new hs.ui.RenderedDocument(_b2c);
hs.ui.commandBar=new hs.ui.CommandBar();
var _b2d=dojo.widget.byId("hsToolbar");
_b2d.initializeTurboModeSettings();
hs.profile.start("resolve");
hs.ui._currentLocation=window.location.toString();
hs.ui.resolveLocation(hs.ui._currentLocation);
window.setInterval(hs.ui._checkBrowserURL,200);
hs.ui._handleResizing();
},resolveLocation:function(url){
try{
if(typeof url=="string"){
hs.ui._addr=new hs.address.Address(url);
}else{
hs.ui._addr=url;
}
hs.ui.printStatus("Resolving...");
var _b2f=hs.ui.addressResolved;
var _b30=hs.ui._addr;
var _b31=hs.ui.currentHyDoc;
hs.commands.jumpItem(_b2f,_b30,_b31);
}
catch(exp){
hs.ui.reportError(exp);
}
},addressResolved:function(_b32,doc,_b34){
hs.profile.end("resolve");
if(hs.ui.commandBar.visible==true){
hs.ui.commandBar.reset();
}
if(_b34!=null){
if(hs.ui.currentHyDoc==null&&hs.ui._pageLoadRecoveryTimes<2){
hs.ui._pageLoadRecoveryTimes++;
var url=_b32.fileInfo.toString();
var _b36="Invalid HyperScope address given on URL: "+_b34+"; press enter to load "+"URL without address portion";
alert(_b36);
hs.ui.resolveLocation(url);
}else{
hs.ui.reportError(_b34);
}
return;
}
hs.ui.currentHyDoc=doc;
var _b37=doc.address.toString();
dojo.byId("current-link").setAttribute("href",_b37);
var _b38=dojo.widget.byId("viewspecsOverlay");
if(_b38.isShowing()==true){
_b38.reset();
}
hs.ui.currentRenderedDoc.write(hs.ui.currentHyDoc);
},printStatus:function(msg,_b3a){
this.clearStatus();
var _b3b=dojo.byId("statusArea");
_b3b.style.display="block";
_b3b.innerHTML=msg;
if(typeof _b3a!="undefined"){
window.setTimeout(function(){
hs.ui.fadeStatus();
},_b3a);
}
},clearStatus:function(){
var _b3c=dojo.byId("statusArea");
_b3c.style.display="none";
_b3c.innerHTML="";
},fadeStatus:function(){
var _b3d=dojo.byId("statusArea");
if(_b3d.style.display=="none"){
return;
}
var anim=dojo.lfx.html.fadeOut(_b3d,700,false,function(){
hs.ui.clearStatus();
_b3d.style.filter="alpha(opacity=100)";
_b3d.style.opacity="1";
});
anim.play();
},reportError:function(msg){
hs.ui.printStatus(msg,3000);
},dumpProfiling:function(){
if(djConfig.profiling==true){
var _b40=new Date().getTime();
hs.profile.end("programtime");
hs.profile.dump(true);
if(hs.ui._reportDocTime==true){
var _b41=window.parent.docStartTime;
var _b42=_b40-_b41;
var _b43=document.createElement("div");
_b43.innerHTML="<div id=\"docProfile\">"+"total time for everything = "+_b42+" ms"+"</div>";
dojo.html.body().appendChild(_b43);
hs.ui._reportDocTime=false;
}
}
},_initializeDebugging:function(){
dojo.debug=hs.debug;
debug=hs.debug;
},_checkBrowserURL:function(){
var _b44=window.location.toString();
if(hs.ui._currentLocation!=_b44){
hs.ui._currentLocation=_b44;
hs.ui.resolveLocation(hs.ui._currentLocation);
}
},_initializeWidgets:function(){
dojo.hostenv.makeWidgets();
},_initializeProfiling:function(){
dojo.html.addClass(dojo.html.body(),"profiling");
hs.profile.start("programtime");
},_handleResizing:function(){
if(dojo.render.html.ie!=true){
dojo.event.connect(window,"onresize",function(){
var addr=hs.ui.currentHyDoc.address;
if(addr!=null&&typeof addr!="undefined"){
hs.ui.resolveLocation(addr);
}
});
}
}};
hs.debug=function(msg){
if(djConfig.isDebug==false||dojo.lang.isUndefined(djConfig.isDebug)){
return;
}
msg="DEBUG: "+msg;
dojo.hostenv.println(msg);
};
if(djConfig.testing==true){
dojo.debug=debug;
}
hs.ui.RenderedDocument=function(_b47){
this._iframeDoc=dojo.byId("docFrame").contentDocument;
if(dojo.lang.isUndefined(this._iframeDoc)){
this._iframeDoc=dojo.byId("docFrame").contentWindow.document;
}
this._resultWriter=new hs.ui.ResultWriter(this,this._iframeDoc,this._onFinishedWriting);
};
dojo.lang.extend(hs.ui.RenderedDocument,{_iframeDoc:null,_contextNodeNumber:null,_resultWriter:null,_selectedRow:null,write:function(doc){
this._resultWriter.write(doc);
},focusContextNode:function(){
var _b49="number"+this._contextNodeNumber;
var ctxt=this._iframeDoc.getElementById(_b49);
if(ctxt!=null&&typeof ctxt!="undefined"){
if(hs.ui.commandBar.visible==true){
document.body.focus();
}
ctxt.scrollIntoView(true);
}
},displayDocument:function(_b4b){
this._contextNodeNumber=_b4b;
dojo.event.disconnect(this._iframeDoc.body,"onmouseover",this,this._handleMouse);
dojo.event.disconnect(this._iframeDoc.body,"onmouseout",this,this._handleMouse);
dojo.event.connect(this._iframeDoc.body,"onmouseover",this,this._handleMouse);
dojo.event.connect(this._iframeDoc.body,"onmouseout",this,this._handleMouse);
dojo.event.disconnect(this._iframeDoc.body,"onclick",this,this._handleClick);
dojo.event.connect(this._iframeDoc.body,"onclick",this,this._handleClick);
},clearSelection:function(){
if(this._selectedRow!=null){
dojo.html.removeClass(this._selectedRow,"selected-row");
}
},_onFinishedWriting:function(_b4c,_b4d){
hs.ui.commandBar._onRenderedDocument(_b4d);
hs.ui.dumpProfiling();
},_handleMouse:function(evt){
if(hs.ui.markingMode==true){
return;
}
var tg=evt.target;
while(tg!=null&&dojo.html.hasClass(tg,"node-row")==false){
tg=tg.parentNode;
}
if(tg==null||typeof tg=="undefined"){
return;
}
var _b50=evt.type.toLowerCase();
if(_b50=="mouseover"){
dojo.html.addClass(tg,"selected-row");
this._selectedRow=tg;
}else{
if(_b50=="mouseout"){
dojo.html.removeClass(tg,"selected-row");
this._selectedRow=null;
}
}
},_handleClick:function(evt){
if(hs.ui.markingMode==true){
this._handleMark(evt);
}else{
var tg=evt.target;
if(tg.nodeName.toLowerCase()=="a"){
evt.stopPropagation();
evt.preventDefault(true);
hs.ui.resolveLocation(tg.href);
}else{
if(dojo.html.hasClass(tg,"quick-button")){
evt.stopPropagation();
evt.preventDefault(true);
this._handleQuickButton(tg);
}
}
}
},_handleQuickButton:function(tg){
var _b54;
var _b55;
var _b56=tg.parentNode;
while(_b56!=null&&_b56.nodeName.toLowerCase()!="tr"){
_b56=_b56.parentNode;
}
var _b57=_b56.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number");
if(dojo.html.hasClass(tg,"quick-zoom-out")){
_b55="ebthz";
if(_b57=="0"){
_b54="0";
}else{
if(_b57.length==1){
_b54="0";
}else{
_b54=_b57.substring(0,_b57.length-1);
}
}
}else{
if(dojo.html.hasClass(tg,"quick-zoom-in")){
_b55="ebthz";
_b54=_b57;
}else{
if(dojo.html.hasClass(tg,"quick-lines")){
_b55="wyh";
_b54=_b57;
}
}
}
var url="#"+_b54+":"+_b55;
hs.ui.resolveLocation(url);
},_handleMark:function(evt){
var tg=evt.target;
if(tg&&tg.nodeName&&tg.nodeName.toLowerCase()=="a"){
evt.stopPropagation();
evt.preventDefault(true);
}
var mark=new hs.ui.Mark(evt);
if(mark.invalidMark==true){
return;
}
dojo.event.topic.publish("/mark",mark);
}});
dojo.widget.defineWidget("hs.ui.ViewspecOverlay",dojo.widget.HtmlWidget,{widgetType:"ViewspecOverlay",isContainer:true,templateString:"<div 	dojoType=\"FloatingPane\" \n		id=\"${this.widgetId}Pane\"\n		hasShadow=\"true\" \n		title=\"Set View\" \n		resizable=\"false\"\n		displayCloseAction=\"false\"\n		constrainToContainer=\"true\"\n		dojoAttachPoint=\"viewOverlayPane\"\n		class=\"viewspecOverlay initial-overlay-state\">\n\n	<table	class=\"viewTable lessMode\" \n			dojoAttachPoint=\"viewTable\"\n			width=\"100%\" \n			cellpadding=\"0\" \n			cellspacing=\"0\">\n		\n		<tbody>\n	\n			<tr valign=\"middle\">\n				<td colspan=\"4\" width=\"50%\">\n					<!-- \n						An embedded table is the only way to get the right-hand\n						lines to the right of our section titles to run all\n						the way to the right side and line up independent of\n						font and screen size.\n					-->\n					<table cellpadding=\"2\" cellspacing=\"0\" width=\"100%\">\n						<tr>\n							<td width=\"10%\">\n								<hr noshade=\"true\" size=\"1px\" />\n							</td>\n							\n							<td width=\"5%\">\n								Show\n							</td>\n							\n							<td class=\"line-right-show\">\n								<hr noshade=\"true\" size=\"1px\" />\n							</td>\n						</tr>\n					</table>\n				</td>\n				\n				<td colspan=\"4\" width=\"50%\">\n					<table cellpadding=\"2\" cellspacing=\"0\" width=\"100%\">\n						<tr>\n							<td width=\"10%\">\n								<hr noshade=\"true\" size=\"1px\" />\n							</td>\n							\n							<td width=\"8%\">\n								Outline\n							</td>\n							\n							<td>\n								<hr noshade=\"true\" size=\"1px\" />\n							</td>\n						</tr>\n					</table>\n				</td>\n			</tr>\n	\n			<tr valign=\"middle\">\n				<td width=\"3%\" class=\"viewspecLetter\">y</td>\n				<td width=\"3%\" class=\"viewspecLetter\">z</td>\n				<td width=\"3%\">\n					<input	dojoAttachPoint=\"showBlankLines\" \n							dojoAttachEvent=\"onclick: _toggleBlankLines\"\n							type=\"checkbox\" />\n				</td>\n				<td width=\"41%\">Blank lines</td>\n				\n				<td width=\"3%\" class=\"viewspecLetter\"></td>\n				<td width=\"3%\" class=\"viewspecLetter\">x</td>\n				<td width=\"3%\">\n					<input	dojoAttachPoint=\"showFirstOutline\" \n							dojoAttachEvent=\"onclick: _showFirstOutline\"\n							type=\"checkbox\" />\n				</td>\n				\n				<td width=\"40%\">1st line and level</td>\n			</tr>\n			\n			<tr valign=\"middle\">\n				<td width=\"3%\" class=\"viewspecLetter\">m</td>\n				<td width=\"3%\" class=\"viewspecLetter\">n</td>\n				<td width=\"3%\">\n					<input	type=\"checkbox\" \n							dojoAttachEvent=\"onclick: _toggleNodeAddressing\"\n							dojoAttachPoint=\"showNodeAddressing\" />\n				</td>\n				<td width=\"41%\">Numbering</td>\n				\n				<td width=\"3%\" class=\"viewspecLetter\"></td>\n				<td width=\"3%\" class=\"viewspecLetter\">w</td>\n				<td width=\"3%\">\n					<input	dojoAttachPoint=\"showAllOutline\" \n							dojoAttachEvent=\"onclick: _showAllOutline\"\n							type=\"checkbox\" />\n				</td>\n				\n				<td width=\"40%\">All lines and levels</td>\n			</tr>\n			\n			<tr valign=\"middle\" class=\"advanced\">\n				<td colspan=\"4\" width=\"50%\">\n					<!-- Placement Options -->\n					<table	class=\"placementTable\" width=\"100%\"\n							cellpadding=\"0\" cellspacing=\"0\">\n						<tbody>		\n							<tr valign=\"middle\">\n								<td	width=\"5%\" \n									class=\"viewspecLetter first-column\">H</td>\n								<td	width=\"4%\" \n									class=\"viewspecLetter\">G</td>\n								\n								<td width=\"3%\">\n									<input	type=\"radio\" \n											dojoAttachEvent=\"onclick: _setPlacementLeft\"\n											dojoAttachPoint=\"placementLeft\" />\n								</td>\n								<td width=\"8%\">Left</td>\n								\n								<td width=\"3%\">\n									<input	type=\"radio\" \n											dojoAttachEvent=\"onclick: _setPlacementRight\"\n											dojoAttachPoint=\"placementRight\" />\n								</td>\n								<td width=\"77%\">Right</td>\n							</tr>\n						</tbody>\n					</table>\n				</td>\n				\n				<td colspan=\"4\" rowspan=\"3\" width=\"50%\">\n					\n					<table	class=\"outlineTable\" width=\"100%\"\n							cellpadding=\"0\" cellspacing=\"0\">\n								\n						<tr valign=\"middle\">\n							<td width=\"4%\" class=\"first-column\"></td>\n							<td colspan=\"2\" width=\"9%\" class=\"header\">Levels</td>\n							<td width=\"5%\"></td>\n							<td colspan=\"2\" width=\"9%\" class=\"header\">Lines</td>\n							<td width=\"73%\"></td>\n						</tr>\n						\n						<tr valign=\"middle\">\n							<td width=\"4%\" class=\"viewspecLetter first-column\">b</td>\n							\n							<!-- \n								9650 is Unicode for an up arrow;\n								9660 is Unicode for a down arrow.\n							-->\n							<td width=\"4%\">\n								<button	dojoAttachPoint=\"levelUp\"\n										dojoAttachEvent=\"onclick: _incrementLevel\">\n									&#9650;\n								</button>\n							</td>\n							\n							<td width=\"4%\" rowspan=\"2\">\n								<input	type=\"textfield\" \n										dojoAttachPoint=\"levelInput\" />\n							</td>\n							\n							<td width=\"4%\"></td>\n							\n							<td width=\"4%\" rowspan=\"2\">\n								<input	type=\"textfield\"\n										class=\"lineInput\"\n										dojoAttachPoint=\"lineInput\"/>\n							</td>\n							\n							<td width=\"4%\">\n								<button	dojoAttachPoint=\"lineUp\"\n										dojoAttachEvent=\"onclick: _incrementLine\">\n										&#9650;\n								</button>\n							</td>\n							\n							<td width=\"73%\" class=\"viewspecLetter letter-r\">r</td>\n						</tr>\n						\n						<tr valign=\"middle\">\n							<td width=\"4%\" class=\"viewspecLetter first-column\">a</td>\n							\n							<td width=\"4%\">\n								<button	dojoAttachPoint=\"levelDown\"\n										dojoAttachEvent=\"onclick: _decrementLevel\">\n									&#9660;\n								</button>\n							</td>\n							\n							<td width=\"4%\"></td>\n							\n							<td width=\"4%\">\n								<button	dojoAttachPoint=\"lineDown\"\n										dojoAttachEvent=\"onclick: _decrementLine\">\n									&#9660;\n								</button>\n							</td>\n							\n							<td width=\"73%\" class=\"viewspecLetter letter-q\">q</td>\n						</tr>\n					</table>\n				</td>\n			</tr>\n			\n			<tr valign=\"top\" class=\"advanced\">\n				<!-- commenting out for future implementation -->\n				<!--\n				<td width=\"3%\" class=\"viewspecLetter\">C</td>\n				<td width=\"3%\" class=\"viewspecLetter\">D</td>\n				<td width=\"3%\">\n					<input	type=\"checkbox\" \n							dojoAttachEvent=\"onclick: _toggleNodeLabels\"\n							dojoAttachPoint=\"showNodeLabels\" />\n				</td>\n				<td width=\"41%\">Labels</td>\n				-->\n				\n				<td width=\"3%\" class=\"viewspecLetter\">O</td>\n				<td width=\"3%\" class=\"viewspecLetter\">P</td>\n				<td width=\"3%\">\n					<input	type=\"checkbox\" \n							dojoAttachEvent=\"onclick: _toggleIncludesOn\"\n							dojoAttachPoint=\"includesOn\" />\n				</td>\n				<td width=\"41%\">Includes on</td>\n				\n				<td colspan=\"4\" width=\"50%\"></td>\n			</tr>\n			\n			<tr valign=\"middle\" class=\"advanced\">\n				<!-- commenting out for future implementation -->\n				<!--\n				<td width=\"3%\" class=\"viewspecLetter\">K</td>\n				<td width=\"3%\" class=\"viewspecLetter\">L</td>\n				<td width=\"3%\">\n					<input	type=\"checkbox\" \n							dojoAttachEvent=\"onclick: _toggleNodeSignatures\"\n							dojoAttachPoint=\"showNodeSignatures\" />\n				</td>\n				<td width=\"41%\">Time signatures</td>\n				-->\n				\n				<td colspan=\"4\" width=\"50%\"></td>\n				\n				<td colspan=\"4\" width=\"50%\"></td>\n			</tr>\n			\n			<tr valign=\"middle\" class=\"advanced\">\n				<td colspan=\"4\" width=\"50%\"></td>\n				\n				<td colspan=\"4\" width=\"50%\">\n					<table cellpadding=\"2\" cellspacing=\"0\" width=\"100%\">\n						<tr>\n							<td width=\"10%\">\n								<hr noshade=\"true\" size=\"1px\" />\n							</td>\n							\n							<td width=\"6%\">\n								Filter\n							</td>\n							\n							<td>\n								<hr noshade=\"true\" size=\"1px\" />\n							</td>\n						</tr>\n					</table>\n				</td>\n			</tr>\n			\n			<tr valign=\"middle\" class=\"advanced\">\n				<td colspan=\"4\" width=\"50%\"></td>\n				\n				<td width=\"3%\" class=\"viewspecLetter\">i</td>\n				<td width=\"3%\" class=\"viewspecLetter\">j</td>\n				<td width=\"3%\">\n					<input	type=\"checkbox\" \n							dojoAttachEvent=\"onclick: _toggleFilter\"\n							dojoAttachPoint=\"applyFilter\" />\n				</td>\n				<td width=\"40%\">Apply filter:</td>\n			</tr>\n			\n			<tr valign=\"middle\" class=\"advanced\">\n				<td colspan=\"4\" width=\"50%\"></td>\n				\n				<td colspan=\"4\" width=\"50%\">\n					<input	class=\"filterInput\" \n							type=\"textarea\" \n							dojoAttachPoint=\"filterInput\" />\n				</td>\n			</tr>\n			\n			<tr valign=\"middle\">\n				<td colspan=\"8\" width=\"100%\">\n					<hr noshade=\"true\" size=\"1px\" />\n				</td>\n			</tr>\n			\n			<tr>\n				<td colspan=\"8\" width=\"100%\" valign=\"middle\">\n					Selected viewspecs:\n					<input	type=\"textfield\" \n							class=\"selected-viewspecs-input\"\n							dojoAttachEvent=\"onkeyup: _toggleSelectedViewspecs; onblur: _printSelectedViewspecs\"\n							dojoAttachPoint=\"selectedViewspecs\" />\n							\n					<span	class=\"selected-viewspecs-error\"\n							dojoAttachPoint=\"errorArea\">\n					</span>\n				</td>\n			</tr>\n			\n			<tr>\n				<td colspan=\"8\" width=\"100%\" valign=\"middle\">\n					<div class=\"viewButtons\">\n						<!--\n							Commented out for future implementation.\n						-->\n						<!--\n						<button class=\"viewHelpButton\">?</button>\n						-->\n						\n						<button	class=\"viewToggleAdvancedButton\"\n								dojoAttachEvent=\"onclick: _toggleAdvanced\"\n								dojoAttachPoint=\"advancedButton\">\n							More&nbsp;&#9660;\n						</button>\n						\n						<button	class=\"viewResetButton\" \n								dojoAttachEvent=\"onclick: _handleReset\">Reset</button>\n						<button	class=\"viewCancelButton\"\n								dojoAttachEvent=\"onclick: _handleCancel\">Cancel</button>\n						<button	class=\"viewApplyButton\"\n								dojoAttachPoint=\"applyButton\"\n								dojoAttachEvent=\"onclick: _handleApply\">Apply</button>\n					</div>\n				</td>\n			</tr>\n		</tbody>\n	</table>\n</div>",templateCssString:".viewspecOverlay{\n	width: 35em;\n	z-index: 2;\n	position: absolute;\n	font-size: 9pt;\n}\n\n/**\n	Our floating pane's nifty drop shadow depends\n	on being displayed in order to calculate\n	it's shadow; however, when we combine this\n	with not being displayed on page load and our\n	nifty fade in animation to display the overlay,\n	the shadow gets messed up. This is a trick below\n	to 'hide' the jump overlay offscreen but 'visible'\n	so the shadow can be calculated.\n*/\n.initial-overlay-state{\n	left: -1000px !important;\n	top: -1000px !important;\n}\n\n.lessMode .advanced{\n	display: none;\n}\n\n.line-right-show{\n	padding-right: 15px;\n}\n\n.viewspecOverlay table{\n	border: 0px;\n	font-size: 9pt;\n}\n\n.viewspecOverlay input{\n	display: inline;\n	padding-right: 2px;\n}\n\n.viewspecLetter{\n	color: #778BBB; /* slate blue */\n	padding-right: 2px;\n	font-size: 9pt;\n	text-align: center;\n}\n\n.outlineTable,\n.outlineTable .viewspecLetter,\n.placementTable,\n.placementTable .viewspecLetter{\n	font-size: 7pt;\n}\n\n.outlineTable button{\n	font-size: 7pt;\n	padding: 0px;\n	\n	/** \n		Prevents content from wobbling\n		on Firefox when button toggles\n		between disabled and non-disabled\n		mode.\n	*/\n	height: 2em;\n}\n\n.outlineTable .header{\n	text-align: center;\n}\n\n.outlineTable input{\n	width: 2em;\n	margin-right: 2px;\n}\n\n\n/** \n	Using the rule .placementTable {}\n	doesn't work on Internet Explorer,\n	so we have to push the padding over\n	on each of the 'first columns'\n	using a class. \n*/\n.placementTable .first-column,\n.outlineTable .first-column{\n	padding-left: 35px;\n}\n\n.letter-w,\n.letter-x{\n	text-align: right;\n}\n\n.letter-x{\n	padding-right: 4px;\n}\n\n.letter-r,\n.letter-q{\n	text-align: left;\n	padding-left: 3px;\n}\n\n.filterInput{\n	width: 60%;\n	height: 2em;\n	margin-left: 35px;\n}\n\n.lineInput{\n	text-align: right;\n}\n\n.selected-viewspecs-input{\n	width: 8em;\n}\n\n.selected-viewspecs-error{\n	color: red;\n	margin-left: 5px;\n}\n\n.viewHelpButton{\n	width: 3em;\n}\n\n.viewHelpButton,\n.viewToggleAdvancedButton{\n	float: left;\n	margin-right: 4px;\n}\n\n.viewApplyButton,\n.viewCancelButton,\n.viewResetButton{\n	float: right;\n	margin-left: 4px;\n}\n\n.viewButtons{\n	padding-top: 0.8em;\n}			",templateCssPath:dojo.uri.dojoUri("src/hs/templates/ViewspecOverlay.css"),_mark:null,_showingMore:false,_UP_ARROW:"&#9650;",_DOWN_ARROW:"&#9660;",_blankLinesDirty:false,_nodeAddressingDirty:false,_nodeLabelsDirty:false,_nodeSignaturesDirty:false,_includesOnDirty:false,_outlineDirty:false,_applyFilterDirty:false,postCreate:function(){
this.width=dojo.style.getOuterWidth(this.domNode);
this.height=dojo.style.getOuterHeight(this.domNode);
var _b5c=this.height+50;
var _b5d=this.width;
this.viewOverlayPane.style.width=_b5d+"px";
this.viewOverlayPane.style.height=_b5c+"px";
this._lessModeHeight=_b5c;
},isShowing:function(){
var _b5e=dojo.widget.byId(this.widgetId+"Pane");
if(dojo.html.hasClass(_b5e.domNode,"initial-overlay-state")){
return false;
}else{
return _b5e.isShowing();
}
},reset:function(){
this._handleReset();
},show:function(){
this.selectedViewspecs.value="";
this._blankLinesDirty=false;
this._nodeAddressingDirty=false;
this._nodeLabelsDirty=false;
this._nodeSignaturesDirty=false;
this._includesOnDirty=false;
this._outlineDirty=false;
this._applyFilterDirty=false;
var _b5f=null;
if(hs.ui.currentHyDoc!=null){
this._resetViewspecs(hs.ui.currentHyDoc.currentViewspecs);
this._printSelectedViewspecs();
}
var _b60=dojo.widget.byId(this.widgetId+"Pane");
_b60.bringToTop();
dojo.html.removeClass(_b60.domNode,"initial-overlay-state");
var _b61=dojo.byId("toolbarViewspecsButton");
var _b62=dojo.html.getOuterWidth(_b61);
var _b63=dojo.html.getViewportWidth();
var _b64=dojo.style.getAbsoluteY(_b61,false)+_b62/2;
var _b65=dojo.html.getOuterHeight(dojo.byId("toolbar"));
var endY=_b65+35;
if(dojo.render.html.ie!=true){
dojo.style.setOpacity(_b60.domNode,0);
}
dojo.style.show(_b60.domNode);
var _b67=new Array();
if(dojo.render.html.ie!=true){
_b67.push({property:"opacity",start:0,end:1});
}
_b67.push({property:"right",start:40,end:40});
_b67.push({property:"top",start:_b64,end:endY});
var anim=dojo.lfx.propertyAnimation(_b60.domNode,_b67,250);
dojo.event.connect(anim,"onEnd",dojo.lang.hitch(this,function(){
this.selectedViewspecs.select();
}));
anim.play();
},hide:function(){
var _b69=dojo.widget.byId(this.widgetId+"Pane");
var _b6a=dojo.html.getViewportWidth();
var _b6b=dojo.html.getOuterHeight(dojo.byId("toolbar"));
var _b6c=_b6b+35;
var _b6d=dojo.byId("toolbarViewspecsButton");
var _b6e=dojo.html.getOuterWidth(_b6d);
var endY=dojo.style.getAbsoluteY(_b6d,false)+_b6e/2;
var _b70=new Array();
if(dojo.render.html.ie!=true){
_b70.push({property:"opacity",start:1,end:0});
}
_b70.push({property:"right",start:40,end:40});
_b70.push({property:"top",start:_b6c,end:endY});
var anim=dojo.lfx.propertyAnimation(_b69.domNode,_b70,250);
dojo.event.connect(anim,"onEnd",function(){
dojo.style.hide(_b69.domNode);
});
anim.play();
},_handleApply:function(){
if(this.applyButton.disabled==true){
return;
}
this._printSelectedViewspecs();
var _b72=this.selectedViewspecs.value;
var url="#:"+_b72;
if(this.applyFilter.checked==true){
var _b74=this.filterInput.value;
if(dojo.string.startsWith(_b74,"\"")==false&&dojo.string.startsWith(_b74,"/")==false){
_b74="\""+_b74+"\"";
}
url+=" ;"+_b74+";";
}
hs.ui.resolveLocation(url);
this._resetDirty();
this.selectedViewspecs.select();
},_handleCancel:function(){
this.hide();
},_handleReset:function(){
this.selectedViewspecs.value="";
this._resetDirty();
var _b75=null;
if(hs.ui.currentHyDoc!=null){
this._resetViewspecs(hs.ui.currentHyDoc.currentViewspecs);
this._printSelectedViewspecs();
}
},_resetDirty:function(){
this._blankLinesDirty=false;
this._nodeAddressingDirty=false;
this._nodeLabelsDirty=false;
this._nodeSignaturesDirty=false;
this._includesOnDirty=false;
this._outlineDirty=false;
this._applyFilterDirty=false;
},_resetViewspecs:function(_b76){
if(_b76.showBlankLines()){
this.showBlankLines.checked=true;
}else{
this.showBlankLines.checked=false;
}
var _b77=_b76.getLevelClipping();
var _b78=_b76.getLineClipping();
if(_b77==1&&_b78==1){
this._showFirstOutline();
}else{
if(_b77==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING&&_b78==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this._showAllOutline();
}else{
this._showOutlineNumbers(_b77,_b78);
}
}
if(_b76.showNodeAddressing()){
this.showNodeAddressing.checked=true;
this.placementLeft.disabled=undefined;
this.placementRight.disabled=undefined;
if(_b76.getNodeAddressingPlacement()==hs.filter.ViewspecConstants.LEFT){
this.placementLeft.checked=true;
this.placementRight.checked=false;
}else{
this.placementLeft.checked=false;
this.placementRight.checked=true;
}
}else{
this.showNodeAddressing.checked=false;
this.placementLeft.disabled=true;
this.placementRight.disabled=true;
}
if(_b76.runSequenceGenerators()){
this.includesOn.checked=true;
}else{
this.includesOn.checked=false;
}
if(_b76.getContentFilterType()==hs.filter.ViewspecConstants.NO_FILTERING){
this.applyFilter.checked=false;
this.filterInput.disabled=true;
}else{
if(_b76.getContentFilterType()==hs.filter.ViewspecConstants.FILTER_ALL){
this.applyFilter.checked=true;
this.filterInput.disabled=undefined;
var _b79=hs.ui.currentHyDoc.address.contentFilter;
if(_b79!=null){
this.filterInput.value=_b79.toString();
}
}else{
if(_b76.getContentFilterType()==hs.filter.ViewspecConstants.NEXT_FILTERED_NODE){
this.applyFilter.checked=false;
this.filterInput.disabled=true;
}
}
}
},_showFirstOutline:function(evt){
this.showFirstOutline.checked=true;
this.showAllOutline.checked=false;
this.levelInput.value="1";
this.lineInput.value="1";
this.levelUp.disabled=undefined;
this.levelDown.disabled=undefined;
this.lineUp.disabled=undefined;
this.lineDown.disabled=true;
if(typeof evt!="undefined"){
this._outlineDirty=true;
this._printSelectedViewspecs();
}
},_showAllOutline:function(evt){
this.showFirstOutline.checked=false;
this.showAllOutline.checked=true;
this.levelInput.value=hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
this.lineInput.value=hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
this.levelUp.disabled=true;
this.levelDown.disabled=undefined;
this.lineUp.disabled=true;
this.lineDown.disabled=undefined;
if(typeof evt!="undefined"){
this._outlineDirty=true;
this._printSelectedViewspecs();
}
},_showOutlineNumbers:function(_b7c,_b7d){
this.showFirstOutline.checked=false;
this.showAllOutline.checked=false;
this.levelInput.value=_b7c;
this.lineInput.value=_b7d;
this.levelUp.disabled=undefined;
this.levelDown.disabled=undefined;
if(_b7c==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
this.levelUp.disabled=true;
}
if(_b7d==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this.lineUp.disabled=true;
}
if(_b7c==0){
this.levelDown.disabled=true;
}
if(_b7d==1){
this.lineDown.disabled=true;
}
},_incrementLevel:function(){
this.showFirstOutline.checked=false;
this.showAllOutline.checked=false;
this.levelInput.value=new Number(this.levelInput.value).valueOf()+1;
this.levelUp.disabled=undefined;
this.levelDown.disabled=undefined;
if(this.levelInput.value==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
this.levelUp.disabled=true;
}
if(this.levelInput.value==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING&&this.lineInput.value==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this._showAllOutline();
}else{
if(this.levelInput.value==1&&this.lineInput.value==1){
this._showFirstOutline();
}
}
this._outlineDirty=true;
this._printSelectedViewspecs();
},_decrementLevel:function(){
this.showFirstOutline.checked=false;
this.showAllOutline.checked=false;
this.levelInput.value=new Number(this.levelInput.value).valueOf()-1;
this.levelUp.disabled=undefined;
this.levelDown.disabled=undefined;
if(this.levelInput.value==0){
this.levelDown.disabled=true;
}
if(this.levelInput.value==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING&&this.lineInput.value==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this._showAllOutline();
}else{
if(this.levelInput.value==1&&this.lineInput.value==1){
this._showFirstOutline();
}
}
this._outlineDirty=true;
this._printSelectedViewspecs();
},_incrementLine:function(){
this.showFirstOutline.checked=false;
this.showAllOutline.checked=false;
this.lineInput.value=new Number(this.lineInput.value).valueOf()+1;
this.lineUp.disabled=undefined;
this.lineDown.disabled=undefined;
if(this.lineInput.value==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this.lineUp.disabled=true;
}
if(this.levelInput.value==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING&&this.lineInput.value==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this._showAllOutline();
}else{
if(this.levelInput.value==1&&this.lineInput.value==1){
this._showFirstOutline();
}
}
this._outlineDirty=true;
this._printSelectedViewspecs();
},_decrementLine:function(){
this.showFirstOutline.checked=false;
this.showAllOutline.checked=false;
this.lineInput.value=new Number(this.lineInput.value).valueOf()-1;
this.lineUp.disabled=undefined;
this.lineDown.disabled=undefined;
if(this.lineInput.value==1){
this.lineDown.disabled=true;
}
if(this.levelInput.value==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING&&this.lineInput.value==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
this._showAllOutline();
}else{
if(this.levelInput.value==1&&this.lineInput.value==1){
this._showFirstOutline();
}
}
this._outlineDirty=true;
this._printSelectedViewspecs();
},_toggleBlankLines:function(){
this._blankLinesDirty=true;
this._printSelectedViewspecs();
},_toggleNodeAddressing:function(){
if(this.showNodeAddressing.checked==true){
this.showNodeAddressing.checked=true;
this.placementLeft.disabled=undefined;
this.placementRight.disabled=undefined;
if(this.placementLeft.checked==false&&this.placementRight.checked==false){
this.placementLeft.checked=true;
}
}else{
this.showNodeAddressing.checked=false;
this.placementLeft.disabled=true;
this.placementRight.disabled=true;
}
this._nodeAddressingDirty=true;
this._printSelectedViewspecs();
},_setPlacementLeft:function(){
this.placementLeft.checked=true;
this.placementRight.checked=false;
this._nodeAddressingDirty=true;
this._printSelectedViewspecs();
},_setPlacementRight:function(){
this.placementLeft.checked=false;
this.placementRight.checked=true;
this._nodeAddressingDirty=true;
this._printSelectedViewspecs();
},_toggleNodeLabels:function(){
this._nodeLabelsDirty=true;
this._printSelectedViewspecs();
},_toggleNodeSignatures:function(){
this._nodeSignaturesDirty=true;
this._printSelectedViewspecs();
},_toggleIncludesOn:function(){
this._includesOnDirty=true;
this._printSelectedViewspecs();
},_toggleFilter:function(){
if(this.applyFilter.checked==true){
this.filterInput.disabled=undefined;
}else{
this.filterInput.disabled=true;
}
this._applyFilterDirty=true;
this._printSelectedViewspecs();
},_printSelectedViewspecs:function(){
var _b7e=new String();
if(this._blankLinesDirty==true){
if(this.showBlankLines.checked==true){
_b7e+="y";
}else{
_b7e+="z";
}
}
if(this._nodeAddressingDirty==true){
if(this.showNodeAddressing.checked==true){
_b7e+="m";
if(this._showingMore){
if(this.placementLeft.checked==true){
_b7e+="H";
}else{
if(this.placementRight.checked==true){
_b7e+="G";
}
}
}
}else{
_b7e+="n";
}
}
if(this._showingMore){
if(this._includesOnDirty==true){
if(this.includesOn.checked==true){
_b7e+="O";
}else{
_b7e+="P";
}
}
}
if(this._outlineDirty==true){
if(this.showFirstOutline.checked==true){
_b7e+="x";
}else{
if(this.showAllOutline.checked==true){
_b7e+="w";
}else{
if(this._showingMore){
var _b7f=new Number(this.levelInput.value).valueOf();
var _b80=new Number(this.lineInput.value).valueOf();
_b7e=this._writeLevelClipping(_b7f,_b80,_b7e);
_b7e=this._writeLineClipping(_b7f,_b80,_b7e);
}
}
}
}
if(this._showingMore){
if(this._applyFilterDirty==true){
if(this.applyFilter.checked==true){
_b7e+="i";
}else{
_b7e+="j";
}
}
}
this.selectedViewspecs.value=this._filterViewspecs(_b7e);
},_writeLineClipping:function(_b81,_b82,_b83){
if(_b82==1){
_b83+="t";
}else{
if(_b82==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
_b83+="s";
}else{
var _b84=hs.filter.ViewspecConstants.MAX_LINE_CLIPPING-_b82;
if(_b84<=_b82){
_b83+="s";
for(var i=_b84;i>0;i--){
_b83+="q";
}
}else{
_b83+="t";
for(var i=2;i<=_b82;i++){
_b83+="r";
}
}
}
}
return _b83;
},_writeLevelClipping:function(_b86,_b87,_b88){
var _b89=hs.ui.currentHyDoc.nodeCtxt.level;
if(_b86==1){
_b88+="d";
}else{
if(_b86==hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
_b88+="c";
}else{
if(_b86==0){
_b88+="da";
}else{
if(_b86>=(hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING-20)){
_b88+="c";
var _b8a=hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING-_b86;
for(var i=_b8a;i>0;i--){
_b88+="a";
}
}else{
if(_b89!=0&&_b86>=_b89){
_b88+="e";
var _b8c=_b86-_b89;
for(var i=1;i<=_b8c;i++){
_b88+="b";
}
}else{
if(_b89!=0&&_b86<_b89){
var _b8d=_b89-_b86;
if(_b8d>=_b86){
_b88+="d";
for(var i=2;i<=_b86;i++){
_b88+="b";
}
}else{
_b88+="e";
for(var i=1;i<=_b8d;i++){
_b88+="a";
}
}
}else{
if(_b89==0){
_b88+="da";
for(var i=1;i<=_b86;i++){
_b88+="b";
}
}
}
}
}
}
}
}
return _b88;
},_toggleSelectedViewspecs:function(evt){
if(evt.keyCode==13){
this._handleApply();
return;
}else{
if(evt.keyCode==27){
this.hide();
return;
}
}
var _b8f=this.selectedViewspecs.value;
var _b90=hs.ui.currentHyDoc.currentViewspecs.toString();
_b8f=_b90+_b8f;
this._markDirtyWithLetters(this.selectedViewspecs.value);
this.errorArea.innerHTML="";
this.applyButton.disabled=undefined;
var _b91;
try{
_b91=new hs.filter.CurrentViewspecs(_b8f,hs.ui.currentHyDoc);
}
catch(e){
evt.stopPropagation();
evt.preventDefault(true);
this.errorArea.innerHTML=e;
this.applyButton.disabled=true;
return;
}
this._resetViewspecs(_b91);
},_filterViewspecs:function(_b92){
var _b93=this.selectedViewspecs.value;
var _b94;
if(this._showingMore){
_b94=/y|z|m|n|H|G|O|P|x|w|a|b|c|d|r|q|s|t|i|j|k/g;
}else{
_b94=/y|z|m|n|x|w/g;
}
_b93=_b93.replace(_b94,"");
_b92=_b92+_b93;
return _b92;
},_toggleAdvanced:function(){
var _b95=this.width;
var _b96;
if(this._showingMore==false){
this._showingMore=true;
this.advancedButton.innerHTML="Less&nbsp;&#9650;";
dojo.html.replaceClass(this.viewTable,"moreMode","lessMode");
_b96=this.viewTable.scrollHeight+50;
}else{
this._showingMore=false;
this.advancedButton.innerHTML="More&nbsp;&#9660;";
dojo.html.replaceClass(this.viewTable,"lessMode","moreMode");
_b96=this._lessModeHeight;
}
var _b97=dojo.widget.byId(this.widgetId+"Pane");
_b97.resizeTo(_b95,_b96);
},_markDirtyWithLetters:function(_b98){
if(_b98.indexOf("y")!=-1||_b98.indexOf("z")!=-1){
this._blankLinesDirty=true;
}
if(_b98.indexOf("m")!=-1||_b98.indexOf("n")!=-1||_b98.indexOf("G")!=-1||_b98.indexOf("H")!=-1){
this._nodeAddressingDirty=true;
}
if(_b98.indexOf("O")!=-1||_b98.indexOf("P")!=-1){
this._includesOnDirty=true;
}
if(_b98.indexOf("x")!=-1||_b98.indexOf("w")!=-1||_b98.indexOf("a")!=-1||_b98.indexOf("b")!=-1||_b98.indexOf("c")!=-1||_b98.indexOf("d")!=-1||_b98.indexOf("r")!=-1||_b98.indexOf("q")!=-1||_b98.indexOf("s")!=-1||_b98.indexOf("t")!=-1||_b98.indexOf("e")!=-1){
this._outlineDirty=true;
}
if(_b98.indexOf("i")!=-1||_b98.indexOf("j")!=-1||_b98.indexOf("k")!=-1){
this._applyFilterDirty=true;
}
}});
dojo.widget.defineWidget("hs.ui.JumpOverlay",dojo.widget.HtmlWidget,{widgetType:"JumpOverlay",isContainer:true,templateString:"<div 	dojoType=\"FloatingPane\" \n		id=\"${this.widgetId}Pane\"\n		hasShadow=\"true\" \n		title=\"Jump (to) Item\" \n		resizable=\"false\"\n		displayCloseAction=\"false\"\n		constrainToContainer=\"true\"\n		dojoAttachPoint=\"jumpOverlay\"\n		class=\"jumpOverlay initial-overlay-state\">\n    \n    <div class=\"jumpInput dialog-content\">\n    	<table width=\"100%\">\n    		<tr valign=\"middle\">\n				<span>\n		            Click on the item or enter its address:\n		        </span>\n				\n		        <input	type=\"text\" \n						dojoAttachPoint=\"addressInput\"\n						dojoAttachEvent=\"onkeypress: handleKey\">\n				</input>\n			</tr>\n		</table>\n    </div>\n    \n    <div class=\"jumpButtons dialog-content\">\n    	<!-- Commenting out for future implementation -->\n		<!--\n		<button class=\"jumpHelpButton\">?</button>\n    	<button class=\"jumpMoreButton\">More</button>\n    	-->\n		\n    	<button class=\"jumpCancelButton\" dojoAttachEvent=\"onclick: handleCancel\">Cancel</button>\n    	<button class=\"jumpOKButton\" dojoAttachEvent=\"onclick: handleOK\">OK</button>\n    </div>\n</div>",templateCssString:".jumpOverlay{\n	width: 30em;\n	z-index: 3;\n	position: absolute;\n}\n\n/**\n	Our floating pane's nifty drop shadow depends\n	on being displayed in order to calculate\n	it's shadow; however, when we combine this\n	with not being displayed on page load and our\n	nifty fade in animation to display the overlay,\n	the shadow gets messed up. This is a trick below\n	to 'hide' the jump overlay offscreen but 'visible'\n	so the shadow can be calculated.\n*/\n.initial-overlay-state{\n	left: -1000px !important;\n	top: -1000px !important;\n}\n\n.jumpInput input{\n	width: 15em;\n	display: inline;\n}\n\n.jumpInput span{\n	margin-right: 5px;\n}\n\n.jumpOverlay .dialog-content{\n	width: 100%;\n}\n\n.jumpOverlay .jumpButtons{\n	clear: both;\n	padding-top: 10px;\n}\n\n.jumpHelpButton,\n.jumpMoreButton{\n	float: left;\n	margin-right: 4px;\n}\n\n.jumpOKButton,\n.jumpCancelButton{\n	float: right;\n	margin-left: 4px;\n}\n\n.jumpHelpButton{\n	width: 3em;\n}",templateCssPath:dojo.uri.dojoUri("src/hs/templates/JumpOverlay.css"),_mark:null,postCreate:function(){
this.width=dojo.style.getOuterWidth(this.domNode);
this.height=dojo.style.getOuterHeight(this.domNode);
var _b99=this.height+50;
var _b9a=this.width;
this.jumpOverlay.style.width=_b9a+"px";
this.jumpOverlay.style.height=_b99+"px";
dojo.event.topic.subscribe("/mark",this,"_onMark");
},getHeight:function(){
return this.height;
},resolveURL:function(){
var url=this.addressInput.value;
this.addressInput.value="";
if(dojo.string.startsWith(url,"#")==false&&dojo.string.startsWith(url,"./")==false&&dojo.string.startsWith(url,"../")==false&&/^[^:]*:\//.test(url)==false){
url="#"+url;
}
hs.ui.resolveLocation(url);
},handleOK:function(){
this.resolveURL();
},handleCancel:function(){
this.hide();
},handleKey:function(evt){
if(evt.keyCode==13){
this.resolveURL();
}else{
if(evt.keyCode==27){
this.hide();
}
}
},isShowing:function(){
var _b9d=dojo.widget.byId(this.widgetId+"Pane");
if(dojo.html.hasClass(_b9d.domNode,"initial-overlay-state")){
return false;
}else{
return _b9d.isShowing();
}
},show:function(){
hs.ui.markingMode=true;
this.addressInput.value="";
var _b9e=dojo.widget.byId(this.widgetId+"Pane");
_b9e.bringToTop();
dojo.html.removeClass(_b9e.domNode,"initial-overlay-state");
var _b9f=dojo.byId("toolbarJumpButton");
var _ba0=dojo.html.getOuterWidth(_b9f);
var _ba1=dojo.html.getViewportWidth();
var _ba2=dojo.style.getAbsoluteY(_b9f,false)+_ba0/2;
var _ba3=dojo.html.getOuterHeight(dojo.byId("toolbar"));
var endY=_ba3+30;
if(dojo.render.html.ie!=true){
dojo.style.setOpacity(_b9e.domNode,0);
}
dojo.style.show(_b9e.domNode);
var _ba5=new Array();
if(dojo.render.html.ie!=true){
_ba5.push({property:"opacity",start:0,end:1});
}
_ba5.push({property:"right",start:60,end:60});
_ba5.push({property:"top",start:_ba2,end:endY});
var anim=dojo.lfx.propertyAnimation(_b9e.domNode,_ba5,250);
dojo.event.connect(anim,"onEnd",dojo.lang.hitch(this,function(){
this.addressInput.focus();
}));
anim.play();
},hide:function(){
hs.ui.markingMode=false;
this._setMarkable(false);
var _ba7=dojo.widget.byId(this.widgetId+"Pane");
var _ba8=dojo.html.getViewportWidth();
var _ba9=dojo.html.getOuterHeight(dojo.byId("toolbar"));
var _baa=_ba9+30;
var _bab=dojo.byId("toolbarJumpButton");
var _bac=dojo.html.getOuterWidth(_bab);
var endY=dojo.style.getAbsoluteY(_bab,false)+_bac/2;
var _bae=new Array();
if(dojo.render.html.ie!=true){
_bae.push({property:"opacity",start:1,end:0});
}
_bae.push({property:"right",start:60,end:60});
_bae.push({property:"top",start:_baa,end:endY});
var anim=dojo.lfx.propertyAnimation(_ba7.domNode,_bae,250);
dojo.event.connect(anim,"onEnd",function(){
dojo.style.hide(_ba7.domNode);
});
anim.play();
},_setMarkable:function(_bb0){
if(_bb0==true){
if(this._mark!=null){
dojo.html.addClass(this._mark.row,"marked");
}
}else{
if(this._mark!=null){
dojo.html.removeClass(this._mark.row,"marked");
}
this._mark=null;
}
},_onMark:function(mark){
if(this.isShowing()==false){
return;
}
this._setMarkable(false);
this._mark=mark;
var addr=mark.address;
var url=addr.toString();
url=url.match(/[^#]*(#.*)/)[1];
this.addressInput.value=url;
this._setMarkable(true);
}});
dojo.widget.defineWidget("hs.ui.HyperScopeToolbar",dojo.widget.HtmlWidget,{widgetType:"HyperScopeToolbar",isContainer:false,templateString:"<div id=\"toolbar\">\n	<!-- \n		Tables are the only way to do vertical-centering of content\n		in a cross-browser way, since CSS's 'vertical-align: middle' does not work\n		with certain kinds of elements and Internet Explorer does not\n		support 'display: table-cell'. See\n		http://www.quirksmode.org/css/centering.html\n		for details. It's also the only way to do it in a way that is independent\n		of system font size.\n		\n		Our trick to get the iframe to take up the rest of it's vertical space while\n		only displaying a scrollbar inside of it's content and not\n		on the full toolbar or browser window (again needed because\n		Internet Explorer does not support 'display: fixed') means we have to use\n		two table cells to align some buttons on the left of the toolbar and\n		some on the right.\n		\n		This is not semantic markup, but it's needed to combine all of what we need\n		cross-browser.\n	-->\n	<table border=\"0\">\n		<tr>\n			<td class=\"left\" valign=\"middle\">\n				<span id=\"logo\">\n					HyperScope\n				</span>\n				\n				<img	id=\"toolbarHelpButton\" \n						class=\"toolbar-button\" \n						dojoAttachPoint=\"toolbarHelpButton\" />\n			</td>\n			\n			<td dojoAttachPoint=\"commandBarCell\" class=\"middle\" valign=\"middle\">\n				<div	id=\"commandBar\">\n				</div>\n			</td>\n			\n			<td dojoAttachPoint=\"rightHandCell\" class=\"right\" valign=\"middle\">\n				<img	id=\"toolbarJumpButton\" \n						class=\"toolbar-button\"\n						dojoAttachPoint=\"toolbarJumpButton\" />\n				\n				<img	id=\"toolbarViewspecsButton\"\n						class=\"toolbar-button\" \n						dojoAttachPoint=\"toolbarViewspecsButton\" />\n						\n				<img	id=\"toolbarTurboModeButton\"\n						class=\"toolbar-button\" \n						dojoAttachPoint=\"toolbarTurboModeButton\" />\n						\n				<img	id=\"toolbarBrowserModeButton\"\n						class=\"toolbar-button\" \n						dojoAttachPoint=\"toolbarBrowserModeButton\" />\n				\n				<a href=\"#\" id=\"current-link\">\n					<img src=\"/hyperscope/src/client/images/link.gif\" />\n				</a>\n			</td>\n		</tr>\n	</table>\n</div>",templateCssString:"#toolbar{\n	position: absolute;\n	top: 0px;\n	left: 0px;\n	width: 100%;\n	height: 9%;\n	overflow: hidden;\n	z-index: 2;\n	background: url(\"/hyperscope/src/client/images/background.png\") repeat-x 0 0;\n}\n\n#logo{\n	color: #F9F8F8; /** off-white */\n	font-size: 18pt;\n	font-family: Arial sans-serif;\n	font-weight: bold;\n	font-style: italic;\n	margin-left: 0.3em;\n}\n\n#toolbar table{\n	width: 100%;\n	height: 100%;\n}\n\n#toolbar .left{\n	width: 225px;\n}\n\n#toolbar .middle{\n}\n\n#toolbar .right{\n	text-align: right;\n	width: 290px;\n}\n\n#toolbar .right-shorter{\n	width: 140px;\n}\n\n\n#current-link:active,\n#current-link:visited,\n#current-link:link,\n#current-link:hover{\n	margin: 0px;\n	padding: 0px;\n	border: 0px;\n	text-decoration: none;\n}\n\n#current-link:active img,\n#current-link:visited img,\n#current-link:link img,\n#current-link:hover img{\n	margin: 0px;\n	padding: 0px;\n	border: 0px;\n	text-decoration: none;\n}\n\n#commandBar{\n	background-color: #EAF4FF; /** faint blue */\n	color: black;\n	width: 100%;\n	height: 12pt;\n	font-size: 12pt;\n	font-weight: bold;\n	border: 1px black inset;\n	padding: 3px 4px 4px 5px;\n	visibility: hidden;\n	overflow: visible;\n}\n\n#toolbarHelpButton{\n	padding-left: 10px;\n}\n\n#toolbarJumpButton,\n#toolbarViewspecsButton{\n	display: none;\n}\n\n#toolbarBrowserModeButton,\n#toolbarTurboModeButton{\n	display: none;\n}\n\n.toolbar-button{\n	margin-right: 5px;\n}",templateCssPath:dojo.uri.dojoUri("src/hs/templates/HyperScopeToolbar.css"),fillInTemplate:function(){
this._buttonStates=new Array();
this._buttonStates.push({id:"toolbarHelpButton",domNode:this.toolbarHelpButton,onaction:dojo.lang.hitch(this,this._toggleHelpOverlay),normal:"/hyperscope/src/client/images/help_normal.gif",rollover:"/hyperscope/src/client/images/help_rollover.gif",down:"/hyperscope/src/client/images/help_down.gif"});
this._buttonStates.push({id:"toolbarJumpButton",domNode:this.toolbarJumpButton,onaction:dojo.lang.hitch(this,this._toggleJumpOverlay),normal:"/hyperscope/src/client/images/jump_normal.gif",rollover:"/hyperscope/src/client/images/jump_rollover.gif",down:"/hyperscope/src/client/images/jump_down.gif"});
this._buttonStates.push({id:"toolbarViewspecsButton",domNode:this.toolbarViewspecsButton,onaction:dojo.lang.hitch(this,this._toggleViewspecsOverlay),normal:"/hyperscope/src/client/images/viewspecs_normal.gif",rollover:"/hyperscope/src/client/images/viewspecs_rollover.gif",down:"/hyperscope/src/client/images/viewspecs_down.gif"});
this._buttonStates.push({id:"toolbarTurboModeButton",domNode:this.toolbarTurboModeButton,onaction:dojo.lang.hitch(this,this._toggleCommandBar),normal:"/hyperscope/src/client/images/turbomode_normal.gif",rollover:"/hyperscope/src/client/images/turbomode_rollover.gif",down:"/hyperscope/src/client/images/turbomode_down.gif"});
this._buttonStates.push({id:"toolbarBrowserModeButton",domNode:this.toolbarBrowserModeButton,onaction:dojo.lang.hitch(this,this._toggleCommandBar),normal:"/hyperscope/src/client/images/browsermode_normal.gif",rollover:"/hyperscope/src/client/images/browsermode_rollover.gif",down:"/hyperscope/src/client/images/browsermode_down.gif"});
for(var i=0;i<this._buttonStates.length;i++){
var _bb5=this._buttonStates[i];
_bb5.domNode.src=_bb5.normal;
dojo.event.connect(_bb5.domNode,"onmouseup",this,"_handleMouse");
dojo.event.connect(_bb5.domNode,"onmousedown",this,"_handleMouse");
dojo.event.connect(_bb5.domNode,"onmouseover",this,"_handleMouse");
dojo.event.connect(_bb5.domNode,"onmouseout",this,"_handleMouse");
dojo.event.connect(_bb5.domNode,"onclick",this,"_handleMouse");
}
},initializeTurboModeSettings:function(){
if(this._isTurboMode()==true){
this._toggleCommandBar(true);
}else{
this._toggleCommandBar(false);
}
},postCreate:function(){
if(this._isTurboMode()==true){
this._toggleCommandBar(true);
}else{
this._toggleCommandBar(false);
}
},_handleMouse:function(evt){
var tg=evt.target;
var id=tg.id;
var _bb9;
for(var i=0;i<this._buttonStates.length;i++){
if(this._buttonStates[i].id==id){
_bb9=this._buttonStates[i];
break;
}
}
switch(evt.type.toLowerCase()){
case "mouseover":
_bb9.domNode.src=_bb9.rollover;
break;
case "mouseout":
_bb9.domNode.src=_bb9.normal;
break;
case "mousedown":
_bb9.domNode.src=_bb9.down;
break;
case "mouseup":
_bb9.domNode.src=_bb9.rollover;
break;
case "click":
_bb9.onaction.call();
break;
}
},_toggleJumpOverlay:function(){
var _bbb=dojo.widget.byId("jumpOverlay");
if(_bbb.isShowing()==true){
_bbb.hide();
}else{
_bbb.show();
}
},_toggleViewspecsOverlay:function(){
var _bbc=dojo.widget.byId("viewspecsOverlay");
if(_bbc.isShowing()==true){
_bbc.hide();
}else{
_bbc.show();
}
},_toggleCommandBar:function(_bbd){
if(hs.ui.commandBar.isShowing()||_bbd==false){
this.toolbarJumpButton.style.display="inline";
this.toolbarViewspecsButton.style.display="inline";
this.commandBarCell.style.display="none";
this.toolbarTurboModeButton.style.display="inline";
this.toolbarBrowserModeButton.style.display="none";
dojo.html.removeClass(this.rightHandCell,"right-shorter");
this._setTurboMode(false);
hs.ui.commandBar.hide();
}else{
var _bbe=dojo.widget.byId("jumpOverlay");
var _bbf=dojo.widget.byId("viewspecsOverlay");
this._setTurboMode(true);
if(_bbe.isShowing()){
_bbe.hide();
}
if(_bbf.isShowing()){
_bbf.hide();
}
if(dojo.render.html.ie){
this.commandBarCell.style.display="block";
}else{
this.commandBarCell.style.display="table-cell";
}
this.toolbarJumpButton.style.display="none";
this.toolbarViewspecsButton.style.display="none";
this.toolbarTurboModeButton.style.display="none";
this.toolbarBrowserModeButton.style.display="inline";
dojo.html.addClass(this.rightHandCell,"right-shorter");
hs.ui.commandBar.show();
}
},_setTurboMode:function(_bc0){
if(_bc0==true){
dojo.io.cookie.set("isturbomode","yes",30);
}else{
dojo.io.cookie.deleteCookie("isturbomode");
}
},_isTurboMode:function(){
var _bc1=dojo.io.cookie.get("isturbomode");
if(_bc1=="yes"){
return true;
}else{
return false;
}
},_toggleHelpOverlay:function(){
var _bc2=dojo.widget.byId("helpOverlay");
if(_bc2.isShowing()==true){
_bc2.hide();
}else{
_bc2.show();
}
}});
hs.ui.ResultWriter=function(_bc3,_bc4,_bc5){
this._renderDoc=_bc3;
this._onFinishedWriting=_bc5;
this._iframe=_bc4;
this._initializeIframe();
this._lineClipper=new hs.ui.LineClipper(_bc4);
};
hs.ui.ResultWriter._INTERVAL=15;
hs.ui.ResultWriter._CHUNK_AMOUNT=40;
dojo.lang.extend(hs.ui.ResultWriter,{_iframe:null,_trNodes:null,_currentIndex:null,_container:null,_doc:null,_focusedCtxtNode:false,_haveOneFilteredNode:false,_lineClipper:null,write:function(doc){
hs.profile.start("writing_html");
this._doc=doc;
var _bc7=this._iframe;
this._applyFilter=false;
this._haveOneFilteredNode=false;
if(doc.currentViewspecs.getContentFilterType()!=hs.filter.ViewspecConstants.NO_FILTERING){
this._applyFilter=true;
}
var _bc8;
if(typeof doc.renderedHtmlDom.getElementById=="undefined"){
_bc8=doc.renderedHtmlDom.selectNodes("//*[@id='hyperScopeDocument']")[0];
}else{
_bc8=doc.renderedHtmlDom.getElementById("hyperScopeDocument");
}
this._trNodes=_bc8.childNodes;
_bc7.body.innerHTML="";
var _bc9;
if(typeof _bc7.importNode=="undefined"){
var _bca=_bc7.createElement("table");
_bca.id="hyperScopeDocument";
_bca.className=_bc8.getAttribute("class");
var _bcb=_bc7.createElement("tbody");
_bca.appendChild(_bcb);
_bc7.body.appendChild(_bca);
_bc9=_bcb;
}else{
_bc9=_bc7.importNode(_bc8,false);
_bc7.body.appendChild(_bc9);
_bc9=_bc7.getElementById("hyperScopeDocument");
}
this._container=_bc9;
this._renderDoc.displayDocument(doc.nodeCtxt.number);
this._ctxtNodeCounter=doc.nodeCtxt.nodeCounter;
if(this._currentInterval!=null){
window.clearInterval(this._currentInterval);
this._curentInterval=null;
}
this._currentIndex=0;
this._currentInterval=window.setInterval(dojo.lang.hitch(this,this._writeChunk),hs.ui.ResultWriter._INTERVAL);
this._writeChunk();
},_writeChunk:function(){
if(this._currentIndex>=this._trNodes.length){
window.clearInterval(this._currentInterval);
this._currentInterval=null;
this._currentIndex=0;
if(this._haveOneFilteredNode==false){
var _bcc=this._iframe.createElement("div");
_bcc.className="nothing-to-show-message";
_bcc.innerHTML="The combination of content filter and "+"viewspecs produces nothing to display; "+"<a href=\"#:j\">click here</a> to turn "+"the content filter off and display "+"content again";
this._iframe.body.appendChild(_bcc);
}
this._padBottomOfDocument();
this._renderDoc.focusContextNode();
hs.ui.fadeStatus();
this._onFinishedWriting.call(null,this._doc,this._iframe);
}else{
var _bcd=hs.ui.ResultWriter._CHUNK_AMOUNT;
var _bce=this._trNodes;
var _bcf=this._currentIndex;
var _bd0=this._iframe;
var _bd1=this._container;
var _bd2=new Array();
var _bd3=this._applyFilter;
if(typeof _bd0.importNode!="undefined"){
var _bd4=_bd0.createDocumentFragment();
for(var _bd5=0;_bd5<_bcd&&_bcf<_bce.length;_bd5++,_bcf++){
var row=_bd0.importNode(_bce[_bcf],true);
if(_bd3==true&&row.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":passes-content-filter")!="yes"){
continue;
}
this._haveOneFilteredNode=true;
var _bd7=row.childNodes[1].firstChild.childNodes[1];
var data=_bd7.innerHTML;
var _bd9=false;
if(data.indexOf("&")!=-1){
data=data.replace(/&lt;/g,"<");
data=data.replace(/&gt;/g,">");
data=data.replace(/&amp;/g,"&");
data=data.replace(/&quot;/g,"\"");
_bd7.innerHTML=data;
}
if(data.indexOf("<")!=-1){
_bd9=true;
}
_bd4.appendChild(row);
_bd2[_bd2.length]=row;
}
this._currentIndex=_bcf;
_bd1.appendChild(_bd4);
}else{
var _bd4=_bd0.createElement("div");
var html=new String();
for(var _bd5=0;_bd5<_bcd&&_bcf<_bce.length;_bd5++,_bcf++){
html+=_bce[_bcf].xml;
}
this._currentIndex=_bcf;
_bd4.innerHTML="<table><tbody>"+html+"</tbody></table>";
var _bdb=_bd4.getElementsByTagName("tbody")[0];
var rows=_bdb.getElementsByTagName("tr");
for(var i=0;i<rows.length;i++){
var row=rows[i].cloneNode(true);
if(_bd3==true&&row.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":passes-content-filter")!="yes"){
continue;
}
this._haveOneFilteredNode=true;
_bd1.appendChild(row);
_bd2[_bd2.length]=row;
}
}
this._renderDoc.focusContextNode();
this._lineClipper.applyChunk(this._doc,_bd1,_bd2);
}
},_padBottomOfDocument:function(){
var _bde=this._iframe;
var _bdf=dojo.style.getOuterHeight(_bde.body);
var _be0=_bde.createElement("div");
_be0.style.height=_bdf+"px";
_bde.body.appendChild(_be0);
},_initializeIframe:function(){
this._iframe.open();
this._iframe.close();
var head=this._iframe.getElementsByTagName("head")[0];
var link=this._iframe.createElement("link");
link.setAttribute("rel","stylesheet");
link.setAttribute("type","text/css");
link.setAttribute("href","/hyperscope/src/client/style/global.css");
head.appendChild(link);
}});
hs.ui.Mark=function(evt){
this._processEvent(evt);
};
dojo.lang.extend(hs.ui.Mark,{row:null,address:null,invalidMark:false,_processEvent:function(evt){
var tg=evt.target;
while(tg!=null&&dojo.html.hasClass(tg,"node-row")==false){
tg=tg.parentNode;
}
if(tg==null||typeof tg=="undefined"){
this.invalidMark=true;
return;
}
this.row=tg;
var _be6=this.row.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX+":number");
var url="#"+_be6;
try{
this.address=new hs.address.Address(url);
}
catch(exp){
debug("Invalid value during marking: "+exp);
this.invalidMark=true;
}
}});
hs.ui.LineClipper=function(_be8){
this._iframeDoc=_be8;
this._standardLineHeight=this._computeLineHeight(_be8);
};
dojo.lang.extend(hs.ui.LineClipper,{_iframeDoc:null,_standardLineHeight:null,_containerRegExp:new RegExp("^h[1-6]|div|span|ul|ol|li|textarea"+"|form|p|pre|blockquote|address|td$","i"),applyChunk:function(doc,_bea,_beb){
var _bec=doc.currentViewspecs.getLineClipping();
if(_bec==hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
return;
}
var _bed=_beb.length;
var _bee=this._containerRegExp;
var _bef=this._standardLineHeight;
var _bf0=this._iframeDoc;
var row,dataCell,dataContainer,firstElement;
var _bf2,dataHeight,heightOfOneLine;
var _bf3,heightClassName,heightEntry;
var img,currentViews,containerElem;
for(var i=0;i<_bed;i++){
row=_beb[i];
dataCell=row.childNodes[1];
dataContainer=dataCell.firstChild;
firstElement=dataCell;
if(dataContainer.childNodes!=null&&dataContainer.childNodes[1].nodeName.toLowerCase()=="span"){
firstElement=dataContainer.childNodes[1];
}
_bf2=false;
if(firstElement.innerHTML.indexOf("<")!=-1){
_bf2=true;
}
dataHeight=dataCell.scrollHeight;
if(_bf2==true){
containerElem=firstElement.firstChild;
if(containerElem!=null&&containerElem.nodeType==dojo.dom.ELEMENT_NODE&&_bee.test(containerElem.nodeName)==true){
firstElement=containerElem;
}
heightOfOneLine=this._computeLineHeight(_bf0,firstElement);
}else{
heightOfOneLine=_bef;
}
_bf3=heightOfOneLine*_bec;
if(_bf3>dataHeight){
_bf3=dataHeight;
}
dataContainer.style.height=_bf3+"px";
if(dojo.render.html.mozilla&&_bf2&&firstElement.firstChild&&firstElement.firstChild.nodeName.toLowerCase()=="img"){
img=firstElement.firstChild;
img.style.cssFloat="left";
currentViews=hs.ui.currentHyDoc.currentViewspecs;
if(currentViews.showNodeAddressing()==true&&currentViews.getNodeAddressingPlacement()==hs.filter.ViewspecConstants.LEFT){
img.style.paddingLeft="2em";
}
}
}
},_computeLineHeight:function(_bf6,node){
var _bf8;
if(node!=null&&typeof node!="undefined"){
_bf8=node.cloneNode(false);
}else{
_bf8=_bf6.createElement("div");
}
_bf8.style.margin="0px";
_bf8.style.padding="0px";
_bf8.style.border="0px";
_bf8.style.visibility="hidden";
var _bf9="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
_bf8.innerHTML=_bf9;
_bf6.body.appendChild(_bf8);
var _bfa=_bf8.scrollHeight;
dojo.dom.removeNode(_bf8);
return _bfa;
}});
hs.ui.CommandBar=function(){
this._outputArea=dojo.byId("commandBar");
this._loadCommandXML();
};
hs.ui.CommandBar._COMMAND_FILE="/hyperscope/src/client/lib/hs/commands.xml";
dojo.lang.extend(hs.ui.CommandBar,{visible:false,_states:{ROOT:"ROOT",VERB:"VERB",NOUN:"NOUN",INPUT:"INPUT",METHOD:"METHOD",UNKNOWN:"UNKNOWN",DONE:"DONE"},_outputArea:null,_commands:null,_inputBuffer:new Array(),_currentState:null,_languageElement:null,_allowInput:false,_inputType:null,_mark:null,_ready:false,_address:null,_viewspecs:null,_typein:null,_inputText:new String(),_persistedValue:null,_firstPersist:true,_lastCommandBuffer:null,reset:function(){
if(this._ready==false){
return;
}
hs.ui.markingMode=false;
for(var i=0;i<this._inputBuffer.length;i++){
var _bfc=this._inputBuffer[i];
if(_bfc.mark!=null){
this._setMarkable(false,_bfc.mark);
}
}
this._inputBuffer=new Array();
this._languageElement=null;
this._allowInput=false;
this._inputType=null;
this._mark=null;
this._address=null;
this._viewspecs=null;
this._typein=null;
this._inputText=null;
this._sendBufferToOutput();
},isShowing:function(){
return this.visible;
},show:function(){
this.reset();
var _bfd=dojo.byId("commandBar");
_bfd.style.visibility="visible";
this.visible=true;
},hide:function(){
var _bfe=dojo.byId("commandBar");
_bfe.style.visibility="hidden";
this.visible=false;
},_loadCommandXML:function(){
var _bff={url:hs.ui.CommandBar._COMMAND_FILE,sync:djConfig.testing,mimetype:"text/xml",error:dojo.lang.hitch(this,this._error),load:dojo.lang.hitch(this,this._loaded)};
dojo.io.bind(_bff);
},_error:function(type,_c01){
var _c02=_c01.message;
if(_c02.indexOf("XMLHttpTransport Error:")!=-1){
_c02=_c02.replace(/XMLHttpTransport Error:/,"");
}
hs.ui.reportError("Unable to initialize command bar: "+_c02);
},_loaded:function(type,data,evt){
var _c06=data.selectNodes("/commands/subsystem[@id = 'base-subsystem']");
this._commands=_c06.item(0);
dojo.event.connect(window,"onkeypress",this,this._onKey);
dojo.event.connect(document,"onkeypress",this,this._onKey);
if(dojo.render.html.ie){
dojo.event.connect(document,"onkeydown",this,this._handleBackspace);
}
dojo.event.topic.subscribe("/mark",this,"_onMark");
this._ready=true;
this.reset();
},_onRenderedDocument:function(_c07){
dojo.event.disconnect(_c07,"onkeypress",this,this._onKey);
dojo.event.connect(_c07,"onkeypress",this,this._onKey);
if(dojo.render.html.ie){
dojo.event.disconnect(_c07,"onkeydown",this,this._handleBackspace);
dojo.event.connect(_c07,"onkeydown",this,this._handleBackspace);
}
},_setOutput:function(msg){
var _c09=this._outputArea.childNodes;
for(var i=0;i<_c09.length;i++){
dojo.dom.removeNode(_c09[i]);
}
var text=document.createTextNode(msg);
this._outputArea.appendChild(text);
},_sendBufferToOutput:function(){
try{
var _c0c=new String();
var _c0d=new Array();
for(var i=0;i<this._inputBuffer.length;i++){
_c0d[_c0d.length]=this._inputBuffer[i];
}
_c0c+=this._commands.getAttribute("output")+" ";
if(_c0d.length==0){
_c0c+="C: ";
}
this._currentState=this._states.ROOT;
this._languageElement=null;
this._allowMarking=false;
this._inputText=new String();
this._inputType=null;
this._mark=null;
this._address=null;
this._typein=null;
this._viewspecs=null;
while(_c0d.length!=0){
if(this._currentState==this._states.DONE){
break;
}
if(this._currentState==this._states.UNKNOWN){
break;
}
if(this._currentState==this._states.ROOT){
_c0c=this._handleLanguageElement(_c0d,_c0c,this._commands.childNodes,this._states.VERB);
}else{
if(this._currentState==this._states.VERB||this._currentState==this._states.NOUN){
_c0c=this._handleLanguageElement(_c0d,_c0c,this._languageElement.childNodes,this._states.NOUN);
if(typeof this._languageElement!="undefined"&&this._languageElement!=null&&this._needsInput(this._languageElement)==true){
_c0c=this._selectInput(_c0d,_c0c,this._languageElement);
}
}else{
if(this._currentState==this._states.INPUT){
_c0c=this._consumeInput(_c0d,_c0c);
}
}
}
if(this._currentState==this._states.METHOD){
this._setOutput(_c0c);
this._executeMethod();
return;
}
}
this._setOutput(_c0c);
}
catch(exp){
this._handleError(exp);
}
},_handleLanguageElement:function(_c0f,_c10,_c11,_c12){
var _c13=new String();
var _c14=false;
var _c15=false;
while(_c14==false&&_c0f.length!=0){
_c15=false;
var _c16=_c0f.shift();
var _c17=_c16.value;
_c17=_c17.toLowerCase();
_c13+=_c17;
for(var i=0;i<_c11.length;i++){
var elem=_c11[i];
if(elem.nodeType!=dojo.dom.ELEMENT_NODE){
continue;
}
var _c1a=elem.getAttribute("activate");
if(_c13==_c1a){
this._languageElement=elem;
_c14=true;
break;
}else{
if(dojo.string.startsWith(_c1a,_c13,true)){
_c15=true;
break;
}
}
}
if(_c15==false&&_c14==false){
if(this._languageElement==null){
_c10+="C: ";
}
_c10+="?";
this._inputBuffer=this._inputBuffer.slice(0,this._inputBuffer.length-1);
this._currentState=this._states.UNKNOWN;
return _c10;
}
}
if(_c15==true&&_c14==false){
_c13=_c13.toUpperCase();
_c10+=_c13;
return _c10;
}
var _c1b=this._languageElement.getAttribute("output");
_c10+=_c1b;
this._currentState=_c12;
if(this._nestedNoun(this._languageElement)==true&&_c0f.length==0){
_c10+="C: ";
}
return _c10;
},_needsInput:function(_c1c){
if(_c1c==null||typeof _c1c=="undefined"||_c1c.childNodes==null||typeof _c1c.childNodes=="undefined"||_c1c.childNodes.length==0){
return false;
}
var _c1d=_c1c.firstChild;
while(_c1d!=null&&_c1d.nodeType!=dojo.dom.ELEMENT_NODE){
_c1d=_c1d.nextSibling;
}
if(_c1d==null){
return false;
}
if(_c1d.nodeName=="input"){
return true;
}else{
return false;
}
},_selectInput:function(_c1e,_c1f,_c20,_c21){
if(typeof _c21=="undefined"){
_c21=false;
}
var _c22;
if(_c21==false){
_c22=_c20.firstChild;
while(_c22!=null&&_c22.nodeType!=dojo.dom.ELEMENT_NODE&&_c22.nodeName!="input"){
_c22=_c22.nextSibling;
}
}else{
_c22=_c20;
}
var _c23=_c22.getAttribute("type");
this._currentState=this._states.INPUT;
this._inputText=new String();
if(_c23=="location"){
_c1f+="M/A: ";
hs.ui.markingMode=true;
hs.ui.currentRenderedDoc.clearSelection();
}else{
if(_c23=="viewspecs"){
_c1f+="V: ";
hs.ui.markingMode=false;
}else{
if(_c23=="content"){
_c1f+="M/T/[A]: ";
hs.ui.markingMode=true;
}else{
if(_c23=="ok"){
_c1f+="OK: ";
hs.ui.markingMode=false;
}else{
if(_c23=="typein"){
_c1f+="T: ";
hs.ui.markingMode=false;
}else{
if(_c23=="persisted typein"){
if(this._persistedValue!=null&&this._firstPersist==false){
_c1f+="\""+this._persistedValue+"\" RC/T: ";
}else{
_c1f+="T: ";
}
hs.ui.markingMode=false;
}else{
if(_c23=="address"){
_c1f+="A: ";
hs.ui.markingMode=false;
}
}
}
}
}
}
}
this._languageElement=_c22;
this._inputType=_c23;
return _c1f;
},_consumeInput:function(_c24,_c25){
if(this._currentState==this._states.DONE){
return;
}
var _c26=_c24.shift();
var _c27=false;
var _c28=false;
if(_c26.mark!=null){
_c25+=" ! ";
this._mark=_c26.mark;
this._interpretInput();
_c27=true;
_c28=true;
}else{
if(this._persistedValue!=null&&_c26.isEnter==true&&this._inputType=="persisted typein"&&this._inputText.length==0){
this._inputText=this._persistedValue;
_c25+=" ! ";
this._interpretInput();
_c27=true;
}else{
if(_c26.isEnter==true){
_c25+=" ! ";
this._interpretInput();
_c27=true;
}else{
if(this._persistedValue!=null&&_c26.isRepeatKey==true&&this._inputType=="persisted typein"){
this._inputText=this._persistedValue;
_c25+=" ! ";
this._interpretInput();
_c27=true;
}else{
var _c29=_c26.value;
_c25+=_c29;
this._inputText+=_c29;
}
}
}
}
if(_c27==true&&this._currentState!=this._states.DONE){
if(_c28==true&&this._needsInput(this._languageElement)==false&&this._atMethod(this._languageElement)==true){
var _c2a=this._languageElement.cloneNode(true);
_c2a.setAttribute("type","ok");
this._languageElement=_c2a;
this._currentState=this._states.INPUT;
_c25=this._selectInput(_c24,_c25,this._languageElement,true);
}else{
if(this._needsInput(this._languageElement)==true){
_c25=this._selectInput(_c24,_c25,this._languageElement);
}else{
if(this._atMethod(this._languageElement)==true){
this._languageElement=this._getMethod(this._languageElement);
this._currentState=this._states.METHOD;
}
}
}
}
return _c25;
},_getMethod:function(_c2b){
var _c2c=_c2b.firstChild;
while(_c2c!=null&&_c2c.nodeType!=dojo.dom.ELEMENT_NODE&&_c2c.nodeName!="method"){
_c2c=_c2c.nextSibling;
}
return _c2c;
},_atMethod:function(_c2d){
if(_c2d==null||typeof _c2d=="undefined"||_c2d.childNodes==null||typeof _c2d.childNodes=="undefined"||_c2d.childNodes.length==0){
return false;
}
var _c2e=_c2d.firstChild;
while(_c2e!=null&&_c2e.nodeType!=dojo.dom.ELEMENT_NODE){
_c2e=_c2e.nextSibling;
}
if(_c2e==null){
return false;
}
if(_c2e.nodeName=="method"){
return true;
}else{
return false;
}
},_executeMethod:function(){
try{
this._currentState=this._states.DONE;
var exec=this._languageElement.getAttribute("eval");
if(this._persistedValue!=null){
this._firstPersist=false;
}
this._lastCommandBuffer=this._inputBuffer;
this._lastCommandBuffer.pop();
hs.ui.printStatus("Resolving...");
window.readyHandler=hs.ui.addressResolved;
window.address=this._address;
window.relativeTo=hs.ui.currentHyDoc;
window.typein=this._typein;
window.viewspecs=this._viewspecs;
eval(exec);
}
catch(exp){
this._handleError(exp);
}
},_handleError:function(exp){
this.reset();
hs.ui.reportError(exp);
},_interpretInput:function(_c31){
if(this._inputType=="viewspecs"){
this._viewspecs=this._inputText;
}else{
if(this._inputType=="location"&&this._mark!=null){
this._address=this._mark.address;
}else{
if(this._inputType=="location"&&this.mark==null){
var addr=this._toAddress(this._inputText);
this._address=addr;
}else{
if(this._inputType=="content"&&this.mark==null){
var addr=new hs.address.Address(this._inputText);
this._address=addr;
}else{
if(this._inputType=="typein"){
this._typein=this._inputText;
}else{
if(this._inputType=="persisted typein"){
this._persistedValue=this._inputText;
this._typein=this._inputText;
}else{
if(this._inputType=="address"){
var addr=this._toAddress(this._inputText);
this._address=addr;
}
}
}
}
}
}
}
},_nestedNoun:function(_c33){
if(_c33==null||typeof _c33=="undefined"||_c33.childNodes==null||typeof _c33.childNodes=="undefined"||_c33.childNodes.length==0){
return false;
}
var _c34=_c33.firstChild;
while(_c34!=null&&_c34.nodeType!=dojo.dom.ELEMENT_NODE){
_c34=_c34.nextSibling;
}
if(_c34==null){
return false;
}
if(_c34.nodeName=="noun"){
return true;
}else{
return false;
}
},_toAddress:function(url){
if(dojo.string.startsWith(url,"#")==false&&dojo.string.startsWith(url,"./")==false&&dojo.string.startsWith(url,"../")==false&&/^[^:]*:\//.test(url)==false){
url="#"+url;
}
var addr=new hs.address.Address(url);
return addr;
},_onKey:function(evt){
if(this.isShowing()==false){
return;
}
var _c38=new Object();
_c38.mark=null;
_c38.isRepeatKey=false;
if(evt.keyCode==13){
_c38.isEnter=true;
_c38.value=null;
this._inputBuffer[this._inputBuffer.length]=_c38;
}else{
if(evt.keyCode==27){
this.reset();
return;
}else{
if(evt.keyCode==8){
var _c39=this._inputBuffer[this._inputBuffer.length-1];
if(_c39!=null&&typeof _c39!="undefined"&&_c39.mark!=null){
this._setMarkable(false,_c39.mark);
}
if(this._inputBuffer.length!=0){
this._inputBuffer=this._inputBuffer.slice(0,this._inputBuffer.length-1);
}
}else{
if(evt.ctrlKey==true&&(String.fromCharCode(evt.charCode)=="u"||evt.charCode==21)){
}else{
if(evt.ctrlKey==true&&(String.fromCharCode(evt.charCode)=="b"||evt.charCode==2)){
if(this._inputBuffer.length!=0){
_c38.isRepeatKey=true;
_c38.value="";
this._inputBuffer[this._inputBuffer.length]=_c38;
}else{
if(this._lastCommandBuffer!=null){
this._inputBuffer=this._lastCommandBuffer;
}
}
}else{
if(evt.ctrlKey||evt.altKey){
return;
}else{
_c38.isEnter=false;
_c38.value=String.fromCharCode(evt.charCode);
this._inputBuffer[this._inputBuffer.length]=_c38;
}
}
}
}
}
}
evt.stopPropagation();
evt.preventDefault(true);
this._sendBufferToOutput();
},_handleBackspace:function(evt){
if(evt.keyCode==8){
this._onKey(evt);
}
},_setMarkable:function(_c3b,mark){
if(hs.ui.markingMode==true){
if(mark!=null){
dojo.html.addClass(mark.row,"marked");
}
}else{
if(mark!=null){
dojo.html.removeClass(mark.row,"marked");
}
}
},_onMark:function(mark){
if(this.isShowing()==false){
return;
}
var _c3e=dojo.byId("commandBar");
document.body.focus();
if(hs.ui.markingMode==false){
return;
}
var _c3f=null;
for(var i=0;i<this._inputBuffer.length;i++){
var _c41=this._inputBuffer[i];
if(_c41.mark!=null&&typeof _c41.mark!="undefined"){
_c3f=_c41.mark;
}
}
this._setMarkable(false,_c3f);
var _c41=new Object();
_c41.mark=mark;
_c41.isEnter=false;
_c41.value=null;
this._inputBuffer[this._inputBuffer.length]=_c41;
this._setMarkable(true,mark);
this._sendBufferToOutput();
}});
dojo.widget.defineWidget("hs.ui.HelpOverlay",dojo.widget.HtmlWidget,{widgetType:"HelpOverlay",isContainer:true,templateString:"<div 	dojoType=\"FloatingPane\" \n		id=\"${this.widgetId}Pane\"\n		hasShadow=\"true\" \n		title=\"Help\" \n		resizable=\"true\"\n		displayCloseAction=\"true\"\n		constrainToContainer=\"true\"\n		dojoAttachPoint=\"helpOverlay\"\n		href=\"/hyperscope/src/client/lib/hs/templates/HelpContent.html\"\n		class=\"helpOverlay initial-overlay-state\">\n\n</div>",templateCssString:".helpOverlay{\n	width: 40em;\n	height: 80%;\n	z-index: 3;\n	position: absolute;\n}\n\n/**\n	Our floating pane's nifty drop shadow depends\n	on being displayed in order to calculate\n	it's shadow; however, when we combine this\n	with not being displayed on page load and our\n	nifty fade in animation to display the overlay,\n	the shadow gets messed up. This is a trick below\n	to 'hide' the jump overlay offscreen but 'visible'\n	so the shadow can be calculated.\n*/\n.initial-overlay-state{\n	left: -1000px !important;\n	top: -1000px !important;\n}",templateCssPath:dojo.uri.dojoUri("src/hs/templates/HelpOverlay.css"),postCreate:function(){
this.width=dojo.style.getOuterWidth(this.domNode);
this.height=dojo.style.getOuterHeight(this.domNode);
},isShowing:function(){
var _c42=dojo.widget.byId(this.widgetId+"Pane");
if(dojo.html.hasClass(_c42.domNode,"initial-overlay-state")){
return false;
}else{
return _c42.isShowing();
}
},show:function(){
var _c43=dojo.widget.byId(this.widgetId+"Pane");
_c43.bringToTop();
_c43.closeWindow=this._closeWindow;
dojo.html.removeClass(_c43.domNode,"initial-overlay-state");
var _c44=dojo.byId("toolbarHelpButton");
var _c45=dojo.html.getOuterWidth(_c44);
var _c46=dojo.html.getViewportWidth();
var _c47=dojo.style.getAbsoluteY(_c44,false)+_c45/2;
var _c48=dojo.html.getOuterHeight(dojo.byId("toolbar"));
var endY=_c48+30;
if(dojo.render.html.ie!=true){
dojo.style.setOpacity(_c43.domNode,0);
}
dojo.style.show(_c43.domNode);
var _c4a=new Array();
if(dojo.render.html.ie!=true){
_c4a.push({property:"opacity",start:0,end:1});
}
_c4a.push({property:"left",start:20,end:20});
_c4a.push({property:"top",start:_c47,end:endY});
var anim=dojo.lfx.propertyAnimation(_c43.domNode,_c4a,250);
anim.play();
},hide:function(){
var _c4c=dojo.widget.byId(this.widgetId+"Pane");
var _c4d=dojo.html.getViewportWidth();
var _c4e=dojo.html.getOuterHeight(dojo.byId("toolbar"));
var _c4f=_c4e+30;
var _c50=dojo.byId("toolbarHelpButton");
var _c51=dojo.html.getOuterWidth(_c50);
var endY=dojo.style.getAbsoluteY(_c50,false)+_c51/2;
var _c53=new Array();
if(dojo.render.html.ie!=true){
_c53.push({property:"opacity",start:1,end:0});
}
_c53.push({property:"right",start:20,end:20});
_c53.push({property:"top",start:_c4f,end:endY});
var anim=dojo.lfx.propertyAnimation(_c4c.domNode,_c53,250);
dojo.event.connect(anim,"onEnd",function(){
dojo.style.hide(_c4c.domNode);
});
anim.play();
},_closeWindow:function(evt){
this.hide();
}});
if(djConfig.testing==false){
hs.model.addOnLoad(hs.ui.initialize);
}

