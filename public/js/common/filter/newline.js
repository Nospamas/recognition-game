angular.module('Common')
    .filter('newline', function () {
        return function (text) {
            return text.replace(/:/g, ':<br/>');
        }
    });