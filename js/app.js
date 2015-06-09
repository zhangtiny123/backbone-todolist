'use strict';

var app = {};

app.Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },
    toggle: function () {
        this.save({completed: !this.get('completed')});
    }
});

app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    localStorage: new Store("backbone-todo"),
    completed: function () {
        return this.filter(function (todo) {
            return todo.get('completed');
        });
    },
    remaining: function () {
        return this.without.apply(this, this.completed());
    }
});

app.todoList = new app.TodoList();

app.show_input = function() {
    document.getElementById("new-todo").style.visibility = "visible";
};

app.hide_input = function() {
    document.getElementById("new-todo").style.visibility = "hidden";
};

app.TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#item-template').html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.edit');
        return this; // enable chained calls
    },
    initialize: function () {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close',
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'destroy'
    },
    edit: function () {
        this.$el.addClass('editing');
        this.input.focus();
    },
    close: function () {
        var value = this.input.val().trim();
        if (value) {
            this.model.save({title: value});
        }
        this.$el.removeClass('editing');
    },
    updateOnEnter: function (e) {
        if (e.which == 13) {
            this.close();
        }
    },
    toggleCompleted: function () {
        this.model.toggle();
    },
    destroy: function () {
        this.model.destroy();
    }
});

app.AppView = Backbone.View.extend({
    el: '#todoapp',
    initialize: function () {
        this.input = this.$('#new-todo');
        app.todoList.on('add', this.addAll, this);
        app.todoList.on('reset', this.addAll, this);
    },
    render: function() {
        $(".nav-tabs").find(".active").removeClass("active");
        $("#home").addClass("active");
        app.show_input();
        this.addAll();
    },
    events: {
        'keypress #new-todo': 'createTodoOnEnter'
    },
    createTodoOnEnter: function (e) {
        if (e.which !== 13 || !this.input.val().trim()) {
            return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val('');
    },
    addOne: function (todo) {
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
    },
    addAll: function () {
        console.log('add all');
        this.$('#todo-list').html('');
        app.todoList.each(this.addOne, this);
    },
    newAttributes: function () {
        return {
            title: this.input.val().trim(),
            completed: false
        }
    }
});

app.pendingView = Backbone.View.extend({
    el: '#todo-list' ,
    initialize: function() {},
    render: function() {
        $(".nav-tabs").find(".active").removeClass("active");
        $("#pending").addClass("active");
        $("#todo-list").html("");
        app.hide_input();
        this.display_pending();
    },

    display_pending: function() {
        _.each(app.todoList.remaining(), function(todo) {
            var view = new app.TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        });
    }

});

app.completeView = Backbone.View.extend({
    el: '#todo-list' ,
    initialize: function() {},
    render: function() {
        $(".nav-tabs").find(".active").removeClass("active");
        $("#completed").addClass("active");
        $("#todo-list").html("");
        app.hide_input();
        this.display_complete();
    },

    display_complete: function() {
        _.each(app.todoList.completed(), function(todo) {
            var view = new app.TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        });
    }

});

app.Router = Backbone.Router.extend({
    default_route: function () {
        if (!app.appView) {
            app.appView = new app.AppView();
        }
        if (app.todoList.length == 0) {
            app.todoList.fetch();
        } else {
            app.appView.render();
        }
    },

    pending_route: function() {
        if (!app.pending) {
            app.pending = new app.pendingView();
        }
        app.pending.render();
    },

    complete_route: function() {
        if (!app.complete) {
            app.complete = new app.completeView();
        }
        app.complete.render();
    },

    initialize: function () {
        {
            var router = this,
                routes = [
                    [/^.*$/, "default_route"],
                    ["pending", "pending_route"],
                    ["complete", "complete_route"]
                ];

            _.each(routes, function (route) {
                router.route.apply(router, route);
              });
            Backbone.history.start({pushState: true});
        }
    }
});

app.bindEvents = function() {
    function bindClick(id, path) {
        $(id).on("click", function(e) {
            e.preventDefault();
            Backbone.history.navigate(path, {trigger: true})
        });
    }
    bindClick("#home", "/");
    bindClick("#pending", "pending");
    bindClick("#completed", "complete")
};

app.router = new app.Router();
app.bindEvents();
