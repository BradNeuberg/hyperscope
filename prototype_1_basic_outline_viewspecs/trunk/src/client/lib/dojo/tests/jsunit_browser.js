/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.uri.*");
dj_eval(dojo.hostenv.getText(new dojo.uri.dojoUri("testtools/JsTestManager/jsunit_wrap.js")));
var _jum = jum;

var jum = {
	isBrowser: true, // so dojo can easily differentiate

	debug: function() {
		var dbg = djConfig.isDebug;
		djConfig.isDebug = true;
		dojo.debug.apply(dj_global, arguments);
		djConfig.isDebug = dbg;
	},

	assertTrue: function() {
		try {
			_jum.assertTrue.apply(_jum, arguments);
		} catch(e) {
			jum.debug(e.message);
		}
	},

	assertFalse: function() {
		try {
			_jum.assertFalse.apply(_jum, arguments);
		} catch(e) {
			jum.debug(e.message);
		}
	},

	assertEquals: function() {
		try {
			_jum.assertEquals.apply(_jum, arguments);
		} catch(e) {
			jum.debug(e.message);
		}
	}
};

