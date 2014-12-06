// jshint camelcase:false
"use strict";

var test = require("tape");
var loadCaltrainSchedule = require("./async");
var isSameStopLocation = require("./lib/util").isSameStopLocation;

test("caltrain", function(t) {
  loadCaltrainSchedule(function(err, getSchedule) {
    t.ifError(err);
    var getNextStop = getSchedule({
      from: "ctsf",
      to: "ctsmat",
      date: new Date(2014, 11, 1, 12),
    });
    var stop = getNextStop();

    t.equal(stop.serviceDate.getFullYear(), 2014);
    t.equal(stop.serviceDate.getMonth(), 11);
    t.equal(stop.serviceDate.getDay(), 1);

    t.equal(stop.trip.route_id, stop.route.route_id);
    t.equal(stop.trip.service_id, stop.service.service_id);

    var firstTripStop = stop.tripStops[0];
    var lastTripStop = stop.tripStops[stop.tripStops.length - 1];

    t.equal(stop.trip.trip_id, firstTripStop.stopTime.trip_id);

    t.equal(firstTripStop.stopTime.stop_id, "70012");

    t.equal(firstTripStop.date.getFullYear(), 2014);
    t.equal(firstTripStop.date.getMonth(), 11);
    t.equal(firstTripStop.date.getDay(), 1);
    t.equal(firstTripStop.date.getHours(), 12);
    t.equal(firstTripStop.date.getMinutes(), 7);

    t.assert(isSameStopLocation(firstTripStop.stop, stop.fromStop));
    t.assert(isSameStopLocation(lastTripStop.stop, stop.toStop));

    // Assert trip of stop times
    stop.tripStops.forEach(function(tripStop) {
      t.equal(tripStop.stopTime.trip_id, stop.trip.trip_id);
    });

    // Assert and station are same
    stop.tripStops.forEach(function(tripStop) {
      t.assert(isSameStopLocation(tripStop.stop, tripStop.station));
    });

    // Assert order of dates
    stop.tripStops.slice(1).forEach(function(tripStop, index) {
      var prevTripStop = stop.tripStops[index];
      t.ok(tripStop.date >= prevTripStop.date);
    });

    t.end();
  });
});
