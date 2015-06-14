define(['backboneLocalstorage', 'backbone', 'model/todo'], function (Store, Backbone, Todo) {
    return Backbone.Collection.extend({
        model: Todo,
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
});