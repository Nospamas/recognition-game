// Controller to allow display of items to page.

angular.module('Player').controller('PlayerCtrl',
    ['$scope', 'LogSvc', 'PlayerSvc',
        function ($scope, LogSvc, PlayerSvc) {

            var states = {
                awaitingname: 'awaitingname',
                ready: 'ready',
                starting: 'starting',
                started: 'started',
                disconnected: 'disconnected',
                finalscore: 'finalscore'
            };

            var vm = {
                state: states.awaitingname,
                form: {
                    name: ''
                },
                playerName: null,
                playerId: null,
                countdowntime: 0,
                question: null,
                allowGuesses: true,
                lastscore: 0,
                selectedAnswer: null
            };

            vm.onPlayerSubmit = function () {
                LogSvc.log("Registering Player");
                vm.playerName = vm.form.name.toUpperCase();
                PlayerSvc.registerPlayer(vm.playerName, function (id) {
                    $scope.$apply(function () {
                        LogSvc.log("Player Registered");
                        vm.playerId = id;
                        vm.state = states.ready;
                    });
                });
            };

            vm.onAnswerSelect = function (questionId, answerId) {
                LogSvc.log("Selecting Answer");
                vm.allowGuesses = false;
                vm.selectedAnswer = answerId;
                PlayerSvc.sendAnswer(questionId, answerId);
            };

            PlayerSvc.on('connect', function () {
                LogSvc.log('player connected');
                $scope.$apply(function () {
                        vm.state = states.awaitingname;
                        vm.allowGuesses = false;
                        vm.question = null;
                });
            });


            PlayerSvc.on('gamestarting', function () {
                LogSvc.log('Game Starting called');
                $scope.$apply(function () {
                });
            });

            PlayerSvc.on('gameend', function (playerscore) {
                LogSvc.log('game end called');
                $scope.$apply(function () {
                    if (vm.playerId !== null) {
                        vm.state = states.finalscore;
                        vm.lastscore = playerscore;
                    }
                });
            });

            PlayerSvc.on('countdowntick', function (time) {
                LogSvc.log('countdown tick called');
                $scope.$apply(function () {
                    if (vm.playerId !== null && time < 10001) {
                        vm.state = states.starting;
                        vm.countdowntime = time / 1000;
                    }
                });
            });

            PlayerSvc.on('question', function (question) {
                LogSvc.log('question called');
                $scope.$apply(function () {
                    if (vm.playerId !== null) {
                        vm.state = states.started;
                        vm.allowGuesses = true;
                        vm.question = question;
                        vm.selectedAnswer = null;
                    }
                });
            });

            PlayerSvc.on('disconnect', function () {
                LogSvc.log('player disconnected');
                $scope.$apply(function () {
                    vm.state = states.disconnected;
                    vm.allowGuesses = false;
                    vm.question = null;
                    vm.playerId = null;
                });
            });

            $scope.vm = vm;
        }
    ]);