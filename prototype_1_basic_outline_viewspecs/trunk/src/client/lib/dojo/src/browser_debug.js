/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.hostenv.loadedUris.push("../src/bootstrap1.js");
dojo.hostenv.loadedUris.push("../src/hostenv_browser.js");
dojo.hostenv.loadedUris.push("../src/bootstrap2.js");

// over-write dj_eval to prevent actual loading of subsequent files
var old_dj_eval = dj_eval;
dj_eval = function(){ return true; }
dojo.hostenv.oldLoadUri = dojo.hostenv.loadUri;
dojo.hostenv.loadUri = function(uri){
	if(dojo.hostenv.loadedUris[uri]){
		return;
	}
	var contents = this.getText(uri, null, true);
	if(contents == null){ return 0; }
	try{
		var requires = dojo.hostenv.getDepsForEval(contents);
		var provides = dojo.hostenv.getProvidesForEval(contents);
		eval(provides.join(";"));
		eval(requires.join(";"));
		dojo.hostenv.loadedUris.push(uri);
		dojo.hostenv.loadedUris[uri] = true;
	}catch(e){ 
		alert(e);
	}
	return true;
}

dojo.hostenv.getProvidesForEval = function(contents){
	if(!contents){ contents = ""; }
	// check to see if we need to load anything else first. Ugg.
	var mods = [];
	var tmp = contents.match( /dojo.hostenv.startPackage\(.*?\)/mg );
	if(tmp){
		for(var x=0; x<tmp.length; x++){ mods.push(tmp[x]); }
	}
	tmp = contents.match( /dojo.hostenv.provide\((.*?)\)/mg );
	if(tmp){
		for(var x=0; x<tmp.length; x++){ mods.push(tmp[x]); }
	}
	tmp = contents.match( /dojo.provide\((.*?)\)/mg );
	if(tmp){
		for(var x=0; x<tmp.length; x++){ mods.push(tmp[x]); }
	}
	return mods;
}

dojo.hostenv.writeIncludes = function(){
	var depList = [];
	var seen = {};
	for(var x=0; x<dojo.hostenv.loadedUris.length; x++){
		var curi = dojo.hostenv.loadedUris[x];
		if(!seen[curi]){
			seen[curi] = true;
			depList.push(curi);
		}
	}

	for(var x=3; x<depList.length; x++){
		document.write("<script type='text/javascript' src='"+depList[x]+"'></script>");
	}
	dj_eval = old_dj_eval;
}
