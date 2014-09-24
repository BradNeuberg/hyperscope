/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */// compat fixes for BUFakeDom.js and the JUM implementation:
var bu_alert = (typeof this.alert != 'undefined') ? this.alert : (this.load && this.print ? this.print : function() {});
