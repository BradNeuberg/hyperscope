/**
    HyperScope
    Copyright (C) 2006 Bootstrap Alliance

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

	This package defines our user-interface for HyperScope in web browsers. 
	It contains hs.ui, a singleton that has our UI code. 
	
	It also contains code for setting up our debugging environment near the
	bottom of the file, as well as our main entry point for execution, which
	is an event listener that waits for the HyperScope core to finish 
	loading before initializing and running the UI.
	
	It also contains the following classes:
	
	hs.ui.JumpOverlay
		A Dojo Widget that implements our jump overlay window that appears
		when the user presses the Jump button in the toolbar.
		
	hs.ui.HyperScopeToolbar
		A Dojo Widget that implements our toolbar.
		
	hs.ui.RenderedDocument
		A class that renders our result hs.model.Document
		
	hs.ui.ResultWriter
		Writes our HTML results after XSLT to display to the user in a fast way.
		
	hs.ui.Mark
		Dereferences a mouse mark click into an hs.address.Address that can
		be worked with.
		
	hs.ui.ViewspecOverlay
		A Dojo Widget that implements our viewspec overlay.
		
	hs.ui.LineClipper
		A class that performs line clipping on a 
		rendered document.
		
	hs.ui.CommandBar
		Implements our Augment-style command bar

	hs.ui.HelpOverlay
		Implements the help dialog displayed when the Help button is
		pressed on the main toolbar.
		
	REFACTOR: This file is getting too big; refactor into seperate files.
*/

dojo.provide("hs.ui");

 // make sure hs.profile and hs.model is loaded before us
dojo.require("hs.profile");
dojo.require("hs.model");

dojo.require("dojo.event.*");
dojo.require("dojo.uri");
dojo.require("dojo.html.*");
dojo.require("dojo.style");
dojo.require("dojo.lfx.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.FloatingPane");		
				
/**
  Our UI singleton.
 */

hs.ui = {
	markingMode: false,
	currentHyDoc: null,
	currentRenderedDoc: null,
	commandBar: null,
	
	_addr: null,
	_reportDocTime: true,
	_pageLoadRecoveryTimes: 0,
	
	initialize: function(){
		// toggle debugging on and off here to avoid
		// conflicts with Dojo Debugging + XSLT environment
		//djConfig.isDebug = true;
		hs.ui._initializeDebugging();
		
		// initialize profiling if it is on
		if(djConfig.profiling == true){
			hs.ui._initializeProfiling();
		}
		
		// create our Dojo Widgets
		hs.ui._initializeWidgets();
		
		// initialize the area where we display our
		// rendered document
		var container = dojo.byId("docWindow");
		hs.ui.currentRenderedDoc = new hs.ui.RenderedDocument(container);
		
		// initialize our Augment-style command bar
		hs.ui.commandBar = new hs.ui.CommandBar();

		// initialize our turbo mode settings
		var toolbar = dojo.widget.byId("hsToolbar");
		toolbar.initializeTurboModeSettings();
	
		// resolve the initial page on load
		hs.profile.start("resolve");
		hs.ui._currentLocation = window.location.toString();
		hs.ui.resolveLocation(hs.ui._currentLocation);
		
		// change the page's location if someone manually
		// changes the browser URL
		window.setInterval(hs.ui._checkBrowserURL, 200);
		
		// redisplay the document on a resize event so
		// that line clipping can be updated; don't do this
		// on Internet Explorer due to it firing the onresize 
		// event continously
		//hs.ui._handleResizing();
	},

	resolveLocation: function(url){
		//debug("resolveLocation="+url);
		try{
			if(typeof url == "string"){
				hs.ui._addr = new hs.address.Address(url);
			}else{
				hs.ui._addr = url;
			}
			
			hs.ui.printStatus("Resolving...");
			
			var readyHandler = hs.ui.addressResolved;
			var address = hs.ui._addr;
			var relativeTo = hs.ui.currentHyDoc;
			
			hs.commands.jumpItem(readyHandler, address, relativeTo);
		}catch(exp){
			hs.ui.reportError(exp);
		}
	},
	
	addressResolved: function(address, doc, error){
		//debug("hs.ui.addressResolved, address="+address+", doc="+doc+", error="+error);
		hs.profile.end("resolve");
		
		// clear the command bar if it is visible
		if(hs.ui.commandBar.visible == true){
			hs.ui.commandBar.reset();
		}
		
		if(error != null){
			// if this error happened due to bad addressing on page load,
			// then lets try to recover from it so the user isn't left with
			// just a blank page
			if(hs.ui.currentHyDoc == null
				&& hs.ui._pageLoadRecoveryTimes < 2){
				// we don't want to get into an infinite recovery
				// loop; record how many times we have tried
				// and stop after the first
				hs.ui._pageLoadRecoveryTimes++;
				
				// some IE error objects have extra properties we
				// want to print
				if(typeof error.name != "undefined" 
					&& typeof error.message != "undefined"){
					error = error.name + ": " + error.message;		
				}
				
				// just use the file portion
				var url = address.fileInfo.toString();
				var message = "Invalid HyperScope address given on URL: " + error
								+ "; press enter to load "
								+ "URL without address portion";
				alert(message);
				hs.ui.resolveLocation(url);
			}else{
				hs.ui.reportError(error);
			}
	
			return;
		}
		
		// save this as our current document
		hs.ui.currentHyDoc = doc;

		// get our new address so users can cut
		// and paste it
		var newUrl = doc.address.toString();
		dojo.byId("current-link").setAttribute("href", newUrl);
		
		// update the Viewspec Overlay with this new
		// information if it is open
		var viewspecOverlay = dojo.widget.byId("viewspecsOverlay");
		if(viewspecOverlay.isShowing() == true){
			viewspecOverlay.reset();
		}

		// update the displayed document
		hs.ui.currentRenderedDoc.write(hs.ui.currentHyDoc);
	},
	
	printStatus: function(msg, duration){
		this.clearStatus();
		
		var statusArea = dojo.byId("statusArea");
		statusArea.style.display = "block";
		statusArea.innerHTML = msg;
		
		if(typeof duration != "undefined"){
			window.setTimeout(function(){
				hs.ui.fadeStatus();
			}, duration);
		}
	},
	
	clearStatus: function(){
		var statusArea = dojo.byId("statusArea");
		statusArea.style.display = "none";
		statusArea.innerHTML = "";
	},
	
	fadeStatus: function(){
		var statusArea = dojo.byId("statusArea");
		if(statusArea.style.display == "none"){
			return;
		}
		
		var anim = dojo.lfx.html.fadeOut(statusArea, 700, false, function(){
			hs.ui.clearStatus();
			statusArea.style.filter = "alpha(opacity=100)" // IE
			statusArea.style.opacity = "1"; // W3C
		});
		
		anim.play();
	},
	
	reportError: function(msg){
		// some IE error objects have extra properties we
		// want to print
		if(typeof msg.name != "undefined" 
			&& typeof msg.message != "undefined"){
			msg = msg.name + ": " + msg.message;		
		}
		
		if(djConfig.isDebug == true){
			debug(msg);
		}
		
		hs.ui.printStatus(msg, 3000);
	},
	
	dumpProfiling: function(){
		if(djConfig.profiling == true){
			var docEndTime = new Date().getTime();
					
			hs.profile.end('programtime');
			hs.profile.dump(true);
			
			// only print out the total doc time once
			if(hs.ui._reportDocTime == true){
				var docStartTime = window.parent.docStartTime;
				var totalDocTime = docEndTime - docStartTime;
			
				var resultDiv = document.createElement('div');
				resultDiv.innerHTML = '<div id="docProfile">'
										+ 'total time for everything = ' 
										+ totalDocTime 
										+ ' ms'
									+ '</div>';
				dojo.html.body().appendChild(resultDiv);
				
				hs.ui._reportDocTime = false;
			}
		}
	},
	
	_initializeDebugging: function(){
		// map Dojo's and JSUnit's debugs to our own
		dojo.debug = hs.debug;
		debug = hs.debug;
		
		if(djConfig.isDebug == true){
			// add the 'debugging' style class to the body
			// so that IE will correctly display the debug
			// console
			dojo.html.addClass(dojo.html.body(), "debugging");
			
			// turn off production mode, since we want
			// to display errors in debug mode
			djConfig.production = false;
		}
	},
	
	_checkBrowserURL: function(){
		var checkLocation = window.location.toString();
			
		if(hs.ui._currentLocation != checkLocation){
			hs.ui._currentLocation = checkLocation;
			hs.ui.resolveLocation(hs.ui._currentLocation);
		}
	},
	
	_initializeWidgets: function(){
		dojo.hostenv.makeWidgets();			
	},
	
	_initializeProfiling: function(){
		// add a class to our body tag that switches the
		// content iframe from filling the entire browser window so that
		// we have room for our profiling results to print out
		dojo.html.addClass(dojo.html.body(), "profiling");
		hs.profile.start("programtime");	
	},
	
	_handleResizing: function(){
		if(dojo.render.html.ie != true){
			dojo.event.connect(window, "onresize", function(){
				var addr = hs.ui.currentHyDoc.address;
				if(addr != null && typeof addr != "undefined"){
					hs.ui.resolveLocation(addr);
				}
			});
		}
	}
}


/**
  	Setup debugging - Dojo has a dojo.debug() method, but the way
	dojo loads up the debugging framework causes trouble with our
	XSLT transform infrastructure where we call hyperscope.xsl
	to get our chrome - Dojo does an internal document.write to
	get debug.js, but this breaks our setup because the page
	is already loaded.
*/

hs.debug = function(msg){
	if (djConfig.isDebug == false 
			|| dojo.lang.isUndefined(djConfig.isDebug)){ 
		return;
	}
	
	msg = "DEBUG: " + msg;
	dojo.hostenv.println(msg);
}

// if we are running unit tests, remap debugging
// to JSUnit's debug
if(djConfig.testing == true){ // JSUnit's environment
	dojo.debug = debug;
}



/**
  Represents our rendered document area. Can
  write out a new hs.model.Document and focus
  our current context node. 
  
  This class will also publish
  a mark event on the Dojo Topic "/mark" whenever
  a Mark event occurs; the payload is an hs.ui.Mark
  object representing the mark.
 */

/**
  Constructor for our RenderedDocument.
  
  @param container : DOM DIV that contains our 
  rendered document's iframe.
 */
hs.ui.RenderedDocument = function(container){
	// get our iframe to write into
	this._iframeDoc = dojo.byId("docFrame").contentDocument; // w3c
	if(dojo.lang.isUndefined(this._iframeDoc)){
		this._iframeDoc = dojo.byId("docFrame").contentWindow.document; // IE
	}
	
	// initialize the class that will write our results out
	// to the page in a fast way
	this._resultWriter = new hs.ui.ResultWriter(
									this,
									this._iframeDoc,
									this._onFinishedWriting);
}

dojo.lang.extend(hs.ui.RenderedDocument, {
	_iframeDoc: null,
	_contextNodeNumber: null,
	_resultWriter: null,
	_selectedRow: null,
	
	/**
	  Writes our results.
	  
	  @param doc : hs.model.Document - The Document to write
	  out.
	 */
	write: function(doc){
		this._resultWriter.write(doc);
	},
	
	/*
	  Focuses our context node at the top of the screen.
	 */
	focusContextNode: function(){
		// get the node to scroll to
		// which is our context node
		var ctxtId = "number" + this._contextNodeNumber;
		var ctxt = this._iframeDoc.getElementById(ctxtId);
		
		if(ctxt != null && typeof ctxt != "undefined"){
			if(hs.ui.commandBar.visible == true){
				// Firefox has a strange bug where our hs.ui.CommandBar
				// doesn't get events after rendering a document for the
				// second time; keep sending it's parent document the focus
				// so we get keyboard events
				
				// TODO: Find the underlying cause of this bug so that
				// RenderedDocument doesn't have to know about this information
				document.body.focus();
			}
			
			// scroll our node into view
			ctxt.scrollIntoView(true);
		}
	},
	
	/**
	  Initializes our rendered document. This
	  should be called each time hs.ui.ResultWriter
	  writes a new document into our results.

	  @param contextNodeNumber : String The node number of our context node, such
	  as '2A'.
	*/
	displayDocument: function(contextNodeNumber){
		this._contextNodeNumber = contextNodeNumber;
		
		// set up our event handler to select 
		// and unselect rows
		dojo.event.disconnect(this._iframeDoc.body, "onmouseover", this, this._handleMouse);
		dojo.event.disconnect(this._iframeDoc.body, "onmouseout", this, this._handleMouse);
		dojo.event.connect(this._iframeDoc.body, "onmouseover", this, this._handleMouse);
		dojo.event.connect(this._iframeDoc.body, "onmouseout", this, this._handleMouse);
		
		// setup marking and quick buttons event handler
		dojo.event.disconnect(this._iframeDoc.body, "onclick", this, this._handleClick);
		dojo.event.connect(this._iframeDoc.body, "onclick", this, this._handleClick);
		
		// listen for scroll events to update context node.
		// too many issues - see comments on this._onScroll
		// for details.
		/*dojo.event.connect(this._iframeDoc.body, "onscroll",
							this, this._onScroll);*/
	},
	
	clearSelection: function(){
		if(this._selectedRow != null){
			dojo.html.removeClass(this._selectedRow, "selected-row");
		}
	},
	
	_onFinishedWriting: function(hsDoc, iframeDoc){
		// let the command bar intercept key events on
		// on our rendered document
		hs.ui.commandBar._onRenderedDocument(iframeDoc);
	
		// dump out profiling info if profiling is on
		hs.ui.dumpProfiling();
	},
	
	_handleMouse: function(evt){
		if(hs.ui.markingMode == true){
			return;
		}
		
		var tg = evt.target;
		
		// keep looping till we get a node row
		while(tg != null && dojo.html.hasClass(tg, "node-row") == false){
			tg = tg.parentNode;
		}
		
		if(tg == null || typeof tg == "undefined"){
			return;
		}
		
		// select or unselect the line based on the mouse
		// event
		var evtType = evt.type.toLowerCase();
		if(evtType == "mouseover"){
			dojo.html.addClass(tg, "selected-row");
			this._selectedRow = tg;
		}else if(evtType == "mouseout"){
			dojo.html.removeClass(tg, "selected-row");
			this._selectedRow = null;
		}
	},
	
	_handleClick: function(evt){
		// are we in marking mode?
		if(hs.ui.markingMode == true){
			this._handleMark(evt);
		}else{
			var tg = evt.target;
			if(tg.nodeName.toLowerCase() == "a"){
				evt.stopPropagation();
				evt.preventDefault(true);
				hs.ui.resolveLocation(tg.href);
			}else if(dojo.html.hasClass(tg, "quick-button")){
				evt.stopPropagation();
				evt.preventDefault(true);
				this._handleQuickButton(tg);
			}
		}
	},
	
	_handleQuickButton: function(tg){
		var number;
		var viewspec;
		
		// get the row for the node that was clicked on
		var nodeRow = tg.parentNode;
		while(nodeRow != null
				&& nodeRow.nodeName.toLowerCase() != "tr"){
			nodeRow = nodeRow.parentNode;		
		}
		
		// get the node number for this row
		var nodeNumber = nodeRow.getAttribute(
							hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
							+ ":number");
		
		// determine our number and viewspecs
		if(dojo.html.hasClass(tg, "quick-zoom-out")){
			viewspec = "ebthz";
			
			// get the parent
			if(nodeNumber == "0"){
				number = "0";
			}else if(nodeNumber.length == 1){ // 1, 2, 3, etc.
				number = "0";
			}else{
				number = nodeNumber.substring(0, nodeNumber.length - 1);
			}
		}else if(dojo.html.hasClass(tg, "quick-zoom-in")){
			viewspec = "ebthz";
			number = nodeNumber;
		}else if(dojo.html.hasClass(tg, "quick-lines")){
			viewspec = "wyh";
			number = nodeNumber;
		}
		
		// put these together to get our final quick button URL
		var url = "#" + number + ":" + viewspec;
		
		// now render it
		hs.ui.resolveLocation(url);
	},
	
	_handleMark: function(evt){
		// if a link was clicked on turn off it's default
		// action
		var tg = evt.target;
		if(tg && tg.nodeName && tg.nodeName.toLowerCase() == "a"){
			evt.stopPropagation();
			evt.preventDefault(true);	
		}
		
		var mark = new hs.ui.Mark(evt);
		
		if(mark.invalidMark == true){
			return;
		}
		
		// publish this Mark to anyone that is interested
		dojo.event.topic.publish("/mark", mark);
	}
	
	/**
	  Changing context node based on scrolling opens too
	  many issues for now; the code below implemented this
	  for IE but commented out until a future phase can resolve
	  usability issues.
	 */
	/*_onScroll: function(evt){
		// Internet Explorer doesn't give us a real value
		// for elementFromPoint if we run it from an onScroll
		// event, so put it on a slight timeout to get it to work right
		var self = this;
		window.setTimeout(function(){
			var results = self._iframeDoc.elementFromPoint(15, 20);
			if(results != null){
				// keep looping till we get a TR table row
				while(results != null && results.nodeName.toLowerCase() != "tr"){
					results = results.parentNode;
				}
				if(results != null){
					var ctxtNumber = results.getAttribute("hs-internal:number");
					var url = "#" + ctxtNumber;
					hs.ui.resolveLocation(url);
				}
			}
		}, 1);
	}*/
});



/**
  Our viewspec overlay window that appears when the user presses 
  the Viewspec button.
  
  TODO: REFACTOR: Make a single base-widget class for this and
  the Jump Overlay.
  
  TODO: REFACTOR: Right now this class has knowledge of viewspec
  letters; refactor CurrentViewspecs to contain this knowledge and
  be able to output viewspecs even if they are the default, then
  remove this knowledge from here.
  
  TODO: Implement show/hide node labels and show/hide node signatures
  and hook this class back into them; code portions having to do with
  these have been commented out for future implementation.
 */
dojo.widget.defineWidget("hs.ui.ViewspecOverlay", dojo.widget.HtmlWidget, {
	widgetType: "ViewspecOverlay",
  	isContainer: true,
	templatePath: dojo.uri.dojoUri("../hs/templates/ViewspecOverlay.html"),
  	templateCssPath: dojo.uri.dojoUri("../hs/templates/ViewspecOverlay.css"),
	
	_mark: null,
	_showingMore: false,
	
	/** Unicode for our up and down arrows. */
	_UP_ARROW: "&#9650;",
	_DOWN_ARROW: "&#9660;",
	
	/** 
	  Dirty flags that control whether we will print out
	  the letter for a particular viewspec checkbox or not. 
	  Keeps the specified viewspec field from getting
	  confusing.
	 */
	_blankLinesDirty: false,
	_nodeAddressingDirty: false,
	_nodeLabelsDirty: false,
	_nodeSignaturesDirty: false,
	_includesOnDirty: false,
	_outlineDirty: false,
	_applyFilterDirty: false,

	postCreate: function(){
		this.width = dojo.style.getOuterWidth(this.domNode);
		this.height = dojo.style.getOuterHeight(this.domNode);
		
		// determine our height and set it dynamically
		// so we don't have to hard code it in our
		// CSS; this will make us more robust against
		// user-initiated font-size changes.
		// add the height of the floating pane chrome
		// back in (+50)
		var height = this.height + 50;
		var width = this.width;
		this.viewOverlayPane.style.width = width + "px";
		this.viewOverlayPane.style.height = height + "px";
		
		// save the height for the less-mode
		// so we can restore it later if the user moves
		// to more-mode
		this._lessModeHeight = height;
	},
	
	isShowing: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// see src/client/lib/hs/templates/ViewspecsOverlay.css for
		// description of how class 'initial-overlay-state' is used
		if(dojo.html.hasClass(floatingPane.domNode, "initial-overlay-state")){
			return false;
		}else{
			return floatingPane.isShowing();
		}
	},
	
	/**
		Resets the Viewspec Overlay using
		the current document being displayed
	*/		
	reset: function(){
		this._handleReset();
	},
	
	show: function(){
		// clear out any viewspecs previously entered
		this.selectedViewspecs.value = "";
		
		// reset dirty state
		this._blankLinesDirty = false;
		this._nodeAddressingDirty = false;
		this._nodeLabelsDirty = false;
		this._nodeSignaturesDirty = false;
		this._includesOnDirty = false;
		this._outlineDirty = false;
		this._applyFilterDirty = false;
		
		// initialize our initial viewspec UI
		// using our current viewspecs
		var currentViewspecs = null;
		if(hs.ui.currentHyDoc != null){
			this._resetViewspecs(
					hs.ui.currentHyDoc.currentViewspecs);
			this._printSelectedViewspecs();
		}
		
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// bring to the top, in case other overlays are visible
		floatingPane.bringToTop();
		
		// see src/client/lib/hs/templates/ViewspecsOverlay.css for
		// description of how class 'initial-overlay-state' is used
		dojo.html.removeClass(floatingPane.domNode, 
								"initial-overlay-state");
		
		// determine the width of our viewspec overlay
		
		// start at the Viewspec button
		var viewspecsButton = dojo.byId("toolbarViewspecsButton");
		var viewspecsButtonWidth = dojo.html.getOuterWidth(viewspecsButton);
		var pageWidth = dojo.html.getViewportWidth();
		var startY = dojo.style.getAbsoluteY(viewspecsButton, false) 
					+ viewspecsButtonWidth/2;
		
		// end past the bottom of the toolbar
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var endY = toolbarHeight + 35;
		
		// make the node visible, but turn off it's opacity
		if(dojo.render.html.ie != true){
			dojo.style.setOpacity(floatingPane.domNode, 0);
		}
		dojo.style.show(floatingPane.domNode);
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 0, end: 1 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 40, end: 40 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
		
		dojo.event.connect(anim, "onEnd", dojo.lang.hitch(this, function(){	
			this.selectedViewspecs.select();
		}));
			
		anim.play();
	},
	
	hide: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// start below the toolbar and to the right of the page
		var pageWidth = dojo.html.getViewportWidth();
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var startY = toolbarHeight + 35;
		
		// end at the viewspecs button
		var viewspecsButton = dojo.byId("toolbarViewspecsButton");
		var viewspecsButtonWidth = dojo.html.getOuterWidth(viewspecsButton);
		var endY = dojo.style.getAbsoluteY(viewspecsButton, false) 
				+ viewspecsButtonWidth/2;
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 1, end: 0 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 40, end: 40 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
			
		dojo.event.connect(anim, "onEnd", function(){	
			dojo.style.hide(floatingPane.domNode);
		});
		
		anim.play();
	},
	
	_handleApply: function(){
		// if the apply button is disabled 
		// then an incorrect viewspec button was
		// entered; do nothing
		if(this.applyButton.disabled == true){
			return;
		}
		
		// update our current viewspecs just
		// in case the cursor is still in the 
		// selected viewspecs field
		this._printSelectedViewspecs();
		
		// get our new viewspecs
		var newViews = this.selectedViewspecs.value;
			
		// turn the viewspecs into a url
		var url = "#:" + newViews;
		
		// attach a filter if we have one
		if(this.applyFilter.checked == true){
			var filter = this.filterInput.value;
			// add quotes if there aren't any there and
			// we don't have a regular expression
			if(dojo.string.startsWith(filter, '"') == false
				&& dojo.string.startsWith(filter, "/") == false){
				filter = '"' + filter + '"';
			}
			
			url += " ;" + filter + ";";	
		}
		
		hs.ui.resolveLocation(url);
		
		// reset dirty settings
		this._resetDirty();
		
		// select everything in the viewspec input
		// in case the user wants to type again in
		// there
		this.selectedViewspecs.select();
	},
	
	_handleCancel: function(){
		this.hide();
	},
	
	_handleReset: function(){
		this.selectedViewspecs.value = "";
		
		// reset dirty state
		this._resetDirty();
		
		var currentViewspecs = null;
		if(hs.ui.currentHyDoc != null){
			this._resetViewspecs(
					hs.ui.currentHyDoc.currentViewspecs);
			this._printSelectedViewspecs();
		}
	},
	
	_resetDirty: function(){
		this._blankLinesDirty = false;
		this._nodeAddressingDirty = false;
		this._nodeLabelsDirty = false;
		this._nodeSignaturesDirty = false;
		this._includesOnDirty = false;
		this._outlineDirty = false;
		this._applyFilterDirty = false;
	},
	
	_resetViewspecs: function(currentViewspecs){	
		if(currentViewspecs.showBlankLines()){
			this.showBlankLines.checked = true;
		}else{
			this.showBlankLines.checked = false;
		}
		
		var levelClipping = currentViewspecs.getLevelClipping();
		var lineClipping = currentViewspecs.getLineClipping();
		if(levelClipping == 1 && lineClipping == 1){
			this._showFirstOutline();
		}else if(levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
					&& lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();				
		}else{
			this._showOutlineNumbers(levelClipping, lineClipping);	
		}
		
		if(currentViewspecs.showNodeAddressing()){
			this.showNodeAddressing.checked = true;
			this.placementLeft.disabled = undefined;
			this.placementRight.disabled = undefined;
			
			if(currentViewspecs.getNodeAddressingPlacement()
				== hs.filter.ViewspecConstants.LEFT){
				this.placementLeft.checked = true;	
				this.placementRight.checked = false;		
			}else{
				this.placementLeft.checked = false;
				this.placementRight.checked = true;
			}		
		}else{
			this.showNodeAddressing.checked = false;
			this.placementLeft.disabled = true;
			this.placementRight.disabled = true;
		}
		
		// commenting out for future implementation
		/*if(currentViewspecs.showNodeLabels()){
			this.showNodeLabels.checked = true;
		}else{
			this.showNodeLabels.checked = false;
		}
		
		if(currentViewspecs.showNodeSignatures()){
			this.showNodeSignatures.checked = true;
		}else{
			this.showNodeSignatures.checked = false;
		}*/
		
		if(currentViewspecs.runSequenceGenerators()){
			this.includesOn.checked = true;
		}else{
			this.includesOn.checked = false;
		}
		
		if(currentViewspecs.getContentFilterType()
				== hs.filter.ViewspecConstants.NO_FILTERING){
			this.applyFilter.checked = false;
			this.filterInput.disabled = true;
		}else if(currentViewspecs.getContentFilterType()
				== hs.filter.ViewspecConstants.FILTER_ALL){
			this.applyFilter.checked = true;
			this.filterInput.disabled = undefined;
			var contentFilter = hs.ui.currentHyDoc.address.contentFilter;
			if(contentFilter != null){
				this.filterInput.value = contentFilter.toString();
			}		
		}else if(currentViewspecs.getContentFilterType()
				== hs.filter.ViewspecConstants.NEXT_FILTERED_NODE){
			// not supported through Viewspec UI
			this.applyFilter.checked = false;
			this.filterInput.disabled = true;	
		}
	},
	
	_showFirstOutline: function(evt){
		this.showFirstOutline.checked = true;
		this.showAllOutline.checked = false;
		
		this.levelInput.value = "1";
		this.lineInput.value = "1";
		
		this.levelUp.disabled = undefined;
		// level 0 is possible
		this.levelDown.disabled = undefined;
		
		this.lineUp.disabled = undefined;
		this.lineDown.disabled = true;
		
		if(typeof evt != "undefined"){
			this._outlineDirty = true;
			this._printSelectedViewspecs();
		}
	},
	
	_showAllOutline: function(evt){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = true;
		
		this.levelInput.value = 
			hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING;
		this.lineInput.value = 
			hs.filter.ViewspecConstants.MAX_LINE_CLIPPING;
		
		this.levelUp.disabled = true;
		this.levelDown.disabled = undefined;
		
		this.lineUp.disabled = true;
		this.lineDown.disabled = undefined;
		
		if(typeof evt != "undefined"){
			this._outlineDirty = true;
			this._printSelectedViewspecs();
		}
	},
	
	_showOutlineNumbers: function(levelClipping, lineClipping){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		
		this.levelInput.value = levelClipping;
		this.lineInput.value = lineClipping;
		
		this.levelUp.disabled = undefined;
		this.levelDown.disabled = undefined;
		
		if(levelClipping == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			this.levelUp.disabled = true;	
		}
		
		if(lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this.lineUp.disabled = true;	
		}
		
		if(levelClipping == 0){
			this.levelDown.disabled = true;	
		}
		
		if(lineClipping == 1){
			this.lineDown.disabled = true;	
		}
	},
	
	_incrementLevel: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.levelInput.value = new Number(this.levelInput.value).valueOf() + 1;
		this.levelUp.disabled = undefined;
		this.levelDown.disabled = undefined;
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			this.levelUp.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_decrementLevel: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.levelInput.value = new Number(this.levelInput.value).valueOf() - 1;
		this.levelUp.disabled = undefined;
		this.levelDown.disabled = undefined;
		
		if(this.levelInput.value == 0){
			this.levelDown.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_incrementLine: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.lineInput.value = new Number(this.lineInput.value).valueOf() + 1;
		this.lineUp.disabled = undefined;
		this.lineDown.disabled = undefined;
		
		if(this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this.lineUp.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_decrementLine: function(){
		this.showFirstOutline.checked = false;
		this.showAllOutline.checked = false;
		this.lineInput.value = new Number(this.lineInput.value).valueOf() - 1;
		this.lineUp.disabled = undefined;
		this.lineDown.disabled = undefined;
		
		if(this.lineInput.value == 1){
			this.lineDown.disabled = true;	
		}
		
		if(this.levelInput.value == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING
			&& this.lineInput.value == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			this._showAllOutline();		
		}else if(this.levelInput.value == 1
					&& this.lineInput.value == 1){
			this._showFirstOutline();				
		}
		
		this._outlineDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleBlankLines: function(){
		this._blankLinesDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleNodeAddressing: function(){
		if(this.showNodeAddressing.checked == true){
			this.showNodeAddressing.checked = true;
			this.placementLeft.disabled = undefined;
			this.placementRight.disabled = undefined;
			
			// if there are no pre-existing values
			// for the left/right radio buttons, give
			// the default
			if(this.placementLeft.checked == false
				&& this.placementRight.checked == false){
				this.placementLeft.checked = true;		
			}
		}
		else{ // unchecked
			this.showNodeAddressing.checked = false;
			this.placementLeft.disabled = true;
			this.placementRight.disabled = true;
		}
		
		this._nodeAddressingDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_setPlacementLeft: function(){
		this.placementLeft.checked = true;
		this.placementRight.checked = false;
		
		this._nodeAddressingDirty = true;
		
		this._printSelectedViewspecs();	
	},
	
	_setPlacementRight: function(){
		this.placementLeft.checked = false;
		this.placementRight.checked = true;
		
		this._nodeAddressingDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleNodeLabels: function(){
		this._nodeLabelsDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleNodeSignatures: function(){
		this._nodeSignaturesDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleIncludesOn: function(){
		this._includesOnDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_toggleFilter: function(){
		if(this.applyFilter.checked == true){
			this.filterInput.disabled = undefined;
		}else{
			this.filterInput.disabled = true;
		}
		
		this._applyFilterDirty = true;
		
		this._printSelectedViewspecs();
	},
	
	_printSelectedViewspecs: function(){
		// print out anything that has a checkbox
		var results = new String();
		
		if(this._blankLinesDirty == true){
			if(this.showBlankLines.checked == true){
				results += "y";
			}else{
				results += "z";
			}
		}
		
		if(this._nodeAddressingDirty == true){
			if(this.showNodeAddressing.checked == true){
				results += "m";
				
				if(this._showingMore){
					if(this.placementLeft.checked == true){
						results += "H";
					}else if(this.placementRight.checked == true){
						results += "G";
					}
				}
			}else{
				results += "n";
			}
		}
		
		if(this._showingMore){
			// commenting out for future implementation
			/*if(this._nodeLabelsDirty == true){
				if(this.showNodeLabels.checked == true){
					results += "C";
				}else{
					results += "D";
				}
			}
			
			if(this._nodeSignaturesDirty == true){
				if(this.showNodeSignatures.checked == true){
					results += "K";
				}else{
					results += "L";
				}
			}*/
		
			if(this._includesOnDirty == true){
				if(this.includesOn.checked == true){
					results += "O";
				}else{
					results += "P";
				}
			}
		}
		
		if(this._outlineDirty == true){
			if(this.showFirstOutline.checked == true){
				results += "x";
			}else if(this.showAllOutline.checked == true){
				results += "w";
			}else if(this._showingMore){
				var levelValue = new Number(this.levelInput.value).valueOf();
				var lineValue = new Number(this.lineInput.value).valueOf();
				
				results = 
					this._writeLevelClipping(levelValue, lineValue, results);
					
				results = 
					this._writeLineClipping(levelValue, lineValue, results);
			}
		}
		
		if(this._showingMore){
			if(this._applyFilterDirty == true){
				if(this.applyFilter.checked == true){
					results += "i";
				}else{
					results += "j";
				}
			}
		}
		
		this.selectedViewspecs.value = this._filterViewspecs(results);
	},
	
	_writeLineClipping: function(levelValue, lineValue, results){
		// line clipping
		if(lineValue == 1){
			// show just first line
			// t - show first lines only
			results += "t";
		}else if(lineValue == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			// line clipping is the max
			// s - show all lines
			results += "s";
		}else{
			// figure out if line clipping is closer to 1 or the max
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LINE_CLIPPING - lineValue;
			if(distanceToMax <= lineValue){
				// much closer to the maximum line clipping
				// write out 's' ('show all lines'), followed
				// by necessary number of 'q' ('show one lines less')
				// letters
				results += "s";
				for(var i = distanceToMax; i > 0; i--){
					results += "q";
				}
			}else{
				// much closer to the beginning of the allowed value
				// write out 't' ('show first lines only') followed
				// by necessary number of 'r' ('show one line more')
				// letters
				results += "t";
				for(var i = 2; i <= lineValue; i++){
					results += "r";
				}
			}
		}
		
		return results;
	},
	
	_writeLevelClipping: function(levelValue, lineValue, results){
		// level clipping
		var ctxtNodeLevel = hs.ui.currentHyDoc.nodeCtxt.level;
		
		if(levelValue == 1){
			// first level
			// d - show first level only
			results += "d";
		}else if(levelValue == hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING){
			// level clipping is max
			// c - show all levels
			results += "c";
		}else if(levelValue == 0){
			// show just level 0 - no direct viewspec letter to get
			// this
			// write out 'da' -
			// 'd' - 'show first level only
			// 'a' - show one level less
			results += "da";
		}else if(levelValue >= (hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - 20)){
			// our level clipping is within 20 units of the maximum allowed value
			// write out 'c' ('show all levels') followed by the necessary
			// number of 'a' ('show one level less') letters
			results += "c";
			var distanceToMax = 
				hs.filter.ViewspecConstants.MAX_LEVEL_CLIPPING - levelValue;
			for(var i = distanceToMax; i > 0; i--){
				results += "a";
			}
		}else if(ctxtNodeLevel != 0 && levelValue >= ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is equal to or greater than
			// this node.
			// write out 'e' ('show levels up to referenced node'), followed
			// by necessary number of 'b' ('show one level more') letters
			results += "e";
			var distanceFromCtxt = levelValue - ctxtNodeLevel;
			for(var i = 1; i <= distanceFromCtxt; i++){
				results += "b";
			}
		}else if(ctxtNodeLevel != 0 && levelValue < ctxtNodeLevel){
			// our context node at the top of the displayed page is not at level
			// 0, and our current clipping level is less than
			// this node.
			
			// determine whether our level clipping is closer to 1 or
			// to our context node's level
			var distanceToCtxt = ctxtNodeLevel - levelValue;
			if(distanceToCtxt >= levelValue){
				// we are closer to 1.
				// write out 'd' ('show first level only'), followed
				// by correct number of 'b' ('show one level more')
				// letters
				results += "d";
				for(var i = 2; i <= levelValue; i++){
					results += "b";
				}
			}else{
				// we are closer to the context node
				// write out 'e' ('show levels up to referenced node'), 
				// followed by necessary number of 'a' 
				// ('show one level less') letters
				results += "e";
				for(var i = 1; i <= distanceToCtxt; i++){
					results += "a";
				}
			}	
		}else if(ctxtNodeLevel == 0){
			results += "da" // get to level zero
			// now write out the correct number of 'b's
			for(var i = 1; i <= levelValue; i++){
				results += "b";
			}	
		}
			
		return results;
	},
	
	_toggleSelectedViewspecs: function(evt){
		// see if the user pressed enter or escape
		// 13 is the ENTER key on Windows/Linux
		// and the RETURN key on a Mac
		if(evt.keyCode == 13){
			this._handleApply();
			return;
		}else if(evt.keyCode == 27){ // ESCAPE key
			this.hide();
			return;
		}	
		
		// we are dealing with a new viewspec letter
		
		// append our old viewspecs to the new ones
		// entered by a user so we don't lose some that
		// are not specifiable through the UI
		var newViews = this.selectedViewspecs.value;
		var originalViews = hs.ui.currentHyDoc.currentViewspecs.toString();
		newViews = originalViews + newViews;
		
		// mark fields dirty using letters
		this._markDirtyWithLetters(this.selectedViewspecs.value);
		
		// clear any old error message
		this.errorArea.innerHTML = "";
		this.applyButton.disabled = undefined;
		
		// create a new viewspec object
		var currentViewspecs;
		try{
			currentViewspecs = 
				new hs.filter.CurrentViewspecs(newViews, hs.ui.currentHyDoc);
		}catch(e){
			evt.stopPropagation();
			evt.preventDefault(true);
			this.errorArea.innerHTML = e;
			this.applyButton.disabled = true;
			return;
		}
		
		this._resetViewspecs(currentViewspecs);
	},
	
	_filterViewspecs: function(results){
		// keep any viewspecs that aren't settable through the UI
		var oldViews = this.selectedViewspecs.value;
		var removeViews;
		if(this._showingMore){
			// commenting out because C, D, K, and L are not implemented yet
			// uncomment when they are
			//removeViews = /y|z|m|n|H|G|C|D|K|L|O|P|x|w|a|b|c|d|r|q|s|t|i|j|k/g;
			removeViews = /y|z|m|n|H|G|O|P|x|w|a|b|c|d|r|q|s|t|i|j|k/g;
		}else{
			removeViews = /y|z|m|n|x|w/g;
		}
		oldViews = oldViews.replace(removeViews, "");
		
		results = results + oldViews;
		
		return results;
	},
	
	_toggleAdvanced: function(){
		var width = this.width;
		var height;
		
		if(this._showingMore == false){ // toggle to more mode
			this._showingMore = true;
			this.advancedButton.innerHTML = "Less&nbsp;&#9650;";
			dojo.html.replaceClass(this.viewTable, "moreMode", "lessMode");
			height = this.viewTable.scrollHeight + 50;
		}else{ // toggle to less mode
			this._showingMore = false;
			this.advancedButton.innerHTML = "More&nbsp;&#9660;";
			dojo.html.replaceClass(this.viewTable, "lessMode", "moreMode");
			height = this._lessModeHeight; 	
		}
		
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		floatingPane.resizeTo(width, height);
	},
	
	_markDirtyWithLetters: function(letters){
		if(letters.indexOf("y") != -1 
			|| letters.indexOf("z") != -1){
			this._blankLinesDirty = true;		
		}
		
		if(letters.indexOf("m") != -1 
			|| letters.indexOf("n") != -1
			|| letters.indexOf("G") != -1
			|| letters.indexOf("H") != -1){
			this._nodeAddressingDirty = true;		
		}
		
		// commenting out for future implementation
		/*
		if(letters.indexOf("C") != -1 
			|| letters.indexOf("D") != -1){
			this._nodeLabelsDirty = true;		
		}
		
		if(letters.indexOf("K") != -1 
			|| letters.indexOf("L") != -1){
			this._nodeSignaturesDirty = true;		
		}*/
		
		if(letters.indexOf("O") != -1 
			|| letters.indexOf("P") != -1){
			this._includesOnDirty = true;		
		}
		
		if(letters.indexOf("x") != -1 
			|| letters.indexOf("w") != -1
			|| letters.indexOf("a") != -1
			|| letters.indexOf("b") != -1
			|| letters.indexOf("c") != -1
			|| letters.indexOf("d") != -1
			|| letters.indexOf("r") != -1
			|| letters.indexOf("q") != -1
			|| letters.indexOf("s") != -1
			|| letters.indexOf("t") != -1
			|| letters.indexOf("e") != -1){
			this._outlineDirty = true;		
		}
		
		if(letters.indexOf("i") != -1 
			|| letters.indexOf("j") != -1
			|| letters.indexOf("k") != -1){
			this._applyFilterDirty = true;		
		}
	}
});



/**
  Our jump overlay window that appears when the user presses the Jump button.
  
  TODO: REFACTOR: Make a single base-widget class for this and our other
  overlays.
 */
dojo.widget.defineWidget("hs.ui.JumpOverlay", dojo.widget.HtmlWidget, {
	widgetType: "JumpOverlay",
  	isContainer: true,
	templatePath: dojo.uri.dojoUri("../hs/templates/JumpOverlay.html"),
  	templateCssPath: dojo.uri.dojoUri("../hs/templates/JumpOverlay.css"),
	
	_mark: null,

	postCreate: function(){
		this.width = dojo.style.getOuterWidth(this.domNode);
		this.height = dojo.style.getOuterHeight(this.domNode);
		
		// determine our height and set it dynamically
		// so we don't have to hard code it in our
		// CSS; this will make us more robust against
		// user-initiated font-size changes.
		// add the height of the floating pane chrome
		// back in (+50)
		var height = this.height + 50;
		var width = this.width;
		this.jumpOverlay.style.width = width + "px";
		this.jumpOverlay.style.height = height + "px";
		
		// subscribe to mark events
		dojo.event.topic.subscribe("/mark", this, "_onMark");
	},
	
	getHeight: function(){
		return this.height;
	},
	
	resolveURL: function(){
		var url = this.addressInput.value;
		this.addressInput.value = "";
		
		/**
			Four input modes are allowed:
				* Input is preceded with a hash
				* Input has a scheme://
				* Input has ../ or ./ at the beginning -
				interpreted as a relative file address
				* Input has neither of these, and
				is interpreted as having a #
		*/
		if(dojo.string.startsWith(url, "#") == false
			&& dojo.string.startsWith(url, "./") == false
			&& dojo.string.startsWith(url, "../") == false
			&& /^[^:]*:\//.test(url) == false){
			url = "#" + url;		
		}
		
		hs.ui.resolveLocation(url);
	},
	
	handleOK: function(){
		this.resolveURL();
	},
	
	handleCancel: function(){
		this.hide();
	},
	
	handleKey: function(evt){
		// 13 is the ENTER key on Windows/Linux
		// and the RETURN key on a Mac
		if(evt.keyCode == 13){
			this.resolveURL();
		}else if(evt.keyCode == 27){ // ESCAPE key
			this.hide();
		}		
	},
	
	isShowing: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		if(dojo.html.hasClass(floatingPane.domNode, "initial-overlay-state")){
			return false;
		}else{
			return floatingPane.isShowing();
		}
	},
	
	show: function(){
		// indicate that we can do marking
		hs.ui.markingMode = true;
		
		// clear out any address previously entered
		this.addressInput.value = "";
		
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// bring to the top, in case other overlays are visible
		floatingPane.bringToTop();
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		dojo.html.removeClass(floatingPane.domNode, "initial-overlay-state");
		
		// determine the width of our jump overlay
		
		// start at the Jump button
		var jumpButton = dojo.byId("toolbarJumpButton");
		var jumpButtonWidth = dojo.html.getOuterWidth(jumpButton);
		var pageWidth = dojo.html.getViewportWidth();
		var startY = dojo.style.getAbsoluteY(jumpButton, false) + jumpButtonWidth/2;
		
		// end right below the toolbar
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var endY = toolbarHeight + 30;
		
		// make the node visible, but turn off it's opacity
		if(dojo.render.html.ie != true){
			dojo.style.setOpacity(floatingPane.domNode, 0);
		}
		dojo.style.show(floatingPane.domNode);
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 0, end: 1 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 60, end: 60 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
		
		dojo.event.connect(anim, "onEnd", dojo.lang.hitch(this, function(){	
			this.addressInput.focus();
		}));
		
		anim.play();
	},
	
	hide: function(){
		// turn off allowing marking
		hs.ui.markingMode = false;	
		
		// clear old marks
		this._setMarkable(false);
	
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// start below the toolbar and to the right of the page
		var pageWidth = dojo.html.getViewportWidth();
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var startY = toolbarHeight + 30;
		
		// end at the jump button
		var jumpButton = dojo.byId("toolbarJumpButton");
		var jumpButtonWidth = dojo.html.getOuterWidth(jumpButton);
		var endY = dojo.style.getAbsoluteY(jumpButton, false) + jumpButtonWidth/2;
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 1, end: 0 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 60, end: 60 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
			
		dojo.event.connect(anim, "onEnd", function(){	
			dojo.style.hide(floatingPane.domNode);
		});
		
		anim.play();
	},
	
	_setMarkable: function(markable){
		if(markable == true){
			if(this._mark != null){	
				dojo.html.addClass(this._mark.row, "marked");
			}
		}else{
			if(this._mark != null){
				dojo.html.removeClass(this._mark.row, "marked");
			}
			this._mark = null;
		}
	},
	
	_onMark: function(mark){
		// don't do marking if we are not visible
		if(this.isShowing() == false){
			return;
		}
		
		// clear out any mark that may have been there before
		this._setMarkable(false);
		
		this._mark = mark;
		
		// convert this mark to an address that can
		// be worked with
		var addr = mark.address;
		var url = addr.toString();
		
		// take just the hash portion
		url = url.match(/[^#]*(#.*)/)[1];
		
		// fill our Jump Overlay text field with this
		// marked address
		this.addressInput.value = url; 
		
		// highlight our marked row
		this._setMarkable(true);
	}
});


/**
  A Dojo Widget that implements our HyperScope toolbar.
 */
dojo.widget.defineWidget("hs.ui.HyperScopeToolbar", dojo.widget.HtmlWidget, {
	widgetType: "HyperScopeToolbar",
  	isContainer: false,
	templatePath: dojo.uri.dojoUri("../hs/templates/HyperScopeToolbar.html"),
  	templateCssPath: dojo.uri.dojoUri("../hs/templates/HyperScopeToolbar.css"),

	fillInTemplate: function(){
		// fill out our data structure that associates our buttons with
		// their states so we don't have so much boilerplate code
		// and can work with them generically
		this._buttonStates = new Array();
		this._buttonStates.push({id: "toolbarHelpButton",
								domNode: this.toolbarHelpButton,
								onaction: dojo.lang.hitch(this, this._toggleHelpOverlay),
								normal: "/hyperscope/src/client/images/help_normal.gif",
								rollover: "/hyperscope/src/client/images/help_rollover.gif",
								down: "/hyperscope/src/client/images/help_down.gif"});
								
		this._buttonStates.push({id: "toolbarJumpButton",
								domNode: this.toolbarJumpButton,
								onaction: dojo.lang.hitch(this, this._toggleJumpOverlay),
								normal: "/hyperscope/src/client/images/jump_normal.gif",
								rollover: "/hyperscope/src/client/images/jump_rollover.gif",
								down: "/hyperscope/src/client/images/jump_down.gif"});
								
		this._buttonStates.push({id: "toolbarViewspecsButton",
								domNode: this.toolbarViewspecsButton,
								onaction: dojo.lang.hitch(this, this._toggleViewspecsOverlay),
								normal: "/hyperscope/src/client/images/viewspecs_normal.gif",
								rollover: "/hyperscope/src/client/images/viewspecs_rollover.gif",
								down: "/hyperscope/src/client/images/viewspecs_down.gif"});
		
		this._buttonStates.push({id: "toolbarTurboModeButton",
								domNode: this.toolbarTurboModeButton,
								onaction: dojo.lang.hitch(this, this._toggleCommandBar),
								normal: "/hyperscope/src/client/images/turbomode_normal.gif",
								rollover: "/hyperscope/src/client/images/turbomode_rollover.gif",
								down: "/hyperscope/src/client/images/turbomode_down.gif"});
								
		this._buttonStates.push({id: "toolbarBrowserModeButton",
								domNode: this.toolbarBrowserModeButton,
								onaction: dojo.lang.hitch(this, this._toggleCommandBar),
								normal: "/hyperscope/src/client/images/browsermode_normal.gif",
								rollover: "/hyperscope/src/client/images/browsermode_rollover.gif",
								down: "/hyperscope/src/client/images/browsermode_down.gif"});
			
		// display our initial button state and set up our event listeners
		// to toggle our image states correctly
		for(var i = 0; i < this._buttonStates.length; i++){
			var entry = this._buttonStates[i];
			entry.domNode.src = entry.normal;
			dojo.event.connect(entry.domNode, "onmouseup", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onmousedown", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onmouseover", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onmouseout", this, "_handleMouse");
			dojo.event.connect(entry.domNode, "onclick", this, "_handleMouse");
		}
	},
	
	initializeTurboModeSettings: function(){
		// determine our command bar's initial visibility state
		if(this._isTurboMode() == true){
			this._toggleCommandBar(true);
		}else{
			this._toggleCommandBar(false);
		}
	},
	
	postCreate: function(){
		// determine our command bar's initial visibility state
		if(this._isTurboMode() == true){
			this._toggleCommandBar(true);
		}else{
			this._toggleCommandBar(false);
		}
	},
	
	_handleMouse: function(evt){
		var tg = evt.target;
		var id = tg.id;
		
		// get the button entry we are dealing with
		var entry;
		for(var i = 0; i < this._buttonStates.length; i++){
			if(this._buttonStates[i].id == id){
				entry = this._buttonStates[i];
				break;
			}
		}
		
		// change it's image correctly
		switch(evt.type.toLowerCase()){
			case "mouseover":
				entry.domNode.src = entry.rollover;
				break;
			case "mouseout":
				entry.domNode.src = entry.normal;
				break;
			case "mousedown":
				entry.domNode.src = entry.down;
				break;
			case "mouseup":
				entry.domNode.src = entry.rollover;
				break;
			case "click":
				entry.onaction.call();
				break;
		}
	},
	
	_toggleJumpOverlay: function(){
		var jumpOverlay = dojo.widget.byId("jumpOverlay");
		
		if(jumpOverlay.isShowing() == true){
			jumpOverlay.hide();
		}else{
			jumpOverlay.show();
		}
	},
	
	_toggleViewspecsOverlay: function(){
		var viewspecsOverlay = dojo.widget.byId("viewspecsOverlay");
		
		if(viewspecsOverlay.isShowing() == true){
			viewspecsOverlay.hide();
		}else{
			viewspecsOverlay.show();
		}
	},
	
	_toggleCommandBar: function(forceShow){
		if(hs.ui.commandBar.isShowing() || forceShow == false){
			this.toolbarJumpButton.style.display = "inline";
			this.toolbarViewspecsButton.style.display = "inline";
			this.commandBarCell.style.display = "none";
			
			this.toolbarTurboModeButton.style.display = "inline";
			this.toolbarBrowserModeButton.style.display = "none";
			
			// make parts of the toolbar smaller
			// for narrower moniters
			dojo.html.removeClass(this.rightHandCell, "right-shorter");
			
			// persist this setting
			this._setTurboMode(false);
		
			hs.ui.commandBar.hide();
		}else{
			var jumpOverlay = dojo.widget.byId("jumpOverlay");
			var viewspecsOverlay = dojo.widget.byId("viewspecsOverlay");

			// persist this setting
			this._setTurboMode(true);

			if(jumpOverlay.isShowing()){
				jumpOverlay.hide();
			}
			
			if(viewspecsOverlay.isShowing()){
				viewspecsOverlay.hide();
			}

			if(dojo.render.html.ie){
				// no support for table-cell display
				this.commandBarCell.style.display = "block";
			}else{ // w3c
				this.commandBarCell.style.display = "table-cell";
			}
			
			this.toolbarJumpButton.style.display = "none";
			this.toolbarViewspecsButton.style.display = "none";
			
			this.toolbarTurboModeButton.style.display = "none";
			this.toolbarBrowserModeButton.style.display = "inline";

			// make parts of the toolbar smaller
			// for narrower moniters
			dojo.html.addClass(this.rightHandCell, "right-shorter");

			hs.ui.commandBar.show();
		}
	},
	
	_setTurboMode: function(turboMode){
		if(turboMode == true){
			dojo.io.cookie.set("isturbomode", "yes", 30);
		}else{
			dojo.io.cookie.deleteCookie("isturbomode");
		}
	},
	
	_isTurboMode: function(){
		// REFACTOR: This should be in it's own user configuration class
		var turboModeSetting = dojo.io.cookie.get("isturbomode");

		if(turboModeSetting == "yes"){
			return true;
		}else{
			return false;
		}
	},
	
	_toggleHelpOverlay: function(){
		var helpOverlay = dojo.widget.byId("helpOverlay");
		
		if(helpOverlay.isShowing() == true){
			helpOverlay.hide();
		}else{
			helpOverlay.show();
		}
	}
});


/**
  During profiling we found that writing our HTML results
  into our iframe after our XSLT stylesheet was a bottleneck.
  This class encapsulates writing into the iframe, hiding any
  ugly optimizations we may have to do.
  
  The current strategy inside of ResultWriter is to create
  higher perceived performance by batching and writing the rows
  in chunks, using an interval timer to return control to the browser
  ever few milliseconds. Other tricks are also done to increase
  actual performance.
  
  TODO: REFACTOR: This code has become gnarly, both to stay
  very fast cross-browser, as well as to work around various
  limitations in our target browsers. If possible, simplify
  this code either here or by changing the architecture in
  the future. It was a major bottleneck area so it might
  have to remain ugly.
 */

/**
	Constructor. A ResultWriter should be constructed once
	and reused for the lifetime of the application;
	call the write() method each time after to write
	a new hs.model.Document that has been rendered with
	XSLT.
	  
	@param renderDoc : hs.ui.RenderedDocument Where we display
	our results.
	@param iframe : DOM Iframe The Iframe to write our results
	into.
	@param onFinishedWriting : Function A JavaScript Function
	that will be called when we are finished writing. This 
	function is passed a reference to the iframe's document
	object, which can be used to attach more behaviors
	to the rendered document. It is also passed a reference
	to the hs.model.Document that is being rendered:
		onFinishedWriting = function(hsDoc : hs.model.Document,
									iframeDoc : DOMDocument)
 */
hs.ui.ResultWriter = function(renderDoc, iframe, onFinishedWriting){
	this._renderDoc = renderDoc;
	this._onFinishedWriting = onFinishedWriting;
	this._iframe = iframe;
	
	this._initializeIframe();
	
	this._lineClipper = new hs.ui.LineClipper(iframe);
}

/** 
	The amount of time between writing chunked results to 
	the page, in milliseconds.
*/
hs.ui.ResultWriter._INTERVAL = 15;

/** The number of rows to chunk at one time. */
hs.ui.ResultWriter._CHUNK_AMOUNT = 40;

dojo.lang.extend(hs.ui.ResultWriter, {
	_iframe: null,
	_trNodes: null,
	_currentIndex: null,
	_container: null,
	_doc: null,
	_focusedCtxtNode: false,
	_haveOneFilteredNode: false,
	_lineClipper: null,

	/**
	  Displays the results to the end user
	  after an address is applied to a document.
	  
	  @param doc hs.model.Document Document to
	  display.
	 */
	write: function(doc){
		hs.profile.start("writing_html");
		
		this._doc = doc;
		var iframe = this._iframe;
		
		// whether we have a content filter on
		this._applyFilter = false;
		this._haveOneFilteredNode = false;
		if(doc.currentViewspecs.getContentFilterType() != 
			hs.filter.ViewspecConstants.NO_FILTERING){
			this._applyFilter = true;	
		}
		
		// the code below was inlined because
		// it was found when they were placed into
		// different private methods that it impacted
		// performance
		
		// get our node rows
		// getElementById does not work on generated DOM document on
		// Internet Explorer, so use selectNodes()
		var hyDoc;
		if(typeof doc.renderedHtmlDom.getElementById == "undefined"){ // Internet Explorer
			hyDoc = doc.renderedHtmlDom.selectNodes("//*[@id='hyperScopeDocument']")[0];
		}else{ // W3C
			hyDoc = doc.renderedHtmlDom.getElementById("hyperScopeDocument");
		}
		this._trNodes = hyDoc.childNodes;
		
		// delete any child nodes on the iframe's body element from
		// past writing sessions
		iframe.body.innerHTML = "";
		
		// add a copy of this container to our rendered document
		// IE doesn't support importNode, so make a fresh container
		// div element and copy our attributes over
		var container;
		if(typeof iframe.importNode == "undefined"){ // Internet Explorer
			var table = iframe.createElement("table");
			table.id = "hyperScopeDocument";
			table.className = hyDoc.getAttribute("class");
			var tbody = iframe.createElement("tbody");
			table.appendChild(tbody);
			iframe.body.appendChild(table);
			container = tbody;
		}else{ // W3C
			container = iframe.importNode(hyDoc, false);
			iframe.body.appendChild(container);
			container = iframe.getElementById("hyperScopeDocument");
		}
		
		this._container = container;
		
		// indicate that we have a new rendered document
		this._renderDoc.displayDocument(doc.nodeCtxt.number);
		
		// we want our node context to jump _right_
		// when it is ready, not waiting for the full
		// page to load; this increases perceived performance
		this._ctxtNodeCounter = doc.nodeCtxt.nodeCounter;
		
		// clear a pre-existing interval
		if(this._currentInterval != null){
			window.clearInterval(this._currentInterval);
			this._curentInterval = null;
		}
		
		// setup our interval callback
		this._currentIndex = 0;
		this._currentInterval = 
			window.setInterval(dojo.lang.hitch(this, this._writeChunk), 
								hs.ui.ResultWriter._INTERVAL);
								
		// immediately write out a chunk
		this._writeChunk();
	},
	
	_writeChunk: function(){
		// have we written everything? if so, clear interval
		if(this._currentIndex >= this._trNodes.length){
			window.clearInterval(this._currentInterval);
			this._currentInterval = null;
			this._currentIndex = 0;
			
			// find out if we at least got to write out one node for
			// a content filter; if not, there was some combination of
			// viewspecs and content filter that has nothing to display; 
			// give a message so that users don't get lost and give them a
			// way to turn the content filter off
			if(this._haveOneFilteredNode == false){
				var messageBlock = this._iframe.createElement("div");
				messageBlock.className = "nothing-to-show-message";
				messageBlock.innerHTML = 
								"The combination of content filter and "
								+ "viewspecs produces nothing to display; "
								+ "<a href=\"#:j\">click here</a> to turn "
								+ "the content filter off and display "
								+ "content again";
				this._iframe.body.appendChild(messageBlock);
			}
			
			// pad the bottom of the document with extra space
			// for small documents and for jumping to nodes at the
			// bottom
			this._padBottomOfDocument();
			
			// jump to our context node a final time
			this._renderDoc.focusContextNode();
			
			// fade the status area, which says "Resolving..."
			hs.ui.fadeStatus();
			
			// indicate that we are done
			this._onFinishedWriting.call(null, this._doc, this._iframe);
		}else{
			// pull out each of our variables as local variables
			// because they are faster in side of loops than using
			// this.* notation
			var chunkAmount = hs.ui.ResultWriter._CHUNK_AMOUNT;
			var trNodes = this._trNodes;
			var currentIndex = this._currentIndex;
			var iframe = this._iframe;
			var container = this._container;
			var rowChunk = new Array();
			var applyFilter = this._applyFilter;
			
			// now blit out each row, until we have either written as many
			// as we are supposed to for this chunk or we are completely
			// out of rows

			// TODO: REFACTOR: See if there is a single, common way
			// to handle the code below cross-browser that is fast on both
			
			// IE doesn't support importNode, so branch here
			if(typeof iframe.importNode != "undefined"){ // w3c
				var fragment = iframe.createDocumentFragment();
				for(var loopCounter = 0; loopCounter < chunkAmount 
											&& currentIndex < trNodes.length; 
												loopCounter++, currentIndex++){
					// make a copy of the row, or the table will
					// only display every other row
					var row = iframe.importNode(trNodes[currentIndex], true);
					
					// don't display this row if it is filtered out
					if(applyFilter == true
							&& row.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":passes-content-filter") != "yes"){
						continue;			
					}
					
					// indicate that at least one node passed
					this._haveOneFilteredNode = true;
					
					// Support XSLT's 'disable-output-escaping' on Mozilla,
					// which doesn't natively support it.
					// ROW > Second TD > Go to first child DIV > Go past A to SPAN
					var dataCell = row.childNodes[1].firstChild.childNodes[1];
					var data = dataCell.innerHTML;
					var hasHTML = false;
					if(data.indexOf("&") != -1){ // we have an XML entity
						// dereference our XML entities
						data = data.replace(/&lt;/g, "<");
						data = data.replace(/&gt;/g, ">");
						data = data.replace(/&amp;/g, "&");
						data = data.replace(/&quot;/g, "\"");
						// doing an innerHTML will now have them be interpreted
						// as HTML
						dataCell.innerHTML = data;
					}
					
					// do we have HTML tags? If so, dynamically
					// calculate our height for line clipping
					if(data.indexOf("<") != -1){
						hasHTML = true;
					}
					
					// apend this new node row
					fragment.appendChild(row);
					
					// add this to our row chunk array
					// so that we can do line clipping on it
					// in bulk
					rowChunk[rowChunk.length] = row;
				}
				
				// save the currentIndex for the next round
				this._currentIndex = currentIndex;
				
				// add the document fragment in one shot
				container.appendChild(fragment);
			}else{ // IE
				// we have to jump through a bunch of hoops to
				// simulate importNode
				var fragment = iframe.createElement("div");
				var html = new String();
				for(var loopCounter = 0; loopCounter < chunkAmount 
											&& currentIndex < trNodes.length; 
												loopCounter++, currentIndex++){
					html += trNodes[currentIndex].xml;
				}
				
				// save the currentIndex for the next round
				this._currentIndex = currentIndex;
				
				// IE won't parse table rows unless they are inside of a 
				// table and a tbody
				fragment.innerHTML = 
						"<table><tbody>" 
						+ html 
						+ "</tbody></table>";
				var tbody = fragment.getElementsByTagName("tbody")[0];
				var rows = tbody.getElementsByTagName("tr");
				for(var i = 0; i < rows.length; i++){
					// clone the DOM node before inserting it
					// or we only get every other row
					var row = rows[i].cloneNode(true);
					
					// see if this row passes an possible content filter
					if(applyFilter == true
							&& row.getAttribute(
									hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
									+ ":passes-content-filter") != "yes"){
						continue;			
					}
					
					// indicate that at least one node passed
					this._haveOneFilteredNode = true;		
					
					container.appendChild(row);
					
					// save this row for later, since we will
					// do line clipping on this chunk of rows
					rowChunk[rowChunk.length] = row;	
				}
			}
			
			// keep trying to jump to our context node
			this._renderDoc.focusContextNode();
			
			// do line clipping on this chunk
			this._lineClipper.applyChunk(this._doc, container, rowChunk);
		}
	},
	
	/**
		For short documents, or for nodes that are near the bottom,
		if we jump to them there is not enough room at the bottom
		of the document to show them; 'pad' the bottom of the document
		area with a height that is equal to the size of the document area.
	 */
	_padBottomOfDocument: function(){
		var iframe = this._iframe;
		
		// get the visible height of the hyperscope document area
		var visibleDocHeight = dojo.style.getOuterHeight(iframe.body);
		
		// create a div with this height at the bottom of the doc
		// (setting the iframe's body tag with a new height does not work
		// on Internet Explorer)
		var paddingDiv = iframe.createElement("div");
		paddingDiv.style.height = visibleDocHeight + "px";
		iframe.body.appendChild(paddingDiv);
	},
	
	_initializeIframe: function(){
		// right now our iframe has no document body;
		// give it one, also clearing out any old
		// document in there.
		// just doing a document.open() then a 
		// document.close() will do this for us
		this._iframe.open();
		this._iframe.close();
		
		// add in our stylesheet
		var head = this._iframe.getElementsByTagName("head")[0];
		var link = this._iframe.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", "/hyperscope/src/client/style/global.css");
		head.appendChild(link);		
	}
});


/**
  Represents a Mark on the screen, after a mouse click;
  helps to encapsulate figuring out what has been marked.
 */

/**
  Constructor.
  param evt : DOMEvent - A mouse click event on the
  rendered document. We will use this to figure out
  what has been marked.
 */
hs.ui.Mark = function(evt){
	this._processEvent(evt);
}

dojo.lang.extend(hs.ui.Mark, {
	/** The DOM Row that was marked. */
	row: null,
	
	/** The relative address that was marked. */
	address: null,
	
	/** Whether this was an invalid mark. */
	invalidMark: false,
	
	_processEvent: function(evt){
		var tg = evt.target;
		
		// keep looping till we get a node row
		while(tg != null && dojo.html.hasClass(tg, "node-row") == false){
			tg = tg.parentNode;
		}
		
		if(tg == null || typeof tg == "undefined"){
			this.invalidMark = true;
			return;
		}
		
		this.row = tg;
		
		var number = this.row.getAttribute(hs.model.Document.HS_INTERNAL_NAMESPACE_PREFIX
											+ ":number");
		var url = "#" + number;
		try{
			this.address = new hs.address.Address(url);
		}catch(exp){
			debug("Invalid value during marking: " + exp);
			this.invalidMark = true;
		}
	}
});


/**
	A class that performs line clipping on a 
	rendered document.
	
	Note: This class was found to be a major bottleneck, and is
	therefore optimized and more complicated; be careful adding code
	to this without profiling, especially on Internet Explorer where it
	was found to be exceptionally slow before optimization.
 */

hs.ui.LineClipper = function(iframeDoc){
	this._iframeDoc = iframeDoc;
	
	// compute our standard line height to short circuit
	// having to do it for every node row; we only do it
	// for rows that have custom HTML inside of them
	this._standardLineHeight = this._computeLineHeight(iframeDoc);
}

dojo.lang.extend(hs.ui.LineClipper, {
	_iframeDoc: null,
	_standardLineHeight: null,
	
	/**
		Regular Expression to make sure we only get nodes 
		that are containers when checking for nested HTML
		when determining line height; i.e. they have a valid innerHTML
		otherwise, we might end up getting an IMG tag,
		for example, and trying to do an innerHTML on that,
		which will stop Internet Explorer cold with an error.
	*/
	_containerRegExp: new RegExp(
						"^h[1-6]|div|span|ul|ol|li|textarea"
						+ "|form|p|pre|blockquote|address|td$",
						"i"),
	
	/**
		@param doc : hs.model.Document - Document to transform.
		@param container : DOM Object - The DOM object for our container that
		has our rendered node rows. 
		@param rowChunk : Array of TR Rows - Our rows to line clip.
	*/
	applyChunk: function(doc, container, rowChunk){
		/**
		 	Optimization Note:
			 		
			This method and class was found to be the bottleneck for 
			performance, so it had to be optimized and therefore is more
			complicated. 
		*/
		
		// get the amount of line clipping to apply
		var lineClipping = doc.currentViewspecs.getLineClipping();
		
		// short circuit if we don't need line clipping
		if(lineClipping == hs.filter.ViewspecConstants.MAX_LINE_CLIPPING){
			return;
		}
		
		// go through each line for line clipping
		var totalLength = rowChunk.length;
		var containerRegExp = this._containerRegExp;
		var standardLineHeight = this._standardLineHeight;
		var iframeDoc = this._iframeDoc;
		// declare nested variables out of loop; faster
		var row, dataCell, dataContainer, firstElement;
		var hasCustomHTML, dataHeight, heightOfOneLine;
		var newHeight, heightClassName, heightEntry;
		var img, currentViews, containerElem;
		for(var i = 0; i < totalLength; i++){
			row = rowChunk[i];
			dataCell = row.childNodes[1]; // second TD tag
			dataContainer = dataCell.firstChild; // first DIV child
			firstElement = dataCell;
			
			// some cells have a spurious <span> element
			// that we put there to deal with Mozilla's 
			// XSLT disable-output-escaping issues
			// (see render.xsl for details); bypass this
			// element when detecting to see if this node
			// has custom HTML
			if(dataContainer.childNodes != null
				&& dataContainer.childNodes[1].nodeName.toLowerCase() == "span"){
				firstElement = dataContainer.childNodes[1];
			}
			
			// see if we have any custom HTML
			hasCustomHTML = false;
			if(firstElement.innerHTML.indexOf("<") != -1){
				hasCustomHTML = true;
			}
			
			// get our total height
			dataHeight = dataCell.scrollHeight;
			
			// if we don't have any HTML, short circuit
			// determining the height and use a predetermined
			// height that we precomputed as the 'standard'
			if(hasCustomHTML == true){	
				// see if our first element of our content is
				// a container, which can influence the height,
				// such as H1
				containerElem = firstElement.firstChild;
				
				if(containerElem != null
					&& containerElem.nodeType == dojo.dom.ELEMENT_NODE
					&& containerRegExp.test(containerElem.nodeName) == true){
					firstElement = containerElem;
				}
				heightOfOneLine = this._computeLineHeight(iframeDoc, 
															firstElement);
			}else{
				heightOfOneLine = standardLineHeight;
			}
			
			// get our new height
			newHeight = heightOfOneLine * lineClipping;
			
			// make sure we don't have less lines than our 
			// line clipping
			if(newHeight > dataHeight){ 
				newHeight = dataHeight;
			}
			
			// set our height
			// FIXME: TODO: this line is the performance bottleneck,
			// but not sure how to work around it; I tried an alternative
			// using classNames (see SVN rev 338), but it made things slower
			// on Firefox and didn't have enough oomp.
			dataContainer.style.height = newHeight + "px";
			
			// see if we have an image as our first element;
			// Firefox doesn't cut the table row down if the
			// first element is an image		
			if(dojo.render.html.mozilla
					&& hasCustomHTML 
					&& firstElement.firstChild 
					&& firstElement.firstChild.nodeName.toLowerCase() == "img"){
				img = firstElement.firstChild;
				// trick that causes vertical height
				// to collapse, since rest of content
				// 'flows' around image now, stealing
				// its extra vertical space
				img.style.cssFloat = "left";
				
				// 'move' the image over a bit in case purple numbers are on;
				// otherwise it will float to the far left below the purple
				// number
				currentViews = hs.ui.currentHyDoc.currentViewspecs;
				if(currentViews.showNodeAddressing() == true
					&& currentViews.getNodeAddressingPlacement() 
							== hs.filter.ViewspecConstants.LEFT){
					img.style.paddingLeft = "2em";
				}
			}
		}
	},
	
	_computeLineHeight: function(iframeDoc, node){
		var heightTester;
		if(node != null && typeof node != "undefined"){
			heightTester = node.cloneNode(false);
		}else{
			heightTester = iframeDoc.createElement("div");
		}
		
		// get rid of anything that messes
		// with the CSS box model
		heightTester.style.margin = "0px";
		heightTester.style.padding = "0px";
		heightTester.style.border = "0px";
		heightTester.style.visibility = "hidden";
		
		// put our test text into the node
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		heightTester.innerHTML = alphabet;
	
		// add it to the document
		iframeDoc.body.appendChild(heightTester);
		
		// get the height of this line
		var heightOfOneLine = heightTester.scrollHeight;
	
		// remove ourselves
		dojo.dom.removeNode(heightTester);
		
		return heightOfOneLine;
	}
});


/**
	A class that implements the behavior for our
	Augment-style command bar.
	
	REFACTOR: The logic in this class is getting
	complicated and hard to follow; refactor for
	simplicity.
 */
hs.ui.CommandBar = function(){
	this._outputArea = dojo.byId("commandBar");
	
	this._loadCommandXML();
}

hs.ui.CommandBar._COMMAND_FILE = "/hyperscope/src/client/lib/hs/commands.xml";

dojo.lang.extend(hs.ui.CommandBar, {
	visible: false,

	// our possible states, from less to more specific
	_states: {
			ROOT: "ROOT",		// we just started and don't have a state yet
			VERB: "VERB",		// we have discovered our verb
			NOUN: "NOUN",		// we have a noun
			INPUT: "INPUT",		// we have an input type
			METHOD: "METHOD",	// we have a method to execute
			UNKNOWN: "UNKNOWN",	// unknown value entered
			DONE: "DONE"		// we are done
	},
	
	_outputArea: null,
	_commands: null,
	_inputBuffer: new Array(),
	_currentState: null,
	_languageElement: null,
	_allowInput: false,
	_inputType: null,
	_mark: null,
	_ready: false,
	
	_address: null,
	_viewspecs: null,
	_typein: null,
	
	_inputText: new String(),
	
	_persistedValue: null,
	_firstPersist: true,
	
	_lastCommandBuffer: null,
	
	reset: function(){
		if(this._ready == false){
			return;
		}
		
		// clear any marks
		hs.ui.markingMode = false;
		for(var i = 0; i < this._inputBuffer.length; i++){
			var commandEvt = this._inputBuffer[i];
			if(commandEvt.mark != null){
				this._setMarkable(false, commandEvt.mark);
			}
		}
		
		// reset state
		this._inputBuffer = new Array();
		this._languageElement = null;
		this._allowInput = false;
		this._inputType = null;
		this._mark = null;
		this._address = null;
		this._viewspecs = null;
		this._typein = null;
		this._inputText = null;
		
		this._sendBufferToOutput();
	},
	
	isShowing: function(){
		return this.visible;
	},
	
	show: function(){
		this.reset();
		
		var commandBar = dojo.byId("commandBar");
		commandBar.style.visibility = "visible";
		
		this.visible = true;
	},
	
	hide: function(){
		var commandBar = dojo.byId("commandBar");
		commandBar.style.visibility = "hidden";
	
		this.visible = false;
	},
	
	_loadCommandXML: function(){
		// load the command XML file,
		// which contains a machine processable set
		// of available commands and their output and input
		// parameters
		var bindArgs = {
			url:		hs.ui.CommandBar._COMMAND_FILE,
			sync:		djConfig.testing,
			mimetype:	"text/xml",
			error:		dojo.lang.hitch(this, this._error),
			load:		dojo.lang.hitch(this, this._loaded)
		};
		
		// dispatch the request
		dojo.io.bind(bindArgs);
	},
	
	_error: function(type, errObj){
		// dojo returns too much programmy information in
		// the error message; remove that part
		var message = errObj.message;
		if(message.indexOf("XMLHttpTransport Error:") != -1){
			message = message.replace(/XMLHttpTransport Error:/, "");
		}
		
		hs.ui.reportError("Unable to initialize command bar: " + message);
	},
	
	_loaded: function(type, data, evt){
		// get the base subsystem commands tree;
		// only base subsystem is supported right now
		var nodes = data.selectNodes("/commands/subsystem[@id = 'base-subsystem']");
		this._commands = nodes.item(0);
		
		// initialize our event listeners
		dojo.event.connect(window, "onkeypress", this, this._onKey); // Firefox
		dojo.event.connect(document, "onkeypress", this, this._onKey); // IE
		
		// on Internet Explorer, backspace key causes the browser 
		// to move back in it's history list; catch just this key
		// using a different event listener
		if(dojo.render.html.ie){
			dojo.event.connect(document, "onkeydown", this, this._handleBackspace);
		}
		
		// subscribe to mark events
		dojo.event.topic.subscribe("/mark", this, "_onMark");
		
		this._ready = true;
		
		// print out that our base subsystem is now ready for input
		this.reset();
	},
	
	_onRenderedDocument: function(iframeDoc){
		// initialize our event listeners
		dojo.event.disconnect(iframeDoc, "onkeypress", this, this._onKey);
		dojo.event.connect(iframeDoc, "onkeypress", this, this._onKey);
		
		// on Internet Explorer, backspace key causes the browser 
		// to move back in it's history list; catch just this key
		// using a different event listener
		if(dojo.render.html.ie){
			dojo.event.disconnect(iframeDoc, "onkeydown", this, this._handleBackspace);
			dojo.event.connect(iframeDoc, "onkeydown", this, this._handleBackspace);
		}
	},
	
	_setOutput: function(msg){
		// clear the output
		var deleteMe = this._outputArea.childNodes;
		for(var i = 0; i < deleteMe.length; i++){
			dojo.dom.removeNode(deleteMe[i]);
		}
		
		// don't use innerHTML in case our data has reserved characters
		// or spacing we want to preserve when setting
		var text = document.createTextNode(msg);
		this._outputArea.appendChild(text);
	},
	
	_sendBufferToOutput: function(){
		try{
			var results = new String();
			
			// work with a copy of our input
			var inputArray = new Array();
			for(var i = 0; i < this._inputBuffer.length; i++){
				inputArray[inputArray.length] = this._inputBuffer[i];
			}
			
			// write out what subsystem we are in
			results += this._commands.getAttribute("output") + " ";
			
			// if we don't have any input indicate that
			// you can enter a command
			if(inputArray.length == 0){
				results += "C: ";
			}
			
			// consume each piece of the input buffer, using it to
			// move inside of our commands.xml DOM as a kind of state
			// machine
		
			// our initial state
			this._currentState = this._states.ROOT;
			
			// now consume the input
			this._languageElement = null;
			this._allowMarking = false;
			this._inputText = new String();
			this._inputType = null;
			this._mark = null;
			this._address = null;
			this._typein = null;
			this._viewspecs = null;
			while(inputArray.length != 0){
				// see if we are done
				if(this._currentState == this._states.DONE){
					break;
				}
				
				// see if we hit an unknown symbol
				if(this._currentState == this._states.UNKNOWN){
					break;
				}
			
				// see if we need to consume a verb or noun language
				// element
				if(this._currentState == this._states.ROOT){			
					// get first verb
					results = this._handleLanguageElement(
												inputArray, 
												results,
												this._commands.childNodes,
												this._states.VERB);
				}else if(this._currentState == this._states.VERB
							|| this._currentState == this._states.NOUN){
					// get noun next
					results = this._handleLanguageElement(
												inputArray, 
												results,
												this._languageElement.childNodes,
												this._states.NOUN);
												
					// see if we are ready for input
					if(typeof this._languageElement != "undefined"
						&& this._languageElement != null
						&& this._needsInput(this._languageElement) == true){
						results = this._selectInput(inputArray, results,
													this._languageElement);
					}
				}else if(this._currentState == this._states.INPUT){
					results = this._consumeInput(inputArray, results);
				}
				
				if(this._currentState == this._states.METHOD){
					// we're ready to execute our method
					this._setOutput(results);
					this._executeMethod();
					return;
				}
			}
			
			this._setOutput(results);
		}catch(exp){
			this._handleError(exp);
		}
	},
	
	_handleLanguageElement: function(inputArray, results, 
										languageElements, nextState){		
		var lettersInState = new String();
		var matchFound = false;
		var partialMatch = false;
		
		// keep looping until we have consumed the input we need
		// for this particular kind of language element
		while(matchFound == false && inputArray.length != 0){
			// clear out a partial match from the last
			// letter, if there was one
			partialMatch = false;
			
			// get our next command event
			var commandEvt = inputArray.shift();
			
			// get the letter that was entered
			// TODO: Fit mouse marking here
			var currentLetter = commandEvt.value;
			currentLetter = currentLetter.toLowerCase();
			
			// add this to the list of letters we have
			// encountered so far while in this state; needed
			// for matching multi-letter activators
			// such as " re" for reset.
			lettersInState += currentLetter;
			
			// find the language element that matches this 
			// sequence of letters
			for(var i = 0; i < languageElements.length; i++){
				var elem = languageElements[i];
				if(elem.nodeType != dojo.dom.ELEMENT_NODE){
					continue;
				}
				
				// get the activator for this language element
				var activator = elem.getAttribute("activate");
				// is this our activator?
				if(lettersInState == activator){
					this._languageElement = elem;
					matchFound = true;
					break;
				}else if(dojo.string.startsWith(activator, lettersInState, true)){
					partialMatch = true;
					break;
				} 
			} // end for statement
			
			// clear symbol from buffer and stop if no match
			if(partialMatch == false && matchFound == false){
				// if we never had _any_ language elements, 
				// such as a verb, indicate that a command 
				// is possible again
				if(this._languageElement == null){
					results += "C: ";
				}
				
				results += "?";
				this._inputBuffer = this._inputBuffer.slice(0, 
										this._inputBuffer.length - 1);
				this._currentState = this._states.UNKNOWN;
				return results;
			}
		} // end while statement
		
		// see if the last letter was just a 
		// partial match
		if(partialMatch == true && matchFound == false){
			lettersInState = lettersInState.toUpperCase();
			results += lettersInState;
			return results;
		}
		
		// we have a match
		
		// write out this language's output and 
		// move to the next state
		var languageOutput = this._languageElement.getAttribute("output");
		results += languageOutput;
		this._currentState = nextState;
		
		// see if there is a further noun past us
		// and we are at the end of our input
		if(this._nestedNoun(this._languageElement) == true
			&& inputArray.length == 0){
			results += "C: ";	
		}
		
		return results;
	},
	
	_needsInput: function(languageElement){
		if(languageElement == null
			|| typeof languageElement == "undefined"
			|| languageElement.childNodes == null
			|| typeof languageElement.childNodes == "undefined" 
			|| languageElement.childNodes.length == 0){
			return false;
		}
		
		var firstChild = languageElement.firstChild;
		while(firstChild != null
				&& firstChild.nodeType != dojo.dom.ELEMENT_NODE){
			firstChild = firstChild.nextSibling;			
		}
		
		if(firstChild == null){
			return false;
		}
		
		if(firstChild.nodeName == "input"){
			return true;
		}else{
			return false;
		}
	},
	
	_selectInput: function(inputArray, results, languageElement, 
							inputElemProvided){
		// callers can optionally already pass the input element into this
		// method; needed when creating synthetic inputs, such as forcing an 
		// OK after a MARK if it is the last input method
		if(typeof inputElemProvided == "undefined"){
			inputElemProvided = false;
		}
		
		// get the input element
		var inputElem;
		if(inputElemProvided == false){
			inputElem = languageElement.firstChild;
			while(inputElem != null
					&& inputElem.nodeType != dojo.dom.ELEMENT_NODE
					&& inputElem.nodeName != "input"){
				inputElem = inputElem.nextSibling;			
			}
		}else{ // we provide the input element already
			inputElem = languageElement;
		}
		
		var inputType = inputElem.getAttribute("type");
		this._currentState = this._states.INPUT;
		this._inputText = new String();
		if(inputType == "location"){
			results += "M/A: ";
			hs.ui.markingMode = true;
			
			// clear any selected lines
			hs.ui.currentRenderedDoc.clearSelection();
		}else if(inputType == "viewspecs"){
			results += "V: ";
			hs.ui.markingMode = false;
		}else if(inputType == "content"){
			results += "M/T/[A]: ";
			hs.ui.markingMode = true;
		}else if(inputType == "ok"){
			results += "OK: ";
			hs.ui.markingMode = false;
		}else if(inputType == "typein"){
			results += "T: ";
			hs.ui.markingMode = false;
		}else if(inputType == "persisted typein"){
			if(this._persistedValue != null
				&& this._firstPersist == false){
				results += '"' + this._persistedValue + '" RC/T: ';
			}else{
				results += "T: ";
			}
			hs.ui.markingMode = false;
		}else if(inputType == "address"){
			results += "A: ";
			hs.ui.markingMode = false;
		}
		
		this._languageElement = inputElem;
		this._inputType = inputType;
		
		return results;
	},
	
	_consumeInput: function(inputArray, results){
		if(this._currentState == this._states.DONE){
			return;
		}
		
		// get next piece of input to consume
		var commandEvt = inputArray.shift();
		
		var doneWithInput = false;
		var justDidMark = false;
		
		// is it a mark?
		if(commandEvt.mark != null){
			results +=" ! ";
			
			// save this
			this._mark = commandEvt.mark;
			
			// interpret any input values entered
			this._interpretInput();
			
			// we are done with this input type
			doneWithInput = true;
			
			// indicate that we just did a mark;
			// if there are no more import types then
			// we need to force an OK
			justDidMark = true;
		}else if(this._persistedValue != null
				&& commandEvt.isEnter == true
				&& this._inputType == "persisted typein"
				&& this._inputText.length == 0){
			// we have a persisted value, we are the
			// end key, we support persisted values,
			// and the user hasn't entered anything
			// for this typein
			this._inputText = this._persistedValue;
			
			// we are done with this input type
			results += " ! ";
			
			// interpret any input values entered
			this._interpretInput();
			
			// move to next stage
			doneWithInput = true;	
		}else if(commandEvt.isEnter == true){
			// we are done with this input type
			results += " ! ";
			
			// interpret any input values entered
			this._interpretInput();
			
			// move to next stage
			doneWithInput = true;
		}else if(this._persistedValue != null
				&& commandEvt.isRepeatKey == true
				&& this._inputType == "persisted typein"){
			// we have a persisted value, the repeat key
			// was pressed, and we support the repeat key
			this._inputText = this._persistedValue;
			
			// we are done with this input type
			results += " ! ";
			
			// interpret any input values entered
			this._interpretInput();
			
			// move to next stage
			doneWithInput = true;
		}else{
			var currentLetter = commandEvt.value;
			results += currentLetter;
			
			// save this text so we can use it when 
			// the user presses OK
			this._inputText += currentLetter;
		}
		
		
		// are we done with this input type?
		if(doneWithInput == true 
				&& this._currentState != this._states.DONE){
			// Move on to the next input type 
			// or handle a final method element. If we just did
			// a mark, force a final OK if this is the last input
			// element for this command type
			if(justDidMark == true
					&& this._needsInput(this._languageElement) == false
					&& this._atMethod(this._languageElement) == true){
				// force us into the OK input state
				var okInput = this._languageElement.cloneNode(true);
				okInput.setAttribute("type", "ok");
				this._languageElement = okInput;
				this._currentState = this._states.INPUT;
				results = this._selectInput(inputArray, results,
											this._languageElement, 
											true);	
			}
			else if(this._needsInput(this._languageElement) == true){
				results = this._selectInput(inputArray, results,
											this._languageElement);
			}else if(this._atMethod(this._languageElement) == true){
				this._languageElement = this._getMethod(this._languageElement);
				this._currentState = this._states.METHOD;
			}
		}
		
		return results;
	},
	
	_getMethod: function(languageElement){
		// get the method element
		var methodElem = languageElement.firstChild;
		while(methodElem != null
				&& methodElem.nodeType != dojo.dom.ELEMENT_NODE
				&& methodElem.nodeName != "method"){
			methodElem = methodElem.nextSibling;			
		}
		
		return methodElem;
	},
	
	_atMethod: function(languageElement){
		if(languageElement == null
			|| typeof languageElement == "undefined"
			|| languageElement.childNodes == null
			|| typeof languageElement.childNodes == "undefined" 
			|| languageElement.childNodes.length == 0){
			return false;
		}
		
		var firstChild = languageElement.firstChild;
		while(firstChild != null
				&& firstChild.nodeType != dojo.dom.ELEMENT_NODE){
			firstChild = firstChild.nextSibling;			
		}
		
		if(firstChild == null){
			return false;
		}
		
		if(firstChild.nodeName == "method"){
			return true;
		}else{
			return false;
		}
	},
	
	_executeMethod: function(){
		try{
			this._currentState = this._states.DONE;
			var exec = this._languageElement.getAttribute("eval");
			
			// if we have persisted data, indicate that we can now
			// display it since we are past our first use of it
			if(this._persistedValue != null){
				this._firstPersist = false;
			}
					
			// save this input buffer for the repeat key
			this._lastCommandBuffer = this._inputBuffer;
			// shave off the last command on here, so that users can edit
			// it after doing a repeat key
			this._lastCommandBuffer.pop();
			
			hs.ui.printStatus("Resolving...");
			
			// setup variables that commands.xml might refer to in their
			// eval string; these must be global or Dojo's compressor
			// will obfuscate their variable names, and our evalled() script
			// won't be able to access them
			window.readyHandler = hs.ui.addressResolved;
			window.address = this._address;
			window.relativeTo = hs.ui.currentHyDoc;
			window.typein = this._typein;
			window.viewspecs = this._viewspecs;
			
			// now execute this method
			eval(exec);
		}catch(exp){
			this._handleError(exp);
		}
	},
	
	_handleError: function(exp){
		this.reset();
		hs.ui.reportError(exp);
	},
	
	_interpretInput: function(inputArray){
		if(this._inputType == "viewspecs"){ // this is a viewspec
			this._viewspecs = this._inputText;
		}else if(this._inputType == "location"
					&& this._mark != null){ // marked address
			this._address = this._mark.address;
		}else if(this._inputType == "location"
					&& this.mark == null){ // typed in address
			var addr = this._toAddress(this._inputText);
			this._address = addr;				
		}else if(this._inputType == "content"
					&& this.mark == null){ // typed in address, without option key
			var addr = new hs.address.Address(this._inputText);
			this._address = addr;			
		}else if(this._inputType == "typein"){ // arbitrary content
			this._typein = this._inputText;
		}else if(this._inputType == "persisted typein"){ 
			// typein is persisted for future types that support this,
			// to help with a quick repeat key, such as for Jump to Word
			this._persistedValue = this._inputText;
			this._typein = this._inputText;
		}else if(this._inputType == "address"){ // typed in address
			var addr = this._toAddress(this._inputText);
			this._address = addr;
		}
	},
	
	_nestedNoun: function(languageElement){
		if(languageElement == null
			|| typeof languageElement == "undefined"
			|| languageElement.childNodes == null
			|| typeof languageElement.childNodes == "undefined" 
			|| languageElement.childNodes.length == 0){
			return false;
		}
		
		var firstChild = languageElement.firstChild;
		while(firstChild != null
				&& firstChild.nodeType != dojo.dom.ELEMENT_NODE){
			firstChild = firstChild.nextSibling;			
		}
		
		if(firstChild == null){
			return false;
		}
		
		if(firstChild.nodeName == "noun"){
			return true;
		}else{
			return false;
		}
	},
	
	_toAddress: function(url){
		// REFACTOR: This logic is also used by the JumpOverlay;
		// consolidate it
		
		/**
			Four input modes are allowed:
				* Input is preceded with a hash
				* Input has a scheme://
				* Input has ../ or ./ at the beginning -
				interpreted as a relative file address
				* Input has neither of these, and
				is interpreted as having a #
		*/
		if(dojo.string.startsWith(url, "#") == false
			&& dojo.string.startsWith(url, "./") == false
			&& dojo.string.startsWith(url, "../") == false
			&& /^[^:]*:\//.test(url) == false){
			url = "#" + url;		
		}
		
		var addr = new hs.address.Address(url);
		
		return addr;
	},
	
	_onKey: function(evt){
		if(this.isShowing() == false){
			return;
		}
	
		var commandEvt = new Object();
		commandEvt.mark = null;
		commandEvt.isRepeatKey = false;

		if(evt.keyCode == 13){ // ENTER key
			commandEvt.isEnter = true;	
			commandEvt.value = null;
			this._inputBuffer[this._inputBuffer.length] = commandEvt;
		}else if(evt.keyCode == 27){ // ESCAPE key
			this.reset();
			return;
		}else if(evt.keyCode == 8){ // backspace key
			var lastCommandEvt = this._inputBuffer[this._inputBuffer.length - 1];
			// clear a mark if we "backspace" over it
			if(lastCommandEvt != null
				&& typeof lastCommandEvt != "undefined"
				&& lastCommandEvt.mark != null){
				this._setMarkable(false, lastCommandEvt.mark);
			}
			if(this._inputBuffer.length != 0){
				this._inputBuffer = this._inputBuffer.slice(0,
												this._inputBuffer.length - 1);
			}
		}else if(evt.ctrlKey == true 
					&& (String.fromCharCode(evt.charCode) == "u"
						|| evt.charCode == 21)){
			// ctrl-U, which is the OPTION key
			// the 21 is for IE
			// TODO: Implement OPTION key
			//alert("ctrl u pressed");				
		}else if(evt.ctrlKey == true 
					&& (String.fromCharCode(evt.charCode) == "b"
						|| evt.charCode == 2)){
			// ctrl-B, which is the REPEAT key
			// the 2 is for IE
			// only letter entered?
			if(this._inputBuffer.length != 0){
				commandEvt.isRepeatKey = true;
				commandEvt.value = "";
				this._inputBuffer[this._inputBuffer.length] = commandEvt;
			}else if(this._lastCommandBuffer != null){ // repeat the last command
				this._inputBuffer = this._lastCommandBuffer;
			}
		}else if(evt.ctrlKey || evt.altKey){
			// let other control and alt combos through
			return;
		}else{ // other letters and numbers
			commandEvt.isEnter = false;
			commandEvt.value = String.fromCharCode(evt.charCode);
			this._inputBuffer[this._inputBuffer.length] = commandEvt;
		}
		
		evt.stopPropagation();
		evt.preventDefault(true);
		
		this._sendBufferToOutput();
	},
	
	_handleBackspace: function(evt){
		if(evt.keyCode == 8){ // backspace key
			this._onKey(evt);
		}
	},
	
		
	_setMarkable: function(markable, mark){
		if(hs.ui.markingMode == true){
			if(mark != null){	
				dojo.html.addClass(mark.row, "marked");
			}
		}else{
			if(mark != null){
				dojo.html.removeClass(mark.row, "marked");
			}
		}
	},
	
	_onMark: function(mark){
		if(this.isShowing() == false){
			return;
		}
		
		// give the focus back to the command bar or
		// else letters won't be intercepted on Firefox after
		// we have rendered a document more than once
		var commandBar = dojo.byId("commandBar");
		document.body.focus();
		
		// don't do marking if we don't
		// allow it yet
		if(hs.ui.markingMode == false){
			return;
		}
		
		// clear out any mark that may have been there before
		var oldMark = null;
		for(var i = 0; i < this._inputBuffer.length; i++){
			var commandEvt = this._inputBuffer[i];
			if(commandEvt.mark != null 
				&& typeof commandEvt.mark != "undefined"){
				oldMark = commandEvt.mark;
			}	
		}
		
		this._setMarkable(false, oldMark); 
		
		// store this as part of our input
		var commandEvt = new Object();
		commandEvt.mark = mark;
		commandEvt.isEnter = false;
		commandEvt.value = null;
		this._inputBuffer[this._inputBuffer.length] = commandEvt;
		
		// highlight our marked row
		this._setMarkable(true, mark);
		
		// reparse our input buffer
		this._sendBufferToOutput();
	}
});


/**
  Our help overlay window that appears when the user presses the Help button.
  
  TODO: REFACTOR: Make a single base-widget class for this and our other
  overlays.
 */
dojo.widget.defineWidget("hs.ui.HelpOverlay", dojo.widget.HtmlWidget, {
	widgetType: "HelpOverlay",
  	isContainer: true,
	templatePath: dojo.uri.dojoUri("../hs/templates/HelpOverlay.html"),
  	templateCssPath: dojo.uri.dojoUri("../hs/templates/HelpOverlay.css"),

	postCreate: function(){
		this.width = dojo.style.getOuterWidth(this.domNode);
		this.height = dojo.style.getOuterHeight(this.domNode);
	},
	
	isShowing: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		if(dojo.html.hasClass(floatingPane.domNode, "initial-overlay-state")){
			return false;
		}else{
			return floatingPane.isShowing();
		}
	},
	
	show: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// bring to the top, in case other overlays are visible
		floatingPane.bringToTop();
		
		// override the floating pane's default close window behavior
		floatingPane.closeWindow = this._closeWindow;
		
		// see src/client/lib/hs/templates/JumpOverlay.css for
		// description of how class 'initial-overlay-state' is used
		dojo.html.removeClass(floatingPane.domNode, "initial-overlay-state");
		
		// determine the width of our jump overlay
		
		// start at the Help button
		var helpButton = dojo.byId("toolbarHelpButton");
		var helpButtonWidth = dojo.html.getOuterWidth(helpButton);
		var pageWidth = dojo.html.getViewportWidth();
		var startY = dojo.style.getAbsoluteY(helpButton, false) + helpButtonWidth/2;
		
		// end right below the toolbar
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var endY = toolbarHeight + 30;
		
		// make the node visible, but turn off it's opacity
		if(dojo.render.html.ie != true){
			dojo.style.setOpacity(floatingPane.domNode, 0);
		}
		dojo.style.show(floatingPane.domNode);
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 0, end: 1 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "left", start: 20, end: 20 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
		
		anim.play();
	},
	
	hide: function(){
		var floatingPane = dojo.widget.byId(this.widgetId + "Pane");
		
		// start below the toolbar and to the left of the page
		var pageWidth = dojo.html.getViewportWidth();
		var toolbarHeight = dojo.html.getOuterHeight(dojo.byId("toolbar"));
		var startY = toolbarHeight + 30;
		
		// end at the help button
		var helpButton = dojo.byId("toolbarHelpButton");
		var helpButtonWidth = dojo.html.getOuterWidth(helpButton);
		var endY = dojo.style.getAbsoluteY(helpButton, false) + helpButtonWidth/2;
		
		// don't do fading on IE, since it doesn't deal with opacity well
		// in terms of our shadow since the shadow is a PNG file
		var animProperties = new Array();
		if(dojo.render.html.ie != true){
			animProperties.push({ property: "opacity", start: 1, end: 0 });	
		}
		
		// add our sliding animation
		animProperties.push({ property: "right", start: 20, end: 20 });
		animProperties.push({ property: "top", start: startY, end: endY }); 
		
		// now chain all these together, so the animation property
		// changes happen at the same time
		var anim =
			dojo.lfx.propertyAnimation(floatingPane.domNode, animProperties, 250);
			
		dojo.event.connect(anim, "onEnd", function(){	
			dojo.style.hide(floatingPane.domNode);
		});
		
		anim.play();
	},
	
	_closeWindow: function(evt){
		this.hide();
	}
});


// wait for the HyperScope core to finish loading and doing its thing
// before initializing the UI; don't do this if
// we are in a testing environment like JSUnit since we have no UI
if(djConfig.testing == false){
	hs.model.addOnLoad(hs.ui.initialize);
}

