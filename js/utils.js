define(['jquery', 'backbone'],
    function ($, Backbone) {
        function Utils() {
        }

        Utils.prototype.show_input = function () {
            document.getElementById("new-todo").style.visibility = "visible";
        };

        Utils.prototype.hide_input = function () {
            document.getElementById("new-todo").style.visibility = "hidden";
        };

        Utils.prototype.bindEvents = function () {
            function bindClick(id, path) {
                $(id).on("click", function (e) {
                    e.preventDefault();
                    Backbone.history.navigate(path, {trigger: true})
                });
            }

            bindClick("#home", "/");
            bindClick("#pending", "pending");
            bindClick("#completed", "complete")
        };

        return Utils;
    });