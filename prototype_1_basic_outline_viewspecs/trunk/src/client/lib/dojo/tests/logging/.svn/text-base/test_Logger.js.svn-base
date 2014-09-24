/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.logging.Logger");

function test_logging_defaultInstalledHandler(){
	jum.assertTrue("test10", (dojo.logging.logQueueHandler instanceof dojo.logging.MemoryLogHandler));
	jum.assertEquals("test11", "object", (typeof dojo.logging.logQueueHandler.data));
	jum.assertTrue("test12", (dojo.logging.logQueueHandler instanceof dojo.logging.MemoryLogHandler));
	jum.assertTrue("test13", (dojo.logging.logQueueHandler.data instanceof Array));
	dojo.log.debug("dojo.log.debug() working correctly");
	jum.assertTrue("test14", (dojo.logging.logQueueHandler.data.length >= 1));
}

function test_logging_debug(){
	var msg = "dojo.log.debug() working correctly";
	dojo.log.debug(msg);
	var last = dojo.logging.logQueueHandler.data.pop();
	jum.assertEquals("test20", msg, last.message);
}

function test_logging_info(){
	var msg = "dojo.log.info() working correctly";
	dojo.log.info(msg);
	var last = dojo.logging.logQueueHandler.data.pop();
	jum.assertEquals("test30", msg, last.message);
}

function test_logging_warn(){
	var msg = "dojo.log.warn() working correctly";
	dojo.log.warn(msg);
	var last = dojo.logging.logQueueHandler.data.pop();
	jum.assertEquals("test40", msg, last.message);
}

function test_logging_err(){
	var msg = "dojo.log.err() working correctly";
	dojo.log.err(msg);
	var last = dojo.logging.logQueueHandler.data.pop();
	jum.assertEquals("test50", msg, last.message);
}

function test_logging_err(){
	var msg = "dojo.log.crit() working correctly";
	dojo.log.crit(msg);
	var last = dojo.logging.logQueueHandler.data.pop();
	jum.assertEquals("test60", msg, last.message);
}

function test_logging_exception(){
	var msg = "dojo.log.exception() working correctly";
	try{
		dj_throw("a synthetic exception");
	}catch(e){
		// catch and squelch
		dojo.log.exception(msg, e, true);
	}
	var last = dojo.logging.logQueueHandler.data.pop();
	jum.assertEquals("test70", msg, last.message.substr(0, msg.length));
}

function test_logging_log(){
	/*
	for(var x in dojo.logging){
		print(x);
	}
	print(dojo.logging.log.debug);
	*/
	// dojo.logging.log.debug("WTF?");
}
