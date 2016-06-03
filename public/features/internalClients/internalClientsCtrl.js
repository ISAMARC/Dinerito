(function () {
  'use strict';
  angular.module('doc.features')
    // Internal Clients List
    .controller('InternalClientsCtrl', [
      '$scope',
      'InternalClients',
      function ($scope, InternalClients) {

        $scope.colDef = [
          {
            columnHeaderDisplayName: 'Código',
            displayProperty: 'id',
            sortKey: 'id',
            width: '6em'
          },
          {
            columnHeaderDisplayName: 'Nombre Corto',
            displayProperty: 'short_name',
            sortKey: 'short_name'
          },
          {
            columnHeaderDisplayName: 'Nombre Largo',
            displayProperty: 'name',
            sortKey: 'name'
          },
          {
            columnHeaderDisplayName: 'Dirección',
            displayProperty: 'address',
            sortKey: 'address'
          },
          {
            columnHeaderDisplayName: 'Cod. Distrito',
            displayProperty: 'id',
            sortKey: 'id'
          },
          {
            columnHeaderDisplayName: 'UbiGeo',
            displayProperty: 'id',
            sortKey: 'id'
          },
          {
            columnHeaderDisplayName: 'R.U.C.',
            displayProperty: 'ruc',
            sortKey: 'ruc'
          }
        ];

        // If user has edit permission then show edit column
        if ($scope.currentUser.isAllowed('internalClients', '_edit')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/internalClients/templates/editColumn.html',
            width: '1em'
          });
        }
        // If user has delete permission then show delete column
        if ($scope.currentUser.isAllowed('internalClients', '_delete')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/internalClients/templates/deleteColumn.html',
            width: '1em'
          });
        }

        $scope.tableConfig = {
          url: 'InternalClients/',
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

        $scope.deleteInternalClient = function (internal_client_id) {
          // TODO: Confirm business rule for deleation of objects
          InternalClients.delete({id: internal_client_id}, function () {
            $scope.tableConfig.params.reload = !$scope.tableConfig.params.reload;
          });
        };
      }])
    .controller('InternalClientCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'Areas', // Service object with API methods
      'Client', // Service object with API methods
      'InternalClients', // Service object with API methods
      'Offices', // Service object with API methods
      function ($scope, $location, $routeParams, Client, Offices) {
        var internal_client_id = $routeParams.id;

        $scope.clientsList = [];

        if (internal_client_id) {
          $scope.internal_client = Offices.get({id: internal_client_id});
        } else {
          $scope.internal_client = new Offices();
        }

        Client.get(function (data) {
          $scope.clientsList = data.results.list;
        });

        $scope.backToList = function () {
          $location.path('/internalClients');
        };

        $scope.save = function (form) {
          if (form.$valid) {
            if (!internal_client_id) {
              $scope.internal_client.$save($scope.backToList);
            } else {
              $scope.internal_client.$update({id: internal_client_id}, $scope.backToList);
            }

          } else {
            // TODO: Add notification service
            console.log('error de formulario');
            console.log(form);
          }
        };
      }]);
})();
