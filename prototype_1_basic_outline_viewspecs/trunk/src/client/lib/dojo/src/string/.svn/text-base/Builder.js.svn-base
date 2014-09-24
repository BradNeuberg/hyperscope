/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.string.Builder");
dojo.require("dojo.string");

dojo.string.Builder = function(str){
	var a = [];
	var b = str || "";
	var length = this.length = b.length;

	if(b.length > 0){
		a.push(b);
	}
	b = "";
	this.toString = this.valueOf = function(){ 
		return a.join(""); 
	};

	this.append = function(s){
		a.push(s);
		length += s.length;
		this.length = length;
		return this;
	};

	this.clear = function(){
		a=[];
		length = this.length = 0;
		return this;
	};

	this.remove = function(f,l){
		var s = ""; 
		b = a.join(""); 
		a=[];
		if(f>0){
			s = b.substring(0, (f-1));
		}
		b = s + b.substring(f + l); 
		a.push(b);
		length = this.length = b.length; 
		b="";
		return this;
	};

	this.replace = function(o,n){
		b = a.join(""); 
		a = []; 
		b = b.replace(o,n); 
		a.push(b);
		length = this.length = b.length; 
		b="";
		return this;
	};

	this.insert = function(idx,s){
		b = a.join(""); 
		a=[];
		if(idx == 0){
			b = s + b;
		}else{
			var t = b.split("");
			t.splice(idx,0,s);
			b = t.join("")
		}
		length = this.length = b.length; 
		a.push(b); 
		b="";
		return this;
	};
};
