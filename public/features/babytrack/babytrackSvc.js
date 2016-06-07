(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('Records', ['$resource', function ($resource) {
      var Records = $resource('/BabyRecords/:category_id',
        {category_id: '@category'},
        {
          query: {
            isArray: true
          },
          categories: {
            method: 'GET',
            url: '/BabyRecords/categories',
            isArray: true
          }
        }
      );
      return Records;
    }]);
})();
