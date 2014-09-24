/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.validate");
dojo.provide("dojo.validate.us");

dojo.validate.isText = function(value) {
	return /\S/.test(value);
}

dojo.validate.isInteger = function(value) {
	// No leading zeros allowed
	return /^[-+]?(0|[1-9]\d*)$/.test(value);	
}

dojo.validate.isNumber = function(value) {
	// Decimal part is optional, exponents are optional, trailing zeros allowed to show precision.
	return /^[-+]?(0|[1-9]\d*)(\.\d+)?([eE][-+]?(0|[1-9]\d*))?$/.test(value);	
}

dojo.validate.isEmailAddress = function(value, allowLocal, allowCruft) {
	// It's valid for an email address to contain an apostrophe.
	if (/^([\da-z]+[-._+&\'])*[\da-z]+@([\da-z][-\da-z]*[\da-z]\.)+[a-z]{2,6}$/i.test(value)) {
		return true;
	}
	// Allow local email addresses
	if ( allowLocal && /^([\da-z]+[-._+&\'])*[\da-z]+@localhost$/i.test(value) ) {
		return true;
	}
	// Allow email addresses with cruft
	if ( allowCruft && /^<?(mailto\:)?([\da-z]+[-._+&\'])*[\da-z]+@([\da-z][-\da-z]*[\da-z]\.)+[a-z]{2,6}>?$/i.test(value) ) {
		return true;
	}

	return false;
}

// FIXME: should this biggyback on isEmailAddress or just have its own RegExp?
dojo.validate.isEmailAddressList = function(value, allowLocal, allowCruft) {
	var values = value.split(/\s*[\s;,]\s*/g);
	var emails = [];
	for(var i = 0; i < values.length; i++) {
		if(dojo.string.trim(values[i]) == "") { continue; }

		if(!dojo.validate.isEmailAddress(values[i], allowLocal, allowCruft)) {
			return false;
		} else {
			emails.push(values[i]);
		}
	}
	return emails.length > 0 ? emails : false;
}

/**
	Returns true if the date conforms to the format given and is a valid date. Otherwise returns false.

	@param dateValue The date
	@param format  The format (default MM/DD/YYYY)
	@return true or false

	Accepts any type of format, including ISO8601 and RFC3339.
	All characters in the format string are treated literally except the 
	following tokens:

	YYYY - matches a 4 digit year
	M - matches a non zero-padded month
	MM - matches a zero-padded month
	D -  matches a non zero-padded date
	DD -  matches a zero-padded date
	DDD -  matches an ordinal date, 1-365, and 366 on leapyear
	ww - matches week of year, 1-53
	d - matches day of week, 1-7

	Examples: These are all today's date.

	Date					Format
	2005-W42-3		YYYY-Www-d
	2005-292			YYYY-DDD
	20051019			YYYYMMDD
	10/19/2005		M/D/YYYY
	19.10.2005		D.M.YYYY
*/
dojo.validate.isValidDate = function(dateValue, format) {
	// Default is the American format
	format = (typeof format == "undefined" || format == "") ? "MM/DD/YYYY" : format;

	// Create a literal regular expression based on format
	var reLiteral = format.replace(/([$^.*+?=!:|\/\\\(\)\[\]\{\}])/g, "\\$1");		// escape special char

	// Convert all the tokens to RE elements
	reLiteral = reLiteral.replace( "YYYY", "([0-9]{4})" );
	reLiteral = reLiteral.replace( "MM", "(0[1-9]|10|11|12)" );
	reLiteral = reLiteral.replace( "M", "([1-9]|10|11|12)" );
	reLiteral = reLiteral.replace( "DDD", "(00[1-9]|0[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6])" );
	reLiteral = reLiteral.replace( "DD", "(0[1-9]|[12][0-9]|30|31)" );
	reLiteral = reLiteral.replace( "D", "([1-9]|[12][0-9]|30|31)" );
	reLiteral = reLiteral.replace( "ww", "(0[1-9]|[1-4][0-9]|5[0-3])" );
	reLiteral = reLiteral.replace( "d", "([1-7])" );

	// Anchor pattern to begining and end of string
	reLiteral = "^" + reLiteral + "$";

	// Dynamic RE that parses the original format given
	var re = new RegExp(reLiteral);
	
	// Test if date is in a valid format
	if (!re.test(dateValue))  return false;

	// Parse date to get elements and check if date is valid
	// Assume valid values for date elements not given.
	var year = 0, month = 1, date = 1, dayofyear = 1, week = 1, day = 1;

	// Capture tokens
	var tokens = format.match( /(YYYY|MM|M|DDD|DD|D|ww|d)/g );

	// Capture date values
	var values = re.exec(dateValue);

	// Match up tokens with date values
	for (var i = 0; i < tokens.length; i++) {
		switch (tokens[i]) {
		case "YYYY":
			year = Number(values[i+1]); break;
		case "M":
		case "MM":
			month = Number(values[i+1]); break;
		case "D":
		case "DD":
			date = Number(values[i+1]); break;
		case "DDD":
			dayofyear = Number(values[i+1]); break;
		case "ww":
			week = Number(values[i+1]); break;
		case "d":
			day = Number(values[i+1]); break;
		}
	}

	// Leap years are divisible by 4, but not by 100, unless by 400
	var leapyear = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));

	// 31st of a month with 30 days
	if (date == 31 && (month == 4 || month == 6 || month == 9 || month == 11)) return false; 

	// February 30th or 31st
	if (date >= 30 && month == 2) return false; 

	// February 29th outside a leap year
	if (date == 29 && month == 2 && !leapyear) return false; 
	if (dayofyear == 366 && !leapyear)  return false;

	return true;
}

// Validates 24-hour military time format.
dojo.validate.is24HourTime = function(value) {
	// Zero-padding is required for hours, minutes, and seconds.  
	// Seconds are optional. Fractions of seconds are optional.
	return /^([0-1][0-9]|[2][0-3]):[0-5][0-9](:[0-5][0-9](\.\d+)?)?$/.test(value);	
}

// Validates 12-hour time format.
dojo.validate.is12HourTime = function(value) {
	// Zero-padding is no allowed for hours, required for minutes and seconds.
	// Seconds are optional. Fractions of seconds are optional.
	return /^([1-9]|1[0-2]):[0-5][0-9](:[0-5][0-9](\.\d+)?)?\s*(am|pm|a\.m\.|p\.m\.)$/i.test(value);	
}

// FIXME: add support for IPv6?
dojo.validate.isIpAddress = function(value) {
	// Each number is between 0-255.  Zero padding is allowed.
	return /^((\d|\d\d|[01]\d\d|2[0-4]\d|25[0-5])\.){3}(\d|\d\d|[01]\d\d|2[0-4]\d|25[0-5])$/.test(value);
}

// FIXME: is this redundant with the dojo.uri.Uri stuff
dojo.validate.isUrl = function(value) {
	// Domain name can not start or end with a dash. TLD has 2-6 letters. 
	if (/^((https?|ftps?)\:\/\/)?([\da-z][-\da-z]*[\da-z]\.)+[a-z]{2,6}(\/\S*)?$/i.test(value)) return true;

	// Otherwise 2nd chance to check for IP based URL
	return /^((https?|ftps?)\:\/\/)?((\d|\d\d|[01]\d\d|2[0-4]\d|25[0-5])\.){3}(\d|\d\d|[01]\d\d|2[0-4]\d|25[0-5])(\/\S*)?$/.test(value);
}

// Validates U.S. currency
dojo.validate.us.isCurrency = function(value) {
	// Optional plus/minus sign, optional dollar-sign, optional cents, optional commas.
	return /^[-+]?\$?(0|[1-9]\d{0,2}(,?\d\d\d)*)(\.\d\d)?$/.test(value);	
}

/**
	Validates 10 US digit phone number

	@param value The telephone number string
	@param flags  An associative array of flags and values specifying additional constraints.
		flags.ext  Possible values for telephone extension are "yes, "no", or "allow".  Default is "allow".
		flags.prefix  String that preceeds extention. Default allows "x" or "ext" or "ext." or "".
		flags.area_code  Possible values are "yes, "no", or "allow".  Default is "allow".
		flags.par  Parantheses around area code can have values of "yes, "no", or "allow".  Default is "allow".
		flags.sep  A string that specifies the seperator.  Default is "-" or "." or " ".
	@return true or false
*/
dojo.validate.us.isPhoneNumber = function(value, flags) {
	flags = (typeof flags == "object") ? flags : {};
	var ext = (typeof flags.ext == "string") ? flags.ext : "allow";
	var prefix = (typeof flags.prefix == "string") ? flags.prefix : "(x|ext\\.?)?";
	var ac = (typeof flags.area_code == "string") ? flags.area_code : "allow";
	var par = (typeof flags.par == "string") ? flags.par : "allow";
	var sep = (typeof flags.sep == "string") ? flags.sep : "[- .]";

	// build a regular expression for the area code
	var areacodeRE = "";
	if ( ac == "yes" && par == "yes" ) {
		areacodeRE = "\\(\\d{3}\\) ";
	}
	else if ( ac == "allow" && par == "yes" ) {
		areacodeRE = "(\\(\\d{3}\\) )?";
	}
	else if ( ac == "yes" && par == "no" ) {
		areacodeRE = "\\d{3}" + sep;
	}
	else if ( ac == "allow" && par == "no" ) {
		areacodeRE = "(\\d{3}" + sep + ")?";
	}
	else if ( ac == "yes" && par == "allow" ) {
		areacodeRE = "(\\(\\d{3}\\) |\\d{3}" + sep + ")";
	}
	else if ( ac == "allow" && par == "allow" ) {
		areacodeRE = "(\\(\\d{3}\\) |\\d{3}" + sep + ")?";
	}

	// build a regular expression for the local number
	var numberRE = "\\d{3}" + sep + "\\d{4}";

	// build a regular expression for the extention
	var extentionRE = "";
	if ( ext == "yes" ) {
		extentionRE = " \\s*" + prefix + "\\s*\\d{1,4}";
	}
	else if ( ext == "allow" ) {
		extentionRE = "( \\s*" + prefix + "\\s*\\d{1,4})?";
	}

	// build a regular expression for the phone number
	var phoneRE = "^" + areacodeRE + numberRE + extentionRE + "$";

	var re = new RegExp(phoneRE);
	return re.test(value);
}

// Validates social security number
dojo.validate.us.isSocialSecurityNumber = function(value) {
	// Choice of 2 separators, or no separators.
	return /^\d{3}([- ]?)\d{2}\1\d{4}$/.test(value);
}

// Validates U.S. zip-code
dojo.validate.us.isZipCode = function(value) {
	// Choice of 2 separators, or none, last 4 digits optional.
	return /^\d{5}([- ]?\d{4})?$/.test(value);
}

// Validates states and and territories of the United States in a 2 character format.
dojo.validate.us.isState = function(value) {
	return /^(AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY)$/i.test(value);
}


/**
	Procedural API Description

		The main aim is to make input validation expressible in a simple format.
		You define profiles which declare the required and optional fields and any constraints they might have.
		The results are provided as an object that makes it easy to handle missing and invalid input.

	Usage

		var results = dojo.validate.check(form, profile);

	Profile Object

		var profile = {
			// filters change the field value and are applied before validation.
			trim: ["tx1", "tx2"],
			uppercase: ["tx9"],
			lowercase: ["tx5", "tx6", "tx7"],
			ucfirst: ["tx10"],
			digit: ["tx11"],

			// required input fields that are blank will be reported missing.
			// required radio button groups and drop-down lists with no selection will be reported missing.
			// checkbox groups and selectboxes can be required to have more than one value selected.
			// List required fields by name and use this notation to require more than one value: {checkboxgroup: 2}, {selectboxname: 3}.
			required: ["tx7", "tx8", "pw1", "ta1", "rb1", "rb2", "cb3", "s1", {"doubledip":2}, {"tripledip":3}],

			// dependant/conditional fields are required if the target field is present and not blank.
			// At present only textbox, password, and textarea fields are supported.
			dependancies:	{
				cc_exp: "cc_no",	
				cc_type: "cc_no",	
			},

			// Fields can be validated using any boolean valued function.  
			// Use arrays to specify parameters in addition to the field value.
			constraints: {
				field_name1: myValidationFunction,
				field_name2: dojo.validate.isInteger,
				field_name3: [myValidationFunction, additional parameters],
				field_name4: [dojo.validate.isValidDate, "YYYY.MM.DD"],
				field_name5: [dojo.validate.isEmailAddress, false, true],
			},

			// Confirm is a sort of conditional validation.
			// It associates each field in its property list with another field whose value should be equal.
			// If the values are not equal, the field in the property list is reported as Invalid. Unless the target field is blank.
			confirm: {
				email_confirm: "email",	
				pw2: "pw1",	
			},
		};

	Results Object

		isSuccessful(): Returns true if there were no invalid or missing fields, else it returns false.
		hasMissing():  Returns true if the results contain any missing fields.
		getMissing():  Returns a list of required fields that have values missing.
		isMissing(field):  Returns true if the field is required and the value is missing.
		hasInvalid():  Returns true if the results contain fields with invalid data.
		getInvalid():  Returns a list of fields that have invalid values.
		isInvalid(field):  Returns true if the field has an invalid value.

*/

/**
  Validates user input of an HTML form based on input profile.

	@param form  The form object to be validated.
	@param profile  The input profile that specifies how the form fields are to be validated.
	@return results  An object that contains several methods summarizing the results of the validation.
*/
dojo.validate.check = function(form, profile) {
	// Essentially private properties of results object
	var missing = [];
	var invalid = [];

	// results object summarizes the validation
	var results = {
		isSuccessful: function() {return ( !this.hasInvalid() && !this.hasMissing() );},
		hasMissing: function() {return ( missing.length > 0 );},
		getMissing: function() {return missing;},
		isMissing: function(elemname) {
			for (var i = 0; i < missing.length; i++) {
				if ( elemname == missing[i] ) { return true; }
			}
			return false;
		},
		hasInvalid: function() {return ( invalid.length > 0 );},
		getInvalid: function() {return invalid;},
		isInvalid: function(elemname) {
			for (var i = 0; i < invalid.length; i++) {
				if ( elemname == invalid[i] ) { return true; }
			}
			return false;
		}
	};

	// Filters are applied before fields are validated.
	// Trim removes white space at the front and end of the fields.
	if ( profile.trim instanceof Array ) {
		for (var i = 0; i < profile.trim.length; i++) {
			var elem = form[profile.trim[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.replace(/(^\s*|\s*$)/g, "");
		}
	}
	// Convert to uppercase
	if ( profile.uppercase instanceof Array ) {
		for (var i = 0; i < profile.uppercase.length; i++) {
			var elem = form[profile.uppercase[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.toUpperCase();
		}
	}
	// Convert to lowercase
	if ( profile.lowercase instanceof Array ) {
		for (var i = 0; i < profile.lowercase.length; i++) {
			var elem = form[profile.lowercase[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.toLowerCase();
		}
	}
	// Uppercase first letter
	if ( profile.ucfirst instanceof Array ) {
		for (var i = 0; i < profile.ucfirst.length; i++) {
			var elem = form[profile.ucfirst[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.replace(/\b\w+\b/g, function(word) { return word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase(); });
		}
	}
	// Remove non digits characters from the input.
	if ( profile.digit instanceof Array ) {
		for (var i = 0; i < profile.digit.length; i++) {
			var elem = form[profile.digit[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.replace(/\D/g, "");
		}
	}

	// See if required input fields have values missing.
	if ( profile.required instanceof Array ) {
		for (var i = 0; i < profile.required.length; i++) { 
			if ( typeof profile.required[i] != "string" ) { continue; }
			var elem = form[profile.required[i]];
			// Are textbox, textarea, or password fields blank.
			if ( (elem.type == "text" || elem.type == "textarea" || elem.type == "password") && /^\s*$/.test(elem.value) ) {	
				missing[missing.length] = elem.name;
			}
			// Does drop-down box have option selected.
			else if ( (elem.type == "select-one" || elem.type == "select-multiple") && elem.selectedIndex == -1 ) {
				missing[missing.length] = elem.name;
			}
			// Does radio button group (or check box group) have option checked.
			else if ( elem instanceof Array )  {
				var checked = false;
				for (var j = 0; j < elem.length; j++) {
					if (elem[j].checked) { checked = true; }
				}
				if ( !checked ) {	
					missing[missing.length] = elem[0].name;
				}
			}
		}
	}

	// See if checkbox groups and select boxes have x number of required values.
	if ( profile.required instanceof Array ) {
		for (var i = 0; i < profile.required.length; i++) { 
			if ( typeof profile.required[i] != "object" ) { continue; }
			var elem, numRequired;
			for (var name in profile.required[i]) { 
				elem = form[name]; 
				numRequired = profile.required[i][name];
			}
			// case 1: elem is a check box group
			if ( elem instanceof Array )  {
				var checked = 0;
				for (var j = 0; j < elem.length; j++) {
					if (elem[j].checked) { checked++; }
				}
				if ( checked < numRequired ) {	
					missing[missing.length] = elem[0].name;
				}
			}
			// case 2: elem is a select box
			else if ( elem.type == "select-multiple" ) {
				var selected = 0;
				for (var j = 0; j < elem.options.length; j++) {
					if (elem.options[j].selected) { selected++; }
				}
				if ( selected < numRequired ) {	
					missing[missing.length] = elem.name;
				}
			}
		}
	}

	// Dependant fields are required when the target field is present (not blank).
	// Todo: Support dependant and target fields that are radio button groups, or select drop-down lists.
	// Todo: Make the dependancy based on a specific value of the target field.
	// Todo: allow dependant fields to have several required values, like {checkboxgroup: 3}.
	if ( typeof profile.dependancies == "object" ) {
		// properties of dependancies object are the names of dependant fields to be checked
		for (name in profile.dependancies) {
			var elem = form[name];	// the dependant element
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; } // limited support
			if ( /\S+/.test(elem.value) ) { continue; }	// has a value already
			if ( results.isMissing(elem.name) ) { continue; }	// already listed as missing
			var target = form[profile.dependancies[name]];
			if ( target.type != "text" && target.type != "textarea" && target.type != "password" ) { continue; }	// limited support
			if ( /^\s*$/.test(target.value) ) { continue; }	// skip if blank
			missing[missing.length] = elem.name;	// ok the dependant field is missing
		}
	}

	// Find invalid input fields.
	if ( typeof profile.constraints == "object" ) {
		// constraint properties are the names of fields to be validated
		for (name in profile.constraints) {
			var elem = form[name];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			// skip if blank - its optional unless required, in which case it is already listed as missing.
			if ( /^\s*$/.test(elem.value) ) { continue; }

			var isValid = true;
			// case 1: constraint value is validation function
			if ( typeof profile.constraints[name] == "function" ) {
				isValid = profile.constraints[name](elem.value);
			}
			// case 2: constraint value is array, first elem is function, tail is parameters
			else if ( profile.constraints[name] instanceof Array ) {
				var isValidSomething = profile.constraints[name][0];
				var params = profile.constraints[name].slice(1);
				params.unshift(elem.value);
				isValid = isValidSomething.apply(null, params);
			}

			if ( !isValid ) {	
				invalid[invalid.length] = elem.name;
			}
		}
	}

	// Find unequal confirm fields and report them as Invalid.
	if ( typeof profile.confirm == "object" ) {
		for (name in profile.confirm) {
			var elem = form[name];	// the confirm element
			var target = form[profile.confirm[name]];
			if ( (elem.type != "text" && elem.type != "textarea" && elem.type != "password") 
				|| target.type != elem.type 
				|| target.value == elem.value		// it's valid
				|| results.isInvalid(elem.name)	// already listed as invalid
				|| /^\s*$/.test(target.value)	)	// skip if blank - only confirm if target has a value
			{
				continue; 
			}	
			invalid[invalid.length] = elem.name;
		}
	}

	return results;
}
