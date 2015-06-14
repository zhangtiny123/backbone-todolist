define(['jquery', 'backbone', 'model/todoList', 'view/todoView', 'utils'],
    function ($, Backbone, Todo_list, Todo_view, Utils) {
        var utils = new Utils();
        return Backbone.View.extend({
            el: '#todoapp',
            initialize: function (todo_list) {
                this.todo_list = todo_list;
                this.input = this.$('#new-todo');
                this.todo_list.on('add', this.addAll, this);
                this.todo_list.on('reset', this.addAll, this);
            },
            render: function () {
                $(".nav-tabs").find(".active").removeClass("active");
                $("#home").addClass("active");
                utils.show_input();
                this.addAll();
            },
            events: {
                'keypress #new-todo': 'createTodoOnEnter'
            },
            createTodoOnEnter: function (e) {
                if (e.which !== 13 || !this.input.val().trim()) {
                    return;
                }
                this.todo_list.create(this.newAttributes());
                this.input.val('');
            },
            addOne: function (todo) {
                var view = new Todo_view({model: todo});
                $('#todo-list').append(view.render().el);
            },
            addAll: function () {
                this.$('#todo-list').html('');
                this.todo_list.each(this.addOne, this);
            },
            newAttributes: function () {
                return {
                    title: this.input.val().trim(),
                    completed: false
                }
            }
        });
    });