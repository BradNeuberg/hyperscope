<xsl:stylesheet 
		version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<!-- 
		Output a DOCTYPE so that we don't run into a bug in
		Firefox where XHTML documents created by XSLT don't have
		important document.* properties added to them.
	-->
	<xsl:output 
		method="html"
		indent="yes"
		doctype-public="-//W3C//DTD HTML 4.0 Strict//EN"/>
	
	<xsl:template match="/">
		<html>
		<head>
			<title>HyperScope</title>
			
			<script type="text/javascript"><![CDATA[
				var djConfig =	{ 
									testing: false, 
									isDebug: false, 
									disableFlashStorage: true, 
									parseWidgets: true,
									profiling: false,
									production: true
								};
				
				// turn off any JavaScript errors if we are production,
				// since we don't want error popups
				if(djConfig.production == true){
					window.onerror = function(evt){ 
						return true; 
					};
				}
				
				// be able to set profiling through the URL
				if(window && window.location && window.location.href
					&& window.location.href.indexOf("profiling=true") != -1){
					djConfig.profiling = true;
				} 
								
				// a variable that helps us to do profiling
				// to figure out what time we started to
				// load everything
				var docStartTime;
				if(djConfig.profiling == true){	
					docStartTime = new Date().getTime();
				}
			]]></script>
			
			<!-- Production HyperScope -->
			<!-- 
				TODO: Generate version string from build system
				to cache bust browsers with bad caching to
				force them to reload our new version.
			-->	
			<script type="text/javascript" src="/hyperscope/src/client/lib/all/all.js?version=1.0-beta1.9"></script>
			
			<!-- Debugging, non-production HyperScope -->
			<!--
			<script type="text/javascript" src="/hyperscope/src/client/lib/dojo/dojo.js.uncompressed.js"></script>
			<script language="JavaScript"><![CDATA[
				// path is relative to dojo root
				dojo.setModulePrefix("sarissa", "../sarissa");
				dojo.setModulePrefix("hs", "../hs");
				
				// bring in custom packages
				dojo.require("sarissa.core");
				dojo.require("sarissa.xpath");
				dojo.require("hs.*");
			]]></script>
			-->
			<!-- Pull Sarissa in again during dev mode; needed for Internet Explorer -->
			<!--
			<script type="text/javascript" src="/hyperscope/src/client/lib/sarissa/core.js"></script>
			<script type="text/javascript" src="/hyperscope/src/client/lib/sarissa/xpath.js"></script>
			-->
			<link rel="stylesheet" type="text/css" href="/hyperscope/src/client/style/global.css"></link>
		</head>
		
		<body>
			<div id="hsToolbar" dojoType="HyperScopeToolbar"></div>
			
			<div id="statusArea"></div>
			
			<div id="helpOverlay" dojoType="HelpOverlay"></div>
			
			<div id="jumpOverlay" dojoType="JumpOverlay"></div>
			
			<div id="viewspecsOverlay" dojoType="ViewspecOverlay"></div>
			
			<div id="docWindow">
				<iframe id="docFrame" frameborder="0"></iframe>
			</div>
			
			<!-- 
				A table that dojo.profile will put profiling results 
				in if djConfig.profile is true.
			-->
			<div id="profileOuputTable"></div>
		</body>
		
		</html>

	</xsl:template>
</xsl:stylesheet>
