// Task module
define([
  // Application.
  "app",
  "modules/common"
],

// Map dependencies from above array.
function(app, Common) {

  // Create a new module.
  var Task = app.module();

  // Default Model.
  Task.ListModel = Backbone.Model.extend({
    url: function() {
      return app.SETTINGS.BASE_URL + "users/@me/lists/";
    }
  });

  // model for each task. url is defined within the model
  Task.Model = Backbone.Model.extend({
    url: function() {
      return this.get('selfLink');
    }
  });

  // Default Collection.
  Task.ListCollection = Backbone.Collection.extend({
    model: Task.ListModel,

    url: function() {
      console.log('here');
      return app.SETTINGS.BASE_URL + "users/@me/lists/";
    },

    parse: function(response) {
      return response.items;
    }

  });

  Task.Collection = Backbone.Collection.extend({
    model: Task.Model,

    initialize: function(params) {
      console.log(params);
      this.id = params.id;
    },

    url: function() {
      console.log(this);
      return app.SETTINGS.BASE_URL + "lists/" + this.id + "/tasks/";
    },

    parse: function(response) {
      console.log('response', response);
      return response.items;
    }

  });

  // Default View.
  Task.Views.Layout = Backbone.Layout.extend({
    template: "task_master"

  });

  // Default View.
  Task.Views.TaskList = Common.Views.BaseView.extend({
    template: "task_list",

    id: 'list_of_tasks',

    events: {
      'click .addList': 'showForm',
      'submit #newTaskList': 'createTaskList'
    },

    initialize: function() {
      this.listenTo(this.collection, "reset", this.render);
      this.listenTo(this.collection, "change", this.render);
    },

    serialize: function() {
      return {"task_list": this.collection.toJSON()};
    },
    showForm: function() {
      this.$('#newTaskList').show();
    },

    createTaskList: function(e) {
      e.preventDefault();
      var title = this.$('.listName').val();
      this.collection.create({title: title});

    }


  });

  // Default View.
  Task.Views.Tasks = Common.Views.BaseView.extend({
    template: "tasks",

    className: 'taskList',

    events: {
      "submit .new_task": "add_task"
    },

    beforeRender: function() {
      this.collection.each(function(task) {
        this.insertView('.taskListWrapper', new Task.Views.EachTask({
          model: task
        }));
      }, this);

    },

    initialize: function() {
      this.listenTo(this.collection, "reset", this.render);
      this.listenTo(this.collection, "add", this.render);

      // this.listenTo(this.collection, "change", this.render);

    },

    serialize: function() {
      console.log(this);
      return {"task_title": this.options.title};
    },

    add_task: function(e) {
      e.preventDefault();
      var task_title = this.$(".add_new_task").val();
      var self = this;

      // sync the collection with the server
      // this sends us back a newly created task
      // we set the title of this task and add to the collection
      Backbone.sync('create', this.collection, {
        success: function(response) {
          var added_task = new Task.Model(response);
          added_task.save({
            title: task_title
          });
          self.collection.add(added_task, {at: 0});
        }
      });


    }

  });

  // this represents the view for each class
  Task.Views.EachTask = Common.Views.BaseView.extend({
    template: "each_task",

    events: {
      // "input .task_title": "save_changes",
      "click": "expandTask",
      "click .delete": "delete_task",
      "click .save": "save_changes"
    },

    tagName: "li",

    initialize: function() {
      this.listenTo(this.model, "reset", this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    serialize: function() {
      return this.model.toJSON();
    },

    // saving users changes to server
    save_changes: function(e) {

      var title = this.$(".task_title")[0].textContent;
      var notes = this.$(".notesArea").val();
      this.model.save({
        title: title,
        notes: notes
      });

    },

    // TODO: filter out clicks here so we can have other that this doesn't take over (closing on save changes);
    // just break out notes into a new view and add it when clicked on.
    expandTask: function(e) {
      // if the view has already been expanded, return
      if (e.currentTarget.className == "expanded_height") {
        console.log('yes');
        return;
      }
      var hidden = this.$('.hiddenContent');
      this.$('.hiddenContent').addClass('showHidden');
      this.$('.task_wrapper').addClass('expanded_height');

    },

    delete_task: function() {
      console.log(gapi);
      this.model.destroy({
        success: function(model, response, options) {
        console.log(options);
        },
        error: function(model, response, options) {
          console.log(options);
        }
      }, {noData: true});
    }




  });



  // Return the module for AMD compliance.
  return Task;

});
