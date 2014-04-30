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

// Validate a property in the mapping object.
// @param   key   {String} The key of the property being validated.
// @param   spec  {String} The specification options object for this particular
//                         property.
// @param   value {String} The value of the property being validated.
// @returns       {Array}  An array of error messages.
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
  if (checkType && checkType(value)) {
    // Properties which are objects can only have properties of type string.
    if (type === "object") {
       checkType = typeCheckers.string;
      _.forEach(value, function(val, key) {
        !checkType(val) && errors.push("The " + key + " object's properties " +
                                       "must be strings.");
      });
    }
    if (spec.isMappings) {
      errors = errors.concat(validateMappings(value));
    }
    return errors;
  }
  return errors.push("The " + key + " property must be a " + type + ".");
}

// Validate a mapping options object.
// @param   {Array} mapping The mapping options object to be validated.
// @returns {Array}         An array of error messages.
function validateMapping(mapping) {
  var errors = [];
  // Mappings that have properties on them that are defined in the spec to be
  // incompatible (have eachother as exclusions) are incorrect.
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

// Validate a series of mappings.
// @param   {Array} mappings The mapping options object, or array of mapping
//                           options objects to be validated.
// @returns {Array}          An array of error messages.
function validateMappings(mappings) {
  if (!_.isArray(mappings)) {
    mappings = [ mappings ];
  }
  return _.flatten(_.map(mappings, function(mapping) {
    return validateMapping(mapping);
  }));
}

module.exports = validateMappings;
