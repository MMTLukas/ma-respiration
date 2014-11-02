angular.module('respiratoryFrequency').controller('CounterController', function ($scope) {
  // set initial value of the frequency-counter by clicking on the Start-Button
  $scope.frequencyCounter = "Atemfrequenz? -> Start";
  $scope.frequencyLastMinute = "";

  // method to display the current frequency on the UI
  setFrequencyCounter = function(value) {
    $scope.frequencyCounter = value;
  };

  // method to display the frequency of the last measurement (duration: 1 minute)
  setFrequencyLastMinute = function(value) {
    $scope.frequencyLastMinute = value;
  };

  return {
    setFrequencyCounter: setFrequencyCounter,
    setFrequencyLastMinute: setFrequencyLastMinute
  };
});