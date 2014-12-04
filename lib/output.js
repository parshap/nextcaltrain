// jshint camelcase:false
"use strict";

module.exports = function(desc, tripStops) {
  console.log([
    formatTime(desc.date),
    desc.route.route_long_name + " Train " + desc.trip.trip_short_name,
  ].join(", "));

  console.log(
    formatDuration(tripStops[tripStops.length - 1].date - tripStops[0].date),
    "(" + (tripStops.length - 1) + " stops)"
  );

  tripStops.forEach(function(tripStop) {
    console.log(
      " >",
      formatTime(tripStop.date),
      tripStop.station.stop_name
    );
  });
};

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
    " ",
    getAmPm(date),
  ].join("");
}

function getAmPm(date) {
  if (date.getHours() > 12) {
    return "PM";
  }
  else {
    return "AM";
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
