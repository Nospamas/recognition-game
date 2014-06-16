// Controller to allow display of items to page.

angular.module('Screen').controller('ScreenCtrl',
    ['$scope', 'LogSvc', 'ScreenSvc',
        function ($scope, LogSvc, ScreenSvc) {

            var states = {
                ready: 'ready',
                starting: 'starting',
                started: 'started'
            };

            var vm = {
                countdowntime: 0,
                question: null,
                leaderboard: null
            };


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