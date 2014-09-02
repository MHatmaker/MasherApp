var dojoConfig = {
    //async: true,
    // parseOnLoad: true, 
    tlmSiblingOfDojo: false,
        packages: [{
          name: 'app',
          location: location.pathname + 'javascripts'
        },
        {
            name: 'controllers',
            location: location.pathname + 'javascripts/controllers'
        }, 
        {
            name: 'lib',
            location: location.pathname + 'javascripts/lib'
        },
        {
            name: 'javascripts',
            location: location.pathname + 'javascripts'
        }
      /*   
        {
            name: 'bootstrap',
            location: location.pathname + 'javascripts'
        }
         */
        ],
    map: {
        // Instead of having to type "dojo/domReady!", we just want "ready!" instead
        "*": {
            ready: "dojo/domReady"
        }
    } //,
     
    // baseUrl:  "//ajax.googleapis.com/ajax/libs/dojo/1.9.3/" 
    };