(function () {
  'use strict';
  angular.module('doc.features')
    .controller('reportsCtrl', [
      '$scope',
      'Report',
      '$location',
      'notification',
      function ($scope, Report, $location, notification) {
        var handlerSuccess = function (data) {
              var total = 0;

              $scope.report = data;
              data.forEach(function (item) {
                total = total + item.amount*1;
              });
              $scope.total = total;
            },
            handlerError = function (err) {
              notification.error(err.data.message);
            },
            runReport = function (data) {
              var data = data || {};

              Report.query(data,handlerSuccess, handlerError);
            };
        $scope.report = [];
        $scope.total = 0;
        $scope.account = 0;
        runReport();

        $scope.changeAccount = function (id) {
          runReport({account_id: id});
        }

      }]);
})();
