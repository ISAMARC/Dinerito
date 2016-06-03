(function () {
  'use strict';
  angular.module('doc.features')
    .controller('reportsCtrl', [
      '$scope',
      'Report',
      '$location',
      'notification',
      function ($scope, Report, $location, notification) {
        $scope.report = Report.query();


      }]);
})();
