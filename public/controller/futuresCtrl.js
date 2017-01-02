/**
 * Created by hongjiayong on 2016/12/31.
 */
app.controller('futuresCtrl', ['$scope', '$http', 'constService', function ($scope, $http, constService) {
    var server = 'http://192.168.1.24:8080';
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
            url: 'http://localhost:3000/futruelist'
        }).then( res=>{
            console.log(res.data);
            $scope.futures = res.data;
            // 详情
            $http({
                method: 'GET',
                url: server +  '/future',
                params: {
                    'id': res.data[0].id
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

        function forNextPrice() {
            if (id !== $scope.future.id.toString()){
                return;
            }
            $http({
                method: 'GET',
                url: 'http://localhost:3000/future/fresh',
                params:{
                    'id': $scope.future.id,
                    'length': date_data.xAxis.categories.length
                }
            }).then( res=>{
                date_data.xAxis.categories.push(res.data.x);
                date_data.series[0].data.push(res.data.y);
                $scope.current.flag = res.data.flag;
                $scope.current.price = res.data.y;
                $scope.prices.push({x: res.data.x, y:res.data.y});
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
                'id': future.id
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