/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above *///dojo.require("dojo.crypto");
dojo.provide("dojo.crypto.MD5");

//	rewritten based entirely on RFC 1321, with word functions borrowed from Paul Johnstone.
//	compute will return a Base64 encoded string.
dojo.crypto.MD5 = new function(){
	function decode(data){
		var chrsz=8 ;
		var bin=[] ;
		var mask=(1<<chrsz)-1;
		for (var i=0; i<data.length*chrsz; i+=chrsz){
			bin[i>>5]|=(data.charCodeAt(i/chrsz)&mask)<<(i%32);
		}
		return bin;
	}

	//	encode
	function encodeBase64(ba){
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var s = "";
		for(var i=0; i<ba.length*4; i+=3){
			var t = (((ba[i>>2]>>8*(i%4))&0xFF)<<16)
				|(((ba[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)
				|((ba[i+2>>2]>>8*((i+2)%4))&0xFF);
			for(var j=0; j<4; j++){
				if(i*8+j*6>ba.length*32) s+="=";
				else s+=tab.charAt((t>>6*(3-j))&0x3F);
			}
		}
		return s;
	}

	//	rounds functions.
	function RL(x, n){ return ((x<<n)|(x>>(32-n))); }
	function RR(x, n){ return ((x>>n)|(x<<(32-n))); }
	function F(x, y, z){ return (x & y)|(~x & z); }
	function G(x, y, z){ return (x & z)|(y & ~z); }
	function H(x, y, z){ return x ^ y ^ z; }
	function I(x, y, z){ return y ^ (x | ~z); }
	function FF(a, b, c, d, x, s, ac){
		a += F(b, c, d) + x + ac;
		a = RL(a, s);
		a += b;
		return a;
	}
	function GG(a, b, c, d, x, s, ac){
		a += G(b, c, d) + x + ac;
		a = RL(a, s);
		a += b;
		return a;
	}
	function HH(a, b, c, d, x, s, ac){
		a += H(b, c, d) + x + ac;
		a = RL(a, s);
		a += b;
		return a;
	}
	function II(a, b, c, d, x, s, ac){
		a += I(b, c, d) + x + ac;
		a = RL(a, s);
		a += b;
		return a;
	}

	this.compute = function(data, bDoNotEncode){
		var state = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476 ];
		var len = data.length;
		var x = decode(data);
		x[len>>5]|=0x80<<(len%32);
		x[(((len+64)>>>9)<<4)+14] = len;

		//	do the digest.
		var a = state[0];
		var b = state[1];
		var c = state[2];
		var d = state[3];

		for(var i=0; i<x.length; i+=16){
			/* Round 1 */
			a = FF(a, b, c, d, x[i+ 0],  7, 0xd76aa478); /* 1 */
			d = FF(d, a, b, c, x[i+ 1], 12, 0xe8c7b756); /* 2 */
			c = FF(c, d, a, b, x[i+ 2], 17, 0x242070db); /* 3 */
			b = FF(b, c, d, a, x[i+ 3], 22, 0xc1bdceee); /* 4 */
			a = FF(a, b, c, d, x[i+ 4],  7, 0xf57c0faf); /* 5 */
			d = FF(d, a, b, c, x[i+ 5], 12, 0x4787c62a); /* 6 */
			c = FF(c, d, a, b, x[i+ 6], 17, 0xa8304613); /* 7 */
			b = FF(b, c, d, a, x[i+ 7], 22, 0xfd469501); /* 8 */
			a = FF(a, b, c, d, x[i+ 8],  7, 0x698098d8); /* 9 */
			d = FF(d, a, b, c, x[i+ 9], 12, 0x8b44f7af); /* 10 */
			c = FF(c, d, a, b, x[i+10], 17, 0xffff5bb1); /* 11 */
			b = FF(b, c, d, a, x[i+11], 22, 0x895cd7be); /* 12 */
			a = FF(a, b, c, d, x[i+12],  7, 0x6b901122); /* 13 */
			d = FF(d, a, b, c, x[i+13], 12, 0xfd987193); /* 14 */
			c = FF(c, d, a, b, x[i+14], 17, 0xa679438e); /* 15 */
			b = FF(b, c, d, a, x[i+15], 22, 0x49b40821); /* 16 */

			/* Round 2 */
			a = GG(a, b, c, d, x[i+ 1],  5, 0xf61e2562); /* 17 */
			d = GG(d, a, b, c, x[i+ 6],  9, 0xc040b340); /* 18 */
			c = GG(c, d, a, b, x[i+11], 14, 0x265e5a51); /* 19 */
			b = GG(b, c, d, a, x[i+ 0], 20, 0xe9b6c7aa); /* 20 */
			a = GG(a, b, c, d, x[i+ 5],  5, 0xd62f105d); /* 21 */
			d = GG(d, a, b, c, x[i+10],  9,  0x2441453); /* 22 */
			c = GG(c, d, a, b, x[i+15], 14, 0xd8a1e681); /* 23 */
			b = GG(b, c, d, a, x[i+ 4], 20, 0xe7d3fbc8); /* 24 */
			a = GG(a, b, c, d, x[i+ 9],  5, 0x21e1cde6); /* 25 */
			d = GG(d, a, b, c, x[i+14],  9, 0xc33707d6); /* 26 */
			c = GG(c, d, a, b, x[i+ 3], 14, 0xf4d50d87); /* 27 */
			b = GG(b, c, d, a, x[i+ 8], 20, 0x455a14ed); /* 28 */
			a = GG(a, b, c, d, x[i+13],  5, 0xa9e3e905); /* 29 */
			d = GG(d, a, b, c, x[i+ 2],  9, 0xfcefa3f8); /* 30 */
			c = GG(c, d, a, b, x[i+ 7], 14, 0x676f02d9); /* 31 */
			b = GG(b, c, d, a, x[i+12], 20, 0x8d2a4c8a); /* 32 */

			/* Round 3 */
			a = HH(a, b, c, d, x[i+ 5],  4, 0xfffa3942); /* 33 */
			d = HH(d, a, b, c, x[i+ 8], 11, 0x8771f681); /* 34 */
			c = HH(c, d, a, b, x[i+11], 16, 0x6d9d6122); /* 35 */
			b = HH(b, c, d, a, x[i+14], 23, 0xfde5380c); /* 36 */
			a = HH(a, b, c, d, x[i+ 1],  4, 0xa4beea44); /* 37 */
			d = HH(d, a, b, c, x[i+ 4], 11, 0x4bdecfa9); /* 38 */
			c = HH(c, d, a, b, x[i+ 7], 16, 0xf6bb4b60); /* 39 */
			b = HH(b, c, d, a, x[i+10], 23, 0xbebfbc70); /* 40 */
			a = HH(a, b, c, d, x[i+13],  4, 0x289b7ec6); /* 41 */
			d = HH(d, a, b, c, x[i+ 0], 11, 0xeaa127fa); /* 42 */
			c = HH(c, d, a, b, x[i+ 3], 16, 0xd4ef3085); /* 43 */
			b = HH(b, c, d, a, x[i+ 6], 23,  0x4881d05); /* 44 */
			a = HH(a, b, c, d, x[i+ 9],  4, 0xd9d4d039); /* 45 */
			d = HH(d, a, b, c, x[i+12], 11, 0xe6db99e5); /* 46 */
			c = HH(c, d, a, b, x[i+15], 16, 0x1fa27cf8); /* 47 */
			b = HH(b, c, d, a, x[i+ 2], 23, 0xc4ac5665); /* 48 */

			/* Round 4 */
			a = II(a, b, c, d, x[i+ 0],  6, 0xf4292244); /* 49 */
			d = II(d, a, b, c, x[i+ 7], 10, 0x432aff97); /* 50 */
			c = II(c, d, a, b, x[i+14], 15, 0xab9423a7); /* 51 */
			b = II(b, c, d, a, x[i+ 5], 21, 0xfc93a039); /* 52 */
			a = II(a, b, c, d, x[i+12],  6, 0x655b59c3); /* 53 */
			d = II(d, a, b, c, x[i+ 3], 10, 0x8f0ccc92); /* 54 */
			c = II(c, d, a, b, x[i+10], 15, 0xffeff47d); /* 55 */
			b = II(b, c, d, a, x[i+ 1], 21, 0x85845dd1); /* 56 */
			a = II(a, b, c, d, x[i+ 8],  6, 0x6fa87e4f); /* 57 */
			d = II(d, a, b, c, x[i+15], 10, 0xfe2ce6e0); /* 58 */
			c = II(c, d, a, b, x[i+ 6], 15, 0xa3014314); /* 59 */
			b = II(b, c, d, a, x[i+13], 21, 0x4e0811a1); /* 60 */
			a = II(a, b, c, d, x[i+ 4],  6, 0xf7537e82); /* 61 */
			d = II(d, a, b, c, x[i+11], 10, 0xbd3af235); /* 62 */
			c = II(c, d, a, b, x[i+ 2], 15, 0x2ad7d2bb); /* 63 */
			b = II(b, c, d, a, x[i+ 9], 21, 0xeb86d391); /* 64 */

			state[0] += a;
			state[1] += b;
			state[2] += c;
			state[3] += d;
		}
		if (bDoNotEncode) return state;
		return encodeBase64(state);
	}
}();
