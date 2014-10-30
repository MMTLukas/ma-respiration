angular.module('respiratoryFrequency').controller('CounterController', function ($scope) {
  // set initial value of the Start-/Stop-Button
  $scope.frequencyCounter = "Atemfrequenz? -> klick Start";

  setFrequencyCounter = function(value) {
    $scope.frequencyCounter = value;
  };

  return {
    setFrequencyCounter: setFrequencyCounter
  };
});