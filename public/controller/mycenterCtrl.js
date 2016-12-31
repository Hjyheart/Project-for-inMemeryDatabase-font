/**
 * Created by hongjiayong on 2016/12/31.
 */
app.controller('mycenterCtrl', ['$scope', '$http', 'constService', function ($scope, $http, constService) {
    $scope.futures = [
        {
            'name': '期货1'
        },
        {
            'name': '期货2'
        }
    ];

    $scope.isLogin = false;
    $scope.method = '登录';
    this.$onInit = function () {

        setTimeout(function(){
            $('.ui.modal').modal({
                closable: false
            }).modal('show');
        }, 0);
    };

    // 登录
    $scope.submitLogin = function () {
        if ($('#user-id').val() === ''){
            $('#id').addClass('error');
            return;
        }
        if ($('#user-pwd').val() === ''){
            $('#pwd').addClass('error');
            return;
        }
        // 登录操作
        // $http({
        //     method: 'POST',
        //     url: '',
        //     params: {
        //         'id': $('#user-id').val(),
        //         'pwd': $('#user-pwd').val()
        //     }
        // }).then( res=>{
        //     console.log(res.data);
        // }).catch ( err=>{
        //     console.log(err)
        // })

    };

    // 转到注册
    $scope.toRegister = function () {
        $scope.method = '注册';
        $('#login-form').transition('vertical flip');
        setTimeout(function () {
            $('#register-form').transition('fly left');
        }, 1000);
    };

    // 返回
    $scope.back = function () {
          window.location.href = '/';
    };

    // 清楚error
    $scope.remove = function (id) {
        $('#' + id).removeClass('error');
    };

    // 转到登录
    $scope.toLogin = function () {
        $scope.method = '登录';
        $('#register-form').transition('vertical flip');
        setTimeout(function () {
            $('#login-form').transition('fly right');
        }, 1000);
    };
}]);