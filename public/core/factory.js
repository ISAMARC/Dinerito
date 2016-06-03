(function () {
  'use strict';
  angular
    .module('doc.features')
  /**
   * Show notification using angular strap
   */
    .factory('notification', function ($alert) {
      return {
        great: function (message) {
          $alert({
            title: message,
            placement: 'top',
            type: 'success',
            show: true,
            container: '.message',
            duration: '8',
            animation: "am-fade-and-slide-top"
          });
        },
        error : function (message) {
          $alert({
            title: message,
            placement: 'top',
            type: 'danger',
            show: true,
            container: '.message',
            duration: '8',
            animation: "am-fade-and-slide-top"
          });
        }
      };
    })
    .factory('CurrentUser', ['$resource', function ($resource) {
      var CurrentUser = $resource('/Auth');

      /**
       *
       * @param table from entities table
       * @param permission from restriction column , _view, _create, _edit, _delete
       */
      CurrentUser.prototype.isAllowed = function (table, permission) {
        var table = table.toUpperCase();

        if (this.role_id === 2) {
          // Role 2 is administrador , has total access
          return true;
        }

        return this.restrictions &&
          this.restrictions[table] &&
          this.restrictions[table][permission] &&
          this.restrictions[table][permission] === 1;
      };

      return CurrentUser;
    }]);
})();
