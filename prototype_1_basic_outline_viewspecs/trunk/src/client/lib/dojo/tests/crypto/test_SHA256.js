/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.crypto.SHA256");

function test_SHA256_compute(){
	var message = "The rain in Spain falls mainly on the plain.";
	var hash = "Vt7FG/uDGhzhEE8FFG22iBL4AS5eq3F4agWMFTAEwxE=";

	var result = dojo.crypto.toBase64(dojo.crypto.SHA256.compute(message));
	jum.assertEquals("SHA256 Compute Hash", hash, result);
}
