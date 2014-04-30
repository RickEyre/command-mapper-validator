// The MIT License (MIT)
// Copyright (c) command-mapper-validator contributors.

var validator = require("../lib/validator"),
    _ = require("lodash"),
    expect = require("chai").expect,
    path = require("path"),
    specification = require(path.resolve(__dirname, "../lib/specification.json")),
    baseMapping = { },
    types = {
      string: "string",
      number: 1,
      "function": function() {},
      object: { command: "git", alias: "g" },
      array: [ { command: "git", alias: "g" } ]
    };

function findType(spec) {
  return spec.type || "string";
}

suite("validator", function() {

  test("should accept an object", function() {
    expect(function() { validator({}); }).to.not.throw();
  });

  test("should accept an array", function() {
    expect(function() { validator([]); }).to.not.throw();
  });

  test("should return an array", function() {
    expect(validator({})).to.be.an("array");
  });

  test("command and alias should be required properties", function() {
    expect(validator(baseMapping)).to.have.length(2);
    expect(validator({ command: "git" })).to.have.length(1);
    expect(validator({ alias: "g" })).to.have.length(1);
    _.assign(baseMapping, { command: "git", alias: "g"});
    expect(validator(baseMapping)).to.have.length(0);
  });

  test("type checking should work correctly", function() {
    // Loop through each valid property in the specification.
    _.forEach(specification, function(propertySpec, propertyKey) {
      // Find the type that the property is specified to be. Default to string.
      var type = findType(propertySpec);
      // Test that each type that is not the specified type returns an error.
      _.forEach(_.omit(types, type), function(badType) {
        var cp = _.clone(baseMapping);
        cp[propertyKey] = badType;
        expect(validator(cp)).to.have.length(1);
      });
      // Test that the type that it is specified to be does not return an error.
      var cp = _.clone(baseMapping);
      cp[propertyKey] = types[type];
      expect(validator(cp)).to.have.length(0);
    });
  });

  test("exclusions should work correctly", function() {
    // Loop through each property in the specification.
    _.forEach(specification, function(propertySpec, propertyKey) {
      // Find he type that the property is specified to be.
      var type = findType(propertySpec);
      // For each property that has specified exclusions test that the property
      // cannot be added with each of its exclusions.
      _.forEach(propertySpec.exclusions, function(exclusion) {
        var cp = _.clone(baseMapping);
        cp[propertyKey] = types[type];
        expect(validator(cp)).to.have.length(0);
        cp[exclusion] = types[findType(specification[exclusion])];
        expect(validator(cp)).to.have.length(2);
      });
    });
  });

  test("objects' properties must be of type string", function() {
    // For each property in the specification.
    _.forEach(specification, function(propertySpec, propertyKey) {
      // If the properties specified type is object then test that any other
      // type other then string assigned as a property of it will fail.
      if (propertySpec.type === "object") {
        _.forEach(_.omit(types, "string"), function(badType) {
          var cp = _.clone(baseMapping);
          cp[propertyKey] = { property: badType };
          expect(validator(cp)).to.have.length(1);
        });
        // Test that string properties on the object will work.
        var cp = _.clone(baseMapping);
        cp[propertyKey] = { property: types.string };
        expect(validator(cp)).to.have.length(0);
      }
    });
  });

  test("validation should be deep", function() {
    // Test that mappings that have mappings will be validated deeply.
    var cp = _.clone(baseMapping);
    cp.mappings = [ { } ];
    expect(validator(cp)).to.have.length(2);
    cp.mappings[0] = baseMapping;
    expect(validator(cp)).to.have.length(0);
  });

});
