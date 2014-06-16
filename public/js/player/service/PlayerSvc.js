angular.module('Player')
    .service('PlayerSvc',
    ['LogSvc', function (LogSvc) {
        var self = this;
        var myId = null;

        var socket;

        this.init = function () {
            socket = io.connect('/socketplayer', {
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

            socket.on('gamestarting', function () {
                self.notifyObservers('gamestarting');
            });

            socket.on('gameend', function (score) {
                self.notifyObservers('gameend', [score]);
            });

            socket.on('countdowntick', function (time) {
                self.notifyObservers('countdowntick', [time]);
            });

            socket.on('question', function (question) {
                self.notifyObservers('question', [question]);
            });
        };

        this.registerPlayer = function (name, callback) {
            socket.emit('registerplayer', name, function (id) {

                myId = id;

                callback(id);
            });
        };

        this.sendAnswer = function (questionId, answerId) {
            socket.emit('addanswer', {
                questionId: questionId,
                answerId: answerId
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