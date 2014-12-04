"use strict";

// ## Find Relationship
//
// Searches the store for objects with the given relationship.
//
// Used for debugging and development.
//

module.exports.search = function(store, rel) {
  return {
    agency: searchMap(store.agency, rel)[0],
    stops: searchMap(store.stops, rel)[0],
    routes: searchMap(store.routes, rel)[0],
    trips: searchMap(store.trips, rel)[0],
    calendar: searchMap(store.calendar, rel)[0],
    calendarDates: searchArray(store.calendarDates, rel)[0],
    stopTimes: searchArray(store.stopTimes, rel)[0],
  };
};

function searchMap(map, rel) {
  var arr = Object.keys(map).map(function(key) {
    return map[key];
  });
  return searchArray(arr, rel);
}

function searchArray(arr, rel) {
  return arr.filter(function(obj) {
    return obj[rel] != null;
  });
}
