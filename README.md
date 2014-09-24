#HyperScope v1.1

##Note: The HyperScope is not currently maintained. It is present here for archival purposes.

##OVERVIEW

The HyperScope is a high-performance thought processor that enables
you to navigate, view, and link to documents in sophisticated
ways. It's the brainchild of Doug Engelbart, the inventor of hypertext
and the mouse, and is the first step towards his larger vision for an
Open Hyperdocument System.

The HyperScope is written in JavaScript using the Dojo toolkit and
works in Firefox (recommended) and Internet Explorer. It uses OPML as
its base file format. It is open source and available under the GPL.
(See LICENSE for more information.)

##MORE INFORMATION

See the documents in the docs directory for more information on
installing, configuring, and using the HyperScope.

More information is available on our web site at:

  [http://hyperscope.org/](https://web.archive.org/web/20140401230652/http://hyperscope.org/)

##CURRENT COMPATIBILITY

The HyperScope was originally written for Firefox & Internet Explorer, built above their client-side XSLT implementations. Unfortunately their XSLT implementations regressed over the years and the HyperScope no longer works. It will work with Firefox 2.0 but not later. If you are using that older browser, you can try the [tutorial](http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/tutor-hyperscope.opml#:jmwhyGAP).

##FEATURES

HyperScope gives you the ability to change how you view a document (view specifications, or "viewspecs" for short) and how you address parts of a document. You can embed viewspecs in an address, and you can use these addresses to link to or jump around a document.

For example, every paragraph in a HyperScope document has a location number, an address corresponding to the paragraph's location in a document. For example, the second paragraph in the top-level of a document has the location number 2. To link to this paragraph, you can use the address:

  http://foo/bar.opml#2

To jump directly to the second paragraph while viewing a document, you can click on the Jump button, type 2, and press Apply.

You can see the location numbers for every paragraph, you can click Viewspecs, check the Numbering checkbox, and click on Apply. You'll notice that this view corresponds with the viewspec m. To link to the second paragraph of the document with numbering turned on, you can use the address:

  http://foo/bar.opml#2:m

You can also jump to this particular paragraph and view by clicking on Jump and typing 2:m.

HyperScope also has an advanced command-line mode that is based on the Augment hypertext system.

HyperScope works with any documents published in its OPML-based file format, a simple XML format that is easy to generate. It is a client-side JavaScript library that does not require the installation of any special server software.

##FILE FORMAT

HyperScope will work with any OPML documents. In order to view your documents under the HyperScope, all you have to do is transform your documents into OPML and put a link in your OPML to the stylesheet specified below.

HyperScope also uses some optional but useful attributes defined under the http://hyperscope.org/hyperscope/opml/public/2006/05/09 namespace:

<table cellpadding="5" width="100%">
  <tr>
    <th valign="top" width="15%">OPML element</th>
    <th valign="top" width="25%">HyperScope attribute</th>
    <th valign="top">Description</th>
  </tr>
  <tr>
    <td valign="top"><tt>opml</tt></td>
    <td valign="top"><tt>version</tt></td>
    <td>We're at <tt>1.0</tt>.</td>
  </tr>
  <tr>
    <td valign="top"><tt>head</tt></td>
    <td valign="top"><tt>nidCount</tt></td>
    <td>The last node ID used in the document.</td>
  </tr>
  <tr>
    <td valign="top"><tt>head</tt>, <tt>outline</tt></td>
    <td valign="top"><tt>left-label-delim</tt></td>
    <td>You can define label delimiters for every node, or on a
    node-by-node basis.  These delimiters are characters that delimit
    the label in the node's content.  If not set, the delimiter
    defaults to <tt>null</tt> or whitespace.  For example, if the
    left-label is unset, the right-label-delim is set to
    <tt>:</tt>, and the node's content is <tt>TODO: Wash car</tt>,
    then the node's label is <tt>TODO:</tt>.</td>
  </tr>
  <tr>
    <td valign="top"><tt>head</tt>, <tt>outline</tt></td>
    <td valign="top"><tt>right-label-delim</tt></td>
    <td>See the description for <tt>left-label-delim</tt> above.</td>
  </tr>
  <tr>
    <td valign="top"><tt>outline</tt></td>
    <td valign="top"><tt>createdOn</tt></td>
    <td>The date on which the node was created. Must conform to the
    date and time specification in RFC822.</td>
  </tr>
  <tr>
    <td valign="top"><tt>outline</tt></td>
    <td valign="top"><tt>nid</tt></td>
    <td>Node identifier. The node identifier is always preceded by a
    <tt>0</tt>. NIDs must be unique to a node in a document, and once
    assigned, must always stay with that node. In other words, they
    are persistent and immutable.</td>
  </tr>
</table>

###<code>xml-stylesheet</code> HACK

Because HyperScope is client-side JavaScript, we must have a way of packaging the JavaScript with an OPML document. Browsers have semantics defined for doing with HTML, but not XML. To get around this, we use a hack. At the beginning of the document, you define an xml-stylesheet directive that points to hyperscope.xsl (included as part of the HyperScope package):

    <?xml-stylesheet type="text/xsl" href="hyperscope.xsl"?>

The stylesheet transforms the OPML into HTML with a link to some JavaScript bootstrapping code that loads the HyperScope software, then retrieves the OPML file a second time for parsing.

###FILE EXAMPLE

<pre>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
<font color="red">&lt;?xml-stylesheet type="text/xsl" href="hyperscope.xsl"?&gt;</font>
&lt;opml <font color="red">xmlns:hs="http://hyperscope.org/hyperscope/opml/public/2006/05/09" hs:version="1.0"</font> version="2.0"&gt;
   &lt;head <font color="red">hs:left-label-delim="" hs:right-label-delim="" hs:nidCount="3"</font>&gt;
      &lt;ownerName&gt;Eugene Eric Kim&lt;/ownerName&gt;
      &lt;dateCreated&gt;Wed 19 Jul 2006 06:44:27 GMT&lt;/dateCreated&gt;
      &lt;dateModified&gt;Wed 26 Jul 2006 00:17:25 GMT&lt;/dateModified&gt;
   &lt;/head&gt;
   &lt;body&gt;
      &lt;outline <font color="red">hs:createdOn="Wed 19 Jul 2006 06:44:27 GMT" hs:label="First" hs:nid="01"</font> text="First paragraph."&gt;
         &lt;outline <font color="red">hs:createdOn="Wed 26 Jul 2006 00:17:25 GMT" hs:nid="03"</font> text="First subparagraph."/&gt;
      &lt;/outline&gt;
      &lt;outline <font color="red">hs:createdOn="Wed 19 Jul 2006 06:49:27 GMT" hs:nid="02"</font> text="Second paragraph"/&gt;
   &lt;/body&gt;
&lt;/opml&gt;
</pre>

##THE STORY

You may know that Doug Engelbart built the first collaborative
hypertext system in the 1960s, among his many other firsts. What you
may not know is that that system -- NLS/Augment -- still runs, and
that Doug and others continue to use it every day.

Augment has capabilities not found in any other software, features
that make us smarter and more productive. You can read about many of
[these](http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/oad-2221.opml) [capabilities](http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/oad-2250.opml),
but you can't actually experience them first-hand (although this is [changing](http://community.computerhistory.org/scc/projects/nlsproject/)). This
is a huge loss, and not just for those curious about history.  With
today's high-speed networks and computers, some of these capabilities
are potentially more relevant today than they were forty years
ago.

In the 1980s, Doug started touting a new vision for collaborative
tools, which he called the Open Hyperdocument System. The premise of
the vision is that all collaborative knowledge applications -- email,
[conceptual mapping software](http://www.compendiuminstitute.org/), shared authoring tools like Wikis, etc. -- should share
a core set of fundamental capabilities, such as those found in
Augment, in an interoperable way. Furthermore, as we learn to leverage
these new capabilities in our everyday work, we should be able to
coevolve those capabilities continuously.

The HyperScope is meant to be a [http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/bi-2120.opml](first step)
towards this vision of an Open Hyperdocument System. We have three
goals:<

* Give as many people as possible the ability to experience the
capabilities of the original Augment system first-hand.
* Create an open source platform that will help us achieve the vision
for an Open Hyperdocument System.
* Initiate and help ground a dialog around Doug's larger ideas
about augmenting the world's collective IQ and bootstrapping.

This first phase of the HyperScope was made possible by a grant
from the [National Science
Foundation](http://www.nsf.gov/). But the project itself would be impossible without our
<a href="/community/index.html">vibrant community</a>.</p>

##CORE TEAM

Our core team consists of:

* Doug Engelbart, resident visionary
* Brad Neuberg, software architect and implementor
* Jonathan Cheyer, knows more about Augment than anyone else under 35
* Christina Engelbart, the bridge between the old and the new
* Eugene Eric Kim, project lead and collaboration guru who keeps everybody from chasing their own tails

But that's not all...

##THE COMMUNITY

Much of Doug's work centers around how we can collaborate better, so it is not surprising that many, many people have made important contributions to the project. For starters, several of the original members of Doug's Augmentation Research Lab (ARC) at SRI have provided invaluable guidance. They include Bill Barns, Bill Daul, Christina, Norm Hardy, Dave Hopper, Charles Irby, Harvey Lehtman, Dean Meyer, David Potter, and Jeff Rulifson.

In the 1990s, Christina led an effort to create a more modern client for the Augment system. Dubbed "Windows VAT" (for VisualWorks Augment Terminal), it was developed by Bob Czech and ran on VisualWorks Smalltalk for Windows. Much of our user interface was directly inspired by VAT. Craig Latta is currently in the process of packaging VAT for open source release.

In 2002, Dave Thomas, Jeff Eastman, and Craig started working on the [OpenAugment](http://www.openaugment.org/) project, which had similar goals as the HyperScope. All three have been helpful on a number of levels, not least of which was being able to talk with others who had thought deeply about problems similar to ours. In particular, Craig has been an active contributor to our team and a constant presence at our meetings.

The [Software Productivity Consortium](http://www.software.org/) (now the Systems and Software Consortium) provided some seed funding in 2003 to build a HyperScope. The effort, led by [Dorai Thodla](http://dorai.wordpress.com/), garnered some useful lessons which helped us in the design and implementation of this current incarnation.

In 2005, Philip Gust and Jonathan started the NLS/Augment Restoration Project at the Computer History Museum. Howard Palmer developed the [Java Augterm](http://augterm.sourceforge.net/) as part of the project, without which we could not experimented with the Augment system the way we did. Brian Cardanha reversed engineered some of the original [chording keysets](http://blueoxen.net/c/hyperscope/wiki.pl?ChordingKeysets) and built a custom cable so that we could use them on modern machines via USB. We've contributed to this project as well -- a tool that Jonathan wrote that transforms Augment files into HyperScope OPML.

Many, many others have contributed as well, and we hope that eventually includes you as well!

##RELEASE NOTES FOR 1.1

The focus for the HyperScope 1.1 release was to get a networked HTML transformer
up on the network, get our HyperScope architecture documentation up to date, and
fix various bugs.

* The big new feature for this release is an XHTML Transformer. This transformer can dynamically
take HTML documents and bring them into the HyperScope.

There is a bookmarklet available that you can drag to your links toolbar;
when browsing the web, you can press this button to suck the page into the HyperScope.
There is also a web-based form that you can plug a URL into to transform. Both are available here:

http://codinginparadise.org/hyperscope/src/server/xhtml_transformer/

The focus of the HTML transformer are technical specifications, in
particular the ones at the W3C's site. Here are some example specs
sucked into the HyperScope dynamically:

The XML Specification:
http://codinginparadise.org/xhtml_transformer/?url=http://www.w3.org/TR/REC-xml/

The XSLT Specification:
http://codinginparadise.org/xhtml_transformer/?url=http://www.w3.org/TR/xslt

The XHTML Specification:
http://codinginparadise.org/xhtml_transformer/?url=http://www.w3.org/TR/xhtml1/

You can now apply HyperScope's tools to these documents, including studying tools and
advanced addressing and hyperlinks.

Note that the focus of the transformer for this release are the W3C documents at their website;
I wrote the HTML transformer to be generic, so it will work well with many 'document' oriented
web pages. However, some pages will not work, and some pages will give errors.

Here is an example of a 'normal' web page being pulled into the transformer and HyperScope; this
is the Paper Airplane research report:

http://codinginparadise.org/xhtml_transformer/?url=http://www.codinginparadise.org/paperairplane/

* The default viewspecs have been changed. We now default to showing the entire outline of
a document (viewspec 'w') rather than just show the top-level (viewspec 'x'). We also turn on purple
numbers/node numbers by default (viewspec 'm'). Both of these are meant to make working with HyperScope
easier if you are entering the system for the first time.

* The HyperScope design document, at http://codinginparadise.org/hyperscope/src/demos/finalarch.opml ,
is now fully up to date with all public classes, objects, and methods documented. This document went out
of date about a month before I released the initial 1.0 release in September; it now fully documents HyperScope's
architecture. The document at http://hyperscope.org/dev/index.html is also available as a more high-level
description of the architecture.

* Debugging output regressed and was broken on Internet Explorer and Firefox; this has been fixed.

* The CREDITS section of this document has not been updated to list anyone who has contributed code or design time.