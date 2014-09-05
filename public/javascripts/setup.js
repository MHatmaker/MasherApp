/*global angular:true */

// (function(angular){
    // 'use strict';

  // get the root path from the URL
    
    // var locationPath = "";
    // var pathRX = new RegExp(/\/[^\/]+$/), locationPath = location.pathname.replace(pathRX, '');
    // console.log(locationPath);

  // register a module called "angular" so we can use it with "require" later
    define('angular', function () {
        console.log("defining angular");
        if (angular) {
            console.debug(angular);
            return angular;
        }
        return {};
    });


// }(angular));