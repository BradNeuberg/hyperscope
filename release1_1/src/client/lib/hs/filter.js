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

	This package contains hs.filter, which has our filter abstraction and several
	filter types. Filters are a standard way to transform hs.model.Documents,
	using polymorphism to let specific implementors choose how to transform a
	document. It has the following classes:
	
	hs.filter.Filter
		A consistent API for applying filters and transformers to an 
		hs.model.Document, changing the underlying hs.model.Document in some 
		filter specific way.
	
	hs.filter.Normalizer
		A Filter that normalizes an hs.model.Document into a consistent form 
		before working with it.
		
	hs.filter.CurrentViewspecs
		A Filter that holds our currently applied viewspecs; reduces them into a 
		form that can be worked with; and applies them in the final rendering phase.

	hs.filter.ViewspecConstants
		Static singleton viewspec constants useful for working with 
		hs.filter.CurrentViewspecs. 

	hs.filter.Transcluder
		A Filter that walks the hs.model.Document tree, replacing INCLUDE statements 
		with their resolved locations.
*/

dojo.provide("hs.filter");

dojo.require("dojo.dom");
dojo.require("dojo.string.*");



/**
	A consistent API for applying filters and transformers to an hs.model.Document, 
	changing the underlying hs.model.Document in some filter specific way; 
	many objects are filters, including the hs.address.NodeAddress.
	
	Classes that wish to use this should mix it in, then over-ride it's methods:
	dojo.lang.mixin(myClass.prototype, hs.filter.Filter)
*/

hs.filter.Filter = {
	/**
		Apply and filter the given document, changing it's contents and views.
		By default, apply() is synchronous and does its work when you call it;
		however, some filters need to talk on the network, and are therefore
		asychronous. Before calling this method, you should call isAsync() and
		see if you need to pass in a 'readyHandler' to this method.
		
		@param document : hs.model.Document - Document to transform.
		@param readyHandler : Function - An optional handler that will be called
		when this apply() method is finished; only needed if isAsync is true.
		readyHandler is a function that will receive two arguments:
		readyHandler = function(doc : hs.model.Document, error : hs.exception.Filter)
		@param address : hs.address.Address - The address that we are resolving
		while applying this filter.
		@throws hs.exception.Filter
	*/
	apply: function(doc, readyHandler, address){
		dojo.raise("abstract interface method; please implement");
	},
	
	isAsync: function(){
		false;
	}
}


/**
	A Filter that normalizes an hs.model.Document into a consistent form 
	before working with it; specifically, the Normalizer strips out everything
	but DOM Elements from the underlying hs.model.Document, and adds in node 
	number information.
*/
hs.filter.Normalizer = function(){
}

dojo.lang.mixin(hs.filter.Normalizer.prototype, hs.filter.Filter);

dojo.lang.extend(hs.filter.Normalizer, {
	_nodeCounter: 0,

	apply: function(doc){
		var dom = doc.dom;
		
		var body = dom.selectNodes("/opml/body");
		if(body == null || body.length == 0){
			throw new hs.exception.filter("Invalid OPML document, no outline nodes");
		}
		
		body = body[0];
		
		// add a 'fake' attribute to the root node so that we write out our
		// xmlns:hs-internal namespace declaration here, rather than deeper in
		// the document which is what will happen when we call
		// setAttributeNS later on in one of our filters
		var root = dom.selectNodes("/opml")[0];
		dojo.dom.setAttributeNS(root, hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
								hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":fake",
								"false");
		
		// we need to have compatibility with older OPML documents; HyperScope
		// OPML docs have a root outline node with level 0, and no siblings of
		// level 0, while non-HyperScope OPML docs might just have a bunch of
		// top-level nodes. If we only have one top-level child, make it start
		// at level 0; if we have more than one, start from 1
		var level;
		if(dojo.dom.firstElement(body) == dojo.dom.lastElement(body)){
			// only one child element
			level = 0;
		}else{
			level = 1;
		}
		
		// recursively add metadata to the tree
		var startWith = dojo.dom.firstElement(body);
		this._applyMetadata(level, startWith, null);
		
		// record our maximum node offset, which we need for jumpNext if the
		// offset someone gives is too large, so we can jump to the final node
		doc._nodeCounter = this._nodeCounter;
	},
	
	_applyMetadata: function(level, startWith, parentNodeNumber){
		if(startWith == null || dojo.lang.isUndefined(startWith)){
			// end of recursion
			return;
		}
		
		var currentNode = startWith;
		var nodeOffset = 1;
		while(currentNode != null && dojo.lang.isUndefined(currentNode) == false){
			this._nodeCounter++;
			
			// determine our node number
			var nodeNumber;
			if(level == 0){
				nodeNumber = "0";
			}else{
			 	nodeNumber = 
					new hs.address.NodeNumber.toNodeNumber(parentNodeNumber, nodeOffset);
				nodeNumber = nodeNumber.number;
			}
			
			// set our metadata
			dojo.dom.setAttributeNS(currentNode, 
									hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":level",
									level);
			dojo.dom.setAttributeNS(currentNode, 
									hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":number",
									nodeNumber);
			dojo.dom.setAttributeNS(currentNode, 
									hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":node-counter",
									this._nodeCounter);
									
			// recursively call our child nodes
			this._applyMetadata(level + 1, dojo.dom.firstElement(currentNode), 
								nodeNumber);
			
			// move to next sibling
			currentNode = dojo.dom.nextElement(currentNode);
			nodeOffset++;
		}
	}
});



/**
	A Filter that holds our currently applied viewspecs; reduces them into a 
	form that can be worked with; and applies them in the final rendering phase.
*/

/** 
	@param viewspecs - either a String or an array of hs.address.Viewspecs[]
	@param docCtxt : hs.model.Document
	@param _applyDefaults : boolean private variable used by 
	hs.filter.CurrentViewspecs.toString() that should not be used publicly;
	controls whether we add ViewspecConstants.DEFAULT_VIEWSPECS to ourselves.
	@throws hs.exception.Filter
*/
hs.filter.CurrentViewspecs = function(viewspecs, docCtxt, _applyDefaults){
	if(dojo.lang.isUndefined(_applyDefaults)){
		_applyDefaults = true;
	}	

	// reject bad values
	if(docCtxt == null || dojo.lang.isUndefined(docCtxt)){
		throw new hs.exception.Filter("Programming error: "
										+ "no document for "
										+ "hs.filter.CurrentViewspecs");
	}
	
	// normalize an empty viewspec
	if(viewspecs == null || dojo.lang.isUndefined(viewspecs)){
		viewspecs = "";
	}else if(dojo.lang.isString(viewspecs) && dojo.string.trim(viewspecs) == ""){
		viewspecs = "";
	}else if(dojo.lang.isArray(viewspecs) && viewspecs.length == 0){
		viewspecs = "";
	}
	
	this._docCtxt = docCtxt;	
	
	// turn a string of viewspecs into an array
	// to validate their values
	if(dojo.lang.isString(viewspecs)){
		var viewArray = new Array();
		
		for(var i = 0; i < viewspecs.length; i++){
			var viewChar = viewspecs.charAt(i);
			var view = new hs.address.Viewspec(viewChar);
			viewArray.push(view);
		}
		
		viewspecs = viewArray;
	}
	
	// now attach our default viewspecs at the beginning
	if(_applyDefaults == true){
		for(var i = hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.length - 1; 
				i >= 0; i--){
			var viewChar = 	hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.charAt(i);
			var view = new hs.address.Viewspec(viewChar);
			// add new element at beginning of array
			viewspecs.splice(0, 0, view); 
		}
	}
		
	// set default line and level clipping values
	this._lineClippping = hs.filter.ViewspecConstants.DEFAULT_LINE_CLIPPING;
	this._levelClippping = hs.filter.ViewspecConstants.DEFAULT_LEVEL_CLIPPING;
	
	// evaluate each viewspec to update our view state
	for(var i = 0; i < viewspecs.length; i++){
		this.add(viewspecs[i]);
	}
}

dojo.lang.mixin(hs.filter.CurrentViewspecs.prototype, hs.filter.Filter);

dojo.lang.extend(hs.filter.CurrentViewspecs, {
	_levelClipping: null,
	_lineClipping: null,
	_structureClippingType: null,
	
	_showBlankLines: null,
	_showNodeAddressing: null,
	_showNodeLabels: null,
	_showFrozenNodes: null,
	_showNodeSignatures: null,
	_showLevelClippingToContext: null,
	
	_nodeAddressingPlacement: null,
	_nodeAddressingType: null,
	_contentFilterType: null,
	_runSequenceGenerators: null,
	
	_docCtxt: null,
	
	apply: function(doc){
		var xslt = doc.getRenderXSLT();
		
		// line clipping
		var lineClipping = this.getLineClipping();
		if(lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			lineClipping = "none";
		}
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"lineClipping", 
				lineClipping);
		
		// Internet Explorer incorrectly 'throws away' a numerical 0
		// if set as an XSLT parameter, turning it into a null; change
		// 0 values into the string "0".
		
		// level clipping
		var levelClipping = this.getLevelClipping();
		if(levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			levelClipping = "none";
		}else if(levelClipping == 0){
			levelClipping = "0";
		}
		
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"levelClipping", 
				levelClipping);
				
		// Internet Explorer incorrectly 'throws away' an XSLT parameter value if
		// it is a boolean false, turning it into a null after it is set.
		// Transform it into a string either way to prevent this.
		
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-node-labels", 
				new Boolean(this.showNodeLabels()).toString());	
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-blank-lines", 
				new Boolean(this.showBlankLines()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-node-addressing", 
				new Boolean(this.showNodeAddressing()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"node-addressing-placement", 
				this.getNodeAddressingPlacement());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-node-signatures", 
				new Boolean(this.showNodeSignatures()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"show-frozen-nodes", 
				new Boolean(this.showFrozenNodes()).toString());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"node-addressing-type", 
				this.getNodeAddressingType());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"structure-clipping", 
				this.getStructuralClippingType());

		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"content-filtering-type", 
				this.getContentFilterType());
				
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"level-indenting-type", 
				this.getLevelIndentingType());
				
		if(this.getStructuralClippingType() == hs.filter.ViewspecConstants.PLEX_ONLY){
			// set what our plex parent is,
			// used to determine where to start plexing
			xslt.setParameter(
					hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
					"plex-parent-number", 
					this._getPlexParentNumber(doc));
		}
	},
	
	/**
		Generates a stringified version of our viewspecs.
		Note that viewspecs that are the default are not generated.
	 */
	toString: function(){
		// generate our string, using our current viewspec state
		// to do so
		var results = new String();
		results = this._writeLevelAndLineClipping(results);
		results = this._writeStructuralClipping(results);
		results = this._writeContentFiltering(results);
		results = this._writeNodeMetadata(results);
		results = this._writeNodeAppearance(results);
		results = this._writeSequenceGenerators(results);
		
		// now filter out default viewspecs
		results = this._filterDefaultViewspecs(results);
		
		return results;
	},

	/**
		Adds the given viewspec as a String or as an hs.address.Viewspec.
		Only one viewspec letter can be given at a time.
		
		@throws hs.exception.Filter.
	*/
	add: function(view){
		// reject bad values
		if(view == null || dojo.lang.isUndefined(view)){
			throw new hs.exception.Filter("Programming error: "
											+ "null viewspec given to "
											+ "hs.filter.CurrentViewspecs");
		}
		if(dojo.lang.isString(view) && dojo.string.trim(view) == ""){
			throw new hs.exception.Filter("Programming error: "
											+ "empty viewspec given to "
											+ "hs.filter.CurrentViewspecs");
		}
		
		// turn into a string
		view = view.toString();
		
		// reject multiple viewspecs
		if(view.length > 1){
			throw new hs.exception.Filter("Programming error: "
											+ "multiple viewspecs not allowed "
											+ "in call to CurrentViewspecs.add(): "
											+ view);
		}
		
		// now evaluate what kind of viewspec this is
		switch(view){
			case 'a': 
				// show one level less
				if(this._levelClipping > 0){
					this._levelClipping--;
				}
				break;
			case 'b':
				// show one level more
				if(this._levelClipping < hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
					this._levelClipping++;
				}
				break;
			case 'c':
				// show all levels
				this._levelClipping = hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
				break;
			case 'd':
				// show first level only
				this._levelClipping = 1;
				break;
			case 'e':
				// show levels up to level of referenced node
				// get the current context node
				var nodeCtxt = this._docCtxt.nodeCtxt;
				// get it's level and make it our clipped level
				var ctxtLevel = nodeCtxt.level;
				this._levelClipping = ctxtLevel;
				break;
			case 'f':
				// put viewspecs into effect
				// TODO: implement in the future
				break;
			case 'g':
				// show branch only
				this._structuralClippingType = 
					hs.filter.ViewspecConstants.BRANCH_ONLY;
				break;
			case 'h': 
				// show all branches
				this._structuralClippingType = 
					hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING;
				break;
			case 'i':
				// filter nodes
				this._contentFilterType = 
					hs.filter.ViewspecConstants.FILTER_ALL;
				break;
			case 'j':
				// don't filter nodes
				this._contentFilterType = 
					hs.filter.ViewspecConstants.NO_FILTERING;
				break;
			case 'k':
				// show next filtered node
				this._contentFilterType = 
					hs.filter.ViewspecConstants.NEXT_FILTERED_NODE;
				break;
			case 'l':
				// show plex only
				this._structuralClippingType = 
					hs.filter.ViewspecConstants.PLEX_ONLY;
				break;
			case 'm':
				// node numbers/IDs on
				this._showNodeAddressing = true;
				break;
			case 'n':
				// node numbers/IDs off
				this._showNodeAddressing = false;
				break;
			case 'o':
				// frozen statements on
				this._showFrozenNodes = true;
				break;
			case 'p':
				// frozen statements off
				this._showFrozenNodes = false;
				break;
			case 'q':
				// show one line less
				if(this._lineClipping > 1){
					this._lineClipping--;
				}
				break;
			case 'r':
				// show one line more
				if(this._lineClipping < hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
					this._lineClipping++;
				}
				break;
			case 's':
				// show all lines
				this._lineClipping = hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
				break;
			case 't': 
				// show first lines only
				this._lineClipping = 1;
				break;
			case 'u':
				// recreate windows after each change
				// TODO: implement in the future
				break;
			case 'v':
				// defer recreating window
				// TODO: implement in the future
				break;
			case 'w':
				// show all lines and all levels
				this._lineClipping = hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
				this._levelClipping = hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
				break;
			case 'x':
				// show one line and one level only
				this._lineClipping = 1;
				this._levelClipping = 1;
				break;
			case 'y':
				// blank lines between nodes on
				this._showBlankLines = true;
				break;
			case 'z':
				// blank lines between nodes off
				this._showBlankLines = false;
				break;
			case 'A':
				// level indenting on
				this._levelIndentingType = 
					hs.filter.ViewspecConstants.INDENT_ON;
				break;
			case 'B':
				// level indenting off
				this._levelIndentingType = 
					hs.filter.ViewspecConstants.INDENT_OFF;
				break;
			case 'C':
				// show node names
				this._showNodeLabels = true;
				break;
			case 'D':
				// don't show node labels
				this._showNodeLabels = false;
				break;
			case 'E':
				// paginate when printing
				// TODO: implement in the future
				break;
			case 'F':
				// recreate display
				// TODO: implement in the future
				break;
			case 'G':
				// node numbers/IDs right
				this._nodeAddressingPlacement = 
					hs.filter.ViewspecConstants.RIGHT;
				break;
			case 'H':
				// node numbers/IDs left
				this._nodeAddressingPlacement = 
					hs.filter.ViewspecConstants.LEFT;
				break;
			case 'I':
				// show node IDs, not node numbers
				this._nodeAddressingType = 
					hs.filter.ViewspecConstants.SHOW_NODE_ID;
				break;
			case 'J':
				// show node numbers, not node IDs
				this._nodeAddressingType = 
					hs.filter.ViewspecConstants.SHOW_NODE_NUMBER;
				break;
			case 'K':
				// node signatures on
				this._showNodeSignatures = true;
				break;
			case 'L':
				// node signatures off
				this._showNodeSignatures = false;
				break;
			case 'O':
				// user sequence generator on
				this._runSequenceGenerators = true;
				break;
			case 'P':
				// user sequence generator off
				this._runSequenceGenerators = false;
				break;
			case 'Q':
				// indenting offset to current context node level
				// with viewspecs l and g
				this._levelIndentingType = 
					hs.filter.ViewspecConstants.INDENT_TO_CONTENT;
				break;
			default:
				throw new hs.exception.Filter("? " + view);
		}
	},
	
	/**
	   The number of levels to show, after which we clip.
	   
	   @returns int - from 0 to hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING.
	 */
	getLevelClipping: function(){
		return this._levelClipping;
	},
	
	/**
	   The number of lines to show for each node, after which we clip.
	   
	   @returns int - from 1 to hs.filter.ViewspecConstants.MAX_LINE_CLIPPING.
	 */
	getLineClipping: function(){
		return this._lineClipping;
	},
	
	/**
	  Gets the structural display type.
	  
	  @returns hs.filter.ViewspecConstants.BRANCH_ONLY,
		hs.filter.ViewspecConstants.PLEX_ONLY, or
		hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING.
	 */
	getStructuralClippingType: function(){
		return this._structuralClippingType;
	},
	
	/**
		Whether to show blank lines between nodes or not.
		
		@returns boolean
	*/
	showBlankLines: function(){
		return this._showBlankLines;
	},

	/**
		Whether to show node addressing (i.e. purple numbers and node IDs).
		
		@returns boolean
	*/
	showNodeAddressing: function(){
		return this._showNodeAddressing;
	},
	
	/**
		Where the node addressing is shown, on the left or the right.
		
		@returns hs.filter.ViewspecConstants.LEFT or
		hs.filter.ViewspecConstants.RIGHT.
	*/
	getNodeAddressingPlacement: function(){
		return this._nodeAddressingPlacement;
	},
	
	/**
		What type of node addressing to show (i.e. node IDs or node
		numbers).
		
		@returns hs.filter.ViewspecConstants.SHOW_NODE_ID or
		hs.filter.ViewspecConstants.SHOW_NODE_NUMBER.
	*/
	getNodeAddressingType: function(){
		return this._nodeAddressingType;
	},
	
	/**
		Whether to show node labels.
		
		@returns boolean
	*/
	showNodeLabels: function(){
		return this._showNodeLabels;
	},
	
	/**
		How to apply a content filter.
		
		@returns hs.filter.ViewspecConstants.NO_FILTERING, 
		hs.filter.ViewspecConstants.FILTER_ALL, or
		hs.filter.ViewspecConstants.NEXT_FILTERED_NODE.
	*/
	getContentFilterType: function(){
		return this._contentFilterType;
	},
	
	/**
		Whether to do level indenting.
		
		@returns hs.filter.ViewspecConstants.INDENT_ON,
		hs.filter.ViewspecConstants.INDENT_OFF, or
		hs.filter.ViewspecConstants.INDENT_TO_CONTENT.
	*/
	getLevelIndentingType: function(){
		return this._levelIndentingType;
	},
	
	/**
		Whether to show frozen nodes.
		
		@returns boolean
	*/
	showFrozenNodes: function(){
		return this._showFrozenNodes;
	},
	
	/**
		Whether to show node signature and editing information.
		
		@returns boolean
	*/
	showNodeSignatures: function(){
		return this._showNodeSignatures;
	},
	
	/**
		Whether to run sequence generators like the hs.filter.Transcluder.
		
		@returns boolean
	*/
	runSequenceGenerators: function(){
		return this._runSequenceGenerators;
	},
	
	_writeLevelAndLineClipping: function(results){
		// level and line clipping - generate these compactly
		// so we don't get a million letters to go to the correct level
		// and line clipping
		if(this._lineClipping == 1 && this._levelClipping == 1){
			// line and level clipping are both 1
			// x - show one line and one level only
			results += "x";
		}
		else if(this._lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING
				&& this._levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			// line and level clipping are both max
			// w - show all lines and all levels
			results += "w";
		}else{
			// line and level clipping differ
			results = this._writeLineClipping(results);
			results = this._writeLevelClipping(results);	
		}
		
		return results;
	},
	
	_writeLineClipping: function(results){
		// line clipping
		if(this._lineClipping == 1){
			// show just first line
			// t - show first lines only
			results += "t";
		}else if(this._lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			// line clipping is the max
			// s - show all lines
			results += "s";
		}else{
			// figure out if line clipping is closer to 1 or the max
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LINE_CLIPPING - this._lineClipping;
			if(distanceToMax <= this._lineClipping){
				// much closer to the maximum line clipping
				// write out 's' ('show all lines'), followed
				// by necessary number of 'q' ('show one lines less')
				// letters
				results += "s";
				for(var i = distanceToMax; i > 0; i--){
					results += "q";
				}
			}else{
				// much closer to the beginning of the allowed value
				// write out 't' ('show first lines only') followed
				// by necessary number of 'r' ('show one line more')
				// letters
				results += "t";
				for(var i = 2; i <= this._lineClipping; i++){
					results += "r";
				}
			}
		}
		
		return results;
	},
	
	_writeLevelClipping: function(results){
		// level clipping
		var ctxtNodeLevel = this._docCtxt.nodeCtxt.level;
		if(this._levelClipping == 1){
			// first level
			// d - show first level only
			results += "d";
		}else if(this._levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			// level clipping is max
			// c - show all levels
			results += "c";
		}else if(this._levelClipping == 0){
			// show just level 0 - no direct viewspec letter to get
			// this
			// write out 'da' -
			// 'd' - 'show first level only
			// 'a' - show one level less
			results += "da";
		}else if(this._levelClipping >= (hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - 20)){
			// our level clipping is within 20 units of the maximum allowed value
			// write out 'c' ('show all levels') followed by the necessary
			// number of 'a' ('show one level less') letters
			results += "c";
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - this._levelClipping;
			for(var i = distanceToMax; i > 0; i--){
				results += "a";
			}
		}else if(ctxtNodeLevel != 0 && this._levelClipping >= ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is equal to or greater than
			// this node.
			// write out 'e' ('show levels up to referenced node'), followed
			// by necessary number of 'b' ('show one level more') letters
			results += "e";
			var distanceFromCtxt = this._levelClipping - ctxtNodeLevel;
			for(var i = 1; i <= distanceFromCtxt; i++){
				results += "b";
			}
		}else if(ctxtNodeLevel != 0 && this._levelClipping < ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is less than
			// this node.
			
			// determine whether our level clipping is closer to 1 or
			// to our context node's level
			var distanceToCtxt = ctxtNodeLevel - this._levelClipping;
			if(distanceToCtxt >= this._levelClipping){
				// we are closer to 1.
				// write out 'd' ('show first level only'), followed
				// by correct number of 'b' ('show one level more')
				// letters
				results += "d";
				for(var i = 2; i <= this._levelClipping; i++){
					results += "b";
				}
			}else{
				// we are closer to the context node
				// write out 'e' ('show levels up to referenced node'), 
				// followed by necessary number of 'a' 
				// ('show one level less') letters
				results += "e";
				for(var i = 1; i <= distanceToCtxt; i++){
					results += "a";
				}
			}	
		}else if(ctxtNodeLevel == 0){
			results += "da" // get to level zero
			// now write out the correct number of 'b's
			for(var i = 1; i <= this._levelClipping; i++){
				results += "b";
			}	
		}
			
		return results;
	},
	
	_writeStructuralClipping: function(results){
		switch(this.getStructuralClippingType()){
			case hs.filter.ViewspecConstants.BRANCH_ONLY:
				results += "g";
				break;
			case hs.filter.ViewspecConstants.PLEX_ONLY:
				results += "l";
				break;
			case hs.filter.ViewspecConstants.NO_STRUCTURAL_CLIPPING:
				results += "h";
				break;
		}
		
		return results;
	},
	
	_writeContentFiltering: function(results){
		switch(this.getContentFilterType()){
			case hs.filter.ViewspecConstants.NO_FILTERING:
				results += "j";
				break;
			case hs.filter.ViewspecConstants.FILTER_ALL:
				results += "i";
				break;
			case hs.filter.ViewspecConstants.NEXT_FILTERED_NODE:
				results += "k";
				break;
		}
		
		return results;
	},
	
	_writeNodeMetadata: function(results){
		if(this.showNodeAddressing() == true){
			results += "m";
		}else{
			results += "n";
		}
		
		if(this.showNodeLabels() == true){
			results += "C";
		}else{
			results += "D";
		}
		
		if(this.showNodeSignatures() == true){
			results += "K";
		}else{
			results += "L";
		}
		
		switch(this.getNodeAddressingPlacement()){
			case hs.filter.ViewspecConstants.RIGHT:
				results += "G";
				break;
			case hs.filter.ViewspecConstants.LEFT:
				results += "H";
				break;
		}
		
		switch(this.getNodeAddressingType()){
			case hs.filter.ViewspecConstants.SHOW_NODE_ID:
				results += "I";
				break;
			case hs.filter.ViewspecConstants.SHOW_NODE_NUMBER:
				results += "J";
				break;
		}
		
		return results;
	},
	
	_writeNodeAppearance: function(results){
		if(this.showFrozenNodes() == true){
			results += "o";
		}else{
			results += "p";
		}
		
		if(this.showBlankLines() == true){
			results += "y";	
		}else{
			results += "z";
		}
		
		switch(this.getLevelIndentingType()){
			case hs.filter.ViewspecConstants.INDENT_ON:
				results += "A";
				break;
			case hs.filter.ViewspecConstants.INDENT_OFF:
				results += "B";
				break;
			case hs.filter.ViewspecConstants.INDENT_TO_CONTENT:
				results += "Q";
				break;
		}
		
		return results;
	},
	
	_writeSequenceGenerators: function(results){
		if(this.runSequenceGenerators() == true){
			results += "O";
		}else{
			results += "P";
		}
		
		return results;
	},
	
	_filterDefaultViewspecs: function(results){
		// since we are a fully normalized viewspec at this point, we
		// can simply remove any letter from ourselves that is
		// inside the default viewspecs
		for(var i = 0; i < hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.length; 
				i++){
			var currentDefault = 
				hs.filter.ViewspecConstants.DEFAULT_VIEWSPECS.charAt(i);
			results = results.replace(currentDefault, "");
		}						
								
		return results;
	},
	
	_getPlexParentNumber: function(doc){
		var ctxtParent = doc.nodeCtxt.getParent();
		if(ctxtParent == null){
			return hs.filter.ViewspecConstants.NO_PLEX_PARENT;
		}else{
			return ctxtParent.number;
		}
	}
});





/**
	Static singleton viewspec constants useful for working with 
	hs.filter.CurrentViewspecs. 
*/

hs.filter.ViewspecConstants = {
	/** Default viewspecs that all documents start with. */
	DEFAULT_VIEWSPECS: "hjmpuwyACHJLP",
	
	/** Default and max level and line clipping settings. */
	MAX_LEVEL_CLIPPING: 63,
	MAX_LINE_CLIPPING: 63,
	DEFAULT_LEVEL_CLIPPING: 1,
	DEFAULT_LINE_CLIPPING: 1,
	
	/** Displaying metadata on left or right. */
	LEFT: "left",
	RIGHT: "right",
	
	/** What kind of metadata to show. */
	SHOW_NODE_ID: "id",
	SHOW_NODE_NUMBER: "number",
	
	/** Structural clipping. */
	BRANCH_ONLY: "branch",
	PLEX_ONLY: "plex",
	NO_STRUCTURAL_CLIPPING: "none",
	
	/** Content filtering. */
	NO_FILTERING: "none",
	FILTER_ALL: "all",
	NEXT_FILTERED_NODE: "next_node",
	
	/** Indenting. */
	INDENT_ON: "on",
	INDENT_OFF: "off",
	INDENT_TO_CONTENT: "to_context_node",
	
	/** Used for structural plexing. */
	NO_PLEX_PARENT: "none"
}



/*
	A Filter that walks the hs.model.Document tree, replacing OPML nodes
	that have type="include" with the actual contents of the remote OPML
	link, with granular addressing applied (but not any viewspecs that
	might be on the link).
	
	For example, if I have the following OPML node:
	
	<outline type="include" url="http://foobar.com/someDoc.opml#5.n:l" />
	
	Then we will fetch the contents of that link, resolve it's addressing,
	but not apply it's viewspecs.
	
	An optional attribute named hs:include-type can control how much
	of the remote link we fetch. It's value can be "node", "branch",
	or "plex", with the default if none is specified being "node".
	
	The viewspecs of the mother document, i.e. the one doing the inclusion,
	will have it's viewspecs applied to the material that was fetched.
*/

/**
	@param parentAddress : hs.address.Address The parent address
	that is running this transclusion. This is the address
	of the root document that is being displayed to the end
	user.
 */
hs.filter.Transcluder = function(parentAddress){
	this._parentAddress = parentAddress;
}

dojo.lang.mixin(hs.filter.Transcluder.prototype, hs.filter.Filter);

hs.filter.Transcluder.INCLUDE_NODE = "node";
hs.filter.Transcluder.INCLUDE_BRANCH = "branch";
hs.filter.Transcluder.INCLUDE_PLEX = "plex";

dojo.lang.extend(hs.filter.Transcluder, {
	/** 
		Whether our metadata is dirty;
		if so, we must renormalize our
		document.
	*/
	metadataDirty: false,
	
	_totalInclusions: null,	
	_finishedInclusions: 0,
	_readyHandler: null,

	apply: function(doc, readyHandler){
		this._readyHandler = readyHandler;
		
		// compile a list of nodes that want to be
		// transcluded
		
		/**
		  XPath:
		  Grab all outline nodes and get the ones with the
		  attribute 'type' with the value 'include'.
		  
		  Example: //outline[@type = 'include']
		*/
		var nodes = doc.dom.selectNodes("//outline[@type = 'include']");

		if(nodes == null || nodes.length == 0){
			// nothing to do
			this._readyHandler.call(null, doc, null);
		}
		
		this._totalInclusions = nodes.length;
		
		// go through each node and execute an include
		// on it
		for(var i = 0; i < nodes.length; i++){
			var hsNode = new hs.model.Node(nodes.item(i), doc);
			this._executeInclude(hsNode, doc);
		}
		
		// now wait for the results to trickle in
	},
	
	isAsync: function(){
		true;
	},
	
	/**
		@param hsNode : hs.model.Node
		@param doc : hs.model.Document
	 */
	_executeInclude: function(hsNode, doc){
		// get the URL to include
		var url = hsNode.domNode.getAttribute("url");
		
		// get the type of inclusion
		var includeType = 
			hsNode.domNode.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":include-type");
		if(includeType == null
			|| typeof includeType == "undefined"
			|| dojo.string.trim(includeType) == ""){
			includeType = hs.filter.Transcluder.INCLUDE_NODE;		
		}
		
		// now resolve this url into a document we can work with
		var self = this;
		var handler = function(address, includedDoc, error){
			self._finishedInclusions++;
			
			if(error != null && typeof error != "undefined"){ // error!
				hsNode.domNode.setAttribute("text",
							"Include failed for url " 
							+ url + ", error: " 
							+ error.toString());
							
				dojo.dom.setAttributeNS(
							hsNode.domNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
								+ ":include-failed",
							"yes");
			}else{
				// now import our new data
				self._importNodes(doc, includedDoc, 
									includeType, hsNode,
									url);
			}
			
			// if we are completely done call our handler
			if(self._finishedInclusions >= self._totalInclusions){
				self._readyHandler.call(null, doc, null);
			}
		};
		var addr;
		try{
			addr = new hs.address.Address(url);
		}catch(exp){
			// call handler manually with the error
			handler(null, null, exp);
			return;
		}
		addr.resolve(handler, false, doc, 
					true, this._parentAddress);
	},
	
	/**
		Takes a new XML DOM from a transcluded document
		(includedDoc); uses the 'includeType' to figure out 
		how to add these new nodes; and then replaces
		these nodes inside of 'hsNode' appropriately.
		
		@param parentHsDoc : hs.model.Document The
		parent Document that we are transcluding 
		into (i.e. the mother document).
		@param includedDoc : hs.model.Document
		The fetched, remote document for the URL 
		that we are transcluding into our mother document.
		@param includeType : String One of our
		hs.filter.Transcluder constants, which are
		INCLUDE_NODE, INCLUDE_BRANCH, or 
		INCLUDE_PLEX.
		@param hsNode : hs.model.Node The node
		we are going to replace with our transclusion.
	 */
	_importNodes: function(parentHsDoc, includedDoc, 
							includeType, hsNode, url){
		if(includeType == hs.filter.Transcluder.INCLUDE_NODE){
			this._includeSingleNode(parentHsDoc, includedDoc, 
									includeType, hsNode, url);
		}else if(includeType == hs.filter.Transcluder.INCLUDE_BRANCH){
			this._includeBranch(parentHsDoc, includedDoc,
								includeType, hsNode, url);
		}else if(includeType == hs.filter.Transcluder.INCLUDE_PLEX){
			this._includePlex(parentHsDoc, includedDoc,
								includeType, hsNode, url);
		}							
	},
	
	_includeSingleNode: function(parentHsDoc, includedDoc,
								includeType, hsNode, url){
		// get the node to include
		var newDOMNode = includedDoc.nodeCtxt.domNode;
		newDOMNode = newDOMNode.cloneNode(false);
		
		// update our leveling info to be correct;
		// we are now at the same level as what we
		// once replaced
		dojo.dom.setAttributeNS(
							newDOMNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":level",
							hsNode.level);
								
		// set what our correct number should be
		dojo.dom.setAttributeNS(
							newDOMNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + ":number",
							hsNode.number);
								
		this._setIncluded(newDOMNode, url,
							hs.filter.Transcluder.INCLUDE_NODE);
								
		// now replace the old node that had the 
		// transclusion directive with our new one
		var replaceInside = hsNode.domNode.parentNode;
		var replaceMe = hsNode.domNode;
		replaceInside.replaceChild(newDOMNode, replaceMe);	
	},
	
	_includeBranch: function(parentHsDoc, includedDoc,
							includeType, hsNode, url){
		// get the node to include
		var newDOMNode = includedDoc.nodeCtxt.domNode;
		
		// mark all of these as included
		this._setIncluded(newDOMNode, url, 
							hs.filter.Transcluder.INCLUDE_BRANCH);
		
		// now clone it
		newDOMNode = newDOMNode.cloneNode(true);
								
		// now replace the old node that had the 
		// transclusion directive with our new one
		var replaceInside = hsNode.domNode.parentNode;
		var replaceMe = hsNode.domNode;
		replaceInside.replaceChild(newDOMNode, replaceMe);	
		
		// our metadata is now dirty
		this.metadataDirty = true;
	},
	
	_includePlex: function(parentHsDoc, includedDoc,
							includeType, hsNode, url){
		// get our initial target node
		var targetNode = includedDoc.nodeCtxt.domNode;
		
		// move backwards until we hit the first sibling
		var firstSibling = targetNode;
		while(firstSibling.previousSibling != null){
			firstSibling = firstSibling.previousSibling;
		}
		
		// we might have a text node, which we don't want;
		// keep moving forward until we get a real element now
		while(firstSibling.nextSibling != null
				&& firstSibling.nodeType != dojo.dom.ELEMENT_NODE){
			firstSibling = firstSibling.nextSibling;			
		}

		// now clone and insert each node moving forward
		targetNode = firstSibling;
		var lastNode = hsNode.domNode;
		while(targetNode != null){
			if(targetNode.nodeType == dojo.dom.ELEMENT_NODE){
				// mark these as included
				this._setIncluded(targetNode, url,
								hs.filter.Transcluder.INCLUDE_PLEX);
				
				// clone
				var newNode = targetNode.cloneNode(true);
				
				// insert
				dojo.dom.insertAfter(newNode, lastNode);
				
				// the next time around insert our node
				// after the one we just entered
				lastNode = newNode;
			}
			
			// next sibling
			targetNode = targetNode.nextSibling;
		}
		
		// now remove the node that had the inclusion
		// directive
		dojo.dom.removeNode(hsNode.domNode);
		
		// our metadata is now dirty
		this.metadataDirty = true;
	},
	
	_setIncluded: function(rootDOMNode, url, includedType){
		var visitMe = new Array();
		visitMe.push(rootDOMNode);
		while(visitMe.length > 0){
			// get our current node
			var currentNode = visitMe.pop();
			
			// 'visit' it
			dojo.dom.setAttributeNS(
							currentNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
									+ ":included",
							"yes");
			dojo.dom.setAttributeNS(
							currentNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
									+ ":included-from",
							url);
			dojo.dom.setAttributeNS(
							currentNode,
							hs.model.Document.HS_INTERNAL_NAMESPACE_URI,
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX 
									+ ":included-type",
							includedType);
											
			// remove any old node IDs because they are unique in
			// a single document only, and we could have collisions
			currentNode.removeAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":nid");
							
			// push this node's children onto the visit stack
			var children = currentNode.childNodes;
			for(var i = children.length; i >= 0 ; i--){
				if(children[i] && children[i].nodeType == dojo.dom.ELEMENT_NODE){
					visitMe.push(children[i]);
				}
			}
		}
	}
});
