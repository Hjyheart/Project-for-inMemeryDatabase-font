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

        if ($('#state').text() === 'false'){
            setTimeout(function(){
                $('#login-modal').modal({
                    closable: false
                }).modal('show');
            }, 0);
        }else{
            $scope.isLogin = true;
            // 加载操作
            var data;
            var data1;
            makeChart('chart', data);
            makeChart('chart1', data1);
        }

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
        //     $http({
        //         method: 'POST',
        //         url: 'http://localhost:3000/login',
        //         params:{
        //             'id': $('#user-id').val()
        //         }
        //     }).then( res=>{
        //         console.log(res.data);
        //     }).catch( err=>{
        //         console.log(err);
        //     })
        // }).catch ( err=>{
        //     console.log(err)
        // })

        $http({
            method: 'POST',
            url: 'http://localhost:3000/login',
            params:{
                'id': $('#user-id').val()
            }
        }).then( res=>{
            console.log(res.data);
            window.location.href = '/mycenter';
        }).catch( err=>{
            console.log(err);
        })

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

        // 注册
        // $http({
        //     method: 'POST',
        //     url: '',
        //     params:{
        //         'id': $('#re-user-id').val(),
        //         'count-id': $('#re-user-count').val(),
        //         'pwd': $('#re-user-pwd').val()
        //     }
        // }).then( res=>{
        //     console.log(res.data);
        // }).catch( err=>{
        //     console.log(err);
        // })
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

}]);