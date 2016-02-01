// jshint camelcase:false
"use strict";

var find = require("array-find");
var stations = require("../stations");
var findStopTimeAtStation = require("./util").findStopTimeAtStation;
var setDateTime = require("./date-util").setDateTime;
var cloneDate = require("./date-util").cloneDate;
var util = require("./util");

module.exports = function(store, scheduledStop, fromStation, toStation) {
  var stopTimes = getStopTimesFromTrip(store, scheduledStop.stopTime.trip_id);
  var startStopTime = findStopTimeAtStation(store, stopTimes, fromStation);
  var endStopTime = findStopTimeAtStation(store, stopTimes, toStation);
  if ( ! startStopTime) {
    throw new Error("Start stop not found");
  }
  if ( ! endStopTime) {
    throw new Error("End stop not found");
  }
  var startSequence = getStopTimeSequence(startStopTime);
  var endSequence = getStopTimeSequence(endStopTime);
  // Filter only stops that are in between the start and end
  stopTimes = stopTimes.filter(function(stopTime) {
    var sequence = getStopTimeSequence(stopTime);
    return sequence >= startSequence && sequence <= endSequence;
  });
  stopTimes.sort(compareStopSequences);
  return stopTimes.map(function(stopTime) {
    var stop = store.stops[stopTime.stop_id];
    return {
      date: setDateTime(cloneDate(scheduledStop.serviceDate), stopTime.arrival_time),
      stopTime: stopTime,
      stop: stop,
      station: getStopStation(stop),
    };
  });
};

function getStopStation(stop) {
  return find(stations, function(station) {
    return util.isStopAtStation(stop, station);
  });
}

function getStopTimeSequence(stopTime) {
  return Number(stopTime.stop_sequence);
}

function compareStopSequences(stopTime1, stopTime2) {
  return Number(stopTime1.stop_sequence) - Number(stopTime2.stop_sequence);
}

function getStopTimesFromTrip(store, tripId) {
  return store.stopTimes.filter(function(stopTime) {
    return stopTime.trip_id === tripId;
  });
}
