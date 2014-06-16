module.exports = function () {
    var log = function (logStr) {
        if (console && console.log) {
            console.log(logStr);
        }
    };

    return {
        log: log
    }
};