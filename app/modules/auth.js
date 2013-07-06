// Auth module
define([
  // Application.
  "app",
  "modules/common"
],

// Map dependencies from above array.
function(app, Common) {



  // Create a new module.haha
  var Auth = app.module();

  Auth.Helper = {
    store_login_token: function(token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    }

  };

  // Default Model.
  Auth.Model = Backbone.Model.extend({

  });

  // Default Collection.
  Auth.Collection = Backbone.Collection.extend({
    model: Auth.Model
  });

  // Default View.
  Auth.Views.Layout = Common.Views.BaseView.extend({
    template: "auth",

    events: {
      'click #login_to_google': 'auth_login'
    },

    auth_login: function() {
      console.log(gapi);
      _.delay(function() {
        gapi.client.setApiKey(app.SETTINGS.apiKey);
        this.auth_google();
      }.bind(this), 300);

    },

    auth_google: function() {
        gapi.auth.authorize({ client_id: app.SETTINGS.clientId, scope: app.SETTINGS.Scopes, immediate: true}, this.handleAuthResult);
    },

    handleAuthResult: function(authResult) {
      if (authResult && !authResult.error) {
        // store auth token
        console.log(authResult);
        Auth.Helper.store_login_token(authResult.access_token);
        // navigate to task lists
        app.router.navigate("tasks", {trigger: true});
      } else {
        console.log("ERROR");
      }
    }



  });

  // Return the module for AMD compliance.
  return Auth;

});
