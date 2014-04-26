// The MIT License (MIT)
// Copyright (c) command-mapper-validator contributors.

var validator = require("../lib/validator"),
    _ = require("lodash"),
    expect = require("chai").expect,
    path = require("path"),
    specification = require(path.resolve(__dirname, "../lib/specification.json")),
    mapping = { };

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
    expect(validator(mapping)).to.have.length(2);
    expect(validator({ command: "git" })).to.have.length(1);
    expect(validator({ alias: "g" })).to.have.length(1);
    _.assign(mapping, { command: "git", alias: "g"});
    expect(validator(mapping)).to.have.length(0);
  });

  test("type checking should work correctly", function() {
    var base = { command: "git", alias: "g" },
        types = {
          string: "string",
          number: 1,
          "function": function() {},
          object: {},
          array: []
        };

    // Loop through each valid property in the specification.
    _.forEach(specification, function(propertySpec, propertyKey) {
      // Find the type that the property is specified to be. Default to string.
      var type = _.find(propertySpec, "type") || "string";
      // Test that each type that is not the specified type returns an error.
      _.forEach(_.omit(types, type), function(badType) {
        var cp = _.clone(base);
        cp[propertyKey] = badType;
        expect(validator(cp)).to.have.length(1);
      });
      // Test that the type that it is specified to be does not return an error.
      var cp = _.clone(base);
      cp[propertyKey] = types[type];
      expect(validator(cp)).to.have.length(0);
    });
  });

});
