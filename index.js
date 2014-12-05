// jshint camelcase:false
"use strict";

// ## Load Store
//

var load = require("./lib/load");
var Store = require("./lib/store");

function loadStore(dataPath, callback) {
  var store = new Store();
  load(store, dataPath, function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, store);
  });
}

// ## Exports
//
// A wrapper around lib/schedule.js which includes loading data, calculating
// the next scheduled stop, and attaching additional related data.
//

var getSchedule = require("./lib/schedule");
var getTripStops = require("./lib/trip-stops");

module.exports = function(callback) {
  loadStore(__dirname + "/data", function(err, store) {
    if (err) {
      return callback(err);
    }
    callback(null, getScheduleWrapper.bind(null, store));
  });
};

function getScheduleWrapper(store, opts) {
  var getNextStop = getSchedule(store, opts);
  return function() {
    var stop = getNextStop();
    return {
      fromStop: store.stops[opts.from],
      toStop: store.stops[opts.to],
      tripStops: getTripStops(store, stop, opts.from, opts.to),
      serviceDate: stop.serviceDate,
      trip: store.trips[stop.stopTime.trip_id],
      route: getRouteFromStopTime(store, stop.stopTime),
      service: getServiceFromStopTime(store, stop.stopTime),
      agency: store.agency,
    };
  };
}

function getRouteFromStopTime(store, stopTime) {
  var trip = store.trips[stopTime.trip_id];
  return store.routes[trip.route_id];
}

function getServiceFromStopTime(store, stopTime) {
  var trip = store.trips[stopTime.trip_id];
  return store.calendar[trip.service_id];
}
