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

	This package provides hs.util, which has a collection of classes aiding
	with various utility functions. It provides the following classes:
	
	hs.util.AddressSerializer
		Can serialize an hs.address.Address into a string or URL.
			
	hs.util.AddressTokenizer
		Parses a string or URL into a collection of hs.address.Pieces and can 
		return them one by one, left to right.

	hs.util.XMLFetcher
		Returns an XML DOM for the given address, either fetched remotely 
		or from it's local cache.
		
	hs.util.NodeWalker
		Walks the tree of hs.model.Nodes in an hs.model.Document, performing some 
		action or test on each node. The order walked is the same order a document
		would appear on the page, successively moving down the tree.
		
	hs.util.NodeNumberTokenizer
		Tokenizes a node number, such as 1B22C2A, and returns each level as a 
		single number to easily step through a hierarchical node number. Numbering
		always starts at 1.
		
	hs.util.XSLTLoader
		Will asychronously load a set of XSLT files, tell you when they are loaded,
		transform them into XML DOMs, and return them by name. Used by such filters
		as the Render filter to get their job done.
		
	It also adds dojo.dom.setAttributeNS into dojo.dom if it is not present in
	this version of Dojo yet.
*/

dojo.provide("hs.util");

dojo.require("dojo.string.*");
dojo.require("dojo.io.*");
dojo.require("dojo.dom");

dojo.require("sarissa.core");


/**
	Can serialize an hs.address.Address into a string or URL.
*/

/**
	@param address : hs.address.Address
	@throws hs.exception.InvalidAddress
*/
hs.util.AddressSerializer = function(address){
	this.addr = address;
}

dojo.lang.extend(hs.util.AddressSerializer, {
	addr: null,
	
	/** 
		Serializes the given address into a URL string; this URL is not
		necessarily expanded; it simply uses available information in the
		hs.address.Address that was given in the constructor to create the string.
		
		@returns String
	*/
	serialize: function(){
		var s = new String();
		
		// file info
		var fileInfo = this.addr.fileInfo;
		s += fileInfo.toString();
		
		// add an anchor
		if(this.addr.nodeAddresses.length > 0
			|| this.addr.viewspecs.length > 0
			|| this.addr.contentFilter != null){
			s += "#";
		}
		
		// serialize each node address piece
		var nodeAddresses = this.addr.nodeAddresses;
		var lastPiece = null;
		for(var i = 0; i < nodeAddresses.length; i++){
			var piece = nodeAddresses[i];
			
			// add a space?
			var addSpace = true;
			if(lastPiece == null){
				addSpace = false;
			}
			
			if(lastPiece != null){
				// don't add a space if we are dealing with one of the types that come
				// in a row, like relative addresses (ex: .udt), and we are past the
				// first letter in this sequence
				if(lastPiece.isPieceType("hs.address.Relative")
					|| lastPiece.isPieceType("hs.address.IndirectLink")){
					if(piece.isPieceType("hs.address.Relative")
						|| piece.isPieceType("hs.address.IndirectLink")){
						addSpace = false;		
					}		
				}
				
				if(lastPiece.isPieceType("hs.address.StringPosition") == true
					&& piece.isPieceType("hs.address.StringPosition")){
					addSpace = false;
				}
			}
			
			if(addSpace == true){
				s += " ";
			}
			
			if(piece.isPieceType("hs.address.Relative")
				|| piece.isPieceType("hs.address.IndirectLink")){
				// Print out a period if the last piece type is
				// not a relative type
				if(lastPiece == null ||
					(lastPiece.isPieceType("hs.address.Relative") == false
					 && lastPiece.isPieceType("hs.address.IndirectLink") == false)){
					s += ".";	 	
				}
				
				s += piece.toString();
			}else if(piece.isPieceType("hs.address.Marker")){
				s += "@" + piece.toString();
			}else if(piece.isPieceType("hs.address.NodeLabel")){
				switch(piece.type){
					case hs.address.NodeLabel.BRANCH_SEARCH:
						s += "!";
						break;
					case hs.address.NodeLabel.MOVE_TO_NEXT:
						s += "*";
						break;
					case hs.address.NodeLabel.EXTERNAL:
						s += "$";
						break;
				}
				
				s += piece.toString();
			}else if(piece.isPieceType("hs.address.NodeNumber")){
				if(piece.isOffset){
					s += "!";
				}
				
				s += piece.toString();
			}else{
				s += piece.toString();
			}
			
			lastPiece = piece;
		}
		
		// viewspecs
		var viewspecs = this.addr.viewspecs;
		if(viewspecs.length > 0){
			s += ":";
		}
		
		for(var i = 0; i < viewspecs.length; i++){
			var v = viewspecs[i];
			s += v.toString();
		}
		
		// content filter
		var contentFilter = this.addr.contentFilter;
		if(contentFilter != null){
			s += ";" + contentFilter.toString() + ";";
		}
		
		return s;
	}
});



/**
	Parses a string or URL into a collection of hs.address.Pieces and can 
	return them one by one, left to right.
*/

/**
	@param url : String The url to tokenize.
	@throws hs.exception.InvalidAddress
*/
hs.util.AddressTokenizer = function(url){
	this._url = url;
	this._parse(url);
}

dojo.lang.extend(hs.util.AddressTokenizer, {
	_pieces: new Array(),
	_url: null,
	
	/**
	 	A collection that holds regular expressions for 
	 	each node address type (regexp) and a function to parse that
	 	type (parseFunc); this allows us to parse and work with 
	 	node addresses in a generic fashion in
	 	_parseNodeAddress.
	 */
	_nodeTypes: [
		/**
		 	Node ID - 0 followed by one or more digits
		*/
		{regexp: /^\s*(0\d+)/,
		 parseFunc: "_parseNodeID"},
			
		/**
		 	Node Number - two possibilities:
				1) the number 0 (the root node), but it _can't_ be followed by more
				numbers (the ?! expression below), or else it would be a node ID -
				(?:0(?![0-9]+))
				2) a number from 1 through 9, followed by optional numbers or letters -
				(?:[1-9]+[a-z0-9]*)
			
			Both can have optional ! symbol at beginning for offsets.
		*/
		{regexp: /^\s*((?:0(?![0-9]+))|(?:\!?[1-9]+[a-z0-9]*))/i,
		 parseFunc: "_parseNodeNumber"},
			
		/**
			Node Label - must start with letter followed by a-z, 0-9, and _ and -, case
			insensitive (i)
			Can have optional symbols *, !, and $ at beginning for different
			types of labels - (?:\!|\*|\$)?
		*/
		{regexp: /^\s*((?:\!|\*|\$)?[a-z]+[a-z0-9_\-]*)/i,
		 parseFunc: "_parseNodeLabel"},
			
		/**
		 	Marker - same as node label, but starts with @
		*/
		{regexp: /^\s*(\@[a-z]+[a-z0-9_\-]*)/i,
		 parseFunc: "_parseMarker"},
		
		/**
		 	Relative and Indirect - . followed by optional number and any of the 
		 	following letters, repeated: nbudoehtspcrl and rf
		 */
		{regexp: /^\s*(\.[1-9]?[0-9nbudoelhtspcrf]?[0-9nbudoelhtspcrf]*)/,
		 parseFunc: "_parseRelativeAndIndirect"},
		
		/**
		 	String Search - anything delimited with " or /
		 */
		{regexp: /^\s*((?:\"|\/)(?:\\\"|\\\/|\\\:|\\\;|[^\"\/])*(?:\"|\/)[a-z]*)/i,
		 parseFunc: "_parseStringSearch"},
		
		/**
		 	String Position - + or - followed by number and any of the following
		 	letters, repeated: wcvilef
		 */
		{regexp: /^\s*((?:\+|\-)[1-9]?[0-9wcvilef]?[\+\-0-9wcvilef]*)/,
		 parseFunc: "_parseStringPosition"}
	],

	/**
		Whether this tokenizer has another hs.address.Piece.
		
		@returns Boolean
	*/
	hasNext: function(){
		return (this._pieces.length > 0);
	},

	/**
		Returns the next hs.address.Piece tokenized, from left to right.
		
		@returns hs.address.Piece
	*/
	next: function(){
		if(this.hasNext()){
			return this._pieces.shift();
		}else{
			return null;
		}
	},
	
	_parse: function(url){
		// parse out the file info piece
		var fileInfo = new hs.address.FileInfo(url);
		this._pieces.push(fileInfo);
		
		// break off the anchor, if there is one
		var anchor = this._getAnchor(url);
		if(anchor == null){
			return;
		}
		
		// break the anchor into three sections:
		// node address, viewspecs, content filter
		var nodeAddrs = this._getNodeAddressStr(anchor);
		if(nodeAddrs != null && nodeAddrs != ""){
			var cutPoint = anchor.indexOf(nodeAddrs);
			cutPoint = cutPoint + nodeAddrs.length;
			anchor = anchor.substring(cutPoint);
		}
		
		var viewspecs = this._getViewspecsStr(anchor);
		if(viewspecs != null && viewspecs != ""){
			var cutPoint = anchor.indexOf(viewspecs);
			cutPoint = cutPoint + viewspecs.length;
			anchor = anchor.substring(cutPoint);
		}
		
		var contentFilter = this._getContentFilterStr(anchor);
		
		// parse each piece
		this._parseNodeAddress(nodeAddrs);
		this._parseViewspecs(viewspecs);
		this._parseContentFilter(contentFilter);
	},
	
	_getAnchor: function(url){
		if(dojo.lang.isUndefined(url)
			|| url == null
			|| url.indexOf("#") == -1){
			return null;
		}
		var m = url.match(/[^#]*#(.*)/);
		if(m == null || m[1] == null || m[1] == ""){
			return;
		}
		var anchor = m[1];
		
		// turn URL encoded characters into their real values, 
		// such as %20 for spaces
		anchor = decodeURIComponent(anchor);
		
		return anchor;
	},
	
	_getNodeAddressStr: function(anchor){
		// get the node address
		// we can't just split on : or ; because this
		// character can be inside a quoted string or regular expression 
		// to search on
		// example: <2A "todo:" .l :x>
		// example: <2A /todo\\:/ .l :x>
		var results = anchor.match(/^((?:\\\;|\\\:|[^\;\:])*)/);
		var nodeAddrs = new String();
		if(results != null && results.length == 2){
			nodeAddrs = results[1];
		}
		
		return nodeAddrs;
	},
	
	_getViewspecsStr: function(anchor){
		var end = null;
		for(var i = 0; i < anchor.length; i++){
			if(anchor.charAt(i) == ";"){
				end = i;
				break;
			}
		}
		if(end == null){
			end = anchor.length;
		}
		var viewspecs = anchor.substring(0, end);
		
		return viewspecs;
	},
	
	_getContentFilterStr: function(anchor){
		// get the content filter
		var results = anchor.match(/\s*(\;\s*(?:\\\;|[^\;])*\s*\;)\s*$/);
		var contentFilter = new String();
		if(results != null && results.length == 2){
			contentFilter = results[1];
		}
		
		return contentFilter;
	},
	
	_parseNodeAddress: function(input){
		input = dojo.string.trim(input);
		if(input == ""){ // no node address
			return;
		}
		
		var currentPiece = null;
		
		/**  
		  	Overview of node address parsing:
			Parse from left to right, testing the
			beginning of our input against each of
			the entries' test property in our _nodeTypes collection.
			If it matches, we use the parseFunc function
			for this entry to consume the input, shortening
			the input string and continuing until input is
			empty.
		*/
		while(input.length != 0){
			// get the node address type that is at the beginning 
			// of our input 
			var addrType = null;
			for(var i = 0; i < this._nodeTypes.length; i++){
				var currentType = this._nodeTypes[i];
				if(currentType.regexp.test(input) == true){
					addrType = currentType;
					break;
				}
			}
			if(addrType == null){
				throw new hs.exception.InvalidAddress("? " + input);
			}
			
			// get our matching string
			var m = input.match(addrType.regexp);
			if(m == null || dojo.lang.isUndefined(m) || m.length == 1){
				throw new hs.exception.InvalidAddress("? " + input);
			}

			var strPiece = m[1];
			
			// parse the string piece by calling it's parse function
			strPiece = strPiece.replace(/\\/g, "\\\\"); // escape ' and \ characters
			strPiece = strPiece.replace(/\'/g, "\\'"); 
			var callMe = "this." + addrType.parseFunc + "('" + strPiece + "')";
			eval(callMe);
			
			// consume the beginning of the input now
			input = input.replace(addrType.regexp, "");
		}
	},
	
	_parseViewspecs: function(str){
		str = dojo.string.trim(str);
		if(str == ""){ // no viewspecs
			return;
		}
		
		str = str.substring(1); // remove colon

		// consume from left to right, shortening string
		// as we go
		var regexp = /^\s*([a-zA-Q])/;
		while(str.length != 0){
			// get next letter
			var currentLetter = str.match(regexp);
			if(currentLetter == null
				|| dojo.lang.isUndefined(currentLetter)
				|| currentLetter.length == 1
				|| currentLetter[1] == ""
				|| currentLetter[1] == null){
				throw new hs.exception.InvalidAddress("? " + str);	
			}
			var letter = currentLetter[1];
			
			var p = new hs.address.Viewspec(letter);
			this._pieces.push(p);
			
			// consume the beginning of the string
			str = str.replace(regexp, "");
		}
	},
	
	_parseContentFilter: function(str){
		str = dojo.string.trim(str);
		if(str == ""){ // no content filter
			return;
		}
		
		if(str.charAt(0) != ";" && str.charAt(str.length - 1) != ";"){
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		str = str.substring(1); // remove semicolon
		str = str.substring(0, str.length - 1); // remove semicolon
		
		if(str.charAt(0) != "\"" && str.charAt(0) != "/"){
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		if(/\"|\/|[a-z]$/i.test(str) == false){ // must end with " / or letter
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		
		var p = new hs.address.ContentFilter(str);
		this._pieces.push(p);
	},
	
	_parseNodeID: function(str){
		str = dojo.string.trim(str);
		var p = new hs.address.NodeID(str);
		this._pieces.push(p);
	},

	_parseNodeNumber: function(str){
		str = dojo.string.trim(str);
		var isOffset = false;
		if(dojo.string.startsWith(str, "!")){
			str = str.substring(1);
			isOffset = true;		
		}
		
		var p = new hs.address.NodeNumber(str, isOffset);
		this._pieces.push(p);
	},
	
	_parseNodeLabel: function(str){
		str = dojo.string.trim(str);
		
		var labelType;
		if(dojo.string.startsWith(str, "!")){
			labelType = hs.address.NodeLabel.BRANCH_SEARCH;
			str = str.substring(1);
		}else if(dojo.string.startsWith(str, "*")){
			labelType = hs.address.NodeLabel.MOVE_TO_NEXT;
			str = str.substring(1);
		}else if(dojo.string.startsWith(str, "$")){
			labelType = hs.address.NodeLabel.EXTERNAL;
			str = str.substring(1);
		}else{
			labelType = hs.address.NodeLabel.START_AT_FIRST;
		}
		
		var p = new hs.address.NodeLabel(str, labelType);
		this._pieces.push(p);
	},
	
	_parseMarker: function(str){
		str = dojo.string.trim(str);
		str = str.substring(1); // take off @
		
		var p = new hs.address.Marker(str);
		this._pieces.push(p);
	},
	
	_parseRelativeAndIndirect: function(str){
		str = dojo.string.trim(str);
		str = str.substring(1); // take off .
		
		// grab a number and a letter at a time,
		// consuming the string from left to right
		var regexp = /^(\d*)([nbudoehtspcrl]f?)/;
		while(str.length != 0){
			// get next piece
			var currentPiece = str.match(regexp);
			if(currentPiece == null
				|| dojo.lang.isUndefined(currentPiece)
				|| currentPiece.length == 1
				|| currentPiece[2] == ""
				|| currentPiece[2] == null){
				throw new hs.exception.InvalidAddress("? " + str);	
			}
			var letter = currentPiece[2];
			var offset = currentPiece[1];
			if(offset == "" || offset == null
				|| dojo.lang.isUndefined(offset)){
				offset = 1;
			}
			offset = new Number(offset).valueOf();
			if(offset == Number.NaN || offset == 0){ // not a number or 0
				throw new hs.exception.InvalidAddress("? " + str);
			}
			
			var p;
			if(letter == "l"){
				p = new hs.address.IndirectLink(offset);
			}else{
				p = new hs.address.Relative(letter, offset);
			}
			this._pieces.push(p);
			
			// consume the beginning of the string
			str = str.replace(regexp, "");
		}
	},
	
	_parseStringSearch: function(str){
		str = dojo.string.trim(str);
		
		var p = new hs.address.StringSearch(str);
		this._pieces.push(p);
	},
	
	_parseStringPosition: function(str){
		str = dojo.string.trim(str);
		
		// make sure we have a leading + or -
		if(dojo.string.startsWith(str, "+") == false
			&& dojo.string.startsWith(str, "-") == false){
			throw new hs.exception.InvalidAddress("? " + str);	
		}
		
		// grab a sign, a number and a letter at a time,
		// consuming the string from left to right
		var regexp = /^((?:\+|\-))(\d*)([wcvilef])/;
		while(str.length != 0){
			// get next piece
			var currentPiece = str.match(regexp);
			if(currentPiece == null
				|| dojo.lang.isUndefined(currentPiece)
				|| currentPiece.length == 1
				|| currentPiece[1] == "" 		// no sign
				|| currentPiece[1] == null
				|| currentPiece[3] == ""		// no letter
				|| currentPiece[3] == null){
				throw new hs.exception.InvalidAddress("? " + str);	
			}
			
			var sign = currentPiece[1];
			var letter = currentPiece[3];
			var offset = currentPiece[2];
			if(offset == "" || offset == null
				|| dojo.lang.isUndefined(offset)){
				offset = 1;
			}
			offset = new Number(offset).valueOf();
			if(offset == Number.NaN || offset == 0){ // not a number or 0
				throw new hs.exception.InvalidAddress("? " + str);
			}
			if(sign == "-"){
				offset = offset * -1;
			}
			
			var p = new hs.address.StringPosition(letter, offset);
			this._pieces.push(p);
			
			// consume the beginning of the string
			str = str.replace(regexp, "");
		}
	}
});



/**
	Returns an XML DOM for the given address, either fetched remotely 
	or from it's local cache. You should 'throw away' XML fetchers after
	loading a document, and create a fresh, new one for each document to
	load.
*/

hs.util.XMLFetcher = function(){
}

/** 
  	The URL to our proxy for cross-domain
  	XML fetching.
*/
hs.util.XMLFetcher.PROXY_URL = "/hyperscope/trunk/hyperscope/src/server/proxy.php?url=";

/**
  Our cache of previously loaded document XML; this cache is shared
  between all XMLFetcher instances. We associate the
  basic URL (without the anchor) as our key, and store the XML
  string (not the DOM) as the value.
 */
hs.util.XMLFetcher._cache = new Object();

dojo.lang.extend(hs.util.XMLFetcher, {
	_handler: null,
	_addr: null,
	_url: null,
	_finished: false,
	_fromCache: false,

	/** 
		Loads the given url, calling 'handler' when done.
		
		@param addr : String or hs.address.Address
		@param handler : Function Handler called when document loaded, as follows
			handler = function(address : hs.address.Address, 
								dom : XML DOM, 
								error : InvalidAddressException)
			where 'address' is the address loaded, 'document' is the document,
			and 'error' is any error that might have occurred.
		@throws hs.exception.InvalidAddress
	*/
	load: function(addr, handler){
		this._handler = handler;
		
		// defensive programming: make sure that we are working with
		// a fresh XMLFetcher
		if(this._finished == true){
			throw new hs.exception.InvalidAddress(
						"Programming error: "
						+ "You must create a new XMLFetcher for "
						+ "each file loaded");
		}
		
		if(addr == null || dojo.lang.isUndefined(addr)){
			throw new hs.exception.InvalidAddress(
						"Invalid address given to load: " + addr.toString());
		}
		
		// see if we are a string url
		if(dojo.lang.isUndefined(addr.resolve)){
			addr = new hs.address.Address(addr);
		}
		
		// make sure we are a full address
		if(addr.isRelative() == true){
			throw new hs.exception.InvalidAddress(
						"Addresses must be expanded before "
						+ "calling XMLFetcher: " + addr.toString());
		}
		
		this._addr = addr;
		
		// get a URL
		var url = addr.fileInfo.toString();
		this._url = url;
		
		// see if we have it in the cache
		if(this._inCache(url)){
			var doc = this._getFromCache(url);
			this._loaded(null, doc, null);
		}else{
			this._loadFile(url);
		}
	},
	
	_loadFile: function(url){
		// see if this url is the same as our own url
		if(this._isSameHost(url) == false){
			url = hs.util.XMLFetcher.PROXY_URL + url;
		}
		
		// load the file
		var bindArgs = {
			url:		url,
			sync:		djConfig.testing,
			mimetype:	"text/plain",
			error:		dojo.lang.hitch(this, this._error),
			load:		dojo.lang.hitch(this, this._loaded)
		};
		
		// dispatch the request
		dojo.io.bind(bindArgs);
	},
	
	_isSameHost: function(url){
		var ourHost = window.location.href;
		ourHost = new hs.address.FileInfo(ourHost);
		var urlHost = new hs.address.FileInfo(url);
		
		if(ourHost.scheme != urlHost.scheme){
			return false;
		}
		
		if(ourHost.port != urlHost.port){
			return false;
		}
		
		if(ourHost.host != urlHost.host){
			return false;
		}
		
		return true;
	},
	
	_loaded: function(type, data, evt){
		this._finished = true;
		var exp = null;
		
		// make sure we have data
		if(data == null || dojo.lang.isUndefined(data)){
			exp = new hs.exception.InvalidAddress(
				"No data returned for address: " + this._addr.toString());
		}
		
		// turn into a DOM if we did not load from the cache
		if(this._fromCache == false){
			var xmlStr = data;
			try{
				data = this._toXML(data);
			}catch(e){
				exp = e;
			}
		}
		
		// make XPath available (for IE)
		if(exp == null){
			data = this._turnOnXPath(data);
		}
		
		// make sure our data is OPML
		if(exp == null){
			try{
				var rootTags = data.selectNodes("/opml");
				if(rootTags == null || dojo.lang.isUndefined(rootTags)
					|| rootTags.length == 0){
					exp = new hs.exception.InvalidAddress(
						"Return results are not OPML for address: " + this._addr.toString());		
				}
			}catch(e){ // selectNodes can throw an exception on IE
				exp = new hs.exception.InvalidAddress(
						"Return results are not OPML for address: " + this._addr.toString()
						+ ", exception: " + e);	
			}
		}
		
		// cache it if we did not just grab it from the cache
		if(exp == null && this._fromCache == false){
			this._cacheXML(this._url, xmlStr);
		}
		
		this._handler.call(null, this._addr, data, exp);
	},
	
	_error: function(type, errObj){
		this._finished = true;
		
		// dojo returns too much programmy information in
		// the error message; remove that part
		var message = errObj.message;
		if(message.indexOf("XMLHttpTransport Error:") != -1){
			message = message.replace(/XMLHttpTransport Error:/, "");
		}
		
		var exp = new hs.exception.InvalidAddress(
						"The following error occurred for " 
						+ this._addr.toString()
						+ ": " + message);
						
		this._handler.call(null, this._addr, null, exp);
	},
	
	_turnOnXPath: function(dom){
		dom.setProperty("SelectionLanguage", "XPath");
		
		// enable our namespaces
		Sarissa.setXpathNamespaces(dom, 
							hs.model.Document.HS_NAMESPACE + " " 
						  	+ hs.model.Document.HS_INTERNAL_NAMESPACE);
					  
		return dom;
	},
	
	_cacheXML: function(url, xmlStr){
		hs.util.XMLFetcher._cache[url] = xmlStr;
	},
	
	_getFromCache: function(url){
		var xmlStr = hs.util.XMLFetcher._cache[url];
		var dom = this._toXML(xmlStr);
		
		this._fromCache = true;
		
		return dom;
	},
	
	_inCache: function(url){
		return (hs.util.XMLFetcher._cache[url] != null 
			&& dojo.lang.isUndefined(hs.util.XMLFetcher._cache[url]) != null);
	},
	
	_toXML: function(xmlStr){
		var parser = new DOMParser();
		
		// parse the string
		var dom = parser.parseFromString(xmlStr, "text/xml");
		
		// make sure there are no errors
		if(Sarissa.getParseErrorText(dom) == Sarissa.PARSED_OK){
			return dom;
		}else{
			throw new hs.exception.InvalidAddress("The OPML document at " 
				+ this._addr.toString() + " "
				+ "is invalid: " + Sarissa.getParseErrorText(dom));
		}
	}
});



/**
	Walks the tree of hs.model.Nodes in an hs.model.Document, performing some 
	action or test on each node. The order walked is the same order a document
	would appear on the page, successively moving down the tree.
*/

/**
	@param ctxtNode : hs.model.Node - An hs.model.Node to start walking from.
	@param includeCtxt : Boolean - whether to include the context node in
	the walk. Optional parameter that defaults to true, which means we include
	the ctxtNode in the walk.
*/
hs.util.NodeWalker = function(ctxtNode, includeCtxt){
	if(ctxtNode == null || dojo.lang.isUndefined(ctxtNode)){
		throw new hs.exception.Filter(
					"No context given to hs.util.NodeWalker");
	}
	
	if(dojo.lang.isUndefined(includeCtxt)){
		includeCtxt = true;
	}
	
	this._doc = ctxtNode.doc;
	
	// begin by fulling unwinding the entire document into an XPath
	// node list, and then just iterate through this list

	/**
	  XPath: Do a union (|) to grab both our starting node as well as all of
	  it's following children and siblings.
	 */
	var xpath;
	if(includeCtxt){
		xpath = "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "//descendant-or-self::outline"
				+ " | "
				+ "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "/following::outline";
	}else{
		// different axis: descendant versus descendant-or-self
		xpath = "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "//descendant::outline"
				+ " | "
				+ "//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":number = '" + ctxtNode.number + "']"
				+ "/following::outline";
	}
	var domNodes = this._doc.dom.selectNodes(xpath);

	if(domNodes == null || domNodes.length == 0){
		throw new hs.exception.Jump(
						"Could not create NodeWalker starting from: " + ctxtNode.number,
						this._doc, this._doc.address);
	}
	
	this._domNodes = domNodes;
}

dojo.lang.extend(hs.util.NodeWalker, {
	/** 
	  	Our fully unrolled, non-hierarchical list of dom nodes that we can walk to,
	  	thanks to XPath.
	 */
	_domNodes: null,	
	
	/** Our current index into our domNodes. */	
	_index: 0,
	
	/** Our current hs.model.Document. */
	_doc: null,

	/**
		Whether there is another hs.model.Node to walk.
		
		@returns Boolean
	*/
	hasNext: function(){
		if(this._index >= this._domNodes.length){
			return false;
		}else{
			return true;
		}
	},

	/**
		Returns the next hs.model.Node encountered by this walker.
		
		@returns hs.model.Node
	*/
	next: function(){
		if(this.hasNext() == false){
			throw new hs.exception.Filter("No more nodes to walk");
		}
		
		// get the next DOM node
		var currentDomNode = this._domNodes.item(this._index);
		
		// move the index forward
		this._index++;
		
		// turn this DOM node into an hs.model.Node
		var node = new hs.model.Node(currentDomNode, this._doc);
		
		return node;
	}
});


/**
	Tokenizes a node number, such as 1B22C2A, and returns each level as a 
	single number to easily step through a hierarchical node number. Numbering
	always starts at 1.
*/

/**
	@param nodeNumber : String The node number to tokenize, such as "2A5B".
	@throws hs.exception.InvalidAddress
*/
hs.util.NodeNumberTokenizer = function(nodeNumber){
	if(nodeNumber == null || dojo.lang.isUndefined(nodeNumber)
		|| nodeNumber == "0"){
		throw new hs.exception.InvalidAddress("Invalid node number: " + nodeNumber);		
	}
	
	var piece;
	var currentValue;
	while(nodeNumber != ""){
		// consume next piece of number
		if(/^[0-9]+/i.test(nodeNumber)){ // number
			piece = nodeNumber.match(/^([0-9]+)/i);
			nodeNumber = nodeNumber.replace(/^[0-9]+/i, "");
			piece = piece[1];
			piece = new Number(piece).valueOf();
			this._numbers.push(piece);
		}else if(/^[A-Z]+/i.test(nodeNumber)){ // letter
			piece = nodeNumber.match(/^([A-Z]+)/i);
			nodeNumber = nodeNumber.replace(/^[A-Z]+/i, "");
			piece = piece[1];
			
			// turn letter into a number
			// convert our piece from base 26 to
			// a base 10 number system using
			// a base conversion algorithm
			var stack = new Array();
			for(var i = 0; i < piece.length; i++){
				// convert ASCII code to number;
				// the ASCII code for A is 65, while Z is 90
				var letter = piece.charCodeAt(i);
				var value = letter - 65;
				stack.push((value % 10) + 1);
			}
			
			// collect digits together
			var i = 1;
			var result = 0;
			while(stack.length != 0){
				var value = stack.pop(); // get next base value
				value = value * i;
				result += value;
				i = i * 10; 
			}
			
			this._numbers.push(result); 
		}else{
			dojo.raise("Programming exception in hs.util.NodeNumberTokenizer: "
						+ nodeNumber);
		}
	}
}

dojo.lang.extend(hs.util.NodeNumberTokenizer, {
	_numbers: new Array(),
	
	/** 
		Whether there is another level to return.
		
		@returns Boolean
	*/
	hasNext: function(){
		 return (this._numbers.length > 0);
	},

	/** 
		Returns the next integer in the node number counting.
		
		@throws hs.exception.InvalidAddress
		@returns Integer
	*/
	next: function(){
		if(this.hasNext() == false){
			throw new hs.exception.InvalidAddress("No more pieces: " + this._numbers);
		}
		
		return this._numbers.shift();
	}
});




/**
	Will asychronously load a set of XSLT files, tell you when they are loaded,
	transform them into XML DOMs, and return them by name. Used by such filters
	as the Render filter to get their job done.
*/

/**
	
	Constructor. Loads the given XSLT files asychronously and tells you when it is
	done.
  
	@params files : Array An array of object literals, where each object has a
	member named 'name' that has the unique name of this XSLT, and 'url' which
	has the URL to this XSLT file. Example:
		files =
			[ 
				{ name: "render", url: "../../render.xslt" }
				{ name: "transclude", url: "../../transclude.xslt" }
			];
	@params loadedHandler : Function A callback function that is called when the
	files are finished loading, or with an error if an error occurs. Example:
		loadedHandler = function(success : Boolean, error : hs.util.InvalidAddress)
 */
hs.util.XSLTLoader = function(files, loadedHandler){
	this._loadedHandler = loadedHandler;
	this._files = files;
}

dojo.lang.extend(hs.util.XSLTLoader, {
	_xslt: new Object(),
	_files: null,	
	_filesLoaded: 0,
	_loadedHandler: null,


	/**
	  Begins the loading process.
	 */
	load: function(){
		// make sure Sarissa is loaded before we do anything
		if(typeof Sarissa == "undefined"){
			this._waitForSarissa();
		}else{
			this._loadFiles();
		}
	},

	/**
	  Returns the XSLTProcessor for the given XSLT script with the given name.
	  The name was controlled with the 'files' parameter passed in to the
	  constructor.
	  
	  @returns XSLTProcessor Returns the given XSLTProcessor for the given name,
	  null if it is not found.
	 */
	getXSLT: function(name){
		var xslt = this._xslt[name];
		
		if(xslt == null 
				|| dojo.lang.isUndefined(xslt)){
			return null;
		}
		
		return xslt;
	},
	
	_loadFiles: function(){
		for(var i = 0; i < this._files.length; i++){
			this._load(this._files[i].name, this._files[i].url);
		}
	},
	
	_getDocRoot: function(){
		var url = window.location.href;
		var endCut = null, hasFilename = false;
		
		// chop off any filenames
		for(var i = url.length; i--; i >= 0){
			// url[i] not supported on IE, because
			// underlying window.location.href is not
			// a String object but something native
			if(url.charAt(i) == "/"){
				if(hasFilename){
					endCut = i + 1;
				}
				break;
			}else if(url.charAt(i) == "."){
				hasFilename = true;
			}
		}

		if(hasFilename){
			url = url.substring(0, endCut);
		}
		return url;
	},
	
	_load: function(name, url){
		// expand the URL if it does not start with scheme://
		// or start with an /
		if(/[^:]*:/.test(url) == false && url.charAt(0) != "/"){
			url = this._getDocRoot() + url;
		}
	
		var self = this;
	
		// load the file
		var bindArgs = {
			url:		url,
			sync:		djConfig.testing,
			mimetype:	"text/plain",
			error:		function(type, errObj){
				// dojo returns too much programmy information in
				// the error message; remove that part
				var message = errObj.message;
				if(message.indexOf("XMLHttpTransport Error:") != -1){
					message = message.replace(/XMLHttpTransport Error:/, "");
				}
				
				var exp = new hs.exception.InvalidAddress(
								"The following error occurred for " 
								+ url
								+ ": " + message);
								
				// indicate that we failed
				self._loadedHandler.call(null, false, exp);
			},
			load:		function(type, data, evt){
				// create an instance of XSLTProcessor
				var processor = new XSLTProcessor();
				
				// create a DOM Document containing an XSLT stylesheet
				var xslDoc = Sarissa.getDomDocument();
				xslDoc = (new DOMParser()).parseFromString(data, "text/xml");
				
				// make the stylesheet reusable by importing it in the 
				// XSLTProcessor
				processor.importStylesheet(xslDoc);
				
				// store this XSLT transformer
				self._xslt[name] = processor;
				
				// see if we are done
				self._filesLoaded++;
				if(self._filesLoaded >= self._files.length){
					self._loadedHandler.call(null, true, null);
				}
			}
		};
		
		// dispatch the request
		dojo.io.bind(bindArgs);
	},
	
	_waitForSarissa: function(){
		var self = this;
		var sarissaTimer = window.setInterval(function(){
			if(typeof Sarissa != "undefined"){
				window.clearInterval(sarissaTimer);
				self._loadFiles();
			}
		}, 20);
	}
});


/**
  Adds dojo.dom.setAttributeNS into dojo.dom if it is not
  there in this version of Dojo; this is a custom method 
  we added to Dojo which is in the Dojo repository but is
  not in a release copy yet.
 */
if(typeof dojo.dom.setAttributeNS == "undefined"){
	/** 
	 * Implements DOM Level 2 setAttributeNS so it works cross browser.
	 *
	 * Example:
	 * dojo.dom.setAttributeNS(domElem, "http://foobar.com/2006/someSpec", 
	 * 							"hs:level", 3);
	 */
	dojo.dom.setAttributeNS = function(elem, namespaceURI, attrName, attrValue){
		if(elem == null || dojo.lang.isUndefined(elem)){
			dojo.raise("No element given to dojo.dom.setAttributeNS");
		}
		
		if(dojo.lang.isUndefined(elem.setAttributeNS) == false){ // w3c
			elem.setAttributeNS(namespaceURI, attrName, attrValue);
		}else{ // IE
			// get a root XML document
			var ownerDoc = elem.ownerDocument;
			var attribute = ownerDoc.createNode(
				2, // node type
				attrName,
				namespaceURI
			);
			
			// set value
			attribute.nodeValue = attrValue;
			
			// attach to element
			elem.setAttributeNode(attribute);
		}
	}
}