define([
  'angular',
  'controllers/MasherCtrl',
  'controllers/MapCtrl'
], function(angular){

  // define our app as an angular module
  return angular.module("app", ['ngRoute', 'ui.bootstrap', 'ngGrid']);
});