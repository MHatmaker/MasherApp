// define('google', function () {
    // if (google) {
        // return google;
    // }
    // return {};
// });

(function() {
    "use strict";
    require(["lib/utils", 'angular']);

    define([
        'angular'
        , 'controllers/PositionViewCtrl'
        ], function(angular, PositionViewCtrl) {

        var 
            mphmap,
            google,
            mapReady = true,
            scale2Level = [],
            zoomLevels = 0,
            minZoom = 0,
            maxZoom,
            zmG,
            cntrxG,
            cntryG,
            bounds,
            channel,
            userZoom = true;
            
        var selfPusherDetails = {
            channel : null,
            pusher : null
        };
        var popDetails = null;
                      
        function configureMap(gMap, goooogle) {
            mphmap = gMap;
            google = goooogle;
            updateGlobals("init", -87.7, 41.8,  13, 0.0);
            // updateGlobals("init", -0.09, 51.50, 13, 0.0);
            showGlobals("Prior to new Map");
            // google.maps.event.addListener(mphmap, 'dragend', gotDragEnd);
            google.maps.event.addListener(mphmap, 'dragend', function() 
                {setBounds('pan');});
            google.maps.event.addListener(mphmap, "zoom_changed", function() {
                if(userZoom == true)
                    setBounds('zoom', null);
                // userZoom = true;
                }
            );
            function gotResize(){
                console.log("resize event hit");
                console.log(mphmap.getBounds());
            };
            
            google.maps.event.addListener(mphmap, 'resize', gotResize); //function() {
                // console.log("resize event hit");
                // console.log(mphmap.getBounds());
            // });
            google.maps.event.addListener(mphmap, "mousemove", function(e) 
                {
                    var ltln = e.latLng;
                    var fixedLL = utils.toFixed(ltln.lng(),ltln.lat(), 3);
                    var evlng = fixedLL.lon;
                    var evlat = fixedLL.lat;
                    var zm = mphmap.getZoom();
                    var cntr = mphmap.getCenter();
                    var fixedCntrLL = utils.toFixed(cntr.lng(),cntr.lat(), 3);
                    var cntrlng = fixedCntrLL.lon;
                    var cntrlat = fixedCntrLL.lat;
                    if(scale2Level.length > 0)
                    {
                        // var view = "Zoom : " + zm + " Scale : " + scale2Level[zm].scale + " Center : " + cntrlng + ", " + cntrlat + " Current : " + evlng + ", " + evlat;
                        // document.getElementById("mppos").value = view;
                        PositionViewCtrl.update('coords', {
                            'zm' : zm,
                            'scl' : scale2Level[zm].scale,
                            'cntrlng' : cntrlng,
                            'cntrlat': cntrlat,
                            'evlng' : evlng,
                            'evlat' : evlat
                        });
                    }
                }
            );
            google.maps.event.addListener(mphmap, 'click', function(event) {
                onMapClick(event);
                }
            );
            
            mapReady = true;
            var center = mphmap.getCenter();
            google.maps.event.trigger(mphmap, 'resize');
            mphmap.setCenter(center);
            addInitialSymbols();
            
            minZoom = maxZoom = zoomLevels = 0;
            var zsvc = new google.maps.MaxZoomService();
            var cntr = new google.maps.LatLng(cntryG, cntrxG);
            
            zsvc.getMaxZoomAtLatLng(cntr, function(response) 
            {
                if (response && response['status'] == google.maps.MaxZoomStatus.OK) 
                {
                    maxZoom = response['zoom'];
                    zoomLevels = maxZoom - minZoom;
                    collectScales(zoomLevels);
                }
            });
        }
        
            function gotDragEnd(){
                console.log("dragend event hit");
                setBounds('pan');
            }
            
            function onMapClick(e) 
            {
                var popPt = e.latLng;
                var fixedLL = utils.toFixed(popPt.lng(), popPt.lat(), 3);
                var content = "You clicked the map at " + fixedLL.lat + ", " + fixedLL.lon;
                if(popDetails != null){
                    popDetails.infoWnd.close();
                    popDetails.infoMarker.setMap(null);
                }
                popDetails = markerInfoPopup(popPt, content, "Ready to Push Click");
                popDetails.infoWnd.open(mphmap, popDetails.infoMarker);
                if(selfPusherDetails.pusher)
                {
                    var latlng = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : "0"};
                    console.log("You clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
                    selfPusherDetails.pusher.channel(selfPusherDetails.channel).trigger('client-MapClickEvent', latlng);
                }
            }
            function extractBounds(action)
            {
                var zm = mphmap.getZoom();
                var cntr = mphmap.getCenter();
                var fixedLL = utils.toFixed(cntr.lng(),cntr.lat(), 3);
                var xtntDict = {'src' : 'google', 
                    'zoom' : zm, 
                    'lon' : fixedLL.lon, 
                    'lat' : fixedLL.lat,
                    'scale': scale2Level[zm].scale,
                    'action': action};
                return xtntDict;
            }
                
            function retrievedClick(clickPt)
            {
                var fixedLL = utils.toFixed(clickPt.x, clickPt.y, 3);
                console.log("Back in retrievedClick - You clicked the map at " +  clickPt.x + ", " + clickPt.y);
                var latlng = L.latLng(clickPt.y, clickPt.x, clickPt.y);
                
                var popPt = new google.maps.LatLng(clickPt.y, clickPt.x);
                var content = "You clicked the map at " + fixedLL.lat + ", " + fixedLL.lon;
                if(popDetails != null){
                    popDetails.infoWnd.close();
                    popDetails.infoMarker.setMap(null);
                }
                popDetails = markerInfoPopup(popPt, content, "Received Pushed Click");
                popDetails.infoWnd.open(mphmap, popDetails.infoMarker);
            }
        
            function getEventDictionary(){
                var eventDct = 
                    {'client-MapXtntEvent' : retrievedBounds,
                    'client-MapClickEvent' : retrievedClick
                    }
                return eventDct;
            }
            function retrievedBoundsInternal(xj)
            {
                console.log("Back in retrievedBounds");
                var zm = xj.zoom
                var cmp = compareExtents("retrievedBounds", {'zoom' : zm, 'lon' : xj.lon, 'lat' : xj.lat});
                var view = xj.lon + ", " + xj.lat + " : " + zm + " " + scale2Level[zm].scale;
                document.getElementById("mpnm").innerHTML = view;
                if(cmp == false)
                {
                    var tmpLon = cntrxG;
                    var tmpLat = cntryG;
                    var tmpZm = zmG;
                    
                    updateGlobals("retrievedBounds with cmp false", xj.lon, xj.lat, xj.zoom);
                    userZoom = false;
                    var cntr = new google.maps.LatLng(xj.lat, xj.lon);
                    userZoom = true;
                    if(xj.action == 'pan')
                    {
                        if(tmpZm != zm)
                        {
                            mphmap.setZoom(zm);
                        }
                        mphmap.setCenter(cntr);
                    }
                    else
                    {
                        if(tmpLon != xj.lon || tmpLat != xj.lat)
                        {
                            mphmap.setCenter(cntr);
                        }
                        mphmap.setZoom(zm);
                    }
                    // userZoom = true;
                }
            }

            function setBounds(action)
            {
                if(mapReady == true) // && stomp && stomp.ready == true)
                {
                    // runs this code after you finishing the zoom
                    var xtExt = extractBounds(action);
                    var xtntJsonStr = JSON.stringify(xtExt);
                    console.log("extracted bounds " + xtntJsonStr);
                    var cmp = compareExtents("setBounds", xtExt);
                    if(cmp == false)
                    {
                        console.log("MapHoster setBounds pusher send to channel " + selfPusherDetails.channel);
                        if(selfPusherDetails.pusher)
                        {
                            selfPusherDetails.pusher.channel(selfPusherDetails.channel).trigger('client-MapXtntEvent', xtExt);
                        }
                        updateGlobals("setBounds with cmp false", xtExt.lon, xtExt.lat, xtExt.zoom);
                    }
                }
            }
            
            function getBoundsZoomLevel(bounds)
            {
                var GLOBE_HEIGHT = 256; // Height of a google map that displays the entire world when zoomed all the way out
                var GLOBE_WIDTH = 256; // Width of a google map that displays the entire world when zoomed all the way out

                var ne = bounds.getNorthEast();
                var sw = bounds.getSouthWest();

                var latAngle = ne.lat() - sw.lat();
                if (latAngle < 0) {
                    latAngle += 360;
                }

                var lngAngle = ne.lng() - sw.lng();

                var latZoomLevel = Math.floor(Math.log(mphmap.height * 360 / latAngle / GLOBE_HEIGHT) / Math.LN2);
                var lngZoomLevel = Math.floor(Math.log(mphmap.width * 360 / lngAngle / GLOBE_WIDTH) / Math.LN2);

                return (latZoomLevel < lngZoomLevel) ? latZoomLevel : lngZoomLevel;
            }

        function collectScales(levels)
        {
            scale2Level = [];
            var sc2lv = scale2Level;
            var topLevel = ++levels;
            var scale = 1128.497220;
            for(var i=topLevel; i>0; i--)
            {
                var obj = {"scale" : scale, "level" : i};
                scale = scale * 2;
                // console.log("scale " + obj.scale + " level " + obj.level);
                sc2lv.push(obj);
            }
        }
         
        function updateGlobals(msg, cntrx, cntry, zm)
        {
            console.log("updateGlobals ");
            var gmBounds = mphmap.getBounds();
            if(gmBounds)
            {
                var ne = gmBounds.getNorthEast();
                var sw = gmBounds.getSouthWest();
                bounds = gmBounds;
                gmBounds.xmin = sw.lng();
                gmBounds.ymin = sw.lat();
                gmBounds.xmax = ne.lng();
                gmBounds.ymax = ne.lat();
            }
            zmG = zm; cntrxG = cntrx; cntryG = cntry;
            console.log("Updated Globals " + msg + " " + cntrxG + ", " + cntryG + " : " + zmG);
            PositionViewCtrl.update('zm', {
                'zm' : zmG,
                'scl' : scale2Level.length > 0 ? scale2Level[zmG].scale : 3,
                'cntrlng' : cntrxG,
                'cntrlat': cntryG,
                'evlng' : cntrxG,
                'evlat' : cntryG
            });
        }

        function showGlobals(cntxt)
        {
            console.log( cntxt + " Globals : lon " + cntrxG + " lat " + cntryG + " zoom " + zmG);
        }

        function compareExtents(msg, xtnt)
        {
            var cmp = true;
            var gmBounds = mphmap.getBounds();
            if(gmBounds)
            {
                var ne = gmBounds.getNorthEast();
                var sw = gmBounds.getSouthWest();
                var cmp = xtnt.zoom == zmG;
                var wdth = Math.abs(ne.lng() - sw.lng());
                var hgt = Math.abs(ne.lat() - sw.lat());
                var lonDif = Math.abs((xtnt.lon - cntrxG) / wdth);
                var latDif =  Math.abs((xtnt.lat - cntryG) / hgt);
                // cmp = ((cmp == true) && (xtnt.lon == cntrxG) && (xtnt.lat == cntryG));
                cmp = ((cmp == true) && (lonDif < 0.0005) && (latDif < 0.0005));
                console.log("compareExtents " + msg + " " + cmp)
            }
            return cmp;
        }

        function polygon(coords)
        {
            arrayLatLng = []
            for(var i=0; i<coords.length; i++)
            {
                arrayLatLng.push(new google.maps.LatLng(coords[i][0], coords[i][1]));
            }
            pgn = new google.maps.Polygon({
                paths: arrayLatLng,
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 4,
                fillColor: "#FF0000",
                fillOpacity: 0.25
                });

            pgn.setMap(mphmap);
        }

        function circle(cntr, rds)
        {
            var cntrLatLng = new google.maps.LatLng(cntr[0], cntr[1]);
            crcl = new google.maps.Circle({
                center: cntrLatLng,
                radius: rds,
                strokeColor: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            });

            crcl.setMap(mphmap);
        }

        function markerInfoPopup(pos, content, title)
        {
            var popId = "id" + title;
            var contentString = '<div id="content">'+
                    '<h3 id="' + popId + '">' + title + '</h3>'+
                    '<div id="bodyContent">'+
                    content +
                    '</div>'+
                    '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                var marker = new google.maps.Marker({
                    position: pos,
                    map: mphmap,
                    title: title
                });
                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.open(mphmap,marker);
                });
            return { "infoWnd" : infowindow, "infoMarker" : marker};
        }


        function addInitialSymbols()
        {  
            var popPt = new google.maps.LatLng(41.795, -87.695);
            var content = "Great home with spectacular view of abandoned industrial site";
            markerInfoPopup(popPt, content, "Prime home for sale");
            popPt = new google.maps.LatLng(41.805, -87.705);
            content = "Perfect hangout for the undiscriminating cave dweller";
            markerInfoPopup(popPt, content, "Perfection in Paradise");
            // this.polygon([
                // [51.509, -0.08],
                // [51.503, -0.06],
                // [51.51, -0.047]
            // ]);
            // this.circle([51.508, -0.11], 500);
        }

        // MapHosterGoogle.prototype.setPusherClient = function (pusher, channel)
        function setPusherClient(pusher, channel)
        {   
            selfPusherDetails.pusher = pusher;
            selfPusherDetails.channel = channel;
            pusher.subscribe( 'client-MapXtntEvent', retrievedBounds);
            pusher.subscribe( 'client-MapClicktEvent', retrievedClick);
            console.log("reset MapHosterArcGIS setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
        }
        function getGlobalsForUrl()
        {
            return "&lon=" + cntrxG + "&lat=" + cntryG + "&zoom=" + zmG; 
        }
        
        function retrievedBounds(xj)
        {
            return retrievedBoundsInternal(xj);
        }
        
        function MapHosterGoogle()
        {
            mapReady = false;
            bounds = null;
            userZoom = true;
        }
        
        function init() {
            return MapHosterGoogle;
        }
        
        function resizeWebSiteVertical(isMapExpanded){
            console.log('resizeWebSiteVertical');
            // map.invalidateSize(true);
            var center = mphmap.getCenter();
            var bnds = mphmap.getBounds();
            console.debug(bnds);
            google.maps.event.trigger(mphmap, 'resize');
            mphmap.setCenter(center);
        }
        function resizeVerbageHorizontal(isMapExpanded){
            console.log('resizeVerbageHorizontal');
            // mphmap.invalidateSize(true);
            var center = mphmap.getCenter();
            google.maps.event.trigger(mphmap, 'resize');
            mphmap.setCenter(center);
        }

        return { start: init, config : configureMap,
                 resizeWebSite: resizeWebSiteVertical, resizeVerbage: resizeVerbageHorizontal,
                  retrievedBounds: retrievedBounds, retrievedClick: retrievedClick,
                  setPusherClient: setPusherClient, getGlobalsForUrl: getGlobalsForUrl,
                  getEventDictionary : getEventDictionary };
    });

}).call(this);
