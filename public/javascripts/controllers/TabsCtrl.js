
String.format = function() {
    // console.debug("lets format something");
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    // console.debug(arguments[0]);
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    
    return theString;
};

(function() {
    "use strict";

    console.log('TabsCtrl setup');
    define(['angular'], function(angular) {
        console.log('TabsCtrl define');
        var selfMethods = {};

        function TabsCtrl($scope, $location) {
            console.debug('TabsCtrl - initialize tabs');

            var contentsText = 'This tab opens a typical web page which displays typical web page stuff, including a div with {0}  programmed with {1} embedded in it.  Right click on the link below and select open in a new window or open in a new tab.';

            $scope.tabs = [
            { 
              maptype : 'google',
              title:'Google Maps', 
              site: 'Commercial Web Site featuring a Google Map',
              content: String.format(contentsText, 'a Google map', 'google map content'),
              url: "/views/partials/GoogleMap.jade",
              imgSrc: "stylesheets/images/googlemap.png",
              imgAlt: "Google Map",
              active: true,
              disabled: false
            },
            { 
              maptype : 'leaflet',
              title:'Leaflet/OSM Maps', 
              site: 'Commercial Web Site featuring a Leaflet Map',
              content: String.format(contentsText, 'a Leaflet/OSM map', 'Leaflet content'),
              url: "/views/partials/Leaflet.jade",
              imgSrc:  "stylesheets/images/Leaflet.png",
              imgAlt: "Leaflet/OSM Maps",
              active: false,
              disabled: false
            },
            { 
              maptype : 'arcgis',
              title:'ArcGIS Web Maps', 
              site: 'Commercial Web Site featuring an ArcGIS Online Map',
              content: String.format(contentsText, 'an ArcGIS Web Map', 'ArcGIS Online content'),
              url: "/views/partials/ArcGIS.jade",
              imgSrc: "stylesheets/images/arcgis.png",
              imgAlt: "ArcGIS Web Maps",
              active: false,
              disabled: false
            }
            ];
            
            $scope.currentTab = $scope.tabs[0]; 
            $scope.$parent.currentTab = $scope.currentTab;
            console.log("currentTab - url initialized to " + $scope.currentTab.url);
            
            var $inj = angular.injector(['app']);
            var serv = $inj.get('CurrentMapTypeService');
            serv.setCurrentMapType($scope.currentTab.maptype);

            $scope.onClickTab = function (tb) {
                //alert("clicked on " + tb.url);
                $scope.currentTab =$scope.$parent.currentTab = tb;
                var $inj = angular.injector(['app']);
                var serv = $inj.get('CurrentMapTypeService');
                serv.setCurrentMapType($scope.currentTab.maptype);
            
                console.debug("clicked on tab : " + tb.url);
            }
            $scope.isActiveTab = function(tabUrl) {
                //console.debug("set active tab testing " + tabUrl);
                return tabUrl == $scope.currentTab.url;
            }
            console.log("onClickTab and isActiveTab defined ");
            
            $scope.selectAgo = function(){
                $scope.currentTab =$scope.$parent.currentTab = $scope.tabs[2];
                console.log("currentTab - url reset to " + $scope.currentTab.url);
                $location.path("/views/partials/ArcGIS");
            }
            selfMethods["selectAgo"] = $scope.selectAgo;
            
            $scope.forceAgo = function(){
                $scope.currentTab =$scope.$parent.currentTab = $scope.tabs[2];
            }
            selfMethods["forceAgo"] = $scope.forceAgo;
            
            console.debug(selfMethods);
           
        };
            
        TabsCtrl.prototype.selectAgo = function (){
            selfMethods["selectAgo"]();
        }
            
        TabsCtrl.prototype.forceAgo = function (){
            selfMethods["forceAgo"]();
        }
        

        function init(App) {
            console.log('TabsCtrl init');
            App.controller('TabsCtrl', ['$scope', '$location', TabsCtrl]);
            return TabsCtrl;
        }
        function selectAgo() {
            console.log('selectAgo ');
            TabsCtrl.prototype.selectAgo();
        }
        function forceAgo() {
            console.log('forceAgo ');
            TabsCtrl.prototype.forceAgo();
        }

        return { start: init, selectAgo : selectAgo, forceAgo :  forceAgo};

    });

}).call(this);