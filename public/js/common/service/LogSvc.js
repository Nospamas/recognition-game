angular.module('Common', []);
angular.module('Common').service('LogSvc',
    [function () {
        var log = function (logStr) {
            if (console && console.log) {
                console.log(logStr);
            }
        };

        return {
            log: log
        }
    }]);