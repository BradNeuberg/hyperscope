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

	This package contains hs.model, which has our core abstractions when dealing
	with HyperScope documents, nodes, and our position inside nodes. It
	has the following classes:
	
	hs.model.Node
		Represents a node in an hs.model.Document
	
	hs.model.Document
		Represents a HyperScope outline document that can be interacted with 
		and jumped through.
	
	hs.model.NodeCursor
		A 'cursor' in an hs.model.Node that can jump through the textual 
		contents of a node to perform string positioning by character, word, 
		link, etc.
		
	It also contains variables to control whether we are in a testing
	environment (djConfig.testing, hs.model.testingCurrentURL), as
	well as an event that should be attached to before using the HyperScope
	core:
	
	hs.model.addOnLoad(myListener.myMethod);
	
	This will ensure that all asychronous resources and the browser are ready before any
	operations.
	
	A djConfig variable, djConfig.profiling, can be turned on in your djConfig
	script block; this will start profiling the system and print the results when the page
	is finished.
	
	A djConfig variable, alertRenderResults, can be turned on which will cause a textarea
	to appear with the final HTML results after an XSLT pass, which can be useful for
	debugging rendering issues.
*/

dojo.provide("hs.model");

dojo.require("hs.util"); // make sure hs.util is loaded before hs.model

dojo.require("dojo.io.*");
dojo.require("dojo.string.*");
dojo.require("dojo.dom");
dojo.require("dojo.event.*");

dojo.require("sarissa.core");
dojo.require("sarissa.xpath");

/**
	A flag that when turned on means we are in testing mode.
	Classes may act differently in this mode, such as making
	all network calls synchronous to help with testing, modifying
	and reading the current URL we are at from hs.testingCurrentURL
	rather than from window.location.href, etc. This helps
	with our unit testing.  	
	
	Set this in your djConfig script block at the top of the page.
	Example:
	
	<script type="text/javascript">	
		var djConfig = { testing: true, 
						 disableFlashStorage: true };
	</script>
			
 */
if(dojo.lang.isUndefined(djConfig.testing)){
	djConfig.testing = false;
}

/**
  	A variable that 'mimics' window.location.href for environments
  	that can't change this or read it, such as when unit testing.
 */
hs.model.testingCurrentURL = window.location.href;

/**
  Create a way for user-interfaces to know when they can begin
  to use the HyperScope core for operations. To attach to this
  call:
  
  hs.model.addOnLoad(myListener.myMethod);
  
  This will ensure that all asychronous resources are loaded and the
  browser is ready (i.e. you can begin to manipulate the DOM).
*/

hs.model.addOnLoad = function(loadHandler){
	hs.model._loadHandler = loadHandler;
	if(hs.model._isLoaded == true){
		hs.model._loaded();
	}
}

hs.model._loaded = function(){
	hs.model._isLoaded = true;
	if(dojo.lang.isUndefined(hs.model._loadHandler) == false){
		hs.model._loadHandler.call(null);
	}
}



/**
	Represents a node in an hs.model.Document.
	
	@param domNode : DOMNode
	@param doc : hs.model.Document  - The hs.model.Document
	this node is a member of.
*/

hs.model.Node = function(domNode, doc){
	this.domNode = domNode;
	this.doc = doc;
	
	// extract our metadata from the node
	// number - ex: 2A2
	this.number = domNode.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
										+ ":number");
	// level - ex: 1
	this.level = domNode.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
										+ ":level");
	this.level = new Number(this.level).valueOf();
	
	// node counter - ex: 639
	this.nodeCounter = domNode.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
										+ ":node-counter");
	this.nodecounter = new Number(this.nodeCounter).valueOf();
	
	// id - ex: 023									
	this.id = domNode.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":nid");
	
	// label - ex: foobar
	this.label = domNode.getAttribute(hs.model.Document.HS_NAMESPACE_PREFIX
										+ ":label");
	
	// data - ex: here is some data									
	this.data = domNode.getAttribute("text");
	
	// node cursor for random access text movement
	this.cursor = new hs.model.NodeCursor(this);
}

dojo.lang.extend(hs.model.Node, {
	/** The hs.model.Document this node is a member of. */
	doc: null,
	
	/** This node's number, such as "2A", held as a String */
	number: null,
	
	/** This node's number, such as "023", held as a String. */
	id: null,
	
	/** This node's current level in the document, starting from 0. */
	level: null,
	
	/** Where the cursor is pointing for this node. Is an hs.model.NodeCursor. */
	cursor: null,
	
	/** The underlying DOM node for this hs.model.Node. */
	domNode: null,
	
	/** Our data, usually text, in this node. */
	data: null,
	
	/** 
	  	A private variable that is our position in the XML DOM, in order of
	  	how we appear in the document independent of it's hierarchical placement.
	  	Starts at 1.
	 */
	nodeCounter: null,

	/**
		Jumps up from this current node.
		
		@param offset The number of nodes to jump. If left off,
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpUp: function(offset){
		offset = this._handleOffset(offset);
		
		/**
		  XPath:
		  Grab all outline nodes, get the one with the attribute 'number' equal
		  to this node's number, then grab it's ancestor elements and make sure
		  it is an outline element itself.
		  
		  Example: //outline[@hs-internal:number = '2A']/ancestor::outline
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":number = '" + this.number + "']"
													+ "/ancestor::outline");
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		/**
		  The 'ancestor' axis gives everything in reverse, so item(0) would
		  be the first ancestor in the document, and the last item would be
		  the node ancestor right before our context node. 
		*/	

		if(offset > nodes.length){
			offset = 0; // grab first ancestor
		}else{
			offset = nodes.length - offset;
		}
		
		var result = nodes.item(offset);
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
		Jumps down from this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpDown: function(offset){
		offset = this._handleOffset(offset);
		
		// keep iterating through each child, grabbing the first one
		var childNode = dojo.dom.firstElement(this.domNode);
		var childIndex = 1;
		while(childNode != null && childIndex < offset){
			childNode = dojo.dom.firstElement(childNode);
			childIndex++;
		}
		
		var result;
		if(childNode != null){
			result = new hs.model.Node(childNode, this.doc);
		}else{
			result = this;
		}
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
		Jumps back from this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpBack: function(offset){
		offset = this._handleOffset(offset);
		
		var nodeCounter = this.nodeCounter - offset;
		if(nodeCounter <= 0){
			nodeCounter = 0;
		}
		
		/**
		 	XPath:
			Grab all the outline nodes, then select the one with the attribute
			'node-counter' with the given value.
			We added 'node-counter' to every element during normalization, which is
			the linear offset of a given node from the top, as it would be printed
			on a page, for example, independent of it's hierarchical position.
			
			Example: //outline[@hs-internal:node-counter = '22']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + nodeCounter + "']");
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		var result = nodes.item(0);
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},

	/**
		Jumps to the next node from this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpNext: function(offset){
		offset = this._handleOffset(offset);

		var nodeCounter = new Number(this.nodeCounter).valueOf() + offset;
		
		// if the offset jumps us beyond the end of the document,
		// just jump to the last node instead
		if(nodeCounter > this.doc._nodeCounter){
			nodeCounter = this.doc._nodeCounter;
		}
		
		/**
		 	XPath:
			Grab all the outline nodes, then select the one with the attribute
			'node-counter' with the given value.
			We added 'node-counter' to every element during normalization, which is
			the linear offset of a given node from the top, as it would be printed
			on a page, for example, independent of it's hierarchical position.
			
			Example: //outline[@hs-internal:node-counter = '22']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + nodeCounter + "']");
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		var result = nodes.item(0);
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
		Jumps to the end of the branch relative to this current node.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpBranchEnd: function(){
		// simply return ourselves we don't have any children
		if(this.domNode.childNodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
        
		/**
			XPath:
			Grab all of our descendant nodes in the descendant axis,
			starting from our position. Then, simply grab
			the last entry in the node list that is returned.
            
			Example: 
			//outline[@hs-internal:node-counter = '22']/descendant::outline
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
				+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
				+ ":node-counter = '" + this.nodeCounter + "']"
				+ "/descendant::outline");
				
		if(nodes == null || nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
        
		var result = nodes.item(nodes.length - 1);
		result = new hs.model.Node(result, this.doc);
        
		this.doc.nodeCtxt = result;
        
		return result;
	},
	
	/**
		Jumps to the head of the plex of this current node.
		
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpPlexHead: function(){
		var nodes = this._getPredecessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		/**
		  The 'preceding' axis gives everything in order, so item(0) would
		  be the first node in the document, and the last item would be
		  the node right before our context node. 
		*/	
		
		var domNode = nodes.item(0);
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Jumps to the tail of the plex of this current node.
		
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpPlexTail: function(){
		var nodes = this._getSuccessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		// simply grab the final entry
		var domNode = nodes.item(nodes.length - 1);
		
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Jumps to the successor of this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpSuccessor: function(offset){
		offset = this._handleOffset(offset);
		
		var nodes = this._getSuccessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		var domNode;
		if(nodes.length < offset){ // offset too large
			// just return last node
			domNode = nodes.item(nodes.length - 1);
		}else{
			domNode = nodes.item(offset - 1);
		}
		
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Jumps to the predecessor of this current node.
		
		@param offset The number of nodes to jump. If left off 
		defaults to 1.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpPredecessor: function(offset){
		offset = this._handleOffset(offset);
		
		var nodes = this._getPredecessorDomNodes();
													
		if(nodes.length == 0){
			this.doc.nodeCtxt = this;
			return this.doc.nodeCtxt;
		}
		
		/**
		  The 'preceding' axis gives everything in order, so item(0) would
		  be the first node in the document, and the last item would be
		  the node right before our context node. Jump from the end of
		  the results using our offset.
		*/	

		var domNode;
		if(nodes.length < offset){ // offset too large
			// just return first node
			domNode = nodes.item(0);
		}else{
			domNode = nodes.item(nodes.length - offset);
		}
		
		var result = new hs.model.Node(domNode, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return this.doc.nodeCtxt;
	},
	
	/**
		Within this current node, does a search for a node that matches this
		label. Example: !foobar
		
		This will always return the first match. Next is not supported,
		as Augment does not support it itself (i.e. !*foobar or !**foobar
		versus !foobar).
		
		@param label The label to find.
		@throws hs.exception.Jump
		@returns hs.model.Node The node jumped to.
	*/
	jumpBranchSearch: function(label){
		// validate the label
		label = new hs.address.NodeLabel(label).label;
		
		/**
		 	XPath:
			Jump to our location in the document as our context; then, once
			there, grab the 'descendant' axis (i.e. all of our children),
			but only the one's with a matching label (hs:label).
			
			Example: 
			//outline[@hs-internal:node-counter = '22']/descendant::outline[@hs-internal:label = 'foo']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + this.nodeCounter + "']"
													+ "/descendant::outline["
													+ "@" + hs.model.Document.HS_NAMESPACE_PREFIX
													+ ":label = '" + label + "']");
		if(nodes == null || nodes.length == 0){
			throw new hs.exception.Jump(
							"? " + label,
							this.doc, this.doc.address);
		}
		
		var result = nodes.item(0); // grab first match
		result = new hs.model.Node(result, this.doc);
		
		this.doc.nodeCtxt = result;
		
		return result;
	},
	
	/**
	  Jumps the given offset relative to this node.
	  
	  @param number : String A number to jump relative, such as "2A5B", which would
	  to this node's second child (2), that child's first child (A), and so on.
	  @returns hs.model.Node The node jumped to.
	  @throws hs.exception.Jump
	 */
	jumpOffset: function(number){
		// validate the number
		number = new hs.address.NodeNumber(number).number;
		
		// fetch each piece of this number, and jump to that child
		var tk = new hs.util.NodeNumberTokenizer(number);
		var parent = this;
		while(tk.hasNext()){
			// get next offset and children to jump to
			var offset = tk.next();
			var children = parent.getChildNodes();
			if(children.length < offset){
				throw new hs.exception.Jump("? " + number, 
											this.doc.address, this.doc);
			}
			
			// jump to the right child
			var target = children[offset - 1];
			
			// now repeat this on the target
			parent = target;
		}
		
		// make this our new context
		this.doc.nodeCtxt = parent;
		
		return this.doc.nodeCtxt;
		
	},
	
	/**
	  Jumps to the given external label.
	  
	  @param label : String The external label.
	  @returns hs.model.Node The node jumped to.
	  @throws hs.exception.Jump
	 */
	jumpExternal: function(label){
		dojo.raise("jumping to an external label not implemented");
	},
	
	/** 
		Tests this node data using some regular expression.
		
		@param expression A JavaScript regular expression or
		a String to test against this
		node.
		@returns Boolean
	*/
	test: function(expression){
		var result;
		
		// are we a regular expression?
		if(dojo.lang.isUndefined(expression.test) == false){
			result = expression.test(this.data);
		}else{ // we are a string
			result = (this.data.indexOf(expression) != -1);
		}
		
		return result;
	},
	
	/**
	  Returns all of the hs.model.Node's of this child.
	  
	  @returns Array of hs.model.Nodes - Returns zero length
	  array if there are no children.
	 */
	getChildNodes: function(){
		var results = new Array();
		var childDomNode = dojo.dom.firstElement(this.domNode);
		while(childDomNode != null){
			var node = new hs.model.Node(childDomNode, this.doc);
			results.push(node);
			childDomNode = dojo.dom.nextElement(childDomNode);
		}
		
		return results;
	},
	
	/**
	  Gets the hs.model.Node that is the parent of this 
	  node; null if there is none.
	  
	  @returns hs.model.Node
	 */
	getParent: function(){
		/**
		  XPath:
		  Look through all outline nodes; grab the one with
		  a 'number' equal to our own, then get our immediate
		  parent node.
		  
		  Example: //outline[@hs-internal:number = '2A']/parent::outline
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
												+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
												+ ":number = '" + this.number + "']"
												+ "/parent::outline");

		if(nodes == null || nodes.length == 0){
			return null;
		}
		
		var result = nodes.item(0);
		result = new hs.model.Node(result, this.doc);
		
		return result;
	},
	
	_handleOffset: function(offset){
		if(dojo.lang.isUndefined(offset)){
			offset = 1;
		}
		
		offset = new Number(offset).valueOf();
		
		if(offset <= 0){
			throw new hs.exception.Jump(
							"? " + offset, 
							this.doc, this.doc.address);
		}
		
		return offset;
	},
	
	/**
	  Gets all of the preceding nodes of our's that are at the
	  same level as us and share our upstatement.
	 */
	_getPredecessorDomNodes: function(){
		// figure out our parent's node number; we will
		// do a partial match on all of our predecessors
		// using this to make sure we all have the same
		// upstatement
		var parentNumber = "";
		var parent = this.domNode.parentNode;
		if(parent != null){
			parentNumber = parent.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":number");
		}
		
		if(parentNumber == "0" || parentNumber == null){
			parentNumber = "";
		}
		
		/**
		 	XPath:
			Jump to our location in the document as our context; then, once
			there, grab the 'preceding' axis, but only at the same level as us
			(hs-internal:level), and only if the number starts with the same
			values as our parent, such as '2A'.
			
			Example: 
			//outline[@hs-internal:node-counter = '22']
			  /preceding::outline[starts-with(@hs-internal:number, '2A') and @hs-internal:level = '5']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + this.nodeCounter + "']"
													+ "/preceding::outline["
													+ "starts-with("
													+ "@" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":number, '" + parentNumber + "') "
													+ "and @" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":level = '" + this.level + "'"
													+ "]");
													
		if(nodes == null || dojo.lang.isUndefined(nodes)){
			return new Array();
		}else{
			return nodes;
		}
	},
	
	/**
	  Gets all of the succeeding nodes of our's that are at the
	  same level as us and share our upstatement.
	 */
	_getSuccessorDomNodes: function(){
		// figure out our parent's node number; we will
		// do a partial match on all of our successors
		// using this to make sure we all have the same
		// upstatement
		var parentNumber = "";
		var parent = this.domNode.parentNode;
		if(parent != null){
			parentNumber = parent.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":number");
		}
		
		if(parentNumber == "0" || parentNumber == null){
			parentNumber = "";
		}
		
		/**
		 	XPath:
			Jump to our location in the document as our context; then, once
			there, grab the 'following' axis, but only at the same level as us
			(hs-internal:level), and only if the number starts with the same
			values as our parent, such as '2A'.
			
			Example: 
			//outline[@hs-internal:node-counter = '22']
			  /following::outline[starts-with(@hs-internal:number, '2A') and @hs-internal:level = '5']
		*/
		var nodes = this.doc.dom.selectNodes("//outline[@"
													+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":node-counter = '" + this.nodeCounter + "']"
													+ "/following::outline["
													+ "starts-with("
													+ "@" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":number, '" + parentNumber + "') "
													+ "and @" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
													+ ":level = '" + this.level + "'"
													+ "]");
													
		if(nodes == null || dojo.lang.isUndefined(nodes)){
			return new Array();
		}else{
			return nodes;
		}
	}
});




/** 
	Represents a HyperScope outline document that can be interacted with 
	and jumped through.
	
	@param address : hs.address.Address - The original, unexpanded 
	hs.address.Address pointing to this document.
	@param expandedAddress : hs.address.Address - Our fully 
	expanded hs.address.Address, suitable for resolving.
	@param dom - The XML DOM for this loaded document -
	can be null
	@throws hs.exception.InvalidAddress
*/

hs.model.Document = function(address, dom){
	this.address = address;
	this.dom = dom;	
	this.origDom = dom;
	
	if(this.dom != null && dojo.lang.isUndefined(dom) == false){
		// normalize ourselves
		this.normalize();
		
		// set our default node ctxt
		this.jumpOrigin();
		
		// initialize our current viewspecs to the
		// default viewspecs
		this.currentViewspecs = 
			new hs.filter.CurrentViewspecs(null, this);
	}
}

/** The default file extension for HyperScope documents. */
hs.model.Document.DEFAULT_FILE_EXTENSION = "opml";

/** Our custom 'hs' attributes in OPML's namespace. */
hs.model.Document.HS_NAMESPACE_PREFIX = "hs";
hs.model.Document.HS_NAMESPACE_URI = "http://www.hyperscope.org/hyperscope/opml/public/2006/05/09";
hs.model.Document.HS_NAMESPACE = 
					"xmlns:" + hs.model.Document.HS_NAMESPACE_PREFIX + "='" 
					+ hs.model.Document.HS_NAMESPACE_URI + "'";

/** Our custom 'hs-internal' attributes in OPML's namespace. */
hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX = "hs-internal";
hs.model.Document.HS_INTERNAL_NAMESPACE_URI = "http://www.hyperscope.org/hyperscope/opml/private/2006/05/09";
hs.model.Document.HS_INTERNAL_NAMESPACE = 
					"xmlns:" + hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX + "='" 
					+ hs.model.Document.HS_INTERNAL_NAMESPACE_URI + "'";
					
/** Our render.xsl's url and name. */
hs.model.Document._RENDER_XSLT_NAME = "render";
hs.model.Document._RENDER_XSLT_URL = djConfig.baseRelativePath 
								 		+ "../hs/xslt/render.xsl";
										
/**
  	Our build file, in the 'optimize' task, inline's all of
  	our render XSLT into this variable to reduce page load time.
 */
hs.model.Document._RENDER_XSLT_CONTENT = null;
	
					
/** 
	Initializes HyperScope loading by grabbing our XSLT resources, 
	such as render.xsl. 
*/
hs.model.Document._initializeXSLT = function(){
	// wait till everything is loaded before we are loaded
	dojo.event.connect(dojo, "loaded", function(){

		// if we have been optimized with our 'optimize'
		// ant task, then our XSLT should be inlined
		if(hs.model.Document._RENDER_XSLT_CONTENT != null){
			var data = hs.model.Document._RENDER_XSLT_CONTENT;
			
			// create an instance of XSLTProcessor
			var processor = new XSLTProcessor();
			
			// create a DOM Document containing an XSLT stylesheet
			var xslDoc = Sarissa.getDomDocument();
			xslDoc = (new DOMParser()).parseFromString(data, "text/xml");
			
			// make the stylesheet reusable by importing it in the 
			// XSLTProcessor
			processor.importStylesheet(xslDoc);
			
			hs.model.Document._renderXslt = processor;
			
			hs.model._loaded(); // fire 'loaded' event
		}else{ // dev environment where we load XSLT dynamically
			// load our XSLT resources

			var xsltFiles = new Array();
			
			xsltFiles.push({name: hs.model.Document._RENDER_XSLT_NAME,
							url: hs.model.Document._RENDER_XSLT_URL});
							
			var xsltLoader = new hs.util.XSLTLoader(xsltFiles, function(status, error){

				if(status == false){
					throw error;
				}
				
				hs.model.Document._renderXslt = 
						xsltLoader.getXSLT(hs.model.Document._RENDER_XSLT_NAME);
						
				hs.model._loaded(); // fire 'loaded' event
			});
		
			xsltLoader.load();	
		}
	});
}

// initialize our hs.model.Document's render XSLT on page load
hs.model.Document._initializeXSLT();


dojo.lang.extend(hs.model.Document, {
	/** The original, unexpanded hs.address.Address pointing to this document. */
	address: null,

	/** 
		Our working DOM that is changed by filters and which we render when
		done filtering.
	*/
	dom: null,

	/** The original, unchanged DOM. */
	origDom: null,

	/** 
		Our context node, which all operations are done relative to. In a UI,
		this node would usually be at the "top" of the screen. Is an
		hs.model.Node.
	*/
	nodeCtxt: null,

	/** 
		The current viewspecs applied to this document. An hs.filter.CurrentViewspecs
		object.
	*/
	currentViewspecs: null,

	/** Our rendered HTML as a string ready to be displayed. */
	renderedHtml: null,
	
	/** Our rendered HTML as a DOM ready to be displayed. */
	renderedHtmlDom: null,

	/** 
		Normalizes this document for further processing and filtering. 
		
		@throws hs.exception.Filter	
	*/
	normalize: function(){
		var n = new hs.filter.Normalizer();
		n.apply(this);
	},

	/** 
		Jumps to the origin of this document, setting 
		hs.model.Document.nodeCtxt appropriately.
		
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump
	*/
	jumpOrigin: function(){
		// get the first outline node from the root
		var domNode = this.getOriginDomNode();
		
		// make sure it is good data
		if(domNode == null){
			throw new hs.exception.Jump("No origin node in document", this, this.address);
		}
		
		// set our context
		var hsNode = new hs.model.Node(domNode, this);
		this.nodeCtxt = hsNode;
		
		return hsNode;
	},
	
	/** 
		Jumps to a node in this document that has the given node
		number, such as 2A, setting hs.model.Document.nodeCtxt appropriately.
		
		@param number A string with the number to go to, case-insensitive.
		@returns hs.model.Node The new context node jumped to. 
		@throws hs.exception.Jump Throws exception if number not found.
	*/
	jumpNumber: function(number){
		// validate the number
		number = new hs.address.NodeNumber(number).number;
		
		var domNode = this.dom.selectNodes("//outline[@"
											+ hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
											+ ":number = '" + number + "']");

		// make sure it is good data
		if(domNode == null || domNode.length == 0){
			throw new hs.exception.Jump("? " + number, 
										this, this.address);
		}

		// set our context node
		domNode = domNode.item(0);
		var hsNode = new hs.model.Node(domNode, this);
		this.nodeCtxt = hsNode;

		return hsNode;
	},
	
	/** 
		Jumps to a node in this document that has the given node
		ID, such as 023, setting hs.model.Document.nodeCtxt appropriately.
		
		@param id A string with the id to go to; must be preceded with a zero,
		such as "023".
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if number not found.
	*/
	jumpId: function(id){
		// validate the id
		id = new hs.address.NodeID(id).id;
		
		var domNode = this.dom.selectNodes("//outline[@"
											+ hs.model.Document.HS_NAMESPACE_PREFIX
											+ ":nid = '" + id + "']");
		// make sure it is good data
		if(domNode == null || domNode.length == 0){
			throw new hs.exception.Jump("? " + id, 
										this, this.address);
		}
		
		// set our context node
		domNode = domNode.item(0);
		var hsNode = new hs.model.Node(domNode, this);
		this.nodeCtxt = hsNode;
		
		return hsNode;
	},
	
	/** 
		Jumps to a node in this document that has the given marker, setting 
		hs.model.Document.nodeCtxt appropriately.
		
		@param marker A string with the marker to go to, such as "foobar".
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if marker not found.
	*/
	jumpMarker: function(marker){
		// validate the marker
		marker = new hs.address.Marker(marker).name;
		
		// get a node walker, starting from our current context
		var walker = new hs.util.NodeWalker(this.nodeCtxt);
		
		// walk our nodes, testing each one with a regular expression to
		// find this marker
		
		// the regular expression below basicly looks for:
		// <a name="markerName"></a>
		// allowing arbitrary spaces all over the place, as well
		// as both single and double-quotes; it is case-insensitive
		// and works over multiple lines (i.e. the "im" options)
		var markerRegExp = new RegExp("<\s*a[ ]+name=\s*[\"\']" 
										+ marker + "[\"\']\s*>\s*<\s*\/\s*a\s*>", "im");
		var matchingNode = null;
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our marker?
			if(node.test(markerRegExp)){
				matchingNode = node;
				// we're done
				break;
			}
		}
		
		if(matchingNode == null){
			throw new hs.exception.InvalidAddress("? " + marker,
													this, this.address);
		}
		
		// TODO: Update our node cursor to actually point using character
		// relative addressing and a NodeCursor to the actual matching
		// letter inside of this matching node
		
		this.nodeCtxt = matchingNode;
		
		return this.nodeCtxt;
	},
	
	/** 
		Jumps to a node in this document that has the given label, setting 
		hs.model.Document.nodeCtxt appropriately.
		
		@param label A string with the label to go to, such as "foobar".
		@param jumpType An hs.commands.JumpConstants that controls which label
		to find; can be FIRST or NEXT.
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if label not found.
	*/
	jumpLabel: function(label, jumpType){
		// validate our label
		label = new hs.address.NodeLabel(label).label;
		
		/**
		  Our approach: Determine our starting context node; if the jump type is FIRST,
		  then this will be the origin; if it is NEXT, then it will be relative to our
		  current context node.
		  
		  Next, execute XPath that simply uses our context node address, gets the
		  'following' axis, and then matches against the hs:label attribute
		  with the given label.
		 */
		var startingNode;
		if(jumpType == hs.commands.JumpConstants.FIRST){
			// get the first outline node from the root
			var domNode = this.getOriginDomNode();
			
			// make sure it is good data
			if(domNode == null){
				throw new hs.exception.Jump("No origin node in document", this, this.address);
			}
			
			startingNode = new hs.model.Node(domNode, this);
			includeCtxt = true;
		}else if(jumpType == hs.commands.JumpConstants.NEXT){
			startingNode = this.nodeCtxt;
			includeCtxt = false;
		}else{
			throw new hs.exception.Jump("Unknown jump type given to jumpLabel: "
											+ jumpType, this, this.address);
		}
		
		// get a node walker, starting from the correct context
		var walker = new hs.util.NodeWalker(startingNode, includeCtxt);
		
		// walk our nodes, testing each one with our content
		var matchingNode = null;
		var regExp = new RegExp("^" + this._escapeData(label) + "$", "i");
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our label?
			if(regExp.test(node.label)){
				matchingNode = node;
				// we're done
				break;
			}
		}
		
		if(matchingNode == null){
			throw new hs.exception.InvalidAddress("? " + label,
													this, this.address);
		}
		
		this.nodeCtxt = matchingNode;
		
		return this.nodeCtxt;
	},
	
	/** 
		Jumps to a node in this document that has the given word, setting 
		hs.model.Document.nodeCtxt appropriately. Only exact matches of word
		will be found; partial matches within content do not match this jump
		type. Word matching is case-sensitive.
		
		@param word A string with the word to go to, such as "foobar".
		@param jumpType An hs.commands.JumpConstants that controls which word
		to find; can be FIRST or NEXT.
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if word not found.
	*/
	jumpWord: function(word, jumpType){
		// This reg exp basicly inserts the word to find, and makes
		// sure that it begins and ends with either a space or is at
		// the beginning or end of the string. It is case-insensitive.
		var escapedWord = this._escapeData(word);
		var wordRegExp = new RegExp("(?:^|[ ])" + escapedWord + "(?:$|[ ])");
		
		return this._doSearch(word, wordRegExp, jumpType);
	},
	
	/** 
		Jumps to a node in this document that has the given content, setting 
		hs.model.Document.nodeCtxt appropriately. Partial matches work for
		this jump type, such as "foo" in the word "foobar". 
		Content matching is case-insensitive.
		
		@param content A string with the content to go to, such as "foobar".
		@param jumpType An hs.commands.JumpConstants that controls which content
		to find; can be FIRST or NEXT.
		@returns hs.model.Node The new context node jumped to.
		@throws hs.exception.Jump Throws exception if content not found.
	*/
	jumpContent: function(content, jumpType){
		return this._doSearch(content, content, jumpType);
	},

	/** 
		Renders this document, using its hs.model.Document.dom to create the
		final result.
		
		@returns String The rendered document as an HTML string.
		@throws hs.exception.Render
	*/
	render: function(){
		//debug("render");
		hs.profile.start("render");
		
		var xslt = this.getRenderXSLT();
		
		// set our context node
		xslt.setParameter(
				hs.model.Document.HS_INTERNAL_NAMESPACE_URI, 
				"context-node-number", 
				this.nodeCtxt.number);
				
		// apply our viewspecs
		this.currentViewspecs.apply(this);
		
		// transform the document
	    hs.profile.start("render_xslt");
		this.renderedHtmlDom = xslt.transformToDocument(this.dom);
		hs.profile.end("render_xslt");

	    // show transformation results;
		// commented out because we don't need an HTML string anymore;
		// we use the rendered DOM now for faster performance;
		// we provide a djConfig variable which can still 'alert'
		// this result to help with debugging, though.
		//this.renderedHtml = dojo.dom.innerXML(this.renderedHtmlDom);
		if(djConfig.alertRenderResults == true){
			this._alertRenderResults();
		}
		
		hs.profile.end("render");
		
		// FIXME: Do we still want to be returning this.renderedHtml,
		// since we don't use it anymore due to performance
		// reasons?
		return this.renderedHtml;
	},
	
	/**
	  Produces a URL string that can be used to re-render
	  and produce this document's view and context nodes.
	  
	  Removes default information, such as if the 
	  context node is 0 and spurious viewspecs.
	  
	  @return String The full URL
	 */
	toURL: function(){
		var results = this.address.clone();
		
		// consolidate to just our context node
		results.nodeAddresses = new Array();
		if(this.nodeCtxt.number != "0"){ // don't print out default node
			if(this.nodeCtxt.id != null){ // our node has an ID attribute
				var nodeId = new hs.address.NodeID(this.nodeCtxt.id);
				results.nodeAddresses.push(nodeId);
			}else{ // no ID attribute in this document's node
				var nodeNumber = 
					new hs.address.NodeNumber(this.nodeCtxt.number, false);
				results.nodeAddresses.push(nodeNumber);
			}
		}
		
		// consolidate viewspecs
		var minimizedViewspecs = this.currentViewspecs.toString();
		results.viewspecs = new Array();
		for(var i = 0; i < minimizedViewspecs.length; i++){
			var v = new hs.address.Viewspec(minimizedViewspecs.charAt(i));
			results.viewspecs.push(v);
		}
		
		return results.toString();
	},
	
	/**
	  Returns an XSLT script suitable for rendering this
	  hs.model.Document. Used primarily by hs.filter.Filters such
	  as hs.filter.CurrentViewspecs.
	  
	  @returns An XSLTProcessor object.
	 */
	getRenderXSLT: function(){
		return hs.model.Document._renderXslt;
	},
	
	getOriginDomNode: function(){
		var domNode = this.dom.selectNodes("/opml/body/outline[position() = 1]");
		
		// make sure it is good data
		if(domNode == null || domNode.length == 0){
			return null;
		}
		
		// get the node
		domNode = domNode.item(0);
		
		return domNode;
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
	
	/**
	  Factors out the commonalities between
	  jumpContent and jumpWord, allowing a tester
	  to be passed in which is the only difference.
	  
	  @param content : String - Content to search for.
	  @param tester : String or RegExp - What to apply tests
	  using.
	  @param jumpType An hs.commands.JumpConstants that controls which content
		to find; can be FIRST or NEXT.
	 */
	_doSearch: function(content, tester, jumpType){
		// validate the content
		if(content == null || dojo.lang.isUndefined(content)
			|| dojo.string.trim(content) == ""){
			throw new hs.exception.Jump("? " + content,
										this, this.address);		
		}
		
		// get our starting context
		var startingNode;
		var includeCtxt;
		if(jumpType == hs.commands.JumpConstants.FIRST){
			// get the first outline node from the root
			var domNode = this.getOriginDomNode();
			
			// make sure it is good data
			if(domNode == null){
				throw new hs.exception.Jump("No origin node in document", this, this.address);
			}
			
			startingNode = new hs.model.Node(domNode, this);
			includeCtxt = true;
		}else if(jumpType == hs.commands.JumpConstants.NEXT){
			startingNode = this.nodeCtxt;
			includeCtxt = false;
		}else{
			throw new hs.exception.Jump("Unknown jump type: "
											+ jumpType, this, this.address);
		}
		
		// get a node walker, starting from the correct context
		var walker = new hs.util.NodeWalker(startingNode, includeCtxt);
		
		// walk our nodes, testing each one with our content
		var matchingNode = null;
		while(walker.hasNext()){
			var node = walker.next();
			// does this node have our content?
			if(node.test(tester)){
				matchingNode = node;
				// we're done
				break;
			}
		}
		
		if(matchingNode == null){
			throw new hs.exception.InvalidAddress("? " + content,
													this, this.address);
		}
		
		// TODO: Update our node cursor to actually point using character
		// relative addressing and a NodeCursor to the actual matching
		// content inside of this matching node
		
		this.nodeCtxt = matchingNode;
		
		return this.nodeCtxt;
	},
	
	_alertRenderResults: function(){
		var renderedHtml = dojo.dom.innerXML(this.renderedHtmlDom);
		
		// Mozilla's XSLT processor doesn't support 'disable-output-escaping'
		// so we have to manually turn XML entities into their actual values
		renderedHtml = renderedHtml.replace(/&lt;/g, "<");
		renderedHtml = renderedHtml.replace(/&gt;/g, ">");
		renderedHtml = renderedHtml.replace(/&amp;/g, "&");
		renderedHtml = renderedHtml.replace(/&quot;/g, "\"");
		
		// put the results into a form field that can be copied
		var resultsDiv = document.createElement("div");
		resultsDiv.style.position = "absolute";
		resultsDiv.style.top = "10px";
		resultsDiv.style.left = "10px";
		resultsDiv.style.zIndex = "9000";
		resultsDiv.style.width = "1000px";
		resultsDiv.style.height = "600px";
		
		var resultsArea = document.createElement("textarea");
		resultsArea.style.width = "100%";
		resultsArea.style.height = "100%";
		resultsArea.value = renderedHtml;
		resultsDiv.appendChild(resultsArea);
		
		var closeButton = document.createElement("button");
		closeButton.appendChild(document.createTextNode("Close"));
		closeButton.style.display = "block";
		closeButton.style.topMargin = "2em";
		resultsDiv.appendChild(closeButton);
		closeButton.onclick = function(){
			resultsDiv.parentNode.removeChild(resultsDiv);
			resultsDiv = null;
		}
		
		document.getElementsByTagName("body")[0].appendChild(resultsDiv);
	}
});



/**
	A 'cursor' in an hs.model.Node that can jump through the textual 
	contents of a node to perform string positioning by character, word, 
	link, etc.
*/

/**
	@param node : hs.model.Node - The node to apply the
	cursor to.
 */
hs.model.NodeCursor = function(node){
	this._node = node;
}

dojo.lang.extend(hs.model.NodeCursor, {
	/** 
		Our position in this node, indexed starting at 0. Starts at zero
		by default. 
	*/
	position: 0,

	_hsNode: null,

	/** Jumps to the end of this node's content. */
	toEnd: function(){
		dojo.raise("string positioning to end not implemented");
	},
	
	/** Jumps to the beginning of this node's content. */
	toBeginning: function(){
		dojo.raise("string positioning to beginning not implemented");
	},

	/** 
		Jumps the given number of words forward or backwards. 
		
		@param numWords The number of words to jump forward. Can be positive
		or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpWords: function(numWords){
		dojo.raise("string positioning to a word not implemented");
	},
	
	/** 
		Jumps the given number of characters forward or backwards. 
		
		@param numCharacters The number of characters to jump forward. Can be 
		positive or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpCharacters: function(numCharacters){
		dojo.raise("string positioning to a character not implemented");
	},
	
	/** 
		Jumps the given number of visibles forward or backwards.
		Visibles are a continuous stream of printing characters. The ends 
		of visibles are defined by invisibles, such as space or a line break.
		
		@param numVisible The number of visibles to jump forward. Can be positive
		or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpVisible: function(numVisible){
		dojo.raise("string positioning to a visible not implemented");
	},
	
	/** 
		Jumps the given number of invisibles forward or backwards.
		Invisibles are a continuous stream of non-printing characters, such
		as spaces, line feeds, HTML entities, etc.
		
		@param numInvisible The number of invisibles to jump forward. Can be positive
		or negative.
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpInvisible: function(numInvisible){
		dojo.raise("string positioning to an invisible not implemented");
	},

	/** 
		Jumps the given number of links forward or backwards.
		
		@param numLinks The number of links to jump forward. Can be positive
		or negative.
		@returns String The link URL as a string, such as
		"http://foobar.com".
		@throws hs.exception.Jump Thrown if the cursor goes off the edge of
		the node. 
	*/
	jumpLink: function(numLinks){
		dojo.raise("string positioning to a link not implemented");
	},
	
	/** 
		Gets the character this cursor is currently pointing at; this will 
		always be a character that would be on the screen, such as 
		letters, numbers, etc., and not HTML tags, non-printing whitespace, etc.
		
		Scans from position until it finds returnable character 
		(i.e. no HTML or XML tags); returns null if none found. 
		
		@returns String The character.
	*/	
	getCharacter: function(){
		dojo.raise("string positioning to a character not implemented");
	},

	/** 
		Returns everything forwards from the current position, including
		HTML tags.
		
		@returns String
	*/	
	getRest: function(){
		dojo.raise("string positioning not implemented");
	},

	/**
		Returns the word the cursor is currently pointing at.
		
		@returns String
	*/
	getWord: function(){
		dojo.raise("string positioning not implemented");
	},

	/**
		Returns the link the cursor is currently pointing at, without the A HREF
		HTML tags such as http://bootstrap.org/neuberg/hyarch.opml#:x
		
		@returns String
	*/
	getLink: function(numLinks){
		// TODO: When we have full node cursor going, remove the 'numLinks'
		// argument here and have jumpLink() to the jump while getLink()
		// gets the value.
		var linkFinder = /<\s*a\s*href\s*=\s*(?:\"|\')([^\'\"]*)(?:\"|\')\s*>/igm;
		
		// keep looping until we have moved our offset
		var match = null;
		// we are using a regular expression trick below;
		// each call to exec() will return a single match
		// from our linkFinder; as we call exec() the
		// next match will be returned. we must clear out
		// the lastIndex variables though to ensure that
		// the state resets (lastIndex is held globally
		// by the regular expression object)
		RegExp.lastIndex = 0;
		linkFinder.lastIndex = 0;
		for(var i = 0; i < numLinks; i++){
			match = linkFinder.exec(this._node.data);
		}
		
		if(match == null || match.length != 2){
			throw new hs.exception.InvalidAddress("Can not jump to link: "
													+ numLinks);
		}
		
		var link = match[1];
		
		return link;
	},

	/**
		Returns the link the cursor is currently pointing at, including the
		full A HREF anchor and it's link text.
	*/
	getAnchor: function(){
		dojo.raise("string positioning to an anchor not implemented");
	}
});
