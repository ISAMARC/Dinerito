(function () {
  'use strict';
  angular.module('doc.features')
    .controller('dineroCtrl', [
      '$scope',
      'Dinero',
      '$location',
      'notification',
      function ($scope, Dinero, $location, notification) {

        function init() {
          $scope.dinero = new Dinero();
          $scope.dinero.date = moment().format('l');
          $scope.dinero.category = 1;
          $scope.dinero.account = 1;
          $scope.dinero.formatDate = moment( $scope.dinero.date ).format('MMM Do YY');
        }

        init();

        $scope.changeCategory = function (category_id) {
          $scope.dinero.category = category_id;
        };

        $scope.changeAccount = function (id) {
          $scope.dinero.account = id;
        };


        $scope.backToList = function () {
          $location.path('/');
        };


        $scope.save = function (form) {
          if (form.$valid) {
          $scope.dinero.$save(function () {
            notification.great('Guardado');
            init();
          }, function (err) {
            notification.error(err.data.message);

          });
          } else {
            notification.error('Debe llevar todos los campos obligatorios');
          }
        };

      }]);
})();
