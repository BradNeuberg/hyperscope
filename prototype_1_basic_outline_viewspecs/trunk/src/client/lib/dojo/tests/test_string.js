/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.string");

// NOTE: these tests are mostly a port from test_string.html

function test_string_trim(){
	var ws = " This has some white space at the ends! Oh no!    ";
	var trimmed = "This has some white space at the ends! Oh no!";
	jum.assertEquals("test10", trimmed, dojo.string.trim(ws));
}

function test_string_paramString(){
	var ps = "This %{string} has %{parameters} %{toReplace}";
	var ps1 = dojo.string.paramString(ps, { string: "area", parameters: "foo"});
	jum.assertEquals("test20", "This area has foo %{toReplace}", ps1);

	var ps2 = dojo.string.paramString(ps, { string: "area", parameters: "foo"}, true);
	jum.assertEquals("test30", "This area has foo ", ps2);
}

function test_string_isBlank(){
	jum.assertTrue("test40", dojo.string.isBlank('   '));
	jum.assertFalse("test50", dojo.string.isBlank('            x'));
	jum.assertFalse("test60", dojo.string.isBlank('x             '));
	jum.assertTrue("test70", dojo.string.isBlank(''));
	jum.assertTrue("test80", dojo.string.isBlank(null));
	jum.assertTrue("test90", dojo.string.isBlank(new Array()));
}

function test_string_capitalize(){
	jum.assertEquals("test100", 'This Is A Bunch Of Words', dojo.string.capitalize('this is a bunch of words'));
	jum.assertEquals("test110", 'Word', dojo.string.capitalize('word'));
	jum.assertEquals("test120", '   ', dojo.string.capitalize('   '));
	jum.assertEquals("test130", '', dojo.string.capitalize(''));
	jum.assertEquals("test140", '', dojo.string.capitalize(null));
	jum.assertEquals("test150", '', dojo.string.capitalize(new Array()));
	jum.assertEquals("test160", "This One Has  Extra   Space", dojo.string.capitalize("this one has  extra   space"));
}

function test_string_escape() {
	// TODO: vary the tests a bit more :)
	// xml | html
	jum.assertEquals("test200", '&lt;body bgcolor=&quot;#ffcc00&quot;&gt;&amp; becomes &amp;amp; y&#39;all!',
		dojo.string.escape("xml", '<body bgcolor="#ffcc00">& becomes &amp; y\'all!'));
	jum.assertEquals("test201", '&lt;body bgcolor=&quot;#ffcc00&quot;&gt;&amp; becomes &amp;amp; y&#39;all!',
		dojo.string.escape("html", '<body bgcolor="#ffcc00">& becomes &amp; y\'all!'));
	jum.assertEquals("test202", '&lt;body bgcolor=&quot;#ffcc00&quot;&gt;&amp; becomes &amp;amp; y&#39;all!',
		dojo.string.escapeXml('<body bgcolor="#ffcc00">& becomes &amp; y\'all!'));
	// sql
	jum.assertEquals("test210", "Hey y''all! How is it ''''going''''?",
		dojo.string.escape("sql", "Hey y'all! How is it ''going''?"));
	jum.assertEquals("test210", "Hey y''all! How is it ''''going''''?",
		dojo.string.escapeSql("Hey y'all! How is it ''going''?"));
	// regexp
	jum.assertEquals("test220", "wrong \\\\ divide",
		dojo.string.escape("regexp", "wrong \\ divide"));
	jum.assertEquals("test221", "wrong \\\\ divide",
		dojo.string.escape("regex", "wrong \\ divide"));
	jum.assertEquals("test222", "wrong \\\\ divide",
		dojo.string.escapeRegExp("wrong \\ divide"));
	// js
	jum.assertEquals("test230", "I have \\\"quotes\\\" of various \\'types\\'",
		dojo.string.escape("javascript", "I have \"quotes\" of various 'types'"));
	jum.assertEquals("test231", "I have \\\"quotes\\\" of various \\'types\\'",
		dojo.string.escape("js", "I have \"quotes\" of various 'types'"));
	jum.assertEquals("test232", "I have \\\"quotes\\\" of various \\'types\\'",
		dojo.string.escapeJavaScript("I have \"quotes\" of various 'types'"));
}

function test_string_summary() {
	jum.assertEquals("test300", "Every good boy do...",
		dojo.string.summary("Every good boy does fine", 17));
	jum.assertEquals("test300", "Hey Mr...",
		dojo.string.summary("Hey Mr. Jones", 6));
	jum.assertEquals("test300", "I like candy",
		dojo.string.summary("I like candy", 30));
}
