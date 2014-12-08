"use strict";

var extend = require("xtend/mutable");

function Store() {
  this.agency = {};
  this.stops = {};
  this.routes = {};
  this.trips = {};
  this.calendar = {};
  this.calendarDates = [];
  this.stopTimes = [];
}

extend(Store.prototype, {
  insertAgency: function(agency) {
    insertObject(this.agency, agency, "agency_id");
  },

  insertStop: function(stop) {
    insertObject(this.stops, stop, "stop_id");
  },

  insertRoute: function(stop) {
    insertObject(this.routes, stop, "route_id");
  },

  insertTrip: function(stop) {
    insertObject(this.trips, stop, "trip_id");
  },

  insertCalendar: function(service) {
    insertObject(this.calendar, service, "service_id");
  },

  insertCalendarDate: function(calendarDate) {
    this.calendarDates.push(calendarDate);
  },

  insertStopTime: function(stopTime) {
    this.stopTimes.push(stopTime);
  },
});

function insertObject(objects, object, key) {
  var id = object[key];
  if (objects[id] != null) {
    throw new Error("Key already exists");
  }
  objects[id] = object;
}

module.exports = Store;
