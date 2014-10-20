angular.module('respiratoryFrequency').controller('dataCtrl', function ($scope, Accelerometer) {
    $scope.getZ = Accelerometer.getZ;
    $scope.button = Accelerometer.button;
    $scope.buttonText = Accelerometer.buttonText;
})