/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.crypto.Rijndael");

function test_Rijndael_encryption(){
	var message = "The rain in Spain falls mainly on the plain.";
	var key = "foobar";
	var base64Encrypted = "QHHcLxph2PC89j0l4XueIvqprjgUaTvCooK31/9fS+SgoLfF1Cns3RD5du5BHF6I";

	var result = dojo.crypto.toBase64(dojo.crypto.Rijndael.encrypt(message, key));
	jum.assertEquals("RijndaelEncryption", base64Encrypted, result);
}

function test_Rijndael_decryption(){
	var message = "The rain in Spain falls mainly on the plain.";
	var key = "foobar";
	var base64Encrypted = "QHHcLxph2PC89j0l4XueIvqprjgUaTvCooK31/9fS+SgoLfF1Cns3RD5du5BHF6I";

	result = dojo.crypto.Rijndael.decrypt(dojo.crypto.fromBase64(base64Encrypted), key);
	jum.assertEquals("RijndaelDecryption", message, result);
}
