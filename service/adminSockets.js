var _ = require('underscore');

module.exports = function (log, io, game) {
    var password = 'w';
    var allowedSockets = [];
    var sockets = io.of('/socketadmin')
        .on('connection', function (socket) {
            socket.on('checkpassword', function (checkpassword, fn) {
                var allowed = checkpassword === password;
                if (allowed) {
                    allowedSockets.push(socket);
                }

                log.log('Challenge: ' + checkpassword);

                fn(allowed);
            });

            socket.on('startgame', function (data) {
                var allowed = allowedSockets.indexOf(socket) !== -1;
                if (allowed) {
                    log.log('Game Started');
                    game.start(data.startDelay * 1000, data.restartDelay ? data.restartDelay * 1000 : false);
                }

            });

            socket.on('stopgame', function () {
                var allowed = allowedSockets.indexOf(socket) !== -1;
                if (allowed) {
                    log.log('Game Stopped');
                    game.stop();
                }
            });
        });
};