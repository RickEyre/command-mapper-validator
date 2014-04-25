// The MIT License (MIT)
// Copyright (c) command-mapper-validator contributors.

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jshint: {
      options: {
        esnext: true,
        indent: 2,
        expr: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        newcap: true,
        unused: true,
        trailing: true,
        browser: true,
        node: true
      },
      files: [ "lib/*", "test/*" ]
    },

    jsonlint: {
      sample: {
        src: [ "lib/*.json" ]
      }
    },

    bump: {
      options: {
        files: [ "package.json" ],
        updateConfigs: [],
        commit: true,
        commitMessage: "Release v%VERSION%",
        commitFiles: [ "package.json" ],
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: true,
        pushTo: "git@github.com:RickEyre/command-mapper-validator.git",
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          ui: "tdd"
        },
        src: [ "test/**/*.js" ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.registerTask("default", [ "jshint", "jsonlint", "mochaTest" ]);
};
