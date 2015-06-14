define(['jquery', 'backbone', 'view/todoView', 'utils'],
    function ($, Backbone, Todo_view, Utils) {
        var utils = new Utils();
        return Backbone.View.extend({
            el: '#todo-list',
            initialize: function (todo_list) {
                this.todo_list = todo_list;
            },
            render: function () {
                $(".nav-tabs").find(".active").removeClass("active");
                $("#pending").addClass("active");
                $("#todo-list").html("");
                utils.hide_input();
                this.display_pending();
            },
            display_pending: function () {
                _.each(this.todo_list.remaining(), function (todo) {
                    var view = new Todo_view({model: todo});
                    $('#todo-list').append(view.render().el);
                });
            }
        });
    });