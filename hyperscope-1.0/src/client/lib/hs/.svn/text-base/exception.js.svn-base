/** 
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package provides hs.exception, which has all of the custom exceptions
	thrown in the HyperScope system. It has the following classes:
	
	hs.exception.Jump
		Thrown if an error occurs during jumping; thrown by all jump* commands 
		and methods.
		
	hs.exception.Filter
		Thrown if an error occurs during a filter process; thrown by all 
		Filter.apply() methods.	
		
	hs.exception.InvalidAddress
		Thrown if an error occurs while hs.address.Address parsing or resolution.

	hs.exception.Render
		Thrown if an error occurs during the rendering phase.
*/

dojo.provide("hs.exception");

	
/**
	Thrown if an error occurs during jumping; thrown by all jump* commands 
	and methods.
*/

hs.exception.Jump = function(message, doc, address){
	this.message = message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.Jump, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});


/**
	Thrown if an error occurs during a filter process; thrown by all 
	Filter.apply() methods.
*/

hs.exception.Filter = function(message, doc, address){
	this.message = message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.Filter, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});



/**
	Thrown if an error occurs while hs.address.Address parsing or resolution.
*/

hs.exception.InvalidAddress = function(message, doc, address){
	if(dojo.lang.isUndefined(doc)){
		doc = null;
	}
	
	if(dojo.lang.isUndefined(address)){
		address = null;
	}

	this.message = message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.InvalidAddress, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});



/**
	Thrown if an error occurs during the rendering phase.
*/

hs.exception.Render = function(message, doc, address){
	this.message= message;
	this.doc = doc;
	this.address = address;
}

dojo.lang.extend(hs.exception.Render, {
	message: null,
	doc: null, 								/** hs.model.Document */
	address: null,							/** hs.address.Address */
	
	/**
		Turns this exception into a string.
		
		@returns String
	*/
	toString: function(){
		return this.message;
	}
});

