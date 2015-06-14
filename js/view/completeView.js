define(['underscore', 'jquery', 'backbone', 'model/todoList', 'view/todoView', 'utils'],
    function (_, $, Backbone, Todo_list, Todo_view, Utils) {
        var utils = new Utils();
        return Backbone.View.extend({
            el: '#todo-list',
            initialize: function (todo_list) {
                this.todo_list = todo_list;
            },
            render: function () {
                $(".nav-tabs").find(".active").removeClass("active");
                $("#completed").addClass("active");
                $("#todo-list").html("");
                utils.hide_input();
                this.display_complete();
            },
            display_complete: function () {
                _.each(this.todo_list.completed(), function (todo) {
                    var view = new Todo_view({model: todo});
                    $('#todo-list').append(view.render().el);
                });
            }
        });
    });