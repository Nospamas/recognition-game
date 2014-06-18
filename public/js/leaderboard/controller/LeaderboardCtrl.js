// Controller to allow display of items to page.

angular.module('Leaderboard').controller('LeaderboardCtrl',
    ['$scope', 'LogSvc', 'LeaderboardSvc',
        function ($scope, LogSvc, LeaderboardSvc) {

            var vm = {
                leaderboard: null,
                overallleaderboard: null
            };

            LeaderboardSvc.on('leaderboard', function (leaderboard) {
                LogSvc.log('leaderboard called');
                $scope.$apply(function () {
                    vm.leaderboard = leaderboard;
                });
            });
            LeaderboardSvc.on('overallleaderboard', function (leaderboard) {
                LogSvc.log('overallleaderboard called');
                $scope.$apply(function () {
                    vm.overallleaderboard = leaderboard;
                });
            });

            $scope.vm = vm;
        }
    ]);