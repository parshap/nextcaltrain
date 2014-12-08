"use strict";

// ## Schedule Wrapper
//
// A wrapper around lib/schedule.js which performs a fuzzy search for
// `opts.from` and `opts.to`, and attaches additional related data.
//

var getSchedule = require("./schedule");
var getRelated = require("./related");
var search = require("./search-stations");
var xtend = require("xtend");

module.exports = function(store, opts) {
  var options = xtend(opts, {
    from: search(opts.from),
    to: search(opts.to),
  });

  if ( ! options.from) {
    throw createStopNotFoundError("Could not find stop " + opts.from);
  }

  if ( ! options.to) {
    throw createStopNotFoundError("Could not find stop " + opts.to);
  }

  var getNextStop = getSchedule(store, options);
  return function() {
    var stop = getNextStop();
    return getRelated(store, stop, options);
  };
};

function createStopNotFoundError(message) {
  var err = new Error(message);
  err.code = "STOP_NOT_FOUND";
  return err;
}
