(function () {
  'use strict';
  angular.module('doc.features')
  .controller('UploadCtrl', [
    '$scope',
    'Client',
    'Upload',
    function ($scope, Client, Upload) {

      $scope.clients = Client.get({id: $scope.currentUser.clients});

      $scope.customer = {};
      $scope.isLoading = false;
      $scope.disableSubmit = false;
      $scope.callSucced = false;

      function resetValues() {
        $scope.customer = {};
        $scope.isLoading = false;
        $scope.disableSubmit = false;
        angular.element('#registrosForm')[0].reset();
      }

      $scope.saveData = function (file) {
        if ($scope.customer && Object.keys($scope.customer).length &&
              $scope.default_client && $scope.default_client.id){
          $scope.nroRegistros = '';
          $scope.errorMsg = '';
          $scope.isLoading = true;
          $scope.disableSubmit = true;
          $scope.callSucced = false;

          Upload.upload({
            url: 'records/upload',
            data: {
              uploadFile: file,
              client_id: $scope.default_client.id
            }
          }).then(function (resp) {
            $scope.nroRegistros = resp.data.count;
            $scope.callSucced = true;
            resetValues();
          }, function (error) {
            $scope.errorMsg = error && error.message ? error.message : 'Error de comunicación con el servidor';
            resetValues();
          });
        }
      };
    }]);
})();
