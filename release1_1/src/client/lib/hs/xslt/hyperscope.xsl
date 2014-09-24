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
									testing: false, /* Are we inside JSUnit? */
									isDebug: false, /* Turn on debugging inside of hs.ui.initialize(), not here */
									disableFlashStorage: true,
									parseWidgets: true,
									profiling: false, /* Turn on to get profiling information */
									production: true, /* Flag to control whether to squelch JavaScript errors */
									alertRenderResults: false, /* Flag for alerting render results for testing */
									debugContainerId: "debugOutput" /* Where to put debug messages */
								};

				// turn off any JavaScript errors if we are production,
				// since we don't want error popups
				if(djConfig.production == true){
					window.onerror = function(evt){
						return true;
					};
				}

				// be able to set profiling through the URL; to
				// turn on add 'profiling=true' as query parameter
				// on URL
				if(window && window.location && window.location.href
					&& window.location.href.indexOf("profiling=true") != -1){
					djConfig.profiling = true;
				}

				// a flag that will alert the HTML rendering results
				// after an XSLT pass to help with debugging; to
				// turn on add 'alertRenderResults=true' as query
				// parameter on URL
				if(window && window.location && window.location.href
					&& window.location.href.indexOf("alertRenderResults=true") != -1){
					djConfig.alertRenderResults = true;
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
			<script type="text/javascript" src="/hyperscope/src/client/lib/all/all.js?version=1.1"></script>

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

			<div id="debugOutput"></div>

			<!--
				A table that dojo.profile will put profiling results
				in if djConfig.profile is true.
			-->
			<div id="profileOuputTable"></div>
		</body>

		</html>

	</xsl:template>
</xsl:stylesheet>
