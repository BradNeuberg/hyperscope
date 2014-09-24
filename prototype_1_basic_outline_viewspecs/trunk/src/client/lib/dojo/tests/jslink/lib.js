/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */function foo(){
	print("foo");
}

// NOTE: the following implementation of the class that builds bar works.
function tbar(){
	// empty class
}

tbar.prototype.baz = function(){
	print("bar.baz");
}

var bar = new tbar();

/*
// NOTE: ...on the other hand, this styntax gets entirely mangled
bar = new function(){ // singleton
	this.baz = function(){
		print("bar.baz");
	}
}
*/

/*
// NOTE: this confsues jslink.pl right now.
xyzzy = function(){
	print("this shouldn't be included!");
}
*/
