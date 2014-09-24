<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:hs="http://www.hyperscope.org/hyperscope/opml/public/2006/05/09"
                xmlns:hs-internal="http://www.hyperscope.org/hyperscope/opml/private/2006/05/09">
    <!--
    	Profiling found that the amount of HTML produced
    	by this XSLT script has a huge effect on performance,
    	so be careful adding too much HTML per-node inside
    	this script.
    -->         
	<xsl:output 
		method="html"
		indent="yes"/>
  
	<!-- 
		XSLT parameters that control what our context node is and various
		viewing options that implement our viewspecs.
	-->
	<!-- Our context node that is shown at the top of the document, such as "2A". -->
	<xsl:param name="hs-internal:context-node-number"/>
	
	<!-- 
		The parent where we will start plexing beneath if
		plex clipping is on.
	-->
	<xsl:param name="hs-internal:plex-parent-number"/>
	
	<!-- A line clipping value from 1 to 62, or the value "none". -->
	<xsl:param name="hs-internal:lineClipping"/>
	
	<!-- A level clipping value from 0 to 62, or the value "none". -->
	<xsl:param name="hs-internal:levelClipping"/>
	
	<!-- Whether to show a node's labels or not. Either true or false. -->
	<xsl:param name="hs-internal:show-node-labels"/>
	
	<!-- Whether to show blank lines between nodes. Either true or false. -->
	<xsl:param name="hs-internal:show-blank-lines"/>
	
	<!-- Whether to show a node's addressing next to it. Either true or false. -->
	<xsl:param name="hs-internal:show-node-addressing"/>
	
	<!-- Where to display a node's addressing. Either "left" or "right". -->
	<xsl:param name="hs-internal:node-addressing-placement"/>
	
	<!-- Whether to show a node's authoring signatures. Either true or false. -->
	<xsl:param name="hs-internal:show-node-signatures"/>
	
	<!-- Whether to show frozen nodes. Either true or false. -->
	<xsl:param name="hs-internal:show-frozen-nodes"/>
	
	<!-- 
		Whether to show a node's ID or a node's number if node addressing is on. 
		Either 'id' or 'number'.
	-->
	<xsl:param name="hs-internal:node-addressing-type"/>
	
	<!-- 
		Whether to do structural clipping. 
		Either "branch", "plex", or "none". 
	-->
	<xsl:param name="hs-internal:structure-clipping"/>
	
	<!-- 
		How to handle content filtering. Either
		"none", "all", or "next_node". 
	-->
	<xsl:param name="hs-internal:content-filtering-type"/>
	
	<!--
		The level indenting type. Either
		"on", "off", or "to_context_node".
	-->
	<xsl:param name="hs-internal:level-indenting-type"/>
  
	<xsl:template match="/">
		<!-- 
			Determine if we will put blank lines between nodes.
			If we are to space out nodes (viewspec y), then
			add the class .space-nodes to the body tag. 
		-->
		<xsl:variable name="node-spacing-class">
			<xsl:if test="$hs-internal:show-blank-lines = 'true'">space-nodes</xsl:if>
		</xsl:variable>
		
		<div id="hyperScopeDocument" class="{$node-spacing-class}">
		
			<!-- Apply structural viewspecs -->
			<xsl:choose>
				<xsl:when test="$hs-internal:structure-clipping = 'none'">
					<xsl:apply-templates 
						select="//outline"/>
				</xsl:when>
				
				<xsl:when test="$hs-internal:structure-clipping = 'branch'">
					<xsl:apply-templates 
						select="//outline[@hs-internal:number = $hs-internal:context-node-number]/descendant-or-self::outline"/>
				</xsl:when>
				
				<xsl:when test="$hs-internal:structure-clipping = 'plex'">
					<xsl:choose>
						<xsl:when test="$hs-internal:plex-parent-number = 'none'">
							<xsl:apply-templates select="//outline"/>
						</xsl:when>
						
						<xsl:otherwise>
							<xsl:apply-templates 
							select="//outline[@hs-internal:number = $hs-internal:plex-parent-number]/descendant::outline"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
			</xsl:choose>
		</div>
	</xsl:template>
	
	<xsl:template name="draw-hyperscope-node">
		<xsl:param name="level"/>
		<xsl:param name="number"/>
		<xsl:param name="nid"/>
		<xsl:param name="nodeCounter"/>
		<xsl:param name="data"/>
		<xsl:param name="included"/>
		<xsl:param name="includeFailed"/>
		<xsl:param name="includedFrom"/>
		<xsl:param name="includedType"/>
		<xsl:param name="passesContentFilter"/>
		
		<!-- Handle node indentation -->
		<xsl:variable name="indentAmount">
			<xsl:choose>
				<xsl:when test="$hs-internal:level-indenting-type = 'on'">
					<xsl:value-of select="$level * 2"/>
				</xsl:when>
				<xsl:when test="$hs-internal:level-indenting-type = 'off'">
					0
				</xsl:when>
			</xsl:choose>
		</xsl:variable>
		
		<!--
			Handle whether we are an included node
			and whether we failed. 
		-->
		<xsl:variable name="includedClass">
			<xsl:if test="$included = 'yes'">
				included-node
			</xsl:if>
		</xsl:variable>
		<xsl:variable name="includeFailedClass">
			<xsl:if test="$includeFailed = 'yes'">
				include-failed
			</xsl:if>
		</xsl:variable>
		
		<!--
			Determine the title for our links
		-->
		<xsl:variable name="linkTitle">
			<xsl:if test="$included = 'yes'">Included <xsl:value-of select="$includedType"/> from <xsl:value-of select="$includedFrom"/></xsl:if>
		</xsl:variable>
		
		<!-- 
			Output the node's row if it is not being filtered out
			by a content filter.
		-->
		<tr 	class="node-row {$includedClass} {$includeFailedClass}" 
				hs-internal:node-counter="{$nodeCounter}"
				hs-internal:number="{$number}"
				hs-internal:passes-content-filter="{$passesContentFilter}">
				
			<td class="quick-buttons" valign="middle">
				<img src="/hyperscope/src/client/images/arrow_up.png" class="quick-button quick-zoom-out" />
				<img src="/hyperscope/src/client/images/arrow_down.png" class="quick-button quick-zoom-in" />
				<img src="/hyperscope/src/client/images/lines.png" class="quick-button quick-lines" />
			</td>
			
			<td class="node-data">
				
				<div	id="number{$number}" 
						class="node-data-content"
						style="margin-left: {$indentAmount}em;">
						
					<!-- 
						See if we should output node addressing on the left side
						and what kind of addressing to output.
					-->
					<xsl:choose>
						<xsl:when test="$hs-internal:show-node-addressing = 'true'
										and $hs-internal:node-addressing-placement = 'left'">
							<xsl:choose>
								<xsl:when test="$hs-internal:node-addressing-type = 'id'">
									<a 	class="node-address" 
										title="{$linkTitle}"
										href="#{$nid}">
										(<xsl:value-of select="$nid"/>)
									</a>
								</xsl:when>
								<xsl:when test="$hs-internal:node-addressing-type = 'number'">
									<a 	class="node-address" 
										title="{$linkTitle}"
										href="#{$number}">
										(<xsl:value-of select="$number"/>)
									</a>
								</xsl:when>
							</xsl:choose>
						</xsl:when>
						
						<xsl:otherwise>
							<!--
								Write an a element out into the source, but make in
								invisible; this is so that our ResultsWriter class can
								work with our DOM in a consistent way for performance
								reasons.
								Add a non breaking space (160) into here or else the XSLT
								transform turns it into an empty XML elements,
								such as <a/>, which Internet Explorer doesn't like
							-->
							<a href="#" style="display: none;">&#160;</a>
						</xsl:otherwise>
					</xsl:choose>
				
					
					<!-- 
						Mozilla doesn't support disable-output-escaping,
						but we put it here for browsers that do (like IE).
						
						For Mozilla, during rendering,
						we scan a row's data and see if it contains an entity;
						if it does, we rewrite that data using innerHTML
						so that entities are interpreted as HTML
					-->
					<span class="output-holder">
						<xsl:value-of disable-output-escaping="yes" select="$data"/>
					</span>
				</div>
			</td>
		
			<td class="node-addressing-column">
				<!-- 
					See if we should output node addressing on the right side
					and what kind of addressing to output.
				-->
				<xsl:choose>
					<xsl:when test="$hs-internal:show-node-addressing = 'true'
									and $hs-internal:node-addressing-placement = 'right'">
						<xsl:choose>
							<xsl:when test="$hs-internal:node-addressing-type = 'id'">
								<a 	class="node-address" 
									title="{$linkTitle}"
									href="#{$nid}">
									(<xsl:value-of select="$nid"/>)
								</a>
							</xsl:when>
							<xsl:when test="$hs-internal:node-addressing-type = 'number'">
								<a 	class="node-address" 
									title="{$linkTitle}"
									href="#{$number}">
									(<xsl:value-of select="$number"/>)
								</a>
							</xsl:when>
						</xsl:choose>
					</xsl:when>
					
					<xsl:when test="$hs-internal:show-node-addressing = 'false'
									or $hs-internal:node-addressing-placement = 'left'">
						<!-- 
							Insert a non-breaking space (nbsp); needed so that Firefox
							will select the line correctly when the mouse runs
							over it with line-spacing on.
						-->
						&#160;
					</xsl:when>
				</xsl:choose>
			</td>
		</tr>
	</xsl:template>

	
	<xsl:template match="outline">
		<!-- 
			Display an outline node, but only if it's level is less than or equal to our
			levelClipping value, or if levelClipping is 'none'.
			
			There is a another test to see if our levelClipping is '0', which is a String and
			must be to workaround a bug in Internet Explorer; if it is, then we see if the
			level of this node is also '0'.
			
			We will _always_ display this node even if it is out of 
			level clipping view if it is our context node.
			
			We do this as an 'if' statement rather than as a 'template match' because
			Internet Explorer does not allow $variable names in 'template' tags.
		-->
		<xsl:if test="@hs-internal:level = $hs-internal:levelClipping
					  or @hs-internal:level &lt; $hs-internal:levelClipping
					  or $hs-internal:levelClipping = 'none'
					  or @hs-internal:number = $hs-internal:context-node-number">
			<xsl:call-template name="draw-hyperscope-node">
				<xsl:with-param name="level"><xsl:value-of select="@hs-internal:level"/></xsl:with-param>
				<xsl:with-param name="number"><xsl:value-of select="@hs-internal:number"/></xsl:with-param>
				<xsl:with-param name="nid"><xsl:value-of select="@hs:nid"/></xsl:with-param>
				<xsl:with-param name="nodeCounter"><xsl:value-of select="@hs-internal:node-counter"/></xsl:with-param>
				<xsl:with-param name="data"><xsl:value-of select="@text"/></xsl:with-param>
				<xsl:with-param name="included"><xsl:value-of select="@hs-internal:included"/></xsl:with-param>
				<xsl:with-param name="includeFailed"><xsl:value-of select="@hs-internal:include-failed"/></xsl:with-param>
				<xsl:with-param name="includedFrom"><xsl:value-of select="@hs-internal:included-from"/></xsl:with-param>
				<xsl:with-param name="includedType"><xsl:value-of select="@hs-internal:included-type"/></xsl:with-param>
				<xsl:with-param name="passesContentFilter"><xsl:value-of select="@hs-internal:passes-content-filter"/></xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		
	</xsl:template>

</xsl:stylesheet>
