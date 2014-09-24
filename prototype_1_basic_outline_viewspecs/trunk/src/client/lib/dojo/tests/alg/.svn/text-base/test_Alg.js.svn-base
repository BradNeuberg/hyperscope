/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.alg.*");

var testArr = ["foo", "bar", "baz", ["foo", "bar"]];

function test_alg_find(){
	// jum.debug(testArr);
	jum.assertEquals("test10", 0, dojo.alg.find(testArr, "foo"));
}

function test_alg_inArr(){
	// jum.debug(testArr);
	jum.assertTrue("test20", dojo.alg.inArr(testArr, "foo"))
	jum.assertFalse("test21", dojo.alg.inArr(testArr, "foobar"))
	jum.assertFalse("test22", dojo.alg.inArr(testArr, true))
}

function test_alg_has(){
	var tclass = function(){
		this.foo = false;
		this.bar = true;
	}
	tclass.prototype.xyzzy = true;
	var tobj = new tclass();
	jum.assertTrue("test30", dojo.alg.has(tobj, "foo"));
	jum.assertTrue("test31", dojo.alg.has(tobj, "bar"));
	jum.assertTrue("test32", dojo.alg.has(tobj, "xyzzy"));
	jum.assertFalse("test33", dojo.alg.has(tobj, "baz"));
}

function test_alg_getNameInObj(){
	var tclass = function(){
		this.foo = false;
		this.bar = true;
		this.baz = "baz";
	}
	var tobj = new tclass();

	jum.assertEquals("test40", "foo", dojo.alg.getNameInObj(tobj, tobj.foo));
	jum.assertEquals("test41", "bar", dojo.alg.getNameInObj(tobj, tobj.bar));
	jum.assertEquals("test42", "baz", dojo.alg.getNameInObj(tobj, tobj.baz));
}

function test_alg_tryThese(){
	jum.assertEquals("test50", 5, dojo.alg.tryThese(
		function(){ throw "foo"; },
		function(){ return 5; },
		function(){ throw "bar"; }
	));
	var undef;
	jum.assertEquals("test50", undef, dojo.alg.tryThese());
}

function test_alg_map(){
	var foo = 0;
	dojo.alg.map([1, 2, 3], dj_global, function(arg){
		foo+=arg;
	});
	jum.assertEquals("60", 6, foo);
	foo = 0;
	dojo.alg.map([1, 2, 3, 4], function(arg){
		foo+=arg;
	});
	jum.assertEquals("61", 10, foo);
}

function test_alg_forEach(){
	var foo = 0;
	dojo.alg.forEach([1, 2, 3], function(arg){
		foo+=arg;
	});
	jum.assertEquals("70", 6, foo);

	var tarr = [1, 2, 3];
	dojo.alg.forEach(tarr, function(arg){ tarr.push(arg); }, true);
	jum.assertEquals("71", 6, tarr.length);
}
