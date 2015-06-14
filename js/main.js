requirejs.config({
    paths: {
        underscore: "../bower_components/underscore/underscore",
        jquery: "../bower_components/jquery/dist/jquery",
        backbone: '../bower_components/backbone/backbone',
        backboneLocalstorage: '../bower_components/backbone.localstorage/backbone.localStorage'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        }
    }
});

require(['backbone', 'router', 'utils'],
    function (Backbone, Router, Utils) {
    var utils = new Utils();
    new Router();
    utils.bindEvents();
});
