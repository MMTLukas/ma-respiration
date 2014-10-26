angular.module('respiratoryFrequency').factory('FilterAverage', function () {
  var windowSize = 20;

  function getWindowSize() {
    return windowSize;
  }

  function calculate(unfilteredValues) {
    var tmpUnfilteredValues = unfilteredValues.slice();

    var sum = tmpUnfilteredValues.reduce(function(a, b) {
      return a + b;
    });

    return sum /= tmpUnfilteredValues.length;
  }

  return {
    calculate: calculate,
    getWindowSize: getWindowSize
  }
});