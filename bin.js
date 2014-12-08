#!/usr/bin/env node
"use strict";

var args = require('minimist')(process.argv.slice(2));
var caltrain = require("./async");
var format = require("./lib/output");

var from = args._[0];
var to = args._[1];

if ( ! from ) {
  console.error("A start location must be given.");
  return process.exit(1);
}

if ( ! to ) {
  console.error("A destination location must be given.");
  return process.exit(1);
}

caltrain(function(err, getSchedule) {
  if (err) {
    throw err;
  }

  var getNextStop;
  try {
    getNextStop = getSchedule({
      from: from,
      to: to,
      date: new Date(),
    });
  }
  catch (err) {
    if (err.code === "STOP_NOT_FOUND") {
      console.error(err.message);
      return;
    }
  }

  console.log(format(getNextStop()));
});
