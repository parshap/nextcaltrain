// jshint camelcase:false
"use strict";

// ### Find Stop Time At Stop
//

var find = require("array-find");

function findStopTimeAtStation(store, stopTimes, station) {
  // @TODO What if there are multiple stop times at the stop?
  return find(stopTimes, function(stopTime) {
    var stopTimeStop = store.stops[stopTime.stop_id];
    return isStopAtStation(stopTimeStop, station);
  });
}

function isStopAtStation(stop, station) {
  return station.stop_ids.indexOf(stop.stop_id) !== -1;
}

// ### Is Same Stop Location
//
// Determine if the two stops are the same stop or share the same parent
// station.
//

// ## Exports
//

module.exports.findStopTimeAtStation = findStopTimeAtStation;
module.exports.isStopAtStation = isStopAtStation;
