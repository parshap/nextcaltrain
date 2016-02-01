// jshint camelcase:false
"use strict";

require('array.prototype.findindex');
var getTripStops = require("./trip-stops");
var stations = require("../stations");

function getRelatedData(store, scheduledStop, opts) {
  var tripStops = getTripStops(store, scheduledStop, opts.from, opts.to);
  return {
    fromStation: opts.from,
    toStation: opts.to,
    tripStops: tripStops,
    serviceDate: scheduledStop.serviceDate,
    trip: store.trips[scheduledStop.stopTime.trip_id],
    route: getRouteFromStopTime(store, scheduledStop.stopTime),
    service: getServiceFromStopTime(store, scheduledStop.stopTime),
    agency: store.agency,
    direction: getRouteDirection(opts.from, opts.to),
  };
}

function getRouteDirection(fromStation, toStation) {
  var fromIndex = stations.findIndex(function(station) {
    return station.id === fromStation.id;
  });
  var toIndex = stations.findIndex(function(station) {
    return station.id === toStation.id;
  });
  if (fromIndex < toIndex) {
    return "SB";
  }
  else if (toIndex < fromIndex) {
    return "NB";
  }
}


function getRouteFromStopTime(store, stopTime) {
  var trip = store.trips[stopTime.trip_id];
  return store.routes[trip.route_id];
}

function getServiceFromStopTime(store, stopTime) {
  var trip = store.trips[stopTime.trip_id];
  return store.calendar[trip.service_id];
}

module.exports = getRelatedData;
