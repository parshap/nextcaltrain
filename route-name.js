"use strict";

module.exports = function getRouteName(routeId) {
  var name = routeId.slice(0, 2);
  if (name === "Lo") {
    return "Local";
  }
  else if (name === "Li") {
    return "Limited";
  }
  else if (name === "bu") {
    return "Bullet";
  }
  else {
    return routeId;
  }
};
