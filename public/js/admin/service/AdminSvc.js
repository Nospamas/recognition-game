angular.module('Admin')
    .service('AdminSvc',
    ['LogSvc', function (LogSvc) {
        var self = this;

        var socket;

        this.init = function () {
            socket = io.connect('/socketadmin', {
                reconnectionDelay: 500,
                reconnectionDelayMax: 2000,
                reconnectionAttempts: Infinity
            });

            LogSvc.log('sockets initialized');

            socket.on('disconnect', function () {
                self.notifyObservers('disconnect', []);
            });

            socket.on('connect', function () {
                self.notifyObservers('connect', []);
            });
        };

        this.checkPassword = function (password, callback) {
            socket.emit('checkpassword', password, callback);
        };

        this.startGame = function (countdown, restart) {
            socket.emit('startgame', {
                startDelay: countdown,
                restartDelay: restart
            });
        };

        this.stopGame = function () {
            socket.emit('stopgame');
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