
(function() {
    "use strict";
 
    console.log('AppController setup');
    define([
        'angular',
        'controllers/MasherCtrl',
        'controllers/TabsCtrl',
        'controllers/MapCtrl',
        'controllers/VerbageCtrl',
        'controllers/SPACtrl',
        'controllers/SearcherCtrlGrp',
        'controllers/SearcherCtrlMap',
        'controllers/StompSetupCtrl'
        ], 
    function(angular, MasherCtrl, TabsCtrl, MapCtrl, VerbageCtrl, SPACtrl, SearcherCtrlGrp, SearcherCtrlMap, StompSetupCtrl) {
        console.log('AppController define');

        //function AppController($scope) 
        var app = angular.module("app", ['ngRoute', 'ui.bootstrap', 'ngGrid']);
            
      // define our controller and register it with our app
        app.controller("AppController", function($scope){
            // $scope.title = "Hello World";
            console.log("AppController - call init(App)");
        });
        
        init(app);
        
        function init(App) {
            console.log('AppController init');
            MasherCtrl.start(App);
            TabsCtrl.start(App);
            MapCtrl.start(App);
            SPACtrl.start(App);
            VerbageCtrl.start(App);
            SearcherCtrlGrp.start(App);
            SearcherCtrlMap.start(App);
            StompSetupCtrl.start(App);
        }

        return { start: init };

    });

}).call(this);
