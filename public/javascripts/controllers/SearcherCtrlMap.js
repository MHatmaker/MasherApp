/*global define */
/*global dojo */

angular.isUndefinedOrNull = function (val) {
    "use strict";
    return angular.isUndefined(val) || val === null;
};

(function () {
    "use strict";

    console.log('SearcherCtrlMap setup');
    define([
        'angular',
        'lib/StartupArcGIS',
        'lib/MapHosterArcGIS',
        'lib/utils',
        'lib/AgoNewWindowConfig',
        'controllers/StompSetupCtrl'
    ], function (angular, StartupArcGIS, MapHosterArcGIS, utils, AgoNewWindowConfig, StompSetupCtrl) {
        console.log('SearcherCtrlMap define');
        var scopeDict = {},
            portalForSearch = null;

        function SearcherCtrlMap($scope, $rootScope) {
            var self = this,
                selectedWebMapId = "Nada ID",
                selectedWebMapTitle = "Nada Title",
                onAcceptDestination,
                pos;

            $scope.findMapDisabled = false;
            $scope.searchTermMap = "Chicago Crime";

            $scope.isMapAccPanelOpen = false;
            $scope.signInOutMap = "Sign In";
            scopeDict.rootScope = $rootScope;

            self.scope = $scope;

            $scope.destWindow = 'cancelMashOp';
            $scope.selectedItm = "Nada";

            onAcceptDestination = function (destWnd) {
                var
                    $inj = angular.injector(['app']),
                    serv = $inj.get('CurrentMapTypeService'),
                    selMph = serv.getSelectedMapType();
                console.log("onAcceptDestination " + destWnd);
                selMph.removeEventListeners();
                $scope.$parent.accept();

                console.log("onAcceptDestination " + destWnd);
                StartupArcGIS.replaceWebMap(selectedWebMapId,  destWnd, selectedWebMapTitle, selMph);
            };

            $scope.onDestinationWindowSelected = function (args) {
                var destWnd = args.dstWnd,
                    $inj = angular.injector(['app']),
                    serv = $inj.get('CurrentMapTypeService'),
                    selMph = serv.getSelectedMapType();
                console.log("onAcceptDestination " + destWnd);
                selMph.removeEventListeners();


                console.log("onDestinationWindowSelected " + destWnd);
                StartupArcGIS.replaceWebMap(selectedWebMapId,  destWnd, selectedWebMapTitle, selMph);
            };

            $scope.selectWebMap = function(rowItem) {
                selectedWebMapId = rowItem.entity.id;
                selectedWebMapTitle = rowItem.entity.title;
                $scope.openWindowSelectionDialog(
                    {
                        'id' : rowItem.entity.id,
                        'title' : rowItem.entity.title,
                        'snippet' : rowItem.entity.snippet,
                        'icon' : rowItem.entity.thumbnail
                    }
                );
            }

            $scope.imgWebMapTmplt = '<img ng-src="{{row.getProperty(col.name)}}" width="50" height="50"/>';
            // $scope.imgWebMapTmplt = '<img ng-src="{{imgUrlBase}}{{row.getProperty(\'id\')}}/info/{{row.getProperty(col.field)}}" width="50" height="50" />';

            $scope.gridOptions = {
                // data: 'gridData',
                rowHeight: 50,
                // afterSelectionChange:  $scope.mapSelectionChanged,
                // multiSelect: false,
                // displayFooter: true,
                // enableColumnResize : true,
                expandableRowTemplate : '<div ui-grid="row.entity.subGridOptions" style="height: 100px; width: 100%;"></div>',


                expandableRowHeight: 95,

                //subGridVariable will be available in subGrid scope
                expandableRowScope: {
                    subGridVariable: 'subGridScopeVariable'
                },
                data : [],
                columnDefs: [
                    {
                        name : 'thumbnail',
                        field : 'thumbnail',
                        displayName : 'Img',
                        resizable : false,
                        width : 60,
                        // cellTemplate : '<img ng-src="{{row.getProperty(col.field)}}" width="50" height="50"/>'
                        cellTemplate:"<img width=\"50px\" ng-src=\"{{grid.getCellValue(row, col)}}\" lazy-src>"

                    },
                    {
                        name : ' ',
                        cellTemplate : '<div><button ng-click="grid.appScope.selectWebMap(row)">Select</button></div>',
                        width : 60
                    },
                    {
                        field : 'title',
                        name : 'title',
                        displayName : 'Map Title'
                    },
                    {
                        field : 'url',
                        name : 'url',
                        visible : false
                    },
                    {
                        field : 'snippet',
                        name : 'snippet',
                        visible : false
                    },
                    {
                        field : 'id',
                        name : 'id',
                        visible : false,
                        displayName : 'ID'
                    },

                ]
            };

            function transformResponse(results) {
                var trnsf = [],
                rsp,
                i,
                mp,
                mpsub,
                colDefs = [
                    {
                        field : 'snippet',
                        name : 'snippet',
                        displayName : 'Description'
//                        cellTemplate : '<div style="word-wrap: normal" title="{{row.getProperty(col.field)}}">{{row.getProperty(col.field)}}</div>',
                    },
                    {
                        field : 'owner',
                        name : 'owner',
                        visible : false
                    }
                ];


                for (i = 0; i < 4; i++) {
                    rsp = results[i];
                    mp = {};
                    mp.title = rsp.title;
                    mp.owner = rsp.owner;
                    mp.thumbnail = rsp.thumbnailUrl;
                    mp.url = rsp.itemUrl;
                    mp.id = rsp.id;
                    mp.snippet = rsp.snippet;

                    mp.subGridOptions = {};
                    mp.subGridOptions.columnDefs = colDefs;
                    mp.subGridOptions.data = [];
                    mpsub = {};
                    mpsub.snippet = rsp.snippet;
                    mpsub.id =rsp.id;
                    mpsub.owner = rsp.owner;
                    mp.subGridOptions.data.push(mpsub);

                    trnsf.push(mp);
                }
                return trnsf;
            }

            $scope.showMapResults = function (response) {
                var mpdata = [],
                    rsp,
                    i,
                    mp = {},
                    mpsub;
                // utils.hideLoading();
                //clear any existing results
                console.log("showMapResults");
                console.debug(response);
                console.log("response.total " + response.total);

                if (response.total > 0) {
                    console.log("found array with length " + response.total);
                    mpdata = transformResponse(response.results);

                    setTimeout(function() {
                        $scope.safeApply(console.log("showMapResults $apply before loading grid"));
                    }, 500);

                    $scope.gridOptions.data = mpdata;

                }
                utils.hideLoading();
            };

            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
            };

            console.log("window width " + window.innerWidth);

            //  handleWindowResize() seems to have been the cause of inconsistent display/trashing of rows and columns.
            // setTimeout(function () {
            //      $scope.gridApi.grid.handleWindowResize();
            //      $scope.safeApply();
            //  }, 1000);

            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    if (fn && (typeof fn === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            $scope.redrawGrid = function () {
                window.setTimeout(function () {
                    $(window).resize();
                    $(window).resize();
                }, 250);
            };

            $scope.findArcGISGroupMaps = function (portal, searchTermMap) {
                utils.showLoading();
                var mf = document.getElementById('mapFinder'),
                    mfa = angular.element(mf),
                    keyword,
                    params = {};
                mfa.scope().safeApply();
                keyword = mf.value; // searchTermMap; //dojo.byId('mapFinder').value;
                params = {
                    q: ' type:"Web Map" -type:"Web Mapping Application" ' + keyword,
                    num: 20
                };
                portalForSearch.queryItems(params).then(function (data) {
                    $scope.showMapResults(data);
                });
            };


            // gets private groups as well
            $scope.signInFromMapTab = function () {
                console.log("signInFromMapTab");
                // self.portal = portalForSearch;

                if ($scope.signInOutMap.indexOf('In') !== -1) {
                    portalForSearch.signIn().then(function (loggedInUser) {
                        $scope.$emit('SignInOutEmitEvent'); //out
                        $scope.findArcGISGroupMaps(portalForSearch, $scope.searchTermMap);   // update results
                    }, function (error) {  //error so reset sign in link
                        $scope.$emit('SignInOutEmitEvent'); //in
                    });
                } else {
                    portalForSearch.signOut().then(function (portalInfo) {
                        $scope.$emit('SignInOutEmitEvent'); //in
                        $scope.findArcGISGroupMaps(portalForSearch, $scope.searchTermMap);
                    });
                }
            };

            $scope.$on('SignInOutBroadcastEvent', function (event, isSignedIn) {
                if (isSignedIn) {
                    $scope.signInOutMap = "Sign Out";
                } else {
                    $scope.signInOutMap = "Sign In";
                }
            });

            $scope.$on('OpenMapPaneCommand', function (event, args) {
                $scope.showMapResults(args.respData);
            });

            //display a list of groups that match the input user name


            // $scope.openWindowSelectionDialog = function (modal311, selectedWebMapId, selectedMapTitle) {
            $scope.openWindowSelectionDialog = function (info) {

                var $inj = angular.injector(['app']),
                    gmQSvc = $inj.get('GoogleQueryService'),
                    scope = gmQSvc.getQueryDestinationDialogScope('arcgis'),
                    serv = $inj.get('CurrentMapTypeService'),
                    selMph = serv.getSelectedMapType();
                selMph.removeEventListeners();

                scope.showDestDialog(
                    onAcceptDestination,
                    scope,
                    {
                        'id' : info.id,
                        'title' : info.title,
                        'snippet' : info.snippet,
                        'icon' : info.icon,
                        'mapType' : info.mapType
                    }
                );
            };
        }

        function init(App, portal) {
            console.log('SearcherCtrlMap init');
            console.debug(App);
            var CurrentWebMapIdService = App.service("CurrentWebMapIdService");
            console.debug(CurrentWebMapIdService);
            App.controller('SearcherCtrlMap',  ['$scope', '$rootScope', SearcherCtrlMap]);

            // SearcherCtrlMap.CurrentWebMapIdService= CurrentWebMapIdService;
            // selfDict.portal = portalForSearch;
            portalForSearch = portal;
            return SearcherCtrlMap;
        }

        return { start: init };

    });
}());
