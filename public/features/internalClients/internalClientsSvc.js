(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('InternalClients', ['$resource', function ($resource) {
      var InternalClients = $resource('/InternalClients/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return InternalClients;
    }]);
})();
