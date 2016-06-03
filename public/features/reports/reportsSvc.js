(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Report', ['$resource', function ($resource) {
      var Report = $resource('/Report', {},
        {
          update: {
            method: 'PUT'
          }
        });

      return Report;
    }]);
})();
