(function () {
  'use strict';
  angular
  .module('doc.features')
  .directive('datePicker', function () {
    return {
      restrict : 'A',
      link : function (scope, element, attr) {
        var initialValue = scope.$eval(attr.ngModel),
            attrName = attr.ngModel,
            names = attrName ? attrName.split('.') : [],
            namesLength = names.length;

        // Define spanish texts
        $.fn.datepicker.dates.es = {
          days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          daysShort: ['Dom', 'Lum', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
          daysMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul',
            'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
          today: 'Hoy',
          clear: 'Borrar',
          format: 'dd/mm/yyyy',
          titleFormat: 'MM yyyy', /* Leverages same syntax as 'format' */
          weekStart: 0
        };
        $(element).datepicker({
          language: 'es',
          autoclose: true,
          clearBtn: true,
          todayHighlight: true,
          orientation: 'bottom'
        });

        // Initialize the previous value
        $(element).val(initialValue);
        switch (namesLength) {
          case 1:
            scope[attrName] = initialValue;
            break;
          case 2:
            scope[names[0]][names[1]] = initialValue;
            break;
          case 3:
            scope[names[0]][names[1]][names[2]] = initialValue;
            break;
        }
      }
    };
  })
    .directive('dateRangePicker', function () {
      return {
        restrict : 'A',
        link : function (scope, element, attr) {

          $(element).daterangepicker({
            "autoApply": true,
            "startDate": "05/29/2016",
            "endDate": "06/04/2016"
          });

        }
      };
    })
  .directive('sidebarMenu', function () {
    return {
      restrict: 'E',
      templateUrl: 'core/templates/sidebarMenu.html',
      controller: ['$scope', 'CurrentUser', function ($scope, CurrentUser) {
        CurrentUser.get(function (data) {
          $scope.currentUser = data;
        });
      }]
    };
  })
  .directive('userPanel', function () {
    return {
      restrict: 'E',
      templateUrl: 'core/templates/userPanel.html',
      controller: ['$scope', 'CurrentUser', function ($scope, CurrentUser) {
        CurrentUser.get(function (data) {
          $scope.currentUser = data;
        });
      }]
    };
  });
})();
