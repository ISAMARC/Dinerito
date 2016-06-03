(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Entity', ['$resource', function ($resource) {
      var Entity = $resource('/Entities', {},
        {
          query: {
            isArray: false
          }
        });

      return Entity;
    }]);
})();
