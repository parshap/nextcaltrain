"use strict";

var Store = require("./lib/store");

// ## Load Schedule
//
// A wrapper around lib/schedule.js which includes loading schedule data,
// calculating the next scheduled stop, and attaching additional related data.
//

var extend = require("xtend/mutable");

var store = new Store();
extend(store, require("./data.json"));
module.exports = require("./lib/schedule-wrapper").bind(null, store);
module.exports.store = store;
