/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.LayoutPane");
dojo.provide("dojo.widget.HtmlLayoutPane");

//
// this widget provides Delphi-style panel layout semantics
// this is a good place to stash layout logic, then derive components from it
//
// TODO: allow more edge priority orders (e.g. t,r,l,b)
// TODO: allow percentage sizing stuff
//

dojo.require("dojo.widget.*");
dojo.require("dojo.event.*");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.HtmlContainer");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.string");


dojo.widget.HtmlLayoutPane = function(){
	dojo.widget.HtmlContainer.call(this);
}

dojo.inherits(dojo.widget.HtmlLayoutPane, dojo.widget.HtmlContainer);

dojo.lang.extend(dojo.widget.HtmlLayoutPane, {
	widgetType: "LayoutPane",

	isChild: false,

	clientLeft: 0,
	clientTop: 0,
	clientRect: {'left':0, 'right':0, 'top':0, 'bottom':0},
	clientWidth: 0,
	clientHeight: 0,

	layoutAlign: 'none',
	layoutChildPriority: 'top-bottom',

	cssPath: dojo.uri.dojoUri("src/widget/templates/HtmlLayoutPane.css"),

	// If this pane's content is external then set the url here	
	url: "inline",
	extractContent: true,
	parseContent: true,
	
	// To generate pane content from a java function
	handler: "none",

	minWidth: 0,
	minHeight: 0,

	fillInTemplate: function(){
		this.filterAllowed('layoutAlign',         ['none', 'left', 'top', 'right', 'bottom', 'client']);
		this.filterAllowed('layoutChildPriority', ['left-right', 'top-bottom']);

		// Need to include CSS manually because there is no template file/string
		dojo.style.insertCssFile(this.cssPath, null, true);

		this.domNode.style.position = 'relative';
		dojo.html.addClass(this.domNode, "dojoLayoutPane");
		dojo.html.addClass(this.domNode, "dojoAlign" + dojo.string.capitalize(this.layoutAlign));		
	},

	postCreate: function(args, fragment, parentComp){

		for(var i=0; i<this.children.length; i++){
			if (this.hasLayoutAlign(this.children[i])){
				this.children[i].domNode.style.position = 'absolute';
				this.children[i].isChild = true;	
			}
		}

		if ( this.handler != "none" ){
			this.setHandler(this.handler);
		}
		if ( this.domNode.style.display != "none" ){
			this.loadContents();
		}
	},

	// If the pane contents are external then load them
	loadContents: function() {
		if ( this.isLoaded ){
			return;
		}
		if ( dojo.lang.isFunction(this.handler)) {
			this._runHandler();
		} else if ( this.url != "inline" ) {
			this._downloadExternalContent(this.url, true);
		}
		this.isLoaded=true;
	},

	// Reset the (external defined) content of this pane
	setUrl: function(url) {
		this.url = url;
		this.isLoaded = false;
		if ( this.domNode.style.display != "none" ){
			this.loadContents();
		}
	},

	_downloadExternalContent: function(url, useCache) {
		//dojo.debug(this.widgetId + " downloading " + url);
		var node = this.domNode;
		node.innerHTML = "Loading...";

		var extract = this.extractContent;
		var parse = this.parseContent;
		var self = this;

		dojo.io.bind({
			url: url,
			useCache: useCache,
			mimetype: "text/html",
			handler: function(type, data, e) {
				if(type == "load") {
					if(extract) {
						var matches = data.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
						if(matches) { data = matches[1]; }
					}
					node.innerHTML = data;
					if(parse) {
						var parser = new dojo.xml.Parse();
						var frag = parser.parseElement(node, null, true);
						dojo.widget.getParser().createComponents(frag);
					}
					self.onResized();
				} else {
					node.innerHTML = "Error loading '" + url + "' (" + e.status + " " + e.statusText + ")";
				}
			}
		});
	},

	// Generate pane content from given java function
	setHandler: function(handler) {
		var fcn = dojo.lang.isFunction(handler) ? handler : window[handler];
		if(!dojo.lang.isFunction(fcn)) {
			throw new Error("Unable to set handler, '" + handler + "' not a function.");
			return;
		}
		this.handler = function() {
			return fcn.apply(this, arguments);
		}
	},

	_runHandler: function() {
		if(dojo.lang.isFunction(this.handler)) {
			this.handler(this, this.domNode);
			return false;
		}
		return true;
		/*
		// in case we want to honor the return value?
		var ret = true;
		if(dojo.lang.isFunction(this.handler) {
			var val = this.handler(this, panel);
			if(!dojo.lang.isUndefined(val)) {
				ret = val;
			}
		}
		return ret;
		*/
	},

	filterAllowed: function(param, values){
		if ( !dojo.lang.inArray(values, this[param]) ) {
			this[param] = values[0];
		}
	},

	layoutChildren: function(){
		// find the children to arrange

		var kids = {'left':[], 'right':[], 'top':[], 'bottom':[], 'client':[]};
		var hits = 0;

		for(var i=0; i<this.children.length; i++){
			if (this.hasLayoutAlign(this.children[i])){
				kids[this.children[i].layoutAlign].push(this.children[i]);
				hits++;
			}
		}

		if (!hits){
			return;
		}


		// calc layout space

		this.clientWidth  = dojo.style.getContentWidth(this.domNode);
		this.clientHeight = dojo.style.getContentHeight(this.domNode);

		this.clientRect['left']   = dojo.style.getPixelValue(this.domNode, "padding-left", true);
		this.clientRect['right']  = dojo.style.getPixelValue(this.domNode, "padding-right", true);
		this.clientRect['top']    = dojo.style.getPixelValue(this.domNode, "padding-top", true);
		this.clientRect['bottom'] = dojo.style.getPixelValue(this.domNode, "padding-bottom", true);

		// arrange them in order

		if (this.layoutChildPriority == 'top-bottom'){

			this.layoutFloat(kids, "top");
			this.layoutFloat(kids, "bottom");
			this.layoutFloat(kids, "left");
			this.layoutFloat(kids, "right");
		}else{
			this.layoutFloat(kids, "left");
			this.layoutFloat(kids, "right");
			this.layoutFloat(kids, "top");
			this.layoutFloat(kids, "bottom");
		}
		this.layoutClient(kids);
	},

	// Position the left/right/top/bottom aligned elements
	layoutFloat: function(kids, position){
		var ary = kids[position];
		
		// figure out which two of the left/right/top/bottom properties to set
		var lr = (position=="right")?"right":"left";
		var tb = (position=="bottom")?"bottom":"top";

		for(var i=0; i<ary.length; i++){
			var elm=ary[i];
			
			// set two of left/right/top/bottom properties
			elm.domNode.style[lr]=this.clientRect[lr] + "px";
			elm.domNode.style[tb]=this.clientRect[tb] + "px";
			
			// adjust record of remaining space
			if ( (position=="top")||(position=="bottom") ) {
				dojo.style.setOuterWidth(elm.domNode, this.clientWidth);
				var height = dojo.style.getOuterHeight(elm.domNode);
				this.clientHeight -= height;
				this.clientRect[position] += height;
			} else {
				dojo.style.setOuterHeight(elm.domNode, this.clientHeight);
				var width = dojo.style.getOuterWidth(elm.domNode);
				this.clientWidth -= width;
				this.clientRect[position] += width;
			}
		}
	},

	// Position the center elements
	layoutClient: function(kids){
		// Put every child in the same position.  (If there is more than one
		// child; caller should set all but one to "display: none")
		// This is used for Tabs
		// TODO: this seems to be broken on Safari
		for(var i=0; i<kids.client.length; i++){
			var elm=kids.client[i];

			elm.domNode.style.left=this.clientRect.left + "px";
			elm.domNode.style.top=this.clientRect.top + "px";
			dojo.style.setOuterWidth(elm.domNode, this.clientWidth);		
			dojo.style.setOuterHeight(elm.domNode, this.clientHeight);
		}

	},

	hasLayoutAlign: function(child){
		return dojo.lang.inArray(['left','right','top','bottom','client'], child.layoutAlign);
	},

	addPane: function(pane){

		this.children.push(pane);
		this.domNode.appendChild(pane.domNode);

		pane.domNode.style.position = 'absolute';
		pane.isChild = true;

		this.resizeSoon();
	},

	removePane: function(pane){

		var idx = dojo.lang.find(this.children, pane);
		if ( idx != -1 ) {
			this.children.splice(idx, 1);
		}
		
		dojo.dom.removeNode(pane.domNode);

		this.resizeSoon();
	},
	
	layoutSoon: function(){
		dojo.lang.setTimeout(this, this.layoutChildren, 0);
	},

	resizeSoon: function(){
		if ( this.domNode.style.display != "none" ) {
			dojo.lang.setTimeout(this, this.onResized, 0);
		}
	},

	onResized: function(){
		if ( this.domNode.style.display == "none" ) {
			return;
		}

		//dojo.debug(this.widgetId + ": resized");

		// set position/size for my children
		this.layoutChildren();

		// notify children that they have been moved/resized
		this.notifyChildrenOfResize();
	},

	resizeTo: function(w, h){

		w = Math.max(w, this.getMinWidth());
		h = Math.max(h, this.getMinHeight());

		dojo.style.setOuterWidth(this.domNode, w);
		dojo.style.setOuterHeight(this.domNode, h);
		this.onResized();
	},
	
	show: function(){
		// If this is the first time we are displaying this object,
		// and the contents are external, then download them.
		this.loadContents();

		// If this node was created while display=="none" then it
		// hasn't been laid out yet
		if ( this.domNode.style.display=="none" ) {
			this.domNode.style.display="";
			this.onResized();
			this.domNode.style.display="none";
		}
		dojo.widget.HtmlLayoutPane.superclass.show.call(this);
	},

	getMinWidth: function(){

		//
		// we need to first get the cumulative width
		//

		var w = this.minWidth;

		if ((this.layoutAlign == 'left') || (this.layoutAlign == 'right')){

			w = dojo.style.getOuterWidth(this.domNode);
		}

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'left') || (a == 'right') || (a == 'client')){

				if (dojo.lang.isFunction(ch.getMinWidth)){
					w += ch.getMinWidth();
				}
			}
		}

		//
		// but then we need to check to see if the top/bottom kids are larger
		//

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'top') || (a == 'bottom')){

				if (dojo.lang.isFunction(ch.getMinWidth)){
					w = Math.max(w, ch.getMinWidth());
				}
			}
		}

		return w;
	},

	getMinHeight: function(){

		//
		// we need to first get the cumulative height
		//

		var h = this.minHeight;

		if ((this.layoutAlign == 'top') || (this.layoutAlign == 'bottom')){

			h = dojo.style.getOuterHeight(this.domNode);
		}

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'top') || (a == 'bottom') || (a == 'client')){

				if (dojo.lang.isFunction(ch.getMinHeight)){
					h += ch.getMinHeight();
				}
			}
		}

		//
		// but then we need to check to see if the left/right kids are larger
		//

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'left') || (a == 'right')){

				if (dojo.lang.isFunction(ch.getMinHeight)){
					h = Math.max(h, ch.getMinHeight());
				}
			}
		}

		return h;
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:LayoutPane");
