angular.module('Screen', ['Common', 'ngSanitize'])
    .run(['ScreenSvc',
        function (ScreenSvc) {
            ScreenSvc.init();
        }]);