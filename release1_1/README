HyperScope v1.1
===============

The HyperScope is a high-performance thought processor that enables
you to navigate, view, and link to documents in sophisticated
ways. It's the brainchild of Doug Engelbart, the inventor of hypertext
and the mouse, and is the first step towards his larger vision for an
Open Hyperdocument System.

The HyperScope is written in JavaScript using the Dojo toolkit and
works in Firefox (recommended) and Internet Explorer. It uses OPML as
its base file format. It is open source and available under the GPL.
(See LICENSE for more information.)

MORE INFORMATION
----------------

See the documents in the docs directory for more information on
installing, configuring, and using the HyperScope.

More information is available on our web site at:

  http://hyperscope.org/

CREDITS
-------

Brad Neuberg <bkn3@columbia.edu> created the HyperScope code and 
architecture; if you find a bug or have an idea for a feature
feel free to contact him.  The team responsible for the HyperScope vision, architecture, 
and overall implementation (including supplementary code) includes:

  * Doug Engelbart
  * Christina Engelbart
  * Eugene Eric Kim
  * Jonathan Cheyer
  * Brad Neuberg
  * Adam Cheyer
  * Les Orchard
  * Matthew O'Connor
  * John Sechrest
  * Rick Boardman

with many additional contributions from our great community.  We hope
you'll join us!

RELEASE NOTES FOR 1.1
=====================
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