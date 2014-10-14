angular.module('respiratoryFrequency').controller('dataCtrl', function ($scope, Accelerometer) {
  Accelerometer.start();
  $scope.getZ = Accelerometer.getZ;
});