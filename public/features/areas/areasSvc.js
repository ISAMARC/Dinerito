(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Areas', ['$resource', function ($resource) {
      var Areas = $resource('/Areas/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return Areas;
    }]);
})();
