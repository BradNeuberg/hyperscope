/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.require("dojo.validate");

function test_validate_isText(){
	jum.assertTrue("test1", dojo.validate.isText('            x'));
	jum.assertTrue("test2", dojo.validate.isText('x             '));
	jum.assertTrue("test3", dojo.validate.isText('        x     '));
	jum.assertFalse("test4", dojo.validate.isText('   '));
	jum.assertFalse("test5", dojo.validate.isText(''));
}

function test_validate_isInteger(){
	jum.assertTrue("test1", dojo.validate.isInteger('0'));
	jum.assertTrue("test2", dojo.validate.isInteger('+0'));
	jum.assertTrue("test3", dojo.validate.isInteger('-1'));
	jum.assertTrue("test4", dojo.validate.isInteger('123456789'));
	jum.assertFalse("test5", dojo.validate.isInteger('0123456789'));
	jum.assertFalse("test6", dojo.validate.isInteger('00'));
	jum.assertFalse("test7", dojo.validate.isInteger('1.0'));
}

function test_validate_isNumber(){
	jum.assertTrue("test1", dojo.validate.isNumber('0'));
	jum.assertTrue("test2", dojo.validate.isNumber('+0'));
	jum.assertTrue("test3", dojo.validate.isNumber('-1'));
	jum.assertTrue("test4", dojo.validate.isNumber('123456789'));
	jum.assertFalse("test5", dojo.validate.isNumber('0123456789'));
	jum.assertFalse("test6", dojo.validate.isNumber('00'));
	jum.assertTrue("test7", dojo.validate.isNumber('1.0'));
	jum.assertTrue("test8", dojo.validate.isNumber('0.0000'));
	jum.assertFalse("test9", dojo.validate.isNumber('1.'));
	jum.assertTrue("test10", dojo.validate.isNumber('1234.0012340e63'));
	jum.assertTrue("test11", dojo.validate.isNumber('1234.0012340e+63'));
	jum.assertTrue("test12", dojo.validate.isNumber('1234.0012340e-63'));
	jum.assertFalse("test13", dojo.validate.isNumber('1234.0012340e063'));
	jum.assertFalse("test14", dojo.validate.isNumber('1234.0012340e63.5'));
	jum.assertFalse("test14", dojo.validate.isNumber('01234.0012340e10'));
}

function test_validate_isEmailAddress(){
	jum.assertTrue("test1", dojo.validate.isEmailAddress('x@yahoo.com'));
	jum.assertTrue("test2", dojo.validate.isEmailAddress('x.y.z.w@yahoo.com'));
	jum.assertFalse("test3", dojo.validate.isEmailAddress('x..y.z.w@yahoo.com'));
	jum.assertFalse("test4", dojo.validate.isEmailAddress('x.@yahoo.com'));
	jum.assertFalse("test5", dojo.validate.isEmailAddress('x@z.com'));
	jum.assertFalse("test6", dojo.validate.isEmailAddress('x@yahoo.x'));
	jum.assertTrue("test7", dojo.validate.isEmailAddress('x@yahoo.museum'));
	jum.assertTrue("test8", dojo.validate.isEmailAddress("o'mally@yahoo.com"));
	jum.assertFalse("test9", dojo.validate.isEmailAddress("'mally@yahoo.com"));
	jum.assertTrue("test10", dojo.validate.isEmailAddress("fred&barney@stonehenge.com"));
	jum.assertFalse("test11", dojo.validate.isEmailAddress("fred&&barney@stonehenge.com"));

	// local addresses
	jum.assertTrue("test12", dojo.validate.isEmailAddress("fred&barney@localhost", true));
	jum.assertFalse("test13", dojo.validate.isEmailAddress("fred&barney@localhost"));

	// addresses with cruft
	jum.assertTrue("test14", dojo.validate.isEmailAddress("mailto:fred&barney@stonehenge.com",false, true));
	jum.assertTrue("test15", dojo.validate.isEmailAddress("<fred&barney@stonehenge.com>",false, true));
	jum.assertFalse("test16", dojo.validate.isEmailAddress("mailto:fred&barney@stonehenge.com"));
	jum.assertFalse("test17", dojo.validate.isEmailAddress("<fred&barney@stonehenge.com>"));
}

function test_validate_isValidDate(){
	
	// Month date year
	jum.assertTrue("test1", dojo.validate.isValidDate("08/06/2005", "MM/DD/YYYY"));
	jum.assertTrue("test2", dojo.validate.isValidDate("08.06.2005", "MM.DD.YYYY"));
	jum.assertTrue("test3", dojo.validate.isValidDate("08-06-2005", "MM-DD-YYYY"));
	jum.assertTrue("test4", dojo.validate.isValidDate("8/6/2005", "M/D/YYYY"));
	jum.assertTrue("test5", dojo.validate.isValidDate("8/6", "M/D"));
	jum.assertFalse("test6", dojo.validate.isValidDate("09/31/2005", "MM/DD/YYYY"));
	jum.assertFalse("test7", dojo.validate.isValidDate("02/29/2005", "MM/DD/YYYY"));
	jum.assertTrue("test8", dojo.validate.isValidDate("02/29/2004", "MM/DD/YYYY"));

	// year month date
	jum.assertTrue("test9", dojo.validate.isValidDate("2005-08-06", "YYYY-MM-DD"));
	jum.assertTrue("test10", dojo.validate.isValidDate("20050806", "YYYYMMDD"));

	// year month
	jum.assertTrue("test11", dojo.validate.isValidDate("2005-08", "YYYY-MM"));
	jum.assertTrue("test12", dojo.validate.isValidDate("200508", "YYYYMM"));

	// year
	jum.assertTrue("test13", dojo.validate.isValidDate("2005", "YYYY"));

	// year week day
	jum.assertTrue("test14", dojo.validate.isValidDate("2005-W42-3", "YYYY-Www-d"));
	jum.assertTrue("test15", dojo.validate.isValidDate("2005W423", "YYYYWwwd"));
	jum.assertFalse("test16", dojo.validate.isValidDate("2005-W42-8", "YYYY-Www-d"));
	jum.assertFalse("test17", dojo.validate.isValidDate("2005-W54-3", "YYYY-Www-d"));

	// year week
	jum.assertTrue("test18", dojo.validate.isValidDate("2005-W42", "YYYY-Www"));
	jum.assertTrue("test19", dojo.validate.isValidDate("2005W42", "YYYYWww"));

	// year ordinal-day
	jum.assertTrue("test20", dojo.validate.isValidDate("2005-292", "YYYY-DDD"));
	jum.assertTrue("test21", dojo.validate.isValidDate("2005292", "YYYYDDD"));
	jum.assertFalse("test22", dojo.validate.isValidDate("2005-366", "YYYY-DDD"));
	jum.assertTrue("test23", dojo.validate.isValidDate("2004-366", "YYYY-DDD"));

	// date month year
	jum.assertTrue("test24", dojo.validate.isValidDate("19.10.2005", "DD.MM.YYYY"));
	jum.assertTrue("test25", dojo.validate.isValidDate("19-10-2005", "D-M-YYYY"));
}

function test_validate_is24HourTime(){
	jum.assertTrue("test1", dojo.validate.is24HourTime('02:03:59'));
	jum.assertTrue("test2", dojo.validate.is24HourTime('02:53:59.990'));
	jum.assertTrue("test3", dojo.validate.is24HourTime('02:53'));
	jum.assertFalse("test4", dojo.validate.is24HourTime('2:03:59'));
	jum.assertFalse("test5", dojo.validate.is24HourTime('02:3:59'));
	jum.assertFalse("test6", dojo.validate.is24HourTime('02:03:5'));
	jum.assertFalse("test7", dojo.validate.is24HourTime('24:03:59'));
	jum.assertFalse("test8", dojo.validate.is24HourTime('02:60:59'));
	jum.assertFalse("test9", dojo.validate.is24HourTime('02:03:60'));
}

function test_validate_is12HourTime(){
	jum.assertTrue("test1", dojo.validate.is12HourTime('5:15 p.m.'));
	jum.assertTrue("test2", dojo.validate.is12HourTime('5:15:05 pm'));
	jum.assertTrue("test3", dojo.validate.is12HourTime('5:15:05.50 pm'));
	jum.assertFalse("test4", dojo.validate.is12HourTime('05:15:05 pm'));
	jum.assertFalse("test5", dojo.validate.is12HourTime('5:5:05 pm'));
	jum.assertFalse("test6", dojo.validate.is12HourTime('5:15:5 pm'));
	jum.assertFalse("test7", dojo.validate.is12HourTime('13:15:05 pm'));
	jum.assertFalse("test8", dojo.validate.is12HourTime('5:60:05 pm'));
	jum.assertFalse("test9", dojo.validate.is12HourTime('5:15:60 pm'));
	jum.assertTrue("test10", dojo.validate.is12HourTime('5:59:05 pm'));
	jum.assertTrue("test11", dojo.validate.is12HourTime('5:15:59 pm'));
	jum.assertFalse("test12", dojo.validate.is12HourTime('5:15:05'));
}

function test_validate_isIpAddress(){
	jum.assertTrue("test1", dojo.validate.isIpAddress('0.1.10.100'));
	jum.assertTrue("test2", dojo.validate.isIpAddress('000.001.010.100'));
	jum.assertTrue("test3", dojo.validate.isIpAddress('255.255.255.255'));
	jum.assertFalse("test4", dojo.validate.isIpAddress('256.255.255.255'));
	jum.assertFalse("test5", dojo.validate.isIpAddress('255.256.255.255'));
	jum.assertFalse("test6", dojo.validate.isIpAddress('255.255.256.255'));
	jum.assertFalse("test7", dojo.validate.isIpAddress('255.255.255.256'));
}

function test_validate_isUrl(){
	jum.assertTrue("test1", dojo.validate.isUrl('www.yahoo.com'));
	jum.assertTrue("test2", dojo.validate.isUrl('http://www.yahoo.com'));
	jum.assertTrue("test3", dojo.validate.isUrl('https://www.yahoo.com'));
	jum.assertFalse("test4", dojo.validate.isUrl('http://.yahoo.com'));
	jum.assertFalse("test5", dojo.validate.isUrl('http://www.-yahoo.com'));
	jum.assertFalse("test6", dojo.validate.isUrl('http://www.yahoo-.com'));
	jum.assertTrue("test7", dojo.validate.isUrl('http://y-a---h-o-o.com'));
	jum.assertFalse("test8", dojo.validate.isUrl('http://www.y.com'));
	jum.assertTrue("test9", dojo.validate.isUrl('http://www.yahoo.museum'));
	jum.assertTrue("test10", dojo.validate.isUrl('http://www.yahoo.co.uk'));
	jum.assertFalse("test11", dojo.validate.isUrl('http://www.micro$oft.com'));
}

function test_validate_isCurrency(){
	jum.assertTrue("test1", dojo.validate.us.isCurrency('+$1000'));
	jum.assertTrue("test2", dojo.validate.us.isCurrency('1000'));
	jum.assertTrue("test3", dojo.validate.us.isCurrency('$1000.25'));
	jum.assertTrue("test4", dojo.validate.us.isCurrency('$1,000.25'));
	jum.assertTrue("test5", dojo.validate.us.isCurrency('$1,000,000'));
	jum.assertTrue("test6", dojo.validate.us.isCurrency('$10,000,000'));
	jum.assertTrue("test7", dojo.validate.us.isCurrency('$100,000,000'));
	jum.assertFalse("test8", dojo.validate.us.isCurrency('$10,0000,000'));
	jum.assertFalse("test9", dojo.validate.us.isCurrency('$1000,000,00'));
	jum.assertFalse("test10", dojo.validate.us.isCurrency('$10,000,0000'));
}

function test_validate_isPhoneNumber(){
	jum.assertTrue("test1", dojo.validate.us.isPhoneNumber('(111) 111-1111'));
	jum.assertTrue("test2", dojo.validate.us.isPhoneNumber('(111) 111 1111'));
	jum.assertTrue("test3", dojo.validate.us.isPhoneNumber('111 111 1111'));
	jum.assertTrue("test4", dojo.validate.us.isPhoneNumber('111.111.1111'));
	jum.assertTrue("test5", dojo.validate.us.isPhoneNumber('111-111-1111'));
	jum.assertFalse("test6", dojo.validate.us.isPhoneNumber('111/111/1111'));
	jum.assertTrue("test7", dojo.validate.us.isPhoneNumber('111-1111'));

	// test extensions
	jum.assertTrue("test8", dojo.validate.us.isPhoneNumber('111-111-1111 ext. 1234'));
	jum.assertTrue("test9", dojo.validate.us.isPhoneNumber('111-111-1111 ext 1234'));
	jum.assertTrue("test10", dojo.validate.us.isPhoneNumber('111-111-1111 x1234'));
	jum.assertFalse("test11", dojo.validate.us.isPhoneNumber('111-111-1111 ext. 1234', {ext: "no"}));
	jum.assertTrue("test12", dojo.validate.us.isPhoneNumber('111-111-1111 tel ext. 1234', {prefix: "tel ext."}));

	// test area codes
	jum.assertTrue("test13", dojo.validate.us.isPhoneNumber('111-1111 ext. 1234'));
	jum.assertFalse("test14",  dojo.validate.us.isPhoneNumber('111-1111 ext 1234', {area_code: "yes"}));
	jum.assertTrue("test15", dojo.validate.us.isPhoneNumber('(111) 111-1111 x1234'));
	jum.assertFalse("test16", dojo.validate.us.isPhoneNumber('(111) 111-1111 ext. 1234', {area_code: "no"}));
	jum.assertFalse("test17", dojo.validate.us.isPhoneNumber('(111) 111-1111 ext. 1234', {par: "no"}));
	jum.assertTrue("test18", dojo.validate.us.isPhoneNumber('111-111-1111 ext. 1234', {par: "no"}));

	// test seperator
	jum.assertTrue("test19", dojo.validate.us.isPhoneNumber('111.111.1111 x1234', {sep: "."}));
	jum.assertFalse("test20", dojo.validate.us.isPhoneNumber('111.111.1111 x1234', {sep: "-"}));
	jum.assertTrue("test21", dojo.validate.us.isPhoneNumber('(111) 111-1111 x1234', {sep: "-"}));
	jum.assertFalse("test22", dojo.validate.us.isPhoneNumber('(111)-111-1111 x1234', {sep: "-"}));
	jum.assertTrue("test23", dojo.validate.us.isPhoneNumber('1111111111 x1234', {sep: ""}));
	jum.assertTrue("test24", dojo.validate.us.isPhoneNumber('(111) 111 1111 x1234', {sep: " ", par: "yes"}));
}

function test_validate_isSocialSecurityNumber(){
	jum.assertTrue("test1", dojo.validate.us.isSocialSecurityNumber('123-45-6789'));
	jum.assertTrue("test2", dojo.validate.us.isSocialSecurityNumber('123 45 6789'));
	jum.assertTrue("test3", dojo.validate.us.isSocialSecurityNumber('123456789'));
	jum.assertFalse("test4", dojo.validate.us.isSocialSecurityNumber('123-45 6789'));
	jum.assertFalse("test5", dojo.validate.us.isSocialSecurityNumber('12345 6789'));
	jum.assertFalse("test6", dojo.validate.us.isSocialSecurityNumber('123-456789'));
}

function test_validate_isZipCode(){
	jum.assertTrue("test1", dojo.validate.us.isZipCode('12345-6789'));
	jum.assertTrue("test2", dojo.validate.us.isZipCode('12345 6789'));
	jum.assertTrue("test3", dojo.validate.us.isZipCode('123456789'));
	jum.assertTrue("test4", dojo.validate.us.isZipCode('12345'));
}

function test_validate_isState(){
	jum.assertTrue("test1", dojo.validate.us.isState('NE'));
	jum.assertTrue("test2", dojo.validate.us.isState('ne'));
	jum.assertTrue("test3", dojo.validate.us.isState('CA'));
	jum.assertTrue("test4", dojo.validate.us.isState('Wa'));
}

function test_validate_check(){
	// A generic form
	var f = {
		// textboxes
		tx1: {type: "text", value: " 1001 ",  name: "tx1"},
		tx2: {type: "text", value: " x",  name: "tx2"},
		tx3: {type: "text", value: "10/19/2005",  name: "tx3"},
		tx4: {type: "text", value: "10/19/2005",  name: "tx4"},
		tx5: {type: "text", value: "Foo@Localhost",  name: "tx5"},
		tx6: {type: "text", value: "Foo@Localhost",  name: "tx6"},
		tx7: {type: "text", value: "<Foo@Gmail.Com>",  name: "tx7"},
		tx8: {type: "text", value: "   ",  name: "tx8"},
		tx9: {type: "text", value: "ca",  name: "tx9"},
		tx10: {type: "text", value: "homer SIMPSON",  name: "tx10"},
		tx11: {type: "text", value: "$1,000,000 (US)",  name: "tx11"},
		cc_no: {type: "text", value: "5434 1111 1111 1111",  name: "cc_no"},
		cc_exp: {type: "text", value: "",  name: "cc_exp"},
		cc_type: {type: "text", value: "Visa",  name: "cc_type"},
		email: {type: "text", value: "foo@gmail.com",  name: "email"},
		email_confirm: {type: "text", value: "foo2@gmail.com",  name: "email_confirm"},
		// password
		pw1: {type: "password", value: "123456",  name: "pw1"},
		pw2: {type: "password", value: "123456",  name: "pw2"},
		// textarea - they have a type property, even though no html attribute
		ta1: {type: "textarea", value: "",  name: "ta1"},
		ta2: {type: "textarea", value: "",  name: "ta2"},
		// radio button groups
		rb1: [
			{type: "radio", value: "v0",  name: "rb1", checked: false},
			{type: "radio", value: "v1",  name: "rb1", checked: false},
			{type: "radio", value: "v2",  name: "rb1", checked: true}
		],
		rb2: [
			{type: "radio", value: "v0",  name: "rb2", checked: false},
			{type: "radio", value: "v1",  name: "rb2", checked: false},
			{type: "radio", value: "v2",  name: "rb2", checked: false}
		],
		rb3: [
			{type: "radio", value: "v0",  name: "rb3", checked: false},
			{type: "radio", value: "v1",  name: "rb3", checked: false},
			{type: "radio", value: "v2",  name: "rb3", checked: false}
		],
		// checkboxes
		cb1: {type: "checkbox", value: "cb1",  name: "cb1", checked: false},
		cb2: {type: "checkbox", value: "cb2",  name: "cb2", checked: false},
		// checkbox group with the same name
		cb3: [
			{type: "checkbox", value: "v0",  name: "cb3", checked: false},
			{type: "checkbox", value: "v1",  name: "cb3", checked: false},
			{type: "checkbox", value: "v2",  name: "cb3", checked: false}
		],
		doubledip: [
			{type: "checkbox", value: "vanilla",  name: "doubledip", checked: false},
			{type: "checkbox", value: "chocolate",  name: "doubledip", checked: false},
			{type: "checkbox", value: "chocolate chip",  name: "doubledip", checked: false},
			{type: "checkbox", value: "lemon custard",  name: "doubledip", checked: true},
			{type: "checkbox", value: "pistachio almond",  name: "doubledip", checked: false},
		],		
		// <select>
		s1: {
			type: "select-one", 
			name: "s1",
			selectedIndex: -1,
			options: [
				{text: "option 1", value: "v0", selected: false},
				{text: "option 2", value: "v1", selected: false},
				{text: "option 3", value: "v2", selected: false},
			]
		},
		// <select multiple>
		s2: {
			type: "select-multiple", 
			name: "s2",
			selectedIndex: 1,
			options: [
				{text: "option 1", value: "v0", selected: false},
				{text: "option 2", value: "v1", selected: true},
				{text: "option 3", value: "v2", selected: true},
			]
		},
		tripledip: {
			type: "select-multiple", 
			name: "tripledip",
			selectedIndex: 3,
			options: [
				{text: "option 1", value: "vanilla", selected: false},
				{text: "option 2", value: "chocolate", selected: false},
				{text: "option 3", value: "chocolate chip", selected: false},
				{text: "option 4", value: "lemon custard", selected: true},
				{text: "option 5", value: "pistachio almond", selected: true},
				{text: "option 6", value: "mocha almond chip", selected: false},
			],
		},
	};

	// Profile for form input
	var profile = {
		// filters
		trim: ["tx1", "tx2"],
		uppercase: ["tx9"],
		lowercase: ["tx5", "tx6", "tx7"],
		ucfirst: ["tx10"],
		digit: ["tx11"],
		// required fields
		required: ["tx2", "tx3", "tx4", "tx5", "tx6", "tx7", "tx8", "pw1", "ta1", "rb1", "rb2", "cb3", "s1", "s2", 
			{"doubledip":2}, {"tripledip":3} ],
		// dependant/conditional fields
		dependancies:	{
			cc_exp: "cc_no",	
			cc_type: "cc_no",	
		},
		// validated fields
		constraints: {
			tx1: dojo.validate.isInteger,
			tx2: dojo.validate.isInteger,
			tx3: [dojo.validate.isValidDate, "MM/DD/YYYY"],
			tx4: [dojo.validate.isValidDate, "YYYY.MM.DD"],
			tx5: [dojo.validate.isEmailAddress],
			tx6: [dojo.validate.isEmailAddress, true],
			tx7: [dojo.validate.isEmailAddress, false, true],
			tx8: dojo.validate.isURL,
		},
		// confirm fields
		confirm: {
			email_confirm: "email",	
			pw2: "pw1",	
		},
	};

	// results object
	var results = dojo.validate.check(f, profile);

	// test filter stuff
	jum.assertEquals("trim_test1", "1001", f.tx1.value );
	jum.assertEquals("trim_test2", "x", f.tx2.value );
	jum.assertEquals("uc_test1", "CA", f.tx9.value );
	jum.assertEquals("lc_test1", "foo@localhost", f.tx5.value );
	jum.assertEquals("lc_test2", "foo@localhost", f.tx6.value );
	jum.assertEquals("lc_test3", "<foo@gmail.com>", f.tx7.value );
	jum.assertEquals("ucfirst_test1", "Homer Simpson", f.tx10.value );
	jum.assertEquals("digit_test1", "1000000", f.tx11.value );

	// test missing stuff
	jum.assertFalse("missing_test1", results.isSuccessful() );
	jum.assertTrue("missing_test2", results.hasMissing() );
	jum.assertFalse("missing_test3", results.isMissing("tx1") );
	jum.assertFalse("missing_test4", results.isMissing("tx2") );
	jum.assertFalse("missing_test5", results.isMissing("tx3") );
	jum.assertFalse("missing_test6", results.isMissing("tx4") );
	jum.assertFalse("missing_test7", results.isMissing("tx5") );
	jum.assertFalse("missing_test8", results.isMissing("tx6") );
	jum.assertFalse("missing_test9", results.isMissing("tx7") );
	jum.assertTrue("missing_test10", results.isMissing("tx8") );
	jum.assertFalse("missing_test11", results.isMissing("pw1") );
	jum.assertFalse("missing_test12", results.isMissing("pw2") );
	jum.assertTrue("missing_test13", results.isMissing("ta1") );
	jum.assertFalse("missing_test14", results.isMissing("ta2") );
	jum.assertFalse("missing_test15", results.isMissing("rb1") );
	jum.assertTrue("missing_test16", results.isMissing("rb2") );
	jum.assertFalse("missing_test17", results.isMissing("rb3") );
	jum.assertTrue("missing_test18", results.isMissing("cb3") );
	jum.assertTrue("missing_test17", results.isMissing("s1") );
	jum.assertFalse("missing_test20", results.isMissing("s2") );
	jum.assertTrue("missing_test21", results.isMissing("doubledip") );
	jum.assertTrue("missing_test22", results.isMissing("tripledip") );
	jum.assertFalse("missing_test23", results.isMissing("cc_no") );
	jum.assertTrue("missing_test24", results.isMissing("cc_exp") );
	jum.assertFalse("missing_test25", results.isMissing("cc_type") );
	// missing: tx8, ta1, rb2, cb3, s1, doubledip, tripledip, cc_exp
	jum.assertEquals("missing_test26", 8, results.getMissing().length );

	// test constraint stuff
	jum.assertTrue("invalid_test1", results.hasInvalid() );
	jum.assertFalse("invalid_test2", results.isInvalid("tx1") );
	jum.assertTrue("invalid_test3", results.isInvalid("tx2") );
	jum.assertFalse("invalid_test4", results.isInvalid("tx3") );
	jum.assertTrue("invalid_test5", results.isInvalid("tx4") );
	jum.assertTrue("invalid_test6", results.isInvalid("tx5") );
	jum.assertFalse("invalid_test7", results.isInvalid("tx6") );
	jum.assertFalse("invalid_test8", results.isInvalid("tx7") );
	jum.assertFalse("invalid_test9", results.isInvalid("tx8") );
	jum.assertFalse("invalid_test10", results.isInvalid("pw1") );
	jum.assertFalse("invalid_test11", results.isInvalid("pw2") );
	jum.assertFalse("invalid_test12", results.isInvalid("ta1") );
	jum.assertFalse("invalid_test13", results.isInvalid("ta2") );
	jum.assertFalse("invalid_test14", results.isInvalid("email") );
	jum.assertTrue("invalid_test15", results.isInvalid("email_confirm") );
	// invlaid: txt2, txt4, txt5, email_confirm
	jum.assertEquals("invalid_test16", 4, results.getInvalid().length );
}
