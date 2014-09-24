/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.html.Tooltip");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.Tooltip");
dojo.require("dojo.uri");
dojo.require("dojo.widget.*");
dojo.require("dojo.event");
dojo.require("dojo.style");
dojo.require("dojo.html");

dojo.widget.html.Tooltip = function(){
	// mix in the tooltip properties
	dojo.widget.Tooltip.call(this);
	dojo.widget.HtmlWidget.call(this);
}
dojo.inherits(dojo.widget.html.Tooltip, dojo.widget.HtmlWidget);
dojo.lang.extend(dojo.widget.html.Tooltip, {

	// Constructor arguments (should these be in tooltip.js rather than html/tooltip.js???)
	caption: "undefined",
	delay: 500,
	connectId: "",

	templatePath: dojo.uri.dojoUri("src/widget/templates/HtmlTooltipTemplate.html"),
	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlTooltipTemplate.css"),

	containerNode: null,
	connectNode: null,

	hovering: false,
	displayed: false,

	fillInTemplate: function(args, frag){
		if(this.caption != "undefined"){
			this.domNode.appendChild(document.createTextNode(this.caption));
		}
		dojo.html.body().appendChild(this.domNode);
		this.connectNode = dojo.byId(this.connectId);
		if(dojo.render.html.ie){
			this.bgIframe = document.createElement("<iframe frameborder='0' src='about:blank'>");
			with(this.bgIframe.style){
				position = "absolute";
				left = top = "0px";
				display = "none";
			}
			dojo.html.body().appendChild(this.bgIframe);
			dojo.style.setOpacity(this.bgIframe, 0);
		}
	},
	
	postCreate: function(args, frag){
		var self = this;
		this.timerEvent = function () { self.display.apply(self); };
		dojo.event.connect(this.connectNode, "onmouseover", this, "onMouseOver");
		dojo.event.connect(this.connectNode, "onmousemove", this, "recordMousePosition");
		dojo.event.connect(this.connectNode, "onmouseout", this, "onMouseOut");
	},
	
	onMouseOver: function(e) {
		this.timerEventId = setTimeout(this.timerEvent, this.delay);
		this.recordMousePosition(e);
	},
	
	recordMousePosition: function(e) {
		this.mouseX = e.pageX || e.clientX + dojo.html.body().scrollLeft;
		this.mouseY = e.pageY || e.clientY + dojo.html.body().scrollTop;
	},

	display: function() {
		this.domNode.style.top = this.mouseY + 15 + "px";
		this.domNode.style.left = this.mouseX + 10 + "px";

		// if rendering using explosion effect, need to set explosion source
		this.explodeSrc = [this.mouseX, this.mouseY];
			
		this.show();
		if(this.bgIframe){
			with(this.bgIframe.style){
				display = "block";
				top = this.domNode.style.top;
				left = this.domNode.style.left;
				zIndex = 998;
				width = dojo.html.getOuterWidth(this.domNode) + "px";
				height = dojo.html.getOuterHeight(this.domNode) + "px";
			}

		}
		this.displayed=true;
	},

	onMouseOut: function() {
		if ( this.timerEventId ) {
			clearTimeout(this.timerEventId);
			delete this.timerEventId;
		}
		if ( this.displayed ) {
			this.hide();
			this.displayed=false;
		}
	},
	
	hide: function() {
		if(this.bgIframe){
			this.bgIframe.style.display = "none";
		}
		dojo.widget.html.Tooltip.superclass.hide.call(this);
	}
});
