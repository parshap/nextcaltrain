"use strict";

require("string.prototype.startswith")

var KNOWN_ROUTE_NAMES = [
  "Local",
  "Limited",
  "Bullet",
  "Shuttle",
  "Special",
]

module.exports = function getRouteName(routeId) {
  var name = routeId.toLowerCase()
  if (name.startsWith("lo")) {
    return "Local";
  }
  else if (name.startsWith("li-")) {
    return "Limited";
  }
  else if (name.startsWith("bu-")) {
    return "Bullet";
  }
  else if (name.startsWith("tasj-")) {
    return "Shuttle";
  }
  else if (name.startsWith("gi-")) {
    return "Special";
  }
  else if (name.startsWith("sp-")) {
    return "Special";
  }
  else {
    return routeId;
  }
};

module.exports.KNOWN_ROUTE_NAMES = KNOWN_ROUTE_NAMES;
