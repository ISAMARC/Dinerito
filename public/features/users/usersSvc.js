(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('User', ['$resource', function ($resource) {
      var User = $resource('/Users/:id', {id: '@id'},
        {
          get: {
            transformResponse: function (data) {
              var jsonData = angular.fromJson(data);
              // the endpoint returns 1, but ng-model requires true
              if (jsonData.clients && jsonData.clients.length) {
                jsonData.clients.forEach(function (item) {
                  item.selected = item.selected === 1 ? true : null;
                });
              }

              if(jsonData.role_id) {
                jsonData.role_id = jsonData.role_id.toString();
              }

              return jsonData;
            }
          },
          update: {
            method: 'PUT'
          }
        });

      return User;
    }]);
})();
