/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

dojo.require("dojo.lang.array");

function test_lang_find() {
	var foo = new Array(128, 256, 512);
	var bar = new Array("aaa", "bbb", "ccc");
	
	jum.assertTrue("500", dojo.lang.find(56, [45, 56, 85]) == 1);
	jum.assertTrue("501", dojo.lang.find([Number, String, Date], String) == 1);
	jum.assertTrue("502", dojo.lang.find(String, [Number, String, Date]) == 1); // bug #348 -- http://trac.dojotoolkit.org/ticket/348
	jum.assertTrue("503", dojo.lang.find(foo[2], foo) == 2);
	jum.assertTrue("504", dojo.lang.find(foo, foo[2]) == 2);
	jum.assertTrue("505", dojo.lang.find(bar[2], bar) == 2);
	jum.assertTrue("506", dojo.lang.find(bar, bar[2]) == 2);
	
	foo.push(bar);
	jum.assertTrue("510", dojo.lang.find(foo, bar) == 3);
	// jum.assertTrue("511", dojo.lang.find(bar, foo) == 3); // bug #359 -- http://trac.dojotoolkit.org/ticket/359
}

function test_lang_has(){
	var tObj = [];
	tObj.push("foo!");
	tObj.foo = "bar";
	jum.assertTrue("510", dojo.lang.has(tObj, 0));
	jum.assertTrue("511", dojo.lang.has(tObj, "foo"));
	jum.assertFalse("512", dojo.lang.has(tObj, "bar"));
	jum.assertFalse("513", dojo.lang.has(tObj, 1));
}

function test_lang_isEmpty(){
	var tObj = {};
	var tArr = [];
	jum.assertTrue("520", dojo.lang.isEmpty(tObj));
	jum.assertTrue("521", dojo.lang.isEmpty(tArr));
	tArr.push("foo");
	jum.assertFalse("522", dojo.lang.isEmpty(tArr));
	tObj.foo = "bar";
	jum.assertFalse("523", dojo.lang.isEmpty(tObj));
}

function test_lang_forEach(){
	var foo = new Array(128, "bbb", 512);
	var ok = true;
	dojo.lang.forEach(foo, function(elt, idx, array){
		switch (idx) {
			case 0: ok = (elt==128); break;
			case 1: ok = (elt=="bbb"); break;
			case 2: ok = (elt==512); break;
			default: ok = false;
		}
		jum.assertTrue(String(530 + idx), ok);
	});
	// FIXME: test NodeList?
	var bar = 'abc';
	dojo.lang.forEach(bar, function(elt, idx, array){
		switch (idx) {
			case 0: ok = (elt=='a'); break;
			case 1: ok = (elt=='b'); break;
			case 2: ok = (elt=='c'); break;
			default: ok = false;
		}
		jum.assertTrue(String(540 + idx), ok);
	});
}

function test_lang_every(){
	var foo = new Array(128, "bbb", 512);
	var ok = true;
	var result = true;
	dojo.lang.every(foo, function(elt, idx, array){
		switch (idx) {
			case 0: ok = (elt==128); result = true; break;
			case 1: ok = (elt=="bbb"); result = false; break;
			case 2: ok = false; break;
			default: ok = false;
		}
		jum.assertTrue(String(550 + idx), ok);
		return result;
	});
	// FIXME: test NodeList?
	var bar = 'abc';
	dojo.lang.every(bar, function(elt, idx, array){
		switch (idx) {
			case 0: ok = (elt=='a'); result = true; break;
			case 1: ok = (elt=='b'); result = false; break;
			case 2: ok = false; break;
			default: ok = false;
		}
		jum.assertTrue(String(560 + idx), ok);
		return result;
	});
}

function test_lang_some(){
	var foo = new Array(128, "bbb", 512);
	var ok = true;
	var result = false;
	dojo.lang.some(foo, function(elt, idx, array){
		switch (idx) {
			case 0: ok = (elt==128); break;
			case 1: ok = (elt=="bbb"); return true; break;
			case 2: ok = false; break;
			default: ok = false;
		}
		jum.assertTrue(String(570 + idx), ok);
	});
	// FIXME: test NodeList?
	var bar = 'abc';
	dojo.lang.some(bar, function(elt, idx, array){
		switch (idx) {
			case 0: ok = (elt=='a'); break;
			case 1: ok = (elt=='b'); return true; break;
			case 2: ok = false; break;
			default: ok = false;
		}
		jum.assertTrue(String(580 + idx), ok);
	});
}