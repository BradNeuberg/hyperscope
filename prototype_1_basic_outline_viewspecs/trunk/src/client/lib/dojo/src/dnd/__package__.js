/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.hostenv.conditionalLoadModule({
	common: ["dojo.dnd.DragAndDrop"],
	browser: ["dojo.dnd.HtmlDragAndDrop"]
});
dojo.hostenv.moduleLoaded("dojo.dnd.*");
