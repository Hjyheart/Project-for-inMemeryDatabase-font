/**
 * Created by huang on 16-11-29.
 */
var app = angular.module('myApp');

app.service('constService', function () {
    var ServerHost = 'http://192.168.1.24:8080';
    var FrontHost = 'http://localhost:3000';
    var _const = {
        urls: {

        }
    };

    this.urls = function () {
        return _const.urls;
    }

});
