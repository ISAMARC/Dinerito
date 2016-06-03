(function () {
  'use strict';
  angular.module('doc.features')
    // lista los clientes
    .controller('ClientCtrl', [
      '$scope',
      'CurrentUser',
      function ($scope, CurrentUser) {
        $scope.colDef = [
          {
            columnHeaderDisplayName: 'Código',
            displayProperty: 'legacy_id',
            sortKey: 'legacy_id',
            width: '6em'
          },
          {
            columnHeaderDisplayName: 'Descripción',
            displayProperty: 'description',
            sortKey: 'description'
          }
        ];

        // If user has edit permission then show edit column
        if ($scope.currentUser.isAllowed('clients', '_edit')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/clients/templates/editColumn.html',
            width: '1em'
          });
        }
        // If user has delete permission then show delete column
        if ($scope.currentUser.isAllowed('clients', '_delete')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/clients/templates/deleteColumn.html',
            width: '1em'
          });
        }

        $scope.tableConfig = {
          url: 'Clients/',
          method: 'get',
          params:{},
          paginationConfig: {
            response: {
              totalItems: 'results.count',
              itemsLocation: 'results.list'
            }
          },
          state: {
            sortKey: 'legacy_id',
            sortDirection: 'ASC'
          }
        };

        $scope.currentUser = CurrentUser.get();


      }])
    .controller('ClientCreateCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'Client', // Objecto que contiene los metodosAPi Rest
      function ($scope, $location, $routeParams, Client) {
        var client_id = $routeParams.id;

        if (client_id) {
          $scope.client = Client.get({client_id: client_id});
        } else {
          $scope.client = new Client();
        }

        $scope.backToList = function () {
          $location.path('/clients');
        };

        $scope.save = function (form) {
          if (form.$valid) {
            if (!client_id) {
              $scope.client.$save($scope.backToList());
            } else {
              $scope.client.$update($scope.backToList());
            }

          } else {
            // todo: agregar servicio de notifiaciones general al sistema
            console.log('error de formulario');
            console.log(form);
          }
        };
      }]);
})();
