var app = angular.module('stockStatusModule', []);

app.controller('updateController', function ($scope, socket) {
    $scope.status = 'AngularJS successfully loaded.';
    $scope.stocks = [
        { name: "Apple", price: 4.50 },
        { name: "Microsoft", price: 4.00 },
        { name: "Facebook", price: 3.75 }
    ];

    $scope.start = function () {
        socket.emit('start');
    };

    $scope.stop = function () {
        socket.emit('stop');
    };

    $scope.buy = function (element) {
        socket.emit('buy', element.name);
    };

    socket.on('status', function (data) {
        $scope.status = data.message;
    });

    socket.on('update', function (data) {
        $scope.stocks = data.stocks;
    });
        
});

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
