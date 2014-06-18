angular.module('Leaderboard', ['Common'])
    .run(['LeaderboardSvc',
        function (LeaderboardSvc) {
            LeaderboardSvc.init();
        }]);