// Controller to allow display of items to page.

angular.module('Screen').controller('ScreenCtrl',
    ['$scope', 'LogSvc', 'ScreenSvc', 'QuerySvc',
        function ($scope, LogSvc, ScreenSvc, QuerySvc) {

            var states = {
                ready: 'ready',
                starting: 'starting',
                started: 'started'
            };

            var queryStringObj = QuerySvc.getQueryObject();

            var vm = {
                countdowntime: 0,
                question: null,
                leaderboard: null,
                screenWidth: '100%'
            };

            if (QuerySvc.width) {
                vm.screenWidth = QuerySvc.width + 'px'
            }


            ScreenSvc.on('gamestarting', function () {
                LogSvc.log('Game Starting called');
                $scope.$apply(function () {
                    vm.state = states.starting;
                });
            });

            ScreenSvc.on('gameend', function () {
                LogSvc.log('game end called');
                $scope.$apply(function () {
                    vm.state = states.ready;
                });
            });

            ScreenSvc.on('countdowntick', function (time) {
                LogSvc.log('countdown tick called');
                $scope.$apply(function () {
                    vm.countdowntime = time / 1000;

                });
            });

            ScreenSvc.on('question', function (question) {
                LogSvc.log('question called');
                $scope.$apply(function () {
                    vm.state = states.started;
                    vm.question = question;
                });
            });

            ScreenSvc.on('leaderboard', function (leaderboard) {
                LogSvc.log('leaderboard called');
                $scope.$apply(function () {
                    vm.leaderboard = leaderboard;
                });
            });

            $scope.vm = vm;
        }
    ]);