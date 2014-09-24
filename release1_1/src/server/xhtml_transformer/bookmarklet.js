
/** The canonical location of our XHTML Transformer service. */
var XHTML_TRANSFORMER_URL = 'http://codinginparadise.org/xhtml_transformer/';

function xhtmlTransform(url, reload){
	if(document.createElement && document.appendChild
		&& document.getElementsByTagName){
		var statusDiv = document.createElement('div'); 
		statusDiv.id = "transformerStatusDiv";
		statusDiv.innerHTML = '<span>Transforming HTML document...</span>'; 
		statusDiv.style.backgroundColor = 'red'; 
		statusDiv.style.color = 'white'; 
		statusDiv.style.margin = '1em'; 
		statusDiv.style.position = 'absolute'; 
		statusDiv.style.top = '5px'; 
		statusDiv.style.right = '5px'; 
		statusDiv.style.zIndex = '1000';
		statusDiv.style.overflow = 'hidden';
		statusDiv.style.textAlign = 'right';
		statusDiv.style.paddingTop = '2px';
		statusDiv.style.paddingRight = '5px';
		statusDiv.style.paddingBottom = '2px';
		statusDiv.style.paddingLeft = '5px';
		
		var htmlBody = document.getElementsByTagName('body')[0]; 
		htmlBody.appendChild(statusDiv);
	}
	
	var newURL = XHTML_TRANSFORMER_URL + "?";
	if(typeof reload != "undefined" && reload == true){
		newURL += "reload=true&";
	}
	newURL += "url=" + encodeURI(url);
	
	window.location.href = newURL;
}

function submitTransform(){
	url = document.getElementById("url").value;
	
	if(url == null || typeof url == "undefined" || url == ""){
		alert("Please enter a URL to transform");
		return;
	}
	
	var reload = false;
	var reloadElem = document.getElementById("reload");
	if(reloadElem.checked == true){
		reload = true;
	}
	
	xhtmlTransform(url, reload);
	
	return false;
}

function clearStatus(){
	// remove the status area if we are 'reloading' the page by moving
	// through history so it doesn't appear in the upper right of the
	// screen
	var statusDiv = document.getElementById("transformerStatusDiv");
	if(typeof statusDiv != "undefined" && statusDiv != null){
		statusDiv.parentNode.removeChild(statusDiv);
	}
}

if(document.immediatelyTransform == true){
	xhtmlTransform(window.location.href);
}
		
	