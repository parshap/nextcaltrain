// jshint camelcase:false
"use strict";

var test = require("tape");
var CURRENT_YEAR = new Date().getFullYear();
var loadCaltrainSchedule = require("./async");
var isStopAtStation = require("./lib/util").isStopAtStation;
var stations = require("./stations");
var getRouteName = require("./route-name");

loadCaltrainSchedule(function(err, getSchedule) {
  if (err) {
    throw err;
  }

  test("stations", function(t) {
    stations.forEach(function(station) {
      t.ok(station);
      t.ok(station.id);
      t.ok(station.name);
      t.equal(stations.byId(station.id), station);
      t.equal(stations.search(station.name), station);
    });
    t.end();
  });

  test("route-name", function(t) {
    var VALID_ROUTE_NAMES = ["Local", "Limited", "Bullet"];
    var routes = getSchedule.store.routes;
    Object.keys(routes).forEach(function(key) {
      var routeName = getRouteName(routes[key].route_id);
      t.assert(
        getRouteName.KNOWN_ROUTE_NAMES.indexOf(routeName) !== -1,
        "should be valid route name: " + routeName
      )
    })
    t.end();
  });

  test("caltrain", function(t) {
    var getNextStop = getSchedule({
      from: "ctsf",
      to: "ctsmat",
      date: new Date(CURRENT_YEAR, 11, 1, 12),
    });
    var stop = getNextStop();

    t.assert(stop);
    t.equal(stop.serviceDate.getFullYear(), CURRENT_YEAR);
    t.equal(stop.serviceDate.getMonth(), 11);
    t.equal(stop.serviceDate.getDate(), 1);

    t.equal(stop.trip.route_id, stop.route.route_id);
    t.equal(stop.trip.service_id, stop.service.service_id);

    var firstTripStop = stop.tripStops[0];
    var lastTripStop = stop.tripStops[stop.tripStops.length - 1];

    t.equal(stop.trip.trip_id, firstTripStop.stopTime.trip_id);

    t.equal(firstTripStop.stopTime.stop_id, "70012");

    t.equal(firstTripStop.date.getFullYear(), CURRENT_YEAR);
    t.equal(firstTripStop.date.getMonth(), 11);
    t.equal(firstTripStop.date.getDate(), 1);
    t.equal(firstTripStop.date.getHours(), 12);
    t.equal(firstTripStop.date.getMinutes(), 0);

    t.assert(isStopAtStation(firstTripStop.stop, stop.fromStation));
    t.assert(isStopAtStation(lastTripStop.stop, stop.toStation));

    // Assert trip of stop times
    stop.tripStops.forEach(function(tripStop) {
      t.equal(tripStop.stopTime.trip_id, stop.trip.trip_id);
    });

    // Assert and station are same
    stop.tripStops.forEach(function(tripStop) {
      t.assert(isStopAtStation(tripStop.stop, tripStop.station));
    });

    // Assert order of dates
    stop.tripStops.slice(1).forEach(function(tripStop, index) {
      var prevTripStop = stop.tripStops[index];
      t.ok(tripStop.date >= prevTripStop.date);
    });

    t.end();
  });

  test("get multiple route types", function(t) {
    var getNextStop = getSchedule({
      from: "ctsf",
      to: "ctsj",
      date: new Date(CURRENT_YEAR, 11, 1, 12),
    });

    var seenRoutes = new Set();
    for (var i = 0; i < 20; i++) {
      var stop = getNextStop();
      seenRoutes.add(stop.route.route_id);
    }
    // Should have seen local, limited, bullet
    t.equal(seenRoutes.size, 3);
    t.ok(seenRoutes.has("Lo-130"));
    t.ok(seenRoutes.has("Li-130"));
    t.ok(seenRoutes.has("Bu-130"));
    t.end();
  });

  test("sf->sj direction=sb", function(t) {
    var getNextStop = getSchedule({
      from: "ctsf",
      to: "ctsj",
      date: new Date(CURRENT_YEAR, 11, 1, 12),
    });
    for (var i = 0; i < 20; i++) {
      var stop = getNextStop();
      t.equal(stop.direction, "SB");
    }
    t.end();
  });

  test("sj->sf direction=nb", function(t) {
    var getNextStop = getSchedule({
      from: "ctsj",
      to: "ctsf",
      date: new Date(CURRENT_YEAR, 11, 1, 12),
    });
    for (var i = 0; i < 20; i++) {
      var stop = getNextStop();
      t.equal(stop.direction, "NB");
    }
    t.end();
  });

  test("get route from every station to every other station", function(t) {
    var limitedStations = [
      "ctat",
      "ctbr",
      "ctta",
      "ctco",
    ];
    stations.forEach(function(fromStation) {
      if (limitedStations.indexOf(fromStation.id) !== -1) {
        return;
      }
      stations.forEach(function(toStation) {
        if (limitedStations.indexOf(toStation.id) !== -1) {
          return;
        }
        if (fromStation === toStation) {
          return;
        }
        else {
          var getNextStop = getSchedule({
            from: fromStation.id,
            to: toStation.id,
            date: new Date(CURRENT_YEAR, 11, 1, 12),
          });
          var stop = getNextStop();
          t.assert(stop, "route from " + fromStation.id + " to " + toStation.id);
        }
      });
    });
    t.end();
  });
});
