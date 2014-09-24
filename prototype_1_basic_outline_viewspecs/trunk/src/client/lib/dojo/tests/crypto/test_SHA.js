/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.crypto.SHA");

function test_SHA_compute(){
	var message = "The rain in Spain falls mainly on the plain.";
	var hash = "HvPtEggatVBJuWnrPnDKqpWL36E=";

	var result = dojo.crypto.toBase64(dojo.crypto.SHA.compute(message));
	jum.assertEquals("SHA Compute Hash", hash, result);
}
