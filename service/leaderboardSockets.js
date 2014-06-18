
module.exports = function (log, io, game) {
    var sockets = io.of('/socketleaderboard')
        .on('connection', function (socket) {
            socket.emit('leaderboard', game.getLeaderBoard());
            socket.emit('overallleaderboard', game.getOverallLeaderBoard());
        });

    game.on('gameleaderboard', function (leaderboard) {
        sockets.emit('leaderboard', leaderboard);
    });

    game.on('overallleaderboard', function (leaderboard) {
        sockets.emit('overallleaderboard', leaderboard);
    })
};