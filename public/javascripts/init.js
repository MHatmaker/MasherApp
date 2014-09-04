

(function() {
    "use strict";

    console.debug('init bootstrap setup method');

// lets require all our apps components before initalizing our app
define([
    'lib/angular/angular',
    //"dojo",
    // "dojo/domReady",
    // "esri/arcgis/Portal", 
    //'javascripts',
    'esriarcgisportal',
    'controllers/AppController',
    'controllers/MasherCtrl',
    'controllers/MapCtrl'
// ], function(angular, dojo, domReady, esriPortal, AppController, MasherCtrl, MapCtrl) {
], function(angular, esriarcgisportal, AppController, MasherCtrl, MapCtrl) {
    var App = angular.module("app"); //, ['ngRoute', 'ui.bootstrap', 'ngGrid']);
    
    App.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider, AppController, MasherCtrl, MapCtrl) {
        console.debug('App module route provider');
        var isCollapsed = false;
        console.debug(AppController);
         
        $routeProvider.
          when('/', {
            templateUrl: 'partials/SystemSelector.jade',
            // templateUrl: '/',
            controller: MasherCtrl, reloadOnSearch: true
          }).
          when('/partials/agonewwindow/:id',  {
            templateUrl: function(params){
            console.log("when string is " + '/partials/agonewwindow/:id');
            console.log("params = " + params.id);
            console.log("prepare to return " + '/partials/agonewwindow' + params.id);
            return '/partials/agonewwindow' + params.id; 
            },
            controller: MasherCtrl, reloadOnSearch: true
          }).
          when('/views/partials/:id',  {
            templateUrl: function(params){ return '/partials/' + params.id; },
            controller: MapCtrl, reloadOnSearch: true
          }).
          otherwise({
              redirectTo: '/'
          }); 
          
        console.debug('html5Mode');
        $locationProvider.html5Mode(true);
        console.debug('html5Mode again');
        }
    ]);
        
        //domReady(function () {
            var portal, portalUrl = document.location.protocol + '//www.arcgis.com';
            portal = new esri.arcgis.Portal(portalUrl);
            console.info('started the portal');
            readyForSearchGrid(portal);
            readyForSearchGridMap(portal);
        //});

  // since we didn't include ng-app anywhere in our HTML angular hasn't started yet
  // angular.bootstrap is the same as putting ng-app="app" on the body, but we control when it is called
  // need to bootstrap angular since we wait for dojo/DOM to load
  angular.bootstrap(document.body, ['app']);
});

}).call(this);