/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.crypto.*");

function test_crypto_toDWordArray(){
	var r = dojo.crypto.toDWordArray(" ,8Wbz");
	var t = [0x57382c20, 0x00007A62];
	jum.assertEquals("crypto_toDWordArray", t, r);
}

function test_crypto_fromDWordArray(){
	var r = dojo.crypto.fromDWordArray([0x57382c20, 0x00007A62]);
	var t = " ,8Wbz";
	jum.assertEquals("crypto_fromDWordArray", t, r);
}

function test_crypto_toByteArray(){
	var r = dojo.crypto.toByteArray(" ,8Wbz");
	var t = [32,44,56,87,98,122];
	jum.assertEquals("crypto_toByteArray", t, r);
}

function test_crypto_fromByteArray(){
	var r = dojo.crypto.fromByteArray([32,44,56,87,98,122]);
	var t = " ,8Wbz";
	jum.assertEquals("crypto_fromByteArray", t, r);
}

function test_crypto_toBase64(){
	var r = dojo.crypto.toBase64(" ,8Wbz");
	var t = "ICw4V2J6";
	jum.assertEquals("crypto_toBase64", t, r);
}

function test_crypto_fromBase64(){
	var r = dojo.crypto.fromBase64("ICw4V2J6");
	var t = dojo.crypto.toByteArray(" ,8Wbz");
	jum.assertEquals("crypto_fromBase64", t, r);
}
