"use strict";

var find = require("array-find");
var stations = require("../stations.json");
var util = require("./util");

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

module.exports.search = function(query) {
  var station = find(stationTerms, function(station) {
    return isMatch(station.terms, query);
  });
  if (station) {
    return station.station;
  }
};

module.exports.getStopStation = function(stop) {
  return find(stations, function(station) {
    return util.isStopAtStation(stop, station);
  });
};
