/**
 * Created by hongjiayong on 2016/12/31.
 */
app.controller('futuresCtrl', ['$scope', '$http', 'constService', function ($scope, $http, constService) {
    $scope.future = {
        'name': null
    };

    $scope.futures = [
        {
            'name': '期货1'
        },
        {
            'name': '期货2'
        }
    ];


    this.$onInit = function () {
        $scope.future.name = '期货1';

    };

    $scope.switch = function (future, index) {
        $('.mdui-list-item-active').removeClass('mdui-list-item-active');
        $('#' + index).addClass('mdui-list-item-active');
        $scope.future.name = future.name;
    };
}]);