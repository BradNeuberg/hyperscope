/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.collections.Set");
dojo.require("dojo.collections.Collections");
dojo.require("dojo.collections.ArrayList");

//	straight up sets are based on arrays or array-based collections.
dojo.collections.Set = new function(){
	this.union = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var result = new dojo.collections.ArrayList(setA.toArray());
		var e = setB.getIterator();
		while (!e.atEnd){
			if (!result.contains(e.current)) result.add(e.current);
		}
		return result;
	};
	this.intersection = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var result = new dojo.collections.ArrayList();
		var e = setB.getIterator();
		while (!e.atEnd){
			if (setA.contains(e.current)) result.add(e.current);
			e.moveNext();
		}
		return result;
	};
	//	returns everything in setA that is not in setB.
	this.difference = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var result = new dojo.collections.ArrayList();
		var e = setA.getIterator();
		while (!e.atEnd){
			if (!setB.contains(e.current)) result.add(e.current);
			e.moveNext();
		}
		return result;
	};
	this.isSubSet = function(setA, setB) {
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var e = setA.getIterator();
		while (!e.atEnd){
			if (!setB.contains(e.current)) return false;
			e.moveNext();
		}
		return true;
	};
	this.isSuperSet = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var e = setB.getIterator();
		while (!e.atEnd){
			if (!setA.contains(e.current)) return false;
			e.moveNext();
		}
		return true;
	};
}();
