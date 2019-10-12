"use strict";

var KNOWN_ROUTE_NAMES = [
  "Local",
  "Limited",
  "Bullet",
  "Special",
  "TaSJ-Shuttle",
  "Bus Bridge",
]

module.exports = function getRouteName(route) {
  return route.route_short_name;
};

module.exports.KNOWN_ROUTE_NAMES = KNOWN_ROUTE_NAMES;
