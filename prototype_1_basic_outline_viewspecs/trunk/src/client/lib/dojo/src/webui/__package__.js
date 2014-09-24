/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.hostenv.conditionalLoadModule({
	common: ["dojo.xml.Parse", 
			 "dojo.webui.Widget", 
			 "dojo.webui.widgets.Parse", 
			 // "dojo.webui.DragAndDrop", 
			 "dojo.webui.WidgetManager"],
	browser: ["dojo.webui.DomWidget",
			  "dojo.webui.HtmlWidget"],
	svg: 	 ["dojo.webui.SvgWidget"]
});
dojo.hostenv.moduleLoaded("dojo.webui.*");
