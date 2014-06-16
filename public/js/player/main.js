angular.module('Player', ['Common'])
    .run(['PlayerSvc',
        function (PlayerSvc) {
            PlayerSvc.init();
        }]);