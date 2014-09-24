// Package Declaration
dojo.provide("hyperscope.core");

// Imports
dojo.require("dojo.event.*");

dojo.debug("testing");

hyperscope.core = function(){
}

hyperscope.core = {
	MAX_LEVELS: 64,
	
	/** 
			The number of currently visible levels, starting from 1, which is
			the top-most root of the outline.		
	*/
	visibleLevels: 64,
	
  handlePageLoad: function() {
  	dojo.debug("hyperscope handlePageLoad");
  	dojo.event.connect(document, "onkeypress", this, "handleKey");
	},
  
  handleKey: function(evt){
  	var key = String.fromCharCode(evt.charCode);
  	if(key == 'a'){
  		this.showOneLevelLess();
  	}else if (key == 'b'){
  		this.showOneLevelMore();
  	}else if (key == 'c'){
  		this.showAllLevels();
  	}else if (key == 'd'){
  		this.showFirstLevelOnly();
  	}
  },
  
  showOneLevelLess: function(){
  	dojo.debug("showOneLevelLess");
  	if(this.visibleLevels == 1){
  		return;	
  	}
  	
  	this.visibleLevels--;
  	
  	dojo.debug("this.visibleLevels="+this.visibleLevels); 
		 
  	// get all the ordered list tags
  	var olTags = document.getElementsByTagName("ol");
  	
  	// for each ordered list, determine it's level
  	for(var i = 0; i < olTags.length; i++){
  		if(this._getLevel(olTags[i]) > this.visibleLevels){
  			this._compactDOMNode(olTags[i]);
  		}
  	}
  },
  
  showOneLevelMore: function(){
  	dojo.debug("showOneLevelMore");
  	if(this.visibleLevels == this.MAX_LEVELS){
  		return;
  	}
		
		this.visibleLevels++;
		
		dojo.debug("this.visibleLevels="+this.visibleLevels); 
		
  	// get all the ordered list tags
  	var olTags = document.getElementsByTagName("ol");
  	
  	// for each ordered list, determine it's level
  	for(var i = 0; i < olTags.length; i++){
  		if(this._getLevel(olTags[i]) == this.visibleLevels){
  			this._expandDOMNode(olTags[i]);
  		}
  	}
  },
  
  showAllLevels: function(){
  	dojo.debug("showAllLevels");
  	this.visibleLevels = this.MAX_LEVELS;
		 
  	// get all the ordered list tags
  	var olTags = document.getElementsByTagName("ol");
  	
  	// for each ordered list, determine it's level
  	for(var i = 0; i < olTags.length; i++){
  		this._expandDOMNode(olTags[i]);
  	}
  },
  
  showFirstLevelOnly: function(){
  	dojo.debug("showFirstLevelOnly");
  	this.visibleLevels = 1;
		 
  	// get all the ordered list tags
  	var olTags = document.getElementsByTagName("ol");
  	
  	// for each ordered list, determine it's level
  	for(var i = 0; i < olTags.length; i++){
  		if(this._getLevel(olTags[i]) > this.visibleLevels){
  			this._compactDOMNode(olTags[i]);
  		}
  	}
  },
  
  /** Expands the given DOM node. */
  _expandDOMNode: function(node){
  	node.style.display = "block";
  	node.removeAttribute("compact");
  },
  
  /** Compacts and collapses the given DOM node. */
  _compactDOMNode: function(node){
  	node.style.display = "none";
  	node.setAttribute("compact", "compact");
  },
  
  /** For a given DOM node, determines it's outline level. */
  _getLevel: function(node){
  	// keep jumping through this nodes parents, incrementing the level
  	// each time we hit another OL tag
  	var currentLevel = 1;
		while(node.parentNode != null){
  		node = node.parentNode;
  		if(node.nodeName.toLowerCase() == "ol"){
  			currentLevel++;
  		}
  	}
  	
  	return currentLevel;
  }
};

// Register initial event handlers
dojo.event.connect(dojo, "loaded", hyperscope.core, "handlePageLoad");
