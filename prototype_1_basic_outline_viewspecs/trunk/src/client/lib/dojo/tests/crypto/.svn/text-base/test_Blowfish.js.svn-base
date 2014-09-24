/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.crypto.Blowfish");

function test_Blowfish_encryption(){
	var message = "The rain in Spain falls mainly on the plain.";
	var key = "foobar";
	var base64Encrypted = "0nFmvmtqbrp9AIOSbn4dWMCKcPnqgCQBDldoXZiiGh+8s7mol7Zp8H/QGrJLmkT9";

	var result = dojo.crypto.toBase64(dojo.crypto.Blowfish.encrypt(message, key));
	jum.assertEquals("BlowfishEncryption", base64Encrypted, result);
}

function test_Blowfish_decryption(){
	var message = "The rain in Spain falls mainly on the plain.";
	var key = "foobar";
	var base64Encrypted = "0nFmvmtqbrp9AIOSbn4dWMCKcPnqgCQBDldoXZiiGh+8s7mol7Zp8H/QGrJLmkT9";

	result = dojo.crypto.Blowfish.decrypt(dojo.crypto.fromBase64(base64Encrypted), key);
	jum.assertEquals("BlowfishDecryption", message, result);
}
