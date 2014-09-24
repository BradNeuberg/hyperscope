/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.FloatingPane");
dojo.provide("dojo.widget.HtmlFloatingPane");

//
// this widget provides a window-like floating pane
//
// TODO: instead of custom drag code, use HtmlDragMove.js in
// conjuction with DragHandle).  The only tricky part is the constraint 
// stuff (to keep the box within the container's boundaries)
//

dojo.require("dojo.widget.*");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.widget.HtmlLayoutPane");

dojo.widget.HtmlFloatingPane = function(){
	dojo.widget.HtmlLayoutPane.call(this);
}

dojo.inherits(dojo.widget.HtmlFloatingPane, dojo.widget.HtmlLayoutPane);

dojo.lang.extend(dojo.widget.HtmlFloatingPane, {
	widgetType: "FloatingPane",

	// Constructor arguments
	hasShadow: false,
	title: 'Untitled',
	constrainToContainer: false,

	// If this pane's content is external then set the url here	
	url: "inline",
	extractContent: true,
	parseContent: true,
	
	isContainer: true,
	containerNode: null,
	domNode: null,
	clientPane: null,
	dragBar: null,
	dragOrigin: null,
	posOrigin: null,
	maxPosition: null,

	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlFloatingPane.css"),
	isDragging: false,

	fillInTemplate: function(){

		if (this.templateCssPath) {
			dojo.style.insertCssFile(this.templateCssPath, null, true);
		}

		dojo.html.addClass(this.domNode, 'dojoFloatingPane');

		var elm = document.createElement('div');
		dojo.dom.moveChildren(this.domNode, elm, 0);
		dojo.html.addClass(elm, 'dojoFloatingPaneClient');

		// add a drop shadow
		if ( this.hasShadow ) {
			this.shadow = document.createElement('div');
			dojo.html.addClass(this.shadow, "dojoDropShadow");
			dojo.style.setOpacity(this.shadow, 0.5);
			this.domNode.appendChild(this.shadow);
			dojo.html.disableSelection(this.shadow);
		}

		// this is our client area
		this.clientPane = this.createPane(elm, {layoutAlign: "client", url: this.url});
		this.clientPane.ownerPane = this;

		// this is our chrome
		var elm = document.createElement('div');
		elm.appendChild(document.createTextNode(this.title));
		dojo.html.addClass(elm, 'dojoFloatingPaneDragbar');
		this.dragBar = this.createPane(elm, {layoutAlign: 'top'});
		this.dragBar.ownerPane = this;

		dojo.html.disableSelection(this.dragBar.domNode);
		dojo.event.connect(this.dragBar.domNode, 'onmousedown', this, 'onMyDragStart');

		this.layoutSoon();
	},

	postCreate: function(args, fragment, parentComp){

		// move our 'children' into the client pane
		// we already moved the domnodes, but now we need to move the 'children'

		var kids = this.children.concat();
		this.children = [];

		for(var i=0; i<kids.length; i++){
			if (kids[i].ownerPane == this){
				this.children.push(kids[i]);
			}else{
				this.clientPane.children.push(kids[i]);

				if (kids[i].widgetType == 'LayoutPane'){
					kids[i].domNode.style.position = 'absolute';
				}
			}
		}

		this.resizeSoon();
	},

	onResized: function(){
		if ( this.hasShadow ) {
			var width = dojo.style.getOuterWidth(this.domNode);
			var height = dojo.style.getOuterHeight(this.domNode);
			dojo.style.setOuterWidth(this.shadow, width);
			dojo.style.setOuterHeight(this.shadow, height);
		}
		dojo.widget.HtmlFloatingPane.superclass.onResized.call(this);
	},

	createPane: function(node, args){
		var pane = dojo.widget.fromScript("LayoutPane", args, node);
		this.addPane(pane);
		return pane;
	},

	onMyDragStart: function(e){
		if (this.isDragging){ return; }

		this.dragOrigin = {'x': e.clientX, 'y': e.clientY};
		
		// this doesn't work if (as in the test file) the user hasn't set top
		// 	this.posOrigin = {'x': dojo.style.getNumericStyle(this.domNode, 'left'), 'y': dojo.style.getNumericStyle(this.domNode, 'top')};
		this.posOrigin = {'x': this.domNode.offsetLeft, 'y': this.domNode.offsetTop};

		if (this.constrainToContainer){
			// TODO: this doesn't work with scrolled pages

			// get parent client size...

			if (this.domNode.parentNode.nodeName.toLowerCase() == 'body'){
				var parentClient = {
					'w': dojo.html.getViewportWidth(),
					'h': dojo.html.getViewportHeight()
				};
			}else{
				var parentClient = {
					'w': dojo.style.getInnerWidth(this.domNode.parentNode),
					'h': dojo.style.getInnerHeight(this.domNode.parentNode)
				};
			}

			this.maxPosition = {
				'x': parentClient.w - dojo.style.getOuterWidth(this.domNode),
				'y': parentClient.h - dojo.style.getOuterHeight(this.domNode)
			};
		}

		dojo.event.connect(document, 'onmousemove', this, 'onMyDragMove');
		dojo.event.connect(document, 'onmouseup', this, 'onMyDragEnd');

		this.isDragging = true;
	},

	onMyDragMove: function(e){
		var x = this.posOrigin.x + (e.clientX - this.dragOrigin.x);
		var y = this.posOrigin.y + (e.clientY - this.dragOrigin.y);

		if (this.constrainToContainer){
			if (x < 0){ x = 0; }
			if (y < 0){ y = 0; }
			if (x > this.maxPosition.x){ x = this.maxPosition.x; }
			if (y > this.maxPosition.y){ y = this.maxPosition.y; }
		}

		this.domNode.style.left = x + 'px';
		this.domNode.style.top  = y + 'px';
	},

	onMyDragEnd: function(e){
		dojo.event.disconnect(document, 'onmousemove', this, 'onMyDragMove');
		dojo.event.disconnect(document, 'onmouseup', this, 'onMyDragEnd');

		this.isDragging = false;
	}
	
});

dojo.widget.tags.addParseTreeHandler("dojo:FloatingPane");
