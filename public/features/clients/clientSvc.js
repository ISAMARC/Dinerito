(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Client', ['$resource', function ($resource) {
      var Client = $resource('/Clients/:client_id', {client_id: '@client_id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return Client;
    }]);
})();
