angular.module('Screen')
    .service('ScreenSvc',
    ['LogSvc', function (LogSvc) {
        var self = this;

        this.init = function () {
            var socket = io.connect('/socketscreen', {
                reconnectionDelay: 500,
                reconnectionDelayMax: 2000,
                reconnectionAttempts: Infinity
            });

            socket.on('gamestarting', function () {
                self.notifyObservers('gamestarting');
            });

            socket.on('gameend', function () {
                self.notifyObservers('gameend');
            });

            socket.on('countdowntick', function (time) {
                self.notifyObservers('countdowntick', [time]);
            });

            socket.on('question', function (question) {
                self.notifyObservers('question', [question]);
            });

            socket.on('leaderboard', function (leaderboard) {
                self.notifyObservers('leaderboard', [leaderboard]);
            });

            LogSvc.log('sockets initialized');
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