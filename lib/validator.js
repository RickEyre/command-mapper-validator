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
  _.forEach(_.find(spec, "exclusions"), function(val) {
    if (_.has(value, val)) {
      errors.push("You cannot specify a " + key + " property in a mapping " +
                  "with a " + val + " property.");
    }
  });

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
