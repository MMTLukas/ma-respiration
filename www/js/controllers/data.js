angular.module('respiratoryFrequency').controller('dataCtrl', function ($scope, Accelerometer) {
    $scope.getZ = Accelerometer.getZ;
    $scope.start = Accelerometer.start;
    $scope.stop = Accelerometer.stop;
})