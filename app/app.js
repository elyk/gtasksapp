define([
  "jquery",
  "lodash",
  "backbone",
  "handlebars",
  "backbone.layoutmanager",
  "junior",
  "google_api",
  "moment"

], function($, _, Backbone, Handlebars) {

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  Backbone.ajax = function() {
      var args = Array.prototype.slice.call(arguments, 0);

      console.log(args);
      // Here, I add the OAuth token (or any other token)
      // But before, I check that data exists, if not I add it
      // if (args[0]['data'] === undefined) {
      //     args[0]['data'] = {};
      // }
      // args[0]['data']['key'] = app.SETTINGS.apiKey;
      args[0]['url'] = args[0]['url'] + "?key=" + app.SETTINGS.apiKey;
      args[0]['beforeSend'] = function (request) {
        request.setRequestHeader('authorization', "Bearer" + " " + app.SETTINGS.get_login_token());
      };

      return Backbone.$.ajax.apply(Backbone.$, args);
  };

  // copying over Backbone.Events into empty obj for pub/sub
  Backbone.pubSub =  _.extend({}, Backbone.Events);



  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: "/",

    SETTINGS: {
      apiKey: 'AIzaSyCg4SYcpXVS0DN7FVTGVfA1SVypenPRwd0',
      clientId: '504466659912.apps.googleusercontent.com',
      Scopes: 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile',
      BASE_URL: "https://www.googleapis.com/tasks/v1/",
      get_login_token: function() {
        return localStorage.getItem("ACCESS_TOKEN");
      }

    }
  };



  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.Layout.configure({
    // Allow LayoutManager to augment Backbone.View.prototype.
    manage: true,

    prefix: "app/templates/",

    fetch: function(path) {
      // Concatenate the file extension.
      path = path + ".html";

      // If cached, use the compiled template.
      if (JST[path]) {
        return JST[path];
      }

      // Put fetch into `async-mode`.
      var done = this.async();

      // Seek out the template asynchronously.
      $.ajax({
          url: app.root + path,
          type: 'get',
          dataType: 'html',
          async: true,
          success: function(contents) {
              done(JST[path] = Handlebars.compile(contents));
          }
      });
    }
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function(name, options) {
      // Enable variable arity by allowing the first argument to be the options
      // object and omitting the name argument.
      if (_.isObject(name)) {
        options = name;
      }

      // Ensure options is an object.
      options = options || {};

      // If a name property was specified use that as the template.
      if (_.isString(name)) {
        options.template = name;
      }

      // Create a new Layout with options.
      var layout = new Backbone.Layout(_.extend({
        el: "body"
      }, options));

      // Cache the refererence.
      return this.layout = layout;
    }
  }, Backbone.Events);

});
