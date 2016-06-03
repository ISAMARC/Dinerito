(function () {
  'use strict';
  angular.module('doc.features')
    // Offices List
    .controller('OfficesCtrl', [
      '$scope',
      'Offices',
      function ($scope, Offices) {

        $scope.colDef = [
          {
            columnHeaderDisplayName: 'Código',
            displayProperty: 'id',
            sortKey: 'id',
            width: '6em'
          },
          {
            columnHeaderDisplayName: 'Oficina',
            displayProperty: 'name',
            sortKey: 'name'
          },
          {
            columnHeaderDisplayName: 'Cliente',
            displayProperty: 'client_name',
            sortKey: 'client_name'
          }
        ];

        // If user has edit permission then show edit column
        if ($scope.currentUser.isAllowed('offices', '_edit')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/offices/templates/editColumn.html',
            width: '1em'
          });
        }
        // If user has delete permission then show delete column
        if ($scope.currentUser.isAllowed('offices', '_delete')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/offices/templates/deleteColumn.html',
            width: '1em'
          });
        }

        $scope.tableConfig = {
          url: 'Offices/',
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

        $scope.deleteOffice = function (office_id) {
          // TODO: Confirm business rule for deleation of objects
          Offices.delete({id: office_id}, function () {
            $scope.tableConfig.params.reload = !$scope.tableConfig.params.reload;
          });
        };
      }])
    .controller('OfficeCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'Client', // Service object with API methods
      'Offices', // Service object with API methods
      function ($scope, $location, $routeParams, Client, Offices) {
        var office_id = $routeParams.id;

        $scope.clientsList = [];

        if (office_id) {
          $scope.office = Offices.get({id: office_id});
        } else {
          $scope.office = new Offices();
        }

        Client.get(function (data) {
          $scope.clientsList = data.results.list;
        });

        $scope.backToList = function () {
          $location.path('/offices');
        };

        $scope.save = function (form) {
          if (form.$valid) {
            if (!office_id) {
              $scope.office.$save($scope.backToList);
            } else {
              $scope.office.$update({id: office_id}, $scope.backToList);
            }

          } else {
            // TODO: Add notification service
            console.log('error de formulario');
            console.log(form);
          }
        };
      }]);
})();
