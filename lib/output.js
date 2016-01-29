// jshint camelcase:false
"use strict";

// ## Output
//
// Format a scheduled stop (as returned by ./index.js) for console output.
//

module.exports.heading = function(from, to) {
  return [
    "From: ",
    formatStationName(from),
    "\n",
    "To:   ",
    formatStationName(to),
    "\n",
  ].join("");
};

module.exports.trip = function(stop) {
  var firstTripStop = stop.tripStops[0];
  var lastTripStop = stop.tripStops[stop.tripStops.length - 1];
  var tripShortName = stop.trip.trip_short_name;
  return [
    [
      formatTime(firstTripStop.date),
      " – ",
      formatTime(lastTripStop.date),
      "\n",
      tripShortName && [
        formatTripDirection(stop.trip),
        " ",
        tripShortName,
        " ",
      ].join(""),
      formatRouteName(stop.route),
      ", ",
      formatDuration(lastTripStop.date - firstTripStop.date),
      ", ",
      (stop.tripStops.length - 1),
      " stops"
    ].join(""),

    stop.tripStops.map(function(tripStop) {
      return [
        " >",
        formatTime(tripStop.date),
        formatStationName(tripStop.station),
      ].join(" ");
    }).join("\n"),
  ].join("\n");
};

function formatRouteName(route) {
  var name = route.route_short_name ||
    route.route_long_name ||
    route.route_id;
  name = name && name.toLowerCase();
  if (name === "baby bullet" || name === "bullet" ) {
    return "Bullet";
  }
  else if (name === "limited") {
    return "Limited";
  }
  else if (name === "local") {
    return "Local";
  }
}

function formatTripDirection(trip) {
  return trip.direction === 1 ? "NB" : "SB";
}

function formatStationName(station) {
  return station.name;
}

function formatDuration(ms) {
  var minutes = ms / 1000 / 60;
  return Math.round(minutes) + " min";
}

// ## Format Time
//

function formatTime(date) {
  return [
    formatHours(date.getHours()),
    ":",
    formatMinutes(date.getMinutes()),
    getAmPm(date),
  ].join("");
}

function getAmPm(date) {
  if (date.getHours() >= 12) {
    return "pm";
  }
  else {
    return "am";
  }
}

function formatHours(hours) {
  if (hours > 12) {
    hours -= 12;
  }
  if (hours === 0) {
    hours = 12;
  }
  return String(hours);
}

function formatMinutes(minutes) {
  return padTimePart(String(minutes));
}

function padTimePart(part) {
  if (part.length < 2) {
    return "0" + part;
  }
  return part;
}
