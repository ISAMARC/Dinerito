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
          $scope.fecha = moment().format("DD/MM/YYYY");
          $scope.dinero = new Dinero();
          $scope.dinero.comment = '';
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
          if (form.$valid &&  $scope.dinero.category &&  $scope.dinero.account) {

            // Save the date in timestamp
            $scope.dinero.date = moment($scope.fecha, "DD/MM/YYYY").format('x');

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
