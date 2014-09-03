var dojoConfig = {
    async: true,
    baseUrl:  "/javascripts/", //ajax.googleapis.com/ajax/libs/dojo/1.9.3/" 
    parseOnLoad: true, 
    tlmSiblingOfDojo: false,
    
        packages: [{
          name: 'dojo',
          location: getLocationPath('//serverapi.arcgisonline.com/jsapi/arcgis/?v=3.5compact')
        }
        ],
    /* 
        packages: [{
          name: 'app',
          location: getLocationPath('javascripts')
        },
        {
            name: 'controllers',
            location: getLocationPath('javascripts/controllers')
        }, 
        {
            name: 'lib',
            location: getLocationPath('javascripts/lib')
        },
        {
            name: 'javascripts',
            location: getLocationPath('javascripts')
        }
        ],
         */
    map: {
        // Instead of having to type "dojo/domReady!", we just want "ready!" instead
        
        "*": {
            ready: "dojo/domReady",
            esriarcgisportal: "esri/arcgis/Portal"
        }
        }

};

function getLocationPath(addon){
  // get the root path from the URL
    
    var locationPath = "";
    var pathRX = new RegExp(/\/[^\/]+$/), locationPath = location.pathname.replace(pathRX, '');
    console.log(locationPath + addon);
    return locationPath + addon;
}