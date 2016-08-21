"use strict";

require("array.prototype.find");
var stations = require("./stations.json");

var stationTerms = stations.map(function(station) {
  return {
    terms: [station.id, station.name].concat(station.aliases).map(simplify),
    station: station,
  };
});

function simplify(query) {
  return query.toLowerCase()
    .replace(/\W/g, "");
}

function isMatch(terms, query) {
  query = simplify(query);
  return terms.some(function(term) {
    return term === query;
  });
}

module.exports = stations;

module.exports.byId = function(id) {
  return stations.find(function(station) {
    return station.id === id;
  });
};

module.exports.search = function(query) {
  var station = stationTerms.find(function(station) {
    return isMatch(station.terms, query);
  });
  if (station) {
    return station.station;
  }
};
