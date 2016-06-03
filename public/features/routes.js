(function () {
  'use strict';
  angular.module('doc.features')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'features/dinero/dinero.html',
          controller: 'dineroCtrl'
        })
        .when('/reports', {
          templateUrl: 'features/reports/reports.html',
          controller: 'reportsCtrl'
        });
    }]);
})();
