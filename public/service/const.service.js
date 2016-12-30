/**
 * Created by huang on 16-11-29.
 */
var app = angular.module('myApp');

app.service('constService', function () {
    var ServerHost = 'http://localhost:8080';
    var FrontHost = 'http://localhost:3000';
    var _const = {
        urls: {

        }
    };

    this.urls = function () {
        return _const.urls;
    }

});
