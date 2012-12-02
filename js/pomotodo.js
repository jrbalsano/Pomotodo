var PTD = {};
PTD.Task = Backbone.Model.extend({
  sync: function() { return false; }
});

PTD.Tasks = Backbone.Collection.extend({
  model: PTD.Task
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
        complete: false
      });
      textbox.val("");
    }
  }
});

PTD.IncompleteTasksView = Backbone.View.extend({
  tagName: "ul",
  id: "incomplete",

  initialize: function() {
    this.collection.on("add", this.renderNew, this);
    this.collection.on("change:complete", this.renderComplete, this);
  },

  events: {
    "click .mark_complete": "markComplete"
  },

  renderNew: function(task) {
    taskAtts = task.attributes;
    taskAtts.cid = task.cid;
    var html = Mustache.render(PTD.incomplete_template, taskAtts);
    this.$el.prepend(html);
    PTD.centerAlignMiddle();
  },

  renderComplete: function(task) {
    if(task.get("complete") == true) {
      cid = task.cid;
      $(".incomplete#" + cid).remove();
      PTD.centerAlignMiddle();
    }
  },

  markComplete: function(e) {
    e.preventDefault();
    data = e.currentTarget.dataset;
    task = this.collection.getByCid(data.cid);
    task.set("complete", true);
  } 
});

PTD.CompleteTasksView = Backbone.View.extend({
  tagName: "ul",
  id: "complete",

  initialize: function() {
    this.collection.on("change:complete", this.renderNew, this);
  },

  renderNew: function(task) {
    taskAtts = task.attributes;
    taskAtts.cid = task.cid;
    var html = Mustache.render(PTD.complete_template, taskAtts);
    this.$el.append(html);
    PTD.centerAlignMiddle();
  }
});

PTD.centerAlignMiddle = function() {
  var $vc = $("#vcenter");
  var formHeight = $("#middle").outerHeight();
  var viewHeight = $(window).height();
  var formTop = (viewHeight - formHeight)/2;
  var divTop = formTop - $("#complete").outerHeight();
  $vc.css("top", divTop);
};

PTD.setListMaxHeight = function() {
  $("ul").css("max-height", ($(window).height() - $("#middle").outerHeight())/2);
};

$(document).ready(function () {
  PTD.incomplete_template = $("#inc-template").html();
  PTD.complete_template = $("#com-template").html();
  PTD.centerAlignMiddle();
  $(window).resize( PTD.centerAlignMiddle );

  var myTasks = new PTD.Tasks();
  var myAddTaskView = new PTD.AddTaskView({
    collection: myTasks,
    el: $("#new_item_form")
  });
  var myIncompleteTasksView = new PTD.IncompleteTasksView({
    collection: myTasks,
    el: $("#incomplete")
  });

  var myCompleteTasksView = new PTD.CompleteTasksView({
    collection: myTasks,
    el: $("#complete")
  });
});
