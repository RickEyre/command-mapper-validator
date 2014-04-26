// The MIT License (MIT)
// Copyright (c) command-mapper-validator contributors.

var _ = require("lodash"),
    path = require("path"),
    mappingSpec = require(path.resolve(__dirname, "./specification.json"));

const typeCheckers = {
  string: _.isString,
  array: _.isArray,
  object: _.isPlainObject
};

function validateProperty(key, spec, value) {
  var errors = [];
  if (!value && spec.required) {
    errors.push("The " + key + " is a required property.");
  }
  if (!value) {
    return errors;
  }
  var type = spec.type || "string",
      checkType = typeCheckers[type];
  if (!checkType || !checkType(value)) {
    errors.push("The " + key + " must be a " + type + ".");
  }
  if (type === "object") {
    checkType = typeCheckers.string;
    _.forEach(value, function(val, key) {
      !checkType(val) && errors.push("The " + key + " object's properties " +
                                     "must be strings.");
    });
  }
  return errors;
}

function validateMapping(mapping) {
  var errors = [];
  _.forEach(mappingSpec, function(spec, key) {
    _.forEach(spec.exclusions, function(exclusion) {
      if (mapping[key] && mapping[exclusion]) {
        errors.push("The " + key + " property cannot be specified with " +
                    "the " + exclusion + " property.");
      }
    });
  });
  return errors.concat(_.map(mappingSpec, function(val, key) {
    return validateProperty(key, val, mapping[key]);
  }));
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
