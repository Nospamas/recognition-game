angular.module('Admin', ['Common'])
    .run(['AdminSvc',
        function (AdminSvc) {
            AdminSvc.init();
        }]);