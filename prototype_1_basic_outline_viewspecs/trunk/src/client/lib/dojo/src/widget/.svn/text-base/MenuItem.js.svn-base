/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.MenuItem");
dojo.provide("dojo.widget.DomMenuItem");
dojo.provide("dojo.widget.HtmlMenuItem");

dojo.require("dojo.string");
dojo.require("dojo.widget.Widget");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.widget.HtmlWidget");

dojo.require("dojo.html");

dojo.widget.tags.addParseTreeHandler("dojo:MenuItem");

/* MenuItem
 ***********/
 
dojo.widget.MenuItem = function(){
	dojo.widget.MenuItem.superclass.constructor.call(this);
}
dojo.inherits(dojo.widget.MenuItem, dojo.widget.Widget);

dojo.lang.extend(dojo.widget.MenuItem, {
	widgetType: "MenuItem",
	isContainer: true
});


/* DomMenuItem
 **************/
dojo.widget.DomMenuItem = function(){
	dojo.widget.DomMenuItem.superclass.constructor.call(this);
}
dojo.inherits(dojo.widget.DomMenuItem, dojo.widget.DomWidget);

dojo.lang.extend(dojo.widget.DomMenuItem, {
	widgetType: "MenuItem"
});

/* HtmlMenuItem
 ***************/

dojo.widget.HtmlMenuItem = function(){
	dojo.widget.HtmlWidget.call(this);
}
dojo.inherits(dojo.widget.HtmlMenuItem, dojo.widget.HtmlWidget);

dojo.lang.extend(dojo.widget.HtmlMenuItem, {
	widgetType: "MenuItem",
	templateString: '<li class="dojoMenuItem" dojoAttachEvent="onMouseOver; onMouseOut; onMouseDown; onMouseUp; onClick;"></li>',
	title: "",

	fillInTemplate: function(args, frag){
		dojo.html.disableSelection(this.domNode);

		if(!dojo.string.isBlank(this.title)){
			this.domNode.appendChild(document.createTextNode(this.title));
		}else{
			this.domNode.appendChild(frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"]);
		}
	},
	
	onMouseOver: function(e){
		dojo.html.addClass(this.domNode, "dojoMenuItemHover");
	},
	
	onMouseOut: function(e){
		dojo.html.removeClass(this.domNode, "dojoMenuItemHover");
	},
	
	onClick: function(e){ this.onSelect(this, e); },
	onMouseDown: function(e){},
	onMouseUp: function(e){},
	
	// By default, when I am clicked, click the item inside of me
	onSelect: function (item, e) {
		var child = dojo.dom.getFirstChildElement(this.domNode);
		if(child){
			if(child.click){
				child.click();
			}else if(child.href){
				location.href = child.href;
			}
		}
	}
});
