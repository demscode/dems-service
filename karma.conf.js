module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: [
      'jasmine'
    ],
    files: [
      'https://maps.google.com/maps/api/js?sensor=false',
      // bower#dev:js
      // endbower#dev
      //need to load app.js before any other js as most depend on it
      'public/js/app.js',
      'public/js/*.js',
      'public/js/**/*.js',
      'tests/client/*.js',
      'tests/client/**/*.js',
    ],
    preprocessors: {
      'public/js/*.js': ['coverage'],
      'tests/client/*.js': ['coverage']
    },
    exclude: [],
    reporters: [
      'progress',
      'coverage'
    ],
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/client',
      subdir: function(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      }
    },
    port: 1412,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    captureTimeout: 60000,
    singleRun: false,
    browsers: [],
    plugins: []
  });
};
