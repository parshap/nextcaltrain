"use strict";

var async = require("async");
var fs = require("fs");
var csv = require("csv-parser");

module.exports = function(store, dataPath, callback) {
  var tasks = [
    loadAgency,
    loadStops,
    loadRoutes,
    loadTrips,
    loadCalendar,
    loadCalendarDates,
    loadStopTimes,
  ].map(function(loadFn) {
    // @TODO calendar-dates.txt
    // @TODO stop-times.txt
    return loadFn.bind(null, store, dataPath);
  });
  async.parallel(tasks, callback);
};

function loadAgency(store, dataPath, callback) {
  loadObjects(
    dataPath + "/agency.txt",
    store.insertAgency.bind(store),
    callback
  );
}

function loadStops(store, dataPath, callback) {
  loadObjects(
    dataPath + "/stops.txt",
    store.insertStop.bind(store),
    callback
  );
}

function loadRoutes(store, dataPath, callback) {
  loadObjects(
    dataPath + "/routes.txt",
    store.insertRoute.bind(store),
    callback
  );
}

function loadTrips(store, dataPath, callback) {
  loadObjects(
    dataPath + "/trips.txt",
    store.insertTrip.bind(store),
    callback
  );
}

function loadCalendar(store, dataPath, callback) {
  loadObjects(
    dataPath + "/calendar.txt",
    store.insertCalendar.bind(store),
    callback
  );
}

function loadCalendarDates(store, dataPath, callback) {
  loadObjects(
    dataPath + "/calendar_dates.txt",
    store.insertCalendarDate.bind(store),
    callback
  );
}

function loadStopTimes(store, dataPath, callback) {
  loadObjects(
    dataPath + "/stop_times.txt",
    store.insertStopTime.bind(store),
    callback
  );
}

function loadObjects(dataPath, insertFn, callback) {
  readCSVFile(dataPath)
    .on("data", insertFn)
    .on("error", callback)
    .on("end", callback);
}

function readCSVFile(file) {
  return fs.createReadStream(file)
    .pipe(csv());
}
