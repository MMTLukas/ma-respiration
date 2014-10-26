angular.module('respiratoryFrequency').controller('menuCtrl', function ($scope, Accelerometer, Diagram) {
  $scope.toggleText = Accelerometer.toggleText;

  $scope.toggle = function(){
    Accelerometer.toggle();
    Diagram.toggle();
  };
});