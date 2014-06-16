// Controller to allow display of items to page.

angular.module('Admin').controller('AdminCtrl',
    ['$scope', 'LogSvc', 'AdminSvc',
        function ($scope, LogSvc, AdminSvc) {

            var states = {
                challenge: 'challenge',
                ready: 'ready',
                disconnected: 'disconnected'
            };

            var vm = {
                state: states.disconnected,
                passForm: {
                    message: '',
                    password: ''
                },
                startForm: {
                    start: 120,
                    restart: true,
                    restartDelay: 30
                }
            };

            vm.onPasswordSubmit = function () {
                LogSvc.log('Password Form Submit');
                AdminSvc.checkPassword(vm.passForm.password, function (accepted) {
                    $scope.$apply(function () {
                        LogSvc.log('Socket Callback');
                        if (accepted) {
                            LogSvc.log('Success');
                            vm.state = states.ready;
                        } else {
                            LogSvc.log('Failed');
                            vm.passForm.message = 'Incorrect password supplied';
                        }
                    });
                });
            };
            vm.onGameStartSumbit = function () {
                LogSvc.log('Starting Game');
                AdminSvc.startGame(vm.startForm.start, (vm.startForm.restart ? vm.startForm.restartDelay : false));
            };

            vm.onGameStopClick = function () {
                LogSvc.log('Stopping Game');
                AdminSvc.stopGame();
            };

            AdminSvc.on('disconnect', function () {
                LogSvc.log('admin disconnected');
                $scope.$apply(function () {
                    vm.state = states.disconnected;
                });
            });

            AdminSvc.on('connect', function () {
                LogSvc.log('admin connected');
                $scope.$apply(function () {
                    vm.state = states.challenge;
                });
            });




            $scope.vm = vm;
        }]);