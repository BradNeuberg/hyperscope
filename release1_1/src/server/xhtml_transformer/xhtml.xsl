<?xml version="1.0"?>

<!--
	Description: 
		An XSLT script that can transform XHTML into OPML, suitable for displaying
		inside of HyperScope.
	
	Credits:
		This XSLT script is based on:
			* Work done by Les Orchard with his XOXO to OPML script: 
				http://decafbad.com/2005/11/gopher-ng/xoxo-to-hyperscope.xsl
			* The XSLT FAQ on flat file transformation:
				http://www.dpawson.co.uk/xsl/sect2/flatfile.html
			* Messages on the XSL-List public forum, in particular this thread on serializing nested XML
				into a string:
				http://www.biglist.com/lists/xsl-list/archives/200312/msg00693.html
			* A tutorial by Bob DuCharme on comparing and replacing full strings in XSLT:
				http://www.xml.com/pub/a/2002/06/05/transforming.html
		
		This XSLT was created and is maintained by Brad Neuberg, bkn3@columbia.edu.
-->

<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:hs="http://www.hyperscope.org/hyperscope/opml/public/2006/05/09"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	exclude-result-prefixes="xhtml">
		
	<xsl:param name="HS_JS_URI"
		select="'/hyperscope/src/client/lib/hs/xslt/hyperscope.xsl'"/>
		
	<xsl:param name="print-debug-messages">no</xsl:param>	
	
	<xsl:output indent="yes" method="xml"/>
	
	<xsl:key name="next-headings" match="xhtml:h6"
			use="generate-id(preceding-sibling::node()[self::xhtml:h1 or self::xhtml:h2 or
				self::xhtml:h3 or self::xhtml:h4 or
				self::xhtml:h5][1])"/>
	<xsl:key name="next-headings" match="xhtml:h5"
			 use="generate-id(preceding-sibling::node()[self::xhtml:h1 or self::xhtml:h2 or
				self::xhtml:h3 or self::xhtml:h4][1])"/>
	<xsl:key name="next-headings" match="xhtml:h4"
			 use="generate-id(preceding-sibling::node()[self::xhtml:h1 or self::xhtml:h2 or
				self::xhtml:h3][1])"/>
	<xsl:key name="next-headings" match="xhtml:h3"
			 use="generate-id(preceding-sibling::node()[self::xhtml:h1 or self::xhtml:h2][1])"/>
	<xsl:key name="next-headings" match="xhtml:h2"
			 use="generate-id(preceding-sibling::xhtml:h1[1])"/>
			 
	<xsl:key name="immediate-nodes"
			 match="node()[not(self::xhtml:h1 or self::xhtml:h2 or self::xhtml:h3 or self::xhtml:h4 or
								self::xhtml:h5 or self::xhtml:h6)]"
			 use="generate-id(preceding-sibling::node()[self::xhtml:h1 or self::xhtml:h2 or
					self::xhtml:h3 or self::xhtml:h4 or
					self::xhtml:h5 or self::xhtml:h6][1])"/>
					
	<!-- 
		A map with to know which nodes are 'under' a header,
		element, such as an H1, H2, etc.
	-->
	<xsl:key name="nodes-under-headers"
			 match="node()[ancestor-or-self::node()[preceding-sibling::node()[self::xhtml:h1 or self::xhtml:h2 
												or self::xhtml:h3 or self::xhtml:h4
												or self::xhtml:h5 or self::xhtml:h6]] 
							and not(self::xhtml:h1)]"
			 use="generate-id(.)"/>
	
	<!-- Start processing here -->
	<xsl:template match="/">
		<xsl:processing-instruction name="xml-stylesheet">type="text/xsl" href="<xsl:value-of select="$HS_JS_URI"/>"</xsl:processing-instruction>

		<!-- New line -->
		<xsl:text>&#xa;</xsl:text>

		<opml hs:version="1.0" version="2.0">
			<head>
				<title><xsl:value-of select="/xhtml:html/xhtml:head/xhtml:title"/></title>
			</head>
			
			<body>
				<xsl:apply-templates select="/xhtml:html/xhtml:body/*"/>
			</body>
		</opml>
	</xsl:template>

	<xsl:template match="xhtml:h1 | xhtml:h2 | xhtml:h3
						| xhtml:h4 | xhtml:h5 | xhtml:h6">
		<xsl:param name="force-print-heading">no</xsl:param>
		<xsl:param name="processing-header">no</xsl:param>				
		
		<!--
			Only handle this element here if it 
			_doesn't_ have preceding siblings that 
			are larger than it. For example, for 
			an H1 followed by an H2, we would handle the
			H1 here, while the H2 would get handled 
			by the 'next-headings' map applied below.
		-->
		<xsl:variable name="has-larger-preceding-header">
			<xsl:choose>
				<xsl:when test="self::xhtml:h1">no</xsl:when>
				<xsl:when test="self::xhtml:h2 
								and count(preceding-sibling::node()[self::xhtml:h1][1]) = 0">no</xsl:when>
				<xsl:when test="self::xhtml:h3 
								and count(preceding-sibling::node()
									[self::xhtml:h1 or self::xhtml:h2][1]) = 0">no</xsl:when>
				<xsl:when test="self::xhtml:h4 
								and count(preceding-sibling::node()
									[self::xhtml:h1 or self::xhtml:h2 or self::xhtml:h3][1]) = 0">no</xsl:when>
				<xsl:when test="self::xhtml:h5 
								and count(preceding-sibling::node()
									[self::xhtml:h1 or self::xhtml:h2 
										or self::xhtml:h3 or self::xhtml:h4][1]) = 0">no</xsl:when>
				<xsl:when test="self::xhtml:h6 
								and count(preceding-sibling::node()
									[self::xhtml:h1 or self::xhtml:h2 
										or self::xhtml:h3 or self::xhtml:h4
										or self::xhtml:h5][1]) = 0">no</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- 
			We have to be careful when printing this 
			element, because we might be called several
			times and want to prevent duplicates.
		-->
		<xsl:variable name="print-element">
			<xsl:choose>
				<!--
					We have headers before us that are larger, 
					and we aren't being forced to print as part
					of a larger header's recursive process.
				-->
				<xsl:when test="$has-larger-preceding-header = 'yes'
								and $force-print-heading = 'no'">no</xsl:when>
				
				<!--
					We aren't in the middle of processing a header
					in a recursive way, and yet we are 'logically'
					a child of an earlier header.
				-->
				<xsl:when test="$processing-header = 'no' 
								and count(key('nodes-under-headers', generate-id(.))) &gt; 1">no</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- Serialize our XHTML children into a string. -->
		<xsl:variable name="node-text">
			<xsl:if test="$print-debug-messages = 'yes' or $print-element = 'yes'">
				<xsl:apply-templates select="." mode="escape-html">
					<xsl:with-param name="print-root-node">yes</xsl:with-param>
				</xsl:apply-templates>
			</xsl:if>
		</xsl:variable>
		
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element,
			has-larger-preceding-header=<xsl:value-of select="$has-larger-preceding-header"/>,
			force-print-heading=<xsl:value-of select="$force-print-heading"/>,
			print-element=<xsl:value-of select="$print-element"/>,
			processing-header=<xsl:value-of select="$processing-header"/>,
			count(key('nodes-under-headers', generate-id(.)))=<xsl:value-of select="count(key('nodes-under-headers', 
																					generate-id(.)))"/>,
			<xsl:if test="count(key('nodes-under-headers', generate-id(.))) = 1">
				nodes-under-headers[1] = <xsl:value-of select="key('nodes-under-headers', generate-id(.))[1]/*"/>
			</xsl:if>
			value=<xsl:value-of select="$node-text"/>
			</xsl:message>
		</xsl:if>
		
		<xsl:if test="$print-element = 'yes'">
			<outline text="{$node-text}">
				<xsl:if test="$print-debug-messages = 'yes'">
					<xsl:message>
						Processing 'immediate-nodes' for <xsl:value-of select="local-name(.)"/>,
						count=<xsl:value-of select="count(key('immediate-nodes', generate-id()))"/>,
						elements=<xsl:for-each select="key('immediate-nodes', generate-id())[node()]"><xsl:value-of select="local-name(.)"/>, </xsl:for-each>
					</xsl:message>
				</xsl:if>
				
				<xsl:apply-templates select="key('immediate-nodes', generate-id())">
					<xsl:with-param name="processing-header">yes</xsl:with-param>
				</xsl:apply-templates>
				
				<xsl:if test="$print-debug-messages = 'yes'">
					<xsl:message>
						Processing 'next-headings' for <xsl:value-of select="local-name(.)"/>,
						count=<xsl:value-of select="count(key('next-headings', generate-id()))"/>,
						elements=<xsl:for-each select="key('next-headings', generate-id())[node()]"><xsl:value-of select="local-name(.)"/>, </xsl:for-each>
					</xsl:message>
				</xsl:if>
				
				<xsl:apply-templates select="key('next-headings', generate-id())">
					<xsl:with-param name="force-print-heading">yes</xsl:with-param>
					<xsl:with-param name="processing-header">yes</xsl:with-param>
				</xsl:apply-templates>
				
				<xsl:if test="$print-debug-messages = 'yes'">
					<xsl:message>
						++ Finished recursively printing child 'immediate-nodes' and 
							'next-headings' for <xsl:value-of select="local-name(.)"/> element
					</xsl:message>
				</xsl:if>
			</outline>
		</xsl:if>		
		
	</xsl:template>
	
	<xsl:template match="xhtml:p | xhtml:blockquote | xhtml:form | xhtml:pre
						| xhtml:table">
		<xsl:param name="processing-header">no</xsl:param>
		
		<!-- 
			Don't print this element if it is 'logically' under
			an H* element (H1, H2, etc.) and we are _not_ currently processing
			H* elements - this is to prevent duplicates, because
			some templates are visited twice, once because they are
			at the top-level, and once because they are 'logically'
			under an H* element.
		-->
		<xsl:variable name="print-element">
			<xsl:choose>
				<xsl:when test="$processing-header = 'no' 
								and count(key('nodes-under-headers', generate-id(.))) != 0">no</xsl:when>
				
				<xsl:when test="$processing-header = 'yes'">yes</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- Serialize our XHTML children into a string. -->
		<xsl:variable name="node-text">
			<xsl:if test="$print-debug-messages = 'yes' or $print-element = 'yes'">
				<xsl:apply-templates select="." mode="escape-html">
					<xsl:with-param name="print-root-node">yes</xsl:with-param>
				</xsl:apply-templates>
			</xsl:if>
		</xsl:variable>
		
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element,
			processing-header=<xsl:value-of select="$processing-header"/>,
			print-element=<xsl:value-of select="$print-element"/>,
			count(key('nodes-under-headers', generate-id(.)))=<xsl:value-of select="count(key('nodes-under-headers', 
																					generate-id(.)))"/>,
			value=<xsl:value-of select="$node-text"/>
			</xsl:message>
		</xsl:if>
		
		<xsl:if test="$print-element = 'yes'">
			<outline text="{$node-text}"/>
		</xsl:if>
	</xsl:template>
	
	<!--
		Simply 'pass-through' to the DT elements
		of Data List (DL) elements.
	-->
	<xsl:template match="xhtml:dl">
		<xsl:param name="processing-header">no</xsl:param>
		
		<xsl:apply-templates select="./xhtml:dt">
			<xsl:with-param name="processing-header"
							select="$processing-header"/>
		</xsl:apply-templates>
	</xsl:template>
	
	<xsl:template match="xhtml:dt">
		<xsl:param name="processing-header">no</xsl:param>					
	
		<!-- 
			Don't print this element if it is 'logically' under
			an H* element (H1, H2, etc.) and we are _not_ currently processing
			H* elements.
		-->
		<xsl:variable name="print-element">
			<xsl:choose>
				<xsl:when test="$processing-header = 'no' 
								and count(key('nodes-under-headers', generate-id(..))) != 0">no</xsl:when>
				
				<xsl:when test="$processing-header = 'yes'">yes</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- Serialize our XHTML children into a string. -->
		<xsl:variable name="node-text">
			<xsl:if test="$print-debug-messages = 'yes' or $print-element = 'yes'">
				<xsl:apply-templates select="." mode="escape-html">
					<xsl:with-param name="print-root-node">no</xsl:with-param>
				</xsl:apply-templates>
			</xsl:if>
		</xsl:variable>
		
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element,
			processing-header=<xsl:value-of select="$processing-header"/>,
			print-element=<xsl:value-of select="$print-element"/>,
			count(key('nodes-under-headers', generate-id(.)))=<xsl:value-of select="count(key('nodes-under-headers', 
																					generate-id(.)))"/>,
			value=<xsl:value-of select="$node-text"/>
			</xsl:message>
		</xsl:if>
		
		<xsl:if test="$print-element = 'yes'">
			<outline text="{$node-text}">
				<xsl:variable	name="preceding-dt-id" 
								select="generate-id(.)"/>
				<xsl:apply-templates 
					select="following-sibling::xhtml:dd
								[generate-id(preceding-sibling::xhtml:dt[1]) = $preceding-dt-id]">
					<xsl:with-param name="dt-is-parent">yes</xsl:with-param>
				</xsl:apply-templates>
			</outline>
		</xsl:if>
		
	</xsl:template>
	
	<xsl:template match="xhtml:dd">
		<xsl:param name="dt-is-parent">no</xsl:param>
		
		<!-- Serialize our XHTML children into a string. -->
		<xsl:variable name="node-text">
			<xsl:if test="$print-debug-messages = 'yes' or $dt-is-parent = 'yes'">
				<xsl:apply-templates select="." mode="escape-html">
					<xsl:with-param name="print-root-node">no</xsl:with-param>
				</xsl:apply-templates>
			</xsl:if>
		</xsl:variable>
		
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element,
			dt-is-parent=<xsl:value-of select="$dt-is-parent"/>,
			value=<xsl:value-of select="$node-text"/>
			</xsl:message>
		</xsl:if>
		
		<!-- 
			Differentiate us being called by a DT element before
			us manually, and the natural XSLT process of calling
			us for everything in the tree. We don't want to
			get printed out twice.
		-->
		<xsl:if test="$dt-is-parent = 'yes'">
			<outline text="{$node-text}"/>
		</xsl:if>
	</xsl:template>
	
	<!--
		Simply 'pass-through' to the LI children
		of UL and OL elements.
	-->
	<xsl:template match="xhtml:ul | xhtml:ol">
		<xsl:param name="processing-header">no</xsl:param>
		
		<xsl:apply-templates select="./xhtml:li">
			<xsl:with-param name="processing-header"
							select="$processing-header"/>
		</xsl:apply-templates>
	</xsl:template>
	
	<!-- For LI items that don't have nested block-level items in them. -->
	<xsl:template match="xhtml:li[not(.//xhtml:h1 or .//xhtml:h2 or .//xhtml:h3
									 or .//xhtml:h4 or .//xhtml:h5 or .//xhtml:h6
									 or .//xhtml:dl or .//xhtml:p or .//xhtml:blockquote
									 or .//xhtml:table or .//xhtml:form 
									 or .//xhtml:pre or .//xhtml:li
									 or .//xhtml:div or .//xhtml:ul
									 or .//xhtml:ol)]">
		<xsl:param name="processing-header">no</xsl:param>
									 
		<!-- 
			Don't print this element if it is 'logically' under
			an H* element (H1, H2, etc.) and we are _not_ currently processing
			H* elements.
		-->
		<xsl:variable name="print-element">
			<xsl:choose>
				<xsl:when test="$processing-header = 'no' 
								and count(key('nodes-under-headers', generate-id(.))) != 0">no</xsl:when>
				
				<xsl:when test="$processing-header = 'yes'">yes</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- Serialize our XHTML children into a string. -->
		<xsl:variable name="node-text">
			<xsl:if test="$print-debug-messages = 'yes' or $print-element = 'yes'">
				<xsl:apply-templates select="." mode="escape-html">
					<xsl:with-param name="print-root-node">no</xsl:with-param>
				</xsl:apply-templates>
			</xsl:if>
		</xsl:variable>
		
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element (does NOT have nested block-level elements),
			processing-header=<xsl:value-of select="$processing-header"/>,
			print-element=<xsl:value-of select="$print-element"/>,
			count(key('nodes-under-headers', generate-id(.)))=<xsl:value-of select="count(key('nodes-under-headers', 
																					generate-id(.)))"/>,
			value=<xsl:value-of select="$node-text"/>
			</xsl:message>
		</xsl:if>
		
		<xsl:if test="$print-element = 'yes'">							 
			<outline text="{$node-text}"/>
		</xsl:if>
	</xsl:template>
	
	<!-- For LI items that have nested block-level items in them. -->
	<xsl:template match="xhtml:li[.//xhtml:h1 or .//xhtml:h2 or .//xhtml:h3
									 or .//xhtml:h4 or .//xhtml:h5 or .//xhtml:h6
									 or .//xhtml:dl or .//xhtml:p or .//xhtml:blockquote
									 or .//xhtml:table or .//xhtml:form 
									 or .//xhtml:pre or .//xhtml:li
									 or .//xhtml:div or .//xhtml:ul
									 or .//xhtml:ol]">
		<xsl:param name="processing-header">no</xsl:param>
		
		<!-- 
			Don't print this element if it is 'logically' under
			an H* element (H1, H2, etc.) and we are _not_ currently processing
			H* elements.
		-->
		<xsl:variable name="print-element">
			<xsl:choose>
				<xsl:when test="$processing-header = 'no' 
								and count(key('nodes-under-headers', generate-id(.))) != 0">no</xsl:when>
				
				<xsl:when test="$processing-header = 'yes'">yes</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- Serialize our XHTML children into a string. -->
		<xsl:variable name="node-text">
			<xsl:if test="$print-debug-messages = 'yes' or $print-element = 'yes'">
				<xsl:apply-templates select="." mode="escape-html">
					<xsl:with-param name="print-root-node">no</xsl:with-param>
					<xsl:with-param name="serialize-block-level-elems">no</xsl:with-param>
				</xsl:apply-templates>
			</xsl:if>
		</xsl:variable>

		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element (has nested block-level elements),
			processing-header=<xsl:value-of select="$processing-header"/>,
			print-element=<xsl:value-of select="$print-element"/>,
			count(key('nodes-under-headers', generate-id(.)))=<xsl:value-of select="count(key('nodes-under-headers', 
																					generate-id(.)))"/>,
			value=<xsl:value-of select="$node-text"/>
			</xsl:message>
		</xsl:if>
		
		<xsl:if test="$print-element = 'yes'">					 
			<outline text="{$node-text}">
				<xsl:apply-templates select="./xhtml:h1 | ./xhtml:h2 | ./xhtml:h3
											 | ./xhtml:h4 | ./xhtml:h5 | ./xhtml:h6
											 | ./xhtml:dl | ./xhtml:p | ./xhtml:blockquote
											 | ./xhtml:table | ./xhtml:form 
											 | ./xhtml:pre | ./xhtml:ul/xhtml:li
											 | ./xhtml:div | ./xhtml:ol/xhtml:li">
					<xsl:with-param name="processing-header"
									select="$processing-header"/>
				</xsl:apply-templates>
			</outline>
		</xsl:if>
	</xsl:template>
	
	<!-- For DIVs that don't have nested block-level items in them. -->
	<xsl:template match="xhtml:div[not(.//xhtml:h1 or .//xhtml:h2 or .//xhtml:h3
									 or .//xhtml:h4 or .//xhtml:h5 or .//xhtml:h6
									 or .//xhtml:dl or .//xhtml:p or .//xhtml:blockquote
									 or .//xhtml:table or .//xhtml:form 
									 or .//xhtml:pre or .//xhtml:li
									 or .//xhtml:dt or .//xhtml:dd
									 or .//xhtml:ul or .//xhtml:ol)]">
		<xsl:param name="processing-header">no</xsl:param>
										 
		<!-- 
			Don't print this element if it is 'logically' under
			an H* element (H1, H2, etc.) and we are _not_ currently processing
			H* elements.
		-->
		<xsl:variable name="print-element">
			<xsl:choose>
				<xsl:when test="$processing-header = 'no' 
								and count(key('nodes-under-headers', generate-id(.))) != 0">no</xsl:when>
				
				<xsl:when test="$processing-header = 'yes'">yes</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- Serialize our XHTML children into a string. -->
		<xsl:variable name="node-text">
			<xsl:if test="$print-debug-messages = 'yes' or $print-element = 'yes'">
				<xsl:apply-templates select="." mode="escape-html">
					<xsl:with-param name="print-root-node">yes</xsl:with-param>
				</xsl:apply-templates>
			</xsl:if>
		</xsl:variable>
		
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element (does NOT have nested block-level elements),
			processing-header=<xsl:value-of select="$processing-header"/>,
			print-element=<xsl:value-of select="$print-element"/>,
			count(key('nodes-under-headers', generate-id(.)))=<xsl:value-of select="count(key('nodes-under-headers', 
																					generate-id(.)))"/>,
			value=<xsl:value-of select="$node-text"/>
			</xsl:message>
		</xsl:if>
		
		<xsl:if test="$print-element = 'yes'">							 
			<outline text="{$node-text}"/>
		</xsl:if>
	</xsl:template>
	
	<!-- 
		For DIVs that have nested block-level items in them. 
		
		We _ignore_ any immediately nested span-level elements or
		text nodes, and only handle the nested block-level
		elements.	
	-->
	<xsl:template match="xhtml:div[.//xhtml:h1 or .//xhtml:h2 or .//xhtml:h3
									 or .//xhtml:h4 or .//xhtml:h5 or .//xhtml:h6
									 or .//xhtml:dl or .//xhtml:p or .//xhtml:blockquote
									 or .//xhtml:table or .//xhtml:form 
									 or .//xhtml:pre or .//xhtml:li
									 or .//xhtml:dt or .//xhtml:dd
									 or .//xhtml:ul or .//xhtml:ol]">
		<xsl:param name="processing-header">no</xsl:param>
										 
		<!-- 
			Don't print this element if it is 'logically' under
			an H* element (H1, H2, etc.) and we are _not_ currently processing
			H* elements.
		-->
		<xsl:variable name="print-element">
			<xsl:choose>
				<xsl:when test="$processing-header = 'no' 
								and count(key('nodes-under-headers', generate-id(.))) != 0">no</xsl:when>
				
				<xsl:when test="$processing-header = 'yes'">yes</xsl:when>
				
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Processing <xsl:value-of select="local-name(.)"/> element (has nested block-level elements),
			processing-header=<xsl:value-of select="$processing-header"/>,
			print-element=<xsl:value-of select="$print-element"/>,
			count(key('nodes-under-headers', generate-id(.)))=<xsl:value-of select="count(key('nodes-under-headers', 
																					generate-id(.)))"/>
			</xsl:message>
		</xsl:if>
		
		<xsl:if test="$print-element = 'yes'">
			<!--
				Select our block-level elements up to the first
				header element, but not beyond, otherwise we
				will get duplicates.
			-->	
			<xsl:apply-templates select="./node()[(self::xhtml:h1 or self::xhtml:h2 or self::xhtml:h3
													 or self::xhtml:h4 or self::xhtml:h5 or self::xhtml:h6
													 or self::xhtml:dl or self::xhtml:p or self::xhtml:blockquote
													 or self::xhtml:table or self::xhtml:form 
													 or self::xhtml:pre or self::xhtml:ul
													 or self::xhtml:div or self::xhtml:ol)
													 and not(preceding-sibling::node()[
													 		self::xhtml:h1 or self::xhtml:h2
															or self::xhtml:h3 or self::xhtml:h4
															or self::xhtml:h5 or self::xhtml:h6])]">
				<xsl:with-param name="processing-header"
								select="$processing-header"/>
			</xsl:apply-templates>
		</xsl:if>
	</xsl:template>
	
	<!-- 
		Catch all nodes we haven't handled above; simply ignore remaining
		elements that don't pass our above conditions.
	-->
	<xsl:template match="node()" priority="-10">
		<xsl:if test="$print-debug-messages = 'yes'">
			<xsl:message>
			++++++++++++++++++
			Ignoring <xsl:value-of select="local-name(.)"/>
			</xsl:message>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="text()">
	</xsl:template>
	
	<xsl:template match="node()" mode="escape-html">
		<xsl:param name="is-root-node">yes</xsl:param>
		<xsl:param name="print-root-node">yes</xsl:param>
		<xsl:param name="serialize-block-level-elems">yes</xsl:param>
		
		<xsl:variable name="print-node">
			<xsl:choose>
				<xsl:when test="$serialize-block-level-elems = 'no' 
						and $is-root-node = 'no'
						and (xhtml:h1 or xhtml:h2 or xhtml:h3 or xhtml:h4
								or xhtml:h5 or xhtml:h6 or xhtml:dl
								or xhtml:dt or xhtml:dd or xhtml:p
								or xhtml:div or xhtml:blockquote
								or xhtml:table or xhtml:form
								or xhtml:pre or xhtml:ul
								or xhtml:ol or xhtml:li)">no</xsl:when>
				<xsl:otherwise>yes</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:if test="$print-node = 'yes'">
		
			<xsl:variable name="output-value">
				<xsl:if test="$print-root-node = 'yes' or ($print-root-node = 'no' and $is-root-node != 'yes')">	
					<xsl:call-template name="start-tag"/>
				</xsl:if>
				
				<xsl:apply-templates mode="escape-html">
					<xsl:with-param name="is-root-node">no</xsl:with-param>
					<xsl:with-param name="serialize-block-level-elems" 
									select="$serialize-block-level-elems"/>
				</xsl:apply-templates>
				
				<xsl:if test="$print-root-node = 'yes' or ($print-root-node = 'no' and $is-root-node != 'yes')">	
					<xsl:if test="*|text()|comment()|processing-instruction()"><xsl:call-template
						name="end-tag"/></xsl:if>
				</xsl:if>
			</xsl:variable>
			
			<xsl:choose>
				<xsl:when test="$is-root-node = 'yes'">
					<xsl:value-of select="normalize-space($output-value)"/>
				</xsl:when>
				
				<xsl:otherwise>
					<xsl:value-of select="$output-value"/>
				</xsl:otherwise>
			</xsl:choose>
			
		</xsl:if>
	</xsl:template>

	<!--
		Take over serializing an elements textual content, so we can
		double-encode reserved XML characters like the less than sign.
	-->
	<xsl:template match="text()" mode="escape-html">
		<xsl:variable name="encodedLT">
			<xsl:call-template name="stringReplace">
				<xsl:with-param name="outputString" select="."/>
				<xsl:with-param name="target"><![CDATA[<]]></xsl:with-param>
				<xsl:with-param name="replacement">&amp;lt;</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		
		<xsl:variable name="encodedGT">
			<xsl:call-template name="stringReplace">
				<xsl:with-param name="outputString" select="$encodedLT"/>
				<xsl:with-param name="target"><![CDATA[>]]></xsl:with-param>
				<xsl:with-param name="replacement">&amp;gt;</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		
		<xsl:variable name="encodedQUOT">
			<xsl:call-template name="stringReplace">
				<xsl:with-param name="outputString" select="$encodedGT"/>
				<xsl:with-param name="target"><![CDATA["]]></xsl:with-param>
				<xsl:with-param name="replacement">&amp;quot;</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		
		<xsl:value-of select="$encodedQUOT"/>
	</xsl:template>

	<xsl:template name="start-tag">
		<xsl:text>&lt;</xsl:text>
		<xsl:value-of select="local-name(.)"/>
		<xsl:for-each select="@*">
			<xsl:call-template name="attribute"/>
		</xsl:for-each>
		<xsl:if test="not(*|text()|comment()|processing-instruction())"> /</xsl:if>
		<xsl:text>&gt;</xsl:text>
	</xsl:template>

	<xsl:template name="end-tag">
		<xsl:text>&lt;/</xsl:text>
		<xsl:value-of select="local-name(.)"/>
		<xsl:text>&gt;</xsl:text>
	</xsl:template>

	<xsl:template name="attribute">
		<xsl:text> </xsl:text>
		<xsl:value-of select="local-name(.)"/>
		<xsl:text>='</xsl:text>
		<xsl:value-of select="."/>
		<xsl:text>'</xsl:text>
	</xsl:template>
	
	<!-- 
		XSLT has no way to replace one string with another, only replacing
		individual characters; we need this to be able to double-encode
		reserved XML characters like the less than sign, so we roll
		our own.
	-->
	<xsl:template name="stringReplace">
		<xsl:param name="outputString"/>
		<xsl:param name="target"/>
		<xsl:param name="replacement"/>
		
		<xsl:choose>
			<xsl:when test="contains($outputString, $target)">
				<xsl:value-of select="concat(substring-before($outputString, $target),
										$replacement)"/>
				<xsl:call-template name="stringReplace">
					<xsl:with-param name="outputString" 
									select="substring-after($outputString, $target)"/>
					<xsl:with-param name="target" select="$target"/>
					<xsl:with-param name="replacement" select="$replacement"/>
				</xsl:call-template>
			</xsl:when>
			
			<xsl:otherwise>
				<xsl:value-of select="$outputString"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
</xsl:stylesheet>