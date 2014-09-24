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

	This package contains hs.commands. hs.commands provides a standard
	facade to seperate a UI from the rest of the system; UI actions are
	transformed on to calls to the command facade, which then call the rest
	of the system and encapsulate it from the UI. It has the following 
	classes:
	
	hs.commands
		Static singleton facade that exposes all of our commands as simple methods.

	hs.commands.JumpConstants
		Constants that can be used with hs.commands to control commands, such as 
		for jumping.
*/

dojo.provide("hs.commands");


/**
	Static singleton facade that exposes all of our commands as simple methods.
*/

hs.commands = {
	/** 
		JUMP COMMANDS.

		All jump methods should filter out the parts of Address they need 
		and throw the rest away.
		
		Most jump methods take a readyHandler function. readyHandler is a 
		function that receives the following arguments: 
			function(address : hs.address.Address, 
							 document : hs.model.Document, 
							 error : InvalidAddressException)
		where 'address' is the address that we jumped to,
		'document', is the resolved document from this address,
		and 'error' is a possible error that might have arisen in this process.
	*/	
		
		
	/** 
		Jumps to the given address. 
				 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs
		to attach to this address.
		@throws hs.exception.Jump
	*/
	jumpItem: function(readyHandler, address, relativeTo,
						viewspecs){
		// if we have viewspecs, add them on
		if(viewspecs != null && typeof viewspecs != "undefined"){
			var url = "#:" + viewspecs;
			var viewAddr = new hs.address.Address(url);
			var viewArray = viewAddr.viewspecs;
			for(var i = 0; i < viewArray.length; i++){
				address.viewspecs[address.viewspecs.length] =
					viewArray[i];
			}	
		}
		
		// before calling the readyHandler, render the resolve document
		var internalHandler = function(address, doc, error){
			//debug("internalHandler, address="+address+", doc="+doc+", error="+error);
			if(error != null && dojo.lang.isUndefined(error) == false){
				readyHandler.call(null, address, doc, error);
				return;
			}
			
			// render the document
			doc.render();
			
			// call readyHandler
			readyHandler.call(null, address, doc, error);
		}
		address.resolve(internalHandler, true, relativeTo);
	},

	/** 
		Jumps to the typein and viewspecs provided.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Ignored for
		this type.
		@param relativeTo : hs.model.Document
		@throws hs.exception.Jump
		@param typein : String URL address. Required.
		@param viewspecs : String List of viewspecs to add
		to typein. Required.
	*/
	jumpFile: function(readyHandler, address, relativeTo, 
						typein, viewspecs){
		// turn the typein into a filename
		var url;
		if(dojo.string.startsWith(typein, "./")
			|| dojo.string.startsWith(typein, "../")
			|| dojo.string.startsWith(typein, "/")){
			// allow caller to already include path info
			url = typein;		
		}else{
			// assume local directory
			url = "./" + typein;
		}
		
		// add in our viewspecs
		if(viewspecs != null && dojo.string.trim(viewspecs) != ""){
			url += "#:" + viewspecs;
		}
		
		var newAddr = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, newAddr, relativeTo);
	},
	
	/** 
		Jumps to the origin of the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - 
		Address portion is ignored, but we take
		the viewspecs and fileinfo inside of here.
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpOrigin: function(readyHandler, address, relativeTo,
							viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.ORIGIN,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the end of the branch relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpEndBranch: function(readyHandler, address, relativeTo,
								viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.BRANCH_END,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the end of the plex of the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@throws hs.exception.Jump
	*/
	jumpEndPlex: function(readyHandler, address, relativeTo){
		dojo.raise("jumping to the end of a plex with command bar not implemented");
	},
	
	/** 
		Jumps to the next node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpNext: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_NEXT,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the previous node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpBack: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_BACK,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the successor node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpSuccessor: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_SUCCESSOR,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the predecessor node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String Optional viewspecs to
		add to this address.
		@throws hs.exception.Jump
	*/
	jumpPredecessor: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_PREDECESSOR,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps up to a node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpUp: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_UP,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps down a node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpDown: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.NODE_DOWN,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the head node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpHead: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.PLEX_HEAD,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},

	/** 
		Jumps to the tail node relative to the given address.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param viewspecs : String - A list of optional
		viewspecs.
		@throws hs.exception.Jump
	*/
	jumpTail: function(readyHandler, address, relativeTo,
						viewspecs){
		hs.commands._jumpRelative(hs.address.Relative.PLEX_TAIL,
									readyHandler,
									address,
									relativeTo,
									viewspecs);
	},
	
	/** 
		Jumps to the link given by 'address'.
								 
		@param readyHandler : Function
		@param address : hs.address.Address -
		Ignored for this command type.
		@param relativeTo : hs.model.Document
		@param typein : String The typed in string of an addres
		to interpret. Required.
		@throws hs.exception.Jump
	*/
	jumpLink: function(readyHandler, address, relativeTo, typein){
		if(typeof typein != "undefined" && typein != null){
			address = new hs.address.Address(typein);
		}
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	},
	
	/** 
		Jumps to the node label given by 'address'.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Not used.
		@param relativeTo : hs.model.Document
		@param typein : String - The label to jump to.
		@param viewspecs : String - Optional list of viewspecs
		to append.
		@param jumpType : hs.commands.JumpConstants - One of four 
		hs.commands.JumpConstants types: ANY, EXTERNAL, FIRST, or NEXT, controlling
		in what direction we search for this label relative to the given address.
		@throws hs.exception.Jump
	*/
	jumpLabel: function(readyHandler, address, relativeTo, 
						typein, viewspecs, jumpType){
		var url = "#";
		if(jumpType == hs.commands.JumpConstants.FIRST){
			url += typein;
		}else if(jumpType == hs.commands.JumpConstants.NEXT){
			url += "*" + typein;
		}
		
		if(viewspecs != null && typeof viewspecs != "undefined"){
			url += ":" + viewspecs;
		}
		
		address = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, address, relativeTo, null);
	},
	
	/** 
		Jumps to the given matching content.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param jumpType : hs.commands.JumpConstants - One of two 
		hs.commands.JumpConstants types: FIRST or NEXT, controlling
		in what direction we search for this label relative to the given address.
		@throws hs.exception.Jump
	*/
	jumpContent: function(readyHandler, address, relativeTo, 
							typein, viewspecs, jumpType){
		if(relativeTo == null
			|| typeof relativeTo == "undefined"){
			throw new hs.exception.Jump("Programming error: "
										+ "You must provide "
										+ "'relativeTo' to "
										+ "hs.commands.jumpWord");	
		}
		
		var doc = relativeTo;
		
		// do the jump a bit differently here; directly jump through
		// our hs.model.Document
		doc.jumpContent(typein, jumpType);
		
		// now simply call jumpItem to force a re-render
		// and to have our viewspecs applied
		address = new hs.address.Address("./");
		hs.commands.jumpItem(readyHandler, address, relativeTo, viewspecs);
	},
	
	/** 
		Jumps to the given matching word.
								 
		@param readyHandler : Function
		@param address : hs.address.Address
		@param relativeTo : hs.model.Document
		@param typein : String - The word to jump to.
		@param viewspecs : String - Optional viewspecs to
		append to our word search.
		@param jumpType : hs.commands.JumpConstants - One of two 
		hs.commands.JumpConstants types: FIRST or NEXT, controlling
		in what direction we search for this label relative to the given address.
		@throws hs.exception.Jump
	*/
	jumpWord: function(readyHandler, address, relativeTo, 
						typein, viewspecs, jumpType){
		if(relativeTo == null
			|| typeof relativeTo == "undefined"){
			throw new hs.exception.Jump("Programming error: "
										+ "You must provide "
										+ "'relativeTo' to "
										+ "hs.commands.jumpWord");	
		}
		
		var doc = relativeTo;
		
		// do the jump a bit differently here; directly jump through
		// our hs.model.Document
		doc.jumpWord(typein, jumpType);
		
		// now simply call jumpItem to force a re-render
		// and to have our viewspecs applied
		address = new hs.address.Address("./");
		hs.commands.jumpItem(readyHandler, address, relativeTo, viewspecs);
	},
	
	/** 
		Sets the given viewspecs.
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Not used.
		@param relativeTo : hs.model.Document
		@param viewspecs : String - The viewspecs to set.
		@throws hs.exception.Jump
	*/
	setViewspecs: function(readyHandler, address, relativeTo, viewspecs){
		var url = "#:" + viewspecs;
		address = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	},
	
	/** 
		Resets viewspecs to the default
								 
		@param readyHandler : Function
		@param address : hs.address.Address - Not used.
		@param relativeTo : hs.model.Document
		@throws hs.exception.Jump
	*/
	resetViewspecs: function(readyHandler, address, relativeTo){
		var url = "#:" + hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS;
		address = new hs.address.Address(url);
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	},
	
	_jumpRelative: function(relativeType, readyHandler, address, 
							relativeTo, viewspecs){
		// keep everything in this address, but add our
		// relative piece at the end
		var newPiece = 
			new hs.address.Relative(relativeType);
		address.nodeAddresses[address.nodeAddresses.length] =
			newPiece;
		
		// now append our viewspecs if we have them
		if(viewspecs != null && typeof viewspecs != "undefined"){
			// turn the viewspecs into a machine processable
			// version
			var viewURL = "#:" + viewspecs;
			var viewAddr = new hs.address.Address(viewURL);
			// add them to our address
			var viewArray = viewAddr.viewspecs;
			for(var i = 0; i < viewArray.length; i++){
				address.viewspecs[address.viewspecs.length]
					= viewArray[i];
			}
		}
		
		hs.commands.jumpItem(readyHandler, address, relativeTo);
	}
}

/**
	Constants that can be used with hs.commands to control commands, such as 
	for jumping.	
*/

hs.commands.JumpConstants = {	
	FIRST: "first",
	NEXT: "next",
	LAST: "last",
	ANY: "any",
	EXTERNAL: "external"
}

