/*global angular:true */

(function(angular){
    'use strict';

  // get the root path from the URL
    
    var locationPath = "";
    var pathRX = new RegExp(/\/[^\/]+$/), locationPath = location.pathname.replace(pathRX, '');
    console.log(locationPath);

  // register a module called "angular" so we can use it with "require" later
    define('angular', function () {
        if (angular) {
            return angular;
        }
        return {};
    });
        
  // setup Dojo and register our application components
    require({
        async: true,
        //aliases: [['text', 'dojo/text']],
       /*  
        packages: [{
          name: 'app',
          location: locationPath + 'javascripts'
        },
        {
            name: 'controllers',
            location: locationPath + 'javascripts/controllers'
        }, 
        {
            name: 'lib',
            location: locationPath + 'javascripts/lib'
        },
        {
            name: 'javascripts',
            location: locationPath + 'javascripts'
        }
        ]
         */
    });


}(angular));