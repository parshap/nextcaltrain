// jshint camelcase:false
"use strict";

// ## Schedule
//
// Finds scheduled trips that include stops at `opts.from` and
// `opts.to`. A `next()` function is returned that will return a trip
// each time it is called. The first call will return the first trip
// that takes place after `opts.date` and each subsequent call will
// return the next trip chronologically by arrival_time.
//
// ### Algorithm notes:
//
// main: (stops) ->
//   stop times = Search `store.stopTimes` for `stop_id`
//   sort stop times by arrival_time
//   for each stop time (starting with first after current time)
//     service = find service (stop time)
//     if service is active today
//     return service
//
//  find service: (stop time) ->
//   trip = get stop time's trip
//   service = get trip's service
//   return service


var findStopTimeAtStation = require("./util").findStopTimeAtStation;
var isStopAtStation = require("./util").isStopAtStation;
var setDateTime = require("./date-util").setDateTime;
var cloneDate = require("./date-util").cloneDate;

module.exports = function(store, opts) {
  var fromStation = opts.from;
  var toStation = opts.to;

  // Get trips that match the given criteria, i.e., have the given stops
  // in the given order
  var trips = searchTrips(store, {
    stations: [fromStation, toStation],
  });

  // Get the stop times at the target stop on the matched trips
  var stopTimes = searchStopTimes(store, {
    trips: trips,
    station: fromStation,
  });

  if (stopTimes.length === 0) {
    console.log(trips);
    console.log(stopTimes);
    throw new Error("No route found");
  }

  return getSchedule(store, stopTimes, opts.date);
};

// ### Schedule
//

function getSchedule(store, stopTimes, date) {
  // @TODO Account for DST
  // > The time is measured from "noon minus 12h" (effectively midnight, except
  // > for days on which daylight savings time changes occur) at the beginning
  // > of the service date.
  stopTimes = stopTimes.slice();
  stopTimes.sort(compareStopArrivals);
  var day = cloneDate(date);
  day.setHours(0, 0, 0, 0);
  var index = 0;

  function increment() {
    index += 1;
    if (index >= stopTimes.length) {
      day.setDate(day.getDate() + 1);
      index = 0;
    }
  }

  function isStopActive() {
    return isStopTimeActive(store, stopTimes[index], day);
  }

  function getStop() {
    var stopTime = stopTimes[index];
    return {
      stopTime: stopTime,
      date: setDateTime(cloneDate(day), stopTime.departure_time),
      serviceDate: cloneDate(day),
    };
  }

  function next() {
    var stop = getStop();
    do {
      increment();
    } while ( ! isStopActive());
    return stop;
  }

  // Seek to date
  while (getStop().date < date) {
    next();
  }

  return next;
}

function isStopTimeActive(store, stopTime, date) {
  var service = getServiceFromStopTime(store, stopTime);
  return isServiceActive(store, service, date);
}

function getServiceFromStopTime(store, stopTime) {
  var trip = store.trips[stopTime.trip_id];
  return store.calendar[trip.service_id];
}

function isServiceActive(store, service, date) {
  // @TODO Calendar exceptions
  return isBetweenDates(date, service.start_date, service.end_date) &&
    service[getDay(date)] === "1";
}

function isBetweenDates(date, start, end) {
  return date >= parseDateStr(start) &&
    date <= parseDateStr(end);
}

function getDay(date) {
  return [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][date.getDay()];
}

// ### Search Stop Times
//
// Get stop times at the given `opts.station` that are a part of
// `opts.trips`.
//

function searchStopTimes(store, opts) {
  var stopTimes = getStopTimesAtStation(store, opts.station);
  return filterStopTimesOnTrips(stopTimes, opts.trips);
}

function getStopTimesAtStation(store, station) {
  return store.stopTimes.filter(function(stopTime) {
    var stopTimeStop = store.stops[stopTime.stop_id];
    return isStopAtStation(stopTimeStop, station);
  });
}

// ### Search Trips
//
// Get trips that include a stop at the given `opts.stops` in the given order.
//

function searchTrips(store, opts) {
  var trips = getAllTrips(store);
  return filterTripsIncludingStations(store, trips, opts.stations);
}

// Filter trips that include a stop at the given stations in order
function filterTripsIncludingStations(store, trips, stations) {
  // Filter trips with stop time at second stop
  var stopTimesByTrip = buildStopTimesByTripIndex(store.stopTimes, trips);
  return trips.filter(function(trip) {
    var stopTimes = stopTimesByTrip[trip.trip_id];
    var lastStopSequence = -1;
    // For each given stop, the trip must have a stop time and the
    // stop_sequence should be greater than the last stop
    return stations.every(function(station) {
      // Make sure there is a stop
      var stopTime = findStopTimeAtStation(store, stopTimes, station);
      if ( ! stopTime) {
        return false;
      }

      // Make sure the stop is *after* the previous stop
      var sequence = Number(stopTime.stop_sequence);
      if (sequence <= lastStopSequence) {
        return false;
      }

      lastStopSequence = sequence;
      return true;
    });
  });
}

// ### Compare Times

function compareStopArrivals(stop1, stop2) {
  return compareTimes(stop1.arrival_time, stop2.arrival_time);
}

function compareTimes(time1, time2) {
  return getSecondsFromTime(time1) - getSecondsFromTime(time2);
}

function getSecondsFromTime(time) {
  var parts = time.split(":");
  var hours = Number(parts[0]);
  var minutes = Number(parts[1]);
  var seconds = Number(parts[2]);
  return (hours * 60 * 60) + (minutes * 60) + seconds;
}

// ### Parse GTFS Date String
//
// Return a JavaScript date object.
//

function parseDateStr(str) {
  // @TODO Timezone
  var yearStr = str.slice(0, 4);
  var moStr = str.slice(4, 6);
  var dayStr = str.slice(6, 8);
  // @TODO Validate strings
  var year = Number(yearStr);
  var mo = Number(moStr) - 1;
  var day = Number(dayStr);
  return new Date(year, mo, day);
}


// ### Misc utility
//

function getAllTrips(store) {
  return mapToArray(store.trips);
}

function mapToArray(map) {
  return Object.keys(map).map(function(key) {
    return map[key];
  });
}

function includes(arr, item) {
  return arr.indexOf(item) !== -1;
}

function createGetter(prop) {
  return function(obj) {
    return obj[prop];
  };
}

function filterStopTimesOnTrips(stopTimes, trips) {
  var tripIds = trips.map(createGetter("trip_id"));
  return stopTimes.filter(function(stopTime) {
    return includes(tripIds, stopTime.trip_id);
  });
}

function buildStopTimesByTripIndex(stopTimes, trips) {
  var obj = trips.reduce(function(obj, trip) {
    obj[trip.trip_id] = [];
    return obj;
  }, {});
  return filterStopTimesOnTrips(stopTimes, trips)
    .reduce(function(obj, stopTime) {
      obj[stopTime.trip_id].push(stopTime);
      return obj;
    }, obj);
}
