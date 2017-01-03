/**
 * Created by hongjiayong on 2016/12/31.
 */
app.controller('mycenterCtrl', ['$scope', '$http', 'constService', function ($scope, $http, constService) {
    var server = "http://localhost:8080";
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
    $scope.error='买入';
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


            showProfile();


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
                    // TODO: 要改回localhost
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
                    showProfile();
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
                $http({
                    method: 'POST',
                    url: server + '/up',
                    params:{
                        'id': $scope.user.id,
                        'number': $('#put-in').val()
                    }
                }).then( res=>{
                    console.log(res.data);
                    $scope.user.left_money = Number($scope.user.left_money) + Number($('#put-in').val());
                }).catch( err=>{
                    console.log(err);
                })
            }
        }).modal('show');
    };

    // 转出
    $scope.putOut = function () {
        $('#put-out-modal').modal({
            onApprove: function () {
                console.log($('#put-out').val());
                $http({
                    method: 'POST',
                    url: server + '/out',
                    params:{
                        'id': $scope.user.id,
                        'number': $('#put-out').val()
                    }
                }).then( res=>{
                    console.log(res.data);
                    $scope.user.left_money = Number($scope.user.left_money) - Number($('#put-out').val());
                }).catch( err=>{
                    console.log(err);
                })
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

    var yesterday_data = {
        title: {
            text: '',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: '元 (￥)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '￥'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '昨日动态',
            data: []
        }]
    };


    // 展示数据
    $scope.showData = function (future, index) {
        yesterday_data.title.text = future.future_name;
        yesterday_data.xAxis.categories = [];
        yesterday_data.series[0].data = [];
        $http({
            method: 'GET',
            url: server + '/future/yesterday',
            params:{
                'f_id': future.future_id,
                'u_id': $scope.user.id
            }
        }).then( res=>{
            console.log(res.data);
            yesterday_data.subtitle.text = '涨幅：' + res.data.rate;
            for (let i = 0; i < res.data.yesterdayListView.length; i++){
                yesterday_data.xAxis.categories.push(res.data.yesterdayListView[i].index);
                yesterday_data.series[0].data.push(res.data.yesterdayListView[i].price);
            }

            Highcharts.chart('chart-' + index, yesterday_data);

        }).catch( err=>{
            console.log(err);
        })
    };

    // 加仓
    $scope.buyFuture = function (future) {
        $scope.error = '买入';
        $('#buy-modal').modal({
                closable: false
            }).modal('show');
        $('#future-id').text(future.future_id);
    };

    $scope.submitBuy = function () {
        $.ajax({
            method: 'POST',
            cache: false,
            url: server + '/buy',
            data: JSON.stringify({
                'f_Id': $('#future-id').text(),
                'u_Id': $scope.user.id,
                'number': $('#buy-number').val(),
                'price': $('#buy-baojia').val(),
                'pwd': $('#buy-pwd').val()
            }),
            processData: false,
            contentType: 'application/json'
        }).done( function(res){
            console.log(res);
            $('#buy-modal').modal('hide');

            if (res === 1){
                mdui.snackbar({
                    message: '操作成功！'
                });
                //刷新用户信息
                $http({
                    method: 'POST',
                    url: server + '/user/profile',
                    params:{
                        'id': $scope.userId
                    }
                }).then( res=>{
                    console.log(res.data);
                    $scope.user.my_future = res.data.my_future;
                    $scope.user.left_money = res.data.left_money;
                    $scope.user.amount = res.data.amount;
                }).catch( err=>{
                    console.log(err);
                });

            }else if(res === 2){
                mdui.snackbar({
                    message: '您的余额不足，购买失败了'
                });
                setTimeout(function () {
                    $('#buy-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }else if(res === 3){
                mdui.snackbar({
                    message: '您的报价低于最低价，购买失败了'
                });
                setTimeout(function () {
                    $('#buy-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }else if(res === 4){
                mdui.snackbar({
                    message: '我们的后台挂了，购买失败了'
                });
                setTimeout(function () {
                    $('#buy-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }else if(res === 5){
                mdui.snackbar({
                    message: '您的密码错误，购买失败了'
                });
                setTimeout(function () {
                    $('#buy-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }
        })
    };

    // 减仓
    $scope.sellFuture = function (future) {
        $('#sell-modal').modal({
            closable: false
        }).modal('show');
        $('#future-id').text(future.future_id);
    };

    $scope.submitSell = function () {
        $.ajax({
            method: 'POST',
            cache: false,
            url: server + '/sell',
            data: JSON.stringify({
                'f_Id': $('#future-id').text(),
                'u_Id': $scope.user.id,
                'number': $('#sell-number').val(),
                'price': $('#sell-baojia').val(),
                'pwd': $('#sell-pwd').val()
            }),
            processData: false,
            contentType: 'application/json'
        }).done( function(res){
            console.log(res);
            $('#sell-modal').modal('hide');

            if (res === 1){
                mdui.snackbar({
                    message: '操作成功！'
                });
                //刷新用户信息
                $http({
                    method: 'POST',
                    url: server + '/user/profile',
                    params:{
                        'id': $scope.userId
                    }
                }).then( res=>{
                    console.log(res.data);
                    $scope.user.my_future = res.data.my_future;
                    $scope.user.left_money = res.data.left_money;
                    $scope.user.amount = res.data.amount;
                }).catch( err=>{
                    console.log(err);
                });

            }else if(res === 2){
                mdui.snackbar({
                    message: '您的仓库存储不足，卖出失败了'
                });
                setTimeout(function () {
                    $('#sell-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }else if(res === 3){
                mdui.snackbar({
                    message: '您的报价高于市场价格，卖出失败了'
                });
                setTimeout(function () {
                    $('#sell-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }else if(res === 4){
                mdui.snackbar({
                    message: '我们的后台挂了，卖出失败了'
                });
                setTimeout(function () {
                    $('#sell-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }else if(res === 5){
                mdui.snackbar({
                    message: '您的密码错误，卖出失败了'
                });
                setTimeout(function () {
                    $('#sell-modal').modal({
                        closable: false
                    }).modal('show');
                }, 2000);
            }
        })
    };

    // 取消
    $scope.back = function () {
        $('.ui.modal').modal('hide');
    };

    function showProfile() {
        setTimeout(function () {
            $('#block0').transition('vertical flip');
            setTimeout(function () {
                $('#block1').transition('fly right');
            }, 500);

            setTimeout(function () {
                $('#block2').transition('swing right');
            }, 500);

            setTimeout(function () {
                $('#block3').transition('browse');
            }, 500);

            setTimeout(function () {
                $('#block4').transition('swing left');
            }, 500);

            setTimeout(function () {
                $('#block5').transition('fly left');
            }, 500);
        }, 1000);
    }
}]);