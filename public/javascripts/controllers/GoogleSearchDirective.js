(function() {
    "use strict";

    console.log('googleSearchDirective setup');
    define([
        'angular'
    ], function(angular) {
        console.log('googleSearchDirective define'); 
        
        function init(App) {
            console.log('googleSearchDirective init');
            App.directive('googleSearchDirective', function ($compile){
                return {
                  template: '<input id="pac-input" class="gmsearchcontrols" type="text" placeholder="Search Box">',
                  replace: true,
                  link: function(scope, element) {
                    element.after($compile('<google-search-directive></google-search-directive>')(scope));
                  }
                }
              });
        }

        return { start: init };

    });

}).call(this);

/*   

angular.module("main", []).controller("MyCtrl", function($scope) {
    $scope.test = 'Test Message';
}).directive("ngPortlet", function ($compile) {
	return {
		template: '<div>{{test}}</div>   ',
		restrict: 'E',
        link: function (scope, elm) {
            scope.add = function(){
                console.log(elm);
               elm.after($compile('<ng-portlet></ng-portlet>')(scope));
            }
        }
	};
});
 */

/* 
angular.module('demo', []).
  controller('demoController', function($scope) {
    $scope.inputs = [{
      inputType: 'checkbox',
      checked: true,
      label: 'input 1'
    }, {
      inputType: 'text',
      value: 'some text 1',
      label: 'input 2'
    }];

    $scope.doSomething = function() {
      alert('button clicked');
    };
  }).
  directive('demoDirective', function($compile) {
    return {
      template: '<div><label>{{input.label}}: </label></div>',
      replace: true,
      link: function(scope, element) {
        var el = angular.element('<span/>');
        switch(scope.input.inputType) {
          case 'checkbox':
            el.append('<input type="checkbox" ng-model="input.checked"/><button ng-if="input.checked" ng-click="input.checked=false; doSomething()">X</button>');
            break;
          case 'text':
            el.append('<input type="text" ng-model="input.value"/><button ng-if="input.value" ng-click="input.value=\'\'; doSomething()">X</button>');
            break;
        }
        $compile(el)(scope);
        element.append(el);
      }
    }
  });
   */