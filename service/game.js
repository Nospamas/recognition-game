// handles the main game

var q = require('q');
var allAnswers = require('./images');
var _ = require('underscore');

var nextId = (function () {
    var nextIndex = [0, 0, 0];
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var num = chars.length;

    return function () {
        var a = nextIndex[0];
        var b = nextIndex[1];
        var c = nextIndex[2];
        var id = chars[a] + chars[b] + chars[c];

        a = ++a % num;

        if (!a) {
            b = ++b % num;

            if (!b) {
                c = ++c % num;
            }
        }
        nextIndex = [a, b, c];
        return id;
    }
}());

module.exports = function (log) {

    var self = this;

    var players = {};
    var countDownBigTick = 5000;
    var countDownSmallTick = 1000;
    var stopGame = false;
    var amountOfGuesses = 4;
    var questionsPerGame = 12;
    var answerTime = 5000;
    var minScoreForCorrect = 5000;
    var overallLeaderBoard = [];
    // total game time = questions per game * answerTime;
    var currentGame = null;

    var makeNewGame = function () {
        currentGame = {
            availableAnswers: Object.keys(allAnswers),
            questionsAsked: [],
            gameLeaderBoard: [],
            gameAnswers: []
        };
    };

    // core game loop
    var doCountdown = function doCountdown(countdown, deferred) {
        deferred = deferred || q.defer();

        log.log('CountDownTick: ' + countdown);

        if (stopGame) {
            deferred.reject();
            return;
        }

        self.notifyObservers('countdowntick', [countdown]);

        if (countdown > countDownBigTick) {
            setTimeout(function () {
                countdown -= countDownBigTick;
                doCountdown(countdown, deferred)
            }, countDownBigTick);
            return deferred.promise;
        } else if (countdown > 0) {
            setTimeout(function () {
                countdown -= countDownSmallTick;
                doCountdown(countdown, deferred);
            }, countDownSmallTick);
            return deferred.promise;
        } else {
            setTimeout(function () {
                deferred.resolve();
            }, 1);
            return deferred.promise;
        }
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    var calculateScore = function (askedTimestamp, answerTimestamp) {
        var timestampscore = answerTime + (askedTimestamp - answerTimestamp);
        return minScoreForCorrect + Math.max(0, timestampscore);
    };

    var generateLeaderBoard = function () {

        var answerPlayers = {};
        var leaderBoard = [];
        // loop through each question, find all answers for it, see if they are correct and calculate a score
        _.each(currentGame.gameAnswers, function (answer) {
            var question = currentGame.questionsAsked[answer.questionId];
            if (answer.answerId === question.correctIndex) {
                answerPlayers[answer.playerId] = answerPlayers[answer.playerId] || 0;
                answerPlayers[answer.playerId] += calculateScore(question.timeAsked, answer.timeAnswered);
            }
        });

        // generate a leaderboard
        _.each(answerPlayers, function (value, key) {
            if (players[key]) {
                leaderBoard.push({
                    name: players[key].name,
                    score: value,
                    playerId: key
                });
            }
        });

        // sort it
        return _.sortBy(leaderBoard, function (scoreObj) {
            return scoreObj.score;
        }).reverse();
    };

    var updateOverallLeaderBoard = function () {
        overallLeaderBoard = overallLeaderBoard.concat(generateLeaderBoard());
        self.notifyObservers('overallleaderboard', [overallLeaderBoard]);
    };

    var cleanUp = function (autoRestart) {
        return function () {
            updateOverallLeaderBoard();

            self.notifyObservers('gameend', [generateLeaderBoard()]);

            if (autoRestart !== false && !stopGame) {
                self.start(autoRestart, autoRestart);
            }

            stopGame = false;
        }
    };

    var game = function () {
        var deferred = q.defer();
        var generateGuesses = function (answer, correctIndex) {
            var allGuesses = _.uniq(_.map(allAnswers, function (answerObj) {
                return answerObj.name;
            }));

            var getGuess = function getGuess(notAllowed) {
                var randomIndex = getRandomInt(0, allGuesses.length - 1);
                var guess = allGuesses[randomIndex];
                if (guess === notAllowed) {
                    allGuesses.splice(randomIndex, 1);
                    return getGuess(notAllowed);
                }
                // remove used guess from pool
                allGuesses.splice(randomIndex, 1);
                return guess;
            };

            var guesses = [];
            var i = 0;
            for (; i < amountOfGuesses; i += 1) {
                if (i === correctIndex) {
                    guesses.push(answer.name);
                } else {
                    guesses.push(getGuess(answer.name));
                }
            }

            return guesses;
        };

        var getRandomAnswer = function () {
            var randomIndex = getRandomInt(0, currentGame.availableAnswers.length - 1);
            var answerIndex = currentGame.availableAnswers[randomIndex];
            var allAnswersItem = allAnswers[answerIndex];
            var correctIndex = getRandomInt(0, amountOfGuesses - 1);
            var answer = {
                name: allAnswersItem.name,
                image: allAnswersItem.image,
                guesses: generateGuesses(allAnswersItem, correctIndex),
                correctIndex: correctIndex,
                timeAsked: new Date()
            };
            // remove answer from available set
            currentGame.availableAnswers.splice(randomIndex, 0);
            return answer;
        };

        var getQuestions = function () {

        };

        var gameLoop = function () {
            var currentAnswer;
            var questionIndex;

            if (currentGame.questionsAsked.length >= questionsPerGame) {
                // end game
                deferred.resolve(true);
            } else {
                gameQuestions = getQuestions();
                currentAnswer = getRandomAnswer();
                questionIndex = currentGame.questionsAsked.push(currentAnswer) - 1;

                self.notifyObservers('question', [
                    {
                        guesses: currentAnswer.guesses,
                        image: currentAnswer.image,
                        questionIndex: questionIndex
                    }
                ]);

                // return the top 10
                self.notifyObservers('gameleaderboard', [_.first(generateLeaderBoard(), 10)]);

                setTimeout(gameLoop, answerTime);
            }
        };

        makeNewGame();

        // initial answer, then loop
        gameLoop();

        return deferred.promise;
    };

    this.addPlayer = function (player) {
        var playerId = nextId();

        players[playerId] = player;

        return playerId;
    };

    this.addAnswer = function (questionId, playerId, answerId) {
        if (currentGame) {
            currentGame.gameAnswers.push({
                questionId: questionId,
                playerId: playerId,
                answerId: answerId,
                timeAnswered: new Date()
            });
        }
    };

    this.start = function (countdown, autoRestart) {

        // round countdown up to nearest 5000ms
        var roundedCountdown = 5000 * Math.ceil(countdown / 5000);
        // default autorestart to 30000
        var roundedAutoRestart = 30000;
        if (autoRestart === false) {
            roundedAutoRestart = false;
        }

        this.notifyObservers('gamestarting');

        doCountdown(roundedCountdown)
            .then(game, function () {
                // if we're stopped
                return false;
            })
            .then(cleanUp(roundedAutoRestart), function () {
                return true;
            })
            .done();
    };

    this.stop = function () {
        stopGame = true;
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

    this.un = function (event, callback) {
        event = event.toString().toLowerCase();
        var socketIndex;
        if (!observerCallbacks[event]) {
            return;
        }
        socketIndex = observerCallbacks[event].indexOf(callback);
        if (socketIndex !== -1) {
            observerCallbacks[event].splice(socketIndex, 1);
        }
    };

    //call this when you know 'foo' has been changed
    this.notifyObservers = function (event, args) {
        var count = 1;
        event = event.toString().toLowerCase();
        log.log('Notifying ' + event);
        log.log(JSON.stringify(args));
        if (observerCallbacks[event]) {
            log.log('Have listeners');
            _.each(observerCallbacks[event], function (callback) {
                log.log('Calling ' + count++);
                callback.apply(null, args);
            });
        }
    };

};