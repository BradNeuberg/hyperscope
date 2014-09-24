<?xml version="1.0"?>
<!-- hyperscopetoxhtml.xsl ===========================================
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
    <html>
      <head>
        <title>(converted doc)</title>
        <style type="text/css">
        div.docinfo {
            font-size: small;
            padding-bottom: 2em;
        }
        div.indented {
            margin-left: 2em;
        }
        a.nid {
            font-family: Verdana, Trebuchet, Arial, Helvetica;
            font-style: normal;
            font-weight: bold;
            font-size: x-small;
            text-decoration: none;
            color: #C8A8FF;  /* light purple */
        }
        </style>
      </head>
      <body>
        <h1>(converted doc)</h1>
        <div class="docinfo">
        Author: <xsl:value-of select="opml/head/ownerName"/><br />
        Created: <xsl:value-of select="opml/head/dateCreated"/><br />
        Modified: <xsl:value-of select="opml/head/dateModified"/>
        </div>

        <xsl:apply-templates select="opml/body/outline"/>

      </body>
    </html>
  </xsl:template>

  <xsl:template match="outline">
    <div class="indented" id="nid{@hs:nid}">
      <p><xsl:value-of disable-output-escaping="yes" select="@text"/>
      &#xA0;&#xA0;
      <a class="nid" href="#nid{@hs:nid}">(<xsl:value-of select="@hs:nid"/>)</a></p>
      <xsl:apply-templates select="outline"/>
    </div>
  </xsl:template>

</xsl:stylesheet>
