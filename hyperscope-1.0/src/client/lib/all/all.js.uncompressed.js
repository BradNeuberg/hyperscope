if(typeof dojo == "undefined"){

/**
* @file bootstrap1.js
*
* summary: First file that is loaded that 'bootstraps' the entire dojo library suite.
* note:  Must run before hostenv_*.js file.
*
* @author  Copyright 2004 Mark D. Anderson (mda@discerning.com)
* TODOC: should the copyright be changed to Dojo Foundation?
* @license Licensed under the Academic Free License 2.1 http://www.opensource.org/licenses/afl-2.1.php
*
* $Id: bootstrap1.js 4342 2006-06-11 23:03:30Z alex $
*/

// TODOC: HOW TO DOC THE BELOW?
// @global: djConfig
// summary:  
//		Application code can set the global 'djConfig' prior to loading
//		the library to override certain global settings for how dojo works.  
// description:  The variables that can be set are as follows:
//			- isDebug: false
//			- allowQueryConfig: false
//			- baseScriptUri: ""
//			- baseRelativePath: ""
//			- libraryScriptUri: ""
//			- iePreventClobber: false
//			- ieClobberMinimal: true
//			- preventBackButtonFix: true
//			- searchIds: []
//			- parseWidgets: true
// TODOC: HOW TO DOC THESE VARIABLES?
// TODOC: IS THIS A COMPLETE LIST?
// note:
//		'djConfig' does not exist under 'dojo.*' so that it can be set before the 
//		'dojo' variable exists.  
// note:
//		Setting any of these variables *after* the library has loaded does nothing at all. 
// TODOC: is this still true?  Release notes for 0.3 indicated they could be set after load.
//



//TODOC:  HOW TO DOC THIS?
// @global: dj_global
// summary: 
//		an alias for the top-level global object in the host environment
//		(e.g., the window object in a browser).
// description:  
//		Refer to 'dj_global' rather than referring to window to ensure your
//		code runs correctly in contexts other than web browsers (eg: Rhino on a server).
var dj_global = this;



function dj_undef(/*String*/ name, /*Object?*/ object){
	//summary: Returns true if 'name' is defined on 'object' (or globally if 'object' is null).
	//description: Note that 'defined' and 'exists' are not the same concept.
	if(object==null){ object = dj_global; }
	// exception if object is not an Object
	return (typeof object[name] == "undefined");	// Boolean
}


// make sure djConfig is defined
if(dj_undef("djConfig")){ 
	var djConfig = {}; 
}


//TODOC:  HOW TO DOC THIS?
// dojo is the root variable of (almost all) our public symbols -- make sure it is defined.
if(dj_undef("dojo")){ 
	var dojo = {}; 
}

//TODOC:  HOW TO DOC THIS?
dojo.version = {
	// summary: version number of this instance of dojo.
	major: 0, minor: 0, patch: 0, flag: "dev",
	revision: Number("$Rev: 4342 $".match(/[0-9]+/)[0]),
	toString: function(){
		with(dojo.version){
			return major + "." + minor + "." + patch + flag + " (" + revision + ")";	// String
		}
	}
}

dojo.evalProp = function(/*String*/ name, /*Object*/ object, /*Boolean?*/ create){
	// summary: Returns 'object[name]'.  If not defined and 'create' is true, will return a new Object.
	// description: 
	//		Returns null if 'object[name]' is not defined and 'create' is not true.
	// 		Note: 'defined' and 'exists' are not the same concept.	
	return (object && !dj_undef(name, object) ? object[name] : (create ? (object[name]={}) : undefined));	// mixed
}


dojo.parseObjPath = function(/*String*/ path, /*Object?*/ context, /*Boolean?*/ create){
	// summary: Parse string path to an object, and return corresponding object reference and property name.
	// description: 
	//		Returns an object with two properties, 'obj' and 'prop'.  
	//		'obj[prop]' is the reference indicated by 'path'.
	// path: Path to an object, in the form "A.B.C".
	// context: Object to use as root of path.  Defaults to 'dj_global'.
	// create: If true, Objects will be created at any point along the 'path' that is undefined.
	var object = (context != null ? context : dj_global);
	var names = path.split('.');
	var prop = names.pop();
	for (var i=0,l=names.length;i<l && object;i++){
		object = dojo.evalProp(names[i], object, create);
	}
	return {obj: object, prop: prop};	// Object: {obj: Object, prop: String}
}


dojo.evalObjPath = function(/*String*/ path, /*Boolean?*/ create){
	// summary: Return the value of object at 'path' in the global scope, without using 'eval()'.
	// path: Path to an object, in the form "A.B.C".
	// create: If true, Objects will be created at any point along the 'path' that is undefined.
	if(typeof path != "string"){ 
		return dj_global; 
	}
	// fast path for no periods
	if(path.indexOf('.') == -1){
		return dojo.evalProp(path, dj_global, create);		// mixed
	}

	//MOW: old 'with' syntax was confusing and would throw an error if parseObjPath returned null.
	var ref = dojo.parseObjPath(path, dj_global, create);
	if(ref){
		return dojo.evalProp(ref.prop, ref.obj, create);	// mixed
	}
	return null;
}

// ****************************************************************
// global public utils
// TODOC: DO WE WANT TO NOTE THAT THESE ARE GLOBAL PUBLIC UTILS?
// ****************************************************************

dojo.errorToString = function(/*Error*/ exception){
	// summary: Return an exception's 'message', 'description' or text.

	// TODO: overriding Error.prototype.toString won't accomplish this?
 	// 		... since natively generated Error objects do not always reflect such things?
	if(!dj_undef("message", exception)){
		return exception.message;		// String
	}else if(!dj_undef("description", exception)){
		return exception.description;	// String
	}else{
		return exception;				// Error
	}
}


dojo.raise = function(/*String*/ message, /*Error?*/ exception){
	// summary: Throw an error message, appending text of 'exception' if provided.
	// note: Also prints a message to the user using 'dojo.hostenv.println'.
	if(exception){
		message = message + ": "+dojo.errorToString(exception);
	}

	// print the message to the user if hostenv.println is defined
	try {	dojo.hostenv.println("FATAL: "+message); } catch (e) {}

	throw Error(message);
}

//Stub functions so things don't break.
//TODOC:  HOW TO DOC THESE?
dojo.debug = function(){}
dojo.debugShallow = function(obj){}
dojo.profile = { start: function(){}, end: function(){}, stop: function(){}, dump: function(){} };


function dj_eval(/*String*/ scriptFragment){ 
	// summary: Perform an evaluation in the global scope.  Use this rather than calling 'eval()' directly.
	// description: Placed in a separate function to minimize size of trapped evaluation context.
	// note:
	//	 - JSC eval() takes an optional second argument which can be 'unsafe'.
	//	 - Mozilla/SpiderMonkey eval() takes an optional second argument which is the
	//  	 scope object for new symbols.
	return dj_global.eval ? dj_global.eval(scriptFragment) : eval(scriptFragment); 	// mixed
}



dojo.unimplemented = function(/*String*/ funcname, /*String?*/ extra){
	// summary: Throw an exception because some function is not implemented.
	// extra: Text to append to the exception message.
	var message = "'" + funcname + "' not implemented";
	if (extra != null) { message += " " + extra; }
	dojo.raise(message);
}


dojo.deprecated = function(/*String*/ behaviour, /*String?*/ extra, /*String?*/ removal){
	// summary: Log a debug message to indicate that a behavior has been deprecated.
	// extra: Text to append to the message.
	// removal: Text to indicate when in the future the behavior will be removed.
	var message = "DEPRECATED: " + behaviour;
	if(extra){ message += " " + extra; }
	if(removal){ message += " -- will be removed in version: " + removal; }
	dojo.debug(message);
}



dojo.inherits = function(/*Function*/ subclass, /*Function*/ superclass){
	// summary: Set up inheritance between two classes.
	if(typeof superclass != 'function'){ 
		dojo.raise("dojo.inherits: superclass argument ["+superclass+"] must be a function (subclass: [" + subclass + "']");
	}
	subclass.prototype = new superclass();
	subclass.prototype.constructor = subclass;
	subclass.superclass = superclass.prototype;
	// DEPRICATED: super is a reserved word, use 'superclass'
	subclass['super'] = superclass.prototype;
}

dojo.render = (function(){
	//TODOC: HOW TO DOC THIS?
	// summary: Details rendering support, OS and browser of the current environment.
	// TODOC: is this something many folks will interact with?  If so, we should doc the structure created...
	function vscaffold(prefs, names){
		var tmp = {
			capable: false,
			support: {
				builtin: false,
				plugin: false
			},
			prefixes: prefs
		};
		for(var prop in names){
			tmp[prop] = false;
		}
		return tmp;
	}

	return {
		name: "",
		ver: dojo.version,
		os: { win: false, linux: false, osx: false },
		html: vscaffold(["html"], ["ie", "opera", "khtml", "safari", "moz"]),
		svg: vscaffold(["svg"], ["corel", "adobe", "batik"]),
		vml: vscaffold(["vml"], ["ie"]),
		swf: vscaffold(["Swf", "Flash", "Mm"], ["mm"]),
		swt: vscaffold(["Swt"], ["ibm"])
	};
})();

// ****************************************************************
// dojo.hostenv methods that must be defined in hostenv_*.js
// ****************************************************************

/**
 * The interface definining the interaction with the EcmaScript host environment.
*/

/*
 * None of these methods should ever be called directly by library users.
 * Instead public methods such as loadModule should be called instead.
 */
dojo.hostenv = (function(){
	// TODOC:  HOW TO DOC THIS?
	// summary: Provides encapsulation of behavior that changes across different 'host environments' 
	//			(different browsers, server via Rhino, etc).
	// description: None of these methods should ever be called directly by library users.
	//				Use public methods such as 'loadModule' instead.
	
	// default configuration options
	var config = {
		isDebug: false,
		allowQueryConfig: false,
		baseScriptUri: "",
		baseRelativePath: "",
		libraryScriptUri: "",
		iePreventClobber: false,
		ieClobberMinimal: true,
		preventBackButtonFix: true,
		searchIds: [],
		parseWidgets: true
	};

	if (typeof djConfig == "undefined") { djConfig = config; }
	else {
		for (var option in config) {
			if (typeof djConfig[option] == "undefined") {
				djConfig[option] = config[option];
			}
		}
	}

	return {
		name_: '(unset)',
		version_: '(unset)',


		getName: function(){ 
			// sumary: Return the name of the host environment.
			return this.name_; 	// String
		},


		getVersion: function(){ 
			// summary: Return the version of the hostenv.
			return this.version_; // String
		},

		getText: function(/*String*/ uri){
			// summary:	Read the plain/text contents at the specified 'uri'.
			// description: 
			//			If 'getText()' is not implemented, then it is necessary to override 
			//			'loadUri()' with an implementation that doesn't rely on it.

			dojo.unimplemented('getText', "uri=" + uri);
		}
	};
})();


dojo.hostenv.getBaseScriptUri = function(){
	// summary: Return the base script uri that other scripts are found relative to.
	// TODOC: HUH?  This comment means nothing to me.  What other scripts? Is this the path to other dojo libraries?
	//		MAYBE:  Return the base uri to scripts in the dojo library.	 ???
	// return: Empty string or a path ending in '/'.
	if(djConfig.baseScriptUri.length){ 
		return djConfig.baseScriptUri;
	}

	// MOW: Why not:
	//			uri = djConfig.libraryScriptUri || djConfig.baseRelativePath
	//		??? Why 'new String(...)'
	var uri = new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
	if (!uri) { dojo.raise("Nothing returned by getLibraryScriptUri(): " + uri); }

	// MOW: uri seems to not be actually used.  Seems to be hard-coding to djConfig.baseRelativePath... ???
	var lastslash = uri.lastIndexOf('/');		// MOW ???
	djConfig.baseScriptUri = djConfig.baseRelativePath;
	return djConfig.baseScriptUri;	// String
}

/*
 * loader.js - runs before the hostenv_*.js file. Contains all of the package loading methods.
 */

//A semi-colon is at the start of the line because after doing a build, this function definition
//get compressed onto the same line as the last line in bootstrap1.js. That list line is just a
//curly bracket, and the browser complains about that syntax. The semicolon fixes it. Putting it
//here instead of at the end of bootstrap1.js, since it is more of an issue for this file, (using
//the closure), and bootstrap1.js could change in the future.
;(function(){
	//Additional properties for dojo.hostenv
	var _addHostEnv = {
		pkgFileName: "__package__",
	
		// for recursion protection
		loading_modules_: {},
		loaded_modules_: {},
		addedToLoadingCount: [],
		removedFromLoadingCount: [],
	
		inFlightCount: 0,
	
		// FIXME: it should be possible to pull module prefixes in from djConfig
		modulePrefixes_: {
			dojo: {name: "dojo", value: "src"}
		},
	
	
		setModulePrefix: function(module, prefix){
			this.modulePrefixes_[module] = {name: module, value: prefix};
		},
	
		getModulePrefix: function(module){
			var mp = this.modulePrefixes_;
			if((mp[module])&&(mp[module]["name"])){
				return mp[module].value;
			}
			return module;
		},

		getTextStack: [],
		loadUriStack: [],
		loadedUris: [],
	
		//WARNING: This variable is referenced by packages outside of bootstrap: FloatingPane.js and undo/browser.js
		post_load_: false,
		
		//Egad! Lots of test files push on this directly instead of using dojo.addOnLoad.
		modulesLoadedListeners: [],
		unloadListeners: [],
		loadNotifying: false
	};
	
	//Add all of these properties to dojo.hostenv
	for(var param in _addHostEnv){
		dojo.hostenv[param] = _addHostEnv[param];
	}
})();

/**
 * Loads and interprets the script located at relpath, which is relative to the
 * script root directory.  If the script is found but its interpretation causes
 * a runtime exception, that exception is not caught by us, so the caller will
 * see it.  We return a true value if and only if the script is found.
 *
 * For now, we do not have an implementation of a true search path.  We
 * consider only the single base script uri, as returned by getBaseScriptUri().
 *
 * @param relpath A relative path to a script (no leading '/', and typically
 * ending in '.js').
 * @param module A module whose existance to check for after loading a path.
 * Can be used to determine success or failure of the load.
 * @param cb a function to pass the result of evaluating the script (optional)
 */
dojo.hostenv.loadPath = function(relpath, module /*optional*/, cb /*optional*/){
	var uri;
	if((relpath.charAt(0) == '/')||(relpath.match(/^\w+:/))){
		// dojo.raise("relpath '" + relpath + "'; must be relative");
		uri = relpath;
	}else{
		uri = this.getBaseScriptUri() + relpath;
	}
	if(djConfig.cacheBust && dojo.render.html.capable){
		uri += "?" + String(djConfig.cacheBust).replace(/\W+/g,"");
	}
	try{
		return ((!module) ? this.loadUri(uri, cb) : this.loadUriAndCheck(uri, module, cb));
	}catch(e){
		dojo.debug(e);
		return false;
	}
}

/**
 * Reads the contents of the URI, and evaluates the contents.
 * Returns true if it succeeded. Returns false if the URI reading failed.
 * Throws if the evaluation throws.
 * The result of the eval is not available to the caller TODO: now it is; was this a deliberate restriction?
 *
 * @param uri a uri which points at the script to be loaded
 * @param cb a function to process the result of evaluating the script as an expression (optional)
 */
dojo.hostenv.loadUri = function(uri, cb /*optional*/){
	if(this.loadedUris[uri]){
		return 1;
	}
	var contents = this.getText(uri, null, true);
	if(contents == null){ return 0; }
	this.loadedUris[uri] = true;
	if(cb){ contents = '('+contents+')'; }
	var value = dj_eval(contents);
	if(cb){
		cb(value);
	}
	return 1;
}

// FIXME: probably need to add logging to this method
dojo.hostenv.loadUriAndCheck = function(uri, module, cb){
	var ok = true;
	try{
		ok = this.loadUri(uri, cb);
	}catch(e){
		dojo.debug("failed loading ", uri, " with error: ", e);
	}
	return ((ok)&&(this.findModule(module, false))) ? true : false;
}

dojo.loaded = function(){ }
dojo.unloaded = function(){ }

dojo.hostenv.loaded = function(){
	this.loadNotifying = true;
	this.post_load_ = true;
	var mll = this.modulesLoadedListeners;
	for(var x=0; x<mll.length; x++){
		mll[x]();
	}

	//Clear listeners so new ones can be added
	//For other xdomain package loads after the initial load.
	this.modulesLoadedListeners = [];
	this.loadNotifying = false;

	dojo.loaded();
}

dojo.hostenv.unloaded = function(){
	var mll = this.unloadListeners;
	while(mll.length){
		(mll.pop())();
	}
	dojo.unloaded();
}

/*
Call styles:
	dojo.addOnLoad(functionPointer)
	dojo.addOnLoad(object, "functionName")
*/
dojo.addOnLoad = function(obj, fcnName) {
	var dh = dojo.hostenv;
	if(arguments.length == 1) {
		dh.modulesLoadedListeners.push(obj);
	} else if(arguments.length > 1) {
		dh.modulesLoadedListeners.push(function() {
			obj[fcnName]();
		});
	}

	//Added for xdomain loading. dojo.addOnLoad is used to
	//indicate callbacks after doing some dojo.require() statements.
	//In the xdomain case, if all the requires are loaded (after initial
	//page load), then immediately call any listeners.
	if(dh.post_load_ && dh.inFlightCount == 0 && !dh.loadNotifying){
		dh.callLoaded();
	}
}

dojo.addOnUnload = function(obj, fcnName){
	var dh = dojo.hostenv;
	if(arguments.length == 1){
		dh.unloadListeners.push(obj);
	} else if(arguments.length > 1) {
		dh.unloadListeners.push(function() {
			obj[fcnName]();
		});
	}
}

dojo.hostenv.modulesLoaded = function(){
	if(this.post_load_){ return; }
	if((this.loadUriStack.length==0)&&(this.getTextStack.length==0)){
		if(this.inFlightCount > 0){ 
			dojo.debug("files still in flight!");
			return;
		}
		dojo.hostenv.callLoaded();
	}
}

dojo.hostenv.callLoaded = function(){
	if(typeof setTimeout == "object"){
		setTimeout("dojo.hostenv.loaded();", 0);
	}else{
		dojo.hostenv.loaded();
	}
}

dojo.hostenv.getModuleSymbols = function(modulename) {
	var syms = modulename.split(".");
	for(var i = syms.length - 1; i > 0; i--){
		var parentModule = syms.slice(0, i).join(".");
		var parentModulePath = this.getModulePrefix(parentModule);
		if(parentModulePath != parentModule){
			syms.splice(0, i, parentModulePath);
			break;
		}
	}
	return syms;
}

/**
* loadModule("A.B") first checks to see if symbol A.B is defined. 
* If it is, it is simply returned (nothing to do).
*
* If it is not defined, it will look for "A/B.js" in the script root directory,
* followed by "A.js".
*
* It throws if it cannot find a file to load, or if the symbol A.B is not
* defined after loading.
*
* It returns the object A.B.
*
* This does nothing about importing symbols into the current package.
* It is presumed that the caller will take care of that. For example, to import
* all symbols:
*
*    with (dojo.hostenv.loadModule("A.B")) {
*       ...
*    }
*
* And to import just the leaf symbol:
*
*    var B = dojo.hostenv.loadModule("A.B");
*    ...
*
* dj_load is an alias for dojo.hostenv.loadModule
*/
dojo.hostenv._global_omit_module_check = false;
dojo.hostenv.loadModule = function(modulename, exact_only, omit_module_check){
	if(!modulename){ return; }
	omit_module_check = this._global_omit_module_check || omit_module_check;
	var module = this.findModule(modulename, false);
	if(module){
		return module;
	}

	// protect against infinite recursion from mutual dependencies
	if(dj_undef(modulename, this.loading_modules_)){
		this.addedToLoadingCount.push(modulename);
	}
	this.loading_modules_[modulename] = 1;

	// convert periods to slashes
	var relpath = modulename.replace(/\./g, '/') + '.js';

	var syms = this.getModuleSymbols(modulename);
	var startedRelative = ((syms[0].charAt(0) != '/')&&(!syms[0].match(/^\w+:/)));
	var last = syms[syms.length - 1];
	// figure out if we're looking for a full package, if so, we want to do
	// things slightly diffrently
	var nsyms = modulename.split(".");
	if(last=="*"){
		modulename = (nsyms.slice(0, -1)).join('.');

		while(syms.length){
			syms.pop();
			syms.push(this.pkgFileName);
			relpath = syms.join("/") + '.js';
			if(startedRelative && (relpath.charAt(0)=="/")){
				relpath = relpath.slice(1);
			}
			ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
			if(ok){ break; }
			syms.pop();
		}
	}else{
		relpath = syms.join("/") + '.js';
		modulename = nsyms.join('.');
		var ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
		if((!ok)&&(!exact_only)){
			syms.pop();
			while(syms.length){
				relpath = syms.join('/') + '.js';
				ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
				if(ok){ break; }
				syms.pop();
				relpath = syms.join('/') + '/'+this.pkgFileName+'.js';
				if(startedRelative && (relpath.charAt(0)=="/")){
					relpath = relpath.slice(1);
				}
				ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
				if(ok){ break; }
			}
		}

		if((!ok)&&(!omit_module_check)){
			dojo.raise("Could not load '" + modulename + "'; last tried '" + relpath + "'");
		}
	}

	// check that the symbol was defined
	//Don't bother if we're doing xdomain (asynchronous) loading.
	if(!omit_module_check && !this["isXDomain"]){
		// pass in false so we can give better error
		module = this.findModule(modulename, false);
		if(!module){
			dojo.raise("symbol '" + modulename + "' is not defined after loading '" + relpath + "'"); 
		}
	}

	return module;
}

/**
* startPackage("A.B") follows the path, and at each level creates a new empty
* object or uses what already exists. It returns the result.
*/
dojo.hostenv.startPackage = function(packname){
	var modref = dojo.evalObjPath((packname.split(".").slice(0, -1)).join('.'));
	this.loaded_modules_[(new String(packname)).toLowerCase()] = modref;

	var syms = packname.split(/\./);
	if(syms[syms.length-1]=="*"){
		syms.pop();
	}
	return dojo.evalObjPath(syms.join("."), true);
}

/**
 * findModule("A.B") returns the object A.B if it exists, otherwise null.
 * @param modulename A string like 'A.B'.
 * @param must_exist Optional, defualt false. throw instead of returning null
 * if the module does not currently exist.
 */
dojo.hostenv.findModule = function(modulename, must_exist){
	// check cache
	/*
	if(!dj_undef(modulename, this.modules_)){
		return this.modules_[modulename];
	}
	*/

	var lmn = (new String(modulename)).toLowerCase();

	if(this.loaded_modules_[lmn]){
		return this.loaded_modules_[lmn];
	}

	// see if symbol is defined anyway
	var module = dojo.evalObjPath(modulename);
	if((modulename)&&(typeof module != 'undefined')&&(module)){
		this.loaded_modules_[lmn] = module;
		return module;
	}

	if(must_exist){
		dojo.raise("no loaded module named '" + modulename + "'");
	}
	return null;
}

//Start of old bootstrap2:

/*
 * This method taks a "map" of arrays which one can use to optionally load dojo
 * modules. The map is indexed by the possible dojo.hostenv.name_ values, with
 * two additional values: "default" and "common". The items in the "default"
 * array will be loaded if none of the other items have been choosen based on
 * the hostenv.name_ item. The items in the "common" array will _always_ be
 * loaded, regardless of which list is chosen.  Here's how it's normally
 * called:
 *
 *	dojo.kwCompoundRequire({
 *		browser: [
 *			["foo.bar.baz", true, true], // an example that passes multiple args to loadModule()
 *			"foo.sample.*",
 *			"foo.test,
 *		],
 *		default: [ "foo.sample.*" ],
 *		common: [ "really.important.module.*" ]
 *	});
 */
dojo.kwCompoundRequire = function(modMap){
	var common = modMap["common"]||[];
	var result = (modMap[dojo.hostenv.name_]) ? common.concat(modMap[dojo.hostenv.name_]||[]) : common.concat(modMap["default"]||[]);

	for(var x=0; x<result.length; x++){
		var curr = result[x];
		if(curr.constructor == Array){
			dojo.hostenv.loadModule.apply(dojo.hostenv, curr);
		}else{
			dojo.hostenv.loadModule(curr);
		}
	}
}

dojo.require = function(){
	dojo.hostenv.loadModule.apply(dojo.hostenv, arguments);
}

dojo.requireIf = function(){
	if((arguments[0] === true)||(arguments[0]=="common")||(arguments[0] && dojo.render[arguments[0]].capable)){
		var args = [];
		for (var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
		dojo.require.apply(dojo, args);
	}
}

dojo.requireAfterIf = dojo.requireIf;

dojo.provide = function(){
	return dojo.hostenv.startPackage.apply(dojo.hostenv, arguments);
}

dojo.setModulePrefix = function(module, prefix){
	return dojo.hostenv.setModulePrefix(module, prefix);
}

// determine if an object supports a given method
// useful for longer api chains where you have to test each object in the chain
dojo.exists = function(obj, name){
	var p = name.split(".");
	for(var i = 0; i < p.length; i++){
	if(!(obj[p[i]])) return false;
		obj = obj[p[i]];
	}
	return true;
}

};

if(typeof window == 'undefined'){
	dojo.raise("no window object");
}

// attempt to figure out the path to dojo if it isn't set in the config
(function() {
	// before we get any further with the config options, try to pick them out
	// of the URL. Most of this code is from NW
	if(djConfig.allowQueryConfig){
		var baseUrl = document.location.toString(); // FIXME: use location.query instead?
		var params = baseUrl.split("?", 2);
		if(params.length > 1){
			var paramStr = params[1];
			var pairs = paramStr.split("&");
			for(var x in pairs){
				var sp = pairs[x].split("=");
				// FIXME: is this eval dangerous?
				if((sp[0].length > 9)&&(sp[0].substr(0, 9) == "djConfig.")){
					var opt = sp[0].substr(9);
					try{
						djConfig[opt]=eval(sp[1]);
					}catch(e){
						djConfig[opt]=sp[1];
					}
				}
			}
		}
	}

	if(((djConfig["baseScriptUri"] == "")||(djConfig["baseRelativePath"] == "")) &&(document && document.getElementsByTagName)){
		var scripts = document.getElementsByTagName("script");
		var rePkg = /(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
		for(var i = 0; i < scripts.length; i++) {
			var src = scripts[i].getAttribute("src");
			if(!src) { continue; }
			var m = src.match(rePkg);
			if(m) {
				var root = src.substring(0, m.index);
				if(src.indexOf("bootstrap1") > -1) { root += "../"; }
				if(!this["djConfig"]) { djConfig = {}; }
				if(djConfig["baseScriptUri"] == "") { djConfig["baseScriptUri"] = root; }
				if(djConfig["baseRelativePath"] == "") { djConfig["baseRelativePath"] = root; }
				break;
			}
		}
	}

	// fill in the rendering support information in dojo.render.*
	var dr = dojo.render;
	var drh = dojo.render.html;
	var drs = dojo.render.svg;
	var dua = drh.UA = navigator.userAgent;
	var dav = drh.AV = navigator.appVersion;
	var t = true;
	var f = false;
	drh.capable = t;
	drh.support.builtin = t;

	dr.ver = parseFloat(drh.AV);
	dr.os.mac = dav.indexOf("Macintosh") >= 0;
	dr.os.win = dav.indexOf("Windows") >= 0;
	// could also be Solaris or something, but it's the same browser
	dr.os.linux = dav.indexOf("X11") >= 0;

	drh.opera = dua.indexOf("Opera") >= 0;
	drh.khtml = (dav.indexOf("Konqueror") >= 0)||(dav.indexOf("Safari") >= 0);
	drh.safari = dav.indexOf("Safari") >= 0;
	var geckoPos = dua.indexOf("Gecko");
	drh.mozilla = drh.moz = (geckoPos >= 0)&&(!drh.khtml);
	if (drh.mozilla) {
		// gecko version is YYYYMMDD
		drh.geckoVersion = dua.substring(geckoPos + 6, geckoPos + 14);
	}
	drh.ie = (document.all)&&(!drh.opera);
	drh.ie50 = drh.ie && dav.indexOf("MSIE 5.0")>=0;
	drh.ie55 = drh.ie && dav.indexOf("MSIE 5.5")>=0;
	drh.ie60 = drh.ie && dav.indexOf("MSIE 6.0")>=0;
	drh.ie70 = drh.ie && dav.indexOf("MSIE 7.0")>=0;

	// TODO: is the HTML LANG attribute relevant?
	dojo.locale = (drh.ie ? navigator.userLanguage : navigator.language).toLowerCase();

	dr.vml.capable=drh.ie;
	drs.capable = f;
	drs.support.plugin = f;
	drs.support.builtin = f;
	if (document.implementation
		&& document.implementation.hasFeature
		&& document.implementation.hasFeature("org.w3c.dom.svg", "1.0")
	){
		drs.capable = t;
		drs.support.builtin = t;
		drs.support.plugin = f;
	}
})();

dojo.hostenv.startPackage("dojo.hostenv");

dojo.render.name = dojo.hostenv.name_ = 'browser';
dojo.hostenv.searchIds = [];

// These are in order of decreasing likelihood; this will change in time.
dojo.hostenv._XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

dojo.hostenv.getXmlhttpObject = function(){
    var http = null;
	var last_e = null;
	try{ http = new XMLHttpRequest(); }catch(e){}
    if(!http){
		for(var i=0; i<3; ++i){
			var progid = dojo.hostenv._XMLHTTP_PROGIDS[i];
			try{
				http = new ActiveXObject(progid);
			}catch(e){
				last_e = e;
			}

			if(http){
				dojo.hostenv._XMLHTTP_PROGIDS = [progid];  // so faster next time
				break;
			}
		}

		/*if(http && !http.toString) {
			http.toString = function() { "[object XMLHttpRequest]"; }
		}*/
	}

	if(!http){
		return dojo.raise("XMLHTTP not available", last_e);
	}

	return http;
}

/**
 * Read the contents of the specified uri and return those contents.
 *
 * @param uri A relative or absolute uri. If absolute, it still must be in the
 * same "domain" as we are.
 *
 * @param async_cb If not specified, load synchronously. If specified, load
 * asynchronously, and use async_cb as the progress handler which takes the
 * xmlhttp object as its argument. If async_cb, this function returns null.
 *
 * @param fail_ok Default false. If fail_ok and !async_cb and loading fails,
 * return null instead of throwing.
 */
dojo.hostenv.getText = function(uri, async_cb, fail_ok){

	var http = this.getXmlhttpObject();

	if(async_cb){
		http.onreadystatechange = function(){
			if(4==http.readyState){
				if((!http["status"])||((200 <= http.status)&&(300 > http.status))){
					// dojo.debug("LOADED URI: "+uri);
					async_cb(http.responseText);
				}
			}
		}
	}

	http.open('GET', uri, async_cb ? true : false);
	try{
		http.send(null);
		if(async_cb){
			return null;
		}
		if((http["status"])&&((200 > http.status)||(300 <= http.status))){
			throw Error("Unable to load "+uri+" status:"+ http.status);
		}
	}catch(e){
		if((fail_ok)&&(!async_cb)){
			return null;
		}else{
			throw e;
		}
	}

	return http.responseText;
}

/*
 * It turns out that if we check *right now*, as this script file is being loaded,
 * then the last script element in the window DOM is ourselves.
 * That is because any subsequent script elements haven't shown up in the document
 * object yet.
 */
 /*
function dj_last_script_src() {
    var scripts = window.document.getElementsByTagName('script');
    if(scripts.length < 1){
		dojo.raise("No script elements in window.document, so can't figure out my script src");
	}
    var script = scripts[scripts.length - 1];
    var src = script.src;
    if(!src){
		dojo.raise("Last script element (out of " + scripts.length + ") has no src");
	}
    return src;
}

if(!dojo.hostenv["library_script_uri_"]){
	dojo.hostenv.library_script_uri_ = dj_last_script_src();
}
*/

dojo.hostenv.defaultDebugContainerId = 'dojoDebug';
dojo.hostenv._println_buffer = [];
dojo.hostenv._println_safe = false;
dojo.hostenv.println = function (line){
	if(!dojo.hostenv._println_safe){
		dojo.hostenv._println_buffer.push(line);
	}else{
		try {
			var console = document.getElementById(djConfig.debugContainerId ?
				djConfig.debugContainerId : dojo.hostenv.defaultDebugContainerId);
			if(!console) { console = document.getElementsByTagName("body")[0] || document.body; }

			var div = document.createElement("div");
			div.appendChild(document.createTextNode(line));
			console.appendChild(div);
		} catch (e) {
			try{
				// safari needs the output wrapped in an element for some reason
				document.write("<div>" + line + "</div>");
			}catch(e2){
				window.status = line;
			}
		}
	}
}

dojo.addOnLoad(function(){
	dojo.hostenv._println_safe = true;
	while(dojo.hostenv._println_buffer.length > 0){
		dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
	}
});

function dj_addNodeEvtHdlr(node, evtName, fp, capture){
	var oldHandler = node["on"+evtName] || function(){};
	node["on"+evtName] = function(){
		fp.apply(node, arguments);
		oldHandler.apply(node, arguments);
	}
	return true;
}


/* Uncomment this to allow init after DOMLoad, not after window.onload

// Mozilla exposes the event we could use
if (dojo.render.html.mozilla) {
   document.addEventListener("DOMContentLoaded", dj_load_init, null);
}
// for Internet Explorer. readyState will not be achieved on init call, but dojo doesn't need it
//Tighten up the comments below to allow init after DOMLoad, not after window.onload
/ * @cc_on @ * /
/ * @if (@_win32)
    document.write("<script defer>dj_load_init()<"+"/script>");
/ * @end @ * /
*/

// default for other browsers
// potential TODO: apply setTimeout approach for other browsers
// that will cause flickering though ( document is loaded and THEN is processed)
// maybe show/hide required in this case..
// TODO: other browsers may support DOMContentLoaded/defer attribute. Add them to above.
dj_addNodeEvtHdlr(window, "load", function(){
	// allow multiple calls, only first one will take effect
	if(arguments.callee.initialized){ return; }
	arguments.callee.initialized = true;

	var initFunc = function(){
		//perform initialization
		if(dojo.render.html.ie){
			dojo.hostenv.makeWidgets();
		}
	};

	if(dojo.hostenv.inFlightCount == 0){
		initFunc();
		dojo.hostenv.modulesLoaded();
	}else{
		dojo.addOnLoad(initFunc);
	}
});

dj_addNodeEvtHdlr(window, "unload", function(){
	dojo.hostenv.unloaded();
});

dojo.hostenv.makeWidgets = function(){
	// you can put searchIds in djConfig and dojo.hostenv at the moment
	// we should probably eventually move to one or the other
	var sids = [];
	if(djConfig.searchIds && djConfig.searchIds.length > 0) {
		sids = sids.concat(djConfig.searchIds);
	}
	if(dojo.hostenv.searchIds && dojo.hostenv.searchIds.length > 0) {
		sids = sids.concat(dojo.hostenv.searchIds);
	}

	if((djConfig.parseWidgets)||(sids.length > 0)){
		if(dojo.evalObjPath("dojo.widget.Parse")){
			// we must do this on a delay to avoid:
			//	http://www.shaftek.org/blog/archives/000212.html
			// IE is such a tremendous peice of shit.
				var parser = new dojo.xml.Parse();
				if(sids.length > 0){
					for(var x=0; x<sids.length; x++){
						var tmpNode = document.getElementById(sids[x]);
						if(!tmpNode){ continue; }
						var frag = parser.parseElement(tmpNode, null, true);
						dojo.widget.getParser().createComponents(frag);
					}
				}else if(djConfig.parseWidgets){
					var frag  = parser.parseElement(document.getElementsByTagName("body")[0] || document.body, null, true);
					dojo.widget.getParser().createComponents(frag);
				}
		}
	}
}

dojo.addOnLoad(function(){
	if(!dojo.render.html.ie) {
		dojo.hostenv.makeWidgets();
	}
});

try {
	if (dojo.render.html.ie) {
		document.write('<style>v\:*{ behavior:url(#default#VML); }</style>');
		document.write('<xml:namespace ns="urn:schemas-microsoft-com:vml" prefix="v"/>');
	}
} catch (e) { }

// stub, over-ridden by debugging code. This will at least keep us from
// breaking when it's not included
dojo.hostenv.writeIncludes = function(){}

dojo.byId = function(id, doc){
	if(id && (typeof id == "string" || id instanceof String)){
		if(!doc){ doc = document; }
		return doc.getElementById(id);
	}
	return id; // assume it's a node
}

//Semicolon is for when this file is integrated with a custom build on one line
//with some other file's contents. Sometimes that makes things not get defined
//properly, particularly with the using the closure below to do all the work.
;(function(){
	//Don't do this work if dojo.js has already done it.
	if(typeof dj_usingBootstrap != "undefined"){
		return;
	}

	var isRhino = false;
	var isSpidermonkey = false;
	var isDashboard = false;
	if((typeof this["load"] == "function")&&((typeof this["Packages"] == "function")||(typeof this["Packages"] == "object"))){
		isRhino = true;
	}else if(typeof this["load"] == "function"){
		isSpidermonkey  = true;
	}else if(window.widget){
		isDashboard = true;
	}

	var tmps = [];
	if((this["djConfig"])&&((djConfig["isDebug"])||(djConfig["debugAtAllCosts"]))){
		tmps.push("debug.js");
	}

	if((this["djConfig"])&&(djConfig["debugAtAllCosts"])&&(!isRhino)&&(!isDashboard)){
		tmps.push("browser_debug.js");
	}

	//Support compatibility packages. Right now this only allows setting one
	//compatibility package. Might need to revisit later down the line to support
	//more than one.
	if((this["djConfig"])&&(djConfig["compat"])){
		tmps.push("compat/" + djConfig["compat"] + ".js");
	}

	var loaderRoot = djConfig["baseScriptUri"];
	if((this["djConfig"])&&(djConfig["baseLoaderUri"])){
		loaderRoot = djConfig["baseLoaderUri"];
	}

	for(var x=0; x < tmps.length; x++){
		var spath = loaderRoot+"src/"+tmps[x];
		if(isRhino||isSpidermonkey){
			load(spath);
		} else {
			try {
				document.write("<scr"+"ipt type='text/javascript' src='"+spath+"'></scr"+"ipt>");
			} catch (e) {
				var script = document.createElement("script");
				script.src = spath;
				document.getElementsByTagName("head")[0].appendChild(script);
			}
		}
	}
})();

// Localization routines

/**
 * The locale to look for string bundles if none are defined for your locale.  Translations for all strings
 * should be provided in this locale.
 */
//TODO: this really belongs in translation metadata, not in code
dojo.fallback_locale = 'en';

/**
 * Returns canonical form of locale, as used by Dojo.  All variants are case-insensitive and are separated by '-'
 * as specified in RFC 3066
 */
dojo.normalizeLocale = function(locale) {
	return locale ? locale.toLowerCase() : dojo.locale;
};

/**
 * requireLocalization() is for loading translated bundles provided within a package in the namespace.
 * Contents are typically strings, but may be any name/value pair, represented in JSON format.
 * A bundle is structured in a program as follows:
 *
 * <package>/
 *  nls/
 *   de/
 *    mybundle.js
 *   de-at/
 *    mybundle.js
 *   en/
 *    mybundle.js
 *   en-us/
 *    mybundle.js
 *   en-gb/
 *    mybundle.js
 *   es/
 *    mybundle.js
 *  ...etc
 *
 * where package is part of the namespace as used by dojo.require().  Each directory is named for a
 * locale as specified by RFC 3066, (http://www.ietf.org/rfc/rfc3066.txt), normalized in lowercase.
 *
 * For a given locale, string bundles will be loaded for that locale and all general locales above it, as well
 * as a system-specified fallback.  For example, "de_at" will also load "de" and "en".  Lookups will traverse
 * the locales in this order.  A build step can preload the bundles to avoid data redundancy and extra network hits.
 *
 * @param modulename package in which the bundle is found
 * @param bundlename bundle name, typically the filename without the '.js' suffix
 * @param locale the locale to load (optional)  By default, the browser's user locale as defined
 *	in dojo.locale
 */
dojo.requireLocalization = function(modulename, bundlename, locale /*optional*/){

	dojo.debug("EXPERIMENTAL: dojo.requireLocalization"); //dojo.experimental

	var syms = dojo.hostenv.getModuleSymbols(modulename);
	var modpath = syms.concat("nls").join("/");

	locale = dojo.normalizeLocale(locale);

	var elements = locale.split('-');
	var searchlist = [];
	for(var i = elements.length; i > 0; i--){
		searchlist.push(elements.slice(0, i).join('-'));
	}
	if(searchlist[searchlist.length-1] != dojo.fallback_locale){
		searchlist.push(dojo.fallback_locale);
	}

	var bundlepackage = [modulename, "_nls", bundlename].join(".");
	var bundle = dojo.hostenv.startPackage(bundlepackage);
	dojo.hostenv.loaded_modules_[bundlepackage] = bundle;
	
	var inherit = false;
	for(var i = searchlist.length - 1; i >= 0; i--){
		var loc = searchlist[i];
		var pkg = [bundlepackage, loc].join(".");
		var loaded = false;
		if(!dojo.hostenv.findModule(pkg)){
			// Mark loaded whether it's found or not, so that further load attempts will not be made
			dojo.hostenv.loaded_modules_[pkg] = null;

			var filespec = [modpath, loc, bundlename].join("/") + '.js';
			loaded = dojo.hostenv.loadPath(filespec, null, function(hash) {
 				bundle[loc] = hash;
 				if(inherit){
					// Use mixins approach to copy string references from inherit bundle, but skip overrides.
					for(var x in inherit){
						if(!bundle[loc][x]){
							bundle[loc][x] = inherit[x];
						}
					}
 				}
/*
				// Use prototype to point to other bundle, then copy in result from loadPath
				bundle[loc] = new function(){};
				if(inherit){ bundle[loc].prototype = inherit; }
				for(var i in hash){ bundle[loc][i] = hash[i]; }
*/
			});
		}else{
			loaded = true;
		}
		if(loaded && bundle[loc]){
			inherit = bundle[loc];
		}
	}
};

dojo.provide("dojo.lang.common");
dojo.require("dojo.lang");

/*
 * Adds the given properties/methods to the specified object
 */
dojo.lang._mixin = function(obj, props){
	var tobj = {};
	for(var x in props){
		// the "tobj" condition avoid copying properties in "props"
		// inherited from Object.prototype.  For example, if obj has a custom
		// toString() method, don't overwrite it with the toString() method
		// that props inherited from Object.protoype
		if(typeof tobj[x] == "undefined" || tobj[x] != props[x]) {
			obj[x] = props[x];
		}
	}
	// IE doesn't recognize custom toStrings in for..in
	if(dojo.render.html.ie && dojo.lang.isFunction(props["toString"]) && props["toString"] != obj["toString"]) {
		obj.toString = props.toString;
	}
	return obj;
}

/*
 * Adds the properties/methods of argument Objects to obj
 */
dojo.lang.mixin = function(obj, props /*, props, ..., props */){
	for(var i=1, l=arguments.length; i<l; i++){
		dojo.lang._mixin(obj, arguments[i]);
	}
	return obj;
}

/*
 * Adds the properties/methods of argument Objects to ctor's prototype
 */
dojo.lang.extend = function(ctor /*function*/, props /*, props, ..., props */){
	for(var i=1, l=arguments.length; i<l; i++){
		dojo.lang._mixin(ctor.prototype, arguments[i]);
	}
	return ctor;
}

/**
 * See if val is in arr. Call signatures:
 *  find(array, value, identity) // recommended
 *  find(value, array, identity)
**/
dojo.lang.find = function(	/*Array*/	arr, 
							/*Object*/	val,
							/*boolean*/	identity,
							/*boolean*/	findLast){
	// support both (arr, val) and (val, arr)
	if(!dojo.lang.isArrayLike(arr) && dojo.lang.isArrayLike(val)) {
		var a = arr;
		arr = val;
		val = a;
	}
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }

	if(findLast) {
		var step = -1;
		var i = arr.length - 1;
		var end = -1;
	} else {
		var step = 1;
		var i = 0;
		var end = arr.length;
	}
	if(identity){
		while(i != end) {
			if(arr[i] === val){ return i; }
			i += step;
		}
	}else{
		while(i != end) {
			if(arr[i] == val){ return i; }
			i += step;
		}
	}
	return -1;
}

dojo.lang.indexOf = dojo.lang.find;

dojo.lang.findLast = function(/*Array*/ arr, /*Object*/ val, /*boolean*/ identity){
	return dojo.lang.find(arr, val, identity, true);
}

dojo.lang.lastIndexOf = dojo.lang.findLast;

dojo.lang.inArray = function(arr /*Array*/, val /*Object*/){
	return dojo.lang.find(arr, val) > -1; // return: boolean
}

/**
 * Partial implmentation of is* functions from
 * http://www.crockford.com/javascript/recommend.html
 * NOTE: some of these may not be the best thing to use in all situations
 * as they aren't part of core JS and therefore can't work in every case.
 * See WARNING messages inline for tips.
 *
 * The following is* functions are fairly "safe"
 */

dojo.lang.isObject = function(wh){
	if(typeof wh == "undefined"){ return false; }
	return (typeof wh == "object" || wh === null || dojo.lang.isArray(wh) || dojo.lang.isFunction(wh));
}

dojo.lang.isArray = function(wh){
	return (wh instanceof Array || typeof wh == "array");
}

dojo.lang.isArrayLike = function(wh){
	if(dojo.lang.isString(wh)){ return false; }
	if(dojo.lang.isFunction(wh)){ return false; } // keeps out built-in ctors (Number, String, ...) which have length properties
	if(dojo.lang.isArray(wh)){ return true; }
	if(typeof wh != "undefined" && wh
		&& dojo.lang.isNumber(wh.length) && isFinite(wh.length)){ return true; }
	return false;
}

dojo.lang.isFunction = function(wh){
	if(!wh){ return false; }
	return (wh instanceof Function || typeof wh == "function");
}

dojo.lang.isString = function(wh){
	return (wh instanceof String || typeof wh == "string");
}

dojo.lang.isAlien = function(wh){
	if(!wh){ return false; }
	return !dojo.lang.isFunction() && /\{\s*\[native code\]\s*\}/.test(String(wh));
}

dojo.lang.isBoolean = function(wh){
	return (wh instanceof Boolean || typeof wh == "boolean");
}

/**
 * The following is***() functions are somewhat "unsafe". Fortunately,
 * there are workarounds the the language provides and are mentioned
 * in the WARNING messages.
 *
 * WARNING: In most cases, isNaN(wh) is sufficient to determine whether or not
 * something is a number or can be used as such. For example, a number or string
 * can be used interchangably when accessing array items (arr["1"] is the same as
 * arr[1]) and isNaN will return false for both values ("1" and 1). Should you
 * use isNumber("1"), that will return false, which is generally not too useful.
 * Also, isNumber(NaN) returns true, again, this isn't generally useful, but there
 * are corner cases (like when you want to make sure that two things are really
 * the same type of thing). That is really where isNumber "shines".
 *
 * RECOMMENDATION: Use isNaN(wh) when possible
 */
dojo.lang.isNumber = function(wh){
	return (wh instanceof Number || typeof wh == "number");
}

/**
 * WARNING: In some cases, isUndefined will not behave as you
 * might expect. If you do isUndefined(foo) and there is no earlier
 * reference to foo, an error will be thrown before isUndefined is
 * called. It behaves correctly if you scope yor object first, i.e.
 * isUndefined(foo.bar) where foo is an object and bar isn't a
 * property of the object.
 *
 * RECOMMENDATION: Use `typeof foo == "undefined"` when possible
 *
 * FIXME: Should isUndefined go away since it is error prone?
 */
dojo.lang.isUndefined = function(wh){
	return ((wh == undefined)&&(typeof wh == "undefined"));
}

// end Crockford functions

dojo.provide("dojo.lang.func");

dojo.require("dojo.lang.common");

/**
 * Runs a function in a given scope (thisObject), can
 * also be used to preserve scope.
 *
 * hitch(foo, "bar"); // runs foo.bar() in the scope of foo
 * hitch(foo, myFunction); // runs myFunction in the scope of foo
 */
dojo.lang.hitch = function(thisObject, method) {
	if(dojo.lang.isString(method)) {
		var fcn = thisObject[method];
	} else {
		var fcn = method;
	}

	return function() {
		return fcn.apply(thisObject, arguments);
	}
}

dojo.lang.anonCtr = 0;
dojo.lang.anon = {};
dojo.lang.nameAnonFunc = function(anonFuncPtr, namespaceObj, searchForNames){
	var nso = (namespaceObj || dojo.lang.anon);
	if( (searchForNames) ||
		((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"] == true)) ){
		for(var x in nso){
			if(nso[x] === anonFuncPtr){
				return x;
			}
		}
	}
	var ret = "__"+dojo.lang.anonCtr++;
	while(typeof nso[ret] != "undefined"){
		ret = "__"+dojo.lang.anonCtr++;
	}
	nso[ret] = anonFuncPtr;
	return ret;
}

dojo.lang.forward = function(funcName){
	// Returns a function that forwards a method call to this.func(...)
	return function(){
		return this[funcName].apply(this, arguments);
	};
}

dojo.lang.curry = function(ns, func /* args ... */){
	var outerArgs = [];
	ns = ns||dj_global;
	if(dojo.lang.isString(func)){
		func = ns[func];
	}
	for(var x=2; x<arguments.length; x++){
		outerArgs.push(arguments[x]);
	}
	// since the event system replaces the original function with a new
	// join-point runner with an arity of 0, we check to see if it's left us
	// any clues about the original arity in lieu of the function's actual
	// length property
	var ecount = (func["__preJoinArity"]||func.length) - outerArgs.length;
	// borrowed from svend tofte
	function gather(nextArgs, innerArgs, expected){
		var texpected = expected;
		var totalArgs = innerArgs.slice(0); // copy
		for(var x=0; x<nextArgs.length; x++){
			totalArgs.push(nextArgs[x]);
		}
		// check the list of provided nextArgs to see if it, plus the
		// number of innerArgs already supplied, meets the total
		// expected.
		expected = expected-nextArgs.length;
		if(expected<=0){
			var res = func.apply(ns, totalArgs);
			expected = texpected;
			return res;
		}else{
			return function(){
				return gather(arguments,// check to see if we've been run
										// with enough args
							totalArgs,	// a copy
							expected);	// how many more do we need to run?;
			}
		}
	}
	return gather([], outerArgs, ecount);
}

dojo.lang.curryArguments = function(ns, func, args, offset){
	var targs = [];
	var x = offset||0;
	for(x=offset; x<args.length; x++){
		targs.push(args[x]); // ensure that it's an arr
	}
	return dojo.lang.curry.apply(dojo.lang, [ns, func].concat(targs));
}

dojo.lang.tryThese = function(){
	for(var x=0; x<arguments.length; x++){
		try{
			if(typeof arguments[x] == "function"){
				var ret = (arguments[x]());
				if(ret){
					return ret;
				}
			}
		}catch(e){
			dojo.debug(e);
		}
	}
}

dojo.lang.delayThese = function(farr, cb, delay, onend){
	/**
	 * alternate: (array funcArray, function callback, function onend)
	 * alternate: (array funcArray, function callback)
	 * alternate: (array funcArray)
	 */
	if(!farr.length){ 
		if(typeof onend == "function"){
			onend();
		}
		return;
	}
	if((typeof delay == "undefined")&&(typeof cb == "number")){
		delay = cb;
		cb = function(){};
	}else if(!cb){
		cb = function(){};
		if(!delay){ delay = 0; }
	}
	setTimeout(function(){
		(farr.shift())();
		cb();
		dojo.lang.delayThese(farr, cb, delay, onend);
	}, delay);
}

dojo.provide("dojo.lang.array");

dojo.require("dojo.lang.common");

// FIXME: Is this worthless since you can do: if(name in obj)
// is this the right place for this?
dojo.lang.has = function(obj, name){
	try{
		return (typeof obj[name] != "undefined");
	}catch(e){ return false; }
}

dojo.lang.isEmpty = function(obj) {
	if(dojo.lang.isObject(obj)) {
		var tmp = {};
		var count = 0;
		for(var x in obj){
			if(obj[x] && (!tmp[x])){
				count++;
				break;
			} 
		}
		return (count == 0);
	} else if(dojo.lang.isArrayLike(obj) || dojo.lang.isString(obj)) {
		return obj.length == 0;
	}
}

dojo.lang.map = function(arr, obj, unary_func){
	var isString = dojo.lang.isString(arr);
	if(isString){
		arr = arr.split("");
	}
	if(dojo.lang.isFunction(obj)&&(!unary_func)){
		unary_func = obj;
		obj = dj_global;
	}else if(dojo.lang.isFunction(obj) && unary_func){
		// ff 1.5 compat
		var tmpObj = obj;
		obj = unary_func;
		unary_func = tmpObj;
	}
	if(Array.map){
	 	var outArr = Array.map(arr, unary_func, obj);
	}else{
		var outArr = [];
		for(var i=0;i<arr.length;++i){
			outArr.push(unary_func.call(obj, arr[i]));
		}
	}
	if(isString) {
		return outArr.join("");
	} else {
		return outArr;
	}
}

// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
dojo.lang.forEach = function(anArray /* Array */, callback /* Function */, thisObject /* Object */){
	if(dojo.lang.isString(anArray)){ 
		anArray = anArray.split(""); 
	}
	if(Array.forEach){
		Array.forEach(anArray, callback, thisObject);
	}else{
		// FIXME: there are several ways of handilng thisObject. Is dj_global always the default context?
		if(!thisObject){
			thisObject=dj_global;
		}
		for(var i=0,l=anArray.length; i<l; i++){ 
			callback.call(thisObject, anArray[i], i, anArray);
		}
	}
}

dojo.lang._everyOrSome = function(every, arr, callback, thisObject){
	if(dojo.lang.isString(arr)){ 
		arr = arr.split(""); 
	}
	if(Array.every){
		return Array[ (every) ? "every" : "some" ](arr, callback, thisObject);
	}else{
		if(!thisObject){
			thisObject = dj_global;
		}
		for(var i=0,l=arr.length; i<l; i++){
			var result = callback.call(thisObject, arr[i], i, arr);
			if((every)&&(!result)){
				return false;
			}else if((!every)&&(result)){
				return true;
			}
		}
		return (every) ? true : false;
	}
}

dojo.lang.every = function(arr, callback, thisObject){
	return this._everyOrSome(true, arr, callback, thisObject);
}

dojo.lang.some = function(arr, callback, thisObject){
	return this._everyOrSome(false, arr, callback, thisObject);
}

dojo.lang.filter = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.filter) {
		var outArr = Array.filter(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { dojo.raise("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		var outArr = [];
		for(var i = 0; i < arr.length; i++) {
			if(callback.call(thisObject, arr[i], i, arr)) {
				outArr.push(arr[i]);
			}
		}
	}
	if(isString) {
		return outArr.join("");
	} else {
		return outArr;
	}
}

/**
 * Creates a 1-D array out of all the arguments passed,
 * unravelling any array-like objects in the process
 *
 * Ex:
 * unnest(1, 2, 3) ==> [1, 2, 3]
 * unnest(1, [2, [3], [[[4]]]]) ==> [1, 2, 3, 4]
 */
dojo.lang.unnest = function(/* ... */) {
	var out = [];
	for(var i = 0; i < arguments.length; i++) {
		if(dojo.lang.isArrayLike(arguments[i])) {
			var add = dojo.lang.unnest.apply(this, arguments[i]);
			out = out.concat(add);
		} else {
			out.push(arguments[i]);
		}
	}
	return out;
}

/**
 * Converts an array-like object (i.e. arguments, DOMCollection)
 * to an array
**/
dojo.lang.toArray = function(arrayLike, startOffset) {
	var array = [];
	for(var i = startOffset||0; i < arrayLike.length; i++) {
		array.push(arrayLike[i]);
	}
	return array;
}

dojo.provide("dojo.dom");
dojo.require("dojo.lang.array");

dojo.dom.ELEMENT_NODE                  = 1;
dojo.dom.ATTRIBUTE_NODE                = 2;
dojo.dom.TEXT_NODE                     = 3;
dojo.dom.CDATA_SECTION_NODE            = 4;
dojo.dom.ENTITY_REFERENCE_NODE         = 5;
dojo.dom.ENTITY_NODE                   = 6;
dojo.dom.PROCESSING_INSTRUCTION_NODE   = 7;
dojo.dom.COMMENT_NODE                  = 8;
dojo.dom.DOCUMENT_NODE                 = 9;
dojo.dom.DOCUMENT_TYPE_NODE            = 10;
dojo.dom.DOCUMENT_FRAGMENT_NODE        = 11;
dojo.dom.NOTATION_NODE                 = 12;
	
dojo.dom.dojoml = "http://www.dojotoolkit.org/2004/dojoml";

/**
 *	comprehensive list of XML namespaces
**/
dojo.dom.xmlns = {
	svg : "http://www.w3.org/2000/svg",
	smil : "http://www.w3.org/2001/SMIL20/",
	mml : "http://www.w3.org/1998/Math/MathML",
	cml : "http://www.xml-cml.org",
	xlink : "http://www.w3.org/1999/xlink",
	xhtml : "http://www.w3.org/1999/xhtml",
	xul : "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
	xbl : "http://www.mozilla.org/xbl",
	fo : "http://www.w3.org/1999/XSL/Format",
	xsl : "http://www.w3.org/1999/XSL/Transform",
	xslt : "http://www.w3.org/1999/XSL/Transform",
	xi : "http://www.w3.org/2001/XInclude",
	xforms : "http://www.w3.org/2002/01/xforms",
	saxon : "http://icl.com/saxon",
	xalan : "http://xml.apache.org/xslt",
	xsd : "http://www.w3.org/2001/XMLSchema",
	dt: "http://www.w3.org/2001/XMLSchema-datatypes",
	xsi : "http://www.w3.org/2001/XMLSchema-instance",
	rdf : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rdfs : "http://www.w3.org/2000/01/rdf-schema#",
	dc : "http://purl.org/dc/elements/1.1/",
	dcq: "http://purl.org/dc/qualifiers/1.0",
	"soap-env" : "http://schemas.xmlsoap.org/soap/envelope/",
	wsdl : "http://schemas.xmlsoap.org/wsdl/",
	AdobeExtensions : "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
};

dojo.dom.isNode = function(wh){
	if(typeof Element == "object") {
		try {
			return wh instanceof Element;
		} catch(E) {}
	} else {
		// best-guess
		return wh && !isNaN(wh.nodeType);
	}
}

dojo.dom.getTagName = function(node){
	dojo.deprecated("dojo.dom.getTagName", "use node.tagName instead", "0.4");

	var tagName = node.tagName;
	if(tagName.substr(0,5).toLowerCase()!="dojo:"){
		
		if(tagName.substr(0,4).toLowerCase()=="dojo"){
			// FIXME: this assuumes tag names are always lower case
			return "dojo:" + tagName.substring(4).toLowerCase();
		}

		// allow lower-casing
		var djt = node.getAttribute("dojoType")||node.getAttribute("dojotype");
		if(djt){
			return "dojo:"+djt.toLowerCase();
		}
		
		if((node.getAttributeNS)&&(node.getAttributeNS(this.dojoml,"type"))){
			return "dojo:" + node.getAttributeNS(this.dojoml,"type").toLowerCase();
		}
		try{
			// FIXME: IE really really doesn't like this, so we squelch
			// errors for it
			djt = node.getAttribute("dojo:type");
		}catch(e){ /* FIXME: log? */ }
		if(djt){
			return "dojo:"+djt.toLowerCase();
		}

		if((!dj_global["djConfig"])||(!djConfig["ignoreClassNames"])){
			// FIXME: should we make this optionally enabled via djConfig?
			var classes = node.className||node.getAttribute("class");
			// FIXME: following line, without check for existence of classes.indexOf
			// breaks firefox 1.5's svg widgets
			if((classes)&&(classes.indexOf)&&(classes.indexOf("dojo-") != -1)){
				var aclasses = classes.split(" ");
				for(var x=0; x<aclasses.length; x++){
					if((aclasses[x].length>5)&&(aclasses[x].indexOf("dojo-")>=0)){
						return "dojo:"+aclasses[x].substr(5).toLowerCase();
					}
				}
			}
		}

	}
	return tagName.toLowerCase();
}

dojo.dom.getUniqueId = function(){
	do {
		var id = "dj_unique_" + (++arguments.callee._idIncrement);
	}while(document.getElementById(id));
	return id;
}
dojo.dom.getUniqueId._idIncrement = 0;

dojo.dom.firstElement = dojo.dom.getFirstChildElement = function(parentNode, tagName){
	var node = parentNode.firstChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE){
		node = node.nextSibling;
	}
	if(tagName && node && node.tagName && node.tagName.toLowerCase() != tagName.toLowerCase()) {
		node = dojo.dom.nextElement(node, tagName);
	}
	return node;
}

dojo.dom.lastElement = dojo.dom.getLastChildElement = function(parentNode, tagName){
	var node = parentNode.lastChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE) {
		node = node.previousSibling;
	}
	if(tagName && node && node.tagName && node.tagName.toLowerCase() != tagName.toLowerCase()) {
		node = dojo.dom.prevElement(node, tagName);
	}
	return node;
}

dojo.dom.nextElement = dojo.dom.getNextSiblingElement = function(node, tagName){
	if(!node) { return null; }
	do {
		node = node.nextSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);

	if(node && tagName && tagName.toLowerCase() != node.tagName.toLowerCase()) {
		return dojo.dom.nextElement(node, tagName);
	}
	return node;
}

dojo.dom.prevElement = dojo.dom.getPreviousSiblingElement = function(node, tagName){
	if(!node) { return null; }
	if(tagName) { tagName = tagName.toLowerCase(); }
	do {
		node = node.previousSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);

	if(node && tagName && tagName.toLowerCase() != node.tagName.toLowerCase()) {
		return dojo.dom.prevElement(node, tagName);
	}
	return node;
}

// TODO: hmph
/*this.forEachChildTag = function(node, unaryFunc) {
	var child = this.getFirstChildTag(node);
	while(child) {
		if(unaryFunc(child) == "break") { break; }
		child = this.getNextSiblingTag(child);
	}
}*/

dojo.dom.moveChildren = function(srcNode, destNode, trim){
	var count = 0;
	if(trim) {
		while(srcNode.hasChildNodes() &&
			srcNode.firstChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.firstChild);
		}
		while(srcNode.hasChildNodes() &&
			srcNode.lastChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.lastChild);
		}
	}
	while(srcNode.hasChildNodes()){
		destNode.appendChild(srcNode.firstChild);
		count++;
	}
	return count;
}

dojo.dom.copyChildren = function(srcNode, destNode, trim){
	var clonedNode = srcNode.cloneNode(true);
	return this.moveChildren(clonedNode, destNode, trim);
}

dojo.dom.removeChildren = function(node){
	var count = node.childNodes.length;
	while(node.hasChildNodes()){ node.removeChild(node.firstChild); }
	return count;
}

dojo.dom.replaceChildren = function(node, newChild){
	// FIXME: what if newChild is an array-like object?
	dojo.dom.removeChildren(node);
	node.appendChild(newChild);
}

dojo.dom.removeNode = function(node){
	if(node && node.parentNode){
		// return a ref to the removed child
		return node.parentNode.removeChild(node);
	}
}

dojo.dom.getAncestors = function(node, filterFunction, returnFirstHit) {
	var ancestors = [];
	var isFunction = dojo.lang.isFunction(filterFunction);
	while(node) {
		if (!isFunction || filterFunction(node)) {
			ancestors.push(node);
		}
		if (returnFirstHit && ancestors.length > 0) { return ancestors[0]; }
		
		node = node.parentNode;
	}
	if (returnFirstHit) { return null; }
	return ancestors;
}

dojo.dom.getAncestorsByTag = function(node, tag, returnFirstHit) {
	tag = tag.toLowerCase();
	return dojo.dom.getAncestors(node, function(el){
		return ((el.tagName)&&(el.tagName.toLowerCase() == tag));
	}, returnFirstHit);
}

dojo.dom.getFirstAncestorByTag = function(node, tag) {
	return dojo.dom.getAncestorsByTag(node, tag, true);
}

dojo.dom.isDescendantOf = function(node, ancestor, guaranteeDescendant){
	// guaranteeDescendant allows us to be a "true" isDescendantOf function
	if(guaranteeDescendant && node) { node = node.parentNode; }
	while(node) {
		if(node == ancestor){ return true; }
		node = node.parentNode;
	}
	return false;
}

dojo.dom.innerXML = function(node){
	if(node.innerXML){
		return node.innerXML;
	}else if (node.xml){
		return node.xml;
	}else if(typeof XMLSerializer != "undefined"){
		return (new XMLSerializer()).serializeToString(node);
	}
}

dojo.dom.createDocument = function(){
	var doc = null;

	if(!dj_undef("ActiveXObject")){
		var prefixes = [ "MSXML2", "Microsoft", "MSXML", "MSXML3" ];
		for(var i = 0; i<prefixes.length; i++){
			try{
				doc = new ActiveXObject(prefixes[i]+".XMLDOM");
			}catch(e){ /* squelch */ };

			if(doc){ break; }
		}
	}else if((document.implementation)&&
		(document.implementation.createDocument)){
		doc = document.implementation.createDocument("", "", null);
	}
	
	return doc;
}

dojo.dom.createDocumentFromText = function(str, mimetype){
	if(!mimetype){ mimetype = "text/xml"; }
	if(!dj_undef("DOMParser")){
		var parser = new DOMParser();
		return parser.parseFromString(str, mimetype);
	}else if(!dj_undef("ActiveXObject")){
		var domDoc = dojo.dom.createDocument();
		if(domDoc){
			domDoc.async = false;
			domDoc.loadXML(str);
			return domDoc;
		}else{
			dojo.debug("toXml didn't work?");
		}
	/*
	}else if((dojo.render.html.capable)&&(dojo.render.html.safari)){
		// FIXME: this doesn't appear to work!
		// from: http://web-graphics.com/mtarchive/001606.php
		// var xml = '<?xml version="1.0"?>'+str;
		var mtype = "text/xml";
		var xml = '<?xml version="1.0"?>'+str;
		var url = "data:"+mtype+";charset=utf-8,"+encodeURIComponent(xml);
		var req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.overrideMimeType(mtype);
		req.send(null);
		return req.responseXML;
	*/
	}else if(document.createElement){
		// FIXME: this may change all tags to uppercase!
		var tmp = document.createElement("xml");
		tmp.innerHTML = str;
		if(document.implementation && document.implementation.createDocument) {
			var xmlDoc = document.implementation.createDocument("foo", "", null);
			for(var i = 0; i < tmp.childNodes.length; i++) {
				xmlDoc.importNode(tmp.childNodes.item(i), true);
			}
			return xmlDoc;
		}
		// FIXME: probably not a good idea to have to return an HTML fragment
		// FIXME: the tmp.doc.firstChild is as tested from IE, so it may not
		// work that way across the board
		return ((tmp.document)&&
			(tmp.document.firstChild ?  tmp.document.firstChild : tmp));
	}
	return null;
}

dojo.dom.prependChild = function(node, parent) {
	if(parent.firstChild) {
		parent.insertBefore(node, parent.firstChild);
	} else {
		parent.appendChild(node);
	}
	return true;
}

dojo.dom.insertBefore = function(node, ref, force){
	if (force != true &&
		(node === ref || node.nextSibling === ref)){ return false; }
	var parent = ref.parentNode;
	parent.insertBefore(node, ref);
	return true;
}

dojo.dom.insertAfter = function(node, ref, force){
	var pn = ref.parentNode;
	if(ref == pn.lastChild){
		if((force != true)&&(node === ref)){
			return false;
		}
		pn.appendChild(node);
	}else{
		return this.insertBefore(node, ref.nextSibling, force);
	}
	return true;
}

dojo.dom.insertAtPosition = function(node, ref, position){
	if((!node)||(!ref)||(!position)){ return false; }
	switch(position.toLowerCase()){
		case "before":
			return dojo.dom.insertBefore(node, ref);
		case "after":
			return dojo.dom.insertAfter(node, ref);
		case "first":
			if(ref.firstChild){
				return dojo.dom.insertBefore(node, ref.firstChild);
			}else{
				ref.appendChild(node);
				return true;
			}
			break;
		default: // aka: last
			ref.appendChild(node);
			return true;
	}
}

dojo.dom.insertAtIndex = function(node, containingNode, insertionIndex){
	var siblingNodes = containingNode.childNodes;

	// if there aren't any kids yet, just add it to the beginning

	if (!siblingNodes.length){
		containingNode.appendChild(node);
		return true;
	}

	// otherwise we need to walk the childNodes
	// and find our spot

	var after = null;

	for(var i=0; i<siblingNodes.length; i++){

		var sibling_index = siblingNodes.item(i)["getAttribute"] ? parseInt(siblingNodes.item(i).getAttribute("dojoinsertionindex")) : -1;

		if (sibling_index < insertionIndex){
			after = siblingNodes.item(i);
		}
	}

	if (after){
		// add it after the node in {after}

		return dojo.dom.insertAfter(node, after);
	}else{
		// add it to the start

		return dojo.dom.insertBefore(node, siblingNodes.item(0));
	}
}
	
/**
 * implementation of the DOM Level 3 attribute.
 * 
 * @param node The node to scan for text
 * @param text Optional, set the text to this value.
 */
dojo.dom.textContent = function(node, text){
	if (text) {
		dojo.dom.replaceChildren(node, document.createTextNode(text));
		return text;
	} else {
		var _result = "";
		if (node == null) { return _result; }
		for (var i = 0; i < node.childNodes.length; i++) {
			switch (node.childNodes[i].nodeType) {
				case 1: // ELEMENT_NODE
				case 5: // ENTITY_REFERENCE_NODE
					_result += dojo.dom.textContent(node.childNodes[i]);
					break;
				case 3: // TEXT_NODE
				case 2: // ATTRIBUTE_NODE
				case 4: // CDATA_SECTION_NODE
					_result += node.childNodes[i].nodeValue;
					break;
				default:
					break;
			}
		}
		return _result;
	}
}

dojo.dom.collectionToArray = function(collection){
	dojo.deprecated("dojo.dom.collectionToArray", "use dojo.lang.toArray instead", "0.4");
	return dojo.lang.toArray(collection);
}

dojo.dom.hasParent = function (node) {
	return node && node.parentNode && dojo.dom.isNode(node.parentNode);
}

/**
 * Determines if node has any of the provided tag names and
 * returns the tag name that matches, empty string otherwise.
 *
 * Examples:
 *
 * myFooNode = <foo />
 * isTag(myFooNode, "foo"); // returns "foo"
 * isTag(myFooNode, "bar"); // returns ""
 * isTag(myFooNode, "FOO"); // returns ""
 * isTag(myFooNode, "hey", "foo", "bar"); // returns "foo"
**/
dojo.dom.isTag = function(node /* ... */) {
	if(node && node.tagName) {
		var arr = dojo.lang.toArray(arguments, 1);
		return arr[ dojo.lang.find(node.tagName, arr) ] || "";
	}
	return "";
}

dojo.provide("dojo.graphics.color");
dojo.require("dojo.lang.array");

// TODO: rewrite the "x2y" methods to take advantage of the parsing
//       abilities of the Color object. Also, beef up the Color
//       object (as possible) to parse most common formats

// takes an r, g, b, a(lpha) value, [r, g, b, a] array, "rgb(...)" string, hex string (#aaa, #aaaaaa, aaaaaaa)
dojo.graphics.color.Color = function(r, g, b, a) {
	// dojo.debug("r:", r[0], "g:", r[1], "b:", r[2]);
	if(dojo.lang.isArray(r)) {
		this.r = r[0];
		this.g = r[1];
		this.b = r[2];
		this.a = r[3]||1.0;
	} else if(dojo.lang.isString(r)) {
		var rgb = dojo.graphics.color.extractRGB(r);
		this.r = rgb[0];
		this.g = rgb[1];
		this.b = rgb[2];
		this.a = g||1.0;
	} else if(r instanceof dojo.graphics.color.Color) {
		this.r = r.r;
		this.b = r.b;
		this.g = r.g;
		this.a = r.a;
	} else {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
}

dojo.graphics.color.Color.fromArray = function(arr) {
	return new dojo.graphics.color.Color(arr[0], arr[1], arr[2], arr[3]);
}

dojo.lang.extend(dojo.graphics.color.Color, {
	toRgb: function(includeAlpha) {
		if(includeAlpha) {
			return this.toRgba();
		} else {
			return [this.r, this.g, this.b];
		}
	},

	toRgba: function() {
		return [this.r, this.g, this.b, this.a];
	},

	toHex: function() {
		return dojo.graphics.color.rgb2hex(this.toRgb());
	},

	toCss: function() {
		return "rgb(" + this.toRgb().join() + ")";
	},

	toString: function() {
		return this.toHex(); // decent default?
	},

	blend: function(color, weight) {
		return dojo.graphics.color.blend(this.toRgb(), new dojo.graphics.color.Color(color).toRgb(), weight);
	}
});

dojo.graphics.color.named = {
	white:      [255,255,255],
	black:      [0,0,0],
	red:        [255,0,0],
	green:	    [0,255,0],
	blue:       [0,0,255],
	navy:       [0,0,128],
	gray:       [128,128,128],
	silver:     [192,192,192]
};

// blend colors a and b (both as RGB array or hex strings) with weight from -1 to +1, 0 being a 50/50 blend
dojo.graphics.color.blend = function(a, b, weight) {
	if(typeof a == "string") { return dojo.graphics.color.blendHex(a, b, weight); }
	if(!weight) { weight = 0; }
	else if(weight > 1) { weight = 1; }
	else if(weight < -1) { weight = -1; }
	var c = new Array(3);
	for(var i = 0; i < 3; i++) {
		var half = Math.abs(a[i] - b[i])/2;
		c[i] = Math.floor(Math.min(a[i], b[i]) + half + (half * weight));
	}
	return c;
}

// very convenient blend that takes and returns hex values
// (will get called automatically by blend when blend gets strings)
dojo.graphics.color.blendHex = function(a, b, weight) {
	return dojo.graphics.color.rgb2hex(dojo.graphics.color.blend(dojo.graphics.color.hex2rgb(a), dojo.graphics.color.hex2rgb(b), weight));
}

// get RGB array from css-style color declarations
dojo.graphics.color.extractRGB = function(color) {
	var hex = "0123456789abcdef";
	color = color.toLowerCase();
	if( color.indexOf("rgb") == 0 ) {
		var matches = color.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
		var ret = matches.splice(1, 3);
		return ret;
	} else {
		var colors = dojo.graphics.color.hex2rgb(color);
		if(colors) {
			return colors;
		} else {
			// named color (how many do we support?)
			return dojo.graphics.color.named[color] || [255, 255, 255];
		}
	}
}

dojo.graphics.color.hex2rgb = function(hex) {
	var hexNum = "0123456789ABCDEF";
	var rgb = new Array(3);
	if( hex.indexOf("#") == 0 ) { hex = hex.substring(1); }
	hex = hex.toUpperCase();
	if(hex.replace(new RegExp("["+hexNum+"]", "g"), "") != "") {
		return null;
	}
	if( hex.length == 3 ) {
		rgb[0] = hex.charAt(0) + hex.charAt(0)
		rgb[1] = hex.charAt(1) + hex.charAt(1)
		rgb[2] = hex.charAt(2) + hex.charAt(2);
	} else {
		rgb[0] = hex.substring(0, 2);
		rgb[1] = hex.substring(2, 4);
		rgb[2] = hex.substring(4);
	}
	for(var i = 0; i < rgb.length; i++) {
		rgb[i] = hexNum.indexOf(rgb[i].charAt(0)) * 16 + hexNum.indexOf(rgb[i].charAt(1));
	}
	return rgb;
}

dojo.graphics.color.rgb2hex = function(r, g, b) {
	if(dojo.lang.isArray(r)) {
		g = r[1] || 0;
		b = r[2] || 0;
		r = r[0] || 0;
	}
	var ret = dojo.lang.map([r, g, b], function(x) {
		x = new Number(x);
		var s = x.toString(16);
		while(s.length < 2) { s = "0" + s; }
		return s;
	});
	ret.unshift("#");
	return ret.join("");
}

dojo.provide("dojo.uri.Uri");

dojo.uri = new function() {
	this.joinPath = function() {
		// DEPRECATED: use the dojo.uri.Uri object instead
		var arr = [];
		for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); }
		return arr.join("/").replace(/\/{2,}/g, "/").replace(/((https*|ftps*):)/i, "$1/");
	}
	
	this.dojoUri = function (uri) {
		// returns a Uri object resolved relative to the dojo root
		return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(), uri);
	}
		
	this.Uri = function (/*uri1, uri2, [...]*/) {
		// An object representing a Uri.
		// Each argument is evaluated in order relative to the next until
		// a conanical uri is producued. To get an absolute Uri relative
		// to the current document use
		//      new dojo.uri.Uri(document.baseURI, uri)

		// TODO: support for IPv6, see RFC 2732

		// resolve uri components relative to each other
		var uri = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			if(!arguments[i]) { continue; }

			// Safari doesn't support this.constructor so we have to be explicit
			var relobj = new dojo.uri.Uri(arguments[i].toString());
			var uriobj = new dojo.uri.Uri(uri.toString());

			if (relobj.path == "" && relobj.scheme == null &&
				relobj.authority == null && relobj.query == null) {
				if (relobj.fragment != null) { uriobj.fragment = relobj.fragment; }
				relobj = uriobj;
			} else if (relobj.scheme == null) {
				relobj.scheme = uriobj.scheme;
			
				if (relobj.authority == null) {
					relobj.authority = uriobj.authority;
					
					if (relobj.path.charAt(0) != "/") {
						var path = uriobj.path.substring(0,
							uriobj.path.lastIndexOf("/") + 1) + relobj.path;

						var segs = path.split("/");
						for (var j = 0; j < segs.length; j++) {
							if (segs[j] == ".") {
								if (j == segs.length - 1) { segs[j] = ""; }
								else { segs.splice(j, 1); j--; }
							} else if (j > 0 && !(j == 1 && segs[0] == "") &&
								segs[j] == ".." && segs[j-1] != "..") {

								if (j == segs.length - 1) { segs.splice(j, 1); segs[j - 1] = ""; }
								else { segs.splice(j - 1, 2); j -= 2; }
							}
						}
						relobj.path = segs.join("/");
					}
				}
			}

			uri = "";
			if (relobj.scheme != null) { uri += relobj.scheme + ":"; }
			if (relobj.authority != null) { uri += "//" + relobj.authority; }
			uri += relobj.path;
			if (relobj.query != null) { uri += "?" + relobj.query; }
			if (relobj.fragment != null) { uri += "#" + relobj.fragment; }
		}

		this.uri = uri.toString();

		// break the uri into its main components
		var regexp = "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
	    var r = this.uri.match(new RegExp(regexp));

		this.scheme = r[2] || (r[1] ? "" : null);
		this.authority = r[4] || (r[3] ? "" : null);
		this.path = r[5]; // can never be undefined
		this.query = r[7] || (r[6] ? "" : null);
		this.fragment  = r[9] || (r[8] ? "" : null);
		
		if (this.authority != null) {
			// server based naming authority
			regexp = "^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
			r = this.authority.match(new RegExp(regexp));
			
			this.user = r[3] || null;
			this.password = r[4] || null;
			this.host = r[5];
			this.port = r[7] || null;
		}
	
		this.toString = function(){ return this.uri; }
	}
};

dojo.provide("dojo.style");
dojo.require("dojo.graphics.color");
dojo.require("dojo.uri.Uri");
dojo.require("dojo.lang.common");

(function(){
	var h = dojo.render.html;
	var ds = dojo.style;
	var db = document["body"]||document["documentElement"];

	ds.boxSizing = {
		MARGIN_BOX: "margin-box",
		BORDER_BOX: "border-box",
		PADDING_BOX: "padding-box",
		CONTENT_BOX: "content-box"
	};
	var bs = ds.boxSizing;
	
	ds.getBoxSizing = function(node){
		if((h.ie)||(h.opera)){ 
			var cm = document["compatMode"];
			if((cm == "BackCompat")||(cm == "QuirksMode")){ 
				return bs.BORDER_BOX; 
			}else{
				return bs.CONTENT_BOX; 
			}
		}else{
			if(arguments.length == 0){ node = document.documentElement; }
			var sizing = ds.getStyle(node, "-moz-box-sizing");
			if(!sizing){ sizing = ds.getStyle(node, "box-sizing"); }
			return (sizing ? sizing : bs.CONTENT_BOX);
		}
	}

	/*

	The following several function use the dimensions shown below

		+-------------------------+
		|  margin                 |
		| +---------------------+ |
		| |  border             | |
		| | +-----------------+ | |
		| | |  padding        | | |
		| | | +-------------+ | | |
		| | | |   content   | | | |
		| | | +-------------+ | | |
		| | +-|-------------|-+ | |
		| +-|-|-------------|-|-+ |
		+-|-|-|-------------|-|-|-+
		| | | |             | | | |
		| | | |<- content ->| | | |
		| |<------ inner ------>| |
		|<-------- outer -------->|
		+-------------------------+

		* content-box

		|m|b|p|             |p|b|m|
		| |<------ offset ----->| |
		| | |<---- client --->| | |
		| | | |<-- width -->| | | |

		* border-box

		|m|b|p|             |p|b|m|
		| |<------ offset ----->| |
		| | |<---- client --->| | |
		| |<------ width ------>| |
	*/

	/*
		Notes:

		General:
			- Uncomputable values are returned as NaN.
			- setOuterWidth/Height return *false* if the outer size could not
			  be computed, otherwise *true*.
			- (sjmiles) knows no way to find the calculated values for auto-margins. 
			- All returned values are floating point in 'px' units. If a
			  non-zero computed style value is not specified in 'px', NaN is
			  returned.

		FF:
			- styles specified as '0' (unitless 0) show computed as '0pt'.

		IE:
			- clientWidth/Height are unreliable (0 unless the object has 'layout').
			- margins must be specified in px, or 0 (in any unit) for any
			  sizing function to work. Otherwise margins detect as 'auto'.
			- padding can be empty or, if specified, must be in px, or 0 (in
			  any unit) for any sizing function to work.

		Safari:
			- Safari defaults padding values to 'auto'.

		See the unit tests for examples of (un)computable values in a given browser.

	*/

	// FIXME: these work for some elements (e.g. DIV) but not others (e.g. TABLE, TEXTAREA)

	ds.isBorderBox = function(node){
		return (ds.getBoxSizing(node) == bs.BORDER_BOX);
	}

	ds.getUnitValue = function(node, cssSelector, autoIsZero){
		var s = ds.getComputedStyle(node, cssSelector);
		if((!s)||((s == 'auto')&&(autoIsZero))){ return { value: 0, units: 'px' }; }
		if(dojo.lang.isUndefined(s)){return ds.getUnitValue.bad;}
		// FIXME: is regex inefficient vs. parseInt or some manual test? 
		var match = s.match(/(\-?[\d.]+)([a-z%]*)/i);
		if (!match){return ds.getUnitValue.bad;}
		return { value: Number(match[1]), units: match[2].toLowerCase() };
	}
	// FIXME: 'bad' value should be 0?
	ds.getUnitValue.bad = { value: NaN, units: '' };
	
	ds.getPixelValue = function(node, cssSelector, autoIsZero){
		var result = ds.getUnitValue(node, cssSelector, autoIsZero);
		// FIXME: there is serious debate as to whether or not this is the right solution
		if(isNaN(result.value)){ return 0; }
		// FIXME: code exists for converting other units to px (see Dean Edward's IE7) 
		// but there are cross-browser complexities
		if((result.value)&&(result.units != 'px')){ return NaN; }
		return result.value;
	}
	
	// FIXME: deprecated
	ds.getNumericStyle = function() {
		dojo.deprecated('dojo.(style|html).getNumericStyle', 'in favor of dojo.(style|html).getPixelValue', '0.4');
		return ds.getPixelValue.apply(this, arguments); 
	}

	ds.setPositivePixelValue = function(node, selector, value){
		if(isNaN(value)){return false;}
		node.style[selector] = Math.max(0, value) + 'px'; 
		return true;
	}
	
	ds._sumPixelValues = function(node, selectors, autoIsZero){
		var total = 0;
		for(var x=0; x<selectors.length; x++){
			total += ds.getPixelValue(node, selectors[x], autoIsZero);
		}
		return total;
	}

	ds.isPositionAbsolute = function(node){
		return (ds.getComputedStyle(node, 'position') == 'absolute');
	}

	ds.getBorderExtent = function(node, side){
		return (ds.getStyle(node, 'border-' + side + '-style') == 'none' ? 0 : ds.getPixelValue(node, 'border-' + side + '-width'));
	}

	ds.getMarginWidth = function(node){
		return ds._sumPixelValues(node, ["margin-left", "margin-right"], ds.isPositionAbsolute(node));
	}

	ds.getBorderWidth = function(node){
		return ds.getBorderExtent(node, 'left') + ds.getBorderExtent(node, 'right');
	}

	ds.getPaddingWidth = function(node){
		return ds._sumPixelValues(node, ["padding-left", "padding-right"], true);
	}

	ds.getPadBorderWidth = function(node) {
		return ds.getPaddingWidth(node) + ds.getBorderWidth(node);
	}
	
	ds.getContentBoxWidth = function(node){
		node = dojo.byId(node);
		return node.offsetWidth - ds.getPadBorderWidth(node);
	}

	ds.getBorderBoxWidth = function(node){
		node = dojo.byId(node);
		return node.offsetWidth;
	}

	ds.getMarginBoxWidth = function(node){
		return ds.getInnerWidth(node) + ds.getMarginWidth(node);
	}

	ds.setContentBoxWidth = function(node, pxWidth){
		node = dojo.byId(node);
		if (ds.isBorderBox(node)){
			pxWidth += ds.getPadBorderWidth(node);
		}
		return ds.setPositivePixelValue(node, "width", pxWidth);
	}

	ds.setMarginBoxWidth = function(node, pxWidth){
		node = dojo.byId(node);
		if (!ds.isBorderBox(node)){
			pxWidth -= ds.getPadBorderWidth(node);
		}
		pxWidth -= ds.getMarginWidth(node);
		return ds.setPositivePixelValue(node, "width", pxWidth);
	}

	// FIXME: deprecate and remove
	ds.getContentWidth = ds.getContentBoxWidth;
	ds.getInnerWidth = ds.getBorderBoxWidth;
	ds.getOuterWidth = ds.getMarginBoxWidth;
	ds.setContentWidth = ds.setContentBoxWidth;
	ds.setOuterWidth = ds.setMarginBoxWidth;

	ds.getMarginHeight = function(node){
		return ds._sumPixelValues(node, ["margin-top", "margin-bottom"], ds.isPositionAbsolute(node));
	}

	ds.getBorderHeight = function(node){
		return ds.getBorderExtent(node, 'top') + ds.getBorderExtent(node, 'bottom');
	}

	ds.getPaddingHeight = function(node){
		return ds._sumPixelValues(node, ["padding-top", "padding-bottom"], true);
	}

	ds.getPadBorderHeight = function(node) {
		return ds.getPaddingHeight(node) + ds.getBorderHeight(node);
	}
	
	ds.getContentBoxHeight = function(node){
		node = dojo.byId(node);
		return node.offsetHeight - ds.getPadBorderHeight(node);
	}

	ds.getBorderBoxHeight = function(node){
		node = dojo.byId(node);
		return node.offsetHeight; // FIXME: does this work?
	}

	ds.getMarginBoxHeight = function(node){
		return ds.getInnerHeight(node) + ds.getMarginHeight(node);
	}

	ds.setContentBoxHeight = function(node, pxHeight){
		node = dojo.byId(node);
		if (ds.isBorderBox(node)){
			pxHeight += ds.getPadBorderHeight(node);
		}
		return ds.setPositivePixelValue(node, "height", pxHeight);
	}

	ds.setMarginBoxHeight = function(node, pxHeight){
		node = dojo.byId(node);
		if (!ds.isBorderBox(node)){
			pxHeight -= ds.getPadBorderHeight(node);
		}
		pxHeight -= ds.getMarginHeight(node);
		return ds.setPositivePixelValue(node, "height", pxHeight);
	}

	// FIXME: deprecate and remove
	ds.getContentHeight = ds.getContentBoxHeight;
	ds.getInnerHeight = ds.getBorderBoxHeight;
	ds.getOuterHeight = ds.getMarginBoxHeight;
	ds.setContentHeight = ds.setContentBoxHeight;
	ds.setOuterHeight = ds.setMarginBoxHeight;

	/**
	 * dojo.style.getAbsolutePosition(xyz, true) returns xyz's position relative to the document.
	 * Itells you where you would position a node
	 * inside document.body such that it was on top of xyz.  Most people set the flag to true when calling
	 * getAbsolutePosition().
	 *
	 * dojo.style.getAbsolutePosition(xyz, false) returns xyz's position relative to the viewport.
	 * It returns the position that would be returned
	 * by event.clientX/Y if the mouse were directly over the top/left of this node.
	 */
	ds.getAbsolutePosition = ds.abs = function(node, includeScroll){
		node = dojo.byId(node);
		var ret = [];
		ret.x = ret.y = 0;
		var st = dojo.html.getScrollTop();
		var sl = dojo.html.getScrollLeft();

		if(h.ie){
			with(node.getBoundingClientRect()){
				ret.x = left-2;
				ret.y = top-2;
			}
		}else if(document.getBoxObjectFor){
			// mozilla
			var bo = document.getBoxObjectFor(node);
			ret.x = bo.x - ds.sumAncestorProperties(node, "scrollLeft");
			ret.y = bo.y - ds.sumAncestorProperties(node, "scrollTop");
		}else{
			if(node["offsetParent"]){
				var endNode;		
				// in Safari, if the node is an absolutely positioned child of
				// the body and the body has a margin the offset of the child
				// and the body contain the body's margins, so we need to end
				// at the body
				if(	(h.safari)&&
					(node.style.getPropertyValue("position") == "absolute")&&
					(node.parentNode == db)){
					endNode = db;
				}else{
					endNode = db.parentNode;
				}

				if(node.parentNode != db){
					var nd = node;
					if(window.opera){ nd = db; }
					ret.x -= ds.sumAncestorProperties(nd, "scrollLeft");
					ret.y -= ds.sumAncestorProperties(nd, "scrollTop");
				}
				do{
					var n = node["offsetLeft"];
					ret.x += isNaN(n) ? 0 : n;
					var m = node["offsetTop"];
					ret.y += isNaN(m) ? 0 : m;
					node = node.offsetParent;
				}while((node != endNode)&&(node != null));
			}else if(node["x"]&&node["y"]){
				ret.x += isNaN(node.x) ? 0 : node.x;
				ret.y += isNaN(node.y) ? 0 : node.y;
			}
		}

		// account for document scrolling!
		if(includeScroll){
			ret.y += st;
			ret.x += sl;
		}

		ret[0] = ret.x;
		ret[1] = ret.y;
		return ret;
	}

	ds.sumAncestorProperties = function(node, prop){
		node = dojo.byId(node);
		if(!node){ return 0; } // FIXME: throw an error?
		
		var retVal = 0;
		while(node){
			var val = node[prop];
			if(val){
				retVal += val - 0;
				if(node==document.body){ break; }// opera and khtml #body & #html has the same values, we only need one value
			}
			node = node.parentNode;
		}
		return retVal;
	}

	ds.getTotalOffset = function(node, type, includeScroll){
		return ds.abs(node, includeScroll)[(type == "top") ? "y" : "x"];
	}

	ds.getAbsoluteX = ds.totalOffsetLeft = function(node, includeScroll){
		return ds.getTotalOffset(node, "left", includeScroll);
	}

	ds.getAbsoluteY = ds.totalOffsetTop = function(node, includeScroll){
		return ds.getTotalOffset(node, "top", includeScroll);
	}

	ds.styleSheet = null;

	// FIXME: this is a really basic stub for adding and removing cssRules, but
	// it assumes that you know the index of the cssRule that you want to add 
	// or remove, making it less than useful.  So we need something that can 
	// search for the selector that you you want to remove.
	ds.insertCssRule = function(selector, declaration, index) {
		if (!ds.styleSheet) {
			if (document.createStyleSheet) { // IE
				ds.styleSheet = document.createStyleSheet();
			} else if (document.styleSheets[0]) { // rest
				// FIXME: should create a new style sheet here
				// fall back on an exsiting style sheet
				ds.styleSheet = document.styleSheets[0];
			} else { return null; } // fail
		}

		if (arguments.length < 3) { // index may == 0
			if (ds.styleSheet.cssRules) { // W3
				index = ds.styleSheet.cssRules.length;
			} else if (ds.styleSheet.rules) { // IE
				index = ds.styleSheet.rules.length;
			} else { return null; } // fail
		}

		if (ds.styleSheet.insertRule) { // W3
			var rule = selector + " { " + declaration + " }";
			return ds.styleSheet.insertRule(rule, index);
		} else if (ds.styleSheet.addRule) { // IE
			return ds.styleSheet.addRule(selector, declaration, index);
		} else { return null; } // fail
	}

	ds.removeCssRule = function(index){
		if(!ds.styleSheet){
			dojo.debug("no stylesheet defined for removing rules");
			return false;
		}
		if(h.ie){
			if(!index){
				index = ds.styleSheet.rules.length;
				ds.styleSheet.removeRule(index);
			}
		}else if(document.styleSheets[0]){
			if(!index){
				index = ds.styleSheet.cssRules.length;
			}
			ds.styleSheet.deleteRule(index);
		}
		return true;
	}

	// calls css by XmlHTTP and inserts it into DOM as <style [widgetType="widgetType"]> *downloaded cssText*</style>
	ds.insertCssFile = function(URI, doc, checkDuplicates){
		if(!URI){ return; }
		if(!doc){ doc = document; }
		var cssStr = dojo.hostenv.getText(URI);
		cssStr = ds.fixPathsInCssText(cssStr, URI);

		if(checkDuplicates){
			var styles = doc.getElementsByTagName("style");
			var cssText = "";
			for(var i = 0; i<styles.length; i++){
				cssText = (styles[i].styleSheet && styles[i].styleSheet.cssText) ? styles[i].styleSheet.cssText : styles[i].innerHTML;
				if(cssStr == cssText){ return; }
			}
		}

		var style = ds.insertCssText(cssStr);
		// insert custom attribute ex dbgHref="../foo.css" usefull when debugging in DOM inspectors, no?
		if(style && djConfig.isDebug){
			style.setAttribute("dbgHref", URI);
		}
		return style
	}

	// DomNode Style  = insertCssText(String ".dojoMenu {color: green;}"[, DomDoc document, dojo.uri.Uri Url ])
	ds.insertCssText = function(cssStr, doc, URI){
		if(!cssStr){ return; }
		if(!doc){ doc = document; }
		if(URI){// fix paths in cssStr
			cssStr = ds.fixPathsInCssText(cssStr, URI);
		}
		var style = doc.createElement("style");
		style.setAttribute("type", "text/css");
		// IE is b0rken enough to require that we add the element to the doc
		// before changing it's properties
		var head = doc.getElementsByTagName("head")[0];
		if(!head){ // must have a head tag 
			dojo.debug("No head tag in document, aborting styles");
			return;
		}else{
			head.appendChild(style);
		}
		if(style.styleSheet){// IE
			style.styleSheet.cssText = cssStr;
		}else{ // w3c
			var cssText = doc.createTextNode(cssStr);
			style.appendChild(cssText);
		}
		return style;
	}

	// String cssText = fixPathsInCssText(String cssStr, dojo.uri.Uri URI)
	// usage: cssText comes from dojoroot/src/widget/templates/HtmlFoobar.css
	// 	it has .dojoFoo { background-image: url(images/bar.png);} 
	//	then uri should point to dojoroot/src/widget/templates/
	ds.fixPathsInCssText = function(cssStr, URI){
		if(!cssStr || !URI){ return; }
		var pos = 0; var str = ""; var url = "";
		while(pos!=-1){
			pos = 0;url = "";
			pos = cssStr.indexOf("url(", pos);
			if(pos<0){ break; }
			str += cssStr.slice(0,pos+4);
			cssStr = cssStr.substring(pos+4, cssStr.length);
			url += cssStr.match(/^[\t\s\w()\/.\\'"-:#=&?]*\)/)[0]; // url string
			cssStr = cssStr.substring(url.length-1, cssStr.length); // remove url from css string til next loop
			url = url.replace(/^[\s\t]*(['"]?)([\w()\/.\\'"-:#=&?]*)\1[\s\t]*?\)/,"$2"); // clean string
			if(url.search(/(file|https?|ftps?):\/\//)==-1){
				url = (new dojo.uri.Uri(URI,url).toString());
			}
			str += url;
		};
		return str+cssStr;
	}

	ds.getBackgroundColor = function(node) {
		node = dojo.byId(node);
		var color;
		do{
			color = ds.getStyle(node, "background-color");
			// Safari doesn't say "transparent"
			if(color.toLowerCase() == "rgba(0, 0, 0, 0)") { color = "transparent"; }
			if(node == document.getElementsByTagName("body")[0]) { node = null; break; }
			node = node.parentNode;
		}while(node && dojo.lang.inArray(color, ["transparent", ""]));
		if(color == "transparent"){
			color = [255, 255, 255, 0];
		}else{
			color = dojo.graphics.color.extractRGB(color);
		}
		return color;
	}

	ds.getComputedStyle = function(node, cssSelector, inValue){
		node = dojo.byId(node);
		// cssSelector may actually be in camel case, so force selector version
		var cssSelector = ds.toSelectorCase(cssSelector);
		var property = ds.toCamelCase(cssSelector);
		if(!node || !node.style){
			return inValue;
		}else if(document.defaultView){ // W3, gecko, KHTML
			try{			
				var cs = document.defaultView.getComputedStyle(node, "");
				if (cs){ 
					return cs.getPropertyValue(cssSelector);
				} 
			}catch(e){ // reports are that Safari can throw an exception above
				if (node.style.getPropertyValue){ // W3
					return node.style.getPropertyValue(cssSelector);
				}else return inValue;
			}
		}else if(node.currentStyle){ // IE
			return node.currentStyle[property];
		}if(node.style.getPropertyValue){ // W3
			return node.style.getPropertyValue(cssSelector);
		}else{
			return inValue;
		}
	}

	/** 
	 * Retrieve a property value from a node's style object.
	 */
	ds.getStyleProperty = function(node, cssSelector){
		node = dojo.byId(node);
		// FIXME: should we use node.style.getPropertyValue over style[property]?
		// style[property] works in all (modern) browsers, getPropertyValue is W3 but not supported in IE
		// FIXME: what about runtimeStyle?
		return (node && node.style ? node.style[ds.toCamelCase(cssSelector)] : undefined);
	}

	/** 
	 * Retrieve a property value from a node's style object.
	 */
	ds.getStyle = function(node, cssSelector){
		var value = ds.getStyleProperty(node, cssSelector);
		return (value ? value : ds.getComputedStyle(node, cssSelector));
	}

	ds.setStyle = function(node, cssSelector, value){
		node = dojo.byId(node);
		if(node && node.style){
			var camelCased = ds.toCamelCase(cssSelector);
			node.style[camelCased] = value;
		}
	}

	ds.toCamelCase = function(selector) {
		var arr = selector.split('-'), cc = arr[0];
		for(var i = 1; i < arr.length; i++) {
			cc += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
		}
		return cc;		
	}

	ds.toSelectorCase = function(selector) {
		return selector.replace(/([A-Z])/g, "-$1" ).toLowerCase() ;
	}

	/* float between 0.0 (transparent) and 1.0 (opaque) */
	ds.setOpacity = function setOpacity(node, opacity, dontFixOpacity) {
		node = dojo.byId(node);
		if(!dontFixOpacity){
			if( opacity >= 1.0){
				if(h.ie){
					ds.clearOpacity(node);
					return;
				}else{
					opacity = 0.999999;
				}
			}else if( opacity < 0.0){ opacity = 0; }
		}
		if(h.ie){
			if(node.nodeName.toLowerCase() == "tr"){
				// FIXME: is this too naive? will we get more than we want?
				var tds = node.getElementsByTagName("td");
				for(var x=0; x<tds.length; x++){
					tds[x].style.filter = "Alpha(Opacity="+opacity*100+")";
				}
			}
			node.style.filter = "Alpha(Opacity="+opacity*100+")";
		}else if(h.moz){
			node.style.opacity = opacity; // ffox 1.0 directly supports "opacity"
			node.style.MozOpacity = opacity;
		}else if(h.safari){
			node.style.opacity = opacity; // 1.3 directly supports "opacity"
			node.style.KhtmlOpacity = opacity;
		}else{
			node.style.opacity = opacity;
		}
	}
		
	ds.getOpacity = function getOpacity (node){
		node = dojo.byId(node);
		if(h.ie){
			var opac = (node.filters && node.filters.alpha &&
				typeof node.filters.alpha.opacity == "number"
				? node.filters.alpha.opacity : 100) / 100;
		}else{
			var opac = node.style.opacity || node.style.MozOpacity ||
				node.style.KhtmlOpacity || 1;
		}
		return opac >= 0.999999 ? 1.0 : Number(opac);
	}

	ds.clearOpacity = function clearOpacity(node){
		node = dojo.byId(node);
		var ns = node.style;
		if(h.ie){
			try {
				if( node.filters && node.filters.alpha ){
					ns.filter = ""; // FIXME: may get rid of other filter effects
				}
			} catch(e) {
				/*
				 * IE7 gives error if node.filters not set;
				 * don't know why or how to workaround (other than this)
				 */
			}
		}else if(h.moz){
			ns.opacity = 1;
			ns.MozOpacity = 1;
		}else if(h.safari){
			ns.opacity = 1;
			ns.KhtmlOpacity = 1;
		}else{
			ns.opacity = 1;
		}
	}

	/** 
	* Set the given style attributes for the node. 
	* Patch submitted by Wolfram Kriesing, 22/03/2006.
	*
	* Ie. dojo.style.setStyleAttributes(myNode, "position:absolute; left:10px; top:10px;") 
	* This just makes it easier to set a style directly without the need to  
	* override it completely (as node.setAttribute() would). 
	* If there is a dojo-method for an attribute, like for "opacity" there 
	* is setOpacity, the dojo method is called instead. 
	* For example: dojo.style.setStyleAttributes(myNode, "opacity: .4"); 
	*  
	* Additionally all the dojo.style.set* methods can also be used. 
	* Ie. when attributes contains "outer-height: 10;" it will call dojo.style.setOuterHeight("10"); 
	* 
	* @param object The node to set the style attributes for. 
	* @param string Ie. "position:absolute; left:10px; top:10px;" 
	*/ 
	ds.setStyleAttributes = function(node, attributes) { 
		var methodMap={ 
			"opacity":dojo.style.setOpacity,
			"content-height":dojo.style.setContentHeight,
			"content-width":dojo.style.setContentWidth,
			"outer-height":dojo.style.setOuterHeight,
			"outer-width":dojo.style.setOuterWidth 
		} 

		var splittedAttribs=attributes.replace(/(;)?\s*$/, "").split(";"); 
		for(var i=0; i<splittedAttribs.length; i++){ 
			var nameValue=splittedAttribs[i].split(":"); 
			var name=nameValue[0].replace(/\s*$/, "").replace(/^\s*/, "").toLowerCase();
			var value=nameValue[1].replace(/\s*$/, "").replace(/^\s*/, "");
			if(dojo.lang.has(methodMap,name)) { 
				methodMap[name](node,value); 
			} else { 
				node.style[dojo.style.toCamelCase(name)]=value; 
			} 
		} 
	} 

	ds._toggle = function(node, tester, setter){
		node = dojo.byId(node);
		setter(node, !tester(node));
		return tester(node);
	}

	// show/hide are library constructs

	// show() 
	// if the node.style.display == 'none' then 
	// set style.display to '' or the value cached by hide()
	ds.show = function(node){
		node = dojo.byId(node);
		if(ds.getStyleProperty(node, 'display')=='none'){
			ds.setStyle(node, 'display', (node.dojoDisplayCache||''));
			node.dojoDisplayCache = undefined;	// cannot use delete on a node in IE6
		}
	}

	// if the node.style.display == 'none' then 
	// set style.display to '' or the value cached by hide()
	ds.hide = function(node){
		node = dojo.byId(node);
		if(typeof node["dojoDisplayCache"] == "undefined"){ // it could == '', so we cannot say !node.dojoDisplayCount
			var d = ds.getStyleProperty(node, 'display')
			if(d!='none'){
				node.dojoDisplayCache = d;
			}
		}
		ds.setStyle(node, 'display', 'none');
	}

	// setShowing() calls show() if showing is true, hide() otherwise
	ds.setShowing = function(node, showing){
		ds[(showing ? 'show' : 'hide')](node);
	}

	// isShowing() is true if the node.style.display is not 'none'
	// FIXME: returns true if node is bad, isHidden would be easier to make correct
	ds.isShowing = function(node){
		return (ds.getStyleProperty(node, 'display') != 'none');
	}

	// Call setShowing() on node with the complement of isShowing(), then return the new value of isShowing()
	ds.toggleShowing = function(node){
		return ds._toggle(node, ds.isShowing, ds.setShowing);
	}

	// display is a CSS concept

	// Simple mapping of tag names to display values
	// FIXME: simplistic 
	ds.displayMap = { tr: '', td: '', th: '', img: 'inline', span: 'inline', input: 'inline', button: 'inline' };

	// Suggest a value for the display property that will show 'node' based on it's tag
	ds.suggestDisplayByTagName = function(node)
	{
		node = dojo.byId(node);
		if(node && node.tagName){
			var tag = node.tagName.toLowerCase();
			return (tag in ds.displayMap ? ds.displayMap[tag] : 'block');
		}
	}

	// setDisplay() sets the value of style.display to value of 'display' parameter if it is a string.
	// Otherwise, if 'display' is false, set style.display to 'none'.
	// Finally, set 'display' to a suggested display value based on the node's tag
	ds.setDisplay = function(node, display){
		ds.setStyle(node, 'display', (dojo.lang.isString(display) ? display : (display ? ds.suggestDisplayByTagName(node) : 'none')));
	}

	// isDisplayed() is true if the the computed display style for node is not 'none'
	// FIXME: returns true if node is bad, isNotDisplayed would be easier to make correct
	ds.isDisplayed = function(node){
		return (ds.getComputedStyle(node, 'display') != 'none');
	}

	// Call setDisplay() on node with the complement of isDisplayed(), then
	// return the new value of isDisplayed()
	ds.toggleDisplay = function(node){
		return ds._toggle(node, ds.isDisplayed, ds.setDisplay);
	}

	// visibility is a CSS concept

	// setVisibility() sets the value of style.visibility to value of
	// 'visibility' parameter if it is a string.
	// Otherwise, if 'visibility' is false, set style.visibility to 'hidden'.
	// Finally, set style.visibility to 'visible'.
	ds.setVisibility = function(node, visibility){
		ds.setStyle(node, 'visibility', (dojo.lang.isString(visibility) ? visibility : (visibility ? 'visible' : 'hidden')));
	}

	// isVisible() is true if the the computed visibility style for node is not 'hidden'
	// FIXME: returns true if node is bad, isInvisible would be easier to make correct
	ds.isVisible = function(node){
		return (ds.getComputedStyle(node, 'visibility') != 'hidden');
	}

	// Call setVisibility() on node with the complement of isVisible(), then
	// return the new value of isVisible()
	ds.toggleVisibility = function(node){
		return ds._toggle(node, ds.isVisible, ds.setVisibility);
	}

	// in: coordinate array [x,y,w,h] or dom node
	// return: coordinate array
	ds.toCoordinateArray = function(coords, includeScroll) {
		if(dojo.lang.isArray(coords)){
			// coords is already an array (of format [x,y,w,h]), just return it
			while ( coords.length < 4 ) { coords.push(0); }
			while ( coords.length > 4 ) { coords.pop(); }
			var ret = coords;
		} else {
			// coords is an dom object (or dom object id); return it's coordinates
			var node = dojo.byId(coords);
			var pos = ds.getAbsolutePosition(node, includeScroll);
			var ret = [
				pos.x,
				pos.y,
				ds.getBorderBoxWidth(node),
				ds.getBorderBoxHeight(node)
			];
		}
		ret.x = ret[0];
		ret.y = ret[1];
		ret.w = ret[2];
		ret.h = ret[3];
		return ret;
	};
})();

dojo.provide("dojo.string.common");

dojo.require("dojo.string");

/**
 * Trim whitespace from 'str'. If 'wh' > 0,
 * only trim from start, if 'wh' < 0, only trim
 * from end, otherwise trim both ends
 */
dojo.string.trim = function(str, wh){
	if(!str.replace){ return str; }
	if(!str.length){ return str; }
	var re = (wh > 0) ? (/^\s+/) : (wh < 0) ? (/\s+$/) : (/^\s+|\s+$/g);
	return str.replace(re, "");
}

/**
 * Trim whitespace at the beginning of 'str'
 */
dojo.string.trimStart = function(str) {
	return dojo.string.trim(str, 1);
}

/**
 * Trim whitespace at the end of 'str'
 */
dojo.string.trimEnd = function(str) {
	return dojo.string.trim(str, -1);
}

/**
 * Return 'str' repeated 'count' times, optionally
 * placing 'separator' between each rep
 */
dojo.string.repeat = function(str, count, separator) {
	var out = "";
	for(var i = 0; i < count; i++) {
		out += str;
		if(separator && i < count - 1) {
			out += separator;
		}
	}
	return out;
}

/**
 * Pad 'str' to guarantee that it is at least 'len' length
 * with the character 'c' at either the start (dir=1) or
 * end (dir=-1) of the string
 */
dojo.string.pad = function(str, len/*=2*/, c/*='0'*/, dir/*=1*/) {
	var out = String(str);
	if(!c) {
		c = '0';
	}
	if(!dir) {
		dir = 1;
	}
	while(out.length < len) {
		if(dir > 0) {
			out = c + out;
		} else {
			out += c;
		}
	}
	return out;
}

/** same as dojo.string.pad(str, len, c, 1) */
dojo.string.padLeft = function(str, len, c) {
	return dojo.string.pad(str, len, c, 1);
}

/** same as dojo.string.pad(str, len, c, -1) */
dojo.string.padRight = function(str, len, c) {
	return dojo.string.pad(str, len, c, -1);
}

dojo.provide("dojo.string");
dojo.require("dojo.string.common");

dojo.provide("dojo.html");

dojo.require("dojo.lang.func");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.require("dojo.string");

dojo.lang.mixin(dojo.html, dojo.dom);
dojo.lang.mixin(dojo.html, dojo.style);

// FIXME: we are going to assume that we can throw any and every rendering
// engine into the IE 5.x box model. In Mozilla, we do this w/ CSS.
// Need to investigate for KHTML and Opera

dojo.html.clearSelection = function(){
	try{
		if(window["getSelection"]){ 
			if(dojo.render.html.safari){
				// pulled from WebCore/ecma/kjs_window.cpp, line 2536
				window.getSelection().collapse();
			}else{
				window.getSelection().removeAllRanges();
			}
		}else if(document.selection){
			if(document.selection.empty){
				document.selection.empty();
			}else if(document.selection.clear){
				document.selection.clear();
			}
		}
		return true;
	}catch(e){
		dojo.debug(e);
		return false;
	}
}

dojo.html.disableSelection = function(element){
	element = dojo.byId(element)||document.body;
	var h = dojo.render.html;
	
	if(h.mozilla){
		element.style.MozUserSelect = "none";
	}else if(h.safari){
		element.style.KhtmlUserSelect = "none"; 
	}else if(h.ie){
		element.unselectable = "on";
	}else{
		return false;
	}
	return true;
}

dojo.html.enableSelection = function(element){
	element = dojo.byId(element)||document.body;
	
	var h = dojo.render.html;
	if(h.mozilla){ 
		element.style.MozUserSelect = ""; 
	}else if(h.safari){
		element.style.KhtmlUserSelect = "";
	}else if(h.ie){
		element.unselectable = "off";
	}else{
		return false;
	}
	return true;
}

dojo.html.selectElement = function(element){
	element = dojo.byId(element);
	if(document.selection && document.body.createTextRange){ // IE
		var range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	}else if(window["getSelection"]){
		var selection = window.getSelection();
		// FIXME: does this work on Safari?
		if(selection["selectAllChildren"]){ // Mozilla
			selection.selectAllChildren(element);
		}
	}
}

dojo.html.selectInputText = function(element){
	element = dojo.byId(element);
	if(document.selection && document.body.createTextRange){ // IE
		var range = element.createTextRange();
		range.moveStart("character", 0);
		range.moveEnd("character", element.value.length);
		range.select();
	}else if(window["getSelection"]){
		var selection = window.getSelection();
		// FIXME: does this work on Safari?
		element.setSelectionRange(0, element.value.length);
	}
	element.focus();
}


dojo.html.isSelectionCollapsed = function(){
	if(document["selection"]){ // IE
		return document.selection.createRange().text == "";
	}else if(window["getSelection"]){
		var selection = window.getSelection();
		if(dojo.lang.isString(selection)){ // Safari
			return selection == "";
		}else{ // Mozilla/W3
			return selection.isCollapsed;
		}
	}
}

dojo.html.getEventTarget = function(evt){
	if(!evt) { evt = window.event || {} };
	var t = (evt.srcElement ? evt.srcElement : (evt.target ? evt.target : null));
	while((t)&&(t.nodeType!=1)){ t = t.parentNode; }
	return t;
}

dojo.html.getDocumentWidth = function(){
	dojo.deprecated("dojo.html.getDocument*", "replaced by dojo.html.getViewport*", "0.4");
	return dojo.html.getViewportWidth();
}

dojo.html.getDocumentHeight = function(){
	dojo.deprecated("dojo.html.getDocument*", "replaced by dojo.html.getViewport*", "0.4");
	return dojo.html.getViewportHeight();
}

dojo.html.getDocumentSize = function(){
	dojo.deprecated("dojo.html.getDocument*", "replaced of dojo.html.getViewport*", "0.4");
	return dojo.html.getViewportSize();
}

dojo.html.getViewportWidth = function(){
	var w = 0;

	if(window.innerWidth){
		w = window.innerWidth;
	}

	if(dojo.exists(document, "documentElement.clientWidth")){
		// IE6 Strict
		var w2 = document.documentElement.clientWidth;
		// this lets us account for scrollbars
		if(!w || w2 && w2 < w) {
			w = w2;
		}
		return w;
	}

	if(document.body){
		// IE
		return document.body.clientWidth;
	}

	return 0;
}

dojo.html.getViewportHeight = function(){
	if (window.innerHeight){
		return window.innerHeight;
	}

	if (dojo.exists(document, "documentElement.clientHeight")){
		// IE6 Strict
		return document.documentElement.clientHeight;
	}

	if (document.body){
		// IE
		return document.body.clientHeight;
	}

	return 0;
}

dojo.html.getViewportSize = function(){
	var ret = [dojo.html.getViewportWidth(), dojo.html.getViewportHeight()];
	ret.w = ret[0];
	ret.h = ret[1];
	return ret;
}

dojo.html.getScrollTop = function(){
	return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

dojo.html.getScrollLeft = function(){
	return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}

dojo.html.getScrollOffset = function(){
	var off = [dojo.html.getScrollLeft(), dojo.html.getScrollTop()];
	off.x = off[0];
	off.y = off[1];
	return off;
}

dojo.html.getParentOfType = function(node, type){
	dojo.deprecated("dojo.html.getParentOfType", "replaced by dojo.html.getParentByType*", "0.4");
	return dojo.html.getParentByType(node, type);
}

dojo.html.getParentByType = function(node, type) {
	var parent = dojo.byId(node);
	type = type.toLowerCase();
	while((parent)&&(parent.nodeName.toLowerCase()!=type)){
		if(parent==(document["body"]||document["documentElement"])){
			return null;
		}
		parent = parent.parentNode;
	}
	return parent;
}

// RAR: this function comes from nwidgets and is more-or-less unmodified.
// We should probably look ant Burst and f(m)'s equivalents
dojo.html.getAttribute = function(node, attr){
	node = dojo.byId(node);
	// FIXME: need to add support for attr-specific accessors
	if((!node)||(!node.getAttribute)){
		// if(attr !== 'nwType'){
		//	alert("getAttr of '" + attr + "' with bad node"); 
		// }
		return null;
	}
	var ta = typeof attr == 'string' ? attr : new String(attr);

	// first try the approach most likely to succeed
	var v = node.getAttribute(ta.toUpperCase());
	if((v)&&(typeof v == 'string')&&(v!="")){ return v; }

	// try returning the attributes value, if we couldn't get it as a string
	if(v && v.value){ return v.value; }

	// this should work on Opera 7, but it's a little on the crashy side
	if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
		return (node.getAttributeNode(ta)).value;
	}else if(node.getAttribute(ta)){
		return node.getAttribute(ta);
	}else if(node.getAttribute(ta.toLowerCase())){
		return node.getAttribute(ta.toLowerCase());
	}
	return null;
}
	
/**
 *	Determines whether or not the specified node carries a value for the
 *	attribute in question.
 */
dojo.html.hasAttribute = function(node, attr){
	node = dojo.byId(node);
	return dojo.html.getAttribute(node, attr) ? true : false;
}
	
/**
 * Returns the string value of the list of CSS classes currently assigned
 * directly to the node in question. Returns an empty string if no class attribute
 * is found;
 */
dojo.html.getClass = function(node){
	node = dojo.byId(node);
	if(!node){ return ""; }
	var cs = "";
	if(node.className){
		cs = node.className;
	}else if(dojo.html.hasAttribute(node, "class")){
		cs = dojo.html.getAttribute(node, "class");
	}
	return dojo.string.trim(cs);
}

/**
 * Returns an array of CSS classes currently assigned
 * directly to the node in question. Returns an empty array if no classes
 * are found;
 */
dojo.html.getClasses = function(node) {
	var c = dojo.html.getClass(node);
	return (c == "") ? [] : c.split(/\s+/g);
}

/**
 * Returns whether or not the specified classname is a portion of the
 * class list currently applied to the node. Does not cover cascaded
 * styles, only classes directly applied to the node.
 */
dojo.html.hasClass = function(node, classname){
	return dojo.lang.inArray(dojo.html.getClasses(node), classname);
}

/**
 * Adds the specified class to the beginning of the class list on the
 * passed node. This gives the specified class the highest precidence
 * when style cascading is calculated for the node. Returns true or
 * false; indicating success or failure of the operation, respectively.
 */
dojo.html.prependClass = function(node, classStr){
	classStr += " " + dojo.html.getClass(node);
	return dojo.html.setClass(node, classStr);
}

/**
 * Adds the specified class to the end of the class list on the
 *	passed &node;. Returns &true; or &false; indicating success or failure.
 */
dojo.html.addClass = function(node, classStr){
	if (dojo.html.hasClass(node, classStr)) {
	  return false;
	}
	classStr = dojo.string.trim(dojo.html.getClass(node) + " " + classStr);
	return dojo.html.setClass(node, classStr);
}

/**
 *	Clobbers the existing list of classes for the node, replacing it with
 *	the list given in the 2nd argument. Returns true or false
 *	indicating success or failure.
 */
dojo.html.setClass = function(node, classStr){
	node = dojo.byId(node);
	var cs = new String(classStr);
	try{
		if(typeof node.className == "string"){
			node.className = cs;
		}else if(node.setAttribute){
			node.setAttribute("class", classStr);
			node.className = cs;
		}else{
			return false;
		}
	}catch(e){
		dojo.debug("dojo.html.setClass() failed", e);
	}
	return true;
}

/**
 * Removes the className from the node;. Returns
 * true or false indicating success or failure.
 */ 
dojo.html.removeClass = function(node, classStr, allowPartialMatches){
	var classStr = dojo.string.trim(new String(classStr));

	try{
		var cs = dojo.html.getClasses(node);
		var nca	= [];
		if(allowPartialMatches){
			for(var i = 0; i<cs.length; i++){
				if(cs[i].indexOf(classStr) == -1){ 
					nca.push(cs[i]);
				}
			}
		}else{
			for(var i=0; i<cs.length; i++){
				if(cs[i] != classStr){ 
					nca.push(cs[i]);
				}
			}
		}
		dojo.html.setClass(node, nca.join(" "));
	}catch(e){
		dojo.debug("dojo.html.removeClass() failed", e);
	}

	return true;
}

/**
 * Replaces 'oldClass' and adds 'newClass' to node
 */
dojo.html.replaceClass = function(node, newClass, oldClass) {
	dojo.html.removeClass(node, oldClass);
	dojo.html.addClass(node, newClass);
}

// Enum type for getElementsByClass classMatchType arg:
dojo.html.classMatchType = {
	ContainsAll : 0, // all of the classes are part of the node's class (default)
	ContainsAny : 1, // any of the classes are part of the node's class
	IsOnly : 2 // only all of the classes are part of the node's class
}


/**
 * Returns an array of nodes for the given classStr, children of a
 * parent, and optionally of a certain nodeType
 */
dojo.html.getElementsByClass = function(classStr, parent, nodeType, classMatchType, useNonXpath){
	parent = dojo.byId(parent) || document;
	var classes = classStr.split(/\s+/g);
	var nodes = [];
	if( classMatchType != 1 && classMatchType != 2 ) classMatchType = 0; // make it enum
	var reClass = new RegExp("(\\s|^)((" + classes.join(")|(") + "))(\\s|$)");
	var candidateNodes = [];
	
	if(!useNonXpath && document.evaluate) { // supports dom 3 xpath
		var xpath = "//" + (nodeType || "*") + "[contains(";
		if(classMatchType != dojo.html.classMatchType.ContainsAny){
			xpath += "concat(' ',@class,' '), ' " +
			classes.join(" ') and contains(concat(' ',@class,' '), ' ") +
			" ')]";
		}else{
			xpath += "concat(' ',@class,' '), ' " +
			classes.join(" ')) or contains(concat(' ',@class,' '), ' ") +
			" ')]";
		}
		var xpathResult = document.evaluate(xpath, parent, null, XPathResult.ANY_TYPE, null);
		var result = xpathResult.iterateNext();
		while(result){
			try{
				candidateNodes.push(result);
				result = xpathResult.iterateNext();
			}catch(e){ break; }
		}
		return candidateNodes;
	}else{
		if(!nodeType){
			nodeType = "*";
		}
		candidateNodes = parent.getElementsByTagName(nodeType);

		var node, i = 0;
		outer:
		while(node = candidateNodes[i++]){
			var nodeClasses = dojo.html.getClasses(node);
			if(nodeClasses.length == 0){ continue outer; }
			var matches = 0;
	
			for(var j = 0; j < nodeClasses.length; j++){
				if(reClass.test(nodeClasses[j])){
					if(classMatchType == dojo.html.classMatchType.ContainsAny){
						nodes.push(node);
						continue outer;
					}else{
						matches++;
					}
				}else{
					if(classMatchType == dojo.html.classMatchType.IsOnly){
						continue outer;
					}
				}
			}
	
			if(matches == classes.length){
				if(	(classMatchType == dojo.html.classMatchType.IsOnly)&&
					(matches == nodeClasses.length)){
					nodes.push(node);
				}else if(classMatchType == dojo.html.classMatchType.ContainsAll){
					nodes.push(node);
				}
			}
		}
		return nodes;
	}
}

dojo.html.getElementsByClassName = dojo.html.getElementsByClass;

/**
 * Returns the mouse position relative to the document (not the viewport).
 * For example, if you have a document that is 10000px tall,
 * but your browser window is only 100px tall,
 * if you scroll to the bottom of the document and call this function it
 * will return {x: 0, y: 10000}
 */
dojo.html.getCursorPosition = function(e){
	e = e || window.event;
	var cursor = {x:0, y:0};
	if(e.pageX || e.pageY){
		cursor.x = e.pageX;
		cursor.y = e.pageY;
	}else{
		var de = document.documentElement;
		var db = document.body;
		cursor.x = e.clientX + ((de||db)["scrollLeft"]) - ((de||db)["clientLeft"]);
		cursor.y = e.clientY + ((de||db)["scrollTop"]) - ((de||db)["clientTop"]);
	}
	return cursor;
}

dojo.html.overElement = function(element, e){
	element = dojo.byId(element);
	var mouse = dojo.html.getCursorPosition(e);

	with(dojo.html){
		var top = getAbsoluteY(element, true);
		var bottom = top + getInnerHeight(element);
		var left = getAbsoluteX(element, true);
		var right = left + getInnerWidth(element);
	}
	
	return (mouse.x >= left && mouse.x <= right &&
		mouse.y >= top && mouse.y <= bottom);
}

dojo.html.setActiveStyleSheet = function(title){
	var i = 0, a, els = document.getElementsByTagName("link");
	while (a = els[i++]) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")){
			a.disabled = true;
			if (a.getAttribute("title") == title) { a.disabled = false; }
		}
	}
}

dojo.html.getActiveStyleSheet = function(){
	var i = 0, a, els = document.getElementsByTagName("link");
	while (a = els[i++]) {
		if (a.getAttribute("rel").indexOf("style") != -1 &&
			a.getAttribute("title") && !a.disabled) { return a.getAttribute("title"); }
	}
	return null;
}

dojo.html.getPreferredStyleSheet = function(){
	var i = 0, a, els = document.getElementsByTagName("link");
	while (a = els[i++]) {
		if(a.getAttribute("rel").indexOf("style") != -1
			&& a.getAttribute("rel").indexOf("alt") == -1
			&& a.getAttribute("title")) { return a.getAttribute("title"); }
	}
	return null;
}

dojo.html.body = function(){
	// Note: document.body is not defined for a strict xhtml document
	return document.body || document.getElementsByTagName("body")[0];
}

/**
 * Like dojo.dom.isTag, except case-insensitive
**/
dojo.html.isTag = function(node /* ... */) {
	node = dojo.byId(node);
	if(node && node.tagName) {
		var arr = dojo.lang.map(dojo.lang.toArray(arguments, 1),
			function(a) { return String(a).toLowerCase(); });
		return arr[ dojo.lang.find(node.tagName.toLowerCase(), arr) ] || "";
	}
	return "";
}

dojo.html.copyStyle = function(target, source){
	// work around for opera which doesn't have cssText, and for IE which fails on setAttribute 
	if(dojo.lang.isUndefined(source.style.cssText)){ 
		target.setAttribute("style", source.getAttribute("style")); 
	}else{
		target.style.cssText = source.style.cssText; 
	}
	dojo.html.addClass(target, dojo.html.getClass(source));
}

dojo.html._callExtrasDeprecated = function(inFunc, args) {
	var module = "dojo.html.extras";
	dojo.deprecated("dojo.html." + inFunc, "moved to " + module, "0.4");
	dojo["require"](module); // weird syntax to fool list-profile-deps (build)
	return dojo.html[inFunc].apply(dojo.html, args);
}

dojo.html.createNodesFromText = function() {
	return dojo.html._callExtrasDeprecated('createNodesFromText', arguments);
}

dojo.html.gravity = function() {
	return dojo.html._callExtrasDeprecated('gravity', arguments);
}

dojo.html.placeOnScreen = function() {
	return dojo.html._callExtrasDeprecated('placeOnScreen', arguments);
}

dojo.html.placeOnScreenPoint = function() {
	return dojo.html._callExtrasDeprecated('placeOnScreenPoint', arguments);
}

dojo.html.renderedTextContent = function() {
	return dojo.html._callExtrasDeprecated('renderedTextContent', arguments);
}

dojo.html.BackgroundIframe = function() {
	return dojo.html._callExtrasDeprecated('BackgroundIframe', arguments);
}

dojo.provide("dojo.lfx.Animation");
dojo.provide("dojo.lfx.Line");

dojo.require("dojo.lang.func");

/*
	Animation package based on Dan Pupius' work: http://pupius.co.uk/js/Toolkit.Drawing.js
*/
dojo.lfx.Line = function(start, end){
	this.start = start;
	this.end = end;
	if(dojo.lang.isArray(start)){
		var diff = [];
		dojo.lang.forEach(this.start, function(s,i){
			diff[i] = this.end[i] - s;
		}, this);
		
		this.getValue = function(/*float*/ n){
			var res = [];
			dojo.lang.forEach(this.start, function(s, i){
				res[i] = (diff[i] * n) + s;
			}, this);
			return res;
		}
	}else{
		var diff = end - start;
			
		this.getValue = function(/*float*/ n){
			//	summary: returns the point on the line
			//	n: a floating point number greater than 0 and less than 1
			return (diff * n) + this.start;
		}
	}
}

dojo.lfx.easeIn = function(n){
	//	summary: returns the point on an easing curve
	//	n: a floating point number greater than 0 and less than 1
	return Math.pow(n, 3);
}

dojo.lfx.easeOut = function(n){
	//	summary: returns the point on the line
	//	n: a floating point number greater than 0 and less than 1
	return ( 1 - Math.pow(1 - n, 3) );
}

dojo.lfx.easeInOut = function(n){
	//	summary: returns the point on the line
	//	n: a floating point number greater than 0 and less than 1
	return ( (3 * Math.pow(n, 2)) - (2 * Math.pow(n, 3)) );
}

dojo.lfx.IAnimation = function(){}
dojo.lang.extend(dojo.lfx.IAnimation, {
	// public properties
	curve: null,
	duration: 1000,
	easing: null,
	repeatCount: 0,
	rate: 25,
	
	// events
	handler: null,
	beforeBegin: null,
	onBegin: null,
	onAnimate: null,
	onEnd: null,
	onPlay: null,
	onPause: null,
	onStop: null,
	
	// public methods
	play: null,
	pause: null,
	stop: null,
	
	fire: function(evt, args){
		if(this[evt]){
			this[evt].apply(this, (args||[]));
		}
	},
	
	// private properties
	_active: false,
	_paused: false
});

dojo.lfx.Animation = function(/*Object*/ handlers, /*int*/ duration, /*Array*/ curve, /*function*/ easing, /*int*/ repeatCount, /*int*/ rate){
	//	summary
	//		a generic animation object that fires callbacks into it's handlers
	//		object at various states
	//	handlers
	//		object { 
	//			handler: function(){}, 
	//			onstart: function(){}, 
	//			onstop: function(){}, 
	//			onanimate: function(){}
	//		}
	dojo.lfx.IAnimation.call(this);
	if(dojo.lang.isNumber(handlers)||(!handlers && duration.getValue)){
		// no handlers argument:
		rate = repeatCount;
		repeatCount = easing;
		easing = curve;
		curve = duration;
		duration = handlers;
		handlers = null;
	}else if(handlers.getValue||dojo.lang.isArray(handlers)){
		// no handlers or duration:
		rate = easing;
		repeatCount = curve;
		easing = duration;
		curve = handlers;
		duration = null;
		handlers = null;
	}
	if(dojo.lang.isArray(curve)){
		this.curve = new dojo.lfx.Line(curve[0], curve[1]);
	}else{
		this.curve = curve;
	}
	if(duration != null && duration > 0){ this.duration = duration; }
	if(repeatCount){ this.repeatCount = repeatCount; }
	if(rate){ this.rate = rate; }
	if(handlers){
		this.handler = handlers.handler;
		this.beforeBegin = handlers.beforeBegin;
		this.onBegin = handlers.onBegin;
		this.onEnd = handlers.onEnd;
		this.onPlay = handlers.onPlay;
		this.onPause = handlers.onPause;
		this.onStop = handlers.onStop;
		this.onAnimate = handlers.onAnimate;
	}
	if(easing && dojo.lang.isFunction(easing)){
		this.easing=easing;
	}
}
dojo.inherits(dojo.lfx.Animation, dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Animation, {
	// "private" properties
	_startTime: null,
	_endTime: null,
	_timer: null,
	_percent: 0,
	_startRepeatCount: 0,

	// public methods
	play: function(delay, gotoStart){
		if(gotoStart){
			clearTimeout(this._timer);
			this._active = false;
			this._paused = false;
			this._percent = 0;
		}else if(this._active && !this._paused){
			return this;
		}
		
		this.fire("handler", ["beforeBegin"]);
		this.fire("beforeBegin");

		if(delay > 0){
			setTimeout(dojo.lang.hitch(this, function(){ this.play(null, gotoStart); }), delay);
			return this;
		}
		
		this._startTime = new Date().valueOf();
		if(this._paused){
			this._startTime -= (this.duration * this._percent / 100);
		}
		this._endTime = this._startTime + this.duration;

		this._active = true;
		this._paused = false;
		
		var step = this._percent / 100;
		var value = this.curve.getValue(step);
		if( this._percent == 0 ) {
			if(!this._startRepeatCount) {
				this._startRepeatCount = this.repeatCount;
			}
			this.fire("handler", ["begin", value]);
			this.fire("onBegin", [value]);
		}

		this.fire("handler", ["play", value]);
		this.fire("onPlay", [value]);

		this._cycle();
		return this;
	},

	pause: function() {
		clearTimeout(this._timer);
		if(!this._active){ return this; }
		this._paused = true;
		var value = this.curve.getValue(this._percent / 100);
		this.fire("handler", ["pause", value]);
		this.fire("onPause", [value]);
		return this;
	},

	gotoPercent: function(pct, andPlay) {
		clearTimeout(this._timer);
		this._active = true;
		this._paused = true;
		this._percent = pct;
		if( andPlay ) { this.play(); }
	},

	stop: function(gotoEnd) {
		clearTimeout(this._timer);
		var step = this._percent / 100;
		if( gotoEnd ) {
			step = 1;
		}
		var value = this.curve.getValue(step);
		this.fire("handler", ["stop", value]);
		this.fire("onStop", [value]);
		this._active = false;
		this._paused = false;
		return this;
	},

	status: function() {
		if( this._active ) {
			return this._paused ? "paused" : "playing";
		} else {
			return "stopped";
		}
	},

	// "private" methods
	_cycle: function() {
		clearTimeout(this._timer);
		if(this._active){
			var curr = new Date().valueOf();
			var step = (curr - this._startTime) / (this._endTime - this._startTime);

			if(step >= 1){
				step = 1;
				this._percent = 100;
			}else{
				this._percent = step * 100;
			}
			
			// Perform easing
			if((this.easing)&&(dojo.lang.isFunction(this.easing))){
				step = this.easing(step);
			}

			var value = this.curve.getValue(step);
			this.fire("handler", ["animate", value]);
			this.fire("onAnimate", [value]);

			if( step < 1 ) {
				this._timer = setTimeout(dojo.lang.hitch(this, "_cycle"), this.rate);
			} else {
				this._active = false;
				this.fire("handler", ["end"]);
				this.fire("onEnd");

				if( this.repeatCount > 0 ) {
					this.repeatCount--;
					this.play(null, true);
				} else if( this.repeatCount == -1 ) {
					this.play(null, true);
				} else {
					if(this._startRepeatCount) {
						this.repeatCount = this._startRepeatCount;
						this._startRepeatCount = 0;
					}
				}
			}
		}
		return this;
	}
});

dojo.lfx.Combine = function(){
	dojo.lfx.IAnimation.call(this);
	this._anims = [];
	this._animsEnded = 0;
	
	var anims = arguments;
	if(anims.length == 1 && (dojo.lang.isArray(anims[0]) || dojo.lang.isArrayLike(anims[0]))){
		anims = anims[0];
	}
	
	var _this = this;
	dojo.lang.forEach(anims, function(anim){
		_this._anims.push(anim);
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ oldOnEnd(); _this._onAnimsEnded(); };
	});
}
dojo.inherits(dojo.lfx.Combine, dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Combine, {
	// private members
	_animsEnded: 0,
	
	// public methods
	play: function(delay, gotoStart){
		if( !this._anims.length ){ return this; }

		this.fire("beforeBegin");

		if(delay > 0){
			setTimeout(dojo.lang.hitch(this, function(){ this.play(null, gotoStart); }), delay);
			return this;
		}
		
		if(gotoStart || this._anims[0].percent == 0){
			this.fire("onBegin");
		}
		this.fire("onPlay");
		this._animsCall("play", null, gotoStart);
		return this;
	},
	
	pause: function(){
		this.fire("onPause");
		this._animsCall("pause"); 
		return this;
	},
	
	stop: function(gotoEnd){
		this.fire("onStop");
		this._animsCall("stop", gotoEnd);
		return this;
	},
	
	// private methods
	_onAnimsEnded: function(){
		this._animsEnded++;
		if(this._animsEnded >= this._anims.length){
			this.fire("onEnd");
		}
		return this;
	},
	
	_animsCall: function(funcName){
		var args = [];
		if(arguments.length > 1){
			for(var i = 1 ; i < arguments.length ; i++){
				args.push(arguments[i]);
			}
		}
		var _this = this;
		dojo.lang.forEach(this._anims, function(anim){
			anim[funcName](args);
		}, _this);
		return this;
	}
});

dojo.lfx.Chain = function() {
	dojo.lfx.IAnimation.call(this);
	this._anims = [];
	this._currAnim = -1;
	
	var anims = arguments;
	if(anims.length == 1 && (dojo.lang.isArray(anims[0]) || dojo.lang.isArrayLike(anims[0]))){
		anims = anims[0];
	}
	
	var _this = this;
	dojo.lang.forEach(anims, function(anim, i, anims_arr){
		_this._anims.push(anim);
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		if(i < anims_arr.length - 1){
			anim.onEnd = function(){ oldOnEnd(); _this._playNext(); };
		}else{
			anim.onEnd = function(){ oldOnEnd(); _this.fire("onEnd"); };
		}
	}, _this);
}
dojo.inherits(dojo.lfx.Chain, dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Chain, {
	// private members
	_currAnim: -1,
	
	// public methods
	play: function(delay, gotoStart){
		if( !this._anims.length ) { return this; }
		if( gotoStart || !this._anims[this._currAnim] ) {
			this._currAnim = 0;
		}

		var currentAnimation = this._anims[this._currAnim];

		this.fire("beforeBegin");
		if(delay > 0){
			setTimeout(dojo.lang.hitch(this, function(){ this.play(null, gotoStart); }), delay);
			return this;
		}
		
		if(currentAnimation){
			if(this._currAnim == 0){
				this.fire("handler", ["begin", this._currAnim]);
				this.fire("onBegin", [this._currAnim]);
			}
			this.fire("onPlay", [this._currAnim]);
			currentAnimation.play(null, gotoStart);
		}
		return this;
	},
	
	pause: function(){
		if( this._anims[this._currAnim] ) {
			this._anims[this._currAnim].pause();
			this.fire("onPause", [this._currAnim]);
		}
		return this;
	},
	
	playPause: function(){
		if(this._anims.length == 0){ return this; }
		if(this._currAnim == -1){ this._currAnim = 0; }
		var currAnim = this._anims[this._currAnim];
		if( currAnim ) {
			if( !currAnim._active || currAnim._paused ) {
				this.play();
			} else {
				this.pause();
			}
		}
		return this;
	},
	
	stop: function(){
		var currAnim = this._anims[this._currAnim];
		if(currAnim){
			currAnim.stop();
			this.fire("onStop", [this._currAnim]);
		}
		return currAnim;
	},
	
	// private methods
	_playNext: function(){
		if( this._currAnim == -1 || this._anims.length == 0 ) { return this; }
		this._currAnim++;
		if( this._anims[this._currAnim] ){
			this._anims[this._currAnim].play(null, true);
		}
		return this;
	}
});

dojo.lfx.combine = function(){
	var anims = arguments;
	if(dojo.lang.isArray(arguments[0])){
		anims = arguments[0];
	}
	return new dojo.lfx.Combine(anims);
}

dojo.lfx.chain = function(){
	var anims = arguments;
	if(dojo.lang.isArray(arguments[0])){
		anims = arguments[0];
	}
	return new dojo.lfx.Chain(anims);
}

dojo.provide("dojo.lfx.html");
dojo.require("dojo.lfx.Animation");

dojo.require("dojo.html");

dojo.lfx.html._byId = function(nodes){
	if(!nodes){ return []; }
	if(dojo.lang.isArray(nodes)){
		if(!nodes.alreadyChecked){
			var n = [];
			dojo.lang.forEach(nodes, function(node){
				n.push(dojo.byId(node));
			});
			n.alreadyChecked = true;
			return n;
		}else{
			return nodes;
		}
	}else{
		var n = [];
		n.push(dojo.byId(nodes));
		n.alreadyChecked = true;
		return n;
	}
}

dojo.lfx.html.propertyAnimation = function(	/*DOMNode*/ nodes, 
											/*Array*/ propertyMap, 
											/*int*/ duration,
											/*function*/ easing){
	nodes = dojo.lfx.html._byId(nodes);
	
	if(nodes.length==1){
		// FIXME: we're only supporting start-value filling when one node is
		// passed
		
		dojo.lang.forEach(propertyMap, function(prop){
			if(typeof prop["start"] == "undefined"){
				if(prop.property != "opacity"){
					prop.start = parseInt(dojo.style.getComputedStyle(nodes[0], prop.property));
				}else{
					prop.start = dojo.style.getOpacity(nodes[0]);
				}
			}
		});
	}

	var coordsAsInts = function(coords){
		var cints = new Array(coords.length);
		for(var i = 0; i < coords.length; i++){
			cints[i] = Math.round(coords[i]);
		}
		return cints;
	}
	var setStyle = function(n, style){
		n = dojo.byId(n);
		if(!n || !n.style){ return; }
		for(var s in style){
			if(s == "opacity"){
				dojo.style.setOpacity(n, style[s]);
			}else{
				n.style[s] = style[s];
			}
		}
	}
	var propLine = function(properties){
		this._properties = properties;
		this.diffs = new Array(properties.length);
		dojo.lang.forEach(properties, function(prop, i){
			// calculate the end - start to optimize a bit
			if(dojo.lang.isArray(prop.start)){
				// don't loop through the arrays
				this.diffs[i] = null;
			}else if(prop.start instanceof dojo.graphics.color.Color){
				// save these so we don't have to call toRgb() every getValue() call
				prop.startRgb = prop.start.toRgb();
				prop.endRgb = prop.end.toRgb();
			}else{
				this.diffs[i] = prop.end - prop.start;
			}
		}, this);
		this.getValue = function(n){
			var ret = {};
			dojo.lang.forEach(this._properties, function(prop, i){
				var value = null;
				if(dojo.lang.isArray(prop.start)){
					// FIXME: what to do here?
				}else if(prop.start instanceof dojo.graphics.color.Color){
					value = (prop.units||"rgb") + "(";
					for(var j = 0 ; j < prop.startRgb.length ; j++){
						value += Math.round(((prop.endRgb[j] - prop.startRgb[j]) * n) + prop.startRgb[j]) + (j < prop.startRgb.length - 1 ? "," : "");
					}
					value += ")";
				}else{
					value = ((this.diffs[i]) * n) + prop.start + (prop.property != "opacity" ? prop.units||"px" : "");
				}
				ret[dojo.style.toCamelCase(prop.property)] = value;
			}, this);
			return ret;
		}
	}
	
	var anim = new dojo.lfx.Animation({
		onAnimate: function(propValues){
			dojo.lang.forEach(nodes, function(node){
				setStyle(node, propValues);
			});
		} }, duration, new propLine(propertyMap), easing);
	
	return anim;
}

dojo.lfx.html._makeFadeable = function(nodes){
	var makeFade = function(node){
		if(dojo.render.html.ie){
			// only set the zoom if the "tickle" value would be the same as the
			// default
			if( (node.style.zoom.length == 0) &&
				(dojo.style.getStyle(node, "zoom") == "normal") ){
				// make sure the node "hasLayout"
				// NOTE: this has been tested with larger and smaller user-set text
				// sizes and works fine
				node.style.zoom = "1";
				// node.style.zoom = "normal";
			}
			// don't set the width to auto if it didn't already cascade that way.
			// We don't want to f anyones designs
			if(	(node.style.width.length == 0) &&
				(dojo.style.getStyle(node, "width") == "auto") ){
				node.style.width = "auto";
			}
		}
	}
	if(dojo.lang.isArrayLike(nodes)){
		dojo.lang.forEach(nodes, makeFade);
	}else{
		makeFade(nodes);
	}
}

dojo.lfx.html.fadeIn = function(nodes, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	dojo.lfx.html._makeFadeable(nodes);
	var anim = dojo.lfx.propertyAnimation(nodes, [
		{	property: "opacity",
			start: dojo.style.getOpacity(nodes[0]),
			end: 1 } ], duration, easing);
	if(callback){
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ oldOnEnd(); callback(nodes, anim); };
	}

	return anim;
}

dojo.lfx.html.fadeOut = function(nodes, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	dojo.lfx.html._makeFadeable(nodes);
	var anim = dojo.lfx.propertyAnimation(nodes, [
		{	property: "opacity",
			start: dojo.style.getOpacity(nodes[0]),
			end: 0 } ], duration, easing);
	if(callback){
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ oldOnEnd(); callback(nodes, anim); };
	}

	return anim;
}

dojo.lfx.html.fadeShow = function(nodes, duration, easing, callback){
	var anim = dojo.lfx.html.fadeIn(nodes, duration, easing, callback);
	var oldBb = (anim["beforeBegin"]) ? dojo.lang.hitch(anim, "beforeBegin") : function(){};
	anim.beforeBegin = function(){ 
		oldBb();
		if(dojo.lang.isArrayLike(nodes)){
			dojo.lang.forEach(nodes, dojo.style.show);
		}else{
			dojo.style.show(nodes);
		}
	};
	
	return anim;
}

dojo.lfx.html.fadeHide = function(nodes, duration, easing, callback){
	var anim = dojo.lfx.html.fadeOut(nodes, duration, easing, function(){
		if(dojo.lang.isArrayLike(nodes)){
			dojo.lang.forEach(nodes, dojo.style.hide);
		}else{
			dojo.style.hide(nodes);
		}
		if(callback){ callback(nodes, anim); }
	});
	
	return anim;
}

dojo.lfx.html.wipeIn = function(nodes, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	var anims = [];

	dojo.lang.forEach(nodes, function(node){
		var overflow = dojo.style.getStyle(node, "overflow");
		if(overflow == "visible") {
			node.style.overflow = "hidden";
		}
		node.style.height = "0px";
		dojo.style.show(node);
		
		var anim = dojo.lfx.propertyAnimation(node,
			[{	property: "height",
				start: 0,
				end: node.scrollHeight }], duration, easing);
		
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ 
			oldOnEnd(); 
			node.style.overflow = overflow;
			node.style.height = "auto";
			if(callback){ callback(node, anim); }
		};
		anims.push(anim);
	});
	
	if(nodes.length > 1){ return dojo.lfx.combine(anims); }
	else{ return anims[0]; }
}

dojo.lfx.html.wipeOut = function(nodes, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	var anims = [];
	
	dojo.lang.forEach(nodes, function(node){
		var overflow = dojo.style.getStyle(node, "overflow");
		if(overflow == "visible") {
			node.style.overflow = "hidden";
		}
		dojo.style.show(node);

		var anim = dojo.lfx.propertyAnimation(node,
			[{	property: "height",
				start: dojo.style.getContentBoxHeight(node),
				end: 0 } ], duration, easing);
		
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ 
			oldOnEnd(); 
			dojo.style.hide(node);
			node.style.overflow = overflow;
			if(callback){ callback(node, anim); }
		};
		anims.push(anim);
	});

	if(nodes.length > 1){ return dojo.lfx.combine(anims); }
	else { return anims[0]; }
}

dojo.lfx.html.slideTo = function(nodes, coords, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	var anims = [];

	dojo.lang.forEach(nodes, function(node){
		var top = null;
		var left = null;
		
		var init = (function(){
			var innerNode = node;
			return function(){
				top = innerNode.offsetTop;
				left = innerNode.offsetLeft;

				if (!dojo.style.isPositionAbsolute(innerNode)) {
					var ret = dojo.style.abs(innerNode, true);
					dojo.style.setStyleAttributes(innerNode, "position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
					top = ret.y;
					left = ret.x;
				}
			}
		})();
		init();
		
		var anim = dojo.lfx.propertyAnimation(node,
			[{	property: "top",
				start: top,
				end: coords[0] },
			{	property: "left",
				start: left,
				end: coords[1] }], duration, easing);
		
		var oldBb = (anim["beforeBegin"]) ? dojo.lang.hitch(anim, "beforeBegin") : function(){};
		anim.beforeBegin = function(){ oldBb(); init(); };

		if(callback){
			var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
			anim.onEnd = function(){ oldOnEnd(); callback(nodes, anim); };
		}

		anims.push(anim);
	});
	
	if(nodes.length > 1){ return dojo.lfx.combine(anims); }
	else{ return anims[0]; }
}

dojo.lfx.html.slideBy = function(nodes, coords, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	var anims = [];

	dojo.lang.forEach(nodes, function(node){
		var top = null;
		var left = null;
		
		var init = (function(){
			var innerNode = node;
			return function(){
				top = node.offsetTop;
				left = node.offsetLeft;

				if (!dojo.style.isPositionAbsolute(innerNode)) {
					var ret = dojo.style.abs(innerNode);
					dojo.style.setStyleAttributes(innerNode, "position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
					top = ret.y;
					left = ret.x;
				}
			}
		})();
		init();
		
		var anim = dojo.lfx.propertyAnimation(node,
			[{	property: "top",
				start: top,
				end: top+coords[0] },
			{	property: "left",
				start: left,
				end: left+coords[1] }], duration, easing);

		var oldBb = (anim["beforeBegin"]) ? dojo.lang.hitch(anim, "beforeBegin") : function(){};
		anim.beforeBegin = function(){ oldBb(); init(); };

		if(callback){
			var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
			anim.onEnd = function(){ oldOnEnd(); callback(nodes, anim); };
		}

		anims.push(anim);
	});

	if(nodes.length > 1){ return dojo.lfx.combine(anims); }
	else{ return anims[0]; }
}

dojo.lfx.html.explode = function(start, endNode, duration, easing, callback){
	start = dojo.byId(start);
	endNode = dojo.byId(endNode);
	var startCoords = dojo.style.toCoordinateArray(start, true);
	var outline = document.createElement("div");
	dojo.html.copyStyle(outline, endNode);
	with(outline.style){
		position = "absolute";
		display = "none";
	}
	document.body.appendChild(outline);

	with(endNode.style){
		visibility = "hidden";
		display = "block";
	}
	var endCoords = dojo.style.toCoordinateArray(endNode, true);
	with(endNode.style){
		display = "none";
		visibility = "visible";
	}

	var anim = new dojo.lfx.propertyAnimation(outline, [
		{ property: "height", start: startCoords[3], end: endCoords[3] },
		{ property: "width", start: startCoords[2], end: endCoords[2] },
		{ property: "top", start: startCoords[1], end: endCoords[1] },
		{ property: "left", start: startCoords[0], end: endCoords[0] },
		{ property: "opacity", start: 0.3, end: 1.0 }
	], duration, easing);
	
	anim.beforeBegin = function(){
		dojo.style.setDisplay(outline, "block");
	};
	anim.onEnd = function(){
		dojo.style.setDisplay(endNode, "block");
		outline.parentNode.removeChild(outline);
	};
	if(callback){
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ oldOnEnd(); callback(endNode, anim); };
	}
	return anim;
}

dojo.lfx.html.implode = function(startNode, end, duration, easing, callback){
	startNode = dojo.byId(startNode);
	end = dojo.byId(end);
	var startCoords = dojo.style.toCoordinateArray(startNode, true);
	var endCoords = dojo.style.toCoordinateArray(end, true);

	var outline = document.createElement("div");
	dojo.html.copyStyle(outline, startNode);
	dojo.style.setOpacity(outline, 0.3);
	with(outline.style){
		position = "absolute";
		display = "none";
	}
	document.body.appendChild(outline);

	var anim = new dojo.lfx.propertyAnimation(outline, [
		{ property: "height", start: startCoords[3], end: endCoords[3] },
		{ property: "width", start: startCoords[2], end: endCoords[2] },
		{ property: "top", start: startCoords[1], end: endCoords[1] },
		{ property: "left", start: startCoords[0], end: endCoords[0] },
		{ property: "opacity", start: 1.0, end: 0.3 }
	], duration, easing);
	
	anim.beforeBegin = function(){
		dojo.style.hide(startNode);
		dojo.style.show(outline);
	};
	anim.onEnd = function(){
		outline.parentNode.removeChild(outline);
	};
	if(callback){
		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ oldOnEnd(); callback(startNode, anim); };
	}
	return anim;
}

dojo.lfx.html.highlight = function(nodes, startColor, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	var anims = [];

	dojo.lang.forEach(nodes, function(node){
		var color = dojo.style.getBackgroundColor(node);
		var bg = dojo.style.getStyle(node, "background-color").toLowerCase();
		var bgImage = dojo.style.getStyle(node, "background-image");
		var wasTransparent = (bg == "transparent" || bg == "rgba(0, 0, 0, 0)");
		while(color.length > 3) { color.pop(); }

		var rgb = new dojo.graphics.color.Color(startColor);
		var endRgb = new dojo.graphics.color.Color(color);

		var anim = dojo.lfx.propertyAnimation(node, [{
			property: "background-color",
			start: rgb,
			end: endRgb
		}], duration, easing);

		var oldbb = (anim["beforeBegin"]) ? dojo.lang.hitch(anim, "beforeBegin") : function(){};
		anim.beforeBegin = function(){ 
			oldbb();
			if(bgImage){
				node.style.backgroundImage = "none";
			}
			node.style.backgroundColor = "rgb(" + rgb.toRgb().join(",") + ")";
		};

		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ 
			oldOnEnd();
			if(bgImage){
				node.style.backgroundImage = bgImage;
			}
			if(wasTransparent){
				node.style.backgroundColor = "transparent";
			}
			if(callback){
				callback(node, anim);
			}
		};

		anims.push(anim);
	});

	if(nodes.length > 1){ return dojo.lfx.combine(anims); }
	else{ return anims[0]; }
}

dojo.lfx.html.unhighlight = function(nodes, endColor, duration, easing, callback){
	nodes = dojo.lfx.html._byId(nodes);
	var anims = [];

	dojo.lang.forEach(nodes, function(node){
		var color = new dojo.graphics.color.Color(dojo.style.getBackgroundColor(node));
		var rgb = new dojo.graphics.color.Color(endColor);

		var bgImage = dojo.style.getStyle(node, "background-image");
		
		var anim = dojo.lfx.propertyAnimation(node, [{
			property: "background-color",
			start: color,
			end: rgb
		}], duration, easing);

		var oldbb = (anim["beforeBegin"]) ? dojo.lang.hitch(anim, "beforeBegin") : function(){};
		anim.beforeBegin = function(){ 
			oldbb();
			if(bgImage){
				node.style.backgroundImage = "none";
			}
			node.style.backgroundColor = "rgb(" + color.toRgb().join(",") + ")";
		};

		var oldOnEnd = (anim["onEnd"]) ? dojo.lang.hitch(anim, "onEnd") : function(){};
		anim.onEnd = function(){ 
			oldOnEnd();
			if(callback){
				callback(node, anim);
			}
		};

		anims.push(anim);
	});

	if(nodes.length > 1){ return dojo.lfx.combine(anims); }
	else{ return anims[0]; }
}

dojo.lang.mixin(dojo.lfx, dojo.lfx.html);

dojo.kwCompoundRequire({
	browser: ["dojo.lfx.html"],
	dashboard: ["dojo.lfx.html"]
});
dojo.provide("dojo.lfx.*");
dojo.provide("dojo.lang.extras");

dojo.require("dojo.lang.common");

/**
 * Sets a timeout in milliseconds to execute a function in a given context
 * with optional arguments.
 *
 * setTimeout (Object context, function func, number delay[, arg1[, ...]]);
 * setTimeout (function func, number delay[, arg1[, ...]]);
 */
dojo.lang.setTimeout = function(func, delay){
	var context = window, argsStart = 2;
	if(!dojo.lang.isFunction(func)){
		context = func;
		func = delay;
		delay = arguments[2];
		argsStart++;
	}

	if(dojo.lang.isString(func)){
		func = context[func];
	}
	
	var args = [];
	for (var i = argsStart; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	return setTimeout(function () { func.apply(context, args); }, delay);
}

dojo.lang.getNameInObj = function(ns, item){
	if(!ns){ ns = dj_global; }

	for(var x in ns){
		if(ns[x] === item){
			return new String(x);
		}
	}
	return null;
}

dojo.lang.shallowCopy = function(obj) {
	var ret = {}, key;
	for(key in obj) {
		if(dojo.lang.isUndefined(ret[key])) {
			ret[key] = obj[key];
		}
	}
	return ret;
}

/**
 * Return the first argument that isn't undefined
 */
dojo.lang.firstValued = function(/* ... */) {
	for(var i = 0; i < arguments.length; i++) {
		if(typeof arguments[i] != "undefined") {
			return arguments[i];
		}
	}
	return undefined;
}

/**
 * Get a value from a reference specified as a string descriptor,
 * (e.g. "A.B") in the given context.
 * 
 * getObjPathValue(String objpath [, Object context, Boolean create])
 *
 * If context is not specified, dj_global is used
 * If create is true, undefined objects in the path are created.
 */
dojo.lang.getObjPathValue = function(objpath, context, create){
	with(dojo.parseObjPath(objpath, context, create)){
		return dojo.evalProp(prop, obj, create);
	}
}

/**
 * Set a value on a reference specified as a string descriptor. 
 * (e.g. "A.B") in the given context.
 * 
 * setObjPathValue(String objpath, value [, Object context, Boolean create])
 *
 * If context is not specified, dj_global is used
 * If create is true, undefined objects in the path are created.
 */
dojo.lang.setObjPathValue = function(objpath, value, context, create){
	if(arguments.length < 4){
		create = true;
	}
	with(dojo.parseObjPath(objpath, context, create)){
		if(obj && (create || (prop in obj))){
			obj[prop] = value;
		}
	}
}

dojo.provide("dojo.event");

dojo.require("dojo.lang.array");
dojo.require("dojo.lang.extras");
dojo.require("dojo.lang.func");

dojo.event = new function(){
	this.canTimeout = dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);

	// FIXME: where should we put this method (not here!)?
	function interpolateArgs(args, searchForNames){
		var dl = dojo.lang;
		var ao = {
			srcObj: dj_global,
			srcFunc: null,
			adviceObj: dj_global,
			adviceFunc: null,
			aroundObj: null,
			aroundFunc: null,
			adviceType: (args.length>2) ? args[0] : "after",
			precedence: "last",
			once: false,
			delay: null,
			rate: 0,
			adviceMsg: false
		};

		switch(args.length){
			case 0: return;
			case 1: return;
			case 2:
				ao.srcFunc = args[0];
				ao.adviceFunc = args[1];
				break;
			case 3:
				if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((dl.isString(args[1]))&&(dl.isString(args[2]))){
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					var tmpName  = dl.nameAnonFunc(args[2], ao.adviceObj, searchForNames);
					ao.adviceFunc = tmpName;
				}else if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = dj_global;
					var tmpName  = dl.nameAnonFunc(args[0], ao.srcObj, searchForNames);
					ao.srcFunc = tmpName;
					ao.adviceObj = args[1];
					ao.adviceFunc = args[2];
				}
				break;
			case 4:
				if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
					// we can assume that we've got an old-style "connect" from
					// the sigslot school of event attachment. We therefore
					// assume after-advice.
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
					ao.adviceType = args[0];
					ao.srcObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
					ao.adviceType = args[0];
					ao.srcObj = dj_global;
					var tmpName  = dl.nameAnonFunc(args[1], dj_global, searchForNames);
					ao.srcFunc = tmpName;
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))&&(dl.isFunction(args[3]))){
					ao.srcObj = args[1];
					ao.srcFunc = args[2];
					var tmpName  = dl.nameAnonFunc(args[3], dj_global, searchForNames);
					ao.adviceObj = dj_global;
					ao.adviceFunc = tmpName;
				}else if(dl.isObject(args[1])){
					ao.srcObj = args[1];
					ao.srcFunc = args[2];
					ao.adviceObj = dj_global;
					ao.adviceFunc = args[3];
				}else if(dl.isObject(args[2])){
					ao.srcObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else{
					ao.srcObj = ao.adviceObj = ao.aroundObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
					ao.aroundFunc = args[3];
				}
				break;
			case 6:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundFunc = args[5];
				ao.aroundObj = dj_global;
				break;
			default:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundObj = args[5];
				ao.aroundFunc = args[6];
				ao.once = args[7];
				ao.delay = args[8];
				ao.rate = args[9];
				ao.adviceMsg = args[10];
				break;
		}

		if(dl.isFunction(ao.aroundFunc)){
			var tmpName  = dl.nameAnonFunc(ao.aroundFunc, ao.aroundObj, searchForNames);
			ao.aroundFunc = tmpName;
		}

		if(dl.isFunction(ao.srcFunc)){
			ao.srcFunc = dl.getNameInObj(ao.srcObj, ao.srcFunc);
		}

		if(dl.isFunction(ao.adviceFunc)){
			ao.adviceFunc = dl.getNameInObj(ao.adviceObj, ao.adviceFunc);
		}

		if((ao.aroundObj)&&(dl.isFunction(ao.aroundFunc))){
			ao.aroundFunc = dl.getNameInObj(ao.aroundObj, ao.aroundFunc);
		}

		if(!ao.srcObj){
			dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
		}
		if(!ao.adviceObj){
			dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
		}
		return ao;
	}

	this.connect = function(){
		if(arguments.length == 1){
			var ao = arguments[0];
		}else{
			var ao = interpolateArgs(arguments, true);
		}

		if(dojo.lang.isArray(ao.srcObj) && ao.srcObj!=""){
			var tmpAO = {};
			for(var x in ao){
				tmpAO[x] = ao[x];
			}
			var mjps = [];
			dojo.lang.forEach(ao.srcObj, function(src){
				if((dojo.render.html.capable)&&(dojo.lang.isString(src))){
					src = dojo.byId(src);
					// dojo.debug(src);
				}
				tmpAO.srcObj = src;
				// dojo.debug(tmpAO.srcObj, tmpAO.srcFunc);
				// dojo.debug(tmpAO.adviceObj, tmpAO.adviceFunc);
				mjps.push(dojo.event.connect.call(dojo.event, tmpAO));
			});
			return mjps;
		}

		// FIXME: just doing a "getForMethod()" seems to be enough to put this into infinite recursion!!
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc);
		if(ao.adviceFunc){
			var mjp2 = dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj, ao.adviceFunc);
		}

		mjp.kwAddAdvice(ao);

		return mjp;	// advanced users might want to fsck w/ the join point
					// manually
	}

	this.log = function(a1, a2){
		var kwArgs;
		if((arguments.length == 1)&&(typeof a1 == "object")){
			kwArgs = a1;
		}else{
			kwArgs = {
				srcObj: a1,
				srcFunc: a2
			};
		}
		kwArgs.adviceFunc = function(){
			var argsStr = [];
			for(var x=0; x<arguments.length; x++){
				argsStr.push(arguments[x]);
			}
			dojo.debug("("+kwArgs.srcObj+")."+kwArgs.srcFunc, ":", argsStr.join(", "));
		}
		this.kwConnect(kwArgs);
	}

	this.connectBefore = function(){
		var args = ["before"];
		for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
		return this.connect.apply(this, args);
	}

	this.connectAround = function(){
		var args = ["around"];
		for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
		return this.connect.apply(this, args);
	}

	this.connectOnce = function(){
		var ao = interpolateArgs(arguments, true);
		ao.once = true;
		return this.connect(ao);
	}

	this._kwConnectImpl = function(kwArgs, disconnect){
		var fn = (disconnect) ? "disconnect" : "connect";
		if(typeof kwArgs["srcFunc"] == "function"){
			kwArgs.srcObj = kwArgs["srcObj"]||dj_global;
			var tmpName  = dojo.lang.nameAnonFunc(kwArgs.srcFunc, kwArgs.srcObj, true);
			kwArgs.srcFunc = tmpName;
		}
		if(typeof kwArgs["adviceFunc"] == "function"){
			kwArgs.adviceObj = kwArgs["adviceObj"]||dj_global;
			var tmpName  = dojo.lang.nameAnonFunc(kwArgs.adviceFunc, kwArgs.adviceObj, true);
			kwArgs.adviceFunc = tmpName;
		}
		return dojo.event[fn](	(kwArgs["type"]||kwArgs["adviceType"]||"after"),
									kwArgs["srcObj"]||dj_global,
									kwArgs["srcFunc"],
									kwArgs["adviceObj"]||kwArgs["targetObj"]||dj_global,
									kwArgs["adviceFunc"]||kwArgs["targetFunc"],
									kwArgs["aroundObj"],
									kwArgs["aroundFunc"],
									kwArgs["once"],
									kwArgs["delay"],
									kwArgs["rate"],
									kwArgs["adviceMsg"]||false );
	}

	this.kwConnect = function(kwArgs){
		return this._kwConnectImpl(kwArgs, false);

	}

	this.disconnect = function(){
		var ao = interpolateArgs(arguments, true);
		if(!ao.adviceFunc){ return; } // nothing to disconnect
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc);
		return mjp.removeAdvice(ao.adviceObj, ao.adviceFunc, ao.adviceType, ao.once);
	}

	this.kwDisconnect = function(kwArgs){
		return this._kwConnectImpl(kwArgs, true);
	}
}

// exactly one of these is created whenever a method with a joint point is run,
// if there is at least one 'around' advice.
dojo.event.MethodInvocation = function(join_point, obj, args) {
	this.jp_ = join_point;
	this.object = obj;
	this.args = [];
	for(var x=0; x<args.length; x++){
		this.args[x] = args[x];
	}
	// the index of the 'around' that is currently being executed.
	this.around_index = -1;
}

dojo.event.MethodInvocation.prototype.proceed = function() {
	this.around_index++;
	if(this.around_index >= this.jp_.around.length){
		return this.jp_.object[this.jp_.methodname].apply(this.jp_.object, this.args);
		// return this.jp_.run_before_after(this.object, this.args);
	}else{
		var ti = this.jp_.around[this.around_index];
		var mobj = ti[0]||dj_global;
		var meth = ti[1];
		return mobj[meth].call(mobj, this);
	}
} 


dojo.event.MethodJoinPoint = function(obj, methname){
	this.object = obj||dj_global;
	this.methodname = methname;
	this.methodfunc = this.object[methname];
	this.before = [];
	this.after = [];
	this.around = [];
}

dojo.event.MethodJoinPoint.getForMethod = function(obj, methname) {
	// if(!(methname in obj)){
	if(!obj){ obj = dj_global; }
	if(!obj[methname]){
		// supply a do-nothing method implementation
		obj[methname] = function(){};
		if(!obj[methname]){
			// e.g. cannot add to inbuilt objects in IE6
			dojo.raise("Cannot set do-nothing method on that object "+methname);
		}
	}else if((!dojo.lang.isFunction(obj[methname]))&&(!dojo.lang.isAlien(obj[methname]))){
		return null; // FIXME: should we throw an exception here instead?
	}
	// we hide our joinpoint instance in obj[methname + '$joinpoint']
	var jpname = methname + "$joinpoint";
	var jpfuncname = methname + "$joinpoint$method";
	var joinpoint = obj[jpname];
	if(!joinpoint){
		var isNode = false;
		if(dojo.event["browser"]){
			if( (obj["attachEvent"])||
				(obj["nodeType"])||
				(obj["addEventListener"]) ){
				isNode = true;
				dojo.event.browser.addClobberNodeAttrs(obj, [jpname, jpfuncname, methname]);
			}
		}
		var origArity = obj[methname].length;
		obj[jpfuncname] = obj[methname];
		// joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, methname);
		joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, jpfuncname);
		obj[methname] = function(){ 
			var args = [];

			if((isNode)&&(!arguments.length)){
				var evt = null;
				try{
					if(obj.ownerDocument){
						evt = obj.ownerDocument.parentWindow.event;
					}else if(obj.documentElement){
						evt = obj.documentElement.ownerDocument.parentWindow.event;
					}else{
						evt = window.event;
					}
				}catch(e){
					evt = window.event;
				}

				if(evt){
					args.push(dojo.event.browser.fixEvent(evt, this));
				}
			}else{
				for(var x=0; x<arguments.length; x++){
					if((x==0)&&(isNode)&&(dojo.event.browser.isEvent(arguments[x]))){
						args.push(dojo.event.browser.fixEvent(arguments[x], this));
					}else{
						args.push(arguments[x]);
					}
				}
			}
			// return joinpoint.run.apply(joinpoint, arguments); 
			return joinpoint.run.apply(joinpoint, args); 
		}
		obj[methname].__preJoinArity = origArity;
	}
	return joinpoint;
}

dojo.lang.extend(dojo.event.MethodJoinPoint, {
	unintercept: function(){
		this.object[this.methodname] = this.methodfunc;
		this.before = [];
		this.after = [];
		this.around = [];
	},

	disconnect: dojo.lang.forward("unintercept"),

	run: function() {
		var obj = this.object||dj_global;
		var args = arguments;

		// optimization. We only compute once the array version of the arguments
		// pseudo-arr in order to prevent building it each time advice is unrolled.
		var aargs = [];
		for(var x=0; x<args.length; x++){
			aargs[x] = args[x];
		}

		var unrollAdvice  = function(marr){ 
			if(!marr){
				dojo.debug("Null argument to unrollAdvice()");
				return;
			}
		  
			var callObj = marr[0]||dj_global;
			var callFunc = marr[1];
			
			if(!callObj[callFunc]){
				dojo.raise("function \"" + callFunc + "\" does not exist on \"" + callObj + "\"");
			}
			
			var aroundObj = marr[2]||dj_global;
			var aroundFunc = marr[3];
			var msg = marr[6];
			var undef;

			var to = {
				args: [],
				jp_: this,
				object: obj,
				proceed: function(){
					return callObj[callFunc].apply(callObj, to.args);
				}
			};
			to.args = aargs;

			var delay = parseInt(marr[4]);
			var hasDelay = ((!isNaN(delay))&&(marr[4]!==null)&&(typeof marr[4] != "undefined"));
			if(marr[5]){
				var rate = parseInt(marr[5]);
				var cur = new Date();
				var timerSet = false;
				if((marr["last"])&&((cur-marr.last)<=rate)){
					if(dojo.event.canTimeout){
						if(marr["delayTimer"]){
							clearTimeout(marr.delayTimer);
						}
						var tod = parseInt(rate*2); // is rate*2 naive?
						var mcpy = dojo.lang.shallowCopy(marr);
						marr.delayTimer = setTimeout(function(){
							// FIXME: on IE at least, event objects from the
							// browser can go out of scope. How (or should?) we
							// deal with it?
							mcpy[5] = 0;
							unrollAdvice(mcpy);
						}, tod);
					}
					return;
				}else{
					marr.last = cur;
				}
			}

			// FIXME: need to enforce rates for a connection here!

			if(aroundFunc){
				// NOTE: around advice can't delay since we might otherwise depend
				// on execution order!
				aroundObj[aroundFunc].call(aroundObj, to);
			}else{
				// var tmjp = dojo.event.MethodJoinPoint.getForMethod(obj, methname);
				if((hasDelay)&&((dojo.render.html)||(dojo.render.svg))){  // FIXME: the render checks are grotty!
					dj_global["setTimeout"](function(){
						if(msg){
							callObj[callFunc].call(callObj, to); 
						}else{
							callObj[callFunc].apply(callObj, args); 
						}
					}, delay);
				}else{ // many environments can't support delay!
					if(msg){
						callObj[callFunc].call(callObj, to); 
					}else{
						callObj[callFunc].apply(callObj, args); 
					}
				}
			}
		}

		if(this.before.length>0){
			dojo.lang.forEach(this.before, unrollAdvice);
		}

		var result;
		if(this.around.length>0){
			var mi = new dojo.event.MethodInvocation(this, obj, args);
			result = mi.proceed();
		}else if(this.methodfunc){
			result = this.object[this.methodname].apply(this.object, args);
		}

		if(this.after.length>0){
			dojo.lang.forEach(this.after, unrollAdvice);
		}

		return (this.methodfunc) ? result : null;
	},

	getArr: function(kind){
		var arr = this.after;
		// FIXME: we should be able to do this through props or Array.in()
		if((typeof kind == "string")&&(kind.indexOf("before")!=-1)){
			arr = this.before;
		}else if(kind=="around"){
			arr = this.around;
		}
		return arr;
	},

	kwAddAdvice: function(args){
		this.addAdvice(	args["adviceObj"], args["adviceFunc"], 
						args["aroundObj"], args["aroundFunc"], 
						args["adviceType"], args["precedence"], 
						args["once"], args["delay"], args["rate"], 
						args["adviceMsg"]);
	},

	addAdvice: function(	thisAdviceObj, thisAdvice, 
							thisAroundObj, thisAround, 
							advice_kind, precedence, 
							once, delay, rate, asMessage){
		var arr = this.getArr(advice_kind);
		if(!arr){
			dojo.raise("bad this: " + this);
		}

		var ao = [thisAdviceObj, thisAdvice, thisAroundObj, thisAround, delay, rate, asMessage];
		
		if(once){
			if(this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr) >= 0){
				return;
			}
		}

		if(precedence == "first"){
			arr.unshift(ao);
		}else{
			arr.push(ao);
		}
	},

	hasAdvice: function(thisAdviceObj, thisAdvice, advice_kind, arr){
		if(!arr){ arr = this.getArr(advice_kind); }
		var ind = -1;
		for(var x=0; x<arr.length; x++){
			var aao = (typeof thisAdvice == "object") ? (new String(thisAdvice)).toString() : thisAdvice;
			var a1o = (typeof arr[x][1] == "object") ? (new String(arr[x][1])).toString() : arr[x][1];
			if((arr[x][0] == thisAdviceObj)&&(a1o == aao)){
				ind = x;
			}
		}
		return ind;
	},

	removeAdvice: function(thisAdviceObj, thisAdvice, advice_kind, once){
		var arr = this.getArr(advice_kind);
		var ind = this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr);
		if(ind == -1){
			return false;
		}
		while(ind != -1){
			arr.splice(ind, 1);
			if(once){ break; }
			ind = this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr);
		}
		return true;
	}
});

dojo.require("dojo.event");
dojo.provide("dojo.event.topic");

dojo.event.topic = new function(){
	this.topics = {};

	this.getTopic = function(topicName){
		if(!this.topics[topicName]){
			this.topics[topicName] = new this.TopicImpl(topicName);
		}
		return this.topics[topicName];
	}

	this.registerPublisher = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.registerPublisher(obj, funcName);
	}

	this.subscribe = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.subscribe(obj, funcName);
	}

	this.unsubscribe = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.unsubscribe(obj, funcName);
	}

	this.destroy = function(topic){
		this.getTopic(topic).destroy();
		delete this.topics[topic];
	}

	this.publishApply = function(topic, args){
		var topic = this.getTopic(topic);
		topic.sendMessage.apply(topic, args);
	}

	this.publish = function(topic, message){
		var topic = this.getTopic(topic);
		// if message is an array, we treat it as a set of arguments,
		// otherwise, we just pass on the arguments passed in as-is
		var args = [];
		// could we use concat instead here?
		for(var x=1; x<arguments.length; x++){
			args.push(arguments[x]);
		}
		topic.sendMessage.apply(topic, args);
	}
}

dojo.event.topic.TopicImpl = function(topicName){
	this.topicName = topicName;

	this.subscribe = function(listenerObject, listenerMethod){
		var tf = listenerMethod||listenerObject;
		var to = (!listenerMethod) ? dj_global : listenerObject;
		dojo.event.kwConnect({
			srcObj:		this, 
			srcFunc:	"sendMessage", 
			adviceObj:	to,
			adviceFunc: tf
		});
	}

	this.unsubscribe = function(listenerObject, listenerMethod){
		var tf = (!listenerMethod) ? listenerObject : listenerMethod;
		var to = (!listenerMethod) ? null : listenerObject;
		dojo.event.kwDisconnect({
			srcObj:		this, 
			srcFunc:	"sendMessage", 
			adviceObj:	to,
			adviceFunc: tf
		});
	}

	this.destroy = function(){
		dojo.event.MethodJoinPoint.getForMethod(this, "sendMessage").disconnect();
	}

	this.registerPublisher = function(publisherObject, publisherMethod){
		dojo.event.connect(publisherObject, publisherMethod, this, "sendMessage");
	}

	this.sendMessage = function(message){
		// The message has been propagated
	}
}


dojo.provide("dojo.event.browser");
dojo.require("dojo.event");

// FIXME: any particular reason this is in the global scope?
dojo._ie_clobber = new function(){
	this.clobberNodes = [];

	function nukeProp(node, prop){
		// try{ node.removeAttribute(prop); 	}catch(e){ /* squelch */ }
		try{ node[prop] = null; 			}catch(e){ /* squelch */ }
		try{ delete node[prop]; 			}catch(e){ /* squelch */ }
		// FIXME: JotLive needs this, but I'm not sure if it's too slow or not
		try{ node.removeAttribute(prop);	}catch(e){ /* squelch */ }
	}

	this.clobber = function(nodeRef){
		var na;
		var tna;
		if(nodeRef){
			tna = nodeRef.all || nodeRef.getElementsByTagName("*");
			na = [nodeRef];
			for(var x=0; x<tna.length; x++){
				// if we're gonna be clobbering the thing, at least make sure
				// we aren't trying to do it twice
				if(tna[x]["__doClobber__"]){
					na.push(tna[x]);
				}
			}
		}else{
			try{ window.onload = null; }catch(e){}
			na = (this.clobberNodes.length) ? this.clobberNodes : document.all;
		}
		tna = null;
		var basis = {};
		for(var i = na.length-1; i>=0; i=i-1){
			var el = na[i];
			if(el["__clobberAttrs__"]){
				for(var j=0; j<el.__clobberAttrs__.length; j++){
					nukeProp(el, el.__clobberAttrs__[j]);
				}
				nukeProp(el, "__clobberAttrs__");
				nukeProp(el, "__doClobber__");
			}
		}
		na = null;
	}
}

if(dojo.render.html.ie){
	dojo.addOnUnload(function(){
		dojo._ie_clobber.clobber();
		try{
			if((dojo["widget"])&&(dojo.widget["manager"])){
				dojo.widget.manager.destroyAll();
			}
		}catch(e){}
		try{ window.onload = null; }catch(e){}
		try{ window.onunload = null; }catch(e){}
		dojo._ie_clobber.clobberNodes = [];
		// CollectGarbage();
	});
}

dojo.event.browser = new function(){

	var clobberIdx = 0;

	this.clean = function(node){
		if(dojo.render.html.ie){ 
			dojo._ie_clobber.clobber(node);
		}
	}

	this.addClobberNode = function(node){
		if(!dojo.render.html.ie){ return; }
		if(!node["__doClobber__"]){
			node.__doClobber__ = true;
			dojo._ie_clobber.clobberNodes.push(node);
			// this might not be the most efficient thing to do, but it's
			// much less error prone than other approaches which were
			// previously tried and failed
			node.__clobberAttrs__ = [];
		}
	}

	this.addClobberNodeAttrs = function(node, props){
		if(!dojo.render.html.ie){ return; }
		this.addClobberNode(node);
		for(var x=0; x<props.length; x++){
			node.__clobberAttrs__.push(props[x]);
		}
	}

	this.removeListener = function(node, evtName, fp, capture){
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)=="on"){ evtName = evtName.substr(2); }
		// FIXME: this is mostly a punt, we aren't actually doing anything on IE
		if(node.removeEventListener){
			node.removeEventListener(evtName, fp, capture);
		}
	}

	this.addListener = function(node, evtName, fp, capture, dontFix){
		if(!node){ return; } // FIXME: log and/or bail?
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)!="on"){ evtName = "on"+evtName; }

		if(!dontFix){
			// build yet another closure around fp in order to inject fixEvent
			// around the resulting event
			var newfp = function(evt){
				if(!evt){ evt = window.event; }
				var ret = fp(dojo.event.browser.fixEvent(evt, this));
				if(capture){
					dojo.event.browser.stopEvent(evt);
				}
				return ret;
			}
		}else{
			newfp = fp;
		}

		if(node.addEventListener){ 
			node.addEventListener(evtName.substr(2), newfp, capture);
			return newfp;
		}else{
			if(typeof node[evtName] == "function" ){
				var oldEvt = node[evtName];
				node[evtName] = function(e){
					oldEvt(e);
					return newfp(e);
				}
			}else{
				node[evtName]=newfp;
			}
			if(dojo.render.html.ie){
				this.addClobberNodeAttrs(node, [evtName]);
			}
			return newfp;
		}
	}

	this.isEvent = function(obj){
		// FIXME: event detection hack ... could test for additional attributes
		// if necessary
		return (typeof obj != "undefined")&&(typeof Event != "undefined")&&(obj.eventPhase);
		// Event does not support instanceof in Opera, otherwise:
		//return (typeof Event != "undefined")&&(obj instanceof Event);
	}

	this.currentEvent = null;
	
	this.callListener = function(listener, curTarget){
		if(typeof listener != 'function'){
			dojo.raise("listener not a function: " + listener);
		}
		dojo.event.browser.currentEvent.currentTarget = curTarget;
		return listener.call(curTarget, dojo.event.browser.currentEvent);
	}

	this.stopPropagation = function(){
		dojo.event.browser.currentEvent.cancelBubble = true;
	}

	this.preventDefault = function(){
	  dojo.event.browser.currentEvent.returnValue = false;
	}

	this.keys = {
		KEY_BACKSPACE: 8,
		KEY_TAB: 9,
		KEY_ENTER: 13,
		KEY_SHIFT: 16,
		KEY_CTRL: 17,
		KEY_ALT: 18,
		KEY_PAUSE: 19,
		KEY_CAPS_LOCK: 20,
		KEY_ESCAPE: 27,
		KEY_SPACE: 32,
		KEY_PAGE_UP: 33,
		KEY_PAGE_DOWN: 34,
		KEY_END: 35,
		KEY_HOME: 36,
		KEY_LEFT_ARROW: 37,
		KEY_UP_ARROW: 38,
		KEY_RIGHT_ARROW: 39,
		KEY_DOWN_ARROW: 40,
		KEY_INSERT: 45,
		KEY_DELETE: 46,
		KEY_LEFT_WINDOW: 91,
		KEY_RIGHT_WINDOW: 92,
		KEY_SELECT: 93,
		KEY_F1: 112,
		KEY_F2: 113,
		KEY_F3: 114,
		KEY_F4: 115,
		KEY_F5: 116,
		KEY_F6: 117,
		KEY_F7: 118,
		KEY_F8: 119,
		KEY_F9: 120,
		KEY_F10: 121,
		KEY_F11: 122,
		KEY_F12: 123,
		KEY_NUM_LOCK: 144,
		KEY_SCROLL_LOCK: 145
	};

	// reverse lookup
	this.revKeys = [];
	for(var key in this.keys){
		this.revKeys[this.keys[key]] = key;
	}

	this.fixEvent = function(evt, sender){
		if((!evt)&&(window["event"])){
			var evt = window.event;
		}
		
		if((evt["type"])&&(evt["type"].indexOf("key") == 0)){ // key events
			evt.keys = this.revKeys;
			// FIXME: how can we eliminate this iteration?
			for(var key in this.keys) {
				evt[key] = this.keys[key];
			}
			if((dojo.render.html.ie)&&(evt["type"] == "keypress")){
				evt.charCode = evt.keyCode;
			}
		}
	
		if(dojo.render.html.ie){
			if(!evt.target){ evt.target = evt.srcElement; }
			if(!evt.currentTarget){ evt.currentTarget = (sender ? sender : evt.srcElement); }
			if(!evt.layerX){ evt.layerX = evt.offsetX; }
			if(!evt.layerY){ evt.layerY = evt.offsetY; }
			// FIXME: scroll position query is duped from dojo.html to avoid dependency on that entire module
			var docBody = ((dojo.render.html.ie55)||(document["compatMode"] == "BackCompat")) ? document.body : document.documentElement;
			if(!evt.pageX){ evt.pageX = evt.clientX + (docBody.scrollLeft || 0) }
			if(!evt.pageY){ evt.pageY = evt.clientY + (docBody.scrollTop || 0) }
			// mouseover
			if(evt.type == "mouseover"){ evt.relatedTarget = evt.fromElement; }
			// mouseout
			if(evt.type == "mouseout"){ evt.relatedTarget = evt.toElement; }
			this.currentEvent = evt;
			evt.callListener = this.callListener;
			evt.stopPropagation = this.stopPropagation;
			evt.preventDefault = this.preventDefault;
		}
		return evt;
	}

	this.stopEvent = function(ev) {
		if(window.event){
			ev.returnValue = false;
			ev.cancelBubble = true;
		}else{
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}

dojo.kwCompoundRequire({
	common: ["dojo.event", "dojo.event.topic"],
	browser: ["dojo.event.browser"],
	dashboard: ["dojo.event.browser"]
});
dojo.provide("dojo.event.*");

dojo.provide("dojo.io.IO");
dojo.require("dojo.string");
dojo.require("dojo.lang.extras");

/******************************************************************************
 *	Notes about dojo.io design:
 *	
 *	The dojo.io.* package has the unenviable task of making a lot of different
 *	types of I/O feel natural, despite a universal lack of good (or even
 *	reasonable!) I/O capability in the host environment. So lets pin this down
 *	a little bit further.
 *
 *	Rhino:
 *		perhaps the best situation anywhere. Access to Java classes allows you
 *		to do anything one might want in terms of I/O, both synchronously and
 *		async. Can open TCP sockets and perform low-latency client/server
 *		interactions. HTTP transport is available through Java HTTP client and
 *		server classes. Wish it were always this easy.
 *
 *	xpcshell:
 *		XPCOM for I/O. A cluster-fuck to be sure.
 *
 *	spidermonkey:
 *		S.O.L.
 *
 *	Browsers:
 *		Browsers generally do not provide any useable filesystem access. We are
 *		therefore limited to HTTP for moving information to and from Dojo
 *		instances living in a browser.
 *
 *		XMLHTTP:
 *			Sync or async, allows reading of arbitrary text files (including
 *			JS, which can then be eval()'d), writing requires server
 *			cooperation and is limited to HTTP mechanisms (POST and GET).
 *
 *		<iframe> hacks:
 *			iframe document hacks allow browsers to communicate asynchronously
 *			with a server via HTTP POST and GET operations. With significant
 *			effort and server cooperation, low-latency data transit between
 *			client and server can be acheived via iframe mechanisms (repubsub).
 *
 *		SVG:
 *			Adobe's SVG viewer implements helpful primitives for XML-based
 *			requests, but receipt of arbitrary text data seems unlikely w/o
 *			<![CDATA[]]> sections.
 *
 *
 *	A discussion between Dylan, Mark, Tom, and Alex helped to lay down a lot
 *	the IO API interface. A transcript of it can be found at:
 *		http://dojotoolkit.org/viewcvs/viewcvs.py/documents/irc/irc_io_api_log.txt?rev=307&view=auto
 *	
 *	Also referenced in the design of the API was the DOM 3 L&S spec:
 *		http://www.w3.org/TR/2004/REC-DOM-Level-3-LS-20040407/load-save.html
 ******************************************************************************/

// a map of the available transport options. Transports should add themselves
// by calling add(name)
dojo.io.transports = [];
dojo.io.hdlrFuncNames = [ "load", "error", "timeout" ]; // we're omitting a progress() event for now

dojo.io.Request = function(url, mimetype, transport, changeUrl){
	if((arguments.length == 1)&&(arguments[0].constructor == Object)){
		this.fromKwArgs(arguments[0]);
	}else{
		this.url = url;
		if(mimetype){ this.mimetype = mimetype; }
		if(transport){ this.transport = transport; }
		if(arguments.length >= 4){ this.changeUrl = changeUrl; }
	}
}

dojo.lang.extend(dojo.io.Request, {

	/** The URL to hit */
	url: "",
	
	/** The mime type used to interrpret the response body */
	mimetype: "text/plain",
	
	/** The HTTP method to use */
	method: "GET",
	
	/** An Object containing key-value pairs to be included with the request */
	content: undefined, // Object
	
	/** The transport medium to use */
	transport: undefined, // String
	
	/** If defined the URL of the page is physically changed */
	changeUrl: undefined, // String
	
	/** A form node to use in the request */
	formNode: undefined, // HTMLFormElement
	
	/** Whether the request should be made synchronously */
	sync: false,
	
	bindSuccess: false,

	/** Cache/look for the request in the cache before attempting to request?
	 *  NOTE: this isn't a browser cache, this is internal and would only cache in-page
	 */
	useCache: false,

	/** Prevent the browser from caching this by adding a query string argument to the URL */
	preventCache: false,
	
	// events stuff
	load: function(type, data, evt){ },
	error: function(type, error){ },
	timeout: function(type){ },
	handle: function(){ },

	//FIXME: change BrowserIO.js to use timeouts? IframeIO?
	// The number of seconds to wait until firing a timeout callback.
	// If it is zero, that means, don't do a timeout check.
	timeoutSeconds: 0,
	
	// the abort method needs to be filled in by the transport that accepts the
	// bind() request
	abort: function(){ },
	
	// backButton: function(){ },
	// forwardButton: function(){ },

	fromKwArgs: function(kwArgs){
		// normalize args
		if(kwArgs["url"]){ kwArgs.url = kwArgs.url.toString(); }
		if(kwArgs["formNode"]) { kwArgs.formNode = dojo.byId(kwArgs.formNode); }
		if(!kwArgs["method"] && kwArgs["formNode"] && kwArgs["formNode"].method) {
			kwArgs.method = kwArgs["formNode"].method;
		}
		
		// backwards compatibility
		if(!kwArgs["handle"] && kwArgs["handler"]){ kwArgs.handle = kwArgs.handler; }
		if(!kwArgs["load"] && kwArgs["loaded"]){ kwArgs.load = kwArgs.loaded; }
		if(!kwArgs["changeUrl"] && kwArgs["changeURL"]) { kwArgs.changeUrl = kwArgs.changeURL; }

		// encoding fun!
		kwArgs.encoding = dojo.lang.firstValued(kwArgs["encoding"], djConfig["bindEncoding"], "");

		kwArgs.sendTransport = dojo.lang.firstValued(kwArgs["sendTransport"], djConfig["ioSendTransport"], false);

		var isFunction = dojo.lang.isFunction;
		for(var x=0; x<dojo.io.hdlrFuncNames.length; x++){
			var fn = dojo.io.hdlrFuncNames[x];
			if(isFunction(kwArgs[fn])){ continue; }
			if(isFunction(kwArgs["handle"])){
				kwArgs[fn] = kwArgs.handle;
			}
			// handler is aliased above, shouldn't need this check
			/* else if(dojo.lang.isObject(kwArgs.handler)){
				if(isFunction(kwArgs.handler[fn])){
					kwArgs[fn] = kwArgs.handler[fn]||kwArgs.handler["handle"]||function(){};
				}
			}*/
		}
		dojo.lang.mixin(this, kwArgs);
	}

});

dojo.io.Error = function(msg, type, num){
	this.message = msg;
	this.type =  type || "unknown"; // must be one of "io", "parse", "unknown"
	this.number = num || 0; // per-substrate error number, not normalized
}

dojo.io.transports.addTransport = function(name){
	this.push(name);
	// FIXME: do we need to handle things that aren't direct children of the
	// dojo.io namespace? (say, dojo.io.foo.fooTransport?)
	this[name] = dojo.io[name];
}

// binding interface, the various implementations register their capabilities
// and the bind() method dispatches
dojo.io.bind = function(request){
	// if the request asks for a particular implementation, use it
	if(!(request instanceof dojo.io.Request)){
		try{
			request = new dojo.io.Request(request);
		}catch(e){ dojo.debug(e); }
	}
	var tsName = "";
	if(request["transport"]){
		tsName = request["transport"];
		// FIXME: it would be good to call the error handler, although we'd
		// need to use setTimeout or similar to accomplish this and we can't
		// garuntee that this facility is available.
		if(!this[tsName]){ return request; }
	}else{
		// otherwise we do our best to auto-detect what available transports
		// will handle 
		for(var x=0; x<dojo.io.transports.length; x++){
			var tmp = dojo.io.transports[x];
			if((this[tmp])&&(this[tmp].canHandle(request))){
				tsName = tmp;
			}
		}
		if(tsName == ""){ return request; }
	}
	this[tsName].bind(request);
	request.bindSuccess = true;
	return request;
}

dojo.io.queueBind = function(request){
	if(!(request instanceof dojo.io.Request)){
		try{
			request = new dojo.io.Request(request);
		}catch(e){ dojo.debug(e); }
	}

	// make sure we get called if/when we get a response
	var oldLoad = request.load;
	request.load = function(){
		dojo.io._queueBindInFlight = false;
		var ret = oldLoad.apply(this, arguments);
		dojo.io._dispatchNextQueueBind();
		return ret;
	}

	var oldErr = request.error;
	request.error = function(){
		dojo.io._queueBindInFlight = false;
		var ret = oldErr.apply(this, arguments);
		dojo.io._dispatchNextQueueBind();
		return ret;
	}

	dojo.io._bindQueue.push(request);
	dojo.io._dispatchNextQueueBind();
	return request;
}

dojo.io._dispatchNextQueueBind = function(){
	if(!dojo.io._queueBindInFlight){
		dojo.io._queueBindInFlight = true;
		if(dojo.io._bindQueue.length > 0){
			dojo.io.bind(dojo.io._bindQueue.shift());
		}else{
			dojo.io._queueBindInFlight = false;
		}
	}
}
dojo.io._bindQueue = [];
dojo.io._queueBindInFlight = false;

dojo.io.argsFromMap = function(map, encoding, last){
	var enc = /utf/i.test(encoding||"") ? encodeURIComponent : dojo.string.encodeAscii;
	var mapped = [];
	var control = new Object();
	for(var name in map){
		var domap = function(elt){
			var val = enc(name)+"="+enc(elt);
			mapped[(last == name) ? "push" : "unshift"](val);
		}
		if(!control[name]){
			var value = map[name];
			// FIXME: should be isArrayLike?
			if (dojo.lang.isArray(value)){
				dojo.lang.forEach(value, domap);
			}else{
				domap(value);
			}
		}
	}
	return mapped.join("&");
}

dojo.io.setIFrameSrc = function(iframe, src, replace){
	try{
		var r = dojo.render.html;
		// dojo.debug(iframe);
		if(!replace){
			if(r.safari){
				iframe.location = src;
			}else{
				frames[iframe.name].location = src;
			}
		}else{
			// Fun with DOM 0 incompatibilities!
			var idoc;
			if(r.ie){
				idoc = iframe.contentWindow.document;
			}else if(r.safari){
				idoc = iframe.document;
			}else{ //  if(r.moz){
				idoc = iframe.contentWindow;
			}

			//For Safari (at least 2.0.3) and Opera, if the iframe
			//has just been created but it doesn't have content
			//yet, then iframe.document may be null. In that case,
			//use iframe.location and return.
			if(!idoc){
				iframe.location = src;
				return;
			}else{
				idoc.location.replace(src);
			}
		}
	}catch(e){ 
		dojo.debug(e); 
		dojo.debug("setIFrameSrc: "+e); 
	}
}

/*
dojo.io.sampleTranport = new function(){
	this.canHandle = function(kwArgs){
		// canHandle just tells dojo.io.bind() if this is a good transport to
		// use for the particular type of request.
		if(	
			(
				(kwArgs["mimetype"] == "text/plain") ||
				(kwArgs["mimetype"] == "text/html") ||
				(kwArgs["mimetype"] == "text/javascript")
			)&&(
				(kwArgs["method"] == "get") ||
				( (kwArgs["method"] == "post") && (!kwArgs["formNode"]) )
			)
		){
			return true;
		}

		return false;
	}

	this.bind = function(kwArgs){
		var hdlrObj = {};

		// set up a handler object
		for(var x=0; x<dojo.io.hdlrFuncNames.length; x++){
			var fn = dojo.io.hdlrFuncNames[x];
			if(typeof kwArgs.handler == "object"){
				if(typeof kwArgs.handler[fn] == "function"){
					hdlrObj[fn] = kwArgs.handler[fn]||kwArgs.handler["handle"];
				}
			}else if(typeof kwArgs[fn] == "function"){
				hdlrObj[fn] = kwArgs[fn];
			}else{
				hdlrObj[fn] = kwArgs["handle"]||function(){};
			}
		}

		// build a handler function that calls back to the handler obj
		var hdlrFunc = function(evt){
			if(evt.type == "onload"){
				hdlrObj.load("load", evt.data, evt);
			}else if(evt.type == "onerr"){
				var errObj = new dojo.io.Error("sampleTransport Error: "+evt.msg);
				hdlrObj.error("error", errObj);
			}
		}

		// the sample transport would attach the hdlrFunc() when sending the
		// request down the pipe at this point
		var tgtURL = kwArgs.url+"?"+dojo.io.argsFromMap(kwArgs.content);
		// sampleTransport.sendRequest(tgtURL, hdlrFunc);
	}

	dojo.io.transports.addTransport("sampleTranport");
}
*/

dojo.provide("dojo.string.extras");

dojo.require("dojo.string.common");
dojo.require("dojo.lang");

/**
 * Performs parameterized substitutions on a string.  For example,
 *   dojo.string.substituteParams("File '%{0}' is not found in directory '%{1}'.","foo.html","/temp");
 * returns
 *   "File 'foo.html' is not found in directory '/temp'."
 * 
 * @param template the original string template with %{values} to be replaced
 * @param hash name/value pairs (type object) to provide substitutions.  Alternatively, substitutions may be
 *  included as arguments 1..n to this function, corresponding to template parameters 0..n-1
 * @return the completed string. Throws an exception if any parameter is unmatched
 */
//TODO: use ${} substitution syntax instead, like widgets do?
dojo.string.substituteParams = function(template /*string */, hash /* object - optional or ... */) {
	var map = (typeof hash == 'object') ? hash : dojo.lang.toArray(arguments, 1);

	return template.replace(/\%\{(\w+)\}/g, function(match, key){
		return map[key] || dojo.raise("Substitution not found: " + key);
	});
};

/**
 * Parameterized string function
 * str - formatted string with %{values} to be replaces
 * pairs - object of name: "value" value pairs
 * killExtra - remove all remaining %{values} after pairs are inserted
 */
dojo.string.paramString = function(str, pairs, killExtra) {
	dojo.deprecated("dojo.string.paramString",
		"use dojo.string.substituteParams instead", "0.4");

	for(var name in pairs) {
		var re = new RegExp("\\%\\{" + name + "\\}", "g");
		str = str.replace(re, pairs[name]);
	}

	if(killExtra) { str = str.replace(/%\{([^\}\s]+)\}/g, ""); }
	return str;
}

/** Uppercases the first letter of each word */
dojo.string.capitalize = function (str) {
	if (!dojo.lang.isString(str)) { return ""; }
	if (arguments.length == 0) { str = this; }

	var words = str.split(' ');
	for(var i=0; i<words.length; i++){
		words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
	}
	return words.join(" ");
}

/**
 * Return true if the entire string is whitespace characters
 */
dojo.string.isBlank = function (str) {
	if(!dojo.lang.isString(str)) { return true; }
	return (dojo.string.trim(str).length == 0);
}

dojo.string.encodeAscii = function(str) {
	if(!dojo.lang.isString(str)) { return str; }
	var ret = "";
	var value = escape(str);
	var match, re = /%u([0-9A-F]{4})/i;
	while((match = value.match(re))) {
		var num = Number("0x"+match[1]);
		var newVal = escape("&#" + num + ";");
		ret += value.substring(0, match.index) + newVal;
		value = value.substring(match.index+match[0].length);
	}
	ret += value.replace(/\+/g, "%2B");
	return ret;
}

dojo.string.escape = function(type, str) {
	var args = dojo.lang.toArray(arguments, 1);
	switch(type.toLowerCase()) {
		case "xml":
		case "html":
		case "xhtml":
			return dojo.string.escapeXml.apply(this, args);
		case "sql":
			return dojo.string.escapeSql.apply(this, args);
		case "regexp":
		case "regex":
			return dojo.string.escapeRegExp.apply(this, args);
		case "javascript":
		case "jscript":
		case "js":
			return dojo.string.escapeJavaScript.apply(this, args);
		case "ascii":
			// so it's encode, but it seems useful
			return dojo.string.encodeAscii.apply(this, args);
		default:
			return str;
	}
}

dojo.string.escapeXml = function(str, noSingleQuotes) {
	str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
		.replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
	if(!noSingleQuotes) { str = str.replace(/'/gm, "&#39;"); }
	return str;
}

dojo.string.escapeSql = function(str) {
	return str.replace(/'/gm, "''");
}

dojo.string.escapeRegExp = function(str) {
	return str.replace(/\\/gm, "\\\\").replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm, "\\$1");
}

dojo.string.escapeJavaScript = function(str) {
	return str.replace(/(["'\f\b\n\t\r])/gm, "\\$1");
}

dojo.string.escapeString = function(str){ 
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"'
		).replace(/[\f]/g, "\\f"
		).replace(/[\b]/g, "\\b"
		).replace(/[\n]/g, "\\n"
		).replace(/[\t]/g, "\\t"
		).replace(/[\r]/g, "\\r");
}

// TODO: make an HTML version
dojo.string.summary = function(str, len) {
	if(!len || str.length <= len) {
		return str;
	} else {
		return str.substring(0, len).replace(/\.+$/, "") + "...";
	}
}

/**
 * Returns true if 'str' ends with 'end'
 */
dojo.string.endsWith = function(str, end, ignoreCase) {
	if(ignoreCase) {
		str = str.toLowerCase();
		end = end.toLowerCase();
	}
	if((str.length - end.length) < 0){
		return false;
	}
	return str.lastIndexOf(end) == str.length - end.length;
}

/**
 * Returns true if 'str' ends with any of the arguments[2 -> n]
 */
dojo.string.endsWithAny = function(str /* , ... */) {
	for(var i = 1; i < arguments.length; i++) {
		if(dojo.string.endsWith(str, arguments[i])) {
			return true;
		}
	}
	return false;
}

/**
 * Returns true if 'str' starts with 'start'
 */
dojo.string.startsWith = function(str, start, ignoreCase) {
	if(ignoreCase) {
		str = str.toLowerCase();
		start = start.toLowerCase();
	}
	return str.indexOf(start) == 0;
}

/**
 * Returns true if 'str' starts with any of the arguments[2 -> n]
 */
dojo.string.startsWithAny = function(str /* , ... */) {
	for(var i = 1; i < arguments.length; i++) {
		if(dojo.string.startsWith(str, arguments[i])) {
			return true;
		}
	}
	return false;
}

/**
 * Returns true if 'str' contains any of the arguments 2 -> n
 */
dojo.string.has = function(str /* , ... */) {
	for(var i = 1; i < arguments.length; i++) {
		if(str.indexOf(arguments[i]) > -1){
			return true;
		}
	}
	return false;
}

dojo.string.normalizeNewlines = function (text,newlineChar) {
	if (newlineChar == "\n") {
		text = text.replace(/\r\n/g, "\n");
		text = text.replace(/\r/g, "\n");
	} else if (newlineChar == "\r") {
		text = text.replace(/\r\n/g, "\r");
		text = text.replace(/\n/g, "\r");
	} else {
		text = text.replace(/([^\r])\n/g, "$1\r\n");
		text = text.replace(/\r([^\n])/g, "\r\n$1");
	}
	return text;
}

dojo.string.splitEscaped = function (str,charac) {
	var components = [];
	for (var i = 0, prevcomma = 0; i < str.length; i++) {
		if (str.charAt(i) == '\\') { i++; continue; }
		if (str.charAt(i) == charac) {
			components.push(str.substring(prevcomma, i));
			prevcomma = i + 1;
		}
	}
	components.push(str.substr(prevcomma));
	return components;
}

dojo.provide("dojo.undo.browser");
dojo.require("dojo.io");

try{
	if((!djConfig["preventBackButtonFix"])&&(!dojo.hostenv.post_load_)){
		document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+'iframe_history.html')+"'></iframe>");
	}
}catch(e){/* squelch */}

if(dojo.render.html.opera){
	dojo.debug("Opera is not supported with dojo.undo.browser, so back/forward detection will not work.");
}

/* NOTES:
 *  Safari 1.2: 
 *	back button "works" fine, however it's not possible to actually
 *	DETECT that you've moved backwards by inspecting window.location.
 *	Unless there is some other means of locating.
 *	FIXME: perhaps we can poll on history.length?
 *  Safari 2.0.3+ (and probably 1.3.2+):
 *	works fine, except when changeUrl is used. When changeUrl is used,
 *	Safari jumps all the way back to whatever page was shown before
 *	the page that uses dojo.undo.browser support.
 *  IE 5.5 SP2:
 *	back button behavior is macro. It does not move back to the
 *	previous hash value, but to the last full page load. This suggests
 *	that the iframe is the correct way to capture the back button in
 *	these cases.
 *	Don't test this page using local disk for MSIE. MSIE will not create 
 *	a history list for iframe_history.html if served from a file: URL. 
 *	The XML served back from the XHR tests will also not be properly 
 *	created if served from local disk. Serve the test pages from a web 
 *	server to test in that browser.
 *  IE 6.0:
 *	same behavior as IE 5.5 SP2
 * Firefox 1.0:
 *	the back button will return us to the previous hash on the same
 *	page, thereby not requiring an iframe hack, although we do then
 *	need to run a timer to detect inter-page movement.
 */
dojo.undo.browser = {
	initialHref: window.location.href,
	initialHash: window.location.hash,

	moveForward: false,
	historyStack: [],
	forwardStack: [],
	historyIframe: null,
	bookmarkAnchor: null,
	locationTimer: null,

	/**
	 * setInitialState sets the state object and back callback for the very first page that is loaded.
	 * It is recommended that you call this method as part of an event listener that is registered via
	 * dojo.addOnLoad().
	 */
	setInitialState: function(args){
		this.initialState = {"url": this.initialHref, "kwArgs": args, "urlHash": this.initialHash};
	},

	//FIXME: Would like to support arbitrary back/forward jumps. Have to rework iframeLoaded among other things.
	//FIXME: is there a slight race condition in moz using change URL with the timer check and when
	//       the hash gets set? I think I have seen a back/forward call in quick succession, but not consistent.
	/**
	 * addToHistory takes one argument, and it is an object that defines the following functions:
	 * - To support getting back button notifications, the object argument should implement a
	 *   function called either "back", "backButton", or "handle". The string "back" will be
	 *   passed as the first and only argument to this callback.
	 * - To support getting forward button notifications, the object argument should implement a
	 *   function called either "forward", "forwardButton", or "handle". The string "forward" will be
	 *   passed as the first and only argument to this callback.
	 * - If you want the browser location string to change, define "changeUrl" on the object. If the
	 *   value of "changeUrl" is true, then a unique number will be appended to the URL as a fragment
	 *   identifier (http://some.domain.com/path#uniquenumber). If it is any other value that does
	 *   not evaluate to false, that value will be used as the fragment identifier. For example,
	 *   if changeUrl: 'page1', then the URL will look like: http://some.domain.com/path#page1
	 *   
	 * Full example:
	 * 
	 * dojo.undo.browser.addToHistory({
	 *   back: function() { alert('back pressed'); },
	 *   forward: function() { alert('forward pressed'); },
	 *   changeUrl: true
	 * });
	 */
	addToHistory: function(args){
		var hash = null;
		if(!this.historyIframe){
			this.historyIframe = window.frames["djhistory"];
		}
		if(!this.bookmarkAnchor){
			this.bookmarkAnchor = document.createElement("a");
			(document.body||document.getElementsByTagName("body")[0]).appendChild(this.bookmarkAnchor);
			this.bookmarkAnchor.style.display = "none";
		}
		if((!args["changeUrl"])||(dojo.render.html.ie)){
			var url = dojo.hostenv.getBaseScriptUri()+"iframe_history.html?"+(new Date()).getTime();
			this.moveForward = true;
			dojo.io.setIFrameSrc(this.historyIframe, url, false);
		}
		if(args["changeUrl"]){
			this.changingUrl = true;
			hash = "#"+ ((args["changeUrl"]!==true) ? args["changeUrl"] : (new Date()).getTime());
			setTimeout("window.location.href = '"+hash+"'; dojo.undo.browser.changingUrl = false;", 1);
			this.bookmarkAnchor.href = hash;
			
			if(dojo.render.html.ie){
				var oldCB = args["back"]||args["backButton"]||args["handle"];

				//The function takes handleName as a parameter, in case the
				//callback we are overriding was "handle". In that case,
				//we will need to pass the handle name to handle.
				var tcb = function(handleName){
					if(window.location.hash != ""){
						setTimeout("window.location.href = '"+hash+"';", 1);
					}
					//Use apply to set "this" to args, and to try to avoid memory leaks.
					oldCB.apply(this, [handleName]);
				}
		
				//Set interceptor function in the right place.
				if(args["back"]){
					args.back = tcb;
				}else if(args["backButton"]){
					args.backButton = tcb;
				}else if(args["handle"]){
					args.handle = tcb;
				}
		
				//If addToHistory is called, then that means we prune the
				//forward stack -- the user went back, then wanted to
				//start a new forward path.
				this.forwardStack = []; 
				var oldFW = args["forward"]||args["forwardButton"]||args["handle"];
		
				//The function takes handleName as a parameter, in case the
				//callback we are overriding was "handle". In that case,
				//we will need to pass the handle name to handle.
				var tfw = function(handleName){
					if(window.location.hash != ""){
						window.location.href = hash;
					}
					if(oldFW){ // we might not actually have one
						//Use apply to set "this" to args, and to try to avoid memory leaks.
						oldFW.apply(this, [handleName]);
					}
				}

				//Set interceptor function in the right place.
				if(args["forward"]){
					args.forward = tfw;
				}else if(args["forwardButton"]){
					args.forwardButton = tfw;
				}else if(args["handle"]){
					args.handle = tfw;
				}

			}else if(dojo.render.html.moz){
				// start the timer
				if(!this.locationTimer){
					this.locationTimer = setInterval("dojo.undo.browser.checkLocation();", 200);
				}
			}
		}

		this.historyStack.push({"url": url, "kwArgs": args, "urlHash": hash});
	},

	checkLocation: function(){
		if (!this.changingUrl){
			var hsl = this.historyStack.length;

			if((window.location.hash == this.initialHash||window.location.href == this.initialHref)&&(hsl == 1)){
				// FIXME: could this ever be a forward button?
				// we can't clear it because we still need to check for forwards. Ugg.
				// clearInterval(this.locationTimer);
				this.handleBackButton();
				return;
			}
			// first check to see if we could have gone forward. We always halt on
			// a no-hash item.
			if(this.forwardStack.length > 0){
				if(this.forwardStack[this.forwardStack.length-1].urlHash == window.location.hash){
					this.handleForwardButton();
					return;
				}
			}
	
			// ok, that didn't work, try someplace back in the history stack
			if((hsl >= 2)&&(this.historyStack[hsl-2])){
				if(this.historyStack[hsl-2].urlHash==window.location.hash){
					this.handleBackButton();
					return;
				}
			}
		}
	},

	iframeLoaded: function(evt, ifrLoc){
		if(!dojo.render.html.opera){
			var query = this._getUrlQuery(ifrLoc.href);
			if(query == null){ 
				// alert("iframeLoaded");
				// we hit the end of the history, so we should go back
				if(this.historyStack.length == 1){
					this.handleBackButton();
				}
				return;
			}
			if(this.moveForward){
				// we were expecting it, so it's not either a forward or backward movement
				this.moveForward = false;
				return;
			}
	
			//Check the back stack first, since it is more likely.
			//Note that only one step back or forward is supported.
			if(this.historyStack.length >= 2 && query == this._getUrlQuery(this.historyStack[this.historyStack.length-2].url)){
				this.handleBackButton();
			}
			else if(this.forwardStack.length > 0 && query == this._getUrlQuery(this.forwardStack[this.forwardStack.length-1].url)){
				this.handleForwardButton();
			}
		}
	},

	handleBackButton: function(){
		//The "current" page is always at the top of the history stack.
		var current = this.historyStack.pop();
		if(!current){ return; }
		var last = this.historyStack[this.historyStack.length-1];
		if(!last && this.historyStack.length == 0){
			last = this.initialState;
		}
		if (last){
			if(last.kwArgs["back"]){
				last.kwArgs["back"]();
			}else if(last.kwArgs["backButton"]){
				last.kwArgs["backButton"]();
			}else if(last.kwArgs["handle"]){
				last.kwArgs.handle("back");
			}
		}
		this.forwardStack.push(current);
	},

	handleForwardButton: function(){
		var last = this.forwardStack.pop();
		if(!last){ return; }
		if(last.kwArgs["forward"]){
			last.kwArgs.forward();
		}else if(last.kwArgs["forwardButton"]){
			last.kwArgs.forwardButton();
		}else if(last.kwArgs["handle"]){
			last.kwArgs.handle("forward");
		}
		this.historyStack.push(last);
	},

	_getUrlQuery: function(url){
		var segments = url.split("?");
		if (segments.length < 2){
			return null;
		}
		else{
			return segments[1];
		}
	}
}

dojo.provide("dojo.io.BrowserIO");

dojo.require("dojo.io");
dojo.require("dojo.lang.array");
dojo.require("dojo.lang.func");
dojo.require("dojo.string.extras");
dojo.require("dojo.dom");
dojo.require("dojo.undo.browser");

dojo.io.checkChildrenForFile = function(node){
	var hasFile = false;
	var inputs = node.getElementsByTagName("input");
	dojo.lang.forEach(inputs, function(input){
		if(hasFile){ return; }
		if(input.getAttribute("type")=="file"){
			hasFile = true;
		}
	});
	return hasFile;
}

dojo.io.formHasFile = function(formNode){
	return dojo.io.checkChildrenForFile(formNode);
}

dojo.io.updateNode = function(node, urlOrArgs){
	node = dojo.byId(node);
	var args = urlOrArgs;
	if(dojo.lang.isString(urlOrArgs)){
		args = { url: urlOrArgs };
	}
	args.mimetype = "text/html";
	args.load = function(t, d, e){
		while(node.firstChild){
			if(dojo["event"]){
				try{
					dojo.event.browser.clean(node.firstChild);
				}catch(e){}
			}
			node.removeChild(node.firstChild);
		}
		node.innerHTML = d;
	};
	dojo.io.bind(args);
}

dojo.io.formFilter = function(node) {
	var type = (node.type||"").toLowerCase();
	return !node.disabled && node.name
		&& !dojo.lang.inArray(type, ["file", "submit", "image", "reset", "button"]);
}

// TODO: Move to htmlUtils
dojo.io.encodeForm = function(formNode, encoding, formFilter){
	if((!formNode)||(!formNode.tagName)||(!formNode.tagName.toLowerCase() == "form")){
		dojo.raise("Attempted to encode a non-form element.");
	}
	if(!formFilter) { formFilter = dojo.io.formFilter; }
	var enc = /utf/i.test(encoding||"") ? encodeURIComponent : dojo.string.encodeAscii;
	var values = [];

	for(var i = 0; i < formNode.elements.length; i++){
		var elm = formNode.elements[i];
		if(!elm || elm.tagName.toLowerCase() == "fieldset" || !formFilter(elm)) { continue; }
		var name = enc(elm.name);
		var type = elm.type.toLowerCase();

		if(type == "select-multiple"){
			for(var j = 0; j < elm.options.length; j++){
				if(elm.options[j].selected) {
					values.push(name + "=" + enc(elm.options[j].value));
				}
			}
		}else if(dojo.lang.inArray(type, ["radio", "checkbox"])){
			if(elm.checked){
				values.push(name + "=" + enc(elm.value));
			}
		}else{
			values.push(name + "=" + enc(elm.value));
		}
	}

	// now collect input type="image", which doesn't show up in the elements array
	var inputs = formNode.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if(input.type.toLowerCase() == "image" && input.form == formNode
			&& formFilter(input)) {
			var name = enc(input.name);
			values.push(name + "=" + enc(input.value));
			values.push(name + ".x=0");
			values.push(name + ".y=0");
		}
	}
	return values.join("&") + "&";
}

dojo.io.FormBind = function(args) {
	this.bindArgs = {};

	if(args && args.formNode) {
		this.init(args);
	} else if(args) {
		this.init({formNode: args});
	}
}
dojo.lang.extend(dojo.io.FormBind, {
	form: null,

	bindArgs: null,

	clickedButton: null,

	init: function(args) {
		var form = dojo.byId(args.formNode);

		if(!form || !form.tagName || form.tagName.toLowerCase() != "form") {
			throw new Error("FormBind: Couldn't apply, invalid form");
		} else if(this.form == form) {
			return;
		} else if(this.form) {
			throw new Error("FormBind: Already applied to a form");
		}

		dojo.lang.mixin(this.bindArgs, args);
		this.form = form;

		this.connect(form, "onsubmit", "submit");

		for(var i = 0; i < form.elements.length; i++) {
			var node = form.elements[i];
			if(node && node.type && dojo.lang.inArray(node.type.toLowerCase(), ["submit", "button"])) {
				this.connect(node, "onclick", "click");
			}
		}

		var inputs = form.getElementsByTagName("input");
		for(var i = 0; i < inputs.length; i++) {
			var input = inputs[i];
			if(input.type.toLowerCase() == "image" && input.form == form) {
				this.connect(input, "onclick", "click");
			}
		}
	},

	onSubmit: function(form) {
		return true;
	},

	submit: function(e) {
		e.preventDefault();
		if(this.onSubmit(this.form)) {
			dojo.io.bind(dojo.lang.mixin(this.bindArgs, {
				formFilter: dojo.lang.hitch(this, "formFilter")
			}));
		}
	},

	click: function(e) {
		var node = e.currentTarget;
		if(node.disabled) { return; }
		this.clickedButton = node;
	},

	formFilter: function(node) {
		var type = (node.type||"").toLowerCase();
		var accept = false;
		if(node.disabled || !node.name) {
			accept = false;
		} else if(dojo.lang.inArray(type, ["submit", "button", "image"])) {
			if(!this.clickedButton) { this.clickedButton = node; }
			accept = node == this.clickedButton;
		} else {
			accept = !dojo.lang.inArray(type, ["file", "submit", "reset", "button"]);
		}
		return accept;
	},

	// in case you don't have dojo.event.* pulled in
	connect: function(srcObj, srcFcn, targetFcn) {
		if(dojo.evalObjPath("dojo.event.connect")) {
			dojo.event.connect(srcObj, srcFcn, this, targetFcn);
		} else {
			var fcn = dojo.lang.hitch(this, targetFcn);
			srcObj[srcFcn] = function(e) {
				if(!e) { e = window.event; }
				if(!e.currentTarget) { e.currentTarget = e.srcElement; }
				if(!e.preventDefault) { e.preventDefault = function() { window.event.returnValue = false; } }
				fcn(e);
			}
		}
	}
});

dojo.io.XMLHTTPTransport = new function(){
	var _this = this;

	var _cache = {}; // FIXME: make this public? do we even need to?
	this.useCache = false; // if this is true, we'll cache unless kwArgs.useCache = false
	this.preventCache = false; // if this is true, we'll always force GET requests to cache

	// FIXME: Should this even be a function? or do we just hard code it in the next 2 functions?
	function getCacheKey(url, query, method) {
		return url + "|" + query + "|" + method.toLowerCase();
	}

	function addToCache(url, query, method, http) {
		_cache[getCacheKey(url, query, method)] = http;
	}

	function getFromCache(url, query, method) {
		return _cache[getCacheKey(url, query, method)];
	}

	this.clearCache = function() {
		_cache = {};
	}

	// moved successful load stuff here
	function doLoad(kwArgs, http, url, query, useCache) {
		if(	((http.status>=200)&&(http.status<300))|| 	// allow any 2XX response code
			(http.status==304)|| 						// get it out of the cache
			(location.protocol=="file:" && (http.status==0 || http.status==undefined))||
			(location.protocol=="chrome:" && (http.status==0 || http.status==undefined))
		){
			var ret;
			if(kwArgs.method.toLowerCase() == "head"){
				var headers = http.getAllResponseHeaders();
				ret = {};
				ret.toString = function(){ return headers; }
				var values = headers.split(/[\r\n]+/g);
				for(var i = 0; i < values.length; i++) {
					var pair = values[i].match(/^([^:]+)\s*:\s*(.+)$/i);
					if(pair) {
						ret[pair[1]] = pair[2];
					}
				}
			}else if(kwArgs.mimetype == "text/javascript"){
				try{
					ret = dj_eval(http.responseText);
				}catch(e){
					dojo.debug(e);
					dojo.debug(http.responseText);
					ret = null;
				}
			}else if(kwArgs.mimetype == "text/json"){
				try{
					ret = dj_eval("("+http.responseText+")");
				}catch(e){
					dojo.debug(e);
					dojo.debug(http.responseText);
					ret = false;
				}
			}else if((kwArgs.mimetype == "application/xml")||
						(kwArgs.mimetype == "text/xml")){
				ret = http.responseXML;
				if(!ret || typeof ret == "string" || !http.getResponseHeader("Content-Type")) {
					ret = dojo.dom.createDocumentFromText(http.responseText);
				}
			}else{
				ret = http.responseText;
			}

			if(useCache){ // only cache successful responses
				addToCache(url, query, kwArgs.method, http);
			}
			kwArgs[(typeof kwArgs.load == "function") ? "load" : "handle"]("load", ret, http, kwArgs);
		}else{
			var errObj = new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
			kwArgs[(typeof kwArgs.error == "function") ? "error" : "handle"]("error", errObj, http, kwArgs);
		}
	}

	// set headers (note: Content-Type will get overriden if kwArgs.contentType is set)
	function setHeaders(http, kwArgs){
		if(kwArgs["headers"]) {
			for(var header in kwArgs["headers"]) {
				if(header.toLowerCase() == "content-type" && !kwArgs["contentType"]) {
					kwArgs["contentType"] = kwArgs["headers"][header];
				} else {
					http.setRequestHeader(header, kwArgs["headers"][header]);
				}
			}
		}
	}

	this.inFlight = [];
	this.inFlightTimer = null;

	this.startWatchingInFlight = function(){
		if(!this.inFlightTimer){
			this.inFlightTimer = setInterval("dojo.io.XMLHTTPTransport.watchInFlight();", 10);
		}
	}

	this.watchInFlight = function(){
		var now = null;
		for(var x=this.inFlight.length-1; x>=0; x--){
			var tif = this.inFlight[x];
			if(!tif){ this.inFlight.splice(x, 1); continue; }
			if(4==tif.http.readyState){
				// remove it so we can clean refs
				this.inFlight.splice(x, 1);
				doLoad(tif.req, tif.http, tif.url, tif.query, tif.useCache);
			}else if (tif.startTime){
				//See if this is a timeout case.
				if(!now){
					now = (new Date()).getTime();
				}
				if(tif.startTime + (tif.req.timeoutSeconds * 1000) < now){
					//Stop the request.
					if(typeof tif.http.abort == "function"){
						tif.http.abort();
					}

					// remove it so we can clean refs
					this.inFlight.splice(x, 1);
					tif.req[(typeof tif.req.timeout == "function") ? "timeout" : "handle"]("timeout", null, tif.http, tif.req);
				}
			}
		}

		if(this.inFlight.length == 0){
			clearInterval(this.inFlightTimer);
			this.inFlightTimer = null;
		}
	}

	var hasXmlHttp = dojo.hostenv.getXmlhttpObject() ? true : false;
	this.canHandle = function(kwArgs){
		// canHandle just tells dojo.io.bind() if this is a good transport to
		// use for the particular type of request.

		// FIXME: we need to determine when form values need to be
		// multi-part mime encoded and avoid using this transport for those
		// requests.
		return hasXmlHttp
			&& dojo.lang.inArray((kwArgs["mimetype"].toLowerCase()||""), ["text/plain", "text/html", "application/xml", "text/xml", "text/javascript", "text/json"])
			&& !( kwArgs["formNode"] && dojo.io.formHasFile(kwArgs["formNode"]) );
	}

	this.multipartBoundary = "45309FFF-BD65-4d50-99C9-36986896A96F";	// unique guid as a boundary value for multipart posts

	this.bind = function(kwArgs){
		if(!kwArgs["url"]){
			// are we performing a history action?
			if( !kwArgs["formNode"]
				&& (kwArgs["backButton"] || kwArgs["back"] || kwArgs["changeUrl"] || kwArgs["watchForURL"])
				&& (!djConfig.preventBackButtonFix)) {
        dojo.deprecated("Using dojo.io.XMLHTTPTransport.bind() to add to browser history without doing an IO request",
        				"Use dojo.undo.browser.addToHistory() instead.", "0.4");
				dojo.undo.browser.addToHistory(kwArgs);
				return true;
			}
		}

		// build this first for cache purposes
		var url = kwArgs.url;
		var query = "";
		if(kwArgs["formNode"]){
			var ta = kwArgs.formNode.getAttribute("action");
			if((ta)&&(!kwArgs["url"])){ url = ta; }
			var tp = kwArgs.formNode.getAttribute("method");
			if((tp)&&(!kwArgs["method"])){ kwArgs.method = tp; }
			query += dojo.io.encodeForm(kwArgs.formNode, kwArgs.encoding, kwArgs["formFilter"]);
		}

		if(url.indexOf("#") > -1) {
			dojo.debug("Warning: dojo.io.bind: stripping hash values from url:", url);
			url = url.split("#")[0];
		}

		if(kwArgs["file"]){
			// force post for file transfer
			kwArgs.method = "post";
		}

		if(!kwArgs["method"]){
			kwArgs.method = "get";
		}

		// guess the multipart value		
		if(kwArgs.method.toLowerCase() == "get"){
			// GET cannot use multipart
			kwArgs.multipart = false;
		}else{
			if(kwArgs["file"]){
				// enforce multipart when sending files
				kwArgs.multipart = true;
			}else if(!kwArgs["multipart"]){
				// default 
				kwArgs.multipart = false;
			}
		}

		if(kwArgs["backButton"] || kwArgs["back"] || kwArgs["changeUrl"]){
			dojo.undo.browser.addToHistory(kwArgs);
		}

		var content = kwArgs["content"] || {};

		if(kwArgs.sendTransport) {
			content["dojo.transport"] = "xmlhttp";
		}

		do { // break-block
			if(kwArgs.postContent){
				query = kwArgs.postContent;
				break;
			}

			if(content) {
				query += dojo.io.argsFromMap(content, kwArgs.encoding);
			}
			
			if(kwArgs.method.toLowerCase() == "get" || !kwArgs.multipart){
				break;
			}

			var	t = [];
			if(query.length){
				var q = query.split("&");
				for(var i = 0; i < q.length; ++i){
					if(q[i].length){
						var p = q[i].split("=");
						t.push(	"--" + this.multipartBoundary,
								"Content-Disposition: form-data; name=\"" + p[0] + "\"", 
								"",
								p[1]);
					}
				}
			}

			if(kwArgs.file){
				if(dojo.lang.isArray(kwArgs.file)){
					for(var i = 0; i < kwArgs.file.length; ++i){
						var o = kwArgs.file[i];
						t.push(	"--" + this.multipartBoundary,
								"Content-Disposition: form-data; name=\"" + o.name + "\"; filename=\"" + ("fileName" in o ? o.fileName : o.name) + "\"",
								"Content-Type: " + ("contentType" in o ? o.contentType : "application/octet-stream"),
								"",
								o.content);
					}
				}else{
					var o = kwArgs.file;
					t.push(	"--" + this.multipartBoundary,
							"Content-Disposition: form-data; name=\"" + o.name + "\"; filename=\"" + ("fileName" in o ? o.fileName : o.name) + "\"",
							"Content-Type: " + ("contentType" in o ? o.contentType : "application/octet-stream"),
							"",
							o.content);
				}
			}

			if(t.length){
				t.push("--"+this.multipartBoundary+"--", "");
				query = t.join("\r\n");
			}
		}while(false);

		// kwArgs.Connection = "close";

		var async = kwArgs["sync"] ? false : true;

		var preventCache = kwArgs["preventCache"] ||
			(this.preventCache == true && kwArgs["preventCache"] != false);
		var useCache = kwArgs["useCache"] == true ||
			(this.useCache == true && kwArgs["useCache"] != false );

		// preventCache is browser-level (add query string junk), useCache
		// is for the local cache. If we say preventCache, then don't attempt
		// to look in the cache, but if useCache is true, we still want to cache
		// the response
		if(!preventCache && useCache){
			var cachedHttp = getFromCache(url, query, kwArgs.method);
			if(cachedHttp){
				doLoad(kwArgs, cachedHttp, url, query, false);
				return;
			}
		}

		// much of this is from getText, but reproduced here because we need
		// more flexibility
		var http = dojo.hostenv.getXmlhttpObject(kwArgs);	
		var received = false;

		// build a handler function that calls back to the handler obj
		if(async){
			var startTime = 
			// FIXME: setting up this callback handler leaks on IE!!!
			this.inFlight.push({
				"req":		kwArgs,
				"http":		http,
				"url":	 	url,
				"query":	query,
				"useCache":	useCache,
				"startTime": kwArgs.timeoutSeconds ? (new Date()).getTime() : 0
			});
			this.startWatchingInFlight();
		}

		if(kwArgs.method.toLowerCase() == "post"){
			// FIXME: need to hack in more flexible Content-Type setting here!
			http.open("POST", url, async);
			setHeaders(http, kwArgs);
			http.setRequestHeader("Content-Type", kwArgs.multipart ? ("multipart/form-data; boundary=" + this.multipartBoundary) : 
				(kwArgs.contentType || "application/x-www-form-urlencoded"));
			try{
				http.send(query);
			}catch(e){
				if(typeof http.abort == "function"){
					http.abort();
				}
				doLoad(kwArgs, {status: 404}, url, query, useCache);
			}
		}else{
			var tmpUrl = url;
			if(query != "") {
				tmpUrl += (tmpUrl.indexOf("?") > -1 ? "&" : "?") + query;
			}
			if(preventCache) {
				tmpUrl += (dojo.string.endsWithAny(tmpUrl, "?", "&")
					? "" : (tmpUrl.indexOf("?") > -1 ? "&" : "?")) + "dojo.preventCache=" + new Date().valueOf();
			}
			http.open(kwArgs.method.toUpperCase(), tmpUrl, async);
			setHeaders(http, kwArgs);
			try {
				http.send(null);
			}catch(e)	{
				if(typeof http.abort == "function"){
					http.abort();
				}
				doLoad(kwArgs, {status: 404}, url, query, useCache);
			}
		}

		if( !async ) {
			doLoad(kwArgs, http, url, query, useCache);
		}

		kwArgs.abort = function(){
			return http.abort();
		}

		return;
	}
	dojo.io.transports.addTransport("XMLHTTPTransport");
}

dojo.provide("dojo.io.cookie");

dojo.io.cookie.setCookie = function(name, value, days, path, domain, secure) {
	var expires = -1;
	if(typeof days == "number" && days >= 0) {
		var d = new Date();
		d.setTime(d.getTime()+(days*24*60*60*1000));
		expires = d.toGMTString();
	}
	value = escape(value);
	document.cookie = name + "=" + value + ";"
		+ (expires != -1 ? " expires=" + expires + ";" : "")
		+ (path ? "path=" + path : "")
		+ (domain ? "; domain=" + domain : "")
		+ (secure ? "; secure" : "");
}

dojo.io.cookie.set = dojo.io.cookie.setCookie;

dojo.io.cookie.getCookie = function(name) {
	// FIXME: Which cookie should we return?
	//        If there are cookies set for different sub domains in the current
	//        scope there could be more than one cookie with the same name.
	//        I think taking the last one in the list takes the one from the
	//        deepest subdomain, which is what we're doing here.
	var idx = document.cookie.lastIndexOf(name+'=');
	if(idx == -1) { return null; }
	var value = document.cookie.substring(idx+name.length+1);
	var end = value.indexOf(';');
	if(end == -1) { end = value.length; }
	value = value.substring(0, end);
	value = unescape(value);
	return value;
}

dojo.io.cookie.get = dojo.io.cookie.getCookie;

dojo.io.cookie.deleteCookie = function(name) {
	dojo.io.cookie.setCookie(name, "-", 0);
}

dojo.io.cookie.setObjectCookie = function(name, obj, days, path, domain, secure, clearCurrent) {
	if(arguments.length == 5) { // for backwards compat
		clearCurrent = domain;
		domain = null;
		secure = null;
	}
	var pairs = [], cookie, value = "";
	if(!clearCurrent) { cookie = dojo.io.cookie.getObjectCookie(name); }
	if(days >= 0) {
		if(!cookie) { cookie = {}; }
		for(var prop in obj) {
			if(prop == null) {
				delete cookie[prop];
			} else if(typeof obj[prop] == "string" || typeof obj[prop] == "number") {
				cookie[prop] = obj[prop];
			}
		}
		prop = null;
		for(var prop in cookie) {
			pairs.push(escape(prop) + "=" + escape(cookie[prop]));
		}
		value = pairs.join("&");
	}
	dojo.io.cookie.setCookie(name, value, days, path, domain, secure);
}

dojo.io.cookie.getObjectCookie = function(name) {
	var values = null, cookie = dojo.io.cookie.getCookie(name);
	if(cookie) {
		values = {};
		var pairs = cookie.split("&");
		for(var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split("=");
			var value = pair[1];
			if( isNaN(value) ) { value = unescape(pair[1]); }
			values[ unescape(pair[0]) ] = value;
		}
	}
	return values;
}

dojo.io.cookie.isSupported = function() {
	if(typeof navigator.cookieEnabled != "boolean") {
		dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__",
			"CookiesAllowed", 90, null);
		var cookieVal = dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
		navigator.cookieEnabled = (cookieVal == "CookiesAllowed");
		if(navigator.cookieEnabled) {
			// FIXME: should we leave this around?
			this.deleteCookie("__TestingYourBrowserForCookieSupport__");
		}
	}
	return navigator.cookieEnabled;
}

// need to leave this in for backwards-compat from 0.1 for when it gets pulled in by dojo.io.*
if(!dojo.io.cookies) { dojo.io.cookies = dojo.io.cookie; }

dojo.kwCompoundRequire({
	common: ["dojo.io"],
	rhino: ["dojo.io.RhinoIO"],
	browser: ["dojo.io.BrowserIO", "dojo.io.cookie"],
	dashboard: ["dojo.io.BrowserIO", "dojo.io.cookie"]
});
dojo.provide("dojo.io.*");

dojo.provide("dojo.string.Builder");
dojo.require("dojo.string");

// NOTE: testing shows that direct "+=" concatenation is *much* faster on
// Spidermoneky and Rhino, while arr.push()/arr.join() style concatenation is
// significantly quicker on IE (Jscript/wsh/etc.).

dojo.string.Builder = function(str){
	this.arrConcat = (dojo.render.html.capable && dojo.render.html["ie"]);

	var a = [];
	var b = str || "";
	var length = this.length = b.length;

	if(this.arrConcat){
		if(b.length > 0){
			a.push(b);
		}
		b = "";
	}

	this.toString = this.valueOf = function(){ 
		return (this.arrConcat) ? a.join("") : b;
	};

	this.append = function(s){
		if(this.arrConcat){
			a.push(s);
		}else{
			b+=s;
		}
		length += s.length;
		this.length = length;
		return this;
	};

	this.clear = function(){
		a = [];
		b = "";
		length = this.length = 0;
		return this;
	};

	this.remove = function(f,l){
		var s = ""; 
		if(this.arrConcat){
			b = a.join(""); 
		}
		a=[];
		if(f>0){
			s = b.substring(0, (f-1));
		}
		b = s + b.substring(f + l); 
		length = this.length = b.length; 
		if(this.arrConcat){
			a.push(b);
			b="";
		}
		return this;
	};

	this.replace = function(o,n){
		if(this.arrConcat){
			b = a.join(""); 
		}
		a = []; 
		b = b.replace(o,n); 
		length = this.length = b.length; 
		if(this.arrConcat){
			a.push(b);
			b="";
		}
		return this;
	};

	this.insert = function(idx,s){
		if(this.arrConcat){
			b = a.join(""); 
		}
		a=[];
		if(idx == 0){
			b = s + b;
		}else{
			var t = b.split("");
			t.splice(idx,0,s);
			b = t.join("")
		}
		length = this.length = b.length; 
		if(this.arrConcat){
			a.push(b); 
			b="";
		}
		return this;
	};
};

dojo.kwCompoundRequire({
	common: [
		"dojo.string",
		"dojo.string.common",
		"dojo.string.extras",
		"dojo.string.Builder"
	]
});
dojo.provide("dojo.string.*");

dojo.provide("dojo.xml.Parse");

dojo.require("dojo.dom");

//TODO: determine dependencies
// currently has dependency on dojo.xml.DomUtil nodeTypes constants...

/* generic method for taking a node and parsing it into an object

TODO: WARNING: This comment is wrong!

For example, the following xml fragment

<foo bar="bar">
	<baz xyzzy="xyzzy"/>
</foo>

can be described as:

dojo.???.foo = {}
dojo.???.foo.bar = {}
dojo.???.foo.bar.value = "bar";
dojo.???.foo.baz = {}
dojo.???.foo.baz.xyzzy = {}
dojo.???.foo.baz.xyzzy.value = "xyzzy"

*/
// using documentFragment nomenclature to generalize in case we don't want to require passing a collection of nodes with a single parent
dojo.xml.Parse = function(){

	function getDojoTagName (node) {
		var tagName = node.tagName;
		if (tagName.substr(0,5).toLowerCase() != "dojo:") {
			
			if (tagName.substr(0,4).toLowerCase() == "dojo") {
				// FIXME: this assuumes tag names are always lower case
				return "dojo:" + tagName.substring(4).toLowerCase();
			}
		
			// allow lower-casing
			var djt = node.getAttribute("dojoType") || node.getAttribute("dojotype");
			if (djt) { return "dojo:" + djt.toLowerCase(); }
			
			if (node.getAttributeNS && node.getAttributeNS(dojo.dom.dojoml,"type")) {
				return "dojo:" + node.getAttributeNS(dojo.dom.dojoml,"type").toLowerCase();
			}
			try {
				// FIXME: IE really really doesn't like this, so we squelch
				// errors for it
				djt = node.getAttribute("dojo:type");
			} catch (e) { /* FIXME: log? */ }

			if (djt) { return "dojo:"+djt.toLowerCase(); }
		
			if (!dj_global["djConfig"] || !djConfig["ignoreClassNames"]) {
				// FIXME: should we make this optionally enabled via djConfig?
				var classes = node.className||node.getAttribute("class");
				// FIXME: following line, without check for existence of classes.indexOf
				// breaks firefox 1.5's svg widgets
				if (classes && classes.indexOf && classes.indexOf("dojo-") != -1) {
					var aclasses = classes.split(" ");
					for(var x=0; x<aclasses.length; x++){
						if (aclasses[x].length > 5 && aclasses[x].indexOf("dojo-") >= 0) {
							return "dojo:"+aclasses[x].substr(5).toLowerCase();
						}
					}
				}
			}
		
		}
		return tagName.toLowerCase();
	}

	this.parseElement = function(node, hasParentNodeSet, optimizeForDojoML, thisIdx){

        // if parseWidgets="false" don't search inside this node for widgets
        if (node.getAttribute("parseWidgets") == "false") {
            return {};
        }

		// TODO: make this namespace aware
		var parsedNodeSet = {};

		var tagName = getDojoTagName(node);
		parsedNodeSet[tagName] = [];
		if((!optimizeForDojoML)||(tagName.substr(0,4).toLowerCase()=="dojo")){
			var attributeSet = parseAttributes(node);
			for(var attr in attributeSet){
				if((!parsedNodeSet[tagName][attr])||(typeof parsedNodeSet[tagName][attr] != "array")){
					parsedNodeSet[tagName][attr] = [];
				}
				parsedNodeSet[tagName][attr].push(attributeSet[attr]);
			}
	
			// FIXME: we might want to make this optional or provide cloning instead of
			// referencing, but for now, we include a node reference to allow
			// instantiated components to figure out their "roots"
			parsedNodeSet[tagName].nodeRef = node;
			parsedNodeSet.tagName = tagName;
			parsedNodeSet.index = thisIdx||0;
		}
	
		var count = 0;
		var tcn, i = 0, nodes = node.childNodes;
		while(tcn = nodes[i++]){
			switch(tcn.nodeType){
				case  dojo.dom.ELEMENT_NODE: // element nodes, call this function recursively
					count++;
					var ctn = getDojoTagName(tcn);
					if(!parsedNodeSet[ctn]){
						parsedNodeSet[ctn] = [];
					}
					parsedNodeSet[ctn].push(this.parseElement(tcn, true, optimizeForDojoML, count));
					if(	(tcn.childNodes.length == 1)&&
						(tcn.childNodes.item(0).nodeType == dojo.dom.TEXT_NODE)){
						parsedNodeSet[ctn][parsedNodeSet[ctn].length-1].value = tcn.childNodes.item(0).nodeValue;
					}
					break;
				case  dojo.dom.TEXT_NODE: // if a single text node is the child, treat it as an attribute
					if(node.childNodes.length == 1) {
						parsedNodeSet[tagName].push({ value: node.childNodes.item(0).nodeValue });
					}
					break;
				default: break;
				/*
				case  dojo.dom.ATTRIBUTE_NODE: // attribute node... not meaningful here
					break;
				case  dojo.dom.CDATA_SECTION_NODE: // cdata section... not sure if this would ever be meaningful... might be...
					break;
				case  dojo.dom.ENTITY_REFERENCE_NODE: // entity reference node... not meaningful here
					break;
				case  dojo.dom.ENTITY_NODE: // entity node... not sure if this would ever be meaningful
					break;
				case  dojo.dom.PROCESSING_INSTRUCTION_NODE: // processing instruction node... not meaningful here
					break;
				case  dojo.dom.COMMENT_NODE: // comment node... not not sure if this would ever be meaningful 
					break;
				case  dojo.dom.DOCUMENT_NODE: // document node... not sure if this would ever be meaningful
					break;
				case  dojo.dom.DOCUMENT_TYPE_NODE: // document type node... not meaningful here
					break;
				case  dojo.dom.DOCUMENT_FRAGMENT_NODE: // document fragment node... not meaningful here
					break;
				case  dojo.dom.NOTATION_NODE:// notation node... not meaningful here
					break;
				*/
			}
		}
		//return (hasParentNodeSet) ? parsedNodeSet[node.tagName] : parsedNodeSet;
		return parsedNodeSet;
	}

	/* parses a set of attributes on a node into an object tree */
	function parseAttributes(node) {
		// TODO: make this namespace aware
		var parsedAttributeSet = {};
		var atts = node.attributes;
		// TODO: should we allow for duplicate attributes at this point...
		// would any of the relevant dom implementations even allow this?
		var attnode, i=0;
		while(attnode=atts[i++]) {
			if((dojo.render.html.capable)&&(dojo.render.html.ie)){
				if(!attnode){ continue; }
				if(	(typeof attnode == "object")&&
					(typeof attnode.nodeValue == 'undefined')||
					(attnode.nodeValue == null)||
					(attnode.nodeValue == '')){ 
					continue; 
				}
			}
			var nn = (attnode.nodeName.indexOf("dojo:") == -1) ? attnode.nodeName : attnode.nodeName.split("dojo:")[1];
			parsedAttributeSet[nn] = { 
				value: attnode.nodeValue 
			};
		}
		return parsedAttributeSet;
	}
}

dojo.provide("dojo.xml.domUtil");
dojo.require("dojo.graphics.color");
dojo.require("dojo.dom");
dojo.require("dojo.style");

dojo.deprecated("dojo.xml.domUtil", "use dojo.dom instead", "0.4");

// for loading script:
dojo.xml.domUtil = new function(){
	this.nodeTypes = {
		ELEMENT_NODE                  : 1,
		ATTRIBUTE_NODE                : 2,
		TEXT_NODE                     : 3,
		CDATA_SECTION_NODE            : 4,
		ENTITY_REFERENCE_NODE         : 5,
		ENTITY_NODE                   : 6,
		PROCESSING_INSTRUCTION_NODE   : 7,
		COMMENT_NODE                  : 8,
		DOCUMENT_NODE                 : 9,
		DOCUMENT_TYPE_NODE            : 10,
		DOCUMENT_FRAGMENT_NODE        : 11,
		NOTATION_NODE                 : 12
	}
	
	this.dojoml = "http://www.dojotoolkit.org/2004/dojoml";
	this.idIncrement = 0;
	
	this.getTagName = function(){return dojo.dom.getTagName.apply(dojo.dom, arguments);}
	this.getUniqueId = function(){return dojo.dom.getUniqueId.apply(dojo.dom, arguments);}
	this.getFirstChildTag = function() {return dojo.dom.getFirstChildElement.apply(dojo.dom, arguments);}
	this.getLastChildTag = function() {return dojo.dom.getLastChildElement.apply(dojo.dom, arguments);}
	this.getNextSiblingTag = function() {return dojo.dom.getNextSiblingElement.apply(dojo.dom, arguments);}
	this.getPreviousSiblingTag = function() {return dojo.dom.getPreviousSiblingElement.apply(dojo.dom, arguments);}

	this.forEachChildTag = function(node, unaryFunc) {
		var child = this.getFirstChildTag(node);
		while(child) {
			if(unaryFunc(child) == "break") { break; }
			child = this.getNextSiblingTag(child);
		}
	}

	this.moveChildren = function() {return dojo.dom.moveChildren.apply(dojo.dom, arguments);}
	this.copyChildren = function() {return dojo.dom.copyChildren.apply(dojo.dom, arguments);}
	this.clearChildren = function() {return dojo.dom.removeChildren.apply(dojo.dom, arguments);}
	this.replaceChildren = function() {return dojo.dom.replaceChildren.apply(dojo.dom, arguments);}

	this.getStyle = function() {return dojo.style.getStyle.apply(dojo.style, arguments);}
	this.toCamelCase = function() {return dojo.style.toCamelCase.apply(dojo.style, arguments);}
	this.toSelectorCase = function() {return dojo.style.toSelectorCase.apply(dojo.style, arguments);}

	this.getAncestors = function(){return dojo.dom.getAncestors.apply(dojo.dom, arguments);}
	this.isChildOf = function() {return dojo.dom.isDescendantOf.apply(dojo.dom, arguments);}
	this.createDocumentFromText = function() {return dojo.dom.createDocumentFromText.apply(dojo.dom, arguments);}

	if(dojo.render.html.capable || dojo.render.svg.capable) {
		this.createNodesFromText = function(txt, wrap){return dojo.dom.createNodesFromText.apply(dojo.dom, arguments);}
	}

	this.extractRGB = function(color) { return dojo.graphics.color.extractRGB(color); }
	this.hex2rgb = function(hex) { return dojo.graphics.color.hex2rgb(hex); }
	this.rgb2hex = function(r, g, b) { return dojo.graphics.color.rgb2hex(r, g, b); }

	this.insertBefore = function() {return dojo.dom.insertBefore.apply(dojo.dom, arguments);}
	this.before = this.insertBefore;
	this.insertAfter = function() {return dojo.dom.insertAfter.apply(dojo.dom, arguments);}
	this.after = this.insertAfter
	this.insert = function(){return dojo.dom.insertAtPosition.apply(dojo.dom, arguments);}
	this.insertAtIndex = function(){return dojo.dom.insertAtIndex.apply(dojo.dom, arguments);}
	this.textContent = function () {return dojo.dom.textContent.apply(dojo.dom, arguments);}
	this.renderedTextContent = function () {return dojo.dom.renderedTextContent.apply(dojo.dom, arguments);}
	this.remove = function (node) {return dojo.dom.removeNode.apply(dojo.dom, arguments);}
}


dojo.provide("dojo.xml.htmlUtil");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");

dojo.deprecated("dojo.xml.htmlUtil", "use dojo.html instead", "0.4");

dojo.xml.htmlUtil = new function(){
	this.styleSheet = dojo.style.styleSheet;
	
	this._clobberSelection = function(){return dojo.html.clearSelection.apply(dojo.html, arguments);}
	this.disableSelect = function(){return dojo.html.disableSelection.apply(dojo.html, arguments);}
	this.enableSelect = function(){return dojo.html.enableSelection.apply(dojo.html, arguments);}
	
	this.getInnerWidth = function(){return dojo.style.getInnerWidth.apply(dojo.style, arguments);}
	
	this.getOuterWidth = function(node){
		dojo.unimplemented("dojo.xml.htmlUtil.getOuterWidth");
	}

	this.getInnerHeight = function(){return dojo.style.getInnerHeight.apply(dojo.style, arguments);}

	this.getOuterHeight = function(node){
		dojo.unimplemented("dojo.xml.htmlUtil.getOuterHeight");
	}

	this.getTotalOffset = function(){return dojo.style.getTotalOffset.apply(dojo.style, arguments);}
	this.totalOffsetLeft = function(){return dojo.style.totalOffsetLeft.apply(dojo.style, arguments);}

	this.getAbsoluteX = this.totalOffsetLeft;

	this.totalOffsetTop = function(){return dojo.style.totalOffsetTop.apply(dojo.style, arguments);}
	
	this.getAbsoluteY = this.totalOffsetTop;

	this.getEventTarget = function(){return dojo.html.getEventTarget.apply(dojo.html, arguments);}
	this.getScrollTop = function() {return dojo.html.getScrollTop.apply(dojo.html, arguments);}
	this.getScrollLeft = function() {return dojo.html.getScrollLeft.apply(dojo.html, arguments);}

	this.evtTgt = this.getEventTarget;

	this.getParentOfType = function(){return dojo.html.getParentOfType.apply(dojo.html, arguments);}
	this.getAttribute = function(){return dojo.html.getAttribute.apply(dojo.html, arguments);}
	this.getAttr = function (node, attr) { // for backwards compat (may disappear!!!)
		dojo.deprecated("dojo.xml.htmlUtil.getAttr", "use dojo.xml.htmlUtil.getAttribute instead", "0.4");
		return dojo.xml.htmlUtil.getAttribute(node, attr);
	}
	this.hasAttribute = function(){return dojo.html.hasAttribute.apply(dojo.html, arguments);}

	this.hasAttr = function (node, attr) { // for backwards compat (may disappear!!!)
		dojo.deprecated("dojo.xml.htmlUtil.hasAttr", "use dojo.xml.htmlUtil.hasAttribute instead", "0.4");
		return dojo.xml.htmlUtil.hasAttribute(node, attr);
	}
	
	this.getClass = function(){return dojo.html.getClass.apply(dojo.html, arguments)}
	this.hasClass = function(){return dojo.html.hasClass.apply(dojo.html, arguments)}
	this.prependClass = function(){return dojo.html.prependClass.apply(dojo.html, arguments)}
	this.addClass = function(){return dojo.html.addClass.apply(dojo.html, arguments)}
	this.setClass = function(){return dojo.html.setClass.apply(dojo.html, arguments)}
	this.removeClass = function(){return dojo.html.removeClass.apply(dojo.html, arguments)}

	// Enum type for getElementsByClass classMatchType arg:
	this.classMatchType = {
		ContainsAll : 0, // all of the classes are part of the node's class (default)
		ContainsAny : 1, // any of the classes are part of the node's class
		IsOnly : 2 // only all of the classes are part of the node's class
	}

	this.getElementsByClass = function() {return dojo.html.getElementsByClass.apply(dojo.html, arguments)}
	this.getElementsByClassName = this.getElementsByClass;
	
	this.setOpacity = function() {return dojo.style.setOpacity.apply(dojo.style, arguments)}
	this.getOpacity = function() {return dojo.style.getOpacity.apply(dojo.style, arguments)}
	this.clearOpacity = function() {return dojo.style.clearOpacity.apply(dojo.style, arguments)}
	
	this.gravity = function(){return dojo.html.gravity.apply(dojo.html, arguments)}
	
	this.gravity.NORTH = 1;
	this.gravity.SOUTH = 1 << 1;
	this.gravity.EAST = 1 << 2;
	this.gravity.WEST = 1 << 3;
	
	this.overElement = function(){return dojo.html.overElement.apply(dojo.html, arguments)}

	this.insertCssRule = function(){return dojo.style.insertCssRule.apply(dojo.style, arguments)}
	
	this.insertCSSRule = function(selector, declaration, index){
		dojo.deprecated("dojo.xml.htmlUtil.insertCSSRule", "use dojo.style.insertCssRule instead", "0.4");
		return dojo.xml.htmlUtil.insertCssRule(selector, declaration, index);
	}
	
	this.removeCssRule = function(){return dojo.style.removeCssRule.apply(dojo.style, arguments)}

	this.removeCSSRule = function(index){
		dojo.deprecated("dojo.xml.htmlUtil.removeCSSRule", "use dojo.xml.htmlUtil.removeCssRule instead", "0.4");
		return dojo.xml.htmlUtil.removeCssRule(index);
	}

	this.insertCssFile = function(){return dojo.style.insertCssFile.apply(dojo.style, arguments)}

	this.insertCSSFile = function(URI, doc, checkDuplicates){
		dojo.deprecated("dojo.xml.htmlUtil.insertCSSFile", "use dojo.xml.htmlUtil.insertCssFile instead", "0.4");
		return dojo.xml.htmlUtil.insertCssFile(URI, doc, checkDuplicates);
	}

	this.getBackgroundColor = function() {return dojo.style.getBackgroundColor.apply(dojo.style, arguments)}

	this.getUniqueId = function() { return dojo.dom.getUniqueId(); }

	this.getStyle = function() {return dojo.style.getStyle.apply(dojo.style, arguments)}
}

dojo.require("dojo.xml.Parse");
dojo.kwCompoundRequire({
	common:		["dojo.xml.domUtil"],
    browser: 	["dojo.xml.htmlUtil"],
    dashboard: 	["dojo.xml.htmlUtil"],
    svg: 		["dojo.xml.svgUtil"]
});
dojo.provide("dojo.xml.*");

dojo.require("dojo.lang");
dojo.provide("dojo.dnd.DragSource");
dojo.provide("dojo.dnd.DropTarget");
dojo.provide("dojo.dnd.DragObject");
dojo.provide("dojo.dnd.DragAndDrop");

dojo.dnd.DragSource = function(){
	var dm = dojo.dnd.dragManager;
	if(dm["registerDragSource"]){ // side-effect prevention
		dm.registerDragSource(this);
	}
}

dojo.lang.extend(dojo.dnd.DragSource, {
	type: "",

	onDragEnd: function(){
	},

	onDragStart: function(){
	},

	/*
	 * This function gets called when the DOM element was 
	 * selected for dragging by the HtmlDragAndDropManager.
	 */
	onSelected: function(){
	},

	unregister: function(){
		dojo.dnd.dragManager.unregisterDragSource(this);
	},

	reregister: function(){
		dojo.dnd.dragManager.registerDragSource(this);
	}
});

dojo.dnd.DragObject = function(){
	var dm = dojo.dnd.dragManager;
	if(dm["registerDragObject"]){ // side-effect prevention
		dm.registerDragObject(this);
	}
}

dojo.lang.extend(dojo.dnd.DragObject, {
	type: "",

	onDragStart: function(){
		// gets called directly after being created by the DragSource
		// default action is to clone self as icon
	},

	onDragMove: function(){
		// this changes the UI for the drag icon
		//	"it moves itself"
	},

	onDragOver: function(){
	},

	onDragOut: function(){
	},

	onDragEnd: function(){
	},

	// normal aliases
	onDragLeave: this.onDragOut,
	onDragEnter: this.onDragOver,

	// non-camel aliases
	ondragout: this.onDragOut,
	ondragover: this.onDragOver
});

dojo.dnd.DropTarget = function(){
	if (this.constructor == dojo.dnd.DropTarget) { return; } // need to be subclassed
	this.acceptedTypes = [];
	dojo.dnd.dragManager.registerDropTarget(this);
}

dojo.lang.extend(dojo.dnd.DropTarget, {

	acceptsType: function(type){
		if(!dojo.lang.inArray(this.acceptedTypes, "*")){ // wildcard
			if(!dojo.lang.inArray(this.acceptedTypes, type)) { return false; }
		}
		return true;
	},

	accepts: function(dragObjects){
		if(!dojo.lang.inArray(this.acceptedTypes, "*")){ // wildcard
			for (var i = 0; i < dragObjects.length; i++) {
				if (!dojo.lang.inArray(this.acceptedTypes,
					dragObjects[i].type)) { return false; }
			}
		}
		return true;
	},

	onDragOver: function(){
	},

	onDragOut: function(){
	},

	onDragMove: function(){
	},

	onDropStart: function(){
	},

	onDrop: function(){
	},

	onDropEnd: function(){
	}
});

// NOTE: this interface is defined here for the convenience of the DragManager
// implementor. It is expected that in most cases it will be satisfied by
// extending a native event (DOM event in HTML and SVG).
dojo.dnd.DragEvent = function(){
	this.dragSource = null;
	this.dragObject = null;
	this.target = null;
	this.eventStatus = "success";
	//
	// can be one of:
	//	[	"dropSuccess", "dropFailure", "dragMove",
	//		"dragStart", "dragEnter", "dragLeave"]
	//
}

dojo.dnd.DragManager = function(){
	/*
	 *	The DragManager handles listening for low-level events and dispatching
	 *	them to higher-level primitives like drag sources and drop targets. In
	 *	order to do this, it must keep a list of the items.
	 */
}

dojo.lang.extend(dojo.dnd.DragManager, {
	selectedSources: [],
	dragObjects: [],
	dragSources: [],
	registerDragSource: function(){},
	dropTargets: [],
	registerDropTarget: function(){},
	lastDragTarget: null,
	currentDragTarget: null,
	onKeyDown: function(){},
	onMouseOut: function(){},
	onMouseMove: function(){},
	onMouseUp: function(){}
});

// NOTE: despite the existance of the DragManager class, there will be a
// singleton drag manager provided by the renderer-specific D&D support code.
// It is therefore sane for us to assign instance variables to the DragManager
// prototype

// The renderer-specific file will define the following object:
// dojo.dnd.dragManager = null;

dojo.provide("dojo.dnd.HtmlDragManager");
dojo.require("dojo.dnd.DragAndDrop");
dojo.require("dojo.event.*");
dojo.require("dojo.lang.array");
dojo.require("dojo.html");
dojo.require("dojo.style");

// NOTE: there will only ever be a single instance of HTMLDragManager, so it's
// safe to use prototype properties for book-keeping.
dojo.dnd.HtmlDragManager = function(){
}

dojo.inherits(dojo.dnd.HtmlDragManager, dojo.dnd.DragManager);

dojo.lang.extend(dojo.dnd.HtmlDragManager, {
	/**
	 * There are several sets of actions that the DnD code cares about in the
	 * HTML context:
	 *	1.) mouse-down ->
	 *			(draggable selection)
	 *			(dragObject generation)
	 *		mouse-move ->
	 *			(draggable movement)
	 *			(droppable detection)
	 *			(inform droppable)
	 *			(inform dragObject)
	 *		mouse-up
	 *			(inform/destroy dragObject)
	 *			(inform draggable)
	 *			(inform droppable)
	 *	2.) mouse-down -> mouse-down
	 *			(click-hold context menu)
	 *	3.) mouse-click ->
	 *			(draggable selection)
	 *		shift-mouse-click ->
	 *			(augment draggable selection)
	 *		mouse-down ->
	 *			(dragObject generation)
	 *		mouse-move ->
	 *			(draggable movement)
	 *			(droppable detection)
	 *			(inform droppable)
	 *			(inform dragObject)
	 *		mouse-up
	 *			(inform draggable)
	 *			(inform droppable)
	 *	4.) mouse-up
	 *			(clobber draggable selection)
	 */
	disabled: false, // to kill all dragging!
	nestedTargets: false,
	mouseDownTimer: null, // used for click-hold operations
	dsCounter: 0,
	dsPrefix: "dojoDragSource",

	// dimension calculation cache for use durring drag
	dropTargetDimensions: [],

	currentDropTarget: null,
	// currentDropTargetPoints: null,
	previousDropTarget: null,
	_dragTriggered: false,

	selectedSources: [],
	dragObjects: [],

	// mouse position properties
	currentX: null,
	currentY: null,
	lastX: null,
	lastY: null,
	mouseDownX: null,
	mouseDownY: null,
	threshold: 7,

	dropAcceptable: false,

	cancelEvent: function(e){ e.stopPropagation(); e.preventDefault();},

	// method over-rides
	registerDragSource: function(ds){
		if(ds["domNode"]){
			// FIXME: dragSource objects SHOULD have some sort of property that
			// references their DOM node, we shouldn't just be passing nodes and
			// expecting it to work.
			var dp = this.dsPrefix;
			var dpIdx = dp+"Idx_"+(this.dsCounter++);
			ds.dragSourceId = dpIdx;
			this.dragSources[dpIdx] = ds;
			ds.domNode.setAttribute(dp, dpIdx);

			// so we can drag links
			if(dojo.render.html.ie){
				dojo.event.connect(ds.domNode, "ondragstart", this.cancelEvent);
			}
		}
	},

	unregisterDragSource: function(ds){
		if (ds["domNode"]){

			var dp = this.dsPrefix;
			var dpIdx = ds.dragSourceId;
			delete ds.dragSourceId;
			delete this.dragSources[dpIdx];
			ds.domNode.setAttribute(dp, null);
		}
		if(dojo.render.html.ie){
			dojo.event.disconnect(ds.domNode, "ondragstart", this.cancelEvent );
		}
	},

	registerDropTarget: function(dt){
		this.dropTargets.push(dt);
	},

	unregisterDropTarget: function(dt){
		var index = dojo.lang.find(this.dropTargets, dt, true);
		if (index>=0) {
			this.dropTargets.splice(index, 1);
		}
	},

	/**
	* Get the DOM element that is meant to drag.
	* Loop through the parent nodes of the event target until
	* the element is found that was created as a DragSource and 
	* return it.
	*
	* @param event object The event for which to get the drag source.
	*/
	getDragSource: function(e){
		var tn = e.target;
		if(tn === document.body){ return; }
		var ta = dojo.html.getAttribute(tn, this.dsPrefix);
		while((!ta)&&(tn)){
			tn = tn.parentNode;
			if((!tn)||(tn === document.body)){ return; }
			ta = dojo.html.getAttribute(tn, this.dsPrefix);
		}
		return this.dragSources[ta];
	},

	onKeyDown: function(e){
	},

	onMouseDown: function(e){
		if(this.disabled) { return; }

		// only begin on left click
		if(dojo.render.html.ie) {
			if(e.button != 1) { return; }
		} else if(e.which != 1) {
			return;
		}

		var target = e.target.nodeType == dojo.dom.TEXT_NODE ?
			e.target.parentNode : e.target;

		// do not start drag involvement if the user is interacting with
		// a form element.
		if(dojo.html.isTag(target, "button", "textarea", "input", "select", "option")) {
			return;
		}

		// find a selection object, if one is a parent of the source node
		var ds = this.getDragSource(e);
		
		// this line is important.  if we aren't selecting anything then
		// we need to return now, so preventDefault() isn't called, and thus
		// the event is propogated to other handling code
		if(!ds){ return; }

		if(!dojo.lang.inArray(this.selectedSources, ds)){
			this.selectedSources.push(ds);
			ds.onSelected();
		}

 		this.mouseDownX = e.pageX;
 		this.mouseDownY = e.pageY;

		// Must stop the mouse down from being propogated, or otherwise can't
		// drag links in firefox.
		// WARNING: preventing the default action on all mousedown events
		// prevents user interaction with the contents.
		e.preventDefault();

		dojo.event.connect(document, "onmousemove", this, "onMouseMove");
	},

	onMouseUp: function(e, cancel){
		// if we aren't dragging then ignore the mouse-up
		// (in particular, don't call preventDefault(), because other
		// code may need to process this event)
		if(this.selectedSources.length==0){
			return;
		}

		this.mouseDownX = null;
		this.mouseDownY = null;
		this._dragTriggered = false;
 		// e.preventDefault();
		e.dragSource = this.dragSource;
		if((!e.shiftKey)&&(!e.ctrlKey)){
			if(this.currentDropTarget) {
				this.currentDropTarget.onDropStart();
			}
			dojo.lang.forEach(this.dragObjects, function(tempDragObj){
				var ret = null;
				if(!tempDragObj){ return; }
				if(this.currentDropTarget) {
					e.dragObject = tempDragObj;

					// NOTE: we can't get anything but the current drop target
					// here since the drag shadow blocks mouse-over events.
					// This is probelematic for dropping "in" something
					var ce = this.currentDropTarget.domNode.childNodes;
					if(ce.length > 0){
						e.dropTarget = ce[0];
						while(e.dropTarget == tempDragObj.domNode){
							e.dropTarget = e.dropTarget.nextSibling;
						}
					}else{
						e.dropTarget = this.currentDropTarget.domNode;
					}
					if(this.dropAcceptable){
						ret = this.currentDropTarget.onDrop(e);
					}else{
						 this.currentDropTarget.onDragOut(e);
					}
				}

				e.dragStatus = this.dropAcceptable && ret ? "dropSuccess" : "dropFailure";
				// decouple the calls for onDragEnd, so they don't block the execution here
				// ie. if the onDragEnd would call an alert, the execution here is blocked until the
				// user has confirmed the alert box and then the rest of the dnd code is executed
				// while the mouse doesnt "hold" the dragged object anymore ... and so on
				dojo.lang.delayThese([
					function() {
						// in FF1.5 this throws an exception, see 
						// http://dojotoolkit.org/pipermail/dojo-interest/2006-April/006751.html
						try{
							tempDragObj.dragSource.onDragEnd(e)
						} catch(err) {
							// since the problem seems passing e, we just copy all 
							// properties and try the copy ...
							var ecopy = {};
							for (var i in e) {
								if (i=="type") { // the type property contains the exception, no idea why...
									ecopy.type = "mouseup";
									continue;
								}
								ecopy[i] = e[i];
							}
							tempDragObj.dragSource.onDragEnd(ecopy);
						}
					}
					, function() {tempDragObj.onDragEnd(e)}]);
			}, this);

			this.selectedSources = [];
			this.dragObjects = [];
			this.dragSource = null;
			if(this.currentDropTarget) {
				this.currentDropTarget.onDropEnd();
			}
		}

		dojo.event.disconnect(document, "onmousemove", this, "onMouseMove");
		this.currentDropTarget = null;
	},

	onScroll: function(){
		for(var i = 0; i < this.dragObjects.length; i++) {
			if(this.dragObjects[i].updateDragOffset) {
				this.dragObjects[i].updateDragOffset();
			}
		}
		// TODO: do not recalculate, only adjust coordinates
		this.cacheTargetLocations();
	},

	_dragStartDistance: function(x, y){
		if((!this.mouseDownX)||(!this.mouseDownX)){
			return;
		}
		var dx = Math.abs(x-this.mouseDownX);
		var dx2 = dx*dx;
		var dy = Math.abs(y-this.mouseDownY);
		var dy2 = dy*dy;
		return parseInt(Math.sqrt(dx2+dy2), 10);
	},

	cacheTargetLocations: function(){
		this.dropTargetDimensions = [];
		dojo.lang.forEach(this.dropTargets, function(tempTarget){
			var tn = tempTarget.domNode;
			if(!tn){ return; }
			var ttx = dojo.style.getAbsoluteX(tn, true);
			var tty = dojo.style.getAbsoluteY(tn, true);
			this.dropTargetDimensions.push([
				[ttx, tty],	// upper-left
				// lower-right
				[ ttx+dojo.style.getInnerWidth(tn), tty+dojo.style.getInnerHeight(tn) ],
				tempTarget
			]);
			//dojo.debug("Cached for "+tempTarget)
		}, this);
		//dojo.debug("Cache locations")
	},

	onMouseMove: function(e){
		if((dojo.render.html.ie)&&(e.button != 1)){
			// Oooops - mouse up occurred - e.g. when mouse was not over the
			// window. I don't think we can detect this for FF - but at least
			// we can be nice in IE.
			this.currentDropTarget = null;
			this.onMouseUp(e, true);
			return;
		}

		// if we've got some sources, but no drag objects, we need to send
		// onDragStart to all the right parties and get things lined up for
		// drop target detection

		if(	(this.selectedSources.length)&&
			(!this.dragObjects.length) ){
			var dx;
			var dy;
			if(!this._dragTriggered){
				this._dragTriggered = (this._dragStartDistance(e.pageX, e.pageY) > this.threshold);
				if(!this._dragTriggered){ return; }
				dx = e.pageX - this.mouseDownX;
				dy = e.pageY - this.mouseDownY;
			}

			// the first element is always our dragSource, if there are multiple
			// selectedSources (elements that move along) then the first one is the master
			// and for it the events will be fired etc.
			this.dragSource = this.selectedSources[0];
			
			dojo.lang.forEach(this.selectedSources, function(tempSource){
				if(!tempSource){ return; }
				var tdo = tempSource.onDragStart(e);
				if(tdo){
					tdo.onDragStart(e);

					// "bump" the drag object to account for the drag threshold
					tdo.dragOffset.top += dy;
					tdo.dragOffset.left += dx;
					tdo.dragSource = tempSource;

					this.dragObjects.push(tdo);
				}
			}, this);

			/* clean previous drop target in dragStart */
			this.previousDropTarget = null;

			this.cacheTargetLocations();
		}

		// FIXME: we need to add dragSources and dragObjects to e
		dojo.lang.forEach(this.dragObjects, function(dragObj){
			if(dragObj){ dragObj.onDragMove(e); }
		});

		// if we have a current drop target, check to see if we're outside of
		// it. If so, do all the actions that need doing.
		if(this.currentDropTarget){
			//dojo.debug(dojo.dom.hasParent(this.currentDropTarget.domNode))
			var c = dojo.style.toCoordinateArray(this.currentDropTarget.domNode, true);
			//		var dtp = this.currentDropTargetPoints;
			var dtp = [
				[c[0],c[1]], [c[0]+c[2], c[1]+c[3]]
			];
		}

		if((!this.nestedTargets)&&(dtp)&&(this.isInsideBox(e, dtp))){
			if(this.dropAcceptable){
				this.currentDropTarget.onDragMove(e, this.dragObjects);
			}
		}else{
			// FIXME: need to fix the event object!
			// see if we can find a better drop target
			var bestBox = this.findBestTarget(e);

			if(bestBox.target === null){
				if(this.currentDropTarget){
					this.currentDropTarget.onDragOut(e);
					this.previousDropTarget = this.currentDropTarget;
					this.currentDropTarget = null;
					// this.currentDropTargetPoints = null;
				}
				this.dropAcceptable = false;
				return;
			}

			if(this.currentDropTarget !== bestBox.target){
				if(this.currentDropTarget){
					this.previousDropTarget = this.currentDropTarget;
					this.currentDropTarget.onDragOut(e);
				}
				this.currentDropTarget = bestBox.target;
				// this.currentDropTargetPoints = bestBox.points;
				e.dragObjects = this.dragObjects;
				this.dropAcceptable = this.currentDropTarget.onDragOver(e);

			}else{
				if(this.dropAcceptable){
					this.currentDropTarget.onDragMove(e, this.dragObjects);
				}
			}
		}
	},

	findBestTarget: function(e) {
		var _this = this;
		var bestBox = new Object();
		bestBox.target = null;
		bestBox.points = null;
		dojo.lang.every(this.dropTargetDimensions, function(tmpDA) {
			if(!_this.isInsideBox(e, tmpDA))
				return true;
			bestBox.target = tmpDA[2];
			bestBox.points = tmpDA;
			// continue iterating only if _this.nestedTargets == true
			return Boolean(_this.nestedTargets);
		});

		return bestBox;
	},

	isInsideBox: function(e, coords){
		if(	(e.pageX > coords[0][0])&&
			(e.pageX < coords[1][0])&&
			(e.pageY > coords[0][1])&&
			(e.pageY < coords[1][1]) ){
			return true;
		}
		return false;
	},

	onMouseOver: function(e){
	},

	onMouseOut: function(e){
	}
});

dojo.dnd.dragManager = new dojo.dnd.HtmlDragManager();

// global namespace protection closure
(function(){
	var d = document;
	var dm = dojo.dnd.dragManager;
	// set up event handlers on the document
	dojo.event.connect(d, "onkeydown", 		dm, "onKeyDown");
	dojo.event.connect(d, "onmouseover",	dm, "onMouseOver");
	dojo.event.connect(d, "onmouseout", 	dm, "onMouseOut");
	dojo.event.connect(d, "onmousedown",	dm, "onMouseDown");
	dojo.event.connect(d, "onmouseup",		dm, "onMouseUp");
	// TODO: process scrolling of elements, not only window
	dojo.event.connect(window, "onscroll",	dm, "onScroll");
})();

dojo.require("dojo.html");
dojo.provide("dojo.html.extras");
dojo.require("dojo.string.extras"); 

/**
 * Calculates the mouse's direction of gravity relative to the centre
 * of the given node.
 * <p>
 * If you wanted to insert a node into a DOM tree based on the mouse
 * position you might use the following code:
 * <pre>
 * if (gravity(node, e) & gravity.NORTH) { [insert before]; }
 * else { [insert after]; }
 * </pre>
 *
 * @param node The node
 * @param e		The event containing the mouse coordinates
 * @return		 The directions, NORTH or SOUTH and EAST or WEST. These
 *						 are properties of the function.
 */
dojo.html.gravity = function(node, e){
	node = dojo.byId(node);
	var mouse = dojo.html.getCursorPosition(e);

	with (dojo.html) {
		var nodecenterx = getAbsoluteX(node, true) + (getInnerWidth(node) / 2);
		var nodecentery = getAbsoluteY(node, true) + (getInnerHeight(node) / 2);
	}
	
	with (dojo.html.gravity) {
		return ((mouse.x < nodecenterx ? WEST : EAST) |
			(mouse.y < nodecentery ? NORTH : SOUTH));
	}
}

dojo.html.gravity.NORTH = 1;
dojo.html.gravity.SOUTH = 1 << 1;
dojo.html.gravity.EAST = 1 << 2;
dojo.html.gravity.WEST = 1 << 3;


/**
 * Attempts to return the text as it would be rendered, with the line breaks
 * sorted out nicely. Unfinished.
 */
dojo.html.renderedTextContent = function(node){
	node = dojo.byId(node);
	var result = "";
	if (node == null) { return result; }
	for (var i = 0; i < node.childNodes.length; i++) {
		switch (node.childNodes[i].nodeType) {
			case 1: // ELEMENT_NODE
			case 5: // ENTITY_REFERENCE_NODE
				var display = "unknown";
				try {
					display = dojo.style.getStyle(node.childNodes[i], "display");
				} catch(E) {}
				switch (display) {
					case "block": case "list-item": case "run-in":
					case "table": case "table-row-group": case "table-header-group":
					case "table-footer-group": case "table-row": case "table-column-group":
					case "table-column": case "table-cell": case "table-caption":
						// TODO: this shouldn't insert double spaces on aligning blocks
						result += "\n";
						result += dojo.html.renderedTextContent(node.childNodes[i]);
						result += "\n";
						break;
					
					case "none": break;
					
					default:
						if(node.childNodes[i].tagName && node.childNodes[i].tagName.toLowerCase() == "br") {
							result += "\n";
						} else {
							result += dojo.html.renderedTextContent(node.childNodes[i]);
						}
						break;
				}
				break;
			case 3: // TEXT_NODE
			case 2: // ATTRIBUTE_NODE
			case 4: // CDATA_SECTION_NODE
				var text = node.childNodes[i].nodeValue;
				var textTransform = "unknown";
				try {
					textTransform = dojo.style.getStyle(node, "text-transform");
				} catch(E) {}
				switch (textTransform){
					case "capitalize": text = dojo.string.capitalize(text); break;
					case "uppercase": text = text.toUpperCase(); break;
					case "lowercase": text = text.toLowerCase(); break;
					default: break; // leave as is
				}
				// TODO: implement
				switch (textTransform){
					case "nowrap": break;
					case "pre-wrap": break;
					case "pre-line": break;
					case "pre": break; // leave as is
					default:
						// remove whitespace and collapse first space
						text = text.replace(/\s+/, " ");
						if (/\s$/.test(result)) { text.replace(/^\s/, ""); }
						break;
				}
				result += text;
				break;
			default:
				break;
		}
	}
	return result;
}

dojo.html.createNodesFromText = function(txt, trim){
	if(trim) { txt = dojo.string.trim(txt); }

	var tn = document.createElement("div");
	// tn.style.display = "none";
	tn.style.visibility= "hidden";
	document.body.appendChild(tn);
	var tableType = "none";
	if((/^<t[dh][\s\r\n>]/i).test(dojo.string.trimStart(txt))) {
		txt = "<table><tbody><tr>" + txt + "</tr></tbody></table>";
		tableType = "cell";
	} else if((/^<tr[\s\r\n>]/i).test(dojo.string.trimStart(txt))) {
		txt = "<table><tbody>" + txt + "</tbody></table>";
		tableType = "row";
	} else if((/^<(thead|tbody|tfoot)[\s\r\n>]/i).test(dojo.string.trimStart(txt))) {
		txt = "<table>" + txt + "</table>";
		tableType = "section";
	}
	tn.innerHTML = txt;
	if(tn["normalize"]){
		tn.normalize();
	}

	var parent = null;
	switch(tableType) {
		case "cell":
			parent = tn.getElementsByTagName("tr")[0];
			break;
		case "row":
			parent = tn.getElementsByTagName("tbody")[0];
			break;
		case "section":
			parent = tn.getElementsByTagName("table")[0];
			break;
		default:
			parent = tn;
			break;
	}

	/* this doesn't make much sense, I'm assuming it just meant trim() so wrap was replaced with trim
	if(wrap){ 
		var ret = [];
		// start hack
		var fc = tn.firstChild;
		ret[0] = ((fc.nodeValue == " ")||(fc.nodeValue == "\t")) ? fc.nextSibling : fc;
		// end hack
		// tn.style.display = "none";
		document.body.removeChild(tn);
		return ret;
	}
	*/
	var nodes = [];
	for(var x=0; x<parent.childNodes.length; x++){
		nodes.push(parent.childNodes[x].cloneNode(true));
	}
	tn.style.display = "none"; // FIXME: why do we do this?
	document.body.removeChild(tn);
	return nodes;
}

/* TODO: merge placeOnScreen and placeOnScreenPoint to make 1 function that allows you
 * to define which corner(s) you want to bind to. Something like so:
 *
 * kes(node, desiredX, desiredY, "TR")
 * kes(node, [desiredX, desiredY], ["TR", "BL"])
 *
 * TODO: make this function have variable call sigs
 *
 * kes(node, ptArray, cornerArray, padding, hasScroll)
 * kes(node, ptX, ptY, cornerA, cornerB, cornerC, paddingArray, hasScroll)
 */

/**
 * Keeps 'node' in the visible area of the screen while trying to
 * place closest to desiredX, desiredY. The input coordinates are
 * expected to be the desired screen position, not accounting for
 * scrolling. If you already accounted for scrolling, set 'hasScroll'
 * to true. Set padding to either a number or array for [paddingX, paddingY]
 * to put some buffer around the element you want to position.
 * NOTE: node is assumed to be absolutely or relatively positioned.
 *
 * Alternate call sig:
 *  placeOnScreen(node, [x, y], padding, hasScroll)
 *
 * Examples:
 *  placeOnScreen(node, 100, 200)
 *  placeOnScreen("myId", [800, 623], 5)
 *  placeOnScreen(node, 234, 3284, [2, 5], true)
 */
dojo.html.placeOnScreen = function(node, desiredX, desiredY, padding, hasScroll) {
	if(dojo.lang.isArray(desiredX)) {
		hasScroll = padding;
		padding = desiredY;
		desiredY = desiredX[1];
		desiredX = desiredX[0];
	}

	if(!isNaN(padding)) {
		padding = [Number(padding), Number(padding)];
	} else if(!dojo.lang.isArray(padding)) {
		padding = [0, 0];
	}

	var scroll = dojo.html.getScrollOffset();
	var view = dojo.html.getViewportSize();

	node = dojo.byId(node);
	var w = node.offsetWidth + padding[0];
	var h = node.offsetHeight + padding[1];

	if(hasScroll) {
		desiredX -= scroll.x;
		desiredY -= scroll.y;
	}

	var x = desiredX + w;
	if(x > view.w) {
		x = view.w - w;
	} else {
		x = desiredX;
	}
	x = Math.max(padding[0], x) + scroll.x;

	var y = desiredY + h;
	if(y > view.h) {
		y = view.h - h;
	} else {
		y = desiredY;
	}
	y = Math.max(padding[1], y) + scroll.y;

	node.style.left = x + "px";
	node.style.top = y + "px";

	var ret = [x, y];
	ret.x = x;
	ret.y = y;
	return ret;
}

/**
 * Like placeOnScreenPoint except that it attempts to keep one of the node's
 * corners at desiredX, desiredY.  Favors the bottom right position
 *
 * Examples placing node at mouse position (where e = [Mouse event]):
 *  placeOnScreenPoint(node, e.clientX, e.clientY);
 */
dojo.html.placeOnScreenPoint = function(node, desiredX, desiredY, padding, hasScroll) {
	if(dojo.lang.isArray(desiredX)) {
		hasScroll = padding;
		padding = desiredY;
		desiredY = desiredX[1];
		desiredX = desiredX[0];
	}

	if(!isNaN(padding)) {
		padding = [Number(padding), Number(padding)];
	} else if(!dojo.lang.isArray(padding)) {
		padding = [0, 0];
	}

	var scroll = dojo.html.getScrollOffset();
	var view = dojo.html.getViewportSize();

	node = dojo.byId(node);
	var oldDisplay = node.style.display;
	node.style.display="";
	var w = dojo.style.getInnerWidth(node);
	var h = dojo.style.getInnerHeight(node);
	node.style.display=oldDisplay;

	if(hasScroll) {
		desiredX -= scroll.x;
		desiredY -= scroll.y;
	}

	var x = -1, y = -1;
	//dojo.debug((desiredX+padding[0]) + w, "<=", view.w, "&&", (desiredY+padding[1]) + h, "<=", view.h);
	if((desiredX+padding[0]) + w <= view.w && (desiredY+padding[1]) + h <= view.h) { // TL
		x = (desiredX+padding[0]);
		y = (desiredY+padding[1]);
		//dojo.debug("TL", x, y);
	}

	//dojo.debug((desiredX-padding[0]), "<=", view.w, "&&", (desiredY+padding[1]) + h, "<=", view.h);
	if((x < 0 || y < 0) && (desiredX-padding[0]) <= view.w && (desiredY+padding[1]) + h <= view.h) { // TR
		x = (desiredX-padding[0]) - w;
		y = (desiredY+padding[1]);
		//dojo.debug("TR", x, y);
	}

	//dojo.debug((desiredX+padding[0]) + w, "<=", view.w, "&&", (desiredY-padding[1]), "<=", view.h);
	if((x < 0 || y < 0) && (desiredX+padding[0]) + w <= view.w && (desiredY-padding[1]) <= view.h) { // BL
		x = (desiredX+padding[0]);
		y = (desiredY-padding[1]) - h;
		//dojo.debug("BL", x, y);
	}

	//dojo.debug((desiredX-padding[0]), "<=", view.w, "&&", (desiredY-padding[1]), "<=", view.h);
	if((x < 0 || y < 0) && (desiredX-padding[0]) <= view.w && (desiredY-padding[1]) <= view.h) { // BR
		x = (desiredX-padding[0]) - w;
		y = (desiredY-padding[1]) - h;
		//dojo.debug("BR", x, y);
	}

	if(x < 0 || y < 0 || (x + w > view.w) || (y + h > view.h)) {
		return dojo.html.placeOnScreen(node, desiredX, desiredY, padding, hasScroll);
	}

	x += scroll.x;
	y += scroll.y;

	node.style.left = x + "px";
	node.style.top = y + "px";

	var ret = [x, y];
	ret.x = x;
	ret.y = y;
	return ret;
}

/**
 * For IE z-index schenanigans
 * Two possible uses:
 *   1. new dojo.html.BackgroundIframe(node)
 *        Makes a background iframe as a child of node, that fills area (and position) of node
 *
 *   2. new dojo.html.BackgroundIframe()
 *        Attaches frame to document.body.  User must call size() to set size.
 */
dojo.html.BackgroundIframe = function(node) {
	if(dojo.render.html.ie55 || dojo.render.html.ie60) {
		var html=
				 "<iframe "
				+"style='position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"
				+        "z-index: -1; filter:Alpha(Opacity=\"0\");' "
				+">";
		this.iframe = document.createElement(html);
		if(node){
			node.appendChild(this.iframe);
			this.domNode=node;
		}else{
			document.body.appendChild(this.iframe);
			this.iframe.style.display="none";
		}
	}
}
dojo.lang.extend(dojo.html.BackgroundIframe, {
	iframe: null,

	// TODO: this function shouldn't be necessary but setting width=height=100% doesn't work!
	onResized: function(){
		if(this.iframe && this.domNode && this.domNode.parentElement){ // No parentElement if onResized() timeout event occurs on a removed domnode
			var w = dojo.style.getOuterWidth(this.domNode);
			var h = dojo.style.getOuterHeight(this.domNode);
			if (w  == 0 || h == 0 ){
				dojo.lang.setTimeout(this, this.onResized, 50);
				return;
			}
			var s = this.iframe.style;
			s.width = w + "px";
			s.height = h + "px";
		}
	},

	// Call this function if the iframe is connected to document.body rather
	// than the node being shadowed (TODO: erase)
	size: function(node) {
		if(!this.iframe) { return; }

		var coords = dojo.style.toCoordinateArray(node, true);

		var s = this.iframe.style;
		s.width = coords.w + "px";
		s.height = coords.h + "px";
		s.left = coords.x + "px";
		s.top = coords.y + "px";
	},

	setZIndex: function(node /* or number */) {
		if(!this.iframe) { return; }

		if(dojo.dom.isNode(node)) {
			this.iframe.style.zIndex = dojo.html.getStyle(node, "z-index") - 1;
		} else if(!isNaN(node)) {
			this.iframe.style.zIndex = node;
		}
	},

	show: function() {
		if(!this.iframe) { return; }
		this.iframe.style.display = "block";
	},

	hide: function() {
		if(!this.ie) { return; }
		var s = this.iframe.style;
		s.display = "none";
	},

	remove: function() {
		dojo.dom.removeNode(this.iframe);
	}
});

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

dojo.dnd.HtmlDragSource = function(node, type){
	node = dojo.byId(node);
	this.dragObjects = [];
	this.constrainToContainer = false;
	if(node){
		this.domNode = node;
		this.dragObject = node;
		// register us
		dojo.dnd.DragSource.call(this);
		// set properties that might have been clobbered by the mixin
		this.type = (type)||(this.domNode.nodeName.toLowerCase());
	}
}
dojo.inherits(dojo.dnd.HtmlDragSource, dojo.dnd.DragSource);
dojo.lang.extend(dojo.dnd.HtmlDragSource, {
	dragClass: "", // CSS classname(s) applied to node when it is being dragged

	onDragStart: function(){
		var dragObj = new dojo.dnd.HtmlDragObject(this.dragObject, this.type);
		if(this.dragClass) { dragObj.dragClass = this.dragClass; }

		if (this.constrainToContainer) {
			dragObj.constrainTo(this.constrainingContainer || this.domNode.parentNode);
		}

		return dragObj;
	},

	setDragHandle: function(node){
		node = dojo.byId(node);
		dojo.dnd.dragManager.unregisterDragSource(this);
		this.domNode = node;
		dojo.dnd.dragManager.registerDragSource(this);
	},

	setDragTarget: function(node){
		this.dragObject = node;
	},

	constrainTo: function(container) {
		this.constrainToContainer = true;
		if (container) {
			this.constrainingContainer = container;
		}
	},
	
	/*
	*
	* see dojo.dnd.DragSource.onSelected
	*/
	onSelected: function() {
		for (var i=0; i<this.dragObjects.length; i++) {
			dojo.dnd.dragManager.selectedSources.push(new dojo.dnd.HtmlDragSource(this.dragObjects[i]));
		}
	},

	/**
	* Register elements that should be dragged along with
	* the actual DragSource.
	*
	* Example usage:
	* 	var dragSource = new dojo.dnd.HtmlDragSource(...);
	*	// add a single element
	*	dragSource.addDragObjects(dojo.byId('id1'));
	*	// add multiple elements to drag along
	*	dragSource.addDragObjects(dojo.byId('id2'), dojo.byId('id3'));
	*
	* el A dom node to add to the drag list.
	*/
	addDragObjects: function(/*DOMNode*/ el) {
		for (var i=0; i<arguments.length; i++) {
			this.dragObjects.push(arguments[i]);
		}
	}
});

dojo.dnd.HtmlDragObject = function(node, type){
	this.domNode = dojo.byId(node);
	this.type = type;
	this.constrainToContainer = false;
	this.dragSource = null;
}
dojo.inherits(dojo.dnd.HtmlDragObject, dojo.dnd.DragObject);
dojo.lang.extend(dojo.dnd.HtmlDragObject, {
	dragClass: "",
	opacity: 0.5,
	createIframe: true,		// workaround IE6 bug

	// if true, node will not move in X and/or Y direction
	disableX: false,
	disableY: false,

	createDragNode: function() {
		var node = this.domNode.cloneNode(true);
		if(this.dragClass) { dojo.html.addClass(node, this.dragClass); }
		if(this.opacity < 1) { dojo.style.setOpacity(node, this.opacity); }
		if(node.tagName.toLowerCase() == "tr"){
			// dojo.debug("Dragging table row")
			// Create a table for the cloned row
			var doc = this.domNode.ownerDocument;
			var table = doc.createElement("table");
			var tbody = doc.createElement("tbody");
			tbody.appendChild(node);
			table.appendChild(tbody);

			// Set a fixed width to the cloned TDs
			var domTds = this.domNode.childNodes;
			var cloneTds = node.childNodes;
			for(var i = 0; i < domTds.length; i++){
			    if((cloneTds[i])&&(cloneTds[i].style)){
				    cloneTds[i].style.width = dojo.style.getContentWidth(domTds[i]) + "px";
			    }
			}
			node = table;
		}

		if((dojo.render.html.ie55||dojo.render.html.ie60) && this.createIframe){
			with(node.style) {
				top="0px";
				left="0px";
			}
			var outer = document.createElement("div");
			outer.appendChild(node);
			this.bgIframe = new dojo.html.BackgroundIframe(outer);
			outer.appendChild(this.bgIframe.iframe);
			node = outer;
		}
		node.style.zIndex = 999;
		return node;
	},

	onDragStart: function(e){
		dojo.html.clearSelection();

		this.scrollOffset = dojo.html.getScrollOffset();
		this.dragStartPosition = dojo.style.getAbsolutePosition(this.domNode, true);

		this.dragOffset = {y: this.dragStartPosition.y - e.pageY,
			x: this.dragStartPosition.x - e.pageX};

		this.dragClone = this.createDragNode();

		this.containingBlockPosition = this.domNode.offsetParent ? 
			dojo.style.getAbsolutePosition(this.domNode.offsetParent) : {x:0, y:0};

		if (this.constrainToContainer) {
			this.constraints = this.getConstraints();
		}

		// set up for dragging
		with(this.dragClone.style){
			position = "absolute";
			top = this.dragOffset.y + e.pageY + "px";
			left = this.dragOffset.x + e.pageX + "px";
		}

		document.body.appendChild(this.dragClone);

		dojo.event.topic.publish('dragStart', { source: this } );
	},

	/** Return min/max x/y (relative to document.body) for this object) **/
	getConstraints: function() {
		if (this.constrainingContainer.nodeName.toLowerCase() == 'body') {
			var width = dojo.html.getViewportWidth();
			var height = dojo.html.getViewportHeight();
			var x = 0;
			var y = 0;
		} else {
			width = dojo.style.getContentWidth(this.constrainingContainer);
			height = dojo.style.getContentHeight(this.constrainingContainer);
			x =
				this.containingBlockPosition.x +
				dojo.style.getPixelValue(this.constrainingContainer, "padding-left", true) +
				dojo.style.getBorderExtent(this.constrainingContainer, "left");
			y =
				this.containingBlockPosition.y +
				dojo.style.getPixelValue(this.constrainingContainer, "padding-top", true) +
				dojo.style.getBorderExtent(this.constrainingContainer, "top");
		}

		return {
			minX: x,
			minY: y,
			maxX: x + width - dojo.style.getOuterWidth(this.domNode),
			maxY: y + height - dojo.style.getOuterHeight(this.domNode)
		}
	},

	updateDragOffset: function() {
		var scroll = dojo.html.getScrollOffset();
		if(scroll.y != this.scrollOffset.y) {
			var diff = scroll.y - this.scrollOffset.y;
			this.dragOffset.y += diff;
			this.scrollOffset.y = scroll.y;
		}
		if(scroll.x != this.scrollOffset.x) {
			var diff = scroll.x - this.scrollOffset.x;
			this.dragOffset.x += diff;
			this.scrollOffset.x = scroll.x;
		}
	},

	/** Moves the node to follow the mouse */
	onDragMove: function(e){
		this.updateDragOffset();
		var x = this.dragOffset.x + e.pageX;
		var y = this.dragOffset.y + e.pageY;

		if (this.constrainToContainer) {
			if (x < this.constraints.minX) { x = this.constraints.minX; }
			if (y < this.constraints.minY) { y = this.constraints.minY; }
			if (x > this.constraints.maxX) { x = this.constraints.maxX; }
			if (y > this.constraints.maxY) { y = this.constraints.maxY; }
		}

		this.setAbsolutePosition(x, y);

		dojo.event.topic.publish('dragMove', { source: this } );
	},

	/**
	 * Set the position of the drag clone.  (x,y) is relative to <body>.
	 */
	setAbsolutePosition: function(x, y){
		// The drag clone is attached to document.body so this is trivial
		if(!this.disableY) { this.dragClone.style.top = y + "px"; }
		if(!this.disableX) { this.dragClone.style.left = x + "px"; }
	},


	/**
	 * If the drag operation returned a success we reomve the clone of
	 * ourself from the original position. If the drag operation returned
	 * failure we slide back over to where we came from and end the operation
	 * with a little grace.
	 */
	onDragEnd: function(e){
		switch(e.dragStatus){

			case "dropSuccess":
				dojo.dom.removeNode(this.dragClone);
				this.dragClone = null;
				break;

			case "dropFailure": // slide back to the start
				var startCoords = dojo.style.getAbsolutePosition(this.dragClone, true);
				// offset the end so the effect can be seen
				var endCoords = [this.dragStartPosition.x + 1,
					this.dragStartPosition.y + 1];

				// animate
				var line = new dojo.lfx.Line(startCoords, endCoords);
				var anim = new dojo.lfx.Animation(500, line, dojo.lfx.easeOut);
				var dragObject = this;
				dojo.event.connect(anim, "onAnimate", function(e) {
					dragObject.dragClone.style.left = e[0] + "px";
					dragObject.dragClone.style.top = e[1] + "px";
				});
				dojo.event.connect(anim, "onEnd", function (e) {
					// pause for a second (not literally) and disappear
					dojo.lang.setTimeout(function() {
							dojo.dom.removeNode(dragObject.dragClone);
							// Allow drag clone to be gc'ed
							dragObject.dragClone = null;
						},
						200);
				});
				anim.play();
				break;
		}

		// shortly the browser will fire an onClick() event,
		// but since this was really a drag, just squelch it
		dojo.event.connect(this.domNode, "onclick", this, "squelchOnClick");

		dojo.event.topic.publish('dragEnd', { source: this } );
	},

	squelchOnClick: function(e){
		// squelch this onClick() event because it's the result of a drag (it's not a real click)
		e.preventDefault();

		// but if a real click comes along, allow it
		dojo.event.disconnect(this.domNode, "onclick", this, "squelchOnClick");
	},

	constrainTo: function(container) {
		this.constrainToContainer=true;
		if (container) {
			this.constrainingContainer = container;
		} else {
			this.constrainingContainer = this.domNode.parentNode;
		}
	}
});

dojo.dnd.HtmlDropTarget = function(node, types){
	if (arguments.length == 0) { return; }
	this.domNode = dojo.byId(node);
	dojo.dnd.DropTarget.call(this);
	if(types && dojo.lang.isString(types)) {
		types = [types];
	}
	this.acceptedTypes = types || [];
}
dojo.inherits(dojo.dnd.HtmlDropTarget, dojo.dnd.DropTarget);

dojo.lang.extend(dojo.dnd.HtmlDropTarget, {
	onDragOver: function(e){
		if(!this.accepts(e.dragObjects)){ return false; }

		// cache the positions of the child nodes
		this.childBoxes = [];
		for (var i = 0, child; i < this.domNode.childNodes.length; i++) {
			child = this.domNode.childNodes[i];
			if (child.nodeType != dojo.dom.ELEMENT_NODE) { continue; }
			var pos = dojo.style.getAbsolutePosition(child, true);
			var height = dojo.style.getInnerHeight(child);
			var width = dojo.style.getInnerWidth(child);
			this.childBoxes.push({top: pos.y, bottom: pos.y+height,
				left: pos.x, right: pos.x+width, node: child});
		}

		// TODO: use dummy node

		return true;
	},

	_getNodeUnderMouse: function(e){
		// find the child
		for (var i = 0, child; i < this.childBoxes.length; i++) {
			with (this.childBoxes[i]) {
				if (e.pageX >= left && e.pageX <= right &&
					e.pageY >= top && e.pageY <= bottom) { return i; }
			}
		}

		return -1;
	},

	createDropIndicator: function() {
		this.dropIndicator = document.createElement("div");
		with (this.dropIndicator.style) {
			position = "absolute";
			zIndex = 999;
			borderTopWidth = "1px";
			borderTopColor = "black";
			borderTopStyle = "solid";
			width = dojo.style.getInnerWidth(this.domNode) + "px";
			left = dojo.style.getAbsoluteX(this.domNode, true) + "px";
		}
	},

	onDragMove: function(e, dragObjects){
		var i = this._getNodeUnderMouse(e);

		if(!this.dropIndicator){
			this.createDropIndicator();
		}

		if(i < 0) {
			if(this.childBoxes.length) {
				var before = (dojo.html.gravity(this.childBoxes[0].node, e) & dojo.html.gravity.NORTH);
			} else {
				var before = true;
			}
		} else {
			var child = this.childBoxes[i];
			var before = (dojo.html.gravity(child.node, e) & dojo.html.gravity.NORTH);
		}
		this.placeIndicator(e, dragObjects, i, before);

		if(!dojo.html.hasParent(this.dropIndicator)) {
			document.body.appendChild(this.dropIndicator);
		}
	},

	/**
	 * Position the horizontal line that indicates "insert between these two items"
	 */
	placeIndicator: function(e, dragObjects, boxIndex, before) {
		with(this.dropIndicator.style){
			if (boxIndex < 0) {
				if (this.childBoxes.length) {
					top = (before ? this.childBoxes[0].top
						: this.childBoxes[this.childBoxes.length - 1].bottom) + "px";
				} else {
					top = dojo.style.getAbsoluteY(this.domNode, true) + "px";
				}
			} else {
				var child = this.childBoxes[boxIndex];
				top = (before ? child.top : child.bottom) + "px";
			}
		}
	},

	onDragOut: function(e) {
		if(this.dropIndicator) {
			dojo.dom.removeNode(this.dropIndicator);
			delete this.dropIndicator;
		}
	},

	/**
	 * Inserts the DragObject as a child of this node relative to the
	 * position of the mouse.
	 *
	 * @return true if the DragObject was inserted, false otherwise
	 */
	onDrop: function(e){
		this.onDragOut(e);

		var i = this._getNodeUnderMouse(e);

		if (i < 0) {
			if (this.childBoxes.length) {
				if (dojo.html.gravity(this.childBoxes[0].node, e) & dojo.html.gravity.NORTH) {
					return this.insert(e, this.childBoxes[0].node, "before");
				} else {
					return this.insert(e, this.childBoxes[this.childBoxes.length-1].node, "after");
				}
			}
			return this.insert(e, this.domNode, "append");
		}

		var child = this.childBoxes[i];
		if (dojo.html.gravity(child.node, e) & dojo.html.gravity.NORTH) {
			return this.insert(e, child.node, "before");
		} else {
			return this.insert(e, child.node, "after");
		}
	},

	insert: function(e, refNode, position) {
		var node = e.dragObject.domNode;

		if(position == "before") {
			return dojo.html.insertBefore(node, refNode);
		} else if(position == "after") {
			return dojo.html.insertAfter(node, refNode);
		} else if(position == "append") {
			refNode.appendChild(node);
			return true;
		}

		return false;
	}
});

dojo.kwCompoundRequire({
	common: ["dojo.dnd.DragAndDrop"],
	browser: ["dojo.dnd.HtmlDragAndDrop"],
	dashboard: ["dojo.dnd.HtmlDragAndDrop"]
});
dojo.provide("dojo.dnd.*");

dojo.provide("dojo.lang.declare");

dojo.require("dojo.lang.common");
dojo.require("dojo.lang.extras");

/*
 * Creates a constructor: inherit and extend
 *
 * - inherits from "superclass(es)" 
 *
 *   "superclass" argument may be a Function, or an array of 
 *   Functions. 
 *
 *   If "superclass" is an array, the first element is used 
 *   as the prototypical ancestor and any following Functions 
 *   become mixin ancestors. 
 * 
 *   All "superclass(es)" must be Functions (not mere Objects).
 *
 *   Using mixin ancestors provides a type of multiple
 *   inheritance. Mixin ancestors prototypical 
 *   properties are copied to the subclass, and any 
 *   inializater/constructor is invoked. 
 *
 * - "props" are copied to the constructor prototype
 *
 * - name of the class ("className" argument) is stored in 
 *   "declaredClass" property
 * 
 * - An initializer function can be specified in the "init" 
 *   argument, or by including a function called "initializer" 
 *   in "props".
 * 
 * - Superclass methods (inherited methods) can be invoked using "inherited" method:
 *
 * this.inherited(<method name>[, <argument array>]);
 * 
 * - inherited will continue up the prototype chain until it finds an implementation of method
 * - nested calls to inherited are supported (i.e. inherited method "A" can succesfully call inherited("A"), and so on)
 *
 * Aliased as "dojo.declare"
 *
 * Usage:
 *
 * dojo.declare("my.classes.bar", my.classes.foo, {
 *	initializer: function() {
 *		this.myComplicatedObject = new ReallyComplicatedObject(); 
 *	},
 *	someValue: 2,
 *	aMethod: function() { doStuff(); }
 * });
 *
 */
dojo.lang.declare = function(className /*string*/, superclass /*function || array*/, init /*function*/, props /*object*/){
	// FIXME: parameter juggling for backward compat ... deprecate and remove after 0.3.*
	// new sig: (className (string)[, superclass (function || array)[, init (function)][, props (object)]])
	// old sig: (className (string)[, superclass (function || array), props (object), init (function)])
	if ((dojo.lang.isFunction(props))||((!props)&&(!dojo.lang.isFunction(init)))){ 
		var temp = props;
		props = init;
		init = temp;
	}	
	var mixins = [ ];
	if (dojo.lang.isArray(superclass)) {
		mixins = superclass;
		superclass = mixins.shift();
	}
	if(!init){
		init = dojo.evalObjPath(className, false);
		if ((init)&&(!dojo.lang.isFunction(init))){ init = null };
	}
	var ctor = dojo.lang.declare._makeConstructor();
	var scp = (superclass ? superclass.prototype : null);
	if(scp){
		scp.prototyping = true;
		ctor.prototype = new superclass();
		scp.prototyping = false; 
	}
	ctor.superclass = scp;
	ctor.mixins = mixins;
	for(var i=0,l=mixins.length; i<l; i++){
		dojo.lang.extend(ctor, mixins[i].prototype);
	}
	ctor.prototype.initializer = null;
	ctor.prototype.declaredClass = className;
	if(dojo.lang.isArray(props)){
		dojo.lang.extend.apply(dojo.lang, [ctor].concat(props));
	}else{
		dojo.lang.extend(ctor, (props)||{});
	}
	dojo.lang.extend(ctor, dojo.lang.declare.base);
	ctor.prototype.constructor = ctor;
	ctor.prototype.initializer=(ctor.prototype.initializer)||(init)||(function(){});
	dojo.lang.setObjPathValue(className, ctor, null, true);
}

dojo.lang.declare._makeConstructor = function() {
	return function(){ 
		// get the generational context (which object [or prototype] should be constructed)
		var self = this._getPropContext();
		var s = self.constructor.superclass;
		if((s)&&(s.constructor)){
			if(s.constructor==arguments.callee){
				// if this constructor is invoked directly (my.ancestor.call(this))
				this.inherited("constructor", arguments);
			}else{
				this._inherited(s, "constructor", arguments);
			}
		}
		var m = (self.constructor.mixins)||([]);
		for(var i=0,l=m.length; i<l; i++) {
			(((m[i].prototype)&&(m[i].prototype.initializer))||(m[i])).apply(this, arguments);
		}
		if((!this.prototyping)&&(self.initializer)){
			self.initializer.apply(this, arguments);
		}
	}
}

dojo.lang.declare.base = {
	_getPropContext: function() { return (this.___proto||this); },
	// caches ptype context and calls method on it
	_inherited: function(ptype, method, args){
		var stack = this.___proto;
		this.___proto = ptype;
		var result = ptype[method].apply(this,(args||[]));
		this.___proto = stack;
		return result;
	},
	// invokes ctor.prototype.method, with args, in our context 
	inheritedFrom: function(ctor, prop, args){
		var p = ((ctor)&&(ctor.prototype)&&(ctor.prototype[prop]));
		return (dojo.lang.isFunction(p) ? p.apply(this, (args||[])) : p);
	},
	// searches backward thru prototype chain to find nearest ancestral instance of prop
	inherited: function(prop, args){
		var p = this._getPropContext();
		do{
			if((!p.constructor)||(!p.constructor.superclass)){return;}
			p = p.constructor.superclass;
		}while(!(prop in p));
		return (dojo.lang.isFunction(p[prop]) ? this._inherited(p, prop, args) : p[prop]);
	}
}

dojo.declare = dojo.lang.declare;
dojo.provide("dojo.widget.Manager");
dojo.require("dojo.lang.array");
dojo.require("dojo.lang.func");
dojo.require("dojo.event.*");

// Manager class
dojo.widget.manager = new function(){
	this.widgets = [];
	this.widgetIds = [];
	
	// map of widgetId-->widget for widgets without parents (top level widgets)
	this.topWidgets = {};

	var widgetTypeCtr = {};
	var renderPrefixCache = [];

	this.getUniqueId = function (widgetType) {
		return widgetType + "_" + (widgetTypeCtr[widgetType] != undefined ?
			++widgetTypeCtr[widgetType] : widgetTypeCtr[widgetType] = 0);
	}

	this.add = function(widget){
		dojo.profile.start("dojo.widget.manager.add");
		this.widgets.push(widget);
		// Opera9 uses ID (caps)
		if(!widget.extraArgs["id"]){
			widget.extraArgs["id"] = widget.extraArgs["ID"];
		}
		// FIXME: the rest of this method is very slow!
		if(widget.widgetId == ""){
			if(widget["id"]){
				widget.widgetId = widget["id"];
			}else if(widget.extraArgs["id"]){
				widget.widgetId = widget.extraArgs["id"];
			}else{
				widget.widgetId = this.getUniqueId(widget.widgetType);
			}
		}
		if(this.widgetIds[widget.widgetId]){
			dojo.debug("widget ID collision on ID: "+widget.widgetId);
		}
		this.widgetIds[widget.widgetId] = widget;
		// Widget.destroy already calls removeById(), so we don't need to
		// connect() it here
		dojo.profile.end("dojo.widget.manager.add");
	}

	this.destroyAll = function(){
		for(var x=this.widgets.length-1; x>=0; x--){
			try{
				// this.widgets[x].destroyChildren();
				this.widgets[x].destroy(true);
				delete this.widgets[x];
			}catch(e){ }
		}
	}

	// FIXME: we should never allow removal of the root widget until all others
	// are removed!
	this.remove = function(widgetIndex){
		var tw = this.widgets[widgetIndex].widgetId;
		delete this.widgetIds[tw];
		this.widgets.splice(widgetIndex, 1);
	}
	
	// FIXME: suboptimal performance
	this.removeById = function(id) {
		for (var i=0; i<this.widgets.length; i++){
			if(this.widgets[i].widgetId == id){
				this.remove(i);
				break;
			}
		}
	}

	this.getWidgetById = function(id){
		return this.widgetIds[id];
	}

	this.getWidgetsByType = function(type){
		var lt = type.toLowerCase();
		var ret = [];
		dojo.lang.forEach(this.widgets, function(x){
			if(x.widgetType.toLowerCase() == lt){
				ret.push(x);
			}
		});
		return ret;
	}

	this.getWidgetsOfType = function (id) {
		dojo.deprecated("getWidgetsOfType", "use getWidgetsByType", "0.4");
		return dojo.widget.manager.getWidgetsByType(id);
	}

	this.getWidgetsByFilter = function(unaryFunc, onlyOne){
		var ret = [];
		dojo.lang.every(this.widgets, function(x){
			if(unaryFunc(x)){
				ret.push(x);
				if(onlyOne){return false;}
			}
			return true;
		});
		return (onlyOne ? ret[0] : ret);
	}

	this.getAllWidgets = function() {
		return this.widgets.concat();
	}

	//	added, trt 2006-01-20
	this.getWidgetByNode = function(/* DOMNode */ node){
		var w=this.getAllWidgets();
		for (var i=0; i<w.length; i++){
			if (w[i].domNode==node){
				return w[i];
			}
		}
		return null;
	}

	// shortcuts, baby
	this.byId = this.getWidgetById;
	this.byType = this.getWidgetsByType;
	this.byFilter = this.getWidgetsByFilter;
	this.byNode = this.getWidgetByNode;

	// map of previousally discovered implementation names to constructors
	var knownWidgetImplementations = {};

	// support manually registered widget packages
	var widgetPackages = ["dojo.widget"];
	for (var i=0; i<widgetPackages.length; i++) {
		// convenience for checking if a package exists (reverse lookup)
		widgetPackages[widgetPackages[i]] = true;
	}

	this.registerWidgetPackage = function(pname) {
		if(!widgetPackages[pname]){
			widgetPackages[pname] = true;
			widgetPackages.push(pname);
		}
	}
	
	this.getWidgetPackageList = function() {
		return dojo.lang.map(widgetPackages, function(elt) { return(elt!==true ? elt : undefined); });
	}
	
	this.getImplementation = function(widgetName, ctorObject, mixins){
		// try and find a name for the widget
		var impl = this.getImplementationName(widgetName);
		if(impl){ 
			// var tic = new Date();
			var ret = new impl(ctorObject);
			// dojo.debug(new Date() - tic);
			return ret;
		}
	}

	this.getImplementationName = function(widgetName){
		/*
		 * This is the overly-simplistic implemention of getImplementation (har
		 * har). In the future, we are going to want something that allows more
		 * freedom of expression WRT to specifying different specializations of
		 * a widget.
		 *
		 * Additionally, this implementation treats widget names as case
		 * insensitive, which does not necessarialy mesh with the markup which
		 * can construct a widget.
		 */

		var lowerCaseWidgetName = widgetName.toLowerCase();

		var impl = knownWidgetImplementations[lowerCaseWidgetName];
		if(impl){
			return impl;
		}

		// first store a list of the render prefixes we are capable of rendering
		if(!renderPrefixCache.length){
			for(var renderer in dojo.render){
				if(dojo.render[renderer]["capable"] === true){
					var prefixes = dojo.render[renderer].prefixes;
					for(var i = 0; i < prefixes.length; i++){
						renderPrefixCache.push(prefixes[i].toLowerCase());
					}
				}
			}
			// make sure we don't HAVE to prefix widget implementation names
			// with anything to get them to render
			renderPrefixCache.push("");
		}

		// look for a rendering-context specific version of our widget name
		for(var i = 0; i < widgetPackages.length; i++){
			var widgetPackage = dojo.evalObjPath(widgetPackages[i]);
			if(!widgetPackage) { continue; }

			for (var j = 0; j < renderPrefixCache.length; j++) {
				if (!widgetPackage[renderPrefixCache[j]]) { continue; }
				for (var widgetClass in widgetPackage[renderPrefixCache[j]]) {
					if (widgetClass.toLowerCase() != lowerCaseWidgetName) { continue; }
					knownWidgetImplementations[lowerCaseWidgetName] =
						widgetPackage[renderPrefixCache[j]][widgetClass];
					return knownWidgetImplementations[lowerCaseWidgetName];
				}
			}

			for (var j = 0; j < renderPrefixCache.length; j++) {
				for (var widgetClass in widgetPackage) {
					if (widgetClass.toLowerCase() !=
						(renderPrefixCache[j] + lowerCaseWidgetName)) { continue; }
	
					knownWidgetImplementations[lowerCaseWidgetName] =
						widgetPackage[widgetClass];
					return knownWidgetImplementations[lowerCaseWidgetName];
				}
			}
		}
		
		throw new Error('Could not locate "' + widgetName + '" class');
	}

	// FIXME: does it even belong in this name space?
	// NOTE: this method is implemented by DomWidget.js since not all
	// hostenv's would have an implementation.
	/*this.getWidgetFromPrimitive = function(baseRenderType){
		dojo.unimplemented("dojo.widget.manager.getWidgetFromPrimitive");
	}

	this.getWidgetFromEvent = function(nativeEvt){
		dojo.unimplemented("dojo.widget.manager.getWidgetFromEvent");
	}*/

	// Catch window resize events and notify top level widgets
	this.resizing=false;
	this.onWindowResized = function(){
		if(this.resizing){
			return;	// duplicate event
		}
		try{
			this.resizing=true;
			for(var id in this.topWidgets){
				var child = this.topWidgets[id];
				if(child.checkSize ){
					child.checkSize();
				}
			};
		}catch(e){
		}finally{
			this.resizing=false;
		}
	}
	if(typeof window != "undefined") {
		dojo.addOnLoad(this, 'onWindowResized');							// initial sizing
		dojo.event.connect(window, 'onresize', this, 'onWindowResized');	// window resize
	}

	// FIXME: what else?
};

(function(){
	var dw = dojo.widget;
	var dwm = dw.manager;
	var h = dojo.lang.curry(dojo.lang, "hitch", dwm);
	var g = function(oldName, newName){
		dw[(newName||oldName)] = h(oldName);
	}
	// copy the methods from the default manager (this) to the widget namespace
	g("add", "addWidget");
	g("destroyAll", "destroyAllWidgets");
	g("remove", "removeWidget");
	g("removeById", "removeWidgetById");
	g("getWidgetById");
	g("getWidgetById", "byId");
	g("getWidgetsByType");
	g("getWidgetsByFilter");
	g("getWidgetsByType", "byType");
	g("getWidgetsByFilter", "byFilter");
	g("getWidgetByNode", "byNode");
	dw.all = function(n){
		var widgets = dwm.getAllWidgets.apply(dwm, arguments);
		if(arguments.length > 0) {
			return widgets[n];
		}
		return widgets;
	}
	g("registerWidgetPackage");
	g("getImplementation", "getWidgetImplementation");
	g("getImplementationName", "getWidgetImplementationName");

	dw.widgets = dwm.widgets;
	dw.widgetIds = dwm.widgetIds;
	dw.root = dwm.root;
})();

dojo.provide("dojo.widget.Widget");
dojo.provide("dojo.widget.tags");

dojo.require("dojo.lang.func");
dojo.require("dojo.lang.array");
dojo.require("dojo.lang.extras");
dojo.require("dojo.lang.declare");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.event.*");

dojo.declare("dojo.widget.Widget", null, {
	initializer: function() {								 
		// these properties aren't primitives and need to be created on a per-item
		// basis.
		this.children = [];
		// this.selection = new dojo.widget.Selection();
		// FIXME: need to replace this with context menu stuff
		this.extraArgs = {};
	},
	// FIXME: need to be able to disambiguate what our rendering context is
	//        here!
	//
	// needs to be a string with the end classname. Every subclass MUST
	// over-ride.
	//
	// base widget properties
	parent: null,
	// obviously, top-level and modal widgets should set these appropriately
	isTopLevel:  false,
	isModal: false,

	isEnabled: true,
	isHidden: false,
	isContainer: false, // can we contain other widgets?
	widgetId: "",
	widgetType: "Widget", // used for building generic widgets

	toString: function() {
		return '[Widget ' + this.widgetType + ', ' + (this.widgetId || 'NO ID') + ']';
	},

	repr: function(){
		return this.toString();
	},

	enable: function(){
		// should be over-ridden
		this.isEnabled = true;
	},

	disable: function(){
		// should be over-ridden
		this.isEnabled = false;
	},

	hide: function(){
		// should be over-ridden
		this.isHidden = true;
	},

	show: function(){
		// should be over-ridden
		this.isHidden = false;
	},

	onResized: function(){
		// Clients should override this function to do special processing,
		// then call this.notifyChildrenOfResize() to notify children of resize
		this.notifyChildrenOfResize();
	},
	
	notifyChildrenOfResize: function(){
		for(var i=0; i<this.children.length; i++){
			var child = this.children[i];
			//dojo.debug(this.widgetId + " resizing child " + child.widgetId);
			if( child.onResized ){
				child.onResized();
			}
		}
	},

	create: function(args, fragment, parentComp){
		// dojo.debug(this.widgetType, "create");
		this.satisfyPropertySets(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> mixInProperties");
		this.mixInProperties(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> postMixInProperties");
		this.postMixInProperties(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> dojo.widget.manager.add");
		dojo.widget.manager.add(this);
		// dojo.debug(this.widgetType, "-> buildRendering");
		this.buildRendering(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> initialize");
		this.initialize(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> postInitialize");
		this.postInitialize(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> postCreate");
		this.postCreate(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "done!");
		return this;
	},

	// Destroy this widget and it's descendants
	destroy: function(finalize){
		// FIXME: this is woefully incomplete
		this.destroyChildren();
		this.uninitialize();
		this.destroyRendering(finalize);
		dojo.widget.manager.removeById(this.widgetId);
	},

	// Destroy the children of this widget, and their descendents
	destroyChildren: function(){
		while(this.children.length > 0){
			var tc = this.children[0];
			this.removeChild(tc);
			tc.destroy();
		}
	},

	getChildrenOfType: function(type, recurse){
		var ret = [];
		var isFunc = dojo.lang.isFunction(type);
		if(!isFunc){
			type = type.toLowerCase();
		}
		for(var x=0; x<this.children.length; x++){
			if(isFunc){
				if(this.children[x] instanceof type){
					ret.push(this.children[x]);
				}
			}else{
				if(this.children[x].widgetType.toLowerCase() == type){
					ret.push(this.children[x]);
				}
			}
			if(recurse){
				ret = ret.concat(this.children[x].getChildrenOfType(type, recurse));
			}
		}
		return ret;
	},

	getDescendants: function(){
		var result = [];
		var stack = [this];
		var elem;
		while (elem = stack.pop()){
			result.push(elem);
			dojo.lang.forEach(elem.children, function(elem) { stack.push(elem); });
		}
		return result;
	},

	satisfyPropertySets: function(args){
		// dojo.profile.start("satisfyPropertySets");
		// get the default propsets for our component type
		/*
		var typePropSets = []; // FIXME: need to pull these from somewhere!
		var localPropSets = []; // pull out propsets from the parser's return structure

		// for(var x=0; x<args.length; x++){
		// }

		for(var x=0; x<typePropSets.length; x++){
		}

		for(var x=0; x<localPropSets.length; x++){
		}
		*/
		// dojo.profile.end("satisfyPropertySets");
		
		return args;
	},

	mixInProperties: function(args, frag){
		if((args["fastMixIn"])||(frag["fastMixIn"])){
			// dojo.profile.start("mixInProperties_fastMixIn");
			// fast mix in assumes case sensitivity, no type casting, etc...
			// dojo.lang.mixin(this, args);
			for(var x in args){
				this[x] = args[x];
			}
			// dojo.profile.end("mixInProperties_fastMixIn");
			return;
		}
		// dojo.profile.start("mixInProperties");
		/*
		 * the actual mix-in code attempts to do some type-assignment based on
		 * PRE-EXISTING properties of the "this" object. When a named property
		 * of a propset is located, it is first tested to make sure that the
		 * current object already "has one". Properties which are undefined in
		 * the base widget are NOT settable here. The next step is to try to
		 * determine type of the pre-existing property. If it's a string, the
		 * property value is simply assigned. If a function, the property is
		 * replaced with a "new Function()" declaration. If an Array, the
		 * system attempts to split the string value on ";" chars, and no
		 * further processing is attempted (conversion of array elements to a
		 * integers, for instance). If the property value is an Object
		 * (testObj.constructor === Object), the property is split first on ";"
		 * chars, secondly on ":" chars, and the resulting key/value pairs are
		 * assigned to an object in a map style. The onus is on the property
		 * user to ensure that all property values are converted to the
		 * expected type before usage.
		 */

		var undef;

		// NOTE: we cannot assume that the passed properties are case-correct
		// (esp due to some browser bugs). Therefore, we attempt to locate
		// properties for assignment regardless of case. This may cause
		// problematic assignments and bugs in the future and will need to be
		// documented with big bright neon lights.

		// FIXME: fails miserably if a mixin property has a default value of null in 
		// a widget

		// NOTE: caching lower-cased args in the prototype is only 
		// acceptable if the properties are invariant.
		// if we have a name-cache, get it
		var lcArgs = dojo.widget.lcArgsCache[this.widgetType];
		if ( lcArgs == null ){
			// build a lower-case property name cache if we don't have one
			lcArgs = {};
			for(var y in this){
				lcArgs[((new String(y)).toLowerCase())] = y;
			}
			dojo.widget.lcArgsCache[this.widgetType] = lcArgs;
		}
		var visited = {};
		for(var x in args){
			if(!this[x]){ // check the cache for properties
				var y = lcArgs[(new String(x)).toLowerCase()];
				if(y){
					args[y] = args[x];
					x = y; 
				}
			}
			if(visited[x]){ continue; }
			visited[x] = true;
			if((typeof this[x]) != (typeof undef)){
				if(typeof args[x] != "string"){
					this[x] = args[x];
				}else{
					if(dojo.lang.isString(this[x])){
						this[x] = args[x];
					}else if(dojo.lang.isNumber(this[x])){
						this[x] = new Number(args[x]); // FIXME: what if NaN is the result?
					}else if(dojo.lang.isBoolean(this[x])){
						this[x] = (args[x].toLowerCase()=="false") ? false : true;
					}else if(dojo.lang.isFunction(this[x])){

						// FIXME: need to determine if always over-writing instead
						// of attaching here is appropriate. I suspect that we
						// might want to only allow attaching w/ action items.
						
						// RAR, 1/19/05: I'm going to attach instead of
						// over-write here. Perhaps function objects could have
						// some sort of flag set on them? Or mixed-into objects
						// could have some list of non-mutable properties
						// (although I'm not sure how that would alleviate this
						// particular problem)? 

						// this[x] = new Function(args[x]);

						// after an IRC discussion last week, it was decided
						// that these event handlers should execute in the
						// context of the widget, so that the "this" pointer
						// takes correctly.
						
						// argument that contains no punctuation other than . is 
						// considered a function spec, not code
						if(args[x].search(/[^\w\.]+/i) == -1){
							this[x] = dojo.evalObjPath(args[x], false);
						}else{
							var tn = dojo.lang.nameAnonFunc(new Function(args[x]), this);
							dojo.event.connect(this, x, this, tn);
						}
					}else if(dojo.lang.isArray(this[x])){ // typeof [] == "object"
						this[x] = args[x].split(";");
					} else if (this[x] instanceof Date) {
						this[x] = new Date(Number(args[x])); // assume timestamp
					}else if(typeof this[x] == "object"){ 
						// FIXME: should we be allowing extension here to handle
						// other object types intelligently?

						// if we defined a URI, we probablt want to allow plain strings
						// to override it
						if (this[x] instanceof dojo.uri.Uri){

							this[x] = args[x];
						}else{

							// FIXME: unlike all other types, we do not replace the
							// object with a new one here. Should we change that?
							var pairs = args[x].split(";");
							for(var y=0; y<pairs.length; y++){
								var si = pairs[y].indexOf(":");
								if((si != -1)&&(pairs[y].length>si)){
									this[x][pairs[y].substr(0, si).replace(/^\s+|\s+$/g, "")] = pairs[y].substr(si+1);
								}
							}
						}
					}else{
						// the default is straight-up string assignment. When would
						// we ever hit this?
						this[x] = args[x];
					}
				}
			}else{
				// collect any extra 'non mixed in' args
				this.extraArgs[x.toLowerCase()] = args[x];
			}
		}
		// dojo.profile.end("mixInProperties");
	},
	
	postMixInProperties: function(){
	},

	initialize: function(args, frag){
		// dojo.unimplemented("dojo.widget.Widget.initialize");
		return false;
	},

	postInitialize: function(args, frag){
		return false;
	},

	postCreate: function(args, frag){
		return false;
	},

	uninitialize: function(){
		// dojo.unimplemented("dojo.widget.Widget.uninitialize");
		return false;
	},

	buildRendering: function(){
		// SUBCLASSES MUST IMPLEMENT
		dojo.unimplemented("dojo.widget.Widget.buildRendering, on "+this.toString()+", ");
		return false;
	},

	destroyRendering: function(){
		// SUBCLASSES MUST IMPLEMENT
		dojo.unimplemented("dojo.widget.Widget.destroyRendering");
		return false;
	},

	cleanUp: function(){
		// SUBCLASSES MUST IMPLEMENT
		dojo.unimplemented("dojo.widget.Widget.cleanUp");
		return false;
	},

	addedTo: function(parent){
		// this is just a signal that can be caught
	},

	addChild: function(child){
		// SUBCLASSES MUST IMPLEMENT
		dojo.unimplemented("dojo.widget.Widget.addChild");
		return false;
	},

	// Detach the given child widget from me, but don't destroy it
	removeChild: function(widget){
		for(var x=0; x<this.children.length; x++){
			if(this.children[x] === widget){
				this.children.splice(x, 1);
				break;
			}
		}
		return widget;
	},

	resize: function(width, height){
		// both width and height may be set as percentages. The setWidth and
		// setHeight  functions attempt to determine if the passed param is
		// specified in percentage or native units. Integers without a
		// measurement are assumed to be in the native unit of measure.
		this.setWidth(width);
		this.setHeight(height);
	},

	setWidth: function(width){
		if((typeof width == "string")&&(width.substr(-1) == "%")){
			this.setPercentageWidth(width);
		}else{
			this.setNativeWidth(width);
		}
	},

	setHeight: function(height){
		if((typeof height == "string")&&(height.substr(-1) == "%")){
			this.setPercentageHeight(height);
		}else{
			this.setNativeHeight(height);
		}
	},

	setPercentageHeight: function(height){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	setNativeHeight: function(height){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	setPercentageWidth: function(width){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	setNativeWidth: function(width){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	getPreviousSibling: function() {
		var idx = this.getParentIndex();
 
		 // first node is idx=0 not found is idx<0
		if (idx<=0) return null;
 
		return this.getSiblings()[idx-1];
	},
 
	getSiblings: function() {
		return this.parent.children;
	},
 
	getParentIndex: function() {
		return dojo.lang.indexOf( this.getSiblings(), this, true);
	},
 
	getNextSibling: function() {
 
		var idx = this.getParentIndex();
 
		if (idx == this.getSiblings().length-1) return null; // last node
		if (idx < 0) return null; // not found
 
		return this.getSiblings()[idx+1];
 
	}
});

// Lower case name cache: listing of the lower case elements in each widget.
// We can't store the lcArgs in the widget itself because if B subclasses A,
// then B.prototype.lcArgs might return A.prototype.lcArgs, which is not what we
// want
dojo.widget.lcArgsCache = {};

// TODO: should have a more general way to add tags or tag libraries?
// TODO: need a default tags class to inherit from for things like getting propertySets
// TODO: parse properties/propertySets into component attributes
// TODO: parse subcomponents
// TODO: copy/clone raw markup fragments/nodes as appropriate
dojo.widget.tags = {};
dojo.widget.tags.addParseTreeHandler = function(type){
	var ltype = type.toLowerCase();
	this[ltype] = function(fragment, widgetParser, parentComp, insertionIndex, localProps){ 
		return dojo.widget.buildWidgetFromParseTree(ltype, fragment, widgetParser, parentComp, insertionIndex, localProps);
	}
}
dojo.widget.tags.addParseTreeHandler("dojo:widget");

dojo.widget.tags["dojo:propertyset"] = function(fragment, widgetParser, parentComp){
	// FIXME: Is this needed?
	// FIXME: Not sure that this parses into the structure that I want it to parse into...
	// FIXME: add support for nested propertySets
	var properties = widgetParser.parseProperties(fragment["dojo:propertyset"]);
}

// FIXME: need to add the <dojo:connect />
dojo.widget.tags["dojo:connect"] = function(fragment, widgetParser, parentComp){
	var properties = widgetParser.parseProperties(fragment["dojo:connect"]);
}

// FIXME: if we know the insertion point (to a reasonable location), why then do we:
//	- create a template node
//	- clone the template node
//	- render the clone and set properties
//	- remove the clone from the render tree
//	- place the clone
// this is quite dumb
dojo.widget.buildWidgetFromParseTree = function(type, frag, 
												parser, parentComp, 
												insertionIndex, localProps){
	var stype = type.split(":");
	stype = (stype.length == 2) ? stype[1] : type;
	// FIXME: we don't seem to be doing anything with this!
	// var propertySets = parser.getPropertySets(frag);
	var localProperties = localProps || parser.parseProperties(frag["dojo:"+stype]);
	// var tic = new Date();
	var twidget = dojo.widget.manager.getImplementation(stype);
	if(!twidget){
		throw new Error("cannot find \"" + stype + "\" widget");
	}else if (!twidget.create){
		throw new Error("\"" + stype + "\" widget object does not appear to implement *Widget");
	}
	localProperties["dojoinsertionindex"] = insertionIndex;
	// FIXME: we loose no less than 5ms in construction!
	var ret = twidget.create(localProperties, frag, parentComp);
	// dojo.debug(new Date() - tic);
	return ret;
}

/*
 * Create a widget constructor function (aka widgetClass)
 */
dojo.widget.defineWidget = function(widgetClass /*string*/, renderer /*string*/, superclasses /*function||array*/, init /*function*/, props /*object*/){
	// This meta-function does parameter juggling for backward compat and overloading
	// if 4th argument is a string, we are using the old syntax
	// old sig: widgetClass, superclasses, props (object), renderer (string), init (function)
	if(dojo.lang.isString(arguments[3])){
		dojo.widget._defineWidget(arguments[0], arguments[3], arguments[1], arguments[4], arguments[2]);
	}else{
		// widgetClass
		var args = [ arguments[0] ], p = 3;
		if(dojo.lang.isString(arguments[1])){
			// renderer, superclass
			args.push(arguments[1], arguments[2]);
		}else{
			// superclass
			args.push('', arguments[1]);
			p = 2;
		}
		if(dojo.lang.isFunction(arguments[p])){
			// init (function), props (object) 
			args.push(arguments[p], arguments[p+1]);
		}else{
			// props (object) 
			args.push(null, arguments[p]);
		}
		dojo.widget._defineWidget.apply(this, args);
	}
}

dojo.widget.defineWidget.renderers = "html|svg|vml";

dojo.widget._defineWidget = function(widgetClass /*string*/, renderer /*string*/, superclasses /*function||array*/, init /*function*/, props /*object*/){
	// FIXME: uncomment next line to test parameter juggling ... remove when confidence improves
	//dojo.debug('(c:)' + widgetClass + '\n\n(r:)' + renderer + '\n\n(i:)' + init + '\n\n(p:)' + props);
	// widgetClass takes the form foo.bar.baz<.renderer>.WidgetName (e.g. foo.bar.baz.WidgetName or foo.bar.baz.html.WidgetName)
	var namespace = widgetClass.split(".");
	var type = namespace.pop(); // type <= WidgetName, namespace <= foo.bar.baz<.renderer>
	var regx = "\\.(" + (renderer ? renderer + '|' : '') + dojo.widget.defineWidget.renderers + ")\\.";
	var r = widgetClass.search(new RegExp(regx));
	namespace = (r < 0 ? namespace.join(".") : widgetClass.substr(0, r));

	dojo.widget.manager.registerWidgetPackage(namespace);
	dojo.widget.tags.addParseTreeHandler("dojo:"+type.toLowerCase());

	props=(props)||{};
	props.widgetType = type;
	if((!init)&&(props["classConstructor"])){
		init = props.classConstructor;
		delete props.classConstructor;
	}
	dojo.declare(widgetClass, superclasses, init, props);
}
dojo.provide("dojo.widget.Parse");

dojo.require("dojo.widget.Manager");
dojo.require("dojo.dom");

dojo.widget.Parse = function(fragment) {
	this.propertySetsList = [];
	this.fragment = fragment;
	
	this.createComponents = function(frag, parentComp){
		var comps = [ ];
		var built = false;
		// if we have items to parse/create at this level, do it!
		try{
			if((frag)&&(frag["tagName"])&&(frag!=frag["nodeRef"])){
				var djTags = dojo.widget.tags;
				// we split so that you can declare multiple
				// non-destructive widgets from the same ctor node
				var tna = String(frag["tagName"]).split(";");
				for(var x=0; x<tna.length; x++){
					var ltn = (tna[x].replace(/^\s+|\s+$/g, "")).toLowerCase();
					if(djTags[ltn]){
						built = true;
						frag.tagName = ltn;
						var ret = djTags[ltn](frag, this, parentComp, frag["index"]);
						comps.push(ret);
					}else{
						if((dojo.lang.isString(ltn))&&(ltn.substr(0, 5)=="dojo:")){
							dojo.debug("no tag handler registed for type: ", ltn);
						}
					}
				}
			}
		}catch(e){
			dojo.debug("dojo.widget.Parse: error:", e);
			// throw(e);
			// IE is such a bitch sometimes
		}
		// if there's a sub-frag, build widgets from that too
		if(!built){
			comps = comps.concat(this.createSubComponents(frag, parentComp));
		}
		return comps;
	}

	/*	createSubComponents recurses over a raw JavaScript object structure,
			and calls the corresponding handler for its normalized tagName if it exists
	*/
	this.createSubComponents = function(fragment, parentComp){
		var frag, comps = [];
		for(var item in fragment){
			frag = fragment[item];
			if ((frag)&&(typeof frag == "object")&&(frag!=fragment.nodeRef)&&(frag!=fragment["tagName"])){
				comps = comps.concat(this.createComponents(frag, parentComp));
			}
		}
		return comps;
	}

	/*  parsePropertySets checks the top level of a raw JavaScript object
			structure for any propertySets.  It stores an array of references to 
			propertySets that it finds.
	*/
	this.parsePropertySets = function(fragment) {
		return [];
		var propertySets = [];
		for(var item in fragment){
			if(	(fragment[item]["tagName"] == "dojo:propertyset") ) {
				propertySets.push(fragment[item]);
			}
		}
		// FIXME: should we store these propertySets somewhere for later retrieval
		this.propertySetsList.push(propertySets);
		return propertySets;
	}
	
	/*  parseProperties checks a raw JavaScript object structure for
			properties, and returns an array of properties that it finds.
	*/
	this.parseProperties = function(fragment) {
		var properties = {};
		for(var item in fragment){
			// FIXME: need to check for undefined?
			// case: its a tagName or nodeRef
			if((fragment[item] == fragment["tagName"])||
				(fragment[item] == fragment.nodeRef)){
				// do nothing
			}else{
				if((fragment[item]["tagName"])&&
					(dojo.widget.tags[fragment[item].tagName.toLowerCase()])){
					// TODO: it isn't a property or property set, it's a fragment, 
					// so do something else
					// FIXME: needs to be a better/stricter check
					// TODO: handle xlink:href for external property sets
				}else if((fragment[item][0])&&(fragment[item][0].value!="")&&(fragment[item][0].value!=null)){
					try{
						// FIXME: need to allow more than one provider
						if(item.toLowerCase() == "dataprovider") {
							var _this = this;
							this.getDataProvider(_this, fragment[item][0].value);
							properties.dataProvider = this.dataProvider;
						}
						properties[item] = fragment[item][0].value;
						var nestedProperties = this.parseProperties(fragment[item]);
						// FIXME: this kind of copying is expensive and inefficient!
						for(var property in nestedProperties){
							properties[property] = nestedProperties[property];
						}
					}catch(e){ dojo.debug(e); }
				}
			}
		}
		return properties;
	}

	/* getPropertySetById returns the propertySet that matches the provided id
	*/
	
	this.getDataProvider = function(objRef, dataUrl) {
		// FIXME: this is currently sync.  To make this async, we made need to move 
		//this step into the widget ctor, so that it is loaded when it is needed 
		// to populate the widget
		dojo.io.bind({
			url: dataUrl,
			load: function(type, evaldObj){
				if(type=="load"){
					objRef.dataProvider = evaldObj;
				}
			},
			mimetype: "text/javascript",
			sync: true
		});
	}

	
	this.getPropertySetById = function(propertySetId){
		for(var x = 0; x < this.propertySetsList.length; x++){
			if(propertySetId == this.propertySetsList[x]["id"][0].value){
				return this.propertySetsList[x];
			}
		}
		return "";
	}
	
	/* getPropertySetsByType returns the propertySet(s) that match(es) the
	 * provided componentClass
	 */
	this.getPropertySetsByType = function(componentType){
		var propertySets = [];
		for(var x=0; x < this.propertySetsList.length; x++){
			var cpl = this.propertySetsList[x];
			var cpcc = cpl["componentClass"]||cpl["componentType"]||null;
			// FIXME: propertySetId is not in scope here
			if((cpcc)&&(propertySetId == cpcc[0].value)){
				propertySets.push(cpl);
			}
		}
		return propertySets;
	}
	
	/* getPropertySets returns the propertySet for a given component fragment
	*/
	this.getPropertySets = function(fragment){
		var ppl = "dojo:propertyproviderlist";
		var propertySets = [];
		var tagname = fragment["tagName"];
		if(fragment[ppl]){ 
			var propertyProviderIds = fragment[ppl].value.split(" ");
			// FIXME: should the propertyProviderList attribute contain #
			// 		  syntax for reference to ids or not?
			// FIXME: need a better test to see if this is local or external
			// FIXME: doesn't handle nested propertySets, or propertySets that
			// 		  just contain information about css documents, etc.
			for(var propertySetId in propertyProviderIds){
				if((propertySetId.indexOf("..")==-1)&&(propertySetId.indexOf("://")==-1)){
					// get a reference to a propertySet within the current parsed structure
					var propertySet = this.getPropertySetById(propertySetId);
					if(propertySet != ""){
						propertySets.push(propertySet);
					}
				}else{
					// FIXME: add code to parse and return a propertySet from
					// another document
					// alex: is this even necessaray? Do we care? If so, why?
				}
			}
		}
		// we put the typed ones first so that the parsed ones override when
		// iteration happens.
		return (this.getPropertySetsByType(tagname)).concat(propertySets);
	}
	
	/* 
		nodeRef is the node to be replaced... in the future, we might want to add 
		an alternative way to specify an insertion point

		componentName is the expected dojo widget name, i.e. Button of ContextMenu

		properties is an object of name value pairs
	*/
	this.createComponentFromScript = function(nodeRef, componentName, properties){
		var ltn = "dojo:" + componentName.toLowerCase();
		if(dojo.widget.tags[ltn]){
			properties.fastMixIn = true;
			return [dojo.widget.tags[ltn](properties, this, null, null, properties)];
		}else{
			if(ltn.substr(0, 5)=="dojo:"){
				dojo.debug("no tag handler registed for type: ", ltn);
			}
		}
	}
}


dojo.widget._parser_collection = {"dojo": new dojo.widget.Parse() };
dojo.widget.getParser = function(name){
	if(!name){ name = "dojo"; }
	if(!this._parser_collection[name]){
		this._parser_collection[name] = new dojo.widget.Parse();
	}
	return this._parser_collection[name];
}

/**
 * Creates widget.
 *
 * @param name     The name of the widget to create
 * @param props    Key-Value pairs of properties of the widget
 * @param refNode  If the last argument is specified this node is used as
 *                 a reference for inserting this node into a DOM tree else
 *                 it beomces the domNode
 * @param position The position to insert this widget's node relative to the
 *                 refNode argument
 * @return The new Widget object
 */
 
dojo.widget.createWidget = function(name, props, refNode, position){
	var lowerCaseName = name.toLowerCase();
	var namespacedName = "dojo:" + lowerCaseName;
	var isNode = ( dojo.byId(name) && (!dojo.widget.tags[namespacedName]) );

	// if we got a node or an unambiguious ID, build a widget out of it
	if(	(arguments.length==1) && ((typeof name != "string")||(isNode)) ){
		// we got a DOM node
		var xp = new dojo.xml.Parse();
		// FIXME: we should try to find the parent!
		var tn = (isNode) ? dojo.byId(name) : name;
		return dojo.widget.getParser().createComponents(xp.parseElement(tn, null, true))[0];
	}

	function fromScript (placeKeeperNode, name, props) {
		props[namespacedName] = { 
			dojotype: [{value: lowerCaseName}],
			nodeRef: placeKeeperNode,
			fastMixIn: true
		};
		return dojo.widget.getParser().createComponentFromScript(
			placeKeeperNode, name, props, true);
	}

	if (typeof name != "string" && typeof props == "string") {
		dojo.deprecated("dojo.widget.createWidget", 
			"argument order is now of the form " +
			"dojo.widget.createWidget(NAME, [PROPERTIES, [REFERENCENODE, [POSITION]]])", "0.4");
		return fromScript(name, props, refNode);
	}
	
	props = props||{};
	var notRef = false;
	var tn = null;
	var h = dojo.render.html.capable;
	if(h){
		tn = document.createElement("span");
	}
	if(!refNode){
		notRef = true;
		refNode = tn;
		if(h){
			document.body.appendChild(refNode);
		}
	}else if(position){
		dojo.dom.insertAtPosition(tn, refNode, position);
	}else{ // otherwise don't replace, but build in-place
		tn = refNode;
	}
	var widgetArray = fromScript(tn, name, props);
	if (!widgetArray || !widgetArray[0] || typeof widgetArray[0].widgetType == "undefined") {
		throw new Error("createWidget: Creation of \"" + name + "\" widget failed.");
	}
	if (notRef) {
		if (widgetArray[0].domNode.parentNode) {
			widgetArray[0].domNode.parentNode.removeChild(widgetArray[0].domNode);
		}
	}
	return widgetArray[0]; // just return the widget
}
 
dojo.widget.fromScript = function(name, props, refNode, position){
	dojo.deprecated("dojo.widget.fromScript", " use " +
		"dojo.widget.createWidget instead", "0.4");
	return dojo.widget.createWidget(name, props, refNode, position);
}

dojo.kwCompoundRequire({
	common: ["dojo.uri.Uri", false, false]
});
dojo.provide("dojo.uri.*");

dojo.provide("dojo.widget.DomWidget");

dojo.require("dojo.event.*");
dojo.require("dojo.widget.Widget");
dojo.require("dojo.dom");
dojo.require("dojo.xml.Parse");
dojo.require("dojo.uri.*");
dojo.require("dojo.lang.func");
dojo.require("dojo.lang.extras");

dojo.widget._cssFiles = {};
dojo.widget._cssStrings = {};
dojo.widget._templateCache = {};

dojo.widget.defaultStrings = {
	dojoRoot: dojo.hostenv.getBaseScriptUri(),
	baseScriptUri: dojo.hostenv.getBaseScriptUri()
};

dojo.widget.buildFromTemplate = function() {
	dojo.lang.forward("fillFromTemplateCache");
}

// static method to build from a template w/ or w/o a real widget in place
dojo.widget.fillFromTemplateCache = function(obj, templatePath, templateCssPath, templateString, avoidCache){
	// dojo.debug("avoidCache:", avoidCache);
	var tpath = templatePath || obj.templatePath;
	var cpath = templateCssPath || obj.templateCssPath;

	// DEPRECATED: use Uri objects, not strings
	if (tpath && !(tpath instanceof dojo.uri.Uri)) {
		tpath = dojo.uri.dojoUri(tpath);
		dojo.deprecated("templatePath should be of type dojo.uri.Uri", null, "0.4");
	}
	if (cpath && !(cpath instanceof dojo.uri.Uri)) {
		cpath = dojo.uri.dojoUri(cpath);
		dojo.deprecated("templateCssPath should be of type dojo.uri.Uri", null, "0.4");
	}
	
	var tmplts = dojo.widget._templateCache;
	if(!obj["widgetType"]) { // don't have a real template here
		do {
			var dummyName = "__dummyTemplate__" + dojo.widget._templateCache.dummyCount++;
		} while(tmplts[dummyName]);
		obj.widgetType = dummyName;
	}
	var wt = obj.widgetType;

	if(cpath && !dojo.widget._cssFiles[cpath.toString()]){
		if((!obj.templateCssString)&&(cpath)){
			obj.templateCssString = dojo.hostenv.getText(cpath);
			obj.templateCssPath = null;
		}
		if((obj["templateCssString"])&&(!obj.templateCssString["loaded"])){
			dojo.style.insertCssText(obj.templateCssString, null, cpath);
			if(!obj.templateCssString){ obj.templateCssString = ""; }
			obj.templateCssString.loaded = true;
		}
		dojo.widget._cssFiles[cpath.toString()] = true;
	}

	var ts = tmplts[wt];
	if(!ts){
		tmplts[wt] = { "string": null, "node": null };
		if(avoidCache){
			ts = {};
		}else{
			ts = tmplts[wt];
		}
	}
	if((!obj.templateString)&&(!avoidCache)){
		obj.templateString = templateString || ts["string"];
	}
	if((!obj.templateNode)&&(!avoidCache)){
		obj.templateNode = ts["node"];
	}
	if((!obj.templateNode)&&(!obj.templateString)&&(tpath)){
		// fetch a text fragment and assign it to templateString
		// NOTE: we rely on blocking IO here!
		var tstring = dojo.hostenv.getText(tpath);
		if(tstring){
			// strip <?xml ...?> declarations so that external SVG and XML
			// documents can be added to a document without worry
			tstring = tstring.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, "");
			var matches = tstring.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
			if(matches){
				tstring = matches[1];
			}
		}else{
			tstring = "";
		}
		obj.templateString = tstring;
		if(!avoidCache){
			tmplts[wt]["string"] = tstring;
		}
	}
	if((!ts["string"])&&(!avoidCache)){
		ts.string = obj.templateString;
	}
}
dojo.widget._templateCache.dummyCount = 0;

dojo.widget.attachProperties = ["dojoAttachPoint", "id"];
dojo.widget.eventAttachProperty = "dojoAttachEvent";
dojo.widget.onBuildProperty = "dojoOnBuild";
dojo.widget.waiNames  = ["waiRole", "waiState"];
dojo.widget.wai = {
	waiRole: { 	name: "waiRole", 
				namespace: "http://www.w3.org/TR/xhtml2", 
				alias: "x2",
				prefix: "wairole:",
				nsName: "role"
	},
	waiState: { name: "waiState", 
				namespace: "http://www.w3.org/2005/07/aaa" , 
				alias: "aaa",
				prefix: "",
				nsName: "state"
	},
	setAttr: function(node, attr, value){
		if(dojo.render.html.ie){
			node.setAttribute(this[attr].alias+":"+this[attr].nsName, this[attr].prefix+value);
		}else{
			node.setAttributeNS(this[attr].namespace, this[attr].nsName, this[attr].prefix+value);
		}
	}
};

dojo.widget.attachTemplateNodes = function(rootNode, targetObj, events){
	// FIXME: this method is still taking WAAAY too long. We need ways of optimizing:
	//	a.) what we are looking for on each node
	//	b.) the nodes that are subject to interrogation (use xpath instead?)
	//	c.) how expensive event assignment is (less eval(), more connect())
	// var start = new Date();
	var elementNodeType = dojo.dom.ELEMENT_NODE;

	function trim(str){
		return str.replace(/^\s+|\s+$/g, "");
	}

	if(!rootNode){ 
		rootNode = targetObj.domNode;
	}

	if(rootNode.nodeType != elementNodeType){
		return;
	}
	// alert(events.length);

	var nodes = rootNode.all || rootNode.getElementsByTagName("*");
	var _this = targetObj;
	for(var x=-1; x<nodes.length; x++){
		var baseNode = (x == -1) ? rootNode : nodes[x];
		// FIXME: is this going to have capitalization problems?  Could use getAttribute(name, 0); to get attributes case-insensitve
		var attachPoint = [];
		for(var y=0; y<this.attachProperties.length; y++){
			var tmpAttachPoint = baseNode.getAttribute(this.attachProperties[y]);
			if(tmpAttachPoint){
				attachPoint = tmpAttachPoint.split(";");
				for(var z=0; z<attachPoint.length; z++){
					if(dojo.lang.isArray(targetObj[attachPoint[z]])){
						targetObj[attachPoint[z]].push(baseNode);
					}else{
						targetObj[attachPoint[z]]=baseNode;
					}
				}
				break;
			}
		}
		// continue;

		// FIXME: we need to put this into some kind of lookup structure
		// instead of direct assignment
		var tmpltPoint = baseNode.getAttribute(this.templateProperty);
		if(tmpltPoint){
			targetObj[tmpltPoint]=baseNode;
		}

		dojo.lang.forEach(dojo.widget.waiNames, function(name){
			var wai = dojo.widget.wai[name];
			var val = baseNode.getAttribute(wai.name);
			if(val){
				dojo.widget.wai.setAttr(baseNode, wai.name, val);
			}
		}, this);

		var attachEvent = baseNode.getAttribute(this.eventAttachProperty);
		if(attachEvent){
			// NOTE: we want to support attributes that have the form
			// "domEvent: nativeEvent; ..."
			var evts = attachEvent.split(";");
			for(var y=0; y<evts.length; y++){
				if((!evts[y])||(!evts[y].length)){ continue; }
				var thisFunc = null;
				var tevt = trim(evts[y]);
				if(evts[y].indexOf(":") >= 0){
					// oh, if only JS had tuple assignment
					var funcNameArr = tevt.split(":");
					tevt = trim(funcNameArr[0]);
					thisFunc = trim(funcNameArr[1]);
				}
				if(!thisFunc){
					thisFunc = tevt;
				}

				var tf = function(){ 
					var ntf = new String(thisFunc);
					return function(evt){
						if(_this[ntf]){
							_this[ntf](dojo.event.browser.fixEvent(evt, this));
						}
					};
				}();
				dojo.event.browser.addListener(baseNode, tevt, tf, false, true);
				// dojo.event.browser.addListener(baseNode, tevt, dojo.lang.hitch(_this, thisFunc));
			}
		}

		for(var y=0; y<events.length; y++){
			//alert(events[x]);
			var evtVal = baseNode.getAttribute(events[y]);
			if((evtVal)&&(evtVal.length)){
				var thisFunc = null;
				var domEvt = events[y].substr(4); // clober the "dojo" prefix
				thisFunc = trim(evtVal);
				var funcs = [thisFunc];
				if(thisFunc.indexOf(";")>=0){
					funcs = dojo.lang.map(thisFunc.split(";"), trim);
				}
				for(var z=0; z<funcs.length; z++){
					if(!funcs[z].length){ continue; }
					var tf = function(){ 
						var ntf = new String(funcs[z]);
						return function(evt){
							if(_this[ntf]){
								_this[ntf](dojo.event.browser.fixEvent(evt, this));
							}
						}
					}();
					dojo.event.browser.addListener(baseNode, domEvt, tf, false, true);
					// dojo.event.browser.addListener(baseNode, domEvt, dojo.lang.hitch(_this, funcs[z]));
				}
			}
		}

		var onBuild = baseNode.getAttribute(this.onBuildProperty);
		if(onBuild){
			eval("var node = baseNode; var widget = targetObj; "+onBuild);
		}
	}

}

dojo.widget.getDojoEventsFromStr = function(str){
	// var lstr = str.toLowerCase();
	var re = /(dojoOn([a-z]+)(\s?))=/gi;
	var evts = str ? str.match(re)||[] : [];
	var ret = [];
	var lem = {};
	for(var x=0; x<evts.length; x++){
		if(evts[x].legth < 1){ continue; }
		var cm = evts[x].replace(/\s/, "");
		cm = (cm.slice(0, cm.length-1));
		if(!lem[cm]){
			lem[cm] = true;
			ret.push(cm);
		}
	}
	return ret;
}

/*
dojo.widget.buildAndAttachTemplate = function(obj, templatePath, templateCssPath, templateString, targetObj) {
	this.buildFromTemplate(obj, templatePath, templateCssPath, templateString);
	var node = dojo.dom.createNodesFromText(obj.templateString, true)[0];
	this.attachTemplateNodes(node, targetObj||obj, dojo.widget.getDojoEventsFromStr(templateString));
	return node;
}
*/

dojo.declare("dojo.widget.DomWidget", dojo.widget.Widget, {
	initializer: function() {
		if((arguments.length>0)&&(typeof arguments[0] == "object")){
			this.create(arguments[0]);
		}
	},
								 
	templateNode: null,
	templateString: null,
	templateCssString: null,
	preventClobber: false,
	domNode: null, // this is our visible representation of the widget!
	containerNode: null, // holds child elements

	// Process the given child widget, inserting it's dom node as a child of our dom node
	// FIXME: should we support addition at an index in the children arr and
	// order the display accordingly? Right now we always append.
	addChild: function(widget, overrideContainerNode, pos, ref, insertIndex){
		if(!this.isContainer){ // we aren't allowed to contain other widgets, it seems
			dojo.debug("dojo.widget.DomWidget.addChild() attempted on non-container widget");
			return null;
		}else{
			this.addWidgetAsDirectChild(widget, overrideContainerNode, pos, ref, insertIndex);
			this.registerChild(widget, insertIndex);
		}
		return widget;
	},
	
	addWidgetAsDirectChild: function(widget, overrideContainerNode, pos, ref, insertIndex){
		if((!this.containerNode)&&(!overrideContainerNode)){
			this.containerNode = this.domNode;
		}
		var cn = (overrideContainerNode) ? overrideContainerNode : this.containerNode;
		if(!pos){ pos = "after"; }
		if(!ref){ 
			// if(!cn){ cn = document.body; }
			if(!cn){ cn = document.body; }
			ref = cn.lastChild; 
		}
		if(!insertIndex) { insertIndex = 0; }
		widget.domNode.setAttribute("dojoinsertionindex", insertIndex);

		// insert the child widget domNode directly underneath my domNode, in the
		// specified position (by default, append to end)
		if(!ref){
			cn.appendChild(widget.domNode);
		}else{
			// FIXME: was this meant to be the (ugly hack) way to support insert @ index?
			//dojo.dom[pos](widget.domNode, ref, insertIndex);

			// CAL: this appears to be the intended way to insert a node at a given position...
			if (pos == 'insertAtIndex'){
				// dojo.debug("idx:", insertIndex, "isLast:", ref === cn.lastChild);
				dojo.dom.insertAtIndex(widget.domNode, ref.parentNode, insertIndex);
			}else{
				// dojo.debug("pos:", pos, "isLast:", ref === cn.lastChild);
				if((pos == "after")&&(ref === cn.lastChild)){
					cn.appendChild(widget.domNode);
				}else{
					dojo.dom.insertAtPosition(widget.domNode, cn, pos);
				}
			}
		}
	},

	// Record that given widget descends from me
	registerChild: function(widget, insertionIndex){

		// we need to insert the child at the right point in the parent's 
		// 'children' array, based on the insertionIndex

		widget.dojoInsertionIndex = insertionIndex;

		var idx = -1;
		for(var i=0; i<this.children.length; i++){
			if (this.children[i].dojoInsertionIndex < insertionIndex){
				idx = i;
			}
		}

		this.children.splice(idx+1, 0, widget);

		widget.parent = this;
		widget.addedTo(this);
		
		// If this widget was created programatically, then it was erroneously added
		// to dojo.widget.manager.topWidgets.  Fix that here.
		delete dojo.widget.manager.topWidgets[widget.widgetId];
	},

	removeChild: function(widget){
		// detach child domNode from parent domNode
		dojo.dom.removeNode(widget.domNode);

		// remove child widget from parent widget
		return dojo.widget.DomWidget.superclass.removeChild.call(this, widget);
	},

	getFragNodeRef: function(frag){
		if( !frag || !frag["dojo:"+this.widgetType.toLowerCase()] ){
			dojo.raise("Error: no frag for widget type " + this.widgetType +
				", id " + this.widgetId + " (maybe a widget has set it's type incorrectly)");
		}
		return (frag ? frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"] : null);
	},
	
	// Replace source domNode with generated dom structure, and register
	// widget with parent.
	postInitialize: function(args, frag, parentComp){
		var sourceNodeRef = this.getFragNodeRef(frag);
		// Stick my generated dom into the output tree
		//alert(this.widgetId + ": replacing " + sourceNodeRef + " with " + this.domNode.innerHTML);
		if (parentComp && (parentComp.snarfChildDomOutput || !sourceNodeRef)){
			// Add my generated dom as a direct child of my parent widget
			// This is important for generated widgets, and also cases where I am generating an
			// <li> node that can't be inserted back into the original DOM tree
			parentComp.addWidgetAsDirectChild(this, "", "insertAtIndex", "",  args["dojoinsertionindex"], sourceNodeRef);
		} else if (sourceNodeRef){
			// Do in-place replacement of the my source node with my generated dom
			if(this.domNode && (this.domNode !== sourceNodeRef)){
				var oldNode = sourceNodeRef.parentNode.replaceChild(this.domNode, sourceNodeRef);
			}
		}

		// Register myself with my parent, or with the widget manager if
		// I have no parent
		// TODO: the code below erroneously adds all programatically generated widgets
		// to topWidgets (since we don't know who the parent is until after creation finishes)
		if ( parentComp ) {
			parentComp.registerChild(this, args.dojoinsertionindex);
		} else {
			dojo.widget.manager.topWidgets[this.widgetId]=this;
		}

		// Expand my children widgets
		if(this.isContainer){
			//alert("recurse from " + this.widgetId);
			// build any sub-components with us as the parent
			var fragParser = dojo.widget.getParser();
			fragParser.createSubComponents(frag, this);
		}
	},

	// method over-ride
	buildRendering: function(args, frag){
		// DOM widgets construct themselves from a template
		var ts = dojo.widget._templateCache[this.widgetType];
		if(	
			(!this.preventClobber)&&(
				(this.templatePath)||
				(this.templateNode)||
				(
					(this["templateString"])&&(this.templateString.length) 
				)||
				(
					(typeof ts != "undefined")&&( (ts["string"])||(ts["node"]) )
				)
			)
		){
			// if it looks like we can build the thing from a template, do it!
			this.buildFromTemplate(args, frag);
		}else{
			// otherwise, assign the DOM node that was the source of the widget
			// parsing to be the root node
			this.domNode = this.getFragNodeRef(frag);
		}
		this.fillInTemplate(args, frag); 	// this is where individual widgets
											// will handle population of data
											// from properties, remote data
											// sets, etc.
	},

	buildFromTemplate: function(args, frag){
		// var start = new Date();
		// copy template properties if they're already set in the templates object
		// dojo.debug("buildFromTemplate:", this);
		var avoidCache = false;
		if(args["templatecsspath"]){
			args["templateCssPath"] = args["templatecsspath"];
		}
		if(args["templatepath"]){
			avoidCache = true;
			args["templatePath"] = args["templatepath"];
		}
		dojo.widget.fillFromTemplateCache(	this, 
											args["templatePath"], 
											args["templateCssPath"],
											null,
											avoidCache);
		var ts = dojo.widget._templateCache[this.widgetType];
		if((ts)&&(!avoidCache)){
			if(!this.templateString.length){
				this.templateString = ts["string"];
			}
			if(!this.templateNode){
				this.templateNode = ts["node"];
			}
		}
		var matches = false;
		var node = null;
		// var tstr = new String(this.templateString); 
		var tstr = this.templateString; 
		// attempt to clone a template node, if there is one
		if((!this.templateNode)&&(this.templateString)){
			matches = this.templateString.match(/\$\{([^\}]+)\}/g);
			if(matches) {
				// if we do property replacement, don't create a templateNode
				// to clone from.
				var hash = this.strings || {};
				// FIXME: should this hash of default replacements be cached in
				// templateString?
				for(var key in dojo.widget.defaultStrings) {
					if(dojo.lang.isUndefined(hash[key])) {
						hash[key] = dojo.widget.defaultStrings[key];
					}
				}
				// FIXME: this is a lot of string munging. Can we make it faster?
				for(var i = 0; i < matches.length; i++) {
					var key = matches[i];
					key = key.substring(2, key.length-1);
					var kval = (key.substring(0, 5) == "this.") ? dojo.lang.getObjPathValue(key.substring(5), this) : hash[key];
					var value;
					if((kval)||(dojo.lang.isString(kval))){
						value = (dojo.lang.isFunction(kval)) ? kval.call(this, key, this.templateString) : kval;
						tstr = tstr.replace(matches[i], value);
					}
				}
			}else{
				// otherwise, we are required to instantiate a copy of the template
				// string if one is provided.
				
				// FIXME: need to be able to distinguish here what should be done
				// or provide a generic interface across all DOM implementations
				// FIMXE: this breaks if the template has whitespace as its first 
				// characters
				// node = this.createNodesFromText(this.templateString, true);
				// this.templateNode = node[0].cloneNode(true); // we're optimistic here
				this.templateNode = this.createNodesFromText(this.templateString, true)[0];
				if(!avoidCache){
					ts.node = this.templateNode;
				}
			}
		}
		if((!this.templateNode)&&(!matches)){ 
			dojo.debug("weren't able to create template!");
			return false;
		}else if(!matches){
			node = this.templateNode.cloneNode(true);
			if(!node){ return false; }
		}else{
			node = this.createNodesFromText(tstr, true)[0];
		}

		// recurse through the node, looking for, and attaching to, our
		// attachment points which should be defined on the template node.

		this.domNode = node;
		// dojo.profile.start("attachTemplateNodes");
		this.attachTemplateNodes(this.domNode, this);
		// dojo.profile.end("attachTemplateNodes");
		
		// relocate source contents to templated container node
		// this.containerNode must be able to receive children, or exceptions will be thrown
		if (this.isContainer && this.containerNode){
			var src = this.getFragNodeRef(frag);
			if (src){
				dojo.dom.moveChildren(src, this.containerNode);
			}
		}
	},

	attachTemplateNodes: function(baseNode, targetObj){
		if(!targetObj){ targetObj = this; }
		return dojo.widget.attachTemplateNodes(baseNode, targetObj, 
					dojo.widget.getDojoEventsFromStr(this.templateString));
	},

	fillInTemplate: function(){
		// dojo.unimplemented("dojo.widget.DomWidget.fillInTemplate");
	},
	
	// method over-ride
	destroyRendering: function(){
		try{
			delete this.domNode;
		}catch(e){ /* squelch! */ }
	},

	// FIXME: method over-ride
	cleanUp: function(){},
	
	getContainerHeight: function(){
		dojo.unimplemented("dojo.widget.DomWidget.getContainerHeight");
	},

	getContainerWidth: function(){
		dojo.unimplemented("dojo.widget.DomWidget.getContainerWidth");
	},

	createNodesFromText: function(){
		dojo.unimplemented("dojo.widget.DomWidget.createNodesFromText");
	}
});

dojo.provide("dojo.lfx.toggle");
dojo.require("dojo.lfx.*");

dojo.lfx.toggle.plain = {
	show: function(node, duration, easing, callback){
		dojo.style.show(node);
		if(dojo.lang.isFunction(callback)){ callback(); }
	},
	
	hide: function(node, duration, easing, callback){
		dojo.style.hide(node);
		if(dojo.lang.isFunction(callback)){ callback(); }
	}
}

dojo.lfx.toggle.fade = {
	show: function(node, duration, easing, callback){
		dojo.lfx.fadeShow(node, duration, easing, callback).play();
	},

	hide: function(node, duration, easing, callback){
		dojo.lfx.fadeHide(node, duration, easing, callback).play();
	}
}

dojo.lfx.toggle.wipe = {
	show: function(node, duration, easing, callback){
		dojo.lfx.wipeIn(node, duration, easing, callback).play();
	},

	hide: function(node, duration, easing, callback){
		dojo.lfx.wipeOut(node, duration, easing, callback).play();
	}
}

dojo.lfx.toggle.explode = {
	show: function(node, duration, easing, callback, explodeSrc){
		dojo.lfx.explode(explodeSrc||[0,0,0,0], node, duration, easing, callback).play();
	},

	hide: function(node, duration, easing, callback, explodeSrc){
		dojo.lfx.implode(node, explodeSrc||[0,0,0,0], duration, easing, callback).play();
	}
}

dojo.provide("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.html");
dojo.require("dojo.html.extras");
dojo.require("dojo.lang.extras");
dojo.require("dojo.lang.func");
dojo.require("dojo.lfx.toggle");

dojo.declare("dojo.widget.HtmlWidget", dojo.widget.DomWidget, {								 
	widgetType: "HtmlWidget",

	templateCssPath: null,
	templatePath: null,

	// for displaying/hiding widget
	toggle: "plain",
	toggleDuration: 150,

	animationInProgress: false,

	initialize: function(args, frag){
	},

	postMixInProperties: function(args, frag){
		// now that we know the setting for toggle, get toggle object
		// (default to plain toggler if user specified toggler not present)
		this.toggleObj =
			dojo.lfx.toggle[this.toggle.toLowerCase()] || dojo.lfx.toggle.plain;
	},

	getContainerHeight: function(){
		// NOTE: container height must be returned as the INNER height
		dojo.unimplemented("dojo.widget.HtmlWidget.getContainerHeight");
	},

	getContainerWidth: function(){
		return this.parent.domNode.offsetWidth;
	},

	setNativeHeight: function(height){
		var ch = this.getContainerHeight();
	},

	createNodesFromText: function(txt, wrap){
		return dojo.html.createNodesFromText(txt, wrap);
	},

	destroyRendering: function(finalize){
		try{
			if(!finalize){
				dojo.event.browser.clean(this.domNode);
			}
			this.domNode.parentNode.removeChild(this.domNode);
			delete this.domNode;
		}catch(e){ /* squelch! */ }
	},

	/////////////////////////////////////////////////////////
	// Displaying/hiding the widget
	/////////////////////////////////////////////////////////
	isShowing: function(){
		return dojo.style.isShowing(this.domNode);
	},

	toggleShowing: function(){
		// dojo.style.toggleShowing(this.domNode);
		if(this.isHidden){
			this.show();
		}else{
			this.hide();
		}
	},

	show: function(){
		this.animationInProgress=true;
		this.isHidden = false;
		this.toggleObj.show(this.domNode, this.toggleDuration, null,
			dojo.lang.hitch(this, this.onShow), this.explodeSrc);
	},

	// called after the show() animation has completed
	onShow: function(){
		this.animationInProgress=false;
		this.checkSize();
	},

	hide: function(){
		this.animationInProgress = true;
		this.isHidden = true;
		this.toggleObj.hide(this.domNode, this.toggleDuration, null,
			dojo.lang.hitch(this, this.onHide), this.explodeSrc);
	},

	// called after the hide() animation has completed
	onHide: function(){
		this.animationInProgress=false;
	},

	//////////////////////////////////////////////////////////////////////////////
	// Sizing related methods
	//  If the parent changes size then for each child it should call either
	//   - resizeTo(): size the child explicitly
	//   - or checkSize(): notify the child the the parent has changed size
	//////////////////////////////////////////////////////////////////////////////

	// Test if my size has changed.
	// If width & height are specified then that's my new size; otherwise,
	// query outerWidth/outerHeight of my domNode
	_isResized: function(w, h){
		// If I'm not being displayed then disregard (show() must
		// check if the size has changed)
		if(!this.isShowing()){ return false; }

		// If my parent has been resized and I have style="height: 100%"
		// or something similar then my size has changed too.
		w=w||dojo.style.getOuterWidth(this.domNode);
		h=h||dojo.style.getOuterHeight(this.domNode);
		if(this.width == w && this.height == h){ return false; }

		this.width=w;
		this.height=h;
		return true;
	},

	// Called when my parent has changed size, but my parent won't call resizeTo().
	// This is useful if my size is height:100% or something similar.
	// Also called whenever I am shown, because the first time I am shown I may need
	// to do size calculations.
	checkSize: function(){
		if(!this._isResized()){ return; }
		this.onResized();
	},

	// Explicitly set this widget's size (in pixels).
	resizeTo: function(w, h){
		if(!this._isResized(w,h)){ return; }
		dojo.style.setOuterWidth(this.domNode, w);
		dojo.style.setOuterHeight(this.domNode, h);
		this.onResized();
	},

	resizeSoon: function(){
		if(this.isShowing()){
			dojo.lang.setTimeout(this, this.onResized, 0);
		}
	},

	// Called when my size has changed.
	// Must notify children if their size has (possibly) changed
	onResized: function(){
		dojo.lang.forEach(this.children, function(child){ child.checkSize(); });
	}
});

dojo.kwCompoundRequire({
	common: ["dojo.xml.Parse", 
			 "dojo.widget.Widget", 
			 "dojo.widget.Parse", 
			 "dojo.widget.Manager"],
	browser: ["dojo.widget.DomWidget",
			  "dojo.widget.HtmlWidget"],
	dashboard: ["dojo.widget.DomWidget",
			  "dojo.widget.HtmlWidget"],
	svg: 	 ["dojo.widget.SvgWidget"],
	rhino: 	 ["dojo.widget.SwtWidget"]
});
dojo.provide("dojo.widget.*");

dojo.provide("dojo.html.shadow");

dojo.require("dojo.lang");
dojo.require("dojo.uri");

dojo.html.shadow = function(node) {
	this.init(node);
}

dojo.lang.extend(dojo.html.shadow, {

	shadowPng: dojo.uri.dojoUri("/hyperscope/src/client/images/shadow"),
	shadowThickness: 8,
	shadowOffset: 15,

	init: function(node){
		this.node=node;

		// make all the pieces of the shadow, and position/size them as much
		// as possible (but a lot of the coordinates are set in sizeShadow
		this.pieces={};
		var x1 = -1 * this.shadowThickness;
		var y0 = this.shadowOffset;
		var y1 = this.shadowOffset + this.shadowThickness;
		this._makePiece("tl", "top", y0, "left", x1);
		this._makePiece("l", "top", y1, "left", x1, "scale");
		this._makePiece("tr", "top", y0, "left", 0);
		this._makePiece("r", "top", y1, "left", 0, "scale");
		this._makePiece("bl", "top", 0, "left", x1);
		this._makePiece("b", "top", 0, "left", 0, "crop");
		this._makePiece("br", "top", 0, "left", 0);
	},

	_makePiece: function(name, vertAttach, vertCoord, horzAttach, horzCoord, sizing){
		var img;
		var url = this.shadowPng + name.toUpperCase() + ".png";
		if(dojo.render.html.ie){
			img=document.createElement("div");
			img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+url+"'"+
			(sizing?", sizingMethod='"+sizing+"'":"") + ")";
		}else{
			img=document.createElement("img");
			img.src=url;
		}
		img.style.position="absolute";
		img.style[vertAttach]=vertCoord+"px";
		img.style[horzAttach]=horzCoord+"px";
		img.style.width=this.shadowThickness+"px";
		img.style.height=this.shadowThickness+"px";
		this.pieces[name]=img;
		this.node.appendChild(img);
	},

	size: function(width, height){
		var sideHeight = height - (this.shadowOffset+this.shadowThickness+1);
		with(this.pieces){
			l.style.height = sideHeight+"px";
			r.style.height = sideHeight+"px";
			b.style.width = (width-1)+"px";
			bl.style.top = (height-1)+"px";
			b.style.top = (height-1)+"px";
			br.style.top = (height-1)+"px";
			tr.style.left = (width-1)+"px";
			r.style.left = (width-1)+"px";
			br.style.left = (width-1)+"px";
		}
	}
});


dojo.provide("dojo.html.layout");

dojo.require("dojo.lang");
dojo.require("dojo.string");
dojo.require("dojo.style");
dojo.require("dojo.html");

/**
 * Layout a bunch of child dom nodes within a parent dom node
 * Input is an array of objects like:
 * @ container - parent node
 * @ layoutPriority - "top-bottom" or "left-right"
 * @ children an array like [ {domNode: foo, layoutAlign: "bottom" }, {domNode: bar, layoutAlign: "client"} ]
 */
dojo.html.layout = function(container, children, layoutPriority) {
	dojo.html.addClass(container, "dojoLayoutContainer");

	// Copy children array and remove elements w/out layout.
	// Also record each child's position in the input array, for sorting purposes.
	children = dojo.lang.filter(children, function(child, idx){
		child.idx = idx;
		return dojo.lang.inArray(["top","bottom","left","right","client","flood"], child.layoutAlign)
	});

	// Order the children according to layoutPriority.
	// Multiple children w/the same layoutPriority will be sorted by their position in the input array.
	if(layoutPriority && layoutPriority!="none"){
		var rank = function(child){
			switch(child.layoutAlign){
				case "flood":
					return 1;
				case "left":
				case "right":
					return (layoutPriority=="left-right") ? 2 : 3;
				case "top":
				case "bottom":
					return (layoutPriority=="left-right") ? 3 : 2;
				default:
					return 4;
			}
		};
		children.sort(function(a,b){
			return (rank(a)-rank(b)) || (a.idx - b.idx);
		});
	}

	// remaining space (blank area where nothing has been written)
	var f={
		top: dojo.style.getPixelValue(container, "padding-top", true),
		left: dojo.style.getPixelValue(container, "padding-left", true),
		height: dojo.style.getContentHeight(container),
		width: dojo.style.getContentWidth(container)
	};

	// set positions/sizes
	dojo.lang.forEach(children, function(child){
		var elm=child.domNode;
		var pos=child.layoutAlign;
		// set elem to upper left corner of unused space; may move it later
		with(elm.style){
			left = f.left+"px";
			top = f.top+"px";
			bottom = "auto";
			right = "auto";
		}
		dojo.html.addClass(elm, "dojoAlign" + dojo.string.capitalize(pos));

		// set size && adjust record of remaining space.
		// note that setting the width of a <div> may affect it's height.
		// TODO: same is true for widgets but need to implement API to support that
		if ( (pos=="top")||(pos=="bottom") ) {
			dojo.style.setOuterWidth(elm, f.width);
			var h = dojo.style.getOuterHeight(elm);
			f.height -= h;
			if(pos=="top"){
				f.top += h;
			}else{
				elm.style.top = f.top + f.height + "px";
			}
		}else if(pos=="left" || pos=="right"){
			dojo.style.setOuterHeight(elm, f.height);
			var w = dojo.style.getOuterWidth(elm);
			f.width -= w;
			if(pos=="left"){
				f.left += w;
			}else{
				elm.style.left = f.left + f.width + "px";
			}
		} else if(pos=="flood" || pos=="client"){
			dojo.style.setOuterWidth(elm, f.width);
			dojo.style.setOuterHeight(elm, f.height);
		}
		
		// TODO: for widgets I want to call resizeTo(), but for top/bottom
		// alignment I only want to set the width, and have the size determined
		// dynamically.  (The thinner you make a div, the more height it consumes.)
		if(child.onResized){
			child.onResized();
		}
	});
};

// This is essential CSS to make layout work (it isn't "styling" CSS)
// make sure that the position:absolute in dojoAlign* overrides other classes
dojo.style.insertCssText(
	".dojoLayoutContainer{ position: relative; display: block; }\n" +
	"body .dojoAlignTop, body .dojoAlignBottom, body .dojoAlignLeft, body .dojoAlignRight { position: absolute; overflow: hidden; }\n" +
	"body .dojoAlignClient { position: absolute }\n" +
	".dojoAlignClient { overflow: auto; }\n"
);


// This widget doesn't do anything; is basically the same as <div>.
// It's useful as a child of LayoutContainer, SplitContainer, or TabContainer.
// But note that those classes can contain any widget as a child.

dojo.provide("dojo.widget.ContentPane");


dojo.provide("dojo.widget.html.ContentPane");

dojo.require("dojo.widget.*");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.ContentPane");
dojo.require("dojo.string");
dojo.require("dojo.string.extras");
dojo.require("dojo.style");

dojo.widget.html.ContentPane = function(){
	this._onLoadStack = [];
	this._onUnLoadStack = [];
	dojo.widget.HtmlWidget.call(this);
}
dojo.inherits(dojo.widget.html.ContentPane, dojo.widget.HtmlWidget);

dojo.lang.extend(dojo.widget.html.ContentPane, {
	widgetType: "ContentPane",
	isContainer: true,

	// remote loading options
	adjustPaths: true,
	href: "",
	extractContent: true,
	parseContent: true,
	cacheContent: true,
	preload: false,			// force load of data even if pane is hidden
	refreshOnShow: false,
	handler: "",			// generate pane content from a java function
	executeScripts: false,	// if true scripts in content will be evaled after content is set and parsed
	scriptScope: null,		// scopeContainer for downloaded scripts

		// If the user want a global in the remote script he/she just omitts the var
		// examples:
		//--------------------------
		// these gets collected by scriptScope and is reached by dojo.widget.byId('..').scriptScope.myCustomproperty
		//	this.myString = "dojo is a great javascript toolkit!";
		//
		//	this.alertMyString = function(){
		//		alert(myString);
		//	}
		// -------------------------
		// these go into the global namespace (window) notice lack of var, equiv to window.myString
		//	myString = "dojo is a javascript toolkit!";
		//
		//	alertMyString = function(){
		//		alert(myString);
		// }


	// private
	_remoteStyles: null,	// array of stylenodes inserted to document head
							// by remote content, used when we clean up for new content

	_callOnUnLoad: false,		// used by setContent and _handleDefults, makes sure onUnLoad is only called once

	postCreate: function(args, frag, parentComp){
		if ( this.handler != "" ){
			this.setHandler(this.handler);
		}
		if(this.isShowing()||this.preload){ this.loadContents(); }
	},

	show: function(){
		// if refreshOnShow is true, reload the contents every time; otherwise, load only the first time
		if(this.refreshOnShow){
			this.refresh();
		}else{
			this.loadContents();
		}
		dojo.widget.html.ContentPane.superclass.show.call(this);
	},

	refresh: function(){
		this.isLoaded=false;
		this.loadContents();
	},

	loadContents: function() {
		if ( this.isLoaded ){
			return;
		}
		this.isLoaded=true;
		if ( dojo.lang.isFunction(this.handler)) {
			this._runHandler();
		} else if ( this.href != "" ) {
			this._downloadExternalContent(this.href, this.cacheContent);
		}
	},

	
	setUrl: function(/*String*/ url) {
		// summary:
		// 	Reset the (external defined) content of this pane and replace with new url
		this.href = url;
		this.isLoaded = false;
		if ( this.preload || this.isShowing() ){
			this.loadContents();
		}
	},

	_downloadExternalContent: function(url, useCache) {
		this._handleDefaults("Loading...", "onDownloadStart");
		var self = this;
		dojo.io.bind({
			url: url,
			useCache: useCache,
			preventCache: !useCache,
			mimetype: "text/html",
			handler: function(type, data, e) {
				if(type == "load") {
					self.onDownloadEnd.call(self, url, data);
				} else {
					// works best when from a live server instead of from file system 
					self._handleDefaults.call(self, "Error loading '" + url + "' (" + e.status + " "+  e.statusText + ")", "onDownloadError");
					self.onLoad();
				}
			}
		});
	},

	// called when setContent is finished
	onLoad: function(e){
		this._runStack("_onLoadStack");
	},

	// called before old content is cleared
	onUnLoad: function(e){
		this._runStack("_onUnLoadStack");
		this.scriptScope = null;
	},

	_runStack: function(stName){
		var st = this[stName]; var err = "";
		for(var i = 0;i < st.length; i++){
			try{
				st[i].call(this.scriptScope);
			}catch(e){ 
				err += "\n"+st[i]+" failed: "+e.description;
			}
		}
		this[stName] = [];

		if(err.length){
			var name = (stName== "_onLoadStack") ? "addOnLoad" : "addOnUnLoad";
			this._handleDefaults(name+" failure\n "+err, "onExecError", true);
		}
	},

	addOnLoad: function(obj, func){
		// summary
		// 	same as to dojo.addOnLoad but does not take "function_name" as a string
		this._pushOnStack(this._onLoadStack, obj, func);
	},

	addOnUnLoad: function(obj, func){
		// summary
		// 	same as to dojo.addUnOnLoad but does not take "function_name" as a string
		this._pushOnStack(this._onUnLoadStack, obj, func);
	},

	_pushOnStack: function(stack, obj, func){
		if(typeof func == 'undefined') {
			stack.push(obj);
		}else{
			stack.push(function(){ obj[func](); });
		}
	},

	destroy: function(){
		// make sure we call onUnLoad
		this.onUnLoad();
		dojo.widget.html.ContentPane.superclass.destroy.call(this);
	},

	// called when content script eval error or Java error occurs, preventDefault-able
	onExecError: function(e){ /*stub*/ },

	// called on DOM faults, require fault etc in content, preventDefault-able
	onContentError: function(e){ /*stub*/ },

	// called when download error occurs, preventDefault-able
	onDownloadError: function(e){ /*stub*/ },

	// called before download starts, preventDefault-able
	onDownloadStart: function(e){ /*stub*/ },

	// called when download is finished
	onDownloadEnd: function(url, data){
		data = this.splitAndFixPaths(data, url);
		this.setContent(data);
	},

	// usefull if user wants to prevent default behaviour ie: _setContent("Error...")
	_handleDefaults: function(e, handler, useAlert){
		if(!handler){ handler = "onContentError"; }
		if(dojo.lang.isString(e)){
			e = {
				"text": e,
				"toString": function(){ return this.text; }
			}
		}
		if(typeof e.returnValue != "boolean"){
			e.returnValue = true; 
		}
		if(typeof e.preventDefault != "function"){
			e.preventDefault = function(){
				this.returnValue = false;
			}
		}
		// call our handler
		this[handler](e);
		if(e.returnValue){
			if(useAlert){
				alert(e.toString());
			}else{
				if(this._callOnUnLoad){
					this.onUnLoad(); // makes sure scripts can clean up after themselves, before we setContent
				}
				this._callOnUnLoad = false; // makes sure we dont try to call onUnLoad again on this event,
											// ie onUnLoad before 'Loading...' but not before clearing 'Loading...'
				this._setContent(e.toString());
			}
		}
	},

	
	splitAndFixPaths: function(/*String*/s, /*dojo.uri.Uri?*/url){
		// summary:
		// 	fixes all remote paths in (hopefully) all cases for example images, remote scripts, links etc.
		// 	splits up content in different pieces, scripts, title, style, link and whats left becomes .xml

		if(!url) { url = "./"; } // point to this page if not set
		if(!s) { return ""; }

		// fix up paths in data
		var titles = []; var scripts = []; var linkStyles = [];
		var styles = []; var remoteScripts = []; var requires = [];

		// khtml is much more picky about dom faults, you can't for example attach a style node under body of document
		// must go into head, as does a title node, so we need to cut out those tags
		// cut out title tags
		var match = [];
		while(match){
			match = s.match(/<title[^>]*>([\s\S]*?)<\/title>/i); // can't match with dot as that 
			if(!match){ break;}					//doesnt match newline in js
			titles.push(match[1]);
			s = s.replace(/<title[^>]*>[\s\S]*?<\/title>/i, "");
		}

		// cut out <style> url(...) </style>, as that bails out in khtml
		var match = [];
		while(match){
			match = s.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
			if(!match){ break; }
			styles.push(dojo.style.fixPathsInCssText(match[1], url));
			s = s.replace(/<style[^>]*?>[\s\S]*?<\/style>/i, "");
		}

		// attributepaths one tag can have multiple paths example:
		// <input src="..." style="url(..)"/> or <a style="url(..)" href="..">
		// strip out the tag and run fix on that.
		// this guarantees that we won't run replace another tag's attribute + it was easier do
		var pos = 0; var pos2 = 0; var stop = 0 ;var str = ""; var fixedPath = "";
		var attr = []; var fix = ""; var tagFix = ""; var tag = ""; var regex = ""; 
		while(pos>-1){
			pos = s.search(/<[a-z][a-z0-9]*[^>]*\s(?:(?:src|href|style)=[^>])+[^>]*>/i);
			if(pos==-1){ break; }
			str += s.substring(0, pos);
			s = s.substring(pos, s.length);
			tag = s.match(/^<[a-z][a-z0-9]*[^>]*>/i)[0];
			s = s.substring(tag.length, s.length);

			// loop through attributes
			pos2 = 0; tagFix = ""; fix = ""; regex = ""; var regexlen = 0;
			while(pos2!=-1){
				// slices up before next attribute check, values from previous loop
				tagFix += tag.substring(0, pos2) + fix;
				tag = tag.substring(pos2+regexlen, tag.length);

				// fix next attribute or bail out when done
				// hopefully this charclass covers most urls
				attr = tag.match(/ (src|href|style)=(['"]?)([\w()\[\]\/.,\\'"-:;#=&?\s@]+?)\2/i);
				if(!attr){ break; }

				switch(attr[1].toLowerCase()){
					case "src":// falltrough
					case "href":
						// this hopefully covers most common protocols
						if(attr[3].search(/^(?:[#]|(?:(?:https?|ftps?|file|javascript|mailto|news):))/)==-1){
							fixedPath = (new dojo.uri.Uri(url, attr[3]).toString());
						} else {
							pos2 = pos2 + attr[3].length;
							continue;
						}
						break;
					case "style":// style
						fixedPath = dojo.style.fixPathsInCssText(attr[3], url);
						break;
					default:
						pos2 = pos2 + attr[3].length;
						continue;
				}

				regex = " " + attr[1] + "=" + attr[2] + attr[3] + attr[2];
				regexlen = regex.length;
				fix = " " + attr[1] + "=" + attr[2] + fixedPath + attr[2];
				pos2 = tag.search(new RegExp(dojo.string.escapeRegExp(regex)));
			}
			str += tagFix + tag;
			pos = 0; // reset for next mainloop
		}
		s = str+s;

		// cut out all script tags, push them into scripts array
		match = []; var tmp = [];
		while(match){
			match = s.match(/<script([^>]*)>([\s\S]*?)<\/script>/i);
			if(!match){ break; }
			if(match[1]){
				attr = match[1].match(/src=(['"]?)([^"']*)\1/i);
				if(attr){
					// remove a dojo.js or dojo.js.uncompressed.js from remoteScripts
					// we declare all files with dojo.js as bad, regardless of folder
					var tmp = attr[2].search(/.*(\bdojo\b(?:\.uncompressed)?\.js)$/);
					if(tmp > -1){
						dojo.debug("Security note! inhibit:"+attr[2]+" from  beeing loaded again.");
					}else{
						remoteScripts.push(attr[2]);
					}
				}
			}
			if(match[2]){
				// strip out all djConfig variables from script tags nodeValue
				// this is ABSOLUTLY needed as reinitialize djConfig after dojo is initialised
				// makes a dissaster greater than Titanic, update remove writeIncludes() to
				var sc = match[2].replace(/(?:var )?\bdjConfig\b(?:[\s]*=[\s]*\{[^}]+\}|\.[\w]*[\s]*=[\s]*[^;\n]*)?;?|dojo\.hostenv\.writeIncludes\(\s*\);?/g, "");
				if(!sc){ continue; }

				// cut out all dojo.require (...) calls, if we have execute 
				// scripts false widgets dont get there require calls
				// does suck out possible widgetpackage registration as well
				tmp = [];
				while(tmp && requires.length<100){
					tmp = sc.match(/dojo\.(?:(?:require(?:After)?(?:If)?)|(?:widget\.(?:manager\.)?registerWidgetPackage)|(?:(?:hostenv\.)?setModulePrefix))\((['"]).*?\1\)\s*;?/);
					if(!tmp){ break;}
					requires.push(tmp[0]);
					sc = sc.replace(tmp[0], "");
				}
				scripts.push(sc);
			}
			s = s.replace(/<script[^>]*>[\s\S]*?<\/script>/i, "");
		}

		// scan for scriptScope in html eventHandlers and replace with link to this pane
		if(this.executeScripts){
			var regex = /(<[a-zA-Z][a-zA-Z0-9]*\s[^>]*\S=(['"])[^>]*[^\.\]])scriptScope([^>]*>)/;
			var pos = 0;var str = "";match = [];var cit = "";
			while(pos > -1){
				pos = s.search(regex);
				if(pos > -1){
					cit = ((RegExp.$2=="'") ? '"': "'");
					str += s.substring(0, pos);
					s = s.substr(pos).replace(regex, "$1dojo.widget.byId("+ cit + this.widgetId + cit + ").scriptScope$3");
				}
			}
			s = str + s;
		}

		// cut out all <link rel="stylesheet" href="..">
		match = [];
		while(match){
			match = s.match(/<link ([^>]*rel=['"]?stylesheet['"]?[^>]*)>/i);
			if(!match){ break; }
			attr = match[1].match(/href=(['"]?)([^'">]*)\1/i);
			if(attr){
				linkStyles.push(attr[2]);
			}
			s = s.replace(new RegExp(match[0]), "");
		}

		return {"xml": s, // Object
			"styles": styles,
			"linkStyles": linkStyles,
			"titles": titles,
			"requires": 	requires,
			"scripts": scripts,
			"remoteScripts": remoteScripts,
			"url": url};
	},

	
	_setContent: function(/*String*/ xml){
		// summary: 
		//		private internal function without path regExpCheck and no onLoad calls aftervards

		// remove old children from current content
		this.destroyChildren();

		// remove old stylenodes from HEAD
		if(this._remoteStyles){
			for(var i = 0; i < this._remoteStyles.length; i++){
				if(this._remoteStyles[i] && this._remoteStyles.parentNode){
					this._remoteStyles[i].parentNode.removeChild(this._remoteStyles[i]);
				}
			}
			this._remoteStyles = null;
		}

		var node = this.containerNode || this.domNode;
		try{
			if(typeof xml != "string"){
				node.innerHTML = "";
				node.appendChild(xml);
			}else{
				node.innerHTML = xml;
			}
		} catch(e){
			e = "Could'nt load content:"+e;
			this._handleDefaults(e, "onContentError");
		}
	},

	setContent: function(/*String*/ data){
		// summary:
		// 	Destroys old content and setting new content, and possibly initialize any widgets within 'data'

		if(this._callOnUnLoad){ // this tells a remote script clean up after itself
			this.onUnLoad();
		}
		this._callOnUnLoad = true;

		if(!data || dojo.dom.isNode(data)){
			// if we do a clean using setContent(""); or setContent(#node) bypass all parseing, extractContent etc
			this._setContent(data);
			this.onResized();
			this.onLoad();
		}else{
			// need to run splitAndFixPaths? ie. manually setting content
			 if((!data.xml)&&(this.adjustPaths)){
				data = this.splitAndFixPaths(data);
			}
			if(this.extractContent) {
				var matches = data.xml.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
				if(matches) { data.xml = matches[1]; }
			}
			// insert styleNodes, from <style>....
			for(var i = 0; i < data.styles.length; i++){
				if(i==0){ 
					this._remoteStyles = []; 
				}
				this._remoteStyles.push(dojo.style.insertCssText(data.styles[i]));
			}
			// insert styleNodes, from <link href="...">
			for(var i = 0; i < data.linkStyles.length; i++){
				if(i==0){ 
					this._remoteStyles = []; 
				}
				this._remoteStyles.push(dojo.style.insertCssFile(data.linkStyles[i]));
			}
			this._setContent(data.xml);

			if(this.parseContent){
				for(var i = 0; i < data.requires.length; i++){
					try{ 
						eval(data.requires[i]);
					} catch(e){
						this._handleDefaults(e, "onContentError", true);
					}
				}
			}
			// need to allow async load, Xdomain uses it
			// is inline function because we cant send args to addOnLoad function
			var _self = this;
			function asyncParse(){
				if(_self.executeScripts){
					_self._executeScripts(data);
				}

				if(_self.parseContent){
					var node = _self.containerNode || _self.domNode;
					var parser = new dojo.xml.Parse();
					var frag = parser.parseElement(node, null, true);
					// createSubComponents not createComponents because frag has already been created
					dojo.widget.getParser().createSubComponents(frag, _self);
				}

				_self.onResized();
				_self.onLoad();
			}
			// try as long as possible to make setContent sync call
			if(dojo.hostenv.isXDomain && data.requires.length){
				dojo.addOnLoad(asyncParse);
			}else{
				asyncParse();
			}
		}
	},

	// Generate pane content from given java function
	setHandler: function(handler) {
		var fcn = dojo.lang.isFunction(handler) ? handler : window[handler];
		if(!dojo.lang.isFunction(fcn)) {
			// FIXME: needs testing! somebody with java knowledge needs to try this
			this._handleDefaults("Unable to set handler, '" + handler + "' not a function.", "onExecError", true);
			return;
		}
		this.handler = function() {
			return fcn.apply(this, arguments);
		}
	},

	_runHandler: function() {
		if(dojo.lang.isFunction(this.handler)) {
			this.handler(this, this.domNode);
			return false;
		}
		return true;
	},

	_executeScripts: function(data) {
		// do remoteScripts first
		var self = this;
		for(var i = 0; i < data.remoteScripts.length; i++){
			dojo.io.bind({
				"url": data.remoteScripts[i],
				"useCash":	this.cacheContent,
				"load":     function(type, scriptStr){
						dojo.lang.hitch(self, data.scripts.push(scriptStr));
				},
				"error":    function(type, error){
						self._handleDefaults.call(self, type + " downloading remote script", "onExecError", true);
				},
				"mimetype": "text/plain",
				"sync":     true
			});
		}

		var scripts = "";
		for(var i = 0; i < data.scripts.length; i++){
			scripts += data.scripts[i];
		}

		try{
			// initialize a new anonymous container for our script, dont make it part of this widgets scope chain
			// instead send in a variable that points to this widget, usefull to connect events to onLoad, onUnLoad etc..
			this.scriptScope = null;
			this.scriptScope = new (new Function('_container_', scripts+'; return this;'))(self);
		}catch(e){
			this._handleDefaults("Error running scripts from content:\n"+e, "onExecError", true);
		}
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:ContentPane");

dojo.provide("dojo.dnd.HtmlDragMove");
dojo.provide("dojo.dnd.HtmlDragMoveSource");
dojo.provide("dojo.dnd.HtmlDragMoveObject");
dojo.require("dojo.dnd.*");

dojo.dnd.HtmlDragMoveSource = function(node, type){
	dojo.dnd.HtmlDragSource.call(this, node, type);
}
dojo.inherits(dojo.dnd.HtmlDragMoveSource, dojo.dnd.HtmlDragSource);
dojo.lang.extend(dojo.dnd.HtmlDragMoveSource, {
	onDragStart: function(){
		var dragObj =  new dojo.dnd.HtmlDragMoveObject(this.dragObject, this.type);
		if (this.constrainToContainer) {
			dragObj.constrainTo(this.constrainingContainer);
		}
		return dragObj;
	},
	/*
	 * see dojo.dnd.HtmlDragSource.onSelected
	 */
	onSelected: function() {
		for (var i=0; i<this.dragObjects.length; i++) {
			dojo.dnd.dragManager.selectedSources.push(new dojo.dnd.HtmlDragMoveSource(this.dragObjects[i]));
		}
	}
});

dojo.dnd.HtmlDragMoveObject = function(node, type){
	dojo.dnd.HtmlDragObject.call(this, node, type);
}
dojo.inherits(dojo.dnd.HtmlDragMoveObject, dojo.dnd.HtmlDragObject);
dojo.lang.extend(dojo.dnd.HtmlDragMoveObject, {
	onDragEnd: function(e){
		// shortly the browser will fire an onClick() event,
		// but since this was really a drag, just squelch it
		dojo.event.connect(this.domNode, "onclick", this, "squelchOnClick");
	},
	onDragStart: function(e){
		dojo.html.clearSelection();

		this.dragClone = this.domNode;

		this.scrollOffset = dojo.html.getScrollOffset();
		this.dragStartPosition = dojo.style.getAbsolutePosition(this.domNode, true);
		
		this.dragOffset = {y: this.dragStartPosition.y - e.pageY,
			x: this.dragStartPosition.x - e.pageX};

		this.containingBlockPosition = this.domNode.offsetParent ? 
			dojo.style.getAbsolutePosition(this.domNode.offsetParent, true) : {x:0, y:0};

		this.dragClone.style.position = "absolute";

		if (this.constrainToContainer) {
			this.constraints = this.getConstraints();
		}
	},
	/**
	 * Set the position of the drag node.  (x,y) is relative to <body>.
	 */
	setAbsolutePosition: function(x, y){
		// The drag clone is attached to it's constraining container so offset for that
		if(!this.disableY) { this.domNode.style.top = (y-this.containingBlockPosition.y) + "px"; }
		if(!this.disableX) { this.domNode.style.left = (x-this.containingBlockPosition.x) + "px"; }
	}
});

dojo.provide("dojo.widget.ResizeHandle");
dojo.provide("dojo.widget.html.ResizeHandle");

dojo.require("dojo.widget.*");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.event");

dojo.widget.html.ResizeHandle = function(){
	dojo.widget.HtmlWidget.call(this);
}

dojo.inherits(dojo.widget.html.ResizeHandle, dojo.widget.HtmlWidget);

dojo.lang.extend(dojo.widget.html.ResizeHandle, {
	widgetType: "ResizeHandle",

	isSizing: false,
	startPoint: null,
	startSize: null,
	minSize: null,

	targetElmId: '',

	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlResizeHandle.css"),
	templateString: '<div class="dojoHtmlResizeHandle"><div></div></div>',

	postCreate: function(){
		dojo.event.connect(this.domNode, "onmousedown", this, "beginSizing");
	},

	beginSizing: function(e){
		if (this.isSizing){ return false; }

		// get the target dom node to adjust.  targetElmId can refer to either a widget or a simple node
		this.targetWidget = dojo.widget.byId(this.targetElmId);
		this.targetDomNode = this.targetWidget ? this.targetWidget.domNode : dojo.byId(this.targetElmId);
		if (!this.targetDomNode){ return; }

		this.isSizing = true;
		this.startPoint  = {'x':e.clientX, 'y':e.clientY};
		this.startSize  = {'w':dojo.style.getOuterWidth(this.targetDomNode), 'h':dojo.style.getOuterHeight(this.targetDomNode)};

		dojo.event.kwConnect({
			srcObj: document.body, 
			srcFunc: "onmousemove",
			targetObj: this,
			targetFunc: "changeSizing",
			rate: 25
		});
		dojo.event.connect(document.body, "onmouseup", this, "endSizing");

		e.preventDefault();
	},

	changeSizing: function(e){
		// On IE, if you move the mouse above/to the left of the object being resized,
		// sometimes clientX/Y aren't set, apparently.  Just ignore the event.
		try{
			if(!e.clientX  || !e.clientY){ return; }
		}catch(e){
			// sometimes you get an exception accessing above fields...
			return;
		}
		var dx = this.startPoint.x - e.clientX;
		var dy = this.startPoint.y - e.clientY;
		
		var newW = this.startSize.w - dx;
		var newH = this.startSize.h - dy;

		// minimum size check
		if (this.minSize) {
			if (newW < this.minSize.w) {
				newW = dojo.style.getOuterWidth(this.targetDomNode);
			}
			if (newH < this.minSize.h) {
				newH = dojo.style.getOuterHeight(this.targetDomNode);
			}
		}
		
		if(this.targetWidget){
			this.targetWidget.resizeTo(newW, newH);
		}else{
			dojo.style.setOuterWidth(this.targetDomNode, newW);
			dojo.style.setOuterHeight(this.targetDomNode, newH);
		}
		
		e.preventDefault();
	},

	endSizing: function(e){
		dojo.event.disconnect(document.body, "onmousemove", this, "changeSizing");
		dojo.event.disconnect(document.body, "onmouseup", this, "endSizing");

		this.isSizing = false;
	}


});

dojo.widget.tags.addParseTreeHandler("dojo:ResizeHandle");

dojo.provide("dojo.widget.FloatingPane");
dojo.provide("dojo.widget.html.FloatingPane");

//
// this widget provides a window-like floating pane
//

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

dojo.widget.html.FloatingPane = function(){
	dojo.widget.html.ContentPane.call(this);
}

dojo.inherits(dojo.widget.html.FloatingPane, dojo.widget.html.ContentPane);

dojo.lang.extend(dojo.widget.html.FloatingPane, {
	widgetType: "FloatingPane",

	// Constructor arguments
	title: '',
	iconSrc: '',
	hasShadow: false,
	constrainToContainer: false,
	taskBarId: "",
	resizable: true,
	titleBarDisplay: "fancy",

	windowState: "normal",
	displayCloseAction: false,
	displayMinimizeAction: false,
	displayMaximizeAction: false,

	maxTaskBarConnectAttempts: 5,
	taskBarConnectAttempts: 0,

	templatePath: dojo.uri.dojoUri("src/widget/templates/HtmlFloatingPane.html"),
	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlFloatingPane.css"),

	drag: null,

	fillInTemplate: function(args, frag){
		// Copy style info from input node to output node
		var source = this.getFragNodeRef(frag);
		dojo.html.copyStyle(this.domNode, source);

		// necessary for safari, khtml (for computing width/height)
		document.body.appendChild(this.domNode);

		// if display:none then state=minimized, otherwise state=normal
		if(!this.isShowing()){
			this.windowState="minimized";
		}

		// <img src=""> can hang IE!  better get rid of it
		if(this.iconSrc==""){
			dojo.dom.removeNode(this.titleBarIcon);
		}else{
			this.titleBarIcon.src = this.iconSrc.toString();// dojo.uri.Uri obj req. toString()
		}

		if(this.titleBarDisplay!="none"){	
			this.titleBar.style.display="";
			dojo.html.disableSelection(this.titleBar);

			this.titleBarIcon.style.display = (this.iconSrc=="" ? "none" : "");

			this.minimizeAction.style.display = (this.displayMinimizeAction ? "" : "none");
			this.maximizeAction.style.display= 
				(this.displayMaximizeAction && this.windowState!="maximized" ? "" : "none");
			this.restoreAction.style.display= 
				(this.displayMaximizeAction && this.windowState=="maximized" ? "" : "none");
			this.closeAction.style.display= (this.displayCloseAction ? "" : "none");

			this.drag = new dojo.dnd.HtmlDragMoveSource(this.domNode);	
			if (this.constrainToContainer) {
				this.drag.constrainTo();
			}
			this.drag.setDragHandle(this.titleBar);

			var self = this;

			dojo.event.topic.subscribe("dragMove",
				function (info){
					if (info.source.domNode == self.domNode){
						dojo.event.topic.publish('floatingPaneMove', { source: self } );
					}
				}
			);

		}

		if(this.resizable){
			this.resizeBar.style.display="";
			var rh = dojo.widget.createWidget("ResizeHandle", {targetElmId: this.widgetId, id:this.widgetId+"_resize"});
			this.resizeBar.appendChild(rh.domNode);
		}

		// add a drop shadow
		if(this.hasShadow){
			this.shadow=new dojo.html.shadow(this.domNode);
		}

		// Prevent IE bleed-through problem
		this.bgIframe = new dojo.html.BackgroundIframe(this.domNode);

		if( this.taskBarId ){
			this.taskBarSetup();
		}

		if (dojo.hostenv.post_load_) {
			this.setInitialWindowState();
		} else {
			dojo.addOnLoad(this, "setInitialWindowState");
		}

		// counteract body.appendChild above
		document.body.removeChild(this.domNode);

		dojo.widget.html.FloatingPane.superclass.fillInTemplate.call(this, args, frag);
	},

	postCreate: function(){
		if(this.isShowing()){
			this.width=-1;	// force resize
			this.resizeTo(dojo.style.getOuterWidth(this.domNode), dojo.style.getOuterHeight(this.domNode));
		}
	},

	maximizeWindow: function(evt) {
		this.previous={
			width: dojo.style.getOuterWidth(this.domNode) || this.width,
			height: dojo.style.getOuterHeight(this.domNode) || this.height,
			left: this.domNode.style.left,
			top: this.domNode.style.top,
			bottom: this.domNode.style.bottom,
			right: this.domNode.style.right
		};
		this.domNode.style.left =
			dojo.style.getPixelValue(this.domNode.parentNode, "padding-left", true) + "px";
		this.domNode.style.top =
			dojo.style.getPixelValue(this.domNode.parentNode, "padding-top", true) + "px";

		if ((this.domNode.parentNode.nodeName.toLowerCase() == 'body')) {
			this.resizeTo(
				dojo.html.getViewportWidth()-dojo.style.getPaddingWidth(document.body),
				dojo.html.getViewportHeight()-dojo.style.getPaddingHeight(document.body)
			);
		} else {
			this.resizeTo(
				dojo.style.getContentWidth(this.domNode.parentNode),
				dojo.style.getContentHeight(this.domNode.parentNode)
			);
		}
		this.maximizeAction.style.display="none";
		this.restoreAction.style.display="";
		this.windowState="maximized";
	},

	minimizeWindow: function(evt) {
		this.hide();
		this.windowState = "minimized";
	},

	restoreWindow: function(evt) {
		if (this.windowState=="minimized") {
			this.show() 
		} else {
			for(var attr in this.previous){
				this.domNode.style[attr] = this.previous[attr];
			}
			this.resizeTo(this.previous.width, this.previous.height);
			this.previous=null;

			this.restoreAction.style.display="none";
			this.maximizeAction.style.display=this.displayMaximizeAction ? "" : "none";
		}

		this.windowState="normal";
	},

	closeWindow: function(evt) {
		dojo.dom.removeNode(this.domNode);
		this.destroy();
	},

	onMouseDown: function(evt) {
		this.bringToTop();
	},

	bringToTop: function() {
		var floatingPanes= dojo.widget.manager.getWidgetsByType(this.widgetType);
		var windows = [];
		for (var x=0; x<floatingPanes.length; x++) {
			if (this.widgetId != floatingPanes[x].widgetId) {
					windows.push(floatingPanes[x]);
			}
		}

		windows.sort(function(a,b) {
			return a.domNode.style.zIndex - b.domNode.style.zIndex;
		});
		
		windows.push(this);

		var floatingPaneStartingZ = 100;
		for (x=0; x<windows.length;x++) {
			windows[x].domNode.style.zIndex = floatingPaneStartingZ + x;
		}
	},

	setInitialWindowState: function() {
		if (this.windowState == "maximized") {
			this.maximizeWindow();
			this.show();
			return;
		}

		if (this.windowState=="normal") {
			this.show();
			return;
		}

		if (this.windowState=="minimized") {
			this.hide();
			return;
		}

		this.windowState="minimized";
	},

	// add icon to task bar, connected to me
	taskBarSetup: function() {
		var taskbar = dojo.widget.getWidgetById(this.taskBarId);
		if (!taskbar){
			if (this.taskBarConnectAttempts <  this.maxTaskBarConnectAttempts) {
				dojo.lang.setTimeout(this, this.taskBarSetup, 50);
				this.taskBarConnectAttempts++;
			} else {
				dojo.debug("Unable to connect to the taskBar");
			}
			return;
		}
		taskbar.addChild(this);
	},

	show: function(){
		dojo.widget.html.FloatingPane.superclass.show.apply(this, arguments);
		this.bringToTop();
	},

	onShow: function(){
		dojo.widget.html.FloatingPane.superclass.onShow.call(this);
		this.resizeTo(dojo.style.getOuterWidth(this.domNode), dojo.style.getOuterHeight(this.domNode));
	},

	// This is called when the user adjusts the size of the floating pane
	resizeTo: function(w, h){
		dojo.style.setOuterWidth(this.domNode, w);
		dojo.style.setOuterHeight(this.domNode, h);

		dojo.html.layout(this.domNode,
			[
			  {domNode: this.titleBar, layoutAlign: "top"},
			  {domNode: this.resizeBar, layoutAlign: "bottom"},
			  {domNode: this.containerNode, layoutAlign: "client"}
			] );

		// If any of the children have layoutAlign specified, obey it
		dojo.html.layout(this.containerNode, this.children, "top-bottom");
		
		this.bgIframe.onResized();
		if(this.shadow){ this.shadow.size(w, h); }
		this.onResized();
	},

	checkSize: function() {
		// checkSize() is called when the user has resized the browser window,
		// but that doesn't affect this widget (or this widget's children)
		// so it can be safely ignored...
		// TODO: unless we are maximized.  then we should resize ourself.
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:FloatingPane");

/**
 * ====================================================================
 * About
 * ====================================================================
 * Sarissa is an ECMAScript library acting as a cross-browser wrapper for native XML APIs.
 * The library supports Gecko based browsers like Mozilla and Firefox,
 * Internet Explorer (5.5+ with MSXML3.0+), Konqueror, Safari and a little of Opera
 * @version 0.9.7
 * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
 * ====================================================================
 * Licence
 * ====================================================================
 * Sarissa is free software distributed under the GNU GPL version 2 (see <a href="gpl.txt">gpl.txt</a>) or higher, 
 * GNU LGPL version 2.1 (see <a href="lgpl.txt">lgpl.txt</a>) or higher and Apache Software License 2.0 or higher 
 * (see <a href="asl.txt">asl.txt</a>). This means you can choose one of the three and use that if you like. If 
 * you make modifications under the ASL, i would appreciate it if you submitted those.
 * In case your copy of Sarissa does not include the license texts, you may find
 * them online in various formats at <a href="http://www.gnu.org">http://www.gnu.org</a> and 
 * <a href="http://www.apache.org">http://www.apache.org</a>.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 */
dojo.provide("sarissa.core");

/**
 * <p>Sarissa is a utility class. Provides "static" methods for DOMDocument and 
 * XMLHTTP objects, DOM Node serializatrion to XML strings and other goodies.</p>
 * @constructor
 */
function Sarissa(){};
Sarissa.PARSED_OK = "Document contains no parsing errors";
Sarissa.PARSED_EMPTY = "Document is empty"
Sarissa.PARSED_UNKNOWN_ERROR = "Not well-formed or other error";
var _sarissa_iNsCounter = 0;
var _SARISSA_IEPREFIX4XSLPARAM = "";
var _SARISSA_HAS_DOM_IMPLEMENTATION = document.implementation && true;
var _SARISSA_HAS_DOM_CREATE_DOCUMENT = _SARISSA_HAS_DOM_IMPLEMENTATION && document.implementation.createDocument;
var _SARISSA_HAS_DOM_FEATURE = _SARISSA_HAS_DOM_IMPLEMENTATION && document.implementation.hasFeature;
var _SARISSA_IS_MOZ = _SARISSA_HAS_DOM_CREATE_DOCUMENT && _SARISSA_HAS_DOM_FEATURE;
var _SARISSA_IS_SAFARI = (navigator.userAgent && navigator.vendor && (navigator.userAgent.toLowerCase().indexOf("applewebkit") != -1 || navigator.vendor.indexOf("Apple") != -1));
var _SARISSA_IS_IE = document.all && window.ActiveXObject && navigator.userAgent.toLowerCase().indexOf("msie") > -1  && navigator.userAgent.toLowerCase().indexOf("opera") == -1;
if(window && (!window.Node || !window.Node.ELEMENT_NODE)){
    window.Node = {ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3, CDATA_SECTION_NODE: 4, ENTITY_REFERENCE_NODE: 5,  ENTITY_NODE: 6, PROCESSING_INSTRUCTION_NODE: 7, COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10, DOCUMENT_FRAGMENT_NODE: 11, NOTATION_NODE: 12};
};

// IE initialization
if(_SARISSA_IS_IE){
    // for XSLT parameter names, prefix needed by IE
    _SARISSA_IEPREFIX4XSLPARAM = "xsl:";
    // used to store the most recent ProgID available out of the above
    var _SARISSA_DOM_PROGID = "";
    var _SARISSA_XMLHTTP_PROGID = "";
    var _SARISSA_DOM_XMLWRITER = "";
    /**
     * Called when the Sarissa_xx.js file is parsed, to pick most recent
     * ProgIDs for IE, then gets destroyed.
     * @private
     * @param idList an array of MSXML PROGIDs from which the most recent will be picked for a given object
     * @param enabledList an array of arrays where each array has two items; the index of the PROGID for which a certain feature is enabled
     */
    Sarissa.pickRecentProgID = function (idList){
        // found progID flag
        var bFound = false;
        for(var i=0; i < idList.length && !bFound; i++){
            try{
                var oDoc = new ActiveXObject(idList[i]);
                o2Store = idList[i];
                bFound = true;
            }catch (objException){
                // trap; try next progID
            };
        };
        if (!bFound)
            throw "Could not retreive a valid progID of Class: " + idList[idList.length-1]+". (original exception: "+e+")";
        idList = null;
        return o2Store;
    };
    // pick best available MSXML progIDs
    _SARISSA_DOM_PROGID = null;
    _SARISSA_THREADEDDOM_PROGID = null;
    _SARISSA_XSLTEMPLATE_PROGID = null;
    _SARISSA_XMLHTTP_PROGID = null;
    if(!window.XMLHttpRequest){
         
        /**
         * Emulate XMLHttpRequest
         * @constructor
         */
        XMLHttpRequest = function() {
            if(!_SARISSA_XMLHTTP_PROGID){
                _SARISSA_XMLHTTP_PROGID = Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"]);
            };
            return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
        };
    };
    // we dont need this anymore
    //============================================
    // Factory methods (IE)
    //============================================
    // see non-IE version
    Sarissa.getDomDocument = function(sUri, sName){
        if(!_SARISSA_DOM_PROGID){
            _SARISSA_DOM_PROGID = Sarissa.pickRecentProgID(["Msxml2.DOMDocument.5.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XMLDOM"]);
        };
        var oDoc = new ActiveXObject(_SARISSA_DOM_PROGID);
        // if a root tag name was provided, we need to load it in the DOM object
        if (sName){
            // create an artifical namespace prefix 
            // or reuse existing prefix if applicable
            var prefix = "";
            if(sUri){
                if(sName.indexOf(":") > 1){
                    prefix = sName.substring(0, sName.indexOf(":"));
                    sName = sName.substring(sName.indexOf(":")+1); 
                }else{
                    prefix = "a" + (_sarissa_iNsCounter++);
                };
            };
            // use namespaces if a namespace URI exists
            if(sUri){
                oDoc.loadXML('<' + prefix+':'+sName + " xmlns:" + prefix + "=\"" + sUri + "\"" + " />");
            } else {
                oDoc.loadXML('<' + sName + " />");
            };
        };
        return oDoc;
    };
    // see non-IE version   
    Sarissa.getParseErrorText = function (oDoc) {
        var parseErrorText = Sarissa.PARSED_OK;
        if(oDoc.parseError.errorCode != 0){
            parseErrorText = "XML Parsing Error: " + oDoc.parseError.reason + 
                "\nLocation: " + oDoc.parseError.url + 
                "\nLine Number " + oDoc.parseError.line + ", Column " + 
                oDoc.parseError.linepos + 
                ":\n" + oDoc.parseError.srcText +
                "\n";
            for(var i = 0;  i < oDoc.parseError.linepos;i++){
                parseErrorText += "-";
            };
            parseErrorText +=  "^\n";
        }
        else if(oDoc.documentElement == null){
            parseErrorText = Sarissa.PARSED_EMPTY;
        };
        return parseErrorText;
    };
    // see non-IE version
    Sarissa.setXpathNamespaces = function(oDoc, sNsSet) {
        oDoc.setProperty("SelectionLanguage", "XPath");
        oDoc.setProperty("SelectionNamespaces", sNsSet);
    };   
    /**
     * Basic implementation of Mozilla's XSLTProcessor for IE. 
     * Reuses the same XSLT stylesheet for multiple transforms
     * @constructor
     */
    XSLTProcessor = function(){
        if(!_SARISSA_XSLTEMPLATE_PROGID){
            _SARISSA_XSLTEMPLATE_PROGID = Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.5.0", "Msxml2.XSLTemplate.4.0", "MSXML2.XSLTemplate.3.0"]);
        };
        this.template = new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
        this.processor = null;
    };
    /**
     * Impoprts the given XSLT DOM and compiles it to a reusable transform
     * @argument xslDoc The XSLT DOMDocument to import
     */
    XSLTProcessor.prototype.importStylesheet = function(xslDoc){
        if(!_SARISSA_THREADEDDOM_PROGID){
            _SARISSA_THREADEDDOM_PROGID = Sarissa.pickRecentProgID(["Msxml2.FreeThreadedDOMDocument.5.0", "MSXML2.FreeThreadedDOMDocument.4.0", "MSXML2.FreeThreadedDOMDocument.3.0"]);
            _SARISSA_DOM_XMLWRITER = Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.5.0", "Msxml2.MXXMLWriter.4.0", "Msxml2.MXXMLWriter.3.0", "MSXML2.MXXMLWriter", "MSXML.MXXMLWriter", "Microsoft.XMLDOM"]);
        };
        // convert stylesheet to free threaded
        var converted = new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
        // make included stylesheets work if loaded from uri
        if(xslDoc.url){
            converted.async = false;
            converted.load(xslDoc.url);
        }
        else{
            converted.loadXML(xslDoc.xml);
        }
        this.template.stylesheet = converted;
        this.processor = this.template.createProcessor();
        // (re)set default param values
        this.paramsSet = new Array();
    };
    /**
     * Transform the given XML DOM
     * @argument sourceDoc The XML DOMDocument to transform
     * @return The transformation result as a DOM Document
     */
    XSLTProcessor.prototype.transformToDocument = function(sourceDoc){
        this.processor.input = sourceDoc;
        var outDoc = new ActiveXObject(_SARISSA_DOM_XMLWRITER);
        this.processor.output = outDoc; 
        this.processor.transform();
        var oDoc = new ActiveXObject(_SARISSA_DOM_PROGID);
        oDoc.loadXML(outDoc.output+"");
        return oDoc;
        /*
        this.processor.input = sourceDoc;
        var outDoc = Sarissa.getDomDocument();
        this.processor.output = outDoc; 
        this.processor.transform();
        return outDoc;*/
    };
    /**
     * Set global XSLT parameter of the imported stylesheet
     * @argument nsURI The parameter namespace URI
     * @argument name The parameter base name
     * @argument value The new parameter value
     */
    XSLTProcessor.prototype.setParameter = function(nsURI, name, value){
            /* nsURI is optional but cannot be null */
        if(nsURI){
            this.processor.addParameter(name, value, nsURI);
        }else{
            this.processor.addParameter(name, value);
        };
        /* update updated params for getParameter */
        if(!this.paramsSet[""+nsURI]){
            this.paramsSet[""+nsURI] = new Array();
        };
        this.paramsSet[""+nsURI][name] = value;
    };
    /**
     * Gets a parameter if previously set by setParameter. Returns null
     * otherwise
     * @argument name The parameter base name
     * @argument value The new parameter value
     * @return The parameter value if reviously set by setParameter, null otherwise
     */
    XSLTProcessor.prototype.getParameter = function(nsURI, name){
        nsURI = nsURI || "";
        if(this.paramsSet[nsURI] && this.paramsSet[nsURI][name]){
            return this.paramsSet[nsURI][name];
        }else{
            return null;
        };
    };
}else{ /* end IE initialization, try to deal with real browsers now ;-) */
    if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
        /**
         * <p>Ensures the document was loaded correctly, otherwise sets the
         * parseError to -1 to indicate something went wrong. Internal use</p>
         * @private
         */
        Sarissa.__handleLoad__ = function(oDoc){
            Sarissa.__setReadyState__(oDoc, 4);
        };
        /**
        * <p>Attached by an event handler to the load event. Internal use.</p>
        * @private
        */
        _sarissa_XMLDocument_onload = function(){
            Sarissa.__handleLoad__(this);
        };
        /**
         * <p>Sets the readyState property of the given DOM Document object.
         * Internal use.</p>
         * @private
         * @argument oDoc the DOM Document object to fire the
         *          readystatechange event
         * @argument iReadyState the number to change the readystate property to
         */
        Sarissa.__setReadyState__ = function(oDoc, iReadyState){
            oDoc.readyState = iReadyState;
            oDoc.readystate = iReadyState;
            if (oDoc.onreadystatechange != null && typeof oDoc.onreadystatechange == "function")
                oDoc.onreadystatechange();
        };
        Sarissa.getDomDocument = function(sUri, sName){
            var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
            if(!oDoc.onreadystatechange){
            
                /**
                * <p>Emulate IE's onreadystatechange attribute</p>
                */
                oDoc.onreadystatechange = null;
            };
            if(!oDoc.readyState){
                /**
                * <p>Emulates IE's readyState property, which always gives an integer from 0 to 4:</p>
                * <ul><li>1 == LOADING,</li>
                * <li>2 == LOADED,</li>
                * <li>3 == INTERACTIVE,</li>
                * <li>4 == COMPLETED</li></ul>
                */
                oDoc.readyState = 0;
            };
            oDoc.addEventListener("load", _sarissa_XMLDocument_onload, false);
            return oDoc;
        };
        if(window.XMLDocument){
        
        //if(window.XMLDocument) , now mainly for opera  
        }// TODO: check if the new document has content before trying to copynodes, check  for error handling in DOM 3 LS
        else if(document.implementation && document.implementation.hasFeature && document.implementation.hasFeature('LS', '3.0')){
        
            /**
            * <p>Factory method to obtain a new DOM Document object</p>
            * @argument sUri the namespace of the root node (if any)
            * @argument sUri the local name of the root node (if any)
            * @returns a new DOM Document
            */
            Sarissa.getDomDocument = function(sUri, sName){
                var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
                return oDoc;
            };
        }
        else {
            Sarissa.getDomDocument = function(sUri, sName){
                var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
                // looks like safari does not create the root element for some unknown reason
                if(oDoc && (sUri || sName) && !oDoc.documentElement){
                    oDoc.appendChild(oDoc.createElementNS(sUri, sName));
                };
                return oDoc;
            };
        };
    };//if(_SARISSA_HAS_DOM_CREATE_DOCUMENT)
};
//==========================================
// Common stuff
//==========================================
if(!window.DOMParser){
    if(_SARISSA_IS_SAFARI){
        /*
            * DOMParser is a utility class, used to construct DOMDocuments from XML strings
        * @constructor
            */
            DOMParser = function() {
            };
        /** 
        * Construct a new DOM Document from the given XMLstring
        * @param sXml the given XML string
        * @param contentType the content type of the document the given string represents (one of text/xml, application/xml, application/xhtml+xml). 
        * @return a new DOM Document from the given XML string
        */
        DOMParser.prototype.parseFromString = function(sXml, contentType){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "data:text/xml;charset=utf-8," + encodeURIComponent(sXml), false);
            xmlhttp.send(null);
            return xmlhttp.responseXML;
        };
    }else if(Sarissa.getDomDocument && Sarissa.getDomDocument() && Sarissa.getDomDocument(null, "bar").xml){
        DOMParser = function() {
            };
        DOMParser.prototype.parseFromString = function(sXml, contentType){
            var doc = Sarissa.getDomDocument();
            doc.loadXML(sXml);
            return doc;
        };
	};
}else if(_SARISSA_IS_MOZ){
	/** 
		Workaround for bug in Mozilla: https://bugzilla.mozilla.org/show_bug.cgi?id=323612
		Brad Neuberg, bkn3@columbia.edu
	*/
	
	DOMParser.prototype.__parseFromString = DOMParser.prototype.parseFromString;
	DOMParser.prototype.parseFromString = function(sXml, contentType){
		// create our hidden iframe
		var iframe = document.createElement("iframe");
		iframe.setAttribute("src", "about:blank");
		iframe.style.position = "absolute";
		iframe.style.top = "-1000px";
		iframe.style.left = "-1000px";
			
		// get the document body; some XHTML doctypes don't have
		// a document.body
		var body = document.body;
		if(body == null || typeof body == "undefined"){
			body = document.getElementsByTagName("body")[0];
		}
		if(body == null || typeof body == "undefined"){
			var msg = "Sarissa programming error: You must wait for the page "
						+ "to fully load before using DOMParser.parseFromString "
						+ "to fix Mozilla bug 323612; set an onload handler.";
			throw msg;
		}
		body.appendChild(iframe);
			
		// get it's document object
		var doc = iframe.contentDocument;
		
		// save a reference to our string XML representation
		doc.__Sarissa_domXml__ = sXml;
		
		// execute our offending code
		doc.location.href = 
				'javascript:(function(){'
				+ ' document.__Sarissa_domXml__ = new DOMParser().parseFromString(document.__Sarissa_domXml__, "text/xml"); '	
				+ '})()';
			
		// get the results
		var domXml = doc.__Sarissa_domXml__;
		
		// clean up the iframe
		iframe.parentNode.removeChild(iframe);
		
		// copy over the custom new methods Sarissa
		// adds to an XMLDocument to emulate IE's
		// XPath behavior
		for(var i in XMLDocument.prototype){
			try{
				if(typeof domXml[i] == "undefined"){
					domXml[i] = XMLDocument.prototype[i];
				}
			}catch(e){
				// ignore "Not Implemented" exceptions; we don't
				// need properties that can't be copied since these
				// aren't Sarissa functions
			}
		}
			
		return domXml;
	};
};


if(!window.document.importNode && _SARISSA_IS_IE){
    try{
        /**
        * Implements importNode for the current window document in IE using innerHTML.
        * Testing showed that DOM was multiple times slower than innerHTML for this,
        * sorry folks. If you encounter trouble (who knows what IE does behind innerHTML)
        * please gimme a call.
        * @param oNode the Node to import
        * @param bChildren whether to include the children of oNode
        * @returns the imported node for further use
        */
        window.document.importNode = function(oNode, bChildren){
            var importNode = document.createElement("div");
            if(bChildren){
                importNode.innerHTML = new XMLSerializer().serializeToString(oNode);
            }else{
                importNode.innerHTML = new XMLSerializer().serializeToString(oNode.cloneNode(false));
            };
            return importNode.getElementsByTagName("*")[0];
        };
        }catch(e){};
};
if(!window.Sarissa.getParseErrorText){
    /**
     * <p>Returns a human readable description of the parsing error. Usefull
     * for debugging. Tip: append the returned error string in a &lt;pre&gt;
     * element if you want to render it.</p>
     * <p>Many thanks to Christian Stocker for the initial patch.</p>
     * @argument oDoc The target DOM document
     * @returns The parsing error description of the target Document in
     *          human readable form (preformated text)
     */
    Sarissa.getParseErrorText = function (oDoc){
        var parseErrorText = Sarissa.PARSED_OK;
        if(!oDoc.documentElement){
            parseErrorText = Sarissa.PARSED_EMPTY;
        }
        else if(oDoc.documentElement.tagName == "parsererror"){
            parseErrorText = oDoc.documentElement.firstChild.data;
            parseErrorText += "\n" +  oDoc.documentElement.firstChild.nextSibling.firstChild.data;
        }
        else if(oDoc.getElementsByTagName("parsererror").length > 0){
            var parsererror = oDoc.getElementsByTagName("parsererror")[0];
            parseErrorText = Sarissa.getText(parsererror, true)+"\n";
        }else if(oDoc.parseError && oDoc.parseError.errorCode != 0){
            parseErrorText = Sarissa.PARSED_UNKNOWN_ERROR;
        };
        return parseErrorText;
    };
};
Sarissa.getText = function(oNode, deep){
    var s = "";
    var nodes = oNode.childNodes;
    for(var i=0; i < nodes.length; i++){
        var node = nodes[i];
        var nodeType = node.nodeType;
        if(nodeType == Node.TEXT_NODE || nodeType == Node.CDATA_SECTION_NODE){
            s += node.data;
        }else if(deep == true
                    && (nodeType == Node.ELEMENT_NODE
                        || nodeType == Node.DOCUMENT_NODE
                        || nodeType == Node.DOCUMENT_FRAGMENT_NODE)){
            s += Sarissa.getText(node, true);
        };
    };
    return s;
};
if(!window.XMLSerializer 
    && Sarissa.getDomDocument 
    && Sarissa.getDomDocument("","foo", null).xml){
    /**
     * Utility class to serialize DOM Node objects to XML strings
     * @constructor
     */
    XMLSerializer = function(){};
    /**
     * Serialize the given DOM Node to an XML string
     * @param oNode the DOM Node to serialize
     */
    XMLSerializer.prototype.serializeToString = function(oNode) {
        return oNode.xml;
    };
};

/**
 * strips tags from a markup string
 */
Sarissa.stripTags = function (s) {
    return s.replace(/<[^>]+>/g,"");
};
/**
 * <p>Deletes all child nodes of the given node</p>
 * @argument oNode the Node to empty
 */
Sarissa.clearChildNodes = function(oNode) {
    // need to check for firstChild due to opera 8 bug with hasChildNodes
    while(oNode.firstChild){
        oNode.removeChild(oNode.firstChild);
    };
};
/**
 * <p> Copies the childNodes of nodeFrom to nodeTo</p>
 * <p> <b>Note:</b> The second object's original content is deleted before 
 * the copy operation, unless you supply a true third parameter</p>
 * @argument nodeFrom the Node to copy the childNodes from
 * @argument nodeTo the Node to copy the childNodes to
 * @argument bPreserveExisting whether to preserve the original content of nodeTo, default is false
 */
Sarissa.copyChildNodes = function(nodeFrom, nodeTo, bPreserveExisting) {
    if((!nodeFrom) || (!nodeTo)){
        throw "Both source and destination nodes must be provided";
    };
    if(!bPreserveExisting){
        Sarissa.clearChildNodes(nodeTo);
    };
    var ownerDoc = nodeTo.nodeType == Node.DOCUMENT_NODE ? nodeTo : nodeTo.ownerDocument;
    var nodes = nodeFrom.childNodes;
    if(/*(!_SARISSA_IS_IE) && */ownerDoc.importNode)  {
        for(var i=0;i < nodes.length;i++) {
            nodeTo.appendChild(ownerDoc.importNode(nodes[i], true));
        };
    }else{
        for(var i=0;i < nodes.length;i++) {
            nodeTo.appendChild(nodes[i].cloneNode(true));
        };
    };
};

/**
 * <p> Moves the childNodes of nodeFrom to nodeTo</p>
 * <p> <b>Note:</b> The second object's original content is deleted before 
 * the move operation, unless you supply a true third parameter</p>
 * @argument nodeFrom the Node to copy the childNodes from
 * @argument nodeTo the Node to copy the childNodes to
 * @argument bPreserveExisting whether to preserve the original content of nodeTo, default is
 */ 
Sarissa.moveChildNodes = function(nodeFrom, nodeTo, bPreserveExisting) {
    if((!nodeFrom) || (!nodeTo)){
        throw "Both source and destination nodes must be provided";
    };
    if(!bPreserveExisting){
        Sarissa.clearChildNodes(nodeTo);
    };
    var nodes = nodeFrom.childNodes;
    // if within the same doc, just move, else copy and delete
    if(nodeFrom.ownerDocument == nodeTo.ownerDocument){
        while(nodeFrom.firstChild){
            nodeTo.appendChild(nodeFrom.firstChild);
        };
    }else{
        var ownerDoc = nodeTo.nodeType == Node.DOCUMENT_NODE ? nodeTo : nodeTo.ownerDocument;
        if(ownerDoc.importNode /*&& (!_SARISSA_IS_IE)*/) {
           for(var i=0;i < nodes.length;i++) {
               nodeTo.appendChild(ownerDoc.importNode(nodes[i], true));
           };
        }else{
           for(var i=0;i < nodes.length;i++) {
               nodeTo.appendChild(nodes[i].cloneNode(true));
           };
        };
        Sarissa.clearChildNodes(nodeFrom);
    };
};

/** 
 * <p>Serialize any object to an XML string. All properties are serialized using the property name
 * as the XML element name. Array elements are rendered as <code>array-item</code> elements, 
 * using their index/key as the value of the <code>key</code> attribute.</p>
 * @argument anyObject the object to serialize
 * @argument objectName a name for that object
 * @return the XML serializationj of the given object as a string
 */
Sarissa.xmlize = function(anyObject, objectName, indentSpace){
    indentSpace = indentSpace?indentSpace:'';
    var s = indentSpace  + '<' + objectName + '>';
    var isLeaf = false;
    if(!(anyObject instanceof Object) || anyObject instanceof Number || anyObject instanceof String 
        || anyObject instanceof Boolean || anyObject instanceof Date){
        s += Sarissa.escape(""+anyObject);
        isLeaf = true;
    }else{
        s += "\n";
        var itemKey = '';
        var isArrayItem = anyObject instanceof Array;
        for(var name in anyObject){
            s += Sarissa.xmlize(anyObject[name], (isArrayItem?"array-item key=\""+name+"\"":name), indentSpace + "   ");
        };
        s += indentSpace;
    };
    return s += (objectName.indexOf(' ')!=-1?"</array-item>\n":"</" + objectName + ">\n");
};

/** 
 * Escape the given string chacters that correspond to the five predefined XML entities
 * @param sXml the string to escape
 */
Sarissa.escape = function(sXml){
    return sXml.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

/** 
 * Unescape the given string. This turns the occurences of the predefined XML 
 * entities to become the characters they represent correspond to the five predefined XML entities
 * @param sXml the string to unescape
 */
Sarissa.unescape = function(sXml){
    return sXml.replace(/&apos;/g,"'")
        .replace(/&quot;/g,"\"")
        .replace(/&gt;/g,">")
        .replace(/&lt;/g,"<")
        .replace(/&amp;/g,"&");
};
//   EOF
/**
 * ====================================================================
 * About
 * ====================================================================
 * Sarissa cross browser XML library - IE XPath Emulation 
 * @version 0.9.7
 * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
 *
 * This script emulates Internet Explorer's selectNodes and selectSingleNode
 * for Mozilla. Associating namespace prefixes with URIs for your XPath queries
 * is easy with IE's setProperty. 
 * USers may also map a namespace prefix to a default (unprefixed) namespace in the
 * source document with Sarissa.setXpathNamespaces
 *
 *
 * ====================================================================
 * Licence
 * ====================================================================
 * Sarissa is free software distributed under the GNU GPL version 2 (see <a href="gpl.txt">gpl.txt</a>) or higher, 
 * GNU LGPL version 2.1 (see <a href="lgpl.txt">lgpl.txt</a>) or higher and Apache Software License 2.0 or higher 
 * (see <a href="asl.txt">asl.txt</a>). This means you can choose one of the three and use that if you like. If 
 * you make modifications under the ASL, i would appreciate it if you submitted those.
 * In case your copy of Sarissa does not include the license texts, you may find
 * them online in various formats at <a href="http://www.gnu.org">http://www.gnu.org</a> and 
 * <a href="http://www.apache.org">http://www.apache.org</a>.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 */

dojo.provide("sarissa.xpath");

if(_SARISSA_HAS_DOM_FEATURE && document.implementation.hasFeature("XPath", "3.0")){
    /**
    * <p>SarissaNodeList behaves as a NodeList but is only used as a result to <code>selectNodes</code>,
    * so it also has some properties IEs proprietery object features.</p>
    * @private
    * @constructor
    * @argument i the (initial) list size
    */
    function SarissaNodeList(i){
        this.length = i;
    };
    /** <p>Set an Array as the prototype object</p> */
    SarissaNodeList.prototype = new Array(0);
    /** <p>Inherit the Array constructor </p> */
    SarissaNodeList.prototype.constructor = Array;
    /**
    * <p>Returns the node at the specified index or null if the given index
    * is greater than the list size or less than zero </p>
    * <p><b>Note</b> that in ECMAScript you can also use the square-bracket
    * array notation instead of calling <code>item</code>
    * @argument i the index of the member to return
    * @returns the member corresponding to the given index
    */
    SarissaNodeList.prototype.item = function(i) {
        return (i < 0 || i >= this.length)?null:this[i];
    };
    /**
    * <p>Emulate IE's expr property
    * (Here the SarissaNodeList object is given as the result of selectNodes).</p>
    * @returns the XPath expression passed to selectNodes that resulted in
    *          this SarissaNodeList
    */
    SarissaNodeList.prototype.expr = "";
    /** dummy, used to accept IE's stuff without throwing errors */
    XMLDocument.prototype.setProperty  = function(x,y){};
    /**
    * <p>Programmatically control namespace URI/prefix mappings for XPath
    * queries.</p>
    * <p>This method comes especially handy when used to apply XPath queries
    * on XML documents with a default namespace, as there is no other way
    * of mapping that to a prefix.</p>
    * <p>Using no namespace prefix in DOM Level 3 XPath queries, implies you
    * are looking for elements in the null namespace. If you need to look
    * for nodes in the default namespace, you need to map a prefix to it
    * first like:</p>
    * <pre>Sarissa.setXpathNamespaces(oDoc, &quot;xmlns:myprefix=&amp;aposhttp://mynsURI&amp;apos&quot;);</pre>
    * <p><b>Note 1 </b>: Use this method only if the source document features
    * a default namespace (without a prefix), otherwise just use IE's setProperty
    * (moz will rezolve non-default namespaces by itself). You will need to map that
    * namespace to a prefix for queries to work.</p>
    * <p><b>Note 2 </b>: This method calls IE's setProperty method to set the
    * appropriate namespace-prefix mappings, so you dont have to do that.</p>
    * @param oDoc The target XMLDocument to set the namespace mappings for.
    * @param sNsSet A whilespace-seperated list of namespace declarations as
    *            those would appear in an XML document. E.g.:
    *            <code>&quot;xmlns:xhtml=&apos;http://www.w3.org/1999/xhtml&apos;
    * xmlns:&apos;http://www.w3.org/1999/XSL/Transform&apos;&quot;</code>
    * @throws An error if the format of the given namespace declarations is bad.
    */
    Sarissa.setXpathNamespaces = function(oDoc, sNsSet) {
        //oDoc._sarissa_setXpathNamespaces(sNsSet);
        oDoc._sarissa_useCustomResolver = true;
        var namespaces = sNsSet.indexOf(" ")>-1?sNsSet.split(" "):new Array(sNsSet);
        oDoc._sarissa_xpathNamespaces = new Array(namespaces.length);
        for(var i=0;i < namespaces.length;i++){
            var ns = namespaces[i];
            var colonPos = ns.indexOf(":");
            var assignPos = ns.indexOf("=");
            if(colonPos == 5 && assignPos > colonPos+2){
                var prefix = ns.substring(colonPos+1, assignPos);
                var uri = ns.substring(assignPos+2, ns.length-1);
                oDoc._sarissa_xpathNamespaces[prefix] = uri;
            }else{
                throw "Bad format on namespace declaration(s) given";
            };
        };
    };
    /**
    * @private Flag to control whether a custom namespace resolver should
    *          be used, set to true by Sarissa.setXpathNamespaces
    */
    XMLDocument.prototype._sarissa_useCustomResolver = false;
    /** @private */
    XMLDocument.prototype._sarissa_xpathNamespaces = new Array();
    /**
    * <p>Extends the XMLDocument to emulate IE's selectNodes.</p>
    * @argument sExpr the XPath expression to use
    * @argument contextNode this is for internal use only by the same
    *           method when called on Elements
    * @returns the result of the XPath search as a SarissaNodeList
    * @throws An error if no namespace URI is found for the given prefix.
    */
    XMLDocument.prototype.selectNodes = function(sExpr, contextNode){
        var nsDoc = this;
        var nsresolver = this._sarissa_useCustomResolver
        ? function(prefix){
            var s = nsDoc._sarissa_xpathNamespaces[prefix];
            if(s)return s;
            else throw "No namespace URI found for prefix: '" + prefix+"'";
            }
        : this.createNSResolver(this.documentElement);
            var oResult = this.evaluate(sExpr,
                    (contextNode?contextNode:this),
                    nsresolver,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var nodeList = new SarissaNodeList(oResult.snapshotLength);
        nodeList.expr = sExpr;
        for(var i=0;i<nodeList.length;i++)
            nodeList[i] = oResult.snapshotItem(i);
        return nodeList;
    };
    /**
    * <p>Extends the Element to emulate IE's selectNodes</p>
    * @argument sExpr the XPath expression to use
    * @returns the result of the XPath search as an (Sarissa)NodeList
    * @throws An
    *             error if invoked on an HTML Element as this is only be
    *             available to XML Elements.
    */
    Element.prototype.selectNodes = function(sExpr){
        var doc = this.ownerDocument;
        if(doc.selectNodes)
            return doc.selectNodes(sExpr, this);
        else
            throw "Method selectNodes is only supported by XML Elements";
    };
    /**
    * <p>Extends the XMLDocument to emulate IE's selectSingleNode.</p>
    * @argument sExpr the XPath expression to use
    * @argument contextNode this is for internal use only by the same
    *           method when called on Elements
    * @returns the result of the XPath search as an (Sarissa)NodeList
    */
    XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode){
        var ctx = contextNode?contextNode:null;
        sExpr = "("+sExpr+")[1]";
        var nodeList = this.selectNodes(sExpr, ctx);
        if(nodeList.length > 0)
            return nodeList.item(0);
        else
            return null;
    };
    /**
    * <p>Extends the Element to emulate IE's selectSingleNode.</p>
    * @argument sExpr the XPath expression to use
    * @returns the result of the XPath search as an (Sarissa)NodeList
    * @throws An error if invoked on an HTML Element as this is only be
    *             available to XML Elements.
    */
    Element.prototype.selectSingleNode = function(sExpr){
        var doc = this.ownerDocument;
        if(doc.selectSingleNode)
            return doc.selectSingleNode(sExpr, this);
        else
            throw "Method selectNodes is only supported by XML Elements";
    };
    Sarissa.IS_ENABLED_SELECT_NODES = true;
};

/** 
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package provides hs.exception, which has all of the custom exceptions
	thrown in the HyperScope system. It has the following classes:
	
	hs.exception.Jump
		Thrown if an error occurs during jumping; thrown by all jump* commands 
		and methods.
		
	hs.exception.Filter
		Thrown if an error occurs during a filter process; thrown by all 
		Filter.apply() methods.	
		
	hs.exception.InvalidAddress
		Thrown if an error occurs while hs.address.Address parsing or resolution.

	hs.exception.Render
		Thrown if an error occurs during the rendering phase.
*/

dojo.provide("hs.exception");

	
/**
	Thrown if an error occurs during jumping; thrown by all jump* commands 
	and methods.
*/

hs.exception.Jump = function(message, doc, address){
	this.message = message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.Jump, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});


/**
	Thrown if an error occurs during a filter process; thrown by all 
	Filter.apply() methods.
*/

hs.exception.Filter = function(message, doc, address){
	this.message = message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.Filter, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});



/**
	Thrown if an error occurs while hs.address.Address parsing or resolution.
*/

hs.exception.InvalidAddress = function(message, doc, address){
	if(dojo.lang.isUndefined(doc)){
		doc = null;
	}
	
	if(dojo.lang.isUndefined(address)){
		address = null;
	}

	this.message = message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.InvalidAddress, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});



/**
	Thrown if an error occurs during the rendering phase.
*/

hs.exception.Render = function(message, doc, address){
	this.message= message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.Render, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});


/**
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package contains hs.filter, which has our filter abstraction and several
	filter types. Filters are a standard way to transform hs.model.Documents,
	using polymorphism to let specific implementors choose how to transform a
	document. It has the following classes:
	
	hs.filter.Filter
		A consistent API for applying filters and transformers to an 
		hs.model.Document, changing the underlying hs.model.Document in some 
		filter specific way.
	
	hs.filter.Normalizer
		A Filter that normalizes an hs.model.Document into a consistent form 
		before working with it.
		
	hs.filter.CurrentViewspecs
		A Filter that holds our currently applied viewspecs; reduces them into a 
		form that can be worked with; and applies them in the final rendering phase.

	hs.filter.ViewspecConstants
		Static singleton viewspec constants useful for working with 
		hs.filter.CurrentViewspecs. 

	hs.filter.Transcluder
		A Filter that walks the hs.model.Document tree, replacing INCLUDE statements 
		with their resolved locations.
*/

dojo.provide("hs.filter");

dojo.require("dojo.dom");
dojo.require("dojo.string.*");



/**
	A consistent API for applying filters and transformers to an hs.model.Document, 
	changing the underlying hs.model.Document in some filter specific way; 
	many objects are filters, including the hs.address.NodeAddress.
	
	Classes that wish to use this should mix it in, then over-ride it's methods:
	dojo.lang.mixin(myClass.prototype, hs.filter.Filter)
*/

hs.filter.Filter = {
	/**
		Apply and filter the given document, changing it's contents and views.
		By default, apply() is synchronous and does its work when you call it;
		however, some filters need to talk on the network, and are therefore
		asychronous. Before calling this method, you should call isAsync() and
		see if you need to pass in a 'readyHandler' to this method.
		
		@param document : hs.model.Document - Document to transform.
		@param readyHandler : Function - An optional handler that will be called
		when this apply() method is finished; only needed if isAsync is true.
		readyHandler is a function that will receive two arguments:
		readyHandler = function(doc : hs.model.Document, error : hs.exception.Filter)
		@param address : hs.address.Address - The address that we are resolving
		while applying this filter.
		@throws hs.exception.Filter
	*/
	apply: function(doc, readyHandler, address){
		dojo.raise("abstract interface method; please implement");
	},
	
	isAsync: function(){
		false;
	}
}


/**
	A Filter that normalizes an hs.model.Document into a consistent form 
	before working with it; specifically, the Normalizer strips out everything
	but DOM Elements from the underlying hs.model.Document, and adds in node 
	number information.
*/
hs.filter.Normalizer = function(){
}

dojo.lang.mixin(hs.filter.Normalizer.prototype, hs.filter.Filter);

dojo.lang.extend(hs.filter.Normalizer, {
	_nodeCounter: 0,

	apply: function(doc){
		var dom = doc.dom;
		
		var body = dom.selectNodes("/opml/body");
		if(body == null || body.length == 0){
			throw new hs.exception.filter("Invalid OPML document, no outline nodes");
		}
		
		body = body[0];
		
		// add a 'fake' attribute to the root node so that we write out our
		// xmlns:hs-internal namespace declaration here, rather than deeper in
		// the document which is what will happen when we call
		// setAttributeNS later on in one of our filters
		var root = dom.selectNodes("/opml")[0];
		dojo.dom.setAttributeNS(root, hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
								hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":fake",
								"false");
		
		// we need to have compatibility with older OPML documents; HyperScope
		// OPML docs have a root outline node with level 0, and no siblings of
		// level 0, while non-HyperScope OPML docs might just have a bunch of
		// top-level nodes. If we only have one top-level child, make it start
		// at level 0; if we have more than one, start from 1
		var level;
		if(dojo.dom.firstElement(body) == dojo.dom.lastElement(body)){
			// only one child element
			level = 0;
		}else{
			level = 1;
		}
		
		// recursively add metadata to the tree
		var startWith = dojo.dom.firstElement(body);
		this._applyMetadata(level, startWith, null);
		
		// record our maximum node offset, which we need for jumpNext if the
		// offset someone gives is too large, so we can jump to the final node
		doc._nodeCounter = this._nodeCounter;
	},
	
	_applyMetadata: function(level, startWith, parentNodeNumber){
		if(startWith == null || dojo.lang.isUndefined(startWith)){
			// end of recursion
			return;
		}
		
		var currentNode = startWith;
		var nodeOffset = 1;
		while(currentNode != null && dojo.lang.isUndefined(currentNode) == false){
			this._nodeCounter++;
			
			// determine our node number
			var nodeNumber;
			if(level == 0){
				nodeNumber = "0";
			}else{
			 	nodeNumber = 
					new hs.address.NodeNumber.toNodeNumber(parentNodeNumber, nodeOffset);
				nodeNumber = nodeNumber.number;
			}
			
			// set our metadata
			dojo.dom.setAttributeNS(currentNode, 
									hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":level",
									level);
			dojo.dom.setAttributeNS(currentNode, 
									hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":number",
									nodeNumber);
			dojo.dom.setAttributeNS(currentNode, 
									hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":node-counter",
									this._nodeCounter);
									
			// recursively call our child nodes
			this._applyMetadata(level + 1, dojo.dom.firstElement(currentNode), 
								nodeNumber);
			
			// move to next sibling
			currentNode = dojo.dom.nextElement(currentNode);
			nodeOffset++;
		}
	}
});



/**
	A Filter that holds our currently applied viewspecs; reduces them into a 
	form that can be worked with; and applies them in the final rendering phase.
*/

/** 
	@param viewspecs - either a String or an array of hs.address.Viewspecs[]
	@param docCtxt : hs.model.Document
	@param _applyDefaults : boolean private variable used by 
	hs.filter.CurrentViewspecs.toString() that should not be used publicly;
	controls whether we add ViewspecConstants.DEFAULT_VIEWSPECS to ourselves.
	@throws hs.exception.Filter
*/
hs.filter.CurrentViewspecs = function(viewspecs, docCtxt, _applyDefaults){
	if(dojo.lang.isUndefined(_applyDefaults)){
		_applyDefaults = true;
	}	

	// reject bad values
	if(docCtxt == null || dojo.lang.isUndefined(docCtxt)){
		throw new hs.exception.Filter("Programming error: "
										+ "no document for "
										+ "hs.filter.CurrentViewspecs");
	}
	
	// normalize an empty viewspec
	if(viewspecs == null || dojo.lang.isUndefined(viewspecs)){
		viewspecs = "";
	}else if(dojo.lang.isString(viewspecs) && dojo.string.trim(viewspecs) == ""){
		viewspecs = "";
	}else if(dojo.lang.isArray(viewspecs) && viewspecs.length == 0){
		viewspecs = "";
	}
	
	this._docCtxt = docCtxt;	
	
	// turn a string of viewspecs into an array
	// to validate their values
	if(dojo.lang.isString(viewspecs)){
		var viewArray = new Array();
		
		for(var i = 0; i < viewspecs.length; i++){
			var viewChar = viewspecs.charAt(i);
			var view = new hs.address.Viewspec(viewChar);
			viewArray.push(view);
		}
		
		viewspecs = viewArray;
	}
	
	// now attach our default viewspecs at the beginning
	if(_applyDefaults == true){
		for(var i = hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.length - 1; 
				i >= 0; i--){
			var viewChar = 	hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.charAt(i);
			var view = new hs.address.Viewspec(viewChar);
			// add new element at beginning of array
			viewspecs.splice(0, 0, view); 
		}
	}
		
	// set default line and level clipping values
	this._lineClippping = hs.filter.ViewspecConstants.DEFAULT_LINE_CLIPPING;
	this._levelClippping = hs.filter.ViewspecConstants.DEFAULT_LEVEL_CLIPPING;
	
	// evaluate each viewspec to update our view state
	for(var i = 0; i < viewspecs.length; i++){
		this.add(viewspecs[i]);
	}
}

dojo.lang.mixin(hs.filter.CurrentViewspecs.prototype, hs.filter.Filter);

dojo.lang.extend(hs.filter.CurrentViewspecs, {
	_levelClipping: null,
	_lineClipping: null,
	_structureClippingType: null,
	
	_showBlankLines: null,
	_showNodeAddressing: null,
	_showNodeLabels: null,
	_showFrozenNodes: null,
	_showNodeSignatures: null,
	_showLevelClippingToContext: null,
	
	_nodeAddressingPlacement: null,
	_nodeAddressingType: null,
	_contentFilterType: null,
	_runSequenceGenerators: null,
	
	_docCtxt: null,
	
	apply: function(doc){
		var xslt = doc.getRenderXSLT();
		
		// line clipping
		var lineClipping = this.getLineClipping();
		if(lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			lineClipping = "none";
		}
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"lineClipping", 
				lineClipping);
		
		// Internet Explorer incorrectly 'throws away' a numerical 0
		// if set as an XSLT parameter, turning it into a null; change
		// 0 values into the string "0".
		
		// level clipping
		var levelClipping = this.getLevelClipping();
		if(levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			levelClipping = "none";
		}else if(levelClipping == 0){
			levelClipping = "0";
		}
		
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"levelClipping", 
				levelClipping);
				
		// Internet Explorer incorrectly 'throws away' an XSLT parameter value if
		// it is a boolean false, turning it into a null after it is set.
		// Transform it into a string either way to prevent this.
		
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-node-labels", 
				new Boolean(this.showNodeLabels()).toString());	
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-blank-lines", 
				new Boolean(this.showBlankLines()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-node-addressing", 
				new Boolean(this.showNodeAddressing()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"node-addressing-placement", 
				this.getNodeAddressingPlacement());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-node-signatures", 
				new Boolean(this.showNodeSignatures()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-frozen-nodes", 
				new Boolean(this.showFrozenNodes()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"node-addressing-type", 
				this.getNodeAddressingType());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"structure-clipping", 
				this.getStructuralClippingType());

		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"content-filtering-type", 
				this.getContentFilterType());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"level-indenting-type", 
				this.getLevelIndentingType());
				
		if(this.getStructuralClippingType() == hs.filter.ViewspecConstants.PLEX_ONLY){
			// set what our plex parent is,
			// used to determine where to start plexing
			xslt.setParameter(
					hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
					"plex-parent-number", 
					this._getPlexParentNumber(doc));
		}
	},
	
	/**
		Generates a stringified version of our viewspecs.
		Note that viewspecs that are the default are not generated.
	 */
	toString: function(){
		// generate our string, using our current viewspec state
		// to do so
		var results = new String();
		results = this._writeLevelAndLineClipping(results);
		results = this._writeStructuralClipping(results);
		results = this._writeContentFiltering(results);
		results = this._writeNodeMetadata(results);
		results = this._writeNodeAppearance(results);
		results = this._writeSequenceGenerators(results);
		
		// now filter out default viewspecs
		results = this._filterDefaultViewspecs(results);
		
		return results;
	},

	/**
		Adds the given viewspec as a String or as an hs.address.Viewspec.
		Only one viewspec letter can be given at a time.
		
		@throws hs.exception.Filter.
	*/
	add: function(view){
		// reject bad values
		if(view == null || dojo.lang.isUndefined(view)){
			throw new hs.exception.Filter("Programming error: "
											+ "null viewspec given to "
											+ "hs.filter.CurrentViewspecs");
		}
		if(dojo.lang.isString(view) && dojo.string.trim(view) == ""){
			throw new hs.exception.Filter("Programming error: "
											+ "empty viewspec given to "
											+ "hs.filter.CurrentViewspecs");
		}
		
		// turn into a string
		view = view.toString();
		
		// reject multiple viewspecs
		if(view.length > 1){
			throw new hs.exception.Filter("Programming error: "
											+ "multiple viewspecs not allowed "
											+ "in call to CurrentViewspecs.add(): "
											+ view);
		}
		
		// now evaluate what kind of viewspec this is
		switch(view){
			case 'a': 
				// show one level less
				if(this._levelClipping > 0){
					this._levelClipping--;
				}
				break;
			case 'b':
				// show one level more
				if(this._levelClipping < hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
					this._levelClipping++;
				}
				break;
			case 'c':
				// show all levels
				this._levelClipping = hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
				break;
			case 'd':
				// show first level only
				this._levelClipping = 1;
				break;
			case 'e':
				// show levels up to level of referenced node
				// get the current context node
				var nodeCtxt = this._docCtxt.nodeCtxt;
				// get it's level and make it our clipped level
				var ctxtLevel = nodeCtxt.level;
				this._levelClipping = ctxtLevel;
				break;
			case 'f':
				// put viewspecs into effect
				// TODO: implement in the future
				break;
			case 'g':
				// show branch only
				this._structuralClippingType = 
					hs.filter.ViewspecConstants.BRANCH_ONLY;
				break;
			case 'h': 
				// show all branches
				this._structuralClippingType = 
					hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING;
				break;
			case 'i':
				// filter nodes
				this._contentFilterType = 
					hs.filter.ViewspecConstants.FILTER_ALL;
				break;
			case 'j':
				// don't filter nodes
				this._contentFilterType = 
					hs.filter.ViewspecConstants.NO_FILTERING;
				break;
			case 'k':
				// show next filtered node
				this._contentFilterType = 
					hs.filter.ViewspecConstants.NEXT_FILTERED_NODE;
				break;
			case 'l':
				// show plex only
				this._structuralClippingType = 
					hs.filter.ViewspecConstants.PLEX_ONLY;
				break;
			case 'm':
				// node numbers/IDs on
				this._showNodeAddressing = true;
				break;
			case 'n':
				// node numbers/IDs off
				this._showNodeAddressing = false;
				break;
			case 'o':
				// frozen statements on
				this._showFrozenNodes = true;
				break;
			case 'p':
				// frozen statements off
				this._showFrozenNodes = false;
				break;
			case 'q':
				// show one line less
				if(this._lineClipping > 1){
					this._lineClipping--;
				}
				break;
			case 'r':
				// show one line more
				if(this._lineClipping < hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
					this._lineClipping++;
				}
				break;
			case 's':
				// show all lines
				this._lineClipping = hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
				break;
			case 't': 
				// show first lines only
				this._lineClipping = 1;
				break;
			case 'u':
				// recreate windows after each change
				// TODO: implement in the future
				break;
			case 'v':
				// defer recreating window
				// TODO: implement in the future
				break;
			case 'w':
				// show all lines and all levels
				this._lineClipping = hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
				this._levelClipping = hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
				break;
			case 'x':
				// show one line and one level only
				this._lineClipping = 1;
				this._levelClipping = 1;
				break;
			case 'y':
				// blank lines between nodes on
				this._showBlankLines = true;
				break;
			case 'z':
				// blank lines between nodes off
				this._showBlankLines = false;
				break;
			case 'A':
				// level indenting on
				this._levelIndentingType = 
					hs.filter.ViewspecConstants.INDENT_ON;
				break;
			case 'B':
				// level indenting off
				this._levelIndentingType = 
					hs.filter.ViewspecConstants.INDENT_OFF;
				break;
			case 'C':
				// show node names
				this._showNodeLabels = true;
				break;
			case 'D':
				// don't show node labels
				this._showNodeLabels = false;
				break;
			case 'E':
				// paginate when printing
				// TODO: implement in the future
				break;
			case 'F':
				// recreate display
				// TODO: implement in the future
				break;
			case 'G':
				// node numbers/IDs right
				this._nodeAddressingPlacement = 
					hs.filter.ViewspecConstants.RIGHT;
				break;
			case 'H':
				// node numbers/IDs left
				this._nodeAddressingPlacement = 
					hs.filter.ViewspecConstants.LEFT;
				break;
			case 'I':
				// show node IDs, not node numbers
				this._nodeAddressingType = 
					hs.filter.ViewspecConstants.SHOW_NODE_ID;
				break;
			case 'J':
				// show node numbers, not node IDs
				this._nodeAddressingType = 
					hs.filter.ViewspecConstants.SHOW_NODE_NUMBER;
				break;
			case 'K':
				// node signatures on
				this._showNodeSignatures = true;
				break;
			case 'L':
				// node signatures off
				this._showNodeSignatures = false;
				break;
			case 'O':
				// user sequence generator on
				this._runSequenceGenerators = true;
				break;
			case 'P':
				// user sequence generator off
				this._runSequenceGenerators = false;
				break;
			case 'Q':
				// indenting offset to current context node level
				// with viewspecs l and g
				this._levelIndentingType = 
					hs.filter.ViewspecConstants.INDENT_TO_CONTENT;
				break;
			default:
				throw new hs.exception.Filter("? " + view);
		}
	},
	
	/**
	   The number of levels to show, after which we clip.
	   
	   @returns int - from 0 to hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING.
	 */
	getLevelClipping: function(){
		return this._levelClipping;
	},
	
	/**
	   The number of lines to show for each node, after which we clip.
	   
	   @returns int - from 1 to hs.filter.ViewspecConstants.MAX_LINE_CLIPPING.
	 */
	getLineClipping: function(){
		return this._lineClipping;
	},
	
	/**
	  Gets the structural display type.
	  
	  @returns hs.filter.ViewspecConstants.BRANCH_ONLY,
		hs.filter.ViewspecConstants.PLEX_ONLY, or
		hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING.
	 */
	getStructuralClippingType: function(){
		return this._structuralClippingType;
	},
	
	/**
		Whether to show blank lines between nodes or not.
		
		@returns boolean
	*/
	showBlankLines: function(){
		return this._showBlankLines;
	},

	/**
		Whether to show node addressing (i.e. purple numbers and node IDs).
		
		@returns boolean
	*/
	showNodeAddressing: function(){
		return this._showNodeAddressing;
	},
	
	/**
		Where the node addressing is shown, on the left or the right.
		
		@returns hs.filter.ViewspecConstants.LEFT or
		hs.filter.ViewspecConstants.RIGHT.
	*/
	getNodeAddressingPlacement: function(){
		return this._nodeAddressingPlacement;
	},
	
	/**
		What type of node addressing to show (i.e. node IDs or node
		numbers).
		
		@returns hs.filter.ViewspecConstants.SHOW_NODE_ID or
		hs.filter.ViewspecConstants.SHOW_NODE_NUMBER.
	*/
	getNodeAddressingType: function(){
		return this._nodeAddressingType;
	},
	
	/**
		Whether to show node labels.
		
		@returns boolean
	*/
	showNodeLabels: function(){
		return this._showNodeLabels;
	},
	
	/**
		How to apply a content filter.
		
		@returns hs.filter.ViewspecConstants.NO_FILTERING, 
		hs.filter.ViewspecConstants.FILTER_ALL, or
		hs.filter.ViewspecConstants.NEXT_FILTERED_NODE.
	*/
	getContentFilterType: function(){
		return this._contentFilterType;
	},
	
	/**
		Whether to do level indenting.
		
		@returns hs.filter.ViewspecConstants.INDENT_ON,
		hs.filter.ViewspecConstants.INDENT_OFF, or
		hs.filter.ViewspecConstants.INDENT_TO_CONTENT.
	*/
	getLevelIndentingType: function(){
		return this._levelIndentingType;
	},
	
	/**
		Whether to show frozen nodes.
		
		@returns boolean
	*/
	showFrozenNodes: function(){
		return this._showFrozenNodes;
	},
	
	/**
		Whether to show node signature and editing information.
		
		@returns boolean
	*/
	showNodeSignatures: function(){
		return this._showNodeSignatures;
	},
	
	/**
		Whether to run sequence generators like the hs.filter.Transcluder.
		
		@returns boolean
	*/
	runSequenceGenerators: function(){
		return this._runSequenceGenerators;
	},
	
	_writeLevelAndLineClipping: function(results){
		// level and line clipping - generate these compactly
		// so we don't get a million letters to go to the correct level
		// and line clipping
		if(this._lineClipping == 1 && this._levelClipping == 1){
			// line and level clipping are both 1
			// x - show one line and one level only
			results += "x";
		}
		else if(this._lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING
				&& this._levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			// line and level clipping are both max
			// w - show all lines and all levels
			results += "w";
		}else{
			// line and level clipping differ
			results = this._writeLineClipping(results);
			results = this._writeLevelClipping(results);	
		}
		
		return results;
	},
	
	_writeLineClipping: function(results){
		// line clipping
		if(this._lineClipping == 1){
			// show just first line
			// t - show first lines only
			results += "t";
		}else if(this._lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			// line clipping is the max
			// s - show all lines
			results += "s";
		}else{
			// figure out if line clipping is closer to 1 or the max
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LINE_CLIPPING - this._lineClipping;
			if(distanceToMax <= this._lineClipping){
				// much closer to the maximum line clipping
				// write out 's' ('show all lines'), followed
				// by necessary number of 'q' ('show one lines less')
				// letters
				results += "s";
				for(var i = distanceToMax; i > 0; i--){
					results += "q";
				}
			}else{
				// much closer to the beginning of the allowed value
				// write out 't' ('show first lines only') followed
				// by necessary number of 'r' ('show one line more')
				// letters
				results += "t";
				for(var i = 2; i <= this._lineClipping; i++){
					results += "r";
				}
			}
		}
		
		return results;
	},
	
	_writeLevelClipping: function(results){
		// level clipping
		var ctxtNodeLevel = this._docCtxt.nodeCtxt.level;
		if(this._levelClipping == 1){
			// first level
			// d - show first level only
			results += "d";
		}else if(this._levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			// level clipping is max
			// c - show all levels
			results += "c";
		}else if(this._levelClipping == 0){
			// show just level 0 - no direct viewspec letter to get
			// this
			// write out 'da' -
			// 'd' - 'show first level only
			// 'a' - show one level less
			results += "da";
		}else if(this._levelClipping >= (hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - 20)){
			// our level clipping is within 20 units of the maximum allowed value
			// write out 'c' ('show all levels') followed by the necessary
			// number of 'a' ('show one level less') letters
			results += "c";
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - this._levelClipping;
			for(var i = distanceToMax; i > 0; i--){
				results += "a";
			}
		}else if(ctxtNodeLevel != 0 && this._levelClipping >= ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is equal to or greater than
			// this node.
			// write out 'e' ('show levels up to referenced node'), followed
			// by necessary number of 'b' ('show one level more') letters
			results += "e";
			var distanceFromCtxt = this._levelClipping - ctxtNodeLevel;
			for(var i = 1; i <= distanceFromCtxt; i++){
				results += "b";
			}
		}else if(ctxtNodeLevel != 0 && this._levelClipping < ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is less than
			// this node.
			
			// determine whether our level clipping is closer to 1 or
			// to our context node's level
			var distanceToCtxt = ctxtNodeLevel - this._levelClipping;
			if(distanceToCtxt >= this._levelClipping){
				// we are closer to 1.
				// write out 'd' ('show first level only'), followed
				// by correct number of 'b' ('show one level more')
				// letters
				results += "d";
				for(var i = 2; i <= this._levelClipping; i++){
					results += "b";
				}
			}else{
				// we are closer to the context node
				// write out 'e' ('show levels up to referenced node'), 
				// followed by necessary number of 'a' 
				// ('show one level less') letters
				results += "e";
				for(var i = 1; i <= distanceToCtxt; i++){
					results += "a";
				}
			}	
		}else if(ctxtNodeLevel == 0){
			results += "da" // get to level zero
			// now write out the correct number of 'b's
			for(var i = 1; i <= this._levelClipping; i++){
				results += "b";
			}	
		}
			
		return results;
	},
	
	_writeStructuralClipping: function(results){
		switch(this.getStructuralClippingType()){
			case hs.filter.ViewspecConstants.BRANCH_ONLY:
				results += "g";
				break;
			case hs.filter.ViewspecConstants.PLEX_ONLY:
				results += "l";
				break;
			case hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING:
				results += "h";
				break;
		}
		
		return results;
	},
	
	_writeContentFiltering: function(results){
		switch(this.getContentFilterType()){
			case hs.filter.ViewspecConstants.NO_FILTERING:
				results += "j";
				break;
			case hs.filter.ViewspecConstants.FILTER_ALL:
				results += "i";
				break;
			case hs.filter.ViewspecConstants.NEXT_FILTERED_NODE:
				results += "k";
				break;
		}
		
		return results;
	},
	
	_writeNodeMetadata: function(results){
		if(this.showNodeAddressing() == true){
			results += "m";
		}else{
			results += "n";
		}
		
		if(this.showNodeLabels() == true){
			results += "C";
		}else{
			results += "D";
		}
		
		if(this.showNodeSignatures() == true){
			results += "K";
		}else{
			results += "L";
		}
		
		switch(this.getNodeAddressingPlacement()){
			case hs.filter.ViewspecConstants.RIGHT:
				results += "G";
				break;
			case hs.filter.ViewspecConstants.LEFT:
				results += "H";
				break;
		}
		
		switch(this.getNodeAddressingType()){
			case hs.filter.ViewspecConstants.SHOW_NODE_ID:
				results += "I";
				break;
			case hs.filter.ViewspecConstants.SHOW_NODE_NUMBER:
				results += "J";
				break;
		}
		
		return results;
	},
	
	_writeNodeAppearance: function(results){
		if(this.showFrozenNodes() == true){
			results += "o";
		}else{
			results += "p";
		}
		
		if(this.showBlankLines() == true){
			results += "y";	
		}else{
			results += "z";
		}
		
		switch(this.getLevelIndentingType()){
			case hs.filter.ViewspecConstants.INDENT_ON:
				results += "A";
				break;
			case hs.filter.ViewspecConstants.INDENT_OFF:
				results += "B";
				break;
			case hs.filter.ViewspecConstants.INDENT_TO_CONTENT:
				results += "Q";
				break;
		}
		
		return results;
	},
	
	_writeSequenceGenerators: function(results){
		if(this.runSequenceGenerators() == true){
			results += "O";
		}else{
			results += "P";
		}
		
		return results;
	},
	
	_filterDefaultViewspecs: function(results){
		// since we are a fully normalized viewspec at this point, we
		// can simply remove any letter from ourselves that is
		// inside the default viewspecs
		for(var i = 0; i < hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.length; 
				i++){
			var currentDefault = 
				hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.charAt(i);
			results = results.replace(currentDefault, "");
		}						
								
		return results;
	},
	
	_getPlexParentNumber: function(doc){
		var ctxtParent = doc.nodeCtxt.getParent();
		if(ctxtParent == null){
			return hs.filter.ViewspecConstants.NO_PLEX_PARENT;
		}else{
			return ctxtParent.number;
		}
	}
});





/**
	Static singleton viewspec constants useful for working with 
	hs.filter.CurrentViewspecs. 
*/

hs.filter.ViewspecConstants = {
	/** Default viewspecs that all documents start with. */
	DEFAULT_VIEWSPECS: "hjnpuxyACHJLP",
	
	/** Default and max level and line clipping settings. */
	MAX_LEVEL_CLIPPING: 63,
	MAX_LINE_CLIPPING: 63,
	DEFAULT_LEVEL_CLIPPING: 1,
	DEFAULT_LINE_CLIPPING: 1,
	
	/** Displaying metadata on left or right. */
	LEFT: "left",
	RIGHT: "right",
	
	/** What kind of metadata to show. */
	SHOW_NODE_ID: "id",
	SHOW_NODE_NUMBER: "number",
	
	/** Structural clipping. */
	BRANCH_ONLY: "branch",
	PLEX_ONLY: "plex",
	NO_STRUCTURAL_CLIPPING: "none",
	
	/** Content filtering. */
	NO_FILTERING: "none",
	FILTER_ALL: "all",
	NEXT_FILTERED_NODE: "next_node",
	
	/** Indenting. */
	INDENT_ON: "on",
	INDENT_OFF: "off",
	INDENT_TO_CONTENT: "to_context_node",
	
	/** Used for structural plexing. */
	NO_PLEX_PARENT: "none"
}



/*
	A Filter that walks the hs.model.Document tree, replacing OPML nodes
	that have type="include" with the actual contents of the remote OPML
	link, with granular addressing applied (but not any viewspecs that
	might be on the link).
	
	For example, if I have the following OPML node:
	
	<outline type="include" url="http://foobar.com/someDoc.opml#5.n:l" />
	
	Then we will fetch the contents of that link, resolve it's addressing,
	but not apply it's viewspecs.
	
	An optional attribute named hs:include-type can control how much
	of the remote link we fetch. It's value can be "node", "branch",
	or "plex", with the default if none is specified being "node".
	
	The viewspecs of the mother document, i.e. the one doing the inclusion,
	will have it's viewspecs applied to the material that was fetched.
*/

/**
	@param parentAddress : hs.address.Address The parent address
	that is running this transclusion. This is the address
	of the root document that is being displayed to the end
	user.
 */
hs.filter.Transcluder = function(parentAddress){
	this._parentAddress = parentAddress;
}

dojo.lang.mixin(hs.filter.Transcluder.prototype, hs.filter.Filter);

hs.filter.Transcluder.INCLUDE_NODE = "node";
hs.filter.Transcluder.INCLUDE_BRANCH = "branch";
hs.filter.Transcluder.INCLUDE_PLEX = "plex";

dojo.lang.extend(hs.filter.Transcluder, {
	/** 
		Whether our metadata is dirty;
		if so, we must renormalize our
		document.
	*/
	metadataDirty: false,
	
	_totalInclusions: null,	
	_finishedInclusions: 0,
	_readyHandler: null,

	apply: function(doc, readyHandler){
		this._readyHandler = readyHandler;
		
		// compile a list of nodes that want to be
		// transcluded
		
		/**
		  XPath:
		  Grab all outline nodes and get the ones with the
		  attribute 'type' with the value 'include'.
		  
		  Example: //outline[@type = 'include']
		*/
		var nodes = doc.dom.selectNodes("//outline[@type = 'include']");

		if(nodes == null || nodes.length == 0){
			// nothing to do
			this._readyHandler.call(null, doc, null);
		}
		
		this._totalInclusions = nodes.length;
		
		// go through each node and execute an include
		// on it
		for(var i = 0; i < nodes.length; i++){
			var hsNode = new hs.model.Node(nodes.item(i), doc);
			this._executeInclude(hsNode, doc);
		}
		
		// now wait for the results to trickle in
	},
	
	isAsync: function(){
		true;
	},
	
	/**
		@param hsNode : hs.model.Node
		@param doc : hs.model.Document
	 */
	_executeInclude: function(hsNode, doc){
		// get the URL to include
		var url = hsNode.domNode.getAttribute("url");
		
		// get the type of inclusion
		var includeType = 
			hsNode.domNode.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":include-type");
		if(includeType == null
			|| typeof includeType == "undefined"
			|| dojo.string.trim(includeType) == ""){
			includeType = hs.filter.Transcluder.INCLUDE_NODE;		
		}
		
		// now resolve this url into a document we can work with
		var self = this;
		var handler = function(address, includedDoc, error){
			self._finishedInclusions++;
			
			if(error != null && typeof error != "undefined"){ // error!
				hsNode.domNode.setAttribute("text",
							"Include failed for url " 
							+ url + ", error: " 
							+ error.toString());
							
				dojo.dom.setAttributeNS(
							hsNode.domNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
								+ ":include-failed",
							"yes");
			}else{
				// now import our new data
				self._importNodes(doc, includedDoc, 
									includeType, hsNode,
									url);
			}
			
			// if we are completely done call our handler
			if(self._finishedInclusions >= self._totalInclusions){
				self._readyHandler.call(null, doc, null);
			}
		};
		var addr;
		try{
			addr = new hs.address.Address(url);
		}catch(exp){
			// call handler manually with the error
			handler(null, null, exp);
			return;
		}
		addr.resolve(handler, false, doc, 
					true, this._parentAddress);
	},
	
	/**
		Takes a new XML DOM from a transcluded document
		(includedDoc); uses the 'includeType' to figure out 
		how to add these new nodes; and then replaces
		these nodes inside of 'hsNode' appropriately.
		
		@param parentHsDoc : hs.model.Document The
		parent Document that we are transcluding 
		into (i.e. the mother document).
		@param includedDoc : hs.model.Document
		The fetched, remote document for the URL 
		that we are transcluding into our mother document.
		@param includeType : String One of our
		hs.filter.Transcluder constants, which are
		INCLUDE_NODE, INCLUDE_BRANCH, or 
		INCLUDE_PLEX.
		@param hsNode : hs.model.Node The node
		we are going to replace with our transclusion.
	 */
	_importNodes: function(parentHsDoc, includedDoc, 
							includeType, hsNode, url){
		if(includeType == hs.filter.Transcluder.INCLUDE_NODE){
			this._includeSingleNode(parentHsDoc, includedDoc, 
									includeType, hsNode, url);
		}else if(includeType == hs.filter.Transcluder.INCLUDE_BRANCH){
			this._includeBranch(parentHsDoc, includedDoc,
								includeType, hsNode, url);
		}else if(includeType == hs.filter.Transcluder.INCLUDE_PLEX){
			this._includePlex(parentHsDoc, includedDoc,
								includeType, hsNode, url);
		}							
	},
	
	_includeSingleNode: function(parentHsDoc, includedDoc,
								includeType, hsNode, url){
		// get the node to include
		var newDOMNode = includedDoc.nodeCtxt.domNode;
		newDOMNode = newDOMNode.cloneNode(false);
		
		// update our leveling info to be correct;
		// we are now at the same level as what we
		// once replaced
		dojo.dom.setAttributeNS(
							newDOMNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":level",
							hsNode.level);
								
		// set what our correct number should be
		dojo.dom.setAttributeNS(
							newDOMNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":number",
							hsNode.number);
								
		this._setIncluded(newDOMNode, url,
							hs.filter.Transcluder.INCLUDE_NODE);
								
		// now replace the old node that had the 
		// transclusion directive with our new one
		var replaceInside = hsNode.domNode.parentNode;
		var replaceMe = hsNode.domNode;
		replaceInside.replaceChild(newDOMNode, replaceMe);	
	},
	
	_includeBranch: function(parentHsDoc, includedDoc,
							includeType, hsNode, url){
		// get the node to include
		var newDOMNode = includedDoc.nodeCtxt.domNode;
		
		// mark all of these as included
		this._setIncluded(newDOMNode, url, 
							hs.filter.Transcluder.INCLUDE_BRANCH);
		
		// now clone it
		newDOMNode = newDOMNode.cloneNode(true);
								
		// now replace the old node that had the 
		// transclusion directive with our new one
		var replaceInside = hsNode.domNode.parentNode;
		var replaceMe = hsNode.domNode;
		replaceInside.replaceChild(newDOMNode, replaceMe);	
		
		// our metadata is now dirty
		this.metadataDirty = true;
	},
	
	_includePlex: function(parentHsDoc, includedDoc,
							includeType, hsNode, url){
		// get our initial target node
		var targetNode = includedDoc.nodeCtxt.domNode;
		
		// move backwards until we hit the first sibling
		var firstSibling = targetNode;
		while(firstSibling.previousSibling != null){
			firstSibling = firstSibling.previousSibling;
		}
		
		// we might have a text node, which we don't want;
		// keep moving forward until we get a real element now
		while(firstSibling.nextSibling != null
				&& firstSibling.nodeType != dojo.dom.ELEMENT_NODE){
			firstSibling = firstSibling.nextSibling;			
		}

		// now clone and insert each node moving forward
		targetNode = firstSibling;
		var lastNode = hsNode.domNode;
		while(targetNode != null){
			if(targetNode.nodeType == dojo.dom.ELEMENT_NODE){
				// mark these as included
				this._setIncluded(targetNode, url,
								hs.filter.Transcluder.INCLUDE_PLEX);
				
				// clone
				var newNode = targetNode.cloneNode(true);
				
				// insert
				dojo.dom.insertAfter(newNode, lastNode);
				
				// the next time around insert our node
				// after the one we just entered
				lastNode = newNode;
			}
			
			// next sibling
			targetNode = targetNode.nextSibling;
		}
		
		// now remove the node that had the inclusion
		// directive
		dojo.dom.removeNode(hsNode.domNode);
		
		// our metadata is now dirty
		this.metadataDirty = true;
	},
	
	_setIncluded: function(rootDOMNode, url, includedType){
		var visitMe = new Array();
		visitMe.push(rootDOMNode);
		while(visitMe.length > 0){
			// get our current node
			var currentNode = visitMe.pop();
			
			// 'visit' it
			dojo.dom.setAttributeNS(
							currentNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
									+ ":included",
							"yes");
			dojo.dom.setAttributeNS(
							currentNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
									+ ":included-from",
							url);
			dojo.dom.setAttributeNS(
							currentNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
									+ ":included-type",
							includedType);
											
			// remove any old node IDs because they are unique in
			// a single document only, and we could have collisions
			currentNode.removeAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":nid");
							
			// push this node's children onto the visit stack
			var children = currentNode.childNodes;
			for(var i = children.length; i >= 0 ; i--){
				if(children[i] && children[i].nodeType == dojo.dom.ELEMENT_NODE){
					visitMe.push(children[i]);
				}
			}
		}
	}
});

/**
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package provides hs.util, which has a collection of classes aiding
	with various utility functions. It provides the following classes:
	
	hs.util.AddressSerializer
		Can serialize an hs.address.Address into a string or URL.
			
	hs.util.AddressTokenizer
		Parses a string or URL into a collection of hs.address.Pieces and can 
		return them one by one, left to right.

	hs.util.XMLFetcher
		Returns an XML DOM for the given address, either fetched remotely 
		or from it's local cache.
		
	hs.util.NodeWalker
		Walks the tree of hs.model.Nodes in an hs.model.Document, performing some 
		action or test on each node. The order walked is the same order a document
		would appear on the page, successively moving down the tree.
		
	hs.util.NodeNumberTokenizer
		Tokenizes a node number, such as 1B22C2A, and returns each level as a 
		single number to easily step through a hierarchical node number. Numbering
		always starts at 1.
		
	hs.util.XSLTLoader
		Will asychronously load a set of XSLT files, tell you when they are loaded,
		transform them into XML DOMs, and return them by name. Used by such filters
		as the Render filter to get their job done.
		
	It also adds dojo.dom.setAttributeNS into dojo.dom if it is not present in
	this version of Dojo yet.
*/

dojo.provide("hs.util");

dojo.require("dojo.string.*");
dojo.require("dojo.io.*");
dojo.require("dojo.dom");

dojo.require("sarissa.core");


/**
	Can serialize an hs.address.Address into a string or URL.
*/

/**
	@param address : hs.address.Address
	@throws hs.exception.InvalidAddress
*/
hs.util.AddressSerializer = function(address){
	this.addr = address;
}

dojo.lang.extend(hs.util.AddressSerializer, {
	addr: null,
	
	/** 
		Serializes the given address into a URL string; this URL is not
		necessarily expanded; it simply uses available information in the
		hs.address.Address that was given in the constructor to create the string.
		
		@returns String
	*/
	serialize: function(){
		var s = new String();
		
		// file info
		var fileInfo = this.addr.fileInfo;
		s += fileInfo.toString();
		
		// add an anchor
		if(this.addr.nodeAddresses.length > 0
			|| this.addr.viewspecs.length > 0
			|| this.addr.contentFilter != null){
			s += "#";
		}
		
		// serialize each node address piece
		var nodeAddresses = this.addr.nodeAddresses;
		var lastPiece = null;
		for(var i = 0; i < nodeAddresses.length; i++){
			var piece = nodeAddresses[i];
			
			// add a space?
			var addSpace = true;
			if(lastPiece == null){
				addSpace = false;
			}
			
			if(lastPiece != null){
				// don't add a space if we are dealing with one of the types that come
				// in a row, like relative addresses (ex: .udt), and we are past the
				// first letter in this sequence
				if(lastPiece.isPieceType("hs.address.Relative")
					|| lastPiece.isPieceType("hs.address.IndirectLink")){
					if(piece.isPieceType("hs.address.Relative")
						|| piece.isPieceType("hs.address.IndirectLink")){
						addSpace = false;		
					}		
				}
				
				if(lastPiece.isPieceType("hs.address.StringPosition") == true
					&& piece.isPieceType("hs.address.StringPosition")){
					addSpace = false;
				}
			}
			
			if(addSpace == true){
				s += " ";
			}
			
			if(piece.isPieceType("hs.address.Relative")
				|| piece.isPieceType("hs.address.IndirectLink")){
				// Print out a period if the last piece type is
				// not a relative type
				if(lastPiece == null ||
					(lastPiece.isPieceType("hs.address.Relative") == false
					 && lastPiece.isPieceType("hs.address.IndirectLink") == false)){
					s += ".";	 	
				}
				
				s += piece.toString();
			}else if(piece.isPieceType("hs.address.Marker")){
				s += "@" + piece.toString();
			}else if(piece.isPieceType("hs.address.NodeLabel")){
				switch(piece.type){
					case hs.address.NodeLabel.BRANCH_SEARCH:
						s += "!";
						break;
					case hs.address.NodeLabel.MOVE_TO_NEXT:
						s += "*";
						break;
					case hs.address.NodeLabel.EXTERNAL:
						s += "$";
						break;
				}
				
				s += piece.toString();
			}else if(piece.isPieceType("hs.address.NodeNumber")){
				if(piece.isOffset){
					s += "!";
				}
				
				s += piece.toString();
			}else{
				s += piece.toString();
			}
			
			lastPiece = piece;
		}
		
		// viewspecs
		var viewspecs = this.addr.viewspecs;
		if(viewspecs.length > 0){
			s += ":";
		}
		
		for(var i = 0; i < viewspecs.length; i++){
			var v = viewspecs[i];
			s += v.toString();
		}
		
		// content filter
		var contentFilter = this.addr.contentFilter;
		if(contentFilter != null){
			s += ";" + contentFilter.toString() + ";";
		}
		
		return s;
	}
});



/**
	Parses a string or URL into a collection of hs.address.Pieces and can 
	return them one by one, left to right.
*/

/**
	@param url : String The url to tokenize.
	@throws hs.exception.InvalidAddress
*/
hs.util.AddressTokenizer = function(url){
	this._url = url;
	this._parse(url);
}

dojo.lang.extend(hs.util.AddressTokenizer, {
	_pieces: new Array(),
	_url: null,
	
	/**
	 	A collection that holds regular expressions for 
	 	each node address type (regexp) and a function to parse that
	 	type (parseFunc); this allows us to parse and work with 
	 	node addresses in a generic fashion in
	 	_parseNodeAddress.
	 */
	_nodeTypes: [
		/**
		 	Node ID - 0 followed by one or more digits
		*/
		{regexp: /^\s*(0\d+)/,
		 parseFunc: "_parseNodeID"},
			
		/**
		 	Node Number - two possibilities:
				1) the number 0 (the root node), but it _can't_ be followed by more
				numbers (the ?! expression below), or else it would be a node ID -
				(?:0(?![0-9]+))
				2) a number from 1 through 9, followed by optional numbers or letters -
				(?:[1-9]+[a-z0-9]*)
			
			Both can have optional ! symbol at beginning for offsets.
		*/
		{regexp: /^\s*((?:0(?![0-9]+))|(?:\!?[1-9]+[a-z0-9]*))/i,
		 parseFunc: "_parseNodeNumber"},
			
		/**
			Node Label - must start with letter followed by a-z, 0-9, and _ and -, case
			insensitive (i)
			Can have optional symbols *, !, and $ at beginning for different
			types of labels - (?:\!|\*|\$)?
		*/
		{regexp: /^\s*((?:\!|\*|\$)?[a-z]+[a-z0-9_\-]*)/i,
		 parseFunc: "_parseNodeLabel"},
			
		/**
		 	Marker - same as node label, but starts with @
		*/
		{regexp: /^\s*(\@[a-z]+[a-z0-9_\-]*)/i,
		 parseFunc: "_parseMarker"},
		
		/**
		 	Relative and Indirect - . followed by optional number and any of the 
		 	following letters, repeated: nbudoehtspcrl and rf
		 */
		{regexp: /^\s*(\.[1-9]?[0-9nbudoelhtspcrf]?[0-9nbudoelhtspcrf]*)/,
		 parseFunc: "_parseRelativeAndIndirect"},
		
		/**
		 	String Search - anything delimited with " or /
		 */
		{regexp: /^\s*((?:\"|\/)(?:\\\"|\\\/|\\\:|\\\;|[^\"\/])*(?:\"|\/)[a-z]*)/i,
		 parseFunc: "_parseStringSearch"},
		
		/**
		 	String Position - + or - followed by number and any of the following
		 	letters, repeated: wcvilef
		 */
		{regexp: /^\s*((?:\+|\-)[1-9]?[0-9wcvilef]?[\+\-0-9wcvilef]*)/,
		 parseFunc: "_parseStringPosition"}
	],

	/**
		Whether this tokenizer has another hs.address.Piece.
		
		@returns Boolean
	*/
	hasNext: function(){
		return (this._pieces.length > 0);
	},

	/**
		Returns the next hs.address.Piece tokenized, from left to right.
		
		@returns hs.address.Piece
	*/
	next: function(){
		if(this.hasNext()){
			return this._pieces.shift();
		}else{
			return null;
		}
	},
	
	_parse: function(url){
		// parse out the file info piece
		var fileInfo = new hs.address.FileInfo(url);
		this._pieces.push(fileInfo);
		
		// break off the anchor, if there is one
		var anchor = this._getAnchor(url);
		if(anchor == null){
			return;
		}
		
		// break the anchor into three sections:
		// node address, viewspecs, content filter
		var nodeAddrs = this._getNodeAddressStr(anchor);
		if(nodeAddrs != null && nodeAddrs != ""){
			var cutPoint = anchor.indexOf(nodeAddrs);
			cutPoint = cutPoint + nodeAddrs.length;
			anchor = anchor.substring(cutPoint);
		}
		
		var viewspecs = this._getViewspecsStr(anchor);
		if(viewspecs != null && viewspecs != ""){
			var cutPoint = anchor.indexOf(viewspecs);
			cutPoint = cutPoint + viewspecs.length;
			anchor = anchor.substring(cutPoint);
		}
		
		var contentFilter = this._getContentFilterStr(anchor);
		
		// parse each piece
		this._parseNodeAddress(nodeAddrs);
		this._parseViewspecs(viewspecs);
		this._parseContentFilter(contentFilter);
	},
	
	_getAnchor: function(url){
		if(dojo.lang.isUndefined(url)
			|| url == null
			|| url.indexOf("#") == -1){
			return null;
		}
		var m = url.match(/[^#]*#(.*)/);
		if(m == null || m[1] == null || m[1] == ""){
			return;
		}
		var anchor = m[1];
		
		// turn URL encoded characters into their real values, 
		// such as %20 for spaces
		anchor = decodeURIComponent(anchor);
		
		return anchor;
	},
	
	_getNodeAddressStr: function(anchor){
		// get the node address
		// we can't just split on : or ; because this
		// character can be inside a quoted string or regular expression 
		// to search on
		// example: <2A "todo:" .l :x>
		// example: <2A /todo\\:/ .l :x>
		var results = anchor.match(/^((?:\\\;|\\\:|[^\;\:])*)/);
		var nodeAddrs = new String();
		if(results != null && results.length == 2){
			nodeAddrs = results[1];
		}
		
		return nodeAddrs;
	},
	
	_getViewspecsStr: function(anchor){
		var end = null;
		for(var i = 0; i < anchor.length; i++){
			if(anchor.charAt(i) == ";"){
				end = i;
				break;
			}
		}
		if(end == null){
			end = anchor.length;
		}
		var viewspecs = anchor.substring(0, end);
		
		return viewspecs;
	},
	
	_getContentFilterStr: function(anchor){
		// get the content filter
		var results = anchor.match(/\s*(\;\s*(?:\\\;|[^\;])*\s*\;)\s*$/);
		var contentFilter = new String();
		if(results != null && results.length == 2){
			contentFilter = results[1];
		}
		
		return contentFilter;
	},
	
	_parseNodeAddress: function(input){
		input = dojo.string.trim(input);
		if(input == ""){ // no node address
			return;
		}
		
		var currentPiece = null;
		
		/**  
		  	Overview of node address parsing:
			Parse from left to right, testing the
			beginning of our input against each of
			the entries' test property in our _nodeTypes collection.
			If it matches, we use the parseFunc function
			for this entry to consume the input, shortening
			the input string and continuing until input is
			empty.
		*/
		while(input.length != 0){
			// get the node address type that is at the beginning 
			// of our input 
			var addrType = null;
			for(var i = 0; i < this._nodeTypes.length; i++){
				var currentType = this._nodeTypes[i];
				if(currentType.regexp.test(input) == true){
					addrType = currentType;
					break;
				}
			}
			if(addrType == null){
				throw new hs.exception.InvalidAddress("? " + input);
			}
			
			// get our matching string
			var m = input.match(addrType.regexp);
			if(m == null || dojo.lang.isUndefined(m) || m.length == 1){
				throw new hs.exception.InvalidAddress("? " + input);
			}

			var strPiece = m[1];
			
			// parse the string piece by calling it's parse function
			strPiece = strPiece.replace(/\\/g, "\\\\"); // escape ' and \ characters
			strPiece = strPiece.replace(/\'/g, "\\'"); 
			var callMe = "this." + addrType.parseFunc + "('" + strPiece + "')";
			eval(callMe);
			
			// consume the beginning of the input now
			input = input.replace(addrType.regexp, "");
		}
	},
	
	_parseViewspecs: function(str){
		str = dojo.string.trim(str);
		if(str == ""){ // no viewspecs
			return;
		}
		
		str = str.substring(1); // remove colon

		// consume from left to right, shortening string
		// as we go
		var regexp = /^\s*([a-zA-Q])/;
		while(str.length != 0){
			// get next letter
			var currentLetter = str.match(regexp);
			if(currentLetter == null
				|| dojo.lang.isUndefined(currentLetter)
				|| currentLetter.length == 1
				|| currentLetter[1] == ""
				|| currentLetter[1] == null){
				throw new hs.exception.InvalidAddress("? " + str);	
			}
			var letter = currentLetter[1];
			
			var p = new hs.address.Viewspec(letter);
			this._pieces.push(p);
			
			// consume the beginning of the string
			str = str.replace(regexp, "");
		}
	},
	
	_parseContentFilter: function(str){
		str = dojo.string.trim(str);
		if(str == ""){ // no content filter
			return;
		}
		
		if(str.charAt(0) != ";" && str.charAt(str.length - 1) != ";"){
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		str = str.substring(1); // remove semicolon
		str = str.substring(0, str.length - 1); // remove semicolon
		
		if(str.charAt(0) != "\"" && str.charAt(0) != "/"){
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		if(/\"|\/|[a-z]$/i.test(str) == false){ // must end with " / or letter
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		
		var p = new hs.address.ContentFilter(str);
		this._pieces.push(p);
	},
	
	_parseNodeID: function(str){
		str = dojo.string.trim(str);
		var p = new hs.address.NodeID(str);
		this._pieces.push(p);
	},

	_parseNodeNumber: function(str){
		str = dojo.string.trim(str);
		var isOffset = false;
		if(dojo.string.startsWith(str, "!")){
			str = str.substring(1);
			isOffset = true;		
		}
		
		var p = new hs.address.NodeNumber(str, isOffset);
		this._pieces.push(p);
	},
	
	_parseNodeLabel: function(str){
		str = dojo.string.trim(str);
		
		var labelType;
		if(dojo.string.startsWith(str, "!")){
			labelType = hs.address.NodeLabel.BRANCH_SEARCH;
			str = str.substring(1);
		}else if(dojo.string.startsWith(str, "*")){
			labelType = hs.address.NodeLabel.MOVE_TO_NEXT;
			str = str.substring(1);
		}else if(dojo.string.startsWith(str, "$")){
			labelType = hs.address.NodeLabel.EXTERNAL;
			str = str.substring(1);
		}else{
			labelType = hs.address.NodeLabel.START_AT_FIRST;
		}
		
		var p = new hs.address.NodeLabel(str, labelType);
		this._pieces.push(p);
	},
	
	_parseMarker: function(str){
		str = dojo.string.trim(str);
		str = str.substring(1); // take off @
		
		var p = new hs.address.Marker(str);
		this._pieces.push(p);
	},
	
	_parseRelativeAndIndirect: function(str){
		str = dojo.string.trim(str);
		str = str.substring(1); // take off .
		
		// grab a number and a letter at a time,
		// consuming the string from left to right
		var regexp = /^(\d*)([nbudoehtspcrl]f?)/;
		while(str.length != 0){
			// get next piece
			var currentPiece = str.match(regexp);
			if(currentPiece == null
				|| dojo.lang.isUndefined(currentPiece)
				|| currentPiece.length == 1
				|| currentPiece[2] == ""
				|| currentPiece[2] == null){
				throw new hs.exception.InvalidAddress("? " + str);	
			}
			var letter = currentPiece[2];
			var offset = currentPiece[1];
			if(offset == "" || offset == null
				|| dojo.lang.isUndefined(offset)){
				offset = 1;
			}
			offset = new Number(offset).valueOf();
			if(offset == Number.NaN || offset == 0){ // not a number or 0
				throw new hs.exception.InvalidAddress("? " + str);
			}
			
			var p;
			if(letter == "l"){
				p = new hs.address.IndirectLink(offset);
			}else{
				p = new hs.address.Relative(letter, offset);
			}
			this._pieces.push(p);
			
			// consume the beginning of the string
			str = str.replace(regexp, "");
		}
	},
	
	_parseStringSearch: function(str){
		str = dojo.string.trim(str);
		
		var p = new hs.address.StringSearch(str);
		this._pieces.push(p);
	},
	
	_parseStringPosition: function(str){
		str = dojo.string.trim(str);
		
		// make sure we have a leading + or -
		if(dojo.string.startsWith(str, "+") == false
			&& dojo.string.startsWith(str, "-") == false){
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		
		// grab a sign, a number and a letter at a time,
		// consuming the string from left to right
		var regexp = /^((?:\+|\-))(\d*)([wcvilef])/;
		while(str.length != 0){
			// get next piece
			var currentPiece = str.match(regexp);
			if(currentPiece == null
				|| dojo.lang.isUndefined(currentPiece)
				|| currentPiece.length == 1
				|| currentPiece[1] == "" 		// no sign
				|| currentPiece[1] == null
				|| currentPiece[3] == ""		// no letter
				|| currentPiece[3] == null){
				throw new hs.exception.InvalidAddress("? " + str);	
			}
			
			var sign = currentPiece[1];
			var letter = currentPiece[3];
			var offset = currentPiece[2];
			if(offset == "" || offset == null
				|| dojo.lang.isUndefined(offset)){
				offset = 1;
			}
			offset = new Number(offset).valueOf();
			if(offset == Number.NaN || offset == 0){ // not a number or 0
				throw new hs.exception.InvalidAddress("? " + str);
			}
			if(sign == "-"){
				offset = offset * -1;
			}
			
			var p = new hs.address.StringPosition(letter, offset);
			this._pieces.push(p);
			
			// consume the beginning of the string
			str = str.replace(regexp, "");
		}
	}
});



/**
	Returns an XML DOM for the given address, either fetched remotely 
	or from it's local cache. You should 'throw away' XML fetchers after
	loading a document, and create a fresh, new one for each document to
	load.
*/

hs.util.XMLFetcher = function(){
}

/** 
  	The URL to our proxy for cross-domain
  	XML fetching.
*/
hs.util.XMLFetcher.PROXY_URL = "/hyperscope/trunk/hyperscope/src/server/proxy.php?url=";

/**
  Our cache of previously loaded document XML; this cache is shared
  between all XMLFetcher instances. We associate the
  basic URL (without the anchor) as our key, and store the XML
  string (not the DOM) as the value.
 */
hs.util.XMLFetcher._cache = new Object();

dojo.lang.extend(hs.util.XMLFetcher, {
	_handler: null,
	_addr: null,
	_url: null,
	_finished: false,
	_fromCache: false,

	/** 
		Loads the given url, calling 'handler' when done.
		
		@param addr : String or hs.address.Address
		@param handler : Function Handler called when document loaded, as follows
			handler = function(address : hs.address.Address, 
								dom : XML DOM, 
								error : InvalidAddressException)
			where 'address' is the address loaded, 'document' is the document,
			and 'error' is any error that might have occurred.
		@throws hs.exception.InvalidAddress
	*/
	load: function(addr, handler){
		this._handler = handler;
		
		// defensive programming: make sure that we are working with
		// a fresh XMLFetcher
		if(this._finished == true){
			throw new hs.exception.InvalidAddress(
						"Programming error: "
						+ "You must create a new XMLFetcher for "
						+ "each file loaded");
		}
		
		if(addr == null || dojo.lang.isUndefined(addr)){
			throw new hs.exception.InvalidAddress(
						"Invalid address given to load: " + addr.toString());
		}
		
		// see if we are a string url
		if(dojo.lang.isUndefined(addr.resolve)){
			addr = new hs.address.Address(addr);
		}
		
		// make sure we are a full address
		if(addr.isRelative() == true){
			throw new hs.exception.InvalidAddress(
						"Addresses must be expanded before "
						+ "calling XMLFetcher: " + addr.toString());
		}
		
		this._addr = addr;
		
		// get a URL
		var url = addr.fileInfo.toString();
		this._url = url;
		
		// see if we have it in the cache
		if(this._inCache(url)){
			var doc = this._getFromCache(url);
			this._loaded(null, doc, null);
		}else{
			this._loadFile(url);
		}
	},
	
	_loadFile: function(url){
		// see if this url is the same as our own url
		if(this._isSameHost(url) == false){
			url = hs.util.XMLFetcher.PROXY_URL + url;
		}
		
		// load the file
		var bindArgs = {
			url:		url,
			sync:		djConfig.testing,
			mimetype:	"text/plain",
			error:		dojo.lang.hitch(this, this._error),
			load:		dojo.lang.hitch(this, this._loaded)
		};
		
		// dispatch the request
		dojo.io.bind(bindArgs);
	},
	
	_isSameHost: function(url){
		var ourHost = window.location.href;
		ourHost = new hs.address.FileInfo(ourHost);
		var urlHost = new hs.address.FileInfo(url);
		
		if(ourHost.scheme != urlHost.scheme){
			return false;
		}
		
		if(ourHost.port != urlHost.port){
			return false;
		}
		
		if(ourHost.host != urlHost.host){
			return false;
		}
		
		return true;
	},
	
	_loaded: function(type, data, evt){
		this._finished = true;
		var exp = null;
		
		// make sure we have data
		if(data == null || dojo.lang.isUndefined(data)){
			exp = new hs.exception.InvalidAddress(
				"No data returned for address: " + this._addr.toString());
		}
		
		// turn into a DOM if we did not load from the cache
		if(this._fromCache == false){
			var xmlStr = data;
			try{
				data = this._toXML(data);
			}catch(e){
				exp = e;
			}
		}
		
		// make XPath available (for IE)
		if(exp == null){
			data = this._turnOnXPath(data);
		}
		
		// make sure our data is OPML
		if(exp == null){
			try{
				var rootTags = data.selectNodes("/opml");
				if(rootTags == null || dojo.lang.isUndefined(rootTags)
					|| rootTags.length == 0){
					exp = new hs.exception.InvalidAddress(
						"Return results are not OPML for address: " + this._addr.toString());		
				}
			}catch(e){ // selectNodes can throw an exception on IE
				exp = new hs.exception.InvalidAddress(
						"Return results are not OPML for address: " + this._addr.toString()
						+ ", exception: " + e);	
			}
		}
		
		// cache it if we did not just grab it from the cache
		if(exp == null && this._fromCache == false){
			this._cacheXML(this._url, xmlStr);
		}
		
		this._handler.call(null, this._addr, data, exp);
	},
	
	_error: function(type, errObj){
		this._finished = true;
		
		// dojo returns too much programmy information in
		// the error message; remove that part
		var message = errObj.message;
		if(message.indexOf("XMLHttpTransport Error:") != -1){
			message = message.replace(/XMLHttpTransport Error:/, "");
		}
		
		var exp = new hs.exception.InvalidAddress(
						"The following error occurred for " 
						+ this._addr.toString()
						+ ": " + message);
						
		this._handler.call(null, this._addr, null, exp);
	},
	
	_turnOnXPath: function(dom){
		dom.setProperty("SelectionLanguage", "XPath");
		
		// enable our namespaces
		Sarissa.setXpathNamespaces(dom, 
							hs.model.Document.HS_NAMESPACE + " " 
						  	+ hs.model.Document.HS_INTERNAL_NAMESPACE);
					  
		return dom;
	},
	
	_cacheXML: function(url, xmlStr){
		hs.util.XMLFetcher._cache[url] = xmlStr;
	},
	
	_getFromCache: function(url){
		var xmlStr = hs.util.XMLFetcher._cache[url];
		var dom = this._toXML(xmlStr);
		
		this._fromCache = true;
		
		return dom;
	},
	
	_inCache: function(url){
		return (hs.util.XMLFetcher._cache[url] != null 
			&& dojo.lang.isUndefined(hs.util.XMLFetcher._cache[url]) != null);
	},
	
	_toXML: function(xmlStr){
		var parser = new DOMParser();
		
		// parse the string
		var dom = parser.parseFromString(xmlStr, "text/xml");
		
		// make sure there are no errors
		if(Sarissa.getParseErrorText(dom) == Sarissa.PARSED_OK){
			return dom;
		}else{
			throw new hs.exception.InvalidAddress("The OPML document at " 
				+ this._addr.toString() + " "
				+ "is invalid: " + Sarissa.getParseErrorText(dom));
		}
	}
});



/**
	Walks the tree of hs.model.Nodes in an hs.model.Document, performing some 
	action or test on each node. The order walked is the same order a document
	would appear on the page, successively moving down the tree.
*/

/**
	@param ctxtNode : hs.model.Node - An hs.model.Node to start walking from.
	@param includeCtxt : Boolean - whether to include the context node in
	the walk. Optional parameter that defaults to true, which means we include
	the ctxtNode in the walk.
*/
hs.util.NodeWalker = function(ctxtNode, includeCtxt){
	if(ctxtNode == null || dojo.lang.isUndefined(ctxtNode)){
		throw new hs.exception.Filter(
					"No context given to hs.util.NodeWalker");
	}
	
	if(dojo.lang.isUndefined(includeCtxt)){
		includeCtxt = true;
	}
	
	this._doc = ctxtNode.doc;
	
	// begin by fulling unwinding the entire document into an XPath
	// node list, and then just iterate through this list

	/**
	  XPath: Do a union (|) to grab both our starting node as well as all of
	  it's following children and siblings.
	 */
	var xpath;
	if(includeCtxt){
		xpath = "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "//descendant-or-self::outline"
				+ " | "
				+ "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "/following::outline";
	}else{
		// different axis: descendant versus descendant-or-self
		xpath = "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "//descendant::outline"
				+ " | "
				+ "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "/following::outline";
	}
	var domNodes = this._doc.dom.selectNodes(xpath);

	if(domNodes == null || domNodes.length == 0){
		throw new hs.exception.Jump(
						"Could not create NodeWalker starting from: " + ctxtNode.number,
						this._doc, this._doc.address);
	}
	
	this._domNodes = domNodes;
}

dojo.lang.extend(hs.util.NodeWalker, {
	/** 
	  	Our fully unrolled, non-hierarchical list of dom nodes that we can walk to,
	  	thanks to XPath.
	 */
	_domNodes: null,	
	
	/** Our current index into our domNodes. */	
	_index: 0,
	
	/** Our current hs.model.Document. */
	_doc: null,

	/**
		Whether there is another hs.model.Node to walk.
		
		@returns Boolean
	*/
	hasNext: function(){
		if(this._index >= this._domNodes.length){
			return false;
		}else{
			return true;
		}
	},

	/**
		Returns the next hs.model.Node encountered by this walker.
		
		@returns hs.model.Node
	*/
	next: function(){
		if(this.hasNext() == false){
			throw new hs.exception.Filter("No more nodes to walk");
		}
		
		// get the next DOM node
		var currentDomNode = this._domNodes.item(this._index);
		
		// move the index forward
		this._index++;
		
		// turn this DOM node into an hs.model.Node
		var node = new hs.model.Node(currentDomNode, this._doc);
		
		return node;
	}
});


/**
	Tokenizes a node number, such as 1B22C2A, and returns each level as a 
	single number to easily step through a hierarchical node number. Numbering
	always starts at 1.
*/

/**
	@param nodeNumber : String The node number to tokenize, such as "2A5B".
	@throws hs.exception.InvalidAddress
*/
hs.util.NodeNumberTokenizer = function(nodeNumber){
	if(nodeNumber == null || dojo.lang.isUndefined(nodeNumber)
		|| nodeNumber == "0"){
		throw new hs.exception.InvalidAddress("Invalid node number: " + nodeNumber);		
	}
	
	var piece;
	var currentValue;
	while(nodeNumber != ""){
		// consume next piece of number
		if(/^[0-9]+/i.test(nodeNumber)){ // number
			piece = nodeNumber.match(/^([0-9]+)/i);
			nodeNumber = nodeNumber.replace(/^[0-9]+/i, "");
			piece = piece[1];
			piece = new Number(piece).valueOf();
			this._numbers.push(piece);
		}else if(/^[A-Z]+/i.test(nodeNumber)){ // letter
			piece = nodeNumber.match(/^([A-Z]+)/i);
			nodeNumber = nodeNumber.replace(/^[A-Z]+/i, "");
			piece = piece[1];
			
			// turn letter into a number
			// convert our piece from base 26 to
			// a base 10 number system using
			// a base conversion algorithm
			var stack = new Array();
			for(var i = 0; i < piece.length; i++){
				// convert ASCII code to number;
				// the ASCII code for A is 65, while Z is 90
				var letter = piece.charCodeAt(i);
				var value = letter - 65;
				stack.push((value % 10) + 1);
			}
			
			// collect digits together
			var i = 1;
			var result = 0;
			while(stack.length != 0){
				var value = stack.pop(); // get next base value
				value = value * i;
				result += value;
				i = i * 10; 
			}
			
			this._numbers.push(result); 
		}else{
			dojo.raise("Programming exception in hs.util.NodeNumberTokenizer: "
						+ nodeNumber);
		}
	}
}

dojo.lang.extend(hs.util.NodeNumberTokenizer, {
	_numbers: new Array(),
	
	/** 
		Whether there is another level to return.
		
		@returns Boolean
	*/
	hasNext: function(){
		 return (this._numbers.length > 0);
	},

	/** 
		Returns the next integer in the node number counting.
		
		@throws hs.exception.InvalidAddress
		@returns Integer
	*/
	next: function(){
		if(this.hasNext() == false){
			throw new hs.exception.InvalidAddress("No more pieces: " + this._numbers);
		}
		
		return this._numbers.shift();
	}
});




/**
	Will asychronously load a set of XSLT files, tell you when they are loaded,
	transform them into XML DOMs, and return them by name. Used by such filters
	as the Render filter to get their job done.
*/

/**
	
	Constructor. Loads the given XSLT files asychronously and tells you when it is
	done.
  
	@params files : Array An array of object literals, where each object has a
	member named 'name' that has the unique name of this XSLT, and 'url' which
	has the URL to this XSLT file. Example:
		files =
			[ 
				{ name: "render", url: "../../render.xslt" }
				{ name: "transclude", url: "../../transclude.xslt" }
			];
	@params loadedHandler : Function A callback function that is called when the
	files are finished loading, or with an error if an error occurs. Example:
		loadedHandler = function(success : Boolean, error : hs.util.InvalidAddress)
 */
hs.util.XSLTLoader = function(files, loadedHandler){
	this._loadedHandler = loadedHandler;
	this._files = files;
}

dojo.lang.extend(hs.util.XSLTLoader, {
	_xslt: new Object(),
	_files: null,	
	_filesLoaded: 0,
	_loadedHandler: null,


	/**
	  Begins the loading process.
	 */
	load: function(){
		// make sure Sarissa is loaded before we do anything
		if(typeof Sarissa == "undefined"){
			this._waitForSarissa();
		}else{
			this._loadFiles();
		}
	},

	/**
	  Returns the XSLTProcessor for the given XSLT script with the given name.
	  The name was controlled with the 'files' parameter passed in to the
	  constructor.
	  
	  @returns XSLTProcessor Returns the given XSLTProcessor for the given name,
	  null if it is not found.
	 */
	getXSLT: function(name){
		var xslt = this._xslt[name];
		
		if(xslt == null 
				|| dojo.lang.isUndefined(xslt)){
			return null;
		}
		
		return xslt;
	},
	
	_loadFiles: function(){
		for(var i = 0; i < this._files.length; i++){
			this._load(this._files[i].name, this._files[i].url);
		}
	},
	
	_getDocRoot: function(){
		var url = window.location.href;
		var endCut = null, hasFilename = false;
		
		// chop off any filenames
		for(var i = url.length; i--; i >= 0){
			// url[i] not supported on IE, because
			// underlying window.location.href is not
			// a String object but something native
			if(url.charAt(i) == "/"){
				if(hasFilename){
					endCut = i + 1;
				}
				break;
			}else if(url.charAt(i) == "."){
				hasFilename = true;
			}
		}

		if(hasFilename){
			url = url.substring(0, endCut);
		}
		return url;
	},
	
	_load: function(name, url){
		// expand the URL if it does not start with scheme://
		// or start with an /
		if(/[^:]*:/.test(url) == false && url.charAt(0) != "/"){
			url = this._getDocRoot() + url;
		}
	
		var self = this;
	
		// load the file
		var bindArgs = {
			url:		url,
			sync:		djConfig.testing,
			mimetype:	"text/plain",
			error:		function(type, errObj){
				// dojo returns too much programmy information in
				// the error message; remove that part
				var message = errObj.message;
				if(message.indexOf("XMLHttpTransport Error:") != -1){
					message = message.replace(/XMLHttpTransport Error:/, "");
				}
				
				var exp = new hs.exception.InvalidAddress(
								"The following error occurred for " 
								+ url
								+ ": " + message);
								
				// indicate that we failed
				self._loadedHandler.call(null, false, exp);
			},
			load:		function(type, data, evt){
				// create an instance of XSLTProcessor
				var processor = new XSLTProcessor();
				
				// create a DOM Document containing an XSLT stylesheet
				var xslDoc = Sarissa.getDomDocument();
				xslDoc = (new DOMParser()).parseFromString(data, "text/xml");
				
				// make the stylesheet reusable by importing it in the 
				// XSLTProcessor
				processor.importStylesheet(xslDoc);
				
				// store this XSLT transformer
				self._xslt[name] = processor;
				
				// see if we are done
				self._filesLoaded++;
				if(self._filesLoaded >= self._files.length){
					self._loadedHandler.call(null, true, null);
				}
			}
		};
		
		// dispatch the request
		dojo.io.bind(bindArgs);
	},
	
	_waitForSarissa: function(){
		var self = this;
		var sarissaTimer = window.setInterval(function(){
			if(typeof Sarissa != "undefined"){
				window.clearInterval(sarissaTimer);
				self._loadFiles();
			}
		}, 20);
	}
});


/**
  Adds dojo.dom.setAttributeNS into dojo.dom if it is not
  there in this version of Dojo; this is a custom method 
  we added to Dojo which is in the Dojo repository but is
  not in a release copy yet.
 */
if(typeof dojo.dom.setAttributeNS == "undefined"){
	/** 
	 * Implements DOM Level 2 setAttributeNS so it works cross browser.
	 *
	 * Example:
	 * dojo.dom.setAttributeNS(domElem, "http://foobar.com/2006/someSpec", 
	 * 							"hs:level", 3);
	 */
	dojo.dom.setAttributeNS = function(elem, namespaceURI, attrName, attrValue){
		if(elem == null || dojo.lang.isUndefined(elem)){
			dojo.raise("No element given to dojo.dom.setAttributeNS");
		}
		
		if(dojo.lang.isUndefined(elem.setAttributeNS) == false){ // w3c
			elem.setAttributeNS(namespaceURI, attrName, attrValue);
		}else{ // IE
			// get a root XML document
			var ownerDoc = elem.ownerDocument;
			var attribute = ownerDoc.createNode(
				2, // node type
				attrName,
				namespaceURI
			);
			
			// set value
			attribute.nodeValue = attrValue;
			
			// attach to element
			elem.setAttributeNode(attribute);
		}
	}
}
/**
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package provides hs.address, a set of classes for describing
	HyperScope addressing. It consists of the following classes:
	
	hs.address.Address
		A HyperScope address that can be resolved and manipulated. Addresses
		are composed of several hs.address.Pieces, such as an hs.address.FileInfo
		piece to describe it's file and path information.

	hs.address.Piece
		Abstract superclass for all of the kinds of components that can make up 
		an hs.address.Address, such as file information (hs.address.FileInfo), 
		addressing (hs.address.NodeAddress), etc.

	hs.address.FileInfo
		An hs.address.Piece that holds the file information for this Location, 
		such as the path, port, URL scheme, etc.

	hs.address.NodeAddress
		The abstract superclass of all node addressing types, which can address 
		specific portions of a document either directly or indirectly.

	hs.address.Viewspec
		Represents a specific viewspec letter in an hs.address.Address.

	hs.address.ContentFilter
		Represents a content filter at the end of an hs.address.Address, 
		such as ;"foobar";.

	hs.address.NodeNumber
		An hs.address.NodeAddress that is a node number, such as 2A3.

	hs.address.NodeID
		An hs.address.NodeAddress that is a node ID, such as 023.

	hs.address.NodeLabel
		An hs.address.NodeAddress that is a node label, such as foobar.

	hs.address.Marker
		An hs.address.NodeAddress that is a marker, such as @someMarker.

	hs.address.Relative
		An hs.address.NodeAddress that is a single relative address, such as .2u.

	hs.address.IndirectLink
		An hs.address.NodeAddress that is an indirect link, such as .l.

	hs.address.StringSearch
		An hs.address.NodeAddress that is a string search forwards from the 
		present location through the following nodes, such as "foobar".

	hs.address.StringPosition
		An hs.address.NodeAddress that jumps through a single node's textual 
		contents, such as -2w.
*/
	
dojo.provide("hs.address");

dojo.require("dojo.uri.*");
dojo.require("dojo.string.*");


/**
	A HyperScope address that can be resolved and manipulated. Addresses
	are composed of several hs.address.Pieces, such as an hs.address.FileInfo
	piece to describe it's file and path information.
*/

/**
	Creates a new address.
	
	@param url A string url, either complete, such as 
	http://bootstrap.org/test.opml#:x, or relative, such as
	#:x.
	@throws hs.exception.InvalidAddress
*/
hs.address.Address = function(url){
	this.nodeAddresses = new Array();
	this.viewspecs = new Array();

	// tokenize the url
	var tk = new hs.util.AddressTokenizer(url);
	while(tk.hasNext()){
		var p = tk.next();
		
		if(p.isPieceType("hs.address.FileInfo")){
			this.fileInfo = p;
		}else if(p.isPieceType("hs.address.NodeAddress")){
			this.nodeAddresses.push(p);
		}else if(p.isPieceType("hs.address.Viewspec")){
			this.viewspecs.push(p);
		}else if(p.isPieceType("hs.address.ContentFilter")){
			this.contentFilter = p;
		}
	}
}

dojo.lang.extend(hs.address.Address, {
	fileInfo: null, 						/** hs.address.FileInfo */
	nodeAddresses: null, 					/** hs.address.NodeAddress[] */
	viewspecs: null, 						/** hs.address.Viewspecs[] */
	contentFilter: null, 					/** hs.address.ContentFilter */
	
	_handler: null,
	_replacePage: null,
	_relativeTo: null,
	_inclusion: false,
	_includer: null,
	_inclusionParentAddress: null,

	_halted: false,

	/**
		Resolves this address into an hs.model.Document that can be worked with.
		The document that is returned will have it's hs.model.Document.dom
		fully filtered and rendered into it's hs.model.Document.renderHtml string.
		
		@param handler : Function A handler that will receive three arguments
		when the address is resolved:
			handler = function(address : hs.address.Address, 
												 doc : hs.model.Document, 
												 error : hs.exception.InvalidAddress)
			where 'address' is the original, unexpanded address; 'doc' is the
			document resolved and rendered; and 'error' is a possible error that
			occurred.
		@param replacePage : Boolean Whether we should replace the main page if this
		address points to a different location than the current one given by
		'relativeTo'.
		@param relativeTo : hs.model.Document The address we are resolving 
		this address relative to. This is an optional value and can be null
		if we are bootstrapping and simply initially loading a page, for
		example.
		@param inclusion : boolean An optional value that indicates
		that we are doing a resolution for a file that will
		be included; defaults to false.
		@param inclusionParentAddress : hs.address.Address An optional
		value that is the parent address that is including us.
	*/
	resolve: function(handler, replacePage, relativeTo, inclusion, 
						inclusionParentAddress){
		//debug("resolve, replacePage="+replacePage+", relativeTo="+relativeTo+", this="+this.toString());
		this._handler = handler;
		this._replacePage = replacePage;
		
		if(dojo.lang.isUndefined(relativeTo)){
			relativeTo = null;
		}
		this._relativeTo = relativeTo;
		
		if(dojo.lang.isUndefined(inclusion)){
			inclusion = false;
			inclusionParentAddress = this;
		}
		this._inclusion = inclusion;
		this._inclusionParentAddress = inclusionParentAddress;
		
		// if we have no document that we are relativeTo,
		// and we are a relative address, throw an exception
		if(relativeTo == null && this.isRelative()){
			throw new hs.exception.InvalidAddress(
				"Programming error: relative address given to "
				+ "hs.address.Address.resolve() when relativeTo "
				+ "is null; our address=" + this.toString());
		}
		
		if(relativeTo != null){			
			// determine the address being displayed
			var displayedAddr = this._getDisplayedAddress();
			
			// see if we are working with the same file
			var sameFile = this._isSameFile(displayedAddr, relativeTo);
			
			// expand ourselves into a full address
			hs.profile.start("expandall");
			var expandedAddr = this._expandAll(relativeTo, sameFile);
			hs.profile.end("expandall");
			
			// replace the page if replacePage is true and this
			// address is different than the current address
			if(replacePage == true && sameFile == false){
				this._changeDisplayedAddress(expandedAddr);
				if(djConfig.testing == false){
					return;
				}
			}
			
			// make sure to copy our initial state,
			// such as whether to replace the page
			// and what we are relative to
			expandedAddr = this._copyInitialState(expandedAddr);
			
			// load this expanded address
			this._load(expandedAddr);
		}else{
			// load this full address, but consolidate relative dots first
			var finalAddr = this.clone();
			finalAddr.fileInfo.consolidateRelativeDots();
			
			// make sure to copy our initial state,
			// such as whether to replace the page
			// and what we are relative to
			finalAddr = this._copyInitialState(finalAddr);
			
			this._load(finalAddr);
		}
	},
	
	/**
		Returns this address as a string. For example, 
		if the address is "#:x", then "#:x" is returned.
		
		@returns String
	*/
	toString: function(){
		var s = new hs.util.AddressSerializer(this);
		
		return s.serialize();
	},

	/**
		Determines if the given address is equal to this URL.
		
		@param addr Either an hs.address.Address or a String.
		@returns Boolean
	*/
	equals: function(addr){
		if(addr == null || dojo.lang.isUndefined(addr)){
			return false;
		}
		
		if(dojo.lang.isString(addr)){
			addr = new hs.address.Address(addr);
		}
		
		var addrStr = addr.toString();
		var thisStr = this.toString();
		return (addrStr == thisStr);
	},
	
	/**
	  Returns whether this address is relative or not, i.e.
	  it has a host, a scheme, a path, etc. 
	  For example, these are relative:
	  ../someFile
	  #2A:x
	  while this is not:
	  http://foobar.com
	  
	  @returns Boolean
	 */
	isRelative: function(){
		return this.fileInfo.isRelative();
	},
	
	clone: function(){
		var a = new hs.address.Address(this.toString());
		
		return a;
	},
	
	/**
	  Replaces resolution of this address with a 
	  new one, halting this one. Used for link
	  types that need to halt and take over resolution
	  in the middle, such as for indirect links.
	  
	  @param linkAddr : hs.address.Address The
	  address of the new address to start resolving.
	  @parma doc : hs.model.Document The document
	  that was being resolved before we halted
	  and replaced it's resolution.
	 */
	replaceResolution: function(linkAddr, doc){
		this._halted = true;
		
		// resolve this address in the same
		// way we were
		linkAddr.resolve(
						this._handler, 
						this._replacePage, 
						doc, 
						this._inclusion, 
						this._inclusionParentAddress);
	},

	/**
		Determines if the address given is referencing the same file as us.
		Both addresses have their file portion expanded before checking.
		
		@param address An hs.address.Address or a String to compare against.
		@param relativeTo : hs.model.Document A document to expand against.
		@returns Boolean
		@throws hs.exception.InvalidAddress
	*/
	_isSameFile: function(address, relativeTo){
		// see if 'address' is an hs.address.Address
		if(dojo.lang.isUndefined(address.resolve) == true){
			address = new hs.address.Address(address);
		}
		
		relativeTo = relativeTo.address.fileInfo;
		var f1 = address.fileInfo.expand(relativeTo);
		var f2 = this.fileInfo.expand(relativeTo);
		
		return (f1.equals(f2));
	},
	
	/**
		Expands the file portion of an address, relative to the given document.
		For example, if this address is just "#:x", then we use the document
		given for file information and possibly expand it to
		http://bootstrap.org/neuberg/arch.opml#:x, if that is the file
		address of the given document.
		
		This method does not change the address it is called on; instead, it
		returns a new address that has been expanded.
		
		@param relativeTo : hs.model.Document
		@returns hs.address.Address
	*/
	_expandFileInfo: function(relativeTo){
		// if relativeTo is null, and we are not already expanded,
		// then throw an exception
		if(relativeTo == null && this.fileInfo.isRelative() == false){
			throw new hs.exception.InvalidAddress("No document to expand "
													+ "relative address against: "
													+ this.toString());
		}
		
		var expandedFile = this.fileInfo.expand(relativeTo.address.fileInfo);
		var results = this.clone();
		results.fileInfo = expandedFile;
		
		return results;
	},
	
	/**
		Expands the node address portion of an address, if none was given. For
		example, if the address is "#:x", this would add the default node
		address of 0: "#0:x".
		
		This method does not change the address it is called on; instead, it
		returns a new address that has been expanded.
		
		@param relativeTo : hs.model.Document the hs.model.Document to
		get the context node address to write in if it is not present.
		@returns hs.address.Address
	*/
	_expandNodeAddress: function(doc){
		var addr = this.clone();
		
		// if we have a node number or a node ID then return
		if(this.nodeAddresses.length > 0){
			var p = this.nodeAddresses[0];
			if(p.isPieceType("hs.address.NodeNumber") == true && p.isOffset == true){
				return addr;
			}
			
			if(p.isPieceType("hs.address.NodeID") == true){
				return addr;
			}
		}
		
		// see if the doc has a node context yet
		var number = "0";
		if(doc.nodeCtxt != null 
			&& dojo.lang.isUndefined(doc.nodeCtxt) == false){
			number = doc.nodeCtxt.number;
		}
		
		var nodeCtxt = new hs.address.NodeNumber(number, false);
		
		// add our new nodeCxt at the beginning of our node addresses
		addr.nodeAddresses = [nodeCtxt].concat(addr.nodeAddresses);
		
		return addr;
	},
	
	/**
		Takes the hs.model.Document's relativeTo's viewspecs, and prepends them
		before this addresses viewspecs if it is a relative address. Needed to
		get the true, full list of viewspecs that an address truly talks about
		for resolution, since old viewspecs are also applied to new addresses
		if they are relative.
		
		This method does not change the address it is called on; instead, it
		returns a new address that has been expanded.
		
		@param relativeTo : hs.model.Document
		@returns hs.address.Address
	*/
	_expandViewspecs: function(relativeTo){
		var addr = this.clone();
		
		// only append viewspecs if we have some old ones
		if(relativeTo.currentViewspecs == null){
			return addr;
		}
		
		// turn existing viewspecs into string then
		// push to beginning of what we have
		var oldViews = relativeTo.currentViewspecs.toString();
		var results = new Array();
		for(var i = 0; i < oldViews.length; i++){
			var currentView = new hs.address.Viewspec(oldViews.charAt(i));
			results.push(currentView);
		}
		addr.viewspecs = results.concat(addr.viewspecs);
		
		return addr;
	},
	
	/**
		Copies any content filter to our new expanded
		address.
		
		@param relativeTo : hs.model.Document
	 */
	_expandContentFilter: function(relativeTo){
		var addr = this.clone();
		
		if(relativeTo.address.contentFilter != null
			&& addr.contentFilter == null){
			var newFilter = relativeTo.address.contentFilter.clone();
			addr.contentFilter = newFilter;	
		}
		
		return addr;
	},
	
	/**
	  	Fully expands all parts of this address.
	  	
	  	@param relativeTo : hs.model.Document
	  	@param sameFile : Boolean whether this address refers
	  	to the same file as the address of relativeTo.
	  	@returns hs.address.Address
	 */
	_expandAll: function(relativeTo, sameFile){
		var expandedAddr = this._expandFileInfo(relativeTo);	

		// don't expand the rest if we are not dealing with
		// the same file
		if(sameFile == false){
			return expandedAddr;
		}

		expandedAddr = expandedAddr._expandNodeAddress(relativeTo);
		expandedAddr = expandedAddr._expandViewspecs(relativeTo);
		expandedAddr = expandedAddr._expandContentFilter(relativeTo);
		
		return expandedAddr;
	},
	
	_copyInitialState: function(addr){
		addr._replacePage = this._replacePage;
		addr._relativeTo = this._relativeTo;
		addr._inclusion = this._inclusion;
		addr._inclusionParentAddress = this._inclusionParentAddress;
		addr._handler = this._handler;
		
		return addr;
	},
	
	_getDisplayedAddress: function(){
		// REFACTOR: This should really belong in an hs.Window class
		// to encapsulate seperate HyperScope windows and whether
		// we are unit testing or not
		var docURL = window.location.href;
		if(djConfig.testing == true){ // unit testing
			docURL = hs.model.testingCurrentURL;
		}
		var displayedAddr = new hs.address.Address(docURL);
		
		return displayedAddr;
	},
	
	_changeDisplayedAddress: function(addr){
		// REFACTOR: This should really belong in an hs.Window class
		// to encapsulate seperate HyperScope windows and whether
		// we are unit testing or not
		if(djConfig.testing == true){ // unit testing
			hs.model.testingCurrentURL = addr.toString();
		}else{
			window.location.href = addr.toString();
		}
	},
	
	_load: function(addr){
		if(addr == null || dojo.lang.isUndefined(addr)){
			addr = this;
		}
		
		hs.profile.start("_load");
		var loadHandler = dojo.lang.hitch(this, this._loadHandler);
		var fetcher = new hs.util.XMLFetcher();
		fetcher.load(addr, loadHandler);
		hs.profile.end("_load");
	},
	
	_loadHandler: function(address, dom, error){
		try{
			//debug("_loadHandler, address="+address+", dom="+dom+", error="+error);
			if(error != null && dojo.lang.isUndefined(error) == false){
				this._handler.call(null, this, null, error);
				return;
			}
			
			hs.profile.start("loadHandler");
			
			// create our Document
			var doc = new hs.model.Document(address, dom);
	
			// execute node addressing
			doc = this._applyNodeAddressing(address, doc);
			
			// see if our resolution has been halted
			if(address._halted == true){
				address._halted = false;
				return;	
			}
	
			// figure out what our viewspecs are
			doc = this._applyViewspecs(address, doc);		
			
			// execute transclusions if we are to do so
			if(doc.currentViewspecs.runSequenceGenerators() == true
				|| this._inclusion == true){
				// we must avoid infinite recursive inclusion loops;
				// this can happen if we are transcluding our own
				// document, which will cause transclusions to expand
				// and the process will repeat again
				if(this._inclusion == false
					|| address.fileInfo.equals(this._inclusionParentAddress.fileInfo) == false){
					this._includer = new hs.filter.Transcluder(address);
					var self = this;
					this._includer.apply(doc, dojo.lang.hitch(this, function(doc, error){
						// use a closure to pass in what our address is
						self._transclusionDone(address, doc, error);	
					}));
					
					// we must now wait asychronously to run the
					// rest until the transcluder is done getting
					// it's files
					return;
				}
			}
			
			// run content filters
			doc = this._executeContentFilter(address, doc);
			
			// minimize our address to have things like a 
			// default node address if needed 
			doc = this._minimizeAddress(doc);
			
			hs.profile.end("loadHandler");
			
			this._doneResolving(doc, error);
		}catch(exp){
			this._handler.call(null, this, null, exp);
		}
	},
	
	_applyNodeAddressing: function(address, doc){
		// execute our node addressing portion
		for(var i = 0; i < address.nodeAddresses.length; i++){
			var p = address.nodeAddresses[i];
			p.apply(doc, null, address);
			
			// see if our resolution has been halted
			if(address._halted == true){
				break;
			}
		}
		
		return doc;
	},
	
	_applyViewspecs: function(address, doc){
		// apply our viewspecs
		for(var i = 0; i < address.viewspecs.length; i++){
			var v = address.viewspecs[i];
			doc.currentViewspecs.add(v);
		}
		
		return doc;
	},
	
	_doneResolving: function(doc, error){
		// we're done resolving
		this._handler.call(null, this, doc, error);
	},
	
	_executeContentFilter: function(address, doc){
		if(address.contentFilter != null){
			address.contentFilter.apply(doc);
		}
		
		return doc;
	},
	
	_minimizeAddress: function(doc){
		// our Document's address is correct, but not
		// minimized, which means it might have things like the
		// default context, such as #0, and spurious viewspecs
		var docUrl = doc.toURL();
		
		doc.address = new hs.address.Address(docUrl);
		
		return doc;
	},
	
	_transclusionDone: function(address, doc, error){
		//debug("transclusionDone, address="+address+", doc="+doc+", error="+error);
		if(error != null && dojo.lang.isUndefined(error) == false){
			this._handler.call(null, this, doc, error);
			return;
		}
		
		// see if we need to re-create our document
		// metadata, such as node numbers and levels
		if(this._includer.metadataDirty == true){
			doc.normalize();
		}
		
		// now finish the rest of the address
		// resolution process
		doc = this._executeContentFilter(address, doc);
		doc = this._minimizeAddress(doc);
		
		hs.profile.end("loadHandler");
		
		this._doneResolving(doc, error);
	}
});
	
	
/** 
	Abstract superclass for all of the kinds of components that can make up 
	an hs.address.Address, such as file information (hs.address.FileInfo), 
	addressing (hs.address.NodeAddress), etc.
	
	<<abstract>>
*/

hs.address.Piece = function(){
}

dojo.lang.extend(hs.address.Piece, {
	/** 
		Turns this piece into a string representation of it's data.
		
		<<abstract>>
		@returns String
	*/
	toString: function(){
		dojo.raise("Abstract method");
	},

	/**
		Determines if this piece is the given piece type, which is it's full class
		name. For example, if I want to see if a piece is an hs.address.NodeNumber,
		I would pass this method the string "hs.address.NodeNumber". Subclasses
		should test against their full class name, including whatever parent
		subclasses they may have, such as hs.address.NodeAddress.
		
		<<abstract>>
		@param className : String
		@returns Boolean
	*/
	isPieceType: function(className){
		dojo.raise("Abstract method");
	}
});



/**
	An hs.address.Piece that holds the file information for this Location, 
	such as the path, port, URL scheme, etc. If this URL has an anchor
	then the anchor info is dropped and not stored.
*/

/** 
	@param url : String Used to construct the file information.
	@throws hs.exception.InvalidAddress
*/
hs.address.FileInfo = function(url){
	this._parse(url);
}

dojo.inherits(hs.address.FileInfo, hs.address.Piece);

dojo.lang.extend(hs.address.FileInfo, {
	scheme: null,
	host: null,
	port: null,
	path: null, /** path + file */
	query: null,
	
	/**
		Whether this FileInfo has full, non-relative path information, such
		as /neuberg/ versus a relative path, such as
		../foobar/. If the url only has the host name and no
		file or path, such as http://bootstrap.org, then this returns
		true since it refers to the default file to load. If no host name
		is present, but it is a full path, such as /foobar, then this
		returns true.
		
		@returns Boolean
	*/
	hasFullPath: function(){
		// do we have a host?
		if(this.host != null){
			return true;
		}
		
		// is there a leading slash before our path?
		if(dojo.string.startsWith(this.path, "/")){
			return true;
		}
		
		// is there a leading backslash before our path (from some window platforms)?
		if(dojo.string.startsWith(this.path, "\\")){
			return true;
		}
		
		return false;
	},
	
	/** 
		Expands this FileInfo with full protocol, path and file information relative
		to some other hs.address.FileInfo. This FileInfo stays unchanged, and instead 
		a new FileInfo is returned that is expanded.
		
		@param relativeToFile hs.address.FileInfo
		@returns hs.address.FileInfo The expanded FileInfo.
	*/
	expand: function(relativeToFile){
		// make copies of the FileInfo's we are working
		// with to leave the original's alone
		var f = this.clone();
		
		relativeToFile = relativeToFile.clone();
		
		// are we not relative?
		if(this.isRelative() == false){
			// just consolidate relative dots
			// i.e.: /../foobar/hello/.. becomes
			// /foobar
			f.consolidateRelativeDots();
			return f;
		}
		
		// is what we are expanding against relative?
		if(relativeToFile.isRelative()){
			throw new hs.exception.InvalidAddress(
				"Programming error: hs.address.FileInfo.expand() "
				+ "was passed a relative path to expand against");
		}
		
		// handle trailing slash issues; if either f or
		// relativeToFile are directories and not files,
		// but have no trailing slashes, add one
		// Example: directory/foobar
		// Result: directory/foobar/
		//
		// Example: /directory/foobar.opml
		// Result: /directory/foobar.opml
		if(f._hasFile() == false && dojo.string.endsWith(f.path, "/") == false){
			f.path += "/";
		}
		
		if(relativeToFile._hasFile() == false && dojo.string.endsWith(relativeToFile.path, "/") == false){
			relativeToFile.path += "/";
		}
		
		// if f's path is simply ./, which means it's basicly empty, then
		// just get rid of it
		if(f.path == "./"){
			f.path = "";
		}

		// handle the following special cases when building
		// up our final expanded path:
		
		// if we start with a slash, then replace relativeToFile's
		// path with our own
		// Example f: /../foobar.opml
		// Example relativeToFile: http://bootstrap.org/../directory/foobar
		// Result: http://bootstrap.org/../foobar.opml
		
		// if we have a filename, and so does our relativeToFile,
		// then strip off the one on relativeToFile to leave
		// just a directory path
		// Example f: someFile.opml
		// Example relativeToFile: http://bootstrap.org/../directory/foobar.xml
		// Result: http://bootstrap.org/../directory/someFile.opml
		
		// if we do not have a filename, but our relativeToFile does,
		// then remove relativeToFile's filename and paste us first.
		// one exception: if f is blank, don't do this
		// Example f: directory/somewhere
		// Example relativeToFile: http://bootstrap.org/anotherfile.opml
		// Results: http://bootstrap.org/directory/somewhere
		
		// anything else, we simply add our relativeToFile's path
		// to f's path.
		
		if(dojo.string.startsWith(f.path, "/")){
			relativeToFile.path = f.path;
		}else if(f._hasFile() && relativeToFile._hasFile()){
			// remove the file name from relativeToFile
			relativeToFile.path = relativeToFile._getDirectoryPath();
			
			// add them together
			f.path = relativeToFile.path + f.path;
		}else if(f.path != "" && f._hasFile() == false && relativeToFile._hasFile()){
			// remove the file name from relativeToFile
			relativeToFile.path = relativeToFile._getDirectoryPath();
			
			// add them together
			f.path = relativeToFile.path + f.path;
		}else{
			f.path = relativeToFile.path + f.path;		
		}
		
		// if we both have query strings, keep ours
		if(f.query != null && relativeToFile.query != null){
			relativeToFile.query = f.query;
		}
		
		// copy over our information
		f.scheme = relativeToFile.scheme;
		f.port = relativeToFile.port;
		f.host = relativeToFile.host;
		f.query = relativeToFile.query;
		
		// get rid of trailing /./, such as http://bootstrap.org/./
		if(dojo.string.endsWith(f.path, "/./")){
			f.path = f.path.replace(/(\/\.\/)$/, "/");
		}
		
		// now consolidate double relative dots. 
		// example: /../foobar/somedir/../hello/hello.opml becomes
		// /foobar/hello/hello.opml
		f.consolidateRelativeDots();

		return f;
	},
	
	equals: function(f){
		if(f == null || dojo.lang.isUndefined(f)){
			return false;
		}
		
		if(f.scheme == this.scheme
			&& f.port == this.port
			&& f.host == this.host
			&& f.query == this.query
			&& f.path == this.path){
			return true;		
		}else{
			return false;
		}
	},

	/**
		Returns this FileInfo as a string, un-expanded. For example, if this
		FileInfo just had the path and file, such as "/neuberg/arch.opml",
		then this is all that would be returned. Spaces are not encoded
		as %20.
		
		@returns String
	*/
	toString: function(){
		var s = new String();
		
		if(this.scheme != null && this.host != null){
			s += this.scheme + "://";
		}
		
		if(this.host != null){
			s += this.host;
		}
		
		if(this.host != null && this.port != 80){
			s += ":" + this.port;
		}
		
		if(this.path != null){
			s += this.path;
		}

		if(this.query != null){
			s += this.query;
		}
		
		return s;
	},
	
	/**
		Clones this FileInfo.
		
		@returns hs.address.FileInfo
	*/
	clone: function(){
		var f = new hs.address.FileInfo(this.toString());
		f.scheme = this.scheme;
		f.host = this.host;
		f.port = this.port;
		f.path = this.path;
		f.query = this.query;
		
		return f;
	},
	
	isPieceType: function(className){
		if(className == "hs.address.FileInfo"){
			return true;
		}else{
			return false;
		}
	},
	
	/**
	  Returns whether this URL is relative or not.
	 */
	isRelative: function(){
		if(this.scheme == null
			|| this.host == null
			|| this.path == null){
			return true;
		}else{
			return false;
		}
	},
	
	/** 
	  Consolidates the dots in a full non-relative URL into their final, 
	  non-dot form.
	  
	  Example input: /../foobar/hello/world/../somefile.opml
	  Example output: /foobar/hello/somefile.opml
	 */
	consolidateRelativeDots: function(){
		if(this.isRelative() == true
			|| this.path == null
			|| dojo.string.startsWith(this.path, "/") == false
			|| this.path == "/"){
			return;
		}
		
		// tokenize our path into pieces
		var pathPieces = this.path.match(/([^\/]*)/g);
		pathPieces.shift();
		
		// push each one onto a stack, 'popping' directory 
		// names off the stack if we have a ..
		var pathStack = new Array();
		for(var i = 0; i < pathPieces.length; i++){
			if(pathPieces[i] != ".." && pathPieces[i] != "." && pathPieces[i] != ""){
				pathStack.push(pathPieces[i]);
			}else if(pathPieces[i] == ".." && pathStack.length != 0){
				pathStack.pop();
			}else if(pathPieces[i] == "." || pathPieces[i] == ".." || pathPieces[i] == ""){
				// throw away
			}
		}
		
		// now add our slashes back in
		var results = "/" + pathStack.join("/");
		
		// add a trailing slash if we don't have a filename
		if(this._hasFile() == false 
			&& dojo.string.endsWith(results, "/") == false){
			results = results + "/";
		}
		
		this.path = results;
	},
	
	_hasFile: function(){
		if(this.path != null && dojo.string.endsWith(this.path, "/")){
			return false;
		}
		
		var hasFileTester = /((?:[^\.\/]*\.[^\.\/]+)+)$/;
		return hasFileTester.test(this.path);
	},
	
	_getFile: function(){
		if(this._hasFile() == false){
			return null;
		}
		
		var hasFileTester = /((?:[^\.\/]*\.[^\.\/]+)*)$/;
		return this.path.match(hasFileTester)[1];
	},
	
	_getDirectoryPath: function(){
		var fileName = this._getFile();
		var cutAt = this.path.indexOf(fileName);
		var dirPath = this.path.substring(0, cutAt);
		
		// if there is no trailing slash add one
		if(dojo.string.endsWith(dirPath, "/") == false){
			dirPath += "/";
		}
		
		return dirPath;
	},
	
	_startsWithDomain: function(str){
		if(str == null 
			|| dojo.string.startsWith(str, "/")
			|| dojo.string.startsWith(str, ".")
			|| dojo.string.trim(str) == ""
			|| /^[^\?\:#]*:\/\//.test(str) == true){ /** scheme: */
			return false;
		}
		
		var potentialDomain = /^([^\/\:]*)/;
		var domain = null; 
		if(potentialDomain.test(str) == true){
			potentialDomain = str.match(potentialDomain)[1];
			// do we even have a dot?
			if(str.indexOf(".") == -1){
				domain = null;
			}else if(/[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/.test(potentialDomain) == true){
				// ip address
				domain = potentialDomain;
			}else if(potentialDomain == "localhost"){
				domain = "localhost";
			}else{
				// do we only have two letters at the end?
				// then we are a country code
				if(/\.[a-z][a-z]$/i.test(potentialDomain) == true){
					domain = str;	
				}
				
				// are we a standard TLD?
				var tld = [ /\.example$/i, /\.invalid$/i, /\.test$/i, /\.arpa$/i, /\.aero$/i, 
							/\.biz$/i, /\.com$/i, /\.coop$/i, /\.edu$/i, /\.gov$/i, /\.info$/i,
							/\.int$/i, /\.mil$/i, /\.mobi$/i, /\.museum$/i, /\.name$/i, /\.net$/i,
							/\.org$/i, /\.pro$/i, /\.travel$/i, /\.asia$/i, /\.post$/i, /\.tel$/i,
							/\.geo$/i ];
				for(var i = 0; i < tld.length; i++){
					if(tld[i].test(potentialDomain) == true){
						domain = potentialDomain;
						break;
					}
				}
			}
		}
		
		if(domain == null){
			return false;
		}else{
			return true;
		}
	},
	
	_parse: function(url){
		if(url == null || dojo.lang.isUndefined(url)){
			throw new hs.exception.InvalidAddress("Programming error, "
													+ "Invalid address: " + url);
		}
		
		url = dojo.string.trim(url);
		
		// normalize empty urls to ./
		if(url == ""){
			url = "./";
		}
		
		// remove everything after the hash mark
		url = url.replace(/(#.*)/, "");
		
		// transform encoded %20 values into spaces
		url = url.replace(/%20/, " ");
		
		// make sure we don't just have scheme:// and nothing else
		if(/^[^\?\:#]*:\/\/$/.test(url)){ /** scheme:// */
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// handle full (http://...) and partial (someDir/someFile.opml) 
		// addresses differently
		if(/^[^\?\:#]*:/.test(url) || this._startsWithDomain(url)){ /** scheme: or somedomain.org/*/
			this._parseFullUrl(url);		
		}else{
			this._parsePartialUrl(url);
		}
		
		// make sure out path doesn't have incorrect, multiple slashes (i.e. dir///dir)
		if(this.path != null && /\/{2,}/.test(this.path)){
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// make sure our query doesn't have incorrect, multiple question marks (i.e. ?f?o?o)
		if(this.query != null && url.split("?").length > 2){
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// add a trailing slash if we are not dealing with a filename
		// and don't have one already
		if(this._hasFile() == false 
			&& dojo.string.endsWith(this.path, "/") == false){
			this.path += "/";
		}
	},
	
	/** Example: http://foobar.com/hello.opml or somedomain.org/hello.opml*/
	_parseFullUrl: function(url){
		var origUrl = url;
		
		// if we don't have a scheme and port, just add defaults
		if(this._startsWithDomain(url)){
			url = "http://" + url;
		}
		
		// transform into a URI object to retrieve out each value
		url = new dojo.uri.Uri(url);
		
		// set and normalize the values
		
		// scheme
		this.scheme = url.scheme;
		if(dojo.lang.isUndefined(this.scheme) || this.scheme == null){
			this.scheme = "http";
		}
		// only http and https supported
		if(this.scheme != "http" && this.scheme != "https"){
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// port
		this.port = url.port;
		if(dojo.lang.isUndefined(this.port) || this.port == null){
			this.port = 80;
		}
		// make sure it's a number, not a string
		if(this.port != null){
			this.port = new Number(this.port).valueOf(); 
		}
		
		// host
		this.host = url.host;
		if(dojo.lang.isUndefined(this.host)){
			this.host = null;
		}
		
		// path
		this.path = url.path;
		if(dojo.lang.isUndefined(this.path)){
			this.path = null;
		}
		// get rid of blank paths
		if(this.path != null && dojo.string.trim(this.path) == ""){
			this.path = null;
		}
		// turn /./ into /
		if(this.path == "/./"){
			this.path = "/";
		}
		
		// query
		this.query = url.query;
		if(dojo.lang.isUndefined(this.query)){
			this.query = null;
		}
		// add ? to query and trim spaces
		if(this.query != null){
			this.query = dojo.string.trim(this.query);
			if(this.query == ""){
				this.query = null;
			}
		}
		// get rid of blank queries
		if(this.query != null && dojo.string.startsWith(this.query, "?") == false){
			this.query = "?" + this.query;
		}
		
		// miscellaneous
		
		// if we just have a host and no path, normalize the path to /
		if(this.host != null && this.path == null){
			this.path = "/";
		}
	},
	
	/** Example: /someDir/someFile.opml?param1=param2 */
	_parsePartialUrl: function(url){
		// parse out the path and query
		var m = url.match(/^([^\?#]*)(\??[^#]*)#?.*$/);
		if(m[1] != null && !dojo.lang.isUndefined(m[1])
			&& dojo.string.trim(m[1]) != ""){
			this.path = m[1];
		}
		
		if(m[2] != null && !dojo.lang.isUndefined(m[2])
			&& dojo.string.trim(m[2]) != ""){
			this.query = m[2];
		}
		
		// normalize empty paths to ./
		if(this.path == null){
			this.path = "./";
		}
		
		
		// normalize .. and . to ../ and ./
		if(this.path == ".."){
			this.path = "../";
		}
		if(this.path == "."){
			this.path = "./";
		}

		// give defaults to the scheme and port
		this.scheme = "http";
		this.port = 80;
	}
});



/**
	The abstract superclass of all node addressing types, which can address 
	specific portions of a document either directly or indirectly.
	
	<<abstract>>
*/

hs.address.NodeAddress = function(){
}

dojo.inherits(hs.address.NodeAddress, hs.address.Piece);

dojo.lang.mixin(hs.address.NodeAddress.prototype, hs.filter.Filter);

dojo.lang.extend(hs.address.NodeAddress, {
});



/**
	Represents a specific viewspec letter in an hs.address.Address.
*/

hs.address.Viewspec = function(letter){
	if(letter == null || dojo.lang.isUndefined(letter)
		|| /^[A-Za-z]$/.test(letter) == false){
		throw new hs.exception.InvalidAddress("? " + letter);
	}
	
	this.letter = letter;
}

dojo.inherits(hs.address.Viewspec, hs.address.Piece);

dojo.lang.extend(hs.address.Viewspec, {
	letter: null, 												/** String */
	
	isPieceType: function(className){
		if(className == "hs.address.Viewspec"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.letter;
	}
});



/**
	Represents a content filter at the end of an hs.address.Address, 
	such as ;"foobar";.
*/

/**
	@param search : String A content filter, either delimited with " for
	simple content filters, such as "foobar", or delimited with / for full
	regular expressions, such as /foobar/i. Semicolons are the content
	filter should have been removed before calling this
	constructor.
	@throws hs.exception.InvalidAddress
*/
hs.address.ContentFilter = function(search){
	// make sure search string is delimited with "double-quotes" or
	// with regular expression slashes and an end letter - /foobar/i
	if(search == null || dojo.lang.isUndefined(search)
		|| /(?:^\"(?:\\\"|[^\"])*\"$)|(?:^\/(?:\\\/|[^\/])*\/[a-z]*$)/i.test(search) == false){
		throw new hs.exception.InvalidAddress("? " + search);
	}
	
	if(dojo.string.trim(search) == '""' || search == "//"){
		throw new hs.exception.InvalidAddress("? " + search);
	}
	
	this.search = search;
}

dojo.inherits(hs.address.ContentFilter, hs.address.Piece);

dojo.lang.mixin(hs.address.ContentFilter.prototype, hs.filter.Filter);

dojo.lang.extend(hs.address.ContentFilter, {
	/** Our search string, without semicolon delimiters. */
	search: null,

	/**
		Turns this content filter's data into a string, without semicolon
		delimiters.
		
		@returns String
	*/
	toString: function(){
		return this.search;
	},
	
	apply: function(doc){
		var search = this.search;
		// if we are a string, then create a regular expression
		// that will find only us in a case insensitive way
		// i.e. we only do a full match not a partial match
		if(dojo.string.startsWith(search, '"') == true){
			// take off the quotes
			search = search.substring(1);
			search = search.substring(0, search.length - 1);
			
			// escape our data
			search = this._escapeData(search);
			
			// make our regular expresion
			regExp = new RegExp("(?:^|[ ])" + search + "(?:$|[ ])");
			
			// execute it
			this._doContentFilter(regExp, doc, this.search);
		}else{ // we are already a regular expression
			// turn us from a stringified regular expression
			// into a real one
			var regExp = eval(search);
			
			// execute it
			this._doContentFilter(regExp, doc, this.search);
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.ContentFilter"){
			return true;
		}else{
			return false;
		}
	},
	
	clone: function(){
		var newFilter = new hs.address.ContentFilter(this.search);
		
		return newFilter;
	},
	
	/** 
	  Escapes data from the user that will be included in
	  a regular expression, escaping characters that have meaning
	  for reg exps.
	*/
	_escapeData: function(data){
		data = data.replace(/\\/g, "\\\\");
		data = data.replace(/\[/g, "\\[");
		data = data.replace(/\]/g, "\\]");
		data = data.replace(/\"/g, "\\\"");
		data = data.replace(/\'/g, "\\\'");
		data = data.replace(/\^/g, "\\^");
		data = data.replace(/\*/g, "\\*");
		data = data.replace(/\+/g, "\\+");
		data = data.replace(/\-/g, "\\-");
		data = data.replace(/\?/g, "\\?");
		data = data.replace(/\|/g, "\\|");
		data = data.replace(/\./g, "\\.");
		data = data.replace(/\{/g, "\\{");
		data = data.replace(/\}/g, "\\}");
		data = data.replace(/\,/g, "\\,");
		data = data.replace(/\(/g, "\\(");
		data = data.replace(/\)/g, "\\)");
		data = data.replace(/\:/g, "\\:");
		data = data.replace(/\;/g, "\\;");
		data = data.replace(/\$/g, "\\$");
		data = data.replace(/\=/g, "\\=");
		data = data.replace(/\!/g, "\\!");
	
		return data;
	},
	
	_doContentFilter: function(tester, doc, contentFilter){
		// get our starting context
		var startingNode;
		var includeCtxt;
		var filterType = doc.currentViewspecs.getContentFilterType();
		if(filterType == hs.filter.ViewspecConstants.FILTER_ALL){
			// get the first outline node from the root
			var domNode = doc.getOriginDomNode();
			
			// make sure it is good data
			if(domNode == null){
				throw new hs.exception.Jump("No origin node in document", 
											doc, doc.address);
			}
			
			startingNode = new hs.model.Node(domNode, doc);
			includeCtxt = true;
		}else if(filterType == hs.filter.ViewspecConstants.NEXT_FILTERED_NODE){
			startingNode = doc.nodeCtxt;
			includeCtxt = false;
		}else{ // no content filtering turned on
			// nothing to do
			return;
		}
		
		// get a node walker, starting from the correct context
		var walker = new hs.util.NodeWalker(startingNode, includeCtxt);
		
		// walk our nodes, testing each one with our content
		var foundANode = false;
		var matchingNodes = new Array();
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our content?
			if(node.test(tester)){
				foundANode = true;
				dojo.dom.setAttributeNS(
							node.domNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
								+ ":passes-content-filter",
							"yes");
				
				// persist this node match for a potential
				// context setting
				matchingNodes[matchingNodes.length] = node;
				matchingNodes["_" + node.number] = node;
			}
		}
		
		if(foundANode == false){
			throw new hs.exception.InvalidAddress("? " + contentFilter,
													doc, doc.address);
		}
		
		// set our context node; this is tricky.
		// we want to set our context node to a match, but want
		// to be careful not to rewrite a previous context node
		// setting; save the node address of every match,
		// and compare it against our existing context node at the
		// end; if that context node is in our set, use it; if not, choose
		// the first best matching node
		var existingNumber = doc.nodeCtxt.number;
		if(typeof matchingNodes["_" + existingNumber] == "undefined"){
			// existing context is not a matching node; reset to the
			// first matching node that has a node-counter number
			// closest to ours
			var existingCounter = doc.nodeCtxt.nodeCounter;
			var firstMatch = matchingNodes[0];
			var lastMatch = matchingNodes[matchingNodes.length - 1];
			var useNode = null;
			// if the existing context is smaller than our first node...
			if(existingCounter <= firstMatch.nodeCounter){
				useNode = firstMatch;
			}else if(existingCounter >= lastMatch.nodeCounter){
				// if the existing context is greater than our last node...
				useNode = lastMatch;
			}else{
				// TODO: We could probably use a better algorithm to
				// get a better closest context node to one of the matches
				// then just getting the first match
				useNode = firstMatch;
			}
			doc.nodeCtxt = useNode;
		}
	}
});




/**
	An hs.address.NodeAddress that is a node number, such as 2A3.
*/

/**
 	@param number : String The node number, such as "2A3".
 	@param offset : Boolean Optional parameter that controls whether
 	this is an offset node number, such as !2A3.
 	@throws hs.exception.InvalidAddress
 */
 
hs.address.NodeNumber = function(number, isOffset){
	if(isOffset == null || dojo.lang.isUndefined(isOffset)){
		isOffset = false;
	}
	
	this.isOffset = isOffset;
	
	if(number == null || dojo.lang.isUndefined(number)
		|| /^[0-9]+(?:[a-z0-9]*)$/i.test(number) == false){
		throw new hs.exception.InvalidAddress("? " + number);
	}
	
	// filter out node id's, except for the root node number "0"
	if(dojo.string.startsWith(number, "0") && number != "0"){
		throw new hs.exception.InvalidAddress("? " + number);
	}
	
	this.number = number.toUpperCase();
}

dojo.inherits(hs.address.NodeNumber, hs.address.NodeAddress);

/**
  Factory method that takes a parent node number, such as "2A" and a
  node offset, such as 3, and returns a NodeNumber instance initialized
  with the correct node number, such as "2A3" in the example above.
 */
hs.address.NodeNumber.toNodeNumber = function(parentNodeNumber, nodeOffset){
	if(parentNodeNumber == null || parentNodeNumber == "0"){
		nodeOffset = new Number(nodeOffset).toString();
		return new hs.address.NodeNumber(nodeOffset);
	}else{
		parentNodeNumber = parentNodeNumber.toUpperCase();
		
		// figure out whether we will generate a letter or not
		// (i.e. if we end in a number in our parent node number,
		// use a letter)
		if(/[0-9]$/.test(parentNodeNumber) == true){
			// convert our nodeOffset number from base 10 to
			// a base 26 number system (i.e., the alphabet) using
			// a base conversion algorithm
			var stack = new Array();
			// -1 because we start counting from 1, not
			// 0, while most number systems start at 0
			nodeOffset = nodeOffset - 1;
			while(nodeOffset >= 26){
				stack.push(nodeOffset % 26);

				nodeOffset = nodeOffset / 26;
				nodeOffset--;
			}
			
			// collect digits together
			// the ASCII code for A is 65, while Z is 90
			var letter = nodeOffset + 65;
			var word = String.fromCharCode(letter);
			while(stack.length != 0){
				letter = stack.pop(); // get next base value
				letter = letter + 65; // turn into ASCII
				letter = String.fromCharCode(letter); // turn into string
				word += letter;
			}
			
			return new hs.address.NodeNumber(parentNodeNumber + word);
		}else{ // just add the number
			return new hs.address.NodeNumber(parentNodeNumber + nodeOffset);
		}
	}
}

dojo.lang.extend(hs.address.NodeNumber, {
	number: null,			/** Example: 2A */
	
	/**
		Whether this node number is an offset, such as !2A. An offset
		causes the document's node context to jump forward by the given
		coordinates, relative to the current node context.
	*/
	isOffset: false, 		/** Boolean */
	
	apply: function(doc){
		if(this.isOffset == false){
			doc.jumpNumber(this.number);
		}else{
			doc.nodeCtxt.jumpOffset(this.number);
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.NodeNumber"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.number;
	}
});




/**
	An hs.address.NodeAddress that is a node ID, such as 023.
	
	@param id : String The id of this node, beginning with 0, such as "023".
	@throws hs.exception.InvalidAddress
*/

hs.address.NodeID = function(id){
	if(id == null || dojo.lang.isUndefined(id)
		|| /^0[0-9]+$/.test(id) == false){
		throw new hs.exception.InvalidAddress("? " + id);
	}
	
	this.id = id;
}

dojo.inherits(hs.address.NodeID, hs.address.NodeAddress);

dojo.lang.extend(hs.address.NodeID, {
	id: null,
	
	apply: function(doc){
		doc.jumpId(this.id);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.NodeID"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.id;
	}
});




/**
	An hs.address.NodeAddress that is a node label, such as foobar.
*/

/**
	@param label : String
	@param type One of the constants defined on hs.address.NodeLabel;
	if left out, defaults to hs.address.NodeLabel.START_AT_FIRST.
	@throws hs.exception.InvalidAddress
*/
hs.address.NodeLabel = function(label, type){
	// make sure the label starts with a letter, followed by letters, numbers,
	// underscores, dashes, @ sign, and apostrophe
	if(label == null || dojo.lang.isUndefined(label)
		|| /^[A-Z]+[A-Z0-9_\-\@\']*$/i.test(label) == false){
		throw new hs.exception.InvalidAddress("? " + label);
	}
	
	this.label = label;
	
	if(dojo.lang.isUndefined(type) || type == null){
		type = hs.address.NodeLabel.START_AT_FIRST;
	}
	
	this.type = type;
}

hs.address.NodeLabel.START_AT_FIRST = "start_at_first";
hs.address.NodeLabel.BRANCH_SEARCH = "!";
hs.address.NodeLabel.MOVE_TO_NEXT = "*";
hs.address.NodeLabel.EXTERNAL = "$";

dojo.inherits(hs.address.NodeLabel, hs.address.NodeAddress);

dojo.lang.extend(hs.address.NodeLabel, {
	label: null,							/** String */
	type: null,
	
	apply: function(doc){
		switch(this.type){
			case hs.address.NodeLabel.BRANCH_SEARCH:
				doc.nodeCtxt.jumpBranchSearch(this.label);
				break;
			case hs.address.NodeLabel.START_AT_FIRST:
				doc.jumpLabel(this.label, hs.commands.JumpConstants.FIRST);
				break;
			case hs.address.NodeLabel.MOVE_TO_NEXT:
				doc.jumpLabel(this.label, hs.commands.JumpConstants.NEXT);
				break;
			case hs.address.NodeLabel.EXTERNAL:
				doc.jumpExternal(this.label);
				break;
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.NodeLabel"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.label;
	}
});



/**
	An hs.address.NodeAddress that is a marker, such as @someMarker.
*/

/**
	@param marker : String
	@throws hs.exception.InvalidAddress
*/
hs.address.Marker = function(name){
	// make sure the marker starts with a letter, followed by letters, numbers,
	// underscores, and dashes
	if(name == null || dojo.lang.isUndefined(name)
		|| /^[A-Za-z]+[A-Za-z0-9_\-]*$/.test(name) == false){
		throw new hs.exception.InvalidAddress("? " + name);
	}
	
	this.name = name;
}

dojo.inherits(hs.address.Marker, hs.address.NodeAddress);

dojo.lang.extend(hs.address.Marker, {
	name: null, /** Example: @marker */
	
	apply: function(doc){
		doc.jumpMarker(this.name);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.Marker"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.name;
	}
});




/**
	An hs.address.NodeAddress that is a single relative address, such as .2u.
*/

/**
	@param type One of the relative type constants defined on
	hs.address.Relative, such as NODE_NEXT.
	@param offset : Integer An optional argument that is the number of times
	to apply this relative type, such as .2u. Defaults to 1 if not given.
	@throws hs.exception.InvalidAddress
*/
hs.address.Relative = function(type, offset){
	if(type == null || dojo.lang.isUndefined(type)){
		throw new hs.exception.InvalidAddress("? " + type);
	}
	
	// make sure we start with one of our known types
	switch(type){
		case hs.address.Relative.NODE_NEXT: break;
		case hs.address.Relative.NODE_BACK: break;
		case hs.address.Relative.NODE_UP: break;
		case hs.address.Relative.NODE_DOWN: break;
		case hs.address.Relative.ORIGIN: break;
		case hs.address.Relative.BRANCH_END: break;
		case hs.address.Relative.PLEX_HEAD: break;
		case hs.address.Relative.PLEX_TAIL: break;
		case hs.address.Relative.NODE_SUCCESSOR: break;
		case hs.address.Relative.NODE_PREDECESSOR: break;
		case hs.address.Relative.CONTENT_SEARCH: break;
		case hs.address.Relative.RETURN_NODE: break;
		case hs.address.Relative.RETURN_FILE: break;
		default:
			throw new hs.exception.InvalidAddress("? " + type);
	}
	
	this.type = type;
	
	if(dojo.lang.isUndefined(offset) || offset == null){
		offset = 1;
	}
	
	if(offset <= 0){
		throw new hs.exception.InvalidAddress("? " + offset);
	}
	
	
	this.offset = offset;
}

dojo.inherits(hs.address.Relative, hs.address.NodeAddress);

hs.address.Relative.NODE_NEXT = "n";
hs.address.Relative.NODE_BACK = "b";
hs.address.Relative.NODE_UP = "u";
hs.address.Relative.NODE_DOWN = "d";
hs.address.Relative.ORIGIN = "o";
hs.address.Relative.BRANCH_END = "e";
hs.address.Relative.PLEX_HEAD = "h";
hs.address.Relative.PLEX_TAIL = "t";
hs.address.Relative.NODE_SUCCESSOR = "s";
hs.address.Relative.NODE_PREDECESSOR = "p";
hs.address.Relative.CONTENT_SEARCH = "c";
hs.address.Relative.RETURN_NODE = "r";
hs.address.Relative.RETURN_FILE = "rf";

dojo.lang.extend(hs.address.Relative, {
	type: null,
	offset: 1,						/** Example : 2 from .2u */
	
	apply: function(doc){
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
				// TODO: Figure out exactly what to do here
				dojo.raise("content search relative address (.c) not implemented");
				break;
			case hs.address.Relative.RETURN_NODE: 
				dojo.raise("return node (.r) not implemented");
				break;
			case hs.address.Relative.RETURN_FILE: 
				dojo.raise("return file (.rf) not implemented");
				break;
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.Relative"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		if(this.offset == 1){
			return this.type;
		}else{
			return this.offset + this.type;
		}
	}
});




/**
	An hs.address.NodeAddress that is an indirect link, such as .l.
*/

/**
	@param offset : Integer An optional value that defaults to 1. Controls
	which link we are referencing, starting at 1.
	@throws hs.exception.InvalidAddress
*/
	
hs.address.IndirectLink = function(offset){
	if(dojo.lang.isUndefined(offset) || offset == null){
		offset = 1;
	}
	
	if(offset <= 0){
		throw new hs.exception.InvalidAddress("? " + offset);
	}
	
	this.offset = offset;
}

dojo.inherits(hs.address.IndirectLink, hs.address.NodeAddress);

dojo.lang.extend(hs.address.IndirectLink, {
	offset: 1,
	
	apply: function(doc, readyHandler, address){
		// get our node context
		var ctxt = doc.nodeCtxt;

		// get it's node cursor
		var cursor = ctxt.cursor;

		// now get the specified link
		var link = null;
		try{
			link = cursor.getLink(this.offset);
		}catch(exp){
			debug(exp);
			throw new hs.exception.Filter(
						"No indirect link for " + ctxt.number);
		}
		
		// merge our link and the one that we are a part 
		// of together
		var linkAddr = this._mergeLinks(link, address);
		
		// now resolve this link, halting execution,
		// and continue executing using our new
		// indirect link
		address.replaceResolution(linkAddr, doc);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.IndirectLink"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		if(this.offset == 1){
			return "l";
		}else{
			return this.offset + "l";
		}
	},
	
	_mergeLinks: function(link, address){
		var linkAddr = new hs.address.Address(link);

		// add our address' viewspecs
		// to the end of our indirect link's viewspecs
		for(var i = 0; i < address.viewspecs.length; i++){
			linkAddr.viewspecs[linkAddr.viewspecs.length]
				= address.viewspecs[i];	
		}

		// splice in any addressing from our address
		// after the indirect links addressing
		var addMe = new Array();
		var startAdding = false;
		// don't add until we hit an indirect link
		for(var i = 0; i < address.nodeAddresses.length; i++){
			var p = address.nodeAddresses[i];
			
			if(startAdding == true){
				addMe[addMe.length] = p;
				continue;
			}
			
			if(p.isPieceType("hs.address.IndirectLink") == true){
				startAdding = true;
			}
		}
		for(var i = 0; i < addMe.length; i++){
			linkAddr.nodeAddresses[linkAddr.nodeAddresses.length]
				= addMe[i];
		}
		
		return linkAddr;
	}
});




/**
	An hs.address.NodeAddress that is a string search forwards from the 
	present location through the following nodes, such as "foobar".
*/

/**
	@param search : String A search string, either delimited with " for
	simple searches, such as "foobar", or delimited with / for full
	regular expressions, such as /foobar/i.
	@throws hs.exception.InvalidAddress
*/
hs.address.StringSearch = function(search){
	// make sure search string is delimited with "double-quotes" or
	// with regular expression slashes and an end letter - /foobar/i
	if(search == null || dojo.lang.isUndefined(search)
		|| /(?:^\"(?:\\\"|[^\"])*\"$)|(?:^\/(?:\\\/|[^\/])*\/[a-z]*$)/i.test(search) == false){
		throw new hs.exception.InvalidAddress("? " + search);
	}
	
	this.search = search;
}

dojo.inherits(hs.address.StringSearch, hs.address.NodeAddress);

dojo.lang.extend(hs.address.StringSearch, {
	search: null,
	
	/**
		@returns RegExp
	*/
	toRegularExpression: function(){
		
	},
	
	apply: function(doc){
		// turn the search value into an actual JavaScript string
		// or a regular expression; right now it is stringified
		// i.e. it has the value "foobar" with quotes in it
		var search = eval(this.search);
		
		doc.jumpContent(search, hs.commands.JumpConstants.NEXT);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.StringSearch"){
			return true;
		}else{
			return false;
		}
	},
	
	/**
		@returns String
	*/
	toString: function(){
		return this.search;
	}
});



/**
	An hs.address.NodeAddress that jumps through a single node's textual 
	contents, such as -2w.
*/

/**
	@param type The type of string positioning we are dealing with; must
	be one of the constants defined on this class.
	@param offset An optional parameter used to control the number of times
	to apply this string position; defaults to 1. Can be negative.
	@throws hs.exception.InvalidAddress
*/ 
hs.address.StringPosition = function(type, offset){
	if(type == null || dojo.lang.isUndefined(type)){
		throw new hs.exception.InvalidAddress("? " + type);
	}
	
	// make sure we start with one of our known types
	switch(type){
		case hs.address.StringPosition.LAST_CHAR: break;
		case hs.address.StringPosition.FIRST_CHAR: break;
		case hs.address.StringPosition.CHARACTER: break;
		case hs.address.StringPosition.WORD: break;
		case hs.address.StringPosition.VISIBLE: break;
		case hs.address.StringPosition.INVISIBLE: break;
		default:
			throw new hs.exception.InvalidAddress("? " + type);
	}
	
	this.type = type;
	
	if(dojo.lang.isUndefined(offset) || offset == null){
		offset = 1;
	}
	
	if(offset == 0){
		throw new hs.exception.InvalidAddress("? " + offset);
	}
	
	if(type == hs.address.StringPosition.LAST_CHAR
		|| type == hs.address.StringPosition.FIRST_CHAR){ // offset has no meaning
		offset = 1;		
	}
	
	this.offset = offset;
}

dojo.inherits(hs.address.StringPosition, hs.address.NodeAddress);

hs.address.StringPosition.LAST_CHAR = "e";
hs.address.StringPosition.FIRST_CHAR = "f";
hs.address.StringPosition.CHARACTER = "c";
hs.address.StringPosition.WORD = "w";
hs.address.StringPosition.VISIBLE = "v";
hs.address.StringPosition.INVISIBLE = "i";

dojo.lang.extend(hs.address.StringPosition, {
	type: null,					/** One of the constants defined in this class. */
	offset: 1, 			

	apply: function(doc){
		dojo.raise("string positioning not implemented");
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.StringPosition"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		if(this.offset == 1){
			return "+" + this.type;
		}else{
			var sign = "";
			if(this.offset > 0){
				sign = "+";
			}
			
			return sign + this.offset + this.type;
		}
	}
});

/** 
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package contains hs.model, which has our core abstractions when dealing
	with HyperScope documents, nodes, and our position inside nodes. It
	has the following classes:
	
	hs.model.Node
		Represents a node in an hs.model.Document
	
	hs.model.Document
		Represents a HyperScope outline document that can be interacted with 
		and jumped through.
	
	hs.model.NodeCursor
		A 'cursor' in an hs.model.Node that can jump through the textual 
		contents of a node to perform string positioning by character, word, 
		link, etc.
		
	It also contains variables to control whether we are in a testing
	environment (djConfig.testing, hs.model.testingCurrentURL), as
	well as an event that should be attached to before using the HyperScope
	core:
	
	hs.model.addOnLoad(myListener.myMethod);
	
	This will ensure that all asychronous resources and the browser are ready before any
	operations.
	
	One final djConfig variable, djConfig.profiling, can be turned on in your djConfig
	script block; this will start profiling the system and print the results when the page
	is finished.
*/

dojo.provide("hs.model");

dojo.require("hs.util"); // make sure hs.util is loaded before hs.model

dojo.require("dojo.io.*");
dojo.require("dojo.string.*");
dojo.require("dojo.dom");
dojo.require("dojo.event.*");

dojo.require("sarissa.core");
dojo.require("sarissa.xpath");

/**
	A flag that when turned on means we are in testing mode.
	Classes may act differently in this mode, such as making
	all network calls synchronous to help with testing, modifying
	and reading the current URL we are at from hs.testingCurrentURL
	rather than from window.location.href, etc. This helps
	with our unit testing.  	
	
	Set this in your djConfig script block at the top of the page.
	Example:
	
	<script type="text/javascript">	
		var djConfig = { testing: true, 
						 disableFlashStorage: true };
	</script>
			
 */
if(dojo.lang.isUndefined(djConfig.testing)){
	djConfig.testing = false;
}

/**
  	A variable that 'mimics' window.location.href for environments
  	that can't change this or read it, such as when unit testing.
 */
hs.model.testingCurrentURL = window.location.href;

/**
  Create a way for user-interfaces to know when they can begin
  to use the HyperScope core for operations. To attach to this
  call:
  
  hs.model.addOnLoad(myListener.myMethod);
  
  This will ensure that all asychronous resources are loaded and the
  browser is ready (i.e. you can begin to manipulate the DOM).
*/

hs.model.addOnLoad = function(loadHandler){
	hs.model._loadHandler = loadHandler;
	
	if(hs.model._isLoaded == true){
		hs.model._loaded();
	}
}

hs.model._loaded = function(){
	hs.model._isLoaded = true;
	if(dojo.lang.isUndefined(hs.model._loadHandler) == false){
		hs.model._loadHandler.call(null);
	}
}



/**
	Represents a node in an hs.model.Document.
	
	@param domNode : DOMNode
	@param doc : hs.model.Document  - The hs.model.Document
	this node is a member of.
*/

hs.model.Node = function(domNode, doc){
	this.domNode = domNode;
	this.doc = doc;
	
	// extract our metadata from the node
	// number - ex: 2A2
	this.number = domNode.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
										+ ":number");
	// level - ex: 1
	this.level = domNode.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
										+ ":level");
	this.level = new Number(this.level).valueOf();
	
	// node counter - ex: 639
	this.nodeCounter = domNode.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
										+ ":node-counter");
	this.nodecounter = new Number(this.nodeCounter).valueOf();
	
	// id - ex: 023									
	this.id = domNode.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":nid");
	
	// label - ex: foobar
	this.label = domNode.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":label");
	
	// data - ex: here is some data									
	this.data = domNode.getAttribute("text");
	
	// node cursor for random access text movement
	this.cursor = new hs.model.NodeCursor(this);
}

dojo.lang.extend(hs.model.Node, {
	/** The hs.model.Document this node is a member of. */
	doc: null,
	
	/** This node's number, such as "2A", held as a String */
	number: null,
	
	/** This node's number, such as "023", held as a String. */
	id: null,
	
	/** This node's current level in the document, starting from 0. */
	level: null,
	
	/** Where the cursor is pointing for this node. Is an hs.model.NodeCursor. */
	cursor: null,
	
	/** The underlying DOM node for this hs.model.Node. */
	domNode: null,
	
	/** Our data, usually text, in this node. */
	data: null,
	
	/** 
	  	A private variable that is our position in the XML DOM, in order of
	  	how we appear in the document independent of it's hierarchical placement.
	  	Starts at 1.
	 */
	nodeCounter: null,

	/**
		Jumps up from this current node.
		
		@param offset The number of nodes to jump. If left off,
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpUp: function(offset){
		offset = this._handleOffset(offset);
		
		/**
		  XPath:
		  Grab all outline nodes, get the one with the attribute 'number' equal
		  to this node's number, then grab it's ancestor elements and make sure
		  it is an outline element itself.
		  
		  Example: //outline[@hs-internal:number = '2A']/ancestor::outline
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":number = '" + this.number + "']"
													+ "/ancestor::outline");
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		/**
		  The 'ancestor' axis gives everything in reverse, so item(0) would
		  be the first ancestor in the document, and the last item would be
		  the node ancestor right before our context node. 
		*/	

		if(offset > nodes.length){
			offset = 0; // grab first ancestor
		}else{
			offset = nodes.length - offset;
		}
		
		var result = nodes.item(offset);
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
		Jumps down from this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpDown: function(offset){
		offset = this._handleOffset(offset);
		
		// keep iterating through each child, grabbing the first one
		var childNode = dojo.dom.firstElement(this.domNode);
		var childIndex = 1;
		while(childNode != null && childIndex < offset){
			childNode = dojo.dom.firstElement(childNode);
			childIndex++;
		}
		
		var result;
		if(childNode != null){
			result = new hs.model.Node(childNode, this.doc);
		}else{
			result = this;
		}
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
		Jumps back from this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpBack: function(offset){
		offset = this._handleOffset(offset);
		
		var nodeCounter = this.nodeCounter - offset;
		if(nodeCounter <= 0){
			nodeCounter = 0;
		}
		
		/**
		 	XPath:
			Grab all the outline nodes, then select the one with the attribute
			'node-counter' with the given value.
			We added 'node-counter' to every element during normalization, which is
			the linear offset of a given node from the top, as it would be printed
			on a page, for example, independent of it's hierarchical position.
			
			Example: //outline[@hs-internal:node-counter = '22']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + nodeCounter + "']");
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		var result = nodes.item(0);
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},

	/**
		Jumps to the next node from this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpNext: function(offset){
		offset = this._handleOffset(offset);

		var nodeCounter = new Number(this.nodeCounter).valueOf() + offset;
		
		// if the offset jumps us beyond the end of the document,
		// just jump to the last node instead
		if(nodeCounter > this.doc._nodeCounter){
			nodeCounter = this.doc._nodeCounter;
		}
		
		/**
		 	XPath:
			Grab all the outline nodes, then select the one with the attribute
			'node-counter' with the given value.
			We added 'node-counter' to every element during normalization, which is
			the linear offset of a given node from the top, as it would be printed
			on a page, for example, independent of it's hierarchical position.
			
			Example: //outline[@hs-internal:node-counter = '22']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + nodeCounter + "']");
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		var result = nodes.item(0);
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
		Jumps to the end of the branch relative to this current node.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpBranchEnd: function(){
		// simply return ourselves we don't have any children
		if(this.domNode.childNodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
        
		/**
			XPath:
			Grab all of our descendant nodes in the descendant axis,
			starting from our position. Then, simply grab
			the last entry in the node list that is returned.
            
			Example: 
			//outline[@hs-internal:node-counter = '22']/descendant::outline
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":node-counter = '" + this.nodeCounter + "']"
				+ "/descendant::outline");
				
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
        
		var result = nodes.item(nodes.length - 1);
		result = new hs.model.Node(result, this.doc);
        
		this.doc.nodeCtxt = result;
        
		return result;
	},
	
	/**
		Jumps to the head of the plex of this current node.
		
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpPlexHead: function(){
		var nodes = this._getPredecessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		/**
		  The 'preceding' axis gives everything in order, so item(0) would
		  be the first node in the document, and the last item would be
		  the node right before our context node. 
		*/	
		
		var domNode = nodes.item(0);
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Jumps to the tail of the plex of this current node.
		
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpPlexTail: function(){
		var nodes = this._getSuccessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		// simply grab the final entry
		var domNode = nodes.item(nodes.length - 1);
		
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Jumps to the successor of this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpSuccessor: function(offset){
		offset = this._handleOffset(offset);
		
		var nodes = this._getSuccessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		var domNode;
		if(nodes.length < offset){ // offset too large
			// just return last node
			domNode = nodes.item(nodes.length - 1);
		}else{
			domNode = nodes.item(offset - 1);
		}
		
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Jumps to the predecessor of this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpPredecessor: function(offset){
		offset = this._handleOffset(offset);
		
		var nodes = this._getPredecessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		/**
		  The 'preceding' axis gives everything in order, so item(0) would
		  be the first node in the document, and the last item would be
		  the node right before our context node. Jump from the end of
		  the results using our offset.
		*/	

		var domNode;
		if(nodes.length < offset){ // offset too large
			// just return first node
			domNode = nodes.item(0);
		}else{
			domNode = nodes.item(nodes.length - offset);
		}
		
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Within this current node, does a search for a node that matches this
		label. Example: !foobar
		
		This will always return the first match. Next is not supported,
		as Augment does not support it itself (i.e. !*foobar or !**foobar
		versus !foobar).
		
		@param label The label to find.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpBranchSearch: function(label){
		// validate the label
		label = new hs.address.NodeLabel(label).label;
		
		/**
		 	XPath:
			Jump to our location in the document as our context; then, once
			there, grab the 'descendant' axis (i.e. all of our children),
			but only the one's with a matching label (hs:label).
			
			Example: 
			//outline[@hs-internal:node-counter = '22']/descendant::outline[@hs-internal:label = 'foo']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + this.nodeCounter + "']"
													+ "/descendant::outline["
													+ "@" + hs.model.Document.HS_NAMESPACE_PREFIX
													+ ":label = '" + label + "']");
		if(nodes == null || nodes.length == 0){
			throw new hs.exception.Jump(
							"? " + label,
							this.doc, this.doc.address);
		}
		
		var result = nodes.item(0); // grab first match
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
	  Jumps the given offset relative to this node.
	  
	  @param number : String A number to jump relative, such as "2A5B", which would
	  to this node's second child (2), that child's first child (A), and so on.
	  @returns hs.model.Node The node jumped to.
	  @throws hs.exception.Jump
	 */
	jumpOffset: function(number){
		// validate the number
		number = new hs.address.NodeNumber(number).number;
		
		// fetch each piece of this number, and jump to that child
		var tk = new hs.util.NodeNumberTokenizer(number);
		var parent = this;
		while(tk.hasNext()){
			// get next offset and children to jump to
			var offset = tk.next();
			var children = parent.getChildNodes();
			if(children.length < offset){
				throw new hs.exception.Jump("? " + number, 
											this.doc.address, this.doc);
			}
			
			// jump to the right child
			var target = children[offset - 1];
			
			// now repeat this on the target
			parent = target;
		}
		
		// make this our new context
		this.doc.nodeCtxt = parent;
		
		return this.doc.nodeCtxt;
		
	},
	
	/**
	  Jumps to the given external label.
	  
	  @param label : String The external label.
	  @returns hs.model.Node The node jumped to.
	  @throws hs.exception.Jump
	 */
	jumpExternal: function(label){
		dojo.raise("jumping to an external label not implemented");
	},
	
	/** 
		Tests this node data using some regular expression.
		
		@param expression A JavaScript regular expression or
		a String to test against this
		node.
		@returns Boolean
	*/
	test: function(expression){
		var result;
		
		// are we a regular expression?
		if(dojo.lang.isUndefined(expression.test) == false){
			result = expression.test(this.data);
		}else{ // we are a string
			result = (this.data.indexOf(expression) != -1);
		}
		
		return result;
	},
	
	/**
	  Returns all of the hs.model.Node's of this child.
	  
	  @returns Array of hs.model.Nodes - Returns zero length
	  array if there are no children.
	 */
	getChildNodes: function(){
		var results = new Array();
		var childDomNode = dojo.dom.firstElement(this.domNode);
		while(childDomNode != null){
			var node = new hs.model.Node(childDomNode, this.doc);
			results.push(node);
			childDomNode = dojo.dom.nextElement(childDomNode);
		}
		
		return results;
	},
	
	/**
	  Gets the hs.model.Node that is the parent of this 
	  node; null if there is none.
	  
	  @returns hs.model.Node
	 */
	getParent: function(){
		/**
		  XPath:
		  Look through all outline nodes; grab the one with
		  a 'number' equal to our own, then get our immediate
		  parent node.
		  
		  Example: //outline[@hs-internal:number = '2A']/parent::outline
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
												+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
												+ ":number = '" + this.number + "']"
												+ "/parent::outline");

		if(nodes == null || nodes.length == 0){
			return null;
		}
		
		var result = nodes.item(0);
		result = new hs.model.Node(result, this.doc);
		
		return result;
	},
	
	_handleOffset: function(offset){
		if(dojo.lang.isUndefined(offset)){
			offset = 1;
		}
		
		offset = new Number(offset).valueOf();
		
		if(offset <= 0){
			throw new hs.exception.Jump(
							"? " + offset, 
							this.doc, this.doc.address);
		}
		
		return offset;
	},
	
	/**
	  Gets all of the preceding nodes of our's that are at the
	  same level as us and share our upstatement.
	 */
	_getPredecessorDomNodes: function(){
		// figure out our parent's node number; we will
		// do a partial match on all of our predecessors
		// using this to make sure we all have the same
		// upstatement
		var parentNumber = "";
		var parent = this.domNode.parentNode;
		if(parent != null){
			parentNumber = parent.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":number");
		}
		
		if(parentNumber == "0" || parentNumber == null){
			parentNumber = "";
		}
		
		/**
		 	XPath:
			Jump to our location in the document as our context; then, once
			there, grab the 'preceding' axis, but only at the same level as us
			(hs-internal:level), and only if the number starts with the same
			values as our parent, such as '2A'.
			
			Example: 
			//outline[@hs-internal:node-counter = '22']
			  /preceding::outline[starts-with(@hs-internal:number, '2A') and @hs-internal:level = '5']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + this.nodeCounter + "']"
													+ "/preceding::outline["
													+ "starts-with("
													+ "@" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":number, '" + parentNumber + "') "
													+ "and @" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":level = '" + this.level + "'"
													+ "]");
													
		if(nodes == null || dojo.lang.isUndefined(nodes)){
			return new Array();
		}else{
			return nodes;
		}
	},
	
	/**
	  Gets all of the succeeding nodes of our's that are at the
	  same level as us and share our upstatement.
	 */
	_getSuccessorDomNodes: function(){
		// figure out our parent's node number; we will
		// do a partial match on all of our successors
		// using this to make sure we all have the same
		// upstatement
		var parentNumber = "";
		var parent = this.domNode.parentNode;
		if(parent != null){
			parentNumber = parent.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":number");
		}
		
		if(parentNumber == "0" || parentNumber == null){
			parentNumber = "";
		}
		
		/**
		 	XPath:
			Jump to our location in the document as our context; then, once
			there, grab the 'following' axis, but only at the same level as us
			(hs-internal:level), and only if the number starts with the same
			values as our parent, such as '2A'.
			
			Example: 
			//outline[@hs-internal:node-counter = '22']
			  /following::outline[starts-with(@hs-internal:number, '2A') and @hs-internal:level = '5']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + this.nodeCounter + "']"
													+ "/following::outline["
													+ "starts-with("
													+ "@" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":number, '" + parentNumber + "') "
													+ "and @" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":level = '" + this.level + "'"
													+ "]");
													
		if(nodes == null || dojo.lang.isUndefined(nodes)){
			return new Array();
		}else{
			return nodes;
		}
	}
});




/** 
	Represents a HyperScope outline document that can be interacted with 
	and jumped through.
	
	@param address : hs.address.Address - The original, unexpanded 
	hs.address.Address pointing to this document.
	@param expandedAddress : hs.address.Address - Our fully 
	expanded hs.address.Address, suitable for resolving.
	@param dom - The XML DOM for this loaded document -
	can be null
	@throws hs.exception.InvalidAddress
*/

hs.model.Document = function(address, dom){
	this.address = address;
	this.dom = dom;	
	this.origDom = dom;
	
	if(this.dom != null && dojo.lang.isUndefined(dom) == false){
		// normalize ourselves
		this.normalize();
		
		// set our default node ctxt
		this.jumpOrigin();
		
		// initialize our current viewspecs to the
		// default viewspecs
		this.currentViewspecs = 
			new hs.filter.CurrentViewspecs(null, this);
	}
}

/** The default file extension for HyperScope documents. */
hs.model.Document.DEFAULT_FILE_EXTENSION = "opml";

/** Our custom 'hs' attributes in OPML's namespace. */
hs.model.Document.HS_NAMESPACE_PREFIX = "hs";
hs.model.Document.HS_NAMESPACE_URI = "http://www.hyperscope.org/hyperscope/opml/public/2006/05/09";
hs.model.Document.HS_NAMESPACE = 
					"xmlns:" + hs.model.Document.HS_NAMESPACE_PREFIX + "='" 
					+ hs.model.Document.HS_NAMESPACE_URI + "'";

/** Our custom 'hs-internal' attributes in OPML's namespace. */
hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX = "hs-internal";
hs.model.Document.HS_INTERNAL_NAMESPACE_URI = "http://www.hyperscope.org/hyperscope/opml/private/2006/05/09";
hs.model.Document.HS_INTERNAL_NAMESPACE = 
					"xmlns:" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + "='" 
					+ hs.model.Document.HS_INTERNAL_NAMESPACE_URI + "'";
					
/** Our render.xsl's url and name. */
hs.model.Document._RENDER_XSLT_NAME = "render";
hs.model.Document._RENDER_XSLT_URL = djConfig.baseRelativePath 
								 		+ "../hs/xslt/render.xsl";
										
/**
  	Our build file, in the 'optimize' task, inline's all of
  	our render XSLT into this variable to reduce page load time.
 */
hs.model.Document._RENDER_XSLT_CONTENT = "<?xml version=\"1.0\"?><xsl:stylesheet version=\"1.0\"                xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"                xmlns:hs=\"http://www.hyperscope.org/hyperscope/opml/public/2006/05/09\"                xmlns:hs-internal=\"http://www.hyperscope.org/hyperscope/opml/private/2006/05/09\">               <xsl:output     method=\"html\"    indent=\"yes\"/>        <xsl:param name=\"hs-internal:context-node-number\"/>      <xsl:param name=\"hs-internal:plex-parent-number\"/>      <xsl:param name=\"hs-internal:lineClipping\"/>      <xsl:param name=\"hs-internal:levelClipping\"/>      <xsl:param name=\"hs-internal:show-node-labels\"/>      <xsl:param name=\"hs-internal:show-blank-lines\"/>      <xsl:param name=\"hs-internal:show-node-addressing\"/>      <xsl:param name=\"hs-internal:node-addressing-placement\"/>      <xsl:param name=\"hs-internal:show-node-signatures\"/>      <xsl:param name=\"hs-internal:show-frozen-nodes\"/>      <xsl:param name=\"hs-internal:node-addressing-type\"/>      <xsl:param name=\"hs-internal:structure-clipping\"/>      <xsl:param name=\"hs-internal:content-filtering-type\"/>      <xsl:param name=\"hs-internal:level-indenting-type\"/>    <xsl:template match=\"/\">        <xsl:variable name=\"node-spacing-class\">      <xsl:if test=\"$hs-internal:show-blank-lines = 'true'\">space-nodes</xsl:if>    </xsl:variable>        <div id=\"hyperScopeDocument\" class=\"{$node-spacing-class}\">                <xsl:choose>        <xsl:when test=\"$hs-internal:structure-clipping = 'none'\">          <xsl:apply-templates             select=\"//outline\"/>        </xsl:when>                <xsl:when test=\"$hs-internal:structure-clipping = 'branch'\">          <xsl:apply-templates             select=\"//outline[@hs-internal:number = $hs-internal:context-node-number]/descendant-or-self::outline\"/>        </xsl:when>                <xsl:when test=\"$hs-internal:structure-clipping = 'plex'\">          <xsl:choose>            <xsl:when test=\"$hs-internal:plex-parent-number = 'none'\">              <xsl:apply-templates select=\"//outline\"/>            </xsl:when>                        <xsl:otherwise>              <xsl:apply-templates               select=\"//outline[@hs-internal:number = $hs-internal:plex-parent-number]/descendant::outline\"/>            </xsl:otherwise>          </xsl:choose>        </xsl:when>      </xsl:choose>    </div>  </xsl:template>    <xsl:template name=\"draw-hyperscope-node\">    <xsl:param name=\"level\"/>    <xsl:param name=\"number\"/>    <xsl:param name=\"nid\"/>    <xsl:param name=\"nodeCounter\"/>    <xsl:param name=\"data\"/>    <xsl:param name=\"included\"/>    <xsl:param name=\"includeFailed\"/>    <xsl:param name=\"includedFrom\"/>    <xsl:param name=\"includedType\"/>    <xsl:param name=\"passesContentFilter\"/>            <xsl:variable name=\"indentAmount\">      <xsl:choose>        <xsl:when test=\"$hs-internal:level-indenting-type = 'on'\">          <xsl:value-of select=\"$level * 2\"/>        </xsl:when>        <xsl:when test=\"$hs-internal:level-indenting-type = 'off'\">          0        </xsl:when>      </xsl:choose>    </xsl:variable>            <xsl:variable name=\"includedClass\">      <xsl:if test=\"$included = 'yes'\">        included-node      </xsl:if>    </xsl:variable>    <xsl:variable name=\"includeFailedClass\">      <xsl:if test=\"$includeFailed = 'yes'\">        include-failed      </xsl:if>    </xsl:variable>            <xsl:variable name=\"linkTitle\">      <xsl:if test=\"$included = 'yes'\">Included <xsl:value-of select=\"$includedType\"/> from <xsl:value-of select=\"$includedFrom\"/></xsl:if>    </xsl:variable>            <tr   class=\"node-row {$includedClass} {$includeFailedClass}\"         hs-internal:node-counter=\"{$nodeCounter}\"        hs-internal:number=\"{$number}\"        hs-internal:passes-content-filter=\"{$passesContentFilter}\">              <td class=\"quick-buttons\" valign=\"middle\">        <img src=\"/hyperscope/src/client/images/arrow_up.png\" class=\"quick-button quick-zoom-out\" />        <img src=\"/hyperscope/src/client/images/arrow_down.png\" class=\"quick-button quick-zoom-in\" />        <img src=\"/hyperscope/src/client/images/lines.png\" class=\"quick-button quick-lines\" />      </td>            <td class=\"node-data\">                <div  id=\"number{$number}\"             class=\"node-data-content\"            style=\"margin-left: {$indentAmount}em;\">                                <xsl:choose>            <xsl:when test=\"$hs-internal:show-node-addressing = 'true'                    and $hs-internal:node-addressing-placement = 'left'\">              <xsl:choose>                <xsl:when test=\"$hs-internal:node-addressing-type = 'id'\">                  <a   class=\"node-address\"                     title=\"{$linkTitle}\"                    href=\"#{$nid}\">                    (<xsl:value-of select=\"$nid\"/>)                  </a>                </xsl:when>                <xsl:when test=\"$hs-internal:node-addressing-type = 'number'\">                  <a   class=\"node-address\"                     title=\"{$linkTitle}\"                    href=\"#{$number}\">                    (<xsl:value-of select=\"$number\"/>)                  </a>                </xsl:when>              </xsl:choose>            </xsl:when>                        <xsl:otherwise>                            <a href=\"#\" style=\"display: none;\">&#160;</a>            </xsl:otherwise>          </xsl:choose>                                      <span class=\"output-holder\">            <xsl:value-of disable-output-escaping=\"yes\" select=\"$data\"/>          </span>        </div>      </td>          <td class=\"node-addressing-column\">                <xsl:choose>          <xsl:when test=\"$hs-internal:show-node-addressing = 'true'                  and $hs-internal:node-addressing-placement = 'right'\">            <xsl:choose>              <xsl:when test=\"$hs-internal:node-addressing-type = 'id'\">                <a   class=\"node-address\"                   title=\"{$linkTitle}\"                  href=\"#{$nid}\">                  (<xsl:value-of select=\"$nid\"/>)                </a>              </xsl:when>              <xsl:when test=\"$hs-internal:node-addressing-type = 'number'\">                <a   class=\"node-address\"                   title=\"{$linkTitle}\"                  href=\"#{$number}\">                  (<xsl:value-of select=\"$number\"/>)                </a>              </xsl:when>            </xsl:choose>          </xsl:when>                    <xsl:when test=\"$hs-internal:show-node-addressing = 'false'                  or $hs-internal:node-addressing-placement = 'left'\">                        &#160;          </xsl:when>        </xsl:choose>      </td>    </tr>  </xsl:template>    <xsl:template match=\"outline\">        <xsl:if test=\"@hs-internal:level = $hs-internal:levelClipping            or @hs-internal:level &lt; $hs-internal:levelClipping            or $hs-internal:levelClipping = 'none'            or @hs-internal:number = $hs-internal:context-node-number\">      <xsl:call-template name=\"draw-hyperscope-node\">        <xsl:with-param name=\"level\"><xsl:value-of select=\"@hs-internal:level\"/></xsl:with-param>        <xsl:with-param name=\"number\"><xsl:value-of select=\"@hs-internal:number\"/></xsl:with-param>        <xsl:with-param name=\"nid\"><xsl:value-of select=\"@hs:nid\"/></xsl:with-param>        <xsl:with-param name=\"nodeCounter\"><xsl:value-of select=\"@hs-internal:node-counter\"/></xsl:with-param>        <xsl:with-param name=\"data\"><xsl:value-of select=\"@text\"/></xsl:with-param>        <xsl:with-param name=\"included\"><xsl:value-of select=\"@hs-internal:included\"/></xsl:with-param>        <xsl:with-param name=\"includeFailed\"><xsl:value-of select=\"@hs-internal:include-failed\"/></xsl:with-param>        <xsl:with-param name=\"includedFrom\"><xsl:value-of select=\"@hs-internal:included-from\"/></xsl:with-param>        <xsl:with-param name=\"includedType\"><xsl:value-of select=\"@hs-internal:included-type\"/></xsl:with-param>        <xsl:with-param name=\"passesContentFilter\"><xsl:value-of select=\"@hs-internal:passes-content-filter\"/></xsl:with-param>      </xsl:call-template>    </xsl:if>      </xsl:template></xsl:stylesheet>";
	
					
/** 
	Initializes HyperScope loading by grabbing our XSLT resources, 
	such as render.xsl. 
*/
hs.model.Document._initializeXSLT = function(){
	// wait till everything is loaded before we are loaded
	dojo.event.connect(dojo, "loaded", function(){

		// if we have been optimized with our 'optimize'
		// ant task, then our XSLT should be inlined
		if(hs.model.Document._RENDER_XSLT_CONTENT != null){
			var data = hs.model.Document._RENDER_XSLT_CONTENT;
			
			// create an instance of XSLTProcessor
			var processor = new XSLTProcessor();
			
			// create a DOM Document containing an XSLT stylesheet
			var xslDoc = Sarissa.getDomDocument();
			xslDoc = (new DOMParser()).parseFromString(data, "text/xml");
			
			// make the stylesheet reusable by importing it in the 
			// XSLTProcessor
			processor.importStylesheet(xslDoc);
			
			hs.model.Document._renderXslt = processor;
			
			hs.model._loaded(); // fire 'loaded' event
		}else{ // dev environment where we load XSLT dynamically
			// load our XSLT resources

			var xsltFiles = new Array();
			
			xsltFiles.push({name: hs.model.Document._RENDER_XSLT_NAME,
							url: hs.model.Document._RENDER_XSLT_URL});
							
			var xsltLoader = new hs.util.XSLTLoader(xsltFiles, function(status, error){

				if(status == false){
					throw error;
				}
				
				hs.model.Document._renderXslt = 
						xsltLoader.getXSLT(hs.model.Document._RENDER_XSLT_NAME);
						
				hs.model._loaded(); // fire 'loaded' event
			});
		
			xsltLoader.load();	
		}
	});
}

// initialize our hs.model.Document's render XSLT on page load
hs.model.Document._initializeXSLT();


dojo.lang.extend(hs.model.Document, {
	/** The original, unexpanded hs.address.Address pointing to this document. */
	address: null,

	/** 
		Our working DOM that is changed by filters and which we render when
		done filtering.
	*/
	dom: null,

	/** The original, unchanged DOM. */
	origDom: null,

	/** 
		Our context node, which all operations are done relative to. In a UI,
		this node would usually be at the "top" of the screen. Is an
		hs.model.Node.
	*/
	nodeCtxt: null,

	/** 
		The current viewspecs applied to this document. An hs.filter.CurrentViewspecs
		object.
	*/
	currentViewspecs: null,

	/** Our rendered HTML as a string ready to be displayed. */
	renderedHtml: null,
	
	/** Our rendered HTML as a DOM ready to be displayed. */
	renderedHtmlDom: null,

	/** 
		Normalizes this document for further processing and filtering. 
		
		@throws hs.exception.Filter	
	*/
	normalize: function(){
		var n = new hs.filter.Normalizer();
		n.apply(this);
	},

	/** 
		Jumps to the origin of this document, setting 
		hs.model.Document.nodeCtxt appropriately.
		
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump
	*/
	jumpOrigin: function(){
		// get the first outline node from the root
		var domNode = this.getOriginDomNode();
		
		// make sure it is good data
		if(domNode == null){
			throw new hs.exception.Jump("No origin node in document", this, this.address);
		}
		
		// set our context
		var hsNode = new hs.model.Node(domNode, this);
		this.nodeCtxt = hsNode;
		
		return hsNode;
	},
	
	/** 
		Jumps to a node in this document that has the given node
		number, such as 2A, setting hs.model.Document.nodeCtxt appropriately.
		
		@param number A string with the number to go to, case-insensitive.
		@returns hs.model.Node The new context node jumped to. 
		@throws hs.exception.Jump Throws exception if number not found.
	*/
	jumpNumber: function(number){
		// validate the number
		number = new hs.address.NodeNumber(number).number;
		
		var domNode = this.dom.selectNodes("//outline[@"
											+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
											+ ":number = '" + number + "']");

		// make sure it is good data
		if(domNode == null || domNode.length == 0){
			throw new hs.exception.Jump("? " + number, 
										this, this.address);
		}

		// set our context node
		domNode = domNode.item(0);
		var hsNode = new hs.model.Node(domNode, this);
		this.nodeCtxt = hsNode;

		return hsNode;
	},
	
	/** 
		Jumps to a node in this document that has the given node
		ID, such as 023, setting hs.model.Document.nodeCtxt appropriately.
		
		@param id A string with the id to go to; must be preceded with a zero,
		such as "023".
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if number not found.
	*/
	jumpId: function(id){
		// validate the id
		id = new hs.address.NodeID(id).id;
		
		var domNode = this.dom.selectNodes("//outline[@"
											+ hs.model.Document.HS_NAMESPACE_PREFIX
											+ ":nid = '" + id + "']");
		// make sure it is good data
		if(domNode == null || domNode.length == 0){
			throw new hs.exception.Jump("? " + id, 
										this, this.address);
		}
		
		// set our context node
		domNode = domNode.item(0);
		var hsNode = new hs.model.Node(domNode, this);
		this.nodeCtxt = hsNode;
		
		return hsNode;
	},
	
	/** 
		Jumps to a node in this document that has the given marker, setting 
		hs.model.Document.nodeCtxt appropriately.
		
		@param marker A string with the marker to go to, such as "foobar".
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if marker not found.
	*/
	jumpMarker: function(marker){
		// validate the marker
		marker = new hs.address.Marker(marker).name;
		
		// get a node walker, starting from our current context
		var walker = new hs.util.NodeWalker(this.nodeCtxt);
		
		// walk our nodes, testing each one with a regular expression to
		// find this marker
		
		// the regular expression below basicly looks for:
		// <a name="markerName"></a>
		// allowing arbitrary spaces all over the place, as well
		// as both single and double-quotes; it is case-insensitive
		// and works over multiple lines (i.e. the "im" options)
		var markerRegExp = new RegExp("<\s*a[ ]+name=\s*[\"\']" 
										+ marker + "[\"\']\s*>\s*<\s*\/\s*a\s*>", "im");
		var matchingNode = null;
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our marker?
			if(node.test(markerRegExp)){
				matchingNode = node;
				// we're done
				break;
			}
		}
		
		if(matchingNode == null){
			throw new hs.exception.InvalidAddress("? " + marker,
													this, this.address);
		}
		
		// TODO: Update our node cursor to actually point using character
		// relative addressing and a NodeCursor to the actual matching
		// letter inside of this matching node
		
		this.nodeCtxt = matchingNode;
		
		return this.nodeCtxt;
	},
	
	/** 
		Jumps to a node in this document that has the given label, setting 
		hs.model.Document.nodeCtxt appropriately.
		
		@param label A string with the label to go to, such as "foobar".
		@param jumpType An hs.commands.JumpConstants that controls which label
		to find; can be FIRST or NEXT.
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if label not found.
	*/
	jumpLabel: function(label, jumpType){
		// validate our label
		label = new hs.address.NodeLabel(label).label;
		
		/**
		  Our approach: Determine our starting context node; if the jump type is FIRST,
		  then this will be the origin; if it is NEXT, then it will be relative to our
		  current context node.
		  
		  Next, execute XPath that simply uses our context node address, gets the
		  'following' axis, and then matches against the hs:label attribute
		  with the given label.
		 */
		var startingNode;
		if(jumpType == hs.commands.JumpConstants.FIRST){
			// get the first outline node from the root
			var domNode = this.getOriginDomNode();
			
			// make sure it is good data
			if(domNode == null){
				throw new hs.exception.Jump("No origin node in document", this, this.address);
			}
			
			startingNode = new hs.model.Node(domNode, this);
			includeCtxt = true;
		}else if(jumpType == hs.commands.JumpConstants.NEXT){
			startingNode = this.nodeCtxt;
			includeCtxt = false;
		}else{
			throw new hs.exception.Jump("Unknown jump type given to jumpLabel: "
											+ jumpType, this, this.address);
		}
		
		// get a node walker, starting from the correct context
		var walker = new hs.util.NodeWalker(startingNode, includeCtxt);
		
		// walk our nodes, testing each one with our content
		var matchingNode = null;
		var regExp = new RegExp("^" + this._escapeData(label) + "$", "i");
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our label?
			if(regExp.test(node.label)){
				matchingNode = node;
				// we're done
				break;
			}
		}
		
		if(matchingNode == null){
			throw new hs.exception.InvalidAddress("? " + label,
													this, this.address);
		}
		
		this.nodeCtxt = matchingNode;
		
		return this.nodeCtxt;
	},
	
	/** 
		Jumps to a node in this document that has the given word, setting 
		hs.model.Document.nodeCtxt appropriately. Only exact matches of word
		will be found; partial matches within content do not match this jump
		type. Word matching is case-sensitive.
		
		@param word A string with the word to go to, such as "foobar".
		@param jumpType An hs.commands.JumpConstants that controls which word
		to find; can be FIRST or NEXT.
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if word not found.
	*/
	jumpWord: function(word, jumpType){
		// This reg exp basicly inserts the word to find, and makes
		// sure that it begins and ends with either a space or is at
		// the beginning or end of the string. It is case-insensitive.
		var escapedWord = this._escapeData(word);
		var wordRegExp = new RegExp("(?:^|[ ])" + escapedWord + "(?:$|[ ])");
		
		return this._doSearch(word, wordRegExp, jumpType);
	},
	
	/** 
		Jumps to a node in this document that has the given content, setting 
		hs.model.Document.nodeCtxt appropriately. Partial matches work for
		this jump type, such as "foo" in the word "foobar". 
		Content matching is case-insensitive.
		
		@param content A string with the content to go to, such as "foobar".
		@param jumpType An hs.commands.JumpConstants that controls which content
		to find; can be FIRST or NEXT.
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if content not found.
	*/
	jumpContent: function(content, jumpType){
		return this._doSearch(content, content, jumpType);
	},

	/** 
		Renders this document, using its hs.model.Document.dom to create the
		final result.
		
		@returns String The rendered document as an HTML string.
		@throws hs.exception.Render
	*/
	render: function(){
		//debug("render");
		hs.profile.start("render");
		
		var xslt = this.getRenderXSLT();
		
		// set our context node
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"context-node-number", 
				this.nodeCtxt.number);
				
		// apply our viewspecs
		this.currentViewspecs.apply(this);
		
		// transform the document
	    hs.profile.start("render_xslt");
		this.renderedHtmlDom = xslt.transformToDocument(this.dom);
		hs.profile.end("render_xslt");

	    // show transformation results
		hs.profile.start("innerXML");
		// commented out because we don't need an HTML string anymore;
		// we use the rendered DOM now for faster performance
		//this.renderedHtml = dojo.dom.innerXML(this.renderedHtmlDom);
		//alert(this.renderedHtml);
		hs.profile.end("innerXML");
		
		hs.profile.end("render");
		
		return this.renderedHtml;
	},
	
	/**
	  Produces a URL string that can be used to re-render
	  and produce this document's view and context nodes.
	  
	  Removes default information, such as if the 
	  context node is 0 and spurious viewspecs.
	  
	  @return String The full URL
	 */
	toURL: function(){
		var results = this.address.clone();
		
		// consolidate to just our context node
		results.nodeAddresses = new Array();
		if(this.nodeCtxt.number != "0"){ // don't print out default node
			if(this.nodeCtxt.id != null){ // our node has an ID attribute
				var nodeId = new hs.address.NodeID(this.nodeCtxt.id);
				results.nodeAddresses.push(nodeId);
			}else{ // no ID attribute in this document's node
				var nodeNumber = 
					new hs.address.NodeNumber(this.nodeCtxt.number, false);
				results.nodeAddresses.push(nodeNumber);
			}
		}
		
		// consolidate viewspecs
		var minimizedViewspecs = this.currentViewspecs.toString();
		results.viewspecs = new Array();
		for(var i = 0; i < minimizedViewspecs.length; i++){
			var v = new hs.address.Viewspec(minimizedViewspecs.charAt(i));
			results.viewspecs.push(v);
		}
		
		return results.toString();
	},
	
	/**
	  Returns an XSLT script suitable for rendering this
	  hs.model.Document. Used primarily by hs.filter.Filters such
	  as hs.filter.CurrentViewspecs.
	  
	  @returns An XSLTProcessor object.
	 */
	getRenderXSLT: function(){
		return hs.model.Document._renderXslt;
	},
	
	getOriginDomNode: function(){
		var domNode = this.dom.selectNodes("/opml/body/outline[position() = 1]");
		
		// make sure it is good data
		if(domNode == null || domNode.length == 0){
			return null;
		}
		
		// get the node
		domNode = domNode.item(0);
		
		return domNode;
	},
	
	/** 
	  Escapes data from the user that will be included in
	  a regular expression, escaping characters that have meaning
	  for reg exps.
	*/
	_escapeData: function(data){
		data = data.replace(/\\/g, "\\\\");
		data = data.replace(/\[/g, "\\[");
		data = data.replace(/\]/g, "\\]");
		data = data.replace(/\"/g, "\\\"");
		data = data.replace(/\'/g, "\\\'");
		data = data.replace(/\^/g, "\\^");
		data = data.replace(/\*/g, "\\*");
		data = data.replace(/\+/g, "\\+");
		data = data.replace(/\-/g, "\\-");
		data = data.replace(/\?/g, "\\?");
		data = data.replace(/\|/g, "\\|");
		data = data.replace(/\./g, "\\.");
		data = data.replace(/\{/g, "\\{");
		data = data.replace(/\}/g, "\\}");
		data = data.replace(/\,/g, "\\,");
		data = data.replace(/\(/g, "\\(");
		data = data.replace(/\)/g, "\\)");
		data = data.replace(/\:/g, "\\:");
		data = data.replace(/\;/g, "\\;");
		data = data.replace(/\$/g, "\\$");
		data = data.replace(/\=/g, "\\=");
		data = data.replace(/\!/g, "\\!");
	
		return data;
	},
	
	/**
	  Factors out the commonalities between
	  jumpContent and jumpWord, allowing a tester
	  to be passed in which is the only difference.
	  
	  @param content : String - Content to search for.
	  @param tester : String or RegExp - What to apply tests
	  using.
	  @param jumpType An hs.commands.JumpConstants that controls which content
		to find; can be FIRST or NEXT.
	 */
	_doSearch: function(content, tester, jumpType){
		// validate the content
		if(content == null || dojo.lang.isUndefined(content)
			|| dojo.string.trim(content) == ""){
			throw new hs.exception.Jump("? " + content,
										this, this.address);		
		}
		
		// get our starting context
		var startingNode;
		var includeCtxt;
		if(jumpType == hs.commands.JumpConstants.FIRST){
			// get the first outline node from the root
			var domNode = this.getOriginDomNode();
			
			// make sure it is good data
			if(domNode == null){
				throw new hs.exception.Jump("No origin node in document", this, this.address);
			}
			
			startingNode = new hs.model.Node(domNode, this);
			includeCtxt = true;
		}else if(jumpType == hs.commands.JumpConstants.NEXT){
			startingNode = this.nodeCtxt;
			includeCtxt = false;
		}else{
			throw new hs.exception.Jump("Unknown jump type: "
											+ jumpType, this, this.address);
		}
		
		// get a node walker, starting from the correct context
		var walker = new hs.util.NodeWalker(startingNode, includeCtxt);
		
		// walk our nodes, testing each one with our content
		var matchingNode = null;
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our content?
			if(node.test(tester)){
				matchingNode = node;
				// we're done
				break;
			}
		}
		
		if(matchingNode == null){
			throw new hs.exception.InvalidAddress("? " + content,
													this, this.address);
		}
		
		// TODO: Update our node cursor to actually point using character
		// relative addressing and a NodeCursor to the actual matching
		// content inside of this matching node
		
		this.nodeCtxt = matchingNode;
		
		return this.nodeCtxt;
	}
});



/**
	A 'cursor' in an hs.model.Node that can jump through the textual 
	contents of a node to perform string positioning by character, word, 
	link, etc.
*/

/**
	@param node : hs.model.Node - The node to apply the
	cursor to.
 */
hs.model.NodeCursor = function(node){
	this._node = node;
}

dojo.lang.extend(hs.model.NodeCursor, {
	/** 
		Our position in this node, indexed starting at 0. Starts at zero
		by default. 
	*/
	position: 0,

	_hsNode: null,

	/** Jumps to the end of this node's content. */
	toEnd: function(){
		dojo.raise("string positioning to end not implemented");
	},
	
	/** Jumps to the beginning of this node's content. */
	toBeginning: function(){
		dojo.raise("string positioning to beginning not implemented");
	},

	/** 
		Jumps the given number of words forward or backwards. 
		
		@param numWords The number of words to jump forward. Can be positive
		or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpWords: function(numWords){
		dojo.raise("string positioning to a word not implemented");
	},
	
	/** 
		Jumps the given number of characters forward or backwards. 
		
		@param numCharacters The number of characters to jump forward. Can be 
		positive or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpCharacters: function(numCharacters){
		dojo.raise("string positioning to a character not implemented");
	},
	
	/** 
		Jumps the given number of visibles forward or backwards.
		Visibles are a continuous stream of printing characters. The ends 
		of visibles are defined by invisibles, such as space or a line break.
		
		@param numVisible The number of visibles to jump forward. Can be positive
		or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpVisible: function(numVisible){
		dojo.raise("string positioning to a visible not implemented");
	},
	
	/** 
		Jumps the given number of invisibles forward or backwards.
		Invisibles are a continuous stream of non-printing characters, such
		as spaces, line feeds, HTML entities, etc.
		
		@param numInvisible The number of invisibles to jump forward. Can be positive
		or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpInvisible: function(numInvisible){
		dojo.raise("string positioning to an invisible not implemented");
	},

	/** 
		Jumps the given number of links forward or backwards.
		
		@param numLinks The number of links to jump forward. Can be positive
		or negative.
		@returns String The link URL as a string, such as
		"http://foobar.com".
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpLink: function(numLinks){
		dojo.raise("string positioning to a link not implemented");
	},
	
	/** 
		Gets the character this cursor is currently pointing at; this will 
		always be a character that would be on the screen, such as 
		letters, numbers, etc., and not HTML tags, non-printing whitespace, etc.
		
		Scans from position until it finds returnable character 
		(i.e. no HTML or XML tags); returns null if none found. 
		
		@returns String The character.
	*/	
	getCharacter: function(){
		dojo.raise("string positioning to a character not implemented");
	},

	/** 
		Returns everything forwards from the current position, including
		HTML tags.
		
		@returns String
	*/	
	getRest: function(){
		dojo.raise("string positioning not implemented");
	},

	/**
		Returns the word the cursor is currently pointing at.
		
		@returns String
	*/
	getWord: function(){
		dojo.raise("string positioning not implemented");
	},

	/**
		Returns the link the cursor is currently pointing at, without the A HREF
		HTML tags such as http://bootstrap.org/neuberg/hyarch.opml#:x
		
		@returns String
	*/
	getLink: function(numLinks){
		// TODO: When we have full node cursor going, remove the 'numLinks'
		// argument here and have jumpLink() to the jump while getLink()
		// gets the value.
		var linkFinder = /<\s*a\s*href\s*=\s*(?:\"|\')([^\'\"]*)(?:\"|\')\s*>/igm;
		
		// keep looping until we have moved our offset
		var match = null;
		// we are using a regular expression trick below;
		// each call to exec() will return a single match
		// from our linkFinder; as we call exec() the
		// next match will be returned. we must clear out
		// the lastIndex variables though to ensure that
		// the state resets (lastIndex is held globally
		// by the regular expression object)
		RegExp.lastIndex = 0;
		linkFinder.lastIndex = 0;
		for(var i = 0; i < numLinks; i++){
			match = linkFinder.exec(this._node.data);
		}
		
		if(match == null || match.length != 2){
			throw new hs.exception.InvalidAddress("Can not jump to link: "
													+ numLinks);
		}
		
		var link = match[1];
		
		return link;
	},

	/**
		Returns the link the cursor is currently pointing at, including the
		full A HREF anchor and it's link text.
	*/
	getAnchor: function(){
		dojo.raise("string positioning to an anchor not implemented");
	}
});

/**
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package contains hs.commands. hs.commands provides a standard
	facade to seperate a UI from the rest of the system; UI actions are
	transformed on to calls to the command facade, which then call the rest
	of the system and encapsulate it from the UI. It has the following 
	classes:
	
	hs.commands
		Static singleton facade that exposes all of our commands as simple methods.

	hs.commands.JumpConstants
		Constants that can be used with hs.commands to control commands, such as 
		for jumping.
*/

dojo.provide("hs.commands");


/**
	Static singleton facade that exposes all of our commands as simple methods.
*/

hs.commands = {
	/** 
		JUMP COMMANDS.

		All jump methods should filter out the parts of Address they need 
		and throw the rest away.
		
		Most jump methods take a readyHandler function. readyHandler is a 
		function that receives the following arguments: 
			function(address : hs.address.Address, 
							 document : hs.model.Document, 
							 error : InvalidAddressException)
		where 'address' is the address that we jumped to,
		'document', is the resolved document from this address,
		and 'error' is a possible error that might have arisen in this process.
	*/	
		
		
	/** 
		Jumps to the given address. 
				 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs
		to attach to this address.
		@throws hs.exception.Jump
	*/
	jumpItem: function(readyHandler, address, relativeTo,
						viewspecs){
		// if we have viewspecs, add them on
		if(viewspecs != null && typeof viewspecs != "undefined"){
			var url = "#:" + viewspecs;
			var viewAddr = new hs.address.Address(url);
			var viewArray = viewAddr.viewspecs;
			for(var i = 0; i < viewArray.length; i++){
				address.viewspecs[address.viewspecs.length] =
					viewArray[i];
			}	
		}
		
		// before calling the readyHandler, render the resolve document
		var internalHandler = function(address, doc, error){
			//debug("internalHandler, address="+address+", doc="+doc+", error="+error);
			if(error != null && dojo.lang.isUndefined(error) == false){
				readyHandler.call(null, address, doc, error);
				return;
			}
			
			// render the document
			doc.render();
			
			// call readyHandler
			readyHandler.call(null, address, doc, error);
		}
		address.resolve(internalHandler, true, relativeTo);
	},

	/** 
		Jumps to the typein and viewspecs provided.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Ignored for
		this type.
		@param relativeTo : hs.model.Document
		@throws hs.exception.Jump
		@param typein : String URL address. Required.
		@param viewspecs : String List of viewspecs to add
		to typein. Required.
	*/
	jumpFile: function(readyHandler, address, relativeTo, 
						typein, viewspecs){
		// turn the typein into a filename
		var url;
		if(dojo.string.startsWith(typein, "./")
			|| dojo.string.startsWith(typein, "../")
			|| dojo.string.startsWith(typein, "/")){
			// allow caller to already include path info
			url = typein;		
		}else{
			// assume local directory
			url = "./" + typein;
		}
		
		// add in our viewspecs
		if(viewspecs != null && dojo.string.trim(viewspecs) != ""){
			url += "#:" + viewspecs;
		}
		
		var newAddr = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, newAddr, relativeTo);
	},
	
	/** 
		Jumps to the origin of the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - 
		Address portion is ignored, but we take
		the viewspecs and fileinfo inside of here.
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpOrigin: function(readyHandler, address, relativeTo,
							viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.ORIGIN,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the end of the branch relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpEndBranch: function(readyHandler, address, relativeTo,
								viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.BRANCH_END,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the end of the plex of the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@throws hs.exception.Jump
	*/
	jumpEndPlex: function(readyHandler, address, relativeTo){
		dojo.raise("jumping to the end of a plex with command bar not implemented");
	},
	
	/** 
		Jumps to the next node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpNext: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_NEXT,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the previous node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpBack: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_BACK,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the successor node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpSuccessor: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_SUCCESSOR,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the predecessor node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpPredecessor: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_PREDECESSOR,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps up to a node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpUp: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_UP,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps down a node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpDown: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_DOWN,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the head node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpHead: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.PLEX_HEAD,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},

	/** 
		Jumps to the tail node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpTail: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.PLEX_TAIL,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the link given by 'address'.
								 
		@param readyHandler : Function
		@param address : hs.address.Address -
		Ignored for this command type.
		@param relativeTo : hs.model.Document
		@param typein : String The typed in string of an addres
		to interpret. Required.
		@throws hs.exception.Jump
	*/
	jumpLink: function(readyHandler, address, relativeTo, typein){
		if(typeof typein != "undefined" && typein != null){
			address = new hs.address.Address(typein);
		}
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	},
	
	/** 
		Jumps to the node label given by 'address'.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Not used.
		@param relativeTo : hs.model.Document
		@param typein : String - The label to jump to.
		@param viewspecs : String - Optional list of viewspecs
		to append.
		@param jumpType : hs.commands.JumpConstants - One of four 
		hs.commands.JumpConstants types: ANY, EXTERNAL, FIRST, or NEXT, controlling
		in what direction we search for this label relative to the given address.
		@throws hs.exception.Jump
	*/
	jumpLabel: function(readyHandler, address, relativeTo, 
						typein, viewspecs, jumpType){
		var url = "#";
		if(jumpType == hs.commands.JumpConstants.FIRST){
			url += typein;
		}else if(jumpType == hs.commands.JumpConstants.NEXT){
			url += "*" + typein;
		}
		
		if(viewspecs != null && typeof viewspecs != "undefined"){
			url += ":" + viewspecs;
		}
		
		address = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, address, relativeTo, null);
	},
	
	/** 
		Jumps to the given matching content.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param jumpType : hs.commands.JumpConstants - One of two 
		hs.commands.JumpConstants types: FIRST or NEXT, controlling
		in what direction we search for this label relative to the given address.
		@throws hs.exception.Jump
	*/
	jumpContent: function(readyHandler, address, relativeTo, 
							typein, viewspecs, jumpType){
		if(relativeTo == null
			|| typeof relativeTo == "undefined"){
			throw new hs.exception.Jump("Programming error: "
										+ "You must provide "
										+ "'relativeTo' to "
										+ "hs.commands.jumpWord");	
		}
		
		var doc = relativeTo;
		
		// do the jump a bit differently here; directly jump through
		// our hs.model.Document
		doc.jumpContent(typein, jumpType);
		
		// now simply call jumpItem to force a re-render
		// and to have our viewspecs applied
		address = new hs.address.Address("./");
		hs.commands.jumpItem(readyHandler, address, relativeTo, viewspecs);
	},
	
	/** 
		Jumps to the given matching word.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param typein : String - The word to jump to.
		@param viewspecs : String - Optional viewspecs to
		append to our word search.
		@param jumpType : hs.commands.JumpConstants - One of two 
		hs.commands.JumpConstants types: FIRST or NEXT, controlling
		in what direction we search for this label relative to the given address.
		@throws hs.exception.Jump
	*/
	jumpWord: function(readyHandler, address, relativeTo, 
						typein, viewspecs, jumpType){
		if(relativeTo == null
			|| typeof relativeTo == "undefined"){
			throw new hs.exception.Jump("Programming error: "
										+ "You must provide "
										+ "'relativeTo' to "
										+ "hs.commands.jumpWord");	
		}
		
		var doc = relativeTo;
		
		// do the jump a bit differently here; directly jump through
		// our hs.model.Document
		doc.jumpWord(typein, jumpType);
		
		// now simply call jumpItem to force a re-render
		// and to have our viewspecs applied
		address = new hs.address.Address("./");
		hs.commands.jumpItem(readyHandler, address, relativeTo, viewspecs);
	},
	
	/** 
		Sets the given viewspecs.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Not used.
		@param relativeTo : hs.model.Document
		@param viewspecs : String - The viewspecs to set.
		@throws hs.exception.Jump
	*/
	setViewspecs: function(readyHandler, address, relativeTo, viewspecs){
		var url = "#:" + viewspecs;
		address = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	},
	
	/** 
		Resets viewspecs to the default
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Not used.
		@param relativeTo : hs.model.Document
		@throws hs.exception.Jump
	*/
	resetViewspecs: function(readyHandler, address, relativeTo){
		var url = "#:" + hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS;
		address = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	},
	
	_jumpRelative: function(relativeType, readyHandler, address, 
							relativeTo, viewspecs){
		// keep everything in this address, but add our
		// relative piece at the end
		var newPiece = 
			new hs.address.Relative(relativeType);
		address.nodeAddresses[address.nodeAddresses.length] =
			newPiece;
		
		// now append our viewspecs if we have them
		if(viewspecs != null && typeof viewspecs != "undefined"){
			// turn the viewspecs into a machine processable
			// version
			var viewURL = "#:" + viewspecs;
			var viewAddr = new hs.address.Address(viewURL);
			// add them to our address
			var viewArray = viewAddr.viewspecs;
			for(var i = 0; i < viewArray.length; i++){
				address.viewspecs[address.viewspecs.length]
					= viewArray[i];
			}
		}
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	}
}

/**
	Constants that can be used with hs.commands to control commands, such as 
	for jumping.	
*/

hs.commands.JumpConstants = {	
	FIRST: "first",
	NEXT: "next",
	LAST: "last",
	ANY: "any",
	EXTERNAL: "external"
}


/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
		
	Including because the Dojo build process strips out dojo.profile.
	--Brad Neuberg, bkn3@columbia.edu
*/

dojo.provide("hs.profile");

hs.profile = new function(){
	var profiles = {};
	var pns = [];

	this.start = function(name){
		if(!profiles[name]){
			profiles[name] = {iters: 0, total: 0};
			pns[pns.length] = name;
		}else{
			if(profiles[name]["start"]){
				this.end(name);
			}
		}
		profiles[name].end = null;
		profiles[name].start = new Date();
	}

	this.end = function(name){
		var ed = new Date();
		if((profiles[name])&&(profiles[name]["start"])){
			with(profiles[name]){
				end = ed;
				total += (end - start);
				start = null;
				iters++;
			}
		}else{
			// oops! bad call to end(), what should we do here?
			return true;
		}
	}

	this.stop = this.end;

	this.dump = function(appendToDoc){
		var tbl = document.createElement("table");
		with(tbl.style){
			border = "1px solid black";
			borderCollapse = "collapse";
		}
		var hdr = tbl.createTHead();
		var hdrtr = hdr.insertRow(0);
		// document.createElement("tr");
		var cols = ["Identifier","Calls","Total","Avg"];
		for(var x=0; x<cols.length; x++){
			var ntd = hdrtr.insertCell(x);
			with(ntd.style){
				backgroundColor = "#225d94";
				color = "white";
				borderBottom = "1px solid black";
				borderRight = "1px solid black";
				fontFamily = "tahoma";
				fontWeight = "bolder";
				paddingLeft = paddingRight = "5px";
			}
			ntd.appendChild(document.createTextNode(cols[x]));
		}

		for(var x=0; x < pns.length; x++){
			var prf = profiles[pns[x]];
			this.end(pns[x]);
			if(prf.iters>0){
				var bdytr = tbl.insertRow(true);
				var vals = [pns[x], prf.iters, prf.total, parseInt(prf.total/prf.iters)];
				for(var y=0; y<vals.length; y++){
					var cc = bdytr.insertCell(y);
					cc.appendChild(document.createTextNode(vals[y]));
					with(cc.style){
						borderBottom = "1px solid gray";
						paddingLeft = paddingRight = "5px";
						if(x%2){
							backgroundColor = "#e1f1ff";
						}
						if(y>0){
							textAlign = "right";
							borderRight = "1px solid gray";
						}else{
							borderRight = "1px solid black";
						}
					}
				}
			}
		}

		if(appendToDoc){
			var ne = document.createElement("div");
			ne.id = "profileOutputTable";
			with(ne.style){
				fontFamily = "Courier New, monospace";
				fontSize = "12px";
				lineHeight = "16px";
				borderTop = "1px solid black";
				padding = "10px";
			}
			if(document.getElementById("profileOutputTable")){
				document.body.replaceChild(ne, document.getElementById("profileOutputTable"));
			}else{
				document.body.appendChild(ne);
			}
			ne.appendChild(tbl);
		}

		return tbl;
	}
}

dojo.kwCompoundRequire({
	common: ["dojo.html", "dojo.html.extras", "dojo.html.shadow"]
});
dojo.provide("dojo.html.*");

/**
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package defines our user-interface for HyperScope in web browsers. 
	It contains hs.ui, a singleton that has our UI code. 
	
	It also contains code for setting up our debugging environment near the
	bottom of the file, as well as our main entry point for execution, which
	is an event listener that waits for the HyperScope core to finish 
	loading before initializing and running the UI.
	
	It also contains the following classes:
	
	hs.ui.JumpOverlay
		A Dojo Widget that implements our jump overlay window that appears
		when the user presses the Jump button in the toolbar.
		
	hs.ui.HyperScopeToolbar
		A Dojo Widget that implements our toolbar.
		
	hs.ui.RenderedDocument
		A class that renders our result hs.model.Document
		
	hs.ui.ResultWriter
		Writes our HTML results after XSLT to display to the user in a fast way.
		
	hs.ui.Mark
		Dereferences a mouse mark click into an hs.address.Address that can
		be worked with.
		
	hs.ui.ViewspecOverlay
		A Dojo Widget that implements our viewspec overlay.
		
	hs.ui.LineClipper
		A class that performs line clipping on a 
		rendered document.
		
	hs.ui.CommandBar
		Implements our Augment-style command bar

	hs.ui.HelpOverlay
		Implements the help dialog displayed when the Help button is
		pressed on the main toolbar.
		
	REFACTOR: This file is getting too big; refactor into seperate files.
*/

dojo.provide("hs.ui");

 // make sure hs.profile and hs.model is loaded before us
dojo.require("hs.profile");
dojo.require("hs.model");

dojo.require("dojo.event.*");
dojo.require("dojo.uri");
dojo.require("dojo.html.*");
dojo.require("dojo.style");
dojo.require("dojo.lfx.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.FloatingPane");		
				
				
/**
  Our UI singleton.
 */

hs.ui = {
	markingMode: false,
	currentHyDoc: null,
	currentRenderedDoc: null,
	commandBar: null,
	
	_addr: null,
	_reportDocTime: true,
	_pageLoadRecoveryTimes: 0,
	
	initialize: function(){
		// toggle debugging on and off here to avoid
		// conflicts with Dojo Debugging + XSLT environment
		//djConfig.isDebug = true;
		hs.ui._initializeDebugging();
		
		// initialize profiling if it is on
		if(djConfig.profiling == true){
			hs.ui._initializeProfiling();
		}
		
		// create our Dojo Widgets
		hs.ui._initializeWidgets();
		
		// initialize the area where we display our
		// rendered document
		var container = dojo.byId("docWindow");
		hs.ui.currentRenderedDoc = new hs.ui.RenderedDocument(container);
		
		// initialize our Augment-style command bar
		hs.ui.commandBar = new hs.ui.CommandBar();

		// initialize our turbo mode settings
		var toolbar = dojo.widget.byId("hsToolbar");
		toolbar.initializeTurboModeSettings();
	
		// resolve the initial page on load
		hs.profile.start("resolve");
		hs.ui._currentLocation = window.location.toString();
		hs.ui.resolveLocation(hs.ui._currentLocation);
		
		// change the page's location if someone manually
		// changes the browser URL
		window.setInterval(hs.ui._checkBrowserURL, 200);
		
		// redisplay the document on a resize event so
		// that line clipping can be updated; don't do this
		// on Internet Explorer due to it firing the onresize 
		// event continously
		hs.ui._handleResizing();
	},

	resolveLocation: function(url){
		//debug("resolveLocation="+url);
		try{
			if(typeof url == "string"){
				hs.ui._addr = new hs.address.Address(url);
			}else{
				hs.ui._addr = url;
			}
			
			hs.ui.printStatus("Resolving...");
			
			var readyHandler = hs.ui.addressResolved;
			var address = hs.ui._addr;
			var relativeTo = hs.ui.currentHyDoc;
		
			hs.commands.jumpItem(readyHandler, address, relativeTo);
		}catch(exp){
			hs.ui.reportError(exp);
		}
	},
	
	addressResolved: function(address, doc, error){
		//debug("hs.ui.addressResolved, address="+address+", doc="+doc+", error="+error);
		hs.profile.end("resolve");
		
		// clear the command bar if it is visible
		if(hs.ui.commandBar.visible == true){
			hs.ui.commandBar.reset();
		}
		
		if(error != null){
			// if this error happened due to bad addressing on page load,
			// then lets try to recover from it so the user isn't left with
			// just a blank page
			if(hs.ui.currentHyDoc == null
				&& hs.ui._pageLoadRecoveryTimes < 2){
				// we don't want to get into an infinite recovery
				// loop; record how many times we have tried
				// and stop after the first
				hs.ui._pageLoadRecoveryTimes++;
				
				// just use the file portion
				var url = address.fileInfo.toString();
				var message = "Invalid HyperScope address given on URL: " + error
								+ "; press enter to load "
								+ "URL without address portion";
				alert(message);
				hs.ui.resolveLocation(url);
			}else{
				hs.ui.reportError(error);
			}
	
			return;
		}
		
		// save this as our current document
		hs.ui.currentHyDoc = doc;

		// get our new address so users can cut
		// and paste it
		var newUrl = doc.address.toString();
		dojo.byId("current-link").setAttribute("href", newUrl);
		
		// update the Viewspec Overlay with this new
		// information if it is open
		var viewspecOverlay = dojo.widget.byId("viewspecsOverlay");
		if(viewspecOverlay.isShowing() == true){
			viewspecOverlay.reset();
		}

		// update the displayed document
		hs.ui.currentRenderedDoc.write(hs.ui.currentHyDoc);
	},
	
	printStatus: function(msg, duration){
		this.clearStatus();
		
		var statusArea = dojo.byId("statusArea");
		statusArea.style.display = "block";
		statusArea.innerHTML = msg;
		
		if(typeof duration != "undefined"){
			window.setTimeout(function(){
				hs.ui.fadeStatus();
			}, duration);
		}
	},
	
	clearStatus: function(){
		var statusArea = dojo.byId("statusArea");
		statusArea.style.display = "none";
		statusArea.innerHTML = "";
	},
	
	fadeStatus: function(){
		var statusArea = dojo.byId("statusArea");
		if(statusArea.style.display == "none"){
			return;
		}
		
		var anim = dojo.lfx.html.fadeOut(statusArea, 700, false, function(){
			hs.ui.clearStatus();
			statusArea.style.filter = "alpha(opacity=100)" // IE
			statusArea.style.opacity = "1"; // W3C
		});
		
		anim.play();
	},
	
	reportError: function(msg){
		hs.ui.printStatus(msg, 3000);
	},
	
	dumpProfiling: function(){
		if(djConfig.profiling == true){
			var docEndTime = new Date().getTime();
					
			hs.profile.end('programtime');
			hs.profile.dump(true);
			
			// only print out the total doc time once
			if(hs.ui._reportDocTime == true){
				var docStartTime = window.parent.docStartTime;
				var totalDocTime = docEndTime - docStartTime;
			
				var resultDiv = document.createElement('div');
				resultDiv.innerHTML = '<div id="docProfile">'
										+ 'total time for everything = ' 
										+ totalDocTime 
										+ ' ms'
									+ '</div>';
				dojo.html.body().appendChild(resultDiv);
				
				hs.ui._reportDocTime = false;
			}
		}
	},
	
	_initializeDebugging: function(){
		// map Dojo's and JSUnit's debugs to our own
		dojo.debug = hs.debug;
		debug = hs.debug;
	},
	
	_checkBrowserURL: function(){
		var checkLocation = window.location.toString();
			
		if(hs.ui._currentLocation != checkLocation){
			hs.ui._currentLocation = checkLocation;
			hs.ui.resolveLocation(hs.ui._currentLocation);
		}
	},
	
	_initializeWidgets: function(){
		dojo.hostenv.makeWidgets();			
	},
	
	_initializeProfiling: function(){
		// add a class to our body tag that switches the
		// content iframe from filling the entire browser window so that
		// we have room for our profiling results to print out
		dojo.html.addClass(dojo.html.body(), "profiling");
		hs.profile.start("programtime");	
	},
	
	_handleResizing: function(){
		if(dojo.render.html.ie != true){
			dojo.event.connect(window, "onresize", function(){
				var addr = hs.ui.currentHyDoc.address;
				if(addr != null && typeof addr != "undefined"){
					hs.ui.resolveLocation(addr);
				}
			});
		}
	}
}


/**
  	Setup debugging - Dojo has a dojo.debug() method, but the way
	dojo loads up the debugging framework causes trouble with our
	XSLT transform infrastructure where we call hyperscope.xsl
	to get our chrome - Dojo does an internal document.write to
	get debug.js, but this breaks our setup because the page
	is already loaded.
*/

hs.debug = function(msg){
	if (djConfig.isDebug == false 
			|| dojo.lang.isUndefined(djConfig.isDebug)){ 
		return;
	}
	
	msg = "DEBUG: " + msg;
	dojo.hostenv.println(msg);
}

// if we are running unit tests, remap debugging
// to JSUnit's debug
if(djConfig.testing == true){ // JSUnit's environment
	dojo.debug = debug;
}



/**
  Represents our rendered document area. Can
  write out a new hs.model.Document and focus
  our current context node. 
  
  This class will also publish
  a mark event on the Dojo Topic "/mark" whenever
  a Mark event occurs; the payload is an hs.ui.Mark
  object representing the mark.
 */

/**
  Constructor for our RenderedDocument.
  
  @param container : DOM DIV that contains our 
  rendered document's iframe.
 */
hs.ui.RenderedDocument = function(container){
	// get our iframe to write into
	this._iframeDoc = dojo.byId("docFrame").contentDocument; // w3c
	if(dojo.lang.isUndefined(this._iframeDoc)){
		this._iframeDoc = dojo.byId("docFrame").contentWindow.document; // IE
	}
	
	// initialize the class that will write our results out
	// to the page in a fast way
	this._resultWriter = new hs.ui.ResultWriter(
									this,
									this._iframeDoc,
									this._onFinishedWriting);
}

dojo.lang.extend(hs.ui.RenderedDocument, {
	_iframeDoc: null,
	_contextNodeNumber: null,
	_resultWriter: null,
	_selectedRow: null,
	
	/**
	  Writes our results.
	  
	  @param doc : hs.model.Document - The Document to write
	  out.
	 */
	write: function(doc){
		this._resultWriter.write(doc);
	},
	
	/*
	  Focuses our context node at the top of the screen.
	 */
	focusContextNode: function(){
		// get the node to scroll to
		// which is our context node
		var ctxtId = "number" + this._contextNodeNumber;
		var ctxt = this._iframeDoc.getElementById(ctxtId);
		
		if(ctxt != null && typeof ctxt != "undefined"){
			if(hs.ui.commandBar.visible == true){
				// Firefox has a strange bug where our hs.ui.CommandBar
				// doesn't get events after rendering a document for the
				// second time; keep sending it's parent document the focus
				// so we get keyboard events
				
				// TODO: Find the underlying cause of this bug so that
				// RenderedDocument doesn't have to know about this information
				document.body.focus();
			}
			
			// scroll our node into view
			ctxt.scrollIntoView(true);
		}
	},
	
	/**
	  Initializes our rendered document. This
	  should be called each time hs.ui.ResultWriter
	  writes a new document into our results.

	  @param contextNodeNumber : String The node number of our context node, such
	  as '2A'.
	*/
	displayDocument: function(contextNodeNumber){
		this._contextNodeNumber = contextNodeNumber;
		
		// set up our event handler to select 
		// and unselect rows
		dojo.event.disconnect(this._iframeDoc.body, "onmouseover", this, this._handleMouse);
		dojo.event.disconnect(this._iframeDoc.body, "onmouseout", this, this._handleMouse);
		dojo.event.connect(this._iframeDoc.body, "onmouseover", this, this._handleMouse);
		dojo.event.connect(this._iframeDoc.body, "onmouseout", this, this._handleMouse);
		
		// setup marking and quick buttons event handler
		dojo.event.disconnect(this._iframeDoc.body, "onclick", this, this._handleClick);
		dojo.event.connect(this._iframeDoc.body, "onclick", this, this._handleClick);
		
		// listen for scroll events to update context node.
		// too many issues - see comments on this._onScroll
		// for details.
		/*dojo.event.connect(this._iframeDoc.body, "onscroll",
							this, this._onScroll);*/
	},
	
	clearSelection: function(){
		if(this._selectedRow != null){
			dojo.html.removeClass(this._selectedRow, "selected-row");
		}
	},
	
	_onFinishedWriting: function(hsDoc, iframeDoc){
		// let the command bar intercept key events on
		// on our rendered document
		hs.ui.commandBar._onRenderedDocument(iframeDoc);
	
		// dump out profiling info if profiling is on
		hs.ui.dumpProfiling();
	},
	
	_handleMouse: function(evt){
		if(hs.ui.markingMode == true){
			return;
		}
		
		var tg = evt.target;
		
		// keep looping till we get a node row
		while(tg != null && dojo.html.hasClass(tg, "node-row") == false){
			tg = tg.parentNode;
		}
		
		if(tg == null || typeof tg == "undefined"){
			return;
		}
		
		// select or unselect the line based on the mouse
		// event
		var evtType = evt.type.toLowerCase();
		if(evtType == "mouseover"){
			dojo.html.addClass(tg, "selected-row");
			this._selectedRow = tg;
		}else if(evtType == "mouseout"){
			dojo.html.removeClass(tg, "selected-row");
			this._selectedRow = null;
		}
	},
	
	_handleClick: function(evt){
		// are we in marking mode?
		if(hs.ui.markingMode == true){
			this._handleMark(evt);
		}else{
			var tg = evt.target;
			if(tg.nodeName.toLowerCase() == "a"){
				evt.stopPropagation();
				evt.preventDefault(true);
				hs.ui.resolveLocation(tg.href);
			}else if(dojo.html.hasClass(tg, "quick-button")){
				evt.stopPropagation();
				evt.preventDefault(true);
				this._handleQuickButton(tg);
			}
		}
	},
	
	_handleQuickButton: function(tg){
		var number;
		var viewspec;
		
		// get the row for the node that was clicked on
		var nodeRow = tg.parentNode;
		while(nodeRow != null
				&& nodeRow.nodeName.toLowerCase() != "tr"){
			nodeRow = nodeRow.parentNode;		
		}
		
		// get the node number for this row
		var nodeNumber = nodeRow.getAttribute(
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
							+ ":number");
		
		// determine our number and viewspecs
		if(dojo.html.hasClass(tg, "quick-zoom-out")){
			viewspec = "ebthz";
			
			// get the parent
			if(nodeNumber == "0"){
				number = "0";
			}else if(nodeNumber.length == 1){ // 1, 2, 3, etc.
				number = "0";
			}else{
				number = nodeNumber.substring(0, nodeNumber.length - 1);
			}
		}else if(dojo.html.hasClass(tg, "quick-zoom-in")){
			viewspec = "ebthz";
			number = nodeNumber;
		}else if(dojo.html.hasClass(tg, "quick-lines")){
			viewspec = "wyh";
			number = nodeNumber;
		}
		
		// put these together to get our final quick button URL
		var url = "#" + number + ":" + viewspec;
		
		// now render it
		hs.ui.resolveLocation(url);
	},
	
	_handleMark: function(evt){
		// if a link was clicked on turn off it's default
		// action
		var tg = evt.target;
		if(tg && tg.nodeName && tg.nodeName.toLowerCase() == "a"){
			evt.stopPropagation();
			evt.preventDefault(true);	
		}
		
		var mark = new hs.ui.Mark(evt);
		
		if(mark.invalidMark == true){
			return;
		}
		
		// publish this Mark to anyone that is interested
		dojo.event.topic.publish("/mark", mark);
	}
	
	/**
	  Changing context node based on scrolling opens too
	  many issues for now; the code below implemented this
	  for IE but commented out until a future phase can resolve
	  usability issues.
	 */
	/*_onScroll: function(evt){
		// Internet Explorer doesn't give us a real value
		// for elementFromPoint if we run it from an onScroll
		// event, so put it on a slight timeout to get it to work right
		var self = this;
		window.setTimeout(function(){
			var results = self._iframeDoc.elementFromPoint(15, 20);
			if(results != null){
				// keep looping till we get a TR table row
				while(results != null && results.nodeName.toLowerCase() != "tr"){
					results = results.parentNode;
				}
				if(results != null){
					var ctxtNumber = results.getAttribute("hs-internal:number");
					var url = "#" + ctxtNumber;
					hs.ui.resolveLocation(url);
				}
			}
		}, 1);
	}*/
});



/**
  Our viewspec overlay window that appears when the user presses 
  the Viewspec button.
  
  TODO: REFACTOR: Make a single base-widget class for this and
  the Jump Overlay.
  
  TODO: REFACTOR: Right now this class has knowledge of viewspec
  letters; refactor CurrentViewspecs to contain this knowledge and
  be able to output viewspecs even if they are the default, then
  remove this knowledge from here.
  
  TODO: Implement show/hide node labels and show/hide node signatures
  and hook this class back into them; code portions having to do with
  these have been commented out for future implementation.
 */
dojo.widget.defineWidget("hs.ui.ViewspecOverlay", dojo.widget.HtmlWidget, {
	widgetType: "ViewspecOverlay",
  	isContainer: true,
	templatePath: dojo.uri.dojoUri("src/hs/templates/ViewspecOverlay.html"),
  	templateCssPath: dojo.uri.dojoUri("src/hs/templates/ViewspecOverlay.css"),
	
	_mark: null,
	_showingMore: false,
	
	/** Unicode for our up and down arrows. */
	_UP_ARROW: "&#9650;",
	_DOWN_ARROW: "&#9660;",
	
	/** 
	  Dirty flags that control whether we will print out
	  the letter for a particular viewspec checkbox or not. 
	  Keeps the specified viewspec field from getting
	  confusing.
	 */
	_blankLinesDirty: false,
	_nodeAddressingDirty: false,
	_nodeLabelsDirty: false,
	_nodeSignaturesDirty: false,
	_includesOnDirty: false,
	_outlineDirty: false,
	_applyFilterDirty: false,

	postCreate: function(){
		this.width = dojo.style.getOuterWidth(this.domNode);
		this.height = dojo.style.getOuterHeight(this.domNode);
		
		// determine our height and set it dynamically
		// so we don't have to hard code it in our
		// CSS; this will make us more robust against
		// user-initiated font-size changes.
		// add the height of the floating pane chrome
		// back in (+50)
		var height = this.height + 50;
		var width = this.width;
		this.viewOverlayPane.style.width = width + "px";
		this.viewOverlayPane.style.height = height + "px";
		
		// save the height for the less-mode
		// so we can restore it later if the user moves
		// to more-mode
		this._lessModeHeight = height;
	},
	
	isShowing: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// see src/client/lib/hs/templates/ViewspecsOverlay.css for
		// description of how class 'initial-overlay-state' is used
		if(dojo.html.hasClass(floatingPane.domNode, "initial-overlay-state")){
			return false;
		}else{
			return floatingPane.isShowing();
		}
	},
	
	/**
		Resets the Viewspec Overlay using
		the current document being displayed
	*/		
	reset: function(){
		this._handleReset();
	},
	
	show: function(){
		// clear out any viewspecs previously entered
		this.selectedViewspecs.value = "";
		
		// reset dirty state
		this._blankLinesDirty = false;
		this._nodeAddressingDirty = false;
		this._nodeLabelsDirty = false;
		this._nodeSignaturesDirty = false;
		this._includesOnDirty = false;
		this._outlineDirty = false;
		this._applyFilterDirty = false;
		
		// initialize our initial viewspec UI
		// using our current viewspecs
		var currentViewspecs = null;
		if(hs.ui.currentHyDoc != null){
			this._resetViewspecs(
					hs.ui.currentHyDoc.currentViewspecs);
			this._printSelectedViewspecs();
		}
		
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// bring to the top, in case other overlays are visible
		floatingPane.bringToTop();
		
		// see src/client/lib/hs/templates/ViewspecsOverlay.css for
		// description of how class 'initial-overlay-state' is used
		dojo.html.removeClass(floatingPane.domNode, 
								"initial-overlay-state");
		
		// determine the width of our viewspec overlay
		
		// start at the Viewspec button
		var viewspecsButton = dojo.byId("toolbarViewspecsButton");
		var viewspecsButtonWidth = dojo.html.getOuterWidth(viewspecsButton);
		var pageWidth = dojo.html.getViewportWidth();
		var startY = dojo.style.getAbsoluteY(viewspecsButton, false) 
					+ viewspecsButtonWidth/2;
		
		// end past the bottom of the toolbar
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var endY = toolbarHeight + 35;
		
		// make the node visible, but turn off it's opacity
		if(dojo.render.html.ie != true){
			dojo.style.setOpacity(floatingPane.domNode, 0);
		}
		dojo.style.show(floatingPane.domNode);
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 0, end: 1 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 40, end: 40 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
		
		dojo.event.connect(anim, "onEnd", dojo.lang.hitch(this, function(){	
			this.selectedViewspecs.select();
		}));
			
		anim.play();
	},
	
	hide: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// start below the toolbar and to the right of the page
		var pageWidth = dojo.html.getViewportWidth();
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var startY = toolbarHeight + 35;
		
		// end at the viewspecs button
		var viewspecsButton = dojo.byId("toolbarViewspecsButton");
		var viewspecsButtonWidth = dojo.html.getOuterWidth(viewspecsButton);
		var endY = dojo.style.getAbsoluteY(viewspecsButton, false) 
				+ viewspecsButtonWidth/2;
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 1, end: 0 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 40, end: 40 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
			
		dojo.event.connect(anim, "onEnd", function(){	
			dojo.style.hide(floatingPane.domNode);
		});
		
		anim.play();
	},
	
	_handleApply: function(){
		// if the apply button is disabled 
		// then an incorrect viewspec button was
		// entered; do nothing
		if(this.applyButton.disabled == true){
			return;
		}
		
		// update our current viewspecs just
		// in case the cursor is still in the 
		// selected viewspecs field
		this._printSelectedViewspecs();
		
		// get our new viewspecs
		var newViews = this.selectedViewspecs.value;
			
		// turn the viewspecs into a url
		var url = "#:" + newViews;
		
		// attach a filter if we have one
		if(this.applyFilter.checked == true){
			var filter = this.filterInput.value;
			// add quotes if there aren't any there and
			// we don't have a regular expression
			if(dojo.string.startsWith(filter, '"') == false
				&& dojo.string.startsWith(filter, "/") == false){
				filter = '"' + filter + '"';
			}
			
			url += " ;" + filter + ";";	
		}
		
		hs.ui.resolveLocation(url);
		
		// reset dirty settings
		this._resetDirty();
		
		// select everything in the viewspec input
		// in case the user wants to type again in
		// there
		this.selectedViewspecs.select();
	},
	
	_handleCancel: function(){
		this.hide();
	},
	
	_handleReset: function(){
		this.selectedViewspecs.value = "";
		
		// reset dirty state
		this._resetDirty();
		
		var currentViewspecs = null;
		if(hs.ui.currentHyDoc != null){
			this._resetViewspecs(
					hs.ui.currentHyDoc.currentViewspecs);
			this._printSelectedViewspecs();
		}
	},
	
	_resetDirty: function(){
		this._blankLinesDirty = false;
		this._nodeAddressingDirty = false;
		this._nodeLabelsDirty = false;
		this._nodeSignaturesDirty = false;
		this._includesOnDirty = false;
		this._outlineDirty = false;
		this._applyFilterDirty = false;
	},
	
	_resetViewspecs: function(currentViewspecs){	
		if(currentViewspecs.showBlankLines()){
			this.showBlankLines.checked = true;
		}else{
			this.showBlankLines.checked = false;
		}
		
		var levelClipping = currentViewspecs.getLevelClipping();
		var lineClipping = currentViewspecs.getLineClipping();
		if(levelClipping == 1 && lineClipping == 1){
			this._showFirstOutline();
		}else if(levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
					&& lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();				
		}else{
			this._showOutlineNumbers(levelClipping, lineClipping);	
		}
		
		if(currentViewspecs.showNodeAddressing()){
			this.showNodeAddressing.checked = true;
			this.placementLeft.disabled = undefined;
			this.placementRight.disabled = undefined;
			
			if(currentViewspecs.getNodeAddressingPlacement()
				== hs.filter.ViewspecConstants.LEFT){
				this.placementLeft.checked = true;	
				this.placementRight.checked = false;		
			}else{
				this.placementLeft.checked = false;
				this.placementRight.checked = true;
			}		
		}else{
			this.showNodeAddressing.checked = false;
			this.placementLeft.disabled = true;
			this.placementRight.disabled = true;
		}
		
		// commenting out for future implementation
		/*if(currentViewspecs.showNodeLabels()){
			this.showNodeLabels.checked = true;
		}else{
			this.showNodeLabels.checked = false;
		}
		
		if(currentViewspecs.showNodeSignatures()){
			this.showNodeSignatures.checked = true;
		}else{
			this.showNodeSignatures.checked = false;
		}*/
		
		if(currentViewspecs.runSequenceGenerators()){
			this.includesOn.checked = true;
		}else{
			this.includesOn.checked = false;
		}
		
		if(currentViewspecs.getContentFilterType()
				== hs.filter.ViewspecConstants.NO_FILTERING){
			this.applyFilter.checked = false;
			this.filterInput.disabled = true;
		}else if(currentViewspecs.getContentFilterType()
				== hs.filter.ViewspecConstants.FILTER_ALL){
			this.applyFilter.checked = true;
			this.filterInput.disabled = undefined;
			var contentFilter = hs.ui.currentHyDoc.address.contentFilter;
			if(contentFilter != null){
				this.filterInput.value = contentFilter.toString();
			}		
		}else if(currentViewspecs.getContentFilterType()
				== hs.filter.ViewspecConstants.NEXT_FILTERED_NODE){
			// not supported through Viewspec UI
			this.applyFilter.checked = false;
			this.filterInput.disabled = true;	
		}
	},
	
	_showFirstOutline: function(evt){
		this.showFirstOutline.checked = true;
		this.showAllOutline.checked = false;
		
		this.levelInput.value = "1";
		this.lineInput.value = "1";
		
		this.levelUp.disabled = undefined;
		// level 0 is possible
		this.levelDown.disabled = undefined;
		
		this.lineUp.disabled = undefined;
		this.lineDown.disabled = true;
		
		if(typeof evt != "undefined"){
			this._outlineDirty = true;
			this._printSelectedViewspecs();
		}
	},
	
	_showAllOutline: function(evt){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = true;
		
		this.levelInput.value = 
			hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
		this.lineInput.value = 
			hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
		
		this.levelUp.disabled = true;
		this.levelDown.disabled = undefined;
		
		this.lineUp.disabled = true;
		this.lineDown.disabled = undefined;
		
		if(typeof evt != "undefined"){
			this._outlineDirty = true;
			this._printSelectedViewspecs();
		}
	},
	
	_showOutlineNumbers: function(levelClipping, lineClipping){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		
		this.levelInput.value = levelClipping;
		this.lineInput.value = lineClipping;
		
		this.levelUp.disabled = undefined;
		this.levelDown.disabled = undefined;
		
		if(levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			this.levelUp.disabled = true;	
		}
		
		if(lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this.lineUp.disabled = true;	
		}
		
		if(levelClipping == 0){
			this.levelDown.disabled = true;	
		}
		
		if(lineClipping == 1){
			this.lineDown.disabled = true;	
		}
	},
	
	_incrementLevel: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.levelInput.value = new Number(this.levelInput.value).valueOf() + 1;
		this.levelUp.disabled = undefined;
		this.levelDown.disabled = undefined;
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			this.levelUp.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_decrementLevel: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.levelInput.value = new Number(this.levelInput.value).valueOf() - 1;
		this.levelUp.disabled = undefined;
		this.levelDown.disabled = undefined;
		
		if(this.levelInput.value == 0){
			this.levelDown.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_incrementLine: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.lineInput.value = new Number(this.lineInput.value).valueOf() + 1;
		this.lineUp.disabled = undefined;
		this.lineDown.disabled = undefined;
		
		if(this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this.lineUp.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_decrementLine: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.lineInput.value = new Number(this.lineInput.value).valueOf() - 1;
		this.lineUp.disabled = undefined;
		this.lineDown.disabled = undefined;
		
		if(this.lineInput.value == 1){
			this.lineDown.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleBlankLines: function(){
		this._blankLinesDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleNodeAddressing: function(){
		if(this.showNodeAddressing.checked == true){
			this.showNodeAddressing.checked = true;
			this.placementLeft.disabled = undefined;
			this.placementRight.disabled = undefined;
			
			// if there are no pre-existing values
			// for the left/right radio buttons, give
			// the default
			if(this.placementLeft.checked == false
				&& this.placementRight.checked == false){
				this.placementLeft.checked = true;		
			}
		}
		else{ // unchecked
			this.showNodeAddressing.checked = false;
			this.placementLeft.disabled = true;
			this.placementRight.disabled = true;
		}
		
		this._nodeAddressingDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_setPlacementLeft: function(){
		this.placementLeft.checked = true;
		this.placementRight.checked = false;
		
		this._nodeAddressingDirty = true;
		
		this._printSelectedViewspecs();	
	},
	
	_setPlacementRight: function(){
		this.placementLeft.checked = false;
		this.placementRight.checked = true;
		
		this._nodeAddressingDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleNodeLabels: function(){
		this._nodeLabelsDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleNodeSignatures: function(){
		this._nodeSignaturesDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleIncludesOn: function(){
		this._includesOnDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleFilter: function(){
		if(this.applyFilter.checked == true){
			this.filterInput.disabled = undefined;
		}else{
			this.filterInput.disabled = true;
		}
		
		this._applyFilterDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_printSelectedViewspecs: function(){
		// print out anything that has a checkbox
		var results = new String();
		
		if(this._blankLinesDirty == true){
			if(this.showBlankLines.checked == true){
				results += "y";
			}else{
				results += "z";
			}
		}
		
		if(this._nodeAddressingDirty == true){
			if(this.showNodeAddressing.checked == true){
				results += "m";
				
				if(this._showingMore){
					if(this.placementLeft.checked == true){
						results += "H";
					}else if(this.placementRight.checked == true){
						results += "G";
					}
				}
			}else{
				results += "n";
			}
		}
		
		if(this._showingMore){
			// commenting out for future implementation
			/*if(this._nodeLabelsDirty == true){
				if(this.showNodeLabels.checked == true){
					results += "C";
				}else{
					results += "D";
				}
			}
			
			if(this._nodeSignaturesDirty == true){
				if(this.showNodeSignatures.checked == true){
					results += "K";
				}else{
					results += "L";
				}
			}*/
		
			if(this._includesOnDirty == true){
				if(this.includesOn.checked == true){
					results += "O";
				}else{
					results += "P";
				}
			}
		}
		
		if(this._outlineDirty == true){
			if(this.showFirstOutline.checked == true){
				results += "x";
			}else if(this.showAllOutline.checked == true){
				results += "w";
			}else if(this._showingMore){
				var levelValue = new Number(this.levelInput.value).valueOf();
				var lineValue = new Number(this.lineInput.value).valueOf();
				
				results = 
					this._writeLevelClipping(levelValue, lineValue, results);
					
				results = 
					this._writeLineClipping(levelValue, lineValue, results);
			}
		}
		
		if(this._showingMore){
			if(this._applyFilterDirty == true){
				if(this.applyFilter.checked == true){
					results += "i";
				}else{
					results += "j";
				}
			}
		}
		
		this.selectedViewspecs.value = this._filterViewspecs(results);
	},
	
	_writeLineClipping: function(levelValue, lineValue, results){
		// line clipping
		if(lineValue == 1){
			// show just first line
			// t - show first lines only
			results += "t";
		}else if(lineValue == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			// line clipping is the max
			// s - show all lines
			results += "s";
		}else{
			// figure out if line clipping is closer to 1 or the max
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LINE_CLIPPING - lineValue;
			if(distanceToMax <= lineValue){
				// much closer to the maximum line clipping
				// write out 's' ('show all lines'), followed
				// by necessary number of 'q' ('show one lines less')
				// letters
				results += "s";
				for(var i = distanceToMax; i > 0; i--){
					results += "q";
				}
			}else{
				// much closer to the beginning of the allowed value
				// write out 't' ('show first lines only') followed
				// by necessary number of 'r' ('show one line more')
				// letters
				results += "t";
				for(var i = 2; i <= lineValue; i++){
					results += "r";
				}
			}
		}
		
		return results;
	},
	
	_writeLevelClipping: function(levelValue, lineValue, results){
		// level clipping
		var ctxtNodeLevel = hs.ui.currentHyDoc.nodeCtxt.level;
		
		if(levelValue == 1){
			// first level
			// d - show first level only
			results += "d";
		}else if(levelValue == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			// level clipping is max
			// c - show all levels
			results += "c";
		}else if(levelValue == 0){
			// show just level 0 - no direct viewspec letter to get
			// this
			// write out 'da' -
			// 'd' - 'show first level only
			// 'a' - show one level less
			results += "da";
		}else if(levelValue >= (hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - 20)){
			// our level clipping is within 20 units of the maximum allowed value
			// write out 'c' ('show all levels') followed by the necessary
			// number of 'a' ('show one level less') letters
			results += "c";
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - levelValue;
			for(var i = distanceToMax; i > 0; i--){
				results += "a";
			}
		}else if(ctxtNodeLevel != 0 && levelValue >= ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is equal to or greater than
			// this node.
			// write out 'e' ('show levels up to referenced node'), followed
			// by necessary number of 'b' ('show one level more') letters
			results += "e";
			var distanceFromCtxt = levelValue - ctxtNodeLevel;
			for(var i = 1; i <= distanceFromCtxt; i++){
				results += "b";
			}
		}else if(ctxtNodeLevel != 0 && levelValue < ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is less than
			// this node.
			
			// determine whether our level clipping is closer to 1 or
			// to our context node's level
			var distanceToCtxt = ctxtNodeLevel - levelValue;
			if(distanceToCtxt >= levelValue){
				// we are closer to 1.
				// write out 'd' ('show first level only'), followed
				// by correct number of 'b' ('show one level more')
				// letters
				results += "d";
				for(var i = 2; i <= levelValue; i++){
					results += "b";
				}
			}else{
				// we are closer to the context node
				// write out 'e' ('show levels up to referenced node'), 
				// followed by necessary number of 'a' 
				// ('show one level less') letters
				results += "e";
				for(var i = 1; i <= distanceToCtxt; i++){
					results += "a";
				}
			}	
		}else if(ctxtNodeLevel == 0){
			results += "da" // get to level zero
			// now write out the correct number of 'b's
			for(var i = 1; i <= levelValue; i++){
				results += "b";
			}	
		}
			
		return results;
	},
	
	_toggleSelectedViewspecs: function(evt){
		// see if the user pressed enter or escape
		// 13 is the ENTER key on Windows/Linux
		// and the RETURN key on a Mac
		if(evt.keyCode == 13){
			this._handleApply();
			return;
		}else if(evt.keyCode == 27){ // ESCAPE key
			this.hide();
			return;
		}	
		
		// we are dealing with a new viewspec letter
		
		// append our old viewspecs to the new ones
		// entered by a user so we don't lose some that
		// are not specifiable through the UI
		var newViews = this.selectedViewspecs.value;
		var originalViews = hs.ui.currentHyDoc.currentViewspecs.toString();
		newViews = originalViews + newViews;
		
		// mark fields dirty using letters
		this._markDirtyWithLetters(this.selectedViewspecs.value);
		
		// clear any old error message
		this.errorArea.innerHTML = "";
		this.applyButton.disabled = undefined;
		
		// create a new viewspec object
		var currentViewspecs;
		try{
			currentViewspecs = 
				new hs.filter.CurrentViewspecs(newViews, hs.ui.currentHyDoc);
		}catch(e){
			evt.stopPropagation();
			evt.preventDefault(true);
			this.errorArea.innerHTML = e;
			this.applyButton.disabled = true;
			return;
		}
		
		this._resetViewspecs(currentViewspecs);
	},
	
	_filterViewspecs: function(results){
		// keep any viewspecs that aren't settable through the UI
		var oldViews = this.selectedViewspecs.value;
		var removeViews;
		if(this._showingMore){
			// commenting out because C, D, K, and L are not implemented yet
			// uncomment when they are
			//removeViews = /y|z|m|n|H|G|C|D|K|L|O|P|x|w|a|b|c|d|r|q|s|t|i|j|k/g;
			removeViews = /y|z|m|n|H|G|O|P|x|w|a|b|c|d|r|q|s|t|i|j|k/g;
		}else{
			removeViews = /y|z|m|n|x|w/g;
		}
		oldViews = oldViews.replace(removeViews, "");
		
		results = results + oldViews;
		
		return results;
	},
	
	_toggleAdvanced: function(){
		var width = this.width;
		var height;
		
		if(this._showingMore == false){ // toggle to more mode
			this._showingMore = true;
			this.advancedButton.innerHTML = "Less&nbsp;&#9650;";
			dojo.html.replaceClass(this.viewTable, "moreMode", "lessMode");
			height = this.viewTable.scrollHeight + 50;
		}else{ // toggle to less mode
			this._showingMore = false;
			this.advancedButton.innerHTML = "More&nbsp;&#9660;";
			dojo.html.replaceClass(this.viewTable, "lessMode", "moreMode");
			height = this._lessModeHeight; 	
		}
		
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		floatingPane.resizeTo(width, height);
	},
	
	_markDirtyWithLetters: function(letters){
		if(letters.indexOf("y") != -1 
			|| letters.indexOf("z") != -1){
			this._blankLinesDirty = true;		
		}
		
		if(letters.indexOf("m") != -1 
			|| letters.indexOf("n") != -1
			|| letters.indexOf("G") != -1
			|| letters.indexOf("H") != -1){
			this._nodeAddressingDirty = true;		
		}
		
		// commenting out for future implementation
		/*
		if(letters.indexOf("C") != -1 
			|| letters.indexOf("D") != -1){
			this._nodeLabelsDirty = true;		
		}
		
		if(letters.indexOf("K") != -1 
			|| letters.indexOf("L") != -1){
			this._nodeSignaturesDirty = true;		
		}*/
		
		if(letters.indexOf("O") != -1 
			|| letters.indexOf("P") != -1){
			this._includesOnDirty = true;		
		}
		
		if(letters.indexOf("x") != -1 
			|| letters.indexOf("w") != -1
			|| letters.indexOf("a") != -1
			|| letters.indexOf("b") != -1
			|| letters.indexOf("c") != -1
			|| letters.indexOf("d") != -1
			|| letters.indexOf("r") != -1
			|| letters.indexOf("q") != -1
			|| letters.indexOf("s") != -1
			|| letters.indexOf("t") != -1
			|| letters.indexOf("e") != -1){
			this._outlineDirty = true;		
		}
		
		if(letters.indexOf("i") != -1 
			|| letters.indexOf("j") != -1
			|| letters.indexOf("k") != -1){
			this._applyFilterDirty = true;		
		}
	}
});



/**
  Our jump overlay window that appears when the user presses the Jump button.
  
  TODO: REFACTOR: Make a single base-widget class for this and our other
  overlays.
 */
dojo.widget.defineWidget("hs.ui.JumpOverlay", dojo.widget.HtmlWidget, {
	widgetType: "JumpOverlay",
  	isContainer: true,
	templatePath: dojo.uri.dojoUri("src/hs/templates/JumpOverlay.html"),
  	templateCssPath: dojo.uri.dojoUri("src/hs/templates/JumpOverlay.css"),
	
	_mark: null,

	postCreate: function(){
		this.width = dojo.style.getOuterWidth(this.domNode);
		this.height = dojo.style.getOuterHeight(this.domNode);
		
		// determine our height and set it dynamically
		// so we don't have to hard code it in our
		// CSS; this will make us more robust against
		// user-initiated font-size changes.
		// add the height of the floating pane chrome
		// back in (+50)
		var height = this.height + 50;
		var width = this.width;
		this.jumpOverlay.style.width = width + "px";
		this.jumpOverlay.style.height = height + "px";
		
		// subscribe to mark events
		dojo.event.topic.subscribe("/mark", this, "_onMark");
	},
	
	getHeight: function(){
		return this.height;
	},
	
	resolveURL: function(){
		var url = this.addressInput.value;
		this.addressInput.value = "";
		
		/**
			Four input modes are allowed:
				* Input is preceded with a hash
				* Input has a scheme://
				* Input has ../ or ./ at the beginning -
				interpreted as a relative file address
				* Input has neither of these, and
				is interpreted as having a #
		*/
		if(dojo.string.startsWith(url, "#") == false
			&& dojo.string.startsWith(url, "./") == false
			&& dojo.string.startsWith(url, "../") == false
			&& /^[^:]*:\//.test(url) == false){
			url = "#" + url;		
		}
		
		hs.ui.resolveLocation(url);
	},
	
	handleOK: function(){
		this.resolveURL();
	},
	
	handleCancel: function(){
		this.hide();
	},
	
	handleKey: function(evt){
		// 13 is the ENTER key on Windows/Linux
		// and the RETURN key on a Mac
		if(evt.keyCode == 13){
			this.resolveURL();
		}else if(evt.keyCode == 27){ // ESCAPE key
			this.hide();
		}		
	},
	
	isShowing: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		if(dojo.html.hasClass(floatingPane.domNode, "initial-overlay-state")){
			return false;
		}else{
			return floatingPane.isShowing();
		}
	},
	
	show: function(){
		// indicate that we can do marking
		hs.ui.markingMode = true;
		
		// clear out any address previously entered
		this.addressInput.value = "";
		
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// bring to the top, in case other overlays are visible
		floatingPane.bringToTop();
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		dojo.html.removeClass(floatingPane.domNode, "initial-overlay-state");
		
		// determine the width of our jump overlay
		
		// start at the Jump button
		var jumpButton = dojo.byId("toolbarJumpButton");
		var jumpButtonWidth = dojo.html.getOuterWidth(jumpButton);
		var pageWidth = dojo.html.getViewportWidth();
		var startY = dojo.style.getAbsoluteY(jumpButton, false) + jumpButtonWidth/2;
		
		// end right below the toolbar
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var endY = toolbarHeight + 30;
		
		// make the node visible, but turn off it's opacity
		if(dojo.render.html.ie != true){
			dojo.style.setOpacity(floatingPane.domNode, 0);
		}
		dojo.style.show(floatingPane.domNode);
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 0, end: 1 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 60, end: 60 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
		
		dojo.event.connect(anim, "onEnd", dojo.lang.hitch(this, function(){	
			this.addressInput.focus();
		}));
		
		anim.play();
	},
	
	hide: function(){
		// turn off allowing marking
		hs.ui.markingMode = false;	
		
		// clear old marks
		this._setMarkable(false);
	
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// start below the toolbar and to the right of the page
		var pageWidth = dojo.html.getViewportWidth();
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var startY = toolbarHeight + 30;
		
		// end at the jump button
		var jumpButton = dojo.byId("toolbarJumpButton");
		var jumpButtonWidth = dojo.html.getOuterWidth(jumpButton);
		var endY = dojo.style.getAbsoluteY(jumpButton, false) + jumpButtonWidth/2;
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 1, end: 0 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 60, end: 60 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
			
		dojo.event.connect(anim, "onEnd", function(){	
			dojo.style.hide(floatingPane.domNode);
		});
		
		anim.play();
	},
	
	_setMarkable: function(markable){
		if(markable == true){
			if(this._mark != null){	
				dojo.html.addClass(this._mark.row, "marked");
			}
		}else{
			if(this._mark != null){
				dojo.html.removeClass(this._mark.row, "marked");
			}
			this._mark = null;
		}
	},
	
	_onMark: function(mark){
		// don't do marking if we are not visible
		if(this.isShowing() == false){
			return;
		}
		
		// clear out any mark that may have been there before
		this._setMarkable(false);
		
		this._mark = mark;
		
		// convert this mark to an address that can
		// be worked with
		var addr = mark.address;
		var url = addr.toString();
		
		// take just the hash portion
		url = url.match(/[^#]*(#.*)/)[1];
		
		// fill our Jump Overlay text field with this
		// marked address
		this.addressInput.value = url; 
		
		// highlight our marked row
		this._setMarkable(true);
	}
});


/**
  A Dojo Widget that implements our HyperScope toolbar.
 */
dojo.widget.defineWidget("hs.ui.HyperScopeToolbar", dojo.widget.HtmlWidget, {
	widgetType: "HyperScopeToolbar",
  	isContainer: false,
	templatePath: dojo.uri.dojoUri("src/hs/templates/HyperScopeToolbar.html"),
  	templateCssPath: dojo.uri.dojoUri("src/hs/templates/HyperScopeToolbar.css"),

	fillInTemplate: function(){
		// fill out our data structure that associates our buttons with
		// their states so we don't have so much boilerplate code
		// and can work with them generically
		this._buttonStates = new Array();
		this._buttonStates.push({id: "toolbarHelpButton",
								domNode: this.toolbarHelpButton,
								onaction: dojo.lang.hitch(this, this._toggleHelpOverlay),
								normal: "/hyperscope/src/client/images/help_normal.gif",
								rollover: "/hyperscope/src/client/images/help_rollover.gif",
								down: "/hyperscope/src/client/images/help_down.gif"});
								
		this._buttonStates.push({id: "toolbarJumpButton",
								domNode: this.toolbarJumpButton,
								onaction: dojo.lang.hitch(this, this._toggleJumpOverlay),
								normal: "/hyperscope/src/client/images/jump_normal.gif",
								rollover: "/hyperscope/src/client/images/jump_rollover.gif",
								down: "/hyperscope/src/client/images/jump_down.gif"});
								
		this._buttonStates.push({id: "toolbarViewspecsButton",
								domNode: this.toolbarViewspecsButton,
								onaction: dojo.lang.hitch(this, this._toggleViewspecsOverlay),
								normal: "/hyperscope/src/client/images/viewspecs_normal.gif",
								rollover: "/hyperscope/src/client/images/viewspecs_rollover.gif",
								down: "/hyperscope/src/client/images/viewspecs_down.gif"});
		
		this._buttonStates.push({id: "toolbarTurboModeButton",
								domNode: this.toolbarTurboModeButton,
								onaction: dojo.lang.hitch(this, this._toggleCommandBar),
								normal: "/hyperscope/src/client/images/turbomode_normal.gif",
								rollover: "/hyperscope/src/client/images/turbomode_rollover.gif",
								down: "/hyperscope/src/client/images/turbomode_down.gif"});
								
		this._buttonStates.push({id: "toolbarBrowserModeButton",
								domNode: this.toolbarBrowserModeButton,
								onaction: dojo.lang.hitch(this, this._toggleCommandBar),
								normal: "/hyperscope/src/client/images/browsermode_normal.gif",
								rollover: "/hyperscope/src/client/images/browsermode_rollover.gif",
								down: "/hyperscope/src/client/images/browsermode_down.gif"});
			
		// display our initial button state and set up our event listeners
		// to toggle our image states correctly
		for(var i = 0; i < this._buttonStates.length; i++){
			var entry = this._buttonStates[i];
			entry.domNode.src = entry.normal;
			dojo.event.connect(entry.domNode, "onmouseup", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onmousedown", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onmouseover", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onmouseout", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onclick", this, "_handleMouse");
		}
	},
	
	initializeTurboModeSettings: function(){
		// determine our command bar's initial visibility state
		if(this._isTurboMode() == true){
			this._toggleCommandBar(true);
		}else{
			this._toggleCommandBar(false);
		}
	},
	
	postCreate: function(){
		// determine our command bar's initial visibility state
		if(this._isTurboMode() == true){
			this._toggleCommandBar(true);
		}else{
			this._toggleCommandBar(false);
		}
	},
	
	_handleMouse: function(evt){
		var tg = evt.target;
		var id = tg.id;
		
		// get the button entry we are dealing with
		var entry;
		for(var i = 0; i < this._buttonStates.length; i++){
			if(this._buttonStates[i].id == id){
				entry = this._buttonStates[i];
				break;
			}
		}
		
		// change it's image correctly
		switch(evt.type.toLowerCase()){
			case "mouseover":
				entry.domNode.src = entry.rollover;
				break;
			case "mouseout":
				entry.domNode.src = entry.normal;
				break;
			case "mousedown":
				entry.domNode.src = entry.down;
				break;
			case "mouseup":
				entry.domNode.src = entry.rollover;
				break;
			case "click":
				entry.onaction.call();
				break;
		}
	},
	
	_toggleJumpOverlay: function(){
		var jumpOverlay = dojo.widget.byId("jumpOverlay");
		
		if(jumpOverlay.isShowing() == true){
			jumpOverlay.hide();
		}else{
			jumpOverlay.show();
		}
	},
	
	_toggleViewspecsOverlay: function(){
		var viewspecsOverlay = dojo.widget.byId("viewspecsOverlay");
		
		if(viewspecsOverlay.isShowing() == true){
			viewspecsOverlay.hide();
		}else{
			viewspecsOverlay.show();
		}
	},
	
	_toggleCommandBar: function(forceShow){
		if(hs.ui.commandBar.isShowing() || forceShow == false){
			this.toolbarJumpButton.style.display = "inline";
			this.toolbarViewspecsButton.style.display = "inline";
			this.commandBarCell.style.display = "none";
			
			this.toolbarTurboModeButton.style.display = "inline";
			this.toolbarBrowserModeButton.style.display = "none";
			
			// make parts of the toolbar smaller
			// for narrower moniters
			dojo.html.removeClass(this.rightHandCell, "right-shorter");
			
			// persist this setting
			this._setTurboMode(false);
		
			hs.ui.commandBar.hide();
		}else{
			var jumpOverlay = dojo.widget.byId("jumpOverlay");
			var viewspecsOverlay = dojo.widget.byId("viewspecsOverlay");

			// persist this setting
			this._setTurboMode(true);

			if(jumpOverlay.isShowing()){
				jumpOverlay.hide();
			}
			
			if(viewspecsOverlay.isShowing()){
				viewspecsOverlay.hide();
			}

			if(dojo.render.html.ie){
				// no support for table-cell display
				this.commandBarCell.style.display = "block";
			}else{ // w3c
				this.commandBarCell.style.display = "table-cell";
			}
			
			this.toolbarJumpButton.style.display = "none";
			this.toolbarViewspecsButton.style.display = "none";
			
			this.toolbarTurboModeButton.style.display = "none";
			this.toolbarBrowserModeButton.style.display = "inline";

			// make parts of the toolbar smaller
			// for narrower moniters
			dojo.html.addClass(this.rightHandCell, "right-shorter");

			hs.ui.commandBar.show();
		}
	},
	
	_setTurboMode: function(turboMode){
		if(turboMode == true){
			dojo.io.cookie.set("isturbomode", "yes", 30);
		}else{
			dojo.io.cookie.deleteCookie("isturbomode");
		}
	},
	
	_isTurboMode: function(){
		// REFACTOR: This should be in it's own user configuration class
		var turboModeSetting = dojo.io.cookie.get("isturbomode");

		if(turboModeSetting == "yes"){
			return true;
		}else{
			return false;
		}
	},
	
	_toggleHelpOverlay: function(){
		var helpOverlay = dojo.widget.byId("helpOverlay");
		
		if(helpOverlay.isShowing() == true){
			helpOverlay.hide();
		}else{
			helpOverlay.show();
		}
	}
});


/**
  During profiling we found that writing our HTML results
  into our iframe after our XSLT stylesheet was a bottleneck.
  This class encapsulates writing into the iframe, hiding any
  ugly optimizations we may have to do.
  
  The current strategy inside of ResultWriter is to create
  higher perceived performance by batching and writing the rows
  in chunks, using an interval timer to return control to the browser
  ever few milliseconds. Other tricks are also done to increase
  actual performance.
  
  TODO: REFACTOR: This code has become gnarly, both to stay
  very fast cross-browser, as well as to work around various
  limitations in our target browsers. If possible, simplify
  this code either here or by changing the architecture in
  the future. It was a major bottleneck area so it might
  have to remain ugly.
 */

/**
	Constructor. A ResultWriter should be constructed once
	and reused for the lifetime of the application;
	call the write() method each time after to write
	a new hs.model.Document that has been rendered with
	XSLT.
	  
	@param renderDoc : hs.ui.RenderedDocument Where we display
	our results.
	@param iframe : DOM Iframe The Iframe to write our results
	into.
	@param onFinishedWriting : Function A JavaScript Function
	that will be called when we are finished writing. This 
	function is passed a reference to the iframe's document
	object, which can be used to attach more behaviors
	to the rendered document. It is also passed a reference
	to the hs.model.Document that is being rendered:
		onFinishedWriting = function(hsDoc : hs.model.Document,
									iframeDoc : DOMDocument)
 */
hs.ui.ResultWriter = function(renderDoc, iframe, onFinishedWriting){
	this._renderDoc = renderDoc;
	this._onFinishedWriting = onFinishedWriting;
	this._iframe = iframe;
	
	this._initializeIframe();
	
	this._lineClipper = new hs.ui.LineClipper(iframe);
}

/** 
	The amount of time between writing chunked results to 
	the page, in milliseconds.
*/
hs.ui.ResultWriter._INTERVAL = 15;

/** The number of rows to chunk at one time. */
hs.ui.ResultWriter._CHUNK_AMOUNT = 40;

dojo.lang.extend(hs.ui.ResultWriter, {
	_iframe: null,
	_trNodes: null,
	_currentIndex: null,
	_container: null,
	_doc: null,
	_focusedCtxtNode: false,
	_haveOneFilteredNode: false,
	_lineClipper: null,

	/**
	  Displays the results to the end user
	  after an address is applied to a document.
	  
	  @param doc hs.model.Document Document to
	  display.
	 */
	write: function(doc){
		hs.profile.start("writing_html");
		
		this._doc = doc;
		var iframe = this._iframe;
		
		// whether we have a content filter on
		this._applyFilter = false;
		this._haveOneFilteredNode = false;
		if(doc.currentViewspecs.getContentFilterType() != 
			hs.filter.ViewspecConstants.NO_FILTERING){
			this._applyFilter = true;	
		}
		
		// the code below was inlined because
		// it was found when they were placed into
		// different private methods that it impacted
		// performance
		
		// get our node rows
		// getElementById does not work on generated DOM document on
		// Internet Explorer, so use selectNodes()
		var hyDoc;
		if(typeof doc.renderedHtmlDom.getElementById == "undefined"){ // Internet Explorer
			hyDoc = doc.renderedHtmlDom.selectNodes("//*[@id='hyperScopeDocument']")[0];
		}else{ // W3C
			hyDoc = doc.renderedHtmlDom.getElementById("hyperScopeDocument");
		}
		this._trNodes = hyDoc.childNodes;
		
		// delete any child nodes on the iframe's body element from
		// past writing sessions
		iframe.body.innerHTML = "";
		
		// add a copy of this container to our rendered document
		// IE doesn't support importNode, so make a fresh container
		// div element and copy our attributes over
		var container;
		if(typeof iframe.importNode == "undefined"){ // Internet Explorer
			var table = iframe.createElement("table");
			table.id = "hyperScopeDocument";
			table.className = hyDoc.getAttribute("class");
			var tbody = iframe.createElement("tbody");
			table.appendChild(tbody);
			iframe.body.appendChild(table);
			container = tbody;
		}else{ // W3C
			container = iframe.importNode(hyDoc, false);
			iframe.body.appendChild(container);
			container = iframe.getElementById("hyperScopeDocument");
		}
		
		this._container = container;
		
		// indicate that we have a new rendered document
		this._renderDoc.displayDocument(doc.nodeCtxt.number);
		
		// we want our node context to jump _right_
		// when it is ready, not waiting for the full
		// page to load; this increases perceived performance
		this._ctxtNodeCounter = doc.nodeCtxt.nodeCounter;
		
		// clear a pre-existing interval
		if(this._currentInterval != null){
			window.clearInterval(this._currentInterval);
			this._curentInterval = null;
		}
		
		// setup our interval callback
		this._currentIndex = 0;
		this._currentInterval = 
			window.setInterval(dojo.lang.hitch(this, this._writeChunk), 
								hs.ui.ResultWriter._INTERVAL);
								
		// immediately write out a chunk
		this._writeChunk();
	},
	
	_writeChunk: function(){
		// have we written everything? if so, clear interval
		if(this._currentIndex >= this._trNodes.length){
			window.clearInterval(this._currentInterval);
			this._currentInterval = null;
			this._currentIndex = 0;
			
			// find out if we at least got to write out one node for
			// a content filter; if not, there was some combination of
			// viewspecs and content filter that has nothing to display; 
			// give a message so that users don't get lost and give them a
			// way to turn the content filter off
			if(this._haveOneFilteredNode == false){
				var messageBlock = this._iframe.createElement("div");
				messageBlock.className = "nothing-to-show-message";
				messageBlock.innerHTML = 
								"The combination of content filter and "
								+ "viewspecs produces nothing to display; "
								+ "<a href=\"#:j\">click here</a> to turn "
								+ "the content filter off and display "
								+ "content again";
				this._iframe.body.appendChild(messageBlock);
			}
			
			// pad the bottom of the document with extra space
			// for small documents and for jumping to nodes at the
			// bottom
			this._padBottomOfDocument();
			
			// jump to our context node a final time
			this._renderDoc.focusContextNode();
			
			// fade the status area, which says "Resolving..."
			hs.ui.fadeStatus();
			
			// indicate that we are done
			this._onFinishedWriting.call(null, this._doc, this._iframe);
		}else{
			// pull out each of our variables as local variables
			// because they are faster in side of loops than using
			// this.* notation
			var chunkAmount = hs.ui.ResultWriter._CHUNK_AMOUNT;
			var trNodes = this._trNodes;
			var currentIndex = this._currentIndex;
			var iframe = this._iframe;
			var container = this._container;
			var rowChunk = new Array();
			var applyFilter = this._applyFilter;
			
			// now blit out each row, until we have either written as many
			// as we are supposed to for this chunk or we are completely
			// out of rows

			// TODO: REFACTOR: See if there is a single, common way
			// to handle the code below cross-browser that is fast on both
			
			// IE doesn't support importNode, so branch here
			if(typeof iframe.importNode != "undefined"){ // w3c
				var fragment = iframe.createDocumentFragment();
				for(var loopCounter = 0; loopCounter < chunkAmount 
											&& currentIndex < trNodes.length; 
												loopCounter++, currentIndex++){
					// make a copy of the row, or the table will
					// only display every other row
					var row = iframe.importNode(trNodes[currentIndex], true);
					
					// don't display this row if it is filtered out
					if(applyFilter == true
							&& row.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":passes-content-filter") != "yes"){
						continue;			
					}
					
					// indicate that at least one node passed
					this._haveOneFilteredNode = true;
					
					// Support XSLT's 'disable-output-escaping' on Mozilla,
					// which doesn't natively support it.
					// ROW > Second TD > Go to first child DIV > Go past A to SPAN
					var dataCell = row.childNodes[1].firstChild.childNodes[1];
					var data = dataCell.innerHTML;
					var hasHTML = false;
					if(data.indexOf("&") != -1){ // we have an XML entity
						// dereference our XML entities
						data = data.replace(/&lt;/g, "<");
						data = data.replace(/&gt;/g, ">");
						data = data.replace(/&amp;/g, "&");
						data = data.replace(/&quot;/g, "\"");
						// doing an innerHTML will now have them be interpreted
						// as HTML
						dataCell.innerHTML = data;
					}
					
					// do we have HTML tags? If so, dynamically
					// calculate our height for line clipping
					if(data.indexOf("<") != -1){
						hasHTML = true;
					}
					
					// apend this new node row
					fragment.appendChild(row);
					
					// add this to our row chunk array
					// so that we can do line clipping on it
					// in bulk
					rowChunk[rowChunk.length] = row;
				}
				
				// save the currentIndex for the next round
				this._currentIndex = currentIndex;
				
				// add the document fragment in one shot
				container.appendChild(fragment);
			}else{ // IE
				// we have to jump through a bunch of hoops to
				// simulate importNode
				var fragment = iframe.createElement("div");
				var html = new String();
				for(var loopCounter = 0; loopCounter < chunkAmount 
											&& currentIndex < trNodes.length; 
												loopCounter++, currentIndex++){
					html += trNodes[currentIndex].xml;
				}
				
				// save the currentIndex for the next round
				this._currentIndex = currentIndex;
				
				// IE won't parse table rows unless they are inside of a 
				// table and a tbody
				fragment.innerHTML = 
						"<table><tbody>" 
						+ html 
						+ "</tbody></table>";
				var tbody = fragment.getElementsByTagName("tbody")[0];
				var rows = tbody.getElementsByTagName("tr");
				for(var i = 0; i < rows.length; i++){
					// clone the DOM node before inserting it
					// or we only get every other row
					var row = rows[i].cloneNode(true);
					
					// see if this row passes an possible content filter
					if(applyFilter == true
							&& row.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":passes-content-filter") != "yes"){
						continue;			
					}
					
					// indicate that at least one node passed
					this._haveOneFilteredNode = true;		
					
					container.appendChild(row);
					
					// save this row for later, since we will
					// do line clipping on this chunk of rows
					rowChunk[rowChunk.length] = row;	
				}
			}
			
			// keep trying to jump to our context node
			this._renderDoc.focusContextNode();
			
			// do line clipping on this chunk
			this._lineClipper.applyChunk(this._doc, container, rowChunk);
		}
	},
	
	/**
		For short documents, or for nodes that are near the bottom,
		if we jump to them there is not enough room at the bottom
		of the document to show them; 'pad' the bottom of the document
		area with a height that is equal to the size of the document area.
	 */
	_padBottomOfDocument: function(){
		var iframe = this._iframe;
		
		// get the visible height of the hyperscope document area
		var visibleDocHeight = dojo.style.getOuterHeight(iframe.body);
		
		// create a div with this height at the bottom of the doc
		// (setting the iframe's body tag with a new height does not work
		// on Internet Explorer)
		var paddingDiv = iframe.createElement("div");
		paddingDiv.style.height = visibleDocHeight + "px";
		iframe.body.appendChild(paddingDiv);
	},
	
	_initializeIframe: function(){
		// right now our iframe has no document body;
		// give it one, also clearing out any old
		// document in there.
		// just doing a document.open() then a 
		// document.close() will do this for us
		this._iframe.open();
		this._iframe.close();
		
		// add in our stylesheet
		var head = this._iframe.getElementsByTagName("head")[0];
		var link = this._iframe.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", "/hyperscope/src/client/style/global.css");
		head.appendChild(link);		
	}
});


/**
  Represents a Mark on the screen, after a mouse click;
  helps to encapsulate figuring out what has been marked.
 */

/**
  Constructor.
  param evt : DOMEvent - A mouse click event on the
  rendered document. We will use this to figure out
  what has been marked.
 */
hs.ui.Mark = function(evt){
	this._processEvent(evt);
}

dojo.lang.extend(hs.ui.Mark, {
	/** The DOM Row that was marked. */
	row: null,
	
	/** The relative address that was marked. */
	address: null,
	
	/** Whether this was an invalid mark. */
	invalidMark: false,
	
	_processEvent: function(evt){
		var tg = evt.target;
		
		// keep looping till we get a node row
		while(tg != null && dojo.html.hasClass(tg, "node-row") == false){
			tg = tg.parentNode;
		}
		
		if(tg == null || typeof tg == "undefined"){
			this.invalidMark = true;
			return;
		}
		
		this.row = tg;
		
		var number = this.row.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
											+ ":number");
		var url = "#" + number;
		try{
			this.address = new hs.address.Address(url);
		}catch(exp){
			debug("Invalid value during marking: " + exp);
			this.invalidMark = true;
		}
	}
});


/**
	A class that performs line clipping on a 
	rendered document.
	
	Note: This class was found to be a major bottleneck, and is
	therefore optimized and more complicated; be careful adding code
	to this without profiling, especially on Internet Explorer where it
	was found to be exceptionally slow before optimization.
 */

hs.ui.LineClipper = function(iframeDoc){
	this._iframeDoc = iframeDoc;
	
	// compute our standard line height to short circuit
	// having to do it for every node row; we only do it
	// for rows that have custom HTML inside of them
	this._standardLineHeight = this._computeLineHeight(iframeDoc);
}

dojo.lang.extend(hs.ui.LineClipper, {
	_iframeDoc: null,
	_standardLineHeight: null,
	
	/**
		Regular Expression to make sure we only get nodes 
		that are containers when checking for nested HTML
		when determining line height; i.e. they have a valid innerHTML
		otherwise, we might end up getting an IMG tag,
		for example, and trying to do an innerHTML on that,
		which will stop Internet Explorer cold with an error.
	*/
	_containerRegExp: new RegExp(
						"^h[1-6]|div|span|ul|ol|li|textarea"
						+ "|form|p|pre|blockquote|address|td$",
						"i"),
	
	/**
		@param doc : hs.model.Document - Document to transform.
		@param container : DOM Object - The DOM object for our container that
		has our rendered node rows. 
		@param rowChunk : Array of TR Rows - Our rows to line clip.
	*/
	applyChunk: function(doc, container, rowChunk){
		/**
		 	Optimization Note:
			 		
			This method and class was found to be the bottleneck for 
			performance, so it had to be optimized and therefore is more
			complicated. 
		*/
		
		// get the amount of line clipping to apply
		var lineClipping = doc.currentViewspecs.getLineClipping();
		
		// short circuit if we don't need line clipping
		if(lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			return;
		}
		
		// go through each line for line clipping
		var totalLength = rowChunk.length;
		var containerRegExp = this._containerRegExp;
		var standardLineHeight = this._standardLineHeight;
		var iframeDoc = this._iframeDoc;
		// declare nested variables out of loop; faster
		var row, dataCell, dataContainer, firstElement;
		var hasCustomHTML, dataHeight, heightOfOneLine;
		var newHeight, heightClassName, heightEntry;
		var img, currentViews, containerElem;
		for(var i = 0; i < totalLength; i++){
			row = rowChunk[i];
			dataCell = row.childNodes[1]; // second TD tag
			dataContainer = dataCell.firstChild; // first DIV child
			firstElement = dataCell;
			
			// some cells have a spurious <span> element
			// that we put there to deal with Mozilla's 
			// XSLT disable-output-escaping issues
			// (see render.xsl for details); bypass this
			// element when detecting to see if this node
			// has custom HTML
			if(dataContainer.childNodes != null
				&& dataContainer.childNodes[1].nodeName.toLowerCase() == "span"){
				firstElement = dataContainer.childNodes[1];
			}
			
			// see if we have any custom HTML
			hasCustomHTML = false;
			if(firstElement.innerHTML.indexOf("<") != -1){
				hasCustomHTML = true;
			}
			
			// get our total height
			dataHeight = dataCell.scrollHeight;
			
			// if we don't have any HTML, short circuit
			// determining the height and use a predetermined
			// height that we precomputed as the 'standard'
			if(hasCustomHTML == true){	
				// see if our first element of our content is
				// a container, which can influence the height,
				// such as H1
				containerElem = firstElement.firstChild;
				
				if(containerElem != null
					&& containerElem.nodeType == dojo.dom.ELEMENT_NODE
					&& containerRegExp.test(containerElem.nodeName) == true){
					firstElement = containerElem;
				}
				heightOfOneLine = this._computeLineHeight(iframeDoc, 
															firstElement);
			}else{
				heightOfOneLine = standardLineHeight;
			}
			
			// get our new height
			newHeight = heightOfOneLine * lineClipping;
			
			// make sure we don't have less lines than our 
			// line clipping
			if(newHeight > dataHeight){ 
				newHeight = dataHeight;
			}
			
			// set our height
			// FIXME: TODO: this line is the performance bottleneck,
			// but not sure how to work around it; I tried an alternative
			// using classNames (see SVN rev 338), but it made things slower
			// on Firefox and didn't have enough oomp.
			dataContainer.style.height = newHeight + "px";
			
			// see if we have an image as our first element;
			// Firefox doesn't cut the table row down if the
			// first element is an image		
			if(dojo.render.html.mozilla
					&& hasCustomHTML 
					&& firstElement.firstChild 
					&& firstElement.firstChild.nodeName.toLowerCase() == "img"){
				img = firstElement.firstChild;
				// trick that causes vertical height
				// to collapse, since rest of content
				// 'flows' around image now, stealing
				// its extra vertical space
				img.style.cssFloat = "left";
				
				// 'move' the image over a bit in case purple numbers are on;
				// otherwise it will float to the far left below the purple
				// number
				currentViews = hs.ui.currentHyDoc.currentViewspecs;
				if(currentViews.showNodeAddressing() == true
					&& currentViews.getNodeAddressingPlacement() 
							== hs.filter.ViewspecConstants.LEFT){
					img.style.paddingLeft = "2em";
				}
			}
		}
	},
	
	_computeLineHeight: function(iframeDoc, node){
		var heightTester;
		if(node != null && typeof node != "undefined"){
			heightTester = node.cloneNode(false);
		}else{
			heightTester = iframeDoc.createElement("div");
		}
		
		// get rid of anything that messes
		// with the CSS box model
		heightTester.style.margin = "0px";
		heightTester.style.padding = "0px";
		heightTester.style.border = "0px";
		heightTester.style.visibility = "hidden";
		
		// put our test text into the node
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		heightTester.innerHTML = alphabet;
	
		// add it to the document
		iframeDoc.body.appendChild(heightTester);
		
		// get the height of this line
		var heightOfOneLine = heightTester.scrollHeight;
	
		// remove ourselves
		dojo.dom.removeNode(heightTester);
		
		return heightOfOneLine;
	}
});


/**
	A class that implements the behavior for our
	Augment-style command bar.
	
	REFACTOR: The logic in this class is getting
	complicated and hard to follow; refactor for
	simplicity.
 */
hs.ui.CommandBar = function(){
	this._outputArea = dojo.byId("commandBar");
	
	this._loadCommandXML();
}

hs.ui.CommandBar._COMMAND_FILE = "/hyperscope/src/client/lib/hs/commands.xml";

dojo.lang.extend(hs.ui.CommandBar, {
	visible: false,

	// our possible states, from less to more specific
	_states: {
			ROOT: "ROOT",		// we just started and don't have a state yet
			VERB: "VERB",		// we have discovered our verb
			NOUN: "NOUN",		// we have a noun
			INPUT: "INPUT",		// we have an input type
			METHOD: "METHOD",	// we have a method to execute
			UNKNOWN: "UNKNOWN",	// unknown value entered
			DONE: "DONE"		// we are done
	},
	
	_outputArea: null,
	_commands: null,
	_inputBuffer: new Array(),
	_currentState: null,
	_languageElement: null,
	_allowInput: false,
	_inputType: null,
	_mark: null,
	_ready: false,
	
	_address: null,
	_viewspecs: null,
	_typein: null,
	
	_inputText: new String(),
	
	_persistedValue: null,
	_firstPersist: true,
	
	_lastCommandBuffer: null,
	
	reset: function(){
		if(this._ready == false){
			return;
		}
		
		// clear any marks
		hs.ui.markingMode = false;
		for(var i = 0; i < this._inputBuffer.length; i++){
			var commandEvt = this._inputBuffer[i];
			if(commandEvt.mark != null){
				this._setMarkable(false, commandEvt.mark);
			}
		}
		
		// reset state
		this._inputBuffer = new Array();
		this._languageElement = null;
		this._allowInput = false;
		this._inputType = null;
		this._mark = null;
		this._address = null;
		this._viewspecs = null;
		this._typein = null;
		this._inputText = null;
		
		this._sendBufferToOutput();
	},
	
	isShowing: function(){
		return this.visible;
	},
	
	show: function(){
		this.reset();
		
		var commandBar = dojo.byId("commandBar");
		commandBar.style.visibility = "visible";
		
		this.visible = true;
	},
	
	hide: function(){
		var commandBar = dojo.byId("commandBar");
		commandBar.style.visibility = "hidden";
	
		this.visible = false;
	},
	
	_loadCommandXML: function(){
		// load the command XML file,
		// which contains a machine processable set
		// of available commands and their output and input
		// parameters
		var bindArgs = {
			url:		hs.ui.CommandBar._COMMAND_FILE,
			sync:		djConfig.testing,
			mimetype:	"text/xml",
			error:		dojo.lang.hitch(this, this._error),
			load:		dojo.lang.hitch(this, this._loaded)
		};
		
		// dispatch the request
		dojo.io.bind(bindArgs);
	},
	
	_error: function(type, errObj){
		// dojo returns too much programmy information in
		// the error message; remove that part
		var message = errObj.message;
		if(message.indexOf("XMLHttpTransport Error:") != -1){
			message = message.replace(/XMLHttpTransport Error:/, "");
		}
		
		hs.ui.reportError("Unable to initialize command bar: " + message);
	},
	
	_loaded: function(type, data, evt){
		// get the base subsystem commands tree;
		// only base subsystem is supported right now
		var nodes = data.selectNodes("/commands/subsystem[@id = 'base-subsystem']");
		this._commands = nodes.item(0);
		
		// initialize our event listeners
		dojo.event.connect(window, "onkeypress", this, this._onKey); // Firefox
		dojo.event.connect(document, "onkeypress", this, this._onKey); // IE
		
		// on Internet Explorer, backspace key causes the browser 
		// to move back in it's history list; catch just this key
		// using a different event listener
		if(dojo.render.html.ie){
			dojo.event.connect(document, "onkeydown", this, this._handleBackspace);
		}
		
		// subscribe to mark events
		dojo.event.topic.subscribe("/mark", this, "_onMark");
		
		this._ready = true;
		
		// print out that our base subsystem is now ready for input
		this.reset();
	},
	
	_onRenderedDocument: function(iframeDoc){
		// initialize our event listeners
		dojo.event.disconnect(iframeDoc, "onkeypress", this, this._onKey);
		dojo.event.connect(iframeDoc, "onkeypress", this, this._onKey);
		
		// on Internet Explorer, backspace key causes the browser 
		// to move back in it's history list; catch just this key
		// using a different event listener
		if(dojo.render.html.ie){
			dojo.event.disconnect(iframeDoc, "onkeydown", this, this._handleBackspace);
			dojo.event.connect(iframeDoc, "onkeydown", this, this._handleBackspace);
		}
	},
	
	_setOutput: function(msg){
		// clear the output
		var deleteMe = this._outputArea.childNodes;
		for(var i = 0; i < deleteMe.length; i++){
			dojo.dom.removeNode(deleteMe[i]);
		}
		
		// don't use innerHTML in case our data has reserved characters
		// or spacing we want to preserve when setting
		var text = document.createTextNode(msg);
		this._outputArea.appendChild(text);
	},
	
	_sendBufferToOutput: function(){
		try{
			var results = new String();
			
			// work with a copy of our input
			var inputArray = new Array();
			for(var i = 0; i < this._inputBuffer.length; i++){
				inputArray[inputArray.length] = this._inputBuffer[i];
			}
			
			// write out what subsystem we are in
			results += this._commands.getAttribute("output") + " ";
			
			// if we don't have any input indicate that
			// you can enter a command
			if(inputArray.length == 0){
				results += "C: ";
			}
			
			// consume each piece of the input buffer, using it to
			// move inside of our commands.xml DOM as a kind of state
			// machine
		
			// our initial state
			this._currentState = this._states.ROOT;
			
			// now consume the input
			this._languageElement = null;
			this._allowMarking = false;
			this._inputText = new String();
			this._inputType = null;
			this._mark = null;
			this._address = null;
			this._typein = null;
			this._viewspecs = null;
			while(inputArray.length != 0){
				// see if we are done
				if(this._currentState == this._states.DONE){
					break;
				}
				
				// see if we hit an unknown symbol
				if(this._currentState == this._states.UNKNOWN){
					break;
				}
			
				// see if we need to consume a verb or noun language
				// element
				if(this._currentState == this._states.ROOT){			
					// get first verb
					results = this._handleLanguageElement(
												inputArray, 
												results,
												this._commands.childNodes,
												this._states.VERB);
				}else if(this._currentState == this._states.VERB
							|| this._currentState == this._states.NOUN){
					// get noun next
					results = this._handleLanguageElement(
												inputArray, 
												results,
												this._languageElement.childNodes,
												this._states.NOUN);
												
					// see if we are ready for input
					if(typeof this._languageElement != "undefined"
						&& this._languageElement != null
						&& this._needsInput(this._languageElement) == true){
						results = this._selectInput(inputArray, results,
													this._languageElement);
					}
				}else if(this._currentState == this._states.INPUT){
					results = this._consumeInput(inputArray, results);
				}
				
				if(this._currentState == this._states.METHOD){
					// we're ready to execute our method
					this._setOutput(results);
					this._executeMethod();
					return;
				}
			}
			
			this._setOutput(results);
		}catch(exp){
			this._handleError(exp);
		}
	},
	
	_handleLanguageElement: function(inputArray, results, 
										languageElements, nextState){		
		var lettersInState = new String();
		var matchFound = false;
		var partialMatch = false;
		
		// keep looping until we have consumed the input we need
		// for this particular kind of language element
		while(matchFound == false && inputArray.length != 0){
			// clear out a partial match from the last
			// letter, if there was one
			partialMatch = false;
			
			// get our next command event
			var commandEvt = inputArray.shift();
			
			// get the letter that was entered
			// TODO: Fit mouse marking here
			var currentLetter = commandEvt.value;
			currentLetter = currentLetter.toLowerCase();
			
			// add this to the list of letters we have
			// encountered so far while in this state; needed
			// for matching multi-letter activators
			// such as " re" for reset.
			lettersInState += currentLetter;
			
			// find the language element that matches this 
			// sequence of letters
			for(var i = 0; i < languageElements.length; i++){
				var elem = languageElements[i];
				if(elem.nodeType != dojo.dom.ELEMENT_NODE){
					continue;
				}
				
				// get the activator for this language element
				var activator = elem.getAttribute("activate");
				// is this our activator?
				if(lettersInState == activator){
					this._languageElement = elem;
					matchFound = true;
					break;
				}else if(dojo.string.startsWith(activator, lettersInState, true)){
					partialMatch = true;
					break;
				} 
			} // end for statement
			
			// clear symbol from buffer and stop if no match
			if(partialMatch == false && matchFound == false){
				// if we never had _any_ language elements, 
				// such as a verb, indicate that a command 
				// is possible again
				if(this._languageElement == null){
					results += "C: ";
				}
				
				results += "?";
				this._inputBuffer = this._inputBuffer.slice(0, 
										this._inputBuffer.length - 1);
				this._currentState = this._states.UNKNOWN;
				return results;
			}
		} // end while statement
		
		// see if the last letter was just a 
		// partial match
		if(partialMatch == true && matchFound == false){
			lettersInState = lettersInState.toUpperCase();
			results += lettersInState;
			return results;
		}
		
		// we have a match
		
		// write out this language's output and 
		// move to the next state
		var languageOutput = this._languageElement.getAttribute("output");
		results += languageOutput;
		this._currentState = nextState;
		
		// see if there is a further noun past us
		// and we are at the end of our input
		if(this._nestedNoun(this._languageElement) == true
			&& inputArray.length == 0){
			results += "C: ";	
		}
		
		return results;
	},
	
	_needsInput: function(languageElement){
		if(languageElement == null
			|| typeof languageElement == "undefined"
			|| languageElement.childNodes == null
			|| typeof languageElement.childNodes == "undefined" 
			|| languageElement.childNodes.length == 0){
			return false;
		}
		
		var firstChild = languageElement.firstChild;
		while(firstChild != null
				&& firstChild.nodeType != dojo.dom.ELEMENT_NODE){
			firstChild = firstChild.nextSibling;			
		}
		
		if(firstChild == null){
			return false;
		}
		
		if(firstChild.nodeName == "input"){
			return true;
		}else{
			return false;
		}
	},
	
	_selectInput: function(inputArray, results, languageElement, 
							inputElemProvided){
		// callers can optionally already pass the input element into this
		// method; needed when creating synthetic inputs, such as forcing an 
		// OK after a MARK if it is the last input method
		if(typeof inputElemProvided == "undefined"){
			inputElemProvided = false;
		}
		
		// get the input element
		var inputElem;
		if(inputElemProvided == false){
			inputElem = languageElement.firstChild;
			while(inputElem != null
					&& inputElem.nodeType != dojo.dom.ELEMENT_NODE
					&& inputElem.nodeName != "input"){
				inputElem = inputElem.nextSibling;			
			}
		}else{ // we provide the input element already
			inputElem = languageElement;
		}
		
		var inputType = inputElem.getAttribute("type");
		this._currentState = this._states.INPUT;
		this._inputText = new String();
		if(inputType == "location"){
			results += "M/A: ";
			hs.ui.markingMode = true;
			
			// clear any selected lines
			hs.ui.currentRenderedDoc.clearSelection();
		}else if(inputType == "viewspecs"){
			results += "V: ";
			hs.ui.markingMode = false;
		}else if(inputType == "content"){
			results += "M/T/[A]: ";
			hs.ui.markingMode = true;
		}else if(inputType == "ok"){
			results += "OK: ";
			hs.ui.markingMode = false;
		}else if(inputType == "typein"){
			results += "T: ";
			hs.ui.markingMode = false;
		}else if(inputType == "persisted typein"){
			if(this._persistedValue != null
				&& this._firstPersist == false){
				results += '"' + this._persistedValue + '" RC/T: ';
			}else{
				results += "T: ";
			}
			hs.ui.markingMode = false;
		}else if(inputType == "address"){
			results += "A: ";
			hs.ui.markingMode = false;
		}
		
		this._languageElement = inputElem;
		this._inputType = inputType;
		
		return results;
	},
	
	_consumeInput: function(inputArray, results){
		if(this._currentState == this._states.DONE){
			return;
		}
		
		// get next piece of input to consume
		var commandEvt = inputArray.shift();
		
		var doneWithInput = false;
		var justDidMark = false;
		
		// is it a mark?
		if(commandEvt.mark != null){
			results +=" ! ";
			
			// save this
			this._mark = commandEvt.mark;
			
			// interpret any input values entered
			this._interpretInput();
			
			// we are done with this input type
			doneWithInput = true;
			
			// indicate that we just did a mark;
			// if there are no more import types then
			// we need to force an OK
			justDidMark = true;
		}else if(this._persistedValue != null
				&& commandEvt.isEnter == true
				&& this._inputType == "persisted typein"
				&& this._inputText.length == 0){
			// we have a persisted value, we are the
			// end key, we support persisted values,
			// and the user hasn't entered anything
			// for this typein
			this._inputText = this._persistedValue;
			
			// we are done with this input type
			results += " ! ";
			
			// interpret any input values entered
			this._interpretInput();
			
			// move to next stage
			doneWithInput = true;	
		}else if(commandEvt.isEnter == true){
			// we are done with this input type
			results += " ! ";
			
			// interpret any input values entered
			this._interpretInput();
			
			// move to next stage
			doneWithInput = true;
		}else if(this._persistedValue != null
				&& commandEvt.isRepeatKey == true
				&& this._inputType == "persisted typein"){
			// we have a persisted value, the repeat key
			// was pressed, and we support the repeat key
			this._inputText = this._persistedValue;
			
			// we are done with this input type
			results += " ! ";
			
			// interpret any input values entered
			this._interpretInput();
			
			// move to next stage
			doneWithInput = true;
		}else{
			var currentLetter = commandEvt.value;
			results += currentLetter;
			
			// save this text so we can use it when 
			// the user presses OK
			this._inputText += currentLetter;
		}
		
		
		// are we done with this input type?
		if(doneWithInput == true 
				&& this._currentState != this._states.DONE){
			// Move on to the next input type 
			// or handle a final method element. If we just did
			// a mark, force a final OK if this is the last input
			// element for this command type
			if(justDidMark == true
					&& this._needsInput(this._languageElement) == false
					&& this._atMethod(this._languageElement) == true){
				// force us into the OK input state
				var okInput = this._languageElement.cloneNode(true);
				okInput.setAttribute("type", "ok");
				this._languageElement = okInput;
				this._currentState = this._states.INPUT;
				results = this._selectInput(inputArray, results,
											this._languageElement, 
											true);	
			}
			else if(this._needsInput(this._languageElement) == true){
				results = this._selectInput(inputArray, results,
											this._languageElement);
			}else if(this._atMethod(this._languageElement) == true){
				this._languageElement = this._getMethod(this._languageElement);
				this._currentState = this._states.METHOD;
			}
		}
		
		return results;
	},
	
	_getMethod: function(languageElement){
		// get the method element
		var methodElem = languageElement.firstChild;
		while(methodElem != null
				&& methodElem.nodeType != dojo.dom.ELEMENT_NODE
				&& methodElem.nodeName != "method"){
			methodElem = methodElem.nextSibling;			
		}
		
		return methodElem;
	},
	
	_atMethod: function(languageElement){
		if(languageElement == null
			|| typeof languageElement == "undefined"
			|| languageElement.childNodes == null
			|| typeof languageElement.childNodes == "undefined" 
			|| languageElement.childNodes.length == 0){
			return false;
		}
		
		var firstChild = languageElement.firstChild;
		while(firstChild != null
				&& firstChild.nodeType != dojo.dom.ELEMENT_NODE){
			firstChild = firstChild.nextSibling;			
		}
		
		if(firstChild == null){
			return false;
		}
		
		if(firstChild.nodeName == "method"){
			return true;
		}else{
			return false;
		}
	},
	
	_executeMethod: function(){
		try{
			this._currentState = this._states.DONE;
			var exec = this._languageElement.getAttribute("eval");
			
			// if we have persisted data, indicate that we can now
			// display it since we are past our first use of it
			if(this._persistedValue != null){
				this._firstPersist = false;
			}
					
			// save this input buffer for the repeat key
			this._lastCommandBuffer = this._inputBuffer;
			// shave off the last command on here, so that users can edit
			// it after doing a repeat key
			this._lastCommandBuffer.pop();
			
			hs.ui.printStatus("Resolving...");
			
			// setup variables that commands.xml might refer to in their
			// eval string; these must be global or Dojo's compressor
			// will obfuscate their variable names, and our evalled() script
			// won't be able to access them
			window.readyHandler = hs.ui.addressResolved;
			window.address = this._address;
			window.relativeTo = hs.ui.currentHyDoc;
			window.typein = this._typein;
			window.viewspecs = this._viewspecs;
			
			// now execute this method
			eval(exec);
		}catch(exp){
			this._handleError(exp);
		}
	},
	
	_handleError: function(exp){
		this.reset();
		hs.ui.reportError(exp);
	},
	
	_interpretInput: function(inputArray){
		if(this._inputType == "viewspecs"){ // this is a viewspec
			this._viewspecs = this._inputText;
		}else if(this._inputType == "location"
					&& this._mark != null){ // marked address
			this._address = this._mark.address;
		}else if(this._inputType == "location"
					&& this.mark == null){ // typed in address
			var addr = this._toAddress(this._inputText);
			this._address = addr;				
		}else if(this._inputType == "content"
					&& this.mark == null){ // typed in address, without option key
			var addr = new hs.address.Address(this._inputText);
			this._address = addr;			
		}else if(this._inputType == "typein"){ // arbitrary content
			this._typein = this._inputText;
		}else if(this._inputType == "persisted typein"){ 
			// typein is persisted for future types that support this,
			// to help with a quick repeat key, such as for Jump to Word
			this._persistedValue = this._inputText;
			this._typein = this._inputText;
		}else if(this._inputType == "address"){ // typed in address
			var addr = this._toAddress(this._inputText);
			this._address = addr;
		}
	},
	
	_nestedNoun: function(languageElement){
		if(languageElement == null
			|| typeof languageElement == "undefined"
			|| languageElement.childNodes == null
			|| typeof languageElement.childNodes == "undefined" 
			|| languageElement.childNodes.length == 0){
			return false;
		}
		
		var firstChild = languageElement.firstChild;
		while(firstChild != null
				&& firstChild.nodeType != dojo.dom.ELEMENT_NODE){
			firstChild = firstChild.nextSibling;			
		}
		
		if(firstChild == null){
			return false;
		}
		
		if(firstChild.nodeName == "noun"){
			return true;
		}else{
			return false;
		}
	},
	
	_toAddress: function(url){
		// REFACTOR: This logic is also used by the JumpOverlay;
		// consolidate it
		
		/**
			Four input modes are allowed:
				* Input is preceded with a hash
				* Input has a scheme://
				* Input has ../ or ./ at the beginning -
				interpreted as a relative file address
				* Input has neither of these, and
				is interpreted as having a #
		*/
		if(dojo.string.startsWith(url, "#") == false
			&& dojo.string.startsWith(url, "./") == false
			&& dojo.string.startsWith(url, "../") == false
			&& /^[^:]*:\//.test(url) == false){
			url = "#" + url;		
		}
		
		var addr = new hs.address.Address(url);
		
		return addr;
	},
	
	_onKey: function(evt){
		if(this.isShowing() == false){
			return;
		}
	
		var commandEvt = new Object();
		commandEvt.mark = null;
		commandEvt.isRepeatKey = false;

		if(evt.keyCode == 13){ // ENTER key
			commandEvt.isEnter = true;	
			commandEvt.value = null;
			this._inputBuffer[this._inputBuffer.length] = commandEvt;
		}else if(evt.keyCode == 27){ // ESCAPE key
			this.reset();
			return;
		}else if(evt.keyCode == 8){ // backspace key
			var lastCommandEvt = this._inputBuffer[this._inputBuffer.length - 1];
			// clear a mark if we "backspace" over it
			if(lastCommandEvt != null
				&& typeof lastCommandEvt != "undefined"
				&& lastCommandEvt.mark != null){
				this._setMarkable(false, lastCommandEvt.mark);
			}
			if(this._inputBuffer.length != 0){
				this._inputBuffer = this._inputBuffer.slice(0,
												this._inputBuffer.length - 1);
			}
		}else if(evt.ctrlKey == true 
					&& (String.fromCharCode(evt.charCode) == "u"
						|| evt.charCode == 21)){
			// ctrl-U, which is the OPTION key
			// the 21 is for IE
			// TODO: Implement OPTION key
			//alert("ctrl u pressed");				
		}else if(evt.ctrlKey == true 
					&& (String.fromCharCode(evt.charCode) == "b"
						|| evt.charCode == 2)){
			// ctrl-B, which is the REPEAT key
			// the 2 is for IE
			// only letter entered?
			if(this._inputBuffer.length != 0){
				commandEvt.isRepeatKey = true;
				commandEvt.value = "";
				this._inputBuffer[this._inputBuffer.length] = commandEvt;
			}else if(this._lastCommandBuffer != null){ // repeat the last command
				this._inputBuffer = this._lastCommandBuffer;
			}
		}else if(evt.ctrlKey || evt.altKey){
			// let other control and alt combos through
			return;
		}else{ // other letters and numbers
			commandEvt.isEnter = false;
			commandEvt.value = String.fromCharCode(evt.charCode);
			this._inputBuffer[this._inputBuffer.length] = commandEvt;
		}
		
		evt.stopPropagation();
		evt.preventDefault(true);
		
		this._sendBufferToOutput();
	},
	
	_handleBackspace: function(evt){
		if(evt.keyCode == 8){ // backspace key
			this._onKey(evt);
		}
	},
	
		
	_setMarkable: function(markable, mark){
		if(hs.ui.markingMode == true){
			if(mark != null){	
				dojo.html.addClass(mark.row, "marked");
			}
		}else{
			if(mark != null){
				dojo.html.removeClass(mark.row, "marked");
			}
		}
	},
	
	_onMark: function(mark){
		if(this.isShowing() == false){
			return;
		}
		
		// give the focus back to the command bar or
		// else letters won't be intercepted on Firefox after
		// we have rendered a document more than once
		var commandBar = dojo.byId("commandBar");
		document.body.focus();
		
		// don't do marking if we don't
		// allow it yet
		if(hs.ui.markingMode == false){
			return;
		}
		
		// clear out any mark that may have been there before
		var oldMark = null;
		for(var i = 0; i < this._inputBuffer.length; i++){
			var commandEvt = this._inputBuffer[i];
			if(commandEvt.mark != null 
				&& typeof commandEvt.mark != "undefined"){
				oldMark = commandEvt.mark;
			}	
		}
		
		this._setMarkable(false, oldMark); 
		
		// store this as part of our input
		var commandEvt = new Object();
		commandEvt.mark = mark;
		commandEvt.isEnter = false;
		commandEvt.value = null;
		this._inputBuffer[this._inputBuffer.length] = commandEvt;
		
		// highlight our marked row
		this._setMarkable(true, mark);
		
		// reparse our input buffer
		this._sendBufferToOutput();
	}
});


/**
  Our help overlay window that appears when the user presses the Help button.
  
  TODO: REFACTOR: Make a single base-widget class for this and our other
  overlays.
 */
dojo.widget.defineWidget("hs.ui.HelpOverlay", dojo.widget.HtmlWidget, {
	widgetType: "HelpOverlay",
  	isContainer: true,
	templatePath: dojo.uri.dojoUri("src/hs/templates/HelpOverlay.html"),
  	templateCssPath: dojo.uri.dojoUri("src/hs/templates/HelpOverlay.css"),

	postCreate: function(){
		this.width = dojo.style.getOuterWidth(this.domNode);
		this.height = dojo.style.getOuterHeight(this.domNode);
	},
	
	isShowing: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		if(dojo.html.hasClass(floatingPane.domNode, "initial-overlay-state")){
			return false;
		}else{
			return floatingPane.isShowing();
		}
	},
	
	show: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// bring to the top, in case other overlays are visible
		floatingPane.bringToTop();
		
		// override the floating pane's default close window behavior
		floatingPane.closeWindow = this._closeWindow;
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		dojo.html.removeClass(floatingPane.domNode, "initial-overlay-state");
		
		// determine the width of our jump overlay
		
		// start at the Help button
		var helpButton = dojo.byId("toolbarHelpButton");
		var helpButtonWidth = dojo.html.getOuterWidth(helpButton);
		var pageWidth = dojo.html.getViewportWidth();
		var startY = dojo.style.getAbsoluteY(helpButton, false) + helpButtonWidth/2;
		
		// end right below the toolbar
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var endY = toolbarHeight + 30;
		
		// make the node visible, but turn off it's opacity
		if(dojo.render.html.ie != true){
			dojo.style.setOpacity(floatingPane.domNode, 0);
		}
		dojo.style.show(floatingPane.domNode);
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 0, end: 1 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "left", start: 20, end: 20 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
		
		anim.play();
	},
	
	hide: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// start below the toolbar and to the left of the page
		var pageWidth = dojo.html.getViewportWidth();
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var startY = toolbarHeight + 30;
		
		// end at the help button
		var helpButton = dojo.byId("toolbarHelpButton");
		var helpButtonWidth = dojo.html.getOuterWidth(helpButton);
		var endY = dojo.style.getAbsoluteY(helpButton, false) + helpButtonWidth/2;
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 1, end: 0 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 20, end: 20 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
			
		dojo.event.connect(anim, "onEnd", function(){	
			dojo.style.hide(floatingPane.domNode);
		});
		
		anim.play();
	},
	
	_closeWindow: function(evt){
		this.hide();
	}
});


// wait for the HyperScope core to finish loading and doing its thing
// before initializing the UI; don't do this if
// we are in a testing environment like JSUnit since we have no UI
if(djConfig.testing == false){
	hs.model.addOnLoad(hs.ui.initialize);
}


