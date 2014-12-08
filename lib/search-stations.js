"use strict";

var find = require("array-find");

var stations = require("../station-aliases.json")
  .map(function(station) {
    return {
      id: station.id,
      terms: [station.id, station.name].concat(station.aliases).map(simplify),
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

module.exports = function(query) {
  var station = find(stations, function(station) {
    return isMatch(station.terms, query);
  });
  if (station) {
    return station.id;
  }
};
