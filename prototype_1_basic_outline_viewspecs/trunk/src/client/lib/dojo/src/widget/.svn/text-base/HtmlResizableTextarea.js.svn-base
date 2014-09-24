/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.HtmlResizableTextarea");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.html");

dojo.widget.tags.addParseTreeHandler("dojo:resizabletextarea");

dojo.widget.HtmlResizableTextarea = function(){
	dojo.widget.HtmlWidget.call(this);

	this.templatePath = dojo.uri.dojoUri("src/widget/templates/HtmlResizableTextarea.html");
	this.widgetType = "ResizableTextarea";
	this.tagName = "dojo:resizabletextarea";
	this.isContainer = false;
	this.textAreaNode = null;
	this.textAreaContainer = null;

	this.fillInTemplate = function(args, frag){
		this.textAreaNode = frag[this.tagName].nodeRef.cloneNode(true);
		this.textAreaContainer.appendChild(this.textAreaNode);
	}

	this.fitToParent = function(){
		with(this.textAreaNode.style){
			width = "100%";
			height = "100%";
		}
		var pn = this.textAreaNode.parentNode;

		if(this.allowResizeX){
			var iw = parseInt(this.textAreaNode.offsetWidth);
			var cols = parseInt(dojo.html.getAttribute(this.textAreaNode, "cols"));
			var pxpercol = (iw/cols);
			var pnw = parseInt(dojo.html.getInnerWidth(pn));
			this.textAreaNode.style.width = pnw+"px";
		}

		if(this.allowResizeY){
			var ih = parseInt(dojo.html.getInnerHeight(this.textAreaNode));
			var rows = parseInt(dojo.html.getAttribute(this.textAreaNode, "rows"));
			var pxperrow = (ih/rows);
			var pnh = parseInt(dojo.html.getInnerHeight(pn));
			this.textAreaNode.rows = parseInt(pnh/pxperrow);
		}
	}

	this.postDrag = function(){
		this.textAreaNode.parentNode.style.overflow = "hidden";
		this.textAreaNode.style.display = "";
		this.fitToParent();
	}

	dojo.event.connect(this, "endResize", this, "fitToParent");
}

dojo.inherits(dojo.widget.HtmlResizableTextarea, dojo.widget.HtmlWidget);
