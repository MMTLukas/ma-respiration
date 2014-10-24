angular.module('respiratoryFrequency').controller('dataCtrl', function ($scope, Accelerometer) {
    $scope.getLatestZ = Accelerometer.getLatestZ;
    $scope.button = Accelerometer.button;
    $scope.buttonText = Accelerometer.buttonText;
})