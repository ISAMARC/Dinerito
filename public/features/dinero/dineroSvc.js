(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Dinero', ['$resource', function ($resource) {
      var User = $resource('/Dinero/:id', {id: '@id'},
        {
          update: {
            method: 'PUT'
          }
        });

      return User;
    }]);
})();
