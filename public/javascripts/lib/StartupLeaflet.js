
(function() {
    "use strict";

    console.log('StartupLeaflet setup');
    define([
        'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js',
        'lib/MapHosterLeaflet'
    ], function(leaflet, MapHosterLeaflet) {
        console.log('StartupLeaflet define');
        var CHANNEL = '/mapxtnt/';
        var mph = null; 
        var loading;
        var newSelectedWebMapId = "";
        function configit(nmpid){
            console.log("nmpid " + nmpid);
        }
        function configure(newMapId) 
        {
            newSelectedWebMapId = newMapId;
            // window.loading = dojo.byId("loadingImg")
            // console.log(window.loading);
            console.log("newSelectedWebMapId " + newMapId);
            if( newSelectedWebMapId )
            {
                setupPusherClient(mph, function(channel){
                    var url = "?id=" + newSelectedWebMapId + mph.getGlobalsForUrl() + "&channel=" + channel;
                    console.log("open new ArcGIS window with URI " + url);
                    console.log("using channel " + channel);
                    window.open("http://localhost:8080/arcgis/" + url);
                    });
            }
            else
            {
                var lMap = new L.Map('map_canvas'); //.setView([41.8, -87.7], 13);
                console.debug(lMap);
                // var lMap = L.map('map').setView([51.50, -0.09], 13);
                // mph = new MapHosterLeaflet(lMap); 
                mph = MapHosterLeaflet.start(); 
                MapHosterLeaflet.config(lMap);
                // stomper = new StompClient(mph);
            }
        }   

        function StartupLeaflet() {
        };
        function init() {
            console.log('StartupLeaflet init');
            return StartupLeaflet;
        }

        return { start: init, config : configure };

    });

}).call(this);

// window.onload = function(){initialize()};
