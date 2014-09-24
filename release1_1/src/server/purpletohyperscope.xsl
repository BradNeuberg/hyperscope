<?xml version="1.0"?>
<!-- purpletohyperscope.xsl ==========================================
     Author: Eugene Eric Kim <eekim@blueoxen.com>

     Version: 0.1
     $Id$

     Copyright (C) Bootstrap Alliance 2006.  All rights reserved.
     See COPYING for licensing terms.
================================================================== -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:hs="http://www.hyperscope.org/hyperscope/opml/public/2006/05/09">
  <xsl:output method="xml" indent="yes"/>
  <xsl:template match="/">
    <xsl:processing-instruction name="xml-stylesheet">href="/hyperscope/src/client/lib/hs/xslt/hyperscope.xsl" type="text/xsl"</xsl:processing-instruction>
    <opml hs:version="1.0" version="2.0">
      <head hs:nidCount="{purple/docinfo/lastnid}">
        <title><xsl:value-of select="purple/docinfo/title"/></title>
        <ownerName><xsl:value-of select="purple/docinfo/author/name"/></ownerName>
        <dateCreated><xsl:value-of select="purple/docinfo/datecreated"/></dateCreated>
        <dateModified><xsl:value-of select="purple/docinfo/datepublished"/></dateModified>
      </head>
      <body>
        <xsl:apply-templates select="purple/section"/>
      </body>
    </opml>
  </xsl:template>

  <xsl:template match="section">
    <outline hs:nid="{h/@nid}" text="{h}">
      <xsl:apply-templates select="p | figure | section"/>
    </outline>
  </xsl:template>

  <xsl:template match="p">
    <outline hs:nid="{@nid}" text="{.}"/>
  </xsl:template>

  <xsl:template match="figure">
    <outline hs:nid="{@nid}" text="&lt;img src=&quot;{image/@src}&quot; /&gt;&lt;br /&gt;{caption}" />
  </xsl:template>
</xsl:stylesheet>
