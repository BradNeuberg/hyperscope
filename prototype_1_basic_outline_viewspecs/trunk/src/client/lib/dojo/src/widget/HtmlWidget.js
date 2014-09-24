/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.html");

dojo.widget.HtmlWidget = function(args){
	// mixin inheritance
	dojo.widget.DomWidget.call(this);
}

dojo.inherits(dojo.widget.HtmlWidget, dojo.widget.DomWidget);

dojo.lang.extend(dojo.widget.HtmlWidget, {
	templateCssPath: null,
	templatePath: null,
	allowResizeX: true,
	allowResizeY: true,

	resizeGhost: null,
	initialResizeCoords: null,
	// this.templateString = null;

	// for displaying/hiding widget
	toggle: "default",
	toggleDuration: 150,

	initialize: function(args, frag){
	},

	getContainerHeight: function(){
		// NOTE: container height must be returned as the INNER height
		dj_unimplemented("dojo.widget.HtmlWidget.getContainerHeight");
	},

	getContainerWidth: function(){
		return this.parent.domNode.offsetWidth;
	},

	setNativeHeight: function(height){
		var ch = this.getContainerHeight();
	},

	startResize: function(coords){
		// get the left and top offset of our dom node
		coords.offsetLeft = dojo.html.totalOffsetLeft(this.domNode);
		coords.offsetTop = dojo.html.totalOffsetTop(this.domNode);
		coords.innerWidth = dojo.html.getInnerWidth(this.domNode);
		coords.innerHeight = dojo.html.getInnerHeight(this.domNode);
		if(!this.resizeGhost){
			this.resizeGhost = document.createElement("div");
			var rg = this.resizeGhost;
			rg.style.position = "absolute";
			rg.style.backgroundColor = "white";
			rg.style.border = "1px solid black";
			dojo.html.setOpacity(rg, 0.3);
			dojo.html.body().appendChild(rg);
		}
		with(this.resizeGhost.style){
			left = coords.offsetLeft + "px";
			top = coords.offsetTop + "px";
		}
		this.initialResizeCoords = coords;
		this.resizeGhost.style.display = "";
		this.updateResize(coords, true);
	},

	updateResize: function(coords, override){
		var dx = coords.x-this.initialResizeCoords.x;
		var dy = coords.y-this.initialResizeCoords.y;
		with(this.resizeGhost.style){
			if((this.allowResizeX)||(override)){
				width = this.initialResizeCoords.innerWidth + dx + "px";
			}
			if((this.allowResizeY)||(override)){
				height = this.initialResizeCoords.innerHeight + dy + "px";
			}
		}
	},

	endResize: function(coords){
		// FIXME: need to actually change the size of the widget!
		var dx = coords.x-this.initialResizeCoords.x;
		var dy = coords.y-this.initialResizeCoords.y;
		with(this.domNode.style){
			if(this.allowResizeX){
				width = this.initialResizeCoords.innerWidth + dx + "px";
			}
			if(this.allowResizeY){
				height = this.initialResizeCoords.innerHeight + dy + "px";
			}
		}
		this.resizeGhost.style.display = "none";
	},


	createNodesFromText: function(txt, wrap){
		return dojo.html.createNodesFromText(txt, wrap);
	},

	_old_buildFromTemplate: dojo.widget.DomWidget.prototype.buildFromTemplate,

	buildFromTemplate: function(args, frag){
		dojo.widget.buildFromTemplate(this);
		this._old_buildFromTemplate(args, frag);
	},

	destroyRendering: function(finalize){
		try{
			var tempNode = this.domNode.parentNode.removeChild(this.domNode);
			if(!finalize){
				dojo.event.browser.clean(tempNode);
			}
			delete tempNode;
		}catch(e){ /* squelch! */ }
	},

	// Functions for showing/hiding widget
	getToggle: function () {
		// lazy instantiation of the toggle object
		if ( !this.toggleHandler ) {
			switch (this.toggle) {
				case "wipe"    : this.toggleHandler = new dojo.widget.HtmlWidget.WipeToggle(this.toggleDuration);
								break;
				case "fade"    : this.toggleHandler = new dojo.widget.HtmlWidget.FadeToggle(this.toggleDuration);
								break;
				case "explode" : this.toggleHandler = new dojo.widget.HtmlWidget.ExplodeToggle(this, this.toggleDuration);
								break;
				default        : this.toggleHandler = new dojo.widget.HtmlWidget.DefaultToggle();
			}
		}
		return this.toggleHandler;
	},
	isVisible: function(){
		return ! ( this.domNode.style.display=="none" ||
			this.domNode.style.visibility=="hidden" );
	},

	doToggle: function(){
		this.isVisible() ? this.hide() : this.show();
	},
	show: function() {
		this.getToggle().show(this.domNode);
	},
	hide: function() {
		this.getToggle().hide(this.domNode);
	}
});



/**** Strategies for displaying/hiding widget *****/
dojo.widget.HtmlWidget.DefaultToggle = function() { }
dojo.lang.extend(dojo.widget.HtmlWidget.DefaultToggle, {
	show: function(node) {
		if (node.style) {
			node.style.display = "block";
		}
	},

	hide: function(node) {
		if (node.style) {
			node.style.display = "none";
		}
	}
});

dojo.widget.HtmlWidget.FadeToggle = function(duration) {
	this.toggleDuration = duration ? duration : 150;
}
dojo.lang.extend(dojo.widget.HtmlWidget.FadeToggle, {
	show: function(node) {
		dojo.fx.html.fadeShow(node, this.toggleDuration);
	},

	hide: function(node) {
		dojo.fx.html.fadeHide(node, this.toggleDuration);
	}
});

dojo.widget.HtmlWidget.WipeToggle = function(duration) {
	this.toggleDuration = duration ? duration : 150;
}
dojo.lang.extend(dojo.widget.HtmlWidget.WipeToggle, {
	show: function(node) {
		dojo.fx.html.wipeIn(node, this.toggleDuration);
	},

	hide: function(node) {
		dojo.fx.html.wipeOut(node, this.toggleDuration);
	}
});

dojo.widget.HtmlWidget.ExplodeToggle = function(parent, duration) {
	this.toggleDuration = duration ? duration : 150;
	this.parent = parent;
}
dojo.lang.extend(dojo.widget.HtmlWidget.ExplodeToggle, {
	show: function(node) {
		dojo.fx.html.explode(this.parent.explodeSrc, node, this.toggleDuration);
	},

	hide: function(node) {
		dojo.fx.html.implode(node, this.parent.explodeSrc, this.toggleDuration);
	}
});
