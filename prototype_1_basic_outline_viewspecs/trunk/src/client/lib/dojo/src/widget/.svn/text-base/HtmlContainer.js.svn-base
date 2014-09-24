/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.Container");
dojo.provide("dojo.widget.HtmlContainer");

dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");

dojo.widget.HtmlContainer = function(){
	dojo.widget.HtmlWidget.call(this);
}

dojo.inherits(dojo.widget.HtmlContainer, dojo.widget.HtmlWidget);

dojo.lang.extend(dojo.widget.HtmlContainer, {
	widgetType: "Container",

	isContainer: true,
	containerNode: null,
	domNode: null,

	onResized: function() {
		// Clients should override this function to do special processing,
		// then call this.notifyChildrenOfResize() to notify children of resize
		this.notifyChildrenOfResize();
	},
	
	notifyChildrenOfResize: function() {
		for(var i=0; i<this.children.length; i++) {
			var child = this.children[i];
			//dojo.debug(this.widgetId + " resizing child " + child.widgetId);
			if ( child.onResized ) {
				child.onResized();
			}
		}
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:Container");
