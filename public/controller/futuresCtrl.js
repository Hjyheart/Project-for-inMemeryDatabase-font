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

    // 更改期货
    $scope.switch = function (future, index) {
        $('.mdui-list-item-active').removeClass('mdui-list-item-active');
        $('#' + index).addClass('mdui-list-item-active');
        $scope.future.name = future.name;
    };

    // 买入
    $scope.buyFutures = function () {
        $('#buy-modal').modal({
            closable: false,
        }).modal('show');
    };

    // 确认买入
    $scope.submitBuy = function () {
        // $http({
        //     method: 'POST',
        //     url: '',
        //     params:{
        //         'id': $scope.future.id
        //         'number': $('#buy-number').val(),
        //         'pwd': $('#buy-pwd').val()
        //     }
        // }).then( res=>{
        //     $('#buy-modal').modal('hide');
        // }).catch( err=>{
        //     console.log(err);
        // })
        $('#buy-modal').modal('hide');
        $('#wait-modal').modal({
            closable:false
        }).modal('show');
        setTimeout(function () {
            $('#wait-modal').modal('hide');
            $('#success-modal').modal('show');
            setTimeout(function () {
                $('#success-modal').modal('hide');
            }, 1000);
        }, 2000);
    };

    // 取消支付
    $scope.back = function () {
        $('.ui.modal').modal('hide');
    };

    // 卖出
    $scope.sellFutures = function () {
        $('#sell-modal').modal({
            closable: false,
        }).modal('show');
    };

    // 确认卖出
    $scope.submitSell = function () {
        // $http({
        //     method: 'POST',
        //     url: '',
        //     params:{
        //         'id': $scope.future.id
        //         'number': $('#sell-number').val(),
        //         'pwd': $('#sell-pwd').val()
        //     }
        // }).then( res=>{
        //     $('#sell-modal').modal('hide');
        // }).catch( err=>{
        //     console.log(err);
        // })
        $('#sell-modal').modal('hide');
        $('#wait-modal').modal({
            closable:false
        }).modal('show');
        setTimeout(function () {
            $('#wait-modal').modal('hide');
            $('#success-modal').modal('show');
            setTimeout(function () {
                $('#success-modal').modal('hide');
            }, 1000);
        }, 2000);
    };
}]);