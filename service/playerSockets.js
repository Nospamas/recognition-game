var _ = require('underscore');
module.exports = function (log, io, game) {
    var sockets = io.of('/socketplayer')
        .on('connection', function (socket) {
            var playerId = null;

            socket.on('registerplayer', function (name, fn) {

                playerId = game.addPlayer({ name: name });
                fn(playerId);
            });

            socket.on('addanswer', function (data) {
                game.addAnswer(data.questionId, playerId, data.answerId);
            });

            var onGameEnd = function (leaderboard) {
                var score = 0;
                var leaderEntry;
                if (playerId) {
                    leaderEntry = _.find(leaderboard, function (leaderEntry) {
                        return leaderEntry.playerId === playerId;
                    });
                    if (leaderEntry) {
                        score = leaderEntry.score;
                    }
                    socket.emit('gameend', score);
                }
            };

            game.on('gameend', onGameEnd);

            socket.on('disconnect', function () {
                game.un('gameend', onGameEnd);
            })
        });

    game.on('gamestarting', function () {
        sockets.emit('gamestarting');
    });

    game.on('countdowntick', function (time) {
        sockets.emit('countdowntick', time);
    });

    game.on('question', function (question) {
        sockets.emit('question', question);
    });
};