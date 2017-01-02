/**
 * Created by hongjiayong on 2016/12/31.
 */
app.controller('mycenterCtrl', ['$scope', '$http', 'constService', function ($scope, $http, constService) {
    var server = "http://192.168.1.24:8080";
    $scope.futures = [
        {
            'name': '期货1'
        },
        {
            'name': '期货2'
        }
    ];

    $scope.gender = false;
    $scope.isLogin = false;
    $scope.method = '登录';
    $scope.userId = '';
    $scope.user;
    this.$onInit = function () {

        if ($('#state').text() === 'false'){
            setTimeout(function(){
                $('#login-modal').modal({
                    closable: false
                }).modal('show');
            }, 0);
        }else{
            $scope.isLogin = true;
            $scope.userId = $('#state').text();
            $http({
                method: 'POST',
                url: server + '/user/profile',
                params:{
                    'id': $scope.userId
                }
            }).then( res=>{
                console.log(res.data);
                $scope.user = res.data;
            }).catch( err=>{
                console.log(err);
            });
            // 加载操作
            var data;
            var data1;
            makeChart('chart', data);
            makeChart('chart1', data1);
        }

    };

    // 登出
    $scope.logout = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/logout'
        }).then( res=>{
            console.log(res.data);
            $scope.isLogin = false;
            $('#login-modal').modal({
                closable: false
            }).modal('show');
        })
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
        $http({
            method: 'POST',
            url: server + '/user/login',
            params: {
                'id': $('#user-id').val(),
                'pwd': $('#user-pwd').val()
            }
        }).then( res=>{
            console.log(res.data);
            if (res.data.flag === 'true'){
                $scope.isLogin = true;
                $scope.userId = res.data.id;
                $http({
                    method: 'POST',
                    url: 'http://localhost:3000/login',
                    params:{
                        'id': res.data.id
                    }
                }).then( res=>{
                    console.log(res.data);
                }).catch( err=>{
                    console.log(err);
                });
                $('#login-modal').modal('hide');
                $http({
                    method: 'POST',
                    url: server + '/user/profile',
                    params:{
                        'id': $scope.userId
                    }
                }).then( res=>{
                    console.log(res.data);
                    $scope.user = res.data;
                }).catch( err=>{
                    console.log(err);
                })
            }else{
                $('#pwd').addClass('error');
            }
        }).catch ( err=>{
            console.log(err);
            $('#pwd').addClass('error');
        });

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

    // 进行注册
    $scope.submitRegister = function () {
        if ($('#re-user-id').val() === ''){
            $('#re-id').addClass('error');
            return;
        }
        if ($('#re-user-count').val() === ''){
            $('#re-count').addClass('error');
            return;
        }
        if ($('#re-user-pwd').val() === '' || $('#re-re-user-pwd').val() !== $('#re-user-pwd').val()){
            $('#re-pwd').addClass('error');
            return;
        }
        console.log($('#re-user-pwd').val());
        // 注册
        $http({
            method: 'POST',
            url: server + '/user/add' ,
            params:{
                'name': $('#re-user-id').val(),
                'identify': $('#re-user-count').val(),
                'password': $('#re-user-pwd').val(),
                'sex': $scope.gender,
                'tel': $('#re-user-tel').val()
            }
        }).then( res=>{
            console.log(res.data);
            if (res.data){
                $scope.toLogin();
            }

        }).catch( err=>{
            console.log(err);
        })
    };

    // 充值
    $scope.putIn = function () {
        $('#put-in-modal').modal({
            onApprove: function () {
                console.log($('#put-in').val());
            }
        }).modal('show');
    };

    // 转出
    $scope.putOut = function () {
        $('#put-out-modal').modal({
            onApprove: function () {
                console.log($('#put-out').val());
            }
        }).modal('show');
    };



    // 制作动态图表
    function makeChart(id, data) {
        var chart;
        data = getData();
        nv.addGraph(function() {
            chart = nv.models.lineChart()
                .options({
                    duration: 300,
                    useInteractiveGuideline: true
                })
            ;

            // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
            chart.xAxis
                .axisLabel("时间 (s)")
                .tickFormat(d3.format(',.1f'))
                .staggerLabels(true)
            ;

            chart.yAxis
                .axisLabel('价格 (￥)')
                .tickFormat(function(d) {
                    if (d == null) {
                        return 'N/A';
                    }
                    return d3.format(',.2f')(d);
                })
            ;


            d3.select('#' + id + ' svg')
                .attr('width', $('#' + id).clientWidth - 20)
                .attr('height', 400)
                .datum(data)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    }


    function getData() {
        var rand = [];
        for (var i = 0; i < 100; i++) {
            rand.push({x:i, y: Math.random() / 10});
        }

        return [
            {
                values: rand,
                key: "价格",
                color: "#FF1744"
            }
        ];
    };

    // 性别更换
    $scope.showMale = function () {
        $scope.gender = false;
        $('#female').transition('fade');
        setTimeout(function () {
            $('#male').transition('fade');
        }, 500);
    };

    $scope.showFemale = function () {
        $scope.gender = true;
        $('#male').transition('fade');
        setTimeout(function () {
            $('#female').transition('fade');
        }, 500);
    };

    // 展示数据
    $scope.showData = function () {
        alert('test');
    }
}]);