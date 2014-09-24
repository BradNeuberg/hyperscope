/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.html.DatePicker");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DatePicker");
dojo.require("dojo.event.*");
dojo.require("dojo.html");

/*
	Some assumptions:
	- I'm planning on always showing 42 days at a time, and we can scroll by week,
	not just by month or year
	- To get a sense of what month to highlight, I basically initialize on the 
	first Saturday of each month, since that will be either the first of two or 
	the second of three months being partially displayed, and then I work forwards 
	and backwards from that point.
	Currently, I assume that dates are stored in the RFC 3339 format,
	because I find it to be most human readable and easy to parse
	http://www.faqs.org/rfcs/rfc3339.html: 		2005-06-30T08:05:00-07:00
	FIXME: scroll by week not yet implemented
*/


dojo.widget.html.DatePicker = function(){
	dojo.widget.DatePicker.call(this);
	dojo.widget.HtmlWidget.call(this);

	var _this = this;
	// today's date, JS Date object
	this.today = "";
	// selected date, JS Date object
	this.date = "";
	// rfc 3339 date
	this.storedDate = "";
	// date currently selected in the UI, stored in year, month, date in the format that will be actually displayed
	this.currentDate = {};
	// stored in year, month, date in the format that will be actually displayed
	this.firstSaturday = {};
	this.classNames = {
		previous: "previousMonth",
		current: "currentMonth",
		next: "nextMonth",
		currentDate: "currentDate",
		selectedDate: "selectedItem"
	}

	this.templatePath =  dojo.uri.dojoUri("src/widget/templates/HtmlDatePicker.html");
	this.templateCssPath = dojo.uri.dojoUri("src/widget/templates/HtmlDatePicker.css");
	
	this.fillInTemplate = function(){
		this.initData();
		this.initUI();
	}
	
	this.initData = function() {
		this.today = new Date();
		if(this.storedDate && (this.storedDate.split("-").length > 2)) {
			this.date = this.fromRfcDate(this.storedDate);
		} else {
			this.date = this.today;
		}
		// calendar math is simplified if time is set to 0
		this.today.setHours(0);
		this.date.setHours(0);
		var month = this.date.getMonth();
		this.initFirstSaturday(this.date.getMonth().toString(), this.date.getFullYear());
	}
	
	this.setDate = function(rfcDate) {
		this.storedDate = rfcDate;
	}
	
	this.toRfcDate = function(jsDate) {
		if(!jsDate) {
			jsDate = this.today;
		}
		var year = jsDate.getFullYear();
		var month = jsDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month.toString();
		}
		var date = jsDate.getDate();
		if (date < 10) {
			date = "0" + date.toString();
		}
		// because this is a date picker and not a time picker, we treat time 
		// as zero
		return year + "-" + month + "-" + date + "T00:00:00+00:00";
	}
	
	this.fromRfcDate = function(rfcDate) {
		var tempDate = rfcDate.split("-");
		if(tempDate.length < 3) {
			return new Date();
		}
		// fullYear, month, date
		return new Date(parseInt(tempDate[0]), (parseInt(tempDate[1], 10) - 1), parseInt(tempDate[2].substr(0,2), 10));
	}
	
	this.initFirstSaturday = function(month, year) {
		if(!month) {
			month = this.date.getMonth();
		}
		if(!year) {
			year = this.date.getFullYear();
		}
		var firstOfMonth = new Date(year, month, 1);
		this.firstSaturday.year = year;
		this.firstSaturday.month = month;
		this.firstSaturday.date = 7 - firstOfMonth.getDay();
	}
	
	this.initUI = function() {
		this.selectedIsUsed = false;
		this.currentIsUsed = false;
		var currentClassName = "";
		var previousDate = new Date();
		var calendarNodes = this.calendarDatesContainerNode.getElementsByTagName("td");
		var currentCalendarNode;
		// set hours of date such that there is no chance of rounding error due to 
		// time change in local time zones
		previousDate.setHours(8);
		var nextDate = new Date(this.firstSaturday.year, this.firstSaturday.month, this.firstSaturday.date, 8);

		
		if(this.firstSaturday.date < 7) {
			// this means there are days to show from the previous month
			var dayInWeek = 6;
			for (var i=this.firstSaturday.date; i>0; i--) {
				currentCalendarNode = calendarNodes.item(dayInWeek);
				currentCalendarNode.innerHTML = nextDate.getDate();
				dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "current"));
				dayInWeek--;
				previousDate = nextDate;
				nextDate = this.incrementDate(nextDate, false);
			}
			for(var i=dayInWeek; i>-1; i--) {
				currentCalendarNode = calendarNodes.item(i);
				currentCalendarNode.innerHTML = nextDate.getDate();
				dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "previous"));
				previousDate = nextDate;
				nextDate = this.incrementDate(nextDate, false);				
			}
		} else {
			nextDate.setDate(0);
			for(var i=0; i<7; i++) {
				currentCalendarNode = calendarNodes.item(i);
				currentCalendarNode.innerHTML = i + 1;
				dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "current"));
				previousDate = nextDate;
				nextDate = this.incrementDate(nextDate, true);				
			}
		}
		previousDate.setDate(this.firstSaturday.date);
		previousDate.setMonth(this.firstSaturday.month);
		previousDate.setFullYear(this.firstSaturday.year);
		nextDate = this.incrementDate(previousDate, true);
		var count = 7;
		currentCalendarNode = calendarNodes.item(count);
		while((nextDate.getMonth() == previousDate.getMonth()) && (count<42)) {
			currentCalendarNode.innerHTML = nextDate.getDate();
			dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "current"));
			currentCalendarNode = calendarNodes.item(++count);
			previousDate = nextDate;
			nextDate = this.incrementDate(nextDate, true);
		}
		
		while(count < 42) {
			currentCalendarNode.innerHTML = nextDate.getDate();
			dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "next"));
			currentCalendarNode = calendarNodes.item(++count);
			previousDate = nextDate;
			nextDate = this.incrementDate(nextDate, true);
		}
		this.setMonthLabel(this.firstSaturday.month);
		this.setYearLabels(this.firstSaturday.year);
	}
	
	this.incrementDate = function(date, bool) {
		// bool: true to increase, false to decrease
		var time = date.getTime();
		var increment = 1000 * 60 * 60 * 24;
		time = (bool) ? (time + increment) : (time - increment);
		var returnDate = new Date();
		returnDate.setTime(time);
		return returnDate;
	}
	
	this.incrementWeek = function(date, bool) {
		dojo.unimplemented('dojo.widget.html.DatePicker.incrementWeek');
	}

	this.incrementMonth = function(date, bool) {
		dojo.unimplemented('dojo.widget.html.DatePicker.incrementMonth');
	}

	this.incrementYear = function(date, bool) {
		dojo.unimplemented('dojo.widget.html.DatePicker.incrementYear');
	}

	this.onIncrementDate = function(evt) {
		dojo.unimplemented('dojo.widget.html.DatePicker.onIncrementDate');
	}
	
	this.onIncrementWeek = function(evt) {
		// FIXME: should make a call to incrementWeek when that is implemented
		evt.stopPropagation();
		dojo.unimplemented('dojo.widget.html.DatePicker.onIncrementWeek');
		switch(evt.target) {
			case this.increaseWeekNode:
				break;
			case this.decreaseWeekNode:
				break;
		}
	}

	this.onIncrementMonth = function(evt) {
		// FIXME: should make a call to incrementMonth when that is implemented
		evt.stopPropagation();
		var month = this.firstSaturday.month;
		var year = this.firstSaturday.year;
		switch(evt.currentTarget) {
			case this.increaseMonthNode:
				if(month < 11) {
					month++;
				} else {
					month = 0;
					year++;
					
					this.setYearLabels(year);
				}
				break;
			case this.decreaseMonthNode:
				if(month > 0) {
					month--;
				} else {
					month = 11;
					year--;
					this.setYearLabels(year);
				}
				break;
			case this.increaseMonthNode.getElementsByTagName("img").item(0):
				if(month < 11) {
					month++;
				} else {
					month = 0;
					year++;
					this.setYearLabels(year);
				}
				break;
			case this.decreaseMonthNode.getElementsByTagName("img").item(0):
				if(month > 0) {
					month--;
				} else {
					month = 11;
					year--;
					this.setYearLabels(year);
				}
				break;
		}
		this.initFirstSaturday(month.toString(), year);
		this.initUI();
	}
	
	this.onIncrementYear = function(evt) {
		// FIXME: should make a call to incrementYear when that is implemented
		evt.stopPropagation();
		var year = this.firstSaturday.year;
		switch(evt.target) {
			case this.nextYearLabelNode:
				year++;
				break;
			case this.previousYearLabelNode:
				year--;
				break;
		}
		this.initFirstSaturday(this.firstSaturday.month.toString(), year);
		this.initUI();
	}

	this.setMonthLabel = function(monthIndex) {
		this.monthLabelNode.innerHTML = this.months[monthIndex];
	}
	
	this.setYearLabels = function(year) {
		this.previousYearLabelNode.innerHTML = year - 1;
		this.currentYearLabelNode.innerHTML = year;
		this.nextYearLabelNode.innerHTML = year + 1;
	}
	
	this.getDateClassName = function(date, monthState) {
		var currentClassName = this.classNames[monthState];
		if ((!this.selectedIsUsed) && (date.getDate() == this.date.getDate()) && (date.getMonth() == this.date.getMonth()) && (date.getFullYear() == this.date.getFullYear())) {
			currentClassName = this.classNames.selectedDate + " " + currentClassName;
			this.selectedIsUsed = 1;
		}
		if((!this.currentIsUsed) && (date.getDate() == this.today.getDate()) && (date.getMonth() == this.today.getMonth()) && (date.getFullYear() == this.today.getFullYear())) {
			currentClassName = currentClassName + " "  + this.classNames.currentDate;
			this.currentIsUsed = 1;
		}
		return currentClassName;
	}

	this.onClick = function(evt) {
		dojo.event.browser.stopEvent(evt)
	}
	
	this.onSetDate = function(evt) {
		dojo.event.browser.stopEvent(evt);
		this.selectedIsUsed = 0;
		this.todayIsUsed = 0;
		var month = this.firstSaturday.month;
		var year = this.firstSaturday.year;
		if (dojo.html.hasClass(evt.target, this.classNames["next"])) {
			month = ++month % 12;
			// if month is now == 0, add a year
			year = (month==0) ? ++year : year;
		} else if (dojo.html.hasClass(evt.target, this.classNames["previous"])) {
			month = --month % 12;
			// if month is now == 0, add a year
			year = (month==11) ? --year : year;
		}
		this.date = new Date(year, month, evt.target.innerHTML);
		this.setDate(this.toRfcDate(this.date));
		this.initUI();
	}
}
dojo.inherits(dojo.widget.html.DatePicker, dojo.widget.HtmlWidget);
