// Common module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Common = app.module();

  // Default Model.
  Common.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  Common.Collection = Backbone.Collection.extend({
    model: Common.Model
  });

  // Default View.
  Common.Views.Layout = Backbone.Layout.extend({
    template: "common"
  });

  // This is the base view that all views should extend so they get animation etc.
  Common.Views.BaseView = Backbone.View.extend({

    events: {
      'click .slide-left': 'onClickButtonPrev',
      'click .slide-right': 'onClickButtonNext',
      'click .slide-down': 'onClickButtonDown',
      'click .slide-up': 'onClickButtonUp',
      'click .go-back': 'goBackButton',
      'click .active_state_click': "showActiveState"
    },

    onClickButtonPrev: function(e) {
      e.preventDefault();
      // Trigger the animation for the back button on the toolbar
      var back_page = $(e.currentTarget)[0].hash;

      Jr.Navigator.navigate(back_page,{
        trigger: true,
        animation: {
          // This time slide to the right because we are going back
          type: Jr.Navigator.animations.SLIDE_OVER,
          direction: Jr.Navigator.directions.RIGHT
        }
      });
    },

    // Next button when working on a template, just make the page you want to route to href to it
    onClickButtonNext: function(e) {
      e.preventDefault();
      var next_page = $(e.currentTarget)[0].hash;
      Jr.Navigator.navigate(next_page,{
        trigger: true,
        animation: {
          type: Jr.Navigator.animations.SLIDE_OVER,
          direction: Jr.Navigator.directions.LEFT
        }
      });
    },

    onClickButtonUp: function(e) {
      e.preventDefault();
      var next_page = $(e.currentTarget)[0].hash;
      Jr.Navigator.navigate(next_page,{
        trigger: true,
        animation: {
          type: Jr.Navigator.animations.SLIDE_STACK,
          direction: Jr.Navigator.directions.UP
        }
      });
    },

    onClickButtonDown: function(e) {
      e.preventDefault();
      var next_page = $(e.currentTarget)[0].hash;
      Jr.Navigator.navigate(next_page,{
        trigger: true,
        animation: {
          type: Jr.Navigator.animations.SLIDE_STACK,
          direction: Jr.Navigator.directions.DOWN
        }
      });
    },

    goBackButton: function() {
      console.log(app.router.routeHistory.pop());
      app.router.navigate(app.router.routeHistory.pop(), {trigger: true});

    },

    showActiveState: function(e) {
      e.preventDefault();
      $(e.currentTarget).parent('li').css('background-color', '#007db5');

    }
  });


  // Return the module for AMD compliance.
  return Common;

});
