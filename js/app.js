'use strict';

var app = {}; // create namespace for our app

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

// instance of the Collection
app.todoList = new app.TodoList();

// renders individual todo items list (li)
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
        this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
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

// renders the full list of todo items calling TodoView for each one.
app.AppView = Backbone.View.extend({
    el: '#todoapp',
    initialize: function () {
        this.input = this.$('#new-todo');
        app.bindEvents();
        app.todoList.on('add', this.addAll, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.fetch(); // Loads list from local storage
    },
    render: function() {
        $(".nav-tabs").find(".active").removeClass("active");
        $("#home").addClass("active");
    },
    events: {
        'keypress #new-todo': 'createTodoOnEnter'
    },
    createTodoOnEnter: function (e) {
        if (e.which !== 13 || !this.input.val().trim()) { // ENTER_KEY = 13
            return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val(''); // clean input box
        Backbone.history.navigate("/", {trigger: true})
    },
    addOne: function (todo) {
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
    },
    addAll: function () {
        this.$('#todo-list').html(''); // clean the todo list
        // filter todo item list
        switch (window.filter) {
            case 'pending':
                _.each(app.todoList.remaining(), this.addOne);
                break;
            case 'completed':
                _.each(app.todoList.completed(), this.addOne);
                break;
            default:
                app.todoList.each(this.addOne, this);
                break;
        }
    },
    newAttributes: function () {
        return {
            title: this.input.val().trim(),
            completed: false
        }
    }
});

app.addNewView = Backbone.View.extend({
    el: '#todo-list',
    initialize: function () {
        this.input = this.$('#new-todo');
        app.bindEvents();
    },
    render: function () {
        $(".nav-tabs").find(".active").removeClass("active");
        $("#add_new").addClass("active");
        $("#todo-list").html("");
        return this; // enable chained calls
    },
    events: {
        'keypress #new-todo': 'finishAddTodo'
    },
    finishAddTodo: function (e) {
        if (e.which !== 13 || !this.input.val().trim()) { // ENTER_KEY = 13
            return;
        }
        Backbone.history.navigate("/", {trigger: true});
        app.todoList.create(this.newAttributes());
        this.input.val(''); // clean input box
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
    initialize: function() {
        app.bindEvents();
        app.todoList.on('add', this.render());
        app.todoList.on('reset' , this.render());
        app.todoList.fetch();
    },
    render: function() {
        $(".nav-tabs").find(".active").removeClass("active");
        $("#pending").addClass("active");
        $("#todo-list").html("");
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
    initialize: function() {
        app.bindEvents();
        app.todoList.on('add', this.render());
        app.todoList.on('reset' , this.render());
        app.todoList.fetch();
    },
    render: function() {
        $(".nav-tabs").find(".active").removeClass("active");
        $("#completed").addClass("active");
        $("#todo-list").html("");
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
    routes: {
        '*filter': 'setFilter'
    },

    setFilter: function (params) {
        console.log('app.router.params = ' + params);
        window.filter = params.trim() || '';
        app.todoList.trigger('reset');
    },

    default_route: function () {
        app.appView = new app.AppView();
        app.appView.render();
    },

    newFunction: function () {
        console.log("jump to new page");
        app.newView = new app.addNewView();
        app.newView.render();
    },

    pending_route: function() {
        app.pending = new app.pendingView();
        app.pending.render();
    },

    complete_route: function() {
        app.complete = new app.completeView();
        app.complete.render();
    },

    initialize: function () {
        {
            var router = this,
                routes = [
                    [/^.*$/, "default_route"],
                    ["add_new", "newFunction"],
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
    $("#home").on("click", function(e) {
        e.preventDefault();
        Backbone.history.navigate("/", {trigger: true})
    });
    $("#add_new").on("click", function(e) {
        e.preventDefault();
        Backbone.history.navigate("add_new", {trigger: true})
    });
    $("#pending").on("click", function(e) {
        e.preventDefault();
        Backbone.history.navigate("pending", {trigger: true})
    });
    $("#completed").on("click", function(e) {
        e.preventDefault();
        Backbone.history.navigate("complete", {trigger: true})
    });
};

app.router = new app.Router();
