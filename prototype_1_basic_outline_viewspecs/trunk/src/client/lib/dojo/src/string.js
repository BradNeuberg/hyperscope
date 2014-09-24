/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.string");
dojo.require("dojo.lang");

dojo.string.trim = function(str){
	if(!dojo.lang.isString(str)){ return str; }
	if(!str.length){ return str; }
	return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

// Parameterized string function
//  str - formatted string with %{values} to be replaces
//  pairs - object of name: "value" value pairs
//  killExtra - remove all remaining %{values} after pairs are inserted
dojo.string.paramString = function(str, pairs, killExtra) {
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
	var retval = "";
	var len = words.length;
	for (var i=0; i<len; i++) {
		var word = words[i];
		word = word.charAt(0).toUpperCase() + word.substring(1, word.length);
		retval += word;
		if (i < len-1)
			retval += " ";
	}
	
	return new String(retval);
}

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

// TODO: make an HTML version
dojo.string.summary = function(str, len) {
	if(!len || str.length <= len) {
		return str;
	} else {
		return str.substring(0, len).replace(/\.+$/, "") + "...";
	}
}

dojo.string.escape = function(type, str) {
	switch(type.toLowerCase()) {
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
}

dojo.string.escapeXml = function(str) {
	return str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
		.replace(/>/gm, "&gt;").replace(/"/gm, "&quot;").replace(/'/gm, "&#39;");
}

dojo.string.escapeSql = function(str) {
	return str.replace(/'/gm, "''");
}

dojo.string.escapeRegExp = function(str) {
	return str.replace(/\\/gm, "\\\\").replace(/([\f\b\n\t\r])/gm, "\\$1");
}

dojo.string.escapeJavaScript = function(str) {
	return str.replace(/(["'\f\b\n\t\r])/gm, "\\$1");
}

// do we even want to offer this? is it worth it?
dojo.string.addToPrototype = function() {
	for(var method in dojo.string) {
		if(dojo.lang.isFunction(dojo.string[method])) {
			var func = (function() {
				var meth = method;
				switch(meth) {
					case "addToPrototype":
						return null;
						break;
					case "escape":
						return function(type) {
							return dojo.string.escape(type, this);
						}
						break;
					default:
						return function() {
							var args = [this];
							for(var i = 0; i < arguments.length; i++) {
								args.push(arguments[i]);
							}
							dojo.debug(args);
							return dojo.string[meth].apply(dojo.string, args);
						}
				}
			})();
			if(func) { String.prototype[method] = func; }
		}
	}
}
