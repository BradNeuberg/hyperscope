/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.hostenv.conditionalLoadModule({
	common: ["dojo.xml.Parse", 
			 "dojo.widget.Widget", 
			 "dojo.widget.Parse", 
			 "dojo.widget.Manager"],
	browser: ["dojo.widget.DomWidget",
			  "dojo.widget.HtmlWidget"],
	svg: 	 ["dojo.widget.SvgWidget"]
});
dojo.hostenv.moduleLoaded("dojo.widget.*");
