
(function () {
  'use strict';

  // ========== initialize main module ========== //
  angular
    .module('documentarioApp', [
      'ngAnimate',
      'ngCookies',
      'ngFileUpload',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'adaptv.adaptStrap',
      'mgcrea.ngStrap',
      'ui.select',
      'ui.bootstrap',
      'ui.grid',
      'ui.grid.pagination',
      'ui.grid.resizeColumns',
      'ui.grid.autoResize',
      'doc.features'
    ]);
  angular.module('doc.features', []);
})();
