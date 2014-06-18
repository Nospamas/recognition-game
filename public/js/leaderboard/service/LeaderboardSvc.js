angular.module('Leaderboard')
    .service('LeaderboardSvc',
    ['LogSvc', function (LogSvc) {
        var self = this;

        var socket;

        this.init = function () {
            socket = io.connect('/socketleaderboard', {
                reconnectionDelay: 500,
                reconnectionDelayMax: 2000,
                reconnectionAttempts: Infinity
            });

            LogSvc.log('sockets initialized');

            socket.on('leaderboard', function (leaderboard) {
                self.notifyObservers('leaderboard', [leaderboard]);
            });

            socket.on('overallleaderboard', function (leaderboard) {
                self.notifyObservers('overallleaderboard', [leaderboard]);
            });

        };

        // listener registration & call
        var observerCallbacks = {};

        //register an observer
        this.on = function (event, callback) {
            event = event.toString().toLowerCase();
            if (!observerCallbacks[event]) {
                observerCallbacks[event] = [];
            }
            observerCallbacks[event].push(callback);
        };

        //call this when you know 'foo' has been changed
        this.notifyObservers = function (event, args) {
            var count = 1;
            event = event.toString().toLowerCase();
            LogSvc.log('Notifying ' + event);
            if (observerCallbacks[event]) {
                LogSvc.log('Have listeners');
                angular.forEach(observerCallbacks[event], function (callback) {
                    LogSvc.log('Calling ' + count++);
                    callback.apply(null, args);
                });
            }
        };
    }]);