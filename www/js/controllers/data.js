angular.module('respiratoryFrequency').controller('DataController', function ($scope, Accelerometer, Diagram) {
    // set initial value of the Start-/Stop-Button
    $scope.toggleButtonText = Accelerometer.getToggleButtonText();

    // Bind functions on click events of the Start-/Stop-Button
    this.toggle = function() {
      Accelerometer.toggle();
      Diagram.toggle();
      $scope.toggleButtonText = Accelerometer.getToggleButtonText();
    }
})