(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Offices', ['$resource', function ($resource) {
      var Offices = $resource('/Offices/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return Offices;
    }]);
})();
