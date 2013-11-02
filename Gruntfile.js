
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    mochaTest: {
      unit: {
        src: ['test/unit/**/*.js'],
        options: {
          globals: ['should'],
          timeout: 2000,
          ignoreLeaks: false,
          slow: 50,
          reporter: 'spec',
          require: ['should', 'test/env.js']
        }
      }
    }
  });

  // grunt data:sampleDb
  grunt.registerTask('data', 'Fill database.', function(name) {
    var done = this.async();
    var testData = require('test/data');
    testData.loadDb(name, done);
  });

  // grunt unit
  grunt.registerTask('unit', ['mochaTest:unit']);
};
