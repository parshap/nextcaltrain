"use strict";

var Store = require("./lib/store");

// ## Load Schedule
//
// A wrapper around lib/schedule.js which includes loading schedule data,
// calculating the next scheduled stop, and attaching additional related data.
//

var extend = require("extend-object");
var getSchedule = require("./lib/schedule");
var getRelated = require("./lib/related");

function getScheduleWrapper(store, opts) {
  var getNextStop = getSchedule(store, opts);
  return function() {
    var stop = getNextStop();
    return getRelated(store, stop, opts);
  };
}

var store = new Store();
extend(store, require("./data.json"));
module.exports = getScheduleWrapper.bind(null, store);
module.exports.store = store;
