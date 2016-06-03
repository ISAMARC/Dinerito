(function () {
  'use strict';
  angular.module('doc.features')
  .controller('RecordCtrl', ['$scope', '$uibModalInstance', 'model', 'RecordService',
    function ($scope, $uibModalInstance, model, RecordService) {
      $scope.record = angular.copy(model);

      $scope.ok = function () {
        var params = {
          address: $scope.record.address,
          code: $scope.record.code,
          destination: $scope.record.destination,
          detail: $scope.record.detail,
          district: $scope.record.district,
          document: $scope.record.document,
          id: $scope.record.id,
          province: $scope.record.province,
          reference: $scope.record.reference,
          sender: $scope.record.sender
        };

        RecordService.update(params)
          .then(function () {
            $uibModalInstance.close();
          },
          function () {
            $uibModalInstance.dismiss('error');
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }]);
})();
