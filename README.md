command-mapper-validator
========================

[![Build Status](https://travis-ci.org/RickEyre/command-mapper-validator.svg?branch=master)](https://travis-ci.org/RickEyre/command-mapper-validator) [![npm-version](http://img.shields.io/npm/v/command-mapper-validator.svg)](https://www.npmjs.org/package/command-mapper-validator) [![Dependency Status](https://david-dm.org/RickEyre/command-mapper-validator.svg?theme=shields.io)](https://david-dm.org/RickEyre/command-mapper-validator) [![devDependency Status](https://david-dm.org/RickEyre/command-mapper-validator/dev-status.svg?theme=shields.io)](https://david-dm.org/RickEyre/command-mapper-validator#info=devDependencies)

Validates mapping objects or mapping JSON files. For more information see
[command-mapper](https://github.com/RickEyre/command-mapper).

Install
=======

```bash
$ npm install command-mapper-validator
```

Usage
=====

The module exports a single function that validates mapping option objects. It
returns an array of errors, if any.

```js
var validate = require("command-mapper-validator"),
    mappings = require("my-mapping.json");

validate(mappings).forEach(function(error) {
  console.log(error);
});
```
