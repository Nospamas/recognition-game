angular.module('Player', ['Common', 'ngSanitize'])
    .run(['$window', 'PlayerSvc',
        function ($window, PlayerSvc) {
            PlayerSvc.init();

            // Fixes click delay on touch devices by making them use touch events instead of click events
            $window.FastClick.attach($window.document.body);
        }]);