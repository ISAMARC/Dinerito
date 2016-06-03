(function () {
  'use strict';
  angular.module('doc.features')
    // Areas List
    .controller('AreasCtrl', [
      '$scope',
      'Areas',
      function ($scope, Areas) {

        $scope.colDef = [
          {
            columnHeaderDisplayName: 'Código',
            displayProperty: 'id',
            sortKey: 'id',
            width: '6em'
          },
          {
            columnHeaderDisplayName: 'Área',
            displayProperty: 'name',
            sortKey: 'name'
          },
          {
            columnHeaderDisplayName: 'Oficina',
            displayProperty: 'office_name',
            sortKey: 'office_name'
          }
        ];

        // If user has edit permission then show edit column
        if ($scope.currentUser.isAllowed('areas', '_edit')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/areas/templates/editColumn.html',
            width: '1em'
          });
        }
        // If user has delete permission then show delete column
        if ($scope.currentUser.isAllowed('areas', '_delete')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/areas/templates/deleteColumn.html',
            width: '1em'
          });
        }

        $scope.tableConfig = {
          url: 'Areas/',
          method: 'get',
          params:{
            client_id: $scope.currentUser.clients,
            reload: false
          },
          paginationConfig: {
            response: {
              totalItems: 'results.count',
              itemsLocation: 'results.list'
            }
          },
          state: {
            sortKey: 'id',
            sortDirection: 'ASC'
          }
        };


        $scope.deleteArea = function (area_id) {
          // TODO: Confirm business rule for deleation of objects
          Areas.delete({id: area_id}, function () {
            $scope.tableConfig.params.reload = !$scope.tableConfig.params.reload;
          });
        };
      }])
    .controller('AreaCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'Areas', // Service object with API methods
      'Client', // Service object with API methods
      'Offices', // Service object with API methods
      function ($scope, $location, $routeParams, Areas, Client, Offices) {
        var areaId = $routeParams.id;

        $scope.clientsList = [];
        $scope.officesList = [];

        $scope.onClientSelected = function (client_id) {
          $scope.area.office_id = undefined;
          Offices.get({client_id: client_id}, function (data) {
            $scope.officesList = data.results.list;
          });
        };

        if (areaId) {
          $scope.area = Areas.get({id: areaId}, function () {
            Offices.get({client_id: $scope.area.client_id}, function (data) {
              $scope.officesList = data.results.list;
            });
          });
        } else {
          $scope.area = new Areas();
        }

        Client.get(function (data) {
          $scope.clientsList = data.results.list;
        });

        $scope.backToList = function () {
          $location.path('/areas');
        };

        $scope.save = function (form) {
          if (form.$valid) {
            if (!areaId) {
              $scope.area.$save($scope.backToList);
            } else {
              $scope.area.$update({id: areaId}, $scope.backToList);
            }

          } else {
            // TODO: Add notification service
            console.log('error de formulario');
            console.log(form);
          }
        };
      }]);
})();
