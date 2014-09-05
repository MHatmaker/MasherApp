// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

(function() {

require.config({
    baseUrl: 'javascripts',
    paths: {
        lib: './lib',
        controllers: 'controllers',
        angular: 'lib/angular/angular',
        arcgisonline: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact',
        esriarcgisportal: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/esri/arcgis/Portal',
        //dojo: 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/dojo'
    },
  
    packages: [
        {
           name: 'dojo',
           location: "http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/dojo/dojo/",
           main:'dojo/main' 
        },
        {
           name: 'dojox',
           location: "http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/dojo/dojox"
        },
        {
           name: 'dijit',
           location: "http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/dojo/dijit"
        },
        {
           name: 'esri',
           location: "http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact/js/esri"
        }
    ],
     
    shim: {
        main: {
            //deps: ['jquery', 'underscore'],
            exports: 'main'
        },
        init: {
            exports: 'init'
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
    
require(['setup', 'lib/angular/angular', 'init', 'http://serverapi.arcgisonline.com/jsapi/arcgis/3.5compact',  'esriarcgisportal'], function(AppInit) {
    console.log('init app');
    return AppInit.initialize();
    }
);


}).call(this);

