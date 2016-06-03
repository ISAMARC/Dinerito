(function () {
  'use strict';
  angular.module('doc.features')
    .controller('UsersCtrl', [
      '$scope',
      'User',
      'Client',
      'Entity',
      'CurrentUser',
      '$location',
      'notification',
      function ($scope, User, Client, Entity, CurrentUser, $location, notification) {
        // #/Users
        $scope.colDef = [
          {
            columnHeaderDisplayName: 'Código',
            displayProperty: 'id',
            sortKey: 'id',
            width: '6em'
          },
          {
            columnHeaderDisplayName: 'Nombre',
            displayProperty: 'name',
            sortKey: 'name'
          },
          {
            columnHeaderDisplayName: 'Clientes',
            templateUrl: 'features/users/templates/clientsColumn.html'
          },
          {
            columnHeaderDisplayName: 'Rol',
            templateUrl: 'features/users/templates/roleColumn.html',
            sortKey: 'role_id'
          },
          {
            columnHeaderDisplayName: 'Estado',
            templateUrl: 'features/users/templates/statusColumn.html',
            sortKey: 'status'
          }
        ];

        // If user has edit permission then show edit column
        if ($scope.currentUser.isAllowed('users', '_edit')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/users/templates/actionColumn.html',
            width: '1em'
          });
        }

        $scope.tableConfig = {
          url: 'Users',
          method: 'get',
          params:{
            reload: false
          },
          paginationConfig: {
            response: {
              totalItems: 'results.totalResults',
              itemsLocation: 'results.list'
            }
          },
          state: {
            sortKey: 'id',
            sortDirection: 'ASC'
          }
        };

        $scope.backToList = function () {
          $location.path('/users');
        };

        // #/Users/add
        $scope.user = new User();
        $scope.user.clients = [];
        $scope.user.entities = [];

        Client.query(function (data) {
          $scope.user.clients = data.results.list;
        });

        Entity.query(function (data) {
          $scope.user.entities = data.results.list;
        });

        $scope.save = function (form) {
          if (form.$valid) {
            $scope.user.created_at = new Date().getTime();
            $scope.user.$save(function () {
              $scope.backToList();
              notification.great('Usuario guardado Correctamente');
            }, function (err) {
              notification.error(err.data.message);
            });
          } else {
            notification.error('Debe llevar todos los campos obligatorios');
          }
        };

      }])
    .controller('UsersEditCtrl', [
      '$scope',
      'User',
      'Client',
      'CurrentUser',
      '$location',
      '$routeParams',
      'notification',
      function ($scope, User, Client, CurrentUser, $location, $routeParams, notification) {
        var userId = $routeParams.id;

        $scope.currentUser = CurrentUser.get();

        // #/Users/edit
        if (userId) {
          $scope.user = User.get({id: userId});
        }

        $scope.backToList = function () {
          $location.path('/users');
        };

        $scope.save = function (form) {
          if (form.$valid) {
            $scope.user.updated_at = new Date().getTime();
            $scope.user.$update(function () {
              $scope.backToList();
              notification.great('Usuario guardado Correctamente');

            });
          } else {
            notification.error('Error de formulario');
          }
        };
      }]);
})();
