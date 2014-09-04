// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'javascripts',
    paths: {
        lib: './lib',
        controllers: 'controllers',
        angular: 'lib/angular/angular',
        arcgisonline: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact',
        esriarcgisportal: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/esri/arcgis/Portal',
        dojo: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/dojo'
    },
    shim: {
        main: {
            //deps: ['jquery', 'underscore'],
            exports: 'main'
        },
        // setup: {
            // exports: 'setup'
        // },
        init: {
            exports: 'init'
        },
        MapCtrl: {
            exports: 'controllers/MapCtrl'
        },
        
        // angular: {
            // exports: 'lib/angular/angular'
        // },
        
        esriarcgisportal: {
            exports: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/esri/arcgis/Portal'
        },
        arcgisonline: {
            exports: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact'
        },
        dojo: {
            exports: 'http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.5compact/js/dojo'
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.    
/* 
define(['angular'], function(angular){

    var App = angular.module("app", ['ngRoute', 'ui.bootstrap', 'ngGrid']);
});
     */
    
requirejs(['lib/angular/angular', 'init', 'esriarcgisportal', 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact']);

