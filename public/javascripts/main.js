define([
  'angular'
], function(angular){

  // define our app as an angular module
  return angular.module("app", ['ngRoute', 'ui.bootstrap', 'ngGrid']);
});


define('dojo', function () {
    if (dojo) {
        return dojo;
    }
    return {};
});


define('dojo/domReady', function () {
    if (ready) {
        return ready;
    }
    return {};
});

define('esri/arcgis/Portal', function () {
    if (esriarcgisportal) {
        return esriarcgisportal;
    }
    return {};
});

