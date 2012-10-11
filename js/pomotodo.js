var PTD = {};
PTD.Task = Backbone.Model.extend({
  sync: function() { return false; }
});

PTD.Tasks = Backbone.Collection.extend({
  model: PTD.Task,
});

PTD.AddTaskView = Backbone.View.extend({
  tagName: "form",
  id: "new_item_form",

  events: {
    "keypress #add_item": "onEnter"
  },

  onEnter: function(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
      var textbox = this.$("#add_item");
      if (textbox.val() == "")
        return false;
      this.collection.create({
       text: textbox.val(),
      });
      textbox.val("");
    }
  }
});

PTD.IncompleteTasksView = Backbone.View.extend({
  tagName: "ul",
  id: "incomplete",

  initialize: function() {
    this.collection.on("add", this.render, this);
  },

  render: function(task) {
    console.log("Fired!");
    var html = Mustache.render($("#inc-template").html(), task.attributes);
    this.$el.prepend(html);
  }
});

$(document).ready(function () {
  var myTasks = new PTD.Tasks();
  var myAddTaskView = new PTD.AddTaskView({
    collection: myTasks,
    el: $("#new_item_form")
  });
  var myIncompleteTasksView = new PTD.IncompleteTasksView({
    collection: myTasks,
    el: $("#incomplete")
  });
});
