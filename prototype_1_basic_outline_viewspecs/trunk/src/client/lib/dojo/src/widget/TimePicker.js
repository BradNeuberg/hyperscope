/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.TimePicker");
dojo.require("dojo.widget.DomWidget");

dojo.requireIf("html", "dojo.widget.html.TimePicker");

dojo.widget.TimePicker = function(){
	dojo.widget.Widget.call(this);
	this.widgetType = "TimePicker";
	this.isContainer = false;

}

dojo.inherits(dojo.widget.TimePicker, dojo.widget.Widget);
dojo.widget.tags.addParseTreeHandler("dojo:timepicker");
