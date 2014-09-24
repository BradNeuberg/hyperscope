/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.crypto");

dojo.crypto.toBase64 = function (data){
	if (typeof(data) == "string") data = this.toByteArray(data) ;
	var base64Enc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/', '=' ];
	var PADDING_CHAR = 64;		// index of padding char
	var output = [] ;			// total output
	var oc = 0;					// index accumulator for output
	var len	= data.length;
	for (var i = 0; i < len;) {
		var now  = data[i++] << 16;	
		now |= data[i++] << 8;	
		now |= data[i++];	
		output[oc++] = base64Enc[now >>> 18 & 63]; 	// 23..18
		output[oc++] = base64Enc[now >>> 12 & 63]; 	// 17..12
		output[oc++] = base64Enc[now >>> 6  & 63]; 	// 11..6
		output[oc++] = base64Enc[now        & 63]; 	// 5..0
	}
	var padAmount = i - len;
	if (padAmount > 0)  oc -= padAmount; 
	padAmount = Math.abs(padAmount);	// how much to pad
	while (padAmount-- > 0) output[oc++] = base64Enc[PADDING_CHAR];
	return output.join("");
}

dojo.crypto.fromBase64 = function (data){
	if (typeof(data) == "string") data = data.split("") ;
	var base64Dec = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K':10, 'L':11, 'M':12, 'N':13, 'O':14, 'P':15, 'Q':16, 'R':17, 'S':18, 'T':19, 'U':20, 'V':21, 'W':22, 'X':23, 'Y':24, 'Z':25, 'a':26, 'b':27, 'c':28, 'd':29, 'e':30, 'f':31, 'g':32, 'h':33, 'i':34, 'j':35, 'k':36, 'l':37, 'm':38, 'n':39, 'o':40, 'p':41, 'q':42, 'r':43, 's':44, 't':45, 'u':46, 'v':47, 'w':48, 'x':49, 'y':50, 'z':51, '0':52, '1':53, '2':54, '3':55, '4':56, '5':57, '6':58, '7':59, '8':60, '9':61, '+':62, '/':63, '=':64 };
	var PADDING_CHAR = 64;		// index of padding char
	var output = [] ;			// total output
	var oc = 0;					// index accumulator for input
	var len = data.length;		// 0..len-1
	while (data[--len] == base64Dec[PADDING_CHAR]) { /* nothing */ };
	for (var i = 0; i < len; /* nothing */ ) {	
		var now = base64Dec[data[i++]] << 18;	// 23..18
		now    |= base64Dec[data[i++]] << 12;	// 17..12
		now    |= base64Dec[data[i++]] << 6;	// 11..5
		now    |= base64Dec[data[i++]];		// 5..0
		output[oc++] = now >>> 16 & 255; 	// 23..16
		output[oc++] = now >>> 8  & 255; 	// 15..8
		output[oc++] = now        & 255; 	// 7..0
	}
	return output ;
}

dojo.crypto.toByteArray = function(data){
	var bin=[] ;
	for (var i=0; i<data.length; i++){
		bin.push(data.charCodeAt(i));
	}
	return bin;
}

dojo.crypto.fromByteArray = function(data){
	var s=[];
	for (var i=0; i<data.length; i++){
		s.push(String.fromCharCode(data[i]));
	}
	return s.join("");
}

dojo.crypto.toDWordArray = function(data){
	var chrsz=8 ;
	var bin=[] ;
	var mask=(1<<chrsz)-1;
	for (var i=0; i<data.length*chrsz; i+=chrsz){
		bin[i>>5]|=(data.charCodeAt(i/chrsz)&mask)<<(i%32);
	}
	return bin;
}

dojo.crypto.fromDWordArray = function(data){
	var chrsz=8;
	var s=[];
	var mask = (1 << chrsz) - 1;
	for (var i=0; i<data.length*32; i+=chrsz){
		s.push(String.fromCharCode((data[i>>5]>>>(i%32))&mask));
	}
	while(s[s.length-1] == "\x00"){
		s.pop();
	}
	return s.join("");
}
