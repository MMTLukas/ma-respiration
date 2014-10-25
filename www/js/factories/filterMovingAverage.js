angular.module('respiratoryFrequency').factory('FilterMovingAverage', function () {
  var windowSize = 20;

  function getWindowSize() {
    return windowSize;
  }

  function calculateMedian(unfilteredValues) {
    var tmpUnfilteredValues = unfilteredValues.slice();

    var sum = tmpUnfilteredValues.reduce(function(a, b) {
      return a + b;
    });

    return sum /= 2;
  }

  return {
    calculateMedian: calculateMedian,
    getWindowSize: getWindowSize
  }
});