(function () {
  'use strict';
  angular.module('doc.features')
    .controller('Login', [
      '$scope',
      'Usuario',
      function ($scope, Usuario) {

        $scope.usuarios = Usuario.query({});

      }]);
})();
