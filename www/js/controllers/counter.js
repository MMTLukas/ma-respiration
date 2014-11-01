angular.module('respiratoryFrequency').controller('CounterController', function ($scope) {
  // set initial value of the Start-/Stop-Button
  $scope.frequencyCounter = "Atemfrequenz? -> Start";
  $scope.frequencyLastMinute = "";

  setFrequencyCounter = function(value) {
    $scope.frequencyCounter = value;
  };

  setFrequencyLastMinute = function(value) {
    $scope.frequencyLastMinute = value;
  };

  return {
    setFrequencyCounter: setFrequencyCounter,
    setFrequencyLastMinute: setFrequencyLastMinute
  };
});