/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.event.browser");
dojo.require("dojo.event");

dojo_ie_clobber = new function(){
	this.clobberArr = ['data', 
		'onload', 'onmousedown', 'onmouseup', 
		'onmouseover', 'onmouseout', 'onmousemove', 
		'onclick', 'ondblclick', 'onfocus', 
		'onblur', 'onkeypress', 'onkeydown', 
		'onkeyup', 'onsubmit', 'onreset',
		'onselect', 'onchange', 'onselectstart', 
		'ondragstart', 'oncontextmenu'];

	this.exclusions = [];
	
	this.clobberList = {};
	this.clobberNodes = [];

	this.addClobberAttr = function(type){
		if(dojo.render.html.ie){
			if(this.clobberList[type]!="set"){
				this.clobberArr.push(type);
				this.clobberList[type] = "set"; 
			}
		}
	}

	this.addExclusionID = function(id){
		this.exclusions.push(id);
	}

	if(dojo.render.html.ie){
		for(var x=0; x<this.clobberArr.length; x++){
			this.clobberList[this.clobberArr[x]] = "set";
		}
	}

	function nukeProp(node, prop){
		// try{ node.removeAttribute(prop); 	}catch(e){ /* squelch */ }
		try{ node[prop] = null; 			}catch(e){ /* squelch */ }
		try{ delete node[prop]; 			}catch(e){ /* squelch */ }
		// FIXME: JotLive needs this, but I'm not sure if it's too slow or not
		try{ node.removeAttribute(prop);	}catch(e){ /* squelch */ }
	}

	this.clobber = function(nodeRef){
		for(var x=0; x< this.exclusions.length; x++){
			try{
				var tn = document.getElementById(this.exclusions[x]);
				tn.parentNode.removeChild(tn);
			}catch(e){
				// this is fired on unload, so squelch
			}
		}

		var na;
		var tna;
		if(nodeRef){
			tna = nodeRef.getElementsByTagName("*");
			na = [nodeRef];
			for(var x=0; x<tna.length; x++){
				if(!djConfig.ieClobberMinimal){
					na.push(tna[x]);
				}else{
					// if we're gonna be clobbering the thing, at least make sure
					// we aren't trying to do it twice
					if(tna[x]["__doClobber__"]){
						na.push(tna[x]);
					}
				}
			}
		}else{
			try{ window.onload = null; }catch(e){}
			na = (this.clobberNodes.length) ? this.clobberNodes : document.all;
		}
		tna = null;
		var basis = {};
		for(var i = na.length-1; i>=0; i=i-1){
			var el = na[i];
			if(djConfig.ieClobberMinimal){
				if(el["__clobberAttrs__"]){
					for(var j=0; j<el.__clobberAttrs__.length; j++){
						nukeProp(el, el.__clobberAttrs__[j]);
					}
					nukeProp(el, "__clobberAttrs__");
					nukeProp(el, "__doClobber__");
				}
			}else{
				for(var p = this.clobberArr.length-1; p>=0; p=p-1){
					var ta = this.clobberArr[p];
					nukeProp(el, ta);
				}
			}
		}
		na = null;
	}
}

if((dojo.render.html.ie)&&((!dojo.hostenv.ie_prevent_clobber_)||(djConfig.ieClobberMinimal))){
	window.onunload = function(){
		dojo_ie_clobber.clobber();
		try{
			if((dojo["widget"])&&(dojo.widget["manager"])){
				dojo.widget.manager.destroyAll();
			}
		}catch(e){}
		try{ window.onload = null; }catch(e){}
		try{ window.onunload = null; }catch(e){}
		dojo_ie_clobber.clobberNodes = [];
		// CollectGarbage();
	}
}

dojo.event.browser = new function(){

	var clobberIdx = 0;

	this.clean = function(node){
		if(dojo.render.html.ie){ 
			dojo_ie_clobber.clobber(node);
		}
	}

	this.addClobberAttr = function(type){
		dojo_ie_clobber.addClobberAttr(type);
	}

	this.addClobberAttrs = function(){
		for(var x=0; x<arguments.length; x++){
			this.addClobberAttr(arguments[x]);
		}
	}

	this.addClobberNode = function(node){
		if(djConfig.ieClobberMinimal){
			if(!node["__doClobber__"]){
				node.__doClobber__ = true;
				dojo_ie_clobber.clobberNodes.push(node);
				// this might not be the most efficient thing to do, but it's
				// much less error prone than other approaches which were
				// previously tried and failed
				node.__clobberAttrs__ = [];
			}
		}
	}

	this.addClobberNodeAttrs = function(node, props){
		this.addClobberNode(node);
		if(djConfig.ieClobberMinimal){
			for(var x=0; x<props.length; x++){
				node.__clobberAttrs__.push(props[x]);
			}
		}else{
			this.addClobberAttrs.apply(this, props);
		}
	}

	/*
	this.eventAroundAdvice = function(methodInvocation){
		var evt = this.fixEvent(methodInvocation.args[0]);
		return methodInvocation.proceed();
	}
	*/

	this.removeListener = function(node, evtName, fp, capture){
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)=="on"){ evtName = evtName.substr(2); }
		// FIXME: this is mostly a punt, we aren't actually doing anything on IE
		if(node.removeEventListener){
			node.removeEventListener(evtName, fp, capture);
		}
	}

	this.addListener = function(node, evtName, fp, capture, dontFix){
		if(!node){ return; } // FIXME: log and/or bail?
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)!="on"){ evtName = "on"+evtName; }

		if(!dontFix){
			// build yet another closure around fp in order to inject fixEvent
			// around the resulting event
			var newfp = function(evt){
				if(!evt){ evt = window.event; }
				var ret = fp(dojo.event.browser.fixEvent(evt));
				if(capture){
					dojo.event.browser.stopEvent(evt);
				}
				return ret;
			}
		}else{
			newfp = fp;
		}

		if(node.addEventListener){ 
			node.addEventListener(evtName.substr(2), newfp, capture);
			return newfp;
		}else{
			if(typeof node[evtName] == "function" ){
				var oldEvt = node[evtName];
				node[evtName] = function(e){
					oldEvt(e);
					return newfp(e);
				}
			}else{
				node[evtName]=newfp;
			}
			if(dojo.render.html.ie){
				this.addClobberNodeAttrs(node, [evtName]);
			}
			return newfp;
		}
	}

	this.isEvent = function(obj){
		// FIXME: event detection hack ... could test for additional attributes if necessary
		return (typeof Event != "undefined")&&(obj.eventPhase);
		// Event does not support instanceof in Opera, otherwise:
		//return (typeof Event != "undefined")&&(obj instanceof Event);
	}

	this.currentEvent = null;
	
	this.callListener = function(listener, curTarget){
		if(typeof listener != 'function'){
			dojo.raise("listener not a function: " + listener);
		}
		dojo.event.browser.currentEvent.currentTarget = curTarget;
		return listener.call(curTarget, dojo.event.browser.currentEvent);
	}

	this.stopPropagation = function(){
		dojo.event.browser.currentEvent.cancelBubble = true;
	}

	this.preventDefault = function(){
	  dojo.event.browser.currentEvent.returnValue = false;
	}

	this.keys = {
		KEY_BACKSPACE: 8,
		KEY_TAB: 9,
		KEY_ENTER: 13,
		KEY_SHIFT: 16,
		KEY_CTRL: 17,
		KEY_ALT: 18,
		KEY_PAUSE: 19,
		KEY_CAPS_LOCK: 20,
		KEY_ESCAPE: 27,
		KEY_SPACE: 32,
		KEY_PAGE_UP: 33,
		KEY_PAGE_DOWN: 34,
		KEY_END: 35,
		KEY_HOME: 36,
		KEY_LEFT_ARROW: 37,
		KEY_UP_ARROW: 38,
		KEY_RIGHT_ARROW: 39,
		KEY_DOWN_ARROW: 40,
		KEY_INSERT: 45,
		KEY_DELETE: 46,
		KEY_LEFT_WINDOW: 91,
		KEY_RIGHT_WINDOW: 92,
		KEY_SELECT: 93,
		KEY_F1: 112,
		KEY_F2: 113,
		KEY_F3: 114,
		KEY_F4: 115,
		KEY_F5: 116,
		KEY_F6: 117,
		KEY_F7: 118,
		KEY_F8: 119,
		KEY_F9: 120,
		KEY_F10: 121,
		KEY_F11: 122,
		KEY_F12: 123,
		KEY_NUM_LOCK: 144,
		KEY_SCROLL_LOCK: 145
	};

	// reverse lookup
	this.revKeys = [];
	for(var key in this.keys){
		this.revKeys[this.keys[key]] = key;
	}

	this.fixEvent = function(evt){
		if((!evt)&&(window["event"])){
			var evt = window.event;
		}
		
		if((evt["type"])&&(evt["type"].indexOf("key") == 0)){ // key events
			evt.keys = this.revKeys;
			// FIXME: how can we eliminate this iteration?
			for(var key in this.keys) {
				evt[key] = this.keys[key];
			}
			if((dojo.render.html.ie)&&(evt["type"] == "keypress")){
				evt.charCode = evt.keyCode;
			}
		}
	
		if(dojo.render.html.ie){
			if(!evt.target){ evt.target = evt.srcElement; }
			if(!evt.currentTarget){ evt.currentTarget = evt.srcElement; }
			if(!evt.layerX){ evt.layerX = evt.offsetX; }
			if(!evt.layerY){ evt.layerY = evt.offsetY; }
			// mouseover
			if(evt.fromElement){ evt.relatedTarget = evt.fromElement; }
			// mouseout
			if(evt.toElement){ evt.relatedTarget = evt.toElement; }
			this.currentEvent = evt;
			evt.callListener = this.callListener;
			evt.stopPropagation = this.stopPropagation;
			evt.preventDefault = this.preventDefault;
		}
		return evt;
	}

	this.stopEvent = function(ev) {
		if(window.event){
			ev.returnValue = false;
			ev.cancelBubble = true;
		}else{
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}
