
function MapHosterGoogle(gMap)
{
    var self = this;
    this.mapReady = false;
    this.map = gMap;
    this.pusher = null;
    this.bounds = null;
    this.userZoom = true;
    this.updateGlobals("init", -87.7, 41.8,  13, 0.0);
    // self.updateGlobals("init", -0.09, 51.50, 13, 0.0);
    this.showGlobals("Prior to new Map");
    google.maps.event.addListener(gMap, 'dragend', function() 
		{self.setBounds('pan');});
    google.maps.event.addListener(gMap, "zoom_changed", function() {
        if(self.userZoom == true)
            self.setBounds('zoom', null);
        // self.userZoom = true;
        }
    );
	
	google.maps.event.addListener(gMap, "mousemove", function(e) 
		{
			var ltln = e.latLng;
			var fixedLL = utils.toFixed(ltln.lng(),ltln.lat(), 3);
			var evlng = fixedLL.lon;
			var evlat = fixedLL.lat;
			var zm = self.map.getZoom();
			var cntr = self.map.getCenter();
			var fixedCntrLL = utils.toFixed(cntr.lng(),cntr.lat(), 3);
			var cntrlng = fixedCntrLL.lon;
			var cntrlat = fixedCntrLL.lat;
			if(self.scale2Level)
			{
				var view = cntrlng + ", " + cntrlat + " : " + evlng + ", " + evlat + " : " + 
					zm + " " + self.scale2Level[zm].scale;
				document.getElementById("mpnm").innerHTML = view;
			}
		}
	);
    this.mapReady = true;
    this.addInitialSymbols();
    
    this.minZoom = 0;
    var zsvc = new google.maps.MaxZoomService();
    var cntr = new google.maps.LatLng(this.cntryG, this.cntrxG);
    
    zsvc.getMaxZoomAtLatLng(cntr, function(response) 
    {
        if (response && response['status'] == google.maps.MaxZoomStatus.OK) 
        {
            self.maxZoom = response['zoom'];
            self.zoomLevels = self.maxZoom - self.minZoom;
            self.collectScales(self.zoomLevels);
        }
    });
    
    this.extractBounds = function (action)
    {
        var zm = this.map.getZoom();
        var cntr = this.map.getCenter();
		var fixedLL = utils.toFixed(cntr.lng(),cntr.lat(), 3);
        var xtntDict = {'src' : 'google', 
            'zoom' : zm, 
            'lon' : fixedLL.lon, 
            'lat' : fixedLL.lat,
            'scale': self.scale2Level[zm].scale,
            'action': action};
        return xtntDict;
    }
        
     this.retrievedBounds = function(xj)
    {
        console.log("Back in retrievedBounds");
        var zm = xj.zoom
        var cmp = self.compareExtents("retrievedBounds", {'zoom' : zm, 'lon' : xj.lon, 'lat' : xj.lat});
        var view = xj.lon + ", " + xj.lat + " : " + zm + " " + self.scale2Level[zm].scale;
        document.getElementById("mpnm").innerHTML = view;
        if(cmp == false)
        {
			var tmpLon = self.cntrxG;
			var tmpLat = self.cntryG;
			var tmpZm = self.zmG;
			
            self.updateGlobals("retrievedBounds with cmp false", xj.lon, xj.lat, xj.zoom);
            self.userZoom = false;
            var cntr = new google.maps.LatLng(xj.lat, xj.lon);
            self.userZoom = true;
            if(xj.action == 'pan')
			{
				if(tmpZm != zm)
				{
					self.map.setZoom(zm);
				}
                self.map.setCenter(cntr);
			}
            else
			{
				if(tmpLon != xj.lon || tmpLat != xj.lat)
				{
					self.map.setCenter(cntr);
				}
                self.map.setZoom(zm);
			}
            // self.userZoom = true;
        }
    }

    this.setBounds = function(action)
    {
        if(self.mapReady == true) // && self.stomp && self.stomp.ready == true)
        {
            // runs this code after you finishing the zoom
            var xtExt = self.extractBounds(action);
            var xtntJsonStr = JSON.stringify(xtExt);
            console.log("extracted bounds " + xtntJsonStr);
            var cmp = self.compareExtents("setBounds", xtExt);
            if(cmp == false)
            {
                console.log("MapHoster setBounds pusher send to channel " + this.channel);
                if(self.pusher)
				{
					self.pusher.channel(this.channel).trigger('client-MapXtntEvent', xtExt);
				}
                self.updateGlobals("setBounds with cmp false", xtExt.lon, xtExt.lat, xtExt.zoom);
            }
        }
    }
    
    this.getBoundsZoomLevel = function(bounds)
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

        var latZoomLevel = Math.floor(Math.log(self.map.height * 360 / latAngle / GLOBE_HEIGHT) / Math.LN2);
        var lngZoomLevel = Math.floor(Math.log(self.map.width * 360 / lngAngle / GLOBE_WIDTH) / Math.LN2);

        return (latZoomLevel < lngZoomLevel) ? latZoomLevel : lngZoomLevel;
    }
	this.getGlobalsForUrl = function()
	{
		return "&lon=" + this.cntrxG + "&lat=" + this.cntryG + "&zoom=" + this.zmG; 
	}
}

MapHosterGoogle.prototype.collectScales = function(levels)
{
    this.scale2Level = [];
    var sc2lv = this.scale2Level;
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
 
MapHosterGoogle.prototype.updateGlobals = function(msg, cntrx, cntry, zm)
{
    console.log("updateGlobals ");
	var gmBounds = this.map.getBounds();
	if(gmBounds)
	{
		var ne = gmBounds.getNorthEast();
		var sw = gmBounds.getSouthWest();
		this.bounds = gmBounds;
		gmBounds.xmin = sw.lng();
		gmBounds.ymin = sw.lat();
		gmBounds.xmax = ne.lng();
		gmBounds.ymax = ne.lat();
	}
	this.zmG = zm; this.cntrxG = cntrx; this.cntryG = cntry;
	console.log("Updated Globals " + msg + " " + this.cntrxG + ", " + this.cntryG + " : " + this.zmG);
}

MapHosterGoogle.prototype.showGlobals = function(cntxt)
{
    console.log( cntxt + " Globals : lon " + this.cntrxG + " lat " + this.cntryG + " zoom " + this.zmG);
}

MapHosterGoogle.prototype.compareExtents = function(msg, xtnt)
{
	var cmp = true;
	var gmBounds = this.map.getBounds();
	if(gmBounds)
	{
		var ne = gmBounds.getNorthEast();
		var sw = gmBounds.getSouthWest();
		cmp = xtnt.zoom == this.zmG;
		var wdth = Math.abs(ne.lng() - sw.lng());
		var hgt = Math.abs(ne.lat() - sw.lat());
		lonDif = Math.abs((xtnt.lon - this.cntrxG) / wdth);
		latDif =  Math.abs((xtnt.lat - this.cntryG) / hgt);
		// cmp = ((cmp == true) && (xtnt.lon == this.cntrxG) && (xtnt.lat == this.cntryG));
		cmp = ((cmp == true) && (lonDif < 0.0005) && (latDif < 0.0005));
		console.log("compareExtents " + msg + " " + cmp)
	}
    return cmp;
}

MapHosterGoogle.prototype.polygon = function(coords)
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

    pgn.setMap(this.map);
}

MapHosterGoogle.prototype.circle = function(cntr, rds)
{
    var cntrLatLng = new google.maps.LatLng(cntr[0], cntr[1]);
    crcl = new google.maps.Circle({
        center: cntrLatLng,
        radius: rds,
        strokeColor: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    });

    crcl.setMap(this.map);
}

MapHosterGoogle.prototype.markerInfoPopup = function(pos, content, title)
{
	var popId = "id" + title;
	var map = this.map;
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
            map: map,
            title: title
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });
}


MapHosterGoogle.prototype.addInitialSymbols = function ()
{  
	var popPt = new google.maps.LatLng(41.795, -87.695);
	var content = "Great home with spectacular view of abandoned industrial site";
	this.markerInfoPopup(popPt, content, "Prime home for sale");
	popPt = new google.maps.LatLng(41.805, -87.705);
	content = "Perfect hangout for the undiscriminating cave dweller";
	this.markerInfoPopup(popPt, content, "Perfection in Paradise");
    // this.polygon([
        // [51.509, -0.08],
        // [51.503, -0.06],
        // [51.51, -0.047]
    // ]);
    // this.circle([51.508, -0.11], 500);
}

MapHosterGoogle.prototype.setPusherClient = function (pusher, channel)
{   
    this.pusher = pusher;
    this.channel = channel;
}