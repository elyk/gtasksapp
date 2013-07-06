// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
  deps: ["../vendor/jam/require.config", "main"],

  paths: {
    // Put paths here.
    junior: "./app-libs/junior",
    google_api: "https://apis.google.com/js/client",
    moment: "../vendor/jam/moment/moment"
  },

  shim: {
    // Put shims here.
    junior: ['backbone']
  }

});
