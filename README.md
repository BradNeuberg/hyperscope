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

More information is available on our web site at:

  [http://hyperscope.org/](https://web.archive.org/web/20140401230652/http://hyperscope.org/)

##CURRENT COMPATIBILITY

The HyperScope was originally written for Firefox & Internet Explorer, built above their client-side XSLT implementations. Unfortunately their XSLT implementations regressed over the years and the HyperScope no longer works. It will work with Firefox 2.0 but not later.

##DEMO

As mentioned in the CURRENT COMPATIBILITY section above, you must be using Firefox 2.0 to use the demos.

HyperScope is a faithful reproduction of Douglas Engelbart's NLS/Augment and VAT systems; our goal was to reproduce pieces of these systems into contemporary web browsers, changing as little as possible for this phase. The software therefore requires some training to use. Start with our [tutorial](http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/tutor-hyperscope.opml#:jmwhyGAP).

You can read a HyperScope-version of Doug Engelbart's classic 1962 paper, ["Augmenting Human Intellect: A Conceptual Framework."](http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/augmentinghumanintellect.opml) More demo documents are available [here](http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/).

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

The HyperScope is meant to be a [first step](http://codinginparadise.org/projects/hyperscope/release2/hyperscope/src/demos/bi-2120.opml)
towards this vision of an Open Hyperdocument System. We have three
goals:

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

##DEVELOPERS

HyperScope is a completely client-side system implemented with Ajax and DHTML. The system represents structured documents in OPML (which is XML-based). These documents are pulled by the client. Once the client has the XML, it applies XPath and XSLT in order to implement HyperScope's advanced addressing, rendering, and content filtering capabilities. Once these are applied, the manipulated XML is rendered as HTML, which is then displayed to the end-user.

###DOJO AND SARISSA

We use the following features of Dojo to aid in building the core addressing and rendering system as well as the user interface.

* Dojo's event system (dojo.event)
* Dojo's string handling (dojo.string)
* Dojo's JavaScript packaging and extended language features (dojo.lang, dojo.require, dojo.provide)
* Dojo's HTML, CSS, and DOM libraries (dojo.html, dojo.style, dojo.dom)
* Dojo's production system optimizations (Dojo's build files, profiles, compressor, etc.)

[Sarissa](http://sarissa.sourceforge.net/) provides easy, cross-browser APIs for instantiating XSLT stylesheets on the client-side, running them, executing XPath against an XML document, etc. This keeps our application code cleaner because it does not have to contain the cross-browser branching for XSLT and XPath. The branching is hidden behind a simpler, unified API.

###APPLICATION PACKAGES

The system is partitioned across a number of JavaScript packages:

<table cellpadding="5">
  <tr>
    <td valign="top" width="20%"><tt>hs.address</tt></td>
    <td>Represents HyperScope's sophisticated addressing
  schemes; provides an external API to easily resolve a given address
  into an XML document or fragment that can be worked with</td>
  </tr>
  <tr>
    <td valign="top"><tt>hs.model</tt></td>
    <td>Represents our domain objects, such as an
  <tt>hs.model.Document</tt> that is a document that can be jumped through,
  rendered, have viewspecs applied to it, etc., and <tt>hs.model.Node</tt>'s,
  which are node's in a document that can be jumped between, etc.</td>
  </tr>
  <tr>
    <td valign="top"><tt>hs.exception</tt></td>
    <td>Custom application exceptions, such as
  <tt>hs.exception.InvalidAddress</tt> and <tt>hs.exception.Filter</tt></td>
  </tr>
  <tr>
    <td valign="top"><tt>hs.filter</tt></td>
    <td>A unified concept called filters, which are akin to
  a Java interface that have a single method called <tt>apply()</tt>. Much of
  the system is implemented as <tt>hs.filter.Filters</tt>, which take an
  <tt>hs.model.Document</tt>, work on it, then return it. For example, the
  process of transclusion is a filter.</td>
  </tr>
  <tr>
    <td valign="top"><tt>hs.util</tt></td>
    <td>Collection of classes that provide utility to the rest
  of the system, such as <tt>hs.util.XMLFetcher</tt>, which will fetch a remote
  XML document or return it locally from it's cache if already
    loaded</td>
  </tr>
  <tr>
    <td valign="top"><tt>hs.ui</tt></td>
    <td>Package with UI chrome, seperated from the rest of the
  system so we can attach other UIs in the future</td>
  </tr>
  <tr>
    <td valign="top"><tt>hs.commands</tt></td>
    <td>Command facade that allows the UI to easily
  execute commands against the core, such as
    <tt>hs.commands.jumpItem()</tt>.</td>
  </tr>
</table>

###HOW CLASSES WORK TOGETHER

From a high-level, the process of rendering a document always follows the following process, using these classes:

<ol>
  <li>We obtain an <tt>hs.address.Address</tt>, either from the browser's
  current location (on page load), from the user typing it in, from a
  hyperlink clicked on in the document, etc.</li>
  <li>This address internally uses helper classes to tokenize a string
  address, such as the address <tt>#025.n2u!2A</tt>, into an object form that
  can be worked with and interpreted.</li>
  <li>The UI (hs.ui) calls a particular command, such as
  <tt>hs.commands.jumpItem</tt> with the hs.address.Address</li>
  <li>We call <tt>hs.address.Address.resolve()</tt></li>
  <li><tt>Resolve()</tt> works it's magic and is the heart of the
  system. Externally, we call <tt>resolve()</tt> and magically get back an
  <tt>hs.model.Document</tt> that is ready to go and display, so externally we
  are sheltered from the following which internally occurs:
    <ol>
      <li>It internally expands relative addresses against where we
  are currently located and our current state. For example, it might
  expand the relative filename <tt>../../someDir</tt> to it's full URL so we
  can work with it.</li>
      <li>It fetches the XML document in the background if we need it
  and haven't loaded it before</li>
      <li>It executes each "piece" of the address, such as <tt>025</tt> then </tt>.n</tt>
  then <tt>.2u</tt> etc. in the example above, applying them to our XML document</li>
      <li>It simplifies our viewspecs and apply's them</li>
      <li>It executes content filters</li>
    </ol>
  </li>
  <li>We can now render this document by calling
  <tt>hs.model.Document.render()</tt>; internally, this applies our rendering
  stylesheet to render the final document</li>
</ol>

Every address always follows this process. For example, if the user
does a Jump to Item with the following relative address:

    #.wBO

and they are viewing the following HyperScope document:

    http://bootstrap.org/hyarch.opml#Overview!2A:m

then we simply apply the pipeline above over and over for each
address entered by the user.

###UNIT TESTING

The HyperScope addressing, rendering, and jumping schemes can be very sophisticated and can interact in a combinatorial way to produce many complicated edge cases. There is a huge footprint for these things.

To make sure we have high quality, and can handle all of the different ways the different features can play together, we have adopted an aggresive unit testing suite. We use [JSUnit](http://www.jsunit.net/), a full JavaScript clone of JUnit complete with a DHTML test-runner, to write our unit tests. At this point there are probably thousands of discrete tests. There are unit tests across specific classes as well as integration tests at larger and larger levels to make sure things are working well together. These are all chained together into a single regression test that is run regularly across our target browsers, which are Firefox and Internet Explorer currently. All of the unit tests are written in JavaScript.

###WIREFRAMES

* [Original screencast](http://codinginparadise.org/weblog/2006/04/mockup-of-hyperscope.html)
* [Mockups](http://blueoxen.net/c/hyperscope/wireframes/20060719/index.htm)

##DESIGN RATIONALE

*Why are you using Ajax/DHTML and not a Firefox plugin or a server-side approach?*

Mainly for ease of installation.

Writing a Firefox plugin isn't necessary to do what we want to do. By using Ajax/DHTML, installing HyperScope boils down to putting some static files on your server. Using Ajax/DHTML also allows us to support other browsers, such as Internet Explorer.

The HyperScope does require a web server -- see below for details. However, it does not require a server-side application... yet. One reason we avoided implementing some of HyperScope's capabilities on the server-side was that many of its features require a fast interactive response time. One of the original insights of the Augment system was that if you speed up the amount of interaction a user can do with a system, then you can drastically improve their ability to do knowledge work.

In the future, HyperScope will need a server-side component to implement some additional capabilities, such as editing.

*Why OPML and not HTML, XOXO, semantic HTML, or your own XML file format?*

Rolling our own would have been silly. There are already good formats that meet our needs. Our goal is to bootstrap.

The reasons we did not choose HTML, XOXO, or semantic HTML are subtle. Brad did a lot of prototyping before settling on a design and discovered some issues when experimenting with an an HTML version of the file-format on the client:

* Doing HyperScope's addressing, jumping, and viewing by walking the DOM with JavaScript is very slow, especially with complex addresses
* XPath doesn't work on an HTML DOM on Internet Explorer.
* XPath will work fine with XHTML and XOXO (both XML-based), but the XPath and design becomes much more complex, because both XHTML and XOXO are verbose and do not represent the underlying hierarchy in a simple, natural way.
* Finally, applying successive viewspecs to a rendered version of a document is error prone, because you have to remember to reset parts of the DOM everytime an address, viewspec, content filter, transclusion, etc. changes. This is tricky without a more robust XML file format that is independent of the rendered view.

OPML exists and has a large community of users and tools, including editors, converters, web services etc. Although we lightly sprinkle our own namespaced attributes into the OPML document to support extra addressing types, HyperScope will work with existing, non-HyperScope OPML documents.

*Why do the full pipeline everytime?*

Brad (our lead developer) chose correctness over performance. Every relative address is converted into a fully qualified address, which has enough information to fully render it using the current state. For example, if you were to enter #.n:zA for Jump to Item after successively applying the following viewspecs on seperate occasions: y, m, B, P, g, and after jumping to node ID 023, where the current document is http://bootstrap.org/hyarch.opml, this would get expanded to be the following by hs.address.Address.resolve():

    http://bootstrap.org/hyarch.opml#023.n:ymBPgzA

We expanded the file portion from # to:

    http://bootstrap.org/hyarch.opml#

then expanded the context node to start at 023, then prepended all of our existing viewspecs before our new ones to ensure that old views are maintained even with relative links.

The pipeline internally encapsulates this complexity with the resolve() method. Since everything follows the same process, we reduce the number of code paths to get higher reliability, and we create a single place to optimize the performance which will benefit all address resolution. The unit tests work hand in hand with this to make sure we don't get regressions and handle all cases correctly.

*Why don't you support cross-domain document loading?*

The browser has a security policy that does not normally allow a document from one domain to interact with documents from another domain. In other words, you cannot open an XMLHttpRequest to a different domain than where you came from.

There is an edge condition related to transclusion that on its surface seems like it needs a traditional server-side component to get past this browser restriction. Suppose you have a document that does some transclusion on a document on another domain:

    INCLUDE "http://someotherdomain.org/foobar.opml#055"

If the HyperScope document was served from http://foobar.com, then I would get a security exception when I tried to open an XMLHttpRequest to that other domain to grab the transcluded fragment and include it at rendering time.

There are two solutions for this. The easiest/most obvious solution would be to have a simple PHP script that simply proxies the OPML file request. This has to be written carefully so you don't have a completely open proxy, but if you restrict it to just fetching XML MIME types then you are fine. HyperScope simply calls this PHP script, which lives on the same host as it was retrieved from, and the proxy contacts the external domain. This is a mature and traditional way to do things.

Another possibility would be to run several web services from some centralized server. One of them could take a third-party URL and fetch it's contents, then return it. It would basically be the PHP script described above, and would only return XML/OPML:

    http://bootstrap.org/hyperscope/proxy.php?url=http://foobar.com/arch.opml

The other web service would be a converter that would translate different file formats into HyperScope OPML documents. It would take a URL to some external content that is in some format, such as Microsoft Word, XOXO, arbitrary XML, etc., and simply convert it into HyperScope OPML on the fly and return it:

    http://bootstrap.org/hyperscope/convertor.php?url=http://w3c.org/xpath_spec.html

This PHP script would simply delegate conversion locally using tools such as a headless version of OpenOffice running locally. HyperScope would simply use these webservices to get its job done, including transclusion, document conversion, etc. Those who want to install HyperScope now don't have to install anything on the server-side except for uploading a few static files.

How can the browser call these web services with the browser security policy described above if it is served from a different host? We use something called FlashXmlHttpRequest, which Julien Couvreur created and which uses the dojo.flash library Brad created for another project. This uses a feature of flash which can call external webservices if they configure themselves correctly, which basically just means putting a simple file called crossdomain.xml at their root with some info:

    http://bootstrap.org/crossdomain.xml

Now our HyperScope client can call our webservices using FlashXmlHttpRequest, getting back normal XML/OPML that we can work with.

##RELEASE NOTES FOR 1.1

The focus for the HyperScope 1.1 release was to get a networked HTML transformer
up on the network, get our HyperScope architecture documentation up to date, and
fix various bugs.

* The big new feature for this release is an XHTML Transformer. This transformer can dynamically take HTML documents and bring them into the HyperScope.

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