/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.collections.List");
dojo.require("dojo.collections.Collections");

dojo.collections.List = function(dictionary){
	dojo.deprecated("dojo.collections.List", "Use dojo.collections.Dictionary instead.");
	return new dojo.collections.Dictionary(dictionary);
}
