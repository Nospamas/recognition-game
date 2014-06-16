angular.module('Screen', ['Common'])
    .run(['ScreenSvc',
        function (ScreenSvc) {
            ScreenSvc.init();
        }]);