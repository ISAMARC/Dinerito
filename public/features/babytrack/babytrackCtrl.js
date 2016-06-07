(function () {
  'use strict';
  angular.module('doc.features')
    // lista los clientes
    .controller('babyTrackCtrl', [
      '$scope',
      'Records',
      function ($scope, Records) {

        $scope.categories = Records.categories();
        $scope.records = [];
        $scope.flagRemove = false;
        $scope.flagLoading = false;

        $scope.updateList = function () {
          $scope.flagLoading = true;
          Records.query().$promise.then(function (data) {
            var list = data.map(function (row) {
              return {
                id : row.id,
                category_id: row.category_id,
                category: row.category,
                fromNow: moment(parseInt(row.created_time, 10)).fromNow(),
                time: moment(parseInt(row.created_time, 10)).format('MMMM Do, h:mm:ss a')
              }
            });

            $scope.records = list;
            $scope.flagLoading = false;
          });
        };
        $scope.saveRecord = function (id) {
          $scope.flagLoading = true;
          // instancia el servicio para guardar
          var record = new Records();

          record.category_id = id;
          record.created_time = moment().format('x');
          console.log(record.created_time);
          record.created_at = moment().format();
          // instance use $
          // service use direct method and (object)
          record.$save(function (data) {
            console.log(record);
            console.log(data);
            $scope.updateList();
          })
        };

        $scope.removeFromList = function (id) {
          $scope.flagLoading = true;
          Records.delete({id: id}).$promise.then(function () {
            $scope.updateList();
          });
        };

        $scope.toggleRemove = function () {
          $scope.flagRemove = ! $scope.flagRemove;
        };

        $scope.pronosticarLeche = function () {
          $scope.flagLoading = true;
          Records.query({category_id: 2}).$promise.then(function (data) {
            var list = data.map(function (row) {
              return {
                id : row.id,
                category_id: row.category_id,
                category: row.category,
                fromNow: moment(parseInt(row.created_time, 10)).fromNow(),
                time: moment(parseInt(row.created_time, 10)).format('MMMM Do, h:mm:ss a')
              }
            });

            $scope.records = list;
            $scope.flagLoading = false;

          });
        };





        // initialize
        $scope.updateList();

      }]);
})();
