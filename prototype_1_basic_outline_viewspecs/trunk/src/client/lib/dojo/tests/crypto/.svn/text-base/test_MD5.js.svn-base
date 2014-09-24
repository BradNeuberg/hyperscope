/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.crypto.MD5");

function test_MD5_compute(){
	var message = "The rain in Spain falls mainly on the plain.";
	var hash = "OUhxbVZ1Mtmu4zx9LzS5cA==";

	var result = dojo.crypto.toBase64(dojo.crypto.MD5.compute(message));
	jum.assertEquals("MD5 Compute Hash", hash, result);
}
