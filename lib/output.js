// jshint camelcase:false
"use strict";

// ## Output
//
// Format a scheduled stop (as returned by ./index.js) for console output.
//

module.exports = function(stop) {
  var firstTripStop = stop.tripStops[0];
  var lastTripStop = stop.tripStops[stop.tripStops.length - 1];
  var headsign = firstTripStop.stop.platform_code;
  return [
    [
      "From: ",
      formatStopName(firstTripStop.stop),
      "\n",
      "To:   ",
      formatStopName(lastTripStop.stop),
      "\n\n",
      formatTime(firstTripStop.date),
      " – ",
      formatTime(lastTripStop.date),
      "\n",
      headsign,
      " ",
      stop.trip.trip_short_name,
      " ",
      stop.route.route_long_name,
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
        formatStopName(tripStop.station),
      ].join(" ");
    }).join("\n"),
  ].join("\n");
};

function formatStopName(stop) {
  return stop.stop_name
    .replace(" Caltrain Station", "")
    .replace(" Caltrain", "");
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
