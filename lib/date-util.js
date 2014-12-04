"use strict";

// ## Date utilities
//

function setDateTime(date, time) {
  var parts = time.split(":");
  var hours = Number(parts[0]);
  var minutes = Number(parts[1]);
  var seconds = Number(parts[2]);
  date.setHours(hours, minutes, seconds, 0);
  return date;
}

function cloneDate(date) {
  return new Date(date.getTime());
}

// ## Exports

module.exports.setDateTime = setDateTime;
module.exports.cloneDate = cloneDate;
