define([
  // Application.
  "app",
  "modules/auth",
  "modules/common",
  "modules/task"
],

function(app, Auth, Common, Task) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "login",
      "tasks": "task_list",
      "tasks/:id/:title": "task"
    },

    _set_view: function(params) {
      var dom_selector = params.dom_selector,
          view_class = params.view_class || false,
          view_params = params.view_params || false,
          current_view = app.useLayout().getView(dom_selector);

          if(current_view) {
            app.useLayout().removeView(dom_selector);
          }

          app.useLayout().setView(dom_selector, new view_class(view_params)).render();

    },

    login: function() {
      this._set_view({
        dom_selector: "#app-main",
        view_class: Auth.Views.Layout
      });
    },

    task_list: function() {
      this._set_view({
        dom_selector: ".side_bar",
        view_class: Task.Views.TaskList,
        view_params: {collection: this.collections.list_of_tasks}
      });

    },

    task: function(id, title) {
      var tasks = new Task.Collection({id: id});
      this._set_view({
        dom_selector: ".main_panel",
        view_class: Task.Views.Tasks,
        view_params: {collection: tasks, title: title}
      });

      tasks.fetch();

    },

    initialize: function() {
      // inserting main layout

      this._set_view({
       dom_selector: "#app-main",
       view_class: Task.Views.Layout
      });

      // collections that only need to be fetched once
      this.collections = {
        list_of_tasks: new Task.ListCollection()
      };

      // settine the sidebar view, so we don't have to reset it all the time
      this._set_view({
        dom_selector: ".side_bar",
        view_class: Task.Views.TaskList,
        view_params: {collection: this.collections.list_of_tasks}
      });

      this.collections.list_of_tasks.fetch();
    }
  });

  return Router;

});
