
(function() {
    "use strict";

    console.log('SearcherCtrl setup');
    define([
        'angular' //,
        // 'ngGrid'
    ], function(angular) {
        console.log('SearcherCtrl define');
        
        function SearcherCtrl($scope) {
            $scope.findGrpDisabled = false;
            $scope.searchTermGrp = "Chicago";
            $scope.searchTermMap = "Chicago Crime";
            $scope.signInOutGrp = "Sign In";
            $scope.signInOutMap = "Sign In";
            $scope.data = [
                {"id" : "ca8219b99d9442a8b21cd61e71ee48b8","title" : "Somewhere in Chicago", "snippet" : "foo", "thumbnail" : "foo.jpg"},
                {"id" : "0ba4d84db84e4564b936ec548ea91575","title" : "2013 Midwest Tornado Outbreak", "snippet" : "bar", "thumbnail" : "bar.jpg"}
                ];
            $scope.isMapAccPanelOpen = false;
            $scope.mapGriddata = [];
            $scope.mapGriddata = [
                {"id" : "ca8219b99d9442a8b21cd61e71ee48b8","title" : "Somewhere in Chicago", "snippet" : "foo", "thumbnail" : "thumbnail/foo.jpg"},
                {"id" : "0ba4d84db84e4564b936ec548ea91575","title" : "2013 Midwest Tornado Outbreak", "snippet" : "bar", "thumbnail" : "thumbnail/bar.jpg"}
                ];
                
            // $scope.imgWebMapUrlBase = 'http://www.arcgis.com/sharing/rest/content/items/';
            // $scope.imgWebMapTmplt = 
                // '<img ng-src="{{imgWebMapUrlBase}}{{row.getProperty(\'id\')}}/info/{{row.getProperty(col.field)}}" width="50" height="50" />';
            $scope.imgWebMapTmplt = '<img ng-src="{{row.getProperty(col.field)}}" width="50" height="50" />';
                
            $scope.gridMapOptions = { 
                data: 'mapGriddata',
                rowHeight: '50',
                
                columnDefs: [
                    {field:'thumbnail',
                     width: '50px',
                     displayName:'Img',
                     cellTemplate: $scope.imgWebMapTmplt},
                    {field:'snippet',
                     width: '60px',
                     displayName:'Description'},
                    {field:'title',
                     width: '56px',
                     displayName:'Map Title'},
                    {field:'id',
                     width: '58px',
                     displayName:'ID'}
                ]
                 
            };
            var self = this;
            self.scope = $scope;
            
            var layoutPlugin = new ngGridLayoutPlugin();
            
            $scope.updateLayout = function(){
              layoutPlugin.updateGridLayout();
            };
            $scope.selectedItm = "Nada";
            $scope.selectionChanged = function(rowItem,event){ 
                console.debug(rowItem.entity);
                console.debug(rowItem.entity.title   + '/' + rowItem.entity.thumbnail);
                $scope.isMapAccPanelOpen = ! $scope.isMapAccPanelOpen;
                var accPane = angular.element(document.getElementById("MapSearcherPane"));
                console.debug(accPane);
                console.log("isMapAccPanelOpen = " + $scope.isMapAccPanelOpen);
                $scope.findMapsForGroup(rowItem.entity.id);
                // $scope.selectedItm = rowItem.entity.thumbnail;
            };
            
            
            $scope.imgUrlBase = 'http://www.arcgis.com/sharing/rest/community/groups/';
            
            $scope.imgTmplt = 
                '<img ng-src="{{imgUrlBase}}{{row.getProperty(\'id\')}}/info/{{row.getProperty(col.field)}}" width="50" height="50" />';
            
            $scope.gridGrpOptions = { 
                data: 'data',
                // enablePaging: true,
                rowHeight: '50' ,
                // plugins: [layoutPlugin],
                multiSelect: false,
                afterSelectionChange:  $scope.selectionChanged,
                columnDefs: [ 
                    {field:'thumbnail',
                     width: '50px',
                     displayName:'Img',
                     cellTemplate: $scope.imgTmplt},
                    {field:'title',
                     width: '124px',
                     displayName: 'Group'},
                    {field: 'snippet',
                     width: '124px',
                     displayName: 'Description'},
                    {field: 'id',
                     visible: false,
                     displayName: '#'}
                ] 
            };
            
            var portal = null;
               // find groups based on input keyword
            $scope.findArcGISGroup = function() {
              console.log('findArcGISGroup');
              var keyword = $scope.searchTermGrp;
              var params = {
                q:  keyword,
                num:20  //find 40 items - max is 100
               };
               portalForSearch.queryGroups(params).then(function (data) {
                $scope.showGroupResults(data);
               });
            };
            
            
            $scope.getGridStyleMap = function () {                
                var vrbg = angular.element(document.getElementById("verbagePan"));
                var accHead = angular.element(document.getElementById("AccdianNews"));
                var srchWrap = angular.element(document.getElementById("searchToolWrapperMap"));
                var marginborder = (1 + 1) * 2;
                var accinnermarginborder = (1 + 9) * 2;
                var availableHgt = vrbg[0].offsetHeight - srchWrap[0].offsetHeight - accinnermarginborder -
                                    4 * (accHead[0].offsetHeight + marginborder);
                var rowHeight = 50;
                var headerHeight = 34;
                var height = +($scope.data.length * rowHeight + headerHeight);
                if (height > availableHgt) {
                    height = availableHgt;
                }
                return {
                    height: height + "px"
                };
            };
            
            $scope.getGridStyleGroup = function () {
                
                var vrbg = angular.element(document.getElementById("verbagePan"));
                var accHead = angular.element(document.getElementById("AccdianNews"));
                var srchWrap = angular.element(document.getElementById("searchToolWrapperGroup"));
                var marginborder = (1 + 1) * 2;
                var accinnermarginborder = (1 + 9) * 2;
                var availableHgt = vrbg[0].offsetHeight - srchWrap[0].offsetHeight - accinnermarginborder -
                                    4 * (accHead[0].offsetHeight + marginborder);
                var rowHeight = 50;
                var headerHeight = 34;
                var height = +($scope.data.length * rowHeight + headerHeight);
                if (height > availableHgt) {
                    height = availableHgt;
                }
                return {
                    height: height + "px"
                };
            };
                                       
            $scope.redrawGrid = function () {
                window.setTimeout(function () {
                    $(window).resize();
                    $(window).resize();
                }, 250);
            };
            
            $scope.showGroupResults = function(response) {
                //clear any existing results
                console.log('$scope.showGroupResults');
                
                    // gridGroupLocal.on("dgrid-select", function(event){
                        // Report the item from the selected row to the console.
                if (response.total > 0) {
                    var grddata = response.results;
                    //create the grid
                    $scope.data = response.results;
                    // $scope.gridGrpOptions.data = response.results;
                    console.debug($scope.data);
                    $scope.redrawGrid();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    // gridGrpOptions.data = data;
                        // console.log("Row selected: ", event.rows[0].data.title);
                        // console.log("Row selected: ", event.rows[0].data.id);
                    // });
              } else {
                dojo.byId('groupResults').innerHTML = '<h2>Group Results</h2><p>No groups were found. If the group is not public use the sign-in link to sign in and find private groups.</p>';
              }
            };
            
            $scope.findArcGISGroupMaps = function(portal, searchTermMap) {
              utils.showLoading();
              var keyword = searchTermMap; //dojo.byId('mapFinder').value;
              var params = {
                q: ' type:"Web Map" -type:"Web Mapping Application" ' + keyword,
                num: 20
              };
              portal.queryItems(params).then(function (data) {
                    $scope.showMapResults(data);
                });
            };
            
            $scope.findMapsForGroup = function(gId)
            {
              console.log("findMapsForGroup : " + gId);
              var params = {
                 q:  'id : ' +  gId,
                 num:20  //find 40 items - max is 100
                };
                
                portalForSearch.queryGroups(params).then(function(groups){
                //get group title and thumbnail url 
                if (groups.results.length > 0) {
                  console.log("group 0 results:");
                  var group = groups.results[0];
                  console.debug(group);
                  
                  //Retrieve the web maps and applications from the group and display 
                  var params = {
                    q: ' type:"Web Map" -type:"Web Mapping Application"',
                    num: 10
                  };
                  group.queryItems(params).then(function (data) {
                        $scope.showMapResults(data);
                    });
                }
              });
            };
            
            // gets private groups as well
            $scope.signInFromGroupTab = function() {
              console.log("signInFromGroupTab");
              self.portal = portalForSearch;

              if ($scope.signInOutGrp.indexOf('In') !== -1) {
                portalForSearch.signIn().then(function (loggedInUser) {
                    $scope.signInOutGrp = "Sign Out";
                    $scope.signInOutMap = "Sign Out";
                    $scope.findArcGISGroup(portalForSearch);   // update results
                }, function (error) { //error so reset sign in link
                    $scope.signInOutGrp = "Sign In";
                    $scope.signInOutMap = "Sign In";
                });
              } else {
                portalForSearch.signOut().then(function (portalInfo) {
                    $scope.signInOutGrp = "Sign In";
                    $scope.signInOutMap = "Sign In";
                    findArcGISGroup(portalForSearch);
                });
              }
            };
            
            // gets private groups as well
            $scope.signInFromMapTab = function() {
              console.log("signInFromMapTab");
              self.portal = portalForSearch;

              if ($scope.signInOutMap.indexOf('In') !== -1) {
                portal.signIn().then(function (loggedInUser) {
                    $scope.signInOutGrp = "Sign Out";
                    $scope.signInOutMap = "Sign Out";
                  findArcGISGroupMaps(portal, $scope.searchTermMap);   // update results
                }, function (error) {  //error so reset sign in link
                    $scope.signInOutGrp = "Sign In";
                    $scope.signInOutMap = "Sign In";
                });
              } else {
                portal.signOut().then(function (portalInfo) {
                    $scope.signInOutGrp = "Sign In";
                    $scope.signInOutMap = "Sign In";
                    findArcGISGroupMaps(portal, $scope.searchTermMap);
                });
              }
            };
            
            //display a list of groups that match the input user name
            
            $scope.showMapResults = function(response) {
                // utils.hideLoading();
                //clear any existing results
                console.log("showMapResults");
                console.debug(response);
                console.log("response.total " + response.total);
                if (response.total > 0) {
                    console.log("found array with length " + response.total);
                    var i = response.total;
                    var mpdata = [];
                    mpdata = dojo.map(response.results, function (map) {
                      return {
                        'snippet': map.snippet,
                        'title': map.title,
                        'url': map.itemUrl,
                        'thumbnail': map.thumbnailUrl || '',
                        'id': map.id,
                        'owner': map.owner
                      }
                    });
                    //create the grid
                    $scope.gridGrpOptions.data = [];
                    $scope.mapGriddata = mpdata;
                    console.log("show $scope.mapGriddata");
                    var scopeQ = $('#SearchMap').scope();
                    scopeQ.gridGrpOptions.data = $scope.mapGriddata.concat(mpdata);;
                    console.debug($scope.mapGriddata);
                    
                    // var elemT = document.getElementById("SearchMap");
                    // var elemA = angular.element("SearchMap");
                    scopeQ = $('#SearchMap').scope();
                    // var elemQScope = $('#SearchMap').scope();
                    // $('#SearchMap').scope().$apply();
                    // var scopeT = elemA.scope();
                    // console.log( $("#SearchGroup") , angular.element($("#SearchMap")) , scopeT );
                    if( scopeQ )
                    {
                        scopeQ.myData = mpdata;
                        scopeQ.mapGriddata = mpdata;
                        $scope.mapGriddata = mpdata;
                        scopeQ.$apply(function(){
                                scopeQ.myData = mpdata;
                            });
                        $scope.$apply(function(){
                                $scope.myData = mpdata;
                            });
                    }
                    $scope.redrawGrid();
                    // $scope.updateLayout();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    
                 }
            };
        }  
        
        function init(App) {
            console.log('SearcherCtrl init');
            App.controller('SearcherCtrl', ['$scope', SearcherCtrl]);
            return SearcherCtrl;
        }
        
        return { start: init };

    });

}).call(this);