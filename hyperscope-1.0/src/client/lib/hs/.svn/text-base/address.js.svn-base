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

	This package provides hs.address, a set of classes for describing
	HyperScope addressing. It consists of the following classes:
	
	hs.address.Address
		A HyperScope address that can be resolved and manipulated. Addresses
		are composed of several hs.address.Pieces, such as an hs.address.FileInfo
		piece to describe it's file and path information.

	hs.address.Piece
		Abstract superclass for all of the kinds of components that can make up 
		an hs.address.Address, such as file information (hs.address.FileInfo), 
		addressing (hs.address.NodeAddress), etc.

	hs.address.FileInfo
		An hs.address.Piece that holds the file information for this Location, 
		such as the path, port, URL scheme, etc.

	hs.address.NodeAddress
		The abstract superclass of all node addressing types, which can address 
		specific portions of a document either directly or indirectly.

	hs.address.Viewspec
		Represents a specific viewspec letter in an hs.address.Address.

	hs.address.ContentFilter
		Represents a content filter at the end of an hs.address.Address, 
		such as ;"foobar";.

	hs.address.NodeNumber
		An hs.address.NodeAddress that is a node number, such as 2A3.

	hs.address.NodeID
		An hs.address.NodeAddress that is a node ID, such as 023.

	hs.address.NodeLabel
		An hs.address.NodeAddress that is a node label, such as foobar.

	hs.address.Marker
		An hs.address.NodeAddress that is a marker, such as @someMarker.

	hs.address.Relative
		An hs.address.NodeAddress that is a single relative address, such as .2u.

	hs.address.IndirectLink
		An hs.address.NodeAddress that is an indirect link, such as .l.

	hs.address.StringSearch
		An hs.address.NodeAddress that is a string search forwards from the 
		present location through the following nodes, such as "foobar".

	hs.address.StringPosition
		An hs.address.NodeAddress that jumps through a single node's textual 
		contents, such as -2w.
*/
	
dojo.provide("hs.address");

dojo.require("dojo.uri.*");
dojo.require("dojo.string.*");


/**
	A HyperScope address that can be resolved and manipulated. Addresses
	are composed of several hs.address.Pieces, such as an hs.address.FileInfo
	piece to describe it's file and path information.
*/

/**
	Creates a new address.
	
	@param url A string url, either complete, such as 
	http://bootstrap.org/test.opml#:x, or relative, such as
	#:x.
	@throws hs.exception.InvalidAddress
*/
hs.address.Address = function(url){
	this.nodeAddresses = new Array();
	this.viewspecs = new Array();

	// tokenize the url
	var tk = new hs.util.AddressTokenizer(url);
	while(tk.hasNext()){
		var p = tk.next();
		
		if(p.isPieceType("hs.address.FileInfo")){
			this.fileInfo = p;
		}else if(p.isPieceType("hs.address.NodeAddress")){
			this.nodeAddresses.push(p);
		}else if(p.isPieceType("hs.address.Viewspec")){
			this.viewspecs.push(p);
		}else if(p.isPieceType("hs.address.ContentFilter")){
			this.contentFilter = p;
		}
	}
}

dojo.lang.extend(hs.address.Address, {
	fileInfo: null, 						/** hs.address.FileInfo */
	nodeAddresses: null, 					/** hs.address.NodeAddress[] */
	viewspecs: null, 						/** hs.address.Viewspecs[] */
	contentFilter: null, 					/** hs.address.ContentFilter */
	
	_handler: null,
	_replacePage: null,
	_relativeTo: null,
	_inclusion: false,
	_includer: null,
	_inclusionParentAddress: null,

	_halted: false,

	/**
		Resolves this address into an hs.model.Document that can be worked with.
		The document that is returned will have it's hs.model.Document.dom
		fully filtered and rendered into it's hs.model.Document.renderHtml string.
		
		@param handler : Function A handler that will receive three arguments
		when the address is resolved:
			handler = function(address : hs.address.Address, 
												 doc : hs.model.Document, 
												 error : hs.exception.InvalidAddress)
			where 'address' is the original, unexpanded address; 'doc' is the
			document resolved and rendered; and 'error' is a possible error that
			occurred.
		@param replacePage : Boolean Whether we should replace the main page if this
		address points to a different location than the current one given by
		'relativeTo'.
		@param relativeTo : hs.model.Document The address we are resolving 
		this address relative to. This is an optional value and can be null
		if we are bootstrapping and simply initially loading a page, for
		example.
		@param inclusion : boolean An optional value that indicates
		that we are doing a resolution for a file that will
		be included; defaults to false.
		@param inclusionParentAddress : hs.address.Address An optional
		value that is the parent address that is including us.
	*/
	resolve: function(handler, replacePage, relativeTo, inclusion, 
						inclusionParentAddress){
		//debug("resolve, replacePage="+replacePage+", relativeTo="+relativeTo+", this="+this.toString());
		this._handler = handler;
		this._replacePage = replacePage;
		
		if(dojo.lang.isUndefined(relativeTo)){
			relativeTo = null;
		}
		this._relativeTo = relativeTo;
		
		if(dojo.lang.isUndefined(inclusion)){
			inclusion = false;
			inclusionParentAddress = this;
		}
		this._inclusion = inclusion;
		this._inclusionParentAddress = inclusionParentAddress;
		
		// if we have no document that we are relativeTo,
		// and we are a relative address, throw an exception
		if(relativeTo == null && this.isRelative()){
			throw new hs.exception.InvalidAddress(
				"Programming error: relative address given to "
				+ "hs.address.Address.resolve() when relativeTo "
				+ "is null; our address=" + this.toString());
		}
		
		if(relativeTo != null){			
			// determine the address being displayed
			var displayedAddr = this._getDisplayedAddress();
			
			// see if we are working with the same file
			var sameFile = this._isSameFile(displayedAddr, relativeTo);
			
			// expand ourselves into a full address
			hs.profile.start("expandall");
			var expandedAddr = this._expandAll(relativeTo, sameFile);
			hs.profile.end("expandall");
			
			// replace the page if replacePage is true and this
			// address is different than the current address
			if(replacePage == true && sameFile == false){
				this._changeDisplayedAddress(expandedAddr);
				if(djConfig.testing == false){
					return;
				}
			}
			
			// make sure to copy our initial state,
			// such as whether to replace the page
			// and what we are relative to
			expandedAddr = this._copyInitialState(expandedAddr);
			
			// load this expanded address
			this._load(expandedAddr);
		}else{
			// load this full address, but consolidate relative dots first
			var finalAddr = this.clone();
			finalAddr.fileInfo.consolidateRelativeDots();
			
			// make sure to copy our initial state,
			// such as whether to replace the page
			// and what we are relative to
			finalAddr = this._copyInitialState(finalAddr);
			
			this._load(finalAddr);
		}
	},
	
	/**
		Returns this address as a string. For example, 
		if the address is "#:x", then "#:x" is returned.
		
		@returns String
	*/
	toString: function(){
		var s = new hs.util.AddressSerializer(this);
		
		return s.serialize();
	},

	/**
		Determines if the given address is equal to this URL.
		
		@param addr Either an hs.address.Address or a String.
		@returns Boolean
	*/
	equals: function(addr){
		if(addr == null || dojo.lang.isUndefined(addr)){
			return false;
		}
		
		if(dojo.lang.isString(addr)){
			addr = new hs.address.Address(addr);
		}
		
		var addrStr = addr.toString();
		var thisStr = this.toString();
		return (addrStr == thisStr);
	},
	
	/**
	  Returns whether this address is relative or not, i.e.
	  it has a host, a scheme, a path, etc. 
	  For example, these are relative:
	  ../someFile
	  #2A:x
	  while this is not:
	  http://foobar.com
	  
	  @returns Boolean
	 */
	isRelative: function(){
		return this.fileInfo.isRelative();
	},
	
	clone: function(){
		var a = new hs.address.Address(this.toString());
		
		return a;
	},
	
	/**
	  Replaces resolution of this address with a 
	  new one, halting this one. Used for link
	  types that need to halt and take over resolution
	  in the middle, such as for indirect links.
	  
	  @param linkAddr : hs.address.Address The
	  address of the new address to start resolving.
	  @parma doc : hs.model.Document The document
	  that was being resolved before we halted
	  and replaced it's resolution.
	 */
	replaceResolution: function(linkAddr, doc){
		this._halted = true;
		
		// resolve this address in the same
		// way we were
		linkAddr.resolve(
						this._handler, 
						this._replacePage, 
						doc, 
						this._inclusion, 
						this._inclusionParentAddress);
	},

	/**
		Determines if the address given is referencing the same file as us.
		Both addresses have their file portion expanded before checking.
		
		@param address An hs.address.Address or a String to compare against.
		@param relativeTo : hs.model.Document A document to expand against.
		@returns Boolean
		@throws hs.exception.InvalidAddress
	*/
	_isSameFile: function(address, relativeTo){
		// see if 'address' is an hs.address.Address
		if(dojo.lang.isUndefined(address.resolve) == true){
			address = new hs.address.Address(address);
		}
		
		relativeTo = relativeTo.address.fileInfo;
		var f1 = address.fileInfo.expand(relativeTo);
		var f2 = this.fileInfo.expand(relativeTo);
		
		return (f1.equals(f2));
	},
	
	/**
		Expands the file portion of an address, relative to the given document.
		For example, if this address is just "#:x", then we use the document
		given for file information and possibly expand it to
		http://bootstrap.org/neuberg/arch.opml#:x, if that is the file
		address of the given document.
		
		This method does not change the address it is called on; instead, it
		returns a new address that has been expanded.
		
		@param relativeTo : hs.model.Document
		@returns hs.address.Address
	*/
	_expandFileInfo: function(relativeTo){
		// if relativeTo is null, and we are not already expanded,
		// then throw an exception
		if(relativeTo == null && this.fileInfo.isRelative() == false){
			throw new hs.exception.InvalidAddress("No document to expand "
													+ "relative address against: "
													+ this.toString());
		}
		
		var expandedFile = this.fileInfo.expand(relativeTo.address.fileInfo);
		var results = this.clone();
		results.fileInfo = expandedFile;
		
		return results;
	},
	
	/**
		Expands the node address portion of an address, if none was given. For
		example, if the address is "#:x", this would add the default node
		address of 0: "#0:x".
		
		This method does not change the address it is called on; instead, it
		returns a new address that has been expanded.
		
		@param relativeTo : hs.model.Document the hs.model.Document to
		get the context node address to write in if it is not present.
		@returns hs.address.Address
	*/
	_expandNodeAddress: function(doc){
		var addr = this.clone();
		
		// if we have a node number or a node ID then return
		if(this.nodeAddresses.length > 0){
			var p = this.nodeAddresses[0];
			if(p.isPieceType("hs.address.NodeNumber") == true && p.isOffset == true){
				return addr;
			}
			
			if(p.isPieceType("hs.address.NodeID") == true){
				return addr;
			}
		}
		
		// see if the doc has a node context yet
		var number = "0";
		if(doc.nodeCtxt != null 
			&& dojo.lang.isUndefined(doc.nodeCtxt) == false){
			number = doc.nodeCtxt.number;
		}
		
		var nodeCtxt = new hs.address.NodeNumber(number, false);
		
		// add our new nodeCxt at the beginning of our node addresses
		addr.nodeAddresses = [nodeCtxt].concat(addr.nodeAddresses);
		
		return addr;
	},
	
	/**
		Takes the hs.model.Document's relativeTo's viewspecs, and prepends them
		before this addresses viewspecs if it is a relative address. Needed to
		get the true, full list of viewspecs that an address truly talks about
		for resolution, since old viewspecs are also applied to new addresses
		if they are relative.
		
		This method does not change the address it is called on; instead, it
		returns a new address that has been expanded.
		
		@param relativeTo : hs.model.Document
		@returns hs.address.Address
	*/
	_expandViewspecs: function(relativeTo){
		var addr = this.clone();
		
		// only append viewspecs if we have some old ones
		if(relativeTo.currentViewspecs == null){
			return addr;
		}
		
		// turn existing viewspecs into string then
		// push to beginning of what we have
		var oldViews = relativeTo.currentViewspecs.toString();
		var results = new Array();
		for(var i = 0; i < oldViews.length; i++){
			var currentView = new hs.address.Viewspec(oldViews.charAt(i));
			results.push(currentView);
		}
		addr.viewspecs = results.concat(addr.viewspecs);
		
		return addr;
	},
	
	/**
		Copies any content filter to our new expanded
		address.
		
		@param relativeTo : hs.model.Document
	 */
	_expandContentFilter: function(relativeTo){
		var addr = this.clone();
		
		if(relativeTo.address.contentFilter != null
			&& addr.contentFilter == null){
			var newFilter = relativeTo.address.contentFilter.clone();
			addr.contentFilter = newFilter;	
		}
		
		return addr;
	},
	
	/**
	  	Fully expands all parts of this address.
	  	
	  	@param relativeTo : hs.model.Document
	  	@param sameFile : Boolean whether this address refers
	  	to the same file as the address of relativeTo.
	  	@returns hs.address.Address
	 */
	_expandAll: function(relativeTo, sameFile){
		var expandedAddr = this._expandFileInfo(relativeTo);	

		// don't expand the rest if we are not dealing with
		// the same file
		if(sameFile == false){
			return expandedAddr;
		}

		expandedAddr = expandedAddr._expandNodeAddress(relativeTo);
		expandedAddr = expandedAddr._expandViewspecs(relativeTo);
		expandedAddr = expandedAddr._expandContentFilter(relativeTo);
		
		return expandedAddr;
	},
	
	_copyInitialState: function(addr){
		addr._replacePage = this._replacePage;
		addr._relativeTo = this._relativeTo;
		addr._inclusion = this._inclusion;
		addr._inclusionParentAddress = this._inclusionParentAddress;
		addr._handler = this._handler;
		
		return addr;
	},
	
	_getDisplayedAddress: function(){
		// REFACTOR: This should really belong in an hs.Window class
		// to encapsulate seperate HyperScope windows and whether
		// we are unit testing or not
		var docURL = window.location.href;
		if(djConfig.testing == true){ // unit testing
			docURL = hs.model.testingCurrentURL;
		}
		var displayedAddr = new hs.address.Address(docURL);
		
		return displayedAddr;
	},
	
	_changeDisplayedAddress: function(addr){
		// REFACTOR: This should really belong in an hs.Window class
		// to encapsulate seperate HyperScope windows and whether
		// we are unit testing or not
		if(djConfig.testing == true){ // unit testing
			hs.model.testingCurrentURL = addr.toString();
		}else{
			window.location.href = addr.toString();
		}
	},
	
	_load: function(addr){
		if(addr == null || dojo.lang.isUndefined(addr)){
			addr = this;
		}
		
		hs.profile.start("_load");
		var loadHandler = dojo.lang.hitch(this, this._loadHandler);
		var fetcher = new hs.util.XMLFetcher();
		fetcher.load(addr, loadHandler);
		hs.profile.end("_load");
	},
	
	_loadHandler: function(address, dom, error){
		try{
			//debug("_loadHandler, address="+address+", dom="+dom+", error="+error);
			if(error != null && dojo.lang.isUndefined(error) == false){
				this._handler.call(null, this, null, error);
				return;
			}
			
			hs.profile.start("loadHandler");
			
			// create our Document
			var doc = new hs.model.Document(address, dom);
	
			// execute node addressing
			doc = this._applyNodeAddressing(address, doc);
			
			// see if our resolution has been halted
			if(address._halted == true){
				address._halted = false;
				return;	
			}
	
			// figure out what our viewspecs are
			doc = this._applyViewspecs(address, doc);		
			
			// execute transclusions if we are to do so
			if(doc.currentViewspecs.runSequenceGenerators() == true
				|| this._inclusion == true){
				// we must avoid infinite recursive inclusion loops;
				// this can happen if we are transcluding our own
				// document, which will cause transclusions to expand
				// and the process will repeat again
				if(this._inclusion == false
					|| address.fileInfo.equals(this._inclusionParentAddress.fileInfo) == false){
					this._includer = new hs.filter.Transcluder(address);
					var self = this;
					this._includer.apply(doc, dojo.lang.hitch(this, function(doc, error){
						// use a closure to pass in what our address is
						self._transclusionDone(address, doc, error);	
					}));
					
					// we must now wait asychronously to run the
					// rest until the transcluder is done getting
					// it's files
					return;
				}
			}
			
			// run content filters
			doc = this._executeContentFilter(address, doc);
			
			// minimize our address to have things like a 
			// default node address if needed 
			doc = this._minimizeAddress(doc);
			
			hs.profile.end("loadHandler");
			
			this._doneResolving(doc, error);
		}catch(exp){
			this._handler.call(null, this, null, exp);
		}
	},
	
	_applyNodeAddressing: function(address, doc){
		// execute our node addressing portion
		for(var i = 0; i < address.nodeAddresses.length; i++){
			var p = address.nodeAddresses[i];
			p.apply(doc, null, address);
			
			// see if our resolution has been halted
			if(address._halted == true){
				break;
			}
		}
		
		return doc;
	},
	
	_applyViewspecs: function(address, doc){
		// apply our viewspecs
		for(var i = 0; i < address.viewspecs.length; i++){
			var v = address.viewspecs[i];
			doc.currentViewspecs.add(v);
		}
		
		return doc;
	},
	
	_doneResolving: function(doc, error){
		// we're done resolving
		this._handler.call(null, this, doc, error);
	},
	
	_executeContentFilter: function(address, doc){
		if(address.contentFilter != null){
			address.contentFilter.apply(doc);
		}
		
		return doc;
	},
	
	_minimizeAddress: function(doc){
		// our Document's address is correct, but not
		// minimized, which means it might have things like the
		// default context, such as #0, and spurious viewspecs
		var docUrl = doc.toURL();
		
		doc.address = new hs.address.Address(docUrl);
		
		return doc;
	},
	
	_transclusionDone: function(address, doc, error){
		//debug("transclusionDone, address="+address+", doc="+doc+", error="+error);
		if(error != null && dojo.lang.isUndefined(error) == false){
			this._handler.call(null, this, doc, error);
			return;
		}
		
		// see if we need to re-create our document
		// metadata, such as node numbers and levels
		if(this._includer.metadataDirty == true){
			doc.normalize();
		}
		
		// now finish the rest of the address
		// resolution process
		doc = this._executeContentFilter(address, doc);
		doc = this._minimizeAddress(doc);
		
		hs.profile.end("loadHandler");
		
		this._doneResolving(doc, error);
	}
});
	
	
/** 
	Abstract superclass for all of the kinds of components that can make up 
	an hs.address.Address, such as file information (hs.address.FileInfo), 
	addressing (hs.address.NodeAddress), etc.
	
	<<abstract>>
*/

hs.address.Piece = function(){
}

dojo.lang.extend(hs.address.Piece, {
	/** 
		Turns this piece into a string representation of it's data.
		
		<<abstract>>
		@returns String
	*/
	toString: function(){
		dojo.raise("Abstract method");
	},

	/**
		Determines if this piece is the given piece type, which is it's full class
		name. For example, if I want to see if a piece is an hs.address.NodeNumber,
		I would pass this method the string "hs.address.NodeNumber". Subclasses
		should test against their full class name, including whatever parent
		subclasses they may have, such as hs.address.NodeAddress.
		
		<<abstract>>
		@param className : String
		@returns Boolean
	*/
	isPieceType: function(className){
		dojo.raise("Abstract method");
	}
});



/**
	An hs.address.Piece that holds the file information for this Location, 
	such as the path, port, URL scheme, etc. If this URL has an anchor
	then the anchor info is dropped and not stored.
*/

/** 
	@param url : String Used to construct the file information.
	@throws hs.exception.InvalidAddress
*/
hs.address.FileInfo = function(url){
	this._parse(url);
}

dojo.inherits(hs.address.FileInfo, hs.address.Piece);

dojo.lang.extend(hs.address.FileInfo, {
	scheme: null,
	host: null,
	port: null,
	path: null, /** path + file */
	query: null,
	
	/**
		Whether this FileInfo has full, non-relative path information, such
		as /neuberg/ versus a relative path, such as
		../foobar/. If the url only has the host name and no
		file or path, such as http://bootstrap.org, then this returns
		true since it refers to the default file to load. If no host name
		is present, but it is a full path, such as /foobar, then this
		returns true.
		
		@returns Boolean
	*/
	hasFullPath: function(){
		// do we have a host?
		if(this.host != null){
			return true;
		}
		
		// is there a leading slash before our path?
		if(dojo.string.startsWith(this.path, "/")){
			return true;
		}
		
		// is there a leading backslash before our path (from some window platforms)?
		if(dojo.string.startsWith(this.path, "\\")){
			return true;
		}
		
		return false;
	},
	
	/** 
		Expands this FileInfo with full protocol, path and file information relative
		to some other hs.address.FileInfo. This FileInfo stays unchanged, and instead 
		a new FileInfo is returned that is expanded.
		
		@param relativeToFile hs.address.FileInfo
		@returns hs.address.FileInfo The expanded FileInfo.
	*/
	expand: function(relativeToFile){
		// make copies of the FileInfo's we are working
		// with to leave the original's alone
		var f = this.clone();
		
		relativeToFile = relativeToFile.clone();
		
		// are we not relative?
		if(this.isRelative() == false){
			// just consolidate relative dots
			// i.e.: /../foobar/hello/.. becomes
			// /foobar
			f.consolidateRelativeDots();
			return f;
		}
		
		// is what we are expanding against relative?
		if(relativeToFile.isRelative()){
			throw new hs.exception.InvalidAddress(
				"Programming error: hs.address.FileInfo.expand() "
				+ "was passed a relative path to expand against");
		}
		
		// handle trailing slash issues; if either f or
		// relativeToFile are directories and not files,
		// but have no trailing slashes, add one
		// Example: directory/foobar
		// Result: directory/foobar/
		//
		// Example: /directory/foobar.opml
		// Result: /directory/foobar.opml
		if(f._hasFile() == false && dojo.string.endsWith(f.path, "/") == false){
			f.path += "/";
		}
		
		if(relativeToFile._hasFile() == false && dojo.string.endsWith(relativeToFile.path, "/") == false){
			relativeToFile.path += "/";
		}
		
		// if f's path is simply ./, which means it's basicly empty, then
		// just get rid of it
		if(f.path == "./"){
			f.path = "";
		}

		// handle the following special cases when building
		// up our final expanded path:
		
		// if we start with a slash, then replace relativeToFile's
		// path with our own
		// Example f: /../foobar.opml
		// Example relativeToFile: http://bootstrap.org/../directory/foobar
		// Result: http://bootstrap.org/../foobar.opml
		
		// if we have a filename, and so does our relativeToFile,
		// then strip off the one on relativeToFile to leave
		// just a directory path
		// Example f: someFile.opml
		// Example relativeToFile: http://bootstrap.org/../directory/foobar.xml
		// Result: http://bootstrap.org/../directory/someFile.opml
		
		// if we do not have a filename, but our relativeToFile does,
		// then remove relativeToFile's filename and paste us first.
		// one exception: if f is blank, don't do this
		// Example f: directory/somewhere
		// Example relativeToFile: http://bootstrap.org/anotherfile.opml
		// Results: http://bootstrap.org/directory/somewhere
		
		// anything else, we simply add our relativeToFile's path
		// to f's path.
		
		if(dojo.string.startsWith(f.path, "/")){
			relativeToFile.path = f.path;
		}else if(f._hasFile() && relativeToFile._hasFile()){
			// remove the file name from relativeToFile
			relativeToFile.path = relativeToFile._getDirectoryPath();
			
			// add them together
			f.path = relativeToFile.path + f.path;
		}else if(f.path != "" && f._hasFile() == false && relativeToFile._hasFile()){
			// remove the file name from relativeToFile
			relativeToFile.path = relativeToFile._getDirectoryPath();
			
			// add them together
			f.path = relativeToFile.path + f.path;
		}else{
			f.path = relativeToFile.path + f.path;		
		}
		
		// if we both have query strings, keep ours
		if(f.query != null && relativeToFile.query != null){
			relativeToFile.query = f.query;
		}
		
		// copy over our information
		f.scheme = relativeToFile.scheme;
		f.port = relativeToFile.port;
		f.host = relativeToFile.host;
		f.query = relativeToFile.query;
		
		// get rid of trailing /./, such as http://bootstrap.org/./
		if(dojo.string.endsWith(f.path, "/./")){
			f.path = f.path.replace(/(\/\.\/)$/, "/");
		}
		
		// now consolidate double relative dots. 
		// example: /../foobar/somedir/../hello/hello.opml becomes
		// /foobar/hello/hello.opml
		f.consolidateRelativeDots();

		return f;
	},
	
	equals: function(f){
		if(f == null || dojo.lang.isUndefined(f)){
			return false;
		}
		
		if(f.scheme == this.scheme
			&& f.port == this.port
			&& f.host == this.host
			&& f.query == this.query
			&& f.path == this.path){
			return true;		
		}else{
			return false;
		}
	},

	/**
		Returns this FileInfo as a string, un-expanded. For example, if this
		FileInfo just had the path and file, such as "/neuberg/arch.opml",
		then this is all that would be returned. Spaces are not encoded
		as %20.
		
		@returns String
	*/
	toString: function(){
		var s = new String();
		
		if(this.scheme != null && this.host != null){
			s += this.scheme + "://";
		}
		
		if(this.host != null){
			s += this.host;
		}
		
		if(this.host != null && this.port != 80){
			s += ":" + this.port;
		}
		
		if(this.path != null){
			s += this.path;
		}

		if(this.query != null){
			s += this.query;
		}
		
		return s;
	},
	
	/**
		Clones this FileInfo.
		
		@returns hs.address.FileInfo
	*/
	clone: function(){
		var f = new hs.address.FileInfo(this.toString());
		f.scheme = this.scheme;
		f.host = this.host;
		f.port = this.port;
		f.path = this.path;
		f.query = this.query;
		
		return f;
	},
	
	isPieceType: function(className){
		if(className == "hs.address.FileInfo"){
			return true;
		}else{
			return false;
		}
	},
	
	/**
	  Returns whether this URL is relative or not.
	 */
	isRelative: function(){
		if(this.scheme == null
			|| this.host == null
			|| this.path == null){
			return true;
		}else{
			return false;
		}
	},
	
	/** 
	  Consolidates the dots in a full non-relative URL into their final, 
	  non-dot form.
	  
	  Example input: /../foobar/hello/world/../somefile.opml
	  Example output: /foobar/hello/somefile.opml
	 */
	consolidateRelativeDots: function(){
		if(this.isRelative() == true
			|| this.path == null
			|| dojo.string.startsWith(this.path, "/") == false
			|| this.path == "/"){
			return;
		}
		
		// tokenize our path into pieces
		var pathPieces = this.path.match(/([^\/]*)/g);
		pathPieces.shift();
		
		// push each one onto a stack, 'popping' directory 
		// names off the stack if we have a ..
		var pathStack = new Array();
		for(var i = 0; i < pathPieces.length; i++){
			if(pathPieces[i] != ".." && pathPieces[i] != "." && pathPieces[i] != ""){
				pathStack.push(pathPieces[i]);
			}else if(pathPieces[i] == ".." && pathStack.length != 0){
				pathStack.pop();
			}else if(pathPieces[i] == "." || pathPieces[i] == ".." || pathPieces[i] == ""){
				// throw away
			}
		}
		
		// now add our slashes back in
		var results = "/" + pathStack.join("/");
		
		// add a trailing slash if we don't have a filename
		if(this._hasFile() == false 
			&& dojo.string.endsWith(results, "/") == false){
			results = results + "/";
		}
		
		this.path = results;
	},
	
	_hasFile: function(){
		if(this.path != null && dojo.string.endsWith(this.path, "/")){
			return false;
		}
		
		var hasFileTester = /((?:[^\.\/]*\.[^\.\/]+)+)$/;
		return hasFileTester.test(this.path);
	},
	
	_getFile: function(){
		if(this._hasFile() == false){
			return null;
		}
		
		var hasFileTester = /((?:[^\.\/]*\.[^\.\/]+)*)$/;
		return this.path.match(hasFileTester)[1];
	},
	
	_getDirectoryPath: function(){
		var fileName = this._getFile();
		var cutAt = this.path.indexOf(fileName);
		var dirPath = this.path.substring(0, cutAt);
		
		// if there is no trailing slash add one
		if(dojo.string.endsWith(dirPath, "/") == false){
			dirPath += "/";
		}
		
		return dirPath;
	},
	
	_startsWithDomain: function(str){
		if(str == null 
			|| dojo.string.startsWith(str, "/")
			|| dojo.string.startsWith(str, ".")
			|| dojo.string.trim(str) == ""
			|| /^[^\?\:#]*:\/\//.test(str) == true){ /** scheme: */
			return false;
		}
		
		var potentialDomain = /^([^\/\:]*)/;
		var domain = null; 
		if(potentialDomain.test(str) == true){
			potentialDomain = str.match(potentialDomain)[1];
			// do we even have a dot?
			if(str.indexOf(".") == -1){
				domain = null;
			}else if(/[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/.test(potentialDomain) == true){
				// ip address
				domain = potentialDomain;
			}else if(potentialDomain == "localhost"){
				domain = "localhost";
			}else{
				// do we only have two letters at the end?
				// then we are a country code
				if(/\.[a-z][a-z]$/i.test(potentialDomain) == true){
					domain = str;	
				}
				
				// are we a standard TLD?
				var tld = [ /\.example$/i, /\.invalid$/i, /\.test$/i, /\.arpa$/i, /\.aero$/i, 
							/\.biz$/i, /\.com$/i, /\.coop$/i, /\.edu$/i, /\.gov$/i, /\.info$/i,
							/\.int$/i, /\.mil$/i, /\.mobi$/i, /\.museum$/i, /\.name$/i, /\.net$/i,
							/\.org$/i, /\.pro$/i, /\.travel$/i, /\.asia$/i, /\.post$/i, /\.tel$/i,
							/\.geo$/i ];
				for(var i = 0; i < tld.length; i++){
					if(tld[i].test(potentialDomain) == true){
						domain = potentialDomain;
						break;
					}
				}
			}
		}
		
		if(domain == null){
			return false;
		}else{
			return true;
		}
	},
	
	_parse: function(url){
		if(url == null || dojo.lang.isUndefined(url)){
			throw new hs.exception.InvalidAddress("Programming error, "
													+ "Invalid address: " + url);
		}
		
		url = dojo.string.trim(url);
		
		// normalize empty urls to ./
		if(url == ""){
			url = "./";
		}
		
		// remove everything after the hash mark
		url = url.replace(/(#.*)/, "");
		
		// transform encoded %20 values into spaces
		url = url.replace(/%20/, " ");
		
		// make sure we don't just have scheme:// and nothing else
		if(/^[^\?\:#]*:\/\/$/.test(url)){ /** scheme:// */
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// handle full (http://...) and partial (someDir/someFile.opml) 
		// addresses differently
		if(/^[^\?\:#]*:/.test(url) || this._startsWithDomain(url)){ /** scheme: or somedomain.org/*/
			this._parseFullUrl(url);		
		}else{
			this._parsePartialUrl(url);
		}
		
		// make sure out path doesn't have incorrect, multiple slashes (i.e. dir///dir)
		if(this.path != null && /\/{2,}/.test(this.path)){
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// make sure our query doesn't have incorrect, multiple question marks (i.e. ?f?o?o)
		if(this.query != null && url.split("?").length > 2){
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// add a trailing slash if we are not dealing with a filename
		// and don't have one already
		if(this._hasFile() == false 
			&& dojo.string.endsWith(this.path, "/") == false){
			this.path += "/";
		}
	},
	
	/** Example: http://foobar.com/hello.opml or somedomain.org/hello.opml*/
	_parseFullUrl: function(url){
		var origUrl = url;
		
		// if we don't have a scheme and port, just add defaults
		if(this._startsWithDomain(url)){
			url = "http://" + url;
		}
		
		// transform into a URI object to retrieve out each value
		url = new dojo.uri.Uri(url);
		
		// set and normalize the values
		
		// scheme
		this.scheme = url.scheme;
		if(dojo.lang.isUndefined(this.scheme) || this.scheme == null){
			this.scheme = "http";
		}
		// only http and https supported
		if(this.scheme != "http" && this.scheme != "https"){
			throw new hs.exception.InvalidAddress("? " + url);
		}
		
		// port
		this.port = url.port;
		if(dojo.lang.isUndefined(this.port) || this.port == null){
			this.port = 80;
		}
		// make sure it's a number, not a string
		if(this.port != null){
			this.port = new Number(this.port).valueOf(); 
		}
		
		// host
		this.host = url.host;
		if(dojo.lang.isUndefined(this.host)){
			this.host = null;
		}
		
		// path
		this.path = url.path;
		if(dojo.lang.isUndefined(this.path)){
			this.path = null;
		}
		// get rid of blank paths
		if(this.path != null && dojo.string.trim(this.path) == ""){
			this.path = null;
		}
		// turn /./ into /
		if(this.path == "/./"){
			this.path = "/";
		}
		
		// query
		this.query = url.query;
		if(dojo.lang.isUndefined(this.query)){
			this.query = null;
		}
		// add ? to query and trim spaces
		if(this.query != null){
			this.query = dojo.string.trim(this.query);
			if(this.query == ""){
				this.query = null;
			}
		}
		// get rid of blank queries
		if(this.query != null && dojo.string.startsWith(this.query, "?") == false){
			this.query = "?" + this.query;
		}
		
		// miscellaneous
		
		// if we just have a host and no path, normalize the path to /
		if(this.host != null && this.path == null){
			this.path = "/";
		}
	},
	
	/** Example: /someDir/someFile.opml?param1=param2 */
	_parsePartialUrl: function(url){
		// parse out the path and query
		var m = url.match(/^([^\?#]*)(\??[^#]*)#?.*$/);
		if(m[1] != null && !dojo.lang.isUndefined(m[1])
			&& dojo.string.trim(m[1]) != ""){
			this.path = m[1];
		}
		
		if(m[2] != null && !dojo.lang.isUndefined(m[2])
			&& dojo.string.trim(m[2]) != ""){
			this.query = m[2];
		}
		
		// normalize empty paths to ./
		if(this.path == null){
			this.path = "./";
		}
		
		
		// normalize .. and . to ../ and ./
		if(this.path == ".."){
			this.path = "../";
		}
		if(this.path == "."){
			this.path = "./";
		}

		// give defaults to the scheme and port
		this.scheme = "http";
		this.port = 80;
	}
});



/**
	The abstract superclass of all node addressing types, which can address 
	specific portions of a document either directly or indirectly.
	
	<<abstract>>
*/

hs.address.NodeAddress = function(){
}

dojo.inherits(hs.address.NodeAddress, hs.address.Piece);

dojo.lang.mixin(hs.address.NodeAddress.prototype, hs.filter.Filter);

dojo.lang.extend(hs.address.NodeAddress, {
});



/**
	Represents a specific viewspec letter in an hs.address.Address.
*/

hs.address.Viewspec = function(letter){
	if(letter == null || dojo.lang.isUndefined(letter)
		|| /^[A-Za-z]$/.test(letter) == false){
		throw new hs.exception.InvalidAddress("? " + letter);
	}
	
	this.letter = letter;
}

dojo.inherits(hs.address.Viewspec, hs.address.Piece);

dojo.lang.extend(hs.address.Viewspec, {
	letter: null, 												/** String */
	
	isPieceType: function(className){
		if(className == "hs.address.Viewspec"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.letter;
	}
});



/**
	Represents a content filter at the end of an hs.address.Address, 
	such as ;"foobar";.
*/

/**
	@param search : String A content filter, either delimited with " for
	simple content filters, such as "foobar", or delimited with / for full
	regular expressions, such as /foobar/i. Semicolons are the content
	filter should have been removed before calling this
	constructor.
	@throws hs.exception.InvalidAddress
*/
hs.address.ContentFilter = function(search){
	// make sure search string is delimited with "double-quotes" or
	// with regular expression slashes and an end letter - /foobar/i
	if(search == null || dojo.lang.isUndefined(search)
		|| /(?:^\"(?:\\\"|[^\"])*\"$)|(?:^\/(?:\\\/|[^\/])*\/[a-z]*$)/i.test(search) == false){
		throw new hs.exception.InvalidAddress("? " + search);
	}
	
	if(dojo.string.trim(search) == '""' || search == "//"){
		throw new hs.exception.InvalidAddress("? " + search);
	}
	
	this.search = search;
}

dojo.inherits(hs.address.ContentFilter, hs.address.Piece);

dojo.lang.mixin(hs.address.ContentFilter.prototype, hs.filter.Filter);

dojo.lang.extend(hs.address.ContentFilter, {
	/** Our search string, without semicolon delimiters. */
	search: null,

	/**
		Turns this content filter's data into a string, without semicolon
		delimiters.
		
		@returns String
	*/
	toString: function(){
		return this.search;
	},
	
	apply: function(doc){
		var search = this.search;
		// if we are a string, then create a regular expression
		// that will find only us in a case insensitive way
		// i.e. we only do a full match not a partial match
		if(dojo.string.startsWith(search, '"') == true){
			// take off the quotes
			search = search.substring(1);
			search = search.substring(0, search.length - 1);
			
			// escape our data
			search = this._escapeData(search);
			
			// make our regular expresion
			regExp = new RegExp("(?:^|[ ])" + search + "(?:$|[ ])");
			
			// execute it
			this._doContentFilter(regExp, doc, this.search);
		}else{ // we are already a regular expression
			// turn us from a stringified regular expression
			// into a real one
			var regExp = eval(search);
			
			// execute it
			this._doContentFilter(regExp, doc, this.search);
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.ContentFilter"){
			return true;
		}else{
			return false;
		}
	},
	
	clone: function(){
		var newFilter = new hs.address.ContentFilter(this.search);
		
		return newFilter;
	},
	
	/** 
	  Escapes data from the user that will be included in
	  a regular expression, escaping characters that have meaning
	  for reg exps.
	*/
	_escapeData: function(data){
		data = data.replace(/\\/g, "\\\\");
		data = data.replace(/\[/g, "\\[");
		data = data.replace(/\]/g, "\\]");
		data = data.replace(/\"/g, "\\\"");
		data = data.replace(/\'/g, "\\\'");
		data = data.replace(/\^/g, "\\^");
		data = data.replace(/\*/g, "\\*");
		data = data.replace(/\+/g, "\\+");
		data = data.replace(/\-/g, "\\-");
		data = data.replace(/\?/g, "\\?");
		data = data.replace(/\|/g, "\\|");
		data = data.replace(/\./g, "\\.");
		data = data.replace(/\{/g, "\\{");
		data = data.replace(/\}/g, "\\}");
		data = data.replace(/\,/g, "\\,");
		data = data.replace(/\(/g, "\\(");
		data = data.replace(/\)/g, "\\)");
		data = data.replace(/\:/g, "\\:");
		data = data.replace(/\;/g, "\\;");
		data = data.replace(/\$/g, "\\$");
		data = data.replace(/\=/g, "\\=");
		data = data.replace(/\!/g, "\\!");
	
		return data;
	},
	
	_doContentFilter: function(tester, doc, contentFilter){
		// get our starting context
		var startingNode;
		var includeCtxt;
		var filterType = doc.currentViewspecs.getContentFilterType();
		if(filterType == hs.filter.ViewspecConstants.FILTER_ALL){
			// get the first outline node from the root
			var domNode = doc.getOriginDomNode();
			
			// make sure it is good data
			if(domNode == null){
				throw new hs.exception.Jump("No origin node in document", 
											doc, doc.address);
			}
			
			startingNode = new hs.model.Node(domNode, doc);
			includeCtxt = true;
		}else if(filterType == hs.filter.ViewspecConstants.NEXT_FILTERED_NODE){
			startingNode = doc.nodeCtxt;
			includeCtxt = false;
		}else{ // no content filtering turned on
			// nothing to do
			return;
		}
		
		// get a node walker, starting from the correct context
		var walker = new hs.util.NodeWalker(startingNode, includeCtxt);
		
		// walk our nodes, testing each one with our content
		var foundANode = false;
		var matchingNodes = new Array();
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our content?
			if(node.test(tester)){
				foundANode = true;
				dojo.dom.setAttributeNS(
							node.domNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
								+ ":passes-content-filter",
							"yes");
				
				// persist this node match for a potential
				// context setting
				matchingNodes[matchingNodes.length] = node;
				matchingNodes["_" + node.number] = node;
			}
		}
		
		if(foundANode == false){
			throw new hs.exception.InvalidAddress("? " + contentFilter,
													doc, doc.address);
		}
		
		// set our context node; this is tricky.
		// we want to set our context node to a match, but want
		// to be careful not to rewrite a previous context node
		// setting; save the node address of every match,
		// and compare it against our existing context node at the
		// end; if that context node is in our set, use it; if not, choose
		// the first best matching node
		var existingNumber = doc.nodeCtxt.number;
		if(typeof matchingNodes["_" + existingNumber] == "undefined"){
			// existing context is not a matching node; reset to the
			// first matching node that has a node-counter number
			// closest to ours
			var existingCounter = doc.nodeCtxt.nodeCounter;
			var firstMatch = matchingNodes[0];
			var lastMatch = matchingNodes[matchingNodes.length - 1];
			var useNode = null;
			// if the existing context is smaller than our first node...
			if(existingCounter <= firstMatch.nodeCounter){
				useNode = firstMatch;
			}else if(existingCounter >= lastMatch.nodeCounter){
				// if the existing context is greater than our last node...
				useNode = lastMatch;
			}else{
				// TODO: We could probably use a better algorithm to
				// get a better closest context node to one of the matches
				// then just getting the first match
				useNode = firstMatch;
			}
			doc.nodeCtxt = useNode;
		}
	}
});




/**
	An hs.address.NodeAddress that is a node number, such as 2A3.
*/

/**
 	@param number : String The node number, such as "2A3".
 	@param offset : Boolean Optional parameter that controls whether
 	this is an offset node number, such as !2A3.
 	@throws hs.exception.InvalidAddress
 */
 
hs.address.NodeNumber = function(number, isOffset){
	if(isOffset == null || dojo.lang.isUndefined(isOffset)){
		isOffset = false;
	}
	
	this.isOffset = isOffset;
	
	if(number == null || dojo.lang.isUndefined(number)
		|| /^[0-9]+(?:[a-z0-9]*)$/i.test(number) == false){
		throw new hs.exception.InvalidAddress("? " + number);
	}
	
	// filter out node id's, except for the root node number "0"
	if(dojo.string.startsWith(number, "0") && number != "0"){
		throw new hs.exception.InvalidAddress("? " + number);
	}
	
	this.number = number.toUpperCase();
}

dojo.inherits(hs.address.NodeNumber, hs.address.NodeAddress);

/**
  Factory method that takes a parent node number, such as "2A" and a
  node offset, such as 3, and returns a NodeNumber instance initialized
  with the correct node number, such as "2A3" in the example above.
 */
hs.address.NodeNumber.toNodeNumber = function(parentNodeNumber, nodeOffset){
	if(parentNodeNumber == null || parentNodeNumber == "0"){
		nodeOffset = new Number(nodeOffset).toString();
		return new hs.address.NodeNumber(nodeOffset);
	}else{
		parentNodeNumber = parentNodeNumber.toUpperCase();
		
		// figure out whether we will generate a letter or not
		// (i.e. if we end in a number in our parent node number,
		// use a letter)
		if(/[0-9]$/.test(parentNodeNumber) == true){
			// convert our nodeOffset number from base 10 to
			// a base 26 number system (i.e., the alphabet) using
			// a base conversion algorithm
			var stack = new Array();
			// -1 because we start counting from 1, not
			// 0, while most number systems start at 0
			nodeOffset = nodeOffset - 1;
			while(nodeOffset >= 26){
				stack.push(nodeOffset % 26);

				nodeOffset = nodeOffset / 26;
				nodeOffset--;
			}
			
			// collect digits together
			// the ASCII code for A is 65, while Z is 90
			var letter = nodeOffset + 65;
			var word = String.fromCharCode(letter);
			while(stack.length != 0){
				letter = stack.pop(); // get next base value
				letter = letter + 65; // turn into ASCII
				letter = String.fromCharCode(letter); // turn into string
				word += letter;
			}
			
			return new hs.address.NodeNumber(parentNodeNumber + word);
		}else{ // just add the number
			return new hs.address.NodeNumber(parentNodeNumber + nodeOffset);
		}
	}
}

dojo.lang.extend(hs.address.NodeNumber, {
	number: null,			/** Example: 2A */
	
	/**
		Whether this node number is an offset, such as !2A. An offset
		causes the document's node context to jump forward by the given
		coordinates, relative to the current node context.
	*/
	isOffset: false, 		/** Boolean */
	
	apply: function(doc){
		if(this.isOffset == false){
			doc.jumpNumber(this.number);
		}else{
			doc.nodeCtxt.jumpOffset(this.number);
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.NodeNumber"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.number;
	}
});




/**
	An hs.address.NodeAddress that is a node ID, such as 023.
	
	@param id : String The id of this node, beginning with 0, such as "023".
	@throws hs.exception.InvalidAddress
*/

hs.address.NodeID = function(id){
	if(id == null || dojo.lang.isUndefined(id)
		|| /^0[0-9]+$/.test(id) == false){
		throw new hs.exception.InvalidAddress("? " + id);
	}
	
	this.id = id;
}

dojo.inherits(hs.address.NodeID, hs.address.NodeAddress);

dojo.lang.extend(hs.address.NodeID, {
	id: null,
	
	apply: function(doc){
		doc.jumpId(this.id);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.NodeID"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.id;
	}
});




/**
	An hs.address.NodeAddress that is a node label, such as foobar.
*/

/**
	@param label : String
	@param type One of the constants defined on hs.address.NodeLabel;
	if left out, defaults to hs.address.NodeLabel.START_AT_FIRST.
	@throws hs.exception.InvalidAddress
*/
hs.address.NodeLabel = function(label, type){
	// make sure the label starts with a letter, followed by letters, numbers,
	// underscores, dashes, @ sign, and apostrophe
	if(label == null || dojo.lang.isUndefined(label)
		|| /^[A-Z]+[A-Z0-9_\-\@\']*$/i.test(label) == false){
		throw new hs.exception.InvalidAddress("? " + label);
	}
	
	this.label = label;
	
	if(dojo.lang.isUndefined(type) || type == null){
		type = hs.address.NodeLabel.START_AT_FIRST;
	}
	
	this.type = type;
}

hs.address.NodeLabel.START_AT_FIRST = "start_at_first";
hs.address.NodeLabel.BRANCH_SEARCH = "!";
hs.address.NodeLabel.MOVE_TO_NEXT = "*";
hs.address.NodeLabel.EXTERNAL = "$";

dojo.inherits(hs.address.NodeLabel, hs.address.NodeAddress);

dojo.lang.extend(hs.address.NodeLabel, {
	label: null,							/** String */
	type: null,
	
	apply: function(doc){
		switch(this.type){
			case hs.address.NodeLabel.BRANCH_SEARCH:
				doc.nodeCtxt.jumpBranchSearch(this.label);
				break;
			case hs.address.NodeLabel.START_AT_FIRST:
				doc.jumpLabel(this.label, hs.commands.JumpConstants.FIRST);
				break;
			case hs.address.NodeLabel.MOVE_TO_NEXT:
				doc.jumpLabel(this.label, hs.commands.JumpConstants.NEXT);
				break;
			case hs.address.NodeLabel.EXTERNAL:
				doc.jumpExternal(this.label);
				break;
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.NodeLabel"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.label;
	}
});



/**
	An hs.address.NodeAddress that is a marker, such as @someMarker.
*/

/**
	@param marker : String
	@throws hs.exception.InvalidAddress
*/
hs.address.Marker = function(name){
	// make sure the marker starts with a letter, followed by letters, numbers,
	// underscores, and dashes
	if(name == null || dojo.lang.isUndefined(name)
		|| /^[A-Za-z]+[A-Za-z0-9_\-]*$/.test(name) == false){
		throw new hs.exception.InvalidAddress("? " + name);
	}
	
	this.name = name;
}

dojo.inherits(hs.address.Marker, hs.address.NodeAddress);

dojo.lang.extend(hs.address.Marker, {
	name: null, /** Example: @marker */
	
	apply: function(doc){
		doc.jumpMarker(this.name);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.Marker"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		return this.name;
	}
});




/**
	An hs.address.NodeAddress that is a single relative address, such as .2u.
*/

/**
	@param type One of the relative type constants defined on
	hs.address.Relative, such as NODE_NEXT.
	@param offset : Integer An optional argument that is the number of times
	to apply this relative type, such as .2u. Defaults to 1 if not given.
	@throws hs.exception.InvalidAddress
*/
hs.address.Relative = function(type, offset){
	if(type == null || dojo.lang.isUndefined(type)){
		throw new hs.exception.InvalidAddress("? " + type);
	}
	
	// make sure we start with one of our known types
	switch(type){
		case hs.address.Relative.NODE_NEXT: break;
		case hs.address.Relative.NODE_BACK: break;
		case hs.address.Relative.NODE_UP: break;
		case hs.address.Relative.NODE_DOWN: break;
		case hs.address.Relative.ORIGIN: break;
		case hs.address.Relative.BRANCH_END: break;
		case hs.address.Relative.PLEX_HEAD: break;
		case hs.address.Relative.PLEX_TAIL: break;
		case hs.address.Relative.NODE_SUCCESSOR: break;
		case hs.address.Relative.NODE_PREDECESSOR: break;
		case hs.address.Relative.CONTENT_SEARCH: break;
		case hs.address.Relative.RETURN_NODE: break;
		case hs.address.Relative.RETURN_FILE: break;
		default:
			throw new hs.exception.InvalidAddress("? " + type);
	}
	
	this.type = type;
	
	if(dojo.lang.isUndefined(offset) || offset == null){
		offset = 1;
	}
	
	if(offset <= 0){
		throw new hs.exception.InvalidAddress("? " + offset);
	}
	
	
	this.offset = offset;
}

dojo.inherits(hs.address.Relative, hs.address.NodeAddress);

hs.address.Relative.NODE_NEXT = "n";
hs.address.Relative.NODE_BACK = "b";
hs.address.Relative.NODE_UP = "u";
hs.address.Relative.NODE_DOWN = "d";
hs.address.Relative.ORIGIN = "o";
hs.address.Relative.BRANCH_END = "e";
hs.address.Relative.PLEX_HEAD = "h";
hs.address.Relative.PLEX_TAIL = "t";
hs.address.Relative.NODE_SUCCESSOR = "s";
hs.address.Relative.NODE_PREDECESSOR = "p";
hs.address.Relative.CONTENT_SEARCH = "c";
hs.address.Relative.RETURN_NODE = "r";
hs.address.Relative.RETURN_FILE = "rf";

dojo.lang.extend(hs.address.Relative, {
	type: null,
	offset: 1,						/** Example : 2 from .2u */
	
	apply: function(doc){
		switch(this.type){
			case hs.address.Relative.NODE_NEXT: 
				doc.nodeCtxt.jumpNext(this.offset);
				break;
			case hs.address.Relative.NODE_BACK: 
				doc.nodeCtxt.jumpBack(this.offset);
				break;
			case hs.address.Relative.NODE_UP: 
				doc.nodeCtxt.jumpUp(this.offset);
				break;
			case hs.address.Relative.NODE_DOWN: 
				doc.nodeCtxt.jumpDown(this.offset);
				break;
			case hs.address.Relative.ORIGIN: 
				doc.jumpOrigin();
				break;
			case hs.address.Relative.BRANCH_END: 
				doc.nodeCtxt.jumpBranchEnd();
				break;
			case hs.address.Relative.PLEX_HEAD: 
				doc.nodeCtxt.jumpPlexHead();
				break;
			case hs.address.Relative.PLEX_TAIL: 
				doc.nodeCtxt.jumpPlexTail();
				break;
			case hs.address.Relative.NODE_SUCCESSOR: 
				doc.nodeCtxt.jumpSuccessor(this.offset);
				break;
			case hs.address.Relative.NODE_PREDECESSOR: 
				doc.nodeCtxt.jumpPredecessor(this.offset);
				break;
			case hs.address.Relative.CONTENT_SEARCH: 
				// TODO: Figure out exactly what to do here
				dojo.raise("content search relative address (.c) not implemented");
				break;
			case hs.address.Relative.RETURN_NODE: 
				dojo.raise("return node (.r) not implemented");
				break;
			case hs.address.Relative.RETURN_FILE: 
				dojo.raise("return file (.rf) not implemented");
				break;
		}
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.Relative"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		if(this.offset == 1){
			return this.type;
		}else{
			return this.offset + this.type;
		}
	}
});




/**
	An hs.address.NodeAddress that is an indirect link, such as .l.
*/

/**
	@param offset : Integer An optional value that defaults to 1. Controls
	which link we are referencing, starting at 1.
	@throws hs.exception.InvalidAddress
*/
	
hs.address.IndirectLink = function(offset){
	if(dojo.lang.isUndefined(offset) || offset == null){
		offset = 1;
	}
	
	if(offset <= 0){
		throw new hs.exception.InvalidAddress("? " + offset);
	}
	
	this.offset = offset;
}

dojo.inherits(hs.address.IndirectLink, hs.address.NodeAddress);

dojo.lang.extend(hs.address.IndirectLink, {
	offset: 1,
	
	apply: function(doc, readyHandler, address){
		// get our node context
		var ctxt = doc.nodeCtxt;

		// get it's node cursor
		var cursor = ctxt.cursor;

		// now get the specified link
		var link = null;
		try{
			link = cursor.getLink(this.offset);
		}catch(exp){
			debug(exp);
			throw new hs.exception.Filter(
						"No indirect link for " + ctxt.number);
		}
		
		// merge our link and the one that we are a part 
		// of together
		var linkAddr = this._mergeLinks(link, address);
		
		// now resolve this link, halting execution,
		// and continue executing using our new
		// indirect link
		address.replaceResolution(linkAddr, doc);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.IndirectLink"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		if(this.offset == 1){
			return "l";
		}else{
			return this.offset + "l";
		}
	},
	
	_mergeLinks: function(link, address){
		var linkAddr = new hs.address.Address(link);

		// add our address' viewspecs
		// to the end of our indirect link's viewspecs
		for(var i = 0; i < address.viewspecs.length; i++){
			linkAddr.viewspecs[linkAddr.viewspecs.length]
				= address.viewspecs[i];	
		}

		// splice in any addressing from our address
		// after the indirect links addressing
		var addMe = new Array();
		var startAdding = false;
		// don't add until we hit an indirect link
		for(var i = 0; i < address.nodeAddresses.length; i++){
			var p = address.nodeAddresses[i];
			
			if(startAdding == true){
				addMe[addMe.length] = p;
				continue;
			}
			
			if(p.isPieceType("hs.address.IndirectLink") == true){
				startAdding = true;
			}
		}
		for(var i = 0; i < addMe.length; i++){
			linkAddr.nodeAddresses[linkAddr.nodeAddresses.length]
				= addMe[i];
		}
		
		return linkAddr;
	}
});




/**
	An hs.address.NodeAddress that is a string search forwards from the 
	present location through the following nodes, such as "foobar".
*/

/**
	@param search : String A search string, either delimited with " for
	simple searches, such as "foobar", or delimited with / for full
	regular expressions, such as /foobar/i.
	@throws hs.exception.InvalidAddress
*/
hs.address.StringSearch = function(search){
	// make sure search string is delimited with "double-quotes" or
	// with regular expression slashes and an end letter - /foobar/i
	if(search == null || dojo.lang.isUndefined(search)
		|| /(?:^\"(?:\\\"|[^\"])*\"$)|(?:^\/(?:\\\/|[^\/])*\/[a-z]*$)/i.test(search) == false){
		throw new hs.exception.InvalidAddress("? " + search);
	}
	
	this.search = search;
}

dojo.inherits(hs.address.StringSearch, hs.address.NodeAddress);

dojo.lang.extend(hs.address.StringSearch, {
	search: null,
	
	/**
		@returns RegExp
	*/
	toRegularExpression: function(){
		
	},
	
	apply: function(doc){
		// turn the search value into an actual JavaScript string
		// or a regular expression; right now it is stringified
		// i.e. it has the value "foobar" with quotes in it
		var search = eval(this.search);
		
		doc.jumpContent(search, hs.commands.JumpConstants.NEXT);
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.StringSearch"){
			return true;
		}else{
			return false;
		}
	},
	
	/**
		@returns String
	*/
	toString: function(){
		return this.search;
	}
});



/**
	An hs.address.NodeAddress that jumps through a single node's textual 
	contents, such as -2w.
*/

/**
	@param type The type of string positioning we are dealing with; must
	be one of the constants defined on this class.
	@param offset An optional parameter used to control the number of times
	to apply this string position; defaults to 1. Can be negative.
	@throws hs.exception.InvalidAddress
*/ 
hs.address.StringPosition = function(type, offset){
	if(type == null || dojo.lang.isUndefined(type)){
		throw new hs.exception.InvalidAddress("? " + type);
	}
	
	// make sure we start with one of our known types
	switch(type){
		case hs.address.StringPosition.LAST_CHAR: break;
		case hs.address.StringPosition.FIRST_CHAR: break;
		case hs.address.StringPosition.CHARACTER: break;
		case hs.address.StringPosition.WORD: break;
		case hs.address.StringPosition.VISIBLE: break;
		case hs.address.StringPosition.INVISIBLE: break;
		default:
			throw new hs.exception.InvalidAddress("? " + type);
	}
	
	this.type = type;
	
	if(dojo.lang.isUndefined(offset) || offset == null){
		offset = 1;
	}
	
	if(offset == 0){
		throw new hs.exception.InvalidAddress("? " + offset);
	}
	
	if(type == hs.address.StringPosition.LAST_CHAR
		|| type == hs.address.StringPosition.FIRST_CHAR){ // offset has no meaning
		offset = 1;		
	}
	
	this.offset = offset;
}

dojo.inherits(hs.address.StringPosition, hs.address.NodeAddress);

hs.address.StringPosition.LAST_CHAR = "e";
hs.address.StringPosition.FIRST_CHAR = "f";
hs.address.StringPosition.CHARACTER = "c";
hs.address.StringPosition.WORD = "w";
hs.address.StringPosition.VISIBLE = "v";
hs.address.StringPosition.INVISIBLE = "i";

dojo.lang.extend(hs.address.StringPosition, {
	type: null,					/** One of the constants defined in this class. */
	offset: 1, 			

	apply: function(doc){
		dojo.raise("string positioning not implemented");
	},
	
	isPieceType: function(className){
		if(className == "hs.address.NodeAddress"
			|| className == "hs.address.StringPosition"){
			return true;
		}else{
			return false;
		}
	},
	
	toString: function(){
		if(this.offset == 1){
			return "+" + this.type;
		}else{
			var sign = "";
			if(this.offset > 0){
				sign = "+";
			}
			
			return sign + this.offset + this.type;
		}
	}
});
