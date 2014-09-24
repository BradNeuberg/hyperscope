/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.date");

function test_date_fromIso8601Date () {
	
	//YYYY-MM-DD
	var date = dojo.date.fromIso8601Date("2005-08-22");
	jum.assertEquals("test1", 2005, date.getFullYear());
	jum.assertEquals("test2", 7, date.getMonth());
	jum.assertEquals("test3", 22, date.getDate());
	
	//YYYYMMDD
	var date = dojo.date.fromIso8601Date("20050822");
	jum.assertEquals("test4", 2005, date.getFullYear());
	jum.assertEquals("test5", 7, date.getMonth());
	jum.assertEquals("test6", 22, date.getDate());
	
	//YYYY-MM
	var date = dojo.date.fromIso8601Date("2005-08");
	jum.assertEquals("test7", 2005, date.getFullYear());
	jum.assertEquals("test8", 7, date.getMonth());
	
	//YYYYMM
	var date = dojo.date.fromIso8601Date("200508");
	jum.assertEquals("test9", 2005, date.getFullYear());
	jum.assertEquals("test10", 7, date.getMonth());
	
	//YYYY
	var date = dojo.date.fromIso8601Date("2005");
	jum.assertEquals("test11", 2005, date.getFullYear());
	
	//1997-W01 or 1997W01
	var date = dojo.date.fromIso8601Date("2005-W22");
	jum.assertEquals("test12", 2005, date.getFullYear());
	jum.assertEquals("test13", 5, date.getMonth());
	jum.assertEquals("test14", 6, date.getDate());

	var date = dojo.date.fromIso8601Date("2005W22");
	jum.assertEquals("test15", 2005, date.getFullYear());
	jum.assertEquals("test16", 5, date.getMonth());
	jum.assertEquals("test17", 6, date.getDate());
	
	//1997-W01-2 or 1997W012
	var date = dojo.date.fromIso8601Date("2005-W22-4");
	jum.assertEquals("test18", 2005, date.getFullYear());
	jum.assertEquals("test19", 5, date.getMonth());
	jum.assertEquals("test20", 9, date.getDate());

	var date = dojo.date.fromIso8601Date("2005W224");
	jum.assertEquals("test21", 2005, date.getFullYear());
	jum.assertEquals("test22", 5, date.getMonth());
	jum.assertEquals("test23", 9, date.getDate());

		
	//1995-035 or 1995035
	var date = dojo.date.fromIso8601Date("2005-146");
	jum.assertEquals("test24", 2005, date.getFullYear());
	jum.assertEquals("test25", 4, date.getMonth());
	jum.assertEquals("test26", 26, date.getDate());
	
	var date = dojo.date.fromIso8601Date("2005146");
	jum.assertEquals("test27", 2005, date.getFullYear());
	jum.assertEquals("test28", 4, date.getMonth());
	jum.assertEquals("test29", 26, date.getDate());
	
}

function test_date_fromIso8601Time () {
	
	//23:59:59
	var date = dojo.date.fromIso8601Time("18:46:39");
	jum.assertEquals("test1", 18, date.getHours());
	jum.assertEquals("test2", 46, date.getMinutes());
	jum.assertEquals("test3", 39, date.getSeconds());
	
	//235959
	var date = dojo.date.fromIso8601Time("184639");
	jum.assertEquals("test4", 18, date.getHours());
	jum.assertEquals("test5", 46, date.getMinutes());
	jum.assertEquals("test6", 39, date.getSeconds());
	
	//23:59, 2359, or 23
	var date = dojo.date.fromIso8601Time("18:46");
	jum.assertEquals("test7", 18, date.getHours());
	jum.assertEquals("test8", 46, date.getMinutes());

	var date = dojo.date.fromIso8601Time("1846");
	jum.assertEquals("test10", 18, date.getHours());
	jum.assertEquals("test11", 46, date.getMinutes());

	var date = dojo.date.fromIso8601Time("18");
	jum.assertEquals("test13", 18, date.getHours());

	//23:59:59.9942 or 235959.9942
	var date = dojo.date.fromIso8601Time("18:46:39.9942");
	jum.assertEquals("test16", 18, date.getHours());
	jum.assertEquals("test17", 46, date.getMinutes());
	jum.assertEquals("test18", 39, date.getSeconds());
	jum.assertEquals("test19", 994, date.getMilliseconds());

	var date = dojo.date.fromIso8601Time("184639.9942");
	jum.assertEquals("test20", 18, date.getHours());
	jum.assertEquals("test21", 46, date.getMinutes());
	jum.assertEquals("test22", 39, date.getSeconds());
	jum.assertEquals("test23", 994, date.getMilliseconds());
	
	//1995-02-04 24:00 = 1995-02-05 00:00
	
	//TODO: timezone tests
	
	//+hh:mm, +hhmm, or +hh
	
	//-hh:mm, -hhmm, or -hh
	
}

