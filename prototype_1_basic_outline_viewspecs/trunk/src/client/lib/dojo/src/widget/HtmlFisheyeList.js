/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.FisheyeList");
dojo.provide("dojo.widget.HtmlFisheyeList");
dojo.provide("dojo.widget.HtmlFisheyeListItem");

//
// TODO
// fix SVG support, and turn it on only if the browser supports it
// fix really long labels in vertical mode
//

dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.HtmlContainer");
dojo.require("dojo.dom");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.event");

dojo.widget.HtmlFisheyeList = function(){
	dojo.widget.HtmlContainer.call(this);
}
dojo.inherits(dojo.widget.HtmlFisheyeList, dojo.widget.HtmlContainer);

dojo.lang.extend(dojo.widget.HtmlFisheyeList, {

	templateString: '<div class="dojoHtmlFisheyeListBar"></div>',
	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlFisheyeList.css"),
	widgetType: "FisheyeList",

	EDGE: {
		CENTER: 0,
		LEFT: 1,
		RIGHT: 2,
		TOP: 3,
		BOTTOM: 4
	},

	snarfChildDomOutput: true,

	/////////////////////////////////////////////////////////////////
	//
	// i spy OPTIONS!!!!
	//

	itemWidth: 40,
	itemHeight: 40,

	itemMaxWidth: 150,
	itemMaxHeight: 150,

	orientation: 'horizontal',

	effectUnits: 2,
	itemPadding: 10,

	attachEdge: 'center',
	labelEdge: 'bottom',

	enableCrappySvgSupport: false,

	//
	//
	//
	/////////////////////////////////////////////////////////////////

	fillInTemplate: function(args, frag) {
		//dojo.debug(this.orientation);

		dojo.html.disableSelection(this.domNode);

		this.isHorizontal = (this.orientation == 'horizontal') ? 1 : 0;
		this.selectedNode = -1;

		this.isOver = false;
		this.hitX1 = -1;
		this.hitY1 = -1;
		this.hitX2 = -1;
		this.hitY2 = -1;

		//
		// only some edges make sense...
		//

		this.anchorEdge = this.toEdge(this.attachEdge, this.EDGE.CENTER);
		this.labelEdge  = this.toEdge(this.labelEdge,  this.EDGE.TOP);

		if ( this.isHorizontal && (this.anchorEdge == this.EDGE.LEFT  )){ this.anchorEdge = this.EDGE.CENTER; }
		if ( this.isHorizontal && (this.anchorEdge == this.EDGE.RIGHT )){ this.anchorEdge = this.EDGE.CENTER; }
		if (!this.isHorizontal && (this.anchorEdge == this.EDGE.TOP   )){ this.anchorEdge = this.EDGE.CENTER; }
		if (!this.isHorizontal && (this.anchorEdge == this.EDGE.BOTTOM)){ this.anchorEdge = this.EDGE.CENTER; }

		if (this.labelEdge == this.EDGE.CENTER){ this.labelEdge = this.EDGE.TOP; }
		if ( this.isHorizontal && (this.labelEdge == this.EDGE.LEFT  )){ this.labelEdge = this.EDGE.TOP; }
		if ( this.isHorizontal && (this.labelEdge == this.EDGE.RIGHT )){ this.labelEdge = this.EDGE.TOP; }
		if (!this.isHorizontal && (this.labelEdge == this.EDGE.TOP   )){ this.labelEdge = this.EDGE.LEFT; }
		if (!this.isHorizontal && (this.labelEdge == this.EDGE.BOTTOM)){ this.labelEdge = this.EDGE.LEFT; }


		//
		// figure out the proximity size
		//

		this.proximityLeft   = this.itemWidth  * (this.effectUnits - 0.5);
		this.proximityRight  = this.itemWidth  * (this.effectUnits - 0.5);
		this.proximityTop    = this.itemHeight * (this.effectUnits - 0.5);
		this.proximityBottom = this.itemHeight * (this.effectUnits - 0.5);

		if (this.anchorEdge == this.EDGE.LEFT){
			this.proximityLeft = 0;
		}
		if (this.anchorEdge == this.EDGE.RIGHT){
			this.proximityRight = 0;
		}
		if (this.anchorEdge == this.EDGE.TOP){
			this.proximityTop = 0;
		}
		if (this.anchorEdge == this.EDGE.BOTTOM){
			this.proximityBottom = 0;
		}
		if (this.anchorEdge == this.EDGE.CENTER){
			this.proximityLeft   /= 2;
			this.proximityRight  /= 2;
			this.proximityTop    /= 2;
			this.proximityBottom /= 2;
		}
	},
	
	postCreate: function(args, frag) {

		this.itemCount = this.children.length;

		this.barWidth  = (this.isHorizontal ? this.itemCount : 1) * this.itemWidth;
		this.barHeight = (this.isHorizontal ? 1 : this.itemCount) * this.itemHeight;

		this.totalWidth  = this.proximityLeft + this.proximityRight  + this.barWidth;
		this.totalHeight = this.proximityTop  + this.proximityBottom + this.barHeight;

		//
		// calculate effect ranges for each item
		//

		for (var i=0; i<this.children.length; i++){

			this.children[i].posX = this.itemWidth  * (this.isHorizontal ? i : 0);
			this.children[i].posY = this.itemHeight * (this.isHorizontal ? 0 : i);

			this.children[i].cenX = this.children[i].posX + (this.itemWidth  / 2);
			this.children[i].cenY = this.children[i].posY + (this.itemHeight / 2);

			var isz = this.isHorizontal ? this.itemWidth : this.itemHeight;
			var r = this.effectUnits * isz;
			var c = this.isHorizontal ? this.children[i].cenX : this.children[i].cenY;
			var lhs = this.isHorizontal ? this.proximityLeft : this.proximityTop;
			var rhs = this.isHorizontal ? this.proximityRight : this.proximityBottom;
			var siz = this.isHorizontal ? this.barWidth : this.barHeight;

			var range_lhs = r;
			var range_rhs = r;

			if (range_lhs > c+lhs){ range_lhs = c+lhs; }
			if (range_rhs > (siz-c+rhs)){ range_rhs = siz-c+rhs; }

			this.children[i].effectRangeLeft = range_lhs / isz;
			this.children[i].effectRangeRght = range_rhs / isz;

			//dojo.debug('effect range for '+i+' is '+range_lhs+'/'+range_rhs);
		}


		//
		// create the bar
		//

		this.domNode.style.width = this.barWidth + 'px';
		this.domNode.style.height = this.barHeight + 'px';


		//
		// position the items
		//
		for (var i=0; i<this.children.length; i++){
			var itm = this.children[i];
			var elm = itm.domNode;
			elm.style.left   = itm.posX + 'px';
			elm.style.top    = itm.posY + 'px';
			elm.style.width  = this.itemWidth + 'px';
			elm.style.height = this.itemHeight + 'px';
			
			if ( itm.svgNode ) {
				itm.svgNode.style.position = 'absolute';
				itm.svgNode.style.left = this.itemPadding+'%';
				itm.svgNode.style.top = this.itemPadding+'%';
				itm.svgNode.style.width = (100 - 2 * this.itemPadding) + '%';
				itm.svgNode.style.height = (100 - 2 * this.itemPadding) + '%';
				itm.svgNode.style.zIndex = 1;
	
				itm.svgNode.setSize(this.itemWidth, this.itemHeight);
			} else {
				itm.imgNode.style.left = this.itemPadding+'%';
				itm.imgNode.style.top = this.itemPadding+'%';
				itm.imgNode.style.width = (100 - 2 * this.itemPadding) + '%';
				itm.imgNode.style.height = (100 - 2 * this.itemPadding) + '%';
			}
		}

		//
		// calc the grid
		//

		this.calcHitGrid();

		//
		// connect the event proc
		//
		dojo.event.connect(document.documentElement, "onmousemove", this, "mouseHandler");
	},

	mouseHandler: function(e) {
		var p = this.getCursorPos(e);

		if ((p.x >= this.hitX1) && (p.x <= this.hitX2) &&
			(p.y >= this.hitY1) && (p.y <= this.hitY2)){

			this.isOver = true;
			this.onGridMouseMove(p.x-this.hitX1, p.y-this.hitY1);
		}else{
			if (this.isOver){
				this.isOver = false;
				this.onGridMouseMove(-1, -1);
			}
		}
	},

	onResized: function() {
		this.calcHitGrid();
	},

	onGridMouseMove: function(x, y){

		//
		// figure out our main index
		//

		var pos = this.isHorizontal ? x : y;
		var prx = this.isHorizontal ? this.proximityLeft : this.proximityTop;
		var siz = this.isHorizontal ? this.itemWidth : this.itemHeight;
		var sim = this.isHorizontal ? this.itemMaxWidth : this.itemMaxHeight;

		var cen = ((pos - prx) / siz) - 0.5;
		var max_off_cen = (sim / siz) - 0.5;

		if (max_off_cen > this.effectUnits){ max_off_cen = this.effectUnits; }


		//
		// figure out our off-axis weighting
		//

		var off_weight = 0;

		if (this.anchorEdge == this.EDGE.BOTTOM){
			var cen2 = (y - this.proximityTop) / this.itemHeight;
			off_weight = (cen2 > 0.5) ? 1 : y / (this.proximityTop + (this.itemHeight / 2));
		}
		if (this.anchorEdge == this.EDGE.TOP){
			var cen2 = (y - this.proximityTop) / this.itemHeight;
			off_weight = (cen2 < 0.5) ? 1 : (this.totalHeight - y) / (this.proximityBottom + (this.itemHeight / 2));
		}
		if (this.anchorEdge == this.EDGE.RIGHT){
			var cen2 = (x - this.proximityLeft) / this.itemWidth;
			off_weight = (cen2 > 0.5) ? 1 : x / (this.proximityLeft + (this.itemWidth / 2));
		}
		if (this.anchorEdge == this.EDGE.LEFT){
			var cen2 = (x - this.proximityLeft) / this.itemWidth;
			off_weight = (cen2 < 0.5) ? 1 : (this.totalWidth - x) / (this.proximityRight + (this.itemWidth / 2));
		}
		if (this.anchorEdge == this.EDGE.CENTER){

			if (this.isHorizontal){
				off_weight = y / (this.totalHeight);
			}else{
				off_weight = x / (this.totalWidth);
			}

			if (off_weight > 0.5){
				off_weight = 1 - off_weight;
			}

			off_weight *= 2;
		}


		//
		// set the sizes
		//

		for(var i=0; i<this.itemCount; i++){

			var weight = this.weightAt(cen, i);

			if (weight < 0){weight = 0;}

			this.setitemsize(i, weight * off_weight);
		}

		//
		// set the positions
		//

		var main_p = Math.round(cen);
		var offset = 0;

		if (cen < 0){
			main_p = 0;

		}else if (cen > this.itemCount - 1){

			main_p = this.itemCount -1;

		}else{

			offset = (cen - main_p) * ((this.isHorizontal ? this.itemWidth : this.itemHeight) - this.children[main_p].sizeMain);
		}

		this.positionElementsFrom(main_p, offset);
	},

	weightAt: function(cen, i){

		var dist = Math.abs(cen - i);

		var limit = ((cen - i) > 0) ? this.children[i].effectRangeRght : this.children[i].effectRangeLeft;

		return (dist > limit) ? 0 : (1 - dist / limit);
	},

	positionFromNode: function(p, w){

		//
		// we need to grow all the nodes growing out from node 'i'
		//

		this.setitemsize(p, w);

		var wx = w;
		for(var i=p; i<this.itemCount; i++){
			wx = 0.8 * wx;
			this.setitemsize(i, wx);
		}

		var wx = w;
		for(var i=p; i>=0; i--){
			wx = 0.8 * wx;
			this.setitemsize(i, wx);
		}
	},

	setitemsize: function(p, scale){

		var w = Math.round(this.itemWidth  + ((this.itemMaxWidth  - this.itemWidth ) * scale));
		var h = Math.round(this.itemHeight + ((this.itemMaxHeight - this.itemHeight) * scale));

		if (this.isHorizontal){

			this.children[p].sizeW = w;
			this.children[p].sizeH = h;

			this.children[p].sizeMain = w;
			this.children[p].sizeOff  = h;

			var y = 0;

			if (this.anchorEdge == this.EDGE.TOP){

				y = (this.children[p].cenY - (this.itemHeight / 2));

			}else if (this.anchorEdge == this.EDGE.BOTTOM){

				y = (this.children[p].cenY - (h - (this.itemHeight / 2)));

			}else{

				y = (this.children[p].cenY - (h / 2));
			}

			this.children[p].usualX = Math.round(this.children[p].cenX - (w / 2));
			this.children[p].domNode.style.top  = y + 'px';

			this.children[p].domNode.style.left  = this.children[p].usualX + 'px';

		}else{

			this.children[p].sizeW = w;
			this.children[p].sizeH = h;

			this.children[p].sizeOff  = w;
			this.children[p].sizeMain = h;

			var x = 0;

			if (this.anchorEdge == this.EDGE.LEFT){

				x = this.children[p].cenX - (this.itemWidth / 2);

			}else if (this.anchorEdge == this.EDGE.RIGHT){

				x = this.children[p].cenX - (w - (this.itemWidth / 2));
			}else{

				x = this.children[p].cenX - (w / 2);
			}

			this.children[p].domNode.style.left = x + 'px';
			this.children[p].usualY = Math.round(this.children[p].cenY - (h / 2));

			this.children[p].domNode.style.top  = this.children[p].usualY + 'px';
		}

		this.children[p].domNode.style.width  = w + 'px';
		this.children[p].domNode.style.height = h + 'px';

		if (this.children[p].svgNode){
			this.children[p].svgNode.setSize(w, h);
		}
	},

	positionElementsFrom: function(p, offset){

		var pos = 0;

		if (this.isHorizontal){
			pos = Math.round(this.children[p].usualX + offset);
			this.children[p].domNode.style.left = pos + 'px';
		}else{
			pos = Math.round(this.children[p].usualY + offset);
			this.children[p].domNode.style.top = pos + 'px';
		}
		this.positionLabel(this.children[p]);


		//
		// position before
		//

		var bpos = pos;

		for(var i=p-1; i>=0; i--){

			bpos -= this.children[i].sizeMain;

			if (this.isHorizontal){
				this.children[i].domNode.style.left = bpos + 'px';
			}else{
				this.children[i].domNode.style.top = bpos + 'px';
			}
			this.positionLabel(this.children[i]);
		}

		//
		// position after
		//

		var apos = pos;

		for(var i=p+1; i<this.itemCount; i++){

			apos += this.children[i-1].sizeMain;

			if (this.isHorizontal){
				this.children[i].domNode.style.left = apos + 'px';
			}else{
				this.children[i].domNode.style.top = apos + 'px';
			}
			this.positionLabel(this.children[i]);
		}

	},

	positionLabel: function(itm){

		var x = 0;
		var y = 0;
		var labelW = dojo.style.getOuterWidth(itm.lblNode);
		var labelH = dojo.style.getOuterHeight(itm.lblNode);

		if (this.labelEdge == this.EDGE.TOP){
			x = Math.round((itm.sizeW / 2) - (labelW / 2));
			y = -labelH;
		}

		if (this.labelEdge == this.EDGE.BOTTOM){
			x = Math.round((itm.sizeW / 2) - (labelW / 2));
			y = itm.sizeH;
		}

		if (this.labelEdge == this.EDGE.LEFT){
			x = -labelW;
			y = Math.round((itm.sizeH / 2) - (labelH / 2));
		}

		if (this.labelEdge == this.EDGE.RIGHT){
			x = itm.sizeW;
			y = Math.round((itm.sizeH / 2) - (labelH / 2));
		}

		itm.lblNode.style.left = x + 'px';
		itm.lblNode.style.top  = y + 'px';
	},

	getCursorPos: function(e){
		return {
			'x': e.pageX || e.clientX + dojo.html.body().scrollLeft,
			'y': e.pageY || e.clientY + dojo.html.body().scrollTop
			};
	},

	calcHitGrid: function(){

		var pos = dojo.style.getAbsolutePosition(this.domNode);

		this.hitX1 = pos.x - this.proximityLeft;
		this.hitY1 = pos.y - this.proximityTop;
		this.hitX2 = this.hitX1 + this.totalWidth;
		this.hitY2 = this.hitY1 + this.totalHeight;

		//dojo.debug(this.hitX1+','+this.hitY1+' // '+this.hitX2+','+this.hitY2);
	},

	toEdge: function(inp, def){
		return this.EDGE[inp.toUpperCase()] || def;
	}
});

dojo.widget.HtmlFisheyeListItem = function(){
	dojo.widget.HtmlWidget.call(this);
}
dojo.inherits(dojo.widget.HtmlFisheyeListItem, dojo.widget.HtmlWidget);

dojo.lang.extend(dojo.widget.HtmlFisheyeListItem, {
	widgetType: "FisheyeListItem",
	
	// Constructor arguments
	iconSrc: "",
	svgSrc: "",
	caption: "",

	blankImgPath: dojo.uri.dojoUri("src/widget/templates/images/blank.gif"),

	templateString:
		'<div class="dojoHtmlFisheyeListItem">' +
		'  <img class="dojoHtmlFisheyeListItemImage" dojoAttachPoint="imgNode" dojoAttachEvent="onMouseOver;onMouseOut;onClick">' +
		'  <div class="dojoHtmlFisheyeListItemLabel" dojoAttachPoint="lblNode"></div>' +
		'</div>',
	
	imgNode: null,

	fillInTemplate: function() {
		//
		// set image
		// TODO: turn on/off SVG support based on browser version.
		// this.parent.enableCrappySvgSupport is not available to this function
		//
		if (this.svgSrc != ""){
			this.svgNode = this.createSvgNode(this.svgSrc);
			this.domNode.appendChild(this.svgNode);
			this.imgNode.style.display = 'none';
		} else if((this.iconSrc.toLowerCase().substring(this.iconSrc.length-4)==".png")&&(dojo.render.html.ie)){
			this.imgNode.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+this.iconSrc+"', sizingMethod='scale')";
			this.imgNode.src = this.blankImgPath.toString();
		} else {
			this.imgNode.src = this.iconSrc;
		}

		//
		// Label
		//
		if ( this.lblNode ) {
			this.lblNode.appendChild(document.createTextNode(this.caption));
			this.lblNode.style.display = 'none';
		}
	},
	
	createSvgNode: function(src){

		var elm = document.createElement('embed');
		elm.src = src;
		elm.type = 'image/svg+xml';
		//elm.style.border = '1px solid black';
		elm.style.width = '1px';
		elm.style.height = '1px';
		elm.loaded = 0;
		elm.setSizeOnLoad = false;

		elm.onload = function(){
			this.svgRoot = this.getSVGDocument().rootElement;
			this.svgDoc = this.getSVGDocument().documentElement;
			this.zeroWidth = this.svgRoot.width.baseVal.value;
			this.zeroHeight = this.svgRoot.height.baseVal.value;
			this.loaded = true;

			if (this.setSizeOnLoad){
				this.setSize(this.setWidth, this.setHeight);
			}
		}

		elm.setSize = function(w, h){
			if (!this.loaded){
				this.setWidth = w;
				this.setHeight = h;
				this.setSizeOnLoad = true;
				return;
			}

			this.style.width = w+'px';
			this.style.height = h+'px';
			this.svgRoot.width.baseVal.value = w;
			this.svgRoot.height.baseVal.value = h;

			var scale_x = w / this.zeroWidth;
			var scale_y = h / this.zeroHeight;

			for(var i=0; i<this.svgDoc.childNodes.length; i++){
				if (this.svgDoc.childNodes[i].setAttribute){
					this.svgDoc.childNodes[i].setAttribute( "transform", "scale("+scale_x+","+scale_y+")" );
				}
			}
		}

		return elm;
	},

	onMouseOver: function() {
		if ( this.caption != "" ) {
			this.lblNode.style.display="block";
			this.parent.positionLabel(this);
		}
	},
	
	onMouseOut: function() {
		this.lblNode.style.display="none";
	},

	onClick: function() {
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:FisheyeList");
dojo.widget.tags.addParseTreeHandler("dojo:FisheyeListItem");
