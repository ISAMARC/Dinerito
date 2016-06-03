(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Usuario', ['$resource', function ($resource) {
      var Usuario = $resource('/login/usuarios/:id', {id: '@id'},
        {
          query: {
            isArray: true
          },
          update: {
            method: 'PUT'
          }
        }
      );
      return Usuario;
    }]);
})();
