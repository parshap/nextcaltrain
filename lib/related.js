// jshint camelcase:false
"use strict";

var getTripStops = require("./trip-stops");

function getRelatedData(store, scheduledStop, opts) {
  return {
    fromStop: store.stops[opts.from],
    toStop: store.stops[opts.to],
    tripStops: getTripStops(store, scheduledStop, opts.from, opts.to),
    serviceDate: scheduledStop.serviceDate,
    trip: store.trips[scheduledStop.stopTime.trip_id],
    route: getRouteFromStopTime(store, scheduledStop.stopTime),
    service: getServiceFromStopTime(store, scheduledStop.stopTime),
    agency: store.agency,
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

module.exports = getRelatedData;
