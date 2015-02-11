
(function() {
    "use strict";

    console.log('AppController setup');
    define([
        'angular',
        'controllers/MasherCtrl',
        'controllers/TabsCtrl',
        'controllers/PositionViewCtrl',
        'controllers/MapCtrl',
        'controllers/VerbageCtrl',
        'controllers/WebSiteDescriptionCtrl',
        'controllers/SPACtrl',
        'controllers/SearcherCtrlGrp',
        'controllers/SearcherCtrlMap',
        'controllers/StompSetupCtrl',
        'controllers/DestWndSetupCtrl',
        'controllers/TransmitNewUrlCtrl',
        'controllers/EmailCtrl',
        'controllers/GoogleSearchDirective',
        'lib/GeoCoder',
        'javascripts/lib/AgoNewWindowConfig'
        ], 
    function(angular, MasherCtrl, TabsCtrl, PositionViewCtrl, MapCtrl, VerbageCtrl, WebSiteDescriptionCtrl, SPACtrl,
            SearcherCtrlGrp, SearcherCtrlMap, StompSetupCtrl, DestWndSetupCtrl, TransmitNewUrlCtrl, EmailCtrl, GoogleSearchDirective, GeoCoder, AgoNewWindowConfig) {
        console.log('AppController define');

        function AppController($scope) {}
            
        function init(App) {
            console.log('AppController init');
            WebSiteDescriptionCtrl.start(App);
            MasherCtrl.start(App);
            TabsCtrl.start(App);
            PositionViewCtrl.start(App);
            // MapCtrl.start(App);
            SPACtrl.start(App);
            VerbageCtrl.start(App);
            SearcherCtrlGrp.start(App);
            SearcherCtrlMap.start(App);
            if(StompSetupCtrl.isInitialized() == false){
                StompSetupCtrl.start(App);
            }
            if(DestWndSetupCtrl.isInitialized() == false){
                DestWndSetupCtrl.start(App);
            }
            TransmitNewUrlCtrl.start(App);
            EmailCtrl.start(App);
            GoogleSearchDirective.start(App);
            MapCtrl.start(App);
            var $inj = angular.injector(['app']);
            var $http = $inj.get('$http');
            GeoCoder.start(App, $http);
                    
            $http({method: 'GET', url: '/username'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available.
                console.log('username: ', data.name );
                // AgoNewWindowConfig.setUserId(data.id );
                AgoNewWindowConfig.setUserName(data.name );
                // alert('got user name ' + data.name);
            }).
            error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                console.log('Oops and error', data);
                alert('Oops' + data.name);
            });
  
            
            return AppController;
        }

        return { start: init };

    });

}).call(this);