/**
 * Created by hongjiayong on 2016/12/31.
 */
app.controller('futuresCtrl', ['$scope', '$http', 'constService', function ($scope, $http, constService) {
    var server = 'http://localhost:8080';
    $scope.dates_data = [{values: []}];
    $scope.prices;
    $scope.isLogin = false;
    $scope.future;
    $scope.futures;
    $scope.current = {
        flag: false,
        price: '--'
    };

    var date_data = {
        title: {
            text: '今日动态',
            x: -20 //center
        },
        subtitle: {
            text: '来源：TimesTen',
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
            name: '实时动态',
            data: []
        }]
    };

    var dates_data = {
        title: {
            text: '长期动态',
            x: -20 //center
        },
        subtitle: {
            text: '来源：TimesTen',
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
            name: '实时动态',
            data: []
        }]
    };

    var chart1;
    var chart2;
    var id;

    this.$onInit = function () {
        if ($('#state').text() !== 'false'){
            $scope.isLogin = true;
        }

        $http({
            method: 'GET',
            url: server + '/future/futureList'
        }).then( res=>{
            console.log(res.data);
            $scope.futures = res.data;
            // 详情
            $http({
                method: 'GET',
                url: server +  '/future',
                params: {
                    'id': res.data[0].future_id
                }
            }).then( res=>{
                console.log(res.data);
                $scope.future = res.data;
                $scope.prices = res.data.packageViewModels;
                for (let i = 0; i < res.data.rateViewModle.length; i++){
                    dates_data.xAxis.categories.push(i);
                    dates_data.series[0].data.push(res.data.rateViewModle[i].close);
                }
                makeChartDates()
                for (let i = 0; i < res.data.packageViewModels.length; i++){
                    date_data.xAxis.categories.push(res.data.packageViewModels[i].index);
                    date_data.series[0].data.push(res.data.packageViewModels[i].price);
                }

                // 请求下一秒
                id = $scope.future.id.toString();
                forNextPrice(id);
                // 刷新图
                refreshChart(id);

            });
        }).catch( err=>{
            console.log(err);
        });

        // 动画
        setTimeout(function () {
            $('#block0').transition('vertical flip');

            setTimeout(function () {
                $('#block1').transition('swing right');
            }, 500);

            setTimeout(function () {
                $('#block2').transition('fly right');
            }, 500);

            setTimeout(function () {
                $('#block3').transition('vertical flip');
            }, 500);

            setTimeout(function () {
                $('#block4').transition('swing right');
            }, 500);

            setTimeout(function () {
                $('#block5').transition('browse');
            }, 500);


        }, 2000);

        function forNextPrice() {
            if (id !== $scope.future.id.toString()){
                return;
            }
            $http({
                method: 'GET',
                url: server + '/future/fresh',
                params:{
                    'id': $scope.future.id
                }
            }).then( res=>{
                date_data.xAxis.categories.push(date_data.xAxis.categories.length + 1);
                date_data.series[0].data.push(res.data.price);
                if (res.data.state === 1){
                    $scope.current.flag = true;
                }else{
                    $scope.current.flag = false;
                }

                $scope.current.price = res.data.price;
                $scope.prices.push({x: date_data.xAxis.categories.length, y:res.data.price});
                $('.price').transition('tada');
            });

            setTimeout(forNextPrice, 1000);
        };

        function refreshChart() {
            if (id !== $scope.future.id.toString()){
                return;
            }
            makeChartDate();

            setTimeout(refreshChart, 10000);
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
        })
    };

    // 更改期货
    $scope.switch = function (future, index) {
        $('.mdui-list-item-active').removeClass('mdui-list-item-active');
        $('#' + index).addClass('mdui-list-item-active');
        date_data.xAxis.categories = [];
        date_data.series[0].data = [];
        // 请求新的期货详情
        $http({
            method: 'GET',
            url: server + '/future',
            params: {
                'id': future.future_id
            }
        }).then( res=>{
            console.log(res.data);
            $scope.future = res.data;
            $scope.prices = res.data.packageViewModels;
            makeChartDates($scope.future.rateViewModle);
            for (let i = 0; i < res.data.packageViewModels.length; i++){
                date_data.xAxis.categories.push(res.data.packageViewModels[i].index);
                date_data.series[0].data.push(res.data.packageViewModels[i].price);
            }

            // 请求下一秒
            id = $scope.future.id;
            forNextPrice(id);
            // 刷新图
            refreshChart(id)
        })
    };

    // 买入
    $scope.buyFutures = function () {
        $('#buy-modal').modal({
            closable: false,
        }).modal('show');
    };

    // 确认买入
    $scope.submitBuy = function () {
        $.ajax({
            method: 'POST',
            cache: false,
            url: server + '/buy',
            data: JSON.stringify({
                'f_Id':$scope.future.id,
                'u_Id': $('#state').text(),
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
        $.ajax({
            method: 'POST',
            cache: false,
            url: server + '/sell',
            data: JSON.stringify({
                'f_Id':$scope.future.id,
                'u_Id': $('#state').text(),
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

    // 图表1绘制
    function makeChartDates() {
        Highcharts.chart('chart1', dates_data);
    }

    // 图表2绘制
    function makeChartDate() {
       Highcharts.chart('chart3', date_data);
    }

    $scope.showChart = function () {
        $('#chart2-container-modal').modal('show');
    }

}]);