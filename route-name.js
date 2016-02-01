"use strict";

module.exports = function getRouteName(routeId) {
  return {
    "SHUTTLE": "Shuttle",
    "LOCAL": "Local",
    "LIMITED": "Limited",
    "BABY BULLET": "Bullet",
  }[routeId];
};
