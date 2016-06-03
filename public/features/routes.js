(function () {
  'use strict';
  angular.module('doc.features')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'features/records/records.html',
          controller: 'RecordsCtrl'
        })
        .when('/upload', {
          templateUrl: 'features/records/upload.html',
          controller: 'UploadCtrl'
        })
        .when('/bulkDelete', {
          templateUrl: 'features/records/bulkDelete.html',
          controller: 'BulkDeleteCtrl'
        })

        .when('/clients', {
          templateUrl: 'features/clients/clients.html',
          controller: 'ClientCtrl'
        })
        .when('/clients/crear', {
          templateUrl: 'features/clients/clientForm.html',
          controller: 'ClientCreateCtrl'
        })
        .when('/clients/:id', {
          templateUrl: 'features/clients/clientForm.html',
          controller: 'ClientCreateCtrl'
        })

        .when('/users', {
          templateUrl: 'features/users/users.html',
          controller: 'UsersCtrl'
        })
        .when('/users/add', {
          templateUrl: 'features/users/userForm.html',
          controller: 'UsersCtrl'
        })
        .when('/users/:id', {
          templateUrl: 'features/users/userForm.html',
          controller: 'UsersEditCtrl'
        })

        .when('/offices', {
          templateUrl: 'features/offices/offices.html',
          controller: 'OfficesCtrl'
        })
        .when('/offices/create', {
          templateUrl: 'features/offices/officeForm.html',
          controller: 'OfficeCtrl'
        })
        .when('/offices/:id', {
          templateUrl: 'features/offices/officeForm.html',
          controller: 'OfficeCtrl'
        })

        .when('/areas', {
          templateUrl: 'features/areas/areas.html',
          controller: 'AreasCtrl'
        })
        .when('/areas/create', {
          templateUrl: 'features/areas/areaForm.html',
          controller: 'AreaCtrl'
        })
        .when('/areas/:id', {
          templateUrl: 'features/areas/areaForm.html',
          controller: 'AreaCtrl'
        })

        .when('/internalClients', {
          templateUrl: 'features/internalClients/internalClients.html',
          controller: 'InternalClientsCtrl'
        })
        .when('/internalClients/create', {
          templateUrl: 'features/internalClients/internalClientForm.html',
          controller: 'InternalClientCtrl'
        })
        .when('/internalClients/:id', {
          templateUrl: 'features/internalClients/internalClientForm.html',
          controller: 'InternalClientCtrl'
        });

    }]);
})();
