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

              $scope.reportList = data;

              data.forEach(function (item) {
                total = total + item.amount*100;
              });

              $scope.total = total/100;

            },
            handlerError = function (err) {
              if (err && err.data && err.data.message) {
                notification.error(err.data.message);
              } else {
                notification.error('Error de sistema , actualize su pagina');
              }
            };

        function updateTimeStamp() {
            $scope.reportInstance.start_time = moment($scope.reportInstance.date_start, 'DD/MM/YYYY').format('x');
            $scope.reportInstance.end_time = moment($scope.reportInstance.date_end, 'DD/MM/YYYY').format('x');
        }

        $scope.runReport = function () {
          updateDefaultValues();
          updateTimeStamp();
          Report.query($scope.reportInstance, handlerSuccess, handlerError);
        };

        function updateDefaultValues() {
          if (!$scope.reportInstance.date_start) {
            $scope.reportInstance.date_start = moment().startOf('month').format('DD/MM/YYYY');
          }
          if (!$scope.reportInstance.date_end) {
            $scope.reportInstance.date_end = moment().endOf('month').format('DD/MM/YYYY');
          }
        }

        $scope.reportInstance =  {};
        $scope.reportInstance.date_start = moment().startOf('month').format('DD/MM/YYYY');
        $scope.reportInstance.date_end = moment().endOf('month').format('DD/MM/YYYY');
        $scope.reportInstance.account = 0;

        $scope.reportList = [];
        $scope.total = 0;

        $scope.runReport();

        $scope.changeAccount = function (id) {
          $scope.reportInstance.account = id;
          $scope.runReport();
        }

      }]);
})();
