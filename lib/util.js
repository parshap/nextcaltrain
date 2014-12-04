// jshint camelcase:false
"use strict";

// ### Find Stop Time At Stop
//

var find = require("array-find");

function findStopTimeAtStop(store, stopTimes, stopId) {
  // @TODO What if there are multiple stop times at the stop?
  var stop = store.stops[stopId];
  return find(stopTimes, function(stopTime) {
    var stopTimeStop = store.stops[stopTime.stop_id];
    return isSameStopLocation(stop, stopTimeStop);
  });
}

// ### Is Same Stop Location
//
// Determine if the two stops are the same stop or share the same parent
// station.
//

function isSameStopLocation(stop1, stop2) {
  return stop1.stop_id === stop2.stop_id ||
    stop1.parent_station === stop2.stop_id ||
    stop1.stop_id === stop2.parent_station ||
    stop1.parent_station === stop2.parent_station;
}

// ### Get Stop Station
//

function getStopStation(store, stopId) {
  var stop = store.stops[stopId];
  if (stop.parent_station) {
    return store.stops[stop.parent_station];
  }
  return stop;
}

// ## Exports

module.exports.findStopTimeAtStop = findStopTimeAtStop;
module.exports.isSameStopLocation = isSameStopLocation;
module.exports.getStopStation = getStopStation;
