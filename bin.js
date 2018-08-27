#!/usr/bin/env node
"use strict";

var caltrain = require("./async");
var format = require("./lib/output");

var args = require('minimist')(process.argv.slice(2), {
  default: {
    "number": 1,
  },
  alias: {
    "number": "n",
  },
});

var from = args._[0].toString();
var to = args._[1].toString();

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

  var getTrip;
  try {
    getTrip = getSchedule({
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

  console.log(format.heading(getTrip.from, getTrip.to));

  for (var i = 0; i < args.number; i++) {
    if (i !== 0) {
      console.log();
    }
    console.log(format.trip(getTrip()));
  }
});
