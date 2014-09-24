/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.math");

function test_math_degToRad(){
	jum.assertEquals("test", Math.PI, dojo.math.degToRad(180));
}

function test_math_radToDeg(){
	jum.assertEquals("test", 180, dojo.math.radToDeg(Math.PI));
}

function test_math_factorial(){
	jum.assertEquals("test", 6, dojo.math.factorial(3));
}

function test_math_permutations(){
	jum.assertEquals("test", 24, dojo.math.permutations(4, 3));
}

function test_math_combinations(){
	jum.assertEquals("test", 4, dojo.math.combinations(4, 3));
}

function test_math_gaussianRandom () {
	// tricky to test a random number!
	jum.assertTrue("test1", dojo.math.gaussianRandom() >= -1);
	jum.assertTrue("test2", dojo.math.gaussianRandom() <= 1);
}

function test_math_mean () {
	jum.assertEquals("test1", 4, dojo.math.mean([2, 4, 6]));
	jum.assertEquals("test2", -4, dojo.math.mean(-3.5, -4, -4.5));
}

function test_math_round () {
	jum.assertEquals("test1", 4, dojo.math.round(4.380));
	jum.assertEquals("test2", 4, dojo.math.round(3.780));
	jum.assertEquals("test3", 3.8, dojo.math.round(3.780, 1));
	jum.assertEquals("test4", 3.78, dojo.math.round(3.781, 2));
}

function test_math_sd () {
	// see: http://en.wikipedia.org/wiki/Standard_deviation
	var data = [5, 6, 8, 9];
	jum.assertEquals("test1", 1.5811, dojo.math.round(dojo.math.sd(data), 4));
}

function test_math_variance () {
}

