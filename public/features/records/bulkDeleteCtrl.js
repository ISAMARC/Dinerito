(function () {
  'use strict';
  angular.module('doc.features')
    .controller('BulkDeleteCtrl', [
      '$scope',
      'RecordService',
      function ($scope, RecordService) {

        $scope.isLoading = false;
        $scope.disableSubmit = false;
        $scope.callSucced = false;
        $scope.creationCodes = [];
        $scope.creationObject = '';

        function resetValues() {
          $scope.isLoading = false;
          $scope.disableSubmit = false;
          $scope.creationObject = '';
          $scope.getCreationCodeList();
        }

        $scope.getCreationCodeList = function () {
          RecordService.getCreationCodeList().then(function (response) {
            $scope.creationCodes = response;
          }, function (error) {
            // @TODO implement error handler
            angular.noop(error);
          });
        };

        $scope.deleteRecords = function () {
          if ($scope.creationObject){
            $scope.nroRegistros = '';
            $scope.errorMsg = '';
            $scope.isLoading = true;
            $scope.disableSubmit = true;
            $scope.callSucced = false;

            RecordService.deleteRecords($scope.creationObject.creationCode).then(function (response) {
              $scope.nroRegistros = response.count;
              $scope.callSucced = true;
              resetValues();
            }, function (error) {
              $scope.errorMsg = error && error.message ? error.message : 'Error de comunicación con el servidor';
              resetValues();
            });
          }
        };

        $scope.getCreationCodeList();
      }]);
})();
