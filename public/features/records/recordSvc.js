(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('RecordService', ['$http', function ($http, $window) {
      // TODO: evaluate use of $resource
      var self = this,
          objectName = '/records';
      self.readAll = function (filters) {
        return $http({
          method: 'GET',
          url: objectName + '/list',
          params: filters
        }).then(function (response) {
          return response.data;
        });
      };
      self.update = function (data) {
        return $http({
          method: 'PUT',
          url: objectName + '/update',
          data: data,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      };
      self.getFilesName = function (params) {
        return $http({
          method: 'GET',
          url: objectName + '/getFilesName',
          params: params
        }).then(function (response) {
          return response.data;
        });
      };
      self.getCreationCodeList = function () {
        return $http({
          method: 'GET',
          url: objectName + '/creation_code_list'
        }).then(function (response) {
          return response.data;
        });
      };
      self.deleteRecords = function (creationCode) {
        return $http({
          method: 'DELETE',
          url: objectName + '/delete?creationCode=' + creationCode
        }).then(function (response) {
          return response.data;
        });
      };
      self.downloadReceipt = function (fileName) {
        $window.open('/records/download?code=' + fileName, '_blank');
      };

      return self;
    }]);
})();
