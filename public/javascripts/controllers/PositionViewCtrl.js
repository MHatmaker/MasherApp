
(function() {
    "use strict";

    console.log('PositionViewCtrl setup');
    define(['angular'], function(angular) {
        console.log('PositionViewCtrl define');
        
        var selfMethods = {};
        
        var curDetails = {
            zm : 'zm',
            scl : 'scl',
            cntrlng : 'cntrlng',
            cntrlat : 'cntrlat',
            evlng : 'evlng',
            evlat : 'evlat'
        };
        var posViewTextElement = null;
        function PositionViewCtrl($scope) {
            console.debug('PositionViewCtrl - initialize dropdown for position selections');
            
            $scope.viewOptions = [
            { 
              type : 'zoom level',
              key : 'zm',
              value : 'zm, scale'
            },
            { 
              type : 'map center',
              key : 'cntr',
              value : 'cntrlng, cntrlat'
            },
            { 
              type : 'mouse coordinates',
              key : 'coords',
              value : 'evlng, evlat'
            }
            ];
            
            $scope.currentViewOption = $scope.viewOptions[2]; 
            // $scope.positionView = "position info";
            // posViewTextElement = angular.element(document.getElementById('mppos'));
            posViewTextElement = document.getElementById('mppos');
            
            $scope.updateDetails = {
                'zm' : function(opt){curDetails['zm'] = opt['zm']; curDetails['scl'] = opt['scl'];},
                'cntr' : function(opt) {curDetails['cntrlng'] = opt['cntrlng']; curDetails['cntrlat'] = opt['cntrlat'];},
                'coords' : function(opt) {curDetails['evlng'] = opt['evlng']; curDetails['evlat'] = opt['evlat'];}
            };
            $scope.formatView = {
                'zm' : function(zlevel){
                    var formatted = "Zoom : " + zlevel['zm'] + " Scale : " + zlevel['scl'];
                    console.log("old : " + posViewTextElement.value + " new " + formatted);
                    // $scope.positionView = formatted;
                    posViewTextElement.value = formatted;
                },
                'cntr' : function(cntr) {
                    var formatted  = cntr['cntrlng'] + ', ' + cntr['cntrlat'];
                    console.log("old : " + posViewTextElement.value + " new " + formatted);
                    // $scope.positionView = formatted;
                    posViewTextElement.value = formatted;
                },
                'coords' : function(evnt) {
                    var formatted  = evnt['evlng'] + ', ' + evnt['evlat'];
                    // console.log("old : " + $scope.positionView + " new " + formatted);'];
                    console.log("old : " + posViewTextElement.value + " new " + formatted);
                    // $scope.positionView = formatted;
                    // posViewTextElement = angular.element(document.getElementById('mppos'));
                    posViewTextElement = document.getElementById('mppos');
                    posViewTextElement.value = formatted;
                }
            };
            var curKey = 'coords';

           
            $scope.setPostionDisplayType = function() {
                //alert("changed " + $scope.selectedOption.value);
                // $scope.positionView = $scope.selectedOption.value;
                console.log("setPostionDisplayType : " + $scope.currentViewOption.key);
                curKey = $scope.currentViewOption.key;
                $scope.formatView[curKey](curDetails);
            };
            
            $scope.updatePosition = function(key, val){
                console.log("in updatePosition");
                if(key == 'zm' || key == 'cntr'){
                    $scope.updateDetails['zm'](val);
                    $scope.updateDetails['cntr'](val);
                }
                else{
                        $scope.updateDetails[key](val);
                }
                if(key = $scope.currentViewOption.key){
                    console.log("calling $apply()");
                    // $scope.$apply( $scope.formatView[key](val));
                    $scope.formatView[key](val);
                    //angular.element("mppos").scope().$apply();
                }
            };
            $scope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                  if(phase == '$apply' || phase == '$digest') {
                      if(fn && (typeof(fn) === 'function')) {
                          fn();
                      }
                  } else {
                    this.$apply(fn);
                }
            };
        
            selfMethods["updatePosition"] = $scope.updatePosition;
        
        };
          
        PositionViewCtrl.prototype.updatePosition = function (key, val){
            selfMethods["updatePosition"](key, val);
        }

        function init(App) {
            console.log('PositionViewCtrl init');
            App.controller('PositionViewCtrl', ['$scope', PositionViewCtrl]);
            return PositionViewCtrl;
        }

        return { start: init, update : PositionViewCtrl.prototype.updatePosition};

    });

}).call(this);