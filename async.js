// jshint camelcase:false
"use strict";

var load = require("./lib/load");
var Store = require("./lib/store");

// ## Load Schedule Async
//
// A wrapper around lib/schedule.js which includes loading schedule data,
// calculating the next scheduled stop, and attaching additional related data.
//

var getScheduleWrapper = require("./lib/schedule-wrapper");

module.exports = function(callback) {
  var store = new Store();
  load(store, __dirname + "/data", function(err) {
    if (err) {
      return callback(err);
    }
    var ret = getScheduleWrapper.bind(null, store);
    ret.store = store;
    callback(null, ret);
  });
};
