angular.module('Screen')
    .service('QuerySvc', [function () {
        'use strict';

        var queryToObject = function () {
            var
                i = 0,
                retObj = {},
                pair = null,
            //get the query string, omitting the "?"
                sPageURL = window.location.search.substring(1),
            //use the ampersand as a separator
                qArr = sPageURL.split('&');

            //each element in qArr is not a key/val pair
            //so we need to turn each one of these pairs
            //into a two-element array
            for (; i < qArr.length; i++) {
                //use the "=" as a separator
                pair = qArr[i].split('=');
                //pair is now a two-element array
                //so the "key" is the first element of that array
                //and the "val" is the second element
                //so now we just add this "pair" to our return object
                retObj[pair[0]] = pair[1];
            }

            //return the new object
            return retObj;
        };

        return {
            getQueryObject: queryToObject
        };
    }]);