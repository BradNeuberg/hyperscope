/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.lang");
dojo.provide("dojo.lang.Lang");

dojo.lang.mixin = function(obj, props){
	var tobj = [];
	for(var x in props){
		if(typeof tobj[x] == "undefined" || tobj[x] != props[x]) {
			obj[x] = props[x];
		}
	}
	return obj;
}

dojo.lang.extend = function(ctor, props){
	this.mixin(ctor.prototype, props);
}

dojo.lang.extendPrototype = function(obj, props){
	this.extend(obj.constructor, props);
}

dojo.lang.anonCtr = 0;
dojo.lang.anon = {};
dojo.lang.nameAnonFunc = function(anonFuncPtr, namespaceObj){
	var nso = (namespaceObj || dojo.lang.anon);
	if((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"] == true)){
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

/**
 * Sets a timeout in milliseconds to execute a function in a given context
 * with optional arguments.
 *
 * setTimeout (Object context, function func, number delay[, arg1[, ...]]);
 * setTimeout (function func, number delay[, arg1[, ...]]);
 */
dojo.lang.setTimeout = function (func, delay) {
	var context = window, argsStart = 2;
	if (typeof delay == "function") {
		context = func;
		func = delay;
		delay = arguments[2];
		argsStart++;
	}
	
	var args = [];
	for (var i = argsStart; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	return setTimeout(function () { func.apply(context, args); }, delay);
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

dojo.lang.isObject = function(wh) {
	return typeof wh == "object" || dojo.lang.isArray(wh) || dojo.lang.isFunction(wh);
}

dojo.lang.isArray = function(wh) {
	return (wh instanceof Array || typeof wh == "array");
}

dojo.lang.isFunction = function(wh) {
	return (wh instanceof Function || typeof wh == "function");
}

dojo.lang.isString = function(wh) {
	return (wh instanceof String || typeof wh == "string");
}

dojo.lang.isAlien = function(wh) {
	return !dojo.lang.isFunction() && /\{\s*\[native code\]\s*\}/.test(String(wh));
}

dojo.lang.isBoolean = function(wh) {
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
dojo.lang.isNumber = function(wh) {
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
dojo.lang.isUndefined = function(wh) {
	return ((wh == undefined)&&(typeof wh == "undefined"));
}

// end Crockford functions

dojo.lang.whatAmI = function(wh) {
	try {
		if(dojo.lang.isArray(wh)) { return "array"; }
		if(dojo.lang.isFunction(wh)) { return "function"; }
		if(dojo.lang.isString(wh)) { return "string"; }
		if(dojo.lang.isNumber(wh)) { return "number"; }
		if(dojo.lang.isBoolean(wh)) { return "boolean"; }
		if(dojo.lang.isAlien(wh)) { return "alien"; }
		if(dojo.lang.isUndefined(wh)) { return "undefined"; }
		if(dojo.lang.isObject(wh)) { return "object"; }
	} catch(E) {}
	return "unknown";
}

dojo.lang.find = function(arr, val, identity){
	// support both (arr, val) and (val, arr)
	if(!dojo.lang.isArray(arr) && dojo.lang.isArray(val)) {
		var a = arr;
		arr = val;
		val = a;
	}
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(identity){
		for(var i=0;i<arr.length;++i){
			if(arr[i] === val){ return i; }
		}
	}else{
		for(var i=0;i<arr.length;++i){
			if(arr[i] == val){ return i; }
		}
	}
	return -1;
}

dojo.lang.indexOf = dojo.lang.find;

dojo.lang.findLast = function(arr, val, identity) {
	// support both (arr, val) and (val, arr)
	if(!dojo.lang.isArray(arr) && dojo.lang.isArray(val)) {
		var a = arr;
		arr = val;
		val = a;
	}
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(identity){
		for(var i = arr.length-1; i >= 0; i--) {
			if(arr[i] === val){ return i; }
		}
	}else{
		for(var i = arr.length-1; i >= 0; i--) {
			if(arr[i] == val){ return i; }
		}
	}
	return -1;
}

dojo.lang.lastIndexOf = dojo.lang.findLast;

dojo.lang.inArray = function(arr, val){
	return dojo.lang.find(arr, val) > -1;
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

// FIXME: Is this worthless since you can do: if(name in obj)
// is this the right place for this?
dojo.lang.has = function(obj, name){
	return (typeof obj[name] !== 'undefined');
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
	} else if(dojo.lang.isArray(obj) || dojo.lang.isString(obj)) {
		return obj.length == 0;
	}
}

dojo.lang.forEach = function(arr, unary_func, fix_length){
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	var il = arr.length;
	for(var i=0; i< ((fix_length) ? il : arr.length); i++){
		if(unary_func(arr[i], i, arr) == "break"){
			break;
		}
	}
}

dojo.lang.map = function(arr, obj, unary_func){
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(dojo.lang.isFunction(obj)&&(!unary_func)){
		unary_func = obj;
		obj = dj_global;
	} else if(dojo.lang.isFunction(obj) && unary_func) {
		// ff 1.5 compat
		var tmpObj = obj;
		obj = unary_func;
		unary_func = tmpObj;
	}

	if(Array.map) {
		var outArr = Array.map(arr, unary_func, obj);
	} else {
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

dojo.lang.shallowCopy = function(obj) {
	var ret = {}, key;
	for(key in obj) {
		if(dojo.lang.isUndefined(ret[key])) {
			ret[key] = obj[key];
		}
	}
	return ret;
}

dojo.lang.every = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.every) {
		return Array.every(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { throw new Error("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		for(var i = 0; i < arr.length; i++) {
			if(!callback.call(thisObject, arr[i], i, arr)) {
				return false;
			}
		}
		return true;
	}
}

dojo.lang.some = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.some) {
		return Array.some(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { throw new Error("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		for(var i = 0; i < arr.length; i++) {
			if(callback.call(thisObject, arr[i], i, arr)) {
				return true;
			}
		}
		return false;
	}
}

dojo.lang.filter = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.filter) {
		var outArr = Array.filter(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { throw new Error("thisObject doesn't exist!"); }
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
