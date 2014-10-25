angular.module('respiratoryFrequency').controller('DataController', function ($scope, Accelerometer) {
    // set initial value of the Start-/Stop-Button
    $scope.startStopButtonText = "Start";
    this.getLatestZ = Accelerometer.getLatestZ;

    // Bind functions on click events of the Start-/Stop-Button
    this.button = function() {
      Accelerometer.button();
      $scope.startStopButtonText = Accelerometer.getButtonText();
    }
})