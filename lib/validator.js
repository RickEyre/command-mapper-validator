// The MIT License (MIT)
// Copyright (c) command-mapper-validator contributors.

var _ = require("lodash"),
    path = require("path"),
    mappingSpec = require(path.resolve(__dirname, "./specification.json"));

function validateProperty(key, spec, value) {
  var errors = [];
  if (!value && spec.required) {
    errors.push("The " + key + " is a required property.");
  }
  return errors;
}

function validateMapping(mapping) {
  return _.map(mappingSpec, function(val, key) {
    return validateProperty(key, val, mapping[key]);
  });
}

function validateMappings(mappings) {
  if (!_.isArray(mappings)) {
    mappings = [ mappings ];
  }
  return _.flatten(_.map(mappings, function(mapping) {
    return validateMapping(mapping);
  }));
}

module.exports = validateMappings;
