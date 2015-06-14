define(['underscore', 'backbone', 'model/todoList', 'view/homeView', 'view/pendingView', 'view/completeView'],
    function (_, Backbone, TodoList, HomeView, PendingView, CompleteView) {
        var todo_list = new TodoList();
        return Backbone.Router.extend({
            views: {},
            default_route: function () {
                if (!this.views.homeView) {
                    this.views.homeView = new HomeView(todo_list);
                }
                if (todo_list.length == 0) {
                    todo_list.fetch();
                } else {
                    this.views.homeView.render();
                }
            },
            pending_route: function () {
                if (!this.views.pendingView) {
                    this.views.pendingView = new PendingView(todo_list);
                }
                this.views.pendingView.render();
            },
            complete_route: function () {
                if (!this.views.completeView) {
                    this.views.completeView = new CompleteView(todo_list);
                }
                this.views.completeView.render();
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
    });