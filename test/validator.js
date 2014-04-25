// The MIT License (MIT)
// Copyright (c) command-mapper-validator contributors.

var validator = require("../lib/validator"),
    _ = require("lodash"),
    expect = require("chai").expect,
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
    expect(validator({ "command": "git" })).to.have.length(1);
    expect(validator({ "alias": "g" })).to.have.length(1);
    _.assign(mapping, { command: "git", alias: "g"});
    expect(validator(mapping)).to.have.length(0);
  });

});