
module.exports = function (log, io, game) {
    var sockets = io.of('/socketscreen')
        .on('connection', function (socket) {


        });

    game.on('gamestarting', function () {
        sockets.emit('gamestarting');
    });

    game.on('gameend', function () {
        sockets.emit('gameend');
    });

    game.on('countdowntick', function (time) {
        sockets.emit('countdowntick', time);
    });

    game.on('question', function (question) {
        sockets.emit('question', question);
    });

    game.on('gameleaderboard', function (leaderboard) {
        sockets.emit('leaderboard', leaderboard);
    });
};